// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import Spy = jasmine.Spy;
import CallInfo = jasmine.CallInfo;
import { DataLinkLayer } from '@data-link-layer/data-link-layer';
import { TxTimeTickState } from '@data-link-layer/model';
import { createPhysicalLayerConfig } from '@physical-layer/physical-layer';

describe('Data Link Layer', () => {
  beforeEach(() => {
    createPhysicalLayerConfig.stub = true;
  });

  it('should generate proper tx calls at PhysicalLayer (scrambled by scramble sequence)', () => {
    const RANDOM_USER_LAG_MILLISECONDS = 1500;
    const dataLinkLayer = new DataLinkLayer();
    const spyTx: Spy = spyOn(dataLinkLayer.physicalLayer, 'tx');
    const spyTxTimeTick: Spy = spyOn(dataLinkLayer, 'txTimeTick').and.callThrough();
    const txIntervalMilliseconds: number = dataLinkLayer.physicalLayer.getDspConfig().txIntervalMilliseconds;
    const txGuardMilliseconds: number = dataLinkLayer.getTxGuardMilliseconds();
    let currentTime = 0;
    let txTimeTickState: TxTimeTickState;

    for (let i = 0; i < 2; i++) {
      dataLinkLayer.setTxBytes([0x61]);
      do {
        txTimeTickState = dataLinkLayer.txTimeTick(currentTime);
        switch (txTimeTickState) {
          case TxTimeTickState.Symbol:
            currentTime += txIntervalMilliseconds;
            break;
          case TxTimeTickState.Guard:
            currentTime += txGuardMilliseconds;
            break;
          case TxTimeTickState.Idle:
            currentTime += RANDOM_USER_LAG_MILLISECONDS;
            break;
        }
      } while (txTimeTickState !== TxTimeTickState.Idle);
    }

    expect(spyTx.calls.allArgs()).toEqual([
      [0x0b, 0], // scrambled header byte
      [0x22, 126], // scrambled header byte
      [0x70, 252], // scrambled header byte
      [0x14, 378], // scrambled 0x61 byte
      [null, 504], // set silence to stop playing tone above
      // time gap: RANDOM_USER_LAG_MILLISECONDS + txGuardMilliseconds
      [0xe0, 2035], // scrambled header byte
      [0xb1, 2161], // scrambled header byte
      [0x9b, 2287], // scrambled header byte
      [0xbf, 2413], // scrambled 0x61 byte
      [null, 2539] // set silence to stop playing tone above
    ] as Array<[number, number]>);

    expect(spyTxTimeTick.calls.all().map((item: CallInfo) => [item.args[0], item.returnValue])).toEqual([
      [0, TxTimeTickState.Symbol],
      [126, TxTimeTickState.Symbol],
      [252, TxTimeTickState.Symbol],
      [378, TxTimeTickState.Symbol],
      [504, TxTimeTickState.Guard],
      [535, TxTimeTickState.Idle],
      [2035, TxTimeTickState.Symbol],
      [2161, TxTimeTickState.Symbol],
      [2287, TxTimeTickState.Symbol],
      [2413, TxTimeTickState.Symbol],
      [2539, TxTimeTickState.Guard],
      [2570, TxTimeTickState.Idle]
    ] as Array<[number, TxTimeTickState]>);

    /*
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const spyRx = spyOn(dataLinkLayer.physicalLayer, 'rx').and.callFake(() => data.shift());
    */
  });
});
