// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import * as fromUtils from '@shared/utils';

describe('Utils', () => {
  describe('getBytesFromHex', () => {
    it('should properly extract bytes array', () => {
      const result: number[] = fromUtils.getBytesFromHex('ab cd   \n ef43  01 2 3456 78 9a bc de f');

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

  describe('isEqual', () => {
    it('should check if two variables (including objects) are equal', () => {
      /*tslint:disable:object-literal-sort-keys*/
      expect(fromUtils.isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
      expect(fromUtils.isEqual({ b: 2, a: 1 }, { a: 1, b: 2 })).toBe(true);
      expect(fromUtils.isEqual({ b: 2, z: { x: 32, a: 1 }, a: 1 }, { a: 1, b: 2, z: { a: 1, x: 32 } })).toBe(true);
      expect(fromUtils.isEqual({ a: 1, b: 2 }, { a: 111111, b: 2 })).toBe(false);
      expect(fromUtils.isEqual('test', 'test')).toBe(true);
      expect(fromUtils.isEqual('test', 'test!!!')).toBe(false);
      /*tslint:enable:object-literal-sort-keys*/
    });
  });

  describe('padStart', () => {
    it('should properly pad decimal numbers', () => {
      const length = 3;
      const radix = 10;

      expect(fromUtils.padStart(null, radix, length)).toBe('000');
      expect(fromUtils.padStart(0, radix, length)).toBe('000');
      expect(fromUtils.padStart(1, radix, length)).toBe('001');
      expect(fromUtils.padStart(999, radix, length)).toBe('999');
      expect(fromUtils.padStart(999, radix, length - 1)).toBe('999');
    });

    it('should properly pad hexadecimal numbers', () => {
      const length = 2;
      const radix = 16;

      expect(fromUtils.padStart(null, radix, length)).toBe('00');
      expect(fromUtils.padStart(0, radix, length)).toBe('00');
      expect(fromUtils.padStart(1, radix, length)).toBe('01');
      expect(fromUtils.padStart(16, radix, length)).toBe('10');
    });

    it('should work with any given fillWith parameter', () => {
      const length = 10;
      const radix = 16;

      expect(fromUtils.padStart(0xabc, radix, length, '.')).toBe('.......abc');
    });
  });

  describe('sortKeys', () => {
    it('should recursively sort keys in given object', () => {
      /*tslint:disable:object-literal-sort-keys*/
      const object = { b: 'test B', a: 'test A', z: { zSub: null as number, bSub: 2 }, c: 'test C' };

      fromUtils.sortKeys(object);
      expect(object).toEqual({ a: 'test A', b: 'test B', c: 'test C', z: { bSub: 2, zSub: null as number } });
      /*tslint:enable:object-literal-sort-keys*/
    });
  });
});
