// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { FRAME_MODE_TO_FRAME_CONFIG_INITIALIZER_LOOK_UP } from '@data-link-layer/config';
import { getFrameConfig } from '@data-link-layer/config-utils';
import { FRAME_COUNTER_WITH_ZEROS, GET_SCRAMBLE_SEQUENCE } from '@data-link-layer/constants';
import { mocked512RandomBytesA, mocked512RandomBytesB } from '@data-link-layer/frame/benchmark.spec-data';
import { createFrame } from '@data-link-layer/frame/frame';
import {
  ErrorCorrection,
  FrameConfig,
  FrameCounter,
  FrameInterface,
  FrameMode,
  ScramblerMode,
  TestCaseFrameCounterWithPayload,
  TestCaseFrameIntegrity
} from '@data-link-layer/model';
import { findFrameCandidates, scrambler } from '@data-link-layer/utils';
import { FixedSizeBuffer } from '@shared/fixed-size-buffer';
import { getBytesFromHex, getHexFromBytes, getRandomBytes } from '@shared/utils';

describe('Frame modes benchmark', (): void => {
  describe('Frame integrity', (): void => {
    const runIntegrityTestCases = (frameMode: FrameMode, testCases: TestCaseFrameIntegrity[]): void => {
      const frameConfig: FrameConfig = getFrameConfig(FRAME_MODE_TO_FRAME_CONFIG_INITIALIZER_LOOK_UP[frameMode]);
      testCases.forEach((testCase: TestCaseFrameIntegrity): void => {
        const frameA: FrameInterface = createFrame(frameConfig).setPayload(getBytesFromHex(testCase.payload));
        const rawBytes: number[] = frameA.getRawBytes().slice(0);
        const frameB: FrameInterface = createFrame(frameConfig).setRawBytes(rawBytes);

        expect({ isValid: frameB.isValid(), rawBytes: getHexFromBytes(rawBytes) }).toEqual({
          isValid: true,
          rawBytes: testCase.expectedRawBytes
        });
      });
    };

    it('should work with 2 bytes of header, 1-8 bytes of payload and CRC-16 check sequence', (): void => {
      runIntegrityTestCases(FrameMode.Header2BytesPayloadLengthBetween1And8BytesCrc16, [
        { expectedRawBytes: 'ef 8a 00 0a 14 1e 28 78 fa ff', payload: '00 0a 14 1e 28 78 fa ff' },
        { expectedRawBytes: 'f4 29 61 62 63 64 65 66 67 68', payload: '61 62 63 64 65 66 67 68' },
        { expectedRawBytes: 'ed f1 c4 05 b4 d4 77 dd 1e 88', payload: 'c4 05 b4 d4 77 dd 1e 88' },
        { expectedRawBytes: 'da 95 8a da a3 ac 75 21 9b', payload: '8a da a3 ac 75 21 9b' },
        { expectedRawBytes: 'a0 ce 1f a6 c0 de df d1', payload: '1f a6 c0 de df d1' },
        { expectedRawBytes: '87 b9 4c 3b a2 f0 eb', payload: '4c 3b a2 f0 eb' },
        { expectedRawBytes: '7a 93 33 41 ec 66', payload: '33 41 ec 66' },
        { expectedRawBytes: '4f 84 90 f0 f9', payload: '90 f0 f9' },
        { expectedRawBytes: '39 3d ae 23', payload: 'ae 23' },
        { expectedRawBytes: '12 01 38', payload: '38' }
      ]);
    });

    it('should work with 2 bytes of header, fixed 8 bytes of payload and CRC-16 check sequence', (): void => {
      runIntegrityTestCases(FrameMode.Header2BytesPayloadLengthFixedAt8BytesCrc16, [
        { expectedRawBytes: '4f 8a 00 0a 14 1e 28 78 fa ff', payload: '00 0a 14 1e 28 78 fa ff' },
        { expectedRawBytes: '74 29 61 62 63 64 65 66 67 68', payload: '61 62 63 64 65 66 67 68' },
        { expectedRawBytes: '4d f1 c4 05 b4 d4 77 dd 1e 88', payload: 'c4 05 b4 d4 77 dd 1e 88' },
        { expectedRawBytes: '03 5a 8a da a3 ac 75 21 9b 90', payload: '8a da a3 ac 75 21 9b 90' },
        { expectedRawBytes: '75 52 1f a6 c0 de df d1 f6 93', payload: '1f a6 c0 de df d1 f6 93' },
        { expectedRawBytes: '14 31 4c 3b a2 f0 eb f1 05 86', payload: '4c 3b a2 f0 eb f1 05 86' },
        { expectedRawBytes: '83 c3 33 41 ec 66 a8 44 6a 4a', payload: '33 41 ec 66 a8 44 6a 4a' },
        { expectedRawBytes: '42 fa 90 f0 f9 d1 59 07 1f 4b', payload: '90 f0 f9 d1 59 07 1f 4b' },
        { expectedRawBytes: '7a 03 ae 23 34 94 91 96 85 8c', payload: 'ae 23 34 94 91 96 85 8c' },
        { expectedRawBytes: '07 73 38 bf fd a9 f1 b9 31 06', payload: '38 bf fd a9 f1 b9 31 06' }
      ]);
    });

    it('should work with 3 bytes of header, 1-8 bytes of payload and CRC-24 check sequence', (): void => {
      runIntegrityTestCases(FrameMode.Header3BytesPayloadLengthBetween1And8BytesCrc24, [
        { expectedRawBytes: 'e7 9a d7 00 0a 14 1e 28 78 fa ff', payload: '00 0a 14 1e 28 78 fa ff' },
        { expectedRawBytes: 'e8 6c c1 61 62 63 64 65 66 67 68', payload: '61 62 63 64 65 66 67 68' },
        { expectedRawBytes: 'ec c0 30 c4 05 b4 d4 77 dd 1e 88', payload: 'c4 05 b4 d4 77 dd 1e 88' },
        { expectedRawBytes: 'c7 81 20 8a da a3 ac 75 21 9b', payload: '8a da a3 ac 75 21 9b' },
        { expectedRawBytes: 'ad b5 4c 1f a6 c0 de df d1', payload: '1f a6 c0 de df d1' },
        { expectedRawBytes: '8c a0 77 4c 3b a2 f0 eb', payload: '4c 3b a2 f0 eb' },
        { expectedRawBytes: '7d 54 3e 33 41 ec 66', payload: '33 41 ec 66' },
        { expectedRawBytes: '5a fb 7f 90 f0 f9', payload: '90 f0 f9' },
        { expectedRawBytes: '32 05 6c ae 23', payload: 'ae 23' },
        { expectedRawBytes: '09 77 8a 38', payload: '38' }
      ]);
    });

    it('should work with 3 bytes of header, fixed 8 bytes of payload and CRC-24 check sequence', (): void => {
      runIntegrityTestCases(FrameMode.Header3BytesPayloadLengthFixedAt8BytesCrc24, [
        { expectedRawBytes: '27 9a d7 00 0a 14 1e 28 78 fa ff', payload: '00 0a 14 1e 28 78 fa ff' },
        { expectedRawBytes: 'e8 6c c1 61 62 63 64 65 66 67 68', payload: '61 62 63 64 65 66 67 68' },
        { expectedRawBytes: '2c c0 30 c4 05 b4 d4 77 dd 1e 88', payload: 'c4 05 b4 d4 77 dd 1e 88' },
        { expectedRawBytes: 'c2 b2 4c 8a da a3 ac 75 21 9b 90', payload: '8a da a3 ac 75 21 9b 90' },
        { expectedRawBytes: 'da 7b 49 1f a6 c0 de df d1 f6 93', payload: '1f a6 c0 de df d1 f6 93' },
        { expectedRawBytes: '0b 7a e6 4c 3b a2 f0 eb f1 05 86', payload: '4c 3b a2 f0 eb f1 05 86' },
        { expectedRawBytes: '8f b5 d6 33 41 ec 66 a8 44 6a 4a', payload: '33 41 ec 66 a8 44 6a 4a' },
        { expectedRawBytes: 'f8 bc 90 90 f0 f9 d1 59 07 1f 4b', payload: '90 f0 f9 d1 59 07 1f 4b' },
        { expectedRawBytes: 'd1 86 12 ae 23 34 94 91 96 85 8c', payload: 'ae 23 34 94 91 96 85 8c' },
        { expectedRawBytes: '91 6e ff 38 bf fd a9 f1 b9 31 06', payload: '38 bf fd a9 f1 b9 31 06' }
      ]);
    });
  });

  describe('Frame detection in long raw bytes random stream', (): void => {
    const localExperiments = false;
    const randomBytesLength = 1000 * 1e3;
    const randomBytesLengthHalf = Math.ceil(randomBytesLength / 2);
    const scrambleSequence: number[] = GET_SCRAMBLE_SEQUENCE();
    const getRandomRawBytes = (firstPart: boolean): number[] => {
      return localExperiments
        ? getRandomBytes(randomBytesLengthHalf)
        : (firstPart ? mocked512RandomBytesA : mocked512RandomBytesB).slice(0);
    };
    const runDetectionTestCases = (
      frameMode: FrameMode,
      errorCorrection: ErrorCorrection,
      testCases: TestCaseFrameCounterWithPayload[]
    ): void => {
      const frameConfig: FrameConfig = getFrameConfig(FRAME_MODE_TO_FRAME_CONFIG_INITIALIZER_LOOK_UP[frameMode]);

      testCases.forEach((testCase: TestCaseFrameCounterWithPayload): void => {
        const { max, min } = frameConfig.rawBytesLength;
        const frameCounter: FrameCounter = { ...FRAME_COUNTER_WITH_ZEROS };
        const rawBytes = new FixedSizeBuffer<number>(max, min);
        const start = new Date().getTime();
        let frameNotScrambled: FrameInterface;
        let rawBytesLongStream: number[] = [];

        rawBytesLongStream = rawBytesLongStream.concat(getRandomRawBytes(true));
        if (testCase.payload) {
          const frame: FrameInterface = createFrame(frameConfig).setPayload(getBytesFromHex(testCase.payload));
          frameNotScrambled = frame.clone();
          scrambler(frame.getRawBytes(), ScramblerMode.Scramble, scrambleSequence);
          rawBytesLongStream = rawBytesLongStream.concat(frame.getRawBytes());
        }
        rawBytesLongStream = rawBytesLongStream.concat(getRandomRawBytes(false));

        for (let i = 0; i < rawBytesLongStream.length; i++) {
          rawBytes.insert(rawBytesLongStream[i]);
          if (rawBytes.isBelowMinimalLength()) {
            continue;
          }
          findFrameCandidates(
            rawBytes.data,
            scrambleSequence,
            frameConfig,
            errorCorrection,
            (frameCandidate, isErrorCorrected): void => {
              if (isErrorCorrected) {
                frameCandidate.isValid()
                  ? frameCandidate.isEqualTo(frameNotScrambled)
                    ? frameCounter.errorCorrectedValid++
                    : frameCounter.errorCorrectedValidFake++
                  : frameCounter.errorCorrectedInvalid++;
              } else {
                frameCandidate.isValid()
                  ? frameCandidate.isEqualTo(frameNotScrambled)
                    ? frameCounter.valid++
                    : frameCounter.validFake++
                  : frameCounter.invalid++;
              }
            }
          );
        }

        if (localExperiments) {
          expect({
            byteStreamLength: rawBytesLongStream.length,
            errorCorrectedInvalidFrameEvery: rawBytesLongStream.length / frameCounter.errorCorrectedInvalid,
            executionTime: ((new Date().getTime() - start) / 1000).toFixed(1) + ' s',
            frameCounter,
            validFakeFrameEvery: rawBytesLongStream.length / frameCounter.validFake
          }).toEqual({});
        } else {
          expect(frameCounter).toEqual(testCase.frameCounter);
        }
      });
    };

    it('should work with 2 bytes of header, 1-8 bytes of payload and CRC-16 check sequence', (): void => {
      runDetectionTestCases(FrameMode.Header2BytesPayloadLengthBetween1And8BytesCrc16, ErrorCorrection.Off, [
        {
          frameCounter: {
            errorCorrectedInvalid: 0,
            errorCorrectedValid: 0,
            errorCorrectedValidFake: 0,
            invalid: 139875,
            valid: 1,
            validFake: 0
          },
          payload: '77 b3 f9 61 5c 78 c7 9c'
        }
      ]);
      /*
        Test on large sample size - stream of ~1 million bytes without error correction:
          executionTime: '144.5 s', invalid: 135998534, valid: 1, validFake: 2077,
          byteStreamLength: 1000010, validFakeFrameEvery: 481.4684641309581
      */
    });

    it('should work with 2 bytes of header, fixed 8 bytes of payload and CRC-16 check sequence', (): void => {
      runDetectionTestCases(FrameMode.Header2BytesPayloadLengthFixedAt8BytesCrc16, ErrorCorrection.Off, [
        {
          frameCounter: {
            errorCorrectedInvalid: 0,
            errorCorrectedValid: 0,
            errorCorrectedValidFake: 0,
            invalid: 17424,
            valid: 1,
            validFake: 0
          },
          payload: '77 b3 f9 61 5c 78 c7 9c'
        }
      ]);
      /*
        Test on large sample size - stream of ~1 million bytes without error correction:
          executionTime: '23.7 s', invalid: 16999744, valid: 1, validFake: 272,
          byteStreamLength: 1000010, validFakeFrameEvery: 3676.5073529411766
      */
    });

    it('should work with 3 bytes of header, 1-8 bytes of payload and CRC-24 check sequence', (): void => {
      runDetectionTestCases(FrameMode.Header3BytesPayloadLengthBetween1And8BytesCrc24, ErrorCorrection.Off, [
        {
          frameCounter: {
            errorCorrectedInvalid: 0,
            errorCorrectedValid: 0,
            errorCorrectedValidFake: 0,
            invalid: 139875,
            valid: 1,
            validFake: 0
          },
          payload: '77 b3 f9 61 5c 78 c7 9c'
        }
      ]);
      /*
        Test on large sample size - stream of ~1 million bytes without error correction:
          executionTime: '162.2 s', invalid: 136000603, valid: 1, validFake: 8,
          byteStreamLength: 1000011, validFakeFrameEvery: 125001.375
      */
    });

    it('should work with 3 bytes of header, fixed 8 bytes of payload and CRC-24 check sequence', (): void => {
      runDetectionTestCases(FrameMode.Header3BytesPayloadLengthFixedAt8BytesCrc24, ErrorCorrection.Off, [
        {
          frameCounter: {
            errorCorrectedInvalid: 0,
            errorCorrectedValid: 0,
            errorCorrectedValidFake: 0,
            invalid: 17424,
            valid: 1,
            validFake: 0
          },
          payload: '77 b3 f9 61 5c 78 c7 9c'
        }
      ]);
      /*
        Test on large sample size - stream of ~1 million bytes without error correction:
          executionTime: '26.4 s', invalid: 17000015, valid: 1, validFake: 1,
          byteStreamLength: 1000011, validFakeFrameEvery: 1000011
      */
    });
  });
});
