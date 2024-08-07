---
title: Mac入门使用
---

入手mac以后首先可以配置`AppStore`的账号，并完善用户密码、头像等设置。

### 辅助功能设置

Mac中有一些很好用的辅助功能本身没有开启，或者你并不知道，这里简单罗列一些常用的设置：

#### 1、轻点来点按

点击屏幕左上角的苹果图标-选择系统偏好设置-触控板：

![在这里插入图片描述](/img/mac/mac-1.png)

然后将轻点来点按勾选，就可以更加方便的进行轻点操作：
![在这里插入图片描述](/img/mac/mac-2.png)


#### 2、三指拖移操作

我们可以通过开启三指拖移操作来实现三指快速拖移窗口，选择文字等快捷操作，开启方式如下所示：

首先点击系统偏好设置，然后选择辅助功能，如下图所示：

![在这里插入图片描述](/img/mac/mac-3.png)


进入以后，选择**指针控制**，然后启用拖移，里面的下拉菜单里选择**三指拖移**，最后点击**好**

![在这里插入图片描述](/img/mac/mac-4.png)


#### 3、Dock功能

当我们鼠标点击到Dock栏的应用程序时，它会自动放大，这项功能的开启方式如下所示：

点击系统偏好设置-选择程序坞菜单栏-然后将后边的放大功能勾选上

![在这里插入图片描述](/img/mac/mac-5.png)


#### 4、开启蓝牙，电量百分比显示

点击系统偏好设置-程序坞与菜单栏，左边窗口找到蓝牙，右侧将显示勾选上，继续下滑至电池，将右侧的电量百分比勾选上：

![在这里插入图片描述](/img/mac/mac-6.png)
![在这里插入图片描述](/img/mac/mac-7.png)


#### 5、更换壁纸

可以点击系统偏好设置-桌面与屏幕保护程序，这里可以设置静态壁纸，也可以设置动态壁纸，同样可以设置壁纸的文件夹。

![在这里插入图片描述](/img/mac/mac-8.png)


### 触控版手势操作

这里针对的是默认开启了三指拖移功能后的手势操作：

| 手指 |          手势          |             功能             |
| :--: | :--------------------: | :--------------------------: |
| 单指 |          轻点          |           鼠标左键           |
| 单指 |        轻点两下        |           打开文件           |
| 单指 |      快速来回滑动      |    鼠标追踪，光标变得很大    |
| 单指 |        用力点按        |     翻译单词，预览文件等     |
| 单指 |      连续轻点两下      |   选中网页段落中最近的单词   |
| 单指 |      连续轻点三下      | 选中网页段落中的整个段落内容 |
| 双指 |     上下，左右滑动     |           浏览网页           |
| 双指 |          拉动          |        放大/缩小画面         |
| 双指 |          旋转          |           旋转图片           |
| 双指 |          轻点          |           鼠标右击           |
| 双指 | 从触控板右边缘向左滑动 |         弹出控制中心         |
| 三指 |        三指拖移        |    移动程序窗口，移动文件    |
| 四指 |          合拢          |           打开桌面           |
| 四指 |        向外张开        |     回到之前打开应用窗口     |
| 四指 |        左右滑动        |         切换全屏窗口         |
| 四指 |        向上滑动        |    显示所有打开的应用窗口    |
| 四指 |  选中某个应用向下滑动  |     打开该应用的所有窗口     |

### Mac快捷键整理

|        快捷键         |   功能   |
| :-------------------: | :------: |
|  Command + shift + 4  |   截图   |
| Command + Control + F | 退出全屏 |
|                       |          |
|                       |          |
|                       |          |

### 软件安装

在Mac上安装软件下载的文件后缀名为**.dmg**，下载的文件统一放在**下载目录**下，我们只需单击该文件，在出现的弹窗中将其移至右侧的**Application文件夹**中即完成安装操作，安装完成，若桌面有类似的磁盘文件，右击-推出即可，或者将其移至废纸篓。

### 环境配置

环境配置前，建议下载**iTerm2**，好用的控制终端

#### 1、JDK安装及环境变量配置

jdk直接去Oracle官网下载对应版本的jdk即可，如果你想下载老版本的jdk(这里我下载的是开发使用的jdk1.8)，可以在下载选择页面点击**Java Archive**，然后选择对应的历史版本下载即可，下载完毕点击傻瓜式安装。

选择JDK：

![在这里插入图片描述](/img/mac/mac-9.png)


点击Java Archive：

![在这里插入图片描述](/img/mac/mac-10.png)


选择要下载的jdk历史版本，点击进入下载页面下载即可：

![在这里插入图片描述](/img/mac/mac-11.png)


安装完毕，需要进行环境变量的配置，我们首先进入终端，这里说明一下：

* ～：表示用户目录

![在这里插入图片描述](/img/mac/mac-12.png)


* /：表示root文件目录

![在这里插入图片描述](/img/mac/mac-13.png)


Mac在～目录下存在一个**.zshrc**，该文件会在每次开机时进行加载，故我们将所有的环境变量配置到**/etc/profile**文件中，然后在**.zshrc**文件中最后一行添加：

```
# 每次开机时将etc下的profile文件进行加载
source /etc/profile
```

明白了上面的配置策略以后，我们先检查一下jdk的安装路径：

```sh
/usr/libexec/java_home -V
```

![在这里插入图片描述](/img/mac/mac-14.png)


然后进入etc/profile文件中进行java环境变量的配置：

```
# 进入/etc/profile
sudo vi /etc/profile
#配置JAVA_HOME
JAVA_HOME = /Library/Java/JavaVirtualMachines/jdk1.8.0_333.jdk/Contents/Home/
```

此时输入**java -version**检查jdk环境是否安装配置成功：

```shell
Matching Java Virtual Machines (2):
    1.8.333.02 (x86_64) "Oracle Corporation" - "Java" /Library/Internet Plug-Ins/JavaAppletPlugin.plugin/Contents/Home
    1.8.0_333 (x86_64) "Oracle Corporation" - "Java SE 8" /Library/Java/JavaVirtualMachines/jdk1.8.0_333.jdk/Contents/Home
/Library/Internet Plug-Ins/JavaAppletPlugin.plugin/Contents/Home
feng@fengdeMacBook-Pro / % java -version
java version "1.8.0_333"
Java(TM) SE Runtime Environment (build 1.8.0_333-b02)
Java HotSpot(TM) 64-Bit Server VM (build 25.333-b02, mixed mode)
```

#### 2、Maven安装及环境环境配置

去Maven的官网下载对应版本的Maven压缩包，解压到指定文件夹下【自己知道，以后不要再变了】，这里我解压到**/Users/feng**目录下：

PS:

* 这里存在一个很坑的点，你登陆Mac以后所有的软件操作都是基于你登陆的当前用户的，故不要将maven安装到root用户的文件路径下，即/etc，/usr等...

官网下载地址：https://maven.apache.org/download.cgi

环境配置：同样进入/etc/profile文件中，进行环境变量的配置如下：

```shell
MAVEN_HOME=/Users/feng/apache-maven-3.8.6
export PATH=$JAVA_HOME/bin:$MAVEN_HOME/bin:$PATH
```

配置成功以后手动刷新**/etc/profile**，输入**mvn -v**检查Maven是否安装配置成功：

```shell
Maven home: /usr/local/apache-maven-3.8.6
Java version: 1.8.0_333, vendor: Oracle Corporation, runtime: /Library/Java/JavaVirtualMachines/jdk1.8.0_333.jdk/Contents/Home/jre
Default locale: zh_CN, platform encoding: UTF-8
OS name: "mac os x", version: "12.3", arch: "x86_64", family: "mac"
```

**Settings.xml**文件的配置：

配置之前，我们需要创建一个maven仓库（**一定，一定要在自己的用户目录下创建！！！！**）：

```sh
cd ~/Users
# 查询自己的用户目录
ls
# 进入自己的用户目录下
cd feng
# 此时可以在自己的用户目录下创建maven-repository
```

由于我们在**/Users/feng**下放置了maven的安装包，我这里为apache-maven-3.8.6，故这里我们进入该目录下配置settings.xml，添加仓库地址和阿里云mirror：

```xml
<localRepository>/Users/feng/maven-repository</localRepository>

<!-- 阿里云仓库 -->
<mirror>
  <id>alimaven</id>
  <mirrorOf>central</mirrorOf>
  <name>aliyun maven</name>
  <url>http://maven.aliyun.com/nexus/content/repositories/central/</url>
</mirror>
```

全部配置完毕，我们可以进入idea中进行maven的配置：

这里需要注意的是我们不仅要配置当前项目的maven，还是配置创建New Project时的maven：

进入项目后，点击上方的**preferences**:

![在这里插入图片描述](/img/mac/mac-15.png)


进入以后搜索**maven**，在后侧分别对**maven路径，settings文件路径以及maven仓库路径**进行配置：

![在这里插入图片描述](/img/mac/mac-16.png)

同时，对于New Project来说，我们点击上方**File-New Projects Setup-Perferences for new Projects**

![在这里插入图片描述](/img/mac/mac-17.png)
然后搜索maven-进行maven的设置：
![在这里插入图片描述](/img/mac/mac-18.png)


#### 3、HomeBrew

Homebrew是一款软件包管理工具，支持macOS和linux系统，拥有安装、卸载、更新、查看、搜索等功能

进入Homebrew官网：https://brew.sh/index_zh-cn.html

粘贴命令栏指令到Mac终端执行：

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

PS：其中安装过程比较漫长，不要自己回车，容易中断程序，安装成功以后提示以下信息：

![在这里插入图片描述](/img/mac/mac-19.png)

上面提示执行下面两个命令：

```
echo 'eval' "$(/opt/homebrew/bin/brew shellenv)" >> /
Users/feng/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

此时，homebrew已经成功安装，我们执行**brew --version**查看版本信息：

```
Homebrew 3.5.7
Homebrew/homebrew-core (git revision 1bce75b71f1; last commit 2022-08-02)
```

#### 4、Git

使用brew命令安装git：

```
# 安装git
brew install git 
# 查看git版本信息
git --version
# 输出信息
git version 2.32.1 (Apple Git-133)
```

关于git的详细操作，请查看git操作指南

#### 5、Node.js

建议先安装NVM，它是Node.js的版本控制管理程序，使用Homebrew安装NVM：

```
brew install nvm
```

安装成功以后需要配置环境变量，它的提示信息如下：

```
Add the following to ~/.zshrc or your desired shell
configuration file:

  export NVM_DIR="$HOME/.nvm"
  [ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"  # This loads nvm
  [ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion
```

按照之前配置环境变量的流程，首先将上述环境配置文件内容写到**/etc/profile**文件里，然后调用**source /etc/profile**命令，后续由于我们在～/.zshrc中添加了文件刷新命令，所以每次开机都会自动加载这些环境配置。

配置成功以后，我们使用nvm安装node.js：

```shell
# 安装
nvm install v14.16.0
# 使用
nvm use v14.16.0
```

#### 6、MySQL

使用homebrew安装mysql：

```shell
brew install mysql
```

安装成功以后，提示：

```java
To restart mysql after an upgrade:
  brew services restart mysql
Or, if you don't want/need a background service you can just run:
  /opt/homebrew/opt/mysql/bin/mysqld_safe --datadir=/opt/homebrew/var/mysql
==> Summary
🍺  /opt/homebrew/Cellar/mysql/8.0.30: 312 files, 296.4MB
==> Running `brew cleanup mysql`...
Disable this behaviour by setting HOMEBREW_NO_INSTALL_CLEANUP.
Hide these hints with HOMEBREW_NO_ENV_HINTS (see `man brew`).
==> Caveats
==> mysql
We've installed your MySQL database without a root password. To secure it run:
    mysql_secure_installation

MySQL is configured to only allow connections from localhost by default

To connect run:
    mysql -uroot

To restart mysql after an upgrade:
  brew services restart mysql
Or, if you don't want/need a background service you can just run:
  /opt/homebrew/opt/mysql/bin/mysqld_safe --datadir=/opt/homebrew/var/mysql
```

**设置密码：**

```sql
mysql_secure_installation
# 如果提示没有权限，则使用sudo
sudo mysql_secure_installation
```

**mysql常用命令：**

```sql
#后台启动
brew service start mysql 
sudo brew service start mysql 
#前台启动，关闭控制台，关闭mysql
mysql.server start 
sudo mysql.server start 
#重启mysql
brew services restart mysql
```

我们使用设置密码命令时，提示错误信息：

```sql
Error: Can't connect to local MySQL server through socket '/tmp/mysql.sock' (2)
```

这是由于我们还没有启动mysql服务的原因，先使用启动命令启动mysql，再进行密码的设置工作.

设置密码时会进行一些权限的设置配置：

```sql
Securing the MySQL server deployment.
Connecting to MySQL using a blank password.
VALIDATE PASSWORD PLUGIN can be used to test passwords
and improve security. It checks the strength of password
and allows the users to set only those passwords which are
secure enough. Would you like to setup VALIDATE PASSWORD plugin?

Press y|Y for Yes, any other key for No: y

There are three levels of password validation policy:

LOW    Length >= 8
MEDIUM Length >= 8, numeric, mixed case, and special characters
STRONG Length >= 8, numeric, mixed case, special characters and dictionary                  file
// 这里提示选一个密码强度等级
Please enter 0 = LOW, 1 = MEDIUM and 2 = STRONG: 1
Please set the password for root here.
// 然后按照所选的密码强度要求设定密码
New password:

Re-enter new password:

Estimated strength of the password: 50
Do you wish to continue with the password provided?(Press y|Y for Yes, any other key for No) : y
 ... Failed! Error: Your password does not satisfy the current policy requirements

New password:

Re-enter new password:

Estimated strength of the password: 100
Do you wish to continue with the password provided?(Press y|Y for Yes, any other key for No) : y
By default, a MySQL installation has an anonymous user,
allowing anyone to log into MySQL without having to have
a user account created for them. This is intended only for
testing, and to make the installation go a bit smoother.
You should remove them before moving into a production
environment.
// 这里删除默认无密码用户
Remove anonymous users? (Press y|Y for Yes, any other key for No) : y
Success.

Normally, root should only be allowed to connect from
'localhost'. This ensures that someone cannot guess at
the root password from the network.
// 禁止远程root登录，我选的是不禁止。因为我的mac上的数据库不会放到公网上，也不会存什么敏感数据
Disallow root login remotely? (Press y|Y for Yes, any other key for No) : no

 ... skipping.
By default, MySQL comes with a database named 'test' that
anyone can access. This is also intended only for testing,
and should be removed before moving into a production
environment.

// 这里删除默认自带的test数据库
Remove test database and access to it? (Press y|Y for Yes, any other key for No) : y
 - Dropping test database...
Success.

 - Removing privileges on test database...
Success.

Reloading the privilege tables will ensure that all changes
made so far will take effect immediately.

Reload privilege tables now? (Press y|Y for Yes, any other key for No) : y
Success.
All done!
```

#### 7、**Oh My Zsh**

首先需要安装item2，地址：www.iterm2.com/

安装完毕，将MAC的shell由bash切换成zsh

```shell
chsh -s /bin/zsh
```

**安装Oh My Zsh：**

**方式1：curl**

```shell
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

**方式2：wget**

```shell
sh -c "$(wget https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
```

**Oh My Zsh使用**

Oh My Zsh主要分为主题和插件两个部分。我们都需要在～/.zshrc文件中进行配置使用

**主题**

主题配置位于**.zshrc**文件的**第11行左右**：

```shell
# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:/usr/local/bin:$PATH
​
# Path to your oh-my-zsh installation.
export ZSH="$HOME/.oh-my-zsh"
​
# Set name of the theme to load --- if set to "random", it will
# load a random theme each time oh-my-zsh is loaded, in which case,
# to know which specific one was loaded, run: echo $RANDOM_THEME
# See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
ZSH_THEME="robbyrussell"
```

可以github网址进行主题的选择，然后配置到我们的.zshrc文件中：

https://github.com/robbyrussell/oh-my-zsh/wiki/Themes

这里设置的主题为**agnoster**

```shell
ZSH_THEME="agnoster"
```

该主题的字体不支持，需要我们手动安装**Powerline**字体才能让主题显示正常：

```shell
# 克隆到本地
git clone https://github.com/powerline/fonts.git --depth=1
# 安装
cd fonts
./install.sh
# 清理安装文件
cd ..
rm -rf fonts
```

此时，发现还是存在部分出现**？**的乱码问题，此时我们需要在Item进行配置：**Preferences -> Profiles -> Text**

![image-20230618155744376](/img/mac/mac-20.png)

此时，我们的item2该主题就完全配置成功了！！！

![image-20230618155822928](/img/mac/mac-21.png)

**插件**

**插件配置**位于**.zshrc**文件的**第65行左右**：

可以github网址进行插件的选择，然后配置到我们的.zshrc文件中：

https://github.com/robbyrussell/oh-my-zsh/wiki/Plugins

```shell
plugins=(git extract z)
```

注意：

- 配置主题或者插件以后，记得**重新加载一下.zshrc文件**source ~/.zshrc