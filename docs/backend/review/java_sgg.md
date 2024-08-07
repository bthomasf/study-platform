---
title: java面经-尚硅谷
---
## Java基础篇

### 1、如何理解OOP(面向对象)

面向对象编程（Object-Oriented Programming，OOP）是一种编程范式，它将现实世界中的事物（对象）抽象为程序中的类（Class），并通过类来描述对象的属性和行为。OOP的核心思想是将数据和操作数据的方法打包在一起，形成一个独立的个体，即对象。通过封装、继承和多态等概念，使得程序的设计更加模块化、可重用性更高、可维护性更强，从而提高了程序的可靠性和可扩展性。

- 封装（Encapsulation）是指将对象的状态（属性）和行为（方法）包装在一起，形成一个独立的个体，对象的内部状态对外部是不可见的，只有通过对象的公共接口才能访问和操作对象。

- 继承（Inheritance）是指通过定义一个类（子类）来继承另一个类（父类）的属性和方法，子类可以重用父类的代码，并且可以在此基础上添加新的属性和方法，从而实现代码的复用和扩展。

- 多态（Polymorphism）是指通过同一个接口（方法）去操作不同的对象，使得程序能够处理多种类型的对象，从而提高程序的灵活性和可扩展性。多态有两种实现方式：静态多态（编译时多态）和动态多态（运行时多态）。**静态多态是指方法重载，动态多态是指方法重写和接口实现**。

其中，多态可以理解为一种事物的多种形态。比如说：对应动物来说，是一种较为抽象的事物，而动物又分为狗，猫，猪，等等。这里我们定义动物这个抽象的接口类，以及eat方法，同时定义实际的Dog和Cat类，实现eat方法：

```java
public interface Animal {
  //eat method  
  void eat();
}
public class Dog implements Animal{
    @Override
    public void eat() {
        System.out.println("dog eat bone");
    }
}
public class Cat implements Animal{
    @Override
    public void eat() {
        System.out.println("cat eat fish");
    }
}
```

此时，我们进行测试：

```java
接口类/父类 子类对象 = new 子类();
Animal dog = new Dog();
Animal cat = new Cat();
dog.eat();
cat.eat();
```

然后，输出结果：

```java
dog eat bone
cat eat fish
```

### 2、重载与重写区别

- 重载发生在本类，重写发生在父类与子类之间 
- 重载的方法名必须相同，重写的方法名相同且返回值类型必须相同 
- 重载的参数列表不同，重写的参数列表必须相同 
- 重写的访问权限不能比父类中被重写的方法的访问权限更低 ，即子类重写方法访问权限 >= 父类方法
- 构造方法不能被重写

### 3、接口与抽象类的区别

- 抽象类要被子类继承，接口要被类实现 

- 接口可多继承接口(一个类可以同时实现多个接口)，但类只能单继承(只能继承一个父类) 

- 抽象类可以有构造器、接口不能有构造器
- 抽象类：除了不能实例化抽象类之外，它和普通 Java 类没有任何区别 
- 抽象类：抽象方法可以有 public、protected 和 default 这些修饰符、接口：只能是 public 
- 抽象类：可以有成员变量；接口：只能声明常量

### 4、深拷贝与浅拷贝的理解

深拷贝和浅拷贝就是指对象的拷贝，一个对象中存在两种类型的属性，一种是基本数 

据类型，一种是实例对象的引用。 

- 浅拷贝是指，只会拷贝基本数据类型的值，以及实例对象的引用地址，并不会复制一份引用地址所指向的对象，也就是浅拷贝出来的对象，内部的类属性指向的 是同一个对象 
- 深拷贝是指，既会拷贝基本数据类型的值，也会针对实例对象的引用地址所指向的对象进行复制，深拷贝出来的对象，内部的类执行指向的不是同一个对象

### 5、什么是自动拆装箱？ **int** 和Integer有什么区别？

基本数据类型，如 int,float,double,boolean,char,byte,不具备对象的特征，不能调用方 

法。

- 装箱：将基本类型转换成包装类对象 

- 拆箱：将包装类对象转换成基本类型的值 

java 为什么要引入自动装箱和拆箱的功能？主要是用于 java 集合中：

```java
List<Inteter> list=new ArrayList<Integer>(); 
```

list 集合如果要放整数的话，只能放对象，不能放基本类型，因此需要将整数自动装箱成对象。 

**实现原理：**javac 编译器的语法糖，底层是通过 **Integer.valueOf()和 Integer.intValue()** 方法实现。 

**区别：** 

- Integer 是 int 的包装类，int 则是 java 的一种基本数据类型 
- Integer 变量必须实例化后才能使用，而 int 变量不需要 
- Integer 实际是对象的引用，当 new 一个 Integer 时，实际上是生成一个指针指 向此对象；而 int 则是直接存储数据值 
- Integer 的默认值是 null，int默认值为0 
- Integer存储在堆内存中，int常量存储在栈内存中

### 6、==和equals的区别

- == 
  - 如果比较的是基本数据类型，那么比较的是变量的值 
  - 如果比较的是引用数据类型，那么比较的是地址值（两个对象是否指向同一块内 存） 

- equals 

  - 如果没重写 equals 方法比较的是两个对象的地址值 

  - 如果重写了 equals 方法后我们往往比较的是对象中的属性的内容 

  - equals 方法是从 Object 类中继承的，默认的实现就是使用==，但是像String，Integer内部重写了该方法，比较的是值而非地址

### 7、String能被继承吗？为什么用final修饰？

- 不能被继承，因为 String 类有 **final 修饰符**，而 final 修饰的类是不能被继承的。 

- String 类是最常用的类之一，为了**效率，禁止被继承和重写**。 为了安全。String 类中有 **native** 关键字修饰的调用系统级别的本地方法，调用了操作系统的 API。如果方法可以重写，可能被植入恶意代码，破坏程序。。

### 8、StringBuffer 和StringBuilder的区别

- StringBuffer 与 StringBuilder 中的方法和功能完全是等价的， 

- 只是 StringBuffer 中的方法大都采用了 **synchronized** 关键字进行修饰，因此是线程安全的，而StringBuilder 没有这个修饰，可以被认为是线程不安全的。 
- 在单线程程序下，StringBuilder 效率更快，因为它不需要加锁，不具备多线程安全；而 StringBuffer则每次都需要判断锁，效率相对更低

### 9、final、finally、finalize

- final：修饰符（关键字）有三种用法：修饰类、变量和方法。**修饰类时**，意味着它不能再派生出新的子类，即**不能被继承**，因此它和 abstract 是反义词。**修饰变量**时，该变量使用中不被改变，必须在声明时给定初值，在引用中只能读取不可修改，即为**常量**。**修饰方法**时，也同样只能使用，**不能在子类中被重写**。
- finally：通常放在 try…catch 的后面构造最终执行代码块，这就意味着程序无论正常执行还是发生异常，这里的代码**只要 JVM 不关闭都能执行**，可以将释放外部资源的代码写在 finally 块中。 
- finalize：Object 类中定义的方法，Java 中允许使用 finalize() 方法在垃圾收集器，将对象从内存中清除出去之前做必要的清理工作。这个方法是由垃圾收集器在销毁对象前时调用的，通过重写 finalize() 方法可以整理系统资源或者执行其他清理工作。

### 10、Object中有哪些方法？

- protected Object clone() ---> 创建并返回此对象的一个副本。 
- boolean equals(Object obj) ---> 指示某个其他对象是否与此对象“相等 
- protected void finalize() ---> 当垃圾回收器确定不存在对该对象的更多引用时，由对象的垃圾回收器调用此方法。 
- Class<? extendsObject> getClass() ---> 返回一个对象的运行时类。 
- int hashCode() ---> 返回该对象的哈希码值。 
- void notify() ---> 唤醒在此对象监视器上等待的单个线程。 
- void notifyAll() ---> 唤醒在此对象监视器上等待的所有线程。 
- String toString() ---> 返回该对象的字符串表示。
- void wait() ---> 导致当前的线程等待，直到其他线程调用此对象的 notify() 方法或notifyAll() 方法。 
- void wait(long timeout) ---> 导致当前的线程等待，直到其他线程调用此对象的 notify() 方法或 notifyAll()方法，或者超过指定的时间量。 
- void wait(long timeout, int nanos) ---> 导致当前的线程等待，直到其他线程调用此对象的notify()方法或notifyAll()方法，或者已经过了指定的时间量。

### 11、 集合体系结构

### 12、ArrarList和LinkedList

- ArrayList 是实现了基于**动态数组**的数据结构，LinkedList 基于**链表**的数据结构。 
- 对于随机访问 **get 和 set**，ArrayList 效率优于 LinkedList，因为 LinkedList 要移动指针。 
- 对于新增和删除操作 add 和 remove，LinkedList 比较占优势，因为 ArrayList 要移动数据。 这一点要看实际情况的。若只对单条数据插入或删除，ArrayList 的速度反而优于 LinkedList。但若是批量随机的插入删除数据，LinkedList 的速度大大优于 ArrayList. 因为ArrayList每插入一条数据，要移动插入点及之后的所有数据。

### 13、HashMap底层是是什么？为什么要用数组+链表+红黑树的结构？

- 数组 Node<K,V>[] table指的是哈希表，根据对象的 key 的 hash 值进行在数组里面是哪个节点。 

- 链表的作用是解决hash冲突，将hash值取模之后的相同对象存在一个链表中，放在hash值对应的槽位 
- 红黑树： JDK8 使用红黑树来替代超过 8 个节点的链表，主要是查询性能的提升，从原来的 O(n)到 O(logn) 

- 通过 hash 碰撞，让HashMap不断产生碰撞，那么相同的 key 的位置的链表就会不断增长，当对这个Hashmap 的相应位置进行查询的时候，就会循环遍历这个超级大的链表，性能就会下降，所以改用红黑树

### 14、HashMap和HashTable

**线程安全性不同** 

- HashMap 是线程不安全的，HashTable 是线程安全的，其中的方法是Synchronized，在多线程并发的情况下，可以直接使用 HashTable，但是使用 HashMap时必须自己增加同步处理。 

**是否提供** **contains**方法 

- HashMap 只有 containsValue 和 containsKey 方法；HashTable 有 contains、 containsKey 和 containsValue 三个方法，其中 contains 和 containsValue 方法功能相同。 

**key**和**value**是否允许 **null**值 

- HashTable 中，key 和 value 都不允许出现 null 值。HashMap 中，null 可以作为键，这样的键只有一个；可以有一个或多个键所对应的值为 null。 

数组初始化和扩容机制 

- HashTable 在不指定容量的情况下，默认容量为 11，而 HashMap 为 16， 

- HashTable 不要求底层数组的容量一定要为 2 的整数次幂，而 HashMap 则要求一定为 2 的整数次幂。HashTable 扩容时，将容量变为原来的 2 倍加 1，而 HashMap 扩容时，将容量变为原来的 2 倍。

### 15、线程的几种创建方式

- 继承 Thread 类创建线程 

- 实现 Runnable 接口创建线程 

- 使用 Callable 和 Future 创建线程有返回值 
- 使用线程池创建线程

### 16、常见的几种IO流

### 17、常见的几种RuntimeException

- java.lang.NullPointerException：空指针异常；出现原因：调用了未经初始化的对象或者是不存在的对象。 

- java.lang.ClassNotFoundException：指定的类找不到；出现原因：类的名称和路径加载错误；通常都是程序试图通过字符串来加载某个类时可能引发异常。 
-  java.lang.NumberFormatException：字符串转换为数字异常；出现原因：字符型数据中包含非数字型字符。 
- java.lang.IndexOutOfBoundsException：数组角标越界异常，常见于操作数组对象时发生。 
- java.lang.IllegalArgumentException：方法传递参数错误。 
- java.lang.ClassCastException：数据类型转换异常。

### 18、谈谈你对反射的理解

**反射机制** 

- 所谓的反射机制就是 java 语言在运行时拥有一项自观的能力。通过这种能力可以 彻底了解自身的情况为下一步的动作做准备。 Java 的反射机制的实现要借助于 4 个类：**Class，Constructor，Field，Method**;其中，Class 代表的是类对象，Constructor指的是类的构造器对象，Field是类的属性对象，Method是类的方法对象。通过这四个对象我们可以粗略的看到一个类的各个组成部分

**Java反射的作用**

- 在 Java 运行时环境中，对于任意一个类，可以知道这个类有哪些属性和方法。对于任意一个对象，可以调用它的任意一个方法。这种动态获取类的信息，以及动态调用对象的方法的功能来自于 Java 语言的反射机制。 

**Java**反射机制提供功能 

- 在运行时判断任意一个对象所属的类。 
- 在运行时构造任意一个类的对象。 
- 在运行时判断任意一个类所具有的成员变量和方法。 
- 在运行时调用任意一个对象的方法

### 19、什么是 java序列化，如何实现java序列化？

序列化是一种用来处理对象流的机制，所谓对象流也就是将对象的内容进行流化。可以对流化后的对象进行读写操作，也可将流化后的对象传输于网络之间。序列化是为了解决在对象流进行读写操作时所引发的问题。 

序列化的实现：将需要被序列化的类实现 Serializable 接口。该接口没有需要实现的方法 ，implements Serializable 只是为了标注该对象是可被序列化的。然后使用一个输出流(例如：FileOutputStream)来构造一个 ObjectOutputStream(对象流) 对象。接着，使用 ObjectOutputStream 对象的 writeObject(Object obj)方法就可以将参数为obj的对象进行写出(即保存其状态)，要恢复的话，则可以使用输入流进行读入。

### 20、Http常见的状态码

| 状态码 |                           表示信息                           |
| :----: | :----------------------------------------------------------: |
|  200   |                        客户端请求成功                        |
|  301   |         永久性重定向，请求的资源已经被分配了新的URI          |
|  302   |         临时性重定向，请求的资源已经被分配了新的URI          |
|  400   | Bad Request：请求报文存在语法错误，即客户端请求有语法错误，不能被服务器所理解 |
|  401   |                         请求未经授权                         |
|  403   |               服务器收到请求，但是拒绝提供服务               |
|  404   |                        请求资源不存在                        |
|  500   |                   服务器发生不可预期的错误                   |
|  502   | 代理或网关的服务器从上游服务器接收到无效的响应。通常情况下，这意味着上游服务器正在经历故障或维护，无法提供有效的响应 |

## Java高级篇


