---
title: 前端面经总结
---

# css

## 定位

relative：相对于自身

absolute：相对于设置了定位的父元素

fixed：相对于浏览器

sticky：元素定位表现为在跨越特定阈值前为相对定位(absolute)，之后为固定定位（fix）

## 垂直外边距合并

垂直外边距合并是 **块级格式化上下文的渲染规则之一**

如何创建BFC：

1.overflow不为visible

2.float不为none

3.position为absolute、fixed

4. display属性为inline-blocks,table,table-cell,table-caption,flex,inline-flex;

# js

## this的指向

严格模式下,执行函数时没有执行主体，因此this指向undefined，非严格模式下的执行主体默认是window，因此this指向window。

用于改变this的指向：

bind：绑定this

apply ：数组形式传入

call：参数形式传入

## promise的方法

promise三种状态：pending，fulfilled（resolved），reject（等待态，执行态，拒绝态）

实例方法：

promise.all：全部resolve才是resolve

promise.allsellted: 返回所有执行结果，包括reject的结果

promise.race：哪个结果返回的快，就是哪个结果

promise.resolve：参数为空或非thenable，返回一个新的状态为fulfilled的promise；参数为thenable，返回一个新的promise，参数为promise，返回该promise

promise.reject：返回值是一个新的已拒绝的promise实例

原型方法：

Promise.prototype.then(onFulfilled, onRejected)

Promise.prototype.catch(onRejected)

Promise.prototype.finally

## promise怎么实现链式调用

then方法返回一个**新**的promise实例

Promise内存在一个变量储存promise的状态，还有两个数组存储成功的回调函数和失败的回调函数。当Promise的状态由pending变为resolved时，执行成功的回调函数；当Promise的状态由pending变为reject时，执行失败的回调函数。

```js
class Promise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = value => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.onResolvedCallbacks.forEach(callback => callback(this.value));
      }
    };

    const reject = reason => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(callback => callback(this.reason));
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

    const promise2 = new Promise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            Promise.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }

      if (this.state === 'rejected') {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            Promise.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }

      if (this.state === 'pending') {
        this.onResolvedCallbacks.push(value => {
          setTimeout(() => {
            try {
              const x = onFulfilled(value);
              Promise.resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });

        this.onRejectedCallbacks.push(reason => {
          setTimeout(() => {
            try {
              const x = onRejected(reason);
              Promise.resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });

    return promise2;
  }

  static resolvePromise(promise2, x, resolve, reject) {
    // 省略了对 x 的处理逻辑，包括处理 x 是 Promise 对象的情况和 x 是普通值的情况
    // 具体实现需要遵循 Promise/A+ 规范

    // 如果 x 和 promise2 是同一个对象，产生循环引用，抛出错误
    if (x === promise2) {
      return reject(new TypeError('Chaining cycle detected for promise'));
    }

    if (x instanceof Promise) {
      x.then(
        value => Promise.resolvePromise(promise2, value, resolve, reject),
        reason => reject(reason)
      );
    } else {
      resolve(x);
    }
  }
}
```

## async/await的原理

最开始使用回调形式，容易造成回调地狱；promise使用链式回调的方式，async/await采用同步的方法写异步逻辑

**async/await是generator函数+自动执行器的语法糖。**

```js
const p1 = () => { return new Promise((res) => {
    setTimout(() => {
        console.log('p1's);
        res(2);
    }, 1000);
})};

// generator函数
function *p () {
    const p2 = yield p1();
    console.log(p2)
}

// 自动执行器
asyncFunc(generator) {
    const gen = generator();
    function next(data) {
        const { value, done } = gen.next(data);
        if (done) {
            return value;
        } else if (!(value instanceof Promise)) {
            next(value);
        } else {
            value.then((data) => next(data));
        }
    }
    next();
}
asyncFunc(p);
```

看代码说输出：

```js
async function test(){
    console.log('test start'); // 1
    await otherTest();
    console.log('test end'); // 4
}
async function otherTest() {
    console.log('otherTest'); // 2
}
test();
console.log('after test'); // 3

/*
输出 test start -> otherTest -> after test -> test end
*/

//因为其相当于变成了
test() {
    console.log('test start');
    const p = new Promise((res, rej) => {
        otherTest();
    });
    p.then(() => console.log('test end'));
    return p;
}
```

## Promise与async/await的区别

1.async/await写法更加简洁，**像同步函数**

2.异常：promise使用.catch处理异步请求的异常，使用try catch处理同步请求的异常，async/await使用try catch处理同步异步请求的异常

3.如果需要使用中间值，promise需要使用promise1的值去调用promise2，然后再用两者的结果去调用promise

## &#x20;bigInt

在整数字面量后面+n

调用函数BigInt（）

## null和undifine的区别 

在JavaScript中，null和undefined是两个不同的特殊值，它们之间有一些区别：

1.undefined（未定义）：当一个变量被声明但没有赋值时，默认的初始值就是undefined。也就是说，如果一个变量被声明但没有显式赋予任何值，那么它的值就是undefined。另外，在函数中没有返回值或者没有显式返回任何值的情况下，函数的返回值也是undefined。

例如：

```js
let x;

console.log(x); // 输出：undefined

function foo() {

// 没有return语句

}

console.log(foo()); // 输出：undefined
```

2.null（空值）：null表示一个特定的空值，它是一个表示"空"或"不存在"的特殊值。通常在需要显式地表示一个变量为空时使用。null是一个表示空对象指针的特殊值，可以将其赋值给一个对象类型的变量，表示该变量当前没有指向任何对象。

例如：

```js
let y = null;

console.log(y); // 输出：null

let obj = null;

console.log(obj); // 输出：null
```

总结来说，undefined通常表示未定义或未初始化，而null表示一个空的对象值。undefined是一个表示变量未赋值的默认初始值，而null是一个表示已赋值为空的特殊值。

## 面向对象, js 原型链继承, ES6 class 如何实现

*   构造函数继承

Person.call(this,name)

*   原型继承

Son.prototype = new Person(name)

*   组合继承（构造函数继承+原型继承--->构造函数会执行两遍）
*   寄生组合继承 **Object.create**

## js是单线程

<https://blog.csdn.net/wu_xianqiang/article/details/105837869>

webwoker：允许js脚本创建多个线程，但是子线程完全受主线程控制，并且不能操作DOM

# ts

## type与interface的区别

type和interface都可以用来描述一个对象的类型。

*   type可以用来定义**基本类型，联合类型，交叉类型， 元组**，而interface只能用来定义**对象类型**

```js
type MyString = string;
type MyNumber = number;
type MyBoolean = boolean;
type MyUnion = string | number | boolean;
type MyObject = { name: string } & { age: number }; // 交叉类型
// 泛型
type Tree<T> = { value: T };
// 元组
type Data = [number, string];
```

*   interface支持继承和实现，**type通过&交叉类型实现继承**

```js
// 继承使用extends
interface Shape {
  color: string;
}

interface Size {
  width: number;
  height: number;
}

interface Rectangle extends Shape, Size {
  name: string;
}

let rectangle: Rectangle = { color: 'red', width: 100, height: 200, name: 'rectangle' };

// 实现使用implenents
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}

class Clock implements ClockInterface {
  currentTime: Date = new Date();
  setTime(d: Date) {
    this.currentTime = d;
  }
}
```

*   如果多次使用interface声明一个同名接口，ts会将他们合并到一个声明中；如果多次使用type声明一个同名接口，ts会报错，这里存在一个索引签名问题(Record与{\[key\:string]：string})

```js
interface propType{
    [key: string] : string
}
let props: propType

============================

type dataType = {
    title: string
}
const data: dataType = {title: "订单页面"}
props = data

=============================

// 因为interface定义的类型是不一定的，申明多个同名接口会合并到一个声明中去
interface dataType1 {
    title: string
}
const data1: dataType1 = {title: "订单页面"}
props = data1 // Error:类型“dataType1”不可分配给类型“propType”; 类型“dataType1”中缺少索引签名
```

*   type 可以使用泛型，而 interface 也可以使用泛型，但是语法略有不同

总的来说，TS 在类型检查和编码规范方面比 JS 更加严格，可以有效提高**代码质量和可维护性**，但相对于 JS 的学习成本也更高。因此，在选择使用 JS 还是 TS 时，需要考虑具体的项目需求和团队技术水平等因素。

# react

## react的函数编程思想

函数式编程中的核心概念之一是**纯函数**，纯函数需要满足以下条件

*   相同输入总会得到相同输出
*   没有副作用（副作用是指可能对函数外部变量产生影响）
*   不依赖于函数外部状态

react的函数编程思想体现在给定相同的输入（数据），必然会有相同的输出（UI），在开发中应避免数据**交互逻辑**与**数据渲染**过于耦合，严格区分**容器组件与展示组件**。

参考：<https://blog.csdn.net/dianqi0560/article/details/101959867>

## 为什么现在不用class了

类组件的不足：

*   状态逻辑难复用
*   组件难以维护
*   需要考虑this的指向问题（this是可变的）
*   代码量多

hook带来的好处有：

*   逻辑复用（创建自定义hook实现状态逻辑复用）
*   业务代码更复合
*   写法简洁（使用hooks取代了生命周期的概念）

## 说一下你用的hooks

### useMemo与useCallback

useCallback **缓存函数的引用**，useMemo **缓存计算数据的值**。

当**函数或变量**作为props传给子组件时，可使用useCallback与useMemo，避免子组件的非必要渲染。

参考：<https://fe.azhubaby.com/React/Hooks.html>

### useRef

useRef返回的是一个**可变的ref对象**。可以用来**管理DOM**，也可以用来**保存数据**。

ref对象本身在整个生命周期中不会发生变化，但是我们可以修改ref.curren属性值来更改其内容，ref.current是一个可变值，使用Ref保存的数据可以在每次组件渲染时保持不变。（**在函数组件中，每次组件重新渲染时，所有的变量都会被重新申明和初始化，而使用useRef保存的数据，在组件的整个生命周期内能保持不变**）

useState和useRef：

useState用于保存**会触发重新渲染**的组件状态值，useRef用于维护**在多次渲染之间需要保留的引用值**。如使用sueRef存储定时器的引用可以解决由于组件重新渲染导致定时器引用丢失的问题，如果使用useState存储，组件重新渲染时会创建新的定时器，可能导致多个定时器同时运行或就旧定时器无法清除的情况。因为定时器的回调函数依赖于旧的定时器引用，而**useState的更新操作会产生新的引用**。

（useState的更新会产生新的引用是因为每次调用状态更新函数时，会生成一个新的状态容器，确保在更新过程中不会直接修改原始的状态容器，从而保持状态的不可变性和可追踪性）

其他：[​](https://fe.azhubaby.com/React/Hooks.html#%E5%9C%BA%E6%99%AF%E4%B8%BE%E4%BE%8B)

点击"加"按钮 3 次，再点“弹框显示” 1 次，再点“加”按钮 2 次，最终 alert 会是什么结果？

```jsx
import React, { useState } from 'react'

const Counter = () => {
  const [count, setCount] = useState<number>(0)

  const handleCount = () => {
    setTimeout(() => {
      alert('current count: ' + count)
    }, 3000);
  }

  return (
    <div>
      <p>current count: { count }</p>
      <button onClick={() => setCount(count + 1)}>加</button>
      <button onClick={() => handleCount()}>弹框显示</button>
    </div>
  )
}

export default Counter
```

结果是弹框内容为 current count: 3，为什么？

当我们更新状态的时候, React 会重新渲染组件, 每一次渲染都会拿到**独立的 count 状态,** 并重新渲染一个 handleCount 函数. **每一个 handleCount 里面都有它自己的 count**。

参考：<https://www.jb51.net/article/283670.htm>

参考：<https://fe.azhubaby.com/React/Hooks.html>

### useState的原理

1.state存在哪里?

    workInProgress树有一个memoizedState属性,这个属性是用来存放hooks相关信息的,也就是说**state是存在虚拟dom里面的**.

（current树表示当前实际渲染在屏幕上的状态，而workInProgress树表示正在进行更新操作的中间状态，当组件进行更新时，react会基于current树生成一棵初始的workInProgress树，并通过fiber节点的数据结构来构建，表示和协调整个组件树。workInProgress树在更新过程中不会直接操作实际DOM，而是与current树比对，找到需要更新的DOM节点，一旦协调阶段完成，workInProgress就会转化为新的current树，将结果反应在屏幕上）

（workInProgress树的好处是，可以进行**增量渲染**，避免长时间的阻塞和卡顿）

2.state是怎么存的?

    memoizedState是一个单链表的结构。我们每个useState都会生成一个hook节点，这些节点会存储到memoizedState中去，并通过next指针串起来。

```js
 _hook :[
        {value:1,uplate:function1,next:hook1},
        {value:2,uplate:function2,next:hook2}
]
```

   3.state的更新是怎么更新页面的?

    useState更新时,会依次去执行hook对象数组里面的更新函数,从而修改虚拟dom,然后在完成一次组件更新后，会把当前workInProgress树赋值给current树，current会在commit阶段替换成真实的Dom树。

为什么不能直接赋值？

直接赋值并不能让React监听到state的变化，页面无法更新

参数？

setState第一个参数是对象时，直接修改state的值；第一个参数是函数时，参数分别为上一次的preState和curprops；第二个参数是可选的回调函数，在组件更新完成后执行，可以获得最新的state值

案例：

每次调用只是将更改加入队列，同步调用时只会执行最后一次更新，所以更新后的值为1

```js
onClick = () => {
	const { count } = this.state
	this.setState({ count: count + 1 })
	this.setState({ count: count + 1 })
	this.setState({ count: count + 1 })
}
```

setState的更新是分批次的，通过回调函数的形式能确保当前的state是建立在上一个state之上的

```js
onClick = () => {
  this.setState((prevState, props) => {
    return {
      count: prevState.count + 1
    }
  })
  this.setState((prevState, props) => {
    return {
      count: prevState.count + 1
    }
  })
  this.setState((prevState, props) => {
    return {
      count: prevState.count + 1
    }
  })
}
```

异步可以显著提升性能，react16引入了Fiber架构，Fiber对任务进行了划分和优先级分类，优先处理优先级比较高的任务，页面响应就是一个优先级比较高的任务。如果更新一次就更新一次页面，就会阻塞页面的响应。异步的话能获取多个更新，之后进行批量更新，只更新一次页面。

setTimeout是异步方法，react无法知道开发者异步方法中想要渲染的顺序，所以在异步方法中调用setTimeout，react会即时渲染，不会使用批量更新。

```js
import React from 'react'

export default class HK extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            val: 0
        }
    }

    componentDidMount(){
        this.setState({val:this.state.val + 1})
        console.log('HK------------->1', this.state.val)
        this.setState({val:this.state.val + 1})
        console.log('HK------------->2', this.state.val)

        setTimeout(() => {
            this.setState({val:this.state.val + 1})
            console.log('HK------------->3', this.state.val)
            this.setState({val:this.state.val + 1})
            console.log('HK------------->4', this.state.val)
        }, 0)
    }

    render(){
        return null
    }
}
```

setInterval+setState输出的始终是1

原因是每次传递给setInterval的值都是首次渲染的值，当调用setInterval时，无法获取最新的count值

```js
const TodoApp = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setInterval(() => {
      console.log("ahh");
      setCount(count + 1);
    }, 1000);
  }, []);

  return <>{count}</>;
};
```

解决：

```js
useEffect(() => {
  const timer = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => {
    clearInterval(timer);
  };
}, [count]);
```

```js
useEffect(() => {
  setInterval(() => {
    setCount((count) => count + 1);
  }, 1000);
}, []);
```

参考：<https://www.cnblogs.com/Shyno/p/16506121.html>

参考：<https://blog.csdn.net/weixin_44828588/article/details/126370989>

参考：<https://www.inte.net/news/77587.html>

参考：<https://blog.csdn.net/zhamaoshu4539/article/details/113984731>

参考：<https://www.1024nav.com/faq/2021/04/12/react-hook-setInterval>

参考：<https://www.1024nav.com/faq/react-hook-timer-state-no-change>

#### useState为什么会返回数组，不是对象

数组解构时，变量的取值由它的**位置**决定，变量可以是**任意名称**，而对象解构时对象的属性没有顺序，变量必须与属性同名，如果返回的是对象，需要对每个变量进行重命名，导致代码冗余

## hook的原理

React在初次渲染或者更新过程中，都会在render阶段创建新的或者复用旧的fiber节点，**每个函数组件，都有对应的fiber节点**，存储了子节点（child），兄弟节点（sibling），父节点（return）等相关信息，hooks是组件和fiber之间的桥梁，能更新fiber相关数据，其中有两个属性memorizedState和updataQueue，是和hook相关的。

**memorizedState是用于保存hook的单向链表**，react会为每个hook函数创建一个hook对象，单项链表中存储的就是这些hook对象，在下一次渲染时，会从这些hook对象中获取上一次的状态信息。当触发更新时，会将待更新的任务放入待更新队列中，如果当前fiber正在更新，则不需要更新，**与之前的值进行比对**，相同则退出，不同则进行更新。更新时会先把待更新队列中的数据进行合并，再更新。

**updataQueue用于收集hook的副作用信息的环状链表**，保存了useEffect，useLayoutEffect，useImperativeHandle这三个hook的effect信息，在commit阶段更新这些副作用。React会通过标识符识别不同的effect，同步处理useLayoutEffect，异步处理useEffect。

在render阶段，并没有操作真正的DOM元素，而是等到commit阶段，统一处理这些副作用。

参考：<https://fe.azhubaby.com/React/Hooks.html>

参考：<https://blog.csdn.net/kelly0721/article/details/127495025>

参考：<https://blog.csdn.net/grooyo/article/details/127388597>

参考：[https://huaweicloud.csdn.net/63a55dddb878a5454594531f.html?spm=1001.2101.3001.6650.7\&utm\_medium=distribute.pc\_relevant.none-task-blog-2~default~BlogCommendFromBaidu\~activity-7-122746330-blog-127388597.235](https://huaweicloud.csdn.net/63a55dddb878a5454594531f.html?spm=1001.2101.3001.6650.7\&utm_medium=distribute.pc_relevant.none-task-blog-2\~default\~BlogCommendFromBaidu\~activity-7-122746330-blog-127388597.235)^v38^pc\_relevant\_sort\_base1\&depth\_1-utm\_source=distribute.pc\_relevant.none-task-blog-2~default~BlogCommendFromBaidu\~activity-7-122746330-blog-127388597.235^v38^pc\_relevant\_sort\_base1\&utm\_relevant\_index=13

## hooks为什么不能写在条件语句中

**在更新过程中**，如果通过if条件语句，增加或删除hooks，在复用hooks的过程中，会产生复用hooks状态和当前hooks状态不一致的问题。

参考：[https://huaweicloud.csdn.net/63a55dddb878a5454594531f.html?spm=1001.2101.3001.6650.7\&utm\_medium=distribute.pc\_relevant.none-task-blog-2~default~BlogCommendFromBaidu\~activity-7-122746330-blog-127388597.235](https://huaweicloud.csdn.net/63a55dddb878a5454594531f.html?spm=1001.2101.3001.6650.7\&utm_medium=distribute.pc_relevant.none-task-blog-2\~default\~BlogCommendFromBaidu\~activity-7-122746330-blog-127388597.235)

## React 的fiber作用和原理

是React16中新的协调引擎，主要目的是使虚拟DOM可以进行**增量式渲染**

在React16之前面临的主要性能问题是：当组件树很庞大时，更新状态可能会造成页面卡顿，根本原因在于，更新流程是【**同步，不可中断的**】

fiber架构让react渲染的过程可以被中断，可以将控制权交回浏览器，让浏览器及时地响应用户的交互，通过将工作任务拆分为一个个工作单元来执行。

fiber机制的实现，是依赖于链表实现的，每个节点都是一个fiber，一个fiber包含了child，sibling，parent等属性

页面渲染完成后会初始化一棵fiber-tree，这棵树与虚拟DOM没什么区别

同时，react还会维护一棵workinprogressTree，用于计算更新

当触发更新后，react会把需要更新的内容放到更新队列中，交给scheduler去处理

scheduler提供了一个**requestIdelCallback**的Api，会根据主线程的使用情况，去处理update

这个过程通过时间片的形式进行循环

fiber执行分为两个阶段：

*   render 阶段：这个阶段是可中断的，会找出所有节点的变更
*   commit 阶段：这个阶段是不可中断的，会执行所有的变更

其他：

在react16之前： React 会递归比对VirtualDOM树，找出需要变动的节点，然后同步更新它们, 一气呵成。这个过程 React 称为 Reconcilation(中文可以译为协调).

在这个过程中，React 会霸占浏览器资源，一则会导致用户触发的事件得不到响应, 二则会导致掉帧，用户可以感知到这些卡顿。

为了让用户感觉该应用的响应很快，不能让一个程序长期霸占资源，需要通过调度策略合理的分配CPU资源，从而提升浏览器的响应速度，同时兼顾任务的执行效率

fiber让前面的整个过程可以中断，适时让出CPU的执行权，让浏览器实时响应用户的交互

参考：<https://juejin.cn/post/6943896410987659277#heading-6>

参考：<https://juejin.cn/post/6844903582622285831#heading-4>

参考：<https://fe.azhubaby.com/React/Fiber.html>

## 函数组件与类式组件有什么不同

区别：

①设计思想不同：函数式组件是**函数式编程思想**，而类组件是**面向对象编程思想**。向对象编程将**属性和方法封装起来**，屏蔽很多细节，不利于测试

②类组件有**状态管理**，而函数式组件的状态需要使用useState自定义。

③创建组件时，函数式组件只需调用函数即可创建组件，而类组件必须先实例化一个对象，然后通过这个实例化对象调用render函数来创建组件

④类组件是用生命周期钩子函数来实现**业务逻辑**的，而函数式组件使用react Hooks来实现业务逻辑。

类式组件的优点：

*   类组件需要继承React.component，有生命周期，需要基于this做各种操作。（props是不可变的，但是this是可变的）
*   拥有更多的功能和**生命周期方法**，可以进行更复杂的逻辑处理和渲染优化。
*   有**状态管理**，可以使用state来管理组件的状态，使得组件更加灵活和动态化。

参考：<https://blog.csdn.net/qq_44718039/article/details/125288269>

## 什么是虚拟dom

虚拟DOM是构建在实际DOM之上的一种抽象表示，可以看做是真实DOM的轻量级副本，通过对虚拟DOM的操作和比较，可以实现高效的页面更新和渲染。

## react的diff算法

渲染真实DOM的开销很大，有时只是修改了某个数据，会造成整个DOM树的重绘重排

diff算法利用虚拟DOM进行比对，找到需要更新的部分，尽可能做到节点复用

diff策略：

1.  **同层比较**
2.  只对**同一类型**的组件（元素节点，文本节点，注释节点）进行比较
3.  同层的节点操作有：删除，插入，移动

遍历过程可以分为两个阶段：

第一次从前往后遍历新旧虚拟DOM，可以复用就处理下个节点，否则结束遍历

第二次会把剩余旧的fiber节点放到map中去，遍历新的虚拟DOM，能在map中找到，则移动过来，没找到则新增，剩余旧的fiber节点删除

**fiber是react中实现虚拟dom的一种方式,它是一个单链表结构**

参考：<https://zhuanlan.zhihu.com/p/553744711>

参考：<https://blog.csdn.net/m0_53644435/article/details/123440036>

## Tree Shaking

删除不需要的额外代码，优化代码体积

在打包过程中**静态分析模块的导入导出**，把导出但是没有使用的模块删除，从而实现打包产物的优化

需要注意的是，export default 导出的是一个对象，「无法通过静态分析判断出一个对象的哪些变量未被使用，所以 tree-shaking 只对使用 export 导出的变量生效」

mode = ''production" 生产环境，会自动启动 tree shaking

## Tree Shaking 如何处理副作用模块？

副作用：一个函数会、或者可能会**对函数外部变量产生影响的行为**。

具有副作用的文件**不应该做 tree-shaking**，因为这将破坏整个应用程序。比如全局[样式表](https://so.csdn.net/so/search?q=%E6%A0%B7%E5%BC%8F%E8%A1%A8\&spm=1001.2101.3001.7020)及全局的 JS 配置文件。

**package.json中的sideEffects**（数组，boolean）一般用于npm包标记是否有副作用。有副作用则不能去移除，移除了可能会出现bug

## Redux 原理

参考：<https://zhuanlan.zhihu.com/p/509756917>

redux基本原理：**在组件外部维护一个store**，在store修改的时候，会通知所有被connect包裹的组件进行更新。

工作原理：

1.  用户触发更新，通过dispatch发送action
2.  redux接收到action后，通过reduce函数获取下一个状态，更新到store中
3.  store更新后通知页面重新渲染（采用的是**发布者，订阅者模式**）

使用 Redux 和直接在全局作用域定义一个数据对象有什么区别？

在全局作用域定义一个数据对象无法驱动react组件重新渲染

## 受控组件/非受控组件

参考：<https://www.nowcoder.com/discuss/368384573162496000>

受控组件：React使用state保存输入框的值，改变值一般使用onChange来进行对state的手动更新。

数据由react组件管理

通过更新state，令组件重新渲染来展示当前的值

非受控组件：dom自身保存值，要使用值的话需要通过ref获取，如果有默认值则用defaultValue去设。

数据由DOM节点处理

通过forwardRef，useImperativeHandle暴露出相关的方法

<https://zhuanlan.zhihu.com/p/536322574>

既受控，又非受控的混合组件：

【受控】的意思是组件更新的控制权交给开发者，而不是由组件内部自己决定。

**内外两个状态，手动同步。当处于受控模式时，使用外部传进来的props，当非受控时，使用内部的state**。

使用useRef存储值，使用ahooks的useUpdate进行组件的更新

<https://blog.csdn.net/fendouzhe123/article/details/52121704>

1.  props.value的优先级比state.value的优先级高，在优先值发生变化后更新组件
2.  组件中的变化需要同步到内部的state.value，并通过props.onChange去出发外部props.value值的更新
3.  接受新的props.value，需要反映给state.value

## react有哪些生命周期函数

分为挂载，更新，卸载三种

*   挂载

    *   constructor
    *   getDerivedStateFromProps（接收props和state，返回一个对象覆盖到state上）
    *   render
    *   componentDIdMount
*   更新

    *   getDerivedStateFromProps
    *   shouldComponentUpdate
    *   render
    *   getSnapshotBeforeUpdate（接收preprops和prestate，返回的值将作为第三个参数传给componentDidUpdate）
    *   componentDidUpdate
*   卸载

    *   componentWillUnmounting

参考：<https://www.51cto.com/article/740583.html>

# vue

## vue的双向绑定机制

首先为每个vue属性用Object.defineProperty()实现数据劫持，为每个属性分配一个订阅者集合的管理数组dep，然后在编译的时候在该属性的数组dep中添加订阅者。当数据发生更新时，会触发属性的set方法，然后dep会通知所有订阅者调用update方法对数据进行更新。

参考：<https://blog.csdn.net/qq_23858785/article/details/127730617>

# webpack

## 优化webpack构建速度

*   **缩小编译范围**，减少不必要的编译工作

在使用loader时，配置**test匹配文件，exclude，include**

**alias**给一些常用的路径起一个别名，特别当项目目录结构比较深的时候，一个文件的路径可能是./../../的形式，通过配置alias以减少查找过程

resolve.modules 用于配置 webpack 去哪些目录下寻找第三方模块。默认值为\['node\_modules']，所以默认会从node\_modules中查找文件 当安装的第三方模块都放在项目根目录下的 ./node\_modules 目录下时，所以可以指明存放第三方模块的绝对路径，以减少寻找，配置如下：modules: \[path.resolve(\_\_dirname, 'node\_modules')]

*   通过 **externals** 配置来提取常用库，引用cdn

使用cdn引入库，不使用webpack打包

*   使用dllPlugin启动**预编译**(autodll-webpack-plugin)

这个库会把第三方库单独打包到一个文件中，这个文件是一个单独的依赖库，这个依赖库不会跟着业务代码一起被重新打包，只有当**依赖自身发生版本变化时**才会重新打包

webpack4之后换成了更好用的插件：[HardSourceWebpackPlugin](https://github.com/mzgoddard/hard-source-webpack-plugin)

*   **happypack**：将loader由单线程转为多线程

webpack是单线程的，happypack能把任务分解成多个子进程去并发执行，大大提升打包效率。我们可以手动高速happypack我们需要多少个并发的进程。

基本原理：我们使用loader对js，css，图片，字体等文件做转换操作时，由于只能一个文件一个文件进行处理，需要较长的构建时间。

*   合理使用**sourcemap**

打包生成 sourceMap 的时候，如果信息越详细，打包速度就会越慢。对应属性取值如下所示：

Sourcemap 本质上是一个信息文件，里面储存着代码转换前后的对应位置信息

包组成可视化工具——[webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)

## Webpack 如何处理异步 import

在Webpack中，异步 import() 是一种通过**代码分割**（code splitting）实现**动态加载模块**的方式。当Webpack遇到异步 import() 语句时，它会将**相应的模块单独打包成一个独立的文件**（通常称为分割包），然后按需加载这个分割包。
Webpack将异步 import() 转化为特殊的代码语法，**在运行时**使用动态导入（dynamic import）来加载模块。它会生成一个返回Promise的函数（也可以使用 async/await）。**当执行到异步 import() 语句时，会动态地加载模块，直到模块加载完成后，才会执行之后的代码**。
以下是一个示例，演示了Webpack如何处理异步 import()：

```js
// 异步加载模块
import("./module")
  .then((module) => {
    // 加载成功后的逻辑
    module.doSomething();
  })
  .catch((error) => {
    // 加载失败后的处理
    console.error("Error while loading module:", error);
  });
```

在上述代码中，import("./module") 表示异步加载模块 ./module。Webpack会将 ./module 单独打包成一个分割包，并在需要的时候进行加载。 需要注意的是，Webpack提供了许多配置选项来优化异步加载，例如使用Webpack的代码分割配置项，动态导入时按需加载需要的模块，使用Webpack插件（如SplitChunksPlugin）来进一步优化分割包的加载方式等。 通过使用异步 import()，Webpack可以根据需要动态加载模块，实现代码分割和按需加载，提升应用程序的性能和加载速度。

## webpack打包

根据文件之间的**依赖关系**对其进行**静态分析**，然后将这些模块按照指定规则**生成静态资源**。当webpack进行处理时，会递归构建一个依赖关系图，包含应用程序需要的每个模块，然后把这些模块打包成一个或多个bundle

# 其他

## React和vue的区别

*   组件写法不同

    *   vue通过template的单文件组件格式： style， template，script
    *   react通过jsx的形式
*   diff算法不同

    *   vue和react都是进行同层次的比较
    *   vue对比节点，如果节点类型相同，但是**className**不同，认为是不同类型的元素，会删除重建，但react则会认为是同类型的节点，只会修改节点属性
    *   vue列表比对采用的是**首尾指针法**，react采用的是从左到右依次比对的方式。当一个集合只是把最后一个节点移动到第一个，react会把前面的节点依次移动，而vue会把最后一个节点移动到第一个，从这点来说，vue的比对方式更加高效
*   核心思想不同
    *   vue是一个灵活易用的**渐进式双向绑定的MVVM框架**；
    *   react的核心思想是**声明式渲染和组件化，单向数据流**，既不属于MVC，也不属于MVVM
*   响应式原理不同

    *   vue会遍历data数据对象，使用**Object.definedProperty()将每个属性都转换为getter和setter，进行**数据劫持，每个Vue组件实例都有一个对应的watcher实例，在组件初次渲染的时候会记录组件用到了那些数据，**使用依赖收集器deps进行依赖收集**，当数据发生改变的时候，会触发setter方法，依赖收集器会通知所有依赖这个数据的watcher实例调用update方法去触发组件的compile渲染方法，进行数据渲染。
    *   react：React主要是通过setState()方法来更新状态，状态更新之后，组件也会重新渲染。

## SSR

SSR是指服务端渲染网页内容，并且将渲染好的HTML发送给浏览器，而不是在浏览器渲染。这种技术的优点是更快的**首屏加载速度和SEO（搜索引擎优化）**。浏览器不需要等待数据加载和渲染，提高用户的首屏体验；

举例：

我们考虑一个简单的电商网站，它有一个商品列表的页面。**如果使用客户端渲染，浏览器会加载空白的页面。然后通过JavaScript在客户端请求数据并渲染页面。这可能会导致用户在等待页面数据加载和渲染时看到空白页面。**

如果使用服务器端渲染，在请求商品列表页面时，服务器会获取所需数据并将渲染后的HTML发送给浏览器，这样用户将立即看到完整页面，而不用等待数据加载和渲染。这提高了用户的使用体验。

注意：对于复杂的页面，服务器端渲染可能会带来性能问题，因此需要谨慎考虑是否使用。

**对于具有大量静态内容的简单页面，客户端渲染可能是一个更好的选择**。因为它可以更快地加载页面。但是对于需要从服务器动态加载数据的复杂页面，服务器端渲染可能是一个更好的选择，因为他可以提高用户的首屏体验和搜索引擎优化。

## 观察者发布者模式的区别

&#x20; 观察者模式定义对象间一种一对多的依赖关系，使得每当一个对象改变状态，则所有依赖于它的对象都会得到通知并自动更新。

&#x20; 订阅者把自己想订阅的事件注册到**调度中心**，当该事件触发时候，发布者发布该事件到调度中心（顺带上下文），由调度中心统一调度订阅者注册到调度中心的处理代码。

## 浏览器兼容性问题

<https://blog.csdn.net/weixin_46775833/article/details/112828084>

五大浏览器：Chrome谷歌，FireFox火狐，Ssfari苹果，IE，Opera欧朋

css兼容：

*   设置**全局样式**，清除margin，padding值等
*   通过浏览器前缀兼容，-moz- 火狐浏览器，-Webkit- safari谷歌浏览器等使用Webkit引擎的浏览器，-o- Opera浏览器（早期），-ms- IE

js兼容：

*   不同浏览器对JavaScript语法和API的支持程度不同。可以通过**特性监测**判断浏览器是否支持某个应用，增加兼容性的方法。
*   另外，可以使用**JavaScript库和框架**（如jQuery、React、Vue.js等）来屏蔽浏览器差异，这些库和框架在底层处理了浏览器差异，确保代码在各个浏览器中具有一致的行为。

## 项目手机端适配

flex

%，em，rem，vw，vh

meta标签 viewport：initialScale，maxium-scale，minimum-scale，user-scalable：none

**@media** screen and (min-width: 320px) {html{font-size:50px;}}

## &#x20;commonjs和esmodule的区别

1\. **导出语法**，commonjs是exports导出，require导入；ES6则是export导出，import导入。

2\. commonjs是**运行时**加载模块，ES6是在**静态编译期间**就确定模块的依赖。

3\. commonjs导出的是一个**值拷贝**，会对加载结果进行缓存，一旦内部再修改这个值，则不会同步到外部。ES6是导出的一个**引用**，内部修改可以同步到外部。

4\. commonjs不会提升require，ES6在编译期间会将所有import提升到顶部。

5\. 两者的循环导入的实现原理不同，commonjs是当模块遇到循环加载时，**返回的是当前已经执行的部分的值**，而不是代码全部执行后的值，两者可能会有差异。所以，输入变量的时候，必须非常小心。ES6 模块是动态引用，如果使用import从一个模块加载变量（即import foo from 'foo'），那些变量不会被缓存，而是成为一个**指向被加载模块的引用**，需要开发者自己保证，真正取值的时候能够取到值。（<https://www.cainiaoxueyuan.com/gcs/9085.html>）

6\. commonjs中顶层的this指向这个模块本身，而ES6中顶层this指向undefined。

7\. 然后就是commonjs中的一些顶层变量在ES6中不再存在：

arguments require module exports \_\_filename \_\_dirname

## Node 后端吗, 讲讲一个 http 请求到了服务端, 可能会有哪些处理

<https://m.php.cn/faq/508409.html>

服务器调用HTTP模块中的createServer函数**创建一个HTTP服务器**实例，然后**监听指定端口**，等待客户端的连接请求。建立连接后，会创建一个**请求对象request**接收客户端传递过来的信息，并根据请求对象处理请求，然后生成一个**响应对象request**，将响应对象发送给客户端。

通过 require(‘http’) 获取 Nodejs 原生提供的 http 模块。

通过 http.createServer 创建一个 server。

使用req接收客户端传递过来的信息，使用res向客户端发送相关信息

## 数据可视化,画一个折线图

<https://blog.csdn.net/suandfei/article/details/118661480>

1\. 创建canvas画布

2\. 创建上下文：canvas.getContext('2d')

3\. lineTo， moveTo， strock（描边），closePath，beginPath，arc（圆），fillText

## 什么是immutable

immutable，译为"不可改变的"，是一种**持久化数据**，也就是使用旧数据创建新数据

一旦被创建就不会被修改，当你修改 immutable 对象的时候返回新的 immutable。但是原数据不会改变。

Immutable使用了Structural Sharing（**结构共享**），**即如果对象树中一个节点发生变化，只修改这个节点和受它影响的父节点，其他节点进行共享**

换种方式问：持久化数据结构有什么用？

进行 js 对象的深拷贝对性能的消耗太大时（使用了递归），例如 Redux 中的深拷贝，就需要用到 immutable 来提升性能，从而避免牵一发而动全身。

当你使用 immutable 后再进行深拷贝的时候，只会拷贝你改变的节点，从而达到了节省性能的目的。

## 单页和多页

单页：只有一个页面，跳转是页面片段之间的跳转，切换速度快

多页：有多个页面，跳转是从一个页面跳转到另一个页面，页面切换加载慢，不流畅

## websocket

<https://blog.csdn.net/sinat_36422236/article/details/85051547>

提供一种在**单个TCP连接上一种全双工的协议**。

以前客户端想知道服务端的处理进度，需要不停使用ajax进行轮询，服务器压力比较高，或使用long pull的方式，客户端发送消息后，如果没收到回复，就一直等待，造成阻塞。

websocket：服务端能主动推送信息给客户端，并且只需要进行一次三次握手，就能一直与客户端保持通讯，减少了握手挥手的开销

## 垃圾回收机制

*   标记清除（循环引用通常不需要手动清除引用）

&#x9;当变量进入环境时，例如：在一个函数中申明一个变量，就将这个变量标记为“进入环境”，当变量离开时，则将其标记为离开环境。

（从逻辑上讲，永远不能释放进入环境的变量所占的内存，因为只要执行流进入相应的环境，就可能还会用到它们）

*   引用计数（循环引用通常需要手动清除引用）

跟踪每个值被引用的次数。

（当申明了一个变量并将一个引用类型值A赋给该变量时，则这个引用类型值A的引用次数就是1。如果这个引用类型值A又被赋给另一个变量，则这个引用类型值A的引用次数+1；如果这个变量被另一个引用类型值B赋值，则这个引用类型值A的引用次数-1；当引用次数为0时，说明没有办法再访问这个值了，因而可以将其占用的内存空间回收回来）

## 为什么不用iframe做微前端

什么是微前端？

微前端是一种将前端应用程序拆分成多个小型，可独立开发，部署和运行的单元的架构模式。

传统的前端开发通常是构建和维护一个单体应用，所有的功能和页面都集中在一个代码库中。随着应用的增长，这种方式会导致代码库庞大、团队协作复杂、部署耗时和版本升级困难等问题。

iframe存在的挑战：

*   性能开销：每个iframe都是一个**独立的文档**，需要加载和渲染自己的HTML，CSS和JavaScript**资源**，会增加页面启动时间和网络开销，尤其当有多个子应用时。
*   **通信**和数据传递：不同iframe之间的通信和数据传递很复杂，需要使用postMessage或类似的机制进行跨域通信，会增加代码复杂性和开发的困难度。
*   **SEO**和页面性能优化：因为每个子应用都是独立的文档，搜索引擎可能无法正确识别和索引子应用的内容。
*   **样式**和样式冲突

## 解决跨域的方式

同源策略是浏览器最核心也是最基本的安全功能，同源是指**协议，域名，端口号**三者相同

*   JSONP

通过创建script标签，在src路径后面拼接上callback回调函数实现跨域请求（只能实现get请求）

*   跨域资源共享（CORS）

在后端设置access-control-allow-origin的响应头部（当浏览器发送跨域请求时，会先发送一个预检请求Options到目标服务器，检查是否允许跨域访问。如果目标服务器返回的响应中包含access-control-allow-origin头部，并且指定的源在他的值中，浏览器就会允许跨域请求）

*   nginx代理

同源策略是浏览器的安全策略，不是HTTP协议的一部分，服务端掉用HTTP接口只是使用HTTP协议，不存在同源策略，也就不存在跨域问题。

# 计算机网络

## 浏览器缓存cookie，sessionstroage，localstroage，还有什么

cookie一般网站为了辨别用户身份，进行session跟踪而储存在用户本地终端上的数据

sessionStroage在浏览器关闭时会全部删除

localStroage一般用来存储ajax返回的数据，加快下次页面打开时的渲染速。只有在相同的协议、主机名和端口号的页面之间才能共享 localStorage 数据。同一窗口或选项卡共享，这是因为它们都属于同一个浏览器会话，共享同一个存储空间，不同窗口或选项卡独立。

application cache（离线缓存）是将大部分图片资源，js，css静态资源放在manifest文件配置中。

## Cookie 的 SameSite 属性

Chrome 51 开始，浏览器的 [Cookie](https://www.leixue.com/so/Cookie) 新增加了一个 [SameSite](https://www.leixue.com/so/SameSite) 属性，用来防止 [CSRF](https://www.leixue.com/so/CSRF) 攻击(跨站请求伪造)和[用户追踪](https://www.leixue.com/so/%E7%94%A8%E6%88%B7%E8%BF%BD%E8%B8%AA)

Strict最为严格，完全禁止第三方 Cookie，**跨站点时，任何情况下都不会发送 Cookie**。

Lax规则稍稍放宽，大多数情况也是不发送第三方 Cookie，但是导航到目标网址的 **Get 请求除外**。

（1）没有设置SameSite属性的默认SameSite=Lax。

（2）SameSite=None的cookie则必须设置为Secure，即安全链接（https）

一些老的项目中跨域获取cookie的情况（如基于cookie的统一登录）。因为旧项目中不会设置SameSite属性，所以此次更新后，SameSite属性会默认为Lax，这就导致跨域的请求获取不到cookie数据。从而导致统一登录失败。

## 301 302 304

301是永久重定向

302是临时重定向

304走协商缓存

## 浏览器从发出请求到渲染页面经历了哪些过程

1.查找强缓存，如果存在**缓存**，则直接从缓存中拿数据，给浏览器渲染

2.DNS域名解析&#x20;

*   浏览器缓存
*   系统缓存 hosts
*   本地域名服务器 运营商

（上面的步骤属于递归查询，下面的步骤属于迭代查询）

*   根域名解析服务器 在2016年之前全球一共拥有13台根服务器，
*   顶级域名服务器
*   二级域名服务器
*   三

参考：<https://www.cnblogs.com/Galesaur-wcy/p/16783695.html>

3.建立TCP链接：<https://blog.csdn.net/m0_52373742/article/details/120927298>

SYN=1，seq=x；

ack=x+1，ACK=1，seq=y，SYN=1

ack=y+1，ACK=1

4.发送HTTP请求

5.网络响应

6.页面渲染，通过浏览器渲染引擎，输出可视化的图像（html解析器，css解析器，布局引擎，js引擎）

html解析器将html文本解析成DOM树（文档对象模型）

css解析器为DOM的各个元素对象加上样式信息（css对象模型）

布局引擎会将DOM和CSS信息结合起来，计算大小，位置信息等，构建渲染树

js引擎则会解析js代码，并把代码中对dom和css的改动应用到布局中去

## 协商缓存的etag和last-modifed, 二者各自的适用场景

1、Etag和Last-Modified

Last-Modified是通过最后一次修改时间来判断资源是否发生改变

Etag是用过hash内容对比判断是否资源发生改变

2、既然有了Last-Modified为什么要用Etag

Last-Modified以秒为单位，如果不超过1s内不会检测到资源发送改变。

资源走完一个生命周期回到原来的状态，其实内容没发生改变，但会会判断发生改变。

因为Etghash值内容是唯一的，通过对比就很快知道资源是否发送改变。

<https://blog.csdn.net/weixin_50789156/article/details/124475487>

3、etag 是如何生成的?

每个系统的生成原理都有一些不一样

对于静态文件，css，js，图片等，Etag的生成策略是 文件的十六进制+修改时间

对于字符串，buffer等，字符串，buffer的长度的十六进制+hash值

<https://blog.csdn.net/weixin_42989576/article/details/123695991>

*   精确度上，Etag 要优于 Last-Modified。Last-Modified 的时间单位是秒，如果某个文件在 1 秒内被改变多次，那么它们的 Last-Modified 并没有体现出来修改，但是 Etag 每次都会改变，从而确保了精度；此外，如果是负载均衡的服务器，各个服务器生成的 Last-Modified 也有可能不一致。
*   性能上，Etag 要逊于 Last-Modified，毕竟 Last-Modified 只需要记录时间，而 ETag 需要服务器通过消息摘要算法来计算出一个hash 值。
*   优先级上，在资源新鲜度校验时，服务器会优先考虑 Etag。即如果条件请求的请求头同时携带

 If-Modified-Since 和 If-None-Match 字段，则会优先判断资源的 ETag 值是否发生变化。

4、为什么大公司不太愿意用etag?

因为大公司好多是使用web集群或者说**负载均衡**，尽管不同服务器上的内容完全一样，但是由于在不同服务器上，生成的tag也会不同，无法命中协商缓存，浪费带宽

## http/2.0有哪些更新

多路复用

首部压缩

二进制分帧

**请求优先级**

**服务端推送**

1.1：

长连接

**带宽优化**（请求资源某一部分）

虚拟主机host域

缓存字段

错误通知

## 请求头响应头

**http请求头：**

*   **Accept**: text/html,image/\* 浏览器通过这个头，告诉服务器它所支持的数据类型
*   Accept-Charset： 浏览器通过这个头，告诉服务器它采用的字符集
*   Accept-Encoding：浏览器通过这个头，告诉服务器，它所支持的压缩格式
*   transfer-Encoding：gzip：发送的压缩格式
*   Accept-Language：浏览器通过这个头，告诉服务器，它所采用的语言
*   **Host**：浏览器通过这个头，告诉服务器，我想访问服务器哪台主机
*   **Referer**：浏览器通过这个头，告诉服务器，我是从哪个网页点过来的（防盗链）
*   **If-Modified-Since**：浏览器通过这个头，告诉服务器，它缓存数据时间是多少。
*   **User-Agent**: 浏览器通过这个头，告诉服务器，当前浏览器操作系统的信息，以及浏览器的版本号
*   **connection**：keep-alive 长链接

**http响应头：**

*   Location:这个头通常配合302状态码使用，它用于告诉浏览器你去找谁。

*   Server：告诉浏览器，服务器的类型

*   Content-Encoding: 服务器通过这个头，告诉浏览器，回送的数据采用的压缩格式。

*   **Content-Length**: 80

*   Content-Language: zh-cn

*   Content-Type：这个头用于告诉浏览器，回送数据的类型

*   Refresh: ：这个头用于控制浏览器定时刷新

*   Content-Disposition: 用于通知浏览器，以下载方式打开回送的数据

*   Transfer-Encoding: 用于通知浏览器，数据是以分块形式回送的

*   **ETag**: 缓存相头的头

*   **Last-Modified**：这个头用于告诉浏览器，数据的最后修改时间

*   **Expires**: 用于说明网页的失效时间，如果该值为一个<0的值，则服务器是通知浏览器不要缓存

*   **Cache-Control**: no-cache 通知浏览器不要缓存

## TCP和UDP的区别，都会丢包吗？

TCP：面向有连接的，可靠的，速度慢，效率低，只能是一对一通信，面向字节流，适用于需要可靠传输的应用，比如文件传输

UDP：面向无连接的，不可靠，速度快，效率高，支持一对一，一对多，多对一，多对多交互通信，面向报文，适用于实时应用，如视频会议，直播等

# 项目

## umi是怎么实现dynamicImport的

1\. umi使用webpack进行代码切割，**将应用程序代码划分为多个小块**，每个块都是一个**独立**的js文件

2.当应用程序运行时，umi会**根据需要动态加载**这些小块中的代码

3.当umi需要加载一个模块时，它会调用JavaScript的import()函数，并将需要加载的模块路径作为参数传入。

4.浏览器会向服务器发出请求，请求所需的JavaScript模块。

5.服务器返回所需的JavaScript模块，并将其发送回浏览器。

6.浏览器将所需的JavaScript模块加载到内存中，并执行其中的代码。