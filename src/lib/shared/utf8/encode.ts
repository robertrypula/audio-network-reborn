// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

/*tslint:disable:no-bitwise*/

export const getUtf8BytesFromText = (text: string): number[] => {
  // Code migrated to TypeScript from vanilla JavaScript implementation:
  // https://github.com/kvz/locutus/blob/master/src/php/xml/utf8_encode.js
  const utf8Bytes: number[] = [];
  let end = 0;
  let start = 0;
  let utf8Text = '';

  for (let n = 0; n < text.length; n++) {
    let charCode = text.charCodeAt(n);
    let utf8TextPart = null;

    if (charCode < 128) {
      end++;
    } else if (charCode > 127 && charCode < 2048) {
      utf8TextPart = String.fromCharCode((charCode >> 6) | 192, (charCode & 63) | 128);
    } else if ((charCode & 0xf800) !== 0xd800) {
      utf8TextPart = String.fromCharCode((charCode >> 12) | 224, ((charCode >> 6) & 63) | 128, (charCode & 63) | 128);
    } else {
      // surrogate pairs
      if ((charCode & 0xfc00) !== 0xd800) {
        throw new RangeError('Unmatched trail surrogate at ' + n);
      }
      const charCodeNext = text.charCodeAt(++n);
      if ((charCodeNext & 0xfc00) !== 0xdc00) {
        throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
      }
      charCode = ((charCode & 0x3ff) << 10) + (charCodeNext & 0x3ff) + 0x10000;
      utf8TextPart = String.fromCharCode(
        (charCode >> 18) | 240,
        ((charCode >> 12) & 63) | 128,
        ((charCode >> 6) & 63) | 128,
        (charCode & 63) | 128
      );
    }

    if (utf8TextPart !== null) {
      if (end > start) {
        utf8Text += text.slice(start, end);
      }
      utf8Text += utf8TextPart;
      start = end = n + 1;
    }
  }

  if (end > start) {
    utf8Text += text.slice(start, text.length);
  }

  for (let i = 0; i < utf8Text.length; i++) {
    utf8Bytes.push(utf8Text.charCodeAt(i));
  }

  return utf8Bytes;
};
