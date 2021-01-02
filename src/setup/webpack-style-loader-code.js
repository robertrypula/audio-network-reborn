// Copyright (c) 2019-2021 Robert Rypuła - https://github.com/robertrypula

// Code based on: https://github.com/webpack-contrib/style-loader
// It was extremely simplified and adopted to web & node environments in order
// to solve the issue with: ReferenceError: document is not defined
// In addition I learned how to write webpack loader ;)

function addStyleTag(css) {
  const style = document.createElement('style');

  document.querySelector('head').appendChild(style);
  style.appendChild(document.createTextNode(css));
}

function getCss(styles) {
  return styles && styles[0] && styles[0][1] ? styles[0][1] : '/* no css */';
}

function isValidBrowserContext(options) {
  return typeof document !== 'undefined' && document.getElementById(options.rootElementId);
}

module.exports = (styles, options) => {
  options = options || {};
  options.rootElementId = options.rootElementId || 'root';
  isValidBrowserContext(options) && addStyleTag(getCss(styles));
};
