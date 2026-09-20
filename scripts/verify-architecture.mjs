import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const apps = ['host', 'auth', 'dashboard', 'users', 'analytics', 'notifications'];
const remotes = ['auth', 'dashboard', 'users', 'analytics', 'notifications'];
const errors = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

for (const app of apps) {
  const html = read(`apps/${app}/index.html`);
  if (!html.includes('name="viewport"')) {
    errors.push(`${app}: missing viewport meta tag`);
  }
}

for (const app of remotes) {
  const config = read(`apps/${app}/vite.config.js`);
  if (!config.includes("filename: 'remoteEntry.js'")) {
    errors.push(`${app}: missing remoteEntry.js filename`);
  }
  if (!config.includes('exposes:')) {
    errors.push(`${app}: missing federation exposes configuration`);
  }
}

const analyticsPackage = JSON.parse(read('apps/analytics/package.json'));
if (!analyticsPackage.dependencies?.recharts) {
  errors.push('analytics: missing direct recharts dependency');
}

const hostMain = read('apps/host/src/main.jsx');
for (const remote of remotes) {
  if (!hostMain.includes(`import('${remote}/`)) {
    errors.push(`host: missing lazy import for ${remote}`);
  }
}

const hostConfig = read('apps/host/vite.config.js');
for (const variable of [
  'VITE_AUTH_REMOTE',
  'VITE_DASHBOARD_REMOTE',
  'VITE_USERS_REMOTE',
  'VITE_ANALYTICS_REMOTE',
  'VITE_NOTIFICATIONS_REMOTE',
]) {
  if (!hostConfig.includes(variable)) {
    errors.push(`host: missing ${variable} environment configuration`);
  }
}

const rootPackage = JSON.parse(read('package.json'));
if (!rootPackage.scripts?.['verify:architecture']) {
  errors.push('root package: missing verify:architecture script');
}
if (!rootPackage.scripts?.['start:local']) {
  errors.push('root package: missing start:local script');
}
if (!rootPackage.scripts['start:local'].includes('npm run build:remotes &&')) {
  errors.push('root package: start:local must build remotes before previewing them');
}

const responsiveChecks = {
  host: ['@media', 'max-width: 800px'],
  auth: ['@media', 'max-width: 750px'],
  dashboard: ['@media', 'max-width: 550px'],
  users: ['@media', 'max-width: 700px', 'overflow-x: auto'],
  analytics: ['@media', 'max-width: 600px'],
  notifications: ['@media', 'max-width: 600px'],
};

for (const [app, checks] of Object.entries(responsiveChecks)) {
  const css = read(`apps/${app}/src/styles.css`);
  for (const check of checks) {
    if (!css.includes(check)) {
      errors.push(`${app}: responsive check missing '${check}'`);
    }
  }
}

if (errors.length) {
  console.error('Architecture verification failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Architecture verification passed for ${apps.length} apps, ${remotes.length} remotes, and responsive checks.`);
