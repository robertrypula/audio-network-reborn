// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import * as fromUtils from './utils';

describe('Utils', () => {
  describe('getAllOneByteErrors', () => {
    it('should generate all possible byte streams with one byte error', () => {
      const dataOriginal = [1, 2, 0];
      const data = dataOriginal.slice(0);
      const result: number[][] = [];

      fromUtils.getAllOneByteErrors(data, () => result.push(data.slice(0)), 3);
      expect(result).toEqual([[0, 2, 0], [2, 2, 0], [1, 0, 0], [1, 1, 0], [1, 2, 1], [1, 2, 2]]);
      expect(data).toEqual(dataOriginal);
    });

    it('should generate proper amount of all possible byte streams with one byte error', () => {
      const dataOriginal = [32, 34, 242];
      const data = dataOriginal.slice(0);
      let counter = 0;

      fromUtils.getAllOneByteErrors(data, () => counter++);
      expect(data).toEqual(dataOriginal);
      expect(counter).toEqual(dataOriginal.length * 255);
    });
  });

  describe('getMovingWindowSubArrays', () => {
    it('should properly extract sub arrays', () => {
      const result: number[][] = [];

      fromUtils.getMovingWindowSubArrays([100, 200, 300, 400, 500, 600, 700, 800, 900], 3, 5, subArray =>
        result.push(subArray)
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

      fromUtils.getMovingWindowSubArrays([100, 200, 300, 400], 3, 5, subArray => result.push(subArray));
      expect(result).toEqual([]);
    });
  });

  describe('getRawBytesLengthMax', () => {
    it('should ...', () => {
      expect(true).toBe(true); // TODO implement
    });
  });

  describe('getRawBytesLengthMin', () => {
    it('should ...', () => {
      expect(true).toBe(true); // TODO implement
    });
  });

  describe('getRightAlignedSubArrays', () => {
    it('should properly extract sub arrays', () => {
      const result: number[][] = [];

      fromUtils.getRightAlignedSubArrays([100, 200, 300, 400, 500, 600], 3, subArray => result.push(subArray));
      expect(result).toEqual([
        [100, 200, 300, 400, 500, 600],
        /**/ [200, 300, 400, 500, 600],
        /*     */ [300, 400, 500, 600],
        /*          */ [400, 500, 600]
      ]);
    });

    it('should return none when source arrays is smaller than minLength parameter', () => {
      const result: number[][] = [];

      fromUtils.getRightAlignedSubArrays([100], 3, subArray => result.push(subArray));
      expect(result).toEqual([]);
    });
  });
});
