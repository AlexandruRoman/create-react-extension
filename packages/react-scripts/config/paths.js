// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(inputPath, needsSlash) {
  const hasSlash = inputPath.endsWith('/');
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  } else {
    return inputPath;
  }
}

const getPublicUrl = appPackageJson =>
  envPublicUrl || require(appPackageJson).homepage;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('build'),
  devAppBuild: resolveApp('dev'), // @first-iteration
  appPublic: resolveApp('public'),
  manifestJson: resolveApp('public/manifest.json'), // @first-iteration
  appPopupHtml: resolveApp('public/popup.html'), // @first-iteration
  appIndexJs: resolveModule(resolveApp, 'src/popup/index'),
  appBackgroundJs: resolveModule(resolveApp, 'src/background/index'), // @first-iteration
  appContentScriptJs: resolveModule(resolveApp, 'src/contentScript/index'), // @first-iteration
  appDevtoolsHtml: resolveApp('public/devtools.html'), // @develop
  appDevtoolsJs: resolveModule(resolveApp, 'public/devtools'), // @develop
  appDevtoolsPageHtml: resolveApp('public/devtoolsPage.html'), // @develop
  appDevtoolsPageJs: resolveModule(resolveApp, 'src/devtools/index'), // @develop
  appOptionsHtml: resolveApp('public/options.html'), // @develop
  appOptionsJs: resolveModule(resolveApp, 'src/options/index'), // @develop
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  proxySetup: resolveApp('src/setupProxy.js'),
  appNodeModules: resolveApp('node_modules'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
};

// @remove-on-eject-begin
const resolveOwn = relativePath => path.resolve(__dirname, '..', relativePath);

// config before eject: we're in ./node_modules/react-scripts/config/
module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('build'),
  devAppBuild: resolveApp('dev'), // @first-iteration
  appPublic: resolveApp('public'),
  manifestJson: resolveApp('public/manifest.json'), // @first-iteration
  appPopupHtml: resolveApp('public/popup.html'), // @first-iteration
  appIndexJs: resolveModule(resolveApp, 'src/popup/index'),
  appBackgroundJs: resolveModule(resolveApp, 'src/background/index'), // @first-iteration
  appContentScriptJs: resolveModule(resolveApp, 'src/contentScript/index'), // @first-iteration
  appDevtoolsHtml: resolveApp('public/devtools.html'), // @develop
  appDevtoolsJs: resolveModule(resolveApp, 'public/devtools'), // @develop
  appDevtoolsPageHtml: resolveApp('public/devtoolsPage.html'), // @develop
  appDevtoolsPageJs: resolveModule(resolveApp, 'src/devtools/index'), // @develop
  appOptionsHtml: resolveApp('public/options.html'), // @develop
  appOptionsJs: resolveModule(resolveApp, 'src/options/index'), // @develop
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  proxySetup: resolveApp('src/setupProxy.js'),
  appNodeModules: resolveApp('node_modules'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
  // These properties only exist before ejecting:
  ownPath: resolveOwn('.'),
  ownNodeModules: resolveOwn('node_modules'), // This is empty on npm 3
  appTypeDeclarations: resolveApp('src/react-app-env.d.ts'),
  ownTypeDeclarations: resolveOwn('lib/react-app.d.ts'),
};

const ownPackageJson = require('../package.json');
const reactScriptsPath = resolveApp(`node_modules/${ownPackageJson.name}`);
const reactScriptsLinked =
  fs.existsSync(reactScriptsPath) &&
  fs.lstatSync(reactScriptsPath).isSymbolicLink();

// config before publish: we're in ./packages/react-scripts/config/
if (
  !reactScriptsLinked &&
  __dirname.indexOf(path.join('packages', 'react-scripts', 'config')) !== -1
) {
  module.exports = {
    dotenv: resolveOwn('template/.env'),
    appPath: resolveApp('.'),
    appBuild: resolveOwn('../../build'),
    devAppBuild: resolveApp('../../dev'), // @first-iteration
    appPublic: resolveOwn('template/public'),
    manifestJson: resolveApp('template/public/manifest.json'), // @first-iteration
    appPopupHtml: resolveOwn('template/public/popup.html'), // @first-iteration
    appIndexJs: resolveModule(resolveOwn, 'template/src/popup/index'),
    appBackgroundJs: resolveModule(resolveOwn, 'template/src/background/index'), // @first-iteration
    appContentScriptJs: resolveModule(
      resolveOwn,
      'template/src/contentScript/index'
      ), // @first-iteration
    appDevtoolsHtml: resolveOwn('template/public/devtools.html'), // @develop
    appDevtoolsJs: resolveModule(resolveOwn, 'template/public/devtools'), // @develop
    appDevtoolsPageHtml: resolveOwn('template/public/devtoolsPage.html'), // @develop
    appDevtoolsPageJs: resolveModule(resolveOwn, 'template/src/devtools/index'), // @develop
    appOptionsHtml: resolveOwn('template/public/options.html'), // @develop
    appOptionsJs: resolveModule(resolveOwn, 'template/src/options/index'), // @develop
    appPackageJson: resolveOwn('package.json'),
    appSrc: resolveOwn('template/src'),
    appTsConfig: resolveOwn('template/tsconfig.json'),
    appJsConfig: resolveOwn('template/jsconfig.json'),
    yarnLockFile: resolveOwn('template/yarn.lock'),
    testsSetup: resolveModule(resolveOwn, 'template/src/setupTests'),
    proxySetup: resolveOwn('template/src/setupProxy.js'),
    appNodeModules: resolveOwn('node_modules'),
    publicUrl: getPublicUrl(resolveOwn('package.json')),
    servedPath: getServedPath(resolveOwn('package.json')),
    // These properties only exist before ejecting:
    ownPath: resolveOwn('.'),
    ownNodeModules: resolveOwn('node_modules'),
    appTypeDeclarations: resolveOwn('template/src/react-app-env.d.ts'),
    ownTypeDeclarations: resolveOwn('lib/react-app.d.ts'),
  };
}
// @remove-on-eject-end

module.exports.moduleFileExtensions = moduleFileExtensions;
