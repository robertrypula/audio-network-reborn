// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { TestCaseInterface } from '@shared/model';
import { getUtf8BytesFromText } from '@shared/utf8/encode';
import { getHexFromBytes } from '@shared/utils';

describe('Utf8 encode', () => {
  describe('getUtf8BytesFromText', () => {
    const runTestCases = (testCases: TestCaseInterface[]) => {
      testCases.forEach(testCase => expect(getHexFromBytes(getUtf8BytesFromText(testCase.in))).toEqual(testCase.out));
    };

    it('should work', () => {
      runTestCases([
        { in: 'ąćęłńóśżź', out: 'c4 85 c4 87 c4 99 c5 82 c5 84 c3 b3 c5 9b c5 bc c5 ba' }, // Polish characters
        { in: 'ĄĆĘŁŃÓŚŻŹ', out: 'c4 84 c4 86 c4 98 c5 81 c5 83 c3 93 c5 9a c5 bb c5 b9' }, // Polish characters
        {
          in: 'Zażółć gęślą jaźń', // valid sentence with all Polish characters
          out: '5a 61 c5 bc c3 b3 c5 82 c4 87 20 67 c4 99 c5 9b 6c c4 85 20 6a 61 c5 ba c5 84'
        },
        { in: '대한민국', out: 'eb 8c 80 ed 95 9c eb af bc ea b5 ad' }, // 'South Korea' in Korean
        { in: '日本', out: 'e6 97 a5 e6 9c ac' }, // 'Japan' in Japanese
        { in: '中國', out: 'e4 b8 ad e5 9c 8b' }, // 'China' in Chinese
        { in: '€', out: 'e2 82 ac' } // Euro sign
      ]);
    });
  });
});
