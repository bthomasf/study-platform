---
title: Mysql数据库编码
---

想必很多人都遇到过数据库新增数据，查询数据时发生的乱码问题。这篇文章就来和大家一起聊聊数据库的编码问题（这里主要以主流数据库MySQL为例）

首先我们来看一个简单的建表语句：

```sql
# 建表，分别设置charset为utf8mb4，utf8，gbk
create table test_utf8mb4
(
    id          int auto_increment
        primary key,
    username    varchar(255) default ''                not null comment '用户名',
    password    varchar(255) default ''                not null comment '用户密码',
    email       varchar(255) default ''                not null comment '用户邮箱'
) charset = utf8mb4;
```

此时通过charset=xxx即设置了该表默认的字符集，这里的表我分别设置了较为常用的字符集utf8mb4，其中，还有类似GBK，UTF8之类的编码方式：

>GBK 是一种固定长度的编码方式，用于表示中文字符集和部分符号，它使用双字节编码，每个字符占用两个字节的存储空间。 
>
>UTF-8 是一种可变长度的编码方式，它能够表示 Unicode 字符集中的所有字符，包括 ASCII 字符和多字节字符，使用 1-4 个字节编码不同的字符。
>
>UTF-8mb4 是 UTF-8 的一个扩展，用于支持 Unicode 4.1及其之后的版本，包括一些特殊字符、表情符号等。UTF-8mb4 和 UTF-8 的编码方式相同，都是可变长度的编码方式，但 UTF-8mb4 中的一些字符可能需要使用 4 个字节进行编码，相对于 UTF-8 使用 1-3 个字节编码不同的字符，UTF-8mb4 的存储空间消耗会更大。

那么，什么时候进行插入，查询的时候，会导致乱码问题呢？且听吾慢慢道来。

首先，我们来看几个命令：

```sql
# 查看数据库所有支持的字符集编码
mysql> show character set
```

这里，我们查看的结果如下所示：

![image-20230705213828703](/img/backend/database/mysqlencode/数据库编码-1.png)

```sql
# 查看系统的字符集设置
mysql> show variables like '%char%';
```

![image-20230705214251788](/img/backend/database/mysqlencode/数据库编码-2.png)

这里我们会看到几个重要的参数：

- character_set_client : 客户端编码
- character_set_connection : 连接器编码
- character_set_server : 服务端编码
- character_set_results：结果集编码

其中的**连接器编码**就是建立连接生成的**Connection的编码方式**（连接器的作用主要就是连接客户端与服务端，进行字符集的转换和对应sql的传输，执行）。

那么从客户端编写sql到连接器最后保存到服务器的数据库中，是怎么样的一个流程呢？

**连接器的工作流程**

![image-20230705220409147](/img/backend/database/mysqlencode/数据库编码-3.png)

**客户端 --> 服务端**

第一步：客户端的字符先发给**连接器**，连接器通过一种编码方式将其进行转换(转换之后的编码，与**连接器的编码**格式一致)，进行临时存储。

第二步：接着，连接器再次将字符数据转换成**服务器需要的编码**，并最终存储在服务器中。

**服务端 --> 客户端**

服务器返回的结果，再次先通过**连接器**，连接器将其转化为与**客户端一致的字符集**，就可以在客户端正常显示。

举例：当我们使用**windows**的cmd进行该数据的连接，此时这里客户端的编码是**GBK**的，那么假设连接器的字符集编码是**utfmb4**的，而数据库表的字符集编码是**utfmb4**的，那么工作的流程如下所示：

> 插入：客户端输入的字符，使用的字符集是GBK。当经过连接器的时候，连接器会进行"字符集的自动转换"，将原来的字符(以GBK进行编码)转换为以utf8mb4格式的编码字符，临时存储在连接器中。接着，连接器发现mysql服务器使用的字符集，与自身字符集完全一致，都是utf8mb4。于是，直接发给mysql服务器，进行最终的存储。
>
> 查询：mysql服务器会将结果以utf8mb4编码格式进行返回，通过连接器的时候，连接器发现mysql服务器的字符集，与自身字符集一致，于是顺利通过连接器。当连接器准备将结果发送给客户端的时候，发现客户端要求返回的结果集编码是GBK。因此，连接器会进行"字符集的自动转换"，将返回的结果(以utf8mb4进行编码)转换为以GBK格式的编码，进行显示，并最终发送给客户端，显示在CMD窗口中。

这里，一般情况下，客户端和客户端查询结果集的编码方式保持一致性。

然后，我们在DataGrip的控制窗口进行模拟演示：首先，我们通过上面的查询命令`show variables like '%char%';`已知客户端，连接器和服务端的字符集编码格式均为**utf8mb4**，此时插入数据和查询数据肯定是正常显示的，三种编码格式一致也是我们最想需要的情况。但是如果我们将客户端的字符集设置的和我们真实的是不匹配的，那么问题就来了：

### 情况1：我们设置客户端的字符集为GBK，和实际编码不一致

```
set character_set_client=gbk;
```

此时，我们插入数据

```sql
insert into test_utf8mb4 (username, password, email) values('张三', '密码1234', 'test1@163.com');
```

我们查看数据，发现插入的数据已经乱码了，此时插入的不是”张三“，而是”寮犱笁“
![image-20230705222143846](/img/backend/database/mysqlencode/数据库编码-4.png)

因为我们说错了客户端的字符集编码方式！！！将`character_set_client`调整会原来的utf8mb4以后，我们再插入几条语句，查询显示就又是正常的了！

![](/img/backend/database/mysqlencode/数据库编码-5.png)

那为什么客户端字符集编码格式发生变化，就会导致乱码问题？具体原因是什么呢？

> 张三对应的GBK编码的字符序列为：\xB3\xC9\xCB\xAE，其中\xB3\xC9为张，\xCB\xAE为三，每个汉字占两位字节。
>
> 如果正常情况下，客户端是GBK的，那么到达连接器，就会将\xB3\xC9\xCB\xAE解码为“张三”，转换为utf8mb4对应的字符编码，\xE5\xBC\xA0\xE4\xB8\x89，\xE5\xBC\xA0为张，\xE4\xB8\x89为三。
>
> 但是现在客户端是utf8mb4的编码，但是你却错误的告知是GBK的，它会使用GBK进行编码，然后底层还是会使用UTF8编码方式去存储这些字节。到达连接器时，会使用GBK进行解码，但是，此时，GBK编码下解码后得到的字符序列是错误，最后就生成乱码的“寮犱笁”。

### 情况2：我们设置查询结果的编码为GBK：

这里我们先在最初正确的情况下插入三条数据：

![image-20230706092955825](/img/backend/database/mysqlencode/数据库编码-7.png)

然后，我们设置查询结果编码为GBK：

```sql
set character_set_results=gbk;
```

此时再进行结果的查询，发现结果也是正常的!

> 这是由于当连接器发现客户端的查询编码是GBK，就会将其转换为GBK编码进行显示，但是这些中文在GBK中是存在的，故能够正常显示。

但是再当我们设置结果编码为**Latin1**时:

```sql
set character_set_results=Latin1;
```

查询中文都显示为了问号？，这又是什么原因导致的呢？

> 这是由于latin1中无法保存中文，故对应转换时的中文，丢失字节了，无法正常显示，就变成了？

![image-20230706093403521](/img/backend/database/mysqlencode/数据库编码-8.png)

### 情况3：我们这里将`character_set_connection`设置为latin1，然后插入数据：

```sql
insert into test_utf8mb4 (username, password, email) values('王五', '密码0000', 'test1@163.com');
```

此时，再进行查询表，发现，插入的中文变成了？？，这是为什么呢？

> 其实和上面的情况是一致的，就是因为latin1的字符集容量较小，当utf8mb4字符集的字符转为latin1的时候，会丢失字节，就像失真一样！！故最后再变成utf8mb4时，就变成了？？的形式插入到了表中。

![image-20230705223304828](/img/backend/database/mysqlencode/数据库编码-6.png)

通过上面的分析，可以看出数据库出现的乱码问题来源主要就是以下三种原因造成的：

* 客户端编码和实际编码格式不一致，会导致不可修复的中文乱码 
* 查询结果集编码设置的编码容量较小，导致部分转换大容量字节，无法转换显示，这种乱码可修复！

- 在传输过程中，由于编码不一致，**大容量字节转换为小容量字节**，导致部分字节丢失，造成的乱码，不可修复。故需要保证新增时，字符集编码：**服务器>=连接器>=客户端**；查询时：字符姐编码：**客户端结果>=连接器>=服务器**。当然，最好，也是最佳的设置的方式，就是保证这四种编码方式的一致性！！！

### 编码链接参数

讲完了几种常见的乱码，我们来看看常见的几种编码链接参数的作用，因为我们经常在jdbc链接串中添加一些链接参数，来帮助我们解决一些编码问题：

#### 链接参数1：useUnicode=true/false

`useUnicode=true`是JDBC连接字符串中的一个参数，用于指定是否使用Unicode编码来处理数据。当该参数设置为 true 时，JDBC 会将数据以Unicode编码的形式处理，否则就会按照指定的字符集编码来处理数据。

实质上，`useUnicode=true`的作用是告诉JDBC驱动程序在处理数据时使用Unicode编码，这可以保证数据在不同的平台上传输和存储时不会出现乱码问题。当JDBC驱动程序接收到一个字符串时，它会将这个字符串转换成Unicode编码，然后再将其传输到数据库中。在查询数据时JDBC驱动程序会将数据库返回的Unicode编码的数据转换成客户端指定的字符集编码。

需要注意的是：当使用`useUnicode=true`参数时，还需要指定`characterEncoding`参数来指定所使用的字符集编码，即下面的链接参数2

#### 链接参数2：characterEncoding=utf8/gbk/xxx

`characterEncoding=utf8` 是 JDBC 连接字符串中的一个参数，用于指定在 JDBC 连接中所使用的字符编码。它的作用是告诉 **JDBC 驱动程序将数据以指定的字符编码来处理，以便正确地将数据传输到数据库中或从数据库中读取数据时正确地解码数据**。PS：这里的驱动程序就是生成的Connection连接器。

具体来说，当连接字符串中设置了 `characterEncoding=utf8` 参数时，JDBC 驱动程序会将传输到数据库中的数据以 UTF-8 编码的形式进行处理。在查询数据时，JDBC 驱动程序会将从数据库中读取的数据以 UTF-8 编码的形式解码，以便正确地呈现给客户端应用程序。

这样说来，你是不是想起了上面的连接器编码`character_set_connection`，那这两者有何区别呢?

- `characterEncoding=utf8` 和 `character_set_connection` 都是用于指定数据库连接中所使用的字符编码的参数，但它们的作用不同。

- `characterEncoding=utf8` 参数是在 JDBC 连接字符串中设置的，用于告诉 JDBC 驱动程序将数据以 `UTF-8 编码`的形式进行处理。具体来说，当连接字符串中设置了 `characterEncoding=utf8` 参数时，JDBC 驱动程序会将传输到数据库中的数据以` UTF-8` 编码的形式进行处理，以便正确地将数据传输到数据库中或从数据库中读取数据时正确地解码数据。

- `character_set_connection` 参数则是在 `MySQL 数据库`中设置的，用于指定`连接中的字符集编码`。具体来说，当连接中的客户端发送数据到服务器时，服务器会将这些数据从客户端字符集转换为 `character_set_connection` 所指定的字符集；当客户端从服务器中取得数据时，服务器会将这些数据从 `character_set_connection` 所指定的字符集转换为客户端字符集。

因此，`characterEncoding=utf8` 参数是在 JDBC 连接中设置的，用于告诉 `JDBC 驱动程序`将数据以` UTF-8 编码`的形式进行处理；而 `character_set_connection` 参数是在 MySQL 数据库中设置的，用于指定连接中的字符集编码，它会影响到客户端和服务器之间的字符集转换。总之，`characterEncoding=utf8` 和 `character_set_connection` 都是用于指定数据库连接中所使用的字符编码的参数。

#### 其他链接参数：

除了上面两种编码链接参数外，还有我们上面刚开始提到的一些参数：

`character_set_client`：用于指定客户端的字符集编码，它会影响客户端和服务器之间的字符集转换

`character_set_results`：用于指定查询结果集的字符集编码

`character_set_database`：用于指定数据库的默认字符集编码

`connectionCollation`：用于指定连接的字符集校对规则（collation），它会影响到字符比较和排序的结果

其中：`character_set_server`参数用于指定服务器端使用的默认字符集编码，一般不允许作为链接参数修改。

还有我们经常会在sql控制台执行一个命令`set name gbk/utf8`，它的一个作用就是简洁化地完成了以下三条SQL的执行：

```sql
set character_set_client=gbk/utf8;
set character_set_connection=gbk/utf8;
set character_set_results=gbk/uft8;
```

