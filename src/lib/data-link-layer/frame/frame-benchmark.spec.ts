// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import {
  getBytesFromHex,
  getBytesFromText,
  getHexFromBytes,
  getRandomBytes,
  getTextFromBytes,
  IntegrityTestCaseInterface
} from '../..';
import { frameModeToFrameConfigLookUp } from '../config';
import { FrameMode } from '../model';
import * as fromDataLinkLayerUtils from '../utils';
import { Frame } from './frame';

const gFrameMode = FrameMode.Header2BytesPayloadLengthBetween1And8BytesFletcher16;
const gFrameConfig = frameModeToFrameConfigLookUp[gFrameMode];

describe('FrameModesBenchmark', () => {
  describe('Integrity', () => {
    const runIntegrityTestCases = (frameMode: FrameMode, integrityTestCases: IntegrityTestCaseInterface[]) => {
      integrityTestCases.forEach(testCase => {
        const frameA = new Frame(frameMode).setPayload(getBytesFromHex(testCase.payload));
        const rawBytes = frameA.getRawBytes().slice(0);
        const frameB = new Frame(frameMode).setRawBytes(rawBytes);

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

  it('should detect errors when any of one byte is fully corrupted at given test payload', () => {
    const frame = new Frame(gFrameMode);
    const payload = getBytesFromHex('f6 f7 f8 f9 fa fb fc fd');
    let framesValid = 0;
    let framesInvalid = 0;

    frame.setPayload(payload);
    expect(frame.isValid()).toBe(true);
    fromDataLinkLayerUtils.getAllOneByteErrors(frame.getRawBytes(), () => {
      frame.isValid() ? framesValid++ : framesInvalid++;
    });
    expect(frame.isValid()).toBe(true);
    expect([framesValid, framesInvalid]).toEqual([0, 255 * frame.getRawBytes().length]);
  });

  it('should detect expected number of frames in long random byte stream', () => {
    const useStoredRandom = true;
    const storedRandomA = getBytesFromHex(`
      40 1d fd f3 87 15 2a d7 3c 45 b6 3c 45 55 10 96 7a cb 5c 9a 36 82 d1 f7 87 89 9e
      a4 be ba df d4 bd 97 ba 44 60 07 ae 7a 40 f2 7a 51 5b 4b ff 64 67 60 66 6c 65 24
    `);
    const storedRandomB = getBytesFromHex(`
      3d bf 80 37 d8 24 05 2e 26 e7 d5 57 a3 06 a3 a8 75 c4 60 a5 4b 3d 18 13 d0 d4 c0
      7e 2c 10 eb d6 80 17 c6 dd 67 3e 71 0e c3 df 76 f6 2a d9 af 2a 1d a9 46 e3 7f 38
    `);
    const min = fromDataLinkLayerUtils.getRawBytesLengthMin(gFrameConfig);
    const max = fromDataLinkLayerUtils.getRawBytesLengthMax(gFrameConfig);
    const frameCounter = { validFake: 0, validReal: 0, invalid: 0 };
    const frameText = 'abcdefgh';
    const byteStream = [
      ...(useStoredRandom ? storedRandomA : getRandomBytes(10e6)),
      ...new Frame(gFrameMode).setPayload(getBytesFromText(frameText)).getRawBytes(),
      ...(useStoredRandom ? storedRandomB : getRandomBytes(10e6))
    ];

    fromDataLinkLayerUtils.getMovingWindowSubArrays(byteStream, min, max, subArray => {
      fromDataLinkLayerUtils.getRightAlignedSubArrays(subArray, min, rawBytes => {
        const frame = new Frame(gFrameMode).setRawBytes(rawBytes);
        frame.isValid()
          ? getTextFromBytes(frame.getPayload()) === frameText
            ? frameCounter.validReal++
            : frameCounter.validFake++
          : frameCounter.invalid++;
      });
    });
    expect(frameCounter).toEqual({ invalid: 899, validFake: 0, validReal: 1 });
    /*
      10 000 000 random bytes + 10 valid frame bytes + 10 000 000 random bytes
        - tests result A: { invalid: 159999691, validFake: 344, validReal: 1 }
        - tests result B: { invalid: 159999734, validFake: 301, validReal: 1 }
        - tests result C: { invalid: 159999716, validFake: 319, validReal: 1 }
      It means that statistically every ~62 thousands random bytes there is one fake valid frame.
      When transmission speed is 5 bytes per second then we should get a fake frame every ~3.5 hours.
     */
  });
});
