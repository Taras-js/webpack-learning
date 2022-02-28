// ^^^^^^Минимальная конфигурация для webpack^^^^^^^^^^^^^^^^

// здесь доступен node.js
// экспортируем объект
// Этот объкт вебпак парсит и понмает что здесь находится
// Две точки входа в наше приложение index && Post зависимые друг от друга
// С помощью webpack

const path = require('path')
// подключаем встроенный модуль для корректного подключения папки dist
module.exports = {
    //входной файл нашего приложения - откуда начать
    entry: './src/index.jsx',
    // куда складывать результаты работы webpack
    output: {
        filename: 'bundle.js',
        //все скрипты собираются в данном файл
        path: path.resolve(__dirname, 'dist')
        // можно и вот так path: 'dist'  --- Но это некорректно
    }

}

// ^^^^^^Минимальная конфигурация для webpack^^^^^^^^^^^^^^^^
// __dirname системная директория от которой мы отталкиваемся
// resolve --- решать
// output --- выход
// entry  ---  вход
// path --- дорога, путь
// require --- требовать затребовать нуждаться