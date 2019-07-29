// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

export class DataFrame {
  protected rawBytes: number[];
  protected rawBytePosition: number;

  public constructor(rawBytes: number[]) {
    this.rawBytes = rawBytes.slice(0);
    this.rawBytePosition = 0;
  }

  public getCalculatedChecksumFromPayload(): number {
    return 0x1234; // TODO implement
  }

  public getChecksumFromRawBytes(): number {
    return 0x1234; // TODO implement
  }
  public getLengthFromPayload(): number {
    return 1; // TODO implement
  }

  public getLengthFromRawBytes(): number {
    return 1; // TODO implement
  }

  public getNextRawByte(): number | null {
    return this.rawBytePosition < this.rawBytes.length
      ? this.rawBytes[this.rawBytePosition++]
      : null;
  }

  public getPayload(): number[] {
    return this.rawBytes.slice(0); // TODO implement
  }

  public getRawBytes(): number[] {
    return this.rawBytes.slice(0); // TODO implement
  }

  public isValid(): boolean {
    return (
      this.getChecksumFromRawBytes() === this.getCalculatedChecksumFromPayload() &&
      this.getLengthFromRawBytes() === this.getLengthFromPayload()
    );
  }

  public setPayload(payload: number[]): void {
    this.rawBytes = payload.slice(0); // TODO implement
  }

  public setRawBytes(rawBytes: number[]): void {
    this.rawBytes = rawBytes.slice(0); // TODO implement
  }
}
