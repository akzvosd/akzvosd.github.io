var tmpHtml = '';
var abc = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
var cities = {};
var geo = JSON.parse(localStorage.getItem('geo'));

if (geo) {
  $('#town').html(geo.city);
  $('#delivery').html(geo.delivery);
  $('#town--mob').html(geo.city);
  $('#delivery--mob').html(geo.delivery);
}

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
});

function changeCity(city) {
  var delivery = shopAddress[city] || deliveryAddress[city] || null;

  if (delivery) {
    localStorage.setItem('geo', JSON.stringify({ city, delivery }));

    let days = 5;

    if (citiesNorthwest.indexOf(city) >= 0) days = 1;
    else if (citiesCenter.indexOf(city) >= 0) days = 3;

    $('#town').html(city);
    $('#delivery').html(delivery);
    $('#town--mob').html(city);
    $('#delivery--mob').html(delivery);
	if ($('#delivery-days')[0]) $('#delivery-days').html(`Получение картины в вашем регионе от ${days} д.`);
    $('#geoModal').hide();

    if ($('.geoModalWindow input')[0] && $('.geoModalWindow input')[0].value !== '') {
      $('.geoModalWindow input')[0].value = '';

      createGeoModal();
    }
  }
}

function createGeoModal(search = false, cs = cities) {
  var html = '';

  if (Object.keys(cs).length) {
    for (let l in cs) {
      if (cs[l].length) {
        html += `<div class="geoModalWindow__footer--wrap"><div class="geoModalWindow__footer--letter">${l.toUpperCase()}</div><div class="geoModalWindow__footer--city">`;

        cs[l].forEach(city => {
          html += `<p onclick="changeCity('${city}')">${city}</p>`;
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
