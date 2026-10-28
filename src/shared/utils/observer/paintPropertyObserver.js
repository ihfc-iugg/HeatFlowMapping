// const observers = []

// export default Object.freeze({
//   notify: (paintProperty) =>
//     observers.forEach((observer) => {
//       observer(paintProperty)
//     }),
//   subscribe: (func) => observers.push(func),
//   unsubscribe: (func) => {
//     ;[...observers].forEach((observer, index) => {
//       if (observer === func) {
//         observers.splice(index, 1)
//       }
//     })
//   }
// })
