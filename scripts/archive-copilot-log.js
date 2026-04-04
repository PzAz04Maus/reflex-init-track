#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const devDir = path.join(repoRoot, 'dev');
const copilotLogsDir = path.join(devDir, 'copilot-logs');
const sourceArg = process.argv[2];
const sourcePath = sourceArg || process.env.VSCODE_TARGET_SESSION_LOG;

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

if (!sourcePath) {
  fail('No Copilot log path was provided. Pass a path as the first argument or set VSCODE_TARGET_SESSION_LOG.');
}

const resolvedSource = path.resolve(sourcePath);

if (!fs.existsSync(resolvedSource)) {
  fail(`Source path does not exist: ${resolvedSource}`);
}

const timestamp = new Date();
const pad = (value) => String(value).padStart(2, '0');
const datePart = `${timestamp.getFullYear()}-${pad(timestamp.getMonth() + 1)}-${pad(timestamp.getDate())}`;
const timePart = `${pad(timestamp.getHours())}${pad(timestamp.getMinutes())}`;
const archiveBaseName = `${datePart}-copilot-debuglog-${timePart}`;
const archiveDir = path.join(copilotLogsDir, archiveBaseName);
const manifestPath = path.join(copilotLogsDir, `${archiveBaseName}.md`);

fs.mkdirSync(copilotLogsDir, { recursive: true });

const sourceStats = fs.statSync(resolvedSource);

if (sourceStats.isDirectory()) {
  fs.cpSync(resolvedSource, archiveDir, { recursive: true, force: true });
} else {
  fs.mkdirSync(archiveDir, { recursive: true });
  fs.copyFileSync(resolvedSource, path.join(archiveDir, path.basename(resolvedSource)));
}

const copiedEntries = sourceStats.isDirectory() ? fs.readdirSync(archiveDir).length : 1;

const manifest = [
  '# Copilot Debug Log Archive',
  '',
  `- Archived at: ${timestamp.toISOString()}`,
  `- Source path: ${resolvedSource}`,
  `- Archive directory: ${archiveDir}`,
  `- Source type: ${sourceStats.isDirectory() ? 'directory' : 'file'}`,
  `- Top-level entries copied: ${copiedEntries}`,
  '',
  'This archive is a raw copy of the available Copilot debug-log path at the time the script was run.',
  'It is separate from the human-readable Copilot session summary files stored in dev/.',
  '',
].join('\n');

fs.writeFileSync(manifestPath, manifest, 'utf8');

console.log(`Archived Copilot log to: ${archiveDir}`);
console.log(`Wrote archive manifest: ${manifestPath}`);