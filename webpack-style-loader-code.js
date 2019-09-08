// Code migrated from: https://github.com/webpack-contrib/style-loader
// It was extremely simplified and adopted to web & node environments in order to solve the issue with:
//   ReferenceError: document is not defined
// In addition I learned how to write webpack loader ;)

// TODO: simplify it even more and add AudioNetworkLite's copyrights

const stylesInDom = {};

function listToStyles(list) {
  const styles = [];
  const newStyles = {};

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const id = item[0];
    const css = item[1];
    const part = { css };

    if (!newStyles[id]) {
      styles.push((newStyles[id] = { id, parts: [part] }));
    } else {
      newStyles[id].parts.push(part);
    }
  }

  return styles;
}

function addStylesToDom(styles) {
  for (let i = 0; i < styles.length; i++) {
    const item = styles[i];
    const domStyle = stylesInDom[item.id];
    let j = 0;

    if (domStyle) {
      domStyle.refs++;

      for (; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j]);
      }

      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]));
      }
    } else {
      const parts = [];

      for (; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]));
      }

      stylesInDom[item.id] = { id: item.id, refs: 1, parts };
    }
  }
}

function insertStyleElement() {
  const style = document.createElement('style');

  document.querySelector('head').appendChild(style);

  return style;
}

function removeStyleElement(style) {
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}

function applyToTag(style, obj) {
  let css = obj.css;

  while (style.firstChild) {
    style.removeChild(style.firstChild);
  }
  style.appendChild(document.createTextNode(css));
}

function addStyle(obj) {
  let style;
  let update;
  let remove;

  style = insertStyleElement();

  update = applyToTag.bind(null, style);
  remove = () => {
    removeStyleElement(style);
  };

  update(obj);

  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css) {
        return;
      }

      update((obj = newObj));
    } else {
      remove();
    }
  };
}

module.exports = (list, options) => {
  options = options || {};

  if (typeof document !== 'undefined') { // solves the 'ReferenceError: document is not defined' on node environment
    addStylesToDom(listToStyles(list));
  }
};
