/* eslint-disable no-undef */

const getDataChart = require('../src/getDataChart.js');

test('testing data processing for a сhart', () => {
  const testData = [{ Connections: [1, 2] }, { Connections: [1, 2] }, { Connections: [1] }];
  const result = [{ name: 2, y: 2 }, { name: 1, y: 1 }];
  expect(getDataChart(testData)).toStrictEqual(result);
});

const geoTools = require('../src/geoTools.js');

test('test distance calculation', () => {
  const pointA = { latitude: 53.859754, longitude: 27.680558 };
  const pointB = { latitude: 53.864069, longitude: 30.258932 };
  expect(geoTools.getDistance(pointA, pointB)).toBeCloseTo(169.078);
});
