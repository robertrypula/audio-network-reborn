// Code migrated from: https://github.com/webpack-contrib/style-loader
// It was extremely simplified and adopted to web & node environments in order to solve the issue with:
//   ReferenceError: document is not defined
// In addition I learned how to write webpack loader ;)

// TODO: simplify it even more and add AudioNetworkLite's copyrights

function listToStyles(list) {
  const styles = [];
  const newStyles = {};

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const id = item[0];
    const css = item[1];

    if (!newStyles[id]) {
      styles.push((newStyles[id] = { id, parts: [css] }));
    } else {
      newStyles[id].parts.push(css);
    }
  }

  return styles;
}

function addStylesToDom(styles) {
  for (let i = 0; i < styles.length; i++) {
    const item = styles[i];

    for (let j = 0; j < item.parts.length; j++) {
      addStyle(item.parts[j]);
    }
  }
}

function addStyle(css) {
  const style = document.createElement('style');

  document.querySelector('head').appendChild(style);
  style.appendChild(document.createTextNode(css));
}

module.exports = (list, options) => {
  options = options || {};

  // solves the 'ReferenceError: document is not defined' on node environment
  // TODO move 'audio-network-lite-root' check to options
  if (typeof document !== 'undefined' && document.getElementById('audio-network-lite-root')) {
    addStylesToDom(listToStyles(list));
  }
};
