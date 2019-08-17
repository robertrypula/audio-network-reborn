// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { getBytesFromHex, getBytesFromText, getRandomBytes, getTextFromBytes } from '../..';
import { frameModeToFrameConfigLookUp } from '../config';
import { FrameMode } from '../model';
import * as fromDataLinkLayerUtils from '../utils';
import { Frame } from './frame';

const frameMode = FrameMode.Header2BytesPayloadLengthBetween1And8BytesFletcher16;
const frameConfig = frameModeToFrameConfigLookUp[frameMode];

describe('FrameBenchmark', () => {
  it('should properly validate initially failing frame from real mobile/laptop transmission tests', () => {
    const payload = [0, 10, 20, 30, 40, 120, 250, 255];
    const frameA = new Frame(FrameMode.Header3BytesPayloadLengthBetween1And8BytesSha1).setPayload(payload);
    const rawBytes = frameA.getRawBytes().slice(0);
    const frameB = new Frame(FrameMode.Header3BytesPayloadLengthBetween1And8BytesSha1).setRawBytes(rawBytes);

    expect(rawBytes).toEqual([227, 115, 188, 0, 10, 20, 30, 40, 120, 250, 255]);
    expect(frameB.isValid()).toBe(true);
  });

  it('should properly validate initially failing frame from real mobile/laptop transmission tests', () => {
    const payload = [0, 10, 20, 30, 40, 120, 250, 255];
    const frameA = new Frame(frameMode).setPayload(payload);
    const rawBytes = frameA.getRawBytes().slice(0);
    const frameB = new Frame(frameMode).setRawBytes(rawBytes);

    expect(rawBytes).toEqual([245, 215, 0, 10, 20, 30, 40, 120, 250, 255]);
    expect(frameB.isValid()).toBe(true);
  });

  it('should detect errors when any of one byte is fully corrupted at given test payload', () => {
    const frame = new Frame(frameMode);
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
    const min = fromDataLinkLayerUtils.getRawBytesLengthMin(frameConfig);
    const max = fromDataLinkLayerUtils.getRawBytesLengthMax(frameConfig);
    const frameCounter = { validFake: 0, validReal: 0, invalid: 0 };
    const frameText = 'abcdefgh';
    const byteStream = [
      ...(useStoredRandom ? storedRandomA : getRandomBytes(10e6)),
      ...new Frame(frameMode).setPayload(getBytesFromText(frameText)).getRawBytes(),
      ...(useStoredRandom ? storedRandomB : getRandomBytes(10e6))
    ];

    fromDataLinkLayerUtils.getMovingWindowSubArrays(byteStream, min, max, (subArray) => {
      fromDataLinkLayerUtils.getRightAlignedSubArrays(subArray, min, (rawBytes) => {
        const frame = new Frame(frameMode).setRawBytes(rawBytes);
        frame.isValid()
          ? (getTextFromBytes(frame.getPayload()) === frameText
            ? frameCounter.validReal++
            : frameCounter.validFake++
          )
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
