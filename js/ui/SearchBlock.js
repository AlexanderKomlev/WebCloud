/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 * */
class SearchBlock {
  constructor(element) {
    this.element = element;
    this.registerEvents();
  }

  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить"
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
   */
  registerEvents() {
    this.element.addEventListener('click', (event) => {
      if (event.target.closest('button')) {
        if (!this.element.querySelector("input").value) return;

        if (event.target.classList.contains('replace')) App.imageViewer.clear();

        VK.get(this.element.querySelector("input").value, App.imageViewer.drawImages.bind(App.imageViewer));
      }
    });
  }
}
