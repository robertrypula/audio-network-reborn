// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { getCheckAlgorithmImplementation } from '@shared/check-algorithms/check-algorithms';
import { CheckAlgorithm, CheckAlgorithmImplementation, TestCase } from '@shared/model';
import { getBytesFromText, getHexFromBytes } from '@shared/utils';

describe('CheckAlgorithms', () => {
  const runTestCases = (checkAlgorithmImplementation: CheckAlgorithmImplementation, testCases: TestCase[]) => {
    testCases.forEach((testCase: TestCase) =>
      expect(getHexFromBytes(checkAlgorithmImplementation(getBytesFromText(testCase.in)))).toEqual(testCase.out)
    );
  };

  describe('getCrc08', () => {
    it('should pass all test cases', () => {
      // Verified at: http://www.sunshine2k.de/coding/javascript/crc/crc_js.html (CRC8)
      runTestCases(getCheckAlgorithmImplementation(CheckAlgorithm.Crc08), [
        { in: 'abcde', out: '52' },
        { in: 'abcdef', out: '8c' },
        { in: 'abcdefgh', out: 'cb' },
        { in: 'The quick brown fox jumps over the lazy dog', out: 'c1' }
      ]);
    });
  });

  describe('getCrc16', () => {
    it('should pass all test cases', () => {
      // Verified at: http://www.sunshine2k.de/coding/javascript/crc/crc_js.html (CRC16_ARC)
      runTestCases(getCheckAlgorithmImplementation(CheckAlgorithm.Crc16), [
        { in: 'abcde', out: '85 b8' },
        { in: 'abcdef', out: '58 05' },
        { in: 'abcdefgh', out: '74 29' },
        { in: 'The quick brown fox jumps over the lazy dog', out: 'fc df' }
      ]);
    });
  });

  describe('getCrc24', () => {
    it('should pass all test cases', () => {
      // Verified by npm package: https://www.npmjs.com/package/polycrc
      runTestCases(getCheckAlgorithmImplementation(CheckAlgorithm.Crc24), [
        { in: 'abcde', out: 'd7 49 3c' },
        { in: 'abcdef', out: '35 a8 3f' },
        { in: 'abcdefgh', out: 'e8 6c c1' },
        { in: 'The quick brown fox jumps over the lazy dog', out: 'a2 61 8c' }
      ]);
    });
  });

  describe('getCrc32', () => {
    it('should pass all test cases', () => {
      // Verified at: http://www.sunshine2k.de/coding/javascript/crc/crc_js.html (CRC32)
      runTestCases(getCheckAlgorithmImplementation(CheckAlgorithm.Crc32), [
        { in: 'abcde', out: '85 87 d8 65' },
        { in: 'abcdef', out: '4b 8e 39 ef' },
        { in: 'abcdefgh', out: 'ae ef 2a 50' },
        { in: 'The quick brown fox jumps over the lazy dog', out: '41 4f a3 39' }
      ]);
    });
  });

  describe('getSha1', () => {
    it('should pass all test cases', () => {
      // SHA-1 'abc...' test vectors from https://www.di-mgt.com.au/sha_testvectors.html
      runTestCases(getCheckAlgorithmImplementation(CheckAlgorithm.Sha1), [
        {
          in: '',
          out: 'da 39 a3 ee 5e 6b 4b 0d 32 55 bf ef 95 60 18 90 af d8 07 09'
        },
        {
          in: 'abc',
          out: 'a9 99 3e 36 47 06 81 6a ba 3e 25 71 78 50 c2 6c 9c d0 d8 9d'
        },
        {
          in: 'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq',
          out: '84 98 3e 44 1c 3b d2 6e ba ae 4a a1 f9 51 29 e5 e5 46 70 f1'
        },
        {
          in:
            'abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmn' +
            'hijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu',
          out: 'a4 9b 24 46 a0 2c 64 5b f4 19 f9 95 b6 70 91 25 3a 04 a2 59'
        },
        {
          in: 'The quick brown fox jumps over the lazy dog',
          out: '2f d4 e1 c6 7a 2d 28 fc ed 84 9e e1 bb 76 e7 39 1b 93 eb 12'
        }
      ]);
    });
  });
});
