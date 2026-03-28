const { execSync } = require('child_process');

try {
  console.log('Running TypeScript build (tsc -b)...');
  execSync('tsc -b', { stdio: 'inherit' });
  console.log('TypeScript build complete.');

  console.log('Running Foundry packaging (npm run package:foundry)...');
  execSync('npm run package:foundry', { stdio: 'inherit' });
  console.log('Foundry packaging complete.');

  console.log('All build steps finished successfully.');
} catch (err) {
  console.error('Build or packaging failed:', err.message);
  process.exit(1);
}
