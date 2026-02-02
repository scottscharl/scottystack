#!/usr/bin/env node

import prompts from 'prompts';
import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, chmodSync, createWriteStream, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { pipeline } from 'stream/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLIENT_DIR = join(__dirname, 'client');
const SERVER_DIR = join(__dirname, 'server');
const ENV_FILE = join(CLIENT_DIR, '.env.local');

// Color helpers
const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
  dim: (text) => `\x1b[2m${text}\x1b[0m`,
};

function showBanner() {
  console.log(`
${colors.blue('╔════════════════════════════════════════╗')}
${colors.blue('║')}     ${colors.bold('ScottyStack Setup Wizard')}          ${colors.blue('║')}
${colors.blue('║')}     React + PocketBase                ${colors.blue('║')}
${colors.blue('╚════════════════════════════════════════╝')}
  `);
}

async function selectDeploymentMode() {
  const response = await prompts({
    type: 'select',
    name: 'mode',
    message: 'Select deployment mode:',
    choices: [
      {
        title: 'PocketHost (hosted)',
        description: 'Use pockethost.io - no server setup needed',
        value: 'pockethost',
      },
      {
        title: 'Self-hosted',
        description: 'Run PocketBase locally on this machine',
        value: 'selfhosted',
      },
    ],
  });

  if (!response.mode) {
    console.log(colors.yellow('\nSetup cancelled.'));
    process.exit(0);
  }

  return response.mode;
}

async function setupPocketHost() {
  const response = await prompts({
    type: 'text',
    name: 'url',
    message: 'Enter your PocketHost URL:',
    initial: 'https://your-app.pockethost.io',
    validate: (value) => {
      const url = value.replace(/\/$/, '');

      // Check if it's a valid pockethost.io URL
      const pockethostPattern = /^https:\/\/[\w-]+\.pockethost\.io$/;
      if (pockethostPattern.test(url)) {
        return true;
      }

      // Also allow custom domains (HTTPS required)
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== 'https:') {
          return 'URL must use HTTPS';
        }
        return true;
      } catch {
        return 'Please enter a valid URL (e.g., https://your-app.pockethost.io)';
      }
    },
  });

  if (!response.url) {
    console.log(colors.yellow('\nSetup cancelled.'));
    process.exit(0);
  }

  return response.url.replace(/\/$/, '');
}

function detectPlatform() {
  const platform = process.platform;
  const arch = process.arch;

  let os, architecture;

  switch (platform) {
    case 'darwin':
      os = 'darwin';
      break;
    case 'linux':
      os = 'linux';
      break;
    case 'win32':
      os = 'windows';
      break;
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }

  switch (arch) {
    case 'arm64':
      architecture = 'arm64';
      break;
    case 'x64':
      architecture = 'amd64';
      break;
    case 'arm':
      architecture = 'armv7';
      break;
    default:
      throw new Error(`Unsupported architecture: ${arch}`);
  }

  return { os, architecture };
}

async function getLatestPocketBaseVersion() {
  const response = await fetch(
    'https://api.github.com/repos/pocketbase/pocketbase/releases/latest'
  );
  const release = await response.json();
  return release.tag_name.replace('v', '');
}

async function extractZip(zipPath) {
  const { os } = detectPlatform();

  console.log(colors.blue('  Extracting...'));

  if (os === 'windows') {
    execSync(
      `powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${SERVER_DIR}' -Force"`,
      { stdio: 'pipe' }
    );
  } else {
    execSync(`unzip -o "${zipPath}" -d "${SERVER_DIR}"`, { stdio: 'pipe' });
  }
}

async function downloadPocketBase() {
  const { os, architecture } = detectPlatform();

  console.log(colors.blue(`\n  Detected platform: ${os} ${architecture}`));

  try {
    const version = await getLatestPocketBaseVersion();
    console.log(colors.blue(`  Latest PocketBase version: ${version}`));

    const filename = `pocketbase_${version}_${os}_${architecture}.zip`;
    const downloadUrl = `https://github.com/pocketbase/pocketbase/releases/download/v${version}/${filename}`;

    console.log(colors.blue(`  Downloading...`));

    const zipPath = join(SERVER_DIR, 'pocketbase.zip');

    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }

    const fileStream = createWriteStream(zipPath);
    await pipeline(response.body, fileStream);

    await extractZip(zipPath);

    unlinkSync(zipPath);

    if (os !== 'windows') {
      const pocketbasePath = join(SERVER_DIR, 'pocketbase');
      chmodSync(pocketbasePath, 0o755);
    }

    console.log(colors.green('  ✓ PocketBase installed successfully'));
    return true;
  } catch (error) {
    console.log(colors.red(`\n  ✗ Download failed: ${error.message}`));
    console.log(colors.yellow('\n  Please download manually:'));
    console.log(colors.dim('    https://github.com/pocketbase/pocketbase/releases'));
    console.log(colors.dim(`    Extract to: ${SERVER_DIR}/pocketbase`));
    return false;
  }
}

async function setupSelfHosted() {
  console.log(colors.blue('\n📦 Setting up self-hosted PocketBase...\n'));

  const { os } = detectPlatform();
  const binaryName = os === 'windows' ? 'pocketbase.exe' : 'pocketbase';
  const pocketbasePath = join(SERVER_DIR, binaryName);
  const pocketbaseExists = existsSync(pocketbasePath);

  if (pocketbaseExists) {
    console.log(colors.green('  ✓ PocketBase binary already exists'));
  } else {
    console.log(colors.yellow('  ⚠ PocketBase binary not found'));

    const { download } = await prompts({
      type: 'confirm',
      name: 'download',
      message: 'Download PocketBase automatically?',
      initial: true,
    });

    if (download) {
      await downloadPocketBase();
    } else {
      console.log(colors.yellow('\n  Please download PocketBase manually:'));
      console.log(colors.dim('    https://github.com/pocketbase/pocketbase/releases'));
      console.log(colors.dim(`    Extract to: ${SERVER_DIR}/pocketbase`));
    }
  }

  // Create directories
  const pbDataDir = join(SERVER_DIR, 'pb_data');
  const pbMigrationsDir = join(SERVER_DIR, 'pb_migrations');

  if (!existsSync(pbDataDir)) {
    mkdirSync(pbDataDir, { recursive: true });
    console.log(colors.green('  ✓ Created pb_data directory'));
  } else {
    console.log(colors.dim('  • pb_data directory already exists'));
  }

  if (!existsSync(pbMigrationsDir)) {
    mkdirSync(pbMigrationsDir, { recursive: true });
    console.log(colors.green('  ✓ Created pb_migrations directory'));
  } else {
    console.log(colors.dim('  • pb_migrations directory already exists'));
  }

  return 'http://127.0.0.1:8090';
}

function writeEnvFile(pocketbaseUrl) {
  const envContent = `# PocketBase URL
# Generated by setup wizard
VITE_PB_URL=${pocketbaseUrl}
`;

  writeFileSync(ENV_FILE, envContent);
  console.log(colors.green(`\n✓ Created client/.env.local`));
}

async function offerNpmInstall() {
  // Check if node_modules exists
  const nodeModulesExists = existsSync(join(CLIENT_DIR, 'node_modules'));

  if (nodeModulesExists) {
    console.log(colors.dim('\n• Client dependencies already installed'));
    return;
  }

  const { install } = await prompts({
    type: 'confirm',
    name: 'install',
    message: 'Install npm dependencies for the client?',
    initial: true,
  });

  if (install) {
    console.log(colors.blue('\nInstalling dependencies...\n'));

    try {
      execSync('npm install', {
        cwd: CLIENT_DIR,
        stdio: 'inherit',
      });
      console.log(colors.green('\n✓ Dependencies installed'));
    } catch (error) {
      console.log(colors.red('\n✗ npm install failed'));
      console.log(colors.yellow('  Run manually: cd client && npm install'));
    }
  }
}

function showNextSteps(mode, pocketbaseUrl) {
  console.log(`
${colors.blue('════════════════════════════════════════')}
${colors.green('✓ Setup complete!')}
${colors.blue('════════════════════════════════════════')}

${colors.bold('Next steps:')}
`);

  if (mode === 'selfhosted') {
    console.log(`  1. Start the servers:
     ${colors.blue('./start-all.sh')}

  2. Create an admin account:
     ${colors.blue('http://localhost:8090/_/')}

  3. Visit your app:
     ${colors.blue('http://localhost:5173')}
`);
  } else {
    console.log(`  1. Make sure your PocketHost instance is running:
     ${colors.blue(pocketbaseUrl)}

  2. Start the React client:
     ${colors.blue('cd client && npm run dev')}

  3. Visit your app:
     ${colors.blue('http://localhost:5173')}
`);
  }

  console.log(`${colors.bold('Documentation:')}
  README.md - Project overview and structure

${colors.bold('Need help?')}
  PocketBase docs: ${colors.dim('https://pocketbase.io/docs')}
  PocketHost: ${colors.dim('https://pockethost.io/docs')}
`);
}

async function main() {
  showBanner();

  // Step 1: Select deployment mode
  const mode = await selectDeploymentMode();

  let pocketbaseUrl;

  // Step 2: Configure based on mode
  if (mode === 'pockethost') {
    pocketbaseUrl = await setupPocketHost();
  } else {
    pocketbaseUrl = await setupSelfHosted();
  }

  // Step 3: Write environment file
  writeEnvFile(pocketbaseUrl);

  // Step 4: Offer to install dependencies
  await offerNpmInstall();

  // Step 5: Show next steps
  showNextSteps(mode, pocketbaseUrl);
}

main().catch((error) => {
  console.error(colors.red(`\nSetup failed: ${error.message}`));
  process.exit(1);
});
