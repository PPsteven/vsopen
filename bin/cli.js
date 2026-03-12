#!/usr/bin/env node

const { Command } = require('commander');
const { generateVsCodeUrl } = require('../src/index');
const { version } = require('../package.json');

const program = new Command();

program
  .name('vsopen')
  .description('Generate and open VS Code remote SSH URLs for local files')
  .version(version)
  .argument('<file>', 'File path to open in VS Code')
  .option('-a, --alias <alias>', 'Override username@ip with custom alias')
  .action(async (file, options) => {
    try {
      // Generate URL
      const url = generateVsCodeUrl(file, options.alias);

      // Print colored message and URL
      console.log('\x1b[32m%s\x1b[0m', '点击下方链接跳转打开本地 VS Code:');
      console.log(url);

      // Open URL
      try {
        const open = (await import('open')).default;
        await open(url);
      } catch (openError) {
        console.error('Error: failed to open VS Code');
        console.error('Please copy the URL above and open it manually.');
        process.exit(1);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

program.parse();
