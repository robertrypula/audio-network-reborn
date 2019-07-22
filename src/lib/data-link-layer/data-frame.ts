// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

export class DataFrame {
  protected data: number[];
  protected bytePosition: number;

  public constructor(data: number[]) {
    this.data = data.slice(0);
    this.bytePosition = 0;
  }

  public getNextByte(): number | null {
    return this.bytePosition < this.data.length
      ? this.data[this.bytePosition++]
      : null;
  }
}
