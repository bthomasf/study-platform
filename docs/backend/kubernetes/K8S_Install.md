---
title: kubernetes安装
---

## 二进制安装

暂无

## Kubeadm安装

kubeadm是官方社区推出的一个用于快速部署kubernetes集群的工具。这个工具能通过两条指令完成一个kubernetes集群的部署

```shell
# 创建一个 Master 节点
kubeadm init

# 将一个 Node 节点加入到当前集群中
kubeadm join <Master节点的IP和端口>
```

### 1、准备工作

- 准备至少2台服务器，配置（CPU核心数>=2，内存>=2G，硬盘>=30GB）
- 操作系统初始化：关闭防火墙，关闭selinux，关闭swap

其中：

#### **禁用iptable和firewalld服务**

kubernetes和docker 在运行的中会产生大量的iptables规则，为了不让系统规则跟它们混淆，直接关闭系统的规则

```shell
# 关闭防火墙
systemctl stop firewalld

# 禁用 firewalld 服务
systemctl disable firewalld
```

#### **禁用selinux**

selinux是linux系统下的一个安全服务，如果不关闭它，在安装集群中会产生各种各样的奇葩问题

```shell
# 临时关闭【立即生效】
setenforce 0

# 永久关闭【重启生效】
sed -i 's/SELINUX=enforcing/\SELINUX=disabled/' /etc/selinux/config
```

#### **禁用swap分区**:

swap分区指的是虚拟内存分区，它的作用是物理内存使用完，之后将磁盘空间虚拟成内存来使用，启用swap设备会对系统的性能产生非常负面的影响，

因此kubernetes要求每个节点都要禁用swap设备，但是如果因为某些原因确实不能关闭swap分区，就需要在集群安装过程中通过明确的参数进行配置说明

```shell
# 临时关闭【立即生效】
swapoff -a

# 永久关闭【重启生效】
sed -ri 's/.*swap.*/#&/' /etc/fstab
```

#### **主机重命名，添加hosts工作**

```shell
# 主机重命名
# 根据规划设置主机名【master节点上操作】
hostnamectl set-hostname k8s-master
# 根据规划设置主机名【node1节点操作】
hostnamectl set-hostname k8s-node1
# 根据规划设置主机名【node2节点操作】
hostnamectl set-hostname k8s-node2
...
# 主机添加hosts
# 在master添加hosts
cat >> /etc/hosts << EOF
192.168.12.130 k8s-master
192.168.12.131 k8s-node1
192.168.12.132 k8s-node2
EOF
```

#### **配置时间同步**

```shell
yum install ntpdate -y
ntpdate cn.pool.ntp.org
crontab -e
* */1 * * * /usr/sbin/ntpdate cn.pool.ntp.org
service crond restart
```

#### **安装基础软件包**

```shell
yum install -y device-mapper-persistent-data lvm2 wget net-tools nfs-utils lrzsz gcc gcc-c++ make cmake libxml2-devel openssl-devel curl curl- devel unzip sudo ntp libaio-devel wget vim ncurses-devel autoconf automake zlib-devel python-devel epel-release openssh-server socat ipvsadm conntrack telnet ipvsadm
```

#### **安装docker**：方便拉取和build镜像

直接使用deploy_cloud项目中的安装docker脚本进行安装处理，并修改docker的配置文件：

`vi /etc/docker/daemon.json`

```shell
{
		"registry-mirrors":["https://lmy14a53.mirror.aliyuncs.com","https://registry.docker-cn.com","https://docker.mirrors.ustc.edu.cn","https://dockerhub.azk8s.cn","http://hub-mirror.c.163.com"]
    "data-root": "/netease/lib/docker"
}
```

#### **安装containerd运行时（k8s-1.24版本开始放弃使用docker）**

```shell
# 安装containerd
yum install containerd.io-1.6.6 -y
# 生成containerd配置文件
mkdir -p /etc/containerd
containerd config default > /etc/containerd/config.toml
# 修改配置文件 /etc/containerd/config.toml
SystemdCgroup = false ==> SystemdCgroup = true
sandbox_image = "k8s.gcr.io/pause:3.6" ==> sandbox_image="registry.aliyuncs.com/google_containers/pause:3.7"
# 配置containerd开机启动
systemctl enable containerd --now

# 修改/etc/crictl.yaml文件
cat > /etc/crictl.yaml <<EOF
runtime-endpoint: unix:///run/containerd/containerd.sock
image-endpoint: unix:///run/containerd/containerd.sock
timeout: 10
debug: false
EOF
# 重启containerd
systemctl restart containerd

# 配置containerd镜像加速器
vim /etc/containerd/config.toml
找到 config_path = ""，修改成如下目录： config_path = "/etc/containerd/certs.d"
# 创建目录，写入内容
mkdir /etc/containerd/certs.d/docker.io/ -p
vim /etc/containerd/certs.d/docker.io/hosts.toml 
[host."https://lmy14a53.mirror.aliyuncs.com",host."https://registry.docker-cn.com"] capabilities = ["pull"]
# 重启containerd
systemctl restart containerd
```

#### 将桥接的IPv4流量传递到iptables的链

```shell
cat > /etc/sysctl.d/k8s.conf << EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF

# 生效
sysctl --system 
```

#### 内核模块开机挂载ipvs

```shell
cat <<EOF | sudo tee /etc/modules-load.d/ipvs.conf
ip_vs
ip_vs_rr
ip_vs_wrr
ip_vs_sh
nf_conntrack
EOF
# 加载内核模块到当前的内核
sudo modprobe ip_vs
sudo modprobe ip_vs_rr
sudo modprobe ip_vs_wrr
sudo modprobe ip_vs_sh
sudo modprobe nf_conntrack
```

**查看是否ipvs加载**：

```shell
lsmod |grep -e ip_vs -e nf_conntrack
```

### 2、正式安装

#### 配置安装 k8s 组件需要的阿里云的repo源

```shell
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
```

#### 安装kubelet kubeadm kubectl

```shell
yum makecache
# 安装kubelet kubeadm kubectl
yum install -y --nogpgcheck kubelet kubeadm kubectl
# 查看kubelet版本
yum list kubelet --showduplicates | sort -r |grep 1.28
```

#### 使用kubeadm安装kuberetes

```shell
# 查看镜像列表
kubeadm config images list --image-repository registry.aliyuncs.com/google_containers --kubernetes-version=v1.28.2
# 拉取kubernets所需的镜像 
kubeadm config images pull --image-repository registry.aliyuncs.com/google_containers --kubernetes-version=v1.28.2 --cri-socket=unix:///run/containerd/containerd.sock

其中，--cri-socket指定了运行时接口的套接字，这里我们使用的是containerd,故制定了containerd的套接字路径（/run/containerd/containerd.sock）
```

#### 主节点初始化

```shell
kubeadm init --kubernetes-version=v1.28.2  --image-repository registry.aliyuncs.com/google_containers --cri-socket=unix:///run/containerd/containerd.sock
```

初始化成功输出提示信息：

```shell
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 192.168.2.48:6443 --token bc9npq.wi1l2hfqun9zp8u5 \
	--discovery-token-ca-cert-hash sha256:0ad7500cb4e8926965fe4f7e0c0ab5d24f53279bf5e4a31ae5befdcd730fd78b
```

此时我们可以通过join命令将node节点添加到master节点上去：

```shell
kubeadm join 192.168.2.48:6443 --token bc9npq.wi1l2hfqun9zp8u5 \
	--discovery-token-ca-cert-hash sha256:0ad7500cb4e8926965fe4f7e0c0ab5d24f53279bf5e4a31ae5befdcd730fd78b
```

默认token有效期为24小时，当过期之后，该token就不可用了。这时就需要重新创建token，操作如下：

```shell
kubeadm token create --print-join-command
```

此时我们在主节点上使用kubectl查看一下kubernetes的节点状态：

```shell
kubectl get nodes

NAME         STATUS     ROLES           AGE     VERSION
k8s-master   NotReady   control-plane   8m25s   v1.28.2
k8s-node1    NotReady   <none>          3m57s   v1.28.2
```

然后我们查看一下`kube-system`的命令空间节点状态：

```shell
NAME                                 READY   STATUS    RESTARTS   AGE
coredns-66f779496c-hlm4k             0/1     Pending   0          8m55s
coredns-66f779496c-hpqvj             0/1     Pending   0          8m55s
etcd-k8s-master                      1/1     Running   0          8m59s
kube-apiserver-k8s-master            1/1     Running   0          8m59s
kube-controller-manager-k8s-master   1/1     Running   0          8m59s
kube-proxy-q5xmj                     1/1     Running   0          4m35s
kube-proxy-sq2zn                     1/1     Running   0          8m55s
kube-scheduler-k8s-master            1/1     Running   0          8m59s
```

此时发现是coredns这个pod在pending，此时我们部署CNI网络插件，来进行联网访问：

这里存在两个网络插件：flannel和calico

```shell
# flannel 
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml

# calico
curl https://raw.githubusercontent.com/projectcalico/calico/v3.26.4/manifests/calico.yaml -O 
kubectl apply -f calico.yaml
```

请注意： 

- calico默认POD网络：192.168.0.0/16，若集群pod网络不是192.168.0.0/16则需要修改calico.yaml文件的默认地址

- flannel默认的pod网络为10.244.0.0/16

这里我们使用的是calico网络插件，执行以后，再分别查看node和kube-system命名空间的状态，可得：

```shell
> kubectl get node
NAME         STATUS   ROLES           AGE    VERSION
k8s-master   Ready    control-plane   121m   v1.28.2
k8s-node1    Ready    <none>          117m   v1.28.2

> kubectl get pod -n kube-system
NAME                                       READY   STATUS    RESTARTS   AGE
calico-kube-controllers-7c968b5878-w5zgn   1/1     Running   0          8m57s
calico-node-frzt9                          1/1     Running   0          8m57s
calico-node-tj8vz                          1/1     Running   0          8m57s
coredns-66f779496c-hlm4k                   1/1     Running   0          124m
coredns-66f779496c-hpqvj                   1/1     Running   0          124m
etcd-k8s-master                            1/1     Running   0          124m
kube-apiserver-k8s-master                  1/1     Running   0          124m
kube-controller-manager-k8s-master         1/1     Running   0          124m
kube-proxy-q5xmj                           1/1     Running   0          120m
kube-proxy-sq2zn                           1/1     Running   0          124m
kube-scheduler-k8s-master                  1/1     Running   0          124m
```

此时通过kubeadm搭建一个简单的一主一工作节点的Kubenetes集群成功。这里顺便简单介绍一下我们安装kubernetes这些必备工具的作用：

**kube-apiserver**:

- 作用：它是 Kubernetes API 服务器，是集群的控制面，所有的操作和通信都是通过它进行的。

**kube-controller-manager**:

- 作用：它运行控制器进程，这些控制器是集群的后台线程，处理常规任务。例如，当副本数量不足时，副本控制器会负责启动新的 Pod。

**kube-scheduler**:

- 作用：负责调度 Pod 到集群中的节点上，它选择最合适的节点来运行未调度的 Pod。

**kube-proxy**:

- 作用：运行在每个节点上，维护节点网络规则并实现服务的 IP 虚拟化。

**etcd**:

- 作用：它是一个键值存储，用于保存所有集群数据，是 Kubernetes 集群的后台数据库。

**coredns** (或 kube-dns):

- 作用：提供 DNS 服务给集群内部的服务发现。

**kubectl**:

- 作用：虽然 `kubectl` 不是一个 Pod，但它是一个命令行工具，用于与集群交互和管理资源。

除了这些核心组件，根据你的集群安装方式和配置，可能还会见到以下一些系统组件的 Pods：

**Container Network Interface (CNI)** 插件的 Pods（如 **Calico, Flannel, Weave** 等）：负责配置节点间的网络，以使得 Pod 间可以通信。

**Ingress controller** Pods（如 Nginx-Ingress, Traefik 等）：负责处理入站连接并将流量路由到集群内的服务。

**Storage provisioner** Pods（如 Local Persistent Volume Provisioner）：负责自动创建存储资源，供集群使用。

**Metrics Server** 或其他监控工具的 Pods：用于收集节点和 Pod 的资源使用情况。

参考安装博客：

https://developer.aliyun.com/article/1401364

https://lixx.cn/archives/1702371695143

https://blog.csdn.net/weixin_58140255/article/details/129837297