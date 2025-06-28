// 业务流水账代码
// 封装
function Button(id) {
    this.element = document.querySelector(`#${id}`)
    console.log(this.element);
    this.bindEvent()
}

// Button.prototype.bindEvent = function () {
//     // this 丢失问题 // this Button
//     // 箭头函数没有this
//     // 或者把this.element 改成 this.style
//     this.element.addEventListener('click',function() {
//         // this => this.element
//         this.style.backgroundColor = 'lightblue'
//     }.bind(this))// call 和 bind || call 直接变为红色  bind 需要手动调用
// }

Button.prototype.bindEvent = function () {
    // this 丢失问题 // this Button
    this.element.addEventListener('click',this.setBgColor.bind(this))
}

Button.prototype.setBgColor = function () {
    this.element.style.backgroundColor = 'lightblue'
    // this.element2...
}