class GeoTools {
  /**
 *  @description Функция получения координат пользователя
 * @param
 *
 */
  getUserCoords () {
    return new Promise(function (resolve, reject) {
      window.navigator.geolocation.getCurrentPosition(function (pos) {
        resolve(pos.coords);
      }, function (err) {
        reject(err.message);
      });
    });
  };

  /**
 *  @description Функция принимает координаты двух точек и возвращает расстояние между ними
 * @param {object} pointA объект с координатами первой точки
 * @param {object} pointB объект с координатами второй точки
 *
 */

  getDistance (pointA, pointB) {
    const toRad = Math.PI / 180;
    const lat1 = pointA.latitude * toRad;
    const long1 = pointA.longitude * toRad;
    const lat2 = pointB.latitude * toRad;
    const long2 = pointB.longitude * toRad;
    const R = 6371; // Радиус Земли в км

    return 2 * R * Math.asin(((Math.sin((lat2 - lat1) / 2) ** 2) +
        (Math.cos(lat1) * Math.cos(lat1) * (Math.sin((long2 - long1) / 2) ** 2))) ** (1 / 2));
  };

  /**
 *  @description Функция принимает объект карты и массив станций и центрирует карту на ближаейшей из них
 * @param {array} stations массив станций
 * @param {object} map карта
 *
 */

  async findClosestStation (stations, map) {
    const position = await this.getUserCoords();

    const coordsStations = stations.map(item => {
      return {
        latitude: item.AddressInfo.Latitude,
        longitude: item.AddressInfo.Longitude
      };
    });

    let closestDist = Infinity;
    let closestStation = null;
    for (const item of coordsStations) {
      const dist = this.getDistance(position, item);
      if (dist < closestDist) {
        closestDist = dist;
        closestStation = item;
      }
    };
    document.getElementById('dist').innerText = ` -> ${closestDist.toFixed(2)} kilometers`;
    map.setCenter([closestStation.latitude, closestStation.longitude], 15);
  };
};

module.exports = new GeoTools();
