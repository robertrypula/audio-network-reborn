// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import * as spectrogramUtils from './spectrogram-utils';

/*
const INDEX_MARKER_DISABLED = false;
const INDEX_MARKER_ENABLED = true;
const ROW_MARKER_DISABLED = false;
const ROW_MARKER_ENABLED = true;
const DECIBEL_MIN = -160;
const DECIBEL_FOR_COLOR_LIGHT = -36;
const DECIBEL_FOR_COLOR_DARK = -160;
const ROW_LIMIT = 2 + 32;   // 2 for header, 30 for data
const LEFT_COLUMN_MODE_HEADER = 'LEFT_COLUMN_MODE_HEADER';
const LEFT_COLUMN_MODE_COLOR_LIGHT = 'LEFT_COLUMN_MODE_COLOR_LIGHT';
const LEFT_COLUMN_MODE_COLOR_DARK = 'LEFT_COLUMN_MODE_COLOR_DARK';
const ARRAY_INDEX_OUT_OF_RANGE_EXCEPTION = 'Array index out of range';
*/

export class Spectrogram {
  protected test: string;

  public constructor() {
    this.test = 'test';
  }
/*
  public constructor(domElement, rowLimit) {
    this.$$id = 'spectrogram-' + Math.round(Math.random() * 1000000);
    this.$$domElement = domElement;
    this.$$keyLast = null;
    this.$$renderedRowCounter = 0;
    this.$$rowLimit = rowLimit ? rowLimit : ROW_LIMIT;
    this.$$indexMin = null;
    this.$$indexMax = null;
    this.$$frequencySpacing = null;

    this.$$initializeHtml();
  };

  public add = function (frequencyData, indexMin, indexMax, frequencySpacing, indexMarker, rowMarker) {
    var
      key = spectrogramUtils.getKey(frequencyData, indexMin, indexMax, frequencySpacing),
      reinitializationNeeded = key !== this.$$keyLast,
      leftColumnMode,
      data,
      lastRowNeedsToBeRemoved,
      lastRow;

    if (frequencyData.length === 0) {
      return;
    }

    if (reinitializationNeeded) {
      this.$$reset();
      this.$$keyLast = key;
      this.$$indexMin = indexMin;
      this.$$indexMax = indexMax;
      this.$$frequencySpacing = frequencySpacing;

      data = this.$$generateHeaderLegend(frequencyData.length);
      this.$$insertRow(LEFT_COLUMN_MODE_HEADER, data, INDEX_MARKER_DISABLED);

      data = this.$$generateHeaderMarker(frequencyData.length);
      this.$$insertRow(LEFT_COLUMN_MODE_HEADER, data, INDEX_MARKER_DISABLED);
    }

    leftColumnMode = rowMarker
      ? LEFT_COLUMN_MODE_COLOR_LIGHT
      : LEFT_COLUMN_MODE_COLOR_DARK;
    this.$$insertRow(leftColumnMode, frequencyData, indexMarker);

    lastRowNeedsToBeRemoved = this.$$renderedRowCounter > this.$$rowLimit;
    if (lastRowNeedsToBeRemoved) {
      lastRow = document.querySelectorAll('#' + this.$$id + ' > .s-row:last-child')[0];
      lastRow.parentNode.removeChild(lastRow);
      this.$$renderedRowCounter--;
    }
  };

  public clear = function () {
    // TODO this is temporary code and acctually it's not clearing anything... REFACTOR!
    this.add([0, 1, 2], 0, 1, 1, 0, 0);
  };

  protected initializeHtml = function () {
    var html;

    html = '';
    html += '<div class="spectrogram-container">';
    html += '    <div class="spectrogram" id="' + this.$$id + '"></div>';
    html += '</div>';

    this.$$domElement.innerHTML = html;
  };

  protected reset = function () {
    document.getElementById(this.$$id).innerHTML = '';
    this.$$renderedRowCounter = 0;
    this.$$keyLast = null;
    this.$$indexMin = null;
    this.$$indexMax = null;
    this.$$frequencySpacing = null;
  };


  protected generateHeaderLegend = function (length) {
    var i, decibel, decibelOffset, legend, range, innerIndex;

    legend = [];
    for (i = 0; i < length; i++) {
      if (i < this.$$indexMin || i > this.$$indexMax) {
        decibel = -Infinity;
      } else {
        range = this.$$indexMax - this.$$indexMin;
        innerIndex = i - this.$$indexMin;
        decibelOffset = (-DECIBEL_MIN * innerIndex) / range;

        decibel = DECIBEL_MIN + decibelOffset;
      }
      legend.push(decibel);
    }

    return legend;
  };

  protected generateHeaderMarker = function (length) {
    var i, decibel, marker;

    marker = [];
    for (i = 0; i < length; i++) {
      if (i < this.$$indexMin || i > this.$$indexMax) {
        decibel = -Infinity;
      } else {
        decibel = i % 2 === 0
          ? DECIBEL_FOR_COLOR_LIGHT
          : DECIBEL_FOR_COLOR_DARK;
      }
      marker.push(decibel);
    }

    return marker;
  };

  protected insertRow = function (leftColumnMode, data, indexMarker) {
    var
      row = spectrogramUtils.getRow(),
      isHeader = leftColumnMode === LEFT_COLUMN_MODE_HEADER,
      cssClass = '',
      color = 'transparent',
      title = '',
      secondRow,
      decibel,
      cell,
      i;

    switch (leftColumnMode) {
      case LEFT_COLUMN_MODE_COLOR_LIGHT:
        color = spectrogramUtils.getColor(DECIBEL_FOR_COLOR_LIGHT);
        break;
      case LEFT_COLUMN_MODE_COLOR_DARK:
        color = spectrogramUtils.getColor(DECIBEL_FOR_COLOR_DARK);
        break;
    }
    cell = spectrogramUtils.getCell(cssClass, color, title);
    row.appendChild(cell);

    for (i = this.$$indexMin; i <= this.$$indexMax; i++) {
      decibel = data[i];
      if (typeof decibel === 'undefined') {
        throw ARRAY_INDEX_OUT_OF_RANGE_EXCEPTION;
      }
      cssClass = indexMarker === i ? 's-cell-mark' : '';
      color = spectrogramUtils.getColor(decibel);
      title = '[' + i + '] ' + (i * this.$$frequencySpacing).toFixed(2) + ' Hz';
      if (!isHeader) {
        title += ', ' + decibel.toFixed(1) + ' dB';
      }
      cell = spectrogramUtils.getCell(cssClass, color, title);
      row.appendChild(cell);
    }

    if (isHeader) {
      document.getElementById(this.$$id).appendChild(row);
    } else {
      // this is how you do 'insertAfter' in JavaScript ;)
      secondRow = document.querySelector('#' + this.$$id + ' > .s-row:nth-child(2)');
      secondRow.parentNode.insertBefore(row, secondRow.nextSibling);
    }

    this.$$renderedRowCounter++;
  };
*/
}
