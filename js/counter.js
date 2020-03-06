function catalogItemCounter(field) {
  var fieldCount = function(el) {
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

    el.each(function() {
      init($(this));
    });
  };

  $(field).each(function() {
    fieldCount($(this));
  });
}

catalogItemCounter('.fieldCount');

var sizePrice = parseInt($('.select--price option').val());
var facePrice = parseInt($('#facePrice').html());
var additionalFaces = 0;
var totalPrice = 0;

calcPrice();

function setSizePrice(e) {
  sizePrice = parseInt(e.value);

  calcPrice();
}

function setFaces(value) {
  additionalFaces = value - 1;

  calcPrice();
}

function calcPrice() {
  if (sizePrice === -1) return $('#selectV').html('Для расчёта стоимости <br>нажмите «Заказать» и заполните форму');

  totalPrice = sizePrice + additionalFaces * facePrice;

  $('#selectV').html(`Цена: ${totalPrice} руб.`);
}
