---
title: JDK8_CompletableFuture
---

## 什么是CompletableFuture？

CompletableFuture类的设计灵感来自于 `Google Guava` 的 [ListenableFuture](https://link.segmentfault.com/?enc=M5rjvS91JI5XsX%2Fk2ATgLA%3D%3D.U3qGkHtBfurr9c8KICaouVpoaGExvqRANnWWXLaH8sRy6AoU3oPwis%2BipL1Vym%2FrdJBfXrTC%2BhXC1ydLn5kr%2BBH6okjV3yPb2%2Fejg1aJLyozq6R4HCoe1eVVvLs3fNfB%2FrG6r3gh9BspX51WNqCCVQ%3D%3D) 类，它实现了 `Future` 和 `CompletionStage` 接口并且新增了许多方法，它支持 **lambda表达式**，通过回调利用非阻塞方法，提升了**异步编程**模型。它允许我们通过在与主应用程序线程不同的线程上（也就是异步）运行任务，并向主线程通知任务的进度、完成或失败，来编写非阻塞代码。

![image-20221117155238409](/img/backend/java/JDK8_CompletableFuture_1.png)

## 为什么引入CompletableFuture？

`Java` 的 1.5 版本引入了 `Future`，你可以把它简单的理解为运算结果的占位符，它提供了两个方法来获取运算结果。

- `get()`：调用该方法线程将会无限期等待运算结果。
- `get(long timeout, TimeUnit unit)`：调用该方法线程将仅在指定时间 `timeout` 内等待结果，如果等待超时就会抛出 `TimeoutException` 异常。

`Future` 可以使用 `Runnable` 或 `Callable` 实例来完成提交的任务，通过其源码可以看出，它存在如下几个问题：

- **阻塞** 调用 `get()` 方法会一直阻塞，直到等待直到计算完成，它没有提供任何方法可以在完成时通知，同时也不具有附加回调函数的功能。
- **链式调用和结果聚合处理** 在很多时候我们想链接多个 `Future` 来完成耗时较长的计算，此时需要合并结果并将结果发送到另一个任务中，该接口很难完成这种处理。
- **异常处理** `Future` 没有提供任何异常处理的方式。

而我们的**CompletableFuture**则成功地解决了上述的这些问题，下面将一一介绍**CompletableFuture**的一些常用的API方法的使用：

## CompletableFuture的API

首先CompletableFuture实现Future接口，故Future接口存在的常见方法它本身也存在，这里不再进行讲解，处理以外，它还提供了手动完成`complete()`方法，判断是否完成`isDon()`方法，取消执行`cancel()`等等。

### 1. 异步执行方法 runAsync/supplyAsync

runAsync接受的参数为Runnable参数，无返回值；而supplyAsync接受的参数则为Supplier，即有返回值的函数式接口，可以参考下表回顾一下函数式接口：

![image-20221117155238409](/img/backend/java/JDK8_CompletableFuture_2.png)

故我们简单编写一个方法，分别使用这两种异步任务的调用方式：

```java
public class TestCompletableFuture {
    public static void main(String[] args) {
      	//runAysnc
        testRunAsync();
      	//supplyAsync
        testSupplyAsync();
    }
    
    /**
     * 异步执行Code 无返回值
     */
    private static void testRunAsync() {
        CompletableFuture<Void> voidCompletableFuture = CompletableFuture.runAsync(() -> {
            System.out.println("runAsync...");
        });
    }

    /**
     * 异步执行Code 有返回值
     */
    private static void testSupplyAsync() {
        CompletableFuture<String> stringCompletableFuture = CompletableFuture.supplyAsync(() -> {
            try {
                TimeUnit.SECONDS.sleep(2);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            return "supplyAsync...";
        });
        try {
            //异步获取结果
            String result = stringCompletableFuture.get();
            System.out.println("result：" + result);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } catch (ExecutionException e) {
            throw new RuntimeException(e);
        }
    }
}
```

输出结果：

```java
runAsync...
result：supplyAsync...
```

### 2. 完成执行 whenComplete/whenCompleteAsync

当我们定义上面的runAsync或者supplyAsync方法执行完毕以后，可以调用**whenComplete**或者**whenCompleteAsync**继续执行任务，区别在于：

* whenComplete是有之前执行异步任务的线程继续执行任务，如果定义多个whenComplete，则它们之间是**链式串行调用**的关系
* whenCompleteAsync则是将任务提交到线程池中进行执行，如果定义多个whenCompleteAsync，则它们之间则是**并行调用**的关系

首先我们来看**whenComplete**的使用方法：

```java
main() {
  testWhenComplete();
}
private static void testWhenComplete() {
  CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> "Hello World");
  //定义两个whenComplete任务，此时会先执行01，再执行02
  future.whenComplete((res, error) -> {
    try {
      Thread.sleep(5000);
      System.out.println("whenComplete01");
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
  });
  future.whenComplete((res, error) -> {
    try {
      Thread.sleep(1000);
      System.out.println("whenComplete02");
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
  });
  System.out.println("completed...");
}
```

输出结果：

```java
//sleep 5s
whenComplete01
//sleep 1s  
whenComplete02
completed...
```

然后我们再来看**whenCompleteAsync**的使用方法：

```java
main() {
  testWhenCompleteAsync();
}

private static void testWhenCompleteAsync() {
  CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> "Hello World");
  //此时定义两个whenCompleteAsync，在future执行完毕以后，两者并发执行
  future.whenCompleteAsync((res, error) -> {
    try {
      Thread.sleep(5000);
      System.out.println("whenComplete01");
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
  });
  
  future.whenCompleteAsync((res, error) -> {
    try {
      Thread.sleep(1000);
      System.out.println("whenComplete02");
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
  });
  
  System.out.println("completed...");
  try {
    Thread.sleep(10000);
  } catch (InterruptedException e) {
    e.printStackTrace();
  }
}
```

输出结果：

```java
completed...
//sleep 1s  
whenComplete02
//sleep 4s  
whenComplete01
```

### 3. 链式执行任务 thenCompose/thenApply

两者均可将CompletableFuture连接起来，但是存在一些差异：

* thenApply()接收的是前一个调用返回的结果，然后对该结果进行处理。
* thenCompose()接收的是前一个调用的stage，返回flat之后的的CompletableFuture，即将上一个Future的执行结果作为下一个Future的输入

**thenApply方法**：

```java
main() {
  testThenApply();
}
private static void testThenApply() {
  CompletableFuture<String> completableFuture = CompletableFuture
    .supplyAsync(() -> "Hello")
    //s为上个任务的结果，可对其进行处理
    .thenApply(s -> s + "World");
  try {
    String result = completableFuture.get();
    System.out.println(result);
  } catch (InterruptedException e) {
    e.printStackTrace();
  } catch (ExecutionException e) {
    e.printStackTrace();
  }
}
```

输出结果：

```java
HelloWorld
```

**thenCompose方法**：

```java
main(){
  testThenCompose();
}
private static void testThenCompose() {
  CompletableFuture<String> stringCompletableFuture = CompletableFuture
    .supplyAsync(() -> "Hello")
    //s即为上一个CompletableFuture的输出结果
    .thenCompose(s -> CompletableFuture.supplyAsync(() -> s + "World"));
  try {
    String result = stringCompletableFuture.get();
    System.out.println(result);
  } catch (InterruptedException e) {
    e.printStackTrace();
  } catch (ExecutionException e) {
    e.printStackTrace();
  }
}
```

输出结果：

```java
HelloWorld
```

### 4. 合并处理 thenCombine/thenAcceptBoth

两个合并的方法本质上的区别在于thenCombine有返回值，而thenAcceptBoth无返回值

```java
public class TestCompletableFuture {
    public static void main(String[] args) {
        //有返回值的合并操作
        testThenCombine();
        //无返回值的合并操作
        testThenAcceptBoth();
    }

    private static void testThenAcceptBoth() {
        CompletableFuture.supplyAsync(() -> "Hello")
                .thenAcceptBoth(
                    CompletableFuture.supplyAsync(() -> "World"), (s1, s2) -> System.out.println(s1 + s2)
        );
    }

    private static void testThenCombine() {
        CompletableFuture<String> completableFuture = CompletableFuture.supplyAsync(() -> "Hello")
                .thenCombine(
                        CompletableFuture.supplyAsync(() -> "World"), (c1, c2) -> c1 + c2
                );
        try {
            String result = completableFuture.get();
            System.out.println(result);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
    }
}
```

输出结果：

```java
HelloWorld
HelloWorld
```

### 5. 聚合处理 allOf/anyOf

我们需要并行执行任务时，通常我们需要**等待所有的任务都执行完毕再去处理其他的任务**，那么我们可以用到allOf，等同于 **CountDownLatch**闭锁。而anyOf则是任务中有一个完成则直接去处理其他的任务，无需再等待其他任务执行完毕。

**allOf方法：**

```java
public class TestCompletableFuture {
    public static void main(String[] args) {
        testAllOf();
    }

    private static void testAllOf() {
        //定义三个任务
        CompletableFuture<Void> future1 = CompletableFuture.runAsync(() -> System.out.println("task1 running"));
        CompletableFuture<Void> future2 = CompletableFuture.runAsync(() -> System.out.println("task2 running"));
        CompletableFuture<Void> future3 = CompletableFuture.runAsync(() ->
        {
            try {
                //模拟延迟任务
                Thread.sleep(5000);
                System.out.println("task3 running");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
        //合并三个任务
        CompletableFuture<Void> future = CompletableFuture.allOf(future1, future2, future3);
        System.out.println("task waiting...");
        //等待所有任务执行完毕
        future.join();
        System.out.println("task completed");
    }
}
```

输出结果：

```java
task1 running
task2 running
task waiting...
//waiting about 5s
task3 running
task completed
```

**anyOf方法：**

```java
public class TestCompletableFuture {
    public static void main(String[] args) {
        testAnyOf();
    }

    private static void testAnyOf() {
        CompletableFuture<Void> future1 = CompletableFuture.runAsync(
                () -> {
                    try {
                        Thread.sleep(5000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    System.out.println("task1 running...");
                }
        );
        CompletableFuture<Void> future2 = CompletableFuture.runAsync(
                () -> {
                    try {
                        Thread.sleep(2000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    System.out.println("task2 running...");
                }
        );
        CompletableFuture<Void> future3 = CompletableFuture.runAsync(
                () -> {
                    try {
                        Thread.sleep(3000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    System.out.println("task3 running...");
                }
        );
        //只要有一个任务执行完毕，即不再等待...
        CompletableFuture<Object> completableFuture = CompletableFuture.anyOf(future1, future2, future3);
        System.out.println("task waiting...");
        completableFuture.join();
        System.out.println("task completed");
    }
}
```

输出结果：任务2完毕继续其他任务，不再等待任务1和任务3

```java
task waiting...
task2 running...
task completed
```

### 6. 多任务返回值联合处理 join 

```java
public class TestCompletableFuture {
    public static void main(String[] args) {
        testJoin();
    }

    private static void testJoin() {
        CompletableFuture<String> future1 = CompletableFuture.supplyAsync(() -> "Hello");
        CompletableFuture<String> future2 = CompletableFuture.supplyAsync(() -> "World");
        CompletableFuture<String> future3 = CompletableFuture.supplyAsync(() -> "Future");
        //对三个任务的返回值进行join处理
        String result = Stream.of(future1, future2, future3)
                .map(CompletableFuture::join)
                .collect(Collectors.joining(" "));
        System.out.println(result);
    }
}
```

输出结果：

```java
Hello World Future
```

### 7. 异常处理 handle(result, exception)

我们在异步任务过程中可以抛出异常，并通过handle进行异常处理：

```java
public class TestCompletableFuture {
    public static void main(String[] args) {
        testHandle();
    }

    /**
     * 异常处理
     */
    private static void testHandle() {
        //模拟参数为null
        String param = null;
        CompletableFuture<String> completableFuture = CompletableFuture.supplyAsync(() -> {
            if (param == null) {
                throw new RuntimeException("params_error");
            }
            return "Hello" + param;
        }).handle((res, ex) -> res != null ? res : ex.getMessage());

        try {
            String result = completableFuture.get();
            System.out.println(result);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
    }
}
```

以上就是CompletableFuture的常见的一些API，当然还有很多其他一些API方法，这里不再赘述，可以查看对应的API文档进行使用...