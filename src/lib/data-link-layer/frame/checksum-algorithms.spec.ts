// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import * as utils from '../utils';
import * as checksumAlgorithms from './checksum-algorithms';

describe('ChecksumAlgorithms', () => {
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
        expect(checksumAlgorithms.getFletcher16(utils.getBytesFromString(testCase.input))).toEqual(testCase.output)
      );
    });
  });
});
