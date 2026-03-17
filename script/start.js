document.addEventListener('DOMContentLoaded', function () {
  // Всегда начинать страницу сверху при загрузке/обновлении
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
});

// Интро-конверт и музыка
const intro = document.getElementById('intro');
const introButton = document.getElementById('introButton');
const siteContent = document.getElementById('site-content');

if (intro && introButton && siteContent) {
  introButton.addEventListener('click', () => {
    // все части конверта открываются одновременно
    intro.classList.add('intro-open');

    // после всего убираем интро и показываем сайт
    setTimeout(() => {
      intro.classList.add('intro-hidden');
      siteContent.classList.remove('hidden');
    }, 650);
  });
}

// Анимация появления блоков при скролле
const scrollElements = document.querySelectorAll('.scroll-animate');

if ('IntersectionObserver' in window) {
  const observerOptions = {
    threshold: 0.2
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  scrollElements.forEach(el => observer.observe(el));
} else {
  // Фолбек: если IntersectionObserver не поддерживается,
  // просто сразу показываем элементы
  scrollElements.forEach(el => el.classList.add('in-view'));
}