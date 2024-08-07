---
title: 设计模式面试题
---
# 设计模式原则

## 1. 七大原则简介:

### 1.1 设计模式的目的:

即让书写的程序代码具有更好的

(1) **代码重用性**(即: 相同功能的代码,不用多次编写)

(2) **可读性**(即: 编程规范性,便于其他程序员的阅读和理解)

(3) **可扩展性**(即: 当需要增加新的功能的时候,非常的方便,也称为可维护性)

(4) **可靠性**(即: 当增加新的功能的时候,对原来你的功能没有影响)

(5) 使得程序呈现**高内聚,低耦合**的特性

### 1.2 常见的七大设计原则:

1) 单一职责原则

2) 接口隔离原则

3) 依赖倒转(倒置)原则

4) 里氏替换原则

5) 开闭原则

6) 迪米特原则

7) **合成复用原则**

## 2. 单一职责原则

### 2.1 基本介绍:

对类来说,即一个类应该只负责一项职责.如类A负责两个不同的职责:职责1,职责2.当职责1变更而改变A时,可能会导致职责2执行错误,所以需要将类A的粒度分解为A1,A2.

### 2.2 单一职责原则注意事项和细节:

1) 降低类的复杂度,一个类只负责一项职责

2) 提高类的可读性,可维护性

3) 降低变更引起的风险

4) 通常情况下,我们应当遵守单一职责原则,只有逻辑足够简单,才可以在代码级违反单一职责原则;只有类中方法数量足够少,可以在方法级别中保持单一职责原则.

### 2.3 代码举例:

```java
 public class SingleResponsibility01 {
    public static void main(String[] args) {
        Tool tool = new Tool();
        tool.run("汽车");
        tool.run("轮船");
        tool.run("飞机");
    }

    //汽车在公路上行驶...
    //轮船在公路上行驶...
    //飞机在公路上行驶...
    //破坏了单一职责原则,其中轮船和飞机不能在公路上行驶,需要进行粒度的分离化
}

class Tool {
    public void run(String tool) {
        System.out.println(tool + "在公路上行驶...");
    }
} 

//解决方式1:定义不同的类来实现单一职责原则
//但是会造成空间的浪费
public class SingleResponsibility02 {
    public static void main(String[] args) {
        RoadTool roadTool = new RoadTool();
        roadTool.run("汽车");
        WaterTool waterTool = new WaterTool();
        waterTool.run("轮船");
        AirTool airTool = new AirTool();
        airTool.run("飞机");
    }
}

class RoadTool {
    public void run(String tool) {
        System.out.println(tool + "在公路上行驶...");
    }
}
class WaterTool {
    public void run(String tool) {
        System.out.println(tool + "在水上行驶...");
    }
}
class AirTool {
    public void run(String tool) {
        System.out.println(tool + "在天空上行驶...");
    }
}

//解决方式2:直接定义Tool类,定义不同功能的方法来实现单一职责原则
public class SingleResponsibility03 {
    public static void main(String[] args) {
        Tools tool = new Tool();
        tools.runRoad("汽车");
        tools.runWater("轮船");
        tools.runAir("飞机");
    }
}

class Tool {
    public void runRoad(String tool) {
        System.out.println(tool + "在公路上行驶...");
    }
    public void runWater(String tool) {
        System.out.println(tool + "在水上行驶...");
    }
    public void runAir(String tool) {
        System.out.println(tool + "在天空中行驶...");
    }
}
```

## 3. 接口隔离原则

### 3.1 基本介绍:

客户端不应该依赖它不需要的接口,即**一个类对另一个类的依赖应该建立在最小的接口上**.

### 3.2 举例说明:

现在存在一个接口Interface,以及四个类A,B,C,D,其中类A通过Interface依赖于B,但是A只使用到接口的方法1,方法2,方法3;类C通过Interface依赖于D,但是C只使用到接口的方法4,方法5。如果现在只存在于一个接口Interface，则此时的Interface不是最小的接口。

我们选择将接口Interface拆分为独立的两个接口：Interface1和Interface2,将类A和类B分别于他们需要的接口建立依赖关系。

![](/img/design_pattern/1.png)

## 3. 依赖反转原则

### 3.1 基本介绍:

依赖反转原则是指:

1) 高层模块不应该依赖低层模块,二者都应该依赖其抽象

2) **抽象不应该依赖细节,细节应该依赖抽象**

3) 依赖倒转(倒置)的中心思想是面向接口编程

4) 相对于细节的多变性,抽象的东西要稳定的多。以抽象为基础搭建的架构比以细节为基础的架构要稳定的多。在java中，抽象指的是接口或者抽象类，细节就是指具体的实现类

5）使用接口或者抽象类的目的是为了制定好规范，而不涉及任何具体的操作，把**展现细节的任务交给他们的实现类去完成**

### 3.2 注意事项：

1） 低层模块尽量都要有抽象类或者接口，或者两者都有，程序稳定性更好。

2）变量的**声明类型尽量是抽象类或者接口**，这样我们的变量引用和实际对象间，就存在一个**缓冲层**，有利于程序扩展和优化

3）继承时遵循**里氏替换**原则

## 4. 里氏替换原则

### 4.1 基本介绍：

1）继承包含这样一层含义：父类中凡是已经实现好的方法，实际上是在设定规范和契约，虽然它不强制要求所有的子类必须遵循这些契约，但是如果子类对这些已经实现的方法任意修改，就会对整个体系造成破坏。
2）**继承在给程序设计带来便利的同时，也会带来弊端**。比如使用继承会给程序带来侵入性，程序的可移植性降低，增加对象间的耦合性，如果一个类被其他的类所继承，则当这个类需要进行修改的时候，必须考虑到所有的子类，并且父类修改后，所有涉及到子类的功能都有可能产生故障。

3）我们使用里氏原则进行处理这种继承带来的弊端

**里氏原则即使得所有引用基类（父类）的地方必须能透明地使用其子类的对象**

在使用继承时，在**子类中尽量不要重写父类的方法**

里氏替换原则告诉我们：继承实际上将两个类的耦合性进行增强了，我们在适当的情况下，可以通过聚合，组合，依赖来解决问题

- 子类必须实现父类的抽象方法，但不得重写（覆盖）父类的非抽象（已实现）方法。
- 子类中可以增加自己特有的方法。
- 当子类覆盖或实现父类的方法时，方法的前置条件（即方法的形参）要比父类方法的输入参数更宽松。
- 当子类的方法实现父类的抽象方法时，方法的后置条件（即方法的返回值）要比父类更严格。

## 5. 开闭原则

### 5.1 基本介绍：

1）开闭原则是编程中最基础，最重要的设计原则

2）一个软件实体类，模块和函数应该对扩展开放（即对提供方），对修改关闭（即对使用方）。用抽象构建框架，用实体扩展细节。

3）当软件需要变化时，尽量通过**扩展软件实体的行为**来实现变化，而不是通过**修改已有的代码**来实现变化。

## 6. 迪米特原则

### 6.1 基本介绍：

1）一个对象应该对其他对象保持最少的了解

2）类与类的关系越密切，耦合度越大

3）迪米特法则又叫**最少知道原则**，即一个类对**自己依赖的类知道的越少越好**。也就是说，对于被依赖的类不管多么的复杂，都尽量将逻辑封装在类的内部。对外除了提供的public方法，不对外泄露任何信息

### 6.2 注意事项：

1）迪米特原则的核心是降低类之间的耦合

2） 但是注意: 由于每一个类都减少不必要的依赖,因此迪米特法则只是要求降低类间(对象间)的耦合关系,并不是要求完全没有依赖关系。

## 7. 合成复用原则

### 7.1 基本介绍：

1）找到应用中可能需要变化的地方，把它们独立出来，不要和那些不需要变化的代码混在一起

2）针对接口编程，而不是针对实现编程

3）为了交互对象之间的**松耦合设计**而努力

# 设计模式

## 序言

设计模式主要分为**结构性模式(Structural Pattern)**和**行为型模式**

### 结构性模式

结构型模式（Structural Pattern）描述如何将类或者对象结合在一起形成更大的结构，就像搭积木， 可以通过简单积木的组合形成复杂的、功能更为强大的结构。结构型模式可以分为**类结构型模式和对象结构型模式**

主要有以下七类结构型设计模式:

|        结构型设计模式         |
| :---------------------------: |
|    代理模式(Proxy Pattern)    |
|  适配器模式(Adapter Pattern)  |
|   桥接模式(Bridge Pattern)    |
| 装饰者模式(Decorator Pattern) |
|   外观模式(Facade Pattern)    |
|  享元模式(FlyWeight Pattern)  |
|  组合模式(Composite Pattern)  |

### 行为型模式

行为型模式用于描述程序在运行时复杂的流程控制，即**描述多个类或对象之间怎样相互协作共同完成单个对象都无法单独完成的任务**，它涉及算法与对象间职责的分配

行为型模式分为**类行为模式和对象行为模式**，前者采用继承机制来在类间分派行为，后者采用组合或聚合在对象间分配行为。由于组合关系或聚合关系比继承关系耦合度低，满足“合成复用原则”，所以对象行为模式比类行为模式具有更大的灵活性。

主要有以下11种行为型设计模式

|            行为型设计模式            |
| :----------------------------------: |
|  模板方法设计模式( Template Method)  |
|      策略模式(Strategy Pattern)      |
|      命令模式(Command Pattern)       |
| 职责链模式( Chain of Responsibility) |
|       状态模式(State Pattern)        |
|     观察者模式(Observer Pattern)     |
|    中介者模式( Mediator Pattern)     |
|     迭代器模式(Iterator Pattern)     |
|     访问者模式(Visitor Pattern)      |
|     备忘录模式(Memento Pattern)      |
|    解释器模式(Interpreter Pattern    |

## 1. 生产者消费者模式(Producer-Consumer Pattern)

### 1.1 生产者-消费者模式介绍

生产者消费者模型具体来讲，就是在一个系统中，存在生产者和消费者两种角色，他们通过**内存缓冲区**进行通信.而这个内存缓冲区就相当于一个容器,从而解决了生产者和消费者的**强耦合问题.**这样的话,生产者和消费者彼此之间不用直接进行通讯,而是通过**阻塞队列**(即内存缓冲区的一种实现方式)来进行通讯,所以生产者生产完数据以后不用等待消费者处理,直接扔给了阻塞队列,消费者也不直接找生产者要数据,而是直接从阻塞队列中取数据,阻塞队列就平衡了生产者和消费者的处理能力.**这个阻塞队列就是用来给生产者和消费者解耦的**.

![](/img/design_pattern/生产者消费者模式原型图.jpg)

### 1.2 为什么要使用生产者-消费者模式呢?

**在线程世界里，生产者就是生产数据的线程，消费者就是消费数据的线程**。在多线程开发当中，如果生产者处理速度很快，而消费者处理速度很慢，那么生产者就必须等待消费者处理完，才能继续生产数据。同样的道理，如果消费者的处理能力大于生产者，那么消费者就必须等待生产者。**为了解决这种生产消费能力不均衡的问题，所以便有了生产者和消费者模式**。

### 1.3 生产者-消费者模式的具体实现

生产者是一堆线程，消费者是另一堆线程，内存缓冲区可以使用**集合/数组/队列**，数据类型只需要定义一个简单的类就好。

关键是**如何处理多线程之间的协作**。在这个模型中，最关键就是**内存缓冲区为空的时候消费者必须等待，而内存缓冲区满的时候，生产者必须等待**（java中使用wait()和notifyAll()来实现通知与等待).其他时候可以是个动态平衡。值得注意的是多线程对临界区资源的操作时候必须保证在读写中只能存在一个线程，所以需要设计锁的策略。

#### java实现方式1 : 使用wait/notify 

```java
public class ProducerAndConsumer {

	// 作为synchronized的对象监视器
	private static Object lock = new Object();
	// 随机数
	private static Random random = new Random();
	//定义生产者类
	static class Producer implements Runnable {

		private Queue queue;
		
		public Producer(Queue queue) {
			this.queue = queue;
		}
		
		@Override
		public void run() {
			while(true) {
				synchronized(lock) {
					try {
						Thread.sleep(500);
						
						// 超过规定的队列长度，停止生产
						if(queue.size() >= 10) {
							lock.wait();
						}
						
						// 生产
						int i = random.nextInt(100);
						queue.add(i);
						System.out.println(Thread.currentThread().getName() + "已生产：" + i);
						
						// 生产完后队列不为空，唤醒消费者
						lock.notify();
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
				}
			}
		}
	}
    
	//定义消费者类
	static class Consumer implements Runnable {

		private Queue queue;
		
		public Consumer(Queue queue) {
			this.queue = queue;
		}
		
		@Override
		public void run() {
			while(true) {
				synchronized(lock) {
					try {
						Thread.sleep(600);
						
						// 如果队列为空，则让消费者进入等待状态
						if(queue.isEmpty()) {
							lock.wait();
						}
						
						// 消费
						System.out.println(Thread.currentThread().getName() + "已消费：" + queue.poll());
						
						// 消费完后，唤醒生产者
						lock.notify();
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
				}
			}
		}
	}
	
    //测试main()函数
	public static void main(String[] args) {
		// 队列
		Queue queue = new LinkedList();
		
		new Thread(new Producer(queue), "生产者1号").start();
		new Thread(new Producer(queue), "生产者2号").start();
		new Thread(new Consumer(queue), "消费者1号").start();
		new Thread(new Consumer(queue), "消费者2号").start();
	}
}
```

#### java实现方式2 : 使用阻塞队列 

阻塞队列的特点：

- 当队列元素已满的时候，阻塞插入操作
- 当队列元素为空的时候，阻塞获取操作

`ArrayBlockingQueue`与`LinkedBlockingQueue`都是支持FIFO(先进先出),ArrayBlockingQueue 是有界的，而 LinkedBlockingQueue 是无界的

```java
public class ProducerAndConsumer02 {

	// 随机数
	private static Random random = new Random();
	//生产者
	static class Producer implements Runnable {

		private BlockingQueue queue;
		
		public Producer(BlockingQueue queue) {
			this.queue = queue;
		}
		
		@Override
		public void run() {
			while(true) {
				try {
					Thread.sleep(500);
					
					// 生产
					int i = random.nextInt(100);
					queue.put(i);
					System.out.println(Thread.currentThread().getName() + "已生产：" + i);
					
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			}
		}
	}
	//消费者
	static class Consumer implements Runnable {

		private BlockingQueue queue;
		
		public Consumer(BlockingQueue queue) {
			this.queue = queue;
		}
		
		@Override
		public void run() {
			while(true) {
				try {
					Thread.sleep(600);
					
					// 消费
					System.out.println(Thread.currentThread().getName() + "已消费：" + queue.take());
				
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			}
		}
	}
	
	public static void main(String[] args) {
		// 队列
		BlockingQueue queue = new ArrayBlockingQueue(10);
		
		new Thread(new Producer(queue), "生产者1号").start();
		new Thread(new Producer(queue), "生产者2号").start();
		new Thread(new Consumer(queue), "消费者1号").start();
		new Thread(new Consumer(queue), "消费者2号").start();
	}
}
```

### 1.4 生产者-消费者优点

* 解耦
* 支持并发
* 支持忙闲不均


## 2. 享元模式(Flyweight Pattern)

### 2.1 享元模式介绍

享元模式是运用共享技术**有效地支持大量细粒度对象的复用**.系统只使用少量的对象,而这些对象又很相似,状态变化比较很小,故我们可以实现对象的多次复用.

通俗来讲,存在很多类,它们可能会对应创建很多对象,但是这些不同类的对象之间中有很多属性都是重复的,从而造成了大量的内存浪费,我们使用享元模式就可以解决这种对象的浪费问题.

即享元模式使用了一个工厂类,在工厂类中为每一种类型的创建一个对象,而且每一种类型的对象只有一个.

当我们需要某种类型的对象的时候,工厂就会将已经创建好的对象给我们.因为不会再创建新的对象了,故节省了内存.

### 2.2 享元模式的外部状态和内部状态

* 内部状态表示在享元对象中不会随着环境变化而变化的共享属性
* 外部状态即是随着环境变化而变化,不可以共享的状态

### 2.3 何时使用享元模式?

享元模式可以避免大量非常相似的对象的开销。

在程序设计中，如果发现需要**大量细粒度的类对象来表示数据**，而且**这些类除了几个参数不同以外，其他的属性都是相同的，这时候就可以使用享元模式**。类中相同的属性可以通过工厂类来共享，这些属性就是享元类的内部状态；而那些会变化的属性放在新建的外部对象中，作为参数传递给享元类的函数。

### 2.4 享元模式的优点

* 享元模式通过共享对象的方式,把所有对象的公共属性存放到同一个对象中,不同属性则存放到外部类中,从而起到了节省空间的作用

### 2.5 享元模式的案例实现

首先我们需要实现享元模式,需要几个必备的角色:

* FlyWeight : 享元接口,通过这个接口传入外部状态并作用于外部状态
* ConcreteFlyWeight : 具体的享元实现对象,必须是可共享的,需要封装享元对象的内部状态
* UnsharedConcreteFlyWeight : 非共享的享元实现对象,并不是所有的享元对象都可以进行共享,非共享的享元对象通常是享元对象的组合对象
* FlyWeightFactory : 享元工厂,主要是用来创建并管理享元对象,并对外提供访问共享享元接口的.

![](/img/design_pattern/享元模式结构图.png)

首先我们定义一个FlyWeight抽象类 : 即所有的享元类的超类或者接口,通过这个接口,FlyWeight可以接受并作用于外部状态

```java
public abstract class FlyWeight {
    //定义内部状态
    public String intrinsic;
    //定义外部状态
    protected final String extrinsic;

    //所有的享元角色必须接受外部状态
    public FlyWeight(String extrinsic) {
        this.extrinsic = extrinsic;
    }

    //定义业务操作
    public abstract void operator(String extrinsic);

    public String getIntrinsic() {
        return intrinsic;
    }

    public void setIntrinsic(String intrinsic) {
        this.intrinsic = intrinsic;
    }
}
```

然后我们分别定义ConcreteFlyWeight和UnsharedConcreteFlyWeight

```java
//继承Flyweight超类或实现Flyweight接口，并为其内部状态增加存储空间
public class ConcreteFlyweight extends FlyWeight{

    //接受外部状态
    public ConcreteFlyweight(String extrinsic) {
        super(extrinsic);
    }


    //根据外部状态进行对应的逻辑操作
    @Override
    public void operator(String extrinsic) {
        System.out.println("具体FlyWeight" + extrinsic);

    }
}
```

```java
//不需要共享的Flyweight子类
public class UnsharedConcreteFlyweight extends FlyWeight{

    public UnsharedConcreteFlyweight(String extrinsic) {
        super(extrinsic);
    }

    @Override
    public void operator(String extrinsic) {
        System.out.println("不共享的具体FlyWeight" + extrinsic);
    }
}
```

接着,我们定义FlyWeightFactory类:

```java
//当用户请求一个Flyweight时，FlyweightFactory对象提供一个已创建的实例或创建一个实例
public class FlyweightFactory {
    //定义一个享元类的池子
    private static HashMap<String,FlyWeight> pool = new HashMap<>();

    //定义获取享元类的享元工厂方法 : 传入参数(外部状态属性)
    public static FlyWeight getFlyWeight(String extrinsic) {
        FlyWeight flyWeight = null;
        if (pool.containsKey(extrinsic)) {
            flyWeight = pool.get(extrinsic);
            System.out.println(">>>共享享元类池中已存在外部状态为" + extrinsic + "的享元类,直接从享元类池中获取>>>");
        }else {
            //pool池中不存在
            flyWeight = new ConcreteFlyweight(extrinsic);
            System.out.println(">>>享元池中不存在,创建外部状态为" + extrinsic + "的享元类>>>");
            //TODO  这里也可以将当前创建的外部状态的新的享元类放入pool池中
            pool.put(extrinsic,flyWeight);
        }
        return flyWeight;
    }
}
```

最后,我们定义Client类:

```java
//定义一个客户端: 进行享元模式的测试
public class Client {
    public static void main(String[] args) {
        FlyWeight flyWeightA = FlyweightFactory.getFlyWeight("A");
        flyWeightA.operator("A");
        System.out.println("--------------------------------------------");
        FlyWeight flyWeightB = FlyweightFactory.getFlyWeight("B");
        flyWeightA.operator("B");
        System.out.println("--------------------------------------------");
        FlyWeight flyWeightC = FlyweightFactory.getFlyWeight("A");
        flyWeightA.operator("A");
        System.out.println("--------------------------------------------");
        UnsharedConcreteFlyweight unsharedConcreteFlyweight = new UnsharedConcreteFlyweight("D");
        unsharedConcreteFlyweight.operator("D");
    }
}

测试结果如下所示:
>>>享元池中不存在,创建外部状态为A的享元类>>>
具体FlyWeightA
--------------------------------------------
>>>享元池中不存在,创建外部状态为B的享元类>>>
具体FlyWeightB
--------------------------------------------
>>>共享享元类池中已存在外部状态为A的享元类,直接从享元类池中获取>>>
具体FlyWeightA
--------------------------------------------
不共享的具体FlyWeightD
```

## 3. 职责链模式/责任链模式(Chain of Responsibility Pattern)

### 3.1 责任链模式介绍

责任链模式的目标是使得有多个对象都有机会处理请求,从而避免请求的发送者和接受者之间的耦合关系.将这些对象练成一条链,并沿着这条链请求,直到有一个对象处理它为止

![](/img/design_pattern/责任链模式.gif)

这样实现了请求的发送者和接收者的解耦合,同时我们的链(一系列节点的集合),可以灵活拆分,也可以进行再添加,再分组.

### 3.2 责任链模式代码实现

我们使用责任链模式模拟在疫情期间,学生外出,向学院领导请假审批的流程:

思路: 

* 我们首先需要定义一个请假信息的封装类(里面包含了请假人的名字,以及请假的时间(这里我们主要分为3天和3天以上))
* 然后定义请假审批人(辅导员和学院主任),如果请假天数小于等于3天,则需要辅导员进行审批,超过三天,则需要学院主任进行审批,如果超过两个星期(14天),则不予通过请假

**请假信息封装类LeaveRequest :**

```java
//请假信息类
public class LeaveRequest {
    private String stu_name;
    private int leave_day;

    public LeaveRequest(String stu_name, int leave_day) {
        this.stu_name = stu_name;
        this.leave_day = leave_day;
    }

    public String getStu_name() {
        return stu_name;
    }

    public void setStu_name(String stu_name) {
        this.stu_name = stu_name;
    }

    public int getLeave_day() {
        return leave_day;
    }

    public void setLeave_day(int leave_day) {
        this.leave_day = leave_day;
    }
}
```

**定义一个抽象类(Leader):**

```java
//向上抽取的领导抽象类
public abstract class Leader {
    //领导名字
    private String leader_name;
    //责任链后续的节点
    private Leader nextLeader;

    public Leader(String leader_name) {
        this.leader_name = leader_name;
    }

    public Leader(Leader nextLeader) {
        this.nextLeader = nextLeader;
    }
    
    //处理请假请求的方法
    public abstract void handleRuquest(LeaveRequest leaveRequest);
}
```

**分别定义辅导员类和学院主任类:**

```java
//辅导员类
public class Counselor extends Leader{


    public Counselor(String leader_name) {
        super(leader_name);
    }

    @Override
    public void handleRuquest(LeaveRequest leaveRequest) {
        if (leaveRequest.getLeave_day() <= 3) {
            System.out.println("辅导员" + this.leader_name + "同意");
            System.out.println("允许" + leaveRequest.getStu_name() + "同学请假" + leaveRequest.getLeave_day() + "天,请按时回校");
        }else if (this.nextLeader != null) {
            //传递给上层领导处理
            this.nextLeader.handleRuquest(leaveRequest);
        }else {
            System.out.println("请假失败");
        }
    }
}


//学院主任类
//学院主任类
public class College_Director extends Leader{
    public College_Director(String leader_name) {
        super(leader_name);
    }

    @Override
    public void handleRuquest(LeaveRequest leaveRequest) {
        if (leaveRequest.getLeave_day() < 15) {
            System.out.println("学院主任" + this.leader_name + "同意");
            System.out.println("允许" + leaveRequest.getStu_name() + "同学请假" + leaveRequest.getLeave_day() + "天,请按时回校");
        }else {
            System.out.println(leaveRequest.getStu_name() + "的请假时间" + "(" + leaveRequest.getLeave_day() + ")"  + "天不符合请假的最长时间规定,不予通过!");
        }
    }
}
```

**测试代码:**

```java
public class Test {
    public static void main(String[] args) {
        LeaveRequest tmx_request = new LeaveRequest("tmx",3);
        LeaveRequest feng_request = new LeaveRequest("fb",30);
        Leader counselor = new Counselor("杨晓丹");
        Leader director = new College_Director("办公室主任");
        counselor.nextLeader = director;
        counselor.handleRuquest(tmx_request);
        System.out.println("===============================");
        counselor.handleRuquest(feng_request);
    }
}

测试结果:
辅导员杨晓丹同意
允许tmx同学请假3天,请按时回校
===============================
fb的请假时间(30)天不符合请假的最长时间规定,不予通过!
```

## 4. 中介者模式(Mediator Pattern)

### 4.1 中介者模式介绍

中介者模式是用来**降低多个对象和类之间的通信的复杂性**.

这种模式通常会定义一个中介类: 该类处理不同类的通信,并支持解耦合,使得代码易于维护.中介者模式属于**行为型模式**.

**中介者模式设计的目的:**

* 使用一个中介对象来封装一系列的对象交互,中介者使得各个对象不需要显式地相互引用,从而使得其耦合度低,而且可以独立地改变它们之间的交互

### 4.2 中介者模式的优点

* 降低了类之前的复杂度,将一对多转化为了一对一
* 各个类之间的解耦
* 符合**迪米特原则**

### 4.3 中介者模式的缺点

* 中介者会比较庞大,变得越来越复杂,难以维护

### 4.4 中介者模式案例实现

去年和今年由于新冠疫情的发生,导致了很多公司实现了家里办公,那么此时每个部分的经理需要将每一天的工作任务交给该部分的每一个员工,此时就存在了一对多的场景,我们使用中介者模式实现了经理和员工的工作任务消息的传递的解耦.

**用户类(User):**

```java
public class User {
    //共有的属性
   private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User(String name) {
        this.name = name;
    }
}
```

**Manager类:**

```java
public class Manager extends User{

    public Manager(String name) {
        super(name);
    }

    //使用中介者类向员工发送工作任务信息
    public void sendMessage(Employee employee, String message) {
        CompanyGroup.showMessage(this,employee,message);
    }
}
```

**Employee类:**

```java
public class Employee extends User{

    public Employee(String name) {
        super(name);
    }
}
```

**中介者类:**

```java
public class CompanyGroup {

    public static void showMessage(Manager manager, Employee employee,String message) {
        System.out.println(new Date().toString() + " [" + manager.getName() + "]: " + "[" + employee.getName() + "]" + " " + message);
    }

}
```

**测试中介者发送信息:**

```java
public class Test {
    public static void main(String[] args) {
        Manager manager = new Manager("部门经理");
        Employee pig = new Employee("大猪头");
        Employee princess = new Employee("小公主");
        manager.sendMessage(pig,"java后端任务");
        manager.sendMessage(princess,"js前端任务");
    }
}

测试结果:
Mon Apr 05 14:24:53 CST 2021 [部门经理]: [大猪头] java后端任务
Mon Apr 05 14:24:53 CST 2021 [部门经理]: [小公主] js前端任务
```

## 5. 装饰者模式(Decorator Pattern)

### 5.1 装饰者模式介绍

装饰者模式是一种**结构型模式**,原理是创建一个**装饰类**,用来包装原有的类,在保持类的完整性的前提下,提供额外的功能.

### 5.2 装饰者模式优缺点

#### 优点

* 装饰者类和被装饰者类可以独立分开发展,实现了**解耦合**
* 装饰者模式是继承的一个替代模式,比继承更加地灵活.
* 装饰者模式可以动态扩展一个实现类的功能,在运行时选择不同的装饰器，从而实现不同的行为。

#### 缺点

* 如果存在多层装饰,将比较地复杂
* 会产生很多的小的对象,增加了系统的复杂性

### 5.3 装饰者模式和代理模式的区别

* 装饰者和被装饰者都实现同一个接口; 代理类和目标类也都实现同一个接口
* 代理模式在目标类的方法之前和之后,对方法进行增强,隐藏了真实性; 装饰者模式是不改变原有的功能来对被装饰者进行增强,可以独立地不断地进行增强
* 使用的场景不同,实现**多级缓存**可以使用装饰者,使用AOP(面向切面编程)可以使用代理模式

### 5.4 装饰者模式代码实现

#### java代码装饰者实现一级缓存/二级缓存:

**ICache接口:**

```java
public interface Ichache {
    //声明一个获取缓存的方法
    public Object getCache(String key);
}
```

**创建一级缓存OneLevelCache:**

```java
//定义一个一级缓存类
public class OneLevelCache  implements Ichache{

    //保存一级缓存的map
    Map<String,Object>  OneLevelCacheMap = new HashMap<>();

    @Override
    //实现接口的获取缓存的方法
    public Object getCache(String key) {
        //1. 查询一级缓存
        System.out.println(">>查询一级缓存>>");
        //2. 获取一级缓存
        Object value = OneLevelCacheMap.get(key);
        //3. 判断一级缓存是否存在
        if (value == null) {
            //一级缓存为空
            System.out.println("一级缓存未找到key: " + key);
            //此时尝试去数据库中获取
            System.out.println(">>查询数据库>>");
            System.out.println(">>放入到一级缓存中>>");
            //这里我们手动实现
            OneLevelCacheMap.put("tmx","你是我的小公主");
        }
        //此时我们获取到对应key的value值
        return OneLevelCacheMap.get(key);
    }
}
```

**创建装饰者抽象接口 AbstractDecorator: **

```java
public abstract class AbstractDecorator implements Ichache{

    //引入一级缓存
    public OneLevelCache oneLevelCache;

    //构造器初始化一级缓存
    public AbstractDecorator(OneLevelCache oneLevelCache) {
        this.oneLevelCache = oneLevelCache;
    }

    @Override
    public Object getCache(String key) {
        return oneLevelCache.getCache(key);
    }
}
```

**创建二级缓存类TwoLevelCache继承装饰类接口**

```java
public class TwoLevelCache extends AbstractDecorator{

    //定义二级缓存集合
    Map<String,Object>  TwoLevelCacheMap = new HashMap<>(32);

    public TwoLevelCache(OneLevelCache oneLevelCache) {
        super(oneLevelCache);
    }

    @Override
    public Object getCache(String key) {
        //1.获取二级缓存
        System.out.println(">>查询二级缓存>>");
        Object twoValue = TwoLevelCacheMap.get(key);
        //2.判断二级缓存是否存在
        if (twoValue == null) {
            //3.此时二级缓存没有,去一级缓存中找
            System.out.println("二级缓存未找到key: " + key);
            Object oneCache = super.getCache(key);
            if (oneCache != null) {
                //4.将一级缓存放到一级缓存中
                TwoLevelCacheMap.put(key,oneCache);
                twoValue = oneCache;
            }
        }
        return twoValue;
    }
}
```

**测试一级/二级缓存功能:**

```java
public static void main(String[] args) {
        //1.创建二级缓存类
        AbstractDecorator twoLevelCache = new TwoLevelCache(new OneLevelCache());
        //2.从二级缓存中获取指定key
        System.out.println("查询结果: " + twoLevelCache.getCache("tmx"));
        System.out.println("==============================================");
        System.out.println("查询结果: " + twoLevelCache.getCache("tmx"));
    }

//测试结果如下所示
>>查询二级缓存>>
二级缓存未找到key: tmx
>>查询一级缓存>>
一级缓存未找到key: tmx
>>查询数据库>>
>>放入到一级缓存中>>
查询结果: 你是我的小公主
==============================================
>>查询二级缓存>>
查询结果: 你是我的小公主
```

### 5.5 装饰者模式设计原则----开放-关闭原则

装饰者添加新功能，比如添加一个调料，开放就是添加一个新功能，关闭就是添加一个新功能时，对原有的代码不轻易改变。也就是说在设计一个项目体系结构的时候，对添加新功能，新代码是开放的，对已经设计好的，或者测试好的代码是不允许修改的

## 6. 状态模式(State Pattern)

### 6.1 状态模式介绍

状态模式是指有状态的对象,把复杂的"判断逻辑"抽取到不同的状态对象中,允许状态对象在其内部状态发生改变时改变其行为.

状态模式是一种**对象行为型模式**

### 6.2 状态模式的优缺点

#### 优点

* 结构清晰，状态模式将与特定状态相关的行为局部化到一个状态中，并且将不同状态的行为分割开来，满足“单一职责原则”
* 将状态转换显示化，减少对象间的相互依赖。将不同的状态引入独立的对象中会使得状态转换变得更加明确，且减少对象间的相互依赖
* 状态类职责明确，有利于程序的扩展。通过定义新的子类很容易地增加新的状态和转换

#### 缺点

* 状态模式的使用必然会增加系统的类与对象的个数
* 状态模式的结构与实现都较为复杂，如果使用不当会导致程序结构和代码的混乱
* 状态模式对开闭原则的支持并不太好，对于可以切换状态的状态模式，增加新的状态类需要修改那些负责状态转换的源码，否则无法切换到新增状态，而且修改某个状态类的行为也需要修改对应类的源码

### 6.3 状态模式的结构

状态模式主要分为以下主要角色:

* **环境类(Context)角色** : 也称为上下文,它定义了客户端需要的接口,内部维持一个当前状态,并负责具体状态的切换
* **抽象状态(State)角色** : 定义一个接口,用来封装环境对象中的特定状态以及其所对应的行为,可以有一个或者多个行为
* **具体状态(Concrete State)角色** : 实现抽象状态所对应的行为,并且在需要的情况下进行状态的切换

![](/img/design_pattern/状态模式结构图.gif)



### 6.4 状态模式代码实现

**上下文Context类:**

```java
//环境类
public class Context {
    private State state;

    //定义环境类的初始状态
    public Context() {
        this.state = new StateA();
    }

    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }

    //对请求进行处理
    public void handle() {
        state.handle(this);
    }
}
```

**抽象状态类(State):**

```java
public abstract class State {
    //处理上下文的,改变状态的行为
    public abstract void handle(Context context);
}
```

**具体的状态(这里有两种: StateA,StateB):**

```java
public class StateA extends State{
    @Override
    public void handle(Context context) {
        System.out.println("当前状态为A");
        context.setState(new StateB());
    }
}


public class StateB extends State{
    @Override
    public void handle(Context context) {
        System.out.println("当前状态为B");
        context.setState(new StateA());
    }
}
```

**测试代码:**

```java
public class Test {
    public static void main(String[] args) {
        Context context = new Context();
        System.out.print("第一次处理:" );
        context.handle();
        System.out.print("第二次处理:" );
        context.handle();
        System.out.print("第三次处理:" );
        context.handle();
        System.out.print("第四次处理:" );
        context.handle();
    }
}

测试结果:
第一次处理:当前状态为A
第二次处理:当前状态为B
第三次处理:当前状态为A
第四次处理:当前状态为B
```

## 7.适配者模式(Adapter Pattern)

### 7.1 适配者模式介绍:

适配器模式（Adapter Pattern）是作为**两个不兼容的接口之间的桥梁**。什么是适配器？我们手机充电是5V，而插座是220V怎么办，用充电插头转换呗，充电插头就是适配器，那么现在2个接口分别是代入手机充电口和插座口，适配器模式就是代表插头的中间件,也就是我们生活中的转换头,装换器.

### 7.2 适配者模式优缺点

#### 优点

* 可以让任何两个没有关系的类一起运行
* 提高了类的复用性
* 增加了类的透明性
* 灵活性好

#### 缺点

* 过多地使用适配者模式,将会使得系统非常凌乱

### 7.3 配置者模式案例实现

我们通常**适配者模式**需要三个接口/类:

* **Target(目标抽象类)** : 目标抽象类定义我们最后需要的接口,可以是一个接口,或者是一个抽象类,当然也可以是一个具体的类
* **Adaptee(适配者类)** : 适配者即要被适配的角色,它定义了已存在的接口,即我们需要将该接口通过我们的适配器适配目标抽象类/接口.
* **Adapter(适配器)** : 适配器可以调用另一个接口,作为一个转换器,对我们的适配者类和目标类进行适配,故这里的适配器类是我们整个适配器模式的核心.

注意 : 我们从适配者模式结构图可以看到我们的适配器(Adapter)和适配者(Adaptee)是存在一种关联的:

* **继承关系 : 类适配器模式**
* **组合关系 : 对象适配器模式** 

我们鉴于类适配器模式和对象适配模式进行适配器模式的实现.

#### 类适配器模式

**适配者模式 : Adaptee类**

```java
public class Adaptee {
    public void specificRequest(){
        System.out.println("需要被适配的方法");
    }
}
```

**适配的目标接口: Target**

```java
public interface Target {
    public void request();
}
```

**适配器类 : Adapter类[这里我们继承适配者],同时需要实现目标接口**

```java
public class Adapter extends Adaptee implements Target{
    
    //Target的request()方法
    @Override
    public void request() {
        //在这里调用specificRequest()
        specificRequest();
    }

    //Adaptee的specificRequest()
    @Override
    public void specificRequest() {
        super.specificRequest();
        System.out.println("其他操作...");
    }
}
```

**测试代码:**

```java
public class Test {
    public static void main(String[] args) {
        Adapter adapter = new Adapter();
        adapter.request();
    }
}

//我们通过适配器,在使得目标接口可以使用适配者的需要被适配的方法
测试结果:
需要被适配的方法
其他操作...
```

#### 对象适配者模式

这里主要我们的适配器类的实现进行调整,**这里和适配者是组合的关系,而非继承的关系**

```java
public class Adapter implements Target {
    //引入适配者
    private Adaptee adaptee = new Adaptee();

    @Override
    public void request() {
        adaptee.specificRequest();
        System.out.println("其他操作...");
    }
}
```

测试代码:

```java
public class Test {
    public static void main(String[] args) {
        Adapter adapter = new Adapter();
        adapter.request();
    }
}

测试结果:
需要被适配的方法
其他操作...
```

## 8. 单例模式(Singleton Pattern)

### 8.1 什么是单例模式？

保证一个类仅有一个实例，并提供一个访问它的全局访问点

注意 : 该单例必须由单例类自行创建!!!  

### 8.2 单例模式的类型？

- `懒汉式`：在真正需要使用对象时才去创建该单例类对象
- `饿汉式`：在类加载时已经创建好该单例对象，等待被程序使用

#### 懒汉式和饿汉式的优缺点

* 懒汉式在需要使用时才会去创建对象,比较节省内存空间,但是是线程不安全的,需要进行加锁处理
* 饿汉式刚开始即创建好对象,获取速度快,但是占用内存空间,如果这些对象没被获取使用,就造成了内存的浪费

### 8.3 如何保证只创建一个对象？

- `懒汉式`：在程序使用对象前，先判断该对象是否已经实例化（判空），若已实例化直接返回该类对象；否则则先执行实例化操作
- `饿汉式`：在`类加载`时已经创建好该对象，在程序调用时直接返回该单例对象即可，即我们在编码时就已经指明了要马上创建这个对象，不需要等到被调用时再去创建

### 8.4 单例模式的应用

* **线程池**，**全局缓存**，**浏览器中的window对象**，**js开发中的登录弹窗**

### 8.5 单例模式的代码实现

#### 懒汉式单例

```java
//懒汉式单例
public class LazySingleton {
    //保持instance在所有线程中是同步的
    private static volatile LazySingleton instance = null;

    private LazySingleton() {
        //将构造方法私有化,避免外部进行实例化
    }
    
    public static synchronized LazySingleton getInstance() {
        if (instance == null) {
            instance = new LazySingleton();
        }
        return instance;
    }
}
```

#### 饿汉式单例

```java
//饿汉式单例
public class HungarySingleton {
    private static final HungarySingleton instance = new HungarySingleton();
    
    //私有化构造方法
    private HungarySingleton() {}
    
    public static HungarySingleton getInstance() {
        return instance;
    }
}

```

## 9. 策略模式(Strategy Pattern)

### 9.1 什么是策略模式？

定义一系列算法，把它们一个个封装起来，并且使他们可以相互替换,，且算法的变化不会影响使用算法的客户.

### 9.2 策略模式的优点

* 多重条件语句不易维护，而使用策略模式可以避免使用多重条件语句，如 if...else 语句、switch...case 语句
* 策略模式提供了一系列的可供重用的算法族，恰当使用继承可以把算法族的公共代码转移到父类里面，从而避免重复的代码
* 策略模式可以提供相同行为的不同实现，客户可以根据不同时间或空间要求选择不同的
* 策略模式提供了对**开闭原则**的完美支持，可以在不修改原代码的情况下，灵活增加新算法
* 策略模式把算法的使用放到环境类中，而算法的实现移到具体策略类中，实现了二者的分离

### 9.3 策略模式的缺点

* 客户端必须理解所有策略算法的区别，以便适时选择恰当的算法类
* 策略模式造成很多的策略类，增加维护难度

### 9.4 策略模式怎么实现

至少由2部分组成

1. 环境类Context: Context接收客户的请求，随后把请求委托给某一个策略类
2. 策略类: 策略类封装了具体具体的算法，并负责具体的计算过程
3. 我们这里定义了一个抽象策略类(Strategy)和具体策略类(Concrete Strategy)

![](/img/design_pattern/策略模式结构图.gif)

#### 具体实现代码:

**策略类(Strategy)** : 定义了一个公共接口，各种不同的算法以不同的方式实现这个接口，环境角色使用这个接口调用不同的算法，一般使用接口或抽象类实现

```java
public interface Strategy {
    //定义策略方法
    public void strategyMethod();
}
```

**具体策略类(Concrete Strategy):**

```java
public class Strategy_A implements Strategy{
    @Override
    public void strategyMethod() {
        System.out.println("具体策略A的策略方法被访问!");
    }
}

public class Strategy_B implements Strategy{
    @Override
    public void strategyMethod() {
        System.out.println("具体策略B的策略方法被访问!");
    }
}
```

**环境类(Context) : 即我们的上下文**

```java
public class Context {
    private Strategy strategy;

    public Strategy getStrategy() {
        return strategy;
    }

    public void setStrategy(Strategy strategy) {
        this.strategy = strategy;
    }

    //执行指定策略的策略方法
    public void strategyMethod() {
        strategy.strategyMethod();
    }
}
```

**测试代码:**

```java
public class Test {
    public static void main(String[] args) {
        Strategy strategyA = new Strategy_A();
        Strategy strategyB = new Strategy_B();

        Context context = new Context();
        context.setStrategy(strategyA);
        context.strategyMethod();
        System.out.println("-----------------------");
        context.setStrategy(strategyB);
        context.strategyMethod();
    }
}

测试结果:
具体策略A的策略方法被访问!
-----------------------
具体策略B的策略方法被访问!
```

## 10. 代理模式(Proxy Pattern)

### 10.1 什么是代理模式？

为一个对象提供一个代用品或占位符，以便控制对他的访问。（当客户不方便直接访问一个对象或者不满足需要的时候，提供一个替身对象来控制对这个对象的访问，客户实际上访问的是替身对象）

### 10.2 代理模式的优缺点

#### 优点:

* 代理模式在客户端与目标对象之间起到一个中介作用和保护目标对象的作用
* 代理对象可以扩展目标对象的功能
* 代理模式能将客户端与目标对象分离，在一定程度上降低了系统的耦合度，增加了程序的可扩展性

#### 缺点:

* 代理模式会造成系统设计中类的数量增加
* 在客户端和目标对象之间增加一个代理对象，会造成请求处理速度变慢
* 增加了系统的复杂度

### 10.3 代理模式的应用场景

* JAVA的Spring AOP
* Windows里面的快捷方式

### 10.4 代理模式的结构

代理模式的主要角色有:

* 抽象主题(Subject) 类 : 通过接口或者抽象类声明真实主题和代理对象实现的业务方法
* 真实主题(Real Subject)类 : 实现了抽象主题中的具体业务,是代理对象中所代表的的真实对象,是最终要引用的对象
* 代理类(Proxy) :  提供了与真实主题相同的接口，其内部含有对真实主题的引用，它可以访问、控制或扩展真实主题的功能

![](/img/design_pattern/代理模式结构图.gif)

### 10.5 代理模式的代码实现

注意 : 在代理的创建时期,代理模式可以分为静态代理和动态代理两种形式 

* **静态代理** : 指的是程序员在创建代理类或者特定工具自动生成源代码再对其进行编译,在程序运行前代理类的.class文件已经存在了
* **动态代理** : 则是在程序运行时,运用反射机制动态创建而成

**抽象主题接口(Subject):**

```java
//抽象主题
public interface Subject {
    //定义处理请求的方法
    public void request();
}
```

**真实主题接口(Real Subject):**

```java
public class RealSubject implements Subject{
    @Override
    public void request() {
        System.out.println("真实主题的处理请求的方法");
    }
}
```

**代理类(Proxy):**

```java
public class Proxy implements Subject{
    //引入真实主题
    private RealSubject realSubject;

    @Override
    public void request() {
        if (realSubject == null) {
            realSubject = new RealSubject();
        }
        preRequest();
        realSubject.request();
        postRequest();
    }

    //处理真实请求前的方法
    private void preRequest() {
        System.out.println("访问真实主题之前的预处理");
    }
    //处理真实请求后的方法
    private void postRequest() {
        System.out.println("访问真实主题之后的后续处理");
    }
}
```

**测试代码:**

```java
public class Test {
    public static void main(String[] args) {
        Proxy proxy = new Proxy();
        proxy.request();
    }
}

测试结果:
访问真实主题之前的预处理
真实主题的处理请求的方法
访问真实主题之后的后续处理
```

### 10.6 动态代理细节讲解(后续更新)

### 10.7 代理模式在JS中应用

图片预加载：

如果直接给某个img标签节点设置src属性，由于图片过大或者网络不加，图片的位置往往有段时间会是一片空白

常见做法：

先用一张loading图片占位，然后用异步的方式加载图片，等图片加载好后再把他填充到img节点里

```js
var myImage = (function(){
	var imgNode = document.createElement('img')
  document.body.appendChile(imgNode)
  
  return{
    setSrc:function(src){
      imgNode.src = src
    }
  }
})()

var proxyImage = (function(){
  var img = new Image;
  img.onload = function(){
    myImage.setSrc(this.src) //下载完成后再把该图片填充到img节点中去
  }
  return{
    setSrc:function(src){
      myImage.setSrc('http://...loading.jpg') //先显示 loading图片占位 
      img.src = src //一旦给img设置src，该src路径下的图片就会开始下载
    }
  }
})()

proxyImage.setSrc('http://....')
```

## 11. 迭代器模式(Iterator Pattern)

### 11.1 什么是迭代器模式？

提供一种方法顺序访问一个聚合对象中的各种元素，而又不需要暴露该对象的内部表示

迭代器模式在客户访问类与聚合类之间插入一个迭代器，这分离了聚合对象与其遍历行为，对客户也隐藏了其内部细节，且满足“单一职责原则”和“开闭原则”，如 Java中的 Collection、List、Set、Map 等都包含了迭代器

### 11.2 迭代器模式的类型？

- `内部迭代器`：外部不关心迭代器内部的实现，跟迭代器的交互仅是一次初始调用
- `外部迭代器`：显示的请求迭代下一个元素，可以手工控制迭代的过程或者顺序

### 11.3 迭代器模式优缺点

#### 优点:

1. 访问一个聚合对象的内容而无须暴露它的内部表示。
2. 遍历任务交由迭代器完成，这简化了聚合类。
3. 它支持以不同方式遍历一个聚合，甚至可以自定义迭代器的子类以支持新的遍历。
4. 增加新的聚合类和迭代器类都很方便，无须修改原有代码。
5. 封装性良好，为遍历不同的聚合结构提供一个统一的接口。

#### 缺点:

* 增加了类的个数，这在一定程度上增加了系统的复杂性

### 11.4 JS实现内部外部迭代器

- `内部迭代器`：

```js
var each = function(ary, callback){
  for(let i = 0, l= arr.length; i < l; i++){
		callback.call(arr[i], i, arr[i])
  }
}
```

- `外部迭代器`：

```js
var Interator = function(obj){
  var current = 0
  var next = function(){
    current += 1
  }
  var isDone = function(){
    return current > obj.length
  }
  var getCurrentItem = function(){
    return obj[current]
  }
  return{
    next:next,
    isDone:isDone,
    getCurrentItem:getCurrentItem,
    length:obj.length
  }
}
```

### 11.5 Java实现迭代器模式

迭代器模式是通过将聚合对象的遍历行为分离出来，抽象成迭代器类来实现的，其目的是在不暴露聚合对象的内部结构的情况下，让外部代码透明地访问聚合的内部数据。现在我们来分析其基本结构与实现方法。

#### 模式的结构

迭代器模式主要包含以下角色:

1. 抽象聚合（Aggregate）角色：定义存储、添加、删除聚合对象以及创建迭代器对象的接口。
2. 具体聚合（ConcreteAggregate）角色：实现抽象聚合类，返回一个具体迭代器的实例。
3. 抽象迭代器（Iterator）角色：定义访问和遍历聚合元素的接口，通常包含 hasNext()、first()、next() 等方法。
4. 具体迭代器（Concretelterator）角色：实现抽象迭代器接口中所定义的方法，完成对聚合对象的遍历，记录遍历的当前位置。

![](/img/design_pattern/迭代器模式结构图.gif)

**抽象聚合（Aggregate）:**

```java
//抽象聚合
public interface Aggregate {

    public void add(Object obj);

    public void remove(Object obj);

    public Iterator getIterator();
}
```

**具体聚合（ConcreteAggregate）:**

```java
public class ConcreteAggregate implements Aggregate{
    //定义一个集合属性
    private List<Object> list = new ArrayList<>();

    @Override
    public void add(Object obj) {
        list.add(obj);
    }

    @Override
    public void remove(Object obj) {
        list.remove(obj);
    }

    @Override
    public Iterator getIterator() {
        return new ConcreteIterator(list);
    }
}
```

**抽象迭代器（Iterator）:**

```java
public interface Iterator {
    Object first();

    Object next();

    boolean hasNext();
}

```

**具体迭代器（Concretelterator）:**

```java
public class ConcreteIterator implements Iterator{

    private List<Object> list = null;
    private int index = -1;

    public ConcreteIterator(List<Object> list) {
        this.list = list;
    }

    @Override
    public Object first() {
        index = 0;
        Object val = list.get(index);
        return val;
    }

    @Override
    public Object next() {
        Object obj = null;
        if (this.hasNext()) {
            obj = list.get(++index);
        }
        return obj;
    }

    @Override
    public boolean hasNext() {
        if (index < list.size() - 1) {
            return true;
        }else {
            return false;
        }
    }
}
```

**测试代码:**

```java
public class Test {
    public static void main(String[] args) {
        Aggregate aggregate = new ConcreteAggregate();
        aggregate.add("feng");
        aggregate.add("bin");
        aggregate.add("tang");
        aggregate.add("mengxia");
        System.out.println("迭代输入聚合内容: ");
        Iterator it = aggregate.getIterator();
        while (it.hasNext()) {
            Object next = it.next();
            System.out.println(next.toString() + "\t");
        }

        Object first = it.first();
        System.out.println("聚合的第一个元素为: " + first.toString());
    }
}

测试结果:
迭代输入聚合内容: 
feng	
bin	
tang	
mengxia	
聚合的第一个元素为: feng
```

## 12. 发布订阅模式（观察者模式）(Observer Pattern)

### 12.1 什么是发布订阅模式？

定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖它的对象都将得到通知.这种模式有时又称作**发布-订阅模式、模型-视图模式**，它是**对象行为型模式**.

### 12.2 优缺点

观察者模式是一种**对象行为型模式**，其主要优点如下:

1. 降低了目标与观察者之间的耦合关系，两者之间是抽象耦合关系。符合依赖翻转原则。
2. 目标与观察者之间建立了一套触发机制。

它的主要缺点如下:

1. 目标与观察者之间的依赖关系并没有完全解除，而且有可能出现循环引用。
2. 当观察者对象很多时，通知的发布会花费很多时间，影响程序的效率。

### 12.3 观察者模式在JS中应用

1. 首先指定好谁充当发布者
2. 给发布者添加一个缓存列表，用于存放回调函数以便通知订阅者
3. 发布消息的时候，发布者会遍历这个缓存列表，一次遍历里面存放的订阅者回调函数

```js
//定义发布者
var salesOffices = {}
//定义缓存列表
salesOffices.clientList = {}
//添加订阅者,只订阅自己感兴趣的消息
salesOffices.listen = function(key, fn){ //key代表的是感兴趣的消息
  if(!this.clientList[key]){
    this.clientList[key] = []
  }
  this.clientList[key].push(fn)
}
//移除订阅者
salesOffices.remove = function(key, fn){
	var fns = this.clientList[key]
  if(!fns){
    return false //说明没人订阅
  }
  if(!fn){
    //说明需要移除key对应消息的所有订阅
    fns && (fns.length = 0)
  }
  
}
//发布消息
salesOffices.trigger = function(){
  var key = Array.prototype.shift.call(arguments),
      fns = this.clientList[key];
  if(!fns || fns.length === 0){
    return false // 说明没人订阅该消息
  }
  for(let i = 0, fn; fn = fns[i++]; ){
    fn.apply(this, arguments)  //arguments是发布消息时附加的参数
  }else{
    for(var l = fns.length - 1; l >= 0; l--){
      var _fn = fns[l]
      if(_fn == fn){
        fns.splice(l, 1)
      }
    }
  }
}
```

### 12.4 观察者模式在Java中的实现

观察者模式的主要角色如下:

1. 抽象主题（Subject）角色：也叫抽象目标类，它提供了一个用于保存观察者对象的聚集类和增加、删除观察者对象的方法，以及通知所有观察者的抽象方法。
2. 具体主题（Concrete Subject）角色：也叫具体目标类，它实现抽象目标中的通知方法，当具体主题的内部状态发生改变时，通知所有注册过的观察者对象。
3. 抽象观察者（Observer）角色：它是一个抽象类或接口，它包含了一个更新自己的抽象方法，当接到具体主题的更改通知时被调用。
4. 具体观察者（Concrete Observer）角色：实现抽象观察者中定义的抽象方法，以便在得到目标的更改通知时更新自身的状态。

![](/img/design_pattern/观察者模式结构图.gif)

**抽象主题（Subject）:**

```java
//抽象目标
public abstract class Subject {
    protected List<Observer> observers = new ArrayList<>();

    //增加观察者的方法
    public void add(Observer observer) {
        observers.add(observer);
    }

    //删除观察者的方法
    public void remove(Observer observer) {
        observers.remove(observer);
    }

    //通知所有观察者的方法
    public abstract void notifyAllObservers();
}
```

**具体主题（Concrete Subject）:**

```java
public class ConcreteSubject extends Subject{
    @Override
    public void notifyAllObservers() {
        System.out.println("检测到状态发生改变...");
        System.out.println(">>>所有订阅的观察者对其做出反应>>>");
        for (Observer observer : observers) {
            observer.response();
        }
    }
}
```

**抽象观察者（Observer）:**

```java
public interface Observer {
    //观察者对于状态改变做出反应的方法(即发布者检测到订阅者的状态发生改变,订阅者做出反应的方法)
    public void response();
}
```

**具体观察者（Concrete Observer）:**

```java
public class ConcreteObserver1 implements Observer{
    @Override
    public void response() {
        System.out.println("观察者1做出响应...");
    }
}

public class ConcreteObserver2 implements Observer{
    @Override
    public void response() {
        System.out.println("观察者2做出响应...");
    }
}

public class ConcreteObserver3 implements Observer{
    @Override
    public void response() {
        System.out.println("观察者3做出响应...");
    }
}
```

**测试代码:**

```java
public class Test {
    public static void main(String[] args) {
        Subject subject = new ConcreteSubject();
        Observer observer1 = new ConcreteObserver1();
        Observer observer2 = new ConcreteObserver2();
        Observer observer3 = new ConcreteObserver3();
        subject.add(observer1);
        subject.add(observer2);
        subject.add(observer3);
        subject.notifyAllObservers();
    }
}

测试结果:
检测到状态发生改变...
>>>所有订阅的观察者对其做出反应>>>
观察者1做出响应...
观察者2做出响应...
观察者3做出响应...
```

## 13. 命令模式(Command Pattern)

### 13.1 什么是命令模式？

命令指的是一个执行某些特定事情的指令（有时候需要向某些对象发送请求，但是并不知道请求的接受者是谁，也不知道被请求的操作是什么）

将一个请求封装为一个对象，使发出请求的责任和执行请求的责任分割开。这样两者之间通过命令对象进行沟通，这样方便将命令对象进行储存、传递、调用、增加与管理

### 13.2 优缺点：

命令模式的主要优点如下：

1. 通过引入中间件（抽象接口）降低系统的耦合度。
2. 扩展性良好，增加或删除命令非常方便。采用命令模式增加与删除命令不会影响其他类，且满足“开闭原则”。
3. 可以实现宏命令。命令模式可以与[组合模式](http://c.biancheng.net/view/1373.html)结合，将多个命令装配成一个组合命令，即宏命令。
4. 方便实现 Undo 和 Redo 操作。命令模式可以与后面介绍的[备忘录模式](http://c.biancheng.net/view/1400.html)结合，实现命令的撤销与恢复。
5. 可以在现有命令的基础上，增加额外功能。比如日志记录，结合装饰器模式会更加灵活。

其缺点是：

1. 可能产生大量具体的命令类。因为每一个具体操作都需要设计一个具体命令类，这会增加系统的复杂性。
2. 命令模式的结果其实就是接收方的执行结果，但是为了以命令的形式进行架构、解耦请求与实现，引入了额外类型结构（引入了请求方与抽象命令接口），增加了理解上的困难。不过这也是[设计模式](http://c.biancheng.net/design_pattern/)的通病，抽象必然会额外增加类的数量，代码抽离肯定比代码聚合更加难理解。

### 13.3 命令模式在JS中应用

给对象的某个方法取了execute的名字，引入command对象和receiver对象

```js
//给receiver这个对象的某个方法取了execute的名字
var RefeshMenuBarCommand = function(receiver){
  return {
    execute:function(){
      receiver.refresh()
    }
  }
}
//command对象
var setCommand = function(button, command){
	button.onclick = function(){
    command.execute()
  }
}
//使用
var refeshMenuBarCommand = RefeshMenuBarCommand(menuBar)
setCommand(button1,refeshMenuBarCommand )
```

### 13.4 命令模式在java代码中的实现

命令模式包含以下主要角色:

1. 抽象命令类（Command）角色：声明执行命令的接口，拥有执行命令的抽象方法 execute()。
2. 具体命令类（Concrete Command）角色：是抽象命令类的具体实现类，它拥有接收者对象，并通过调用接收者的功能来完成命令要执行的操作。
3. 实现者/接收者（Receiver）角色：执行命令功能的相关操作，是具体命令对象业务的真正实现者。
4. 调用者/请求者（Invoker）角色：是请求的发送者，它通常拥有很多的命令对象，并通过访问命令对象来执行相关请求，它不直接访问接收者。

![](/img/design_pattern/命令模式结构图4.gif)

**抽象命令类（Command）:**

```java
public interface Command {
    public abstract void execute();
}
```

**具体命令类（Concrete Command）:**

```java
public class ConcreteCommand implements Command{
    private Receiver receiver;

    public ConcreteCommand() {
        this.receiver = new Receiver();
    }

    @Override
    public void execute() {
            receiver.action();
    }
}
```

**实现者/接收者（Receiver）:**

```java
public class Receiver {
    public void action() {
        System.out.println("接受者的action()方法被调用...");
    }
}
```

**调用者/请求者（Invoker）:**

```java
public class Invoker {
    private Command command;

    public Invoker(Command command) {
        this.command = command;
    }

    public Command getCommand() {
        return command;
    }

    public void setCommand(Command command) {
        this.command = command;
    }

    //调用命令的方法
    public void call() {
        System.out.println("调用者执行命令command...");
        command.execute();
    }
}
```

**测试代码:**

```java
public class test {
    public static void main(String[] args) {
        Command cmd = new ConcreteCommand();
        Invoker invoker = new Invoker(cmd);
        System.out.println("客户访问调用者的call()方法");
        invoker.call();
    }
}

测试结果:
客户访问调用者的call()方法
调用者执行命令command...
接受者的action()方法被调用...
```

## 14. 组合模式(Composite Pattern)

### 14.1 什么是组合模式？

组合模式将对象组合成**树形结构**，以表示“整体-部分”的层次结构（基本对象可以被组合成更复杂的组合对象，组合对象又可以被组合),属于**结构型设计模式**.

组合模式一般用来描述整体与部分的关系，它将对象组织到树形结构中，顶层的节点被称为根节点，根节点下面可以包含树枝节点和叶子节点，树枝节点下面又可以包含树枝节点和叶子节点，树形结构图如下:

![](/img/design_pattern/组合模式结构.png)

注意: 在组合模式中，**整个树形结构中的对象都属于同一种类型**，带来的好处就是用户不需要辨别是树枝节点还是叶子节点，可以直接进行操作，给用户的使用带来极大的便利

### 14.2 优缺点

组合模式的主要优点有：

1. 组合模式使得客户端代码可以一致地处理单个对象和组合对象，无须关心自己处理的是单个对象，还是组合对象，这简化了客户端代码；
2. 更容易在组合体内加入新的对象，客户端不会因为加入了新的对象而更改源代码，满足“开闭原则”；

其主要缺点是：

1. 设计较复杂，客户端需要花更多时间理清类之间的层次关系；
2. 不容易限制容器中的构件；
3. 不容易用继承的方法来增加构件的新功能；

### 14.3 组合模式案例实现

组合模式包含以下主要角色:

1. 抽象构件（Component）角色：它的主要作用是为树叶构件和树枝构件声明公共接口，并实现它们的默认行为。

   在透明式的组合模式中抽象构件还声明访问和管理子类的接口；

   在安全式的组合模式中不声明访问和管理子类的接口，管理工作由树枝构件完成。（总的抽象类或接口，定义一些通用的方法，比如新增、删除）

2. 树叶构件（Leaf）角色：是组合中的叶节点对象，它没有子节点，用于继承或实现抽象构件。

3. 树枝构件（Composite）角色 / 中间构件：是组合中的分支节点对象，它有子节点，用于继承和实现抽象构件。它的主要作用是存储和管理子部件，通常包含 Add()、Remove()、GetChild() 等方法。

注意: 组合模式分为**透明式的组合模式和安全式的组合模式**

#### (1)透明方式组合模式

在该方式中，由于**抽象构件声明了所有子类中的全部方法**，所以客户端无须区别树叶对象和树枝对象，对客户端来说是透明的。但其缺点是：树叶构件本来没有 Add()、Remove() 及 GetChild() 方法，却要实现它们（空实现或抛异常），这样会带来一些安全性问题:

![](/img/design_pattern/组合模式透明方式.gif)

**抽象构件（Component）:**

```java
//抽象构件
public interface Component {

    public void add(Component c);

    public void remove(Component c);

    public Component getChild(int i);

    public void operation();
}
```

**树枝构件（Composite）:**

```java
//树枝构件
public class Composite implements Component{
    //定义该树枝构件的所有树叶
    private ArrayList<Component> children = new ArrayList<>();

    @Override
    public void add(Component c) {
        children.add(c);
    }

    @Override
    public void remove(Component c) {
        children.remove(c);
    }

    @Override
    public Component getChild(int i) {
        return children.get(i);
    }

    @Override
    public void operation() {
        for (Component child : children) {
            child.operation();
        }
    }
}

```

**树叶构件（Leaf）:**

```java
public class Leaf implements Component{
    String name;

    public Leaf(String name) {
        this.name = name;
    }

    @Override
    public void add(Component c) {
    }

    @Override
    public void remove(Component c) {
    }

    @Override
    public Component getChild(int i) {
        return null;
    }

    @Override
    public void operation() {
        System.out.println("树叶" + name + "访问...");
    }
}
```

**测试代码:**

```java
public class Test {
    public static void main(String[] args) {
        Component c0 = new Composite();
        Component c1 = new Composite();
        Component leaf1 = new Leaf("1");
        Component leaf2 = new Leaf("2");
        Component leaf3 = new Leaf("3");
        c0.add(leaf1);
        c1.add(leaf2);
        c1.add(leaf3);
        c0.operation();
        System.out.println("-------------------");
        c1.operation();
    }
}

测试结果:
树叶1访问...
-------------------
树叶2访问...
树叶3访问...
```

#### (2)安全方式组合模式

在该方式中，将**管理子构件的方法移到树枝构件**中，抽象构件和树叶构件没有对子对象的管理方法，这样就避免了上一种方式的安全性问题，但由于叶子和分支有不同的接口，客户端在调用时要知道树叶对象和树枝对象的存在，所以失去了透明性

![](/img/design_pattern/组合模式安全方式.gif)

代码对于上面进行稍作调整即可,因为管理树叶的方法只在树枝构件中存在,故我们选择将Component中的管理方法移除,只保存operation()方法

```java
interface Component {
    public void operation();
}
```

然后修改测试代码:使用树枝构件创建树叶对象:

```java
public class Test{
    public static void main(String[] args) {
        Composite c0 = new Composite();
        Composite c1 = new Composite();
        Component leaf1 = new Leaf("1");
        Component leaf2 = new Leaf("2");
        Component leaf3 = new Leaf("3");
        c0.add(leaf1);
        c0.add(c1);
        c1.add(leaf2);
        c1.add(leaf3);
        c0.operation();
        System.out.println("-------------------");
        c1.operation();
    }
}
```

### 14.4 JS组合模式的应用

```js
//宏命令
var MacroCommand = function(){
  return {
    commandList:[],
    add:function(command){
      this.commandList.push(command)
    },
    execute:function(){
      for(var i = 0, command; command = this.commandList[i++]){
        command.execute()
      }
    }
  }

```

## 15. 模板方法模式(Template Method Pattern)

### 15.1 模板方法模式定义

模板方法模式指的是**一个操作中的算法骨架,而将算法的一些步骤延迟到子类中,使得子类可以在不改变该算法结构的情况下重定义该算法的某些特定的步骤**.它是一种**类行为型设计模式**.

### 15.2 模板方法的优点

* 它封装了**不变部分，扩展可变部分**。它把认为是不变部分的算法封装到父类中实现，而把可变部分算法由子类继承实现，便于子类继续扩展。
* 它在父类中提取了公共的部分代码，便于代码复用
* 部分方法是由子类实现的，因此子类可以通过扩展方式增加相应的功能，符合开闭原则

### 15.3 模板方法的缺点

* 对每个不同的实现都需要定义一个子类，这会导致类的个数增加，系统更加庞大，设计也更加抽象，间接地增加了系统实现的复杂度。
* 父类中的抽象方法由子类实现，子类执行的结果会影响父类的结果，这导致一种反向的控制结构，它提高了代码阅读的难度。
* 由于继承关系自身的缺点，如果父类添加新的抽象方法，则所有子类都要改一遍。

### 15.4 模板方法的案例实现

模板方法模式包含以下主要角色 :

#### 1）抽象类/抽象模板（Abstract Class）

抽象模板类，负责给出一个算法的轮廓和骨架。它由一个模板方法和若干个基本方法构成。这些方法的定义如下。

① 模板方法：定义了算法的骨架，按某种顺序调用其包含的基本方法。

② 基本方法：是整个算法中的一个步骤，包含以下几种类型。

- 抽象方法：在抽象类中声明，由具体子类实现。
- 具体方法：在抽象类中已经实现，在具体子类中可以继承或重写它。
- **钩子方法：在抽象类中已经实现，包括用于判断的逻辑方法和需要子类重写的空方法两种**。

#### 2）具体子类/具体实现（Concrete Class）

具体实现类，实现抽象类中所定义的抽象方法和钩子方法，它们是一个顶级逻辑的一个组成步骤

![](/img/design_pattern/模板方法模式结构图.gif)

**抽象类(AbstractClass) :** 

```java
//抽象类
public abstract class AbstractClass {
    //模板方法
    public void TemplateMethod() {
        SpecificMethod();
        abstractMethod1();
        abstractMethod2();
    }

    //具体方法
    public void SpecificMethod() {
        System.out.println("抽象类中的具体方法被调用...");
    }

    //抽象方法1
    public abstract void abstractMethod1();
    //抽象方法2
    public abstract void abstractMethod2();

}
```

**具体类(Concrete Class) : **

```java
//具体子类
public class ConcreteClass extends AbstractClass {
    @Override
    public void abstractMethod1() {
        System.out.println("抽象方法1的实现被调用...");
    }

    @Override
    public void abstractMethod2() {
        System.out.println("抽象方法2的实现被调用...");
    }
}
```

**测试 :**

```java
public class Test {
    public static void main(String[] args) {
        AbstractClass tm = new ConcreteClass();
        tm.TemplateMethod();
    }
}

测试结果:
抽象类中的具体方法被调用...
抽象方法1的实现被调用...
抽象方法2的实现被调用...
```

## 16. 工厂模式(Factory Pattern)

### 16.1 定义

一个创建产品对象的工厂接口，将产品对象的实际创建工作推迟到具体子工厂类当中。这满足创建型模式中所要求的“创建与使用相分离”的特点.

工厂模式有 3 种不同的实现方式，分别是**简单工厂模式、工厂方法模式和抽象工厂模式**

### 16.2 简单工厂模式(也称为静态工厂模式)

**简单工厂类(SimpleFactory) :** 

```java
public class SimpleFactory {
    public static Product makeProduct(int kind) {
        //根据kind类型进行对象的构建
        switch (kind) {
            case 0 :
                return new ConcreteProduct1();
            case 1 :
                return new ConcreteProduct2();
        }
        return null;
    }
}
```

**抽象商品接口(Product) :**

```java
public interface Product {
    void show();
}
```

**具体商品1 :**

```java
public class ConcreteProduct1 implements Product{
    @Override
    public void show() {
        System.out.println("具体产品1...");
    }
}
```

**具体商品2 :**

```java
public class ConcreteProduct2 implements Product{
    @Override
    public void show() {
        System.out.println("具体产品2...");
    }
}
```

**客户端测试类 :**

```java
public class Client {
    public static void main(String[] args) {
        Product product1 = SimpleFactory.makeProduct(0);
        product1.show();
        System.out.println("-----------------");
        Product product2 = SimpleFactory.makeProduct(1);
        product2.show();
    }
}
```

测试结果:

```java
具体产品1...
-----------------
具体产品2...
```

### 16.3 工厂方法模式

工厂方法模式是对简单工厂模式的进一步的抽象化,其好处在于可以使得系统在不修改原来的代码的情况下引进新的产品,即满足"开闭原则"

```java
//抽象工厂：提供了厂品的生成方法
interface AbstractFactory {
    public Product newProduct();
}
//具体工厂1：实现了厂品的生成方法
class ConcreteFactory1 implements AbstractFactory {
    public Product newProduct() {
        System.out.println("具体工厂1生成-->具体产品1...");
        return new ConcreteProduct1();
    }
}
//具体工厂2：实现了厂品的生成方法
class ConcreteFactory2 implements AbstractFactory {
    public Product newProduct() {
        System.out.println("具体工厂2生成-->具体产品2...");
        return new ConcreteProduct2();
    }
}
```

### 16.4 抽象工厂模式

抽象工厂模式是工厂方法模式的再升级版本，工厂方法模式只生产一个等级的产品，而抽象工厂模式可生产多个等级的产品

```java
//抽象工厂
interface AbstractFactory {
    public Product1 newProduct1();
    public Product2 newProduct2();
}
//具体工厂
class ConcreteFactory1 implements AbstractFactory {
    public Product1 newProduct1() {
        System.out.println("具体工厂 1 生成-->具体产品 11...");
        return new ConcreteProduct11();
    }
    public Product2 newProduct2() {
        System.out.println("具体工厂 1 生成-->具体产品 21...");
        return new ConcreteProduct21();
    }
}
```

## 17. 建造者模式(Builder Pattern)

### 17.1 建造者（Builder）模式的定义

建造者指将一个复杂对象的构造与它的表示分离，使同样的构建过程可以创建不同的表示，这样的[设计模式](http://c.biancheng.net/design_pattern/)被称为建造者模式。它是将**一个复杂的对象分解为多个简单的对象，然后一步一步构建而成**。它将变与不变相分离，即产品的组成部分是不变的，但每一部分是可以灵活选择的。

### 17.2 建造者模式的优点

1. 封装性好，构建和表示分离。
2. 扩展性好，各个具体的建造者相互独立，有利于系统的解耦。
3. 客户端不必知道产品内部组成的细节，建造者可以对创建过程逐步细化，而不对其它模块产生任何影响，便于控制细节风险。

### 17.3 建造者模式的缺点

1. 产品的组成部分必须相同，这限制了其使用范围。
2. 如果产品的内部变化复杂，如果产品内部发生变化，则建造者也要同步修改，后期维护成本较大。

### 17.4 建造者模式的案例

建造者（Builder）模式的主要角色如下 :

1. 产品角色（Product）：它是包含多个组成部件的复杂对象，由具体建造者来创建其各个零部件。
2. 抽象建造者（Builder）：它是一个包含创建产品各个子部件的抽象方法的接口，通常还包含一个返回复杂产品的方法 getResult()。
3. 具体建造者(Concrete Builder）：实现 Builder 接口，完成复杂产品的各个部件的具体创建方法。
4. 指挥者（Director）：它调用建造者对象中的部件构造与装配方法完成复杂对象的创建，在指挥者中不涉及具体产品的信息。

![](/img/design_pattern/建造者模式结构图.gif)

**产品角色类(Product) :** 

```java
public class Product {
    private String partA;
    private String partB;
    private String partC;
    public void setPartA(String partA) {
        this.partA = partA;
    }
    public void setPartB(String partB) {
        this.partB = partB;
    }
    public void setPartC(String partC) {
        this.partC = partC;
    }
    public void show() {
        //显示产品的特性
    }
}
```

**抽象建造者(Builder) :** 

```java
public abstract class Builder {
    //创建产品对象
    protected Product product = new Product();

    public abstract void buildPartA();
    public abstract void buildPartB();
    public abstract void buildPartC();

    //返回产品对象
    public Product getResult() {
        return product;
    }
}
```

**具体建造者(ConcreteBuilder) :** 

```java
public class ConcreteBuilder extends Builder{
    @Override
    public void buildPartA() {
        System.out.println("建造了 PartA");
    }

    @Override
    public void buildPartB() {
        System.out.println("建造了 PartB");
    }

    @Override
    public void buildPartC() {
        System.out.println("建造了 PartC");
    }
}
```

**指挥者(Director) :** 

```java
public class Director {
    private Builder builder;

    public Director(Builder builder) {
        this.builder = builder;
    }
    //产品构建与组装方法
    public Product construct() {
        builder.buildPartA();
        builder.buildPartB();
        builder.buildPartC();
        return builder.getResult();
    }
}
```

**客户端测试类(Client) :** 

```java
public class Client {
    public static void main(String[] args) {
        ConcreteBuilder builder = new ConcreteBuilder();
        Director director = new Director(builder);
        Product product = director.construct();
        product.show();
    }
}
```

## 18. 原型模式(Prototype Pattern)

### 18.1 定义

用一个已经创建的实例作为原型，通过复制该原型对象来创建一个和原型相同或相似的新对象。

### 18.2 原型模式的优点

- [Java](http://c.biancheng.net/java/) 自带的原型模式基于内存二进制流的复制，在性能上比直接 new 一个对象更加优良。
- 可以使用**深克隆方式**保存对象的状态，使用原型模式将对象复制一份，并将其状态保存起来，简化了创建对象的过程，以便在需要的时候使用（例如恢复到历史某一状态），可辅助实现撤销操作。

### 18.3 原型模式的缺点

- 需要为每一个类都配置一个 clone ()方法
- clone 方法位于类的内部，当对已有类进行改造的时候，需要修改代码，违背了开闭原则。
- 当实现深克隆时，需要编写较为复杂的代码，而且当对象之间存在多重嵌套引用时，为了实现深克隆，每一层对象对应的类都必须支持深克隆，实现起来会比较麻烦。因此，深克隆、浅克隆需要运用得当。

### 18.4 原型模式案例实现

原型模式包含以下主要角色 :

1. 抽象原型类：规定了具体原型对象必须实现的接口。
2. 具体原型类：实现抽象原型类的 clone() 方法，它是可被复制的对象。
3. 访问类：使用具体原型类中的 clone() 方法来复制新的对象。

因为java提供了对象的clone()方法,故我们可以直接让原型类实现Cloneable接口,然后就可以调用该原型的clone()方法从而创建该原型类的克隆对象

注意 : 这里实现的是浅拷贝,即拷贝出来的实例和原型实例指向的是同一个内存地址,如果想实现深拷贝,需要进一步的操作

#### 深拷贝实现

## 19. 外观模式(Facade Pattern)

### 19.1 定义和特点

**外观（Facade）模式又叫作门面模式**，是一种**通过为多个复杂的子系统提供一个一致的接口，而使这些子系统更加容易被访问的模式**。该模式对外有一个统一接口，外部应用程序不用关心内部子系统的具体细节，这样会大大降低应用程序的复杂度，提高了程序的可维护性。

### 19.2 优点和缺点

#### 优点:

1. 降低了子系统与客户端之间的耦合度，使得子系统的变化不会影响调用它的客户类。
2. 对客户屏蔽了子系统组件，减少了客户处理的对象数目，并使得子系统使用起来更加容易。
3. 降低了大型软件系统中的编译依赖性，简化了系统在不同平台之间的移植过程，因为编译一个子系统不会影响其他的子系统，也不会影响外观对象。

#### 缺点:

1. 不能很好地限制客户使用子系统类，很容易带来未知风险。
2. 增加新的子系统可能需要修改外观类或客户端的源代码，违背了“开闭原则”。

### 19.3 外观模式的结构和实现

外观（Facade）模式包含以下主要角色 :

1. **外观（Facade）角色**：为多个子系统对外提供一个共同的接口。
2. **子系统（Sub System）角色**：实现系统的部分功能，客户可以通过外观角色访问它。
3. **客户（Client）角色**：通过一个外观角色访问各个子系统的功能。

![](/img/design_pattern/外观模式结构图.gif)

**外观类 :** 

```java
public class Facade {
    private SubSystem01 subSystem01 = new SubSystem01();
    private SubSystem02 subSystem02 = new SubSystem02();
    private SubSystem03 subSystem03 = new SubSystem03();

    public void method() {
        subSystem01.method01();
        subSystem02.method02();
        subSystem03.method03();
    }
}
```

**子系统类:**

```java
public class SubSystem01 {
    public void method01() {
        System.out.println("子系统01的method01()被调用...");
    }
}

public class SubSystem02 {
    public void method02() {
        System.out.println("子系统02的method02()被调用...");
    }
}

public class SubSystem03 {
    public void method03() {
        System.out.println("子系统03的method03()被调用...");
    }
}

```

## 20. 桥接模式(Bridge Pattern)

### 20.1 桥接模式的定义

**将抽象与实现分离，使它们可以独立变化**。它是用组合关系代替继承关系来实现，从而降低了抽象和实现这两个可变维度的耦合度

### 20.2 桥接模式的优点和缺点

#### 优点:

- 抽象与实现分离，扩展能力强
- 符合开闭原则
- 符合合成复用原则
- 其实现细节对客户透明

#### 缺点:

由于聚合关系建立在抽象层，要求开发者针对抽象化进行设计与编程，能正确地识别出系统中两个独立变化的维度，这增加了系统的理解与设计难度

## 21. 备忘录模式(Memento Pattern)

### 21.1 备忘录模式介绍

**备忘录（Memento）模式**的定义：在不破坏封装性的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态，以便以后当需要时能将该对象恢复到原先保存的状态。该模式又叫**快照模式**。

### 21.2 备忘录模式优缺点

备忘录模式是一种**对象行为型模式**，其主要优点如下:

- **提供了一种可以恢复状态的机制**。当用户需要时能够比较方便地将数据恢复到某个历史的状态。
- 实现了内部状态的封装。除了创建它的发起人之外，其他对象都不能够访问这些状态信息。
- 简化了发起人类。发起人不需要管理和保存其内部状态的各个备份，所有状态信息都保存在备忘录中，并由管理者进行管理，这符合单一职责原则。

- 其主要缺点是：**资源消耗大。如果要保存的内部状态信息过多或者特别频繁，将会占用比较大的内存资源**。

### 21.3 备忘录模式案例实现

我们需要以下三种角色类 : 

1. 发起人（Originator）角色：记录当前时刻的内部状态信息，提供创建备忘录和恢复备忘录数据的功能，实现其他业务功能，它可以访问备忘录里的所有信息。
2. 备忘录（Memento）角色：负责存储发起人的内部状态，在需要的时候提供这些内部状态给发起人。
3. 管理者（Manager）角色：对备忘录进行管理，提供保存与获取备忘录的功能，但其不能对备忘录的内容进行访问与修改

![](/img/design_pattern/备忘录模式.gif)

发起人（Originator）:

```java
public class Originator {
    private String state;

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    //创建一个备忘录
    public Memento createMemento() {
        return new Memento(state);
    }

    //存储一个备忘录 : 将备忘录的状态state保存起来
    public void restoreMemento(Memento memento) {
        this.setState(memento.getState());
    }
}
```

备忘录（Memento）:

```java
public class Memento {
    private String state;

    public Memento(String state) {
        this.state = state;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }
}
```

管理者（Manager）:

```java
public class Manager {
    //定义备忘录属性
    private Memento memento;

    public Memento getMemento() {
        return memento;
    }

    public void setMemento(Memento memento) {
        this.memento = memento;
    }
}
```

案例测试 : 

```java
public class Test {
    public static void main(String[] args) {
        //定义一个管理者和发起者
        Originator originator = new Originator();
        Manager manager = new Manager();
        //设置发起者的状态
        originator.setState("S0");
        System.out.println("发起者的初始状态为: " + originator.getState());
        //使用管理者保存此时的状态
        manager.setMemento(originator.createMemento());
        originator.setState("S1");
        System.out.println("发起者的新的状态为: " + originator.getState());
        //恢复发起者的状态
        originator.restoreMemento(manager.getMemento());
        System.out.println("发起者此时的状态为: " + originator.getState());
    }
}
```

输出结果 :

```java
发起者的初始状态为: S0
发起者的新的状态为: S1
发起者此时的状态为: S0
```

## 22. 访问者模式(Visitor Pattern)

### 22.1 访问者模式介绍

访问者（Visitor）模式的定义：将作用于某种数据结构中的各元素的操作分离出来封装成独立的类，使其在不改变数据结构的前提下可以添加作用于这些元素的新的操作，为数据结构中的每个元素提供多种访问方式。它将对数据的操作与数据结构进行分离，是**行为类模式中最复杂的一种模式。**

### 22.2 访问者模式的优缺点

访问者（Visitor）模式是一种对象行为型模式，其主要优点如下

* 扩展性好。能够在不修改对象结构中的元素的情况下，为对象结构中的元素添加新的功能。

* 复用性好。可以通过访问者来定义整个对象结构通用的功能，从而提高系统的复用程度。

* 灵活性好。访问者模式将数据结构与作用于结构上的操作解耦，使得操作集合可相对自由地演化而不影响系统的数据结构。

* 符合单一职责原则。访问者模式把相关的行为封装在一起，构成一个访问者，使每一个访问者的功能都比较单一。

访问者（Visitor）模式的主要缺点如下。

* 增加新的元素类很困难。在访问者模式中，每增加一个新的元素类，都要在每一个具体访问者类中增加相应的具体操作，这违背了“开闭原则”。

* 破坏封装。访问者模式中具体元素对访问者公布细节，这破坏了对象的封装性。  

* 违反了依赖倒置原则。访问者模式依赖了具体类，而没有依赖抽象类。

## 23. 解释器模式(Interpreter Pattern)

### 23.1 解释器模式定义

解释器（Interpreter）模式的定义：给分析对象定义一个语言，并定义该语言的文法表示，再设计一个解析器来解释语言中的句子。也就是说，用编译语言的方式来分析应用中的实例。这种模式实现了文法表达式处理的接口，该接口解释一个特定的上下文。

### 23.2 解释器模式的优缺点

解释器模式是一种**类行为型模式**，其主要优点如下

1. 扩展性好。由于在解释器模式中使用类来表示语言的文法规则，因此可以通过继承等机制来改变或扩展文法。
2. 容易实现。在语法树中的每个表达式节点类都是相似的，所以实现其文法较为容易。


解释器模式的主要缺点如下

1. 执行效率较低。解释器模式中通常使用大量的循环和递归调用，当要解释的句子较复杂时，其运行速度很慢，且代码的调试过程也比较麻烦。
2. 会引起类膨胀。解释器模式中的每条规则至少需要定义一个类，当包含的文法规则很多时，类的个数将急剧增加，导致系统难以管理与维护。
3. 可应用的场景比较少。在软件开发中，需要定义语言文法的应用实例非常少，所以这种模式很少被使用到。

### 23.3 解释器模式的案例设计

解释器模式包含以下主要角色 :

1. **抽象表达式（Abstract Expression）角色**：定义解释器的接口，约定解释器的解释操作，主要包含解释方法 interpret()。
2. **终结符表达式（Terminal Expression）角色**：是抽象表达式的子类，用来实现文法中与终结符相关的操作，文法中的每一个终结符都有一个具体终结表达式与之相对应。
3. **非终结符表达式（Nonterminal Expression）角色**：也是抽象表达式的子类，用来实现文法中与非终结符相关的操作，文法中的每条规则都对应于一个非终结符表达式。
4. **环境（Context）角色**：通常包含各个解释器需要的数据或是公共的功能，一般用来传递被所有解释器共享的数据，后面的解释器可以从这里获取这些值。
5. 客户端（Client）：主要任务是将需要分析的句子或表达式转换成使用解释器对象描述的抽象语法树，然后调用解释器的解释方法，当然也可以通过环境角色间接访问解释器的解释方法。

![](/img/design_pattern/解释器模式.gif)

抽象表达式（Abstract Expression）:

```java
public interface AbstractExpression {
    public void interpreter(String info);   //解释方法
}
```

终结符表达式（Terminal Expression）:

```java
public class TerminalExpression implements AbstractExpression{

    @Override
    public void interpreter(String info) {
        //对终结符表达式的处理


    }
}
```

非终结符表达式（Nonterminal Expression）:

```java
public class NonterminalExpression implements AbstractExpression{
    
    private AbstractExpression expression1;
    private AbstractExpression expression2;
    //....
    
    @Override
    public void interpreter(String info) {
        //对非终结表达式的处理...
    }
}
```

环境（Context）:

```java
public class Context {
    private AbstractExpression exp;

    public Context() {}

    public void operation(String info) {
        //调用相关表达式进行对应的解释方法
    }
}
```

客户端（Client）:

```java
略...
```

