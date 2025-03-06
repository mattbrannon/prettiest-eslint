# Change Log

## Release Notes

### 0.0.2

- Fixed a bug where the extension would hang when auto formatting on save was enabled and the window was not an active text editor (e.g. User Settings, Keybindings, etc.)
- Fixed a bug where the extension would hang if the current document was not part of the active workspace
- Added additional logging to help diagnose issues

### 0.0.1

Initial release:

- Formatting functionality using Prettier followed by ESLint
- Support for both modern and legacy ESLint configs
- Automatic config file detection and loading
