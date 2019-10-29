// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import {
  ERROR_CORRECTED_FALSE,
  ERROR_CORRECTED_TRUE,
  INPUT_DISABLE_FALSE,
  NOTIFY_COMPLETE_FALSE,
  OUTPUT_DISABLE_FALSE
} from '@data-link-layer/constants';
import { DataLinkLayer } from '@data-link-layer/data-link-layer';
import {
  DataLinkLayerWrapperListenHandlers,
  DataLinkLayerWrapperSendHandlers,
  RxTimeTickState,
  TxTimeTickState
} from '@data-link-layer/model';

export class DataLinkLayerWrapper {
  protected rxHandlers: DataLinkLayerWrapperListenHandlers;
  protected rxInterval: any;
  protected txHandlers: DataLinkLayerWrapperSendHandlers;
  protected txInterval: any;
  protected txTimeout: any;

  public constructor(public readonly dataLinkLayer: DataLinkLayer) {}

  public listen(handlers: DataLinkLayerWrapperListenHandlers): boolean {
    if (this.rxInterval) {
      return false;
    }

    this.rxHandlers = handlers;
    this.handleRxInterval();

    return true;
  }

  public listenStop(inputDisable: boolean = true, notifyComplete: boolean = true): void {
    clearInterval(this.rxInterval);
    this.rxInterval = null;
    notifyComplete && this.rxHandlers && this.rxHandlers.complete && this.rxHandlers.complete();
    inputDisable && this.dataLinkLayer.physicalLayer.audioMonoIo.inputDisable();
  }

  public send(bytes: number[], handlers: DataLinkLayerWrapperSendHandlers): boolean {
    if (this.txInterval || this.txTimeout) {
      return false;
    }

    this.txHandlers = handlers;
    this.dataLinkLayer.setTxBytes(bytes);
    this.handleTxInterval();

    return true;
  }

  public sendStop(outputDisable: boolean = true, notifyComplete: boolean = true): void {
    clearInterval(this.txInterval);
    clearTimeout(this.txTimeout);
    this.txInterval = null;
    this.txTimeout = null;
    notifyComplete && this.txHandlers && this.txHandlers.complete && this.txHandlers.complete();
    outputDisable && this.dataLinkLayer.physicalLayer.audioMonoIo.outputDisable();
  }

  protected getCurrentTime(): number {
    return new Date().getTime();
  }

  protected handleRxInterval(): void {
    this.rxInterval = setInterval((): void => {
      if (this.dataLinkLayer.rxTimeTick(this.getCurrentTime()) === RxTimeTickState.Stopped) {
        this.listenStop(INPUT_DISABLE_FALSE);
      } else if (this.rxHandlers.next) {
        this.dataLinkLayer
          .getRxBytesCollection()
          .forEach((rxBytes: number[]): void => this.rxHandlers.next(rxBytes, ERROR_CORRECTED_FALSE));
        this.dataLinkLayer
          .getRxBytesErrorCorrectedCollection()
          .forEach((rxBytes: number[]): void => this.rxHandlers.next(rxBytes, ERROR_CORRECTED_TRUE));
      }
    }, this.dataLinkLayer.physicalLayer.getDspConfig().rxIntervalMilliseconds);
  }

  protected handleTxInterval(): void {
    const getTxGuardTimeout = (): any =>
      setTimeout((): void => {
        this.txHandlers.next && this.txHandlers.next(this.dataLinkLayer.getTxProgress());
        this.sendStop(OUTPUT_DISABLE_FALSE);
      }, this.dataLinkLayer.getTxGuardMilliseconds());

    this.sendStop(OUTPUT_DISABLE_FALSE, NOTIFY_COMPLETE_FALSE);
    this.txHandlers.next && this.txHandlers.next(this.dataLinkLayer.getTxProgress());

    switch (this.dataLinkLayer.txTimeTick(this.getCurrentTime())) {
      case TxTimeTickState.Guard:
        this.txTimeout = getTxGuardTimeout();
        break;

      case TxTimeTickState.Idle:
        // do nothing as intervals and timers where already stopped at this point
        break;

      case TxTimeTickState.Symbol:
        this.txInterval = setInterval((): void => {
          this.txHandlers.next && this.txHandlers.next(this.dataLinkLayer.getTxProgress());

          switch (this.dataLinkLayer.txTimeTick(this.getCurrentTime())) {
            case TxTimeTickState.Guard:
              this.sendStop(OUTPUT_DISABLE_FALSE, NOTIFY_COMPLETE_FALSE);
              this.txTimeout = getTxGuardTimeout();
              break;

            case TxTimeTickState.Idle:
              // probably it will never happen but stop the interval just in case...
              this.sendStop(OUTPUT_DISABLE_FALSE, NOTIFY_COMPLETE_FALSE);
              break;

            case TxTimeTickState.Symbol:
              // do nothing as we already set interval that will handle it in next tick
              break;
          }
        }, this.dataLinkLayer.physicalLayer.getDspConfig().txIntervalMilliseconds);
        break;
    }
  }
}
