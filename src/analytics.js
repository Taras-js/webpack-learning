// сторонний скрипт с аналитикой
function createAnalytics(){
    let counter = 0;
    let destroyed = false;
    // начальный счетчик кликов
    const listener = () => counter++
    // функция для listener
    document.addEventListener('click', listener)
    // add listener from document
    return {
        destroy() {
            // destroy - метод по которому аналитика прекращает своу действие
            document.removeEventListener('click', listener)
            destroyed = true
            // delete eventListener

            // флаг если мы уничтожили статистику то isDestroyed = true

        },
        getClicks() {
            if (destroyed) {
                // return  'Analytics is destroyed'
                //добавляем изменения в приложение для проверки работы паттерна [contenthash]
                // после этого в папке dist появляется измененный bundle для analytics
                return  `Analytics is destroyed. Total clicks = ${counter} `
            }
                // если аналитика уничтожена возвращаем следующее
            return counter
        }
    }
}

window.analytics = createAnalytics()