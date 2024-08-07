---
title: 获取MimeType(文件类型)
---

有的时候我们需要获取一个文件的MimeType，测试在Java这门语言当中提供了几种方式：

## 方式1: URLConnection

```java
FileNameMap fileNameMap = URLConnection.getFileNameMap()
String mimeType = fileNameMap.getContentTypeFor(fileName);  
```

缺点：

* 库的完整性不够，可能有些文件解析出来为null

## 方式2: 工具类FileTypeUtil

```java
File file = new File("path/to/file");
String mimeType = FileTypeUtil.getType(file);
```

缺点：

* Hutools的`FileTypeUtil.getType(file)`方法是通过读取文件头信息来判断文件类型的，对于一些特殊的文件类型，例如.xlsx，它的文件头信息与.zip文件相同，因此会被识别为zip文件

## 方式3: Apache Tika开源库

```java
Tika tika = new Tika();
String mimeType = tika.detect(file);
```

注意：

* 使用Tika需要引入对应的依赖，maven依赖如下所示：

```java
<dependency>
    <groupId>org.apache.tika</groupId>
    <artifactId>tika-core</artifactId>
    <version>1.27</version>
</dependency>
```

* 构建Tika过程相对较慢，可以将其注入Bean使用