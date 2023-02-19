'use strict';

import { existsSync } from 'fs';
import { resolve } from 'path';
import electron from 'electron';
import nodeBindings from 'node-gyp-build';

/**
 * Binds the native module using node-gyp for the electron
 * app.
 * @param {*} nativePath Path to the native module.
 * @returns Node binding instance for an electron app.
 */
const bindings = nativePath => {
  let nativeModulePath = getLibPath(nativePath);
  return nodeBindings(nativeModulePath);
};

const getLibPath = nativePath => {
  if (typeof electron === 'string') {
    throw new Error('Not running in an Electron environment!');
  }
  const { app } = electron;
  const nodeModulesDir = resolve(process.cwd(), 'node_modules');
  const libPath = resolve(nodeModulesDir, nativePath);
  if (existsSync(nodeModulesDir)) {
    if (existsSync(libPath)) {
      return libPath;
    }
    return new Error('Could not find module: '+nativePath);
  }
  return new Error('No node modules have been installed!');
};

module.exports = bindings;
