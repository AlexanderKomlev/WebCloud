/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = async (options = {}) => {
    try {
        const response = await fetch(options.url, {
            method: options.method,
            headers: options.headers,
        })

        if (!response.ok) {
            throw new Error(`Could not fetch ${options.url}, status: ${response.status}`);
        }
        if (options.callback) {
            const result = await response.json();
            options.callback(result);
        }
    } catch (error) {
        alert(error.message);
    }
}
