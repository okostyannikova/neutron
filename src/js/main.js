(function() {
  var slider = document.querySelector("#slider");
  var slides = document.querySelectorAll("#slider .slide");
  var indicators = document.createElement("div");
  var indicatorItem = document.createElement("button");
  var indicatorItems;
  var currentSlide = 0;

  indicators.classList.add("indicators");
  indicatorItem.classList.add("indicator-item");

  for (var i = 0; i < slides.length; i++) {
    indicators.appendChild(indicatorItem.cloneNode());
  }
  slider.appendChild(indicators);

  indicatorItems = document.querySelectorAll("#slider .indicator-item");

  function nextSlide() {
    slides[currentSlide].classList.remove("showing");
    indicatorItems[currentSlide].classList.remove("active");

    currentSlide = (currentSlide + 1) % slides.length;

    slides[currentSlide].classList.add("showing");
    indicatorItems[currentSlide].classList.add("active");
  }

  setInterval(nextSlide, 4000);
})();
