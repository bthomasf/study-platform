---
title: Flyway
---

flyway是一款**数据库版本管理工具**

### 1. 工作原理

flyway通过历史记录表(**flyway_schema_history**)来记录版本历史。每次随项目启动时将会自动扫描在**resources/db/migration**下的文件，并查询**flyway_schema_history**判断是否为新增文件？

* 如果是新增的文件，则执行该迁移文件
* 如果不是，则忽略该文件

**flyway_schema_history**的表结构：

```sql
create table flyway_schema_history
(
    installed_rank int                                 not null
        primary key,
    version        varchar(50)                         null,
    description    varchar(200)                        not null,
    type           varchar(20)                         not null,
    script         varchar(1000)                       not null,
    checksum       int                                 null,
    installed_by   varchar(100)                        not null,
    installed_on   timestamp default CURRENT_TIMESTAMP not null,
    execution_time int                                 not null,
    success        tinyint(1)                          not null
);

create index flyway_schema_history_s_idx
    on flyway_schema_history (success);
```

### 2. SpringBoot整合flyway

再多的讲解不如快速上手使用能让人赏心悦目，这里通过SpringBoot整合flyway来进行数据库版本的控制使用：

#### 第一步：使用Spring初始化创建项目flyway_demo

**pom.xml文件**添加数据库连接和fly依赖：

```xml
<dependency>
  <groupId>org.flywaydb</groupId>
  <artifactId>flyway-core</artifactId>
</dependency>

<dependency>
  <groupId>mysql</groupId>
  <artifactId>mysql-connector-java</artifactId>
  <scope>runtime</scope>
</dependency>

<!--大坑：jdbc的依赖，不然项目启动flyway没有任何效果，但是也不报错！！！-->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
```

此时，在/src/main/resources路径下会增加`db/migration`目录

![image-20220825193944461](/img/backend/framework/flyway/flyway01.png)

注意：

src/resources下的db/migration目录，在其中创建对应的SQL文件，其中又分为不同的文件类型，基于约定由于配置的原则，通过文件命名方式进行区分

* 版本迁移以**V**开头，只会执行一次；
* 回退迁移以**U**开头，一般不使用；
* 可重复执行迁移以**R**开头，每次修改后都会重新执行

#### 第二步：application.yml中添加相关配置

```yaml
server:
  port: 10002
spring:
  flyway:
    enabled: true # 开启flyway
    clean-disabled: true # 禁止清理数据表
    table: flyway_schema_history # 版本控制信息表名，默认为flyway_schema_history
    out-of-order: false # 是否允许不按顺序迁移
    baseline-on-migrate: true # 如果数据库不是空表，需要设置为true，否则启动报错
    baseline-version: 1 # 和baseline-on-migrate搭配使用，小于此版本的不执行
    # schemas: 不设置使用默认Spring连接数据的地址和数据库
    validate-on-migrate: true # 执行迁移时是否自动调用验证
    locations: classpath:db/migration
	# 配置数据库，flyway那边就无需再进行数据的配置了
  datasource:
    driver-class-name: com.mysql.jdbc.Driver
    url: jdbc:mysql://localhost:3306/test?useUnicode=true
    username: root
    password: root
  application:
    name: flyway_demo
```

#### 第三步：在db/migration目录下创建sql脚本

**V1_1.sql：**

```sql
CREATE TABLE if NOT EXISTS `test_user` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `name` varchar(128) NOT NULL COMMENT '名称',
PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;
```

此时启动项目，第一次会为我们在对应数据库创建`flyway_schema_history`，同时扫描sql脚本，进行sql执行，同时将执行记录历史保存到该表中。每次项目启动时就会进行重新扫描，将新增的sql脚本进行对应的执行，并进行记录，达到控制管理效果。

![image-20220826093142640](/img/backend/framework/flyway/flyway02.png)

此时我们再定义sql脚本V1_2，再启动项目时，就会发现V1_2配置的内容也同步到flyway_schema_history中，同时为我们创建表：

![image-20220826093339642](/img/backend/framework/flyway/flyway03.png)

#### 补充：

我们可以安装对应的flyway-plugin插件进行flyway的手动管理，配置过程如下所示：

**方式1：在settings-plugins中搜索并安装`Flyway Migration Creation`插件，此时点击Idea窗口左上角的`File-New`就会出现对应的插件**

![image-20220826093755952](/img/backend/framework/flyway/flyway04.png)

**方式2：在pom文件中添加对应的plugin：**

```xml
<build>
  <plugins>
    <!--注意：数据库用户标签为user，而非username-->
    <plugin>
      <groupId>org.flywaydb</groupId>
      <artifactId>flyway-maven-plugin</artifactId>
      <configuration>
        <driver>com.mysql.cj.jdbc.Driver</driver>
        <url>jdbc:mysql://localhost:3306/test?useUnicode=true</url>
        <user>root</user>
        <password>root</password>
      </configuration>
    </plugin>
  </plugins>
</build>
```

添加以后刷新maven，此时在Plugins中会出现对应的`flyway`:

![image-20220826094124366](/img/backend/framework/flyway/flyway05.png)

flyway总共存在以下几种命令：

* baseline：根据现有数据库结构生成一个基准迁移脚本
* clean：删除所有创建的数据库对象，包括用户，表，视图等等
* info：获取目前数据库的状态信息
* migrate：对数据库依次应用版本更改
* repair：修复命令尽量不要使用
* undo：
* validate：验证已Apply的脚本是否有变更，flyway的migration默认会先做validate

注：同时，flyway也支持pojo类到数据库表的自动创建操作！！！有兴趣的可以进flyway官网进行查看https://flywaydb.org/documentation/