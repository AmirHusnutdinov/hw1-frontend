document.addEventListener('DOMContentLoaded', function() {
  // Переключатель мобильного меню
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
    document.addEventListener('click', function(event) {
      if (!event.target.closest('.nav')) {
        navLinks.classList.remove('active');
      }
    });
  }
  // 1. Галерея с функцией всплывающего окна
  setupGallery();
  // 2. Форма обратной связи с проверкой и отправкой
  setupFeedbackForm();
  // 3. Всплывающее сообщение по таймеру
  setupTimedPopup();
  // 4. Таймер обратного отсчёта
  setupCountdownTimer();
  // 5. Закреплённое меню при прокрутке
  setupStickyMenu();
  // 6. Анимация SVG
  setupSvgAnimation();
});

// 1. Галерея с функцией всплывающего окна
function setupGallery() {
  const galleryContainer = document.querySelector('.gallery-container');
  if (!galleryContainer) return;
  const galleryItems = document.querySelectorAll('.gallery-item');
  // Создание элементов всплывающего окна галереи
  const popup = document.createElement('div');
  popup.className = 'gallery-popup';
  popup.innerHTML = `
    <div class="gallery-popup-content">
      <button class="gallery-popup-close">&times;</button>
      <div class="gallery-popup-image-container">
        <img src="/placeholder.svg" alt="" class="gallery-popup-image">
        <button class="gallery-popup-nav gallery-popup-prev"><</button>
        <button class="gallery-popup-nav gallery-popup-next">></button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);
  const popupImage = popup.querySelector('.gallery-popup-image');
  const popupClose = popup.querySelector('.gallery-popup-close');
  const popupPrev = popup.querySelector('.gallery-popup-prev');
  const popupNext = popup.querySelector('.gallery-popup-next');
  let currentIndex = 0;

  // Открытие всплывающего окна при клике на элемент галереи
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      currentIndex = index;
      const imgSrc = item.querySelector('img').src;
      popupImage.src = imgSrc;
      popup.classList.add('active');
      updateNavButtons();
      document.body.style.overflow = 'hidden';
    });
  });

  // Закрытие всплывающего окна
  popupClose.addEventListener('click', () => {
    popup.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Переход к предыдущему изображению
  popupPrev.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      popupImage.src = galleryItems[currentIndex].querySelector('img').src;
      updateNavButtons();
    }
  });

  // Переход к следующему изображению
  popupNext.addEventListener('click', () => {
    if (currentIndex < galleryItems.length - 1) {
      currentIndex++;
      popupImage.src = galleryItems[currentIndex].querySelector('img').src;
      updateNavButtons();
    }
  });

  // Обновление видимости навигационных кнопок
  function updateNavButtons() {
    popupPrev.style.display = currentIndex === 0 ? 'none' : 'block';
    popupNext.style.display = currentIndex === galleryItems.length - 1 ? 'none' : 'block';
  }

  // Закрытие всплывающего окна при клике вне изображения
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Навигация через клавиатуру
  document.addEventListener('keydown', (e) => {
    if (!popup.classList.contains('active')) return;
    if (e.key === 'Escape') {
      popup.classList.remove('active');
      document.body.style.overflow = '';
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
      currentIndex--;
      popupImage.src = galleryItems[currentIndex].querySelector('img').src;
      updateNavButtons();
    } else if (e.key === 'ArrowRight' && currentIndex < galleryItems.length - 1) {
      currentIndex++;
      popupImage.src = galleryItems[currentIndex].querySelector('img').src;
      updateNavButtons();
    }
  });
}

// 2. Форма обратной связи с проверкой и отправкой
function setupFeedbackForm() {
  const feedbackBtn = document.querySelector('.feedback-btn');
  if (!feedbackBtn) return;
  const feedbackPopup = document.querySelector('.feedback-popup');
  const feedbackForm = document.querySelector('.feedback-form');
  const feedbackClose = document.querySelector('.feedback-close');
  const submitBtn = document.querySelector('.feedback-submit');

  // Открытие всплывающего окна формы
  feedbackBtn.addEventListener('click', () => {
    feedbackPopup.classList.add('active');
    setTimeout(() => {
      feedbackPopup.classList.add('visible');
    }, 10);
    document.body.style.overflow = 'hidden';
  });

  // Закрытие всплывающего окна формы
  feedbackClose.addEventListener('click', () => {
    feedbackPopup.classList.remove('visible');
    setTimeout(() => {
      feedbackPopup.classList.remove('active');
      document.body.style.overflow = '';
    }, 300);
  });

  // Закрытие при клике вне окна
  feedbackPopup.addEventListener('click', (e) => {
    if (e.target === feedbackPopup) {
      feedbackPopup.classList.remove('visible');
      setTimeout(() => {
        feedbackPopup.classList.remove('active');
        document.body.style.overflow = '';
      }, 300);
    }
  });

  // Проверка и отправка формы
  if (feedbackForm) {
    const nameInput = feedbackForm.querySelector('input[name="name"]');
    const emailInput = feedbackForm.querySelector('input[name="email"]');
    const phoneInput = feedbackForm.querySelector('input[name="phone"]');
    const messageInput = feedbackForm.querySelector('textarea[name="message"]');

    // Функции проверки данных
    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
    function validatePhone(phone) {
      const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      return re.test(phone);
    }
    function validateText(text, lang) {
      if (lang === 'ru') {
        // Проверка текста на русском (кириллица, пробелы и знаки)
        return /^[\u0400-\u04FF\s.,!?()-]+$/.test(text);
      } else {
        // Проверка текста на английском (латинские буквы, пробелы и знаки)
        return /^[A-Za-z\s.,!?()-]+$/.test(text);
      }
    }

    // Отправка формы
    feedbackForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Сброс сообщений об ошибках
      document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
      });

      let isValid = true;

      // Проверка имени
      if (!validateText(nameInput.value, 'en')) {
        feedbackForm.querySelector('.name-error').style.display = 'block';
        isValid = false;
      }

      // Проверка электронной почты
      if (!validateEmail(emailInput.value)) {
        feedbackForm.querySelector('.email-error').style.display = 'block';
        isValid = false;
      }

      // Проверка телефона
      if (!validatePhone(phoneInput.value)) {
        feedbackForm.querySelector('.phone-error').style.display = 'block';
        isValid = false;
      }

      // Проверка сообщения
      if (!validateText(messageInput.value, 'en')) {
        feedbackForm.querySelector('.message-error').style.display = 'block';
        isValid = false;
      }

      if (isValid) {
        // Изменение состояния кнопки на "отправка"
        submitBtn.textContent = 'Отправка...';
        submitBtn.classList.add('sending');
        submitBtn.disabled = true;

        // Имитация отправки формы
        fetch('https://example.com/submit-form ', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            message: messageInput.value
          })
        })
        .then(response => {
          // Имитация успешной отправки через 1.5 секунды
          setTimeout(() => {
            submitBtn.textContent = 'Успешно отправлено!';
            submitBtn.classList.remove('sending');
            submitBtn.classList.add('success');

            // Сброс формы через 3 секунды
            setTimeout(() => {
              feedbackForm.reset();
              feedbackPopup.classList.remove('visible');
              setTimeout(() => {
                feedbackPopup.classList.remove('active');
                document.body.style.overflow = '';
                // Сброс состояния кнопки
                submitBtn.textContent = 'Отправить сообщение';
                submitBtn.classList.remove('success');
                submitBtn.disabled = false;
              }, 300);
            }, 3000);
          }, 1500);
        })
        .catch(error => {
          console.error('Ошибка:', error);
          submitBtn.textContent = 'Ошибка. Попробуйте снова';
          submitBtn.classList.remove('sending');
          submitBtn.classList.add('error');
          submitBtn.disabled = false;
        });
      }
    });
  }
}

// 3. Всплывающее сообщение по таймеру
function setupTimedPopup() {
  // Проверка, закрывал ли пользователь всплывающее окно ранее
  const hasClosedPopup = localStorage.getItem('hasClosedTimedPopup');
  if (hasClosedPopup) return;

  // Создание всплывающего окна
  const timedPopup = document.createElement('div');
  timedPopup.className = 'timed-popup';
  timedPopup.innerHTML = `
    <div class="timed-popup-content">
      <button class="timed-popup-close">&times;</button>
      <h3>Добро пожаловать на портфолио Джона!</h3>
      <p>Спасибо, что посетили мой сайт. Ознакомьтесь с моими работами и свяжитесь со мной, если у вас есть вопросы.</p>
      <a href="contact.html" class="timed-popup-btn">Связаться</a>
    </div>
  `;
  document.body.appendChild(timedPopup);
  const timedPopupClose = timedPopup.querySelector('.timed-popup-close');

  // Открытие всплывающего окна через 30 секунд
  setTimeout(() => {
    timedPopup.classList.add('active');
  }, 30000);

  // Закрытие всплывающего окна
  timedPopupClose.addEventListener('click', () => {
    timedPopup.classList.remove('active');
    // Сохранение в localStorage, что пользователь закрыл окно
    localStorage.setItem('hasClosedTimedPopup', 'true');
  });
}

// 4. Таймер обратного отсчёта
function setupCountdownTimer() {
  const countdownContainer = document.querySelector('.countdown-container');
  if (!countdownContainer) return;

  const targetDate = new Date('2028-07-01T00:00:00');

  function updateCountdown() {
    const currentDate = new Date();
    const difference = targetDate - currentDate;

    if (difference <= 0) {
      countdownContainer.innerHTML = '<h3>Поздравляем! Вы успешно завершили обучение!</h3>';
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    countdownContainer.innerHTML = `
      <h3>Время до получения бакалавра МФТИ:</h3>
      <div class="countdown-timer">
        <div class="countdown-item">
          <span class="countdown-value">${days}</span>
          <span class="countdown-label">Дней</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-value">${hours}</span>
          <span class="countdown-label">Часов</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-value">${minutes}</span>
          <span class="countdown-label">Минут</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-value">${seconds}</span>
          <span class="countdown-label">Секунд</span>
        </div>
      </div>
    `;
  }

  // Обновление таймера каждую секунду
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// 5. Закреплённое меню при прокрутке
function setupStickyMenu() {
  const header = document.querySelector('header');
  if (!header) return;

  const heroSection = document.querySelector('.hero');
  let triggerHeight = 0;

  if (heroSection) {
    triggerHeight = heroSection.offsetHeight;
  } else {
    triggerHeight = window.innerHeight;
  }

  function handleScroll() {
    if (window.scrollY > triggerHeight) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  }

  // Первоначальная проверка
  handleScroll();

  // Добавление слушателя прокрутки
  window.addEventListener('scroll', handleScroll);
}

// 6. Анимация SVG
function setupSvgAnimation() {
  // Создание элемента SVG
  const svgContainer = document.createElement('div');
  svgContainer.className = 'svg-animation-container';
  svgContainer.innerHTML = `
    <svg width="100" height="100" viewBox="0 0 100 100" class="animated-svg">
      <circle cx="50" cy="50" r="20" fill="none" stroke="#ff6b6b" stroke-width="2" class="svg-circle" />
      <path d="M50,30 L50,70 M30,50 L70,50" stroke="#ff6b6b" stroke-width="2" class="svg-path" />
    </svg>
  `;

  // Добавление анимации (например, в подвал сайта)
  const footer = document.querySelector('footer');
  if (footer) {
    footer.querySelector('.container').prepend(svgContainer);
  }

  // Анимация на основе движения мыши
  document.addEventListener('mousemove', (e) => {
    const svg = document.querySelector('.animated-svg');
    if (!svg) return;

    const circle = svg.querySelector('.svg-circle');
    const path = svg.querySelector('.svg-path');

    // Расчёт позиции мыши относительно экрана
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    // Анимация радиуса круга
    const newRadius = 10 + mouseX * 20;
    circle.setAttribute('r', newRadius);

    // Анимация поворота линии
    const rotation = mouseY * 360;
    path.style.transform = `rotate(${rotation}deg)`;
    path.style.transformOrigin = 'center';
  });

  // Анимация на основе прокрутки страницы
  window.addEventListener('scroll', () => {
    const svg = document.querySelector('.animated-svg');
    if (!svg) return;

    // Расчёт положения прокрутки (0 до 1)
    const scrollPosition = window.scrollY / (document.body.scrollHeight - window.innerHeight);

    // Изменение цвета контура на основе прокрутки
    const hue = Math.floor(scrollPosition * 360);
    svg.querySelector('.svg-circle').style.stroke = `hsl(${hue}, 80%, 60%)`;
    svg.querySelector('.svg-path').style.stroke = `hsl(${hue}, 80%, 60%)`;
  });
}