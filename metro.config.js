// metro.config.js
// Learn more https://docs.expo.io/guides/customizing-metro
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

// Get the default Metro configuration from Expo.
const config = getDefaultConfig(projectRoot, {
  // Enable CSS support for web. This is required for packages that use web-specific
  // styles and is part of the setup for expo-sqlite/for-web.
  isCSSEnabled: true,
});

// Add '.db' to the list of asset extensions.
// This is a custom configuration for this project to handle SQLite database files.
config.resolver.assetExts.push('db');

// Watch the local workspace packages so Metro can resolve and hot-reload them.
config.watchFolders = [
  path.resolve(workspaceRoot, 'gdc-sdk-client-ts'),
  path.resolve(workspaceRoot, 'gdc-common-utils-ts'),
];

// Prefer the app's node_modules, but allow workspace-level resolution too.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'gdc-common-utils-ts', 'node_modules'),
  path.resolve(workspaceRoot, 'gdc-sdk-client-ts', 'node_modules'),
];
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
