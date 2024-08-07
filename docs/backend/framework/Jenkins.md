---
title: Jenkins搭建CICD
--- 

## Jenkins入门：

首先，我们需要在搭建jenkins的服务器上先安装一定的环境：

* Docker
* JDK
* Maven

### Docker安装步骤

### JDK安装步骤

进入oracle官网下载jdk：https://www.oracle.com/java/technologies/downloads/

下载完毕，通过ftp工具将压缩包上传至服务器对应文件夹，进行解压操作，进而配置环境变量：

```shell
# 修改profile文件
vim /etc/profile
# 在文件末尾添加java环境变量
export JAVA_HOME=/home/env/jdk1.8.0_351
export JRE_HOME=${JAVA_HOME}/jre
export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib:$CLASSPATH
export JAVA_PATH=${JAVA_HOME}/bin:${JRE_HOME}/bin
export PATH=$PATH:${JAVA_PATH}
# 刷新profile
source /etc/profile
# 使用java -version查看java版本号
```

### Maven安装步骤

进入maven官网，下载对应的压缩包，通过ftp工具上传至服务器，进行解压操作，进而配置环境变量：`/etc/profile`

```shell
export MAVEN_HOME=/home/env/apache-maven-3.8.6
export PATH=$PATH:$MAVEN_HOME/bin
```

同时，我们进入maven的conf目录下，修改settings.xml配置文件：

```xml
# 仓库地址
<localRepository>/usr/maven/repository</localRepository>
# 阿里云加速镜像地址
<mirror>
      <id>alimaven</id>
      <name>aliyun maven</name>
       <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
      <mirrorOf>central</mirrorOf>
</mirror>
```

### Git安装

```shell
yum -y install git
# 查看配置git
git config --list
git config --global user.name  "username"  
git config --global user.email  "email"
# ssh key配置
ssh-keygen -t rsa -C "邮箱"
# 公私钥存储位置
公钥存放地址：/root/.ssh/id_rsa.pub
私钥存放地址：/root/.ssh/id_rsa
# 配置authorized_keys，将authorized_keys文件和.ssh目录的权限设置为正确的权限
chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys
可以将其他服务器或者本地的公钥配置在/root/.ssh/authorized_keys文件中，然后在其他服务器中的.ssh的config配置文件中配置对应的访问规则，既可通过ssh 服务器名进行服务器的访问
Host 主机名
Hostname 服务器ip地址
User 用户名
Port 22
IdentityFile 私钥位置
```

### jenkins安装步骤

#### 镜像安装

安装完上述的环境以后，我们正式进入jenkins的安装，这里使用的是Docker镜像的安装方式，官网上也有很多其他的安装方式，可以进行参考：

首先，我们需要创建jenkins对应的宿主机文件挂载目录：

```java
mkdir -p /home/jenkins_home && chmod -R 777 /home/jenkins_home
```

然后，拉取jenkins最新的镜像文件，这里我拉取的是最新的镜像，你可以指定对应的版本：

```dockerfile
# 拉取最新镜像
docker pull jenkins/jenkins:lts
# 拉取指定版本镜像
docker pull jenkins/jenkins:2.399
```

启动，运行jenkins容器：

```shell
docker run -dt --name jenkins 
-p 3270:8080 -p 50000:50000 \
--privileged=true \
-v /home/jenkins_home:/var/jenkins_home \
-v /var/run/docker.sock:/var/run/docker.sock \
-v /usr/bin/docker:/usr/bin/docker 
-v /etc/docker:/etc/docker \
jenkins/jenkins:2.399  
```

* -dt 后台运行
* -p 3270:8080 宿主机的3270映射到容器的8080端口
* -privileged=true让容器具有root权限，便于进入容器
* -v /home/jenkins_home:/var/jenkins_home 文件目录挂载
* -v /var/run/docker.sock:/var/run/docker.sock, 通过映射主机的套接字文件到容器, 让容器内启动 docker * 的时候并不是启动容器内的容器(子容器), 而是启动主机上的容器(宿主机的).
* -v /usr/bin/docker:/usr/bin/docker, 让容器中直接使用宿主机的 docker 客户端.
* -v /etc/docker:/etc/docker, 让容器中的 docker 客户端使用宿主机的 docker 配置文件, 包括国内镜像 (mirrors) 和非ssl安全访问白名单等配置


此时启动后一般容器无法正常运行，报错信息如下所示：

```sh
/var/jenkins_home/copy_reference_file.log: Permission denied
```

这是因为Jenkins容器里的用户是Jenkins，而主机用户不是Jenkins，就算是root也一样会报错。这个时候就需要我们在主机上面给主机地址赋予访问Jenkins容器的权限，Jenkins内部用的是uid 1000的user：

```shell
chown -R 1000:1000 /home/jenkins_home  # 赋予权限
```

然后，我们再次启动容器，此时正常运行，日志如下所示：

```shell
Running from: /usr/share/jenkins/jenkins.war
...
2023-03-27 06:24:31.390+0000 [id=52]	INFO	jenkins.install.SetupWizard#init:

Jenkins initial setup is required. An admin user has been created and a password generated.
Please use the following password to proceed to installation:

51d44e434ff645d599b28ca5b542f7bd

This may also be found at: /var/jenkins_home/secrets/initialAdminPassword

2023-03-27 06:24:48.940+0000 [id=52]	INFO	jenkins.InitReactorRunner$1#onAttained: Completed initialization
2023-03-27 06:24:48.959+0000 [id=24]	INFO	hudson.WebAppMain$3#run: Jenkins is fully up and running
2023-03-27 06:24:50.419+0000 [id=66]	INFO	h.m.DownloadService$Downloadable#load: Obtained the updated data file for hudson.tasks.Maven.MavenInstaller
2023-03-27 06:24:50.420+0000 [id=66]	INFO	hudson.util.Retrier#start: Performed the action check updates server successfully at the attempt #1
2023-03-27 06:24:50.421+0000 [id=66]	INFO	hudson.model.AsyncPeriodicWork#lambda$doRun$1: Finished Download metadata. 19,281 
```

这里，我们也可以通过docker-compose进行jenkins服务的创建：

```yaml
version: '3'
services:
  jenkins:
    container_name: jenkins
    image: jenkins-2.3.99:latest
    ports:
      - 3270:8080
      - 50000:50000
    privileged: true
    volumes:
      - /home/jenkins_home:/var/jenkins_home
      - /usr/bin/docker:/usr/bin/docker
      - /var/run/docker.sock:/var/run/docker.sock
      - /etc/docker:/etc/docker
      - /etc/localtime:/etc/localtime
      - /usr/lib/x86_64-linux-gnu/libltdl.so.7:/usr/lib/x86_64-linux-gnu/libltdl.so.7
    restart:
      always
```

在浏览器输入jenkins服务对应的ip:port，出现对应登陆初始化页面，说明容器运行成功！

此时页面提示我们输入对应的管理员密码，这里显示了管理员密码的对应位置，我们只要cd到对应目录，复制粘贴即可：

```shell
cat /var/jenkins_home/secrets/initialAdminPassword
```

输入密码以后，进行插件下载管理页面，这里存在推荐安装和自定义安装两种方式。这里我们进入到容器的`/var/jenkins_home/updates`目录下，替换url地址：

```shell
cd /var/jenkins_home/updates
sed -i 's#https://updates.jenkins.io/download#https://mirrors.huaweicloud.com/jenkins#g' default.json && sed -i 's#http://www.google.com#https://www.baidu.com#g' default.json  
```

然后进入插件管理地址：http://ip:3270/pluginManager/advanced

![image-20230327151222987](/img/backend/framework/jenkins/插件管理.png)

我们将升级站点的url替换为

* https://cdn.jsdelivr.net/gh/jenkins-zh/update-center-mirror/tsinghua/current/update-center.json
* https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json

![image-20230327152229822](/img/backend/framework/jenkins/升级站点.png)

然后，我们根据提示创建属于我们的第一个管理员账号即可完成了第一步的部署工作。

注意：

* 如果插件安装失败，一方面可能是url的地址问题，升级替换下；一方面可能是jenkins的版本问题，可以更新对应版本的jenkins

#### 时区设置

进入jenkins容器，查看此时的系统时间：

```shell
date -R
```

此时，如果时间和我们主机的时间不一致，需要修改时区配置：

```shell
# 容器内创建Asia时区文件
echo Asia/Shanghai >/etc/timezone 
# 退出容器并复制宿主机中localtime到容器内
docker cp /usr/share/zoneinfo/Asia/Shanghai 容器id:/etc/localtime  
```

### jenkins + jdk + git + maven自动化部署启动Java项目

在安装好我们的jenkins，jdk，git和maven环境以后，就可以使用jenkins对java项目进行maven编译构建，然后可以上传到指定服务器，进行启动工作，步骤如下所示：

> 略

## Jenkins进阶学习

### pipeline流水线：

在进入jenkins以后，新建item会出现以下几种选择项：

* Freestyle project 自由风格项目
* Pipeline 流水线，这个也是现在比较主流的搭建方式
* ...

![image-20230602131724623](/img/backend/framework/jenkins/新建item.png)

我们点击`流水线`，进行配置页面，这里分为以下几个部分

* General 通用部分，主要是进行一些全局的参数配置，例如项目的环境参数，是否允许并发构建，是否丢弃旧的构建等等，主要我们经常使用到的就是这里的构建参数

![image-20230711135728258](/img/backend/framework/jenkins/构建参数.png)

* 构建触发器部分：这里可以配置一些构建相关的配置参数，例如：定时构建，轮询SCM等等
* 高级项目选项
* 流水线的脚本部分：这里可以直接在脚本框中填写对应的构建脚本；同样也可以通过SCM的方式，指定对应路径的`Jenkinsfile`，其中就可以使用下面要说到的jenkins libary。

一般情况下，我们都是通过定义Jenkinsfile的方式来编写脚本的（Jenkinsfile 是一种声明式的 Groovy 脚本，用于定义 Jenkins Pipeline 中的构建流程），这里我们可以在jenkins.io上查看对应的jenkinsfile的流水线语法的具体使用规则，基本的元素定义如下所示：

1. pipeline：定义流水线的开始，可以指定参数、环境变量、代理等信息。
2. agent：指定构建代理的类型和配置，例如：Docker、Kubernetes、SSH 等。
3. stages：定义流水线中的各个阶段，例如：构建、测试、部署等。
4. steps：定义每个阶段中需要执行的步骤，例如：调用 Shell 脚本、执行 Maven 命令等。
5. tools：指定流水线中需要使用的工具和版本，例如：JDK、Maven、Git 等。
6. environment：定义流水线中需要使用的环境变量，例如：PATH、JAVA_HOME 等。
7. triggers：定义触发流水线执行的条件，例如：定时触发、代码提交触发等。
8. post：定义流水线执行后需要执行的步骤，例如：发送邮件、打包构建结果等。
9. options：为流水线定义一些配置选项，例如：设置超时时间、设置并行度等。

下面我们通过编写一个通用的Gitee拉取代码-构建-打包流程来编写一个具体的Jenkinsfile：

```xml
pipeline {
    agent any
    parameters {
        string(name: 'NAME', defaultValue: 'World', description: 'The name to say hello to')
        booleanParam(name: 'VERBOSE', defaultValue: true, description: 'Enable verbose output')
        choice(name: 'PLATFORM', choices: ['Linux', 'Windows', 'MacOS'], description: 'Choose a platform for the build')
        password(name: 'PASSWORD', description: 'The password to use for the build')
    }
    stages {
        stage('Build') {
            steps {
                echo "Building on ${params.PLATFORM}"
                sh 'echo "Hello, ${params.NAME}!"'
            }
        }
        stage('Test') {
            steps {
                echo "Running tests"
                sh 'run-tests.sh'
            }
        }
        stage('Deploy') {
            when {
                branch 'master'
            }
            steps {
                echo "Deploying to production"
                sh 'deploy.sh'
            }
        }
    }
    post {
        always {
            echo "Build finished"
        }
        success {
            echo "Build succeeded"
        }
        failure {
            echo "Build failed"
        }
    }
}
```

### jenkins library

#### 基本介绍：

Jenkins Library 是 Jenkins 中的一种高级功能，它允许用户在多个流水线中共享和重用代码片段和函数库。Jenkins Library 可以被看作是一种共享库，它可以包含任意数量的 Groovy 脚本文件，其中可以定义各种函数、类、变量、常量等。

使用 Jenkins Library 可以帮助用户实现以下功能：

1. 代码重用：可以将常用的代码片段和函数库封装在 Jenkins Library 中，以便在多个流水线中共享和重用。
2. 代码管理：可以将 Jenkins Library 存储在代码仓库中，并与版本控制系统（如 Git）集成，实现代码版本控制和管理。
3. 代码安全：可以通过 Jenkins 的安全机制和 Pipeline 中的沙箱来确保 Jenkins Library 中的代码安全可靠。
4. 代码模块化：可以将 Jenkins Library 中的代码按照模块进行划分和组织，以便更好地管理和维护。
5. 代码测试：可以使用单元测试框架（如 JUnit）对 Jenkins Library 中的代码进行测试，以确保代码质量和稳定性。

使用 Jenkins Library 可以大大提高代码的复用性和可维护性，使得 Jenkins 中的流水线更加灵活和高效。

下面是jenkins library的结构：

```json
(root)
+- src                     # Groovy source files
|   +- org
|       +- foo
|           +- Bar.groovy  # for org.foo.Bar class
+- vars
|   +- foo.groovy          # for global 'foo' variable
|   +- foo.txt             # help for 'foo' variable
+- resources               # resource files (external libraries only)
|   +- org
|       +- foo
|           +- bar.json    # static helper data for org.foo.Bar
```

其中，每一个目录结构的具体说明和：

1. `vars` 目录：该目录用于存储 Jenkins Library 中定义的**全局变量**和**函数库**。在该目录下，每个 Groovy 脚本文件都会被解释为一个**全局变量或函数**，可以在 Jenkins Pipeline 中直接调用。
2. `src` 目录：该目录用于存储 Jenkins Library 中的其他源代码文件，通常用于**定义类、接口、枚举**等。在 Jenkins Pipeline 中，可以使用 `@Library` 注解来导入该目录下的类和接口，以便在 Pipeline 中使用。
3. `resources` 目录：该目录用于存储 Jenkins Library 中需要使用的**其他资源文件**，例如配置文件、文本文件、图像文件等。在 Jenkins Pipeline 中，可以使用 `libraryResource` 函数来引用该目录下的资源文件

#### 快速入门

现在我们先以一个简单的jenkins library案例作为快速入手：

##### 第一步：在git上初始化一个jenkins library项目，里面创建好对应上面的目录结构，并创建一个测试的groovy脚本文件：

![image-20230711135728258](/img/backend/framework/jenkins/jenkinslib目录.png)

`build.groovy`：

```groovy
package org.test;
def printMessage() {
  println("Hello World")
}
```

##### 第二步：在上面我们部署好的jenkins平台上，首先下载好对应的jenkins library插件，然后在全局配置管理中，增加jenkins library的具体配置：

其中，项目仓库填写对应的Jenkins Library项目的仓库地址；凭据填写该仓库的用户账号和密码，当然也可以填写accessToken等内容。

![image-20230711135728258](/img/backend/framework/jenkins/jenkinslib配置1.png)

![image-20230711135728258](/img/backend/framework/jenkins/jenkinslib配置2.png)


##### 第三步：创建流水线，编写pipeline-script

![image-20230604160106184](/img/backend/framework/jenkins/流水线1.png)

![image-20230604160146228](/img/backend/framework/jenkins/流水线2.png)

![image-20230604160254853](/img/backend/framework/jenkins/流水线3.png)

```groovy
# 标准语法，导入jenkinslib项目指定分支(master)所有模块
@Library("jenkinslib@master") _
# 在src目录下的org.test包下我们已经创建了build.groovy,这里直接定义build对象，即可在下面进行使用
def build = new org.test.build()
pipeline {
    agent any
    stages {
        stage('Hello') {
            steps {
                # 声明式语法如果想要使用脚本式，可以通过script标签引入脚本
              	script {
                    echo '执行流水线任务'
                    build.printMessgae()
                }
            }
        }
    }
}
```

##### 第四步：执行流水线任务

创建好流水任务以后，我们立即进行构建，打开控制台查看构建日志，执行成功，表明这个简单的pipeline任务已经实现！

![image-20230604161052128](/img/backend/framework/jenkins/流水线4.png)

```json
Started by user feng
Loading library jenkinslib@master
Attempting to resolve master from remote references...
 > git --version # timeout=10
 > git --version # 'git version 2.30.2'
using GIT_ASKPASS to set credentials 
 > git ls-remote -h -- https://gitee.com/fbelite/jenkinslib.git # timeout=10
Found match: refs/heads/master revision 017a3a32cdde37012840b742cf62279cd5813ff7
The recommended git tool is: NONE
using credential c21ec1b1-4d0f-4e58-8881-81cd04282023
 > git rev-parse --resolve-git-dir /var/jenkins_home/workspace/流水线任务@libs/f3634f4e1d51183a44b51793c083614e02f9e698062c2ff950004fb555b7470d/.git # timeout=10
Fetching changes from the remote Git repository
 > git config remote.origin.url https://gitee.com/fbelite/jenkinslib.git # timeout=10
Fetching without tags
Fetching upstream changes from https://gitee.com/fbelite/jenkinslib.git
 > git --version # timeout=10
 > git --version # 'git version 2.30.2'
using GIT_ASKPASS to set credentials 
 > git fetch --no-tags --force --progress -- https://gitee.com/fbelite/jenkinslib.git +refs/heads/*:refs/remotes/origin/* # timeout=10
Checking out Revision 017a3a32cdde37012840b742cf62279cd5813ff7 (master)
 > git config core.sparsecheckout # timeout=10
 > git checkout -f 017a3a32cdde37012840b742cf62279cd5813ff7 # timeout=10
Commit message: "update src/org/test/build.groovy."
 > git rev-list --no-walk 017a3a32cdde37012840b742cf62279cd5813ff7 # timeout=10
[Pipeline] Start of Pipeline
[Pipeline] node
Running on Jenkins in /var/jenkins_home/workspace/流水线任务
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Hello)
[Pipeline] script
[Pipeline] {
[Pipeline] echo
执行流水线任务
[Pipeline] echo
Hello World
[Pipeline] }
[Pipeline] // script
[Pipeline] }
[Pipeline] // stage
[Pipeline] }
[Pipeline] // node
[Pipeline] End of Pipeline
Finished: SUCCESS
```

#### 高阶使用

在实际的CICD过程中，我们使用jenkins完成的构建打包发布流程肯定比上面的DEMO要复杂很多，例如我们的任务可能包括前端的NPM构建打包；基于SpringBoot，SpringCloud项目的maven构建；给予Andriod的Grade构建；还有K8S，Tomcat等等～

那么，接下来，将使用jenkins library 完成一个前后端构建打包，生成指定docker镜像的流水线任务链：

#### 第一步：安装所需插件

首先，我们在刚开始初始化jenkins的时候，已经安装好了常用的插件，这里，我们需要添加一会pipeline任务所需的几个插件：

##### 插件1:  Git Parameter插件（用于pipeline参数配置可以使用Git参数，例如：分支名、提交 ID等）

![image-20230615105615113](/img/backend/framework/jenkins/插件安装1.png)

##### 插件2：active choices插件（用于编写脚本，动态获取指定参数）

![image-20230615110228400](/img/backend/framework/jenkins/插件安装2.png)

##### 插件3：Extended Choice Parameter（扩展了 Jenkins 的 Choice Parameter 功能，支持更多的选项类型和选项源）

![image-20230615111417631](/img/backend/framework/jenkins/插件安装3.png)

##### 插件4：Pipeline Utility Steps（构建工具函数）

Pipeline Utility Steps 插件是 Jenkins Pipeline 中的一个常用插件，它提供了一系列实用函数，用于简化 Pipeline 脚本的编写和管理。该插件包含的函数主要有以下几种：

1. `readFile`：读取指定文件的内容。
2. `writeFile`：将指定内容写入到指定文件中。
3. `sh`：执行指定命令，并返回执行结果。
4. `input`：在 Pipeline 运行过程中暂停执行，等待用户输入确认后再继续执行。
5. `timeout`：设置 Pipeline 执行超时时间。
6. `waitUntil`：等待指定条件满足后再继续执行。
7. `archiveArtifacts`：归档指定构建产物。
8. `unarchive`：解压指定文件。
9. `httpRequest`：发送 HTTP 请求，获取响应内容。
10. `pipelineLoad`：加载 Pipeline 脚本。

使用 Pipeline Utility Steps 插件，可以大大简化 Pipeline 脚本的编写和管理，提高开发效率。

##### 插件5：NodeJS插件

用于在脚本中使用NodeJS功能

##### 插件6：Docker相关插件

用于在脚本中使用Docker功能

##### 插件7：Java Doc插件

![image-20230615133919729](/img/backend/framework/jenkins/插件安装4.png)

##### 插件8：Go 插件

用于在脚本中使用Go进行构建

![image-20230620152759475](/img/backend/framework/jenkins/插件安装5.png)

##### 插件9: AnsiColor插件

AnsiColor用于不同颜色日志的输出

![image-20230706163654703](/img/backend/framework/jenkins/插件安装6.png)

##### 插件10：Docker插件

我这里安装的jenkins是2.3.99版本的，插件管理没有找到Docker插件，这里提供两种方式：

方式1：直接在启动容器的时候，挂载宿主机的Docker，这里需要挂载宿主机的Docker守护进程以及Docker命令

```sh
- /usr/bin/docker:/usr/bin/docker
- /var/run/docker.sock:/var/run/docker.sock
```

接着，在Docker插件配置中，指定docker的目录：

![image-20230711135728258](/img/backend/framework/jenkins/docker插件配置2.png)

方式2：可以去jenkins官网进行手动下载对应的插件：

```sh
https://plugins.jenkins.io/docker-plugin/
```

![image-20230710215749307](/img/backend/framework/jenkins/插件安装7.png)

选择**Using direct upload**方式，下载对应的**docker-plugin.hpi**文件：

![image-20230710215844433](/img/backend/framework/jenkins/插件安装8.png)

然后在jenkins插件高级配置中，选择本地文件，进行**deploy**操作：

![image-20230710220114455](/img/backend/framework/jenkins/插件安装9.png)

注意：

- 如果使用手动安装的方式，在安装完毕以后，首先，需要在流水线的tools中指定docker工具：

```groovy
tools {
  dockerTool 'Docker'
}
```

- 然后，需要修改宿主机的守护进程配置，使得宿主机的Docker将监听来自任何 IP 地址的 TCP 连接，并使用 Unix 套接字 `/var/run/docker.sock` 来接收本地连接：

```java
DOCKER_OPTS='-H tcp://0.0.0.0:2376 -H unix:///var/run/docker.sock'
```

- 接着，在Docker系统配置中，增加Docker.url：

```shell
tcp://10.219.101.166:2376
```

- 同时在docker插件配置中，指定从docker官网下载指定的Docker版本

![image-20230711103400890](/img/backend/framework/jenkins/docker插件配置1.png)

##### 插件11：Build Name and Description Setter

用于输出最后的构建结果信息

![image-20230711135728258](/img/backend/framework/jenkins/插件安装10.png)

#### 第二步：配置插件对应的全局环境配置

Dashboard -> 系统管理 -> 全局工具配置

- JDK环境配置 
  - JAVA_HOME = /opt/java/openjdk，这里安装的是jdk8环境，如果需要使用jdk9等以上版本，需要将对应版本的JDK安装包上传到对应目录下，进行环境配置
- NodeJS环境配置

![image-20230711135728258](/img/backend/framework/jenkins/nodejs.png)

- Maven环境配置

![image-20230711091151828](/img/backend/framework/jenkins/maven配置.png)

- Docker环境配置
- Go环境配置

![image-20230711091236253](/img/backend/framework/jenkins/go配置.png)

- Sonar环境配置

需要代码扫描，下载对应插件，进行配置..

- Ant环境配置

![image-20230711091333336](/img/backend/framework/jenkins/ant配置.png)

#### 第三步：创建pipeline流水线，编写流水线步骤，添加自定义参数，并配置jenkinslib地址

**+新建任务**

![image-20230615132618685](/img/backend/framework/jenkins/流水线步骤1.png)

**输入任务名称，选择流水线任务创建**

![image-20230615132738749](/img/backend/framework/jenkins/流水线步骤2.png)

**进行流水线任务的参数配置：根据自身项目需求进行自定义配置即可**

![image-20230615133130000](/img/backend/framework/jenkins/流水线步骤3.png)

此时，这里我使用的是一个前后端分离开发的个人博客云项目，后端基于mvn构建，前端基于npm构建，最后使用对应的Dockerfile构建打包为对应的Docker镜像，上传到指定服务器的流水线任务。

#### 问题处理

##### 问题1: pipeline流水线编写完，启动构建报错：Could not find any definition of libraries[jenkinslibs@master]

![image-20230615145454781](/img/backend/framework/jenkins/问题1.png)

这边报错的原因是：Jenkins无法找到名为"jenkinslibs"的库定义。您需要确保在Jenkinsfile中正确定义了这个库，或者确保已经在Jenkins中安装了这个库。那么首先我们要保证在我们的jenkins项目中安装了**Pipeline Utility Steps**；如果已经安装了，则可能是在共享库项目中的引入语法存在问题，正确写法如下所示：

```groovy
@Library("jenkinslib@master") _
```

##### 问题2：No such DSL method 'pipelineLoad' found among steps[...]

![image-20230615222305759](/img/backend/framework/jenkins/问题2.png)

这是由于我们在**jenkinslib**项目中没有创建编写流水线的**pipelineLoad.groovy**：

```groovy
def call(pipelineType) {
    //获取pipeline的配置文件
    def cfg_text = libraryResource("pipelineCfg.yml")
    def cfg = readYaml text: cfg_text
    def paramMap = pramasBuild(pipelineType, cfg)
    //编写流水线
    pipeline {
        //在任意节点上运行流水线
        agent any
        //指定流水线工具
        tools {
            jdk "${paramMap.get("JDK_VERSION")}"
            git 'Default'
            maven 'M3'
            go 'GO'
            nodejs "${paramMap.get("NODE_JS_VERSION")}"
        }
        //流水线选项
        options {
            skipDefaultCheckout()  //删除隐式checkout scm语句
            disableConcurrentBuilds() //禁止并行
            timeout(time: 1, unit: 'HOURS')  //流水线超时设置1h
            timestamps() //日志输出时间
        }
        //流水线步骤编写
        stages {
            stage("初始化步骤") {
                steps {
                    script {
                        switch (pipelineType) {
                            //如果是Docker构建，则使用
                            case PipelineType.DOCKER_BUILD:
                                dockerBuildPiepeline(paramMap)
                                break
                          	//后续进行各种其他类型的流水线扩展
                        }
                    }
                }
            }
        }
        //清理工作
        post {
            always {
                script {
                    deleteDir()
                }
            }
        }
    }
}
```

##### 问题3：jenkins容器挂载宿主机Docker以后，执行流水线，没有权限连接宿主机的Docker守护进程

具体报错信息如下：

```java
Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Post "http://%2Fvar%2Frun%2Fdocker.sock/v1.24/build?buildargs=%7B%7D&cachefrom=%5B%5D&cgroupparent=&cpuperiod=0&cpuquota=0&cpusetcpus=&cpusetmems=&cpushares=0&dockerfile=Dockerfile&labels=%7B%7D&memory=0&memswap=0&networkmode=default&nocache=1&rm=1&shmsize=0&t=nullorigin%2Fmaster-blog-web-v2-ultimate&target=&ulimits=null&version=1": dial unix /var/run/docker.sock: connect: permission denied
```

这里由于我们jenkins容器的默认用户是jenkins，而对于该用户，没有Docker的使用权限，这里我们需要将我们的容器中的jenkins用户添加到宿主机docker.sock的用户组中去：

第一步：查看宿主机docker.sock所属用户组

先在宿主机创建docker用户组：

```shell
> sudo groupadd docker
> sudo usermod -aG docker root
```

```shell
cd /var/run
ls -l
```

![image-20230711122604718](/img/backend/framework/jenkins/jenkins-docker-1.png)

第二步：查看对应的用户组id

```shell
> grep docker /etc/group
> docker:x:1001:netease
```

第三步：使用root用户进入jenkins容器中，创建同id的用户组，并将jenkins用户添加其中：

```shell
> docker exec -it --user=root ${容器id} bash
> groupadd -g 1001 docker #添加id为1001的用户组docker
> gpasswd -a jenkins docker #添加用户jenkins用户至docker用户组中
```

此时，我们在jenkins容器中查看docker用户组信息：

```shell
> grep docker /etc/group
> docker:x:1001:jenkins
```

说明此时容器内部的用户组和宿主机保持一致，同时在容器内部的docker用户组中，存在我们的jenkins用户。最后，重启容器，我们再使用默认用户登陆jenkins容器，查看docker版本信息，如果能够看到Server服务端的配置，说明权限配置成功！

```shell
> docker exec -it ${容器id} bash
> docker version
```

![image-20230711123633681](/img/backend/framework/jenkins/jenkins-docker-2.png)

这里我们也可以使用docker自带的用户组参数，在run容器的时候，添加--group-add=128，即可让容器内的jenkins用户拥有`/var/run/docker.sock 文件`的读写权限，至于宿主机对应docker用户组的id查看方式:

```shell
grep docker /etc/group
```

上面我们的docker用户组id为1001，故这里就可以使用以下命令启动jenkins容器：

```shell
docker run -dt --name jenkins 
-p 3270:8080 -p 50000:50000 \
--privileged=true \
--restart=always \
-v /home/jenkins_home:/var/jenkins_home \
-v /var/run/docker.sock:/var/run/docker.sock \
-v /usr/bin/docker:/usr/bin/docker 
-v /etc/docker:/etc/docker \
--group-add=1001 \
--name jenkins \ 
jenkins/jenkins:2.399 
```

