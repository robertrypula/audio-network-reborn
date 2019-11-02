// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { TestCaseInOut } from '@shared/model';
import { getTextFromUtf8Bytes } from '@shared/utf8/decode';
import { getBytesFromHex } from '@shared/utils';

describe('Utf8 decode', (): void => {
  describe('getTextFromUtf8Bytes', (): void => {
    const runTestCases = (testCases: TestCaseInOut[]): void => {
      testCases.forEach((testCase: TestCaseInOut): void => {
        expect(getTextFromUtf8Bytes(getBytesFromHex(testCase.in))).toEqual(testCase.out);
      });
    };

    it('should work', (): void => {
      runTestCases([
        { in: 'c4 85 c4 87 c4 99 c5 82 c5 84 c3 b3 c5 9b c5 bc c5 ba', out: 'ąćęłńóśżź' }, // Polish characters
        { in: 'c4 84 c4 86 c4 98 c5 81 c5 83 c3 93 c5 9a c5 bb c5 b9', out: 'ĄĆĘŁŃÓŚŻŹ' }, // Polish characters
        {
          in: '5a 61 c5 bc c3 b3 c5 82 c4 87 20 67 c4 99 c5 9b 6c c4 85 20 6a 61 c5 ba c5 84',
          out: 'Zażółć gęślą jaźń' // valid sentence with all Polish characters
        },
        { in: 'eb 8c 80 ed 95 9c eb af bc ea b5 ad', out: '대한민국' }, // 'South Korea' in Korean
        { in: 'e6 97 a5 e6 9c ac', out: '日本' }, // 'Japan' in Japanese
        { in: 'e4 b8 ad e5 9c 8b', out: '中國' }, // 'China' in Chinese
        { in: 'e2 82 ac', out: '€' } // Euro sign
      ]);
    });
  });
});
