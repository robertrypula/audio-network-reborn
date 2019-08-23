// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { getCheckAlgorithmImplementation } from '../..';
import { FrameConfigInterface } from '../model';

/*tslint:disable:no-bitwise*/

export class Frame {
  protected rawBytes: number[] = [];
  protected rawBytePosition: number = 0;

  public constructor(protected readonly frameConfig: FrameConfigInterface) {}

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
    return this.rawBytes.slice(this.frameConfig.headerLength);
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
      this.rawBytes.length >= this.frameConfig.headerLength &&
      this.getCheckSequence(true).join(',') === this.getCheckSequence(false).join(',') &&
      this.getLengthFromRawBytes() === this.getLengthFromPayload()
    );
  }

  public setPayload(payload: number[]): Frame {
    const frameConfig = this.frameConfig;
    const payloadLength = payload.length;
    let fullCheckSequence: number[];

    if (
      frameConfig.headerPayloadLengthEnabled
        ? payloadLength < frameConfig.payloadLengthMin || payloadLength > frameConfig.payloadLengthMax
        : payloadLength !== frameConfig.payloadLengthFixed
    ) {
      throw new Error('Payload length out of range');
    }

    this.rawBytes = [...new Array(frameConfig.headerLength).fill(0), ...payload];
    this.rawBytePosition = 0;

    fullCheckSequence = this.getFullCheckSequenceFromPayload();
    for (let i = 0; i < frameConfig.headerLength; i++) {
      const checkSequenceByte = i < fullCheckSequence.length ? fullCheckSequence[i] : 0x00;
      this.rawBytes[i] =
        i === 0 && frameConfig.headerPayloadLengthEnabled
          ? (((payloadLength - frameConfig.headerPayloadLengthOffset) <<
              frameConfig.headerFirstBytePayloadLengthBitShift) &
              frameConfig.headerFirstBytePayloadLengthMask) |
            (checkSequenceByte & frameConfig.headerFirstByteCheckSequenceMask)
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
    return getCheckAlgorithmImplementation(this.frameConfig.checkAlgorithm)(this.getPayload());
  }

  protected getCheckSequence(fromRawBytes: boolean): number[] {
    const result = fromRawBytes
      ? this.rawBytes.slice(0, this.frameConfig.headerLength)
      : this.getFullCheckSequenceFromPayload().slice(0, this.frameConfig.headerLength);

    if (this.frameConfig.headerPayloadLengthEnabled) {
      result[0] = result[0] & this.frameConfig.headerFirstByteCheckSequenceMask;
    }

    return result;
  }

  protected getLengthFromPayload(): number {
    return this.rawBytes.length - this.frameConfig.headerLength;
  }

  protected getLengthFromRawBytes(): number {
    const frameConfig = this.frameConfig;

    return this.frameConfig.headerPayloadLengthEnabled
      ? ((this.rawBytes[0] & frameConfig.headerFirstBytePayloadLengthMask) >>>
          frameConfig.headerFirstBytePayloadLengthBitShift) +
          this.frameConfig.headerPayloadLengthOffset
      : this.frameConfig.payloadLengthFixed;
  }
}
