# vsopen

Generate and open VS Code remote SSH URLs for local files.

## Installation

Install globally via npm:

```bash
npm install -g vsopen
```

Or use directly with npx (no installation required):

```bash
npx vsopen <file>
```

## Usage

```bash
vsopen <file>
vsopen --alias <alias> <file>
vsopen -a <alias> <file>
```

### Environment Variable

You can also set a default alias via environment variable:

```bash
export VSOPEN_ALIAS=mini
vsopen <file>
```

## Options

- `-a, --alias <alias>` - Override username@ip with custom alias
- `-h, --help` - Display help message
- `-V, --version` - Display version

## Examples

### Basic Usage

```bash
$ vsopen ./test.js
点击下方链接跳转打开本地 VS Code:
vscode://vscode-remote/ssh-remote+ppsteven@192.168.1.100/Users/ppsteven/projects/test.js:1
```

Opens VS Code automatically at line 1.

### With Alias Flag

```bash
$ vsopen --alias mini ./test.js
点击下方链接跳转打开本地 VS Code:
vscode://vscode-remote/ssh-remote+mini/Users/ppsteven/projects/test.js:1
```

### With Environment Variable

```bash
$ export VSOPEN_ALIAS=mini
$ vsopen ./test.js
点击下方链接跳转打开本地 VS Code:
vscode://vscode-remote/ssh-remote+mini/Users/ppsteven/projects/test.js:1
```

### Absolute Paths

Both relative and absolute paths work:

```bash
$ vsopen /absolute/path/to/file.txt
$ vsopen ./relative/path/file.txt
$ vsopen ../parent/file.txt
```

All paths are automatically resolved to absolute paths.

## Platform Support

- **macOS**: Full support with automatic IP detection (en0 → en1 → hostname)
- **Linux**: Full support with automatic IP detection via `hostname -I`
- **Windows**: Basic support (uses hostname instead of IP)

## How It Works

1. Resolves the file path to an absolute path
2. Detects your username and IP address (or uses provided alias)
3. Determines if the path is a file or directory
4. Generates a VS Code remote SSH URL: `vscode://vscode-remote/ssh-remote+{host}{path}`
5. For files, appends `:1` to open at the first line
6. Prints the URL to stdout
7. Automatically opens the URL in VS Code

## Requirements

- Node.js >= 14
- VS Code installed with Remote-SSH extension

## Error Handling

- **File not found**: Shows clear error message with the path
- **Missing file argument**: Displays help message
- **Failed to open VS Code**: Prints URL for manual copying
- **IP detection failure**: Gracefully falls back to hostname

## License

MIT

## Author

Created as a Node.js port of the shell `vlink` function.
