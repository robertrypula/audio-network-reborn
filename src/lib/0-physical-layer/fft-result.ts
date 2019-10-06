// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

export class FftResult {
  public constructor(protected frequencyDomainData: Float32Array, protected sampleRate: number) {}

  public getLoudestBinIndex(): number {
    let maxValue = -Infinity;
    let maxIndex = 0;

    this.frequencyDomainData.forEach((value: number, index: number) => {
      if (value > maxValue) {
        maxValue = value;
        maxIndex = index;
      }
    });

    return maxIndex;
  }

  public pick(binIndexes: number[]): FftResult {
    const newFrequencyDomainData = new Float32Array(binIndexes.length);

    binIndexes.forEach((binIndex: number, index: number) => {
      newFrequencyDomainData[index] = this.frequencyDomainData[binIndex];
    });

    this.frequencyDomainData = newFrequencyDomainData;
    this.sampleRate = 0; // after this conversion it's not true anymore

    return this;
  }
}
