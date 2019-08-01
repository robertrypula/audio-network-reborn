// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { getFletcher16 } from './utils';

/*tslint:disable:no-bitwise*/

export class DataFrame {
  protected rawBytes: number[] = [];
  protected rawBytePosition: number = 0;

  public getCalculatedChecksumFromPayload(): number {
    const checksum = this.getCalculatedChecksumAsArrayFromPayload();

    return checksum[0] << 8 | checksum[1];
  }

  public getChecksumFromRawBytes(): number {
    return this.rawBytes.length >= 2
      ? ((this.rawBytes[0] << 8) | this.rawBytes[1]) & 0x1FFF
      : null;
  }
  public getLengthFromPayload(): number {
    return this.rawBytes.length - 2;
  }

  public getLengthFromRawBytes(): number {
    return this.rawBytes.length >= 1
      ? ((this.rawBytes[0] >>> 5) & 0x07) + 1
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
      this.rawBytes.length > 2 &&
      this.getChecksumFromRawBytes() === this.getCalculatedChecksumFromPayload() &&
      this.getLengthFromRawBytes() === this.getLengthFromPayload()
    );
  }

  public setPayload(payload: number[]): void {
    const payloadLength = payload.length;
    let checksum: number[];

    if (payloadLength === 0 || payloadLength > 8) {
      throw new Error('Payload length out of range');
    }

    this.rawBytes = [0, 0, ...payload];
    this.rawBytePosition = 0;

    checksum = this.getCalculatedChecksumAsArrayFromPayload();
    this.rawBytes[0] = checksum[0] & 0x1F;
    this.rawBytes[1] = checksum[1];
    this.rawBytes[0] = this.rawBytes[0] | (((payloadLength - 1) & 0x3) << 5);
  }

  public setRawBytes(rawBytes: number[]): void {
    this.rawBytes = rawBytes;
    this.rawBytePosition = 0;
  }

  protected getCalculatedChecksumAsArrayFromPayload(): number[] {
    return getFletcher16(this.getPayload());
  }
}
