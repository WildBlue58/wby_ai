// 声明了一个对象常量
// 内存中开辟了一个空间，里面存放了一个对象
// lny 取址 & 变量名是地址的标记
// js是弱类型语言 变量的类型由值决定
// = 赋值 Object
// 对象字面量(字面意义上) JSON
// JS 太灵活，不需要new，通过{}拿到对象 []拿到数组

// 林南一
const lny = {
    name: '林南一',// key value String
    age: 18,// Number 数值类型
    hometown: '海滨小镇',
    isSingle: true,// Boolean 布尔类型
    // 方法:送花
    // 形参
    sendFlower: function (girl) {
        // 函数体
        console.log(`${tx.name},我喜欢你！我${lny.name}想和你厮守终生！😭`)
        girl.receiveFlower(lny)
    },
}

// 童夕
const tx = {
    name: '童夕',
    university:'美术学院',
    receiveFlower: function (sender) {
        if (tx.xq >= 90) {
            console.log(`${lny.name},我等你这句话很久了🤩,我也喜欢你！`)
            console.log(`${lny.name},就像以前一样,我们再去那条开满了樱花🌸的小路吧！`)
        }else {
            console.log(`${lny.name},我一直都很喜欢你❤️,像从前那样,我们再躺在草地🌿上惬意的聊天吧！`)
        }
    }
}

//帮林南一的 童夕的闺蜜:陶竹
const tz = {
    xq:30,// 心情
    name: '陶竹',// 姓名
    hometown: '海滨小镇',// 和林南一是老乡
    university: '美术学院',// 和童夕是一所大学的
    // 送童夕，送陶竹让她帮忙转交给童夕，都具有 receiveFlower 方法
    // 对象互换
    // 接口 interface
    receiveFlower: function (sender) {
        // if (sender.name === '林南一') {
        //     console.log(``)
        //     return 
        // }
        setTimeout(() => { // 定时器
            tx.xq = 99
            tx.receiveFlower(sender) // 把花给了最后想要给的人
        }, 3000)
    }
}

lny.sendFlower(tz)

// 接口和代理模式！！！本节课重点