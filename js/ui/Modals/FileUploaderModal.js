/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends BaseModal {
  constructor(element) {
    super(element);
    this.modal = element[0];
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
   * 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
   * 4. Клик по кнопке загрузке по контроллерам изображения: 
   * убирает ошибку, если клик был по полю вода
   * отправляет одно изображение, если клик был по кнопке отправки
   */
  registerEvents() {
    this.modal.querySelector('.x.icon').addEventListener('click', () => {
      this.close();
    });

    this.modal.querySelector('.ui.close.button').addEventListener('click', () => {
      this.close();
    });

    this.modal.querySelector('.ui.send-all.button').addEventListener('click', () => {
      this.modal.querySelector('.x.icon').className = 'icon spinner loading';
      this.sendAllImages();
    });
    
    this.modal.querySelector('.content').addEventListener('click', (event) => {
      if (event.target.classList.contains('input')) {
        event.target.classList.remove('error');
      } else if (event.target.closest('button')) {
        this.sendImage(event.target.closest('.image-preview-container'));
      }
    })
  }

  /**
   * Отображает все полученные изображения в теле всплывающего окна
   */
  showImages(images) {
    let HTML = '';
    for (let item of images) {
      HTML += this.getImageHTML(item);
    }
    this.modal.querySelector('.content').innerHTML = HTML;
  }

  /**
   * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкной загрузки
   */
  getImageHTML(item) {
    return `
    <div class="image-preview-container">
      <img src='${item}' />
      <div class="ui action input">
        <input type="text" placeholder="Путь к файлу">
        <button class="ui button"><i class="upload icon"></i></button>
      </div>
    </div>
    `;
  }

  /**
   * Отправляет все изображения в облако
   */
  sendAllImages() {
    const images = this.modal.querySelectorAll('.image-preview-container');
    for (let image of images) {
      this.sendImage(image);
    }
  }

  /**
   * Валидирует изображение и отправляет его на сервер
   */
  sendImage(imageContainer) {
    const path = imageContainer.querySelector('input').value;
    if (!path) {
      imageContainer.querySelector('.ui.action.input').classList.add('error');
      return;
    }
    imageContainer.querySelector('div').classList.add('disabled');
    let url = imageContainer.querySelector('img').src.split('?')[0];
    url = "https://pp.vk.me/" + url.split('.com/')[1].slice(5);
    Yandex.uploadFile(path, url, () => {
      imageContainer.remove();
      if (!this.modal.querySelector('.image-preview-container')) {
        this.modal.querySelector('i').className = 'x icon';
        this.close();
      }
    });
  }
}