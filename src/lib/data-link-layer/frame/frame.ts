// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { frameModeToFrameConfigLookUp } from '../config';
import { FrameConfigInterface, FrameMode } from '../model';
import { getChecksumFunction } from './checksum-algorithms';

/*tslint:disable:no-bitwise*/

export class Frame {
  protected rawBytes: number[] = [];
  protected rawBytePosition: number = 0;
  protected readonly frameConfig: FrameConfigInterface;

  public constructor(protected frameMode: FrameMode) {
    this.frameConfig = frameModeToFrameConfigLookUp[frameMode];
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
    return this.rawBytes.join(',') === frame.getRawBytes().join(',');
  }

  public isNotEqualTo(frame: Frame): boolean {
    return !this.isEqualTo(frame);
  }

  public isValid(): boolean {
    return (
      this.rawBytes.length >= this.frameConfig.headerLength &&
      this.getChecksum(true).join(',') === this.getChecksum(false).join(',') &&
      this.getLengthFromRawBytes() === this.getLengthFromPayload()
    );
  }

  public setPayload(payload: number[]): Frame {
    const payloadLength = payload.length;
    const frameConfig = this.frameConfig;
    let fullChecksum: number[];

    if (
      frameConfig.headerPayloadLengthEnabled
        ? payloadLength < frameConfig.payloadLengthMin || payloadLength > frameConfig.payloadLengthMax
        : payloadLength !== frameConfig.payloadLength
    ) {
      throw new Error('Payload length out of range');
    }

    this.rawBytes = [...new Array(frameConfig.headerLength).fill(0), ...payload];
    this.rawBytePosition = 0;

    fullChecksum = this.getCalculatedFullChecksumAsArrayFromPayload();
    for (let i = 0; i < frameConfig.headerLength; i++) {
      const checksumByte = i < fullChecksum.length ? fullChecksum[i] : 0x00;
      this.rawBytes[i] =
        i === 0
          ? frameConfig.headerPayloadLengthEnabled
            ? (((payloadLength - frameConfig.headerPayloadLengthOffset) <<
                frameConfig.headerFirstBytePayloadLengthBitShift) &
                frameConfig.headerFirstBytePayloadLengthMask) |
              (checksumByte & frameConfig.headerFirstByteChecksumMask)
            : checksumByte
          : checksumByte;
    }

    return this;
  }

  public setRawBytes(rawBytes: number[]): Frame {
    this.rawBytes = rawBytes;
    this.rawBytePosition = 0;

    return this;
  }

  protected getCalculatedFullChecksumAsArrayFromPayload(): number[] {
    return getChecksumFunction(this.frameConfig.checksumAlgorithm)(this.getPayload());
  }

  protected getChecksum(fromRawBytes: boolean): number[] {
    const result = fromRawBytes
      ? this.rawBytes.slice(0, this.frameConfig.headerLength)
      : this.getCalculatedFullChecksumAsArrayFromPayload();

    if (this.frameConfig.headerPayloadLengthEnabled) {
      result[0] = result[0] & this.frameConfig.headerFirstByteChecksumMask;
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
      : this.frameConfig.payloadLength;
  }
}
