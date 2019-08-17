// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import * as fromUtils from './utils';

describe('Utils', () => {
  describe('getBytesFromHex', () => {
    it('should return array of char codes limited to range 0 - 255 from given string', () => {
      // TODO
      // expect(fromUtils.getBytesFromHex('ab cd   \n ef43')).toEqual([0xab, 0xcd, 0xef, 0x43]);
    });
  });

  describe('getBytesFromText', () => {
    it('should return array of char codes limited to range 0 - 255 from given string', () => {
      expect(fromUtils.getBytesFromText('abc\n')).toEqual([0x61, 0x62, 0x63, 0x0A]);
    });
  });

  describe('getHexFromBytes', () => {
    it('should return string with hex values from given bytes array', () => {
      expect(fromUtils.getHexFromBytes([0x01, 0xFF, 0x43, 0x23, 0x100, 0xAB])).toEqual('01 ff 43 23 00 ab');
    });
  });

  describe('getRandomInt', () => {
    it('should ...', () => {
      expect(true).toBe(true);  // TODO implement
    });
  });

  describe('getTextFromBytes', () => {
    it('should return string from given array of bytes with unicode char codes limited to range 0-255', () => {
      expect(fromUtils.getTextFromBytes([0x61, 0x62, 0x63, 0x0A])).toEqual('abc\n');
    });
  });
});
