// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

export class FixedSizeBuffer<T> {
  public data: T[] = [];

  public constructor(public readonly lengthMax: number, public readonly lengthMin = 0) {}

  public insert(value: T): void {
    if (this.data.length >= this.lengthMax) {
      this.data.shift();
    }
    this.data.push(value);
  }

  public isBelowMinimalLength(): boolean {
    return this.data.length < this.lengthMin;
  }
}
