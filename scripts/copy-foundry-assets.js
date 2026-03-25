#!/usr/bin/env node
// copy-foundry-module-assets.js
// Copies build and required files for Foundry module packaging

const fs = require('fs');
const path = require('path');

// Source locations
const distDir = path.resolve(__dirname, 'dist');
const foundryStyles = path.resolve(__dirname, 'src', 'styles', 'foundry.css');
const foundryTemplate = path.resolve(__dirname, 'src', 'templates', 'foundry', 'schedule-panel.hbs');
const moduleJson = path.resolve(__dirname, 'src', 'vtt', 'foundry', 'module.json');

// Target (output) directory (user can override with CLI arg)
const targetDir = process.argv[2] || path.resolve(__dirname, 'foundry-module');

// Validate that all required files exist before copying
function assertExists(file, label) {
  if (!fs.existsSync(file)) {
    console.error(`ERROR: Required file not found: ${file} (${label})`);
    process.exit(1);
  }
}

assertExists(distDir, 'dist directory');
assertExists(foundryStyles, 'foundry.css');
assertExists(foundryTemplate, 'schedule-panel.hbs');
assertExists(moduleJson, 'module.json');

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

// Copy dist/
copyDir(distDir, path.join(targetDir, 'dist'));
// Copy foundry.css
copyFile(foundryStyles, path.join(targetDir, 'styles', 'foundry.css'));
// Copy schedule-panel.hbs
copyFile(foundryTemplate, path.join(targetDir, 'templates', 'foundry', 'schedule-panel.hbs'));
// Copy module.json
copyFile(moduleJson, path.join(targetDir, 'module.json'));

console.log('Foundry module assets copied to:', targetDir);
