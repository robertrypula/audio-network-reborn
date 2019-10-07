// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { FRAME_MODE_TO_FRAME_CONFIG_INITIALIZER_LOOK_UP } from '@data-link-layer/config';
import { getFrameConfig } from '@data-link-layer/config-utils';
import { FRAME_COUNTER_SIMPLE_WITH_ZEROS } from '@data-link-layer/constants';
import { Frame } from '@data-link-layer/frame/frame';
import { FrameConfig, FrameCounterSimple, FrameMode, ScramblerMode } from '@data-link-layer/model';
import * as fromUtils from '@data-link-layer/utils';

describe('Utils', () => {
  describe('allPossibleRightAlignedArrays', () => {
    it('should iterate through all possible arrays', () => {
      const result: number[][] = [];
      const lengthMin = 3;

      fromUtils.allPossibleRightAlignedArrays([100, 200, 300, 400, 500, 600], lengthMin, (output: number[]) =>
        result.push(output)
      );
      expect(result).toEqual([
        [100, 200, 300, 400, 500, 600],
        /**/ [200, 300, 400, 500, 600],
        /*     */ [300, 400, 500, 600],
        /*          */ [400, 500, 600]
      ]);
    });

    it('should not trigger callback if input array is smaller than minLength parameter', () => {
      const result: number[][] = [];
      const lengthMin = 3;

      fromUtils.allPossibleRightAlignedArrays([100], lengthMin, (output: number[]) => result.push(output));
      expect(result).toEqual([]);
    });
  });

  describe('allPossibleSinglePositionErrors', () => {
    it('should generate at single array reference all possible combinations with error at only one position', () => {
      const dataOriginal = [1, 2, 0];
      const data: number[] = dataOriginal.slice(0);
      const result: number[][] = [];
      const range = 3;

      fromUtils.allPossibleSinglePositionErrors(data, () => result.push(data.slice(0)), range);
      expect(result).toEqual([[0, 2, 0], [2, 2, 0], [1, 0, 0], [1, 1, 0], [1, 2, 1], [1, 2, 2]]);
      expect(data).toEqual(dataOriginal);
    });

    it('should generate proper amount of all possible combinations with error at only one position', () => {
      const dataOriginal = [32, 34, 242, 43, 65, 32, 65, 43, 13, 174];
      const data: number[] = dataOriginal.slice(0);
      let counter = 0;

      fromUtils.allPossibleSinglePositionErrors(data, () => counter++);
      expect(data).toEqual(dataOriginal);
      expect(counter).toEqual(dataOriginal.length * 255);
    });
  });

  describe('allPossibleUnScrambledArrays', () => {
    it('should iterate through all possible arrays for given scrambleSequence and unscramble them', () => {
      const result: number[][] = [];
      const scrambleSequence = [10, 20, 30, 12];

      fromUtils.allPossibleUnScrambledArrays([0, 100, 200], scrambleSequence, (scrambledArray: number[]) =>
        result.push(scrambledArray)
      );
      expect(result).toEqual([[256 - 10, 80, 170], [256 - 20, 70, 188], [256 - 30, 88, 190], [256 - 12, 90, 180]]);
    });

    it('should iterate through all possible arrays for given scrambleSeq. and unscramble them (range check)', () => {
      const result: number[][] = [];
      const scrambleSequence = [25, 26];
      const range = 20;

      fromUtils.allPossibleUnScrambledArrays(
        [16, 2],
        scrambleSequence,
        (output: number[]) => result.push(output),
        range
      );
      expect(result).toEqual([[11, 16], [10, 17]]);
    });
  });

  describe('findFrameCandidates', () => {
    it('should find all possible frame candidates', () => {
      const frameMode: FrameMode = FrameMode.Header3BytesPayloadLengthBetween1And8BytesCrc24;
      const frameConfig: FrameConfig = getFrameConfig(FRAME_MODE_TO_FRAME_CONFIG_INITIALIZER_LOOK_UP[frameMode]);
      const { min } = frameConfig.rawBytesLength;
      const rawBytes = [32, 34, 242, 43, 65, 32, 65, 43, 13, 174, 52];
      const scrambleSequence = [20, 60];
      const frameCounterSimple: FrameCounterSimple = { ...FRAME_COUNTER_SIMPLE_WITH_ZEROS };
      const nonErrorCorrected: number = scrambleSequence.length * (rawBytes.length - min + 1);
      const errorCorrected: number = nonErrorCorrected * 0.5 * (rawBytes.length + min) * 255;
      const nonErrorCorrectedRawBytes: number[][] = [];

      fromUtils.findFrameCandidates(
        rawBytes,
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

  describe('scrambler', () => {
    it('should properly scramble the data in the array', () => {
      const data = [32, 10, 20, 30, 100, 200];
      const scrambleSequence = [10, 20, 30, 12];

      fromUtils.scrambler(data, ScramblerMode.Scramble, scrambleSequence);
      expect(data).toEqual([42, 30, 50, 42, 110, 220]);
    });

    it('should properly un-scramble the data in the array', () => {
      const data = [42, 30, 50, 42, 110, 220];
      const scrambleSequence = [10, 20, 30, 12];

      fromUtils.scrambler(data, ScramblerMode.UnScramble, scrambleSequence);
      expect(data).toEqual([32, 10, 20, 30, 100, 200]);
    });

    it('should properly scramble the data in the array (range and offset test)', () => {
      const range = 50;
      const data = [45, 5, 15, range + 49];
      const scrambleSequence = [20, 5, range + 1];
      const offset = scrambleSequence.length + 1;

      fromUtils.scrambler(data, ScramblerMode.Scramble, scrambleSequence, offset, range);
      expect(data).toEqual([0, 6, 35, 4]);
    });

    it('should properly un-scramble the data in the array (range and offset test)', () => {
      const range = 50;
      const data = [0, 6, 35, range + 4];
      const scrambleSequence = [20, 5, range + 1];
      const offset = scrambleSequence.length + 1;

      fromUtils.scrambler(data, ScramblerMode.UnScramble, scrambleSequence, offset, range);
      expect(data).toEqual([45, 5, 15, 49]);
    });
  });
});
