/**
 * Класс Yandex
 * Используется для управления облаком.
 * Имеет свойство HOST
 * */
class Yandex {
  static HOST = 'https://cloud-api.yandex.net/v1/disk';

  /**
   * Метод формирования и сохранения токена для Yandex API
   */
  static getToken() {
    const token = localStorage.getItem('yandexToken');

    if (!token) {
      const token = prompt('Введите ваш токен от Yandex API:');
      fetch(`${Yandex.HOST}`, {
        method: 'GET',
        headers: {
          'Authorization': `OAuth ${token}`,
        },
      }).then((response) => {
        if (response.ok) {
          localStorage.setItem('yandexToken', token);
        } else {
          alert('Некорректный токен');
          location.reload();
        }
      });
    }
  }

  /**
   * Метод загрузки файла в облако
   */
  static uploadFile(path, url, callback) {
    createRequest({
      url: `${Yandex.HOST}/resources/upload?url=${url}&path=${path + '.jpg'}`,
      method: 'POST',
      headers: {
        'Authorization': `OAuth ${localStorage.getItem('yandexToken')}`,
      },
      callback: callback,
    });
  }

  /**
   * Метод удаления файла из облака
   */
  static removeFile(path) {
    createRequest({
      url: `${Yandex.HOST}/resources?path=${path}&permanently=false`,
      method: 'DELETE',
      headers: {
        'Authorization': `OAuth ${localStorage.getItem('yandexToken')}`,
      },
    })
  }

  /**
   * Метод получения всех загруженных файлов в облаке
   */
  static getUploadedFiles(callback) {
    createRequest({
      url: `${Yandex.HOST}/resources/files`,
      method: 'GET',
      headers: {
        'Authorization': `OAuth ${localStorage.getItem('yandexToken')}`,
      },
      callback: callback,
    });
  }

  /**
   * Метод скачивания файлов
   */
  static downloadFileByUrl(url) {
    const link = document.createElement('a');
    link.href = url;
    link.click();
  }
}
