---
title: Okhttp3原理分析
---

## Okhttp3简介

目前，市面上存在着很多的接口测试工具，例如：Apifox，Eolink，Postman等。对于接口测试而言，主流的测试接口当属于http接口。而用户定义的一个个http接口用例会通过web端的层层处理，再通过专门的http执行器进行请求的调用与响应结果的处理，最后展现给用户则是http接口用例调用的结果信息，比如接口的请求头，请求体，响应头，响应体，响应时间，请求地址等等若干参数。

在实际http执行器中，通常会选用一款网络请求框架，比如今天要讲的square公司的Okhttp3框架，它普遍使用在Andriod中（从Android4.4开始，**httpURLconnection**的底层实现采用的就是okhttp）。它的主体两个部分就是**分发器Dispatcher**和**拦截器Interceptor**。

## Okhttp3简单入门

入门Okhttp3其实十分简单，来SpringBoot项目为例，我们初始化一个SpringBoot项目以后，只需要添加Okhtttp3的maven依赖：

```java
  <dependency>
    <groupId>com.squareup.okhttp3</groupId>
    <artifactId>okhttp</artifactId>
    <version>3.12.0</version>
  </dependency>
```

然后，额哦们只需要初始化一个okhttpClient即可进行网络请求的调用执行：

```java
//第一步，需要创建一个OkhttpClient
OkHttpClient okHttpClient = new OkHttpClient();
//第二步，创建Request请求
Request request = new Request.Builder().url("www.baidu.com").build();
//第三步，通过newCall获取一个Call对象，然后使用execute()进行同步请求
Response response = okHttpClient.newCall(request).execute();
//或者可以使用enqueue进行异步请求
okHttpClient.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(@NotNull Call call, @NotNull IOException e) {
            }

            @Override
            public void onResponse(@NotNull Call call, @NotNull Response response) throws IOException {

            }
        });
//第四步：获取结果的响应体内容
System.out.println(response.body().string());
```

## Okhttp3的同步/异步请求

Okhttp3源码中主要的两个环节就是请求执行和任务处理两个部分。其中，请求执行分为了同步和异步执行两种方式：

同步请求：

```java
//第一步，需要创建一个OkhttpClient
OkHttpClient okHttpClient = new OkHttpClient();
//第二步，创建Request请求
Request request = new Request.Builder().url("https://www.baidu.com").build();
//第三步，执行请求
Response response = okHttpClient.newCall(request).execute();
System.out.println(response.body().string());
```

异步请求：

```java
//第一步，需要创建一个OkhttpClient
OkHttpClient okHttpClient = new OkHttpClient();
//第二步，创建Request请求
Request request = new Request.Builder().url("https://www.baidu.com").build();
//第三步，执行请求
okHttpClient.newCall(request).enqueue(new Callback() {
    @Override
    public void onFailure(@NotNull Call call, @NotNull IOException e) {
        System.out.println("请求失败");
    }

    @Override
    public void onResponse(@NotNull Call call, @NotNull Response response) throws IOException {
        System.out.println(response.body().string());
    }
});
```

其中，我们首先看下**同步请求**的代码流程，它比较简单，底层通过**RealCall类**进行任务执行：

```java
override fun execute(): Response {
  check(executed.compareAndSet(false, true)) { "Already Executed" }

  timeout.enter()
  //监听器的请求开始处理环节
  callStart()
  try {
    //通过分发器进行任务执行
    client.dispatcher.executed(this)
    //调用责任链，后面会讲到
    return getResponseWithInterceptorChain()
  } finally {
     // 分发器进行finished操作：这个方法后面再细讲
    client.dispatcher.finished(this)
  }
}
```

然后再进入分发器中，查看器executed执行方法，发现其只做了一件事情，那就是将请求放到了**runningSyncCalls**当中，该队列是一个双端队列，这里将其放置在尾部。

此时，肯定想问，那后续Okhttp3是如何从队列中获取到对应的任务进行执行呢？这个我们后续再说....

接下来我们来看下**异步请求**的处理过程，同样，是使用RealCall类调用对应方法，这里前两步是相同的操作，第三步则是将原始Call进行AsyncCall的再封装，最后调用enqueue方法。

```java
override fun enqueue(responseCallback: Callback) {
  check(executed.compareAndSet(false, true)) { "Already Executed" }
  //监听器的callStart步骤  
  callStart()
  //唯一区别：这里使用分发器的enqueue方法，并将CallBack封装为了一个AsyncCall对象
  client.dispatcher.enqueue(AsyncCall(responseCallback))
}
```

接着，我们进入enqueue方法：

```java
internal fun enqueue(call: AsyncCall) {
  synchronized(this) {
    //将请求加入到准备队列中，而非执行队列中
    readyAsyncCalls.add(call)
    // 这里如果连接是同一个host的请求操作，则可以复用连接
    // 这里通过host找到可以复用的连接（一个线程管理），然后复用该连接进行请求操作
    if (!call.call.forWebSocket) {
      val existingCall = findExistingCallWithHost(call.host)
      if (existingCall != null) call.reuseCallsPerHostFrom(existingCall)
    }
  }
  //处理并执行：核心处理逻辑
  promoteAndExecute()
}
```

这里，我们主要来看**promoteAndExecute**这个核心处理方法干了什么事情：

> 遍历readyAsyncCalls，将符合要求的AsyncCall加入到执行队列runningAsyncCalls和允许执行数组executableCalls中，最后遍历executableCalls，开启线程执行请求。

```java
private fun promoteAndExecute(): Boolean {
  this.assertThreadDoesntHoldLock()
  val executableCalls = mutableListOf<AsyncCall>()
  val isRunning: Boolean
  synchronized(this) {
    val i = readyAsyncCalls.iterator()
    //集中处理一波等待队列readyAsyncCalls
    while (i.hasNext()) {
      val asyncCall = i.next()
      //如果执行队列长度 > 配置的最大请求并发数，则停止  
      if (runningAsyncCalls.size >= this.maxRequests) break // Max capacity.
      //如果当前请求的同一主机配置数 > 配置的最大同一主机请求并发数，则跳过
      if (asyncCall.callsPerHost.get() >= this.maxRequestsPerHost) continue // Host max capacity.
      //移除当前Call，并将当前Call的同一主机并发数值加1  
      i.remove()      
      asyncCall.callsPerHost.incrementAndGet()
      //添加到准备执行的请求集合
      executableCalls.add(asyncCall)
      //将请求加入到异步运行队列中
      runningAsyncCalls.add(asyncCall)
    }
    isRunning = runningCallsCount() > 0
  }

    for (i in 0 until executableCalls.size) {
    val asyncCall = executableCalls[i]
    //直接开启一个线程，执行该请求
    asyncCall.executeOn(executorService)
  }
  return isRunning
}
```

继续看AsyncCall的executeOn方法：

```java
/**
 * Attempt to enqueue this async call on [executorService]. This will attempt to clean up
 * if the executor has been shut down by reporting the call as failed.
 */
fun executeOn(executorService: ExecutorService) {
  client.dispatcher.assertThreadDoesntHoldLock()

  var success = false
  try {
    //使用线程实现类执行该请求  
    executorService.execute(this)
    success = true
  } catch (e: RejectedExecutionException) {
    val ioException = InterruptedIOException("executor rejected")
    ioException.initCause(e)
    noMoreExchanges(ioException)
    //失败回调处理
    responseCallback.onFailure(this@RealCall, ioException)
  } finally {
    if (!success) {
      //和同步请求一致，调用finished方法
      client.dispatcher.finished(this) // This call is no longer running!
    }
  }
}
```

这里，我们大概知道了同步和异步的执行过程，此时我们再来说一说两种执行方法在finally代码块中都存在的**finished**方法：

```java
private fun <T> finished(calls: Deque<T>, call: T) {
  val idleCallback: Runnable?
  synchronized(this) {
    //此时尝试移除已经完成请求的Call对象，如果移除失败，则抛出异常
    if (!calls.remove(call)) throw AssertionError("Call wasn't in-flight!")
    idleCallback = this.idleCallback
  }
  //此处又调用了promoteAndExecute方法
  val isRunning = promoteAndExecute()

  if (!isRunning && idleCallback != null) {
    idleCallback.run()
  }
}
```

所以，整体上像是一个while循环一般：

1. 新加入异步任务的AysncCall【实际上就是一个Runnable】,将其加入到readyAsyncCalls
2. 遍历readyAsyncCalls判断情况：运行任务数是否超过最大任务并发数？当前任务的主机请求数是否超过最大主机请求数？
3. 当满足条件则直接将AsyncCall加入到正在执行的队列RunningAsyncCalls中，并使用线程池执行新加入的异步任务「线程池的设计为0核心线程，无穷大临时工线程，只有任务进来就直接被执行，临时线程默认60s销毁」
4. 当AsyncCall执行结束，再次回到Dispatcher的promoteAndExecute方法

![image-20220918162457054](/img/backend/framework/okhttp3/2.png)

然后这里还剩下两个问题：

- AsyncCall这个类干了什么？？
- 同步执行当中还有一个调用责任链的方法：**getResponseWithInterceptorChain()**，这个方法干了什么？？

其中，AsynCall类中最重要的就是两个方法：一个是executeOn方法，上面已经分析过；还有一个是run方法，继承了Runnable接口，可以理解为executeOn方法中execute方法的实现，里面就出现了拦截器链调用的方法getResponseWithInterceptorChain()，并在执行最后的finally代码块中又调用了我们的finished方法。

```java
/**
   * Attempt to enqueue this async call on [executorService]. This will attempt to clean up
   * if the executor has been shut down by reporting the call as failed.
   */
   //异步请求执行
  fun executeOn(executorService: ExecutorService) {
    client.dispatcher.assertThreadDoesntHoldLock()
    var success = false
    try {
       //直接启动线程池的一个线程，运行该AsyncCall任务
      executorService.execute(this)
      success = true
    } catch (e: RejectedExecutionException) {
      val ioException = InterruptedIOException("executor rejected")
      ioException.initCause(e)
      noMoreExchanges(ioException)
      responseCallback.onFailure(this@RealCall, ioException)
    } finally {
      if (!success) {
        client.dispatcher.finished(this) // This call is no longer running!
      }
    }
  }

  //集成Runnable接口的run方法，进行拦截器的调用，并对响应/异常结果进行回调处理
  override fun run() {
    threadName("OkHttp ${redactedUrl()}") {
      var signalledCallback = false
      timeout.enter()
      try {
        //调用拦截器
        val response = getResponseWithInterceptorChain()
        signalledCallback = true
        responseCallback.onResponse(this@RealCall, response)
      } catch (e: IOException) {
        if (signalledCallback) {
          // Do not signal the callback twice!
          Platform.get().log("Callback failure for ${toLoggableString()}", Platform.INFO, e)
        } else {
          responseCallback.onFailure(this@RealCall, e)
        }
      } catch (t: Throwable) {
        cancel()
        if (!signalledCallback) {
          val canceledException = IOException("canceled due to $t")
          canceledException.addSuppressed(t)
          responseCallback.onFailure(this@RealCall, canceledException)
        }
        throw t
      } finally {
        //finished方法调用  
        client.dispatcher.finished(this)
      }
    }
  }
}
```

这便是Okhttp3的拦截器机制，我们接下来进行详细讲解

## Okhttp3的拦截器

### 拦截器介绍

之前在查看Okhhtp3源码的时候，发现在执行请求的时候，会链式执行拦截器：

```java
Response getResponseWithInterceptorChain() throws IOException {
  List<Interceptor> interceptors = new ArrayList();
  interceptors.addAll(this.client.interceptors());//自定义应用拦截器
  interceptors.add(this.retryAndFollowUpInterceptor); //重定向和重试拦截器
  interceptors.add(new BridgeInterceptor(this.client.cookieJar())); //桥接拦截器
  interceptors.add(new CacheInterceptor(this.client.internalCache())); //缓存拦截器
  interceptors.add(new ConnectInterceptor(this.client)); //链接拦截器
  if (!this.forWebSocket) {
    interceptors.addAll(this.client.networkInterceptors()); //自定义网络拦截器
  }
  interceptors.add(new CallServerInterceptor(this.forWebSocket)); //请求拦截器
  Interceptor.Chain chain = new RealInterceptorChain(interceptors, (StreamAllocation)null, (HttpCodec)null, (RealConnection)null, 0, this.originalRequest);
  return chain.proceed(this.originalRequest);
}
```

其中，默认的五大拦截器分别为以下5种：

* **RetryAndFollowUpInterceptor**（重试和重定向拦截器）：第一个接触到请求，最后接触到响应;负责判断是否需要重新发起整个请求
* **BridgeInterceptor**（桥接拦截器）：补全请求，并对响应进行额外处理
* **CacheInterceptor**（缓存拦截器）：请求前查询缓存，获得响应并判断是否需要缓存
* **ConnectInterceptor**（链接拦截器）：与服务器完成TCP连接 （Socket）
* **CallServerInterceptor**（请求服务拦截器）：与服务器通信;封装请求数据与解析响应数据(如:HTTP报文)


拦截器通过责任链模式进行调用执行，大致的工作流程如下图所示：

![Okhttp3拦截器工作流程](/img/backend/framework/okhttp3/Okhttp3拦截器工作流程.png)

可以很清晰地看到，整体拦截器的执行流程是一条链式的，请求是顺序执行，响应是逆序回调。接下来，分别就这五个拦截器进行简单的介绍讲解：

#### RetryAndFollowUpInterceptor

RetryAndFollowUpInterceptor主要进行的工作就是**重试和重定向操作**。当请求阶段发生RouteException或者IOExecption的时候，就会进行判断是否重新发起请求：

* **RouteExecption**

```java
catch (RouteException e) {
if (!recover(e.getLastConnectException(), streamAllocation, false, request)) {
        throw e.getLastConnectException();
    }
    releaseConnection = false;
continue; }
```

* **IOExecption**

```java
catch (IOException e) {
//请求发出去了，但是和服务器通信失败了,即socket流正在读写数据的时候断开连接
if (!recover(e, streamAllocation, requestSendStarted, request)) throw e;
        releaseConnection = false;
continue; }
```

这两个异常均会通过recover方法进行判断，选择是否能够进行重试操作，如果返回true，则允许重试：

```java
private boolean recover(IOException e, StreamAllocation streamAllocation,
                            boolean requestSendStarted, Request userRequest) {
  streamAllocation.streamFailed(e);
  //如果配置OkhttpClient时，设置了不允许重试(默认允许)，则一旦发生请求失败就不再重试
  if (!client.retryOnConnectionFailure()) return false;
  //如果是RouteException，则不用管这个条件；如果是IOException，由于requestSendStarted只在http2的io异常中可能为false，所以主要是第二个条件
  if (requestSendStarted && userRequest.body() instanceof UnrepeatableRequestBody)
  return false;
  //判断是不是属于重试的异常
  if (!isRecoverable(e, requestSendStarted)) return false; 
  //观察有没有可以用来连接的路由路线
  if (!streamAllocation.hasMoreRoutes()) return false;
  return true;
}
```

所以，总结来说，如果我们在不禁止重试的前提下，如果出现了**某些异常**，并且存在更多的路由线路，则会尝试换条路走走看，进行重试操作。而上面所说的某些异常则是在**isRecoverable**方法中进行判断的：

```java
private boolean isRecoverable(IOException e, boolean requestSendStarted) { 
  // 出现协议异常[协议出现问题，即是重试也于事无补...]，不能重试
  if (e instanceof ProtocolException) {
        return false;
      }
  // 如果不是超时异常，不能重试
  if (e instanceof InterruptedIOException) {
        return e instanceof SocketTimeoutException && !requestSendStarted;
      }
  // SSL握手异常中，证书出现问题，不能重试
  if (e instanceof SSLHandshakeException) {
        if (e.getCause() instanceof CertificateException) {
          return false;
  } }
  // SSL握手未授权异常 不能重试
  if (e instanceof SSLPeerUnverifiedException) {
        return false;
      }
      return true;
}
```

前面的是异常问题，如果没有异常问题，还需要进一步判断是否重定向：

```java
private Request followUpRequest(Response userResponse) throws IOException {
    if (userResponse == null) throw new IllegalStateException();
    Connection connection = streamAllocation.connection();
    Route route = connection != null
        ? connection.route()
        : null;
    int responseCode = userResponse.code();
    final String method = userResponse.request().method();
    switch (responseCode) {
// 407 客户端使用了HTTP代理服务器，在请求头中添加 “Proxy-Authorization”，让代理服务器授权 case HTTP_PROXY_AUTH:
		case HTTP_PROXY_AUTH:
			Proxy selectedProxy = route != null
			? route.proxy()
            : client.proxy();
        if (selectedProxy.type() != Proxy.Type.HTTP) {
          throw new ProtocolException("Received HTTP_PROXY_AUTH (407) code while not using
proxy");
		}
		return client.proxyAuthenticator().authenticate(route, userResponse);
// 401 需要身份验证 有些服务器接口需要验证使用者身份 在请求头中添加 “Authorization” case HTTP_UNAUTHORIZED:
	case HTTP_UNAUTHORIZED:
		return client.authenticator().authenticate(route, userResponse); // 308 永久重定向
// 307 临时重定向
	case HTTP_PERM_REDIRECT:
	case HTTP_TEMP_REDIRECT:
// 如果请求方式不是GET或者HEAD，框架不会自动重定向请求
if (!method.equals("GET") && !method.equals("HEAD")) {
          return null;
        }
      // 300 301 302 303
      case HTTP_MULT_CHOICE:
      case HTTP_MOVED_PERM:
      case HTTP_MOVED_TEMP:
      case HTTP_SEE_OTHER:
// 如果用户不允许重定向，那就返回null
if (!client.followRedirects()) return null;
// 从响应头取出location
String location = userResponse.header("Location");
if (location == null) return null;
// 根据location 配置新的请求 url
HttpUrl url = userResponse.request().url().resolve(location);
// 如果为null，说明协议有问题，取不出来HttpUrl，那就返回null，不进行重定向
if (url == null) return null;
// 如果重定向在http到https之间切换，需要检查用户是不是允许(默认允许)
boolean sameScheme = url.scheme().equals(userResponse.request().url().scheme()); if (!sameScheme && !client.followSslRedirects()) return null;
        Request.Builder requestBuilder = userResponse.request().newBuilder();
        /**
* 重定向请求中 只要不是 PROPFIND 请求，无论是POST还是其他的方法都要改为GET请求方式， * 即只有 PROPFIND 请求才能有请求体
*/
//请求不是get与head
if (HttpMethod.permitsRequestBody(method)) {
final boolean maintainBody = HttpMethod.redirectsWithBody(method); // 除了 PROPFIND 请求之外都改成GET请求
          if (HttpMethod.redirectsToGet(method)) {
            requestBuilder.method("GET", null);
          } else {
            RequestBody requestBody = maintainBody ? userResponse.request().body() : null;
            requestBuilder.method(method, requestBody);
}
// 不是 PROPFIND 的请求，把请求头中关于请求体的数据删掉 if (!maintainBody) {
 享学课堂

             requestBuilder.removeHeader("Transfer-Encoding");
            requestBuilder.removeHeader("Content-Length");
            requestBuilder.removeHeader("Content-Type");
} }
// 在跨主机重定向时，删除身份验证请求头
if (!sameConnection(userResponse, url)) {
          requestBuilder.removeHeader("Authorization");
        }
        return requestBuilder.url(url).build();
// 408 客户端请求超时
case HTTP_CLIENT_TIMEOUT:
// 408 算是连接失败了，所以判断用户是不是允许重试 if (!client.retryOnConnectionFailure()) {
            return null;
        }
// UnrepeatableRequestBody实际并没发现有其他地方用到
if (userResponse.request().body() instanceof UnrepeatableRequestBody) {
            return null;
        }
// 如果是本身这次的响应就是重新请求的产物同时上一次之所以重请求还是因为408，那我们这次不再重请求 了
        if (userResponse.priorResponse() != null
                        && userResponse.priorResponse().code() == HTTP_CLIENT_TIMEOUT) {
            return null;
        }
// 如果服务器告诉我们了 Retry-After 多久后重试，那框架不管了。 if (retryAfter(userResponse, 0) > 0) {
            return null;
        }
return userResponse.request();
// 503 服务不可用 和408差不多，但是只在服务器告诉你 Retry-After:0(意思就是立即重试) 才重请求 case HTTP_UNAVAILABLE:
        if (userResponse.priorResponse() != null
                        && userResponse.priorResponse().code() == HTTP_UNAVAILABLE) {
            return null;
         }
         if (retryAfter(userResponse, Integer.MAX_VALUE) == 0) {
            return userResponse.request();
}
         return null;
      default:
        return null;
    }
}
```

这里重定向判断的代码最终如果返回为空(null)，则无需进行重定向，直接将响应返回即可；如果返回是非空的，则需要重新请求返回的request。

注意：

* followup在拦截器中定义的最大次数为20次
* RetryAndFollowUpInterceptor是整个责任链的第一个，意味着它首次接触到我们的Request请求，同样也是最后接触到Response响应。
* RetryAndFollowUpInterceptor重试的前提是出现了Route Exception或IOExeption。
* 重定向是发生在重试的判定之后的，如果不满足重试的条件，则根据响应调用followUpRequest方法。

#### BridgeInterceptor

**BridgeInterceptor**拦截器命令为桥接拦截器，是连接应用程序和服务器之间的桥梁，我们发出的请求经过它的处理才会发给服务器，故我们可在该拦截器中对request_body和request_header等进行处理操作。还可以进行编码，cookie处理，host处理等；在获取响应返回中也可以在该拦截器中进行Cookie的保存操作。

|     请求头      |                             说明                             |
| :-------------: | :----------------------------------------------------------: |
|  Content-Type   | 请求体类型,如: application/x-www-form-urlencoded，application/json等 |
|      Host       |                         请求主机站点                         |
|   Connection    |                   Keep-Alive	保持长连接                   |
| Accept-Encoding |                 gzip	接受响应支持gzip压缩                 |
|     Cookie      |                        cookie身份辨别                        |
|   User-Agent    |            请求的用户信息，如:操作系统、浏览器等             |

故我们如果希望在请求前对请求内容进行处理，或是得到响应以后对响应内容进行保存，压缩等操作，都可以在这里进行操作...

#### CacheInterceptor

CacheInterceptor称作缓存拦截器，在我们发起请求前，判断是否命中缓存：

*  如果命中，则直接返回缓存中的响应（注意：只有get请求还可以存在缓存）

CacheInterceptor基本的工作流程大致分为：

* 第一步：从缓存中获取对应请求的响应缓存
* 第二步：创建CacheStrategy，创建时判断是否能够使用缓存【networkRequest和cacheResponse两个成员属性】

| networkRequest | networkResponse |                    说明                     |
| :------------: | :-------------: | :-----------------------------------------: |
|      Null      |     NotNull     |                直接使用缓存                 |
|    Not Null    |      Null       |              向服务器发起请求               |
|      Null      |      Null       |                okhttp返回504                |
|    NotNull     |     NotNull     | 发起请求，若请求响应为304，则更新缓存并返回 |

#### ConnectInterceptor

ConnectInterceptor为连接拦截器，用于打开与目标服务器之间的连接，并执行下一个拦截器。

```java
public final class ConnectInterceptor implements Interceptor {
  public final OkHttpClient client;
  public ConnectInterceptor(OkHttpClient client) {
    this.client = client;
}
  @Override public Response intercept(Chain chain) throws IOException {
    RealInterceptorChain realChain = (RealInterceptorChain) chain;
    Request request = realChain.request();
    StreamAllocation streamAllocation = realChain.streamAllocation();
    // We need the network to satisfy this request. Possibly for validating a conditional GET.
    boolean doExtensiveHealthChecks = !request.method().equals("GET");
    HttpCodec httpCodec = streamAllocation.newStream(client, chain, doExtensiveHealthChecks);
    RealConnection connection = streamAllocation.connection();
    return realChain.proceed(request, streamAllocation, httpCodec, connection);
  }
}
```

这里的**StreamAllocation**是用来协调请求，连接与数据流之间的关系，它负责为一次请求寻找连接，然后获得流来实现网络通信。

而`HttpCodec httpCodec = streamAllocation.newStream(client, chain, doExtensiveHealthChecks)`返回的HttpCodec中包含了输入输出流，并且封装了对Http请求报文的编码和解码，直接使用它可以与请求主机之间建立HTTP通信。

#### CallServerInterceptor

上面创建的HttpCodec会发送请求到服务器并且解析生成响应Response。后续进行一系列操作，最后执行httpCodec.finishRequest()方法才算是真正发送到服务器。

```java
 Response.Builder responseBuilder = null;
if (HttpMethod.permitsRequestBody(request.method()) && request.body() != null) {
    if ("100-continue".equalsIgnoreCase(request.header("Expect"))) {
        httpCodec.flushRequest();
        realChain.eventListener().responseHeadersStart(realChain.call());
        responseBuilder = httpCodec.readResponseHeaders(true);
    }
    if (responseBuilder == null) {
        realChain.eventListener().requestBodyStart(realChain.call());
        long contentLength = request.body().contentLength();
        CountingSink requestBodyOut =
                        new CountingSink(httpCodec.createRequestBody(request, contentLength));
        BufferedSink bufferedRequestBody = Okio.buffer(requestBodyOut);
        request.body().writeTo(bufferedRequestBody);
        bufferedRequestBody.close();
realChain.eventListener().requestBodyEnd(realChain.call(),requestBodyOut.successfulCount);
    } else if (!connection.isMultiplexed()) {
} }
httpCodec.finishRequest();
```

**总结：**

Okhttp功能的实现就在这五个核心拦截器，分别为：重试重定向拦截器-->桥接拦截器-->缓存拦截器-->连接拦截器-->连接拦截器-->请求服务拦截器。每一个拦截器的职责不一，形成一条责任链。

当一个用户发起一个请求，会将任务下发到任务分发器**Dispatcher**，然后分发器会将请求进行包装，交给第一级拦截器处理，然后拦截器一级一级处理，直到完成请求，返回响应。

### 自定义拦截器

Okhttp3自定义注册的拦截器分为两种：应用拦截器（Application Interceptors）和网络拦截器（Network Interceptors）

#### 2.1 应用拦截器

如果想要自定义使用拦截器，也十分地简单，我们可以创建一个拦截器类，然后实现Okttp3的Interceptor接口即可：

```java
public class AddCookieInterceptor implements Interceptor {
    @Override
    public Response intercept(Chain chain) throws IOException {
        //拦截逻辑编辑处1
        Response response = chain.proceed(request);
        //拦截器编辑处2
        return response;        
    }
}
```

在构建OkhttpClient客户端的时候，需要将自定义拦截器添加进去：

```java
OkHttpClient client = new OkHttpClient.Builder()
        .addInterceptor(new LoggingInterceptor())
        ...省略了其他配置
        .build();
```

#### 2.2 网络拦截器

注册网络拦截器的方法很类似。添加拦截器到networkInterceptors()列表，取代interceptors()列表:

```java
OkHttpClient client = new OkHttpClient.Builder()
        .addNetworkInterceptor(new LoggingInterceptor())
        ...省略了其他配置
        .build();
```

此时，如果发生一次重定向，会发现拦截器执行了两次，对两次进行分别进行拦截处理，故我们可以对比出两种拦截器的使用区别：

应用拦截器：

- 不用担心中间过程的响应，例如重定向和重试。

- 始终调用一次，即使HTTP响应来自于**缓存**。
- 观察应用原始的意图。不用关注由OkHttp注入的头信息，例如If-None-Match。
- 允许短路，不调用Chain.proceed()。
- 允许重试，多次调用Chain.proceed()。

网络拦截器：

- 能操作中间响应，例如重定向和重试。
- 发生网络短路的缓存响应时，不被调用。
- 观察将通过网络传输的数据。
- 可以获取到携带请求的connection。

## Okhttp3的监听器

在Okhttp3.11版本以后增加了**EventListener**-事件监听器类，我们可以继承抽象类，实现事件监听工作。

以两个案例介绍EventListener的使用方式

#### 案例1：请求耗时-请求地址端口拦截获取

在这里，自定义EventListener，记录每一个请求的请求耗时，并获取该请求最终地址和端口等信息：

**HttpEventListener**

```java
@Slf4j
public class HttpEventListener extends EventListener {
    /**
     * 自定义EventListenerFactory
     * 每一个call-->对应一个EventListener
     */
    public static final Factory FACTORY = new Factory() {
        final AtomicLong nextCalled = new AtomicLong(1L);
        @Override
        public EventListener create(Call call) {
            long called = nextCalled.getAndIncrement();
            NetEventModel tag = call.request().tag(NetEventModel.class);
            return new HttpEventListener(called, tag);
        }
    };

    private final long callId;
    private NetEventModel model;
    //最大响应时间？？？
    private final long MAX_TIME = 30000;
    //统计数据信息
    private Long callStart;
    private Long dnsStart;
    private Long connectStart;
    private Long secureConnectStart;
    private Long requestStart;
    private Long responseStart;

    public HttpEventListener(Long callId, NetEventModel model) {
        this.callId = callId;
        this.model = model;
        model.setId(callId);
    }

    public NetEventModel getModel() {
        return model;
    }

    public void setModel(NetEventModel model) {
        this.model = model;
    }

    /**
     * 请求开始时回调：即当一个请求【无论是同步请求，还是异步请求】，当被加入到请求队列时回调。
     * 说明方法执行在任务分发器dispatcher进行executed或者enqueue方法前
     * 注意事项：当发生重定向或者多域名重试的时候，该方法只执行一次
     */
    @Override
    public void callStart(Call call) {
        //记录开始时间
        callStart = System.currentTimeMillis();

    }

    /**
     * dns解析开始前回调
     * dns：使用域名解析器（JDK采用InetAddress类完成）将请求的域名解析为ip地址
     * @param call
     * @param domainName
     */
    @Override
    public void dnsStart(Call call, String domainName) {
        super.dnsStart(call, domainName);
    }

    /**
     * dns解析结束时回调
     * @param call
     * @param domainName
     * @param inetAddressList
     */
    @Override
    public void dnsEnd(Call call, String domainName, List<InetAddress> inetAddressList) {
        model.setTotalTime(System.currentTimeMillis() - callStart);
    }

    /**
     * 开始连接回调：OkHttp使用Socket接口建立Tcp连接；
     * 如果连接被重用时，connectStart/connectEnd不会被回调
     * 当请求被重定向到新的域名以后，connectStart/connectEnd回被调用多次
     * @param call
     * @param inetSocketAddress
     * @param proxy
     */
    @Override
    public void connectStart(Call call, InetSocketAddress inetSocketAddress, Proxy proxy) {
        super.connectStart(call, inetSocketAddress, proxy);
    }

    /**
     * 连接结束时回调：无论Socket连接失败还是TSL/SSL握手失败，都会回调connectEnd
     * @param call
     * @param inetSocketAddress
     * @param proxy
     * @param protocol
     */
    @Override
    public void connectEnd(Call call, InetSocketAddress inetSocketAddress, Proxy proxy, Protocol protocol) {
        model.setTotalTime(System.currentTimeMillis() - callStart);
    }

    /**
     * TLS连接开始
     * 当存在HTTPS安全连接时，在TCP连接成功以后需要进行TLS安全协议通信，等TLS通讯结束后才算整个连接过程的结束
     * connectStart-->secureConnectStart-->secureConnectEnd-->connectEnd
     * @param call
     */
    @Override
    public void secureConnectStart(Call call) {
        super.secureConnectStart(call);
    }

    /**
     * TLS连接结束
     * @param call
     * @param handshake
     */
    @Override
    public void secureConnectEnd(Call call, Handshake handshake) {
        model.setTotalTime(System.currentTimeMillis() - callStart);
    }


    /**
     * 连接失败
     * @param call
     * @param inetSocketAddress
     * @param proxy
     * @param protocol
     * @param ioe
     */
    @Override
    public void connectFailed(Call call, InetSocketAddress inetSocketAddress, Proxy proxy, Protocol protocol, IOException ioe) {
        model.setTotalTime(System.currentTimeMillis() - callStart);
    }

    /**
     * 连接成功以后回调：
     * @param call
     * @param connection
     */
    @Override
    public void connectionAcquired(Call call, Connection connection) {
        InetAddress inetAddress = connection.socket().getInetAddress();
        if (inetAddress != null) {
            model.setRemoteUrl(inetAddress.getHostName());
            model.setRemoteAddress(inetAddress.getHostAddress() + ":" + connection.socket().getPort());
        }
    }

    /**
     * 连接释放
     * @param call
     * @param connection
     */
    @Override
    public void connectionReleased(Call call, Connection connection) {
        super.connectionReleased(call, connection);
    }

    @Override
    public void requestHeadersStart(Call call) {
        super.requestHeadersStart(call);
    }

    @Override
    public void requestHeadersEnd(Call call, Request request) {
        super.requestHeadersEnd(call, request);
    }

    @Override
    public void requestBodyStart(Call call) {
        super.requestBodyStart(call);
    }

    @Override
    public void requestBodyEnd(Call call, long byteCount) {
        model.setTotalTime(System.currentTimeMillis() - callStart);
    }


    @Override
    public void responseHeadersStart(Call call) {
        super.responseHeadersStart(call);
    }

    @Override
    public void responseHeadersEnd(Call call, Response response) {
        super.responseHeadersEnd(call, response);
    }

    @Override
    public void responseBodyStart(Call call) {
        super.responseBodyStart(call);
    }

    @Override
    public void responseBodyEnd(Call call, long byteCount) {
        model.setTotalTime(System.currentTimeMillis() - callStart);
    }

    /**
     * 请求结束后，关闭输入流/关闭连接产生异常时回调
     * http2版本中，一个连接允许打开多个流，Okhttp使用StreamAllocation作为流和连接的桥梁。
     * 当一个流被关闭的时候，需要检查这条连接上还是否存在其他流，如果不存在其他流，则可以将连接关闭。
     * @param call
     */
    @Override
    public void callEnd(Call call) {
        model.setTotalTime(System.currentTimeMillis() - callStart);
    }

    /**
     * 请求执行过程中产生异常时回调
     * @param call
     * @param ioe
     */
    @Override
    public void callFailed(Call call, IOException ioe) {
        model.setTotalTime(System.currentTimeMillis() - callStart);
    }
}
```

为了保证执行器OKHttpclient单例情况下，高并发状态下EventListener错乱的问题，在请求到达时，通过Factory创建一个新的EventListener进行处理，保证每一个call对象对应的是一个新的EventListener，同时使用原子类AtomicLong保证每一个CallId的原子性。同时，为了保证我们能够在响应中能够得到响应处理过程中，监听得到的统计数据信息，通过Tag埋点的方式，在Request对象中注入一个Tag对象(NetEventModel)，在监听过程中，将统计信息汇总到Tag对象中，当请求处理结束，通过response.request().tag()方法获取埋点的信息：

**NetEventModel-Tag类：**

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NetEventModel {
    private Long id; //唯一callId
    private Long totalTime; //请求发出到拿到数据，不包括本地排队时间
    private Long dnsTime; //dns解析时间
    private Long connectTime; // 创建socket通道时间
    private Long secureTime; // ssl握手时间，connect_duration包含secure_duration
    private Long request_time; // writeBytes的时间
    private Long responseTime; // readBytes的时间
    private Long serveTime; // 相当于responseStartDate - requestEndDate
    private String remoteAddress; //远程连接的ip地址
    private String remoteUrl;
}
```

最后，在构建OkHttpClient客户端的时候，将我们的EventListener以工厂类型注入：

```java
okHttpClient = new OkHttpClient.Builder()
  .followRedirects(allowRedirect)
  .connectTimeout(15, TimeUnit.SECONDS)
  .writeTimeout(20, TimeUnit.SECONDS)
  .readTimeout(20, TimeUnit.SECONDS)
  .retryOnConnectionFailure(true)
  //添加自定义监视器
  .eventListenerFactory(HttpEventListener.FACTORY)
  .build();
```

#### 案例2: 替换host操作

同时，我们也能够实现host的替换等操作，这里以host替换为例简单介绍一下该事件监听器的使用方法：

更改/替换请求的host，分为以下四步：

> 1. 创建一个HttpUrl对象，使用host()方法设置新的host参数
> 2. 使用Request创建request，使用url()方法将新创建的HttpUrl设置进去
> 3. 通过反射修改Call中的originRequest为newRequest对象从而实现动态替换/更改host 
> 4. 在自定义的EventListener的callStart方法中，判断host是否为需要替换的host地址，如果是，则采用步骤1-步骤3 进行host的替换操作，建议将1-3步封装成一个Utils类
> 5. 将自定义的EventListener在构建HttpClient的时候，添加进去，如果存在高并发问题，保证每一个call对应一个监听 器，则考虑使用Factory工厂注入



## Okhttp3的其他特性

### OkIO

相比入传统无缓冲的IO，以及面向缓冲区的NIO，OkIO在IO，NIO的基础上增强了**流于流之间的互动**，使得当数据从一个缓冲区移动到另一个缓冲区时，可以不经过copy能达到；并且还增加了一套对开发者更加友好的API，使得开发者更加方面地进行IO操作：

```java
//写文件操作
try (Sink sink = Okio.sink(new File(file_path));
     BufferedSink bufferedSink = Okio.buffer(sink)) {
  bufferedSink.writeUtf8("write" + "\n" + "success!");
} catch (IOException e) {
  e.printStackTrace();
}
//读文件操作
try (Source source = Okio.source(new File(path));
     BufferedSource bufferedSource = Okio.buffer(source)) {
  for (String line; (line = bufferedSource.readUtf8Line()) != null; ) {
    System.out.println(line);
  }
} catch (IOException e) {
  e.printStackTrace();
}
```

其中，`Source`和`Sink`是接口，类似传统IO的`InputStream`和`OutputStream`，具有输入、输出流功能。

`Sourece`接口主要用来读取数据，而数据的来源可以是磁盘，网络，内存：

```java
public interface Source extends Closeable {
  long read(Buffer sink, long byteCount) throws IOException;
  Timeout timeout();
  @Override void close() throws IOException;
}
```

`Sink`接口主要用来写入数据:

```java
public interface Sink extends Closeable, Flushable {
  void write(Buffer source, long byteCount) throws IOException;
  @Override void flush() throws IOException;
  Timeout timeout();
  @Override void close() throws IOException;
}
```

### Socket复用

每次建立连接，使用完再关闭连接都要进行三次握手和四次挥手，显然则会造成效率的低下，Http协议中有一种机制叫做KeepAlive机制，它可以在传输数据后仍然能够保持连接状态，当客户端需要再次传输数据的时候，就会使用空闲下来的连接，而不需要重新建立连接。

![image-20220918162850524](/img/backend/framework/okhttp3/1.png)

## Okhttp3的那些坑点

Okhttp3作为主流的网络请求框架，我们在日常使用过程中，会使用其中的OkhttClient作为请求调用客户端，利用自定义拦截器来实现自定义的一些功能。这里我就梳理出来自身平时使用Okhttp3框架中遇到的一些坑和问题点，提供给各位阅读者参考：

### 坑1：请求头压缩问题

一般我们希望请求体能够实现压缩功能，会在请求头中添加请求头Accept-Encoding为gzip,deflate，但是此时通过Okhttp3进行网络请求时返回的网页是乱码。

这是由于在Okhttp中，如果在请求头添加`addHeader("Accept-Encoding", "gzip, deflate")`，Okhttp不会帮你处理Gzip的解压，需要你自己去处理。而在Okhttp3的桥接拦截器中会自动帮助我们进行`Accept-Encoding`请求头的添加操作：

```java
boolean transparentGzip = false;
if (userRequest.header("Accept-Encoding") == null && userRequest.header("Range") == null) {
  transparentGzip = true;
  requestBuilder.header("Accept-Encoding", "gzip");
}
```

故我们在实际使用中无需添加`Accept-Encoding`为`gzip`，只需要去除该请求头的添加，就可以解决上面出现的问题了～

### 坑2：SSL证书忽略问题

默认http3会对https的SSL安全证书进行验证，此时测试服务端可能只是配置了本地证书，而该证书并不能被Okhttp3认证通过，就会报`java.io.IOException: Hostname was not verified`异常，此时，我们如果需要解决该异常问题，就需要通过重新配置注册OkhttpClient来解决这个问题。

首先我们来看一个简单的OkhttpClient的Bean注册代码：

```java
public OkHttpClient okHttpClientWithRedirect() {
  OkHttpClient okHttpClient = new OkHttpClient.Builder()
    .followRedirects(true)
    .connectTimeout(15, TimeUnit.SECONDS)
    .writeTimeout(15, TimeUnit.SECONDS)
    .readTimeout(15, TimeUnit.SECONDS)
    .retryOnConnectionFailure(false)
    .build();
  return okHttpClient;
}
```

此时，我们要想实现SSL证书的忽略认证，第一步则是构建一个`SSLSocketFactory`：

```java
public static SSLSocketFactory getSSLSocketFactory() {
  try {
    SSLContext sslContext = SSLContext.getInstance("SSL");
    sslContext.init(null, getTrustManager(), new SecureRandom());
    return sslContext.getSocketFactory();
  } catch (Exception e) {
    throw new RuntimeException(e);
  }
}

private static TrustManager[] getTrustManager() {
  return new TrustManager[]{
    new X509TrustManager() {
      @Override
      public void checkClientTrusted(X509Certificate[] chain, String authType) {
      }
      @Override
      public void checkServerTrusted(X509Certificate[] chain, String authType) {
      }
      @Override
      public X509Certificate[] getAcceptedIssuers() {
        return new X509Certificate[]{};
      }
    }
  };
}
```

然后，获取`X509TrustManager`

```java
public static X509TrustManager getX509TrustManager() {
  X509TrustManager trustManager = null;
  try {
    TrustManagerFactory trustManagerFactory = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
    trustManagerFactory.init((KeyStore) null);
    TrustManager[] trustManagers = trustManagerFactory.getTrustManagers();
    if (trustManagers.length != 1 || !(trustManagers[0] instanceof X509TrustManager)) {
      throw new IllegalStateException("Unexpected default trust managers:" + Arrays.toString(trustManagers));
    }
    trustManager = (X509TrustManager) trustManagers[0];
  } catch (Exception e) {
    e.printStackTrace();
  }
  return trustManager;
}
```

最后，在构建OkHttpClient中，添加对应的`SSLSocketFactory`和`HostnameVerifier`即可

```java
public OkHttpClient okHttpClientWithRedirect() {
  OkHttpClient okHttpClient = new OkHttpClient.Builder()
    .followRedirects(true)
    .connectTimeout(15, TimeUnit.SECONDS)
    .writeTimeout(15, TimeUnit.SECONDS)
    .readTimeout(15, TimeUnit.SECONDS)
    .retryOnConnectionFailure(false)
    .sslSocketFactory(getSSLSocketFactory(), getX509TrustManager())
    .hostnameVerifier(((s, sslSession) -> true))
    .build();
  return okHttpClient;
}
```

### 坑3：307/308重定向问题

我们都知道，Okhttp3有一个很牛逼的拦截器链，其中重定向和重试则是在它的**RetryAndFollowUpInterceptor**中事项的。这里简单看一下其中的一段源码：

```java
private Request followUpRequest(Response userResponse) throws IOException {
    if (userResponse == null) throw new IllegalStateException();
    Connection connection = streamAllocation.connection();
    Route route = connection != null
        ? connection.route()
        : null;
    int responseCode = userResponse.code();
    final String method = userResponse.request().method();
    switch (responseCode) {
// 407 客户端使用了HTTP代理服务器，在请求头中添加 “Proxy-Authorization”，让代理服务器授权 case HTTP_PROXY_AUTH:
		case HTTP_PROXY_AUTH:
			Proxy selectedProxy = route != null
			? route.proxy()
            : client.proxy();
        if (selectedProxy.type() != Proxy.Type.HTTP) {
          throw new ProtocolException("Received HTTP_PROXY_AUTH (407) code while not using
proxy");
		}
		return client.proxyAuthenticator().authenticate(route, userResponse);
// 401 需要身份验证 有些服务器接口需要验证使用者身份 在请求头中添加 “Authorization” case HTTP_UNAUTHORIZED:
	case HTTP_UNAUTHORIZED:
		return client.authenticator().authenticate(route, userResponse); // 308 永久重定向
// 307 临时重定向
	case HTTP_PERM_REDIRECT:
	case HTTP_TEMP_REDIRECT:
// 如果请求方式不是GET或者HEAD，框架不会自动重定向请求
if (!method.equals("GET") && !method.equals("HEAD")) {
          return null;
        }
      // 300 301 302 303
      case HTTP_MULT_CHOICE:
      case HTTP_MOVED_PERM:
      case HTTP_MOVED_TEMP:
      case HTTP_SEE_OTHER:
// 如果用户不允许重定向，那就返回null
if (!client.followRedirects()) return null;
// 从响应头取出location
String location = userResponse.header("Location");
if (location == null) return null;
// 根据location 配置新的请求 url
HttpUrl url = userResponse.request().url().resolve(location);
// 如果为null，说明协议有问题，取不出来HttpUrl，那就返回null，不进行重定向
if (url == null) return null;
// 如果重定向在http到https之间切换，需要检查用户是不是允许(默认允许)
boolean sameScheme = url.scheme().equals(userResponse.request().url().scheme()); if (!sameScheme && !client.followSslRedirects()) return null;
        Request.Builder requestBuilder = userResponse.request().newBuilder();
        /**
* 重定向请求中 只要不是 PROPFIND 请求，无论是POST还是其他的方法都要改为GET请求方式， * 即只有 PROPFIND 请求才能有请求体
*/
//请求不是get与head
if (HttpMethod.permitsRequestBody(method)) {
final boolean maintainBody = HttpMethod.redirectsWithBody(method); // 除了 PROPFIND 请求之外都改成GET请求
          if (HttpMethod.redirectsToGet(method)) {
            requestBuilder.method("GET", null);
          } else {
            RequestBody requestBody = maintainBody ? userResponse.request().body() : null;
            requestBuilder.method(method, requestBody);
}
// 不是 PROPFIND 的请求，把请求头中关于请求体的数据删掉 if (!maintainBody) {
 享学课堂

             requestBuilder.removeHeader("Transfer-Encoding");
            requestBuilder.removeHeader("Content-Length");
            requestBuilder.removeHeader("Content-Type");
} }
// 在跨主机重定向时，删除身份验证请求头
if (!sameConnection(userResponse, url)) {
          requestBuilder.removeHeader("Authorization");
        }
        return requestBuilder.url(url).build();
// 408 客户端请求超时
case HTTP_CLIENT_TIMEOUT:
// 408 算是连接失败了，所以判断用户是不是允许重试 if (!client.retryOnConnectionFailure()) {
            return null;
        }
// UnrepeatableRequestBody实际并没发现有其他地方用到
if (userResponse.request().body() instanceof UnrepeatableRequestBody) {
            return null;
        }
// 如果是本身这次的响应就是重新请求的产物同时上一次之所以重请求还是因为408，那我们这次不再重请求 了
        if (userResponse.priorResponse() != null
                        && userResponse.priorResponse().code() == HTTP_CLIENT_TIMEOUT) {
            return null;
        }
// 如果服务器告诉我们了 Retry-After 多久后重试，那框架不管了。 if (retryAfter(userResponse, 0) > 0) {
            return null;
        }
return userResponse.request();
// 503 服务不可用 和408差不多，但是只在服务器告诉你 Retry-After:0(意思就是立即重试) 才重请求 case HTTP_UNAVAILABLE:
        if (userResponse.priorResponse() != null
                        && userResponse.priorResponse().code() == HTTP_UNAVAILABLE) {
            return null;
         }
         if (retryAfter(userResponse, Integer.MAX_VALUE) == 0) {
            return userResponse.request();
}
         return null;
      default:
        return null;
    }
}
```

其中，会发现，当重定向CODE为307和308的时候，此时并未做对应的Location跳转处理，那么真实的业务场景中可能就存在对于307/308的重定向请求，需要我们获取对应的Location地址，进行请求的重定向转发，故这里okhttp3并未帮我们实现，我们就必须通过自定义拦截器来实现对应的功能：

```java
private Request followUpRequest(Response response) {
  int responseCode = response.code(); //获取响应状态码
  switch (responseCode) {
    case StatusCode.PERM_REDIRECT: //307
    case StatusCode.TEMP_REDIRECT: //308
      //获取对应的Location请求头，重新构建HttpURL，进行重定向处理
      String location = response.header(HeaderType.LOCATION);
      if (location == null) {
        return null;
      }
      HttpUrl url = response.request().url().resolve(location);
      if (url == null) {
        return null;
      }
      //重新构建Request
      Request.Builder requestBuilder = response.request().newBuilder();
      return requestBuilder.url(url).build();
    default:
      return null;
  }
}
```

### 坑4：域名解析异常 Name does not Resolve

项目中使用Okhttp3，出现了UnknownHostException异常，此时排查方向存在两个大的方向：

第一个方向：http1.1 支持 TCP 通道复用机制，http2.0 还支持了多路复用机制，所以有时候明明有网络，但是接口却返回 SocketTimeoutException，UnknownHostException，一般都是后台接口没有严格按照http1.1协议和http2.0协议来，导致服务器Socket关了，但是没有通知客户端，客户端下次请求，复用链路导致 SocketTimeoutException。此时我们的解决方式一般分为以下几种：

* 服务端进行调整
* Okhttp3关闭连接池：OkHttpClient.connectionPool().evictAll()
* 客户端或者在Okhttp3中增加重试机制，失败了再重试几次（推荐）

第二个方向：域名解析问题，即我们服务所在的系统DNS出了问题，导致域名解析失败，这里也是存在几种解决途径：

* 自定义实现HttpDNS，不走系统的DNS，因为本身系统自带的DNS会存在域名拦截等问题，目前主流的互联网公司都实现了自己的HttpDNS，不走服务商LocalDNS，直接通过http请求的方式进行域名解析，如果不存在再走系统的DNS解析。实现也很简单，只要实现Okhttp3的DNS接口，在lookup方法中实现自定义域名解析逻辑即可，目前主流的HttpDNS服务阿里云/腾讯云都有，可以直接去对应的产品创建对应的项目使用即可，当前你可以自己实现一个。
* 也有的人排查问题发现说问题异常信息显示为IPV6解析问题，需要设置JVM参数优先使用IPV4进行解决;但是在我的业务场景中这样处理无法解决

```java
-Djava.net.preferIPv4Stack=true
```

* 第三种是由于服务部署时，你的容器的域名解析没有走宿主机，导致本地系统的域名解析范围太过狭窄，导致域名解析异常，我们可以通过查看etc目录下的resolv.conf进行dns配置信息的查看，其中主要就是看我们的nameserver参数是否和我们起服务的该台宿主机的IP是否保持一致即可

PS：这里补充关于Linux-DNS配置文件的相关内容

当我们需要查看Linux服务器的DNS配置信息，一般会进入etc目录下查看`resolv.conf`文件内容：

```java
cat /etc/resolv.conf
```

resolv.conf配置文件作为DNS客户机配置文件，用于设置DNS服务器的IP地址及DNS域名，其中还包含了主机的域名搜索顺序。该文件是由域名解析器（resolver，一个根据主机名解析IP地址的库）使用的配置文件。格式如下所示：

```java
nameserver //定义DNS服务器的IP地址 
domain //定义本地域名 
search //定义域名的搜索列表 
sortlist //对返回的域名进行排序
options //resolver的内置变量
```

在该配置文件中，其中最主要是`nameserver`关键字，如果没指定`nameserver`就找不到DNS服务器，其它关键字是可选的。

* nameserver：表示解析域名时使用**该地址指定的主机为域名服务器**。其中域名服务器是按照文件中出现的顺序来查询的，且只有当第一个nameserver没有反应时才查询下面的nameserver。

* domain：则是声明主机的域名。会有很多程序用到它，例如邮件系统；当为没有域名的主机进行DNS查询时，也要用到。如果没有域名，主机名将被使用，删除所有在第一个点(.)前面的内容。 

* search：它的多个参数指明域名查询顺序。当要查询没有域名的主机，主机将在由search声明的域中分别查找。 domain和search不能共存；如果同时存在，后面出现的将会被使用。
* sortlist：允许将得到域名结果进行特定的排序。它的参数为网络/掩码对，允许任意的排列顺序。
* options：
  * ndots:[n]：设置调用res_query()解析域名时域名至少包含的点的数量
  * timeout:[n]：设置等待dns服务器返回的超时时间，单位秒。默认值RES_TIMEOUT=5
  * attempts:[n]：设置resolver向DNS服务器发起域名解析的请求次数。默认值RES_DFLRETRY=
  * rotate：在_res.options中设置RES_ROTATE，采用轮询方式访问nameserver，实现负载均衡_
  * _no-check-names：在_res.options中设置RES_NOCHECKNAME，禁止对传入的主机名和邮件地址进行无效字符检查，比如下划线（_）,非ASCII字符或控制字符

下面这是一个常见的`resolv.conf`：

```java
search openstacklocal
nameserver 22.125.1.240
nameserver 22.125.129.240
options timeout:1 single-request-reopen
```

**注意：**

（1）search和domain不能共存，如果同时存在，以最后出现的为准。
（2）分号(;)或井号(#)开头的行为注释行；
（3）每一个配置项必须单独成行，且以关键词开头，空格分隔配置值

### 坑5：ResponseBody.string()无法重复获取

在使用OkhttpClient进行请求执行以后，会返回对应的响应，其中，如果我们需要知道响应体的内容，我们会调`Response.ResponseBody.string()`，如果我们想要知道请求体的内容，可以调`Response.ResponseBody.string()`，此时你会发现，`ResponseBody.string()`只能执行一次，再执行一次就报异常了，这是由于当我们执行`ResponseBody.string()`的时候，底层在finally代码块中会关闭资源：

```java
public final String string() throws IOException {
  BufferedSource source = this.source();
  String var3;
  try {
    Charset charset = Util.bomAwareCharset(source, this.charset());
    var3 = source.readString(charset);
  } finally {
    Util.closeQuietly(source);
  }
  return var3;
}
```

故我们想要重复获取响应体中的内容，这里就需要通过复制流的方式来获取了：

```java
private String getContentWithCloneResponseBodyStream(ResponseBody responseBody) throws IOException {
  BufferedSource source = responseBody.source();
  source.request(Long.MAX_VALUE);
  Buffer buffer = source.buffer();
  return buffer.clone().readString(Charset.forName(FieldConstant.UTF_8));
}
```

### 坑6：Headers.names()

如果我们想要获取响应结果中的响应头信息，就需要使用`Response.Header()`来获取。这里的Headers十分的神奇！！它有一个`namesAndValues`属性，其中当我们调用它的names()方法，就会获取一个Set集合，里面全是它的Key，此时神奇的地方来了，如果你想要把Headers放到一个Map中去，一般情况下是不是要这么写：

```java
Map<String, String> map = new LinkedHashMap<>();
headers.names().stream().forEach(key -> {
  map.put(key, headers.get(key));
});
```

但是你如果要这样写，那你会发现有的时候，你的请求头会缺失，因为它的Headers的`namesAndValues`其实是这样的：

```java
key1:value1
key2:value2
key2:value3
key2:value4
key3:value5
...
```

那么最后你的key为key2的请求头就会缺失value3和value4的属性了，所以不要被它的names()返回是Set迷惑了！！！正确的写法是：

```java
Map<String, String> map = new LinkedHashMap<>();
headers.names().stream().forEach(key -> {
  map.put(key, String.join(";", headers.values(key)));
});
```

### 坑7：超时时间的真正意义

OkhttpClient默认超时时间分为三种：

* connectTimeout
* readTimeOut
* writeTimeOut

初始不配置的情况下，单个默认是10秒，此时经常会发生读超时或者写超时的情况，故在业务场景中，建议connectTimeOut可以通过自定义配置，而readTimeOut和writeTimeOut设置得可以相对长一些，例如60S左右，避免容易发生读/写的情况。

### 坑8：User-Agent请求头

默认在未设置User-Agent请求头的情况下，Okhttp3会添加其系统自带的User-Agent请求头，故未避免发生校验错误，建议默认都增加你的项目中系统的User-Agent。





