import {App, PluginSettingTab, Setting, Notice} from "obsidian";
import GenerateTldrPlugin from "./main";

export type TldrLength = "Medium" | "Long";

export interface GenerateTldrSettings {
	geminiApiKey: string;
	tldrLength: TldrLength;
}

export const DEFAULT_SETTINGS: GenerateTldrSettings = {
	geminiApiKey: "",
	tldrLength: "Medium"
}

export class GenerateTldrSettingTab extends PluginSettingTab {
	plugin: GenerateTldrPlugin;

	constructor(app: App, plugin: GenerateTldrPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl("h2", {text: "Generate TLDR Settings"});

		new Setting(containerEl)
			.setName("Gemini API Key")
			.setDesc("Your Google Gemini API key. Get one at https://aistudio.google.com/apikey")
			.addText(text => {
				text.setPlaceholder("Enter your API key")
					.setValue(this.plugin.settings.geminiApiKey)
					.inputEl.type = "password";
				text.onChange(async (value) => {
					this.plugin.settings.geminiApiKey = value;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("TLDR Length")
			.setDesc("Choose the length of the generated TLDR summary")
			.addDropdown(dropdown => dropdown
				.addOption("Medium", "Medium")
				.addOption("Long", "Long")
				.setValue(this.plugin.settings.tldrLength)
				.onChange(async (value: TldrLength) => {
					this.plugin.settings.tldrLength = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName("Test API Key")
			.setDesc("Test if your API key is valid")
			.addButton(button => button
				.setButtonText("Test")
				.setCta()
				.onClick(async () => {
					if (!this.plugin.settings.geminiApiKey) {
						new Notice("Please enter an API key first");
						return;
					}
					
					button.setButtonText("Testing...");
					button.setDisabled(true);
					
					try {
						const isValid = await this.plugin.testApiKey();
						if (isValid) {
							new Notice("✓ API key is valid");
						} else {
							new Notice("✗ API key is invalid or there was an error");
						}
					} catch (error) {
						new Notice("✗ Error testing API key: " + (error instanceof Error ? error.message : String(error)));
					} finally {
						button.setButtonText("Test");
						button.setDisabled(false);
					}
				}));
	}
}
