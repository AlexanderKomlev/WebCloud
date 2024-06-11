/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */
class PreviewModal extends BaseModal {
  constructor(element) {
    super(element);
    this.modal = element[0];
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по контроллерам изображения: 
   * Отправляет запрос на удаление изображения, если клик был на кнопке delete
   * Скачивает изображение, если клик был на кнопке download
   */
  registerEvents() {
    this.modal.querySelector('.x.icon').addEventListener('click', () => {
      this.close();
    });
    
    this.modal.querySelector('.content').addEventListener('click', (event) => {
      if (event.target.closest('.delete')) {
        this.modal.querySelector('i').className = 'icon spinner loading';
        this.modal.querySelector('.delete').classList.add('disabled');
        const name = event.target.closest('.image-preview-container').querySelector('td').innerText;
        Yandex.removeFile(name);
        event.target.closest('.image-preview-container').remove();
        this.modal.querySelector('i').className = 'x icon';
      } else if (event.target.closest('.download')) {
        const url = event.target.closest('.image-preview-container').querySelector('img').src;
        Yandex.downloadFileByUrl(url);
      }
    })
  }

  /**
   * Отрисовывает изображения в блоке всплывающего окна
   */
  showImages(data) {
    let HTML = '';
    for (let item of data.items) {
      const data = {
        name: item.name,
        date: this.formatDate(item.created),
        size: (item.size / 1024).toFixed(1),
        url: item.file,
      };
      HTML += this.getImageInfo(data);
    }

    this.modal.querySelector('.content').innerHTML = HTML;
  }

  /**
   * Форматирует дату в формате 2021-12-30T20:40:02+00:00(строка)
   * в формат «30 декабря 2021 г. в 23:40» (учитывая временной пояс)
   * */
  formatDate(date) {
    return new Date(date).toLocaleString('ru', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  }

  /**
   * Возвращает разметку из изображения, таблицы с описанием данных изображения и кнопок контроллеров (удаления и скачивания)
   */
  getImageInfo(item) {
    return `
    <div class="image-preview-container">
      <img src='${item.url}' />
      <table class="ui celled table">
        <thead>
          <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
        </thead>
        <tbody>
          <tr><td>${item.name}</td><td>${item.date}</td><td>${item.size} Кб</td></tr>
        </tbody>
      </table>
      <div class="buttons-wrapper">
        <button class="ui labeled icon red basic button delete" data-path='PPP'>
          Удалить
          <i class="trash icon"></i>
        </button>
        <button class="ui labeled icon violet basic button download" data-file='FFF'>
          Скачать
          <i class="download icon"></i>
        </button>
      </div>
    </div>
    `;
  }
}
