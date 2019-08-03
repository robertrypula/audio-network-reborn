import * as utils from './utils';

describe('Utils', () => {
  describe('getAllOneByteErrorsInPlace', () => {
    it('should generate all possible byte streams with one byte error', () => {
      const dataOriginal = [1, 2, 0];
      const data = dataOriginal.slice(0);
      const result: number[][] = [];

      utils.getAllOneByteErrorsInPlace(data, () => result.push(data.slice(0)), 3);
      expect(result).toEqual([[0, 2, 0], [2, 2, 0], [1, 0, 0], [1, 1, 0], [1, 2, 1], [1, 2, 2]]);
      expect(data).toEqual(dataOriginal);
    });

    it('should generate proper amount of all possible byte streams with one byte error', () => {
      const dataOriginal = [32, 34, 242];
      const data = dataOriginal.slice(0);
      let counter = 0;

      utils.getAllOneByteErrorsInPlace(data, () => counter++);
      expect(data).toEqual(dataOriginal);
      expect(counter).toEqual(dataOriginal.length * 255);
    });
  });

  describe('getBytesFromString', () => {
    it('should return array of char codes limited to range 0 - 255 from given string', () => {
      expect(utils.getBytesFromString('abc\n')).toEqual([0x61, 0x62, 0x63, 0x0A]);
    });
  });

  describe('getFletcher8', () => {
    it('should ...', () => {
      expect(true).toBe(true);  // TODO implement
    });
  });

  describe('getFletcher16', () => {
    it('should return valid checksum', () => {
      const testCases = [
        { input: 'abcde', output: [0xC8, 0xF0] },
        { input: 'abcdef', output: [0x20, 0x57] },
        { input: 'abcdefgh', output: [0x06, 0x27] }
      ];
      testCases.forEach((testCase) =>
        expect(utils.getFletcher16(utils.getBytesFromString(testCase.input))).toEqual(testCase.output)
      );
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
        /* */[200, 300, 400, 500, 600],
        /*      */[300, 400, 500, 600, 700],
        /*           */[400, 500, 600, 700, 800],
        /*                */[500, 600, 700, 800, 900]
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

  describe('getStringFromBytes', () => {
    it('should return string from given array of bytes with unicode char codes limited to range 0-255', () => {
      expect(utils.getStringFromBytes([0x61, 0x62, 0x63, 0x0A])).toEqual('abc\n');
    });
  });
});
