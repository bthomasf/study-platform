---
title: 初识Nginx
---

## 1. Nginx安装

### Windows环境安装Nginx

Windows安装nginx，我们首先需要去官网下载对应的.exe或者.zip文件，然后解压运行即可。

```shell
start nginx
```

### Linux（CentOS）环境安装Nginx

1. 安装所需的依赖

```shell
yum -y install gcc gcc-c++ make libtool zlib zlib-devel openssl openssl-devel pcre pcre-devel
```

2. 下载nginx

官网地址：https://nginx.org/en/download.html 下载tar.g安装包

或者使用wget命令下载：

```shell
wget -c https://nginx.org/download/nginx-1.18.0.tar.gz
#如果不存在wget 使用yum install wget安装
```

3. 解压压缩包，并以默认配置文件启动

```shell
tar -zxvf nginx-1.18.0.tar.gz 
cd nginx-1.18.0
#使用默认配置
./configure
#编译安装
make
make install
#启动
cd /usr/local/nginx/sbin/
./nginx #启动
./nginx -s stop #停止
./nginx -s quit #完全停止【建议使用！！！】
./nginx -s reload #重新加载配置文件
ps aux|grep nginx #查看nginx进程
```

4. 设置nginx开启自启动

```nginx
vi /etc/rc.local
#增加一行
/usr/local/nginx/sbin/nginx
```

5. 重启

```shell
#先停止
./nginx -s quit
#再启动
./nginx
```

### Docker环境安装Nginx

### Nginx

```shell
#拉取nginx镜像
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
--restart=always

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

## 2. Nginx快速入门

**Nginx (engine x)** 是一款轻量级的 Web [服务器](https://cloud.tencent.com/product/cvm?from=10680) 、反向代理服务器及电子邮件（IMAP/POP3）代理服务器。

**反向代理**：

反向代理（Reverse Proxy）方式是指以代理服务器来接受 internet 上的连接请求，然后将请求转发给内部网络上的服务器，并将从服务器上得到的结果返回给 internet 上请求连接的客户端，此时代理服务器对外就表现为一个反向代理服务器。

![](/img/backend/framework/nginx/nginx-2.jpeg)

**nginx常见的命令：**

```shell
nginx -s stop       快速关闭Nginx，可能不保存相关信息，并迅速终止web服务。
nginx -s quit       平稳关闭Nginx，保存相关信息，有安排的结束web服务。
nginx -s reload     因改变了Nginx相关配置，需要重新加载配置而重载。
nginx -s reopen     重新打开日志文件。
nginx -c filename   启动，为Nginx 指定一个配置文件，来代替缺省的。
nginx -t            不运行，而仅仅测试配置文件。nginx 将检查配置文件的语法的正确性，并尝试打开配置文件中所引用到的文件。
nginx -v            显示 nginx 的版本。
```

**nginx.conf**:

nginx的使用在于`nginx.conf`配置文件的编写，其中`conf/nginx.conf`是nginx的全局配置文件：

```nginx
#运行用户配置，默认用户nginx
user  nginx;
#启动进程，通常设置成和cpu的核数相同
worker_processes  auto;
#全局错误日志的配置
error_log  /var/log/nginx/error.log notice;
#pid用于记录启动nginx的进程id
pid        /var/run/nginx.pid;
#工作模式及连接上限
events {
    worker_connections  1024; #指定单个后台worker process进程的最大并发数为1024
}
#设定http服务器【一个conf文件只能存在一个http标签】，利用它来实现反向代理和负载均衡支持
http {
    
    #设置支持的mime类型，保存在mime.types文件中
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
		
    #设定日志
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;
		
    #sendfile指令指定nginx是否调用sendfile函数（zero copy 方式）来输出文件，对于普通应用必须为on
    sendfile        on;
    #tcp_nopush     on;
		
    #连接超时时间设置
    keepalive_timeout  65;
  	#gzip压缩开关
    #gzip  on;
  	
    #引入其他子配置文件：一般将真正的配置写在/etc/nginx/conf.d路径下的配置文件中，全局配置文件保持不变
    include /etc/nginx/conf.d/*.conf;
}
```

进入`/etc/nginx/conf.d`，发现存在一个`default.conf`配置文件，则便是我们真正进行配置的地方：这里以一个简单的nginx配置为例：

```nginx
#配置负载均衡列表
upstream tfblog_web_server {
  server www.tfblog.top:9090;
}
upstream tfblog_back_server {
  server www.tfblog.top:9091;
}
#http-server配置
server {
    #监听80端口，80端口是知名端口号，用于HTTP协议
    listen       80;
    
    #指定访问地址：ip/域名【www.xxx.com】
    server_name  www.tfblog.top;
  
    #配置跨域访问 
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Max-Age 3600;
    add_header Access-Control-Allow-Credentials true;
    add_header Access-Control-Allow-Methods *;
    add_header 'Access-Control-Allow-Headers' 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
    if ($request_method = OPTIONS){
      return 200;
    }
  
    #指定编码格式
    charset utf-8;
  
    #指定反向代理的路径，可以与upstream进行绑定，实现负载均衡；location后面设置映射的路径
    #指定默认/，指向前台的server
    location / {
        proxy_pass http://www.tfblog.top:8080/blog-web/;
    }
    location /web {
        proxy_pass http://www.tfblog.top:8080/blog-web/;
    }
    location = /api/web/ {
		proxy_pass http://tfblog_web_server;
    }
  	location = /api/back/ {
    	#proxy_pass结尾不加/，则www.tfblog.top/api/back/xxx/xxx会被代理到http://tfblog_back_server/api/back/xxx/xxx
		proxy_pass http://tfblog_back_server;
    } 
}
#https
server {
    #监听443端口
    listen       443 ssl;
    #使用域名访问
    server_name  www.tfblog.top;
    #开启ssl
    ssl on;
    #配置ssl证书的位置（这里为http证书【crt/key】，一般ssl证书文件格式为【crt/pem】）
    ssl_certificate      /etc/ssl/certificate.crt; 
    ssl_certificate_key  /etc/ssl/private.key;
    #ssl配置参数，可以选择性配置
    ssl_session_cache    shared:SSL:1m;
    ssl_session_timeout  5m;
    ssl_ciphers AESGCM:ALL:!DH:!EXPORT:!RC4:+HIGH:!MEDIUM:!LOW:!aNULL:!eNULL;  
    ssl_prefer_server_ciphers on;
    charset utf-8;

    location / {
      proxy_pass http://www.tfblog.top:8080/blog-web/;
    }
    location = /web {
      proxy_pass http://www.tfblog.top:8080/blog-web/;
    }
}
```

## 3. Nginx配置文件

### location

#### 语法规则：

> location [=|~|~*|^~] /uri/ { … }

- `=` 开头表示精确匹配
- `^~` 开头表示uri以某个常规字符串开头，理解为匹配 url路径即可。nginx不对url做编码，因此请求为/static/20%/aa，可以被规则^~ /static/ /aa匹配到（注意是空格）。以xx开头
- `~` 开头表示区分大小写的正则匹配 以xx结尾
- `~*` 开头表示不区分大小写的正则匹配 以xx结尾
- `!~`和`!~*`分别为区分大小写不匹配及不区分大小写不匹配的正则
- `/` 通用匹配，任何请求都会匹配到，优先级最低

这里列举几种常见的匹配规则：

* 必选规则1
  * 直接匹配网站根，通过域名访问网站首页比较频繁，使用这个会加速处理
  * 这里是直接转发给后端应用服务器了，也可以是一个静态首页

```nginx
location = / {
    proxy_pass http://域名:8080/index
}
```

* 必选规则2
  * 静态文件请求，存在两种配置模式，目录匹配或后缀匹配

```nginx
#第一种：以xxx开头
location ^~ /static/ {                              
    root /webroot/static/;
}
#第二种：以xxx结尾
location ~* \.(gif|jpg|jpeg|png|css|js|ico)$ {    
    root /webroot/res/;
}
```

* 通用规则
  * 用来转发动态请求到后端应用服务器,可以在前端页面增加路由转发，增加一个共同的前缀
  * 非静态文件请求就默认是动态请求，自己根据实际把握

```nginx
location / {
    proxy_pass http://域名:8080/
}
```

#### proxy_pass转发“/”带不带问题

在配置location的时候，经常会进行路由转发，此时转发地址结尾带不带“/”会导致最后转发的url地址存在很大的不同，这里简单明了地梳理一番。同样我们以例子切入，更加形象：

* **proxy_pass不携带/**

```nginx
listen  80;   
server_name  locahost;
location /api/ {   
    proxy_pass http://192.168.xx.xx:9090;
}
此时，/api会携带在proxy_pass的转发地址后面:
http://locahost:80/api/    ==>   http://192.168.xx.xx:9090/api/
http://locahost:80/api/a/b/c    ==>   http://192.168.xx.xx:9090/api/a/b/c
```

* **proxy_pass携带/**

```nginx
listen  80;   
server_name  locahost;
location /api/ {   
    proxy_pass http://192.168.xx.xx:9090/;
}
此时，/api就不会存在于proxy_pass的转发地址后面:
http://locahost:80/api/    ==>   http://192.168.xx.xx:9090
http://locahost:80/api/a/b/c    ==>   http://192.168.xx.xx:9090/a/b/c
```

PS：现在是不是很清晰了...^~^

#### Rewrite地址重写

语法规则：

> rewrite regex replacement [flag]

其中：

* regex：表示使用正则表达式或者字符串来匹配相应的地址
* replacement：表示重定向的地址
* flag：标志位

|   flag    |                            描 述                             |
| :-------: | :----------------------------------------------------------: |
|   last    | 本条规则匹配完成后，停止匹配，将重写后的地址重新发起请求进行匹配，浏览器地址栏URL地址不变 |
|   break   |       本条规则匹配完成后，停止匹配，不再匹配后面的规则       |
| redirect  |         返回302临时重定向，地址栏会显示跳转后的地址          |
| permanent |         返回301永久重定向，地址栏会显示跳转后的地址          |

这里举一个例子，当我们配置https-ssl证书的时候，需要将原来http的请求转发到https：

```nginx
server {
  listen 80;
  server_name www.xxx.com
  rewrite ^(.*) https://$host$1 permanent;
}
```

当然这里我们也可以使用**return 301**的方式：

```nginx
server {
  listen 80;
  server_name www.xxx.com
  return 301 https://$server_name$request_uri;
}
```

### upstream	

nginx另一个核心的功能点就是可以实现请求的负载均衡，这里可以使用**location+upstream**实现：

```nginx
#配置负载均衡列表
upstream tfblog_web_server {
  server www.tfblog.top:9090;
  server www.tfblog.top:9092;
}
server {
  listen 80;
  server_name www.tfblog.top;
  
  location / {
    proxy_pass http://tfblog_web_server;
    proxy_set_header Host $proxy_host;
  }
}
```

上面便是一个简单的负载均衡配置，当请求http://www.tfblog.top:80时，此时会负载均衡到http://www.tfblog.top:9090和http://www.tfblog.top:9092这两个地址上。其中：

* upstream后面的名称与proxy_pass后面的地址对应
* upstream中的两个server地址就是两个服务器的地址
* proxy_set_header：**可以设置请求头，并将头信息传递到服务器端**

对于负载均衡来说，nginx提供了6中负载均衡算法，上面什么都没配置，只写了两个服务器地址，则使用的是默认的**轮询算法**，另外几种如下所示：

* **轮询**

```nginx
即上面配置的案例
```

* **权重-weight**：指定轮询的访问几率，用于后端服务器性能不均时调整访问比例

```nginx
upstream tfblog_web_server {
  server www.tfblog.top:9090 weight=4;
  server www.tfblog.top:9092 weight=6;
}
server {
  listen 80;
  server_name www.tfblog.top;
  
  location / {
    proxy_pass http://tfblog_web_server;
    proxy_set_header Host $proxy_host;
  }
}
```

* **ip_hash**：指定负载均衡器按照基于客户端IP的分配方式，这个方法确保了相同的客户端的请求一直发送到相同的服务器，可以解决session不能跨服务器的问题。

```nginx
upstream tfblog_web_server {
  ip_hash;
  server www.tfblog.top:9090;
  server www.tfblog.top:9092;
}
server {
  listen 80;
  server_name www.tfblog.top;
  
  location / {
    proxy_pass http://tfblog_web_server;
    proxy_set_header Host $proxy_host;
  }
}
```

* **least_conn**：把请求转发给连接数较少的后端服务器

```nginx
upstream tfblog_web_server {
  least_conn;
  server www.tfblog.top:9090;
  server www.tfblog.top:9092;
}
server {
  listen 80;
  server_name www.tfblog.top;
  
  location / {
    proxy_pass http://tfblog_web_server;
    proxy_set_header Host $proxy_host;
  }
}
```

* **fair**（第三方）：按照服务器端的响应时间来分配请求，响应时间短的优先分配

```nginx
upstream tfblog_web_server {
  fair;
  server www.tfblog.top:9090;
  server www.tfblog.top:9092;
}
server {
  listen 80;
  server_name www.tfblog.top;
  
  location / {
    proxy_pass http://tfblog_web_server;
    proxy_set_header Host $proxy_host;
  }
}
```

* **url_hash**（第三方）：该策略按访问url的hash结果来分配请求，使每个url定向到同一个后端服务器，需要配合缓存用

```nginx
upstream tfblog_web_server {
  hash $request_uri;
  server www.tfblog.top:9090;
  server www.tfblog.top:9092;
}
server {
  listen 80;
  server_name www.tfblog.top;
  
  location / {
    proxy_pass http://tfblog_web_server;
    proxy_set_header Host $proxy_host;
  }
}
```

### if

语法规则：

> if (condition) {
>
> ​	...
>
> }
>
> = ，!= 比较的一个变量和字符串 
>
> ~， ~*与正则表达式匹配的变量 
>
> -f ，!-f 检查一个文件是否存在 
>
> -d, !-d 检查一个目录是否存在 
>
> -e ，!-e 检查一个文件、目录、符号链接是否存在 
>
> -x ， !-x 检查一个文件是否可执行

作用域：**server，location**

举例说明：

```nginx
server {
  if ($request_method = OPTIONS){
          return 200;
  }
}
```

### 跨域配置

在server配置下增加跨域配置：

```nginx
#配置跨域访问 
add_header Access-Control-Allow-Origin *;
add_header Access-Control-Max-Age 3600;
add_header Access-Control-Allow-Credentials true;
add_header Access-Control-Allow-Methods *;
add_header Access-Control-Allow-Headers *;
```

### SSL配置

```nginx
server {
    #监听443端口
    listen       443 ssl;
    #使用域名访问
    server_name  www.xxx.com;
    #配置ssl证书的位置（这里为http证书【crt/key】，一般ssl证书文件格式为【crt/pem】）
    ssl_certificate      /etc/ssl/certificate.crt; 
    ssl_certificate_key  /etc/ssl/private.key;
    #ssl配置参数，可以选择性配置
    ssl_session_cache    shared:SSL:1m;
    ssl_session_timeout  5m;
    ssl_ciphers AESGCM:ALL:!DH:!EXPORT:!RC4:+HIGH:!MEDIUM:!LOW:!aNULL:!eNULL;  
    ssl_prefer_server_ciphers on;
    charset utf-8;
		
    location / {
			  proxy_pass https://www.xxx.com:port;
    }
}

#http请求转发至https
server {
  listen 80;
  server_name www.xxx.com
  rewrite ^(.*) https://$host$1 permanent;
}
```

### location之root指令和alias之间的区别

location匹配路径的时候，经常会使用到root和alias指令进行跳转，这里用简单的话术解释两者之间的区别：

```nginx
# 使用root，则会location的路径带上，即最后访问的是/home/web/doc/dev路径；
location /dev {
  	root /home/web/doc;
}
# 使用alias，则不会带location的路径，即最后访问的是/home/web/doc路径
location /dev {
  	alias /home/web/doc;
}
```



