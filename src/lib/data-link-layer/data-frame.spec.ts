// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import * as fromConstants from './constants';
import { DataFrame } from './data-frame';
import * as utils from './utils';

/*tslint:disable:no-bitwise*/

describe('DataFrame', () => {
  it('should return correct payload\'s length from header', () => {
    const dataFrame = new DataFrame();
    const payload = [10, 20, 30, 40];

    expect(dataFrame.setPayload(payload).getLengthFromRawBytes()).toBe(payload.length);
  });

  it('should properly generate raw bytes (header + payload) for given payload', () => {
    const dataFrame = new DataFrame();
    const payload = [0x06, 0x07, 0x08, 0x09, 0x0A];
    const fakeChecksum = [0x0A, 0x0B];
    const headerBytes = [
      (((payload.length - fromConstants.FRAME_PAYLOAD_LENGTH_OFFSET) & 0x07) << 5) | (fakeChecksum[0] & 0x1F),
      fakeChecksum[1]
    ];

    spyOn(utils, 'getFletcher16').and.returnValue(fakeChecksum);
    expect(dataFrame.setPayload(payload).getRawBytes()).toEqual([...headerBytes, ...payload]);
  });

  it('should detect errors', () => {
    const dataFrame = new DataFrame();
    const payload = [0xF6, 0xF7, 0xF8, 0xF9, 0xFA, 0xFB, 0xFC, 0xFD];

    dataFrame.setPayload(payload);
    expect(dataFrame.isValid()).toBe(true);
    dataFrame.getRawBytes()[2]++;
    expect(dataFrame.isValid()).toBe(false);
  });

  it('should detect errors when one byte is fully corrupted', () => {
    const dataFrame = new DataFrame();
    const payload = [0xF6, 0xF7, 0xF8, 0xF9, 0xFA, 0xFB, 0xFC, 0xFD];
    let rawBytes: number[];
    let framesValid = 0;
    let framesInvalid = 0;

    dataFrame.setPayload(payload);
    rawBytes = dataFrame.getRawBytes();
    expect(dataFrame.isValid()).toBe(true);

    for (let bytePosition = 0; bytePosition < rawBytes.length; bytePosition++) {
      const byteReal = rawBytes[bytePosition];
      for (let byteCorrupted = 0; byteCorrupted < 256; byteCorrupted++) {
        rawBytes[bytePosition] = byteCorrupted;
        dataFrame.isValid() ? framesValid++ : framesInvalid++;
      }
      rawBytes[bytePosition] = byteReal;
    }
    expect(dataFrame.isValid()).toBe(true);
    expect([framesValid, framesInvalid]).toEqual([rawBytes.length, 255 * rawBytes.length]);
  });

  it('should detect expected number of frames in long byte stream', () => {
    const dataFrame = new DataFrame();
    const validFrameRawBytes = (new DataFrame()).setPayload(utils.getBytesFromString('abcdefgh')).getRawBytes();
    let byteStream: number[] = [];
    let framesValid = 0;
    let framesInvalid = 0;
    const min = fromConstants.FRAME_RAW_BYTES_LENGTH_MIN;
    const max = fromConstants.FRAME_RAW_BYTES_LENGTH_MAX;

    for (let i = 0; i < 1000000; i++) {
      byteStream.push(utils.getRandomInt(0, 255));
    }
    byteStream = [
      ...byteStream.slice(0, byteStream.length >>> 1),
      ...validFrameRawBytes,
      ...byteStream.slice(byteStream.length >>> 1)
    ];

    utils.getMovingWindowSubArrays(byteStream, min, max, (subArray) => {
      utils.getRightAlignedSubArrays(subArray, min, (rawBytes) => {
        dataFrame.setRawBytes(rawBytes);
        if (dataFrame.isValid()) {
          framesValid++;
          console.log(dataFrame.getLengthFromRawBytes(), dataFrame.getPayload().map((i) => String.fromCharCode(i)).join(''));
        } else {
          framesInvalid++;
        }
      });
    });
    expect(framesValid + framesInvalid).toBe(8000036);
    console.log([framesValid, framesInvalid]); // .toEqual([1, 0]);

    // console.log(validFrameRawBytes.map(i => i.toString(16)).join(','));
    // console.log(byteStream.map(i => i.toString(16)).join(','));
    // for (let i = 0; i <= byteStream.length - fromConstants.FRAME_RAW_BYTES_LENGTH_MAX; i++) {
    //   for (let j = fromConstants.FRAME_RAW_BYTES_LENGTH_MIN; j <= fromConstants.FRAME_RAW_BYTES_LENGTH_MAX; j++) {
    //     // console.log(byteStream.slice(i, i + j));
    //     const rawBytes = byteStream.slice(i, i + j);
    //     // console.log('->', rawBytes.map(i => i.toString(10)).join(','));
    //
    //     dataFrame.setRawBytes(rawBytes);
    //     dataFrame.isValid() ? framesValid++ : framesInvalid++;
    //   }
    // }
    // console.log([framesValid, framesInvalid]); // .toEqual([1, 0]);
  });
});
