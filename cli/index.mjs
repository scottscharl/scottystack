#!/usr/bin/env node

import { downloadTemplate } from 'giget';
import prompts from 'prompts';
import { execSync, spawn } from 'child_process';
import { existsSync, rmSync } from 'fs';
import { resolve, basename, join } from 'path';

// Color helpers
const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
  dim: (text) => `\x1b[2m${text}\x1b[0m`,
};

// TODO: Update this to your GitHub repo
const TEMPLATE_REPO = 'github:YOURNAME/scottystack';

function showBanner() {
  console.log(`
${colors.blue('╔════════════════════════════════════════╗')}
${colors.blue('║')}   ${colors.bold('create-scottystack')}                  ${colors.blue('║')}
${colors.blue('║')}   React + PocketBase Starter          ${colors.blue('║')}
${colors.blue('╚════════════════════════════════════════╝')}
  `);
}

async function getProjectName() {
  // Check if project name was passed as argument
  const argName = process.argv[2];

  if (argName && argName !== '.') {
    return argName;
  }

  if (argName === '.') {
    return '.';
  }

  // Prompt for project name
  const response = await prompts({
    type: 'text',
    name: 'projectName',
    message: 'Project name:',
    initial: 'my-scottystack-app',
    validate: (value) => {
      if (!value) return 'Project name is required';
      if (!/^[a-zA-Z0-9-_\.]+$/.test(value)) {
        return 'Project name can only contain letters, numbers, dashes, underscores, and dots';
      }
      return true;
    },
  });

  if (!response.projectName) {
    console.log(colors.yellow('\nSetup cancelled.'));
    process.exit(0);
  }

  return response.projectName;
}

async function main() {
  showBanner();

  // Step 1: Get project name
  const projectName = await getProjectName();
  const targetDir = resolve(process.cwd(), projectName);
  const isCurrentDir = projectName === '.';

  // Step 2: Check if directory exists
  if (!isCurrentDir && existsSync(targetDir)) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: `Directory "${projectName}" already exists. Overwrite?`,
      initial: false,
    });

    if (!overwrite) {
      console.log(colors.yellow('\nSetup cancelled.'));
      process.exit(0);
    }
  }

  // Step 3: Download template
  console.log(colors.blue(`\n📦 Downloading template...\n`));

  try {
    await downloadTemplate(TEMPLATE_REPO, {
      dir: targetDir,
      force: true,
    });
    console.log(colors.green('✓ Template downloaded'));
  } catch (error) {
    console.error(colors.red(`\n✗ Failed to download template: ${error.message}`));
    console.log(colors.yellow('\nMake sure you have internet access and try again.'));
    console.log(colors.dim(`Template repo: ${TEMPLATE_REPO}`));
    process.exit(1);
  }

  // Step 3b: Remove CLI folder from user's project (they don't need it)
  const cliDir = join(targetDir, 'cli');
  if (existsSync(cliDir)) {
    rmSync(cliDir, { recursive: true, force: true });
  }

  // Step 4: Install root dependencies
  console.log(colors.blue('\n📦 Installing dependencies...\n'));

  try {
    execSync('npm install', { cwd: targetDir, stdio: 'inherit' });
    console.log(colors.green('\n✓ Dependencies installed'));
  } catch (error) {
    console.error(colors.red('\n✗ Failed to install dependencies'));
    console.log(colors.yellow(`  Run manually: cd ${projectName} && npm install`));
  }

  // Step 5: Run setup wizard
  console.log(colors.blue('\n🔧 Running setup wizard...\n'));

  try {
    // Run the setup wizard interactively
    const setupProcess = spawn('node', ['setup.mjs'], {
      cwd: targetDir,
      stdio: 'inherit',
    });

    await new Promise((resolve, reject) => {
      setupProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Setup exited with code ${code}`));
        }
      });
      setupProcess.on('error', reject);
    });
  } catch (error) {
    console.log(colors.yellow('\n⚠ Setup wizard encountered an issue'));
    console.log(colors.dim(`  Run manually: cd ${projectName} && npm run setup`));
  }

  // Step 6: Show success message
  const displayName = isCurrentDir ? basename(process.cwd()) : projectName;

  console.log(`
${colors.blue('════════════════════════════════════════')}
${colors.green(`✓ ${displayName} is ready!`)}
${colors.blue('════════════════════════════════════════')}

${colors.bold('Next steps:')}

  ${isCurrentDir ? '' : `cd ${projectName}\n  `}${colors.blue('./start-all.sh')}       ${colors.dim('# Self-hosted mode')}
  ${colors.dim('or')}
  ${colors.blue('cd client && npm run dev')}  ${colors.dim('# PocketHost mode')}

${colors.bold('Happy coding! 🚀')}
`);
}

main().catch((error) => {
  console.error(colors.red(`\nError: ${error.message}`));
  process.exit(1);
});
