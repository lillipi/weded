const slider = document.getElementById('slider');
const container = document.querySelector('.slider-container');

if (!slider || !container) {
  // слайдер отсутствует на странице
} else {
  // На тач-устройствах — только нативный scroll контейнера.
  // На десктопе — drag-to-scroll мышью.
  const isCoarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;

  if (!isCoarsePointer) {
    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    function stopDrag() {
      isDragging = false;
      container.classList.remove('is-dragging');
      container.style.cursor = 'grab';
    }

    container.style.cursor = 'grab';

    container.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isDragging = true;
      startX = e.clientX;
      startScrollLeft = container.scrollLeft;
      container.classList.add('is-dragging');
      container.style.cursor = 'grabbing';
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      container.scrollLeft = startScrollLeft - dx;
      e.preventDefault();
    }, { passive: false });

    window.addEventListener('mouseup', () => stopDrag());
    window.addEventListener('blur', () => stopDrag());
  }

// Запрещаем перетаскивание изображений
document.querySelectorAll('.slide img').forEach(img => {
  img.addEventListener('dragstart', (e) => e.preventDefault());
});

// Обновление при изменении размера окна
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // ничего не нужно, нативный scroll сам всё считает
  }, 100);
});

}