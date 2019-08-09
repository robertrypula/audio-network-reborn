// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { frameModeToFrameConfigLookUp } from '../config';
import { FrameConfigInterface, FrameMode } from '../model';
import { getFletcher16 } from './checksum-algorithms';

/*tslint:disable:no-bitwise*/

export class Frame {
  protected rawBytes: number[] = [];
  protected rawBytePosition: number = 0;
  protected readonly frameConfig: FrameConfigInterface;

  public constructor(protected frameMode: FrameMode) {
    this.frameConfig = frameModeToFrameConfigLookUp[frameMode];
  }

  public getNextRawByte(): number {
    return this.rawBytePosition < this.rawBytes.length
      ? this.rawBytes[this.rawBytePosition++]
      : null;
  }

  public getPayload(): number[] {
    return this.rawBytes.slice(2);
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
      this.rawBytes.length > this.frameConfig.headerLength &&
      this.getChecksumFromRawBytes() === this.getCalculatedChecksumFromPayload() &&
      this.getLengthFromRawBytes() === this.getLengthFromPayload()
    );
  }

  public setPayload(payload: number[]): Frame {
    const payloadLength = payload.length;
    let checksum: number[];

    if (
      payloadLength < this.frameConfig.payloadLengthMin ||
      payloadLength > this.frameConfig.payloadLengthMax
    ) {
      throw new Error('Payload length out of range');
    }

    this.rawBytes = [0, 0, ...payload];
    this.rawBytePosition = 0;

    checksum = this.getCalculatedChecksumAsArrayFromPayload();
    this.rawBytes[0] =
      (((payloadLength - this.frameConfig.payloadLengthOffset) & 0x07) << 5) | (checksum[0] & 0x1F);
    this.rawBytes[1] = checksum[1];

    return this;
  }

  public setRawBytes(rawBytes: number[]): Frame {
    this.rawBytes = rawBytes;
    this.rawBytePosition = 0;

    return this;
  }

  protected getCalculatedChecksumAsArrayFromPayload(): number[] {
    return getFletcher16(this.getPayload());
  }

  protected getCalculatedChecksumFromPayload(): number {
    const checksum = this.getCalculatedChecksumAsArrayFromPayload();

    return ((checksum[0] << 8) | checksum[1]) & 0x1FFF;
  }
  protected getChecksumFromRawBytes(): number {
    return this.rawBytes.length > this.frameConfig.headerLength
      ? ((this.rawBytes[0] << 8) | this.rawBytes[1]) & 0x1FFF
      : null;
  }

  protected getLengthFromPayload(): number {
    return this.rawBytes.length - this.frameConfig.headerLength;
  }

  protected getLengthFromRawBytes(): number {
    return this.rawBytes.length > this.frameConfig.headerLength
      ? ((this.rawBytes[0] >>> 5) & 0x07) + this.frameConfig.payloadLengthOffset
      : null;
  }
}
