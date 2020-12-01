let client = { x: 0, y: 0 };
 
setClient = (e, slider) => {
  return (client = { x: e.clientX - slider.offsetLeft, y: e.clientY - slider.offsetTop });
};
 
let sliders = document.querySelectorAll('.style--container');
 
sliders.forEach((slider, i) => {
  let slide2 = slider.querySelector('.style--slide2');
 
  slider.onmousemove = e => {
    setClient(e, slider);
 
    let width = slider.clientWidth - client.x;
 
    if (width <= slider.clientWidth) slide2.style.width = width + 'px';
  };
 
  slider.onmouseleave = e => {
    setClient(e, slider);
 
    if (client.y <= 0 && client.y >= slider.clientHeight) return 0;
    if (client.x < 0) return (slide2.style.width = '100%');
    if (client.x > slider.clientWidth) return (slide2.style.width = '0');
  };
 
  // slider.onmouseleave = () => {
  //   slide2.style.width = '50%';
  // };
});