// Model posts
// после подключения вебпака можем прописывать экспорты и импорты
export default class Post {
    constructor(title, img) {
        this.title = title
        // задаем титульник поста
        this.date = new Date()
        // задаем дату поста
        this.img = img
        //учимся работать с картинками через вебпак


    }
    toString() {
       return JSON.stringify({
            title: this.title,
            date: this.date.toJSON(),
            img: this.img
        }, null, 2)
    }
    get uppercaseTitle() {
        return this.title.toUpperCase()
    }

}
// JSON.stringify() -  функция позволяющая оборачивать в строку различные объекты, массивы и так далее