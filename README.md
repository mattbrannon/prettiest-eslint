# Prettiest ESLint

A VS Code extension for opinionated developers.

Prettier is an **opinionated code formatter** with a handful of configuration options. ESLint, while typically not thought of as a code formatting tool, has a wide range of style rules that can be used for more fine-grained control over your code's appearance than what Prettier allows.

Prettiest ESLint combines the two tools to provide a more flexible and powerful code formatting experience. First Prettier formats your code followed by ESLint in "fix" mode on the Prettier-formatted code. This allows you to use Prettier's formatting rules as a base, then layer on additional rules and customizations with ESLint.

Any files that are not supported by ESLint will be formatted by Prettier only.

## Table of Contents

- [Quick Start](#quick-start)
- [Requirements](#requirements)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)
- [License](#license)

## Quick Start

1. Install Prettier and ESLint in your project:
   ```bash
   npm install --save-dev prettier eslint
   ```
2. Install the Prettiest ESLint extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=mattbrannon.prettiest-eslint).
3. Add the following to your `.vscode/settings.json`:
   ```json
   {
     "editor.defaultFormatter": "mattbrannon.prettiest-eslint",
     "editor.formatOnSave": true,
     "files.autoSave": "onFocusChange" // Optional but recommended
   }
   ```
4. Save a file, and your code will be formatted automatically with Prettiest ESLint!

## Requirements

- VS Code 1.91.0 or higher
- Node.js installed
- Prettier installed in your project
- ESLint installed in your project
- Any plugins or parsers defined in your ESLint config installed in your project

## Contributing

Contributions are welcome! Please [open an issue](https://github.com/mattbrannon/prettiest-eslint/issues) to discuss any significant changes.

## Acknowledgements

This extension is inspired by:

- [Prettier ESLint](https://github.com/prettier/prettier-eslint)
- [VS Code Prettier ESLint](https://github.com/idahogurl/vs-code-prettier-eslint)

## License

This project is licensed under the [MIT License](./LICENSE).
