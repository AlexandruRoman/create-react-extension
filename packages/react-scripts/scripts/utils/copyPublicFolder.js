'use strict';

const fs = require('fs-extra');
const paths = require('../../config/paths');

const excludedFiles = [
  paths.appPopupHtml,
  paths.appDevtoolsPageHtml,
  paths.appOptionsHtml,
]
function copyPublicFolder(buildFolder) {
  fs.copySync(paths.appPublic, buildFolder, {
    dereference: true,
  filter: file => excludedFiles.indexOf(file) == -1,
  });
}

module.exports = copyPublicFolder;
