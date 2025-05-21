// 声明了一个对象常量
// 内存中开辟了一个空间，里面存放了一个对象
// wby 取址 & 变量名是地址的标记
// js是弱类型语言 变量的类型由值决定
// = 赋值 Object
// 对象字面量(字面意义上) JSON
// JS 太灵活，不需要new，通过{}拿到对象 []拿到数组
const lny = {
    name: '王博扬',
    age: 19,
    tall: 168,
    hometown: '江西吉安',
    isSingle: true,
}

// JS 灵活
const LJJ = {
    name: '林俊杰',// key value String
    age: 18,// Number 数值类型
    hometown: '新加坡',
    isSingle: true,// Boolean 布尔类型
    // 方法:送花
    // 形参
    sendFlower: function (girl) {
        // 函数体
        console.log(`${this.name}送了九百九十九朵花给 ${girl.name},${girl.name}很喜欢`)
        girl.receiveFlower(LJJ)
    },
}

// 对象:小美
const xm = {
    name: '小美',
    room : '408',
    receiveFlower: function (sender) {
        if (xm.xq >= 90) {
            console.log(`${this.name}收到了${LJJ.name}的九百九十九朵花，很开心！`)
            console.log('硕果走一波')
        }else {
            console.log('棍吧 我要取关你')
        }
    }
}

//帮林俊杰的 小美的闺蜜 小红
const xh = {
    xq:30,// 心情
    name: '小红',// 姓名
    hometown: '新加坡',// 老乡
    room: '408',// 房间
    // 送小美，送小红，都具有reveiverFlower 方法
    // 对象互换
    // 接口 interface
    receiveFlower: function (sender) {
        // if (sender.name === '林俊杰') {
        //     console.log('林哥哥，让我们在一起吧!')
        //     return 
        // }
        setTimeout(() => { // 定时器
            xm.xq = 99
            xm.receiveFlower(sender) // 把花给了最后想要给的人
        }, 3000)
    //xm.receiveFlower(sender)
    }
}

LJJ.sendFlower(xh)
// LJJ.sendFlower(xm)

// 接口！！！本节课重点