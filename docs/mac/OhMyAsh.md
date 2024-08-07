---
title: ITem2 + OhMyZsh配置完美终端
---

## 安装Item2

www.iterm2.com/

安装完毕，将MAC的shell由bash切换成zsh

```shell
chsh -s /bin/zsh
```

## 安装Oh My Zsh：

#### 方式1：curl

```shell
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

#### 方式2：wget

```shell
sh -c "$(wget https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
```

## Oh My Zsh使用

Oh My Zsh主要分为主题和插件两个部分。我们都需要在～/.zshrc文件中进行配置使用

#### 主题

主题配置位于**.zshrc**文件的**第11行左右**：

```xml
# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:/usr/local/bin:$PATH

# Path to your oh-my-zsh installation.
export ZSH="$HOME/.oh-my-zsh"

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

![image-20220928175243020](/img/mac/ash-1.png)

此时，我们的item2该主题就完全配置成功了！！！

![image-20220928175446846](/img/mac/ash-2.png)

#### 插件

**插件配置**位于**.zshrc**文件的**第65行左右**：

可以github网址进行插件的选择，然后配置到我们的.zshrc文件中：

https://github.com/robbyrussell/oh-my-zsh/wiki/Plugins

```shell
plugins=(git extract z)
```

注意：

* 配置主题或者插件以后，记得**重新加载一下.zshrc文件**

```shell
source ~/.zshrc
```

