// Copyright (c) 2019-2021 Robert Rypuła - https://github.com/robertrypula

import { HEADER_FIRST_BYTE_EMPTY } from '@data-link-layer/constants';
import { FrameStub } from '@data-link-layer/frame/frame-stub';
import { CheckSequenceSource, FrameConfig, FrameInterface, FrameStatic } from '@data-link-layer/model';
import { getCheckAlgorithmImplementation } from '@shared/check-algorithms/check-algorithms';
import { getFilledArray } from '@shared/utils';

/*tslint:disable:no-bitwise*/

export class Frame implements FrameInterface {
  protected rawBytes: number[] = [];
  protected rawBytePosition = 0;

  public constructor(protected readonly frameConfig: FrameConfig) {}

  public clone(): FrameInterface {
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

  public isEqualTo(frame: FrameInterface): boolean {
    return this.rawBytes.join(',') === frame.getRawBytes().join(',');
  }

  public isNotEqualTo(frame: FrameInterface): boolean {
    return !this.isEqualTo(frame);
  }

  public isValid(): boolean {
    return (
      this.rawBytes.length >= this.frameConfig.frameConfigInitializer.headerLength &&
      this.getPayloadLengthFromHeader() === this.getPayloadLengthCalculated() &&
      this.getCheckSequence(CheckSequenceSource.FromHeader).join(',') ===
        this.getCheckSequence(CheckSequenceSource.Calculated).join(',')
    );
  }

  public setPayload(payload: number[]): FrameInterface {
    const { headerLength, payloadLengthBitSize, payloadLengthOffset } = this.frameConfig.frameConfigInitializer;
    const { checkSequenceMask, payloadLengthBitShift, payloadLengthMask } = this.frameConfig.headerFirstByte
      ? this.frameConfig.headerFirstByte
      : HEADER_FIRST_BYTE_EMPTY;
    const { max, min } = this.frameConfig.payloadLength;
    const payloadLength = payload.length;
    let fullCheckSequenceCalculated: number[];

    if (payloadLength < min || payloadLength > max) {
      throw new Error('Payload length out of range');
    }

    this.rawBytes = [...getFilledArray(headerLength), ...payload];
    this.rawBytePosition = 0;

    fullCheckSequenceCalculated = this.getFullCheckSequenceCalculated();
    for (let i = 0; i < headerLength; i++) {
      const checkSequenceByte = i < fullCheckSequenceCalculated.length ? fullCheckSequenceCalculated[i] : 0x00;
      this.rawBytes[i] =
        i === 0 && payloadLengthBitSize > 0
          ? (((payloadLength - payloadLengthOffset) << payloadLengthBitShift) & payloadLengthMask) |
            (checkSequenceByte & checkSequenceMask)
          : checkSequenceByte;
    }

    return this;
  }

  public setRawBytes(rawBytes: number[]): FrameInterface {
    this.rawBytes = rawBytes;
    this.rawBytePosition = 0;

    return this;
  }

  protected getCheckSequence(checkSequenceSource: CheckSequenceSource): number[] {
    const { headerLength, payloadLengthBitSize } = this.frameConfig.frameConfigInitializer;
    const { checkSequenceMask } = this.frameConfig.headerFirstByte
      ? this.frameConfig.headerFirstByte
      : HEADER_FIRST_BYTE_EMPTY;
    let result: number[];

    switch (checkSequenceSource) {
      case CheckSequenceSource.Calculated:
        result = this.getFullCheckSequenceCalculated().slice(0, headerLength);
        break;
      case CheckSequenceSource.FromHeader:
        result = this.rawBytes.slice(0, headerLength);
        break;
    }

    if (payloadLengthBitSize > 0) {
      result[0] = result[0] & checkSequenceMask;
    }

    return result;
  }

  protected getFullCheckSequenceCalculated(): number[] {
    return getCheckAlgorithmImplementation(this.frameConfig.frameConfigInitializer.checkAlgorithm)(this.getPayload());
  }

  protected getPayloadLengthCalculated(): number {
    return this.rawBytes.length - this.frameConfig.frameConfigInitializer.headerLength;
  }

  protected getPayloadLengthFromHeader(): number {
    const { payloadLengthBitSize, payloadLengthFixed, payloadLengthOffset } = this.frameConfig.frameConfigInitializer;
    const { payloadLengthMask, payloadLengthBitShift } = this.frameConfig.headerFirstByte
      ? this.frameConfig.headerFirstByte
      : HEADER_FIRST_BYTE_EMPTY;

    return payloadLengthBitSize > 0
      ? ((this.rawBytes[0] & payloadLengthMask) >>> payloadLengthBitShift) + payloadLengthOffset
      : payloadLengthFixed;
  }
}

// -----------------------------------------------------------------------------

export const createFrameConfig: { factory: FrameStatic } = { factory: Frame };
export const createFrame = (frameConfig: FrameConfig): FrameInterface => {
  const { factory } = createFrameConfig;
  return factory ? new factory(frameConfig) : new FrameStub(frameConfig);
};
