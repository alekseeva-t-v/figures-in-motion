import { DOM } from './dom-element';
import { COLORS, FIGURES, DEFEAT, VICTORY } from './settings';
import showSlider from './slider';

function showGame() {
  let speed = 3500;
  let countFigures = 9;
  let sound = 1;
  let isVictory = false;
  let timerId;

  /**
   * Добавляет разметку в родительский элемент.
   *
   * @param {object} parentElement Родительский элемент.
   * @param {string} childElement Разметка дочернего элемента.
   */
  function addMarkup(parentElement, childElement) {
    parentElement.innerHTML = childElement;
  }

  /**
   * Создает и возвращает разметку рабочего экрана, при этом перемещая предыдущий экран из видимой области и очишая его содержимое
   *
   * @param {object} parentElement Родительский элемент.
   * @return {object} разметка рабочего экрана.
   */
  function addScreen(parentElement) {
    const newScreen = document.createElement('div');
    newScreen.className = 'screen';
    parentElement.append(newScreen);

    const screenFirst = document.querySelector('.screen');
    screenFirst.classList.add('up');
    screenFirst.innerHTML = '';

    return newScreen;
  }

  /**
   * Удаляет элемент первого (скрытого) экрана
   *
   */
  function removeScreen() {
    const screenFirst = document.querySelector('.screen');
    screenFirst.remove();
  }

  /**
   * Возвращает рандомное число из заданного диапазона.
   *
   * @param {number} min минимальное значение.
   * @param {number} max максимальное значение.
   * @param {number} exception число, которое необходимо исключить из диапазона.
   * @return {number} рандомное число.
   */
  function getRandomNumber(min, max, exception = -1) {
    const randomNumber = Math.round(Math.random() * (max - min) + min);
    if (randomNumber === exception) {
      return randomNumber + 1 < max ? randomNumber + 1 : randomNumber - 1;
    }
    return randomNumber;
  }

  /**
   * Присваивает указанному параметру значение датаатрибута выбранной кнопки, меняет оформлениеп активной кнопки.
   *
   * @param {object} parentElement родительский элемент, в котором находится группа кнопок.
   * @param {string} param строковое название параметра за который отвечает группа кнопок.
   *
   */
  function changeActiveButton(parentElement, param) {
    parentElement.addEventListener('click', (event) => {
      if (event.target.closest('.button')) {
        const buttonClick = event.target.closest('.button');
        if (param === 'speed') speed = Number(buttonClick.dataset[param]);
        if (param === 'sound') sound = Number(buttonClick.dataset[param]);

        console.log('speed', speed)
        console.log('sound', sound)

        const buttons = parentElement.querySelectorAll('.button');

        buttons.forEach((button) => {
          button.classList.remove('button--active');
        });

        buttonClick.classList.add('button--active');
      }
    });
  }

   /**
   * Отображает новые фигуры, если игра не закончена
   *
   */
  function showFigures() {
    if (countFigures === 0) {
      finishGame();
    } else {
      const gameBoardItemsList = document.querySelectorAll('.game__board-item');
      gameBoardItemsList.forEach((item) => {
        item.innerHTML = '';
      });

      const gameBoardItemsArr = Array.from(gameBoardItemsList)

      const firstItem = gameBoardItemsArr[0];
      const secondItem = gameBoardItemsArr[1];

      const indexFirstFigure = getRandomNumber(0, FIGURES.length);
      const indexSecondFigure = getRandomNumber(0, FIGURES.length, indexFirstFigure);
      const indexColorFirstFigure = getRandomNumber(0, COLORS.length);
      const indexColorSecondFigure = getRandomNumber(0, COLORS.length, indexColorFirstFigure);

      firstItem.innerHTML = FIGURES[indexFirstFigure];
      secondItem.innerHTML = FIGURES[indexSecondFigure];

      const firstSvg = firstItem.querySelector('svg');
      const secondSvg = secondItem.querySelector('svg');

      firstSvg.style.stroke = COLORS[indexColorFirstFigure];
      secondSvg.style.stroke = COLORS[indexColorSecondFigure];

      if (firstSvg && secondSvg && firstSvg.style.stroke && secondSvg.style.stroke) {
        const newWordAudio = new Audio();
        newWordAudio.src = './files/new.mp3';
        sound && newWordAudio.play();

        countFigures--;
      }
    }
  }

  /**
   * Завершает игру
   *
   */
  function finishGame() {
    clearInterval(timerId);
    removeScreen();
    const screen = addScreen(DOM.containerGame);
    addMarkup(screen, createFinishScreen());
    addFunctionaliatyFinishScreen();
  }

  /**
   * Формирует и возвращает разметку стартового экрана.
   *
   * @return {string} разметка стартового экрана.
   */
  function createStartScreen() {
    const markup = `
    <div class="game__inner game__inner--start">
      <div class="game__img game__slider-list">
        <div class="game__slide game__slide--active">
          <img src="./img/svg/start-01.svg" alt="Котик и компьютер" />
        </div>
        <div class="game__slide">
          <img src="./img/svg/start-02.svg" alt="Котик и компьютер" />
        </div>
        <div class="game__slide">
          <img src="./img/svg/start-03.svg" alt="Котик и компьютер" />
        </div>
      </div>
      <div class="game__descr">
        <h2 class="game__title">Фигуры в движении</h2>
        <div class="game__img--mobile">
          <img src="./img/svg/start-01.svg" alt="Котик и компьютер" />
        </div>
        <p class="game__text">
        Используй руки, чтобы нарисовать фигуры в воздухе: левой рукой - левую фигуру, правой рукой - правую.
        </p>
        <button class="game__button button button--light" id="settings-btn">Пройти испытание</button>
      </div>
    </div>
    `;

    return markup;
  }

  /**
   * Формирует и возвращает разметку экрана с настройками.
   *
   * @return {string} разметка экрана с настройками.
   */
  function createSettingsScreen() {
    const markup = `
            <div class="game__inner game__inner--setting">
              <div class="game__descr">
                <h2 class="game__title">Настройки</h2>
                <div class="game__text">
                  До начала испытания всего один шаг. Выбери подходящие настройки.
                  <h3 class="game__subtitle">Скорость смены заданий:</h3>
                  <div class="game__buttons-list" id="buttons-list-speed">
                    <button class="game__button--setting button" data-speed="5000"><span class="icon icon--bike"></span>Медленно</button>
                    <button class="game__button--setting button button--active" data-speed="3500"><span class="icon icon--car"></span>Средне</button>
                    <button class="game__button--setting button" data-speed="2000"><span class="icon icon--rocket"></span>Быстро</button>
                  </div>
                  <h3 class="game__subtitle">Количество заданий:</h3>
                  <div class="game__range">
                    <div class="slider__value">
                      <span id="slider__value">9</span>
                    </div>
                    <div class="field">
                      <div class="value left">4</div>
                      <input id="slider__input" type="range" min="4" max="14" value="9" steps="1">
                      <div class="value right">14</div>
                    </div>
                  </div>
                  <div class="game__sound-inner">
                    <h3 class="game__subtitle">Звук:</h3>
                    <div class="game__buttons-list" id="buttons-list-sound">
                      <button class="game__button--setting button button--active" data-sound="1"><span class="icon icon--sound-on"></span>Включен</button>
                      <button class="game__button--setting button" data-sound="0"><span class="icon icon--sound-off"></span>Выключен</button>
                    </div>
                  </div>
                  <button class="game__button button button--light" id="start-btn">Начать</button>
                </div>
              </div>
              <div class="game__img">
                <img src="./img/svg/settings.svg" alt="Котик джойстиком" />
              </div>
            </div>
    `;

    return markup;
  }

  /**
   * Формирует и возвращает разметку экрана с игровым полем.
   *
   * @return {string} разметка экрана с игровым полем.
   */
  function createGameScreen() {
    const markup = `
            <div class="game__inner">
              <div class="game__board" id="board">
                <div class="game__board-item" id="item-1"></div>
                <div class="game__board-item" id="item-2"></div>
              </div>
            </div>
    `;

    return markup;
  }

  /**
   * Формирует и возвращает разметку экрана с завершающим вопросом.
   *
   * @return {string} разметка экрана с завершающим вопросом.
   */
  function createFinishScreen() {
    const markup = `
    <div class="game__inner game__inner--finish">
      <div class="game__img">
        <img src="./img/svg/finish.svg" alt="Котик смотрит на знак вопроса" />
      </div>
      <div class="game__descr">
        <h2 class="game__title">Оцени себя.<br> У тебя все получилось?</h2>
        <div class="game__img--mobile">
          <img src="./img/svg/finish.svg" alt="Котик смотрит на знак вопроса" />
        </div>
        <div class="game__buttons-list game__buttons-list--grade" id="buttons-list-grade">
          <button class="game__button--grade button button--green" id="button-yes"><span class="icon icon--smile"></span>Да</button>
          <button class="game__button--grade button button--red" id="button-no"><span class="icon icon--sad"></span>Нет</button>
        </div>
      </div>
    </div>
    `;

    return markup;
  }

  /**
   * Формирует и возвращает разметку экрана с результатом.
   *
   * @return {string} разметка экрана с результатом.
   */
  function createResScreen() {
    const { src1, text } = isVictory
      ? VICTORY[getRandomNumber(0, VICTORY.length - 1)]
      : DEFEAT[getRandomNumber(0, DEFEAT.length - 1)];
    const markup = `
    <div class="game__inner game__inner--finish">
      <div class="game__descr">
        <h2 class="game__title">${text}</h2>
        <div class="game__img--mobile">
          <img src=${src1} alt="Котик" />
        </div>
        <button class="game__button button button--light" id="new-game-btn">Играть снова</button>
      </div>
      <div class="game__img">
        <img src=${src1} alt="Котик" />
      </div>
    </div>
    `;

    return markup;
  }

  /**
   * Добавляет обработчики событий для первого экрана, когда он сформирован.
   *
   */
  function addFunctionaliatyStartScreen() {
    showSlider();
    if (document.getElementById('settings-btn')) {
      const settingsBtn = document.getElementById('settings-btn');

      settingsBtn.addEventListener('click', (event) => {
        event.preventDefault();
        document.querySelectorAll('.screen').length > 1 && removeScreen();
        const screen = addScreen(DOM.containerGame);
        addMarkup(screen, createSettingsScreen());
        addFunctionaliatySettingsScreen();
      });
    }
  }

  /**
   * Добавляет обработчики событий для экрана с настройками, когда он сформирован.
   *
   */
  function addFunctionaliatySettingsScreen() {
    if (document.getElementById('buttons-list-speed')) {
      const buttonsListSpeed = document.getElementById('buttons-list-speed');
      changeActiveButton(buttonsListSpeed, 'speed');
    }

    if (document.querySelector('.game__range')) {
      const slideValue = document.getElementById('slider__value');
      const sliderInput = document.getElementById('slider__input');

      sliderInput.oninput = () => {
        countFigures = sliderInput.value;
        slideValue.textContent = countFigures;
        slideValue.style.left = `${countFigures * 10 - 40}%`;
      };
    }

    if (document.getElementById('buttons-list-sound')) {
      const buttonsListSound = document.getElementById('buttons-list-sound');
      changeActiveButton(buttonsListSound, 'sound');
    }

    if (document.getElementById('start-btn')) {
      const startBtn = document.getElementById('start-btn');

      startBtn.addEventListener('click', (event) => {
        event.preventDefault();
        removeScreen();
        const screen = addScreen(DOM.containerGame);
        addMarkup(screen, createGameScreen());
        addFunctionaliatyGameScreen();
      });
    }
  }

  /**
   * Добавляет функциональность для экрана с игрой.
   *
   */
  function addFunctionaliatyGameScreen() {
    if (document.getElementById('board')) {
      timerId = setInterval(showFigures, speed);
    }
  }

  /**
   * Добавляет обработчики событий для экрана с финальным вопросом, когда он сформирован.
   *
   */
  function addFunctionaliatyFinishScreen() {
    const finishAudio = new Audio();
    finishAudio.src = './files/stop.mp3';
    sound && finishAudio.play();

    if (document.getElementById('buttons-list-grade')) {
      const yesBtn = document.getElementById('button-yes');
      const noBtn = document.getElementById('button-no');

      function showResult() {
        removeScreen();
        const screen = addScreen(DOM.containerGame);
        addMarkup(screen, createResScreen());
        addFunctionaliatyResScreen();
      }

      yesBtn.addEventListener('click', (event) => {
        event.preventDefault();
        isVictory = true;
        showResult();
      });

      noBtn.addEventListener('click', (event) => {
        event.preventDefault();
        isVictory = false;
        showResult();
      });
    }
  }

  /**
   * Добавляет обработчики событий для экрана с результатами, когда он сформирован.
   *
   */
  function addFunctionaliatyResScreen() {
    const resAudio = new Audio();
    resAudio.src = isVictory ? './files/victory.mp3' : './files/defeat.mp3';
    sound && resAudio.play();

    if (document.getElementById('new-game-btn')) {
      const newGameBtn = document.getElementById('new-game-btn');
      newGameBtn.addEventListener('click', (event) => {
        event.preventDefault();
        removeScreen();
        const screen = addScreen(DOM.containerGame);
        addMarkup(screen, createStartScreen());
        addFunctionaliatyStartScreen();
        speed = 3500;
        countFigures = 9;
        sound = 1;
      });
    }
  }

  addMarkup(DOM.screen, createStartScreen());
  addFunctionaliatyStartScreen();
}

export default showGame;
