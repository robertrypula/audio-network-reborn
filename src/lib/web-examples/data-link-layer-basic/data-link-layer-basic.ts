// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { DataLinkLayer } from '../../data-link-layer/data-link-layer';
import { TransmissionMode } from '../../physical-layer/model';
import { getDspConfigList } from '../../physical-layer/utils';
import * as fromTemplate from './data-link-layer-basic.template';

export class DataLinkLayerBasicWebExample {
  public dataLinkLayer: DataLinkLayer;
  public rxInterval: any;
  public txInterval: any;

  public constructor() {
    document.getElementById('audio-network-lite-root').innerHTML = fromTemplate.html;
    this.initializeTransmissionModeDropdown();
  }

  public onTransmissionModeChange(transmissionMode: TransmissionMode): void {
    this.initializeDataLinkLayer();
    if (transmissionMode) {
      this.dataLinkLayer.physicalLayer.setTransmissionMode(transmissionMode);
      document.getElementById('controls-wrapper').style.display = 'block';
      this.rxInterval && this.initializeRxInterval();
      this.txInterval && this.initializeTxInterval();
    } else {
      document.getElementById('controls-wrapper').style.display = 'none';
      this.clearRxInterval();
      this.clearTxInterval();
      this.dataLinkLayer.physicalLayer.audioMonoIo.inputDisable();
      this.dataLinkLayer.physicalLayer.audioMonoIo.outputDisable();
      document.getElementById('enable-receiver-button').style.display = 'block';
      document.getElementById('waiting-for-data-frames-label').style.display = 'none';
      document.getElementById('rx-data').innerHTML = '';
    }
  }

  public receiveEnable(): void {
    document.getElementById('enable-receiver-button').style.display = 'none';
    document.getElementById('waiting-for-data-frames-label').style.display = 'block';
    this.initializeRxInterval();
  }

  public transmit(): void {
    const txBytes = (document.getElementById('tx-data') as HTMLInputElement).value
      .split(' ')
      .filter(item => item.trim() !== '')
      .map(item => parseInt(item, 10));

    this.dataLinkLayer.setTxBytes(txBytes);
    this.dataLinkLayer.txTimeTick();
    this.initializeTxInterval();
  }

  protected clearRxInterval(): void {
    clearInterval(this.rxInterval);
    this.rxInterval = null;
  }

  protected clearTxInterval(): void {
    clearInterval(this.txInterval);
    this.txInterval = null;
  }

  protected initializeDataLinkLayer(): void {
    if (!this.dataLinkLayer) {
      // AudioNetworkLite.audioMonoIoFactory.audioMonoIoCreateMode = AudioNetworkLite.AudioMonoIoCreateMode.Stub;
      this.dataLinkLayer = new DataLinkLayer();
      document.getElementById('sample-rate-label').innerHTML = fromTemplate.sampleRate(this.dataLinkLayer);
    }
  }

  protected initializeTransmissionModeDropdown(): void {
    document.getElementById('transmission-mode-dropdown').innerHTML =
      fromTemplate.dropdownOptionEmpty + getDspConfigList().map(dspConfig => fromTemplate.dropdownOption(dspConfig));
  }

  protected initializeRxInterval(): void {
    this.clearRxInterval();
    this.rxInterval = setInterval(() => {
      let rxBytesCollection: number[][];

      this.dataLinkLayer.rxTimeTick();
      rxBytesCollection = this.dataLinkLayer.getRxBytesCollection();

      if (rxBytesCollection) {
        document.getElementById('rx-data').innerHTML =
          document.getElementById('rx-data').innerHTML +
          rxBytesCollection.map(rxBytes => rxBytes.join(' ')).join(' | ') +
          '<br/>';
      }
    }, this.dataLinkLayer.physicalLayer.getDspConfig().timeTickMillisecondsRx);
  }

  protected initializeTxInterval(): void {
    this.clearTxInterval();
    this.txInterval = setInterval(() => {
      if (!this.dataLinkLayer.txTimeTick()) {
        this.clearTxInterval();
      }
    }, this.dataLinkLayer.physicalLayer.getDspConfig().timeTickMillisecondsTx);
  }
}
