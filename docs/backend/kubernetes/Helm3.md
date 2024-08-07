---
title: Helm3入门使用
---

helm3官网地址：https://helm.sh/zh/

## 第一章 helm的介绍，组件，安装

### 1.1 环境准备

需要准备一套k8s的集群，helm主要是k8s集群的包管理器，主要用来管理helm中的各种chart包。

### 1.2 传统服务部署到k8s集群的流程

拉取代码——> 打包编译——>构建镜像——>准备一堆相关部署的yaml文件(如:deployment、service、ingress等)——>kubectl apply 部署到k8s集群

传统方式部署引发的问题

- 1.随着引用的增多，需要维护大量的yaml文件
- 2.不能根据一套yaml文件来创建多个环境，需要手动进行修改。
  例如：一般环境都分为dev、预生产、生产环境，部署完了dev这套环境，后面再部署预生产和生产环境，还需要复制出两套，并手动修改才行。

### 1.3 什么是helm

- helm是Kubernetes 的包管理工具，可以方便地发现、共享和构建 Kubernetes 应用
- helm是k8s的包管理器，相当于centos系统中的yum工具，可以将一个服务相关的所有资源信息整合到一个chart包中，并且可以使用一套资源发布到多个环境中， 可以将应用程序的所有资源和部署信息组合到单个部署包中。就像Linux下的rpm包管理器，如yum/apt等，可以很方便的将之前打包好的yaml文件部署到kubernetes上。

### 1.4 helm的组件

Chart: 就是helm的一个整合后的chart包，包含一个应用所有的kubernetes声明模版，类似于yum的rpm包或者apt的dpkg文件。
理解: helm将打包的应用程序部署到k8s,并将它们构建成Chart。这些Chart将所有预配置的应用程序资源以及所有版本都包含在一个易于管理的包中。Helm把kubernetes资源(如deployments、services或ingress等) 打包到一个chart中,chart被保存到chart仓库。通过chart仓库可用来存储和分享chart
Helm客户端:helm的客户端组件，负责和k8s apiserver通信

Repository: 用于发布和存储chart包的仓库，类似yum仓库或docker仓库

Release: 用chart包部署的一个实例。通过chart在k8s中部署的应用都会产生一个唯一的Release. 同一chart部署多次就会产生多个Release.理解: 将这些yaml部署完成后，他也会记录部署时候的一个版本，维护了一个release版本状态，通过Release这个实例，他会具体帮我们创建pod，deployment等资源

### 1.5 helm3和helm2的区别

1. helm3移除了Tiller组件   helm2中helm客户端和k8s通信是通过Tiller组件和k8s通信,helm3移除了Tiller组件,直接使用kubeconfig文件和k8s的apiserver通信

2. 删除 release 命令变更

   ```java
   helm delete release-name --purge  ------------>  helm uninstall release-name 
   ```

3. 查看 charts 信息命令变更

   ```java
   helm inspect release-name  ------------>> helm show release-name
   ```

4. 拉取 charts 包命令变更

   ```java
   helm fetch chart-name  ------------->>  helm pull chart-name
   ```

5. helm3中必须指定 release 名称，如果需要生成一个随机名称，需要加选项--generate-name，helm2中如果不指定release名称，可以自动生成一个随机名称

   ```java
   helm install ./mychart --generate-name
   ```


### 1.6 helm3的安装

#### 1.6.1 二进制方式安装helm3

```sh
root> kubectl get node
NAME   STATUS   ROLES                  AGE    VERSION
m1     Ready    control-plane,master   257d   v1.20.4
m2     Ready    control-plane,master   257d   v1.20.4
m3     Ready    control-plane,master   257d   v1.20.4
n1     Ready    <none>                 257d   v1.20.4
# wget方式安装、或者直接下载tar.gz包到对应服务器节点安装
\# wget https://get.helm.sh/helm-v3.5.2-linux-amd64.tar.gz 
\# ls helm-v3.5.2-linux-amd64.tar.gz 
helm-v3.5.2-linux-amd64.tar.gz
\# tar -zxf helm-v3.5.2-linux-amd64.tar.gz
\# ls
helm-v3.5.2-linux-amd64.tar.gz  linux-amd64
\# ls linux-amd64/
helm  LICENSE  README.md
\# mv linux-amd64/helm /usr/local/bin/
\# helm version
version.BuildInfo{Version:"v3.5.2", GitCommit:"167aac70832d3a384f65f9745335e9fb40169dc2", GitTreeState:"dirty", GoVersion:"go1.15.7"}
```

#### 1.6.2 chart的目录结构

```shell
# 创建一个chart，指定chart名：mychart
helm create mychart
# 查看chart的包结构
tree mychart/

mychart/                            #chart包的名称
├── charts                        #存放子chart的目录，目录里存放这个chart依赖的所有子chart
├── Chart.yaml                  #保存chart的基本信息，包括名字、描述信息及版本等，这个变量文件都可以被templates目录下文件所引用
├── templates                   #模板文件目录，目录里面存放所有yaml模板文件，包含了所有部署应用的yaml文件
│  ├── deployment.yaml   #创建deployment对象的模板文件
│  ├── _helpers.tpl           #放置模板助手的文件，可以在整个chart中重复使用，是放一些templates目录下这些yaml都有可能会用的一些模板
│  ├── hpa.yaml
│  ├── ingress.yaml
│  ├── NOTES.txt         #存放提示信息的文件,介绍chart帮助信息,helm install部署后展示给用户.如何使用chart等,是部署chart后给用户的提示信息
│  ├── serviceaccount.yaml
│  ├── service.yaml
│  └── tests                    #用于测试的文件，测试完部署完chart后，如web，做一个链接，看看你是否部署正常
│      └── test-connection.yaml
└── values.yaml               #用于渲染模板的文件（变量文件，定义变量的值） 定义templates目录下的yaml文件可能引用到的变量
                                       \#values.yaml用于存储 templates 目录中模板文件中用到变量的值，这些变量定义都是为了让templates目录下
```

#### 1.6.3 Chart.yaml文件字段说明

```shell
apiVersion: v2
name: mychart
description: A Helm chart for Kubernetes
\# A chart can be either an 'application' or a 'library' chart.
\#
\# Application charts are a collection of templates that can be packaged into versioned archives
\# to be deployed.
\#
\# Library charts provide useful utilities or functions for the chart developer. They're included as
\# a dependency of application charts to inject those utilities and functions into the rendering
\# pipeline. Library charts do not define any templates and therefore cannot be deployed.
type: application
\# This is the chart version. This version number should be incremented each time you make changes
\# to the chart and its templates, including the app version.
\# Versions are expected to follow Semantic Versioning (https://semver.org/)
version: 0.1.0
\# This is the version number of the application being deployed. This version number should be
\# incremented each time you make changes to the application. Versions are not expected to
\# follow Semantic Versioning. They should reflect the version the application is using.
\# It is recommended to use it with quotes.
appVersion: "1.16.0"


详细字段说明：
apiVersion: 		    # chart API 版本信息, 通常是 "v2" (必须)  appVersion字段与version 字段并没有直接的联系。这是指定应用版本的一种方式
                            \#对于部分仅支持helm3的chart，apiVersion应该指定为v2。对于可以同时支持helm3和helm2版本的chart,可以将其设置为v1
name: 			        # chart 的名称 (必须)
version: 			    # chart 包的版本 (必须)，version 字段用于指定 chart 包的版本号，后续更新 chart 包时候也需要同步更新这个字段
kubeVersion: 			# 指定kubernetes 版本(可选)   用于指定受支持的kubernetes版本,helm在安装时候会验证版本信息。
type: 			        # chart类型(可选)  v2版新增了type 字段,用于区分chart类型,取值为application(默认)和library,如"应用类型chart"和"库类型chart"
description: 			# 对项目的描述 (可选)

```

## 第二章 编写Chart和helm内置对象

### 2.1 编写Chart

#### 2.1.1 创建一个Chart

```shell
使用helm create 命令即可创建一个chart，其中包含完整的目录结构
# helm create mychart
# tree mychart/
mychart/
├── charts
├── Chart.yaml
├── templates                         #chart的模板文件，根据需要自己改动或都删除掉后，编写自己需要的模板yaml文件即可
│  ├── deployment.yaml
│  ├── _helpers.tpl
│  ├── hpa.yaml
│  ├── ingress.yaml
│  ├── NOTES.txt
│  ├── serviceaccount.yaml
│  ├── service.yaml
│  └── tests
│      └── test-connection.yaml
└── values.yaml
```

#### 2.1.2 编写模板文件

```shell
# 1.初始化chart，编写一个简单的模板文件
cd templates/
rm -rf *                     #删除原chart包下的所有模板文件
vim configmap.yaml     #编写一个自己需要的模板文件
------------------------------------------------
apiVersion: v1
kind: ConfigMap
metadata:
     name: mychart-configmap
data:
    myvalue: "hello world"
------------------------------------------------

# 2.创建一个release实例
helm install myconfigmap ./mychart/          #使用helm安装一个release的实例,指定release实例名: myconfigmap，指定chart目录./mychart
------------------------------------------------
NAME: myconfigmap
LAST DEPLOYED: Fri Nov 25 23:55:17 2022
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
------------------------------------------------

# 3.查看创建后的相关信息和验证是否已经在k8s集群中创建了configmap
# 安装成功后,用helm get manifest release名 命令可以查看已经发布到k8s中的release信息
helm get manifest myconfigmap
# list列出创建的release实例名
helm list |grep myconfigmap
# 使用kubectl查看configmap
kubectl get configmap

# 4.带变量的模板文件
------------------------------------------------
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap #最前面的.从作用域最顶层命名空间开始,即: 在顶层命名空间中开始查找Release对象,再查找Name对象
data:                                                   #上面就是通过内置对象获取获取内置对象的变量值(Release的名称)作为拼接成configmap的名字
  myvalue: {{ .Values.MY_VALUE }}
-------------------------------------------------
# 5.删除release实例
# 使用 helm uninstall release实例名 的命令来删除这个release，删除的时候直接指定release名称即可
# 删除release实例，指定release的实例名: myconfigmap
helm uninstall myconfigmap           
helm list |grep myconfigmap
kubectl get configmap |grep mychart-configmap

# 6.helm的测试渲染命令   不真正执行，只是试运行看是否能运行
helm提供了一个用来渲染模板的命令，该命令可以将模板内容渲染出来，但是不会进行任何安装的操作。可以用该命令来测试模板渲染的内容是否正确
用法： helm install  release实例名 chart目录   --debug --dry-run
例： # helm install myconfigmap3 ./mychart/ --debug --dry-run

# 7.helm通过各种类型chart包安装一个release实例名来部署k8s相关的资源（如：pod,deployment,svc,ingress等,根据模板文件定义）
方式1. 从加入到本地的chart官方仓库(从官方仓库安装)安装release实例
方式2. 将从chart仓库拉下来的压缩包进行安装release实例（下载好的压缩包本地离线安装release）
方式3. 将从chart仓库拉下来的压缩包解压后，从解压目录安装release实例（解压下载好的压缩包，从解压目录离线安装release实例）
方式4. 从一个网络地址仓库压缩包直接安装release实例

举例说明：
# 从加入到本地的chart官方仓库(从官方仓库安装)安装release实例，db为release实例名
helm install db stable/mysql
# 从加入到本地的chart社区仓库(从官方仓库安装)安装release实例，my-tomcat 为release实例名
helm install my-tomcat test-repo/tomcat
# 从chart仓库拉下来的压缩包进行安装release实例(从本地存档文件离线安装),db为release实例名
helm install db mysql-1.6.9.tgz
# 从chart仓库拉下来的压缩包解压后，从解压目录安装release实例(从解压目录离线安装), db为release实例名
helm install db mysql
# 从一个网络地址仓库压缩包直接安装release实例(从下载服务器安装), db为release实例名
helm install db http://url.../mysql-1.6.9.tgz
# 卸载release实例
helm uninstall release实例名
```

### 2.2 helm3内置对象详解说明

#### 2.2.1 helm3常用的内置对象

- Release 对象
- Values 对象
- Chart 对象
- Capabilities 对象
- Template 对象

#### 2.2.2 各内置对象详解

Release对象：描述了版本发布自身的一些信息。它包含了以下对象：

|      对象名称      |                             描述                             |
| :----------------: | :----------------------------------------------------------: |
|   .Release.Name    |                        release 的名称                        |
| .Release.Namespace |                      release 的命名空间                      |
| .Release.IsUpgrade |          如果当前操作是升级或回滚的话，该值为 true           |
| .Release.IsInstall |             如果当前操作是安装的话，该值为 true              |
| .Release.Revision  | 获取此次修订的版本号。初次安装时为 1，每次升级或回滚都会递增 |
|  .Release.Service  |          获取渲染当前模板的服务名称。一般都是 Helm           |

Values 对象：描述的是**value.yaml** 文件（定义变量的文件）中的内容，默认为空。使用Value 对象可以获取到value.yaml文件中已定义的任何变量数值

|     Value 键值对形式      |      获取方式      |
| :-----------------------: | :----------------: |
|       name1: test1        |   .Values.name1    |
| info:<br/>   name2: test2 | .Values.info.name2 |

Chart 对象：用于获取Chart.yaml 文件中的内容：

|    对象名称    |       描述       |
| :------------: | :--------------: |
|  .Chart.Name   | 获取Chart 的名称 |
| .Chart.Version | 获取Chart 的版本 |

Capabilities对象：提供了关于kubernetes 集群相关的信息。该对象有如下方法：

|                           对象名称                           |                             描述                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
|                  .Capabilities.APIVersions                   |             返回kubernetes集群 API 版本信息集合              |
|            .Capabilities.APIVersions.Has $version            | 用于检测指定的版本或资源在k8s集群中是否可用，例如：apps/v1/Deployment |
| .Capabilities.KubeVersion和.Capabilities.KubeVersion.Version |                都用于获取kubernetes 的版本号                 |
|               .Capabilities.KubeVersion.Major                |                  获取kubernetes 的主版本号                   |
|               .Capabilities.KubeVersion.Minor                |                  获取kubernetes 的小版本号                   |

Template对象：用于获取当前模板的信息，它包含如下两个对象

|      对象名称      |                             描述                             |
| :----------------: | :----------------------------------------------------------: |
|   .Template.Name   | 用于获取当前模板的名称和路径（例如：mychart/templates/mytemplate.yaml） |
| .Template.BasePath |      用于获取当前模板的路径（例如：mychart/templates）       |

## 第三章 helm3常用命令

### 3.1 helm的常用命令使用

```shell
version:          查看helm客户端版本
repo:             添加、列出、移除、更新和索引chart仓库，可用子命令:add、index、list、remove、update
search:           根据关键字搜索chart包
show:             查看chart包的基本信息和详细信息，可用子命令：all、chart、readme、values
pull:             从远程仓库中下载拉取chart包并解压到本地，如：# helm pull test-repo/tomcat --version 0.4.3 --untar  ,--untar是解压,不加就是压缩包
create            创建一个chart包并指定chart包名字
install:          通过chart包安装一个release实例
list:             列出release实例名
upgrade:          更新一个release实例
rollback:         从之前版本回滚release实例，也可指定要回滚的版本号
uninstall:        卸载一个release实例
history:          获取release历史，用法： helm history release实例名
package:          将chart目录打包成chart存档文件中，例如: 假如我们修改 chart 后，需要将其进打包
                      \# helm package /opt/helm/work/tomcat（chart的目录路径）
get:              下载一个release,可用子命令：all、hooks、manifest、notes、values
status:           显示release实例名的状态，显示已命名版本的状态
```

### 3.2 helm添加chart仓库和查看仓库，类似yum仓库或docker仓库

#### 3.2.1添加仓库

可以添加多个仓库，添加仓库时候，记得起个仓库名，如：stable，aliyun,或其他，一般起个稳定版的stable会优先使用。

```shell
# 添加微软的,强烈推荐
helm repo add stable http://mirror.azure.cn/kubernetes/charts  
# 添加阿里云的
helm repo add aliyun https://kubernetes.oss-cn-hangzhou.aliyuncs.com/charts 
# 添加开源社区的
helm repo add test-repo http://mirror.kaiyuanshe.cn/kubernetes/charts/           
# 列出仓库
helm repo list
# 更新仓库,能更新添加的所有仓库
helm repo update           
```

#### 3.2.2 添加搜索chart包

```shell
# 创建一个chart包，chart包名为：mychart 
helm create mychart  
# 搜索远程仓库的chart包、查看chart包信息、拉取远程仓库chart包到本地。类似docker search 搜索harbor仓库的镜像
> helm search repo tomcat
NAME         	CHART VERSION	APP VERSION	DESCRIPTION                                       
stable/tomcat	0.4.3        	7.0        	DEPRECATED - Deploy a basic tomcat application ...
# 查看chart包详细信息
helm show chart chart包名
helm show values chart包名 （查看详细信息)
# 远程拉取指定版本的chart包到本地并解压,--untar是解压,不加就是压缩包
举例：helm pull 远程仓库chart包名 --version 0.4.3 --untar   
```

#### 3.2.3 Release实例操作

```shell
# 基本操作
helm install      安装release实例（实际就是k8s应用的安装）
helm upgrade      升级release实例（实际就是k8s应用的升级）
helm rollback     回滚release实例（实际就是k8s应用的回滚）

# 安装release实例
helm install release实例名 chart目录路径 #指定release实例名和chart包目录路径进行安装release实例

# 升级release实例
# 指定release名和chart名进行相关set设置的升级
helm upgrade release实例名 chart名 --set imageTag=1.19
# 指定release示例名和chart名和values.yaml文件升级
helm upgrade release实例名 chart名 -f /.../mychart/values.yaml

# 回滚release实例
helm rollback release实例名 # 指定release实例名,回滚到上一个版本
helm rollback release实例名 版本号 # 指定release实例名,回滚到指定版本，注意版本号是release的版本号，不是镜像版本号

# 查看release历史
helm history release实例名
```

实战操作：

```java

```

## 第四章 helm3内置函数详解

### 4.1 常用的helm3内置函数

- (1) quote 或 squote函数
- (2) upper 和 lower 函数
- (3) repeat 函数
- (4) default 函数
- (5) lookup 函数

**函数的使用格式**

```jva
格式1： 函数名 arg1 arg2 ...，  然而在实际的使用中，我们更偏向于使用管道符 | 来将参数传递给函数
格式2： arg1 | 函数名          这样使用可以使结构看起来更加直观，并且可以方便使用多个函数对数据进行链式处理
```

举例说明：

1、首先在template文件夹中定义了一个`configmap.yaml`文件

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  namespace: {{ .Release.Namespace }}
data:
  value1: {{ quote .Values.name }}   #调用的变量值添加一个双引号(quote)
  value2: {{ squote .Values.name }}  #调用的变量值添加一个单引号(squote)
```

其中，value.yaml中定义name参数为test，此时，helm install ----debug --dry-run的方式执行，输出结果如下：

```yaml
NAME: myconfigmap1
LAST DEPLOYED: Sat Nov 26 11:23:56 2022
NAMESPACE: default
STATUS: pending-install
REVISION: 1
...
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: myconfigmap1-configmap
  namespace: default
data:                 
  value1: "test"   #调用的变量值添加一个双引号(quote)
  value2: 'test'   #调用的变量值添加一个单引号(squote)
```

发现，此时通过quote函数和squote各将参数值添加了双引号和单引号。这里，我们建议采取第二种方式编写，更加直观：

```yaml
data:
  value1: {{ .Values.name | quote }}   #调用的变量值添加一个双引号(quote)
  value2: {{ .Values.name | squote }}  #调用的变量值添加一个单引号(squote)
```

注意：我们也可以同时添加多个函数，例如：我们想对这个参数arg添加双引号，同时希望其转成大写形式：

```yaml
data:
  value1: {{ .Values.name | quote | upper}}   #调用的变量值添加一个双引号(quote)
```

其中，lookup函数用于在当前的k8s集群中获取一些资源的信息，功能类似于kubectl get ...

|             kubectl命令              | lookup 函数                              |
| :----------------------------------: | ---------------------------------------- |
| kubectl get pod mypod -n mynamespace | lookup "v1" "Pod" "mynamespace" "mypod"  |
|   kubectl get pods -n mynamespace    | lookup "v1" "Pod" "mynamespace" ""       |
|  kubectl get pods --all-namespaces   | lookup "v1" "Pod" "" ""                  |
|  kubectl get namespace mynamespace   | lookup "v1" "Namespace" "" "mynamespace" |
|        kubectl get namespaces        | lookup "v1" "Namespace" "" ""            |

### 4.2 常见的逻辑和流控制函数

- eq：     用于判断两个参数是否相等，如果等于则为 true，不等于则为 false。
- ne：     用于判断两个参数是否不相等，如果不等于则为 true，等于则为 false。
- lt ：         lt 函数用于判断第一个参数是否小于第二个参数，如果小于则为 true，如果大于则为 false。
- le：      判断第一个参数是否小于等于第二个参数，如果成立则为 true，如果不成立则为 false。
- gt：         gt 函数用于判断第一个参数是否大于第二个参数，如果大于则为 true，如果小于则为 false。
- ge：     判断第一个参数是否大于等于第二个参数，如果成立则为 true，如果不成立则为 false。
- and：    返回两个参数的逻辑与结果（布尔值），也就是说如果两个参数为真，则结果为 true。否认哪怕一个为假，则返回false
- or：      判断两个参数的逻辑或的关系，两个参数中有一个为真，则为真。返回第一个不为空的参数或者是返回后一个参数
- not：     用于对参数的布尔值取反,如果参数是正常参数(非空)，正常为true，取反后就为false，参数是空的,正常是false，取反后是true
- default： 用来设置一个默认值，在参数的值为空的情况下，则会使用默认值
- empty：  用于判断给定值是否为空，如果为空则返回true
- coalesce：用于扫描一个给定的列表，并返回第一个非空的值。
- ternary： 接受两个参数和一个 test 值，如果test 的布尔值为 true，则返回第一个参数的值，如果test 的布尔值为false，则返回第二个参数的值

### 4.3 常用helm3的字符串函数

- (1) print 和 println函数 
- (2) printf函数
- (3) trim函数、trimAll 函数、trimPrefix函数 和 trimSuffix函数
- (4) lower函数、upper函数、title函数 和 untitle函数
- (5) snakecase函数、camelcase函数 和 kebabcase函数
- (6) swapcase函数
- (7) substr函数
- (8) trunc函数
- (9) abbrev函数
- (10) randAlphaNum函数、randAlpha函数、randNumeric函数 和 randAscii 函数
- (11) contains函数 
- (12) hasPrefix函数 和 hasSuffix函数 
- (13) repeat函数、nospace函数 和 initials 函数
- (14) wrapWith函数
- (15) quote函数 和 squote 函数
- (16) replace函数
- (17) shuffle函数
- (18) indent函数和 nindent函数
- (19) plural 函数

### 4.4 .常用helm3的类型转换函数和正则表达式函数

#### 类型转换函数:

- atoi函数：      将字符串转换为整型
- float64函数：   转换成 float64 类型
- int函数：       转换为 int 类型
- toString函数：  转换成字符串
- int64函数：       转换成 int64 类型
- toDecimal函数：  将 unix 八进制转换成 int64
- toStrings函数：   将列表、切片或数组转换成字符串列表
- toJson函数 (mustToJson)：            将列表、切片、数组、字典或对象转换成JSON
- toPrettyJson函数 (mustToPrettyJson)： 将列表、切片、数组、字典或对象转换成格式化JSON
- toRawJson函数(mustToRawJson)：     将列表、切片、数组、字典或对象转换成JSON（HTML字符不转义）

#### 正则表达式函数:

- regexFind函数 和 mustRegexFind函数
- regexFindAll函数 和 mustRegexFindAll函数
- regexMatch函数 和 mustRegexMatch函数
- regexReplaceAll函数 和 mustRegexReplaceAll函数
- regexReplaceAllLiteral函数 和 mustRegexReplaceAllLiteral函数
- regexSplit函数 和 mustRegexSplit函数

### 4.5 常用helm3的加密函数和编码解码函数

helm提供了以下几种加密函数：

- sha1sum 函数
- sha256sum 函数
- adler32sum 函数
- htpasswd 函数
- encryptAES 函数
- decryptAES 函数

###  4.5 常用的helm3的日期函数

- now函数
- date函数
- dateInZone函数
- duration函数和durationRound函数
- unixEpoch函数
- dateModify函数 和 mustDateModify函数
- toDate函数 和 mustToDate函数

### 4.5 常用的helm3的字典函数

- (1)dict字典函数、get函数、set函数、unset函数
  - dict字典函数:  用于存储key/value键值对.其中字典的key必须是字符串,value可以是任何类型
  - get函数：    函数来获取定义字典myDict的值
  - set函数：    用于向已有的字典中添加新的键值对,也可修改原来键值对的值
  - unset函数：  用于删除字典中指定的key
- (2) keys函数
- (3) hasKey函数
- (4) pluck函数
- (5) merge函数 和 mustMerge函数
- (6) mergeOverwrite函数 和 mustMergeOverwrite函数
- (7) values函数
- (8) pick函数 和 omit函数
- (9) deepCopy函数 和 mustDeepCopy函数

还有很多函数，使用详见helm的官网使用文档

## 第五章 流控制结构语句

helm3中存在几种流控制结构语句，分别如下所示：

### 5.1 if/else语句： 主要用于条件判断，不同的条件做不同的事情

if/else语句中的条件在模板中称为管道，基本结构如下：

```yaml
{{- if PIPELINE }}
  #do something
{{- else if OTHER PIPELINE }}
  #do something else
{{- else }}
  #default case
{{- end }}
```

### 5.2 with语句：with语句主要是用来控制变量的范围，也就是修改查找变量的作用域

示例说明：

普通我们调用变量书写方式：

```yaml
data:
  #正常方式调用values.yaml文件,引用好多变量对象时,会重复写很多相同的引用
  Name: {{ .Values.people.info.name }}
  Age: {{ .Values.people.info.age }}
  Sex: {{ .Values.people.info.sex }}
```

此时，如果使用with语句，可以改写为：

```yaml
 data:
 #通过with语句,效果和上面一样,引用很多重复的变量对象时,可用with语句将重复的路径作用域设置过来
  {{- with .Values.people }}
  Name: {{ .info.name }}
  Age: {{ .info.age }}
  Sex: {{ .info.sex }}
  {{- end }}
```

### 5.3 range语句：range用于提供循环遍历集合输出的功能

说明格式：

```yaml
用法格式:
{{- range 要遍历的对象 }}
 # do something
{{- end }}
```

## 第六章 helm3中变量详解

### 6.1 helm3中声明变量的格式和作用   

在 helm3中，变量通常是搭配 with语句和range语句使用，这样能有效的简化代码。

变量的定义格式如下：

```yaml
$name := value  # := 称为赋值运算符，将后面值赋值给前面的变量name
```

使用变量解决对象作用域问题：因为with语句里不能调用父级别的变量,所以如果需要调用父级别的变量,需要声明一个变量名,将父级别的变值赋值给声明的变量。在前面关于helm流控制结构的文章中提到过使用with 更改当前作用域的用法，当时存在一个问题是在with 语句中，无法使用父作用域中的对象，需要使用 $ 符号或者将语句移到 {{- end }} 的外面才可以，现在使用变量也可以解决这个问题。

举例说明：

此时我们使用with控制语句编写了下面一段yaml内容：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
	name: {{.Release.Name}}-configmap
data:
	{{- with .Values.user.info}}
		name: {{.name}} #取值.Values.user.info.name
		age: {{.age}} #取值.Values.user.info.age
		releaseName: {{.Release.Name}} #此时作用域改为了.Values.user.info，无法取到.Release的值了！！！
	{{- end}}
```

故为了能够在with以及其他场景中使用到原Chart路径下的变量值，我们可以通过申明变量的方式来实现，对于上面的场景，可改写为：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
	name: {{.Release.Name}}-configmap
data:
	{{- $releaseName := .Release.Name }}  #申明一个变量
	{{- with .Values.user.info}}
		name: {{.name}} #取值.Values.user.info.name
		age: {{.age}} #取值.Values.user.info.age
		releaseName: {{$releaseName}} #引用with外申明的变量，即可获取到对应的值
	{{- end}}
```

## 第七章 helm3中子模板的定义和使用

### 7.1 子模版定义位置

我们在helm3中定义子模板的两个位置

- (1) 主模板中
- (2) **_helpers.tpl**文件内

定义子模板，可以在主模板中定义，也可在其他文件中定义（_helpers.tpl文件是专门提供的定义子模板的文件），实际使用中，这些子模板的内容应当放在单独的文件中，通常是 _helpers.tpl文件内。

### 7.2 子模板的定义和调用

定义子模板： 通过define定义
调用子模板： 通过template或**include调用(推荐)**，template和include，都有用来引用子模板,，用法一样

示例：

我们创建一个_helpers.tpl文件，编写格式：

```yaml
{{- define "子模版名称"}}
# 子模版内容
	labels:
		user: test
		pwd: 123456
{{- end}}
```

template使用子模版内容：

```yaml
template - "chart名称.子模版名称" .
```

注意：主模版引用子模版的时候需要指定对象的位置信息，"."表示在顶层作用域中寻找子模版中的指定对象。此时就会在该chart包的**_helpers.tpl**文件中寻找labels对象，并进行使用。

include使用子模版内容

```yaml
include - "chart名称.子模版名称" .
```

注意：include使用子模版后面可以添加函数修饰，例如`include - "chart名称.子模版名称" . | toString`，此时如果使用template则会报错。