// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { frameModeToFrameConfigLookUp } from '../config';
import { FrameMode } from '../model';
import * as fromUtils from '../utils';
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
    const payload = [0xF6, 0xF7, 0xF8, 0xF9, 0xFA, 0xFB, 0xFC, 0xFD];
    let framesValid = 0;
    let framesInvalid = 0;

    frame.setPayload(payload);
    expect(frame.isValid()).toBe(true);
    fromUtils.getAllOneByteErrors(frame.getRawBytes(), () => {
      frame.isValid() ? framesValid++ : framesInvalid++;
    });
    expect(frame.isValid()).toBe(true);
    expect([framesValid, framesInvalid]).toEqual([0, 255 * frame.getRawBytes().length]);
  });

  it('should detect expected number of frames in long random byte stream', () => {
    const useStoredRandom = true;
    const storedRandomA = [
      0x40, 0x1D, 0xFD, 0xF3, 0x87, 0x15, 0x2A, 0xD7, 0x3C, 0x45, 0xB6, 0x3C, 0x45, 0x55, 0x10, 0x96, 0x7A, 0xCB,
      0x5C, 0x9A, 0x36, 0x82, 0xD1, 0xF7, 0x87, 0x89, 0x9E, 0xA4, 0xBE, 0xBA, 0xDF, 0xD4, 0xBD, 0x97, 0xBA, 0x44,
      0x60, 0x07, 0xAE, 0x7A, 0x40, 0xF2, 0x7A, 0x51, 0x5B, 0x4B, 0xFF, 0x64, 0x67, 0x60, 0x66, 0x6C, 0x65, 0x24
    ];
    const storedRandomB = [
      0x3D, 0xBF, 0x80, 0x37, 0xD8, 0x24, 0x05, 0x2E, 0x26, 0xE7, 0xD5, 0x57, 0xA3, 0x06, 0xA3, 0xA8, 0x75, 0xC4,
      0x60, 0xA5, 0x4B, 0x3D, 0x18, 0x13, 0xD0, 0xD4, 0xC0, 0x7E, 0x2C, 0x10, 0xEB, 0xD6, 0x80, 0x17, 0xC6, 0xDD,
      0x67, 0x3E, 0x71, 0x0E, 0xC3, 0xDF, 0x76, 0xF6, 0x2A, 0xD9, 0xAF, 0x2A, 0x1D, 0xA9, 0x46, 0xE3, 0x7F, 0x38
    ];
    const min = fromUtils.getRawBytesLengthMin(frameConfig);
    const max = fromUtils.getRawBytesLengthMax(frameConfig);
    const frameCounter = { validFake: 0, validReal: 0, invalid: 0 };
    const frameText = 'abcdefgh';
    const byteStream = [
      ...(useStoredRandom ? storedRandomA : new Array(10e6).fill(0).map(() => fromUtils.getRandomInt(0, 255))),
      ...new Frame(frameMode).setPayload(fromUtils.getBytesFromString(frameText)).getRawBytes(),
      ...(useStoredRandom ? storedRandomB : new Array(10e6).fill(0).map(() => fromUtils.getRandomInt(0, 255)))
    ];

    fromUtils.getMovingWindowSubArrays(byteStream, min, max, (subArray) => {
      fromUtils.getRightAlignedSubArrays(subArray, min, (rawBytes) => {
        const frame = new Frame(frameMode).setRawBytes(rawBytes);
        frame.isValid()
          ? (fromUtils.getStringFromBytes(frame.getPayload()) === frameText
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
