---
title: 递归算法
---

# 1.递归的概念

简单的说,**递归就是方法自己调用自己**,每次调用的时候会传入不同变量

递归有助于编程者解决复杂的问题,同时可以让代码变得更加的简洁

递归需要遵守的一些规则:

* 执行一个方法的时候,就会创建一个新的受保护的独立空间(栈空间),故递归对空间的使用是比较大的
* 方法的局部变量是独立的,不会相互影响

* 如果方法中使用的是引用类型变量(例如:数组,字符串,集合等),则会共享该引用类型的数据

* 递归必须向退出递归的条件逼近,否则就会无限递归下去,出现栈内存溢出,其中提到了两个重要的概念:

  * 一是必须要设置退出递归的条件

  * 二是必须不断地向退出递归的条件靠近
* 当一个方法执行完毕,或者遇到return语句,就会返回,遵守谁调用,就将结果返回给谁,同时当方法执行完毕或者返回时,该方法也就执行完毕


常见的普通的递归问题:例如**汉诺塔问题,迷宫问题,匹配路线问题**等等

# 2.DFS的概念

DFS:全称为**Depth First Search,即深度优先搜索**,是图数据结构的一种搜索方式

它的基本思想如下所示:

假设对于一个图来说,图中的所有顶点均未被访问,则从某一个顶点v出发,首先访问该顶点,然后依次从它的各个未被访问的邻接顶点出发深度优先遍历图,直到图中所有的和v顶点有路径相通的顶点都被访问到

### 图解DFS

假设我们有下面的无向图G1,顶点的存储顺序为{"A","B","C","D","E","F","G"},

![](/img/algorithm/common/recursion/01.jpg)

我们对其进行DFS,从顶点A开始,则遍历结果为:

A-->C-->B-->D-->F-->G--E

```java
第1步：访问A。 
第2步：访问(A的邻接点)C。 
    在第1步访问A之后，接下来应该访问的是A的邻接点，即"C,D,F"中的一个。但在本文的实现中，顶点ABCDEFG是按照顺序存储，C在"D和F"的前面，因此，先访问C。 
第3步：访问(C的邻接点)B。 
    在第2步访问C之后，接下来应该访问C的邻接点，即"B和D"中一个(A已经被访问过，就不算在内)。而由于B在D之前，先访问B。 
第4步：访问(C的邻接点)D。 
    在第3步访问了C的邻接点B之后，B没有未被访问的邻接点；因此，返回到访问C的另一个邻接点D。 
第5步：访问(A的邻接点)F。 
    前面已经访问了A，并且访问完了"A的邻接点B的所有邻接点(包括递归的邻接点在内)"；因此，此时返回到访问A的另一个邻接点F。 
第6步：访问(F的邻接点)G。 
第7步：访问(G的邻接点)E。
因此访问顺序是：A -> C -> B -> D -> F -> G -> E
```

![](/img/algorithm/common/recursion/02.jpg)

总结DFS:

* 1.显然,DFS是一个**递归**的过程
* 2.DFS是一种纵向搜索的过程,即先从起始顶点一直遍历搜索到第一个邻接顶点路径的最后一个顶点,然后再回溯遍历第二个邻接顶点,第三个邻接顶点...的路径.G1即是**A-->C--B;A-->D;A-->F-->G-->E**

# 3.递归问题汇总

### 3.1 迷宫问题(来源于算法课程)

##### 题目描述:

有一个迷宫:用一个二维数组(m * n)定义,其中1:表示墙[不能从这里通过],0:表示通路[可以通过],

![](/img/algorithm/common/recursion/03.png)

判断我们从其中入口A是否可以走通到出口B,以及其中的路线(用2表示其中走的路线);

利用递归进行实现:

1.map表示含有墙壁和路障的地图
2.如果小球能够从[1,1]的位置走到了[m - 2,n - 2]的位置,说明能够走通
3.约定:[ i, j]位置为0表示该点路径没有走过;1表示是墙;2表示该点通路可以走;3表示该点已经走过,但是走不通
4.在走迷宫的时候,我们需要制定一个策略:

策略一:下->右->上->左
策略二:上->右->下->左(改变条件判断的次序即可)

##### 求解步骤:

我们假设m = 8,n = 7,即为八行七列的迷宫,则入口位置为A[1,1],出口位置为B[6,5]

我们定义递归函数findpath(map , i , j )

其中map为迷宫地图二维数组,i为此时行数位置,j为此时的列数位置

我们设置起始条件:i = 1,j = 1,即从A点入口进行递归操作:

* 结束递归的条件:如果此时map[6,5] == 2,即表示到达出口位置,则直接返回true

* 我们判断map[i,j]的值是否为0:

  * 如果为0:表示该坐标尚未走过,我们将其设置为2,表示该点为通路,可以走,然后递归进行上下左右的递归调用
    * 如果走得通,返回true,则表示找到通向出口的路径,则返回true
    * 否则,设置其坐标对应map的值为3,说明该点已经走过,但是走不通,
  * 如果不为0:则表示该坐标为1[障碍],2[通路],3[已经走过,但是走不通],我们直接返回false,表示不通

  

* 最后根据返回值是否为true来判断是否在该迷宫中有入口A点找到一条路径走到出口B点

  * 如果为true,直接遍历map二维数组,其中数字标为2的即为A到B的路线
  * 如果为false,则表示没有找到一条由A点走到B点的路径

代码实现 :

```java
public class MiGong {
  
    public static void main(String[] args) {
        //定义一个map:此处利用二维数组创建
        int[][] map = new int[8][7];//八行七列的迷宫
        //设置墙
        for (int i = 0; i < 7; i++) {
            map[0][i] = 1;
            map[7][i] = 1;
        }
        for (int i = 0; i < 8; i++) {
            map[i][0] = 1;
            map[i][6] = 1;
        }
        //设置路障
        map[3][1] = 1;
        map[3][2] = 1;
        
        //输出地图的情况
        System.out.println("原始的地图为:");
        for (int i = 0; i < map.length; i++) {
            for (int j = 0; j < map[i].length; j++) {
                System.out.print(map[i][j] + " ");
            }
            System.out.println();
        }

        //使用递归回溯进行找路线操作
        //其中,map为地图,1,1为开始找路的坐标位置
        Boolean flag = setWay01(map, 1, 1);
        //Boolean flag = setWay02(map, 1, 1);
		
        //判断是否在迷宫中找到A->B的路线
        if (flag) {
            System.out.println("找到走出迷宫的路线:");
            for (int i = 0; i < map.length; i++) {
                for (int j = 0; j < map[i].length; j++) {
                    System.out.print(map[i][j] + " ");
                }
                System.out.println();
            }
        }else {
            System.out.println("未找到走出迷宫的路线");
        }
    }

    //策略1:下->右->上->左
    //若找到,则返回true,若未找到,则返回false
    private static Boolean setWay01(int[][] map, int i, int j) {
        if (map[6][5] == 2) {
            //表示已经找到终点,2表示该路为通路
            return true;
        }else {
            if (map[i][j] == 0) {//表示当前该点还没有走过
                //则按照定义的策略进行找路
                map[i][j] = 2;//先假设该点为通路
                if (setWay01(map,i + 1,j)){//向下走若能走通
                    return true;
                }else if (setWay01(map,i,j + 1)){//向右走若能走通
                    return true;
                }else if (setWay01(map,i - 1,j)){//向上走若能走通
                    return true;
                }else if (setWay01(map,i,j - 1)){//向左走若能走通
                    return true;
                }else {
                    //若四种方式都无法走通
                    //将map[i][j]设置为3:表示该点已经走过,但是走不通
                    map[i][j] = 3;
                    return false;//返回false该路不通,回溯上一个函数
                }
            }else {//如果该点不为0:为1,2,3
                return false;//表示该路不通
            }
        }
    }

    //策略2:上->右->下->左
    private static Boolean setWay02(int[][] map, int i, int j) {
        if (map[6][5] == 2) {
            //表示已经找到终点,2表示该路为通路
            return true;
        }else {
            if (map[i][j] == 0) {//表示当前该点还没有走过
                //则按照定义的策略进行找路
                map[i][j] = 2;//先假设该点为通路
                if (setWay02(map,i - 1,j)){//向上走若能走通
                    return true;
                }else if (setWay02(map,i,j + 1)){//向右走若能走通
                    return true;
                }else if (setWay02(map,i + 1,j)){//向下走若能走通
                    return true;
                }else if (setWay02(map,i,j - 1)){//向左走若能走通
                    return true;
                }else {
                    //若四种方式都无法走通
                    //将map[i][j]设置为3:表示该点已经走过,但是走不通
                    map[i][j] = 3;
                    return false;//返回false该路不通
                }
            }else {//如果该点不为0:为1,2,3
                return false;//表示该路不通
            }
        }
    }
}
```

### 3.2 匹配路线问题,即单词搜索问题:对应LeetCode的79题

##### 题目描述:

给定一个二维网格和一个单词，找出该单词是否存在于网格中。

单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。

**示例:**

```
board =
[
  ['A','B','C','E'],
  ['S','F','C','S'],
  ['A','D','E','E']
]

给定 word = "ABCCED", 返回 true
给定 word = "SEE", 返回 true
给定 word = "ABCB", 返回 false
```

 

**提示：**

- `board` 和 `word` 中只包含大写和小写英文字母。
- `1 <= board.length <= 200`
- `1 <= board[i].length <= 200`
- `1 <= word.length <= 10^3`

##### 题目分析:

这类递归回溯问题:即类似上面的迷宫问题,区别在于迷宫问题会给予你一个起始位置,但是此处的查看路线是否符合问题,没有定义所谓的起始坐标,我们需要进行所有位置的匹配,然后对所有位置中符合要求的进行递归回溯,最终观察是否满足其要求,若最终按照题设给定的word顺序能够通过上下左右走通的话,即表示该矩阵中确实存在一条包含word字符串所有字符的路径,否则,则不包含word字符串的路径

##### 具体步骤:

(1)首先我们需要定义一个word字符串的匹配计数器k:用来记录word单词在board网格中的匹配数,当连续匹配k等于word的长度,说明找到一条符合的路径,直接返回true

(2)因为我们是可以从任意点开始遍历即可

![](/img/algorithm/common/recursion/4.png)



##### java代码实现:

```java
public class FindPath {
    public static void main(String[] args) {
        char[][] board = {
                {'A','B','C','E'},
                {'S','F','C','S'},
                {'A','D','E','E'}
        };
        String word = "ABCCED";
        FindPath findPath = new FindPath();
        boolean isExist = findPath.exist(board, word);
        if (isExist) {
            System.out.println("矩阵中存在一条包含"  + word + "所有字符的路径");
        }else {
            System.out.println("矩阵中不存在一条包含" + word +"所有字符的路径");
        }

    }

    int m;
    int n;
    int k;
    boolean[][] isVisited;
    public boolean exist(char[][] board, String word) {
        //分别获取矩阵的行，列以及word的长度
        m = board.length;
        n = board[0].length;
        k = word.length() - 1;
        //如果矩阵中的元素和个数小于k，直接返回false
        if (m * n < k) return false;
        isVisited = new boolean[m][n]; //标记该点是否访问过
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                //以任何一点作为起始点
                if (dfs(0,i,j,board,word)) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean dfs(int start, int i, int j, char[][] board, String word) {
        if (i < 0 || i >= m || j < 0 || j >= n || isVisited[i][j] || board[i][j] != word.charAt(start)) {
            return false;
        }

        if (start == k) { //说明完全匹配word
            return true;
        }

        isVisited[i][j] = true;
        boolean flag = dfs(start + 1,i,j + 1,board,word) || dfs(start + 1,i,j - 1,board,word)
                || dfs(start + 1,i + 1,j,board,word) || dfs(start + 1,i - 1,j,board,word);
        isVisited[i][j] = false;
        return flag;
    }
}
```

### 3.3 王子找公主问题(趋势科技笔试题)

##### 问题描述:

在一个地图(board)中,’ . ‘表示可以通行,’ # ‘表示不能通行,王子的位置为S,公主的位置为E,针对输入的数据,判断王子是否可以能够到达公主的位置.
实现1:如果可以输出’‘YES’’,否则输出"NO".

![](/img/algorithm/common/recursion/6.png)

思路也是迷宫类似:

代码实现:

```java
public class FindPrincess {
    public static void main(String[] args) {
        char[][] board = {
                {'.','.','.','S','.'},
                {'.','#','#','#','.'},
                {'#','#','E','.','.'}
        };
        FindPrincess solution = new FindPrincess();
        boolean isExist = solution.findPrincess(board);
        if(isExist) {
         	System.out.println("王子找到了公主");
        }else {
        	System.out.println("王子没有找到公主");
        }
    }

    //查找公主的方法,返回:true(能找到);false(不能找到)
    public boolean findPrincess(char[][] board) {
        //记录王子位置S和公主位置E
        //王子的坐标:i=0;j=3
        //公主的坐标:board[i][j] = 'E';
        Boolean isFind = setWay(board,0,3);
        return isFind;
    }

    //底层调用的核心方法
    private Boolean setWay(char[][] board, int i, int j) {
        //如果越界,或者无法通过,和已经访问,直接返回false
        if (i < 0 || i >= board.length || j < 0 || j >= board[0].length || board[i][j] == '#' ||  board[i][j] == 'Y') {
            return false;
        }
        //如果访问该点为E:即找到了公主
        if (board[i][j] == 'E') {
            //表示找到了公主
            return true;
        }
        //此时剩下只有:'.'(通路),'S'(王子位置)
        char temp = board[i][j];//记录当前的值
        //记录当前的值为已访问
        board[i][j] = 'Y';
        //分别进行向下,向上,向左,向右进行递归找路线的调用
        boolean flag = setWay(board,i - 1,j) || setWay(board,i + 1,j) || setWay(board,i,j - 1) || setWay(board,i,j + 1);
        board[i][j] = temp;   //若此时将boad[i][j] = temp;则开始的地图并未放生变化;否则将会记录王子(S)到公主(E)所有走过的路线的点为'Y'
        return flag;
    }
}
```

### 3.4 N皇后问题[重点! ! !]:对应LeetCode的51,52题

N皇后问题也是由著名的8皇后问题扩展而来,所以我们先来看一下8皇后问题,两者的解题思路完全一致,只是要求的皇后的个数发生了变化而已;

#### 8皇后问题

![](/img/algorithm/common/recursion/7.png)

##### 问题分析：

在8X8的国际象棋上摆放8个皇后，使其不能互相攻击，即：任意两个皇后都不能处于同一行，同一列或者同一斜线上，问有多少种摆放？并输出这些摆法？

使用递归回溯进行求解：

（1）先将第一个皇后摆放在第一行第一列

（2）再将第二个皇后放在第二行第一列，然后判断是否OK？如果不OK，则继续放在第二列，第三列..依次把所有列都摆放完毕，找到一个合适的位置

（3）继续如此摆放第三个皇后，还是第一列，第二列..直到第八个皇后也能放置到一个合适的位置上，则此时算是找到了一个满足条件的解

（4）当得到一个正确的解以后，在栈上回退到上一个栈，就会开始回溯即：得到第一个皇后放到第一个列的所有情况（回溯）

（5）然后回头将第一个皇后放到第二列，第三列..至第八列，循环指向（1）到（4）的步骤，完成所有情况的8皇后摆放

我们定义变量：

**n：表示皇后的个数**

**int[]arrQueen = new int[n] : 表示棋盘**

* 注意 : 这里使用一维数组表示棋盘,其中数组的下标即为棋盘的行数,数组的下标对应的值即为棋牌摆放在该行的位置

![](/img/algorithm/common/recursion/8.png)

##### 代码实现:

```java
	//定义全局变量
    //定义皇后的个数
    int n = 8;
    //定义棋盘:使用一维数组定义:下标为行,下标对应的元素值为列
    int[] arrQueen = new int[n];
    //定义一个计数器:记录摆放的个数
    static int count = 0;
	
	//主函数
    public static void main(String[] args) {
        //进行8皇后的摆放:从第一行开始:因为数组索引从0开始,故第一行为0
        Queen8Problem solution = new Queen8Problem();
        solution.setQueen(0);
        System.out.println("8皇后问题共有: " + count + "种摆法");
    }

    //1.摆放第j个皇后的位置位置的方法
    private void setQueen(int j) {
        //当摆放第n+1个皇后时:表示前n个皇后已经摆放结束[此处n = 8]
        if (j == n) {
            printQueenLocation();
            //返回上一层继续查找别的位置摆放情况
            return;
        }
        for (int i = 0; i < n; i++) {//摆放第j个皇后的位置:从i = 0 到 i = 7进行摆放(即从第一列摆放到第8列)
            arrQueen[j] = i;
            //第j个皇后摆放完毕,然后判断当前位置是否和前j - 1个皇后的位置冲突
            if (judge(j)) {
                //如果不冲突
                setQueen(j + 1);
            }
            //如果冲突,则继续摆放下一个位置,此时继续进行for循环遍历,下一次arrQueen[j] = i + 1;
        }

    }

    //2.输出打印每一种可行的摆法的方法
    private void printQueenLocation() {
        count++;
        for (int i = 0; i < arrQueen.length; i++) {
            System.out.printf("第%d皇后:第%d行,第%d列\t",i+1,i+1,arrQueen[i] + 1);//数组起始索引从0开始
        }
        System.out.println();
    }

    //3.判断第j个皇后位置是否有效的方法
    private boolean judge(int j) {
        for (int i = 0; i < j; i++) {//判断前j - 1个皇后和当前皇后的位置是否发生冲突
            //当其中第i个皇后和第j个皇后发生位置冲突时,即可能出现的情况
            //(1)第i个皇后和第j个皇后出现在同一列:arrQueen[i] == arrQueen[j];
            //(2)第i个皇后和第j个皇后出现在同一斜线上:Math.abs(j - i) == Math.abs(arrQueen[j] – arrQueen[i]);
            if (arrQueen[i] == arrQueen[j] || Math.abs(j - i) == Math.abs(arrQueen[j] - arrQueen[i])) {
                return false;
            }
            //如果可以摆放,继续判断下一个位置
        }
        //for循环结束,如果当前第j个皇后和前j - 1个皇后的位置都不发生冲突,则返回true
        return true;
    }
```

### N皇后问题:对应LeetCode的51题

**n 皇后问题** 研究的是如何将 `n` 个皇后放置在 `n×n` 的棋盘上，并且使皇后彼此之间不能相互攻击。

给你一个整数 `n` ，返回所有不同的 **n 皇后问题** 的解决方案。

每一种解法包含一个不同的 **n 皇后问题** 的棋子放置方案，该方案中 `'Q'` 和 `'.'` 分别代表了皇后和空位。

**示例 1：**

![img](/img/algorithm/common/recursion/9.png)

```
输入：n = 4
输出：[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
解释：如上图所示，4 皇后问题存在两个不同的解法。
```

**示例 2：**

```
输入：n = 1
输出：[["Q"]]
```

**提示：**

- `1 <= n <= 9`
- 皇后彼此不能相互攻击，也就是说：任何两个皇后都不能处于同一条横行、纵行或斜线上。

**分析:你会发现,除了皇后的个数发生了变化,其他的条件都是相同的,解法也和上面相同,相信你现在应该已经有思路了,加油 ! ! 你是最棒的 ! !**

**代码实现:**

```java
public static void main(String[] args) {
        //n自定义设置
        int n = 4;
        NQueenProblem queenProblem = new NQueenProblem();
        List<List<String>> res = queenProblem.solveNQueens(n);
        System.out.println(res.toString());
    }

    //利用递归回溯进行求解
    public List<List<String>> solveNQueens(int n) {
        //定义结果集
        List<List<String>> res = new ArrayList<>();
        //定义一个n X n的棋盘
        int[] arrQueen = new int[n];
        //进行N皇后的摆放
        setQueen(0,arrQueen,res);
        //返回res结果集:其中保存的是N皇后的所有的有效的摆放结果
        return res;
    }
    //递归放置第j个皇后的方法
    private void setQueen(int j, int[] arrQueen, List<List<String>> res) {
        if (j == arrQueen.length) {
            //说明此时已经摆放到第n+1个皇后的位置,故前n个皇后已经摆放完毕,我们将解集保存到当前的结果集中
            List<String> sub = new ArrayList<>();
            for (int i = 0; i < arrQueen.length; i++) {
                StringBuilder builder = new StringBuilder();
                for (int k = 0; k < arrQueen.length; k++) {
                    if (k == arrQueen[i]) {
                        builder.append("Q");
                    }else {
                        builder.append(".");
                    }
                }
                //将当前第i个皇后的放置方法保存到sub中
                sub.add(builder.toString());
            }
            //再将当前的sub子集保存到res结果集中
            res.add(new ArrayList<>(sub));
            //返回上一层
            return;
        }
        //进行第j个皇后的摆放:摆放位置从第1行到第n行
        for (int i = 0; i < arrQueen.length; i++) {
            arrQueen[j] = i;
            //将第j个皇后放置到第i行以后,判断其与之前的j - 1个皇后是否发生冲突
            if (judge(j,arrQueen)) {
                setQueen(j + 1,arrQueen,res);
            }
            //如果位置冲突,则进行摆放在下一列:arrQueen[j] = i + 1;
        }
    }

    //判断第j个皇后和前j - 1个皇后的位置是否冲突(返回第j个位置是否有效:true(有效))
    private boolean judge(int j, int[] arrQueen) {
        for (int i = 0; i < j; i++) {
            //当其中第i个皇后和第j个皇后发生位置冲突时,即可能出现的情况
            //(1)第i个皇后和第j个皇后出现在同一列:arrQueen[i] == arrQueen[j];
            //(2)第i个皇后和第j个皇后出现在同一斜线上:Math.abs(j - i) == Math.abs(arrQueen[j] – arrQueen[i]);
            if (arrQueen[i] == arrQueen[j] || Math.abs(j - i) == Math.abs(arrQueen[j] - arrQueen[i])) {
                return false;
            }
        }
        //for循环遍历结束,如果仍然有效
        return true;
    }
}
```

### N皇后问题II:对应LeetCode的52题

n皇后问题研究的是如何将 n 个皇后放置在 n×n 的棋盘上，并且使皇后彼此之间不能相互攻击。

右图为8 皇后问题的一种解法。

给定一个整数n，返回 n 皇后不同的解决方案的数量。

示例:

```java
输入:4
输出:2
解释:4 皇后问题存在如下两个不同的解法。
[
 [".Q..",  // 解法 1
  "...Q",
  "Q...",
  "..Q."],
 ["..Q.",  // 解法 2
  "Q...",
  "...Q",
  ".Q.."]
]
```

**此时再看此题,是不是觉得十分简单了呢??**

##### 代码实现

```java
int count = 0;
public int totalNQueens(int n) {
    //定义一个棋盘
    int[] arr = new int[n]; //i表示第几行,arr[i]表示摆放的位置
    dfs(0,arr);
    return count;
}

private void dfs(int location, int[] arr) {
    if (location == arr.length) { //说明n个皇后已经全部摆放完毕
        count++;
        return;
    }

    //进行dfs
    for (int i = 0; i < arr.length; i++) {
        arr[location] = i;  //将第i行的皇后摆放在i位置
        if (judge(location,arr)) {   //判断是否和前i - 1个位置冲突
            dfs(location + 1,arr);
        }
        //不匹配,i++,继续判断
    }
}

private boolean judge(int i, int[] arr) {
    //j∈[0,i - 1]
    for (int j = 0; j < i; j++) {
        if (arr[j] == arr[i] || Math.abs(j - i) == Math.abs(arr[j] - arr[i])) {
            return false;
        }
    }
    return true;
}
```

# 4. DFS递归问题汇总

## 4.1组合问题

#### 组合问题1:对应LeetCode的77题[难度:中等]

给定两个整数 ***n* 和 *k***，返回 1 ... *n* 中所有可能的 *k* 个数的组合。

**示例:**

```java
输入: n = 4, k = 2
输出:
[
  [2,4],
  [3,4],
  [2,3],
  [1,2],
  [1,3],
  [1,4],
]
```

这是最典型的dfs递归回溯问题,我们对此题会进行详细的分析,后面出现的dfs递归问题,我们就会将整体思路讲述一下,不再做过于详细的步骤分析:

我们以题目给的示例为例,虽然是数字的组合问题,但是,我们会将其联想到树型问题的深度优先搜索上来,首先我们可以根据题设画出对应的树型结构:

![](/img/algorithm/common/recursion/10.png)

遍历到对应"树的叶子节点",则每一种选择即是一种组合结果,我们只需要当遍历到该"树型"的叶子节点时,将其组合的结果加入结果集即可

我们定义res:作为最后存储每一种可能组合的结果集;sub:存储每一种结果的子集;k:即为题设中给出的需要的k个数的组合.

则我们判断是否到达叶子节点有两种方式:

**方式1**:即判断**此时sub的长度是否等于k**:如果子集的长度为k个说明此时满足要求,则将其加入结果集即可

**方式2**:再每一次添加元素到sub子集,然后进行递归调用的时候,将k的值减1,这样,如果k的值减到0,也同样说明此时sub中存在k个元素,直接将其加入结果集即可

则两种不同方式的代码对应如下所示:其中方式2的代码速度相对于方式1较快一些

```java
	//方式1代码:
	public List<List<Integer>> combine(int n, int k) {
        //定义结果集res和子集sub
        List<List<Integer>> res = new ArrayList<>();
        List<Integer> sub = new ArrayList<>();
        //如果给定n < 1,或者k == 0,则不符合题意,直接返回空的结果集
        if (n < 1 || k == 0)
            return res;
    	//进行dfs递归方法的执行,因为n是从1开始到n,所以dfs的start起始值为1
        dfs(1,n,k,res,sub);
    	//返回结果集
        return res;
    }

    private void dfs(int start, int n, int k, List<List<Integer>> res, List<Integer> sub) {
        //当子集的size等于k个时,将其加入到结果集中
        if (sub.size() == k) {
            res.add(new ArrayList<>(sub));
            //回溯
            return;
        }

        for (int i = start; i <= n; i++) {
            //将当前i值加入到sub子集中
            sub.add(i);
            //进行dfs递归调用,start的值由start --> i + 1
            dfs(i+1,n,k,res,sub);
            //回溯时将sub子集在此层加入的元素再剔除掉,深度优先遍历有回头的过程，因此递归之前做了什么，递归之后需要做相同操作的逆向操作
            sub.remove(sub.size() - 1);
        }
    }

	
	//方式2代码:
	public List<List<Integer>> combine(int n, int k) {
        //定义结果集res和子集sub
        List<List<Integer>> res = new ArrayList<>();
        List<Integer> sub = new ArrayList<>();
        //如果给定n < 1,或者k == 0,则不符合题意,直接返回空的结果集
        if (n < 1 || k == 0)
            return res;
        dfs(1,n,k,res,sub);
        return res;
    }

    private void dfs(int start, int n, int k, List<List<Integer>> res, List<Integer> sub) {
        //当k的值降低为0个时,说明此时sub集合中存在k个值,则将其加入到结果集中
        if (k == 0) {
            res.add(new ArrayList<>(sub));
            //回溯
            return;
        }

        for (int i = start; i <= n; i++) {
            //将对应值加入sub集合中
            sub.add(i);
            //进行dfs递归调用,因为加入一个元素,则将k的个数减1
            dfs(i + 1,n,k - 1,res,sub);
            //回溯时将sub子集在此层加入的元素再剔除掉,即深度优先遍历有回头的过程，因此递归之前做了什么，递归之后需要做相同操作的逆向操作
            sub.remove(sub.size() - 1);
        }
    }
```

### 组合问题2:对应LeetCode的39题

给定一个**无重复元素**的数组 `candidates` 和一个目标数 `target` ，找出 `candidates` 中所有可以使数字和为 `target` 的组合。

`candidates` 中的数字可以无限制重复被选取。

**说明：**

- 所有数字（包括 `target`）都是正整数。
- 解集不能包含重复的组合。 

**示例 1：**

```java
输入：candidates = [2,3,6,7], target = 7,
所求解集为：
[
  [7],
  [2,2,3]
]
```

**示例 2：**

```java
输入：candidates = [2,3,5], target = 8,
所求解集为：
[
  [2,2,2,2],
  [2,3,3],
  [3,5]
]
```

 **提示：**

- `1 <= candidates.length <= 30`
- `1 <= candidates[i] <= 200`
- `candidate` 中的每个元素都是独一无二的。
- `1 <= target <= 500`

##### 题目分析:

首先该题有几个条件我们需要注意一下:

**(1) 数组candidates是无重复元素的**

**(2)candidates数组中的元素可以被重复使用**

**(3)candidates数组中任意几个元素和等于target目标数即可**

该题和上题的组合问题很像,只是限定条件加了几个,我们就需要将其考虑进去进行处理

此题最优的解法是使用dfs递归遍历+剪枝的操作完成,我们先选择和上面类似的普通直接的dfs递归回溯方法进行求解:

首先还是根据示例1的题设条件我们画出对应的树型图和解题过程

![](/img/algorithm/common/recursion/11.png)

因为目标数target = 7,则我们可以将其和上题的k值一样作为dfs递归函数的一个参数,当选择一个数作为组合时,我们将target减去该数值,这样递归下:

* 如果当target减至0,则表示以上的组合方式能够使得其和等于目标数target值
* 如果当target减至小于0,则表示不符合规定,即组合方式的和超过了目标数target值

我们需要注意:

(1)递归结束条件:target < 0或者target == 0

(2)回溯时,之前将元素加入组合子集中,现需要再将其值从组合子集中剔除掉

**(3)因为数组的元素我们可以重复选择,所以在进行dfs递归调用的时候,下一层的start值仍为i,而非i+1**

##### 代码实现:

```java
	public List<List<Integer>> combinationSum1(int[] candidates, int target) {
        if (candidates == null || candidates.length == 0) return new ArrayList<List<Integer>>();
        //定义一个结果集res和保存每一种解法的解集合sub
        List<List<Integer>> res = new ArrayList<>();
        List<Integer> sub = new ArrayList<>();
        //Arrays.sort(candidates);
        //利用dfs搜索法进行求解
        dfs(0,candidates,target,res,sub);
        return res;
    }

    private void dfs(int start, int[] candidates, int target, List<List<Integer>> res, List<Integer> sub) {
        //若此时tartget降至0以下,直接返回上一层
        if (target < 0) {
            return;
        }
        //添加条件:当目标数降至到0时,将sub子集添加到res结果集中
        if (target == 0) {
            res.add(new ArrayList<>(sub));
            //返回上一层
            return;
        }

        for (int i = start; i < candidates.length; i++) {
            //将当前元素加入sub子集中
            sub.add(candidates[i]);
            //递归遍历下一层:注意,由于candidates中的数字可以无限制重复被选取,所以这里递归遍历时,下一轮的start为i,而非i+1,很重要!!!
            dfs(i,candidates,target - candidates[i],res,sub);
            //回溯时,将sub子集中的最后一个元素从sub子集中去除掉
            sub.remove(sub.size() - 1);
        }
    }
```

思考:虽然上面这种实现方式能够完成这道题,但是在效率上还是存在一些瑕疵的,我们知道当选择2,3以后,此时target = 7 - 2 - 3 = 2,如果下一次添加的是6,此时肯定是不满足要求的,所以我们可以将输入的数组进行排序操作,然后进行树型结构搭建,此时,对于后面的不符合要求的子树结构我们进行"剪枝"操作,以示例1为例,刚好题目给的candidates数组已经是排好序的了,故我们画出树型结构,并进行剪枝操作:

![](/img/algorithm/common/recursion/12.png)

##### 代码实现:

```java
	public List<List<Integer>> combinationSum(int[] candidates, int target) {
        if (candidates == null || candidates.length == 0) return new ArrayList<List<Integer>>();
        //定义一个结果集res和保存每一种解法的解集合sub
        List<List<Integer>> res = new ArrayList<>();
        List<Integer> sub = new ArrayList<>();
        Arrays.sort(candidates);
        //利用dfs搜索法进行求解
        dfs(0,candidates,target,res,sub);
        return res;
    }

    private void dfs(int start, int[] candidates, int target, List<List<Integer>> res, List<Integer> sub) {
        //添加条件:当目标数降至到0时,将sub子集添加到res结果集中
        if (target == 0) {
            res.add(new ArrayList<>(sub));
            //返回上一层
            return;
        }

        for (int i = start; i < candidates.length; i++) {
            //如果target此时比当前的candidates[i]:则表示后面的情况全部都不符合,直接结束for循环遍历,即进行"剪枝操作":可以大大提高了代码的速度
            if (target - candidates[i] < 0) {
                break;
            }
            //将当前元素加入sub子集中
            sub.add(candidates[i]);
            //递归遍历下一层:注意,由于candidates中的数字可以无限制重复被选取,所以这里递归遍历时,下一轮的start为i,而非i+1,很重要!!!
            dfs(i,candidates,target - candidates[i],res,sub);
            //回溯时,将sub子集中的最后一个元素从sub子集中去除掉
            sub.remove(sub.size() - 1);
        }
    }
```

### 组合问题3:对应LeetCode的40题

##### 题目描述:

给定一个数组 `candidates` 和一个目标数 `target` ，找出 `candidates` 中所有可以使数字和为 `target` 的组合。

`candidates` 中的每个数字在每个组合中只能使用一次。

**说明：**

- 所有数字（包括目标数）都是正整数。
- 解集不能包含重复的组合。 

**示例 1:**

```java
输入: candidates = [10,1,2,7,6,1,5], target = 8,
所求解集为:
[
  [1, 7],
  [1, 2, 5],
  [2, 6],
  [1, 1, 6]
]
```

**示例 2:**

```java
输入: candidates = [2,5,2,1,2], target = 5,
所求解集为:
[
  [1,2,2],
  [5]
]
```

这道题和上道题的区别在于:

* candidates数组可能存在重复的元素
* candidates数组中的每一个数字在每一个组合中只能使用一次

我们在代码实现中就需要注意以下几点:

(1)因为candidates数组中的每一个数字在每一个组合中只能使用一次,所以dfs递归遍历时target,下一层的start为i+1

(2)因为该题我们采取的仍是"剪枝"的方式,所以我们需要在剪枝的同时,由于重复值的存在,我们需要去除重复组合的现象,而candidates数组我们已经是提前排好序了的,故当dfs内层for循环时,如果此时i > start,并且candidates[i] ==candidates[i - 1],则说明此时两者组合的情况会是相同的:我们避免重复性,直接continue进入下一层循环遍历比较.

##### 代码实现:

```java
	//定义一个结果集res和保存每一种解法的解集合sub
	List<List<Integer>> res = new ArrayList<>();
	public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<Integer> sub = new ArrayList<>();
        Arrays.sort(candidates);
        //利用dfs搜索法进行求解
        dfs(0,candidates,target,sub);
        return res;
    }

    private void dfs(int start, int[] candidates, int target, List<Integer> sub) {
        //添加条件:当目标数降至到0时,将sub子集添加到res结果集中
        if (target == 0) {
            res.add(new ArrayList<>(sub));
            //返回上一层
            return;
        }

        for (int i = start; i < candidates.length; i++) {
            //如果target此时比当前的candidates[i]:则表示后面的情况全部都不符合,直接结束for循环遍历:大大提高了代码的速度
            if (target - candidates[i] < 0) {
                break;
            }
            //若i > start 并且当前值和前一个值相同,说明此时两者组合的情况会是相同的:避免重复性,直接continue进入下一层循环遍历比较
            if (i > start && candidates[i] == candidates[i - 1]) {
                continue;
            }

            //将当前元素加入sub子集中
            sub.add(candidates[i]);
            //递归遍历下一层
            dfs(i+1,candidates,target - candidates[i],sub);
            //回溯时,将sub子集中的最后一个元素从sub子集中去除掉
            sub.remove(sub.size() - 1);
        }
    }
```

**通过这三题的分析,是不是对dfs递归遍历求解复杂问题有了那么一点套路了,下面的题目都是类似这种套路的dfs问题,看看你能不能独立解决这些问题了?加油 ! !**

## 4.2 子集问题

### 子集问题1:对应LeetCode的第78题

给定一组**不含重复元素**的整数数组 *nums*，返回该数组所有可能的子集（幂集）。

**说明：**解集不能包含重复的子集。

**示例:**

```java
输入: nums = [1,2,3]
输出:
[
  [3],
  [1],
  [2],
  [1,2,3],
  [1,3],
  [2,3],
  [1,2],
  []
]
```

##### dfs代码实现:

```java
public class LeetCode78_子集问题I {
    List<List<Integer>> res = new ArrayList<>();  //定义结果集
    public List<List<Integer>> subsets(int[] nums) {
        ArrayList<Integer> sub = new ArrayList<>();
        dfs(0,nums,sub);
        return res;
    }

    private void dfs(int start, int[] nums, ArrayList<Integer> sub) {
        //这句话可以省略！！！
        if (start > nums.length) {
            return;
        }
        //将当前子集加入结果集中
        res.add(new ArrayList<>(sub));
        for (int i = start; i < nums.length; i++) {
            sub.add(nums[i]);
            dfs(i + 1,nums,sub);
            sub.remove(sub.size() - 1);
        }
    }
}
```

### 子集问题2:对应LeetCode的第90题

##### 题目描述:

给定一个可能包含重复元素的整数数组 **nums**，返回该数组所有可能的子集（幂集）。

**说明：**解集不能包含重复的子集。

**示例:**

```java
输入: [1,2,2]
输出:
[
  [2],
  [1],
  [1,2,2],
  [2,2],
  [1,2],
  []
]
```

##### dfs代码实现:

```java
List<List<Integer>> res = new ArrayList<>();
public class LeetCode90_子集问题II {
    List<List<Integer>> res = new ArrayList<>();
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        //存在重复元素，使用排序 + dfs
        Arrays.sort(nums);
        ArrayList<Integer> sub = new ArrayList<>();
        dfs(0,nums,sub);
        return res;
    }

    private void dfs(int start, int[] nums, ArrayList<Integer> sub) {

        //将当前子集加入结果集中
        res.add(new ArrayList<>(sub));

        for (int i = start; i < nums.length; i++) {
            //去重
            if (i > start && nums[i] == nums[i - 1]) {
                continue;
            }
            sub.add(nums[i]);
            dfs(i + 1,nums,sub);
            sub.remove(sub.size() - 1);
        }
    }
}
```

## 4.3 两数之和问题:对应LeetCode的第1题

##### 问题描述:

给定一个整数数组 `nums` 和一个目标值 `target`，请你在该数组中找出和为目标值的那 **两个** 整数，并返回他们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素不能使用两遍。

**示例:**

```java
给定 nums = [2, 7, 11, 15], target = 9
因为 nums[0] + nums[1] = 2 + 7 = 9
所以返回 [0, 1]
```

##### dfs代码实现:

```java
public class LeetCode1_寻找目标数问题 {
    //该题可以使用dfs进行求解
    int[] res = new int[2];
    public int[] twoSum(int[] nums, int target) {
        ArrayList<Integer> sub = new ArrayList<>();
        dfs(0,nums,target,sub);
        return res;
    }

    private void dfs(int start, int[] nums, int target, ArrayList<Integer> sub) {
        if (sub.size() == 2) {
            if (nums[sub.get(0) + nums[sub.get(1)] == target) {
                res[0] = sub.get(0);
                res[1] = sub.get(1);
            }
            return;
        }

        for (int i = start; i < nums.length; i++) {
            sub.add(i);
            dfs(i + 1,nums,target,sub);
            sub.remove(sub.size() - 1);
        }
    }
}
```

##### 最佳方法还是使用HashMap进行求解：

```java
public class LeetCode1_寻找目标数问题 {
	public int[] twoSumbyMap(int[] nums, int target) {
        Map<Integer,Integer> map = new HashMap<>();
        for(int i = 0; i < nums.length; i++) {
            if(map.containsKey(target - nums[i])) {
                return new int[]{map.get(target - nums[i]),i};
            }
            map.put(nums[i],i);
        }

        return new int[2];
    }
}
```

## 4.4 括号生成问题:对应LeetCode的第22题

##### 问题描述:

数字 *n* 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 **有效的** 括号组合。

**示例：**

```java
输入：n = 3
输出：[
       "((()))",
       "(()())",
       "(())()",
       "()(())",
       "()()()"
     ]
```

##### 思路分析:

该题角上面的dfs递归类型的题目存在一些新颖的点,即这里需要输出保存的是有效括号的组合,而不是数字类型的问题,本省括号(),存在左括号和右括号,所以分析起来要更为复杂一点;

我们定义两个计数器参数left和right:从而构建一个递归二叉树

left 表示「左括号还有几个没有用掉」;

right 表示「右括号还有几个没有用掉」;

既可以通过dfs这颗递归树来完成所有括号组合

当left和right的个数都刚好等于需要组合的括号的对数n时:

* 说明出现一种组合方式,将其加入结果集中

当left < right:此种情况不能出现,直接剪枝返回上一层

当left < n:即未满足组合的括号的对数n: 将left加1,并添加左括号”(”到sub中,进行下一层的递归遍历

当right < n:即未满足组合的括号的对数n: 将right加1,并添加右括号”)”到sub中,进行下一层的递归遍历

![](/img/algorithm/common/recursion/13.png)

##### 代码实现:

```java
List<String> res = new ArrayList<>();
public List<String> generateParenthesis(int n) {
    //定义一个sub:存储每一种括号组合的结果
    String sub = "";
    //这里巧妙地定义两个变量:left表示左括号的的数量,right表示右括号的数量,起始均为0
    dfs(0,0,n,sub);
    return res;
}

private void dfs(int left, int right, int n, String sub) {
    //当left和right的数量刚好都等于n时,即出现一种组合的方式
    if (left == n && right == n) {
        //将该组合加入结果集res
        res.add(sub);
        //返回
        return;
    }
    //剪枝操作:left < right时,将其剔除掉,并返回
    if (left < right) {
        return;
    }
    //如果left的值小于n,加left加1,sub加上一个"(",进行下一层的递归遍历
    if (left < n) {
        dfs(left + 1,right,n,sub + "(");
    }
    //如果right的值小于n,加right加1,sub加上一个")",进行下一层的递归遍历
    if (right < n) {
        dfs(left,right + 1,n,sub + ")");
    }
}
```

## 4.5 全排列问题:对应LeetCode的第46,47题

### 全排列问题1:对应LeetCode的第46题

##### 问题描述:

给定一个 **没有重复** 数字的序列，返回其所有可能的全排列。

**示例:**

```java
输入: [1,2,3]
输出:
[
  [1,2,3],
  [1,3,2],
  [2,1,3],
  [2,3,1],
  [3,1,2],
  [3,2,1]
]
```

##### 注意:

之前的组合,子集问题,我们进行dfs都是按照数组的索引下标数顺序进行递归遍历的,又或者我们先对数组进行排序,然后按照顺序进行dfs递归遍历.但是,整体来说,我们都是按照顺序进行dfs的,但是这里的全排列问题,需要我们将其返回所有可能的排列结果,故我们不能只按照顺序进行dfs遍历了,需要在dfs遍历的过程加入交换元素的操作,使得能够完成全排列,注意,在递归之前进行了什么数据的操作,回溯时将其还原,保证数据的原始性;

对于交换操作,如果理解起来不好的话,可以拿[1,2,3]进行图解分析看看,自己走一遍就比较好理解了

![](/img/algorithm/common/recursion/14.jpg)

##### 代码实现:

```java
	public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        if (nums == null || nums.length == 0)
            return res;
        //进行dfs递归全排列组合
        dfs(0,nums,res);
        return res;
    }

    private void dfs(int start, int[] nums, List<List<Integer>> res) {
        //如果此时start等于nums的长度,则表示sub中已经包含了nums数组的所有元素
        if (start == nums.length) {
            //我们将nums数组元素保存到res结果集中
            List<Integer> sub = new ArrayList<>();
            for (int i = 0; i < nums.length; i++) {
                sub.add(nums[i]);
            }
            res.add(new ArrayList<>(sub));
        }
		
        for (int i = start; i < nums.length; i++) {
            //首先我们将i位置和start位置进行交换
            swap(nums,i,start);
            dfs(start+1,nums,res);
            //注意回溯时需要将递归前的操作还原,再将i位置和start位置再进行交换,以还原
            swap(nums,i,start);
        }
    }

	//交换数组i索引和start索引的值的API
    private static void swap(int[] nums, int i, int start) {
        int temp = nums[i];
        nums[i] = nums[start];
        nums[start] = temp;
    }
```

##### **非交换法代码：**

```java
public class LeetCode46_全排列问题I_剪枝法 {
    //定义结果集
    List<List<Integer>> res = new ArrayList<>();
    boolean[] isVisited;
    public List<List<Integer>> permute(int[] nums) {
        //定义isVisited数组记录nums中的数字是否访问过
        isVisited = new boolean[nums.length];
        Arrays.sort(nums);
        List<Integer> sub = new ArrayList<>();
        dfs(0,nums,sub);
        return res;
    }

    private void dfs(int start, int[] nums, List<Integer> sub) {
        if (start == nums.length) {
            res.add(new ArrayList<>(sub));
            return;
        }

        //注意：i从0开始，而非从start开始
        for (int i = 0; i < nums.length; i++) {
            if (isVisited[i]) {
                continue;
            }
            sub.add(nums[i]);
            isVisited[i] = true;
            dfs(start + 1,nums,sub);
            //回溯
            sub.remove(sub.size() - 1);
            isVisited[i] = false;
        }
    }
}
```



### 全排列问题2:对应LeetCode的第47题

##### 问题描述:

给定一个可包含重复数字的序列 `nums` ，**按任意顺序** 返回所有不重复的全排列。

**示例 1：**

```java
输入：nums = [1,1,2]
输出：
[[1,1,2],
 [1,2,1],
 [2,1,1]]
```

**示例 2：**

```java
输入：nums = [1,2,3]
输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
```

**提示：**

- `1 <= nums.length <= 8`
- `-10 <= nums[i] <= 10`

##### 代码实现:

```java
	//由于该题存在重复元素,故我们需要进行重复组合方式的剔除操作
	//我们建立set判断其重复性:set数据结构元素存在唯一性,同样的元素值只能添加一次
	public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        if (nums == null || nums.length == 0)
            return res;
        //进行dfs递归全排列组合
        dfs(0,nums,res);
        return res;

    }

    private void dfs(int start, int[] nums, List<List<Integer>> res) {
        if (start == nums.length) {
            List<Integer> sub = new ArrayList<>();
            for (int i = 0; i < nums.length; i++) {
                sub.add(nums[i]);
            }
            res.add(new ArrayList<>(sub));
        }

        //建立一个Set:
        HashSet<Integer> set = new HashSet<>();
        for (int i = start; i < nums.length; i++) {
            //如果set中包含该数字:说明该数字排列重复,直接忽略跳过该次循环
            if (set.contains(nums[i])) {
                continue;
            }
            set.add(nums[i]);
            //交换
            swap(nums,i,start);
            dfs(start+1,nums,res);
            //回溯时,将其交换回来
            swap(nums,i,start);
        }
    }

    private static void swap(int[] nums, int i, int start) {
        int temp = nums[i];
        nums[i] = nums[start];
        nums[start] = temp;
    }
```

##### 注意:

**该题更优的解法是利用dfs+剪枝的方法,有兴趣可以尝试一下这种排序数组,然后dfs,将不满足的子树情况直接剪枝操作**

##### dfs+剪枝代码实现:

```java
public class LeetCode47_全排列问题II_剪枝法 {
    //定义结果集
    List<List<Integer>> res = new ArrayList<>();
    //定义isVisited数组，记录该位置是否访问过
    boolean[] isVisited;
    public List<List<Integer>> permuteUnique(int[] nums) {
        //定义isVisited数组记录nums中的数字是否访问过
        isVisited = new boolean[nums.length];
        //存在重复元素，这里故需要进行排序处理
        Arrays.sort(nums);
        List<Integer> sub = new ArrayList<>();
        dfs(0,nums,sub);
        return res;
    }

    private void dfs(int start, int[] nums, List<Integer> sub) {
        if (start == nums.length) {
            res.add(new ArrayList<>(sub));
            return;
        }

        //注意：i从0开始，而非从start开始
        for (int i = 0; i < nums.length; i++) {
            //剪枝处理
            if (isVisited[i]) {
                //如果该数字已经使用过,直接"剪枝"跳过
                continue;
            }
            //去重处理
            // 去重条件：i > 0 是为了保证 nums[i - 1] 有意义
            // 写 !used[i - 1] 是因为 nums[i - 1] 在深度优先遍历的过程中刚刚被撤销选择
            //如果出现重复结果,直接跳过
            if (i > 0 && nums[i] == nums[i - 1] && !isVisited[i - 1]) {
                continue;
            }

            sub.add(nums[i]);
            isVisited[i] = true;
            dfs(start + 1,nums,sub);
            //回溯
            sub.remove(sub.size() - 1);
            isVisited[i] = false;
        }
    }
}
```

**以nums={1,1,2}为例的图解:**

![](/img/algorithm/common/recursion/2-1.png)

## 5.终极一题:对应LeetCode的第60题[困难]

#### 排列序列

##### 问题描述:

给出集合 `[1,2,3,...,n]`，其所有元素共有 `n!` 种排列。

按大小顺序列出所有排列情况，并一一标记，当 `n = 3` 时, 所有排列如下：

1. `"123"`
2. `"132"`
3. `"213"`
4. `"231"`
5. `"312"`
6. `"321"`

给定 `n` 和 `k`，返回第 `k` 个排列。

**示例 1：**

```
输入：n = 3, k = 3
输出："213"
```

**示例 2：**

```
输入：n = 4, k = 9
输出："2314"
```

**示例 3：**

```
输入：n = 3, k = 1
输出："123"
```

**提示：**

- `1 <= n <= 9`
- `1 <= k <= n!`

##### 问题分析:

容易想到,使用同力扣第 46 题的全排列的回溯搜索算法，依次得到全排列，输出第 k个全排列即可。事实上，我们不必求出所有的全排列。并且如果这样做测试会超时! !

基于以下几点考虑：

* 所求排列 一定在叶子结点处得到，进入每一个分支，可以根据已经选定的数的个数，进而计算还未选定的数的个数，然后计算阶乘，就知道这一个分支的 叶子结点 的个数：
* 如果 k大于这一个分支将要产生的叶子结点数，直接跳过这个分支，这个操作叫「剪枝」；
* 如果 k小于等于这一个分支将要产生的叶子结点数，那说明所求的全排列一定在这一个分支将要产生的叶子结点里，需要递归求解。

![](/img/algorithm/common/recursion/15.png)

**我们以n = 4, k = 9为例,进行图解分析:**

![](/img/algorithm/common/recursion/17.png)

![](/img/algorithm/common/recursion/18.png)

![](/img/algorithm/common/recursion/19.png)

![](/img/algorithm/common/recursion/20.png)

![](/img/algorithm/common/recursion/21.png)

![](/img/algorithm/common/recursion/22.png)

##### 代码实现1：

```java
	private int n;
    private int k;
    //阶乘数组
    private int[] fac;
    //定义isVisited数组:记录该数值是否使用过
    private boolean[] isVisited;
    public String getPermutation(int n, int k) {
        this.n = n;
        this.k = k;
        //通过n获取其阶乘数组
        calculateFac(n);
        isVisited = new boolean[n + 1];
        StringBuilder res = new StringBuilder();
        dfs(0,res);
        return res.toString();
    }

    private void dfs(int start, StringBuilder res) {
        //如果当前start == n:表示到达叶子结点,直接返回
        if (start == n) {
            return;
        }
        //计算还未确定的数字的全排列的个数，第1次进入的时候是 n - 1,而不是n[即如果是4个数,第一次进入应该为4 - 1 = 3]
        int count = fac[n - 1 - start];
        //从1开始到n进行取值
        for (int i = 1; i <= n; i++) {
            if (isVisited[i]) {
                //如果该数字已经使用过了,则直接跳过该次遍历
                continue;
            }
            if (count < k) {
                //如果当前count个数 < k,则表示第k个数在该数选择情况下的全排列组合之后,进行"剪枝操作"
                k = k - count;
                continue;
            }
            //否则,我们将该数值添加到res结果集中
            res.append(i);
            //并记录该数已经使用过
            isVisited[i] = true;
            dfs(start + 1,res);
            //由于我们是直接剪枝跳过,进入选择以后,必定找到该第k个数,所以不进行回溯的还原操作
            // 注意 1：不可以回溯（重置变量），算法设计是「一下子来到叶子结点」，没有回头的过程
            // 注意 2：这里要加 return，后面的数没有必要遍历去尝试了,也是请后面的情况进行"剪枝"操作
            return;
        }
    }

    //计算阶乘数组的方法:注意:因为排列的值为1~n,我们设置数组大小为n+1,其中0! = 1
    private void calculateFac(int n) {
        fac = new int[n + 1];
        fac[0] = 1;
        for (int i = 1; i <= n; i++) {
            fac[i] = fac[i - 1] * i;
        }
    }
```

如果上面的高级写法记不住，可以用下面的**简便易懂版**，但是时间复杂度会高一些：

```java
public class LeetCode60_排列序列问题 {
    int cnt;
    String res = "";
    boolean[] isVisited;
    public String getPermutation(int n, int k) {
        isVisited = new boolean[n + 1];   //记录当前数字1 ~ n是否访问过
        dfs(1,k,"");
        return res;
    }

    private void dfs(int start, int k, String sub) {
        if (start == isVisited.length) {
            ++cnt;
            if (cnt == k) {
                //说明此时是第k个排列
                res = sub;
                return;
            }
        }
        //剪枝操作，后面的无需再进行计算了
        if (cnt > k) return;
        for (int i = 1; i < isVisited.length; i++) {
            if (isVisited[i]) continue;
            //记录当前位置已被访问
            isVisited[i] = true;
            dfs(start + 1,k,sub + i);
            isVisited[i] = false;
        }
    }

}
```

## 6. 岛屿数量：对应LeetCode的第200题

https://leetcode-cn.com/problems/number-of-islands/

给你一个由 `'1'`（陆地）和 `'0'`（水）组成的的二维网格，请你计算网格中岛屿的数量。

岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。

此外，你可以假设该网格的四条边均被水包围。

**示例 1：**

```
输入：grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
输出：1
```

**示例 2：**

```
输入：grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
输出：3
```

**提示：**

- `m == grid.length`
- `n == grid[i].length`
- `1 <= m, n <= 300`
- `grid[i][j]` 的值为 `'0'` 或 `'1'`

```java
public int numIslands(char[][] grid) {
    int count = 0;  //记录岛屿的数量
    for (int i = 0; i < grid.length; i++) {
        for (int j = 0; j < grid[0].length; j++) {
            if (grid[i][j] == '1') {
                ++count; //将岛屿的数量增加1
                dfs(grid,i,j);  //我们将当前位置的能够访问到的‘1’变成‘0’
            }

        }
    }
    return count;
}

private void dfs(char[][] grid, int i, int j) {
    if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length || grid[i][j] == '0') {
        return;
    }
    //将该位置的值置为'0'
    grid[i][j] = '0';
    dfs(grid,i - 1,j);
    dfs(grid,i + 1,j);
    dfs(grid,i,j - 1);
    dfs(grid,i,j + 1);
}
```

