const os = require('os');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Get the host information (username@ip or alias)
 * @param {string|null} alias - Optional alias to override default username@ip
 * @returns {string} Host information string
 */
function getHostInfo(alias) {
  // Check for alias from parameter or environment variable
  const effectiveAlias = alias || process.env.VSOPEN_ALIAS;
  if (effectiveAlias) {
    return effectiveAlias;
  }

  // Get username
  const username = os.userInfo().username;

  // Get IP address based on platform
  const ip = getIpAddress();

  return `${username}@${ip}`;
}

/**
 * Get IP address based on platform
 * @returns {string} IP address or hostname
 */
function getIpAddress() {
  const platform = os.platform();

  try {
    if (platform === 'darwin') {
      // macOS: try en0, then en1, then hostname
      try {
        const ip = execSync('ipconfig getifaddr en0', { encoding: 'utf8' }).trim();
        if (ip) return ip;
      } catch (e) {
        // en0 failed, try en1
      }

      try {
        const ip = execSync('ipconfig getifaddr en1', { encoding: 'utf8' }).trim();
        if (ip) return ip;
      } catch (e) {
        // en1 failed, fall through to hostname
      }
    } else if (platform === 'linux') {
      // Linux: use hostname -I
      const ip = execSync("hostname -I | awk '{print $1}'", { encoding: 'utf8' }).trim();
      if (ip) return ip;
    } else if (platform === 'win32') {
      // Windows: warn and use hostname
      console.warn('Warning: IP detection may not work on Windows, using hostname');
    }
  } catch (e) {
    // IP detection failed, fall through to hostname
  }

  // Fallback to hostname
  return os.hostname();
}

/**
 * Generate VS Code remote SSH URL
 * @param {string} filePath - File path to open
 * @param {string|null} alias - Optional alias for host
 * @returns {string} VS Code URL
 */
function generateVsCodeUrl(filePath, alias = null) {
  // Resolve to absolute path
  const absolutePath = path.resolve(filePath);

  // Check if file exists
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }

  // Get host info
  const hostInfo = getHostInfo(alias);

  // Generate VS Code URL
  const url = `vscode://vscode-remote/ssh-remote+${hostInfo}${absolutePath}`;

  return url;
}

module.exports = {
  getHostInfo,
  getIpAddress,
  generateVsCodeUrl
};
