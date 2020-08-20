/**
 *  @description Принимает массив станций из функции пагинации и отрисовывает указаную страницу
 * @param {array} page Массив станций для обработки
 *
 */

function renderListStations (page, map) {
  const listStations = document.getElementById('listStations');
  listStations.innerText = '';
  page.forEach(item => {
    listStations.insertAdjacentHTML('beforeend', `
            <li id = ${item.ID}>
                <p><b>${item.AddressInfo.Title}</b></p>
                <p>Usage Cost: ${item.UsageCost ? item.UsageCost : 'N/A'}</p>
                <p>Charging connections: ${item.Connections.length}</p>
            </li>
            `);
    document.getElementById(`${item.ID}`).addEventListener('click', () => {
      map.setCenter([item.AddressInfo.Latitude, item.AddressInfo.Longitude], 19);
    });
  });
};

/**
 *  @description Принимает обеъект карты и массив станций видимых на карте и разбивает на страницы
 * @param {array} list Массив станций для обработки
 *
 */
function paginatingList (list, map) {
  let itemsOnPage = 100;
  if (list.length > 2000) { itemsOnPage = 500; }
  const pages = Math.ceil(list.length / itemsOnPage);
  const listPages = document.getElementById('listPages');
  listPages.innerText = '';
  if (pages > 1) {
    listPages.style.display = 'flex';
    for (let i = 1; i < pages + 1; i++) {
      const li = document.createElement('li');
      li.innerText = i;
      li.setAttribute('data-number', `${i}`);
      listPages.appendChild(li);
    };
  } else {
    listPages.style.display = 'none';
  }

  let page = list.slice(0, itemsOnPage);
  renderListStations(page, map);

  listPages.addEventListener('click', event => {
    const pageNumber = event.target.dataset.number;
    page = list.slice((pageNumber - 1) * itemsOnPage, pageNumber * itemsOnPage);
    renderListStations(page, map);
  });
};
module.exports = paginatingList;
