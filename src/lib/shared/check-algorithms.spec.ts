// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { getFletcher16, getSha1 } from './check-algorithms';
import { CheckAlgorithmImplementation } from './model';
import { getBytesFromText, getHexFromBytes } from './utils';

interface TestCaseInterface {
  input: string;
  output: string;
}

describe('CheckAlgorithms', () => {
  const runTestCases = (checkAlgorithmImplementation: CheckAlgorithmImplementation, testCases: TestCaseInterface[]) => {
    testCases.forEach(testCase =>
      expect(getHexFromBytes(checkAlgorithmImplementation(getBytesFromText(testCase.input)))).toEqual(testCase.output)
    );
  };

  describe('getFletcher8', () => {
    it('should ...', () => {
      expect(true).toBe(true); // TODO implement or remove Fletcher8 from the code
    });
  });

  describe('getFletcher16', () => {
    it('should pass all test cases', () => {
      // Fletcher-16 test vectors taken from https://en.wikipedia.org/wiki/Fletcher%27s_checksum
      runTestCases(getFletcher16, [
        { input: 'abcde', output: 'c8 f0' },
        { input: 'abcdef', output: '20 57' },
        { input: 'abcdefgh', output: '06 27' }
      ]);
    });
  });

  describe('getSha1', () => {
    it('should pass all test cases', () => {
      // SHA-1 test vectors taken from https://www.di-mgt.com.au/sha_testvectors.html
      runTestCases(getSha1, [
        {
          input: '',
          output: 'da 39 a3 ee 5e 6b 4b 0d 32 55 bf ef 95 60 18 90 af d8 07 09'
        },
        {
          input: 'abc',
          output: 'a9 99 3e 36 47 06 81 6a ba 3e 25 71 78 50 c2 6c 9c d0 d8 9d'
        },
        {
          input: 'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq',
          output: '84 98 3e 44 1c 3b d2 6e ba ae 4a a1 f9 51 29 e5 e5 46 70 f1'
        },
        {
          input:
            'abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmn' +
            'hijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu',
          output: 'a4 9b 24 46 a0 2c 64 5b f4 19 f9 95 b6 70 91 25 3a 04 a2 59'
        }
      ]);
    });
  });
});
