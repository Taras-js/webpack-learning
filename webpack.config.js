//С данной минимальной настройкой вебпака нам доступны любые экспорты импорты в наших скриптах
// и не нужно продумывать порядок подключения скриптов
// здесь доступен node.js
// экспортируем объект
// Этот объкт вебпак парсит и понмает что здесь находится
// Две точки входа в наше приложение index && Post зависимые друг от друга
// С помощью webpack можно удобно декомпозировать наше приложение и не думать в каком порядке подключать скрипты

const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
// подключаем плагин для контроля html файлов npm install -D html-webpack-plugin
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
// подключаем плагин для очистки кеша npm i clean-webpack-plugin --save-dev
// подключаем встроенный модуль для корректного подключения папки dist
module.exports = {
    //добавляем context где лежат все исходники нашего приложения src после этого меняем пути здесь
    // получаем ошибку из-за абсолютных путей
//     [webpack-cli] Invalid configuration object.
//     Webpack has been initialized using a configuration object that does not match the API schema.
//         - configuration.context: The provided value "src" is not an absolute path!
// -> The base directory (absolute path!) for resolving the `entry` option.
// If `output.pathinfo` is set, the included pathinfo is shortened to this directory.
    //переписываем путь к папке в context через path
    // context: "src",
    context: path.resolve(__dirname, 'src'),
    //после запуска webpack неудачного кстати --- пока не подключил скрипт "build": "webpack" и запуска командой
    // npm run build --- ничего не работало
    //Обрабатываем полученный warning:
    // The 'mode' option has not been set, webpack will fallback to 'production' for this value.
    // подключаем режим для разработки
    mode: 'development',
    //входной файл нашего приложения - откуда начать
    //после переноса index.html в папку dist изменяем минимальную конфигурацию
    // и вместо одной точки входа делаем объект с несколькими
    // entry: './src/index.js',
    // в таком виде получаем ошибку
    // Error: Conflict: Multiple chunks emit assets to the same filename bundle.js (chunks main and analytics)
    // пользуемся паттерны в именах [name]

entry: {
        // main: './src/index.js',
        // analytics: './src/analytics.js'
    //меняем пути - убираем src после того как прописали контекст
    // получаем ошибку из-за абсолютных путей
//     [webpack-cli] Invalid configuration object.
//     Webpack has been initialized using a configuration object that does not match the API schema.
//         - configuration.context: The provided value "src" is not an absolute path!
// -> The base directory (absolute path!) for resolving the `entry` option.
// If `output.pathinfo` is set, the included pathinfo is shortened to this directory.
    //переписываем путь к папке в context через path
    main: './index.js',
    analytics: './analytics.js'
    },
    // куда складывать результаты работы webpack
    // прописываем паттерн [name]
    // добавляем еще один паттерн [contenthash] для избежания проблем с кешированием на продакшене
    // например если браузер закешировал приложение по названию файла то клиент не увидит изменения в приложении
    // получили файлы бандла со своими хешами
    output: {
        filename: '[name].[contenthash].js',
        // filename: '[name].bundle.js',
            //все скрипты собираются в данном файл
        path: path.resolve(__dirname, 'dist')
        // можно и вот так path: 'dist'  --- Но это некорректно
    },
    // добавляем плагины - это массив
    // он автоматически создает index.html но пустой
    // затем добавляем title как опции и после перезапуска npm run build инфо в файле обновляется
    //подключаем наш контент из index.html потому что на данном этапе он  не бандлится --- template
    //в результате подключения template перестает работать title поэтому его надо убрать
    //добавляем плагин для очистки кеша dist npm install -D html-webpack-plugin
    //теперь можно менять контент и кэш не меняется
    plugins: [
        new HTMLWebpackPlugin({
            // title: 'Webpack Taras',
            template: './index.html'
        }),
        new CleanWebpackPlugin({


        })
    ],
    // вебпак не понимает css3 понимает только JS && JSON
    //поэтому добавляем loader в конфиг
    //loader позволяет работать с другими типами файлов кроме поддерживаемых напрямую
    // test: //, --- это регулярное выражение внутрь можно писать путь
    //test: /\.css$/, --- как только вебпак встречает css ему необходимо использовать определенный лоадер
    // use: [] используй вот этот лоадер
    // use: ['style-loader', 'css-loader'] запомни вебпак идет справа налево то есть правый конкретно для css
    // а левый говорит что с ним делать(с правым) --- это позволяет понимать импорты css и импортировать в JS
    // различные стили
    //css-loader позволяет понмать импорты и импортировать все это в JS
    // style-loader добавляет стили в секцию head index.html
    // устанавливаем данные пакеты
    // in JS мы не можем использовать json напрямую
    //а спомощью вебпак можем напрямую
    // для работы с картинками нужно использовать loader
    //npm i -D file-loader

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']

            }
            //добавляем новый объект для работы с файлами -- картинками
            //
        ]
    }

}

// ^^^^^^Минимальная конфигурация для webpack^^^^^^^^^^^^^^^^
// __dirname системная директория от которой мы отталкиваемся
// resolve --- решать
// output --- выход
// entry  ---  вход
// path --- дорога, путь
// require --- требовать затребовать нуждаться
// mode --- режим, способ
// chunks --- куски (это скрипты в вебпаке)
// rules --- правила
// module --- модуль
// use --- использовать
// watch --- смотреть, наблюдение