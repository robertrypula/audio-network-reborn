// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { getTextFromUtf8Bytes } from '@shared/utf8/decode';
import { getBytesFromHex } from '@shared/utils';

describe('Utf8 decode', () => {
  describe('getTextFromUtf8Bytes', () => {
    it('should work', () => {
      // TODO extend test cases
      expect(getTextFromUtf8Bytes(getBytesFromHex('c4 85 20 c4 87 20 c4 99'))).toEqual('ą ć ę');
    });
  });
});
