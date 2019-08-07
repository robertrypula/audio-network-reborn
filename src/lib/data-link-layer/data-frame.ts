// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import * as fromConstants from './constants';
import { getFletcher16 } from './utils';

/*tslint:disable:no-bitwise*/

export class DataFrame {
  protected rawBytes: number[] = [];
  protected rawBytePosition: number = 0;

  public getCalculatedChecksumFromPayload(): number {
    const checksum = this.getCalculatedChecksumAsArrayFromPayload();

    return ((checksum[0] << 8) | checksum[1]) & 0x1FFF;
  }

  public getChecksumFromRawBytes(): number {
    return this.rawBytes.length > fromConstants.FRAME_HEADER_LENGTH
      ? ((this.rawBytes[0] << 8) | this.rawBytes[1]) & 0x1FFF
      : null;
  }
  public getLengthFromPayload(): number {
    return this.rawBytes.length - fromConstants.FRAME_HEADER_LENGTH;
  }

  public getLengthFromRawBytes(): number {
    return this.rawBytes.length > fromConstants.FRAME_HEADER_LENGTH
      ? ((this.rawBytes[0] >>> 5) & 0x07) + fromConstants.FRAME_PAYLOAD_LENGTH_OFFSET
      : null;
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

  public isValid(): boolean {
    return (
      this.rawBytes.length > fromConstants.FRAME_HEADER_LENGTH &&
      this.getChecksumFromRawBytes() === this.getCalculatedChecksumFromPayload() &&
      this.getLengthFromRawBytes() === this.getLengthFromPayload()
    );
  }

  public setPayload(payload: number[]): DataFrame {
    const payloadLength = payload.length;
    let checksum: number[];

    if (
      payloadLength < fromConstants.FRAME_PAYLOAD_LENGTH_MIN ||
      payloadLength > fromConstants.FRAME_PAYLOAD_LENGTH_MAX
    ) {
      throw new Error('Payload length out of range');
    }

    this.rawBytes = [0, 0, ...payload];
    this.rawBytePosition = 0;

    checksum = this.getCalculatedChecksumAsArrayFromPayload();
    this.rawBytes[0] =
      (((payloadLength - fromConstants.FRAME_PAYLOAD_LENGTH_OFFSET) & 0x07) << 5) | (checksum[0] & 0x1F);
    this.rawBytes[1] = checksum[1];

    return this;
  }

  public setRawBytes(rawBytes: number[]): DataFrame {
    this.rawBytes = rawBytes;
    this.rawBytePosition = 0;

    return this;
  }

  protected getCalculatedChecksumAsArrayFromPayload(): number[] {
    return getFletcher16(this.getPayload());
  }
}
