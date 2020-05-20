/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

/**
 *  @description Принимает массив станций из API и возварщает массив объектов каждый
 * из которыйх содержит количество станций с таким же числом подклчений
 * @param {array} data Массив станций для обработки
 *
 */

function getDataChart (data) {
  const connections = [];
  data.forEach(item => {
    if (!connections.includes(item.Connections.length)) {
      connections.push(item.Connections.length);
    };
  });
  const result = connections.map(elem => {
    elem = {
      name: elem,
      y: 0
    };
    data.forEach(item => {
      if (item.Connections.length === elem.name) {
        elem.y++;
      }
    });
    return elem;
  });
  return result;
}

module.exports = getDataChart;
