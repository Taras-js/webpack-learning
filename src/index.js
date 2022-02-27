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
//---------------------
// после добавление config вебпак в импортах убрать расширения файлов
// resolve: {
//     extensions: ['.js', '.json', '.xml', '.csv', '.png', '.css']
// },
import json from '@/assets/json'
//import json
import '@styles/styles'
//import css
import Post from '@models/Post'
import Logo from '@/assets/logo'
// import img
import xml from '@/assets/GKULPART_43_d41b7fe0-61f0-4ce5-bb71-1c82a15237e2'
// import xml fail
import csv from '@/assets/import_company_csv'
// import csv fail
import * as $ from 'jquery'

// import jquery
// * выбрать
// as --------- так как, как, согласно
// query ------------запрос

import '@styles/less.less'
// подключаем less
import '@styles/scss.scss'
//подключаем sass
const post = new Post('Webpack Post Title', Logo)
console.log('Post to string:', post.toString())
console.log('JSON:', json)
console.log('XML:', xml)
console.log('CSV:', csv)
$('pre').addClass('code').html(post.toString())