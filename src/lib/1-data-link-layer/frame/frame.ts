// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { FrameConfig, FrameConfigInitializer, HeaderFirstByte } from '@data-link-layer/model';
import { getCheckAlgorithmImplementation } from '@shared/check-algorithms/check-algorithms';
import { getFilledArray } from '@shared/utils';

/*tslint:disable:no-bitwise*/

const empty: HeaderFirstByte = {
  checkSequenceMask: null,
  payloadLengthBitShift: null,
  payloadLengthMask: null
};

export class Frame {
  protected rawBytes: number[] = [];
  protected rawBytePosition = 0;

  public constructor(protected readonly frameConfig: FrameConfig) {}

  public clone(): Frame {
    const frame = new Frame(this.frameConfig);

    frame.rawBytes = this.rawBytes.slice(0);
    frame.rawBytePosition = this.rawBytePosition;

    return frame;
  }

  public getNextRawByte(): number {
    return this.rawBytePosition < this.rawBytes.length ? this.rawBytes[this.rawBytePosition++] : null;
  }

  public getPayload(): number[] {
    return this.rawBytes.slice(this.frameConfig.frameConfigInitializer.headerLength);
  }

  public getRawBytePosition(): number {
    return this.rawBytePosition;
  }

  public getRawBytes(): number[] {
    return this.rawBytes;
  }

  public isEqualTo(frame: Frame): boolean {
    return this.rawBytes.join(',') === frame.rawBytes.join(',');
  }

  public isNotEqualTo(frame: Frame): boolean {
    return !this.isEqualTo(frame);
  }

  public isValid(): boolean {
    return (
      this.rawBytes.length >= this.frameConfig.frameConfigInitializer.headerLength &&
      this.getCheckSequence(true).join(',') === this.getCheckSequence(false).join(',') &&
      this.getLengthFromRawBytes() === this.getLengthFromPayload()
    );
  }

  public setPayload(payload: number[]): Frame {
    const { headerLength, payloadLengthBitSize, payloadLengthOffset } = this.frameConfig.frameConfigInitializer;
    const { checkSequenceMask, payloadLengthBitShift, payloadLengthMask } = this.frameConfig.headerFirstByte
      ? this.frameConfig.headerFirstByte
      : empty;
    const { max, min } = this.frameConfig.payloadLength;
    const payloadLength = payload.length;
    let fullCheckSequence: number[];

    if (payloadLength < min || payloadLength > max) {
      throw new Error('Payload length out of range');
    }

    this.rawBytes = [...getFilledArray(headerLength), ...payload];
    this.rawBytePosition = 0;

    fullCheckSequence = this.getFullCheckSequenceFromPayload();
    for (let i = 0; i < headerLength; i++) {
      const checkSequenceByte = i < fullCheckSequence.length ? fullCheckSequence[i] : 0x00;
      this.rawBytes[i] =
        i === 0 && payloadLengthBitSize > 0
          ? (((payloadLength - payloadLengthOffset) << payloadLengthBitShift) & payloadLengthMask) |
            (checkSequenceByte & checkSequenceMask)
          : checkSequenceByte;
    }

    return this;
  }

  public setRawBytes(rawBytes: number[]): Frame {
    this.rawBytes = rawBytes;
    this.rawBytePosition = 0;

    return this;
  }

  protected getFullCheckSequenceFromPayload(): number[] {
    return getCheckAlgorithmImplementation(this.frameConfig.frameConfigInitializer.checkAlgorithm)(this.getPayload());
  }

  protected getCheckSequence(fromRawBytes: boolean): number[] {
    const { headerLength, payloadLengthBitSize } = this.frameConfig.frameConfigInitializer;
    const { checkSequenceMask } = this.frameConfig.headerFirstByte ? this.frameConfig.headerFirstByte : empty;
    const result: number[] = fromRawBytes
      ? this.rawBytes.slice(0, headerLength)
      : this.getFullCheckSequenceFromPayload().slice(0, headerLength);

    if (payloadLengthBitSize > 0) {
      result[0] = result[0] & checkSequenceMask;
    }

    return result;
  }

  protected getLengthFromPayload(): number {
    return this.rawBytes.length - this.frameConfig.frameConfigInitializer.headerLength;
  }

  protected getLengthFromRawBytes(): number {
    const { payloadLengthBitSize, payloadLengthFixed, payloadLengthOffset } = this.frameConfig.frameConfigInitializer;
    const { payloadLengthMask, payloadLengthBitShift } = this.frameConfig.headerFirstByte
      ? this.frameConfig.headerFirstByte
      : empty;

    return payloadLengthBitSize > 0
      ? ((this.rawBytes[0] & payloadLengthMask) >>> payloadLengthBitShift) + payloadLengthOffset
      : payloadLengthFixed;
  }
}
