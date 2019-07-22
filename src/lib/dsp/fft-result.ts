// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

export class FftResult {
  public constructor(
    protected frequencyDomainData: Float32Array,
    protected sampleRate: number
  ) {
  }

  public pick(binIndexes: number[]): FftResult {
    const newFrequencyDomainData = new Float32Array(binIndexes.length);

    binIndexes.forEach((binIndex, index) => {
      newFrequencyDomainData[index] = this.frequencyDomainData[binIndex];
    });

    this.frequencyDomainData = newFrequencyDomainData;
    this.sampleRate = 0;    // after this conversion it's not true anymore

    return this;
  }

  public getLoudestBinIndex(): number {
    let maxValue: number = -Infinity;
    let maxIndex: number = 0;

    this.frequencyDomainData.forEach((value, index) => {
      if (value > maxValue) {
        maxValue = value;
        maxIndex = index;
      }
    });

    return maxIndex;
  }
}
