import { TldrLength } from "./settings";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
// Using gemini-2.5-flash - the latest balanced model with 1M token context window
// Alternative: gemini-2.5-flash-lite (faster, more cost-efficient) or gemini-2.5-pro (more powerful)
const MODEL_NAME = "gemini-2.5-flash";

export interface GeminiResponse {
	candidates: Array<{
		content: {
			parts: Array<{
				text: string;
			}>;
		};
	}>;
	error?: {
		message: string;
		code: number;
	};
}

/**
 * Generate a TLDR summary using Gemini API
 */
export async function generateTldr(
	content: string,
	apiKey: string,
	length: TldrLength
): Promise<string> {
	if (!apiKey) {
		throw new Error("API key is required");
	}

	if (!content || content.trim().length === 0) {
		throw new Error("Note content is empty");
	}

	// Build the prompt based on length
	const lengthInstructions: Record<TldrLength, string> = {
		Medium: "Create an explanatory TLDR with exactly 4-5 bullet points. Each bullet must be a complete sentence that clearly explains a key point or main idea. The summary should give a good overview of what the content covers with moderate detail.",
		Long: "Create a comprehensive and detailed TLDR with exactly 8-10 bullet points. Each bullet must be a complete sentence that clearly explains a key point, main idea, or important detail. The summary should thoroughly explain what the content is about with comprehensive coverage of all major points."
	};

	const prompt = `You are a helpful assistant that creates clear, explanatory TLDR summaries of notes.

Your task is to create a summary that helps someone understand what the content is about. 

CRITICAL REQUIREMENTS:
- Each bullet point MUST be a complete, full sentence (not cut off or incomplete)
- Each bullet should clearly explain what the content is about
- The summary should tell the reader the main topic and key points
- Use clear, understandable language
- Make sure each bullet makes sense on its own

${lengthInstructions[length]}

Example format (adjust number of bullets based on length setting):
- First complete sentence explaining a key point
- Second complete sentence explaining a key point
- Third complete sentence explaining a key point
- (Continue for Medium: 4-5 total, Long: 8-10 total)

LENGTH REQUIREMENTS:
- Medium: Exactly 4-5 bullet points (moderate detail)
- Long: Exactly 8-10 bullet points (comprehensive coverage)

IMPORTANT: Each bullet point must be a complete sentence. Do NOT cut off mid-sentence. Do NOT include any other text, explanations, or formatting. Only return the bullet points starting with hyphens.

Here is the note content to summarize:

${content}`;

	const url = `${GEMINI_API_BASE}/models/${MODEL_NAME}:generateContent`;

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-goog-api-key": apiKey,
		},
		body: JSON.stringify({
			contents: [
				{
					parts: [
						{
							text: prompt
						}
					]
				}
			],
			generationConfig: {
				temperature: 0.3, // Lower temperature for more focused, coherent summaries
				topK: 40,
				topP: 0.95,
				maxOutputTokens: length === "Medium" ? 1000 : 2000, // Medium (4-5 sentences), Long (8-10 sentences)
				stopSequences: [] // Don't stop early - let it complete all bullets
			}
		})
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(
			errorData.error?.message || 
			`API request failed with status ${response.status}: ${response.statusText}`
		);
	}

	const data: GeminiResponse = await response.json();

	if (data.error) {
		throw new Error(data.error.message || "Unknown API error");
	}

	if (!data.candidates || data.candidates.length === 0) {
		throw new Error("No response from API");
	}

	const text = data.candidates[0]?.content?.parts?.[0]?.text;
	if (!text) {
		throw new Error("Empty response from API");
	}

	// Clean up the response - extract just the bullet points
	// Remove any leading/trailing whitespace and ensure proper formatting
	let cleanedText = text.trim();
	
	// Ensure each line starts with - if it's a bullet point
	const lines = cleanedText.split("\n");
	const bulletPoints = lines
		.map(line => line.trim())
		.filter(line => line.length > 0)
		.map(line => {
			// If line doesn't start with -, add it
			if (!line.startsWith("-")) {
				// Remove any existing bullet markers and add -
				line = line.replace(/^[•\*\-]\s*/, "");
				return `- ${line}`;
			}
			return line;
		})
		// Ensure sentences are complete (end with punctuation)
		.map(line => {
			// Remove the "- " prefix to check the sentence
			const sentence = line.replace(/^-\s*/, "");
			// If sentence doesn't end with punctuation, it might be incomplete
			// But don't modify it - let the model handle it, just log if needed
			if (sentence.length > 0 && !/[.!?]$/.test(sentence.trim())) {
				console.warn("TLDR: Sentence may be incomplete:", sentence);
			}
			return line;
		});

	return bulletPoints.join("\n");
}

/**
 * Test if the API key is valid
 */
export async function testApiKey(apiKey: string): Promise<boolean> {
	if (!apiKey) {
		return false;
	}

	try {
		const url = `${GEMINI_API_BASE}/models/${MODEL_NAME}:generateContent`;

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-goog-api-key": apiKey,
			},
			body: JSON.stringify({
				contents: [
					{
						parts: [
							{
								text: "Say 'test' if you can read this."
							}
						]
					}
				],
				generationConfig: {
					maxOutputTokens: 10
				}
			})
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			console.error("API test error:", errorData);
			return false;
		}

		const data = await response.json();
		return !!(data.candidates && data.candidates.length > 0);
	} catch (error) {
		console.error("API test exception:", error);
		return false;
	}
}
