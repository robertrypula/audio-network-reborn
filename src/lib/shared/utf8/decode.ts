// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

/*tslint:disable:no-bitwise*/

export const getTextFromUtf8Bytes = (utf8Bytes: number[]): string => {
  // Code migrated to TypeScript from vanilla JavaScript implementation:
  // https://github.com/kvz/locutus/blob/master/src/php/xml/utf8_decode.js
  const text = [];
  let i = 0;

  while (i < utf8Bytes.length) {
    let charCode = utf8Bytes[i] & 0xff;
    let sequenceLength = 0;

    if (charCode <= 0xbf) {
      charCode = charCode & 0x7f;
      sequenceLength = 1;
    } else if (charCode <= 0xdf) {
      charCode = charCode & 0x1f;
      sequenceLength = 2;
    } else if (charCode <= 0xef) {
      charCode = charCode & 0x0f;
      sequenceLength = 3;
    } else {
      charCode = charCode & 0x07;
      sequenceLength = 4;
    }

    for (let j = 1; j < sequenceLength; ++j) {
      charCode = (charCode << 0x06) | (utf8Bytes[i + j] & 0x3f);
    }

    if (sequenceLength === 4) {
      charCode -= 0x10000;
      text.push(String.fromCharCode(0xd800 | ((charCode >> 10) & 0x3ff)));
      text.push(String.fromCharCode(0xdc00 | (charCode & 0x3ff)));
    } else {
      text.push(String.fromCharCode(charCode));
    }

    i += sequenceLength;
  }

  return text.join('');
};
