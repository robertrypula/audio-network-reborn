// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import * as fromUtils from '@shared/utils';

describe('Utils', () => {
  describe('getBytesFromHex', () => {
    it('should properly extract bytes array', () => {
      const result = fromUtils.getBytesFromHex('ab cd   \n ef43  01 2 3456 78 9a bc de f');

      expect(result).toEqual([0xab, 0xcd, 0xef, 0x43, 0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef]);
    });

    it('should properly extract bytes array even if there is no pair for last character', () => {
      expect(fromUtils.getBytesFromHex('32      b')).toEqual([0x32, 0xb0]);
    });

    it('should ignore all none hex characters and parse string case insensitive', () => {
      expect(fromUtils.getBytesFromHex('lorem ipsum dolor sit amet AB')).toEqual([0xed, 0xae, 0xab]);
    });
  });

  describe('getBytesFromText', () => {
    it('should return array of char codes limited to range 0 - 255 from given string', () => {
      expect(fromUtils.getBytesFromText('abc\n')).toEqual([0x61, 0x62, 0x63, 0x0a]);
    });
  });

  describe('getFilledArray', () => {
    it('should return pre-filled array with proper length', () => {
      expect(fromUtils.getFilledArray(3, 32)).toEqual([32, 32, 32]);
    });
  });

  describe('getHexFromBytes', () => {
    it('should return string with hex values from given bytes array', () => {
      expect(fromUtils.getHexFromBytes([0x01, 0xff, 0x43, 0x23, 0x100, 0xab])).toEqual('01 ff 43 23 00 ab');
    });

    it('should return string with hex values from given bytes array with custom join', () => {
      expect(fromUtils.getHexFromBytes([0x01, 0xff, 0x43, 0x23, 0x100, 0xab], '|')).toEqual('01|ff|43|23|00|ab');
    });
  });

  describe('getRandomBytes', () => {
    it('should ...', () => {
      // TODO implement
    });
  });

  describe('getRandomInt', () => {
    it('should ...', () => {
      // TODO implement
    });
  });

  describe('getTextFromBytes', () => {
    it('should return string from given array of bytes with unicode char codes limited to range 0-255', () => {
      expect(fromUtils.getTextFromBytes([0x61, 0x62, 0x63, 0x0a])).toEqual('abc\n');
    });
  });
});
