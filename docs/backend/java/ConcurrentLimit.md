---
title: 限制并发数执行任务
---

## 背景

在实际项目中，我们经常遇到**多任务并发执行**的情况，而对于多任务并发执行，一般采取的策略即创建**线程池**来执行对应的任务。但是对于特定场景这样实现存在着一些问题，比如说我们此时存在3个任务，第一个任务体很大，使用线程池执行该任务，几乎消耗掉线程池中所有的线程，而对于后续请求的第二个和第三个任务体来说，就没有线程提供给他们使用了，即使这两个任务体可能只存在很小的任务量，也只能等待下去。另外的问题就是用户方可能存在对特定任务执行配置相应的**并发数**（这里其实是最大并发数，这个在后面会进行讲解）来并发执行的特定需求。故基于这两点，我们需要设计对应的限制并发数执行的多任务并发执行的实现。

## 业务实现

这里简单通过一个例子来逐步实现限制并发数执行多任务。假设此时存在一个任务体TaskContent，任务即是需要我们打印其中的信息：

```java
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class TaskContent {
   
    private Integer id;

    private String taskId;
  
    private String name;
    
}
```

```java
private void execute(int index, CopyOnWriteArrayList<TaskContent> list) {
  TaskContent taskContent = list.get(index);
  //当第4个任务，让其等待5秒（模拟该任务执行较慢的情况...）
  if (index == 4) {
    try {
      Thread.sleep(5000);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
  }
  //打印任务体信息
  System.out.println(taskContent.getName() + "executing...");
}
```

然后定义一个上下文参数类**TaskContext**，里面除了任务体以外，还存在用户指定的并发数**threadCount**：

```java
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class TaskContext {

    /**
     * 任务体信息
     */
    private List<TaskContent> tasks;

    /**
     * 并发数
     */
    private Integer threadCount;

}
```

### 方式1：固定线程池【错误案例】

首先我们定义**固定线程池**来实现限制并发数的目的：

```java
public void executeTaskByFixThreadPool(TaskContext taskContext) {
  //获取并发数
  int threadCount = taskContext.getThreadCount();
  //获取任务体集合
  List<TaskContent> tasks = taskContext.getTasks();
  //创建固定大小的线程池
  ExecutorService threadPool = Executors.newFixedThreadPool(threadCount);
  //设置CountDownLatch
  final CountDownLatch countDownLatch = new CountDownLatch(tasks.size());
  //定义原子类索引，初始化0
  AtomicInteger index = new AtomicInteger(0);
  for(int i = 0; i < tasks.size(); i++) {
    threadPool.submit(() -> {
      //打印当前线程信息
      log.info("current thread: {}", Thread.currentThread().getName());
      try {
        //执行第index个任务
        execute(index.getAndIncrement(), taskContext);
      }finally {
        //关键，finally里将countDownLatch计数器减1
        countDownLatch.countDown();
      }
    });
  }
  //所有任务执行完毕之前，一致处理等待【闭锁状态】
  try {
    countDownLatch.await();
    System.out.println("task Completed...");
  } catch (InterruptedException e) {
    log.error("export action was interrupted!", e);
  }
}
```

我们模拟100个任务进行测试：

```java
@Test
public void threadClient() {
  //初始化模拟100个任务
  List<TaskContent> list = new ArrayList<>();
  for(int i = 0; i < 100; i++) {
    TaskContent taskContent = TaskContent.builder()
      .id(i)
      .taskId(UUID.randomUUID().toString())
      .name("thread" + i)
      .build();
    list.add(taskContent);
  }
	//定义任务上下文参数
  TaskContext taskContext = TaskContext.builder()
    .threadCount(5)
    .tasks(list)
    .build();
 //执行该分组任务
  executeTaskByFixThreadPool(taskContext);
}
```

通过测试，发现能够固定线程数执行，但是上面的执行逻辑对于我们的需求背景来说，是背道相驰的！！！因为来了一个任务，我们就给它对应的线程数，如果100个任务过来，每个任务配置了并发数为5，则就开启了500个线程，此时对于项目的负荷是很大的，我们需要在固定线程数的线程池中取对应数量的线程数来执行任务，如果此时线程数已经消耗殆尽，再来了一个任务，配置了并发数为5，那此时它只能等待线程池的线程释放才能继续获取线程执行任务；如果线程池还有两个任务，那么此时配置了并发数为5的任务也只能使用2个线程来执行任务，这样来说是比较合理的。

### 方式2 ：循环 + 线程池

首先我们使用SpringBoot自带的线程池**ThreadPoolTaskExecutor**，定义对应的配置类，设置核心线程10，最大线程20，阻塞队列10

```java
@Configuration
public class ThreadPoolTaskExecutorConfig {
    @Bean
    public ThreadPoolTaskExecutor executor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        //获取处理器虚拟机的最大数量
        //int coreSize = Runtime.getRuntime().availableProcessors();
        //设置核心线程数
        executor.setCorePoolSize(10);
        //设置最大线程数
        executor.setMaxPoolSize(20);
        //设置核心线程外的线程存活时间
        executor.setKeepAliveSeconds(60);
        //如果传入值大于0，则底层阻塞队列使用LinkedBlockingQueue，否则默认使用SynchronousQueue
        executor.setQueueCapacity(10);
        //设置线程前缀
        executor.setThreadNamePrefix("thread_demo-");
        //设置拒绝策略
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.AbortPolicy());
        return executor;
    }
}
```

此时，我们循环+线程池的策略是：获取任务体集合，将其除以并发数，得到循环的次数，假设有任务体存在10个任务，配置的并发数为3，则此时循环次数为4次，那么第1次到第3次，我们使用从线程池中提取五个线程执行任务，而第4次则使用1个线程执行任务：

```java
public void executeTask(TaskContext taskContext) {
  //获取任务总数
  int totalCount = taskContext.getTasks().size();
  //获取设置的并发数
  int threadCount = taskContext.getThreadCount();
  //初始化当前线程数
  int currentThreadCount = 0;
  //初始化完成线程数
  AtomicInteger finishThreadCount = new AtomicInteger(INIT_INDEX);
  int cycleCount = NumberUtil.div(Convert.toBigDecimal(totalCount),
                                  Convert.toBigDecimal(threadCount),
                                  0, RoundingMode.CEILING).intValue();
  for(int i = 0; i < cycleCount; i++) {
    //判断是否为最后一次，如果不是，当前线程数仍为threadCount，如果是最后一次，则为size - finishThreadCount(可能不足threadCount)
    if (finishThreadCount.get() + threadCount < totalCount) {
      //此时不是最后一次
      currentThreadCount = threadCount;
    }else {
      //最后一次
      currentThreadCount = totalCount - finishThreadCount.get();
    }
    //设置闭锁
    final CountDownLatch countDownLatch = new CountDownLatch(currentThreadCount);
    for (int j = 0; j < currentThreadCount; j++) {
      threadPool.execute( () -> {
        try {
          log.info("current thread: {}", Thread.currentThread().getName());
          execute(finishThreadCount.getAndIncrement(), taskContext);
        }finally {
          countDownLatch.countDown();
        }
      });
    }
    //等待上述任务都执行完毕
    try {
      countDownLatch.await();
      System.out.println("task Completed...");
    } catch (InterruptedException e) {
      log.error("export action was interrupted!", e);
    }
  }
}
```

但是这种方式还是存在一定的问题，比如现在10个任务，设置并发数为5，则循环次数为2，在第一次循环过程中，如果任务1到4快速完成，而任务5卡住了，执行很慢，那么由于**CountDownLatch**的存在，第2次循环的5个任务将一直等待第5个任务执行完毕，CountDownLatch释放才可以继续执行下去，这一点很消耗性能。需要改进实现的逻辑。

### 方式3：循环 + 线程池 plus

这里改进的策略是：获取设置的并发数以后，创建指定并发数的for循环；在for循环中，每一项都单独开启一条线程执行任务，但是在执行任务之前，会while循环从queue队列中获取数据，如果队列不为空，则执行完当前任务后，继续获取下一个任务执行，同时for循环的每一个线程又是并行独立的，这样就实现了既定义了指定的线程数，又不需要等待的问题，如果此时存在100个任务，并发数为5，任务4需要消耗大量时间，那么也只是5条线程中某一个执行较慢，而另外四条线程则快速执行完剩余的99个任务，最后等待这一个任务执行完毕，释放CountDownLatch即可，相比之前的逻辑，性能上大大提升，也满足实际的限制并发数的需求，并取自同一个线程池。

```java
public void executeTaskPlus(TaskContext taskContext) {
  //获取任务体集合
  List<TaskContent> tasks = taskContext.getTasks();
  //定义阻塞队列ArrayBlockingQueue，存储任务体集合
  ArrayBlockingQueue<TaskContent> queue = new ArrayBlockingQueue<>(tasks.size());
  queue.addAll(tasks);
  //定义闭锁
  CountDownLatch countDownLatch = new CountDownLatch(taskContext.getTasks().size());
  //获取并发数
  int threadCount = taskContext.getThreadCount();
  for (int i = 0; i < threadCount; i++) {
    threadPool.execute(() -> {
      while (!queue.isEmpty()) {
        try {
          execute(queue.remove());
          log.info("thread Name: {}", Thread.currentThread().getName());
        }finally {
          countDownLatch.countDown();
        }
      }
    });
  }
  try {
    countDownLatch.await();
    System.out.println("task Completed...");
  } catch (InterruptedException e) {
    log.error("export action was interrupted!", e);
  }
}
```

### 方式4：CompletableFuture实现

使用**CompletableFuture**简化闭锁逻辑。

#### 1、首先我们不限制并发数来实现：

```java
/**
 * 不限制并发数【直接使用线程池】，使用CompletableFuture实现CountDownLatch
 * @param taskContext
 */
public void executeTask(TaskContext taskContext) {
  List<TaskContent> tasks = taskContext.getTasks();
  
  List<CompletableFuture<Void>> futures = tasks.stream().map(taskContent -> CompletableFuture.runAsync(
    () -> {
      //执行任务
      execute(taskContent);
    }, threadPool)).collect(Collectors.toList());

  CompletableFuture<Void> allFuture = CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]));
  allFuture.join();
  System.out.println("task Completed...");
}
```

#### 2、限制并发数来实现：

```java
/**
 * 限制并发数，使用CompletableFuture实现CountDownLatch
 */
public void executeTask(TaskContext taskContext) {
  List<TaskContent> tasks = taskContext.getTasks();
  //定义阻塞队列，添加任务列表
  BlockingQueue<TaskContent> queue = new ArrayBlockingQueue<>(tasks.size());
  queue.addAll(tasks);
  //定义CompletableFuture阻塞队列，实现CountDownLatch
  BlockingQueue<CompletableFuture<Void>> futures = new ArrayBlockingQueue<>(tasks.size());
  //获取并发数
  int threadCount = taskContext.getThreadCount();
  for (int i = 0; i < threadCount; i++) {
    //在限制的并发数中创建对应的CompletableFuture，并保存到futures
    CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
      while (!queue.isEmpty()) {
        execute(queue.remove());
      }
    }, threadPool);
    //增加future至futures
    futures.add(future);
  }
  CompletableFuture<Void> allOf = CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]));
  allOf.join();
  System.out.println("task completed...");
}
```

