// Copyright (c) 2019-2021 Robert Rypuła - https://github.com/robertrypula

import { DataLinkLayer, DspConfig } from '../../../../index';

export const mainHtml: string = `
  <div class="section">
    <select id="dsp-mode-dropdown" onchange="example.onDspModeChange(this.value)"></select>
  </div>
  <div id="controls-wrapper" style="display: none;">
    <div class="section">
      <b>SampleRate</b>
      <span id="sample-rate-label"></span> kHz
    </div>
    <div class="section">
      <input id="tx-data" maxlength="23" value="00 0a 14 1e 28 80 fa ff" />
      <button onclick="example.transmit()">Send HEX</button>
    </div>
    <div class="section">
      <button id="enable-receiver-button" onclick="example.receiveEnable()">Enable HEX receiver</button>
      <span id="waiting-for-data-frames-label" style="display: none;">Waiting for data frames...</span>
    </div>
    <div class="section">
      <div id="rx-data"></div>
    </div>
  </div>
`;

const kHzPipe = (value: number): string => {
  const s: string = (value / 1000).toFixed(3);

  return s.indexOf('.') === 1 ? '&nbsp;' + s : s;
};

const byteRatePipe = (value: number): string => {
  const s: string = value.toFixed(1);

  return s.indexOf('.') === 1 ? '&nbsp;' + s : s;
};

export const sampleRate = (dataLinkLayer: DataLinkLayer): string =>
  (dataLinkLayer.physicalLayer.audioMonoIo.getSampleRate() / 1000).toFixed(1);

export const dropdownOptionEmpty = '<option value="">--- Select Dsp Mode ---</option>';

export const dropdownOption = (dspConfig: DspConfig): string =>
  `<option value="${dspConfig.dspMode}">` +
  `${byteRatePipe(dspConfig.rawByteRate)} B/s | ${kHzPipe(dspConfig.band.begin)}-${kHzPipe(dspConfig.band.end)} kHz ` +
  `(${(dspConfig.band.bandwidth / 1000).toFixed(3)} kHz)` +
  '</option>';
