import {MarkdownView, Notice, Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, GenerateTldrSettings, GenerateTldrSettingTab} from "./settings";
import {generateTldr, testApiKey} from "./gemini";

export default class GenerateTldrPlugin extends Plugin {
	settings: GenerateTldrSettings;

	async onload() {
		await this.loadSettings();

		// Add the Generate TLDR command
		this.addCommand({
			id: 'generate-tldr',
			name: 'Generate TLDR',
			checkCallback: (checking: boolean) => {
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					if (!checking) {
						this.handleGenerateTldr();
					}
					return true;
				}
				return false;
			}
		});

		// Add settings tab
		this.addSettingTab(new GenerateTldrSettingTab(this.app, this));
	}

	onunload() {
	}

	async loadSettings() {
		const loadedData = await this.loadData() as any;
		this.settings = Object.assign({}, DEFAULT_SETTINGS, loadedData);
		
		// Migration: If user has "Short" saved or invalid value, migrate to "Medium"
		if (this.settings.tldrLength === "Short" || !["Medium", "Long"].includes(this.settings.tldrLength)) {
			this.settings.tldrLength = "Medium";
			await this.saveSettings();
		}
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async testApiKey(): Promise<boolean> {
		return await testApiKey(this.settings.geminiApiKey);
	}

	async handleGenerateTldr() {
		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!markdownView) {
			new Notice("Please open a markdown note first");
			return;
		}

		// Check if API key is set
		if (!this.settings.geminiApiKey || this.settings.geminiApiKey.trim() === "") {
			new Notice("Please set your Gemini API key in settings first");
			return;
		}

		const editor = markdownView.editor;
		const content = editor.getValue();

		// Check if note is empty
		if (!content || content.trim().length === 0) {
			new Notice("Note is empty. Please add some content first.");
			return;
		}

		// Show loading notice
		new Notice("Generating TLDR...");

		try {
			// Generate TLDR
			const tldrBullets = await generateTldr(
				content,
				this.settings.geminiApiKey,
				this.settings.tldrLength
			);

			// Format the TLDR according to the required format
			// Each bullet point line needs to be prefixed with "> "
			const bulletLines = tldrBullets.split('\n').filter(line => line.trim().length > 0);
			const formattedBullets = bulletLines.map(line => `> ${line}`).join('\n');
			const tldrBlock = `> [!summary] TL;DR\n${formattedBullets}\n\n---\n\n`;

			// Get current cursor position
			const cursor = editor.getCursor();
			
			// Insert at the very top of the note
			editor.setCursor(0, 0);
			editor.replaceRange(tldrBlock, editor.getCursor());
			
			// Restore cursor position (adjusted for the inserted content)
			const linesInserted = tldrBlock.split('\n').length;
			editor.setCursor({
				line: cursor.line + linesInserted,
				ch: cursor.ch
			});

			new Notice("✓ TLDR generated successfully");
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			new Notice(`Error generating TLDR: ${errorMessage}`);
			console.error("TLDR generation error:", error);
		}
	}
}
