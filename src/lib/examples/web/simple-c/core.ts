// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

/*tslint:disable:no-console*/

export class Pointer {
  public get v(): number {
    console.log('get v');
    return 0;
  }

  public set v(value: number) {
    console.log('set v', value);
  }

  public get a(): number {
    console.log('get a');
    return 0;
  }

  public set a(address: number) {
    console.log('set a', address);
  }

  public idx(offset: number): Pointer {
    console.log('idx', offset);
    return new Pointer();
  }
}

export const word = (bytesLength: number, preset: number[] | string[] | [(bag: Pointer) => void]): Pointer => {
  console.log('word', bytesLength, preset);
  return new Pointer();
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
