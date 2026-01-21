# Generate TLDR

Generate concise and explanatory TLDR summaries of your notes using Google's Gemini 2.5 Flash model. This plugin automatically creates well-formatted summaries that help you quickly understand what your notes are about.

## Features

- **AI-Powered Summaries**: Uses Google's Gemini 2.5 Flash model to generate intelligent, contextual summaries
- **Multiple Length Options**: Choose between Medium (4-5 bullet points) or Long (8-10 bullet points) summaries
- **Native Obsidian Format**: Automatically inserts summaries in Obsidian's callout format at the top of your notes
- **Clean Integration**: Summaries are formatted as `> [!summary] TL;DR` callouts with proper markdown formatting
- **Settings Tab**: Easy configuration with API key management and test functionality
- **Error Handling**: Graceful error messages and validation for better user experience

## Installation

### Via BRAT (Beta Reviewers Auto-update Tester)

BRAT is the recommended way to install and keep this plugin updated.

1. **Install BRAT Plugin** (if not already installed):
   - Open Obsidian Settings
   - Go to **Community plugins**
   - Click **Browse** and search for "BRAT"
   - Install and enable the BRAT plugin

2. **Add This Plugin via BRAT**:
   - Open Obsidian Settings
   - Go to **Community plugins** → **BRAT**
   - Click **Add Beta Plugin**
   - Enter this repository URL:
     ```
     https://github.com/YOUR_USERNAME/obsidian-plugin-generate-tldr
     ```
     *(Replace `YOUR_USERNAME` with the actual GitHub username/organization)*
   - Click **Add Plugin**
   - The plugin will appear in your Community plugins list
   - Enable it from **Settings → Community plugins**

3. **Auto-Updates**: BRAT will automatically check for updates. You can manually update by going to **BRAT → Update all beta plugins**.

### Manual Installation

1. Download the latest release from the [Releases page](https://github.com/YOUR_USERNAME/obsidian-plugin-generate-tldr/releases)
2. Extract the files (`main.js`, `manifest.json`, and `styles.css` if present)
3. Copy them to your vault's `.obsidian/plugins/generate-tldr/` folder
4. Reload Obsidian
5. Enable the plugin in **Settings → Community plugins**

## Configuration

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy your API key

### Plugin Settings

1. Open Obsidian Settings
2. Go to **Generate TLDR** (under **Community plugins**)
3. **Gemini API Key**: Paste your API key (stored securely as password)
4. **TLDR Length**: Choose between:
   - **Medium**: 4-5 bullet points (moderate detail)
   - **Long**: 8-10 bullet points (comprehensive coverage)
5. **Test API Key**: Click to verify your API key is working correctly

## Usage

### Generate TLDR Summary

1. Open any markdown note in Obsidian
2. Open the Command Palette (`Ctrl+P` / `Cmd+P`)
3. Run the command **"Generate TLDR"**
4. The plugin will:
   - Read the full content of your note
   - Send it to Gemini API for summarization
   - Insert a formatted TLDR summary at the very top of your note

### TLDR Format

The generated summary follows this format:

```markdown
> [!summary] TL;DR
> - First key point explained clearly
> - Second key point explained clearly
> - Third key point explained clearly
> - (Additional points based on length setting)

---
(original note content continues)
```

### Example

**Before:**
```markdown
# My Long Article
[Your article content here...]
```

**After running "Generate TLDR":**
```markdown
> [!summary] TL;DR
> - The article discusses the implementation of AI-driven Extended Reality systems
> - It covers evaluation methods for XR applications in various domains
> - The research focuses on user experience and system performance metrics
> - Key findings suggest significant improvements in interaction design

---
# My Long Article
[Your article content here...]
```

## Requirements

- **Obsidian**: Version 0.15.0 or higher
- **Gemini API Key**: Free API key from Google AI Studio
- **Internet Connection**: Required for API calls to Gemini

## Privacy & Security

- **API Key Storage**: Your API key is stored locally in your vault's settings
- **Data Transmission**: Note content is sent to Google's Gemini API for processing
- **No Data Collection**: This plugin does not collect or store any personal data
- **Offline Operation**: The plugin itself runs locally; only API calls require internet

## Troubleshooting

### "API key is invalid" Error

- Verify your API key is correct in settings
- Use the "Test API Key" button to validate
- Ensure your API key has access to Gemini models
- Check that you're using the correct API key format

### "Note is empty" Error

- Make sure your note has content before generating a TLDR
- The plugin requires at least some text to summarize

### Summary Not Appearing

- Check that the note is a markdown file (`.md`)
- Ensure you have write permissions for the note
- Check the console (Help → Toggle Developer Console) for error messages

### Incomplete Summaries

- Try switching to "Long" length for more comprehensive summaries
- Ensure your note has sufficient content to summarize
- Check your internet connection

## Development

### Building from Source

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build for production:
   ```bash
   npm run build
   ```
4. Build in watch mode (development):
   ```bash
   npm run dev
   ```

### Project Structure

```
obsidian-plugin-generate-tldr/
├── src/
│   ├── main.ts          # Plugin entry point
│   ├── settings.ts      # Settings interface and UI
│   └── gemini.ts        # Gemini API integration
├── manifest.json        # Plugin manifest
├── package.json         # Dependencies
└── README.md           # This file
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Check existing issues for solutions

## Acknowledgments

- Built with [Obsidian Plugin API](https://docs.obsidian.md)
- Powered by [Google Gemini API](https://ai.google.dev)
- Inspired by the need for quick note summaries

---

**Note**: This plugin requires an active internet connection and a valid Gemini API key to function. API usage may be subject to Google's terms of service and rate limits.
