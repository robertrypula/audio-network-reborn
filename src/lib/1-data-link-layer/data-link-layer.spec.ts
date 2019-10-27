// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import CallInfo = jasmine.CallInfo;
import Spy = jasmine.Spy;
import { DataLinkLayer } from '@data-link-layer/data-link-layer';
import {
  ErrorCorrection,
  RxBytesCollector,
  RxTimeTickState,
  SelfReception,
  TxTimeTickState
} from '@data-link-layer/model';
import { createPhysicalLayerConfig } from '@physical-layer/physical-layer';
import { getHexFromBytes, padStart } from '@shared/utils';

describe('Data link layer', (): void => {
  const hex = (value: number): string => (value === null ? 'null' : '0x' + getHexFromBytes([value]));
  const time = (value: number): string => padStart(value, 10, 4, ' ');
  let currentTime: number;
  let dataLinkLayer: DataLinkLayer;
  let rxIntervalMilliseconds: number;
  let txGuardMilliseconds: number;
  let txIntervalMilliseconds: number;

  beforeEach((): void => {
    createPhysicalLayerConfig.stub = true;
    dataLinkLayer = new DataLinkLayer();
    currentTime = 0;
    rxIntervalMilliseconds = dataLinkLayer.physicalLayer.getDspConfig().rxIntervalMilliseconds;
    txGuardMilliseconds = dataLinkLayer.getTxGuardMilliseconds();
    txIntervalMilliseconds = dataLinkLayer.physicalLayer.getDspConfig().txIntervalMilliseconds;
  });

  describe('RX', (): void => {
    const rxTest = (rx: number[]): RxBytesCollector[] => {
      const rxBytesCollector: RxBytesCollector[] = [];
      const isRxErrorCorrectionOn: boolean = dataLinkLayer.rxErrorCorrection === ErrorCorrection.On;
      let rxTimeTickState: RxTimeTickState;

      spyRx = spyOn(dataLinkLayer.physicalLayer, 'rx').and.callFake(() => rx.shift());
      spyRxTimeTick = spyOn(dataLinkLayer, 'rxTimeTick').and.callThrough();
      do {
        rxTimeTickState = dataLinkLayer.rxTimeTick(currentTime);
        dataLinkLayer
          .getRxBytesCollection()
          .forEach((bytes: number[]): number =>
            rxBytesCollector.push(
              isRxErrorCorrectionOn
                ? { bytes, isErrorCorrected: false, receivedAtTime: currentTime }
                : { bytes, receivedAtTime: currentTime }
            )
          );
        isRxErrorCorrectionOn &&
          dataLinkLayer
            .getRxBytesErrorCorrectedCollection()
            .forEach((bytes: number[]): number =>
              rxBytesCollector.push(
                isRxErrorCorrectionOn
                  ? { bytes, isErrorCorrected: true, receivedAtTime: currentTime }
                  : { bytes, receivedAtTime: currentTime }
              )
            );
        currentTime += rxIntervalMilliseconds;
      } while (rxTimeTickState !== RxTimeTickState.Stopped);

      return rxBytesCollector;
    };
    const spyRxMapper = (callInfo: CallInfo): string => `${time(callInfo.args[0])}: ${hex(callInfo.returnValue)}`;
    const spyRxTimeTickMapper = (callInfo: CallInfo): string => `${time(callInfo.args[0])}: ${callInfo.returnValue}`;
    let spyRx: Spy;
    let spyRxExpectation: string[];
    let spyRxTimeTick: Spy;
    let spyRxTimeTickExpectation: string[];

    it('should generate proper RX calls', (): void => {
      rxTest([0x12, 0x23, 0x34, 0x45, 0x56, null]);

      spyRxExpectation = spyRx.calls.all().map(spyRxMapper);
      expect(spyRxExpectation.join(' | ')).toEqual(
        '   0: 0x12 |   63: 0x23 |  126: 0x34 |  189: 0x45 |  252: 0x56 |  315: null'
      );

      spyRxTimeTickExpectation = spyRxTimeTick.calls.all().map(spyRxTimeTickMapper);
      expect(spyRxTimeTickExpectation.join(' | ')).toEqual(
        '   0: Listening |   63: Listening |  126: Listening |  189: Listening |  252: Listening |  315: Stopped'
      );
    });

    describe('Frame detection and duplicates removal', (): void => {
      it('should return only one out of two identical frames that are separated by one RX step', (): void => {
        expect(rxTest([0x0b, 0x0b, 0x22, 0x22, 0x70, 0x70, 0x14, 0x14, 0x00, null])).toEqual([
          // tx:       ``````````  ``````````  ``````````  ``````````  ``````````
          //           \________________________________/  \________/
          //                scrambled 3 B of header         scrambled 1 B of data
          { bytes: [0x61], receivedAtTime: 378 }
        ]);
      });

      it('should return only one out of two identical frames that are separated by one RX step (offset)', (): void => {
        expect(rxTest([0x00, 0x0b, 0x0b, 0x22, 0x22, 0x70, 0x70, 0x14, 0x14, 0x00, null])).toEqual([
          // tx:       ``````````  ``````````  ``````````  ``````````  ``````````
          //           \________________________________/  \________/
          //                scrambled 3 B of header         scrambled 1 B of data
          { bytes: [0x61], receivedAtTime: 441 }
        ]);
      });
    });

    describe('Error correction', (): void => {
      it('should return error-free frame via getRxBytesCollection method', (): void => {
        const byte = 0x22;

        dataLinkLayer.rxErrorCorrection = ErrorCorrection.On;
        expect(rxTest([0x0b, 0x0b, byte, byte, 0x70, 0x70, 0x14, 0x14, null])).toEqual([
          { bytes: [0x61], isErrorCorrected: false, receivedAtTime: 378 }
        ]);
      });

      it('should return error-at-one-byte frame via getRxBytesErrorCorrectedCollection method', (): void => {
        const ERROR = 32;
        const byte = 0x22 + ERROR;

        dataLinkLayer.rxErrorCorrection = ErrorCorrection.On;
        expect(rxTest([0x0b, 0x0b, byte, byte, 0x70, 0x70, 0x14, 0x14, null])).toEqual([
          { bytes: [0x61], isErrorCorrected: true, receivedAtTime: 378 }
        ]);
      });
    });
  });

  describe('RX <-> TX', (): void => {
    const RX_TX_TEST_BYTES = [0x61, 0x62, 0x63];
    const rxTxTest = (): RxBytesCollector[] => {
      const rxBytesCollector: RxBytesCollector[] = [];
      const TEST_SAFE_MARGIN = 4;
      let currentTxByte = 0;
      let i = 0;
      let iEnd = +Infinity;

      spyOn(dataLinkLayer.physicalLayer, 'rx').and.callFake((): number => currentTxByte);
      spyOn(dataLinkLayer.physicalLayer, 'tx').and.callFake((byte: number): void => {
        currentTxByte = byte !== null ? byte : 0;
      });

      do {
        i % 2 === 0 && dataLinkLayer.txTimeTick(currentTime);
        dataLinkLayer.rxTimeTick(currentTime);
        dataLinkLayer.getRxBytesCollection().map((bytes: number[]): void => {
          rxBytesCollector.push({
            bytes,
            receivedAtTime: currentTime
          });
        });

        currentTime += rxIntervalMilliseconds;
        if (iEnd === +Infinity && dataLinkLayer.getTxProgress() === 1) {
          iEnd = i + TEST_SAFE_MARGIN;
        }
        i++;
      } while (i < iEnd);

      return rxBytesCollector;
    };

    it('should receive the data that was transmitted at the same device when rxSelfReception is On', (): void => {
      dataLinkLayer.rxSelfReception = SelfReception.On;
      dataLinkLayer.setTxBytes(RX_TX_TEST_BYTES);
      expect(rxTxTest()).toEqual([{ bytes: RX_TX_TEST_BYTES, receivedAtTime: 630 }]);
    });

    /* TODO enable this test cases when SelfReception.Off will be implemented
    it('should NOT receive the data that was transmitted at the same device when rxSelfReception is Off', (): void => {
      dataLinkLayer.rxSelfReception = SelfReception.Off;
      dataLinkLayer.setTxBytes(RX_TX_TEST_BYTES);
      expect(rxTxTest()).toEqual([]);
    });
    */
  });

  describe('TX', (): void => {
    it('should properly scramble bytes in two subsequent equal frames and generate proper TX calls', (): void => {
      const RANDOM_USER_LAG_MILLISECONDS = 1500;
      const spyGetTxProgress: Spy = spyOn(dataLinkLayer, 'getTxProgress').and.callThrough();
      const spyGetTxProgressMapper = (callInfo: CallInfo): string => callInfo.returnValue.toFixed(4);
      const spyTx: Spy = spyOn(dataLinkLayer.physicalLayer, 'tx');
      const spyTxMapper = (callInfo: CallInfo): string => `${time(callInfo.args[1])}: ${hex(callInfo.args[0])}`;
      const spyTxTimeTick: Spy = spyOn(dataLinkLayer, 'txTimeTick').and.callThrough();
      const spyTxTimeTickMapper = (callInfo: CallInfo): string => `${time(callInfo.args[0])}: ${callInfo.returnValue}`;
      let spyGetTxProgressExpectation: string[];
      let spyTxExpectation: string[];
      let spyTxTimeTickExpectation: string[];
      let txTimeTickState: TxTimeTickState;

      for (let i = 0; i < 2; i++) {
        dataLinkLayer.setTxBytes([0x61]);
        dataLinkLayer.getTxProgress();
        do {
          txTimeTickState = dataLinkLayer.txTimeTick(currentTime);
          dataLinkLayer.getTxProgress();
          currentTime +=
            txTimeTickState === TxTimeTickState.Symbol
              ? txIntervalMilliseconds
              : txTimeTickState === TxTimeTickState.Guard
              ? txGuardMilliseconds
              : RANDOM_USER_LAG_MILLISECONDS;
        } while (txTimeTickState !== TxTimeTickState.Idle);
      }

      spyGetTxProgressExpectation = spyGetTxProgress.calls.all().map(spyGetTxProgressMapper);
      expect(spyGetTxProgressExpectation.join(' | ')).toEqual(
        '' +
          '0.0000 | 0.2355 | 0.4710 | 0.7065 | 0.9421 | 1.0000 | 1.0000 | ' +
          '0.0000 | 0.2355 | 0.4710 | 0.7065 | 0.9421 | 1.0000 | 1.0000'
      );

      spyTxExpectation = spyTx.calls.all().map(spyTxMapper);
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
  });
});
