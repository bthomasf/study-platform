---
title: Git命令在项目中的日常使用
---

## 1. 初始化项目

当我们开始一个新的项目时，并和远程的gitlab/github/gitee等代码仓库进行关联时，我们需要进行初始化配置：

```shell
Git 全局设置:

git config --global user.name "xxx"
git config --global user.email "xxx@163.com"

# 创建 git 仓库:
mkdir git-command
cd git-command
git init 
touch README.md
git add README.md
git commit -m "first commit"
git remote add origin https://gitee.com/fbelite/git-command.git
git push -u origin "master"

# 已有仓库?
cd existing_git_repo
git remote add origin https://gitee.com/fbelite/git-command.git
git push -u origin "master"
```

## 2. 查看/切换/删除分支

日常开发工作中，需要查看当前使用分支，并进行分支切换，重新基于某已有分支创建新的分支等操作。

- 查看分支:

```shell
git branch
```

- 查看当前分支commit记录：

```shell
git log
```

- 切换分支

```shell
git checkout ${branch_name}
# 更合理的切换方式
git switch ${branch_name}
```

- 切换并创建新分支（基于分支）

```shell
git checkout -b ${new_branch_name} ${base_branch_name}
git switch -c ${new_branch_name}
```

![img.png](/img/backend/git/img.png)

- 删除分支

```shell
删除本地分支：需要当前不处于该分支上，否则会报错error: Cannot delete branch 'xxx' checked out at ...
git branch -d ${branch_name}

删除远程分支：git push origin --delete ${branch_name}
```

![img.png](/img/backend/git/img2.png)

## 3. 版本回退

### 版本回退远程提交

在日常开发中，我们可能会在一个分支下进行多次改动，而在每次改动提交以后就像是游戏存档一样，后续我们可能由于代码问题或者其

他情况，需要回退到前一个版本状态：这里我们以一个案例说明：

首先我们在develop分支先后进行了三次提交：
![img.png](/img/backend/git/img3.png)

然后，我们希望可以回退到某一个特定的提交版本位置。此时我们首先需要借助`git log`命令告诉我们对于该分支的历史commit记录：

```shell
git log
```

> commit 17af1a43c2e7bbd808ede8074a2f5e44aa3cebf5 (HEAD -> develop, origin/develop)
> Author: fengbin04 <fengbin04@corp.netease.com>
> Date:   Tue Feb 27 16:24:11 2024 +0800
>
>  version3 commit3
>
> commit e6cfc9ff4d9eaa733e88201d7f65105e9cb70c6d
> Author: fengbin04 <fengbin04@corp.netease.com>
> Date:   Tue Feb 27 16:23:38 2024 +0800
>
>  version2 commit
>
> commit 377182467037a0da802de4865617541fd63b3991
> Author: fengbin04 <fengbin04@corp.netease.com>
> Date:   Tue Feb 27 16:23:00 2024 +0800
>
>  version1 commit
>
> commit 801c8f877ca580f5263c76f1d5bdf8a4ad3cd199
> Author: fengbin04 <fengbin04@corp.netease.com>
> Date:   Tue Feb 27 16:19:58 2024 +0800
>
>  add image
>
> commit 0ae4a90c0fd0f627b3738be431edb9503f3ef0c6 (origin/master, master, main)
> Author: fengbin04 <fengbin04@corp.netease.com>
> Date:   Tue Feb 27 16:08:25 2024 +0800
> ...

此时输出消息内容过长过多，我们可以使用`--pretty=oneline`参数值显示我们需要的commit记录一行：

```shell
git log --pretty=oneline
```

> 17af1a43c2e7bbd808ede8074a2f5e44aa3cebf5 (HEAD -> develop, origin/develop) version3 commit3
> e6cfc9ff4d9eaa733e88201d7f65105e9cb70c6d version2 commit
> 377182467037a0da802de4865617541fd63b3991 version1 commit
> 801c8f877ca580f5263c76f1d5bdf8a4ad3cd199 add image
> 0ae4a90c0fd0f627b3738be431edb9503f3ef0c6 (origin/master, master, main) init git-command

如果你想直接回退到上一版本，那么很简单：

```shell
git reset --hard HEAD^
```

此时，我们在使用`git log`查看当前版本记录：

> e6cfc9ff4d9eaa733e88201d7f65105e9cb70c6d (HEAD -> develop) version2 commit
> 377182467037a0da802de4865617541fd63b3991 version1 commit
> 801c8f877ca580f5263c76f1d5bdf8a4ad3cd199 add image
> 0ae4a90c0fd0f627b3738be431edb9503f3ef0c6 (origin/master, master, main) init git-command

我们确实回到了version2 commit的时间版本，当然你可以继续向前的指定版本进行回退，只需要使用：

```shell
git reset --hard commit-id
```

就会发现此时本地代码已经回退到了之前的某一次提交了。

那么此时我们希望从过去的版本再回到未来，怎么办呢？办法当然是有的，因为我们记录了每一次commit的id，只需要通过相同的命令就可以回到未来，比如我们现在位于`version2 commit`，我们希望来到`version3 commit`，则直接找到`version3 commit`的id，直接

`git reset --hard 17af1a43c2e7`就会发现我们又回去了！！

![image-20240227164911990](/img/backend/git/img4.png)

那么假设我们没有记录`git log`打印输出的commit-id记录怎么办呢？？我们还可以使用`git reflog`查看之前的每一次命令来找到我们之前的commit-id记录：

```shell
git reflog
```

> 17af1a4 (HEAD -> develop, origin/develop) HEAD@{0}: reset: moving to 17af1a43c2e7
> 801c8f8 HEAD@{1}: reset: moving to 801c8f877
> e6cfc9f HEAD@{2}: reset: moving to HEAD^
> 17af1a4 (HEAD -> develop, origin/develop) HEAD@{3}: commit: version3 commit3
> e6cfc9f HEAD@{4}: commit: version2 commit
> 3771824 HEAD@{5}: commit: version1 commit
> 801c8f8 HEAD@{6}: commit: add image
> 0ae4a90 (origin/master, master, main) HEAD@{7}: checkout: moving from tmp01 to develop
> 0ae4a90 (origin/master, master, main) HEAD@{8}: checkout: moving from develop to tmp01
> 0ae4a90 (origin/master, master, main) HEAD@{9}: checkout: moving from master to develop
> 0ae4a90 (origin/master, master, main) HEAD@{10}: checkout: moving from main to master
> 0ae4a90 (origin/master, master, main) HEAD@{11}: commit (initial): init git-command

当我们再对确认回退后的版本进行修改无误以后，可以进行add-commit-push操作：

```shell
git add .
git commit -m "your commit log"
git push origin branch_name
```

此时，如果你之前已经推送过一个现在重置的版本到远程仓库，你的推送可能会被拒绝，因为会造成分支历史不一致。在这种情况下，你可以使用以下命令强制推送：

```shell
git push origin <branch_name> --force
或者更安全的命令：会在推送之前检查远程分支是否有当前你的本地分支不知道的更新，从而避免无意覆盖他人工作的情况
git push origin <branch_name> --force-with-lease
```

### 版本回退本地提交

如果本地代码已经执行了add和commit到了本地分支当中，此时需要将其回退到之前，可以使用：

```shell
# 撤销上一次commit，但是保留更改内容在暂存区
git reset --soft HEAD~1
# 撤销上一次commit，将更改内容移动到工作区，需要使用git add 将其重新加入到暂存区
```

注意：

- HEAD~1` 的意思是当前分支的上一个 `commit`。如果你想要撤销更多的 `commit`，可以将 `1` 替换为对应的数字，比如 `HEAD~2` 表示撤销最近的两次 `commit

## 4. 工作区和暂存区

暂存区：就是`git add`把文件添加进去的地方就是暂存区

工作区：就是我们的项目目录文件夹，内部会有一个.git文件，这个是git的版本库

Git的版本库里存了很多东西，其中最重要的就是称为stage（或者叫index）的暂存区，还有Git为我们自动创建的第一个分支`master`，以及指向`master`的一个指针叫`HEAD`

![git-repo](/img/backend/git/img5.png)

故我们日常开发的工作本地的两步就是：

- `git add` 将文件添加到暂存区
- `git commit`将暂存区的更改的所有内容添加到指定版本的分支

## 5. 管理修改

Git跟踪并管理的是**修改**，而非文件。那么什么是修改？比如你新增了一行，这就是一个修改，删除了一行，也是一个修改，更改了某些字符，也是一个修改，删了一些又加了一些，也是一个修改，甚至创建一个新文件，也算一个修改。

例如：

> 我们在第一次修改了文件A，然后add到了暂存区，然后第二次修改文件A，最后commit到分支中，此时我们只会commit第一次add到暂存区的内容，第二次的修改还在工作区，并没有add到暂存区中。

## 6. 撤销修改

```shell
git checkout -- xxx文件
```

该命令会将xxx文件在工作区的修改全部撤销，这里就是将这个文件回到最近一次`git commit`或者`git add`的状态，即：

- 如果我们还没有提交到暂存区，则恢复之前版本的内容
- 如果我们已经提交到暂存区，并对齐进行修改，则恢复add到暂存区的状态

## 7. 删除文件

```shell
# 从版本库删除文件
git rm xxx文件
# commit当前删除操作
git commit -m "rm file"
```

## 8. 分支合并

### 合并指定分支全部到当前分支

```shell
git merge
```

### 合并指定分支中的某些Commit内容到当前分支

```shell
# 第一步：切换到目标分支：即最后你想合并到的分支
git switch $branch_name
# 第二步：选择某一个commit记录进行cherry-pick,或者某个连续的范围
git cherry-pick ${commit-hashid}
git cherry-pick ${start_commit-hashid}..${end_commit-hashid}
```

## 9. Rebase

rebase的操作，有人把它翻译成“变基”，就是将分叉的提交变成直线！！！它的优点在于把分叉的提交历史“整理”成一条直线，看上去更直观。缺点是本地的分叉提交已经被修改过了。

举例说明：

我们首先拉取了远程分支到本地进行修改，但是当我们本地commit以后，进行push操作的时候，已经有人在我们之前将同样的远程分支进行拉取修改并提交了。此时我们的push操作就会被阻塞了，一般来说，我们可以选择先pull最新的提交，再进行push操作，但是会发现我们的本地分支提交滞后了，此时就可以通过rebase进行处理，它会把我们本地的提交“挪动”了位置，放到了`他人提交`之后，这样，整个提交历史就成了一条直线。



更多操作: 如果想详细学习git的基本操作，可以查看廖雪峰老师的这篇文章：https://www.liaoxuefeng.com/wiki/896043488029600



