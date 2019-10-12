// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

/*tslint:disable:no-console*/
/*tslint:disable:no-bitwise*/

export const stack: number[] = [];
export const data: number[] = [];

export class Pointer {
  public constructor(protected address: number) {}

  public get v(): number {
    console.log('get v');
    return data[this.address] << 8 | data[this.address + 1];
  }

  public set v(value: number) {
    console.log('set v', value);
    data[this.address] = (value >>> 8) & 0xff;
    data[this.address + 1] = value & 0xff;
  }

  public get a(): number {
    console.log('get a');
    return this.address;
  }

  public set a(address: number) {
    console.log('set a', address);
    // data[]
    this.address = address;
  }

  public idx(offset: number): Pointer {
    console.log('idx', offset);
    return new Pointer(this.address + 2 * offset);
  }
}

export const word = (wordCount: number, preset: number[] | string[] | [(bag: Pointer) => void]): Pointer => {
  console.log('word', wordCount, preset);
  const bytes: number[] = [];
  const address = data.length + 2;

  data.push((address >>> 8) & 0xff);
  data.push(address & 0xff);

  if (preset.length) {
    if (typeof preset[0] === 'number') {
      if (wordCount < preset.length) {
        throw new Error('Word count to small (number)');
      }
      for (let i = 0; i < preset.length; i++) {
        const n = preset[i] as number;

        bytes.push((n >>> 8) & 0xff);
        bytes.push(n & 0xff);
      }
    } else if (typeof preset[0] === 'string') {
      if (wordCount < preset.length / 2) {
        throw new Error('Word count to small (string)');
      }
      for (let i = 0; i < preset.length; i++) {
        const s = preset[i] as string;

        for (let j = 0; j < s.length; j++) {
          bytes.push(s.charCodeAt(j) & 0x7f);
        }
      }
    } else {
      if (wordCount >= 0) {
        throw new Error('Cannot set word count at function pointer');
      }

      const codeLengthInWords = 5;
      for (let i = 0; i < codeLengthInWords * 2; i++) {
        bytes.push(0xff); // fake 'code'
      }
      wordCount = codeLengthInWords;
    }
  }

  for (let i = 0; i < wordCount * 2; i++) {
    data.push(i < bytes.length ? bytes[i] : 0x00);
  }

  return new Pointer(address);
};

export const ret = (): void => {
  console.log('ret');
};

export const call = (address: number, bag: number): void => {
  console.log('call', address, bag);
};

export const nand = (a: number, b: number): number => {
  console.log('nand', a, b);
  return 0;
};

export const add = (a: number, b: number): number => {
  console.log('add', a, b);
  return 0;
};

export const sh = (a: number, b: number): number => {
  console.log('sh', a, b);
  return 0;
};
