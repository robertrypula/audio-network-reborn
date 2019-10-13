// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

/*tslint:disable:no-bitwise*/

export const add = (a: number, b: number): number => {
  return (a + b) & 0xffff;
};

export const nand = (a: number, b: number): number => {
  return ~(a & b) & 0xffff;
};

export const sh = (v: number, amount: number): number => {
  let result = 0;

  if (amount > -32 && amount < 32) {
    result = amount >= 0 ? v >>> amount : v << -amount;
  }

  return result;
};
