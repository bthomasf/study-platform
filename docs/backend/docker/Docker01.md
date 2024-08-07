---
title: 初识Docker
---

## 1.1 Docker安装

第一步: 进入Docker官网,点击指定的Linux环境,我这里是CentOS,首先检查删除之前旧版本的Docker

```shell
复制 官网网址: https://docs.docker.com/engine/install/centos/
 检查删除命令:
 $sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
java
```

第二步: 安装Docker依赖的一些依赖的包

```shell
复制 $sudo yum install -y yum-utils
 $sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
java
```

第三步: 安装docker-ce docker-ce-cli [containerd.io](http://containerd.io/)

```shell
复制sudo yum install docker-ce docker-ce-cli containerd.io 
java
```

第四步:启动Docker

```
复制sudo systemctl start docker
java
```

第五步: 我们可以进行docker的检查

```shell
复制此时我们可以检查一下Docker的版本信息 docker -v
sudo docker images 检查docker里面存在的镜像
设置开机自启动
sudo systemctl enable docker
java
```

第六步: 设置Docker阿里云镜像加速

```shell
复制sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://9biurf3b.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
java
```


## 1.2 Docker常见命令

#### 拉取镜像

```shell
docker pull xxx
```

#### 启动镜像

```shell
docker run 
-e TZ="Asia/Shanghai" \
-d -p 9090:9090 \
-v /blog/logs/blog-web/:/log \
--name blog-web 容器id
--restart=always
```

#### 进入镜像容器

```shell
docker exec -it 镜像id/镜像名 /bin/bash
```

#### 停止容器

```shell
docker stop 容器id
```

#### 删除容器

```shell
docker ps -a # 列出所有容器
docker rm 容器id
```

#### 删除容器镜像

```shell
docker rmi 镜像id
```

#### 列出启动的容器

```shell
docker ps
```

#### 列出所有容器【包括停止的】

```shell
docker ps -a
```

#### 重启容器

```shell
docker restart 容器id/容器名
```

#### 列出所有镜像

```shell
docker images
```

#### 复制宿主文件到docker某容器路径中

```shell
docker cp {宿主文件路径} 容器id:{容器的指定路径}
```

## 1.3 Docker安装环境实例

### MySQL

```shell
//安装MySQL环境: 
sudo docker pull mysql:5.7
//进行mysql的docker和linux的绑定[docker容器挂载和端口映射]
sudo docker run -p 3306:3306 --name mysql \
-v /mydata/mysql/log:/var/log/mysql \
-v /mydata/mysql/data:/var/lib/mysql \
-v /mydata/mysql/conf:/etc/mysql \
-e MYSQL_ROOT_PASSWORD=root \
-d mysql:5.7
//安装完毕以后检查MySql: 
sudo docker images
docker ps

//修改linux挂载的mysql配置文件
vim /mydata/mysql/conf/my.cnf

[client]
default-character-set=utf8

[mysqld]
init_connect='SET collation_connection = utf8_unicode_ci'
init_connect='SET NAMES utf8'
character-set-server=utf8
collation-server=utf8_unicode_ci
skip-character-set-client-handshake
skip-name-resolve

//然后重启mysql
docker restart mysql
//此时mysql已经安装完毕,我们可以去docker容器中的mysql的my.cnf文件[cd /etc/mysql]中查看是否和linux中我们修改的文件保持一致
//进入mysql容器内部命令
docker exec -it mysql /bin/bash
//设置mysql开机自启动
sudo docker update mysql --restart=always
```

### Redis

```shell
//第一步,下载最近的镜像文件
docker pull redis
//第二步,创建实例并启动
mkdir -p /mydata/redis/conf
touch /mydata/redis/conf/redis.conf

docker run -p 6379:6379 --name redis -v /mydata/redis/data:/data \
-v /mydata/redis/conf/redis.conf:/etc/redis/redis.conf \
-d redis redis-server /etc/redis/redis.conf

/进入redis
docker exec -it redis redis-cli
//修改redis配置文件,进行持久化设置
cd /mydata/redis/conf
vim redis.conf
添加 appendonly yes
然后重启redis
docker restart redis
设置自启动
sudo docker update redis --restart=always
至此我们的redis已经安装完毕...
```

### Nginx

```shell
#录取nginx镜像
docker pull nginx
#查看nginx镜像,并记录image前4位
docker images nginx
#测试nginx是否可用
docker run -d --name nginx -p 80:80 【nginx镜像前四位】

-d 指定容器以守护进程方式在后台运行
–name 指定容器名称，此处我指定的是nginx
-p 指定主机与容器内部的端口号映射关系，格式 -p [宿主机端口号]：[容器内部端口]
```

通过`docker ps`查看`nginx`正常运行…

![在这里插入图片描述](https://img-blog.csdnimg.cn/72f17888369a44169e6356af2e465cc1.png#pic_center)

直接在web端访问：

![在这里插入图片描述](https://img-blog.csdnimg.cn/ef67129918f04c30946aae811f0c4b7a.png#pic_center)

此时，我们需要解决的即是配置文件挂载在容器外部【转移到宿主主机内部中】

**复制配置文件到宿主主机对应目录下：**

```shell
docker cp 容器id:/etc/nginx/nginx.conf /mydata/nginx/
docker cp 容器id:/etc/nginx/conf.d /mydata/nginx/conf/
docker cp 容器id:/usr/share/nginx/html/ /mydata/nginx/html/
docker cp 容器id:/var/log/nginx/ /mydata/nginx/logs/

这里我的容器id前缀为3d43
docker cp 3d43:/etc/nginx/nginx.conf /mydata/nginx/
docker cp 3d43:/etc/nginx/conf.d /mydata/nginx/conf/
docker cp 3d43:/usr/share/nginx/html/ /mydata/nginx/
docker cp 3d43:/var/log/nginx/ /mydata/nginx/logs/
```

**停止并移除容器：**

```shell
docker stop 3d43【容器id】
docker rm 3d43
```

**最后再次以容器的文件作为挂载进行nginx的启动：**

```shell
docker run  --name nginx -m 200m -p 80:80 -p 443:443 \
-v /mydata/nginx/nginx.conf:/etc/nginx/nginx.conf \
-v /mydata/nginx/logs/:/var/log/nginx \
-v /mydata/nginx/html/:/usr/share/nginx/html \
-v /mydata/nginx/conf/conf.d:/etc/nginx/conf.d \
-e TZ=Asia/Shanghai \
--privileged=true -d nginx

#再配置nginx自启动
sudo docker update nginx --restart=always

# 注意
上面同时开启了80和443端口，为了后续配置ssl需要开启443端口服务
```

参数说明：

```shell
参数说明
-name  给你启动的容器起个名字，以后可以使用这个名字启动或者停止容器
-p 　　  映射端口，将docker宿主机的80端口和容器的80端口进行绑定
-v 　　　挂载文件用的，
-m 200m 分配内存空间
-e TZ=Asia/Shanghai  设置时区
第一个-v 表示将你本地的nginx.conf覆盖你要起启动的容器的nginx.conf文件，
第二个-v 表示将日志文件进行挂载，就是把nginx服务器的日志写到你docker宿主机的/home/docker-nginx/log/下面
第三个-v 表示的和第一个-v意思一样的。
-d 表示启动的是哪个镜像
```

需要注意的是挂载在容器外部的`/mydata/nginx`下的`nginx.conf`和`/mydata/nginx/conf/conf.d`下的`default.conf`配置文件

### Tomcat

```shell
# 查找tomcat镜像
docker search tomcat
# 拉取tomcat镜像
docker pull tomcat:8
# 使用tomcat默认配置启动一个tomcat
docker run -d -p 8080:8080 --name tomcat tomcat:8
# 拷贝容器内tomcat配置文件和日志到本地准备映射【首先需要在mydata目录下创建tomcat文件夹】
docker cp tomcat:/usr/local/tomcat/conf /mydata/tomcat
docker cp tomcat:/usr/local/tomcat/webapps /mydata/tomcat
docker cp tomcat:/usr/local/tomcat/logs /mydata/tomcat
# 停止tomcat，并删除容器
docker stop tomcat
docker rm tomcat
# 创建并运行tomcat容器,挂载本地文件
docker run -d -p 8080:8080 --name tomcat -v /mydata/tomcat/webapps:/usr/local/tomcat/webapps -v /mydata/tomcat/conf:/usr/local/tomcat/conf -v /mydata/tomcat/logs:/usr/local/tomcat/logs --restart=always tomcat:8
# 查看启动的容器
docker ps
```

此时我们输入`主机地址:8080`：

![在这里插入图片描述](https://img-blog.csdnimg.cn/db8be68b55574770b4da4d577def0796.jpeg#pic_center)

我们进入tomcat容器中：

```shell
docker exec -it f727 /bin/bash
```

发现高版本的tomcat不仅存在webapps文件夹，还存在**webapps.dist文件夹**，我们需要将webapps.dist文件夹下的内容移动到webapps中：

```shell
mv webapps.dist/* webapps
```

此时，重启tomcat容器：

```shell
docker restart tomcat
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/6e8ab8439064415ba824a98c72dab7a0.jpeg#pic_center)

# 2. Docker进阶使用

## 2.1 Dockerfile

Dockerfile是一个文本文件，包含着一条条的指令，每一个指令就会构建一层，基于基础镜像，最后构建一个新的镜像。

#### From

指定父镜像【用于指定Dockerfile基于哪个image镜像进行构建】

#### MAINTAINER

指定作者信息【用于标柱这个Dockerfile是谁写的】

#### LABAL

标签功能【用来标明Dockerfile的标签，可以使用其来代替MAINTAINWER，最终可以再docker image的基本信息中可以查看...】

#### RUN

执行命令操作【即执行一段命令，默认为/bin/sh】

格式：RUN command或者RUN ["command","param1","param2"]

```dockerfile
# shell格式
RUN yum -y install wget
RUN wget -O redis.tar.gz "http://download.redis.io/releases/redis-5.0.3.tar.gz"
RUN tar -xvf redis.tar.gz
# exec格式
RUN ["./test.php", "dev", "offline"]
```

注意：**上面的shell格式三条RUN命令会新建三层镜像，可以将其简化成一条，这样只会构建一层，避免镜像膨胀**：

```dockerfile
RUN yum -y install wget \
    && wget -O redis.tar.gz "http://download.redis.io/releases/redis-5.0.3.tar.gz" \
    && tar -xvf redis.tar.gz
```

#### CMD

容器启动命令【提供**启动容器**时候的默认命令，和ENTRYPOINT配合进行使用】

格式：

```dockerfile
CMD <shell 命令> 
CMD ["<可执行文件或命令>","<param1>","<param2>",...] 
CMD ["<param1>","<param2>",...]  # 该写法是为 ENTRYPOINT 指令指定的程序提供默认参数
```

注意：CMD是docker run的时候运行的，而RUN则是在docker build的时候运行的

#### ENTRYPOINT

类似于 CMD 指令，但其不会被 docker run 的命令行参数指定的指令所覆盖，而且这些命令行参数会被当作参数送给 ENTRYPOINT 指令指定的程序。

但是, 如果运行 docker run 时使用了 --entrypoint 选项，将覆盖 ENTRYPOINT 指令指定的程序。

注意：

* 如果Dockerfile文件中存在多个CMD和ENTRYPOINT命令，则**最后一个生效**
* 可以使用ENTRYPOINT和CMD配合使用，ENTRYPOINT指定运行命令[定参]，而CMD指定命令[变参]

```dockerfile
ENTRYPOINT ["nginx", "-c"]
CMD ["/etc/nginx/nginx.conf"]
当docker run ngin时，容器会默认运行docker run nginx /etc/nginx/nginx.conf
```

#### COPY

复制文件【在build的时候将文件复制到image中】

格式：

> #如果目标路径不存在，则会自动创建
>
> COPY 源路径 目标路径 

```dockerfile
COPY target/*.jar app.jar
```

#### ADD

添加文件【build的时候添加文件到image中，不仅仅局限于当前build上下文，可以来源于远程服务】

```dockerfile
ADD *.jar app.jar
```

可以看到ADD的功能和COPY很相似【官方推荐使用COPY】，因为使用ADD命令，如果文件为tar压缩文件，则无法进行复制。

#### ENV

环境变量【指定build时的环境变量，可以在容器启动的时候通过-e进行覆盖】

格式：ENV name=value

```dockerfile
ENV NODE_VERSION 16.17.1 #指定node版本信息
```

#### ARG

构建参数【只在**构建镜像的时候使用的参数**，如果存在ENV的话，那么ENV的相同名字的值会始终覆盖ARG的参数】

#### VOLUME

定义外部可以挂载的数据【指定build的image那些目录可以在启动的时候挂载到宿主的文件目录；启动容器可以使用-v进行绑定】

格式：VOLUME ["目录"]

#### EXPOSE

暴露端口【定义容器运行时监听的端口，启动容器可以使用-p来绑定暴露端口】

格式：EXPOSE 8080

#### WORKDIR

工作目录【指定容器内部的工作目录，如果没有创建的话，则会自动进行创建，如果指定，则使用的是绝对路径】

#### USER

指定执行用户【指定build或者启动的时候，用户在RUN，CMD，ENTRYPONT执行的时候的用户】

#### HEALTHCHECK

健康检查【指定监测当前容器的健康监测的命令， 基本上没用，因为很多时候应用本身有健康监测机制】

#### SHELL

指定执行脚本的shell【指定RUN，ENTRYPOINT，CMD执行命令的时候使用的shell】

### Dockerfile构建启动项目

#### Dockerfile+SpringBoot项目构建启动

这里以一个简单的Dockerfile+SpringBoot项目实例，利用Docker构建镜像，并启动：

第一步：构建SpringBoot项目【这里省略】，然后利用maven进行打包构建成所需的Jar包【blog-back-0.0.1-SNAPSHOT.jar 】

第二步：编写Dockerfile文件：

```dockerfile
FROM java:8
MAINTAINER feng
VOLUME /tmp
ADD blog-back-0.0.1-SNAPSHOT.jar blog-back.jar
EXPOSE 9091
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/blog-back.jar"]
```

将Dockerfile文件和项目jar包上传到服务器指定目录下

![docker-1.png](https://img-blog.csdnimg.cn/img_convert/68bff6799a499f82b18902b9b2b3ca3e.png)

第三步：构建镜像

```shell
# -t指定镜像名 .表示当前目录[不能丢！！！]
docker build -t blog-back:v1.0 . 
```

通过`docker image`可以查看打的镜像。

第四步：docker启动镜像

```shell
docker run 
-e TZ="Asia/Shanghai" \
-d -p 9091:9091 \
-v /blog/logs/blog-back/:/log \
--name blog-back 容器id
--restart=always
```

如果启动成功，此时`docker ps`命令可以查看启动的所有容器：
![docker-2.png](https://img-blog.csdnimg.cn/img_convert/8513e190e49e7a0926e12104f9acd975.png)

## 2.2 Docker Compose

 Docker Compose是一个工具，用于定义和运行多容器应用程序的工具。Docker Compose通过**yml文件**定义多容器的docker应用，并通过一条命令根据yml文件的定义去创建或管理多容器。有了 Docker Compose 你可以把所有繁复的 Docker 操作全都一条命令，自动化的完成。

### Docker Compose安装

1. 下载docker compose

```ssh
curl -L https://get.daocloud.io/docker/compose/releases/download/v2.4.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
```

2. 修改该文件的权限为可执行

```ssh
sudo chmod +x /usr/local/bin/docker-compose
```

3. 创建软链接

```ssh
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

4. 检查是否安装成功

```ssh
docker-compose version
Docker Compose version v2.4.1
```

### Docker Compose命令

Docker Compose命令基本上和Docker相差不多，主要就是对Docker Compose生命周期控制、日志格式等相关命令，可以通过`docker-compose --help`进行帮助。这里以nginx为例，列举了常见的命令

构建建启动nignx容器

```dockerfile
docker-compose up -d nginx  
```

进入容器内部

```dockerfile
docker-compose exec nginx bash  
```

停止UP命令启动的容器，并删除容器

```dockerfile
docker-compose down 
```

显示所有容器

```dockerfile
docker-compose ps
```

重新启动nginx容器

```dockerfile
docker-compose restart nginx  
```

构建镜像

```dockerfile
docker-compose build nginx    
```

不带缓存的构建镜像

```dockerfile
docker-compose build --no-cache nginx 
```

查看nginx的日志

```dockerfile
docker-compose logs nginx   
```

查看nginx的实时日志

```dockerfile
docker-compose logs -f nginx    
```

验证docker-compose.yml文件配置，当配置正确时，不输出任何内容，当文件配置错误，输出错误信息

```dockerfile
docker-compose config  -q  
```

以json的形式输出nginx的docker日志

```dockerfile
docker-compose events --json nginx  
```

暂停nignx容器

```dockerfile
docker-compose pause nginx 
```

恢复ningx容器

```dockerfile
docker-compose unpause nginx  
```

删除容器

```dockerfile
docker-compose rm nginx 
```

停止nignx容器

```dockerfile
docker-compose stop nginx 
```

启动nignx容器

```dockerfile
docker-compose start nginx   
```

### docker-compose.yml

#### 快速开始

首先我们需要将Dockerfile文件和项目jar包放到`/usr/local/docker-compose-demo`路径下。其中，编辑**Dockerfile**：

```dockerfile
#指定基础镜像
FROM java:8
COPY ./blog-web-1.0-SNAPSHOT.jar ./docker-compose-demo.jar
#启动参数
ENTRYPOINT ["java","-jar","docker-compose-demo.jar"]
```

然后我们创建一个简单的`docker-compose.yml`文件为例，里面分别定义了两个镜像容器【docker-compose-demo01和nginx】的**构建、运行**配置：

```yaml
version: '3.0' # 指定版本信息 
networks:
  docker-compose-demo-net:
    driver: bridge
    ipam:
      config:
        - subnet: 192.168.1.0/24
          gateway: 192.168.1.1
services: #每一个service就代表一个容器，
  docker-compose-demo01: 
    build: # 构建信息，context指定构建的目录地址，指定使用Dockerfile进行镜像构建
      context: /usr/local/docker-compose-demo
      dockerfile: Dockerfile
    image: # 指定镜像id，可以是本地的，也可以是远程的。如果本地不存在，Docker Compose就会尝试将其pull下来
    # 设置容器名
    container_name: docker-compose-demo01
    #选择网络信息，这里指定的是上面配置的networks
    networks:
      - docker-compose-demo-net
    #暴露端口，指定宿主机到容器的端口映射
    ports:
      - 8081:8080/tcp
    restart: always
    
  nginx:
    image: nginx:latest
    container_name: nginx-demo
    networks:
      - docker-compose-demo-net
    ports:
      - 80:80/tcp
    restart: always
    #将主机的数据卷或着文件挂载到容器里
    volumes:
      - /usr/local/docker-compose-demo/nginx.conf:/etc/nginx/nginx.conf:rw
```

接着，先执行`docker-compose config`检查docker-compose.yml文件是否存在语法错误，如果不存在问题，则使用`docker-compose up`进行镜像的创建和运行

#### yml文件参数介绍

#### version

指定yml的版本信息

#### build

指定构建镜像上下文配置信息

* context：指定镜像上下文的路径
* args：指定构建的参数
* labels：设置构建镜像的标签
* dockerfile：指定构建镜像的Dockerfile文件名
* target：多层构建时可以指定构建哪一层

#### cap_add，cap_drop

添加或者删除容器拥有的宿主机的内核功能

```yaml
cap_add:
  - ALL # 开启全部权限

cap_drop:
  - SYS_PTRACE # 关闭 ptrace权限
```

#### cgroup_parent

为容器指定父 cgroup 组，意味着将继承该组的资源限制

#### command

覆盖容器启动的默认命令

```yaml
command: ["bundle", "exec", "thin", "-p", "3000"]
```

#### container_name

指定自定义容器名称，而不是生成的默认名称

#### depends_on

设置依赖关系

#### deploy

指定与服务的部署和运行有关的配置。只在swarm模式下才会有用。

```yaml
version: "3.7"
services:
  redis:
    image: redis:alpine
    deploy:
      mode：replicated
      replicas: 6
      endpoint_mode: dnsrr
      labels: 
        description: "This redis service label"
      resources:
        limits:
          cpus: '0.50'
          memory: 50M
        reservations:
          cpus: '0.25'
          memory: 20M
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
        window: 120s
```

可供选择的参数：

* **endpoint_mode**：访问集群服务的方式
* **labels**：在服务上设置标签
* **mode**：指定服务提供的模式。
  - **replicated**：复制服务，复制指定服务到集群的机器上。
  - **global**：全局服务，服务将部署至集群的每个节点。

**replicas：mode** 为 replicated 时，需要使用此参数配置具体运行的节点数量。

**resources**：配置服务器资源使用的限制，例如上例子，配置 redis 集群运行需要的 cpu 的百分比 和 内存的占用。避免占用资源过高出现异常。

**restart_policy**：配置如何在退出容器时重新启动容器。

- condition：可选 none，on-failure 或者 any（默认值：any）。
- delay：设置多久之后重启（默认值：0）。
- max_attempts：尝试重新启动容器的次数，超出次数，则不再尝试（默认值：一直重试）。
- window：设置容器重启超时时间（默认值：0）。

**rollback_config**：配置在更新失败的情况下应如何回滚服务。

- parallelism：一次要回滚的容器数。如果设置为0，则所有容器将同时回滚。
- delay：每个容器组回滚之间等待的时间（默认为0s）。
- failure_action：如果回滚失败，该怎么办。其中一个 continue 或者 pause（默认pause）。
- monitor：每个容器更新后，持续观察是否失败了的时间 (ns|us|ms|s|m|h)（默认为0s）。
- max_failure_ratio：在回滚期间可以容忍的故障率（默认为0）。
- order：回滚期间的操作顺序。其中一个 stop-first（串行回滚），或者 start-first（并行回滚）（默认 stop-first ）。

**update_config**：配置应如何更新服务，对于配置滚动更新很有用。

- parallelism：一次更新的容器数。
- delay：在更新一组容器之间等待的时间。
- failure_action：如果更新失败，该怎么办。其中一个 continue，rollback 或者pause （默认：pause）。
- monitor：每个容器更新后，持续观察是否失败了的时间 (ns|us|ms|s|m|h)（默认为0s）。
- max_failure_ratio：在更新过程中可以容忍的故障率。
- order：回滚期间的操作顺序。其中一个 stop-first（串行回滚），或者 start-first（并行回滚）（默认stop-first）。

#### devices

指定设备映射列表

#### dns

自定义 DNS 服务器，可以是单个值或列表的多个值

```yaml
dns: 8.8.8.8
```

#### environment

添加环境变量。您可以使用数组或字典、任何布尔值，布尔值需要用引号引起来，以确保 YML 解析器不会将其转换为 True 或 False。

```yaml
environment:
  RACK_ENV: development
  SHOW: 'true'
```

#### expose

暴露端口，但不映射到宿主机，只被连接的服务访问。

#### image

指定容器运行的镜像

```yaml
image: redis
image: ubuntu:14.04
image: tutum/influxdb
image: example-registry.com:4000/postgresql
image: a4bc65fd # 镜像id
```

#### logging

服务的日志记录配置。

driver：指定服务容器的日志记录驱动程序，默认值为json-file。

```yaml
logging:
  driver: json-file
  options:
    max-size: "200k" # 单个文件大小为200k
    max-file: "10" # 最多10个文件，达到文件上限，自动删除旧文件
```

#### networks

配置容器连接的网络

#### restart

- no：是默认的重启策略，在任何情况下都不会重启容器。
- always：容器总是重新启动。
- on-failure：在容器非正常退出时（退出状态非0），才会重启容器。
- unless-stopped：在容器退出时总是重启容器，但是不考虑在Docker守护进程启动时就已经停止了的容器

#### volumes

将主机的数据卷或着文件挂载到容器里