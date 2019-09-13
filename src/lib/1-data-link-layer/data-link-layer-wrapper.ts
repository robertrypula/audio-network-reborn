// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { DataLinkLayer } from '@data-link-layer/data-link-layer';
import { DataLinkLayerWrapperListenHandlers, DataLinkLayerWrapperSendHandlers } from '@data-link-layer/model';

export class DataLinkLayerWrapper {
  protected rxHandlers: DataLinkLayerWrapperListenHandlers;
  protected rxInterval: any;
  protected txHandlers: DataLinkLayerWrapperSendHandlers;
  protected txInterval: any;

  public constructor(public readonly dataLinkLayer: DataLinkLayer) {}

  public listen(handlers: DataLinkLayerWrapperListenHandlers): boolean {
    if (this.rxInterval) {
      return false;
    }

    this.rxHandlers = handlers;
    this.handleRxInterval();

    return true;
  }

  public listenStop(inputDisable: boolean = true): void {
    clearInterval(this.rxInterval);
    this.rxInterval = null;
    this.rxHandlers && this.rxHandlers.complete && this.rxHandlers.complete();
    inputDisable && this.dataLinkLayer.physicalLayer.audioMonoIo.inputDisable();
  }

  public send(bytes: number[], handlers: DataLinkLayerWrapperSendHandlers): boolean {
    if (this.txInterval) {
      return false;
    }

    this.txHandlers = handlers;
    this.dataLinkLayer.setTxBytes(bytes);
    this.handleTxInterval();

    return true;
  }

  public sendStop(outputDisable: boolean = true): void {
    clearInterval(this.txInterval);
    this.txInterval = null;
    this.txHandlers && this.txHandlers.complete && this.txHandlers.complete();
    outputDisable && this.dataLinkLayer.physicalLayer.audioMonoIo.outputDisable();
  }

  protected getCurrentTime(): number {
    return new Date().getTime();
  }

  protected handleRxInterval(): void {
    this.rxInterval = setInterval(() => {
      const rxIntervalShouldStop: boolean = !this.dataLinkLayer.rxTimeTick(this.getCurrentTime());

      if (rxIntervalShouldStop) {
        this.listenStop(false);
        return;
      }
      if (this.rxHandlers.next) {
        this.dataLinkLayer.getRxBytesCollection().forEach(rxBytes => this.rxHandlers.next(rxBytes));
      }
    }, this.dataLinkLayer.physicalLayer.getDspConfig().rxIntervalMilliseconds);
  }

  protected handleTxInterval(): void {
    this.txHandlers.next && this.txHandlers.next(this.dataLinkLayer.getTxProgress());
    this.dataLinkLayer.txTimeTick(this.getCurrentTime());
    this.txInterval = setInterval(() => {
      this.txHandlers.next && this.txHandlers.next(this.dataLinkLayer.getTxProgress());
      !this.dataLinkLayer.txTimeTick(this.getCurrentTime()) && this.sendStop(false);
    }, this.dataLinkLayer.physicalLayer.getDspConfig().txIntervalMilliseconds);
  }
}
