/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */
class VK {

  // static ACCESS_TOKEN = '958eb5d439726565e9333aa30e50e0f937ee432e927f0dbd541c541887d919a7c56f95c04217915c32008';
  static ACCESS_TOKEN = '';
  static lastCallback;

  /**
   * Получает изображения
   * */
  static get(id = '', callback) {
    VK.lastCallback = callback;
    const script = document.createElement('script');
    script.src = `https://api.vk.com/method/photos.get?owner_id=${id}&album_id=profile&photo_sizes=1&access_token=${VK.ACCESS_TOKEN}&v=5.131&count=100&callback=VK.processData`;
    script.className = 'vk-script';
    document.body.appendChild(script);
  }

  /**
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   */
  static processData(response) {
    const vkScript = document.querySelector('.vk-script');
    vkScript.remove();
    if (response.error) return;
    let result = [];
    for (let i = 0; i < response.response.items.length; i++) {
      result.push(response.response.items[i].sizes[response.response.items[i].sizes.length - 1].url);
    }
    VK.lastCallback(result);
    VK.lastCallback = () => {};
  }
}
