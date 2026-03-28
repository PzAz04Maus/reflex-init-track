#!/usr/bin/env node
// copy-foundry-module-assets.js
// Copies build and required files for Foundry module packaging

const fs = require('fs');
const path = require('path');

// Source locations (only copy what Foundry needs)
const foundryDistDir = path.resolve(__dirname, '..', 'build', 'vtt', 'foundry');
const coreDistDir = path.resolve(__dirname, '..', 'build', 'core');
const foundryStyles = path.resolve(__dirname, '..', 'src', 'styles', 'foundry.css');
const foundryTemplatesDir = path.resolve(__dirname, '..', 'src', 'templates', 'foundry');
const moduleJson = path.resolve(__dirname, '..', 'src', 'vtt', 'foundry', 'module.json');

// Target (output) directory (user can override with CLI arg)
const targetDir = process.argv[2] || path.resolve(__dirname, '..', 'build', 'reflex-module');

// Validate that all required files exist before copying
function assertExists(file, label) {
  if (!fs.existsSync(file)) {
    console.error(`ERROR: Required file not found: ${file} (${label})`);
    process.exit(1);
  }
}

assertExists(foundryDistDir, 'build/vtt/foundry directory');
assertExists(coreDistDir, 'build/core directory');
assertExists(foundryStyles, 'foundry.css');
assertExists(foundryTemplatesDir, 'src/templates/foundry directory');
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


// Copy build/vtt/foundry -> vtt/foundry in module (no build/ nesting)
copyDir(foundryDistDir, path.join(targetDir, 'vtt', 'foundry'));
// Copy build/core -> core in module (no build/ nesting)
copyDir(coreDistDir, path.join(targetDir, 'core'));
// Copy foundry.css
copyFile(foundryStyles, path.join(targetDir, 'styles', 'foundry.css'));
// Copy all .hbs templates from src/templates/foundry to module's templates/foundry
fs.readdirSync(foundryTemplatesDir).forEach(file => {
  if (file.endsWith('.hbs')) {
    copyFile(
      path.join(foundryTemplatesDir, file),
      path.join(targetDir, 'templates', 'foundry', file)
    );
  }
});
// Copy module.json
copyFile(moduleJson, path.join(targetDir, 'module.json'));

console.log('Foundry module assets copied to:', targetDir);
