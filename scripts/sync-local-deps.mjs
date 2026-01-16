import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const appRoot = process.cwd();
const statePath = path.join(appRoot, '.local-deps-installed.json');

const readJson = (filePath) => {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
};

const isLocalSpec = (spec) =>
  typeof spec === 'string' &&
  (spec.startsWith('file:') || spec.startsWith('link:') || spec.startsWith('workspace:'));

const resolveLocalPackageJson = (spec) => {
  const relPath = spec.replace(/^(file:|link:|workspace:)/, '');
  const absPath = path.resolve(appRoot, relPath);
  return path.join(absPath, 'package.json');
};

const collectLocalDeps = (appPkg) => {
  const localDeps = Object.entries(appPkg.dependencies || {})
    .filter(([, spec]) => isLocalSpec(spec));

  const collected = new Map();
  const localPackageNames = new Set(localDeps.map(([name]) => name));

  for (const [, spec] of localDeps) {
    const pkgPath = resolveLocalPackageJson(spec);
    if (!fs.existsSync(pkgPath)) {
      console.warn(`[local-deps] Missing package.json at ${pkgPath}`);
      continue;
    }

    const localPkg = readJson(pkgPath);
    const deps = {
      ...(localPkg.dependencies || {}),
      ...(localPkg.peerDependencies || {}),
    };

    for (const [dep, version] of Object.entries(deps)) {
      if (localPackageNames.has(dep)) continue;
      if (isLocalSpec(version)) continue;
      if (!collected.has(dep)) {
        collected.set(dep, version);
      }
    }
  }

  return collected;
};

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
};

const run = (cmd) => {
  console.log(`[local-deps] ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: appRoot });
};

const appPkgPath = path.join(appRoot, 'package.json');
const appPkg = readJson(appPkgPath);

const command = process.argv[2];
if (!['install', 'uninstall'].includes(command)) {
  console.error('Usage: node scripts/sync-local-deps.mjs <install|uninstall>');
  process.exit(1);
}

if (command === 'install') {
  const deps = collectLocalDeps(appPkg);
  const appDeps = {
    ...(appPkg.dependencies || {}),
    ...(appPkg.devDependencies || {}),
  };

  const toInstall = Array.from(deps.keys()).filter((dep) => !(dep in appDeps));

  if (toInstall.length === 0) {
    console.log('[local-deps] No missing dependencies to install.');
    process.exit(0);
  }

  for (const group of chunk(toInstall, 20)) {
    run(`npx expo install ${group.join(' ')}`);
  }

  const state = Object.fromEntries(
    Array.from(deps.entries()).filter(([dep]) => toInstall.includes(dep))
  );
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
  console.log(`[local-deps] Wrote ${statePath}`);
}

if (command === 'uninstall') {
  let deps = null;
  if (fs.existsSync(statePath)) {
    deps = readJson(statePath);
  } else {
    console.warn('[local-deps] No state file found. Falling back to current local deps.');
    deps = Object.fromEntries(collectLocalDeps(appPkg));
  }

  const toRemove = Object.keys(deps || {});
  if (toRemove.length === 0) {
    console.log('[local-deps] No dependencies to uninstall.');
    process.exit(0);
  }

  for (const group of chunk(toRemove, 20)) {
    run(`npx expo uninstall ${group.join(' ')}`);
  }

  if (fs.existsSync(statePath)) {
    fs.unlinkSync(statePath);
    console.log(`[local-deps] Removed ${statePath}`);
  }
}
