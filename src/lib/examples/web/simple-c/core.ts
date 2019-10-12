// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

/*tslint:disable:no-console*/
/*tslint:disable:no-bitwise*/

export enum Type {
  Code = 'code',
  Pointer = 'pointer',
  Unused = 'unused',
  Value = 'value'
}

export interface Byte {
  type: Type;
  value: number;
}

export interface CodeEntry {
  address: number;
  code: (bag: Pointer) => void;
}

// -----------------------------------------------------------------------------

export let regDP = 0;
export let regFP = 0;
export let regSP = 64;

export const codeEntries: CodeEntry[] = [];
export const memoryBytes: Byte[] = [];

const memoryInitialize = (size: number): void => {
  memoryBytes.length = 0;
  for (let i = 0; i < size; i++) {
    memoryBytes.push({ type: Type.Unused, value: 0 });
  }

};
const memoryRangeCheck = (address: number): void => {
  if (typeof memoryBytes[address] === 'undefined') {
    throw new Error(`Address ${address} is outside memory size of ${memoryBytes.length} bytes`);
  }

};
const memoryRead = (address: number): number => {
  memoryRangeCheck(address);
  return memoryBytes[address].value;

};
const memoryWrite = (address: number, byte: number, type?: Type): void => {
  memoryRangeCheck(address);
  memoryBytes[address].value = byte;
  if (type) {
    memoryBytes[address].type = type;
  }

};

memoryInitialize(128);

// -----------------------------------------------------------------------------

export class Pointer {
  public constructor(protected address: number, protected isIndexed: boolean) {}

  public get v(): number {
    const addressOfPointingValue = this.getAddressOfPointingValue();

    return (memoryRead(addressOfPointingValue) << 8) | memoryRead(addressOfPointingValue + 1);
  }

  public set v(value: number) {
    const addressOfPointingValue = this.getAddressOfPointingValue();

    memoryWrite(addressOfPointingValue, (value >>> 8) & 0xff);
    memoryWrite(addressOfPointingValue + 1, value & 0xff);
  }

  public get a(): number {
    return this.getAddressOfPointingValue();
  }

  public set a(address: number) {
    if (this.isIndexed) {
      throw new Error('Cannot assign to indexed pointer as it is calculated in the CPU register');
    }
    memoryWrite(this.address, (address >>> 8) & 0xff);
    memoryWrite(this.address + 1, address & 0xff);
  }

  public idx(offset: number): Pointer {
    const addressOfPointingValue = this.getAddressOfPointingValue();

    if (this.isIndexed) {
      throw new Error('Cannot index indexed pointer');
    }

    return new Pointer(addressOfPointingValue + 2 * offset, true);
  }

  protected getAddressOfPointingValue(): number {
    return this.isIndexed ? this.address : (memoryRead(this.address) << 8) | memoryRead(this.address + 1);
  }
}

// -----------------------------------------------------------------------------

export const word = (wordCount: number, preset: number[] | string[] | [(bag: Pointer) => void]): Pointer => {
  const bytes: number[] = [];
  const address = memoryBytes.findIndex(byte => byte.type === Type.Unused);
  const addressOfPointingValue = address + 2;
  let a = address;
  let type: Type;

  memoryWrite(a++, (addressOfPointingValue >>> 8) & 0xff, Type.Pointer);
  memoryWrite(a++, addressOfPointingValue & 0xff, Type.Pointer);

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
      type = Type.Value;
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
      type = Type.Value;
    } else {
      if (wordCount >= 0) {
        throw new Error('At function pointer wordCount needs to be < 0');
      }

      const codeLengthInWords = 2;
      for (let i = 0; i < codeLengthInWords * 2; i++) {
        bytes.push(0xff); // fake 'code'
      }
      wordCount = codeLengthInWords;
      if (codeEntries.findIndex((codeEntry) => codeEntry.address === addressOfPointingValue) !== -1) {
        throw new Error('Code entry already exists');
      }
      codeEntries.push({
        address: addressOfPointingValue,
        code: preset[0] as (bag: Pointer) => void
      });
      type = Type.Code;
    }
  } else {
    type = Type.Value;
  }

  for (let i = 0; i < wordCount * 2; i++) {
    memoryWrite(a++, i < bytes.length ? bytes[i] : 0x00, type);
  }

  return new Pointer(address, false);
};

// -----------------------------------------------------------------------------

export const call = (address: number, bagValue: number): void => {
  const index = codeEntries.findIndex((codeEntry) => codeEntry.address === address);

  if (index === -1) {
    throw new Error('Provided address does not point to function code');
  }

  memoryWrite(regSP, (bagValue >>> 8) & 0xff, Type.Value);
  memoryWrite(regSP + 1, bagValue & 0xff, Type.Value);
  codeEntries[index].code(new Pointer(regSP, false));
  regSP += 2;
};

export const ret = (): void => {
  console.log('ret');
};

// -----------------------------------------------------------------------------

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
