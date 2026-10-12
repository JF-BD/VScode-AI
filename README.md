# VSCode AI

**An AI-powered coding assistant for Visual Studio Code.**

An AI Assistant helps developers write, understand, debug, and improve code directly inside VS Code using configurable AI models and provider APIs.

## Features

- **AI Chat** — Ask coding questions and discuss your project.
- **Code Generation** — Generate code from natural-language instructions.
- **Code Explanation** — Understand functions, classes, and complex logic.
- **Bug Detection** — Identify potential errors and suggest fixes.
- **Code Refactoring** — Improve readability and maintainability.
- **Custom AI Models** — Configure supported AI providers using API keys.
- **Project Context** — Work with selected files and relevant project code.
- **Privacy Controls** — Control which code and files are shared with AI providers.

> Features listed above are planned capabilities. Update this section to reflect what the extension actually implements.

## Requirements

- Visual Studio Code
- An API key for a supported AI provider, if required
- Internet access for cloud-based AI models

## Installation

### Development Installation

1. Clone or download this repository.
2. Open the project folder in VS Code.
3. Install the project dependencies.
4. Press `F5` to launch the Extension Development Host.
5. Test the extension in the new VS Code window.

## Configuration

Configure the extension through VS Code Settings.

Under development

*These are example setting names. They must match the extension's actual configuration implementation.*

## Usage

1. Open a project in VS Code.
2. Open VSCode AI from the Activity Bar or Command Palette.
3. Select an AI provider and model.
4. Enter a question or coding instruction.
5. Review the generated response before applying code changes.

## Security and Privacy

- Never commit API keys, tokens, passwords, or other secrets to Git.
- Do not transmit project files without appropriate user consent.
- Exclude sensitive files and directories from AI context.
- Validate AI-generated code before running or committing it.
- Store credentials using an appropriate secure mechanism.

## Development

Install dependencies:

```powershell
npm install
```

Compile the extension:

```powershell
npm run compile
```

Run tests:

```powershell
npm test
```

*These commands assume the corresponding scripts exist in `package.json`.*



Adjust this structure to match the actual repository.

## Roadmap

- [ ] Basic AI chat integration
- [ ] Multiple AI provider support
- [ ] Custom model configuration
- [ ] Project-aware context management
- [ ] Code generation and explanation
- [ ] Bug analysis and fixing assistance
- [ ] Secure credential management
- [ ] Automated tests and release packaging

## Contributing

Contributions, bug reports, and feature suggestions are welcome. Please open an issue before making significant architectural changes.

## License

Will be inserted after development.

---

**Project:** VSCode AI 
**Platform:** Visual Studio Code  
**Status:** Under Development
