// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

export class TransferableFile {
  protected rawBytes: number[];
  protected sha1: number[];
  protected bytes: number[];
  protected isValid: boolean;
  protected name: string;

  public constructor(protected isSha1Enabled = false) {}

  public setRawBytes(rawBytes: number[]): TransferableFile {
    this.rawBytes = rawBytes;

    return this;
  }

  public setFile(name: string, bytes: number[]): TransferableFile {
    // TODO 0x1c {SHA-1 few bytes} {filename bytes in UTF-8} 0x00 {bytes of the file}
    // TODO 0x1c is the ASCII's FS (File Separator)
    return this;
  }

  public getRawBytes(): number[] {
    return this.rawBytes;
  }

  // TODO implement rest of the code
}
