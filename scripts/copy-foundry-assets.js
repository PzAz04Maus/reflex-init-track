#!/usr/bin/env node
// copy-foundry-assets.js
// Copies build and required files for Foundry module packaging

const fs = require('fs');
const path = require('path');

// Source locations for the active Foundry UI package and root bootstrap.
const foundryBootstrapDir = path.resolve(__dirname, '..', 'build', 'src', 'vtt', 'foundry');
const foundryUiDistDir = path.resolve(__dirname, '..', 'build', 'packages', 'reflex-ui', 'src', 'foundry');
const foundryStyles = path.resolve(__dirname, '..', 'packages', 'reflex-ui', 'src', 'styles', 'foundry.css');
const foundryTemplatesDir = path.resolve(__dirname, '..', 'packages', 'reflex-ui', 'src', 'templates', 'foundry');
const moduleJson = path.resolve(__dirname, '..', 'packages', 'reflex-system', 'src', 'foundry', 'module.json');

// Target directory
const targetDir = process.argv[2] || path.resolve(__dirname, '..', 'build', 'reflex-module');
const targetFoundryRuntimeDir = path.join(targetDir, 'vtt', 'foundry');
const targetFoundryTemplatesDir = path.join(targetDir, 'templates', 'foundry');
const targetFoundryStylesDir = path.join(targetDir, 'styles');

function assertExists(file, label) {
  if (!fs.existsSync(file)) {
    console.error(`ERROR: Required file not found: ${file} (${label})`);
    process.exit(1);
  }
}

assertExists(foundryBootstrapDir, 'build/src/vtt/foundry directory');
assertExists(foundryUiDistDir, 'build/packages/reflex-ui/src/foundry directory');
assertExists(foundryStyles, 'packages/reflex-ui/src/styles/foundry.css');
assertExists(foundryTemplatesDir, 'packages/reflex-ui/src/templates/foundry directory');
assertExists(moduleJson, 'packages/reflex-system/src/foundry/module.json');

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`Copied: ${src} -> ${dest}`);
}

function resetDir(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

function copyFoundryRuntimeFiles(srcDir, destDir, fileNames) {
  for (const fileName of fileNames) {
    copyFile(path.join(srcDir, fileName), path.join(destDir, fileName));
  }
}

resetDir(targetFoundryRuntimeDir);
resetDir(targetFoundryTemplatesDir);
resetDir(targetFoundryStylesDir);

// Foundry runtime files
copyFoundryRuntimeFiles(foundryUiDistDir, targetFoundryRuntimeDir, [
  'debug-panel.js',
  'index.js',
  'panel.js'
]);
copyFoundryRuntimeFiles(foundryBootstrapDir, targetFoundryRuntimeDir, [
  'init.js'
]);


// Styles
copyFile(foundryStyles, path.join(targetFoundryStylesDir, 'foundry.css'));

// Templates
for (const file of fs.readdirSync(foundryTemplatesDir)) {
  if (file.endsWith('.hbs')) {
    copyFile(
      path.join(foundryTemplatesDir, file),
      path.join(targetFoundryTemplatesDir, file)
    );
  }
}

// Manifest
copyFile(moduleJson, path.join(targetDir, 'module.json'));

console.log('Foundry module assets copied to:', targetDir);