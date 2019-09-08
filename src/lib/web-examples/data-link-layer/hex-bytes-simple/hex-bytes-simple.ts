// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { DataLinkLayer, getBytesFromHex, getDspConfigList, getHexFromBytes, TransmissionMode } from '../../..';
import * as fromTemplate from './hex-bytes-simple.template';

// TODO: this example doesn't use DataLinkLayerWrapper that handles
// TODO: all timers by the AudioNetworkLite library itself
// TODO: -> example should be deleted or refactored soon

const getById = (id: string) => document.getElementById(id);

export class DataLinkLayerHexBytesSimpleWebExample {
  public dataLinkLayer: DataLinkLayer;
  public rxInterval: any;
  public txInterval: any;

  public constructor() {
    document.getElementsByTagName('html')[0].classList.add('data-link-layer-hex-bytes-simple');
    getById('audio-network-lite-root').innerHTML = fromTemplate.mainHtml;
    this.initializeTransmissionModeDropdown();
  }

  public onTransmissionModeChange(transmissionMode: TransmissionMode): void {
    this.initializeDataLinkLayer();
    if (transmissionMode) {
      this.dataLinkLayer.physicalLayer.setTransmissionMode(transmissionMode);
      getById('controls-wrapper').style.display = 'block';
      this.rxInterval && this.handleRxInterval();
      this.txInterval && this.handleTxInterval();
    } else {
      getById('controls-wrapper').style.display = 'none';
      this.clearRxInterval();
      this.clearTxInterval();
      this.dataLinkLayer.physicalLayer.audioMonoIo.inputDisable();
      this.dataLinkLayer.physicalLayer.audioMonoIo.outputDisable();
      getById('enable-receiver-button').style.display = 'block';
      getById('waiting-for-data-frames-label').style.display = 'none';
      getById('rx-data').innerHTML = '';
    }
  }

  public receiveEnable(): void {
    getById('enable-receiver-button').style.display = 'none';
    getById('waiting-for-data-frames-label').style.display = 'block';
    this.handleRxInterval();
  }

  public transmit(): void {
    const txBytes = getBytesFromHex((getById('tx-data') as HTMLInputElement).value);

    this.dataLinkLayer.setTxBytes(txBytes);
    this.handleTxInterval();
  }

  protected clearRxInterval(): void {
    clearInterval(this.rxInterval);
    this.rxInterval = null;
  }

  protected clearTxInterval(): void {
    clearInterval(this.txInterval);
    this.txInterval = null;
  }

  protected handleRxInterval(): void {
    this.clearRxInterval();
    this.rxInterval = setInterval(() => {
      let rxBytesCollection: number[][];

      this.dataLinkLayer.rxTimeTick(new Date().getTime());
      rxBytesCollection = this.dataLinkLayer.getRxBytesCollection();

      if (rxBytesCollection.length) {
        const div = document.createElement('div');

        div.innerHTML = rxBytesCollection.map(rxBytes => getHexFromBytes(rxBytes)).join(' | ');
        getById('rx-data').appendChild(div);
      }
    }, this.dataLinkLayer.physicalLayer.getDspConfig().rxIntervalMilliseconds);
  }

  protected handleTxInterval(): void {
    this.clearTxInterval();
    if (this.dataLinkLayer.txTimeTick(new Date().getTime())) {
      this.txInterval = setInterval(() => {
        !this.dataLinkLayer.txTimeTick(new Date().getTime()) && this.clearTxInterval();
      }, this.dataLinkLayer.physicalLayer.getDspConfig().txIntervalMilliseconds);
    }
  }

  protected initializeDataLinkLayer(): void {
    if (!this.dataLinkLayer) {
      // AudioNetworkLite.audioMonoIoFactory.audioMonoIoCreateMode = AudioNetworkLite.AudioMonoIoCreateMode.Stub;
      this.dataLinkLayer = new DataLinkLayer();
      getById('sample-rate-label').innerHTML = fromTemplate.sampleRate(this.dataLinkLayer);
    }
  }

  protected initializeTransmissionModeDropdown(): void {
    getById('transmission-mode-dropdown').innerHTML =
      fromTemplate.dropdownOptionEmpty +
      getDspConfigList()
        .map(dspConfig => fromTemplate.dropdownOption(dspConfig))
        .join('');
  }
}
