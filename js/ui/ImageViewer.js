/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {
  constructor(element) {
    this.element = element;
    this.preview = this.element.querySelector('.image');
    this.images = this.element.querySelector('.row');
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображаения в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
   * Добавляет или удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */
  registerEvents() {
    this.images.addEventListener("dblclick", (event) => {
      if (event.target.closest("img")) {
        this.preview.src = event.target.src;
      }
    });

    this.images.addEventListener("click", (event) => {
      if (event.target.closest("img")) {
        event.target.classList.toggle("selected");
        this.checkButtonText();
      }
    });

    this.element.querySelector('.select-all').addEventListener("click", () => {
      const allImages = Array.from(this.images.querySelectorAll("img"));
      if (allImages.some(img => img.classList.contains("selected"))) {
        allImages.forEach(img => img.classList.remove("selected"));
      } else {
        allImages.forEach(img => img.classList.add("selected"));
      }
      this.checkButtonText();
    });

    this.element.querySelector('.show-uploaded-files').addEventListener("click", () => {
      App.modals.filePreviewer.open();
      Yandex.getUploadedFiles(App.modals.filePreviewer.showImages.bind(App.modals.filePreviewer));
    });

    this.element.querySelector('.send').addEventListener("click", () => {
      App.modals.fileUploader.open();
      const selectedImages = Array.from(this.images.querySelectorAll("img")).filter(img => img.classList.contains("selected")).map(img => img.src);
      App.modals.fileUploader.showImages(selectedImages);
    });
  }

  /**
   * Очищает отрисованные изображения
   */
  clear() {
    this.images.innerHTML = "";
  }

  /**
   * Отрисовывает изображения.
  */
  drawImages(images) {
    if (images.length > 0) {
      this.element.querySelector('.select-all').classList.remove("disabled");
    } else {
      this.element.querySelector('.select-all').classList.add("disabled");
    }

    images.forEach(image => {
      this.images.insertAdjacentHTML("beforeend", `
        <div class='four wide column ui medium image-wrapper'>
          <img src=${image} />
        </div>
      `);
    })
  }

  /**
   * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText() {
    const allImages = Array.from(this.images.querySelectorAll("img"));
    const selectButton = this.element.querySelector('.select-all');
    const sendButton = this.element.querySelector('.send');

    if (allImages.every(img => img.classList.contains("selected"))) {
      selectButton.textContent = "Снять выделение";
    } else {
      selectButton.textContent = "Выбрать всё";
    }

    if (allImages.some(img => img.classList.contains("selected"))) {
      sendButton.classList.remove("disabled");
    } else {
      sendButton.classList.add("disabled");
    }
  }

}
