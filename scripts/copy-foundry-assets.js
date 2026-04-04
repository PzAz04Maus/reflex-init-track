#!/usr/bin/env node
// copy-foundry-assets.js
// Copies build and required files for Foundry module packaging

const fs = require('fs');
const path = require('path');

// Source locations for the reflex-init package
const foundryDistDir = path.resolve(__dirname, '..', 'build', 'packages', 'reflex-init', 'src', 'vtt', 'foundry');
const foundryStyles = path.resolve(__dirname, '..', 'packages', 'reflex-init', 'src', 'styles', 'foundry.css');
const foundryTemplatesDir = path.resolve(__dirname, '..', 'packages', 'reflex-init', 'src', 'templates', 'foundry');
const moduleJson = path.resolve(__dirname, '..', 'packages', 'reflex-init', 'src', 'vtt', 'foundry', 'module.json');

// Target directory
const targetDir = process.argv[2] || path.resolve(__dirname, '..', 'build', 'reflex-module');

function assertExists(file, label) {
  if (!fs.existsSync(file)) {
    console.error(`ERROR: Required file not found: ${file} (${label})`);
    process.exit(1);
  }
}

assertExists(foundryDistDir, 'build/packages/reflex-init/src/vtt/foundry directory');
assertExists(foundryStyles, 'packages/reflex-init/src/styles/foundry.css');
assertExists(foundryTemplatesDir, 'packages/reflex-init/src/templates/foundry directory');
assertExists(moduleJson, 'packages/reflex-init/src/vtt/foundry/module.json');

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`Copied: ${src} -> ${dest}`);
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

// Foundry runtime files
copyDir(foundryDistDir, path.join(targetDir, 'vtt', 'foundry'));


// Styles
copyFile(foundryStyles, path.join(targetDir, 'styles', 'foundry.css'));

// Templates
for (const file of fs.readdirSync(foundryTemplatesDir)) {
  if (file.endsWith('.hbs')) {
    copyFile(
      path.join(foundryTemplatesDir, file),
      path.join(targetDir, 'templates', 'foundry', file)
    );
  }
}

// Manifest
copyFile(moduleJson, path.join(targetDir, 'module.json'));

console.log('Foundry module assets copied to:', targetDir);