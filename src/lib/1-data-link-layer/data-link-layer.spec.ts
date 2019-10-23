// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import Spy = jasmine.Spy;
import CallInfo = jasmine.CallInfo;

import { DataLinkLayer } from '@data-link-layer/data-link-layer';
import { RxTimeTickState, TxTimeTickState } from '@data-link-layer/model';
import { createPhysicalLayerConfig } from '@physical-layer/physical-layer';
import { getHexFromBytes } from '@shared/utils';

describe('Data Link Layer', () => {
  let currentTime: number;
  let dataLinkLayer: DataLinkLayer;
  let rxIntervalMilliseconds: number;
  let txGuardMilliseconds: number;
  let txIntervalMilliseconds: number;

  beforeEach(() => {
    createPhysicalLayerConfig.stub = true;
    dataLinkLayer = new DataLinkLayer();
    currentTime = 0;
    rxIntervalMilliseconds = dataLinkLayer.physicalLayer.getDspConfig().rxIntervalMilliseconds;
    txGuardMilliseconds = dataLinkLayer.getTxGuardMilliseconds();
    txIntervalMilliseconds = dataLinkLayer.physicalLayer.getDspConfig().txIntervalMilliseconds;
  });

  it('should properly scramble bytes in two subsequent equal frames and generate proper TX calls', () => {
    const RANDOM_USER_LAG_MILLISECONDS = 1500;
    const spyTx: Spy = spyOn(dataLinkLayer.physicalLayer, 'tx');
    const spyTxMapper = (args: [number, number]) =>
      ('    ' + args[1]).substr(-4) + ': ' + (args[0] === null ? 'null' : '0x' + getHexFromBytes([args[0]]));
    const spyTxTimeTick: Spy = spyOn(dataLinkLayer, 'txTimeTick').and.callThrough();
    const spyTxTimeTickMapper = (item: CallInfo) => [('    ' + item.args[0]).substr(-4), item.returnValue].join(': ');
    let spyTxExpectation: string[];
    let spyTxTimeTickExpectation: string[];
    let txTimeTickState: TxTimeTickState;

    for (let i = 0; i < 2; i++) {
      dataLinkLayer.setTxBytes([0x61]);
      do {
        txTimeTickState = dataLinkLayer.txTimeTick(currentTime);
        currentTime +=
          txTimeTickState === TxTimeTickState.Symbol
            ? txIntervalMilliseconds
            : txTimeTickState === TxTimeTickState.Guard
            ? txGuardMilliseconds
            : RANDOM_USER_LAG_MILLISECONDS;
      } while (txTimeTickState !== TxTimeTickState.Idle);
    }

    spyTxExpectation = spyTx.calls.allArgs().map(spyTxMapper);
    expect(spyTxExpectation.join(' | ')).toEqual(
      '' + //  header       header       header       data         silence (null) to stop playing last tone
        //     ....         ....         ....         ....         ....
        '   0: 0x0b |  126: 0x22 |  252: 0x70 |  378: 0x14 |  504: null | ' +
        '2035: 0xe0 | 2161: 0xb1 | 2287: 0x9b | 2413: 0xbf | 2539: null'
    );

    spyTxTimeTickExpectation = spyTxTimeTick.calls.all().map(spyTxTimeTickMapper);
    expect(spyTxTimeTickExpectation.join(' | ')).toEqual(
      '' +
        '   0: Symbol |  126: Symbol |  252: Symbol |  378: Symbol |  504: Guard |  535: Idle | ' +
        '2035: Symbol | 2161: Symbol | 2287: Symbol | 2413: Symbol | 2539: Guard | 2570: Idle'
    );
  });

  const rxBytes = (rx: number[]): Array<[number, number[]]> => {
    const rxBytesCollectionGlobal: Array<[number, number[]]> = [];
    let rxTimeTickState: RxTimeTickState;

    spyOn(dataLinkLayer.physicalLayer, 'rx').and.callFake(() => rx.shift());
    do {
      rxTimeTickState = dataLinkLayer.rxTimeTick(currentTime);
      dataLinkLayer
        .getRxBytesCollection()
        .forEach((payload: number[]) => rxBytesCollectionGlobal.push([currentTime, payload]));
      currentTime += rxIntervalMilliseconds;
    } while (rxTimeTickState !== RxTimeTickState.Stopped);

    return rxBytesCollectionGlobal;
  };

  it('should return only one out of two identical frames that are separated by one RX step', () => {
    expect(rxBytes([0x00, 0x0b, 0x0b, 0x22, 0x22, 0x70, 0x70, 0x14, 0x14, 0x00, null])).toEqual([[441, [0x61]]]);
    // tx intervals:      ..........  ==========  ..........  ==========                          ^^^   ^^^^
    //                    header      header      header      scrambled data                     rxTime payload
  });

  it('should return only one out of two identical frames that are separated by one RX step (offset)', () => {
    expect(rxBytes([0x00, 0x00, 0x0b, 0x0b, 0x22, 0x22, 0x70, 0x70, 0x14, 0x14, 0x00, null])).toEqual([[504, [0x61]]]);
    // tx intervals:            ..........  ==========  ..........  ==========                          ^^^   ^^^^
    //                          header      header      header      scrambled data                     rxTime payload
  });

  it.only('should not receive the own data that was transmitted', () => {
    let currentTxByte = 0;
    const spyRx: Spy = spyOn(dataLinkLayer.physicalLayer, 'rx').and.callFake((currentTimeSub: number) => {
      console.log('RX [x]      <---  | ', currentTimeSub, currentTxByte.toString(16));
      return currentTxByte;
    });
    const spyTx: Spy = spyOn(dataLinkLayer.physicalLayer, 'tx').and.callFake((byte: number, currentTimeSub: number) => {
      currentTxByte = byte !== null ? byte : 0;
      console.log('TX [x] --->       | ', currentTimeSub, currentTxByte.toString(16));
    });
    let rxBytesCollection: number[][] = [];

    dataLinkLayer.setTxBytes([0x61]);
    for (let i = 0; i < 15; i++) {
      i % 2 === 0 && dataLinkLayer.txTimeTick(currentTime);
      dataLinkLayer.rxTimeTick(currentTime);
      currentTime += rxIntervalMilliseconds;

      rxBytesCollection = dataLinkLayer.getRxBytesCollection();
      if (rxBytesCollection.length) {
        console.log(rxBytesCollection);
      }
    }
  });
});
