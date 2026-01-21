# Files to Include in GitHub Repository

## ✅ Files to INCLUDE (Source Code & Configuration)

### Source Code
- `src/` - All TypeScript source files
  - `src/main.ts`
  - `src/settings.ts`
  - `src/gemini.ts`

### Configuration Files
- `package.json` - Dependencies and scripts
- `package-lock.json` - Lock file for consistent installs
- `tsconfig.json` - TypeScript configuration
- `esbuild.config.mjs` - Build configuration
- `eslint.config.mts` - Linting configuration
- `version-bump.mjs` - Version bumping script
- `.editorconfig` - Editor configuration
- `.npmrc` - npm configuration

### Manifest & Versioning
- `manifest.json` - Plugin manifest (required)
- `versions.json` - Version compatibility mapping

### Documentation
- `README.md` - Main documentation
- `LICENSE` - License file
- `AGENTS.md` - Agent rules (if applicable)

### Styles (if exists)
- `styles.css` - Plugin styles (if you have custom styles)

## ❌ Files to EXCLUDE (Already in .gitignore)

### Build Artifacts
- `main.js` - Compiled output (upload to releases instead)
- `*.map` - Source maps
- `dist/` - Build directory
- `build/` - Build directory

### Dependencies
- `node_modules/` - npm dependencies

### IDE & Editor Files
- `.vscode/` - VS Code settings
- `.idea/` - IntelliJ IDEA settings
- `*.iml` - IntelliJ module files
- Other editor temp files

### OS Files
- `.DS_Store` - macOS
- `Thumbs.db` - Windows
- Other OS-specific files

### Logs & Temporary
- `*.log` - Log files
- `*.tmp` - Temporary files
- `.cache/` - Cache directories

### Plugin Data
- `data.json` - User settings (should not be committed)

## 📦 What Gets Uploaded to GitHub Releases

When creating a release, upload these files:
- `main.js` - Compiled plugin
- `manifest.json` - Plugin manifest
- `styles.css` - Styles (if exists)

These are the files users need to install the plugin manually.
