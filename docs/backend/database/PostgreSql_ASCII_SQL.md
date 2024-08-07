---
title: PostgreSQL-ASCII_SQL编码
---

首先，PostgreSQL是一种功能强大的开源关系型数据库管理系统（RDBMS），它以可靠性、数据完整性和高度可扩展性为特点。与常用的MySQL数据库相比：

1. 数据类型：PostgreSQL支持更多的数据类型，如范围类型、几何类型、JSON、XML等，而MySQL则更加注重传统的标量数据类型。
2. 扩展性：PostgreSQL支持更多的扩展，可以通过扩展增加新的功能，如全文搜索、地理信息系统、图形处理等。MySQL虽然也有一些扩展，但数量和质量都不如PostgreSQL。
3. 可靠性和数据完整性：PostgreSQL在这方面表现更好，它具有更强的事务支持、更完善的ACID特性和更好的数据完整性保障。MySQL虽然也支持事务和ACID特性，但在某些情况下可能会出现数据完整性问题。
4. 性能：MySQL在一些特定场景下表现更优秀，如处理大量简单查询的场景。但是，PostgreSQL在处理复杂查询、大量并发和高负载场景下表现更出色。
5. 社区支持：MySQL和PostgreSQL都有庞大的社区支持，提供了丰富的文档和资源。但是，PostgreSQL社区的技术水平较高，社区贡献者数量也相对较多，因此在技术支持和开发质量上略有优势。

这里重点讲述的就是一场关于PostgreSQL的血案！！！

## 背景：

某客户的数据库环境是一套Postgresql数据库环境。其中他们所使用的数据库客户端为华为自研的Data Studio软件，并且客户在该客户端中统一使用Data Studio编码为GBK，底层就是将客户端编码设置为了GBK编码：

```sql
set client_encoding to 'GBK';
```

然后，该套数据库环境的服务器编码为一种名为**SQL_ASCII**的编码格式

```sql
> show server_encoding;
> SQL_ASCII
```

这也是这场血案的罪魁祸首！！！

这边的需求是实现一套造数服务，能够在WEB端连接数据库，并可以进行数据库数据的批量造数，已经相关数据的查询操作。那么我们的实现逻辑是通过开源的HikariConfig进行Connection的创建工作，然后使用该Connection对象，进行对应insert，delete，select语句的批量执行。

在说明出现的问题之前，我们先来隆重介绍一下这个SQL_ASCII编码格式：

> SQL_ASCII是一种非Unicode编码格式，它是PostgreSQL数据库中的一种字符集编码格式。相比于其他字符集编码格式，SQL_ASCII更为简单，只是将每个字节解释为一个字符，不进行任何字符集转换。因此，SQL_ASCII不支持多字节字符和非ASCII字符。
>
> SQL_ASCII是一种低级字符集编码格式，它不对输入的数据进行任何验证或转换。这意味着如果在SQL_ASCII编码格式下输入非ASCII字符，这些字符将被简单地存储为字节序列，而不是被解释为特定的字符。这可能导致一些问题，例如无法正确地排序和比较字符串、无法正确地处理大小写等。

通过上面的简单介绍，就说明该编码的一大特点：不做任何的编解码处理，知识讲字节序列进行对应存储。那么，我们会发现，使用UTF8编码格式的客户端进行插入，查询，可以正常使用；换成GBK编码格式的客户端继续插入，查询，仍然可正常使用。是不是很高级的样子，但是当你切换为某一个编码格式的客户端时，之前另一种编码格式客户端插入的数据，此时查询出来，乱码了！！！！

在这样的背景下，我们的服务客户端是UTF8的格式，而用户之前都是在windows上使用GBK编码客户端进行数据管理的。此时，就会发现，在我们的WEB服务中，进行数据的新增和查询，中文均是乱码的格式！！！这种乱码应该如何处理呢？接下来将是血案的开端...

## 解决方案梳理：

这里，我以查询逻辑进行解决方案进行讲解...

```java
PreparedStatement preparedStatement = null;
ResultSet resultSet = null;
String jsonResult = StrUtil.EMPTY;
try {
  preparedStatement = connection.prepareStatement(selectSql);
  resultSet = preparedStatement.executeQuery();
  ResultSetMetaData resultSetMetaData = resultSet.getMetaData();
  int columnCount = resultSetMetaData.getColumnCount();
  JSONArray result = new JSONArray();
  while (resultSet.next()) {
    JSONObject item = new JSONObject();
    for(int i = 1; i <= columnCount; i++) {
      String columnName = resultSetMetaData.getColumnLabel(i);
      String value = resultSet.getString(columnName);
      //如果value值为空，则设置为"null"
      if (StrUtil.isBlank(value)) {
        item.putOpt(columnName, SymbolConstant.NULL);
      }else {
        item.putOpt(columnName, value);
      }
    }
    result.add(item);
  }
  jsonResult = JSON.toJSONString(result);
  //提交事务
  connection.commit();
}catch (SQLException | UnsupportedEncodingException ex) {
  //执行异常处理，向上抛业务异常，在父类AbstractDataEnvHandler中统一进行处理
  throw new BizException(BizCode.SQL_EXECUTE_ERROR.getCode(), ex.getMessage());
}finally {
  //省略关闭ResultSet,Statement和Connection操作
}
```

### 方案1：修改链接参数

看到这个乱码的第一解决方案，肯定是通过修改jdbc链接参数进行调整，故这里调整的第一个链接参数：

```sql
useUnicode=true&characterEncoding=gbk
```

配置完毕，执行select语句，没有任何反应，依旧乱码...

继续修改链接参数，考虑到数据库编码为SQl_ASCII，故这里调整为：

```sql
useUnicode=true&characterEncoding=SQl_ASCII
```

配置完毕，执行select语句，没有任何反应，依旧乱码...

继续修改，改变客户端的编码方式为gbk：

```sql
client_encoding=GBK
```

配置完毕，执行select语句，没有任何反应，依旧乱码...

继续修改...

- options = -c client_encoding=GBK
- client_encoding=utf8
- ....

大约采用了十几种链接参数的替换，但是查询结果始终如一，不免让我觉得这链接参数是不是坏了(-_-)...

### 方案2：代码逻辑进行编码修改

链接参数行不通，那只能代码层面去修改代码了，这里考虑我们的sql字符串是UTF8格式的，数据库需要的是GBK，很简单，编码格式做一下转换呗：

```java
String value = resultSet.getString(columnName);
//进行编码格式的转换
value = new String(value.getBytes(), 'GBK');
```

这下子，总可以了吧。结果，继续乱码，换了一种乱码的结果，总归还是属于乱码一家。

于是，我咨询了ChatGPT，它告诉我要在更改链接参数设置编码格式为SQL_ASCII的情况下，再进行上面的编码处理。好家伙！！！链接参数设置+代码处理并行，这次应该稳了，更改结束，执行查询结果纹丝不动，你真牛！！！在ChatGPT的继续询问，代码一步步调整下，我感觉已经越走越远，于是，我应该回到最初的起点，先去搞清楚数据库编码的底层原理，再来解决该问题。

于是，经过一番学习后（**输出数据库编码问题笔记**）。我再来看待这个问题：问题点在于我们的客户端编码为UTF8，即使你设置了其为GBK，底层还会通过UTF8编码格式进行存储，故不能直接设置编码格式来完成这一问题的解决。此时通过一篇stackoverflow上的文章(链接地址：https://stackoverflow.com/questions/49713964/insert-update-to-sql-ascii-encoding-postgresql)看到：

```java

```

故这里我首先将链接参数修改为`useUncode=true&characterEncoding=SQL_ASCII`，然后再在代码层面进行结果集的处理，这里会发现，不能获取对应字段的属性值字符串进行编码处理（上面的代码就是这样处理的，是失败的！！），必须直接通过resultSet获取对应字段的字节序列（因为SQL_ASCII保存的就是字节序列），然后将其进行GBK编码处理，从而得到我们的结果。

```java
String columnName = resultSetMetaData.getColumnLabel(i);
String value = StrUtil.EMPTY;
//如果jdbcUrl中包含characterEncoding=SQL_ASCII，则需要对查询结果进行编码处理(GBK编码处理)
if(StrUtil.isNotBlank(jdbcUrlParam) && StrUtil.containsIgnoreCase(jdbcUrlParam,	TableConstant.SQL_ASCII)) {
  //这里需要注意：需要从结果集resultSet中直接获取字节序列，然后进行编码转换，如果首先获取String值，再进行转换依旧会出现乱码
  value = new String(resultSet.getBytes(columnName), CharsetUtil.GBK);
}else {
  value = resultSet.getString(columnName);
}
```

通过这样一顿操作后，发现，查询不再乱码了！！！感恩的心！！！但是....插入和更新怎么弄呢？？？

## 最后的妥协：

看到查询可以以后，这边想着，在新增逻辑中，将字符串进行GBK编码的转换，然后使用Connection.createStatement()进行sql的执行，但是结果是失望的，还是不行！！！因为还是那个道理：我们查询结果是直接从结果集的字节序列中获取，并进行GBK编码。而这里的新增，我们的sql首先是UTF8编码的，转换为GBK编码的字符串以后，还是会通过UTF8编码进行存储的，故传递过去依旧还是会乱码的！！！这个是客户端编码无法设置为GBK导致的！！！你一定想说，我们可以使用statement先执行SQL：`set client_encoding to GBK`，但是抱歉，此时连接器执行该命令会报错的：

```shell
The server's client_encoding parameter was changed to GBK. The JDBC driver requires client_encoding to be UTF8 for correct operation
```

我们的JDBC客户端是UTF8的，你无法改为GBK，JDBC做了限制，除非....你修改JDBC源码，封装自己的JDBC，到那时为了一个编码问题，代价是不是有点大呢....

最后，我们发现，postgresql存在对应的convert函数，可以通过函数进行编码的转换，例如：

```sql
insert into user(id, name) values(1, '张三')；
```

此时，我们可以使用convert和convert_from函数来改造该sql，间接性在sql执行层面完成乱码问题的解决：

```sql
insert into user(id, name) values(1, convert_from(convert('张三', 'UTF8', 'GBK'), 'GBK'))
```

其中，首先使用convert函数将张三，从UTF8编码改为GBK编码，但是此时生成的是16进制字符串，我们还需要使用convert_from函数，再将16进制转换为GBK编码的字符串。通过这一顿操作，实现了新增，更新和删除操作乱码的解决，这也是一种赤裸裸的妥协！！！

最后的最后，必须再来提一下这个SQL_ASCII编码：它不强制存储在数据中的数据具有任何特定的编码格式，也不进行编解码操作保存，这虽然可以保存各种编码的数据，但同时也会带来了各种不当因素的乱码和风险问题，连官方也准备废弃它了。所以，还是老老实实把数据库编码设置为UTF8吧，安全可靠，也省事！！！！