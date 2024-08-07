---
title: 图算法
---

## 1. 图的概念:

图是一种数据结构，其中结点可以具有零个或多个相邻元素。两个结点之间的连接称为边。 结点也可以称为顶点。如图：

![](/img/algorithm/common/map/21.png)



![](/img/algorithm/common/map/24.png)

## 2. 图的表示方式:

### 第一种表示方式:二维数组表示(邻接矩阵):

![](/img/algorithm/common/map/25.png)

### 第二种表示方式:链表表示(邻接表):

![](/img/algorithm/common/map/26.png)

**注意:**

* 我们一般在算法题中采用**邻接矩阵的形式**存储图的顶点,边的信息

## 3. 图的实现:

我们这里使用邻接矩阵创建一个简单的图,里面包括图的一些基本的API:

* 插入一个顶点的方法
* 添加一条边的方法
* 获取两个顶点之间的权值的方法
* 获取边的个数的方法
* 图的邻接矩阵的显示输出打印的方法
* 获取顶点的个数方法

```java
public class Graph {
    //定义图的几个内部属性:
    private List<Integer> vertexList; //存储顶点的集合(这里的顶点为int类型: 顶点0,顶点1,...)
    private int[][] edges; //用来保存图对应的邻接矩阵
    private int edgeOfNums; //记录边的条数
    
    /*
    * 传入参数n : 表示图的顶点的个数
    * */
    public Graph(int n) {
        this.vertexList = new ArrayList<Integer>(n);
        this.edges = new int[n][n];
        edgeOfNums = 0;
    }
    
    //添加顶点的API
    public void addVertex(Integer vertex) {
        vertexList.add(vertex);
    }
    
    //添加边的方法: 参数1: 顶点1 参数2: 顶点2 参数3 : 顶点1和顶点2之间的权值
    public void insertEdge(int v1,int v2,int weight) {
        //注意: 我们这里定义的图为无向图,所以添加的是两条边
        edges[v1][v2] = weight;
        edges[v2][v1] = weight;
        edgeOfNums++;
    }
    
    //获取两个图之间的权值
    public int getWeight(int v1,int v2) {
        return edges[v1][v2];
    }
    
    //获取图的边的条数
    public int getEdgeOfNums() {
        return edgeOfNums;
    }
    
    //图的邻接矩阵的输出打印方法
    public void showGraph() {
        for (int[] edge : edges) {
            System.out.println(Arrays.toString(edge));
        }
    }
    
    //获取顶点的个数
    public int getVertexNum() {
        return vertexList.size();
    }
}
```

**上面的无向图的测试如下所示:**

```java
public static void main(String[] args) {
    Graph graph = new Graph(5);
    graph.addVertex(0);
    graph.addVertex(1);
    graph.addVertex(2);
    graph.addVertex(3);
    graph.addVertex(4);
    graph.insertEdge(0,1,3);
    graph.insertEdge(1,2,4);
    graph.insertEdge(2,3,5);
    graph.insertEdge(3,4,6);
    System.out.println("无向图的邻接矩阵打印如下:");
    graph.showGraph();
    System.out.println("无向图的边的条数为: " + graph.getEdgeOfNums());
    System.out.println("无向图的边的顶点个数为: " + graph.getVertexNum());
}

测试结果:
无向图的邻接矩阵打印如下:
[0, 3, 0, 0, 0]
[3, 0, 4, 0, 0]
[0, 4, 0, 5, 0]
[0, 0, 5, 0, 6]
[0, 0, 0, 6, 0]
无向图的边的条数为: 4
无向图的边的顶点个数为: 5
```

## 4. 图的两种遍历方式(面试热点)----即图的DFS遍历和BFS遍历

##### 基础框架

DFS: Depth First Search 深度优先搜索，简称深搜
BFS：Breadth First Search 广度优先搜索，简称广搜

##### DFS算法框架

```java
def dfs(n){                         //可以描述阶段的状态
	if(valid) {收集结果，返回}	        //出口条件
	if(pruning) return;             //剪枝，这一步是为了加快回溯过程，降低程序执行时间
	for(i:1~p){                      //选择该阶段的所有决策
		选择可行决策;                   //剪枝的一种 
		add;						  //标记已访问该点
		DFS(n+1);                     //进入下一阶段
		recover;                      //回溯还原
	}
}
```

##### BFS算法框架

```java
def bfs(){
    q.push(head);//一般为q这种优先队列来处理bfs问题
    while(!q.empty()){
        temp=q.front;//弹出元素
        q.pop(); 
        if(temp为目标状态)	输出解 
        if(temp不合法)		continue;
        if(temp合法)		q.push(temp+Δ);
    }
}
```

一般也会设置一些visit[] 来记录元素访问与否，做剪枝操作.
举个例子，假如你在学校操场，老师叫你去国旗那集合，你会怎么走？ 假设你是瞎子，你看不到周围，那如果你运气差，那你可能需要把整个操场走完才能找到国旗。这便是盲目式搜索，即使知道目标地点，你可能也要走完整个地图。 假设你眼睛没问题，你看得到国旗，那我们只需要向着国旗的方向走就行了，我们不会傻到往国旗相反反向走，那没有意义。 这种有目的的走法，便被称为启发式的

左图为BFS,右图为DFS:

![](/img/algorithm/common/map/bfs.gif)

### 图的DFS实现:

#### 图的DFS思想

我们从一个顶点一直往深处进行搜索遍历,走到不能再往下走以后,我们就回退到上一步,直到找到解或者将所有顶点走完

#### 图的DFS算法步骤

* 第一步: 我们访问起始顶点
* 第二步: 若当前访问顶点的邻接顶点有未访问的顶点,我们就任选一个进行访问.如果不存在未访问的邻接顶点,我们就回退到最近访问的顶点,直到与起始顶点想通的所有顶点全部访问完
* 第三步: 若途中还有顶点未被访问(说明这个图不是整体连通的,即为非连通图),则我们再选择一个顶点作为起始顶点,重复步骤2

```java
//方式1: 使用递归实现
public class DFS_Test {
    public static void main(String[] args) {
        //定义一个图结构: 1:表示连通,0:表示不连通
        int[][] graph = {
                { 0, 1, 1, 0, 0 },
                { 0, 0, 1, 0, 1 },
                { 0, 0, 0, 0, 0 },
                { 1, 1, 0, 0, 1 },
                { 0, 0, 1, 0, 0 }
        };
        //使用递归法进行图的DFS遍历
        DFSRecursion(graph);

    }

    private static void DFSRecursion(int[][] graph) {
        //获取顶点的个数,即为graph的长度
        int vertex_nums = graph.length;
        //定义一个访问数组: true[该顶点已被访问] fasle[该顶点未被访问]
        boolean[] visited = new boolean[vertex_nums];
        //为了防止该图不是连通图,我们在整个dfs遍历外加了一个for循环,如果是连通图则不需要!
        for (int i = 0; i < vertex_nums; i++) {
            if (!visited[i]) {
                dfs(graph,i,visited);
            }
        }
    }

    private static void dfs(int[][] graph, int vertex, boolean[] visited) {
        //第一步: 将该顶点标记为已访问
        visited[vertex] = true;
        //输出打印该顶点信息
        System.out.print(vertex + "-->");
        int n = graph.length;
        for (int i = 0; i < n; i++) {
            //找到与vertex相邻的未被访问的顶点,进行dfs递归访问
            if (!visited[i] && graph[vertex][i] == 1) {
                dfs(graph,i,visited);
            }
        }
    }
}
```

```java
//方式2:使用栈实现
public class DFS_Test1 {
    public static void main(String[] args) {
        int[][] graph = {
                { 0, 1, 1, 0, 0 },
                { 0, 0, 1, 0, 1 },
                { 0, 0, 0, 0, 0 },
                { 1, 1, 0, 0, 1 },
                { 0, 0, 1, 0, 0 }
        };
        //使用栈实现图的DFS遍历
        DFSByStack(graph);
    }

    private static void DFSByStack(int[][] graph) {
        //首先我们需要定义一个栈结构
        Stack<Integer> stack = new Stack<>();
        int vertex_num = graph.length;
        boolean[] visited = new boolean[vertex_num];
        //同理这里的for循环是为了防止该图不是连通图
        for (int i = 0; i < vertex_num; i++) {
            if (!visited[i]) {
                stack.push(i);
                visited[i] = true;
                //定义一个变量
                boolean hasNext;
                System.out.print(i + "-->");
                while (!stack.empty()) {
                    //获取栈顶元素
                    int vertex= stack.peek();
                    //hasNext表示是否有新的顶点入栈,没有就弹出栈顶元素,有的话进行下一次循环
                    hasNext = false;
                    for (int j = 0; j < vertex_num; j++) {
                        if (!visited[j] && graph[vertex][j] == 1) {
                            stack.push(j);
                            visited[j] = true;
                            hasNext = true;
                            System.out.print(j + "-->");
                            break;
                        }
                    }
                    //如果没有下一个顶点,就回溯,将栈顶元素删除
                    if (!hasNext) {
                        stack.pop();
                    }
                }
            }
        }
    }
}
```

### 图的BFS实现:

#### 图的BFS思想:

从某一个顶点开始遍历,将其的邻接顶点遍历完,然后再任选一个邻接点,把与之邻接的未被遍历完的顶点走完,如此反复直到遍历完所有的顶点结束.

#### 图的BFS算法步骤:

* 第一步: 访问指定的起始顶点
* 第二步: 访问当前顶点的邻接顶点有未被访问的顶点,并将其放在队列中
* 第三步: 删除队列的首节点,访问当前队列的队首顶点,重复步骤二,直到队列为空
* 若途中还有顶点未被访问,则再任意选择一个未被访问的顶点作为起始顶点,重复步骤二(主要是针对图是非连通图)

```java
public class BFS_Test {
    public static void main(String[] args) {
        int[][] graph = {
                { 0, 1, 0, 1, 0 },
                { 0, 0, 1, 0, 1 },
                { 0, 0, 0, 0, 0 },
                { 1, 1, 0, 0, 1 },
                { 0, 0, 1, 0, 0 }
        };
        BFSByQueue(graph);
    }

    //使用队列实现BFS
    private static void BFSByQueue(int[][] graph) {
        //定义一个队列
        Queue<Integer> queue = new LinkedList<>();
        int n = graph.length;
        boolean[] visited = new boolean[n];

        //为了预防不是连通图,我们定义一个for循环,如果该图是连通图的话则不需要for循环
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                //将该顶点入队列
                queue.add(i);
                visited[i] = true;
                System.out.print(i + "-->");
                while (queue.size() != 0) {
                    //从队列头部弹出顶点
                    int vertex = queue.poll();
                    //遍历所有与vertex相邻的点，依次加入队列中，并遍历他们
                    for (int j = 0; j < n; j++) {
                        if (!visited[j] && graph[vertex][j] == 1) {
                            queue.add(j);
                            visited[j] = true;
                            System.out.print(j + "-->");
                        }
                    }
                }
            }
        }

    }
}
```

## 5. 关于图的常见的算法1(DIjkstra算法)

### 图的常见问题(最短路径问题)

最短路径问题: 描述的是存在以下顶点和每一个顶点和其他顶点之间的距离,要求我们求出某一个顶点(原点)到达另一个顶点(终点)的最短路径,即原点存在很多路径到达终点,但是肯定存在一条路径,使得沿着这条路径的权值总和最小.

### DIjkstra算法介绍

迪杰斯特拉算法是由荷兰计算机科学家狄克斯特拉于1959 年提出的，因此又叫Dijkstra算法。**是从一个顶点到其余各顶点的最短路径算法，解决的是有权图中最短路径问题**。

迪杰斯特拉算法主要特点是以起始点为中心向外层层扩展，直到扩展到终点为止。迪杰斯特拉算法采用的是**贪心策略**，将Graph中的节点集分为最短路径计算完成的节点集S和未计算完成的节点集T，每次将从T中挑选V0->Vt最小的节点Vt加入S，并更新V0经由Vt到T中剩余节点的更短距离，直到T中的节点全部加入S中，它贪心就贪心在每次都选择一个距离源点最近的节点加入最短路径节点集合。

迪杰斯特拉算法只支持**非负权图**，它计算的是单源最短路径，即单个源点到剩余节点的最短路径，**时间复杂度为O(n²)**.

### 最短路径问题

在以下有向图G=(V,E)中,假设每条边的长度为w[i],求出顶点V0到其他各个顶点的最短距离

![](/img/algorithm/common/map/有向图最短路径问题.png)

我们采取的策略是**贪心思想**:,思路图解如下图所示:

**第一步: 标记顶点0位原点,设置其已被访问**

![](/img/algorithm/common/map/1.png)

**第二步: 找到顶点0到顶点3的路径距离最短,将顶点3标记为已访问,并同步更新此时顶点0到其他顶点的距离;**

![](/img/algorithm/common/map/2.png)

**第三步:此时找到顶点0到顶点1的路径最短,将顶点1标记为已访问,并同步更新此时顶点0到其他顶点的路径**

![](/img/algorithm/common/map/3.png)

**重复上面的步骤:第四步**

![](/img/algorithm/common/map/4.png)

**第五步:**

![](/img/algorithm/common/map/5.png)

**第六步:**

![](/img/algorithm/common/map/6.png)

**第七步:**

![](/img/algorithm/common/map/7.png)

**第八步: 此时所有的顶点已经都被访问,原点到其他顶点的最短路径距离已经求出,算法结束**

![](/img/algorithm/common/map/8.png)



### 代码实现:

```java
public class FindMinPathByDijkstra {
    private static int MaxValue = 10000;
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        //获取顶点的个数和边的条数
        int vertex_num = sc.nextInt();
        int edge_num = sc.nextInt();
        //定义图的邻接矩阵
        int[][] matrix = new int[vertex_num][vertex_num];
        //初始化邻接矩阵:除了本身顶点到本身顶点的距离为0,其他赋值为MaxValue
        for (int i = 0; i < vertex_num; i++) {
            for (int j = i + 1; j < vertex_num; j++) {
                if (matrix[i][j] == 0) {
                    matrix[i][j] = MaxValue;
                    matrix[j][i] = MaxValue;
                }
            }
        }
        //输出每条边的信息
        for (int i = 0; i < edge_num; i++) {
            System.out.println("请输入第" + (i + 1) + "条起始边: ");
            int source = sc.nextInt();
            System.out.println("请输入第" + (i + 1) + "条目标边: ");
            int target = sc.nextInt();
            System.out.println("输入权值: ");
            int weight = sc.nextInt();
            matrix[source][target] = weight;
        }

        //输入最短路径的原点
        int source = sc.nextInt();
        //使用Dijkstra算法进行该原点到各个顶点之间的最短路径
        dijkstra(matrix,source);
    }

    private static void dijkstra(int[][] matrix, int source) {
        //定义paths数组: 记录原点到达每一个顶点的最短路径
        int[] paths = new int[matrix.length];
        //初始化一下
        for (int i = 0; i < matrix.length; i++) {
            paths[i] = matrix[source][i];
        }
        //定义visited数组: 记录达到该顶点的最短路径是否已经求出: 初始化为false
        boolean[] visited = new boolean[matrix.length];

        //我们初始化原点为已经访问,并且到达自身的最短路径为[已经在前面初始化过了]
        visited[source] = true;

        //我们找到此时原点到其余顶点最短距离
        for (int i = 0; i < matrix.length; i++) {
            //记录最短路径长度和最短路径的顶点
            int min = Integer.MAX_VALUE;
            int index = -1;
            for (int j = 0; j < matrix.length; j++) {
                if (!visited[j] && paths[j] < min) {
                    min = paths[j];
                    index = j;
                }
            }
            //如果找到一条最短路径[source -> j],将其置为已访问
            if (index != -1)
                visited[index] = true;

            //此时更新最短距离
            for (int k = 0; k < matrix.length; k++) {
                if (!visited[k] && min + matrix[index][k] < paths[k]) {
                    //此时更新paths[k]的值
                    paths[k] = min + matrix[index][k];
                }
            }
        }

        //输出打印原点到其他顶点的最短路径距离
        for (int i = 0; i < matrix.length; i++) {
            if (i != source) {
                if (paths[i] == MaxValue) {
                    System.out.println("顶点" + source + "到顶点" + i + "不可达!");
                }else {
                    System.out.println("顶点" + source + "到顶点" + i + "最短路径距离为:" + paths[i]);
                }
            }
        }
    }
}
```

**注意:**

* Dijkstra算法适用于**非负权值的图**,对于权值为负的图不再适用
* Dijkstra算法一般求解**有向无环图**

## 6. 关于图的常见的算法2(Floyd算法)

### Floyd算法介绍:

Floyd算法求解图的最短路径问题是基于**动态规划**的角度,我们从任意顶点i到任意顶点j的最短路径不外乎两种可能:

* 第一种是直接从顶点i到顶点j
* 第二种是顶点i经过若干个顶点到达顶底j

那么我们假设dis(i,j)即为顶点i到顶点j的最短路径的距离,这对于每一个顶点k来说 :

如果我们判断:
$$
dis(i,k) +dis(k,j) < dis(i,j)   是否成立
$$
如果成立,则证明从顶点i到达顶点k,再从顶点k到达顶点j的路径更加地短,我们便设置 :
$$
dis(i,j) = dis(i,k) +dis(k,j) 
$$
这样一来遍历完所有的顶点k,此时dis(i,j)中记录的即为所有顶点i到顶点j的最短路径距离

### Floyd算法思路

* 我们首先从任意一条边开始,所有两点之间的距离即为边的权,如果两点之间没有边相连,则权为无穷大,我们进行这样的初始化工作
* 对于每一对顶点(i,j),我们判断是否存在顶点k,使得顶点i到顶点k,再到顶点j比已知的路径更加地短,如果存在则选择更新它
* Floyd算法的时间复杂度为 : O(n ^ 3)

以下图为例，对Floyd 算法进行演示:

![](/img/algorithm/common/map/Floyd.jpg)

### 代码实现

```java
//这里是基于无向图的实现
public class FindMinPathByFloyd {
    private static int MaxValue = 10000;
    private static int[][] dis;
    public static void main(String[] args) {
        int[][] matrix = {
                {0, 5, 7, MaxValue, MaxValue, MaxValue, 2},
                {5, 0, MaxValue, 9, MaxValue, MaxValue, 3},
                {7, MaxValue, 0, MaxValue, 8, MaxValue, MaxValue},
                {MaxValue, 9, MaxValue, 0, MaxValue, 4, MaxValue},
                {MaxValue, MaxValue, 8, MaxValue, 0, 5, 4},
                {MaxValue, MaxValue, MaxValue, 4, 5, 0, 6},
                {2, 3, MaxValue, MaxValue, 4, 6, 0}
        };
        //使用Dijkstra算法进行各个顶点之间的最短路径
        floyed(matrix);
        show(dis);
    }

    //输出最短路径的方法
    private static void show(int[][] dis) {
        for (int i = 0; i < dis.length; i++) {
            for (int j = 0; j < dis.length; j++) {
                System.out.print("(顶点" + i + "到" + "顶点" + j + "最短路径距离为: " + dis[i][j] + ") ");
            }
            System.out.println();
        }
    }

    private static void floyed(int[][] matrix) {
        //这里为了不改变原有的邻接矩阵的值,我们额外定义一个dis数组: 记录边的信息,可以不定义,直接拿matrix进行操作
        dis = matrix;
        int len = 0;
        for (int k = 0; k < dis.length; k++) { //k为中间的顶点的下标
            for (int i = 0; i < dis.length; i++) { //起始顶点i
                for (int j = 0; j < dis.length; j++) { //目标顶点j
                    len = dis[i][k] + dis[k][j];
                    if (len < dis[i][j]) {
                        dis[i][j] = len; //更新顶点i到顶点j的最短路径距离
                    }
                }
            }
        }
    }
}

输出结果:
(顶点0到顶点0最短路径距离为: 0) (顶点0到顶点1最短路径距离为: 5) (顶点0到顶点2最短路径距离为: 7) (顶点0到顶点3最短路径距离为: 12) (顶点0到顶点4最短路径距离为: 6) (顶点0到顶点5最短路径距离为: 8) (顶点0到顶点6最短路径距离为: 2) 
(顶点1到顶点0最短路径距离为: 5) (顶点1到顶点1最短路径距离为: 0) (顶点1到顶点2最短路径距离为: 12) (顶点1到顶点3最短路径距离为: 9) (顶点1到顶点4最短路径距离为: 7) (顶点1到顶点5最短路径距离为: 9) (顶点1到顶点6最短路径距离为: 3) 
(顶点2到顶点0最短路径距离为: 7) (顶点2到顶点1最短路径距离为: 12) (顶点2到顶点2最短路径距离为: 0) (顶点2到顶点3最短路径距离为: 17) (顶点2到顶点4最短路径距离为: 8) (顶点2到顶点5最短路径距离为: 13) (顶点2到顶点6最短路径距离为: 9) 
(顶点3到顶点0最短路径距离为: 12) (顶点3到顶点1最短路径距离为: 9) (顶点3到顶点2最短路径距离为: 17) (顶点3到顶点3最短路径距离为: 0) (顶点3到顶点4最短路径距离为: 9) (顶点3到顶点5最短路径距离为: 4) (顶点3到顶点6最短路径距离为: 10) 
(顶点4到顶点0最短路径距离为: 6) (顶点4到顶点1最短路径距离为: 7) (顶点4到顶点2最短路径距离为: 8) (顶点4到顶点3最短路径距离为: 9) (顶点4到顶点4最短路径距离为: 0) (顶点4到顶点5最短路径距离为: 5) (顶点4到顶点6最短路径距离为: 4) 
(顶点5到顶点0最短路径距离为: 8) (顶点5到顶点1最短路径距离为: 9) (顶点5到顶点2最短路径距离为: 13) (顶点5到顶点3最短路径距离为: 4) (顶点5到顶点4最短路径距离为: 5) (顶点5到顶点5最短路径距离为: 0) (顶点5到顶点6最短路径距离为: 6) 
(顶点6到顶点0最短路径距离为: 2) (顶点6到顶点1最短路径距离为: 3) (顶点6到顶点2最短路径距离为: 9) (顶点6到顶点3最短路径距离为: 10) (顶点6到顶点4最短路径距离为: 4) (顶点6到顶点5最短路径距离为: 6) (顶点6到顶点6最短路径距离为: 0) 
```

## 7. 关于图的常见的算法3(Prim算法)

### Prim算法介绍

Prim算法主要用于求解**最小生成树问题**

### 何谓最小生成树?

```
给定一个带权值的无向连通图,如何选取一棵生成树,使树上所有边上权值的总和为最小,这叫最小生成树
我们说:存在N个顶点，最少一定有N-1条边,包含全部顶点,并且使得这N-1条边都在图中,最终这N - 1条边的权值之和最小!
```

### Prim算法生成最小生成树的思想

```
普利姆(Prim)算法求最小生成树，也就是在包含n个顶点的连通图中，找出只有(n-1)条边包含所有n个顶点的连通子图，也就是所谓的极小连通子图
设G=(V,E)是连通网，T=(U,D)是最小生成树，V,U是顶点集合，E,D是边的集合 
第1步: 若从顶点u开始构造最小生成树，则从集合V中取出顶点u放入集合U中，标记顶点v的visited[u]=true
第2步: 集合U中顶点ui与集合V-U中的顶点vj之间存在边，则寻找这些边中权值最小的边，但不能构成回路，将顶点vj加入集合U中，将边（ui,vj）加入集合D中，标记visited[vj] = true
重复步骤2,直到顶点u和顶点v相等,即说明所有的顶点都被标注为访问过,此时D中存在n - 1条边
```

### 最小生成树的实际问题: 修路问题

![](/img/algorithm/common/map/41.png)

```
 胜利乡有7个村庄(A, B, C, D, E, F, G) ，现在需要修路把7个村庄连通各个村庄的距离用边线表示(权值)，比如 A – B 距离 5公里,一共存在十条边
 问：如何修路保证各个村庄都能连通，并且总的修建公路总里程最短?
```

### 代码实现

```java
public class FindMinCreatedTreeByPrim {
    private static int MaxValue = 10000; //定义MaxValue表示两个顶点之间不连通
    private static int[][] weight; //接收邻接矩阵信息
    private static int n; //顶点的个数
    private static char[] vertexs = {'A','B','C','D','E','F','G'};  //初始化顶点
    public static void main(String[] args) {
        //获取顶点的个数
        n = vertexs.length;
        //输入已知的边的信息
        int[][] matrix = {
                {MaxValue,5,7,MaxValue,MaxValue,MaxValue,2},
                {5,MaxValue,MaxValue,9,MaxValue,MaxValue,3},
                {7,MaxValue,MaxValue,MaxValue,8,MaxValue,MaxValue},
                {MaxValue,9,MaxValue,MaxValue,MaxValue,4,MaxValue},
                {MaxValue,MaxValue,8,MaxValue,MaxValue,5,4},
                {MaxValue,MaxValue,MaxValue,4,5,MaxValue,6},
                {2,3,MaxValue,MaxValue,4,6,MaxValue},
        };
        //选择构建最小生成树的起始顶点
        int start = 0;
        System.out.println("7个村庄(A,B,C,D,E,F,G),以顶点" + vertexs[start] +"作为起始顶点构建的最小生成树为 :");
        prim(start,matrix);   
    }

    private static void prim(int start, int[][] matrix) {
        weight = matrix;
        //定义一个访问数组: true表示该顶点已经被访问
        boolean[] visited = new boolean[n];
        //标记当前顶点已被访问
        visited[start] = true;
        //定义两个顶点的下标,以及一个初始权值
        int u = -1;
        int v = -1;
        int minWeight = MaxValue;
        for (int k = 1; k < n; k++) {
            //n个顶点,即存在n - 1条边:故k∈[1,n -1]
            for (int i = 0; i < n; i++) {   //i表示已经被访问的顶点
                for (int j = 0; j < n; j++) {   //j表示未被访问的顶点
                    if (visited[i] && !visited[j] && weight[i][j] < minWeight) {
                        //更新已经访问过的结点和未访问过的结点间的权值最小的边
                        minWeight = weight[i][j];
                        u = i;
                        v = j;
                    }
                }
            }
            //此时找到一条最小的边
            System.out.println("边<" + vertexs[u] + "," + vertexs[v] + "> 权值:" + minWeight);
            //将此前未访问的顶点v标记为已被访问
            visited[v] = true;
            //重新将minWeight更新为初始值
            minWeight = MaxValue;
        }
    }
}
```

输出结果:

```java
7个村庄(A,B,C,D,E,F,G),以顶点A作为起始顶点构建的最小生成树为 :
边<A,G> 权值:2
边<G,B> 权值:3
边<G,E> 权值:4
边<E,F> 权值:5
边<F,D> 权值:4
边<A,C> 权值:7
```

## 8. 关于图的典型常见算法(Kruskal算法)

### 介绍

**克鲁斯卡尔算法(Kruskal)**也是用来求加权连通图的**最小生成树**的算法

基本思想就是在已知的n个顶点,按照权值从小到大的顺序选择n -1边,并保证这n - 1条边不构成回路

### 算法实现步骤

首先我们需要构建含n个顶点的图然后根据权值从小到大从连通图中选择边加入到图中,并使得我们选择的边不构成回路,直到选择n -1边结束

我们观察下面n个顶点构成的连通图,现在从中选择n-1条边,构成一颗连通子图,并使得连通子图中n-1条边权值之和最小:

![](/img/algorithm/common/map/34.png)

我们使用Kruskal算法的步骤如下所示:

![](/img/algorithm/common/map/35.png)

### 实际问题:

我们依旧选择上面的修路问题,使用Kruskal算法进行求解:

```
 胜利乡有7个村庄(A, B, C, D, E, F, G) ，现在需要修路把7个村庄连通各个村庄的距离用边线表示(权值)，比如 A – B 距离 5公里,一共存在十条边
 问：如何修路保证各个村庄都能连通，并且总的修建公路总里程最短?
```

### 算法图解

修路的顶点和以及顶点之间的边的信息如下所示:

![](/img/algorithm/common/map/41.png)

排序以后,权值最小的边为A--G(2)

![](/img/algorithm/common/map/42.png)

然后是B--G(3)

![](/img/algorithm/common/map/43.png)

接着是E--G(4)

![](/img/algorithm/common/map/44.png)

D--F(4)

![](/img/algorithm/common/map/45.png)

此时A--B会形成环,选择E--F(5)

![](/img/algorithm/common/map/46.png)

同理,G--F(6)会形成环路,选择A--C(7),此时边的个数为6 = 顶点个数 - 1,此时构成我们需要的最小生成树

![](/img/algorithm/common/map/47.png)

### 代码实现:

```java
public class FindMinCreatedTreeByKruskal {
    private static int MaxValue = 10000; //定义MaxValue表示两个顶点之间不连通
    private static int[] parent;
    private static int n; //顶点的个数
    private static int edgeNum; //边的条数
    private static char[] vertexs = {'A','B','C','D','E','F','G'};  //初始化顶点
    public static void main(String[] args) {
        //获取顶点的个数
        n = vertexs.length;
        edgeNum = 10; //根据题意,一共存在十条边
        //输入已知的边的信息: 无向图
        int[][] matrix = {
                {MaxValue,5,7,MaxValue,MaxValue,MaxValue,2},
                {5,MaxValue,MaxValue,9,MaxValue,MaxValue,3},
                {7,MaxValue,MaxValue,MaxValue,8,MaxValue,MaxValue},
                {MaxValue,9,MaxValue,MaxValue,MaxValue,4,MaxValue},
                {MaxValue,MaxValue,8,MaxValue,MaxValue,5,4},
                {MaxValue,MaxValue,MaxValue,4,5,MaxValue,6},
                {2,3,MaxValue,MaxValue,4,6,MaxValue},
        };
        //选择构建最小生成树的起始顶点
        Edge[] edges = new Edge[edgeNum];
        int index = 0;
        for (int j = 0; j < matrix.length; j++) {
            for (int i = 0; i <= j; i++) {
                if (matrix[i][j] != MaxValue) {
                    edges[index++] = new Edge(i,j,matrix[i][j]);
                }
            }
        }
        //通过Kruskal算法获取最小生成树
        List<Edge> minTree =  kruskal(n,edges);
        System.out.println("7个村庄(A,B,C,D,E,F,G),使用Kruskal算法构建的最小生成树为 :");
        for (Edge edge : minTree) {
            System.out.println(vertexs[edge.start] + "-->" + vertexs[edge.end] + ": " + edge.weight);
        }

    }

    //获取最下生成树的方法
    private static List<Edge> kruskal(int n, Edge[] edges) {
        //首先定义一个结果集
        List<Edge> ans = new ArrayList<>();
        //我们使用并查集 + 归并排序的思想来实现Kruskal算法
        parent = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
        //首先我们使用归并排序对edges数组进行排序: 按照权值的大小进行排序
        sortEdges(edges,0,edges.length - 1);
        int cnt = 0;  //定义一个计数器: 总共n个顶点,最小生成树需要n -1条边
        for (int i = 0; i < edges.length; i++) {
            int x = edges[i].start;
            int y = edges[i].end;
            if (!isConnected(x,y)) {
                ans.add(edges[i]);
                union(x,y);
                ++cnt;
            }
            if (cnt == n - 1)
                break;
        }
        return ans;
    }

    //归并排序
    private static void sortEdges(Edge[] edges, int left, int right) {
        if (left < right) {
            int mid = (left + right) / 2;
            //向左递归
            sortEdges(edges,left,mid);
            //向右递归
            sortEdges(edges,mid + 1,right);
            //合并方法
            merge(edges,left,mid,right);
        }
    }

    //合并的方法
    private static void merge(Edge[] edges, int left, int mid, int right) {
        //定义一个临时数组
        Edge[] temp = new Edge[edges.length];
        int index = left;
        int t = left;
        int next = mid + 1;
        while (left <= mid && next <= right) {
            if (edges[left].weight < edges[next].weight) {
                temp[index++] = edges[left++];
            }else {
                temp[index++] = edges[next++];
            }
        }

        while (left <= mid) {
            temp[index++] = edges[left++];
        }
        while (next <= right) {
            temp[index++] = edges[next++];
        }

        //最后将temp数组元素拷贝到edges数组中
        while (t <= right) {
            edges[t] = temp[t];
            ++t;
        }
    }


    //获取根节点的方法
    public static int find(int x) {
        if (x != parent[x]) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    //合并两个节点的方法
    public static void union(int x, int y) {
        int Root_X = find(x);
        int Root_Y = find(y);
        if (Root_X == Root_Y) {
            return;
        }
        parent[Root_X] = parent[Root_Y];
    }

    //判断是否成环的方法
    public static boolean isConnected(int x, int y) {
        int Root_X = find(x);
        int Root_Y = find(y);
        return Root_X == Root_Y;
    }
}


//定义一个边类
class Edge {
    int start;  //起始顶点
    int end;    //结束顶点
    int weight; //权值大小

    public Edge(int start, int end, int weight) {
        this.start = start;
        this.end = end;
        this.weight = weight;
    }
}
```

输出结果:

```java
7个村庄(A,B,C,D,E,F,G),使用Kruskal算法构建的最小生成树为 :
A-->G: 2
B-->G: 3
E-->G: 4
D-->F: 4
E-->F: 5
A-->C: 7
```



