---
title: Stream流
---

## 介绍

Stream流是一种**数据渠道**，是用于操作数据源（**集合，数组等**）生成的元素序列。Stream主要用于对于集合迭代器的增强，使之能够完成更加高效的**聚合操作**（例如：过滤，排序，统计分组等等），或者大批量数据的操作。此外Stream流和lambda表达式的结合使用可以大大增强编码的效率，可读性很强。

注意：

* 流是**一次性的，它自己不会存储元素**
* 流**不会改变源对**象，相反，他们会返回**一个持有结果的新的Strean流**
* 流操作时**延迟执行**的，这就意味着他们会等到需要结果的时候才去执行
* 流**不可以重复使用**

## 并行流和串行流

**并行流**就是把一个内容分成多个数据块，并用**不同的线程**分别处理每个数据块的流。

Java8中将并行进行了优化，我们可以很容易的对数据进行并行操作。Stream API 可以声明性地通过**parallel() 与sequential()** 在并行流与顺序流之间进行切换。

## 创建流的三种方式

```java
public class CreateStream {
    public static void main(String[] args) {
        //第一种方式：使用集合对象创建流
        List<Integer> list = Arrays.asList(1, 2, 3);
        Stream<Integer> stream1 = list.stream();
        
        //第二种方式：使用数组创建流 Arrays.stream()将数组转成一个流
        IntStream stream2 = Arrays.stream(new int[]{1, 2, 3});
        
        //第三种方式：使用Stream.of()，底层还是采用了Arrays.stream()
        Stream<Integer> stream = Stream.of(1, 2, 3);
    }
}
```

除了传统的流，还有两种比较特殊的流：

* **空流**： **Stream.empty()**
* **无限流**：**Stream.generate()和Stream.iterator()**。可以配合limit进行使用，限制流的数量

```java
// 接受一个 Supplier 作为参数
Stream.generate(Math::random).limit(10).forEach(System.out::println);
// 初始值是 0，新值是前一个元素值 + 2
Stream.iterate(0, n -> n + 2).limit(10).forEach(System.out::println);
```

**总结来说：**

在Java8中的Collection接口中已经扩展了两种获取流的方式：

```java
stream():	返回一个顺序流
parallelStream():	返回一个并行流
```

同时Java8中的Arrays的静态方法stream()可以获取数组流：

```java
static < Stream<T> stream(T[] array): 返回一个流
```

重载形式，能够处理对应基本类型的数组：

```java
public static IntStream stream(int[] array)
public static LongStream stream(long[] array)
public static DoubleStream stream(double[] array)
```

我们还可以显示化的使用静态方法创建一个流：

```java
public static<T> Stream<T> of(T... values)values): 返回一个流
```

利用静态方法Stream.iterate()和Stream.generate()来创建无线流：

```java
迭代
public static<T> Stream<T> iterate(final T seed, final UnaryOperator<T> f)
生成
public static<T> Stream<T> generate(Supplier<T> s):
```

## 流的特性

1. **不存储数据**
2. **不会改变数据源**
3. **不可以重复使用**

我们通过代码进行演示：

### 1. Steam流的简单使用：

```java
@Test
public void test01() {
    List<Integer> list = Arrays.asList(1, 6, 3, 5, 2, 4);
    List<Integer> collect = list.stream().filter(item -> item > 3).sorted().collect(Collectors.toList());
    System.out.println(collect);
}
```

**输出结果：**

```java
[4, 5, 6]
```

### 2. Stream流不会改变数据源：

```java
ublic void test02() {
    List<Integer> list = Arrays.asList(1, 6, 3, 5, 2, 4);
    List<Integer> collect = list.stream().filter(item -> item > 3).sorted().collect(Collectors.toList());
    //打印源数据
    System.out.println(list);
}
```

**输出结果：**

```java
[1, 6, 3, 5, 2, 4]
```

### 3. 流不可以重复使用

```java
@Test
public void test03() {
    List<Integer> list = Arrays.asList(1, 6, 3, 5, 2, 4);
    Stream<Integer> stream = list.stream();
    Stream<Integer> newStream = stream.filter(item -> item > 3);
    stream.skip(1);
}
```

**输出结果：**

```java
java.lang.IllegalStateException: stream has already been operated upon or closed
```

## Stream流的操作类型

### 第一步：创建流（Stream）

一个数据源，例如：集合，数组等等，获取一个流

```java
String[] arr = {"zhangsan", "lisi", "wangwu", "xxd"};
//数组创建流的方式
//1、使用Array.stream()创建流
Stream<String> stream1 = Arrays.stream(arr);
//2、使用Stream.of()创建流，底层依旧采用Arrays.stream方法
Stream<String> stream2 = Stream.of(arr);

//集合本省继承了流，使用stream()可以创建一个流
List<String> list = Arrays.asList(arr);
Stream<String> stream3 = list.stream();

//Map可以分别通过keySet()和values()来创建对应的流
Map<Integer, String> map = list.stream().collect(Collectors.toMap(String::length, x -> x));
Stream<Map.Entry<Integer, String>> stream4 = map.entrySet().stream();
Stream<String> stream5 = map.values().stream();
```

### 第二步：中间操作

一个中间操作链，数据源的数据进行处理

多个**中间操作**可以连接起来形成一个**流水线**，除非流水线上触发了终止操作，否则**中间操作不会执行任何处理！**，则在**终止操作时一次性全部处理，称为“惰性求值”。**

#### 筛选和切片

|         方法          |                             描述                             |
| :-------------------: | :----------------------------------------------------------: |
| filter（Predicate p） |                接收Lambda，从流中排除某些元素                |
|     distinct（）      |  筛选，通过流所生成的元素的hashCode()和equals()去除重复元素  |
| limit（long maxSize） |                截断流，使其元素不超过给定元素                |
|    skip（long n）     | 跳过元素，返回一个扔掉了前n个元素的流，若流中元素不足n个，则返回一个空气流，与limit（n）互补 |

#### 映射

|              方法               |                             描述                             |
| :-----------------------------: | :----------------------------------------------------------: |
|        map（Function f）        | 接收一个函数作为参数，该函数会被应用到每个元素上，并将其映射成一个新的元素。 |
| mapToDouble(ToDoubleFunction f) | 接收一个函数作为参数，该函数会被应用到每个元素上，产生一个新的DoubleStream 。 |
|    mapToInt(ToIntFunction f)    | 接收一个函数作为参数，该函数会被应用到每个元素上，产生一个新的IntStream 。 |
|   mapToLong(ToLongFunction f)   | 接收一个函数作为参数，该函数会被应用到每个元素上，产生一个新的LongStream 。 |
|       flatMap(Function f)       | 接收一个函数作为参数，将流中的每个值都换成另一个流，然后把所有流连接成一个流 |

#### 排序

|           方法            |                  描述                  |
| :-----------------------: | :------------------------------------: |
|        sorted（）         |   产生一个新流，其中按照自然顺序排序   |
| sorted（Comparator comp） | 产生一个新流，其中按照比较器的顺序排序 |

## 

### 第三步：终止操作

一个终止操作，执行中间操作链，并产生结果

steam流的大致执行流程即如下所示：

![在这里插入图片描述](https://img-blog.csdnimg.cn/0e9f01506b8e424884d46b079bfd7e34.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1NtYWxsUGlnX0NvZGU=,size_16,color_FFFFFF,t_70#pic_center)

#### 查找与匹配

|           方法           |           描述           |
| :----------------------: | :----------------------: |
| allMatch（Predicate p）  |   检查是否匹配所有元素   |
| anyMatch（Predicate p）  | 检查是否至少匹配一个元素 |
| noneMatch（Predicate p） |  检查是否没有匹配的元素  |
|      findFirst（）       |      返回第一个元素      |
|        finAny（）        |  返回当前流中的任意元素  |
|        count（）         |    返回流中的元素总数    |
|   max（Comparator c）    |     返回流中的最大值     |
|   min（Comparator c）    |     返回流中的最小值     |
|  forEach（Consumer c）   |         内部迭代         |

#### 归约

|                方法                 |                      描述                       |
| :---------------------------------: | :---------------------------------------------: |
| reduce（T iden，BinaryOperator  b） | 可以将流中的元素反复结合起来，得到一个值，返回T |

备注：因为map和reduce的连接通常称为**map-reduce模式**

#### 收集

|          方法          |                             描述                             |
| :--------------------: | :----------------------------------------------------------: |
| collect（Collector c） | 将流转换为其他形式。接收一个**Collector 接口**的实现，用于给Stream 中元素做汇总的方法 |

## Stream流的实战操作

说了这么多理论相关，其实还是在日常使用中进行使用更加接地气一些，这里列举几个通俗的场景，通过Stream流帮助我们快速掌握其使用的方法：

### 场景1: 过滤操作 filter

给定我们一个字符串数组，先将其转换成List集合形式，然后，我们使用Stream流过滤包含“林”的字符串，将其进行终端操作再收集成一个字符串的集合。

```java
String[] arr = {"zhangsan", "lisi", "wangwu", "xxd", "lisi", "周杰伦", "林俊杰", "许嵩", "林俊杰", "林志颖"};
List<String> list = Arrays.asList(arr);
//Predicate<? super T> predicate：接收一个输入参数返回布尔类型结果的函数式接口
List<String> res = list.stream().filter(e -> e.contains("林")).collect(Collectors.toList());
//Consumer<? super T> action：接收一个输入参数，并且无返回值的操作，这里使用类名::方法名进行输出
res.forEach(System.out::println);
```

输出结果：

```java
林俊杰
林俊杰
林志颖
```

### 场景2：映射操作 map

我们这里需要统计字符串数组中每一个元素的长度，将其返回成一个新的结果集

```java
String[] arr = {"周杰伦", "林俊杰", "许嵩", "林俊杰", "林志颖"};
List<String> list = Arrays.asList(arr);
//map(Function<? super T, ? extends R> mapper)：接收一个输入参数为T，返回结果为R的函数式接口
List<Integer> lens = list.stream().map(String::length).collect(Collectors.toList());
lens.forEach(System.out::println);
```

输出结果：

```java
3
3
2
3
3
```

### 场景3：匹配操作

```java
String[] arr = {"zhangsan", "lisi", "wangwu", "xxd", "lisi", "周杰伦", "林俊杰", "许嵩", "林俊杰", "林志颖"};
List<String> list = Arrays.asList(arr);
/**
  * anyMatch():只要任意一个元素匹配，返回true
  * allMatch():需要全部匹配才返回true，否则返回false
  * noneMatch():全部都不匹配才返回false，否则返回true
  */
boolean anyMatch = list.stream().anyMatch(e -> e.contains("林"));
System.out.println(anyMatch);
boolean allMatch = list.stream().allMatch(e -> e.contains("林"));
System.out.println(allMatch);
boolean noneMatch = list.stream().noneMatch(e -> e.contains("风"));
System.out.println(noneMatch);
```

输出结果：

```java
true
false
true
```

### 场景4：归约操作 reduce

```java
String[] arr = {"周杰伦", "和", "许嵩", "，林俊杰", "是实力歌手"};
List<String> list = Arrays.asList(arr);
Optional<String> optional = list.stream().reduce((a, b) -> a + b);
if (optional.isPresent()) {
  System.out.println(optional.get());
}
```

输出结果：

```java
周杰伦和许嵩，林俊杰是实力歌手
```

### 场景5：合并/转换操作

日常我们可能需要对List进行操作，将其变成一个String字符串，或者是Map；又或者我们拿到一个Map集合，需要收集它的Key或者Value，将其变成一个List集合等

**List -> String**

```java
String[] arr = {"周杰伦", "许嵩", "林俊杰", "陈奕迅"};
List<String> list = Arrays.asList(arr);
String res = list.stream().collect(Collectors.joining(", ")).toString();
System.out.println(res);
```

输出结果：

```java
周杰伦, 许嵩, 林俊杰, 陈奕迅
```

**List -> Map**

```java
ArrayList<Student> list = Lists.newArrayList();
list.add(new Student(1,"zhang"));
list.add(new Student(2,"li"));
list.add(new Student(3,"wang"));
list.add(new Student(4,"zhao"));
list.add(new Student(5,"sun"));
list.add(new Student(6,"xdm"));
list.add(new Student(1,"newZhang"));
//list ==> map
Map<Integer, Student> studentMap = list.stream().collect(Collectors.toMap(Student::getAge, x -> x));
System.out.println(studentMap);
LinkedHashMap<Integer, Student> linkedHashMap = list.stream().collect(Collectors.toMap(Student::getAge, x -> x, (k, v) -> v, LinkedHashMap::new));
System.out.println(linkedHashMap);
```

输出结果：

```java
{1=Student(age=1, name=newZhang), 2=Student(age=2, name=li), 3=Student(age=3, name=wang), 4=Student(age=4, name=zhao), 5=Student(age=5, name=sun), 6=Student(age=6, name=xdm)}
```

**Map -> List**

```java
Map<Integer, Student> map = new HashMap<>();
for (int i = 0; i < 5; i++) {
  map.put(i, new Student(i, "student" + i));
}
//map ==> list
List<Integer> ageList = map.keySet().stream().collect(Collectors.toList());
List<Student> studentList = map.values().stream().collect(Collectors.toList());
System.out.println(ageList);
System.out.println(studentList);
```

```java
[0, 1, 2, 3, 4]
[Student(age=0, name=student0), Student(age=1, name=student1), Student(age=2, name=student2), Student(age=3, name=student3), Student(age=4, name=student4)]
```











