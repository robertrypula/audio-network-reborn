// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import * as utils from './utils';

describe('Utils', () => {
  describe('getAllOneByteErrors', () => {
    it('should generate all possible byte streams with one byte error', () => {
      const dataOriginal = [1, 2, 0];
      const data = dataOriginal.slice(0);
      const result: number[][] = [];

      utils.getAllOneByteErrors(data, () => result.push(data.slice(0)), 3);
      expect(result).toEqual([[0, 2, 0], [2, 2, 0], [1, 0, 0], [1, 1, 0], [1, 2, 1], [1, 2, 2]]);
      expect(data).toEqual(dataOriginal);
    });

    it('should generate proper amount of all possible byte streams with one byte error', () => {
      const dataOriginal = [32, 34, 242];
      const data = dataOriginal.slice(0);
      let counter = 0;

      utils.getAllOneByteErrors(data, () => counter++);
      expect(data).toEqual(dataOriginal);
      expect(counter).toEqual(dataOriginal.length * 255);
    });
  });

  describe('getBytesFromHex', () => {
    it('should return array of char codes limited to range 0 - 255 from given string', () => {
      // TODO
      // expect(utils.getBytesFromHex('ab cd   \n ef43')).toEqual([0xab, 0xcd, 0xef, 0x43]);
    });
  });

  describe('getBytesFromText', () => {
    it('should return array of char codes limited to range 0 - 255 from given string', () => {
      expect(utils.getBytesFromText('abc\n')).toEqual([0x61, 0x62, 0x63, 0x0A]);
    });
  });

  describe('getHexFromBytes', () => {
    it('should return string with hex values from given bytes array', () => {
      expect(utils.getHexFromBytes([0x01, 0xFF, 0x43, 0x23, 0x100, 0xAB])).toEqual('01 ff 43 23 00 ab');
    });
  });

  describe('getMovingWindowSubArrays', () => {
    it('should properly extract sub arrays', () => {
      const result: number[][] = [];

      utils.getMovingWindowSubArrays(
        [100, 200, 300, 400, 500, 600, 700, 800, 900], 3, 5, (subArray) => result.push(subArray)
      );
      expect(result).toEqual([
        [100, 200, 300],
        [100, 200, 300, 400],
        [100, 200, 300, 400, 500],
        /**/ [200, 300, 400, 500, 600],
        /*     */ [300, 400, 500, 600, 700],
        /*          */ [400, 500, 600, 700, 800],
        /*               */ [500, 600, 700, 800, 900]
      ]);
    });

    it('should return empty array when data length is below lengthMax', () => {
      const result: number[][] = [];

      utils.getMovingWindowSubArrays([100, 200, 300, 400], 3, 5, (subArray) => result.push(subArray));
      expect(result).toEqual([]);
    });
  });

  describe('getRandomInt', () => {
    it('should ...', () => {
      expect(true).toBe(true);  // TODO implement
    });
  });

  describe('getRawBytesLengthMax', () => {
    it('should ...', () => {
      expect(true).toBe(true);  // TODO implement
    });
  });

  describe('getRawBytesLengthMin', () => {
    it('should ...', () => {
      expect(true).toBe(true);  // TODO implement
    });
  });

  describe('getRightAlignedSubArrays', () => {
    it('should properly extract sub arrays', () => {
      const result: number[][] = [];

      utils.getRightAlignedSubArrays([100, 200, 300, 400, 500, 600], 3, (subArray) => result.push(subArray));
      expect(result).toEqual([
        [100, 200, 300, 400, 500, 600],
        /* */[200, 300, 400, 500, 600],
        /*      */[300, 400, 500, 600],
        /*           */[400, 500, 600]
      ]);
    });

    it('should return none when source arrays is smaller than minLength parameter', () => {
      const result: number[][] = [];

      utils.getRightAlignedSubArrays([100], 3, (subArray) => result.push(subArray));
      expect(result).toEqual([]);
    });
  });

  describe('getTextFromBytes', () => {
    it('should return string from given array of bytes with unicode char codes limited to range 0-255', () => {
      expect(utils.getTextFromBytes([0x61, 0x62, 0x63, 0x0A])).toEqual('abc\n');
    });
  });
});
