//С данной минимальной настройкой вебпака нам доступны любые экспорты импорты в наших скриптах
// и не нужно продумывать порядок подключения скриптов
// здесь доступен node.js
// экспортируем объект
// Этот объкт вебпак парсит и понмает что здесь находится
// Две точки входа в наше приложение index && Post зависимые друг от друга
// С помощью webpack можно удобно декомпозировать наше приложение и не думать в каком порядке подключать скрипты
const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev
// console.log('IS DEV:', isDev)
// задаем флаг для определения в каком значении находится сборка
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
// подключаем плагин для контроля html файлов npm install -D html-webpack-plugin
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
// подключаем плагин для очистки кеша npm i clean-webpack-plugin --save-dev
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
//подключаем два плагина для минификации css файлов
// но не можем сразу их добавлять иначе файлы будут оптимизироваться на этапе разработки
// поэтому с помощью функции переписываем optimization: optimization(),
const  optimization = () => {
   const config = {
       splitChunks: {
           chunks: "all"
       }
   }
   if (isProd) {
       config.minimizer = [
           new TerserWebpackPlugin(),
           new CssMinimizerPlugin(),
       ]
   }
    return config
}
//небольшая оптимизация hash --- не нужны во время разработки а нужны в prodaction
const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

// проводи оптимизацию loaders
const cssLoaders = (addition) => {
    const loaders = [{
        loader: MiniCssExtractPlugin.loader,
        options: {
            // hmr: isDev,
            // изменения определенных сущностей без перезагрузки страницы
            // reloadAll: true
            //ПРОБЛЕМА НЕ ПОЛУЧИЛОСЬ СКОРЕЕ ВЕРСИИ ИЗМЕНИЛИСЬ
            // БЕЗ УКАЗАНИЯ ОПЦИЙ ВСЕ РАБОТАЕТ
        }
    }, 'css-loader']
    if(addition) {
        loaders.push(addition)
    }
    return loaders

}
// проводим оптимизацию
const babelOptions = (preset) => {
     const opts = {
         presets: [
             '@babel/preset-env'
         ],
         plugins: [
             '@babel/plugin-proposal-class-properties'
         ]
     }
     if(preset) {
        opts.presets.push(preset)
     }
     return opts

}
// неудачная попытка автоматизировать loader eslint
// const jsLoaders = () => {
//     const loaders = [
//         'babel-loader'
//     ]
//     if(isDev) {
//         loaders.push('eslint-loader')
//     }
//     return loaders
// }

const plugins = () => {
    const base = [
            new HTMLWebpackPlugin({
                // title: 'Webpack Taras',
                template: './index.html',
                //начинаем оптимизировать файлы с html
                minify: {
                    collapseWhitespace: isProd
                }
            }),
            new CleanWebpackPlugin({


            }),
            new CopyPlugin({
                patterns: [
                    { from: path.resolve(__dirname, 'src/logotip.ico'), to: path.resolve(__dirname, 'dist')}
                ]
                // создаем плагин копирующий иконку с from --- откуда и to ------- куда
            }),
            new MiniCssExtractPlugin({
                // filename: '[name].[contenthash].css'
                // меняю на hash
                // filename: '[name].[hash].css'
                // меняю с использованием функции
                filename: filename('css')
            })
        ]
    if (isProd){
        base.push(new BundleAnalyzerPlugin())
    }
    return base
}

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
    // entry: './src/index.jsx',
    // в таком виде получаем ошибку
    // Error: Conflict: Multiple chunks emit assets to the same filename bundle.js (chunks main and analytics)
    // пользуемся паттерны в именах [name]

entry: {
        // main: './src/index.jsx',
        // analytics: './src/analytics.ts'
    //меняем пути - убираем src после того как прописали контекст
    // получаем ошибку из-за абсолютных путей
//     [webpack-cli] Invalid configuration object.
//     Webpack has been initialized using a configuration object that does not match the API schema.
//         - configuration.context: The provided value "src" is not an absolute path!
// -> The base directory (absolute path!) for resolving the `entry` option.
// If `output.pathinfo` is set, the included pathinfo is shortened to this directory.
    //переписываем путь к папке в context через path
    // main: './index.jsx',
    main: ['@babel/polyfill', './index.jsx'],
    // analytics: './analytics.js'
    analytics: './analytics.ts'
    // переводим аналитику на typescript

},
    // подключаем полифилл babel


    // куда складывать результаты работы webpack
    // прописываем паттерн [name]
    // добавляем еще один паттерн [contenthash] для избежания проблем с кешированием на продакшене
    // например если браузер закешировал приложение по названию файла то клиент не увидит изменения в приложении
    // получили файлы бандла со своими хешами
    output: {
        // filename: '[name].[contenthash].js',
        // меняю contenthash на hash
        // filename: '[name].[hash].js',
        // заменяю на использование функции
        filename: filename('js'),
        // filename: '[name].bundle.js',
            //все скрипты собираются в данном файл
        path: path.resolve(__dirname, 'dist')
        // можно и вот так path: 'dist'  --- Но это некорректно
    },
    // добавляем resolve - решать
    // какие расширения понимать по умолчанию, extensions --- расширения
    // пока их не пропишем в массив будет ошибка
    // по умолчанию extensions: ['.js']
    // позволяет в импортах убрать расширения файлов
    // к сожалению не заработали --------- надо разбираться
    // после пересборки все работает !!!!!!!!!!!!!!
    //alias псевдоним позволяет избавиться от отновительных путей
    resolve: {
        extensions: ['.js', '.json', '.xml', '.csv', '.png', '.css'],
        alias: {
            '@models': path.resolve(__dirname, 'src/models'),
            '@': path.resolve(__dirname, 'src'),
            '@styles': path.resolve(__dirname, 'src/styles')

        }
    },
    // С учетом 2-х точек входа мы дважды импортируем jquery – это нужно оптимизировать через вебпак
    // в папке dist появляются vendors~ файлы
    //происходит оптимизация и импорты проходят только однажды
    optimization: optimization(),
    // настраиваем dev server
    // после этого вносим изменения в package.json
    //"start": "webpack-dev-server --mode development --open"
    // --open ------------ автоматически открывает проект в браузере
    // --mode ------------ выбор режима
    devServer: {
        port: 4000,
        static: './dist',
        hot: isDev
        // добавляем флаг isDev
    },
    // добавляем devtools исходные карты
    // позволяет из консоли браузера смотреть на исходный код
    devtool: isDev ? 'eval-source-map' : false,
    // добавляем плагины - это массив
    // он автоматически создает index.html но пустой
    // затем добавляем title как опции и после перезапуска npm run build инфо в файле обновляется
    //подключаем наш контент из index.html потому что на данном этапе он  не бандлится --- template
    //в результате подключения template перестает работать title поэтому его надо убрать
    //добавляем плагин для очистки кеша dist npm install -D html-webpack-plugin
    //теперь можно менять контент и кэш не меняется
    plugins: plugins(),
    // plugins: [
    //     new HTMLWebpackPlugin({
    //         // title: 'Webpack Taras',
    //         template: './index.html',
    //         //начинаем оптимизировать файлы с html
    //         minify: {
    //             collapseWhitespace: isProd
    //         }
    //     }),
    //     new CleanWebpackPlugin({
    //
    //
    //     }),
    //     new CopyPlugin({
    //         patterns: [
    //             { from: path.resolve(__dirname, 'src/logotip.ico'), to: path.resolve(__dirname, 'dist')}
    //         ]
    // // создаем плагин копирующий иконку с from --- откуда и to ------- куда
    //     }),
    //     new MiniCssExtractPlugin({
    //         // filename: '[name].[contenthash].css'
    //         // меняю на hash
    //         // filename: '[name].[hash].css'
    //         // меняю с использованием функции
    //         filename: filename('css')
    //     })
    // ],
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
                use: cssLoaders()
            },
            // оптимизация с помощью функций----------------------
            // use: ['style-loader', 'css-loader']
            //     use: [{
            //         loader: MiniCssExtractPlugin.loader,
            //         options: {
            //             // hmr: isDev,
            //             // изменения определенных сущностей без перезагрузки страницы
            //             // reloadAll: true
            //             //ПРОБЛЕМА НУ ПОЛУЧИЛОСЬ СКОРЕЕ ВЕРСИИ ИЗМЕНИЛИСЬ
            //             // БЕЗ УКАЗАНИЯ ОПЦИЙ ВСЕ РАБОТАЕТ
            //
            //         }
            //     }, 'css-loader']
            //     //подключаемся к css-mini-loader это позяволяет выносить css в отдельный файл
            // },
            {
                test: /\.less$/,
                use: cssLoaders('less-loader')
            },

                // оптимизация с помощью функций----------------------
            //     use: [{
            //         loader: MiniCssExtractPlugin.loader,
            //     }, 'css-loader', 'less-loader']
            //     подключаемся к less
            // },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            },
            // оптимизация с помощью функций----------------------
            //     use: [{
            //         loader: MiniCssExtractPlugin.loader,
            //     }, 'css-loader', 'sass-loader']
            //     //подключаемся к sass
            // },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']

            },
            //добавляем новый объект для работы с файлами -- картинками
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            //добавляем новый объект для работы с файлами шрифтов
            {
                test: /\.xml$/,
                use: ['xml-loader']
            },
            //Добавляем новый объект для работы с файлами с расширением xml
            {
                test: /\.csv$/,
                use: ['csv-loader']
            },
            //Добавляем новый объект для работы с файлами с расширением csv
            //получилось но вебшторм не понимает csv - надо разобраться!!!!!!!!!!!!!!
            // {
            //     test: /\.m?js$/,
            //     exclude: /node_modules/,
            //
            //     use: [{
            //         loader:  ['eslint-loader', 'babel-loader'],
            //         options: {eslintPath: 'eslint',
            //             fix : true,
            //             emitError : true,
            //             emitWarning : true}
            //     }
            //         ]
            //
            //
            // },
            // {
            //     enforce: 'pre',
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     loader: 'eslint-loader',
            // },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            // {
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     use: jsLoaders()
            // },
            //подключаем eslint для файлов .js
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-typescript')

                }
            },
            //добавляем typescript
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options:  babelOptions('@babel/preset-react')

                }
            },
            //работаем с react
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
// extensions - расширения
// split ----------- разделить
// chunks ----------- куски
// slice ------------часть, ломтик
// round ------------ круглый(круг)
// ceil ------------- потолок
// Math ------------- матиматика
// map -------------- карта, план
// replacer --------- заменитель
// space ------------ пространство