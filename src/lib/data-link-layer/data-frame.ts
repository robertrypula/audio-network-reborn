// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { getFletcher16 } from './utils';

export class DataFrame {
  protected rawBytes: number[] = [];
  protected rawBytePosition: number = 0;

  public getCalculatedChecksumFromPayload(): number {
    return 0x1234; // TODO implement
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
    
    if (payloadLength === 0 || payloadLength > 8) {
      throw new Error('');
    }
    
    this.rawBytes = [0, 0, ...payload];
    this.rawBytePosition = 0;
    // TODO mix everything into first two bytes
    
  }

  public setRawBytes(rawBytes: number[]): void {
    this.rawBytes = rawBytes;
    this.rawBytePosition = 0;
  }
}
