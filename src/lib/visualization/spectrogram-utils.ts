// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

/*
const getKey = function (frequencyData, indexMin, indexMax, frequencySpacing) {
  return frequencyData.length + '|' + indexMin + '|' + indexMax + '|' + frequencySpacing.toFixed(12);
};

const getCell = function (cssClass, color, title) {
  var cell;

  cell = document.createElement('div');
  cell.className = 's-cell ' + cssClass;
  cell.style.backgroundColor = color;
  cell.setAttribute('title', title);

  return cell;
};

const getRow = function () {
  var row;

  row = document.createElement('div');
  row.className = 's-row';

  return row;
};

const getColor = function (decibel) {
  var color, hsl;

  hsl = getHsl(decibel);
  color = 'hsl(' + hsl[0] + ', ' + hsl[1] + '%, ' + hsl[2] + '%)';

  return color;
};

const getHsl = function (decibel) {
  var
    colorMap = [
      {decibel: -160, hsl: [240, 80, 10]},
      {decibel: -100, hsl: [240, 80, 20]},
      {decibel: -80, hsl: [240, 80, 60]},
      {decibel: -50, hsl: [120, 80, 60]},
      {decibel: -30, hsl: [41, 80, 60]},
      {decibel: -20, hsl: [0, 80, 60]},
      {decibel: 0, hsl: [0, 80, 50]}
    ],
    lastIndex = colorMap.length - 1,
    hsl,
    value,
    unitPosition,
    colorLower,
    colorUpper,
    i;

  if (decibel <= colorMap[0].decibel) {
    return colorMap[0].hsl;
  }

  if (decibel >= colorMap[lastIndex].decibel) {
    return colorMap[lastIndex].hsl;
  }

  for (i = 0; i <= lastIndex; i++)
    if (colorMap[i].decibel >= decibel) {
      i = i - 1;
      break;
    }

  colorLower = colorMap[i];
  colorUpper = colorMap[i + 1];

  unitPosition = (decibel - colorLower.decibel) / (colorUpper.decibel - colorLower.decibel);
  unitPosition = unitPosition < 0.0 ? 0.0 : unitPosition;
  unitPosition = unitPosition > 1.0 ? 1.0 : unitPosition;

  hsl = [];
  for (i = 0; i < 3; i++) {
    value = ease(colorLower.hsl[i], colorUpper.hsl[i], unitPosition);
    if (i === 0) {
      value = (value + 360) % 360;
    } else {
      value = value < 0 ? 0 : value;
      value = value > 100 ? 100 : value;
    }
    hsl.push(parseFloat(value.toFixed(2)));
  }

  return hsl;
};
*/

export const ease = (min: number, max: number, unitPosition: number): number => {
  return min + (max - min) * 0.5 * (Math.sin(unitPosition * Math.PI - 0.5 * Math.PI) + 1.0);
};
