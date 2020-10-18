var styles = {
  Imagine: 1500,
  Акварель: 1500,
  'Dream Art': 1500,
  'Pop Art': 1700,
  'Портрет из слов': 990,
  'Мульт-герой': 2500,
  Масло: 1500,
  Шарж: 1000,
  'Love is...': 300,
  'В образе': 1500,
  'X2 Экспозиция': 990,
  'В другом стиле': 2500,
  'Коллаж': 500,
};

var sizes = {
  20: {
    30: [790, 25],
  },
  30: {
    30: [1160, 44],
    40: [1490, 50],
    60: [1660, 50],
    90: [2550, 50],
  },
  40: {
    40: [1790, 50],
    50: [1990, 50],
    60: [2290, 50],
    80: [2540, 50],
    120: [3900, 50],
  },
  50: {
    50: [2350, 50],
    70: [2690, 50],
    100: [3710, 50],
  },
  60: {
    60: [2890, 50],
    80: [3450, 50],
    90: [3770, 50],
    120: [4720, 50],
  },
  80: {
    80: [4270, 50],
    100: [5080, 50],
    120: [6300, 50],
  },
  100: {
    100: [5910, 50],
    150: [11050, 30],
    200: [13150, 30],
    290: [16930, 30],
  },
  110: {
    110: [9730, 30],
    150: [11620, 30],
  },
  120: {
    120: [10650, 30],
    200: [14590, 30],
    240: [16510, 30],
  },
  140: {
    140: [12680, 30],
    200: [16030, 30],
  },
  150: {
    290: [21880, 30],
  },
};

function catalogItemCounter(field) {
  var fieldCount = function (el) {
    var // Мин. значение
      min = el.data('min') || false,
      // Макс. значение
      max = el.data('max') || false,
      // Кнопка уменьшения кол-ва
      dec = el.prev('.dec'),
      // Кнопка увеличения кол-ва
      inc = el.next('.inc');

    function init(el) {
      if (!el.attr('disabled')) {
        dec.on('click', decrement);
        inc.on('click', increment);
      }

      // Уменьшим значение
      function decrement() {
        var value = parseInt(el[0].value);
        value--;

        if (!min || value >= min) {
          el[0].value = value;

          setFaces(value);
        }
      }

      // Увеличим значение
      function increment() {
        var value = parseInt(el[0].value);
        value++;

        if (!max || value <= max) {
          el[0].value = value;

          setFaces(value);
        }
      }
    }

    el.each(function () {
      init($(this));
    });
  };

  $(field).each(function () {
    fieldCount($(this));
  });
}

catalogItemCounter('.fieldCount');

var sizePrice = 0;
var facePrice = parseInt($('#facePrice').html());
var additionalFaces = 0;
var totalPrice = 0;
var opt;

function setSizePrice(e) {
  opt = e;

  if (e.value !== '-1') {
    var size = opt.value.split(',');
    var data = sizes[size[0]][size[1]];
    var price = Math.round((data[0] - data[0] * (data[1] / 100)) / 10) * 10 + styles[style];
    // var sale = Math.round((1 - price / (data[0] + styles[style])) * 100);

    // sizePrice = Math.floor(data[0] + styles[style] - (data[0] + styles[style]) * (sale / 100));
    sizePrice = price;
  } else {
    sizePrice = -1;
  }

  calcPrice(e);
}

function setFaces(value) {
  additionalFaces = value - 1;

  calcPrice();
}

function calcPrice() {
  if (sizePrice === -1) {
    $('#selectPV').html('');
    $('#selectV').html('Для расчёта стоимости <br>нажмите «Сделать заказ»<br> и заполните форму');

    return 0;
  }

  totalPrice = sizePrice + additionalFaces * facePrice;

  var size = opt.value.split(',');
  var data = sizes[size[0]][size[1]];

  $('#selectPV').html(`${data[0] + styles[style] + additionalFaces * facePrice} руб.`);
  $('#selectV').html(`${totalPrice} руб.`);
}

function initSelect() {
  var select = document.querySelector('.select--price');
  var options = select.querySelectorAll('option');

  for (var i = 0; i < options.length; i++) {
    var size = options[i].value.split(',');
    var data = sizes[size[0]][size[1]];
    // var price = data[0] - data[0] * (data[1] / 100) + styles[style];
    var price = Math.round((data[0] - data[0] * (data[1] / 100)) / 10) * 10 + styles[style];
    var sale = Math.round((1 - price / (data[0] + styles[style])) * 100);

    // price = Math.floor(data[0] + styles[style] - (data[0] + styles[style]) * (sale / 100));

    if (i === 0) {
      sizePrice = price;
      opt = options[i];
    }

    options[i].innerText += `${size[0]}x${size[1]} см (-${sale}%)`;
  }

  select.innerHTML += '<option value="-1">Другой размер</option>';

  calcPrice();
  
  onResize();
}

initSelect();

$(window).resize(onResize);

function onResize() {
  var calculatorDiv = document.querySelector('.calculator');
  var place;
  var prevPlace;
  
  if (window.innerWidth <= 900) {
    prevPlace = document.querySelector('.calculator-place-desktop');
    place = document.querySelector('.calculator-place-mobile');
  } else {
    prevPlace = document.querySelector('.calculator-place-mobile');
    place = document.querySelector('.calculator-place-desktop');
  }
  
  if (prevPlace.childNodes.length) {
    var node = prevPlace.childNodes.length === 3 ? prevPlace.childNodes[1] : prevPlace.childNodes[0];
    place.appendChild(node);
  }
}
