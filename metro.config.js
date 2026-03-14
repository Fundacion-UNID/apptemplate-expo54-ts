// metro.config.js
// Learn more https://docs.expo.io/guides/customizing-metro
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const projectRoot = __dirname;

// Get the default Metro configuration from Expo.
const config = getDefaultConfig(projectRoot, {
  // Enable CSS support for web. This is required for packages that use web-specific
  // styles and is part of the setup for expo-sqlite/for-web.
  isCSSEnabled: true,
});

// Add '.db' to the list of asset extensions.
// This project needs SQLite database files and the wasm payload used by expo-sqlite on web.
config.resolver.assetExts.push('db');
config.resolver.assetExts.push('wasm');

// Prefer the app's node_modules to avoid workspace lookups.
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')];
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
