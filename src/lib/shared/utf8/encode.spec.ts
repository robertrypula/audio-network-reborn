// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { getUtf8BytesFromText } from '@shared/utf8/encode';
import { getHexFromBytes } from '@shared/utils';

describe('Utf8 encode', () => {
  describe('getUtf8BytesFromText', () => {
    it('should work', () => {
      // TODO extend test cases
      expect(getHexFromBytes(getUtf8BytesFromText('ą ć ę'))).toEqual('c4 85 20 c4 87 20 c4 99');
    });
  });
});
