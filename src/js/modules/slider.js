/**
 * Отвечает за работу слайдера. Периодическая смена слайдев. Управление с помощью кнопок-точек
 *
 */
function showSlider() {
  if (document.querySelector('.game__slider-list')) {
    let index = 0;
    const slidesList = document.querySelectorAll('.game__slide')

    /**
     * Отвечает за смену активного слайда. Удаляет активный класс у всех слайдов, добавляет активный класс, выбранному слайду
     *
     * @param {number} slideIndex Индекс активного слайда.
     */
    function activeSlide(slideIndex) {
      slidesList.forEach((slide) => {
        slide.classList.remove('game__slide--active');
      });

      slidesList[slideIndex].classList.add('game__slide--active');
    }

    /**
     * Отвечает за переключение слайда на следующий. Если слайд последний, происходит переключение на первый слайд
     *
     */
    function nextSlide() {
      if (index === slidesList.length - 1) {
        index = 0;
        activeSlide(index);
      } else {
        index++;
        activeSlide(index);
      }
    }

    setInterval(nextSlide, 2000);
  }
}

export default showSlider;
