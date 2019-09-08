// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { DataLinkLayer, DspConfig } from '../..';

export const mainHtml = `
  <div class="data-link-layer-basic">
    <div class="section">
      <select id="transmission-mode-dropdown" onchange="example.onTransmissionModeChange(this.value)"></select>
    </div>
    <div id="controls-wrapper" style="display: none;">
      <div class="section">
        <b>SampleRate</b>
        <span id="sample-rate-label"></span> kHz
      </div>
      <div class="section">
        <input id="tx-data" maxlength="32" value="0 10 20 30 40 120 250 255" />
        <button onclick="example.transmit()">Send</button>
      </div>
      <div class="section">
        <button id="enable-receiver-button" onclick="example.receiveEnable()">Enable receiver</button>
        <span id="waiting-for-data-frames-label" style="display: none;">Waiting for data frames...</span>
      </div>
      <div class="section">
        <span id="rx-data"></span>
      </div>
    </div>
  </div>
`;

const kHzPipe = (value: number): string => {
  const s = (value / 1000).toFixed(1);

  return s.indexOf('.') === 1 ? '&nbsp;' + s : s;
};

const byteRatePipe = (value: number): string => {
  const s = value.toFixed(1);

  return s.indexOf('.') === 1 ? '&nbsp;' + s : s;
};

export const sampleRate = (dataLinkLayer: DataLinkLayer) =>
  (dataLinkLayer.physicalLayer.audioMonoIo.getSampleRate() / 1000).toFixed(1);

export const dropdownOptionEmpty = '<option value="">--- Select Transmission Mode ---</option>\n';

export const dropdownOption = (dspConfig: DspConfig) =>
  `<option value="${dspConfig.transmissionMode}">` +
  `${byteRatePipe(dspConfig.rawByteRate)} B/s | ${kHzPipe(dspConfig.band.begin)}-${kHzPipe(dspConfig.band.end)} kHz ` +
  `(${(dspConfig.band.bandwidth / 1000).toFixed(1)} kHz)` +
  '</option>\n';
