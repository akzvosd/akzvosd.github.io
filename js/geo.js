var tmpHtml = '';
var abc = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
var cities = {};
var geo = JSON.parse(localStorage.getItem('geo'));
var showTooltip = true;

if (geo) {
  if (Object.keys(geo).indexOf('showTooltip') === -1) geo = undefined;
  else showTooltip = geo.showTooltip;
}

if (geo) setHtml();

// $(document).ready(function() {
$(window).on('load', function() {
  $('#geoModalOpen').click(function() {
    $('#geoModal').show();
  });
  $('#geoModalOpenMobile').click(function() {
    $('#geoModal').show();
  });
  $('#geoModalClose').click(function() {
    $('#geoModal').hide();
  });

  if (geo) changeCity(geo.city);
  else changeCity(ymaps.geolocation.city);

  abc.split('').forEach(l => {
    cities[l] = [];
  });

  for (let city in deliveryAddress) {
    let fl = city[0].toLowerCase();

    cities[fl].push(city);
  }

  if ($('.geoModalWindow__footer')[0]) tmpHtml = $('.geoModalWindow__footer')[0].innerHTML;

  createGeoModal();

  if (showTooltip) $('#tooltip').css('visibility', 'visible');
  else tooltipClose();
});

function changeCity(city, setShowTooltipToFalse = false) {
  var delivery = shopAddress[city] || deliveryAddress[city] || null;

  if (delivery) {
    if (setShowTooltipToFalse) {
      showTooltip = false;
      tooltipClose();
    }

    geo = { city, delivery, showTooltip };

    localStorage.setItem('geo', JSON.stringify(geo));

    let days = 5;

    if (citiesNorthwest.indexOf(city) >= 0) days = 1;
    else if (citiesCenter.indexOf(city) >= 0) days = 3;

    setHtml();
	
	// if ($('#delivery-days')[0]) $('#delivery-days').html(`Изготовление картины от ${days} ${days === 1 ? 'дня' : 'дней'}`);
	if ($('#delivery-days')[0]) $('#delivery-days').html(`Получение картины в вашем регионе от ${days} ${days === 1 ? 'дня' : 'дней'}`);
    $('#geoModal').hide();

    if ($('.geoModalWindow input')[0] && $('.geoModalWindow input')[0].value !== '') {
      $('.geoModalWindow input')[0].value = '';

      createGeoModal();
    }
  }
}

function setHtml() {
  $('#town').html(geo.city);
  $('#delivery').html(geo.delivery);
  $('#delivery--mob').html(geo.delivery);
  $('#town--hero').html(geo.city);
  $('#town--mob').html(geo.city);
  $('#delivery--hero').html(geo.delivery);
}

function createGeoModal(search = false, cs = cities) {
  var html = '';

  if (Object.keys(cs).length) {
    for (let l in cs) {
      if (cs[l].length) {
        html += `<div class="geoModalWindow__footer--wrap"><div class="geoModalWindow__footer--letter">${l.toUpperCase()}</div><div class="geoModalWindow__footer--city">`;

        cs[l].forEach(city => {
          html += `<p onclick="changeCity('${city}', true)">${city}</p>`;
        });

        html += '</div></div>';
      }
    }
  } else {
    html =
      '<div class="geoModalWindow__footer--wrap"><div class="geoModalWindow__footer--letter"></div><div class="geoModalWindow__footer--city"><p>Ничего не найдено</p></div></div>';
  }

  $('.geoModalWindow__footer').html(search ? html : tmpHtml + html);
}

function handleGeoModalInput(query) {
  if (query === '') return createGeoModal();

  query = query.toLowerCase();

  let fl = query[0];
  let array = cities[fl];
  let cs = {};

  if (array) {
    cs[fl] = [];

    array.forEach(c => {
      if (c.toLowerCase().indexOf(query) >= 0) cs[fl].push(c);
    });
  }

  createGeoModal(true, cs);
}

function tooltipClose() {
  showTooltip = false;
  geo.showTooltip = showTooltip;

  localStorage.setItem('geo', JSON.stringify(geo));
  $('#tooltip').css('display', 'none');
}

function tooltipOpen() {
  $('#geoModalOpen').click();
}
