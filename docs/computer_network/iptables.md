---
title: iptables学习
---

## iptables介绍

Linux 的**包过滤功能**，即 Linux 防火墙，它由 **netfilter** 和 **iptables** 两个组件组成。

![image-20231106111823586](/img/cn/iptables/iptables介绍.png)

其中，iptables分为四表五链，其中四个表包括：

- filter：iptables 的默认表。负责**过滤功能、防火墙**，也就是由 filter 表来决定一个数据包是否继续发往它的目的地址或者被丢弃。对应的内核模块为 iptables_filter。filter 表具有三种内建链：**INPUT、OUTPUT、FORWARD**。
- nat：nat 是 network address translation 的简称，具备网络地址转换的功能。对应的内核模块为 iptables_nat。nat 表有三种内建链：PREROUTING、POSTROUTING、OUTPUT（CentOS 7 中还包含 INPUT，但是在 CentOS 6 中没有）
- mangle：用于指定如何处理数据包，具备拆解报文、修改报文以及重新封装的功能，可用于修改IP 头部信息，如：TTL。对应的内核模块为 iptables_mangle。mangle 表具有 5 种内建链：PREROUTING、INPUT、FORWARD、OUTPUT、POSTROUTING
- raw：用于处理异常。对应的内核模块为 iptables_raw。raw 表包含2个内建链：PREROUTING 和 OUTPUT

其中，五链指的是：

INPUT 链：处理来自外部的数据。

OUTPUT 链：处理向外发送的数据。

FORWARD 链：数据转发。通过路由表后发现目的地址非本机，则匹配该链中的规则。

PREROUTING 链：处理刚到达本机并在路由转发前的数据包。

整个数据链在数据包到达LINUX内核时，整体的fiter链路如下所示：

可以简单化的理解：

> 当数据包刚到达系统时，就由PPREOUTING链负责
>
> 当数据包的目标是本机的话，就由INPUT链负责
>
> 当数据包从本地出去的话，就由OUTPUT链负责
>
> 当数据包的目标不是本地，而是要经过本地的路由，则由FORWARD负责
>
> 当数据包经过路由，并离开本机时，则由POSTOUTING链负责

![image-20231106111903461](/img/cn/iptables/iptables介绍2.png)

注意：如果我们只是操作filter表，其实就需要关心INPUT、OUTPUT和FORWARD链即可。

所以，我们简答的理解，**iptable存在不同的表，表里有着不同的链，而在链中我们可以指定不同的规则**。

## iptabels指令

### 指令介绍

这里，先说明iptables的命令格式：

```shell
iptables [-t 表名] 命令选项 [链名] [条件匹配] [-j 处理动作或者跳转]
```

如果没有设置表名，则默认为filter表，即默认添加`-t filter`

其中，命令选项

- -L 列出一个或所有链的规则
- -v 显示详细信息，包括每条规则的匹配句数量和匹配字节数
- -x 在v的基础上，禁止自动换算单位（K,M）
- -n 只显示ip地址和端口号，不显示域名和服务名称
- -I 插入到防火墙**第一条**生效
- -A 添加链是添加到**最后一条**
- -D 删除指定链中的某一条规则，按规则序号或内容确定要删除的规则
- -F 清空指定链中的所有规则，默认清空表中所有链的内容
- -X 删除指定表中用户自定义的规则链

**匹配条件**

- -i 入站请求interface（网卡）
- -o 出站请求interface（网卡）
- -s 入站源地址
- -d 目标地址
- -p 指定规则协议，如tcp, udp,icmp等，可以使用 all 来指定所有协议
- --dport 目的端口，数据包的目的（dport）地址是80，就是要访问我本地的80端口
- --sport 来源端口 数据包的来源端口是（sport）80，就是对方的数据包是80端口发送过来的。

**动作**

- ACCEPT：允许数据包通过。
- DROP：直接丢弃数据包，不给任何回应信息，这时候客户端会感觉自己的请求泥牛入海了，过了超时时间才会有反应。
- REJECT：拒绝数据包通过，必要时会给数据发送端一个响应的信息，客户端刚请求就会收到拒绝的信息。（一般不使用REJECT(拒绝)行为，REJECT会带来安全隐患。）
- SNAT：源地址转换，解决内网用户用同一个公网地址上网的问题。
- MASQUERADE：是SNAT的一种特殊形式，适用于动态的、临时会变的ip上。
- DNAT：目标地址转换。
- REDIRECT：在本机做端口映射。
- LOG：在/var/log/messages文件中记录日志信息，然后将数据包传递给下一条规则，也就是说除了记录以外不对数据包做任何其他操作，仍然让下一条规则去匹配。

接下来，我们通过几个常用指定来熟悉iptables的使用。

#### 指令1：查看表规则

首先，我们如果想查看某一个表的所有链和规则，可以使用：

```shell
iptables --table filter --list
```

此时我们一般在没有其他配置的情况下，只会看到三个链的规则，分别是INPUT，FORWARD和OUTPUT：

![image-20230711135728258](/img/cn/iptables/iptables命令1.png)

此时，如果不写`--table filter`，则默认也是查询filter表，并且`--table`可以简化为`-t`，`--list`可以简化为`-L`

故我们最后想要查看filter表的命令可以简化为：

```shell
iptables -L
```

#### 指令2：添加访问规则

如果我们希望能够允许一个ip地址对当前LINUX主机的访问，可以使用下列命令：

```shell
iptables \
--table filter \
--append INPUT \
--source 192.168.3.20 \ 
--jump ACCEPT
```

这里，我们可以简化规则为：

```shell
iptables -A INPUT -s 192.168.3.20 -j ACCEPT
```

但是这种添加白名单的场景，一般是在我们拒绝所有ip访问的前提下添加的（因为一般默认都是能够访问的，添不添加没有任何意思，只是多了一个规则罢了）

注意：

- 上面的添加命令选项为`--append`，表示在当前链的末端进行添加，如果我们想在首部添加，第一个生效，则可以使用`-I`选项进行添加：

  ```shell
  iptables -I INPUT -s 192.168.3.20 -j ACCEPT
  ```

#### 指令3：添加拒绝规则

此时，存在一个场景，我们希望能够拒绝一个ip对当前LINUX主机的访问规则，我们可以使用如下命令：

```shell
iptables \
--table filter \
--append INPUT \ 
--source 192.168.3.20 \
--jump REJECT
```

同样，我们可以简写为：

```shell
iptables -A INPUT -s 192.168.3.20 -j REJECT
```

它的意思就是希望拒绝ip地址为`192.168.0.1`对我们当前主机的数据包访问，此时我们再次查看当前filter表的规则，会发现在INPUT链中多出一个规则：
![image-20231105161431588](/img/cn/iptables/iptables命令2.png)

此时，当我们在拒绝访问的主机上去ping当前主机，就发现无法访问了，同时我们也无法ping通192这个节点，这是因为数据包过去以后，我们还需要接受，同样要走INPUT的规则。

这里需要注意的事，我们在iptables的链中配置的规则，执行顺序是自上而下，故如果我们想要实现除了某个/某几个IP对主机的访问，其他ip地址都拒绝访问，应该要将允许访问的规则放在前面，最后添加一个DROP/REJECT规则进行丢弃或者拒绝，来达到我们的目的。

那如果我们希望删除配置好的规则，则可以使用`--line-numbers`来查看每个规则的具体行号：

```shell
iptables -L --line-numbers
```

![image-20231105162239124](/img/cn/iptables/iptables命令3.png)

此时，我们想要删除某个具体的规则，则可以使用：

```shell
iptables --delete [链名称] [具体行号]
```

这里，需要注意的是：

- `--delete` 可以简化为-D
- 删除规则时需要小心谨慎，防止删除核心规则导致系统不可用

当然，还有其他的命令，可以对照规则介绍中的参数自定义实现。

#### 指令4：保存规则

一般来说，我们在iptables中执行的命令会立即生效，不需要任何规则的保存操作，但是如果你的主机存在时而重启的情况，则需要进行保存操作，因为机器重启后，iptables之前配置的规则就会自动丢失。

```shell
iptables-save > /etc/iptabels01.rule
```

等待重启后，我们可以应用之前保存的规则进行恢复：

```shell
iptables-restore < /etc/iptabels01.rule
```

### 场景实践

iptables经常会使用到各种白名单访问的场景当中，下面简单介绍两种应用场景中iptables的使用。

#### 场景1：开放若干ip地址对当前主机数据包的访问

那么，现在我们如果希望ip地址为`192.168.0.1`和`19.168.0.2`能够访问当前系统，其他全部丢弃，应该如何配置呢？？

首先第一步，我们需要查看当前filter的链规则，没有其他与配置相关的规则处理后，依次添加两条允许访问规则和一条丢弃所有规则

```shell
iptables -A INPUT -s 192.168.0.1 -j ACCEPT
iptables -A INPUT -s 192.168.0.2 -j ACCEPT
iptables -A INPUT -s 0.0.0.0/0 -j DROP
iptables-save
```

此时即可完成我们的需求，但是如果你将上述的规则执行顺序进行了变化，例如你先执行DROP规则，再执行ACCEPT规则，就会导致最后在查看INPUT规则是下面的顺序：

```shell
INPUT     all  --  0.0.0.0/0            0.0.0.0/0    DROP
INPUT     all  --  192.168.0.1/0            0.0.0.0/0 ACCEPT
INPUT    all  --  192.168.0.2/0            0.0.0.0/0  ACCEPT
```

这样，由于iptables规则是自上而下顺序执行的，就会导致先执行了DROP,已丢弃了所有，那么后面的ACCEPT已没有任何的意思，故我们需要将ACCEPT置于DROP的上方，或者通过`-I`选项将规则添加到链的首部来实现我们的需求。

#### 场景2：开放若干ip地址对当前主机的指定DOCKER服务的端口的访问

现在存在场景，主机中存在DOCKER启动的ZOOKEEPER服务，该服务未实现认证模式，存在安全漏洞，故我们需要对该服务的访问设置白名单：只指定ip地址为`192.168.0.1`和`192.168.0.2`对当前主机的2181端口的访问。

首先，我们查看iptables对于当前2181的规则：

```shell
iptables -nL |grep 2181
```

此时会默认出现两条规则：

```shell
ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:2181
ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:2181 ctstate NEW,UNTRACKED
```

该规则允许所有流量对于主机的2181的访问，这其实是DOCKER网络为服务开启的iptables规则，而非我们自动配置的，我们可以通查看DOCKER链的规则找到答案：

```shell
> iptables -nL --line-numbers

Chain DOCKER (6 references)
num  target     prot opt source               destination
1    ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0           tcp dpt:6379
2    ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:2181
3    ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:2181 ctstate NEW,UNTRACKED
4    ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0          tcp dpt:9091
5    ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0           tcp dpt:443
6    ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0           tcp dpt:80
...
```

故我们只是增加两条访问的规则，和一条丢弃所有的规则，并不能实现最后只允许指定ip地址访问的目的，因为在规则链的底部仍然存在这两条ACCEPT的规则（允许所有流量）的规则。

所以，我们的执行策略应该是：

1. 第一步：首先删除掉当前DOCKER链中对于2181的配置规则

这里有一个坑点：我们在上面看到了规则的行号分别为3和4，正常逻辑就是：

```shll
iptabels -D DOCKER 3
iptabels -D DOCKER 4
```

这时候，你再执行`iptables -nL --line-numbers`你会惊奇地发现： `ACCEPT tcp  --  0.0.0.0/0 0.0.0.0/0  tcp dpt:2181 ctstate NEW,UNTRACKED`这条规则依旧存在，这是由于当我们删除规则的时候，下面的规则会自动上移，故其实当我们执行`iptabels -D DOCKER 4`的时候，其实删除的是下面的`ACCEPT tcp  --  0.0.0.0/0  0.0.0.0/0 tcp dpt:9091`，然后你会发现，该服务可能都会受影响没法访问了（就问你坑不坑吧！！！）

故正确的执行命令应该是：

```shell
iptabels -D DOCKER 3
iptabels -D DOCKER 3
```

2. 第二步，配置访问和丢弃规则，这里，我们先配置DROP，再配置ACCEPT，故我们需要使用`-I`一直添加到规则的首部：

```shell
iptables -I DOCKER -s 0.0.0.0/0 -p tcp --dport 2181 -j DROP
iptables -I DOCKER -s 192.168.0.1 -p tcp --dport 2181 -j ACCEPT
iptables -I DOCKER -s 192.168.0.2 -p tcp --dport 2181 -j ACCEPT
```

其中：

- [-p 全称 --procotol]

最后，我们再查看2181的iptables规则，就如下所示：

```shell
ACCEPT     tcp  --  192.168.0.1          0.0.0.0/0            tcp dpt:2181
ACCEPT     tcp  --  192.168.0.2          0.0.0.0/0            tcp dpt:2181
DROP       tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:2181
```

此时我们就实现了指定ip访问DOKCER服务的2181端口的白名单限制了。

