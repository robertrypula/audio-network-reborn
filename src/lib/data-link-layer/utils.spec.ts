// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import * as fromUtils from './utils';

describe('Utils', () => {
  describe('allOneItemErrors', () => {
    it('should generate at single array reference all possible combinations with error at only one position', () => {
      const dataOriginal = [1, 2, 0];
      const data = dataOriginal.slice(0);
      const result: number[][] = [];

      fromUtils.allOneItemErrors(data, () => result.push(data.slice(0)), 3);
      expect(result).toEqual([[0, 2, 0], [2, 2, 0], [1, 0, 0], [1, 1, 0], [1, 2, 1], [1, 2, 2]]);
      expect(data).toEqual(dataOriginal);
    });

    it('should generate proper amount of all possible combinations with error at only one position', () => {
      const dataOriginal = [32, 34, 242];
      const data = dataOriginal.slice(0);
      let counter = 0;

      fromUtils.allOneItemErrors(data, () => counter++);
      expect(data).toEqual(dataOriginal);
      expect(counter).toEqual(dataOriginal.length * 255);
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

  describe('movingWindowSubArrays', () => {
    it('should properly extract sub arrays', () => {
      const result: number[][] = [];

      fromUtils.movingWindowSubArrays([100, 200, 300, 400, 500, 600, 700, 800, 900], 3, 5, subArray =>
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

      fromUtils.movingWindowSubArrays([100, 200, 300, 400], 3, 5, subArray => result.push(subArray));
      expect(result).toEqual([]);
    });
  });

  describe('rightAlignedSubArrays', () => {
    it('should properly extract sub arrays', () => {
      const result: number[][] = [];

      fromUtils.rightAlignedSubArrays([100, 200, 300, 400, 500, 600], 3, subArray => result.push(subArray));
      expect(result).toEqual([
        [100, 200, 300, 400, 500, 600],
        /**/ [200, 300, 400, 500, 600],
        /*     */ [300, 400, 500, 600],
        /*          */ [400, 500, 600]
      ]);
    });

    it('should return none when source arrays is smaller than minLength parameter', () => {
      const result: number[][] = [];

      fromUtils.rightAlignedSubArrays([100], 3, subArray => result.push(subArray));
      expect(result).toEqual([]);
    });
  });

  describe('scrambledSubArrays', () => {
    it('should properly return as sub arrays with scrambled data', () => {
      const result: number[][] = [];
      const scrambleList = [10, 20, 30, 12];

      fromUtils.scrambledSubArrays([200, 300, 400], scrambleList, true, subArray => result.push(subArray));
      expect(result).toEqual([[210, 320, 430], [220, 330, 412], [230, 312, 410], [212, 310, 420]]);
    });

    it('should properly return as sub arrays with scrambled data', () => {
      const result: number[][] = [];
      const scrambleList = [10, 20, 30, 12];

      fromUtils.scrambledSubArrays([200, 300, 400], scrambleList, false, subArray => result.push(subArray));
      expect(result).toEqual([[190, 280, 370], [180, 270, 388], [170, 288, 390], [188, 290, 380]]);
    });
  });
});
