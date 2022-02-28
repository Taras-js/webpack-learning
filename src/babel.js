// export default function start() {
//      Promise.resolve('async is working')
// }
// start().then(console.log)
//
// class Util {
//     static id = Date.now()
// }
// console.log('Util id:', Util.id)
import('lodash').then(()=> {
    console.log('lodash', _.random(0, 42, true))
})