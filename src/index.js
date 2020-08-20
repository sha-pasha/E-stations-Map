/* eslint-disable no-return-assign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const geoTools = require('../src/geoTools.js');
const paginatingList = require('../src/setListStation.js');
const getDataChart = require('../src/getDataChart.js');

class App {
  constructor () {
    this.map = null;
    this.clusterer = {};
    this.stations = [];
    this.countStations = 2000;
    this.country = 'GB';
  };

  async start () {
    ymaps.ready(() => this.initMap());

    const findButton = document.getElementById('findButton');
    findButton.addEventListener('click', () => {
      geoTools.findClosestStation(this.stations, this.map);
    });

    const butOptions = document.getElementById('butOptions');
    const setOptions = document.getElementById('setOptions');
    butOptions.onclick = () => setOptions.classList.toggle('invisible');
    const inputRange = document.getElementById('inputRange');
    const rangeValue = document.getElementById('rangeValue');
    inputRange.onchange = () => rangeValue.innerText = inputRange.value;
    const selectCountry = document.getElementById('selectCountry');
    document.getElementById('applyOpions').onclick = () => {
      this.countStations = inputRange.value;
      this.country = selectCountry.value;
      this.loadData();
      setOptions.classList.toggle('invisible');
    };
  };

  initMap () {
    this.map = new ymaps.Map('map', {
      center: [52.48884062, -1.88595022],
      zoom: 8
    });

    this.map.controls.remove('rulerControl');
    this.map.controls.remove('trafficControl');
    this.map.controls.remove('searchControl');
    this.map.controls.remove('fullscreenControl');
    this.clusterer = new ymaps.Clusterer({
      minClusterSize: 3,
      gridSize: 128,
      zoomMargin: 40,
      clusterIcons: [{
        href: 'images/cluster_icon.png',
        size: [40, 40],
        offset: [-20, -20]
      },
      {
        href: 'images/cluster_icon.png',
        size: [60, 60],
        offset: [-30, -30]
      }
      ],
      clusterNumbers: [100],
      clusterIconContentLayout: ymaps.templateLayoutFactory.createClass(
        '<div style="font-size: 1.1em; font-weight: bold;">$[properties.geoObjects.length]</div>')
    });
    this.loadData();
  }

  async loadData () {
    const data = (await axios.get(`https://api.openchargemap.io/v3/poi/?output=json&countrycode=${this.country}&maxresults=${this.countStations}&compact=true&verbose=false`)).data;
    this.stations = data;
    this.map.setCenter([data[0].AddressInfo.Latitude, data[0].AddressInfo.Longitude], 7);

    const points = [];

    this.stations.forEach(item => {
      const point = new ymaps.Placemark([item.AddressInfo.Latitude, item.AddressInfo.Longitude], {

        balloonContentHeader: item.AddressInfo.Title,
        balloonContentBody: `
                    <div class='info'>
                        <p><b>Address:</b> ${item.AddressInfo.AddressLine1}${item.AddressInfo.Town ? ', ' + item.AddressInfo.Town : ''}${item.AddressInfo.StateOrProvince ? ', ' + item.AddressInfo.StateOrProvince : ''}</p>
                        <p><b>Telephone: </b>${item.AddressInfo.ContactTelephone1 ? item.AddressInfo.ContactTelephone1 : 'N/A'}</p>
                        <p><b>Usage Cost: </b>${item.UsageCost ? item.UsageCost : 'N/A'}</p>
                        <p><b>Charging connections:</b> ${item.Connections.length}</p>
                    </div>
                        `,
        balloonContentFooter: item.AddressInfo.Latitude + ' ' + item.AddressInfo.Longitude,
        hintContent: item.AddressInfo.Title
      }, {
        iconLayout: 'default#image',
        iconImageHref: 'images/point_icon6.png',
        iconImageSize: [45, 45],
        iconImageOffset: [-15, -45]
      });

      points.push(point);
    });

    this.clusterer.removeAll();
    this.clusterer.add(points);
    this.map.geoObjects.add(this.clusterer);
    this.map.events.add('boundschange', () => this.filterVisibleStations());

    this.filterVisibleStations();
  }

  filterVisibleStations () {
    const visibleField = {
      minLatitude: this.map.getBounds()[0][0],
      minLongitude: this.map.getBounds()[0][1],
      maxLatitude: this.map.getBounds()[1][0],
      maxLongitude: this.map.getBounds()[1][1]
    };
    const data = this.stations.filter(item => {
      return item.AddressInfo.Latitude < visibleField.maxLatitude &&
                item.AddressInfo.Latitude > visibleField.minLatitude &&
                item.AddressInfo.Longitude < visibleField.maxLongitude &&
                item.AddressInfo.Longitude > visibleField.minLongitude;
    });

    paginatingList(data, this.map);
    this.getChart(data);
  };

  getChart (data) {
    const dataChart = getDataChart(data);
    const chart = Highcharts.chart('chart', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Number of charging connections per station'
      },
      tooltip: {
        pointFormat: '{series.name}: {point.percentage:.1f}%'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b> - </br>{point.percentage:.1f} %',
            distance: 10
          },
          startAngle: -90,
          endAngle: 90,
          center: ['45%', '100%'],
          size: '180%'
        }
      },
      series: [{
        name: 'Connections',
        colorByPoint: true,
        data: dataChart,
        innerSize: '40%'
      }]
    });
  };
};

const app = new App(document.getElementById('app'));
app.start();
