// Создаем новый пост
// после подключения вебпака можем прописывать экспорты и импорты
//подключаем стили css3
// получаем ошибку====================================================
// ERROR in ./styles/styles.css 1:0
// Module parse failed: Unexpected token (1:0)
// You may need an appropriate loader to handle
// this file type, currently no loaders are configured
// to process this file. See https://webpack.js.org/concepts#loaders
// вебпак не понимает css3 понимает только JS && JSON
//поэтому добавляем loader в конфиг
// in JS мы не можем использовать json напрямую
//мы можем вывести его в консоль и использовать как обычный js object
//с картинками напрямую работать нельзя нужно добавлять loader
//You may need an appropriate loader to handle this file type,
// currently no loaders are configured to process this file.
// See https://webpack.js.org/concepts#loaders
// (Source code omitted for this binary file)
// npm i -D file-loader

import json from './assets/json.json'
import './styles/styles.css'
import Post from './Post'
import Logo from './assets/logo.png'

const post = new Post('Webpack Post Title', Logo)
console.log('Post to string:', post.toString())
console.log('JSON:', json)