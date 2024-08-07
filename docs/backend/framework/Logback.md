---
title: logback+Slf4j日志框架配置
---
 
## 快速入门

`Spring boot`默认支持的就是`slf4j`+`logback`的日志框架，想要灵活的定制日志策略，只需要我们在`src/main/resources`下添加对应的日志配置文件即可，一般我们在对应环境的`application-xxx.yml`中指定对应的日志配置文件`logback-xxx.xml`:

![image-20221018192314559](/img/backend/framework/logback/1.png)

配置文件中需要设置对应的日志配置项，其中对应的节点配置属性如下所示：

#### configuration（根结点），存在三个属性

* `scan`：当配置文件发生修改时，是否重新加载该配置文件，两个可选值`true` or `false`，默认为`true`。

* `scanPeriod`：检测配置文件是否修改的时间周期，当没有给出时间单位时默认单位为毫秒，默认值为一分钟,需要注意的是这个属性只有在`scan`属性值为`true`时才生效。

* `debug`：是否打印`loback`内部日志信息，两个可选值`true` or `false`，默认为`false`。

#### appender（日志策略节点），一个日志策略对应着一个appender，存在两个属性

* `name`：指定该节点的名称，方便之后的引用。

* `class`：指定该节点的全限定名，所谓的全限定名就是定义该节点为哪种类型的日志策略，比如我们需要将日志输出到控制台，就需要指定`class`的值为`ch.qos.logback.core.ConsoleAppender`;需要将日志输出到文件，则`class`的值为`ch.qos.logback.core.FileAppender`等

#### logger（设置某一包或者类的日志打印级别），并且引用appender来绑定对应的日志策略，存在三个属性

* `name`：用来指定受此`<logger>`约束的包或者类。

* `level`：可选属性，用来指定日志的输出级别，如果不设置，那么当前`<logger>`会继承上级的级别。

* `additivity`：是否向上级传递输出信息，两个可选值`true` or `false`，默认为`true`。

注意：在该节点下可以添加子节点`<appender-ref>`,该节点有一个必填的属性`ref`,值为我们定义的`<appender>`节点的`name`属性的值

#### root（特殊的logger节点，根节点的logger）

只存在level一个属性，同样下面可以插入对应的appender-ref节点，可配置多个日志策略

#### property（变量节点）

定义变量后，可以使`${}`来使用变量

#### contextName（上下文信息节点）

## 高阶使用

上面简单地了解了一下logback.xml常见的几个节点属性，这里重点介绍几种常见的Appender策略方式和日志过滤方式

#### ConsoleAppender 控制台输出策略

`ConsoleAppender`的功能是将日志输出到控制台，内部通过一个`<encoder>`子节点用来指定日志的输出格式。而`encoder`节点的作用是将日志信息转换为字节数组，再将字节数组写到输出流中，我们可以在`encode`节点中通过`pattern`子节点来定义日志的输出格式，通过`%+转换符`的格式来定义，其中存在以下几种常见的转换符：

* `%date{}`:输出时间，可以在花括号内指定时间格式，例如-`%data{yyyy-MM-dd HH:mm:ss}`，格式语法和`java.text.SimpleDateFormat`一样，可以简写为`%d{}`的形式，使用默认的格式时可以省略`{}`。

* `%logger{}`：日志的logger名称，可以简写为`%c{}`,`%lo{}`的形式，使用默认的参数时可以省略`{}`，可以定义一个整形的参数来控制输出名称的长度，有下面三种情况：

1. 不输入表示输出完整的`<logger>`名称
2. 输入`0`表示只输出`<logger>`最右边点号之后的字符串
3. 输入其他数字表示输出小数点最后边点号之前的字符数量

```
%thread`：产生日志的线程名，可简写为`%t
%line`:当前打印日志的语句在程序中的行号，可简写为`%L
%level`：日志级别,可简写为`%le`,`%p
%message`：程序员定义的日志打印内容,可简写为`%msg`,`%m
```

`%n`：换行,即一条日志信息占一行

故我们可以定义格式如下所示：

```xml
<appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
  <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
    <!--格式化输出：%d表示日期，%thread表示线程名，%-5level：级别从左显示5个字符宽度，%msg：日志消息，%n是换行符-->
    <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{20} - %msg%n</pattern>
  </encoder>
</appender>
```

#### FileAppender 输出到文件日志策略

表示将日志输出到文件，常见属性如下所示：

* `<file>`：定义文件名和路径，可以是相对路径 , 也可以是绝对路径 , 如果路径不存在则会自动创建
* `<append>`：两个值`true`和`false`，默认为`true`，表示每次日志输出到文件走追加在原来文件的结尾，`false`则表示清空现存文件
* `<encoder>`：和`ConsoleAppender`一样

一般情况下，我们使用``RollingFileAppender``策略，表示滚动纪录文件，先将日志记录到指定文件，当符合某种条件时，将日志记录到其他文件,常用的子节点。内部我们可以配置以下子节点：

* `<rollingPolicy>`：滚动策略，通过属性`class`来指定使用什么滚动策略，最常用是按时间滚动`TimeBasedRollingPolicy`,即负责滚动也负责触发滚动，有以下常用子节点：

1. `<fileNamePattern>`：指定日志的路径以及日志文件名的命名规则，一般根据`日志文件名+%d{}.log`来命名，这边日期的格式默认为`yyyy-MM-dd`表示每天生成一个文件，即按天滚动`yyyy-MM`，表示每个月生成一个文件，即按月滚动
2. `<maxHistory>`：可选节点，控制保存的日志文件的最大数量，超出数量就删除旧文件，比如设置每天滚动，且`<maxHistory>` 是7，则只保存最近7天的文件，删除之前的旧文件
3. `<encoder>`:同上
4. `<totalSizeCap>`:这个节点表示设置所有的日志文件最多占的内存大小，当超过我们设置的值时，`logback`就会删除最早创建的那一个日志文件。

故我们可以根据上面的描述，配置一个``RollingFileAppender``：

`TimeBasedRollingPolicy`

```xml
<property name="LOG_HOME" value="/home/logs"/>
<appender name="AppFileLog" class="ch.qos.logback.core.rolling.RollingFileAppender">
  <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
    <FileNamePattern>${LOG_HOME}/test.%d{yyyy-MM-dd}.log</FileNamePattern>
    <!--保留日志的时间-->
    <MaxHistory>7</MaxHistory>
    <!--指定日志文件的大小上限(所有的日志文件最多占的内存大小)-->
    <totalSizeCap>1GB</totalSizeCap>
  </rollingPolicy>
  <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
    <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{20} - %msg%n</pattern>
  </encoder>
</appender>
```

`SizeAndTimeBasedRollingPolicy`

注意：这种策略方式，多了一个`<maxFileSize>`节点，所以我们在`<fileNamePattern>`需要多加上`.%i`的字符，这个很关键！！！

```xml
<property name="LOG_HOME" value="/home/logs"/>
<appender name="AppFileLog" class="ch.qos.logback.core.rolling.RollingFileAppender">
  <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
    <FileNamePattern>${LOG_HOME}/test.%d{yyyy-MM-dd}.%i.log</FileNamePattern>
    <!--保留日志的时间-->
    <MaxHistory>7</MaxHistory>
    <!--指定日志文件的大小上限(所有的日志文件最多占的内存大小)-->
    <totalSizeCap>1GB</totalSizeCap>
    <!-- 单个文件的最大内存 -->
    <maxFileSize>100MB</maxFileSize>
  </rollingPolicy>
  <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
    <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{20} - %msg%n</pattern>
  </encoder>
</appender>
```

#### 日志过滤

日志的级别信息有以下几种：

- `TRACE`
- `DEBUG`
- `INFO`
- `WARN`
- `ERROR`

我们在开发测试环境一般需要将日志级别定义在**DEBUG**，而在生产环境，则需要将日志级别定义到**INFO**或者**ERROR**

通常情况下，我们将日志过滤器定义在**appender**节点中，一个`Appender`可以配置一个或者多个过滤器，有多个过滤器时按照配置顺序依次执行，当然也可以不配置，其实大多数情况下我们都不需要配置，但是有的情况下又必须配置，所以这里也介绍下常用的也是笔者曾经使用过的两种过率机制：级别过滤器`LevelFilter`和临界值过滤器`ThresholdFilter`。

其中，filter节点可以配置以下属性：

- `DENY`:日志将被过滤掉，并且不经过下一个过滤器
- `NEUTRAL`:日志将会到下一个过滤器继续过滤
- `ACCEPT`：日志被立即处理，不再进入下一个过滤器

##### LevelFilter 级别过滤器

举个例子，我们如果在这个日志策略中只处理`ERROR`级别的日志，可以参考如下配置，只会接收级别为`ERROR`的日志，不满足的日志则返回**DENY**被丢弃掉。

```xml
<filter class="ch.qos.logback.classic.filter.LevelFilter">
  <level>ERROR</level>
  <onMatch>ACCEPT</onMatch>
  <onMismatch>DENY</onMismatch>
</filter>
```

##### ThresholdFilter 临界值过滤器

依旧举个例子，如果我们想处理`INFO`级别以上的日志，则可以参考如下配置，此时日志级别等于或者高于该临界值的日志，过滤器将会返回**NEUTRAL**，低于则返回**DENY**被丢弃掉。

```xml
<filter class="ch.qos.logback.classic.filter.ThresholdFilter">   
    <level>INFO</level>   
</filter>
```

## 日志模版

想要使用Slf4j + logback，其实很简单：

* 配置`logback-spring.xml`
* 进行日志打印
  * 需要使用日志对象的方法里边都要定义一次`private final static Logger log = LoggerFactory.getLogger(xxx.class);`其中`xxx`代指当前类名
  * 引入lombok依赖，在需要使用日志的类上添加注解`@Slf4j`，推荐使用！！！

而通过上面的讲解，其实我们就能够参考其配置一个企业开发相对完整`logback.xml`文件了，这里我假设项目名为`blog-test`，配置一个线上环境的日志文件模版如下所示：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration debug="false">
    <!--日志上下文-->
    <contextName>blog-web-dev</contextName>
    <!--定义日志文件的存储地址,这里日志挂载本地电脑/Users/feng/logs文件夹下-->
    <property name="LOG_HOME" value="/Users/feng/logs"/>
    <!-- 控制台输出日志策略-->
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <!--格式化输出：%d表示日期，%thread表示线程名，%-5level：级别从左显示5个字符宽度%msg：日志消息，%n是换行符-->
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>
        </encoder>
    </appender>
    <!-- 默认日志输出策略-->
    <appender name="DefaultFileLog" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <!--过滤INFO以下级别的日志        -->
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>INFO</level>
        </filter>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!--日志文件输出-->
            <FileNamePattern>${LOG_HOME}/blog-web-dev_default.%d{yyyy-MM-dd}.log</FileNamePattern>
            <!--保留日志的时间-->
            <MaxHistory>7</MaxHistory>
            <!--指定所有日志文件的大小上限-->
            <totalSizeCap>1GB</totalSizeCap>
        </rollingPolicy>
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>
        </encoder>
    </appender>

    <!--错误日志输出策略-->
    <appender name="ErrorFileLog" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <!--只输出记录ERROR级别的日志内容-->
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>ERROR</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!--日志文件输出-->
            <FileNamePattern>${LOG_HOME}/blog-web-dev_error.%d{yyyy-MM-dd}.log</FileNamePattern>
            <!--保留日志的时间-->
            <MaxHistory>7</MaxHistory>
            <!--指定日志文件的大小上限-->
            <totalSizeCap>1GB</totalSizeCap>
        </rollingPolicy>
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>
        </encoder>
    </appender>

    <!--请求-响应日志输出策略-->
    <appender name="AccessFileLog" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <FileNamePattern>${LOG_HOME}/blog-web-dev_access.%d{yyyy-MM-dd}.log</FileNamePattern>
            <!--保留日志的时间-->
            <MaxHistory>7</MaxHistory>
            <!--指定日志文件的大小上限-->
            <totalSizeCap>1GB</totalSizeCap>
        </rollingPolicy>
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>
        </encoder>
    </appender>

    <!-- logger配置-->
    <!--数据库相关日志输出级别配置-->
    <logger name="com.apache.ibatis" level="TRACE"/>
    <logger name="java.sql.Connection" level="DEBUG"/>
    <logger name="java.sql.Statement" level="DEBUG"/>
    <logger name="java.sql.PreparedStatement" level="DEBUG"/>
    <!--请求-响应处理器类日志输出级别配置-->
    <logger name="com.feng.web.handler.RequestLogHandler" level="INFO" additivity="false">
        <appender-ref ref="AccessFileLog"/>
    </logger>
    <logger name="com.feng.web.handler.ResponseLogHandler" level="INFO" additivity="false">
        <appender-ref ref="AccessFileLog"/>
    </logger>
    <!-- 默认的日志输出级别配置-->
    <root level="INFO">
        <appender-ref ref="STDOUT"/>
        <appender-ref ref="DefaultFileLog"/>
        <appender-ref ref="ErrorFileLog"/>
    </root>
</configuration>
```

同时，针对请求和响应，我们定义两个处理器，分别实现RequestBodyAdvice和ResponseBodyAdvice：

**RequestLogHandler**

```java
@ControllerAdvice
@Slf4j
public class RequestLogHandler implements RequestBodyAdvice {
    @Override
    public boolean supports(MethodParameter methodParameter, Type type, Class<? extends HttpMessageConverter<?>> aClass) {
        return true;
    }

    @Override
    public Object handleEmptyBody(Object body, HttpInputMessage httpInputMessage, MethodParameter methodParameter, Type type, Class<? extends HttpMessageConverter<?>> aClass) {
        Method method = methodParameter.getMethod();
        log.info("request: {}.{}",method.getDeclaringClass().getSimpleName(), method.getName());
        return body;
    }

    @Override
    public HttpInputMessage beforeBodyRead(HttpInputMessage httpInputMessage, MethodParameter methodParameter, Type type, Class<? extends HttpMessageConverter<?>> aClass) throws IOException {
        return httpInputMessage;
    }

    @Override
    public Object afterBodyRead(Object body, HttpInputMessage httpInputMessage, MethodParameter methodParameter, Type type, Class<? extends HttpMessageConverter<?>> aClass) {
        Method method = methodParameter.getMethod();
        log.info("request: {}.{}:{}", method.getDeclaringClass().getSimpleName(), method.getName(), JSON.toJSON(body));
        return body;
    }
}
```

**ResponseLogHandler**

```java
@ControllerAdvice
@Slf4j
public class ResponseLogHandler implements ResponseBodyAdvice<Object> {
    @Override
    public boolean supports(MethodParameter methodParameter, Class<? extends HttpMessageConverter<?>> aClass) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter methodParameter, MediaType mediaType, Class<? extends HttpMessageConverter<?>> aClass, ServerHttpRequest serverHttpRequest, ServerHttpResponse serverHttpResponse) {
        Method method = methodParameter.getMethod();
        log.info("response:{}.{}:{}", method.getDeclaringClass().getSimpleName(), method.getName(), JSON.toJSON(body));
        return body;
    }
}
```

