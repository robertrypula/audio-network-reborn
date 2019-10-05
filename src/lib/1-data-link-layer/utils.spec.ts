// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { FRAME_MODE_TO_FRAME_CONFIG_INITIALIZER_LOOK_UP } from '@data-link-layer/config';
import { getFrameConfig } from '@data-link-layer/config-utils';
import { Frame } from '@data-link-layer/frame/frame';
import { FrameConfig, FrameCounterSimple, FrameMode } from '@data-link-layer/model';
import * as fromUtils from '@data-link-layer/utils';

describe('Utils', () => {
  describe('allOneItemErrors', () => {
    it('should generate at single array reference all possible combinations with error at only one position', () => {
      const dataOriginal = [1, 2, 0];
      const data: number[] = dataOriginal.slice(0);
      const result: number[][] = [];

      fromUtils.allOneItemErrors(data, () => result.push(data.slice(0)), 3);
      expect(result).toEqual([[0, 2, 0], [2, 2, 0], [1, 0, 0], [1, 1, 0], [1, 2, 1], [1, 2, 2]]);
      expect(data).toEqual(dataOriginal);
    });

    it('should generate proper amount of all possible combinations with error at only one position', () => {
      const dataOriginal = [32, 34, 242, 43, 65, 32, 65, 43, 13, 174];
      const data: number[] = dataOriginal.slice(0);
      let counter = 0;

      fromUtils.allOneItemErrors(data, () => counter++);
      expect(data).toEqual(dataOriginal);
      expect(counter).toEqual(dataOriginal.length * 255);
    });
  });

  describe('findFrameCandidates', () => {
    it('should find all possible frame candidates', () => {
      const frameMode: FrameMode = FrameMode.Header3BytesPayloadLengthBetween1And8BytesCrc24;
      const frameConfig: FrameConfig = getFrameConfig(FRAME_MODE_TO_FRAME_CONFIG_INITIALIZER_LOOK_UP[frameMode]);
      const bytes = [32, 34, 242, 43, 65, 32, 65, 43, 13, 174, 52];
      const scrambleSequence = [20, 60];
      const frameCounterSimple: FrameCounterSimple = { errorCorrected: 0, nonErrorCorrected: 0 };
      const nonErrorCorrected: number = scrambleSequence.length * (bytes.length - frameConfig.rawBytesLength.min + 1);
      const errorCorrected: number = nonErrorCorrected * 0.5 * (bytes.length + frameConfig.rawBytesLength.min) * 255;
      const nonErrorCorrectedRawBytes: number[][] = [];

      fromUtils.findFrameCandidates(
        bytes,
        scrambleSequence,
        frameConfig,
        true,
        (frameCandidate: Frame, isErrorCorrected: boolean) => {
          isErrorCorrected ? frameCounterSimple.errorCorrected++ : frameCounterSimple.nonErrorCorrected++;
          if (!isErrorCorrected) {
            nonErrorCorrectedRawBytes.push(frameCandidate.getRawBytes());
          }
        }
      );
      expect(frameCounterSimple).toEqual({ errorCorrected, nonErrorCorrected });
      expect(nonErrorCorrectedRawBytes).toEqual([
        [12, 230, 222, 239, 45, 228, 45, 239, 249, 114, 32],
        [230, 222, 239, 45, 228, 45, 239, 249, 114, 32],
        [222, 239, 45, 228, 45, 239, 249, 114, 32],
        [239, 45, 228, 45, 239, 249, 114, 32],
        [45, 228, 45, 239, 249, 114, 32],
        [228, 45, 239, 249, 114, 32],
        [45, 239, 249, 114, 32],
        [239, 249, 114, 32],
        [228, 14, 182, 23, 5, 12, 5, 23, 209, 154, 248],
        [14, 182, 23, 5, 12, 5, 23, 209, 154, 248],
        [182, 23, 5, 12, 5, 23, 209, 154, 248],
        [23, 5, 12, 5, 23, 209, 154, 248],
        [5, 12, 5, 23, 209, 154, 248],
        [12, 5, 23, 209, 154, 248],
        [5, 23, 209, 154, 248],
        [23, 209, 154, 248]
      ]);
    });
  });

  describe('rightAlignedSubArrays', () => {
    it('should properly extract sub arrays', () => {
      const result: number[][] = [];

      fromUtils.rightAlignedSubArrays([100, 200, 300, 400, 500, 600], 3, (subArray: number[]) => result.push(subArray));
      expect(result).toEqual([
        [100, 200, 300, 400, 500, 600],
        /**/ [200, 300, 400, 500, 600],
        /*     */ [300, 400, 500, 600],
        /*          */ [400, 500, 600]
      ]);
    });

    it('should return none when source arrays is smaller than minLength parameter', () => {
      const result: number[][] = [];

      fromUtils.rightAlignedSubArrays([100], 3, (subArray: number[]) => result.push(subArray));
      expect(result).toEqual([]);
    });
  });

  describe('scrambleArray', () => {
    it('should properly scramble the data in the array', () => {
      const data = [32];
      const scrambleSequence = [10, 20, 30, 12];

      // TODO improve test case
      fromUtils.scrambleArray(data, scrambleSequence, 4, true);
      expect(data).toEqual([42]);
    });
  });

  describe('scrambledSubArrays', () => {
    it('should properly return sub arrays with scrambled data', () => {
      const result: number[][] = [];
      const scrambleSequence = [10, 20, 30, 12];

      fromUtils.scrambledSubArrays([0, 100, 200], scrambleSequence, true, (subArray: number[]) =>
        result.push(subArray)
      );
      expect(result).toEqual([[10, 120, 230], [20, 130, 212], [30, 112, 210], [12, 110, 220]]);
    });

    it('should properly return sub arrays with un-scrambled data', () => {
      const result: number[][] = [];
      const scrambleSequence = [10, 20, 30, 12];

      fromUtils.scrambledSubArrays([0, 100, 200], scrambleSequence, false, (subArray: number[]) =>
        result.push(subArray)
      );
      expect(result).toEqual([[256 - 10, 80, 170], [256 - 20, 70, 188], [256 - 30, 88, 190], [256 - 12, 90, 180]]);
    });

    it('should properly return sub arrays with scrambled data (range check)', () => {
      const result: number[][] = [];
      const scrambleSequence = [25, 26];

      fromUtils.scrambledSubArrays([16, 2], scrambleSequence, true, (subArray: number[]) => result.push(subArray), 20);
      expect(result).toEqual([[1, 8], [2, 7]]);
    });

    it('should properly return sub arrays with un-scrambled data (range check)', () => {
      const result: number[][] = [];
      const scrambleSequence = [25, 26];

      fromUtils.scrambledSubArrays([16, 2], scrambleSequence, false, (subArray: number[]) => result.push(subArray), 20);
      expect(result).toEqual([[11, 16], [10, 17]]);
    });
  });
});
