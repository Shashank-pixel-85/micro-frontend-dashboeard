import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const utilsSource = fs.readFileSync(path.join(root, 'packages/utils/src/index.js'), 'utf8');
const analyticsPackage = JSON.parse(
  fs.readFileSync(path.join(root, 'apps/analytics/package.json'), 'utf8')
);

assert.match(utilsSource, /mfd_last_user_update/, 'User update storage key should be neutral and stable.');
assert.match(utilsSource, /mfe:user-updated/, 'Users-to-Notifications event name should remain stable.');
assert.match(utilsSource, /publishUserUpdated/, 'Shared user update publisher should exist.');
assert.match(utilsSource, /getLastUserUpdate/, 'Late-mounted consumers should restore the latest event.');
assert.ok(analyticsPackage.dependencies?.recharts, 'Analytics must declare Recharts directly.');

const sourceFiles = [
  'apps/auth/src/Auth.jsx',
  'apps/notifications/src/App.jsx',
  'apps/host/src/main.jsx',
  'packages/auth/src/index.js',
  'packages/utils/src/index.js',
];

for (const file of sourceFiles) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  assert.ok(!source.includes(['Nova', 'Hub'].join('')), `${file} still contains the old product name.`);
}

console.log('Utility, dependency, and branding regression checks passed.');
