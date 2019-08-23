// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import {
  allOneItemErrors,
  findFrameCandidates,
  FrameCounterInterface,
  getBytesFromHex,
  getHexFromBytes,
  getRandomBytes,
  getRawBytesLengthMax,
  getRawBytesLengthMin,
  movingWindowSubArrays,
  SCRAMBLE_SEQUENCE,
  scrambleArray,
  TestCaseFrameCounterWithPayloadInterface,
  TestCaseIntegrityInterface
} from '../..';
import { frameModeToFrameConfigLookUp } from '../config';
import { FrameMode } from '../model';
import { Frame } from './frame';
import { mocked512RandomBytesA, mocked512RandomBytesB } from './frame-modes-benchmark.spec-data';

describe('FrameModesBenchmark', () => {
  describe('Integrity', () => {
    const runIntegrityTestCases = (frameMode: FrameMode, testCases: TestCaseIntegrityInterface[]) => {
      const frameConfig = frameModeToFrameConfigLookUp[frameMode];
      testCases.forEach(testCase => {
        const frameA = new Frame(frameConfig).setPayload(getBytesFromHex(testCase.payload));
        const rawBytes = frameA.getRawBytes().slice(0);
        const frameB = new Frame(frameConfig).setRawBytes(rawBytes);

        expect({ isValid: frameB.isValid(), rawBytes: getHexFromBytes(rawBytes) }).toEqual({
          isValid: true,
          rawBytes: testCase.expectedRawBytes
        });
      });
    };

    it('should work with 2 bytes of header, 1-8 bytes of payload and Fletcher-16 check sequence', () => {
      runIntegrityTestCases(FrameMode.Header2BytesPayloadLengthBetween1And8BytesFletcher16, [
        { expectedRawBytes: 'f5 d7 00 0a 14 1e 28 78 fa ff', payload: '00 0a 14 1e 28 78 fa ff' },
        { expectedRawBytes: 'e6 27 61 62 63 64 65 66 67 68', payload: '61 62 63 64 65 66 67 68' },
        { expectedRawBytes: 'e9 4f c4 05 b4 d4 77 dd 1e 88', payload: 'c4 05 b4 d4 77 dd 1e 88' },
        { expectedRawBytes: 'ce e7 8a da a3 ac 75 21 9b', payload: '8a da a3 ac 75 21 9b' },
        { expectedRawBytes: 'ad 17 1f a6 c0 de df d1', payload: '1f a6 c0 de df d1' },
        { expectedRawBytes: '80 07 4c 3b a2 f0 eb', payload: '4c 3b a2 f0 eb' },
        { expectedRawBytes: '70 c7 33 41 ec 66', payload: '33 41 ec 66' },
        { expectedRawBytes: '4d 7b 90 f0 f9', payload: '90 f0 f9' },
        { expectedRawBytes: '20 d1 ae 23', payload: 'ae 23' },
        { expectedRawBytes: '18 38 38', payload: '38' }
      ]);
    });

    it('should work with 3 bytes of header, 1-8 bytes of payload and SHA-1 check sequence', () => {
      runIntegrityTestCases(FrameMode.Header3BytesPayloadLengthBetween1And8BytesSha1, [
        { expectedRawBytes: 'e3 73 bc 00 0a 14 1e 28 78 fa ff', payload: '00 0a 14 1e 28 78 fa ff' },
        { expectedRawBytes: 'e2 5a f1 61 62 63 64 65 66 67 68', payload: '61 62 63 64 65 66 67 68' },
        { expectedRawBytes: 'e2 fc d2 c4 05 b4 d4 77 dd 1e 88', payload: 'c4 05 b4 d4 77 dd 1e 88' },
        { expectedRawBytes: 'cc b5 e0 8a da a3 ac 75 21 9b', payload: '8a da a3 ac 75 21 9b' },
        { expectedRawBytes: 'a2 df 80 1f a6 c0 de df d1', payload: '1f a6 c0 de df d1' },
        { expectedRawBytes: '9a db 5f 4c 3b a2 f0 eb', payload: '4c 3b a2 f0 eb' },
        { expectedRawBytes: '68 9d 87 33 41 ec 66', payload: '33 41 ec 66' },
        { expectedRawBytes: '54 d7 cc 90 f0 f9', payload: '90 f0 f9' },
        { expectedRawBytes: '2a 42 10 ae 23', payload: 'ae 23' },
        { expectedRawBytes: '1e 5d bb 38', payload: '38' }
      ]);
    });

    it('should work with 3 bytes of header, fixed 8 bytes of payload and SHA-1 check sequence', () => {
      runIntegrityTestCases(FrameMode.Header3BytesPayloadLengthFixedAt8BytesSha1, [
        { expectedRawBytes: '43 73 bc 00 0a 14 1e 28 78 fa ff', payload: '00 0a 14 1e 28 78 fa ff' },
        { expectedRawBytes: '42 5a f1 61 62 63 64 65 66 67 68', payload: '61 62 63 64 65 66 67 68' },
        { expectedRawBytes: '82 fc d2 c4 05 b4 d4 77 dd 1e 88', payload: 'c4 05 b4 d4 77 dd 1e 88' },
        { expectedRawBytes: '12 00 25 8a da a3 ac 75 21 9b 90', payload: '8a da a3 ac 75 21 9b 90' },
        { expectedRawBytes: '15 a4 c0 1f a6 c0 de df d1 f6 93', payload: '1f a6 c0 de df d1 f6 93' },
        { expectedRawBytes: 'af cf a6 4c 3b a2 f0 eb f1 05 86', payload: '4c 3b a2 f0 eb f1 05 86' },
        { expectedRawBytes: '08 b6 3e 33 41 ec 66 a8 44 6a 4a', payload: '33 41 ec 66 a8 44 6a 4a' },
        { expectedRawBytes: '76 d7 4c 90 f0 f9 d1 59 07 1f 4b', payload: '90 f0 f9 d1 59 07 1f 4b' },
        { expectedRawBytes: 'f7 be 6e ae 23 34 94 91 96 85 8c', payload: 'ae 23 34 94 91 96 85 8c' },
        { expectedRawBytes: 'db 72 a4 38 bf fd a9 f1 b9 31 06', payload: '38 bf fd a9 f1 b9 31 06' }
      ]);
    });
  });

  describe('Detect any single byte corruption', () => {
    const getInvalid = (payloadLength: number, frameMode: FrameMode) =>
      (frameModeToFrameConfigLookUp[frameMode].headerLength + payloadLength) * 255;
    const runOneByteErrorTestCases = (frameMode: FrameMode, testCases: TestCaseFrameCounterWithPayloadInterface[]) => {
      const frameConfig = frameModeToFrameConfigLookUp[frameMode];
      testCases.forEach(testCase => {
        const frame = new Frame(frameConfig).setPayload(getBytesFromHex(testCase.payload));
        const frameCounter: FrameCounterInterface = { invalid: 0, valid: 0, validFake: 0 };
        const rawBytes = frame.getRawBytes();

        frame.isValid() ? frameCounter.valid++ : frameCounter.invalid++;
        allOneItemErrors(rawBytes, () => (frame.isValid() ? frameCounter.validFake++ : frameCounter.invalid++));
        frame.isValid() ? frameCounter.valid++ : frameCounter.invalid++;
        expect(frameCounter).toEqual(testCase.frameCounter);
      });
    };

    it('should work with 2 bytes of header, 1-8 bytes of payload and Fletcher-16 check sequence', () => {
      const frameMode = FrameMode.Header2BytesPayloadLengthBetween1And8BytesFletcher16;
      const invalid = (bytesLess: number = 0) => getInvalid(8 + bytesLess, frameMode);
      runOneByteErrorTestCases(frameMode, [
        { frameCounter: { invalid: invalid(-0) - 2, valid: 2, validFake: 2 }, payload: '00 0a 14 1e 28 78 fa ff' }, // !
        { frameCounter: { invalid: invalid(-0), valid: 2, validFake: 0 }, payload: '61 62 63 64 65 66 67 68' },
        { frameCounter: { invalid: invalid(-0), valid: 2, validFake: 0 }, payload: 'c4 05 b4 d4 77 dd 1e 88' },
        { frameCounter: { invalid: invalid(-1), valid: 2, validFake: 0 }, payload: '8a da a3 ac 75 21 9b' },
        { frameCounter: { invalid: invalid(-2), valid: 2, validFake: 0 }, payload: '1f a6 c0 de df d1' },
        { frameCounter: { invalid: invalid(-3), valid: 2, validFake: 0 }, payload: '4c 3b a2 f0 eb' },
        { frameCounter: { invalid: invalid(-4), valid: 2, validFake: 0 }, payload: '33 41 ec 66' },
        { frameCounter: { invalid: invalid(-5), valid: 2, validFake: 0 }, payload: '90 f0 f9' },
        { frameCounter: { invalid: invalid(-6), valid: 2, validFake: 0 }, payload: 'ae 23' },
        { frameCounter: { invalid: invalid(-7), valid: 2, validFake: 0 }, payload: '38' }
      ]);
    });

    it('should work with 3 bytes of header, 1-8 bytes of payload and SHA-1 check sequence', () => {
      const frameMode = FrameMode.Header3BytesPayloadLengthBetween1And8BytesSha1;
      const invalid = (bytesLess: number = 0) => getInvalid(8 + bytesLess, frameMode);
      runOneByteErrorTestCases(frameMode, [
        { frameCounter: { invalid: invalid(-0), valid: 2, validFake: 0 }, payload: '00 0a 14 1e 28 78 fa ff' },
        { frameCounter: { invalid: invalid(-0), valid: 2, validFake: 0 }, payload: '61 62 63 64 65 66 67 68' },
        { frameCounter: { invalid: invalid(-0), valid: 2, validFake: 0 }, payload: 'c4 05 b4 d4 77 dd 1e 88' },
        { frameCounter: { invalid: invalid(-1), valid: 2, validFake: 0 }, payload: '8a da a3 ac 75 21 9b' },
        { frameCounter: { invalid: invalid(-2), valid: 2, validFake: 0 }, payload: '1f a6 c0 de df d1' },
        { frameCounter: { invalid: invalid(-3), valid: 2, validFake: 0 }, payload: '4c 3b a2 f0 eb' },
        { frameCounter: { invalid: invalid(-4), valid: 2, validFake: 0 }, payload: '33 41 ec 66' },
        { frameCounter: { invalid: invalid(-5), valid: 2, validFake: 0 }, payload: '90 f0 f9' },
        { frameCounter: { invalid: invalid(-6), valid: 2, validFake: 0 }, payload: 'ae 23' },
        { frameCounter: { invalid: invalid(-7), valid: 2, validFake: 0 }, payload: '38' }
      ]);
    });

    it('should work with 3 bytes of header, fixed 8 bytes of payload and SHA-1 check sequence', () => {
      const frameMode = FrameMode.Header3BytesPayloadLengthFixedAt8BytesSha1;
      const invalid = (bytesLess: number = 0) => getInvalid(8 + bytesLess, frameMode);
      runOneByteErrorTestCases(frameMode, [
        { frameCounter: { invalid: invalid(), valid: 2, validFake: 0 }, payload: '00 0a 14 1e 28 78 fa ff' },
        { frameCounter: { invalid: invalid(), valid: 2, validFake: 0 }, payload: '00 0a 14 1e 28 78 fa ff' },
        { frameCounter: { invalid: invalid(), valid: 2, validFake: 0 }, payload: '61 62 63 64 65 66 67 68' },
        { frameCounter: { invalid: invalid(), valid: 2, validFake: 0 }, payload: 'c4 05 b4 d4 77 dd 1e 88' },
        { frameCounter: { invalid: invalid(), valid: 2, validFake: 0 }, payload: '8a da a3 ac 75 21 9b 90' },
        { frameCounter: { invalid: invalid(), valid: 2, validFake: 0 }, payload: '1f a6 c0 de df d1 f6 93' },
        { frameCounter: { invalid: invalid(), valid: 2, validFake: 0 }, payload: '4c 3b a2 f0 eb f1 05 86' },
        { frameCounter: { invalid: invalid(), valid: 2, validFake: 0 }, payload: '33 41 ec 66 a8 44 6a 4a' },
        { frameCounter: { invalid: invalid(), valid: 2, validFake: 0 }, payload: '90 f0 f9 d1 59 07 1f 4b' },
        { frameCounter: { invalid: invalid(), valid: 2, validFake: 0 }, payload: 'ae 23 34 94 91 96 85 8c' },
        { frameCounter: { invalid: invalid(), valid: 2, validFake: 0 }, payload: '38 bf fd a9 f1 b9 31 06' }
      ]);
    });
  });

  describe('Frame detection in long random stream', () => {
    const localRun = false;
    const localRunRandomBytesLength = 1000 * 1e3;
    const localRunRandomBytesLengthHalf = Math.ceil(localRunRandomBytesLength / 2);
    const scramble = SCRAMBLE_SEQUENCE();
    const runDetectionTestCases = (
      frameMode: FrameMode,
      errorCorrectionEnabled: boolean,
      testCases: TestCaseFrameCounterWithPayloadInterface[]
    ) => {
      const frameConfig = frameModeToFrameConfigLookUp[frameMode];
      const min = getRawBytesLengthMin(frameConfig);
      const max = getRawBytesLengthMax(frameConfig);

      testCases.forEach(testCase => {
        const start = new Date().getTime();
        const frameCounter: FrameCounterInterface = {
          errorCorrectedInvalid: 0,
          errorCorrectedValid: 0,
          errorCorrectedValidFake: 0,
          invalid: 0,
          valid: 0,
          validFake: 0
        };
        let byteStream = localRun ? getRandomBytes(localRunRandomBytesLengthHalf) : mocked512RandomBytesA.slice(0);
        let frameNotScrambled: Frame;

        if (testCase.payload) {
          const payload = getBytesFromHex(testCase.payload);
          const frame = new Frame(frameConfig).setPayload(payload);
          frameNotScrambled = frame.clone();
          scrambleArray(frame.getRawBytes(), scramble);
          byteStream = byteStream.concat(frame.getRawBytes());
        }
        byteStream = byteStream.concat(
          localRun ? getRandomBytes(localRunRandomBytesLengthHalf) : mocked512RandomBytesB.slice(0)
        );

        movingWindowSubArrays(byteStream, min, max, rawBytes => {
          findFrameCandidates(
            rawBytes,
            scramble,
            frameConfig,
            errorCorrectionEnabled,
            (frameCandidate, isErrorCorrected) => {
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
        });

        if (localRun) {
          expect({
            byteStreamLength: byteStream.length,
            errorCorrectedInvalidFrameEvery: byteStream.length / frameCounter.errorCorrectedInvalid,
            executionTime: ((new Date().getTime() - start) / 1000).toFixed(1) + ' s',
            frameCounter,
            validFakeFrameEvery: byteStream.length / frameCounter.validFake
          }).toEqual({});
        } else {
          expect(frameCounter).toEqual(testCase.frameCounter);
        }
      });
    };

    it('should work with 2 bytes of header, 1-8 bytes of payload and Fletcher-16 check sequence', () => {
      runDetectionTestCases(FrameMode.Header2BytesPayloadLengthBetween1And8BytesFletcher16, false, [
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
        10 000 000 random bytes + 10 valid frame bytes + 10 000 000 random bytes
          - tests result A: { invalid: 159999691, validFake: 344, validReal: 1 }
          - tests result B: { invalid: 159999734, validFake: 301, validReal: 1 }
          - tests result C: { invalid: 159999716, validFake: 319, validReal: 1 }
        It means that statistically every ~62 thousands random bytes there is one fake valid frame.
        When transmission speed is 5 bytes per second then we should get a fake frame every ~3.5 hours.

        executionTime: '168.1 s', invalid: 135998536, valid: 1, validFake: 2075,
        byteStreamLength: 1000010, validFakeFrameEvery: 481.9
      */
    });

    it('should work with 3 bytes of header, 1-8 bytes of payload and SHA-1 check sequence', () => {
      runDetectionTestCases(FrameMode.Header3BytesPayloadLengthBetween1And8BytesSha1, false, [
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
      // executionTime: '616.7 s', invalid: 136000601, valid: 1, validFake: 10,
      // byteStreamLength: 1000011, validFakeFrameEvery: 100001.1
    });

    it('should work with 3 bytes of header, fixed 8 bytes of payload and SHA-1 check sequence', () => {
      runDetectionTestCases(FrameMode.Header3BytesPayloadLengthFixedAt8BytesSha1, false, [
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
      // executionTime: '85.1 s', invalid: 17000014, valid: 1, validFake: 2,
      // byteStreamLength: 1000011, validFakeFrameEvery: 500005.5
    });
  });
});
