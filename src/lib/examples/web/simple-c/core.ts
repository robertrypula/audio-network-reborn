// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

// Proof of Concept - don't judge the code quality :)

/*tslint:disable:no-console*/
/*tslint:disable:no-bitwise*/

import { Byte, CodeEntry, Type } from '@examples/web/simple-c/model';

export const refreshMemoryLog: { handler: () => void } = {
  handler: () => {
    /*empty*/
  }
};

// -----------------------------------------------------------------------------

export let globalScopeOffset = 0;

export let regFP = 0x73; // some random number to test if initial value is restored at the end of the program
export let regSP = 0x50;

export let callLevel = 0;
export let callLevelAllocatedVariables: number[] = [];

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
  refreshMemoryLog.handler();
  return memoryBytes[address].value;
};

const memoryWrite = (address: number, byte: number, type?: Type): void => {
  memoryRangeCheck(address);
  memoryBytes[address].value = byte;
  if (type) {
    memoryBytes[address].type = type;
  }
  refreshMemoryLog.handler();
};

memoryInitialize(512);

// -----------------------------------------------------------------------------

export class Pointer {
  public constructor(protected address: number, protected isIndexed: boolean, protected isStack: boolean) {}

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

    return new Pointer(addressOfPointingValue + 2 * offset, true, this.isStack);
  }

  protected getAddressOfPointingValue(): number {
    return this.isIndexed ? this.address : (memoryRead(this.address) << 8) | memoryRead(this.address + 1);
  }
}

// -----------------------------------------------------------------------------

export const word = (wordCount: number, preset: number[] | string[] | [(bag: Pointer) => void]): Pointer => {
  const bytes: number[] = [];
  const isStack = !!callLevel;
  const address = isStack ? regSP : globalScopeOffset;
  const addressOfPointingValue = address + 2;
  let type: Type;

  if (typeof callLevelAllocatedVariables[callLevel] === 'undefined') {
    callLevelAllocatedVariables[callLevel] = 0;
  }

  callLevel === 0 && callLevelAllocatedVariables[callLevel] === 0 && refreshMemoryLog.handler();

  callLevelAllocatedVariables[callLevel]++;

  memoryWrite(isStack ? regSP++ : globalScopeOffset++, (addressOfPointingValue >>> 8) & 0xff, Type.Pointer);
  memoryWrite(isStack ? regSP++ : globalScopeOffset++, addressOfPointingValue & 0xff, Type.Pointer);

  if (isStack && preset.length) {
    throw new Error('Predefine array is forbidden inside function');
  }

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
      for (let i = 0; i < preset.length; i++) {
        const s = preset[i] as string;

        for (let j = 0; j < s.length; j++) {
          bytes.push(s.charCodeAt(j) & 0x7f);
        }
      }
      if (wordCount < bytes.length / 2) {
        throw new Error('Word count to small (string)');
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
      if (codeEntries.findIndex(codeEntry => codeEntry.address === addressOfPointingValue) !== -1) {
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
    if (isStack) {
      memoryWrite(regSP++, 0x00, type);
    } else {
      memoryWrite(globalScopeOffset++, i < bytes.length ? bytes[i] : 0x00, type);
    }
  }

  return new Pointer(address, false, isStack);
};

// -----------------------------------------------------------------------------
/*
Intel x86 example:

    Inside function
    foo:                       ; foo(arg0, arg1, arg2);
        push ebp               ; save previous function frame pointer
        mov ebp, esp           ; create current function frame pointer
        sub esp, N             ; N = number of bytes for local variables

        ...                    ; function body (you can also push registers on stack and pop them at the end)

        mov esp, ebp           ; restore stack (destroys all local vars)
        pop ebp                ; restore previous function frame pointer
        ret                    ; return from function (pops return address from stack)

    Inside previous function

        push  arg2             ; push arguments on stack in reverse order
        push  arg1
        push  arg0
        call  foo              ; call function (pushes return address to stack)
        add   esp, 3*4         ; instruction adds 3*4 bytes to stack pointer to destroy 3 arguments used in foo function
 */

export const call = (address: number, bagValue: number): void => {
  const index = codeEntries.findIndex(codeEntry => codeEntry.address === address);
  const bagAddress = regSP;
  const FAKE_RETURN_ADDRESS = 0xffff; // needs to be fake as in JavaScript we don't have actual program code

  if (index === -1) {
    throw new Error('Provided address does not point to function code');
  }

  callLevel++;

  // parameter
  word(1, []);
  memoryWrite(regSP - 2, (bagValue >>> 8) & 0xff);
  memoryWrite(regSP - 1, bagValue & 0xff);

  // the actual assembler 'call' instruction that stores return address
  word(0, []);
  memoryWrite(regSP - 2, (FAKE_RETURN_ADDRESS >>> 8) & 0xff, Type.FunctionCallOnStack);
  memoryWrite(regSP - 1, FAKE_RETURN_ADDRESS & 0xff, Type.FunctionCallOnStack);

  // the function code starts with storing old Frame Pointer and creating new Frame Pointer from current Stack Pointer
  word(0, []);
  memoryWrite(regSP - 2, (regFP >>> 8) & 0xff, Type.FunctionCallOnStack);
  memoryWrite(regSP - 1, regFP & 0xff, Type.FunctionCallOnStack);
  regFP = regSP;
  refreshMemoryLog.handler();

  // run the code
  codeEntries[index].code(new Pointer(bagAddress, false, true));
};

export const ret = (): void => {
  const NUMBER_OF_VARIABLES_AT_CALL_PREAMBLE = 3;
  const numberOfLocalVariablesToDestroy = callLevelAllocatedVariables[callLevel] - NUMBER_OF_VARIABLES_AT_CALL_PREAMBLE;
  let FAKE_RETURN_ADDRESS: number;

  // destroy all local vars
  regSP = regFP; // actually we don't need 'numberOfLocalVariablesToDestroy' we can just move SP to FP
  refreshMemoryLog.handler();

  // pop previous Frame Pointer
  regFP = memoryRead(--regSP);
  regFP = (memoryRead(--regSP) << 8) | regFP;

  // the actual assembler 'ret' instruction that pops the return address
  FAKE_RETURN_ADDRESS = memoryRead(--regSP);
  FAKE_RETURN_ADDRESS = (memoryRead(--regSP) << 8) | FAKE_RETURN_ADDRESS;

  // destroy the function call parameter
  regSP -= 2; // the 'bag' parameter value
  regSP -= 2; // the 'bag' parameter pointer

  callLevel--;
  refreshMemoryLog.handler();
};
