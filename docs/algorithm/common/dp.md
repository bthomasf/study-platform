---
title: 动态规划算法
---

#  1.动态规划介绍

**动态规划（Dynamic Programming，简称DP）**,  是运筹学的一个分支，是求解决策过程最优化的过程 .

我们在算法导论中提及了动态规划的两个很重要的特征:

1.**最优子结构的性质**:即要求我们去求解问题的一个最优解,而通常该最优解包含了子问题的最优解

2.**重叠子问题性质**:即在一个递归求解的过程中包含"少数"的独立的子问题被反复计算了很多次,我们需要采取"备忘法"去记录这些反复计算的子问题的解,即我们通常所说的利用建表的方法,来实现子问题解的存储,并通过"自底向上"的方法来计算表格,最后达到求解最终最优解的结果.

# 2.动态规划经典问题汇总

## 2.1 两个序列的最长公共子序列问题(LCS问题):对应LeetCode的1143题

给出两个子序列X和Y,求两个序列的最长公共子序列的长度,子序列可以是不连续的,(扩展:输出其中一组最长公共子序列)

##### 具体题型:

字符串序列X={"A","B","C","B","D","A","B"},Y={"B","D","C","A","B","A"},求X和Y序列的最长公共子序列长度

##### 题目分析:

![](/img/algorithm/common/dp/1.png)

##### 扩展:输出一组最长公共子序列

我们采取栈的方式,逆序遍历数组,如果X[i]和Y[j]的值相等,则直接入栈;

如果X[i]和Y[j]的值不相等,则需要比较当前[i,j - 1]和[i - 1,j]位置的dp值,从而选择向左或者向上遍历

最后到达i = 0或者j = 0的位置,将栈中元素出栈输出,即为一组最长公共子序列的解

##### 代码实现:

```java
public class LongestCommonSubOrder {
    public static void main(String[] args) {	
        //定义两个字符串序列X和Y
        String[] X = {"A","B","C","B","D","A","B"};
        String[] Y = {"B","D","C","A","B","A"};
        int m = X.length;
        int n = Y.length;
        //第一步:我们需要定义一个m * n的表格:用来存储所有[i,j]的最优解
        //dp[i][j]:表示[i,j],其中i为X的位置,j为Y的位置的最长公共子序列的长度
        int[][] dp = new int[m+1][n+1];
        //因为dp[i][0],dp[0][j]肯定不存在最长公共子序列,故其值为0,java自动初始化默认值为0
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                //计算dp[i][j]的值:如果当前X[i] == Y[j]的值,则dp[i][j] = dp[i - 1][j - 1] + 1
                //如果X[i] != Y[j]的值,则dp[i][j] = max(dp[i - 1][j],dp[i][j - 1])
                //因为我们是自底向上进行运算的,所以计算dp[i][j]的时候,dp[i - 1][j]和dp[i][j - 1]的值已经计算完毕
                //由于两个序列的起始索引我0,所以这里比较的是X[i - 1]和Y[j - 1]的值
                if (X[i - 1] == Y[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                }else {
                    dp[i][j] = Math.max(dp[i - 1][j],dp[i][j - 1]);
                }
            }
        }
        //时间复杂度和空间复杂度均为O(m * n),此时dp[m][n]即为两个序列X和Y的最长公共子序列的长度
        System.out.println("X序列和Y序列的最长公共子序列的长度为 :" + dp[m][n]);

        //扩展:我们如何输出一组最长公共子序列
        Stack<String> stack = new Stack<>();
        int i = m - 1;
        int j = n - 1;
        while (i >= 0 && j >= 0) {
            if (X[i] == Y[j]) {
                //从后向前遍历,如果相等,则存到栈中
                stack.push(X[i]);
                i--;
                j--;
            }else {
                if (dp[i + 1][j] > dp[i][j + 1]) {
                    j--;
                }else {
                    i--;
                }
            }
        }
        //因为栈是先进后出,所以此时输出栈中元素即为两个序列的最大的公共子序列
        while (!stack.isEmpty()) {
            System.out.print(stack.pop() + " ");
        }
    }
}
```

### 补充 : 最长连续公共序列的实现

> 上面的两个序列X和Y,求解的是两个公共序列的非连续公共子序列的最大长度
>
> 例如 : "abac"和"abahfc"的最长公共子序列的长度为4,即"abac"
>
> 但是若为最长连续公共子序列的长度为3,为"aba"

```java
public static void main(String[] args) {
        String s1 = "aacabdkacaa";
        String s2 = "aacakdbacaa";

        int m = s1.length();
        int n = s2.length();
        int maxLen = 0;
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if(s1.charAt(i - 1) == s2.charAt(j - 1)) {
                    //注意这里的代码!!!
                    if (i == 1 || j == 1) {
                        dp[i][j] = 1;
                    }else {
                        dp[i][j] = dp[i - 1][j - 1] + 1;
                    }
                    maxLen = Math.max(maxLen,dp[i][j]);
                }
            }
        }
        System.out.println("最长公共连续子串的长度为: " + maxLen);
    }
```

## 2.2 最长递增子序列个数问题(LIS问题)

首先我们来看一个简单一点的题目:

### LCIS问题:最长连续递增序列:对应LeetCode的674题

给定一个未经排序的整数数组，找到最长且 **连续递增的子序列**，并返回该序列的长度。

**连续递增的子序列** 可以由两个下标 `l` 和 `r`（`l < r`）确定，如果对于每个 `l <= i < r`，都有 `nums[i] < nums[i + 1]` ，那么子序列 `[nums[l], nums[l + 1], ..., nums[r - 1], nums[r]]` 就是连续递增子序列。

**示例 1：**

```
输入：nums = [1,3,5,4,7]
输出：3
解释：最长连续递增序列是 [1,3,5], 长度为3。
尽管 [1,3,5,7] 也是升序的子序列, 但它不是连续的，因为 5 和 7 在原数组里被 4 隔开。 
```

**示例 2：**

```
输入：nums = [2,2,2,2,2]
输出：1
解释：最长连续递增序列是 [2], 长度为1。
```

**提示：**

- `0 <= nums.length <= 104`
- `-109 <= nums[i] <= 109`

问题分析:

这题要求我们求的最长递增**连续的**子序列的长度,故我们可以选择设置dp一维数组来记录最长递增连续子序列的长度

```java
假设题设给定我们的数组nums的长度为N,则定义dp[N]:
其中dp[i]表示以nums[i]结尾的最长递增连续子序列的个数
首先dp[0] = 1 : 即其本身
对于dp[i]:
如果nums[i - 1] < nums[i] : 则dp[i] = dp[i - 1] + 1;
否则,即nums[i - 1] >= nums[i] : 则dp[i] = 1;
然后我们定义longest,通过遍历结束,获取dp数组中的最大值,即为nums数组最长递增连续子序列的长度
int N = nums.length;
if (N <= 1) return N;
//定义dp数组:记录以nums[i]为结尾的最长递增连续子序列的长度
int[] dp = new int[N];
dp[0] = 1;
for (int i = 1; i < N; i++) {
    if (nums[i - 1] < nums[i]) {
        dp[i] = dp[i - 1] + 1;
    }else {
        dp[i] = 1;
    }
}
//定义longest:记录最长递增子序列的长度
int longest = 1;
for (int i = 0; i < N;i++) {
    longest = Math.max(longest,dp[i]);
}
return longest;
```

**图解上面的示例1:**

![](/img/algorithm/common/dp/3.png)





然后我们再来看一下这个最长递增子序列个数问题(LIS问题)

### LIS问题描述:对应LeetCode的673题

给定一个未排序的整数数组，找到最长递增子序列的个数。

**示例 1:**

```java
输入: [1,3,5,4,7]
输出: 2
解释: 有两个最长递增子序列，分别是 [1, 3, 4, 7] 和[1, 3, 5, 7]。
```

**示例 2:**

```java
输入: [2,2,2,2,2]
输出: 5
解释: 最长递增子序列的长度是1，并且存在5个子序列的长度为1，因此输出5。
```

**注意:** 给定的数组长度不超过 2000 并且结果一定是32位有符号整数。

#### 题目分析

由于此题不仅仅要求我们求出最长递增子序列的长度,最终要求我们返回的是最长递增子序列的个数,所以我们需要维护两个数组,一个是最长递增子序列的长度数组,一个是最长递增子序列长度的个数数组

```java
假设题设给定的未排序数组为nums,数组的长度为N:即为数组元素的个数
我们定义两个数组:
len[N]:其中len[i]表示以nums[i]结尾的数组的最长递增子序列的长度
count[N]:其中count[i]表示以nums[i]结尾的数组的最长递增子序列的个数
1)首先我们容易得到如果数组nums没有元素或者只有一个元素,即N <= 1,则count[N] = N,直接返回即可
2)如果N >= 2,此时对于len[j],如果前面的子问题中,如果nums[i] < nums[j]:
(1)如果len[i] > len[j],则len[j] = len[i] + 1,即长度为前i个元素的最长递增子序列的长度加上nums[j]的值,构成一个新的最长递增子序列,此时count[j] = count[i];
(2)如果len[i] + 1 = len[j],则len[j]仍为原值,count[j] = count[j] + count[i];
(3)其他情况,直接跳过
注意:初始值我们将count[i] = 1 i:0 ~ N-1,即长度为1的序列的个数为1个,即其本身

核心代码实现:
int N = nums.length;
if (N <= 1) return N;
int[] len = new int[N];
int[] count = new int[N];
Arrays.fill(len, 1);
Arrays.fill(count, 1);
for (int j = 0; j < N; j++) {
    for (int i = 0; i < j; i++)
        if (nums[i] < nums[j]) {
            if (len[i] >= len[j]) {
                len[j] = len[i] + 1;
                count[j] = count[i];
            } else if (len[i] + 1 == len[j]) {
                count[j] += count[i];
            }
        }
	}
}
//定义一个longest:记录最长递增子序列的长度
int longest = 0;
for (int val : len) {
    longest = Math.max(longest,val);
}
//定义res:输出最长递增子序列的个数
int res = 0;
for (int i = 0; i < N; i++) {
    if (len[i] == longest) {
        res = res + count[i];
    }
}
return res;
```

以示例1为例,动态规划求解的动态数组len和count的自底而上的求解过程图解如下所示:

![](/img/algorithm/common/dp/2.png)

## 2.3 背包问题[0/1背包问题,完全背包问题]

![](/img/algorithm/common/dp/5.jpg)

### 0-1背包问题

##### 题目描述

有N件物品和一个容量为C的背包,其中第i件物品的重量为w[i],价值为v[i],求解哪些物品装入背包中可以使得背包中物品的价值最大?注意:每个物品只能选择一次

##### 问题分析:

0-1背包问题的特点就在于**每件物品只能选择一次**,故只存在选或者不选两种情况,对于传入N件物品,容量为C的参数:

```
我们定义w[N + 1],v[N + 1]: 存储物品的重量和价值
注意:我们定义w[N+1],v[N+1]的目的在于使得数组下标和第i个物品相对应,相一致,同样也可以直接定义w[N],v[N],只是此时w[i],v[i]表示为第i+1个物品的重量和价值
```

```java
我们再定义dp[N + 1][C + 1]:其中dp[i][j]表示前i个物品可以选择的情况下,背包容量不超过j的最大价值
此时我们存在两个选择:
1)我们不选择第i个物品:dp[i][j] = dp[i - 1][j],即前i-1个物品,背包不超过j的最大价值
2)我们选择第i个物品:dp[i][j] = dp[i - 1][j - w[i]] + v[i]
即dp[i][j]为第i个物品的价值加上前i-1个物品,容量为j减去第i个物品的重量的最大价值之和
但是注意:如果我们选择第i个物品,则必须保证当前背包容量j要大于第i个物品的重量,即j > w[i]
```

![](/img/algorithm/common/dp/6.png)

由此可得前i个物品,背包容量不超过j的情况下的最大价值为:
$$
if \space not  \space choose \space w[i] :
dp[i][j] = dp[i - 1][j]
$$

$$
if  \space choose  \space  w[i]:
dp[i][j] = max(dp[i - 1][j],dp[i - 1][j - w[i]] + v[i])
$$

最终,前N个物品,背包容量不超过C的最大价值为:
$$
dp[N][C]
$$

##### 代码实现:

```java
public class KnapsackProblems01 {
    /*
    * 01背包问题
    * N件物品和一个容量为V的背包:每件物品只能使用一次,第i件物品的体积是vi,价值为wi
    * 求解:将哪些物品装入背包,使得在不超过背包体积的情况下,总价值最大,输出最大价值
    * */
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        //n为输入的物品的个数
        int N = in.nextInt();
        //C为输入的背包的容量
        int C = in.nextInt();
        int[] w = new int[N + 1];//物品的重量
        int[] v = new int[N + 1];//物品的价值
        for (int i = 1; i <= N; i++) {
            w[i] = in.nextInt();
            v[i] = in.nextInt();
        }

        //定义二维的动态数组dp[][]
        //其中dp[i][j]:表示前i个物品,在不超过背包容量为j的情况下,得到的最大价值
        int[][] dp = new int[N + 1][C + 1];
        //给dp[0][j],dp[i][0]赋值初始值0:表示没有物品选择情况下,以及背包容量为0的情况下,最大价值均为0
        for (int i = 0; i <= N; i++) {
            dp[i][0] = 0;
        }
        for (int i = 0; i <= C; i++) {
            dp[0][i] = 0;
        }
        //进行dp[i][j]的赋值操作
        for (int i = 1; i <= N; i++) {
            for (int j = 1; j <= C; j++) {
                //不选择第i个物品的情况下,dp[i][j] = dp[i - 1][j]
                dp[i][j] = dp[i - 1][j];
                //如果第i个物品的重量v[i] <= j,则选择第i个物品,dp[i][j] = dp[i - 1][j - w[i]] + v[i]
                //此时最大价值为dp[i][j] = Math.max(dp[i][j],dp[i - 1][j - w[i]] + v[i]);
                if (w[i] <= j) {
                    dp[i][j] = Math.max(dp[i][j],dp[i - 1][j - w[i]] + v[i]);
                }
            }
        }
        //此时dp[N][C]即为选择N个物品时,背包的最大价值
        int res = dp[N][C];
        System.out.println("该背包在" + N + "个物品中不重复的挑选,不超过背包总容量的情况下,最大价值为 :" + res);      
}

```

##### 将二维dp优化为一维dp数组实现,实现动态规划的降维

```java
将二维dp数组降维到一维dp数组:
由于dp[i][j]只和dp[i-1][j]的状态有关,故我们定义f[C+1],其中f[j]表示当前遍历的前j个物品可以选择,背包容量为j的情况下的最大价值
将dp[i][j] = max(dp[i - 1][j],dp[i - 1][j - w[i]] + v[i])中,将二维的i和i-1都去除掉,但是我们需要保证后面的是i - 1的状态:
即dp[j] = max(dp[j],dp[j - w[i]] + v[i])
故我们选择内循环从C --> w[i]进行循环:这样上面公式前面的dp[j]是前i个物品,背包为j的最大价值,后面的dp[j]和dp[j - w[i]]为前i - 1个物品,背包为j的最大价值
```

```java
//优化0-1背包问题代码:定义一维数组f[N+1]:其中f[j]表示前i个物品背包总容量为j的情况下的最大价值
        int[] f =  new int[C + 1];
        f[0] = 0;
        for (int i = 1; i <= N; i++) {
            for (int j = C; j >= w[i]; j--) {
                //j从C到1:使得下面的f[j]是f[i - 1][j]和f[i - 1][j - w[i]] + v[i]的最大值
                f[j] = Math.max(f[j],f[j - w[i]] + v[i]);
            }
        }
        //此时的f[C]是选择N个物品时,背包的最大价值
        int result = f[C];
        System.out.println("该背包在" + N + "个物品中不重复的挑选,不超过背包总容量的情况下,最大价值为 :" + result);
    }
```

### 完全背包问题

##### 题目描述

有N件物品和一个容量为C的背包,其中第i件物品的重量为w[i],价值为v[i],求解哪些物品装入背包中可以使得背包中物品的价值最大?注意:**每个物品可以重复选择**

即题目的基础条件和前面的0-1背包问题相同,只是每件物品可以重复选择

##### 题目分析和代码实现

我们仍然先选择使用二维的dp数组进行求解

```java
我们定义dp[N + 1][C + 1]:
其中dp[i][j]表示前i个物品可以选择的情况下,背包容量不超过j的最大价值
此时我们仍然存在两种选择:
1)不选择第i个物品:dp[i][j] = dp[i - 1][j]
2)选择第i个物品:此时由于存在可以重复选择的情况故我们可以重复进行选择,即此时可以选择1次,2次,3次...k次(1< k <= j/w[i]),即:
for(int k = 1;k * w[i] <= j;k++) {
    dp[i][j] = max(dp[i - 1][j],dp[i - 1][j - k * w[i]] + k * v[i]);
}
故我们联合上面两种选择情况,核心代码为:
for(int i = 1;i <= N;i++) {
    for(int j = 1;j <= C;j++) {
        dp[i][j] = dp[i - 1][j];
        for(int k = 1;k * w[i] <= j;k++) {
            dp[i][j] = max(dp[i][j],dp[i - 1][j - k * w[i]] + k * v[i]);
        }
    }
}
最后的dp[N][C]即为前N个物品,背包容量为C的情况下的最大价值
```

##### 优化为一维dp数组

```java
同上面的0-1降维思想相同,由于前i种物品的状态只和前i-1种物品的状态有关,故我们可以选择进行降维,保证降维以后的一维数组dp[j],前者为前i个物品的最大价值,后者为前i-1个物品的最大价值
代码实现:
int[] dp = new int[C + 1];
for(int i = 1;i <= N;i++) {
    for(int j = w[i];j <= C;j++) {
        dp[j] = max(dp[j],dp[j - w[i]] + v[i])
    }
}
最后的dp[C]即为前N个物品,背包容量为C的情况下的最大价值
```

## 2.4 抛硬币问题(完全背包问题+背包方案数的结合问题)

##### 问题描述

给定数量不限的硬币，币值为25分、10分、5分和1分，编写代码计算n分有几种表示法。(结果可能会很大，你需要将结果模上1000000007)

![](/img/algorithm/common/dp/9.png)

**示例1:**

```
 输入: n = 5
 输出：2
 解释: 有两种方式可以凑成总金额:
 5=5
 5=1+1+1+1+1
```

**示例2:**

```
 输入: n = 10
 输出：4
 解释: 有四种方式可以凑成总金额:
 10=10
 10=5+5
 10=5+1+1+1+1+1
 10=1+1+1+1+1+1+1+1+1+1
```

**说明：**

注意:

你可以假设：

- 0 <= n (总金额) <= 1000000

##### 问题分析:

```java
该题的思路属于完全背包问题(每一种硬币可以重复选择)+背包的方案数问题(即有多少种表示法)
我们同样需要进行动态规划思想进行求解,只是这里我们需要融合完全背包和方案数这两种思路
假设有m个不同的硬币面值数可以选择,凑成的总金额为n,则:
定义数组w[m + 1]: w[i]表示第i种硬币的硬币面值数
我们首先定义二维数组dp[m+1][n+1]:其中dp[i][j]表示前i种硬币面值可以选择的情况下,构成面值总金额为j的方案数
1)当j = 0:即表示构成面值总金额为0的方案数,则只存在一种,即所有的面值硬币都不选择,故dp[i][0] = 1,i:0 ~ m
2)当不选择第i个物品时,则dp[i][j] = dp[i - 1][j] = dp[i - 1][j - 0 * w[i]]
3)当选择第i个物品时,则由于可以重复进行选择
dp[i][j] = dp[i - 1][j - 1 * w[i]] + dp[i - 1][j - 2 * w[i]] + ...+ dp[i - 1][j - k * w[i]],其中k:1 ~ j/w[i]
即dp[i][j]等于选择1个当前硬币面值,2个硬币面值...,k个硬币面值的方案数之和
```

$$
dp[i][[j] = \sum_{l=0}^k dp[i - 1,j - l *w[i]],k\in(1,j/w[i])
$$

##### 核心代码:

```java
static final int MOD = 1000000007;
int [][] dp = new  int[m + 1][n + 1];
for (int i = 0; i <= m; i++) {
    dp[i][0] = 1;
}
for (int i = 1; i <= m; i++) {
    for (int j = 1; j <= n; j++) {
        //不放入第i个物品
        dp[i][j] = dp[i- 1][j] % MOD;
        //放入第i个物品
        for (int k = 1; k * w[i] <= j; k++) {
            dp[i][j] = (dp[i][j] + dp[i - 1][j - k * w[i]]) % MOD;
        }
    }
}
return dp[m][n];
```

##### 优化为一维dp数组:

```java
由于dp[i][j]只和dp[i - 1][j]的状态存在关联,故我们可以选择进行降维处理
我们定义dp[n + 1]数组:其中dp[j]表示构成面值总金额为j的方案数
则由于上面的动态转移方程,我们修改后的核心代码如下:
static final int MOD = 1000000007;
int[] dp = new int[n + 1];
dp[0] = 1; //表示前i个物品构成面值为0的方案数为1
for (int i = 1; i <= m; i++) {
    for (int j = w[i]; j <= n; j++) {
        dp[j] = (dp[j] + dp[j - w[i]]) % MOD;
    }
}
return dp[n];
```

## 2.5 股票利益最大化问题:对应LeetCode的121题

##### 题目描述:

假设把某股票的价格按照时间先后顺序存储在数组中，请问买卖该股票一次可能获得的最大利润是多少？

**示例 1：**

```
输入: [7,1,5,3,6,4]
输出: 5
解释: 在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。
     注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格。
```

**示例 2：**

```
输入: [7,6,4,3,1]
输出: 0
解释: 在这种情况下, 没有交易完成, 所以最大利润为 0。
```

**提示：**

- `0 <= 数组长度 <= 10^5`

##### 题目分析:

设共有n天，第a天买，第b天卖，则需保证 a < b；可推出交易方案数共有：
(n - 1) + (n - 2) + ... + 2 + 1 = n(n - 1) / 2

因此，暴力法的时间复杂度为 O(n^2),考虑使用动态规划降低时间复杂度，以下按照流程解题。

##### 动态规划解析：

* 状态定义： 设动态规划列表 dp ，dp[i] 代表以 prices[i] 为结尾的子数组的最大利润（以下简称为 前 i日的最大利润）。
* 转移方程： 由于题目限定 买卖该股票一次 ，因此前 i 日最大利润 dp[i]等于前 i - 1日最大利润 dp[i-1] 和第 i 日卖出的最大利润中的最大值。
* 前 i 日最大利润 = max(前 (i-1) 日最大利润, 第 i 日价格 - 前 i 日最低价格);
* dp[i] = max(dp[i - 1], prices[i] - min(prices[0:i]))
* 初始状态： dp[0] = 0 ，即首日利润为 0；
* 返回值： dp[n - 1] ，其中n为 dp 列表长度。

![](/img/algorithm/common/dp/7.png)

注意:

* 因为我们每次在计算dp[i]的时候需要计算min(prices[0],prices[i])的值,故我们可以定义一个minPrice进行记录上一个状态的最低价格,从来直接更新minPrice即可,就不用每一次都是重新遍历获取最低价格了

##### java代码实现:

```java
//动态规划进行求解:利用一维dp数组
public int maxProfit(int[] prices) {
    //因为这是买卖一次的最大利润,故我们定义dp[n]动态规划数组
    //其中dp[i] : 表示前i天的最大利润
    //初始值,第1天,即i = 0时,dp[0] = 0,无利润
    int n = prices.length;
    //如果只存在小于等于1天的数据,则直接返回0:最大利润为0
    if (n <= 1) return 0;
    int[] dp = new int[n];
    dp[0] = 0;
    int minPrice = prices[0];
    //一次for循环遍历
    for (int i = 1; i < n; i++) {
    minPrice = Math.min(minPrice,prices[i]);
    dp[i] = Math.max(dp[i - 1],prices[i] - minPrice);
    }
    return dp[n - 1];
}
```

##### 降维优化空间复杂度

由于dp[i]的状态只和dp[i - 1]的状态只以及minPrice有关,我们可以选择对dp数组进行降维为dp变量,保证新的状态转移方程:
$$
dp = max(dp ,prices[i] - minPrice)
$$
中前者dp为前i天的最大利润,后者dp为前i-1天的最大利润

##### java代码实现:

```java
 //空间降维
public int maxProfit02(int[] prices) {
    int N = prices.length;
    if (N <= 1) return 0;
    //因为dp[i]的状态只和dp[i - 1]的状态有关,所以我们可以将一维的dp数组降维至dp变量[表示当前前i天的最大利润]
    int dp = 0;//初始值为0
    int minPrice = prices[0];
    //一次for循环遍历
    for (int i = 1; i < N; i++) {
        minPrice = Math.min(minPrice,prices[i]);
        dp = Math.max(dp,prices[i] - minPrice);
    }
    return dp;
}
```

# 3.动态规划LeetCode问题汇总

## 213. 打家劫舍 II

##### 题目描述:

你是一个专业的小偷，计划偷窃沿街的房屋，每间房内都藏有一定的现金。这个地方所有的房屋都 **围成一圈** ，这意味着第一个房屋和最后一个房屋是紧挨着的。同时，相邻的房屋装有相互连通的防盗系统，**如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警** 。

给定一个代表每个房屋存放金额的非负整数数组，计算你 **在不触动警报装置的情况下** ，能够偷窃到的最高金额。

**示例 1：**

```
输入：nums = [2,3,2]
输出：3
解释：你不能先偷窃 1 号房屋（金额 = 2），然后偷窃 3 号房屋（金额 = 2）, 因为他们是相邻的。
```

**示例 2：**

```
输入：nums = [1,2,3,1]
输出：4
解释：你可以先偷窃 1 号房屋（金额 = 1），然后偷窃 3 号房屋（金额 = 3）。
     偷窃到的最高金额 = 1 + 3 = 4 。
```

**示例 3：**

```
输入：nums = [0]
输出：0
```

**提示：**

- `1 <= nums.length <= 100`
- `0 <= nums[i] <= 1000`

##### 题解:

这题的动态规划思路如下所示 : 

```java
我们定义dp数组: 其中dp[i]表示到达第i个房屋偷窃到的最大金额
这题有两个条件我们需要重点考虑:
(1) 所有的房屋是连在一起的,也就是说我们可以从最后一个房屋到达第一个房屋
(2) 相邻的房屋是装有互相连通的防盗报警装置,所有我们不能连续偷窃相邻的房屋
故我们的策略是:
首先我们从第一个房屋开始进行动态规划:
dp[0] = nums[0] , dp[1] = Math.max(nums[0],nums[1])
i : 2 ~ nums.length
dp[i] = max(dp[i - 2] + nums[i],dp[i - 1])  即偷当前第i个房屋和不偷当前第i个房屋的金额的最大值
但是这样的话,会出现一个问题:因为第一个房屋和最后一个房屋形成一个环,故我们这里没有考虑到偷窃到最后一个房屋和第一个房屋是连在一起的情况,故我们选择将第一个房屋和最后一个房屋分开进行单独动态规划遍历[即避免了既偷窃了第一个房屋,又偷窃了最后一个房屋的情况]
定义两个dp数组: 
dp数组1:表示从第一个房屋开始进行计算: 到达第i个房屋能够偷窃的最大金额
dp数组2:表示从第二个房屋开始进行计算: 到达第i个房屋能够偷窃的最大金额
class Solution {
    public int rob(int[] nums) {
        if (nums == null || nums.length == 0)
            return 0;
        if (nums.length == 1) return nums[0];
        if (nums.length == 2) return Math.max(nums[0],nums[1]);
        //定义两个dp数组: 这是因为第一个房屋和最后一个房屋形成了环状: 围成了一圈,所以我们将第一个房屋和最后一个房屋单独进行两次遍历考虑
        int[] dp1 = new int[nums.length];
        int[] dp2 = new int[nums.length];
        //进行第一次遍历
        dp1[0] = nums[0];
        dp1[1] = Math.max(nums[0],nums[1]);
        //则从第2个房屋开始进行遍历到倒数第二个房屋结束[不包括最后一个房屋]
        for (int i = 2; i < nums.length - 1; i++) {
            dp1[i] = Math.max(dp1[i - 2] + nums[i],dp1[i - 1]);
        }
        //进行第二次遍历
        dp2[1] = nums[1];
        dp2[2] = Math.max(nums[1],nums[2]);
        //从第三个房屋开始进行遍历到倒数第一个房屋结束[不包括第一个房屋]
        for (int i = 3; i < nums.length; i++) {
            dp2[i] = Math.max(dp2[i - 2] + nums[i],dp2[i - 1]);
        }
        //最后返回两次遍历结果的偷窃金额的最大值
        return Math.max(dp1[nums.length - 2],dp2[nums.length - 1]);
    }
}
```

## 91. 解码方法

#### 问题描述:

一条包含字母 `A-Z` 的消息通过以下映射进行了 **编码** ：

```
'A' -> 1
'B' -> 2
...
'Z' -> 26
```

要 **解码** 已编码的消息，所有数字必须基于上述映射的方法，反向映射回字母（可能有多种方法）。例如，`"11106"` 可以映射为：

- `"AAJF"` ，将消息分组为 `(1 1 10 6)`
- `"KJF"` ，将消息分组为 `(11 10 6)`

注意，消息不能分组为 `(1 11 06)` ，因为 `"06"` 不能映射为 `"F"` ，这是由于 `"6"` 和 `"06"` 在映射中并不等价。

给你一个只含数字的 **非空** 字符串 `s` ，请计算并返回 **解码** 方法的 **总数** 。

题目数据保证答案肯定是一个 **32 位** 的整数。 

**示例 1：**

```
输入：s = "12"
输出：2
解释：它可以解码为 "AB"（1 2）或者 "L"（12）。
```

**示例 2：**

```
输入：s = "226"
输出：3
解释：它可以解码为 "BZ" (2 26), "VF" (22 6), 或者 "BBF" (2 2 6) 。
```

**示例 3：**

```
输入：s = "0"
输出：0
解释：没有字符映射到以 0 开头的数字。
含有 0 的有效映射是 'J' -> "10" 和 'T'-> "20" 。
由于没有字符，因此没有有效的方法对此进行解码，因为所有数字都需要映射。
```

**示例 4：**

```
输入：s = "06"
输出：0
解释："06" 不能映射到 "F" ，因为字符串含有前导 0（"6" 和 "06" 在映射中并不等价）。
```

**提示：**

- `1 <= s.length <= 100`
- `s` 只包含数字，并且可能包含前导零。

#### 题解:

![](/img/algorithm/common/dp/解码方法题解.png)

#### 代码实现1:

```java
//使用动态规划进行求解...
public int numDecodings(String s) {
    char[] array = s.toCharArray();
    int n = array.length;
    //dp[i]表示到达i索引位置的解码方案数
    int[] dp = new int[n];
    //初始化dp[0]和dp[1]
    dp[0] = array[0] == '0' ? 0 : 1;
    if (n == 1) return dp[0];
    //获取字符串第一个位置和第二个位置组成的数字num
    int num = (array[0] - '0') * 10 + (array[1] - '0');
    if (array[1] == '0') {
        if (num >= 1 && num <= 26) {
            dp[1] = 1;
        }else {
            return 0;
        }
    }else {
        if (num >= 1 && num <= 26) {
            dp[1] = 2;
        }else {
            dp[1] = 1;
        }
    }

    //从索引位置2进行dp更新:
    for (int i = 2; i < n; i++) {
        num = (array[i - 1] - '0') * 10 + (array[i] - '0');
        if (array[i - 1] == '0' && array[i] == '0') {
            return 0;
        }else if (array[i - 1] == '0') {
            dp[i] = dp[i - 1];
        }else if (array[i] == '0') {
            if (num >= 1 && num <= 26) {
                //例如"2101"的0字符位置,此时只有2,10这一种解码方式
                dp[i] = dp[i - 2];
            }else {
                return 0;
            }
        }else {
            //i - 1和i的位置的数字均不为0
            if (num >= 1 && num <= 26) {
                dp[i] = dp[i - 1] + dp[i - 2];
            }else {
                dp[i] = dp[i - 1];
            }
        }
    }
    //返回结果集
    return dp[n - 1];
}
```

#### 代码实现2:

```java
//对上面的动态规划代码进行优化,写的太拉跨了..
public int numDecodings(String s) {
    int n = s.length();
    char[] nums = s.toCharArray();
    //dp[i] : 表示前i个字符解码的方法个数
    int[] dp = new int[n + 1];
    dp[0] = 1;
    for (int i = 1; i <= n; i++) {
        //通过上面的思路我们知道dp[i] = dp[i - 1] + dp[i - 2];
        //这里巧妙地将dp[i - 1] 和 dp[i - 2]的两种情况分开讨论,如果nums[i - 1] == '0',nums[i - 2] == 0则dp[i] = 0(即初始值),最后迭代更新仍为0
        if (nums[i - 1] != '0') {
            dp[i] += dp[i - 1];
        }
        if (i >= 2 && (nums[i - 2] != '0') && (nums[i - 2] - '0') * 10 + (nums[i - 1] - '0') <= 26) {
            dp[i] += dp[i - 2];
        }
    }
    return dp[n];
}
```

## 368. 最大整除子集

#### 问题描述:

给你一个由 **无重复** 正整数组成的集合 `nums` ，请你找出并返回其中最大的整除子集 `answer` ，子集中每一元素对 `(answer[i], answer[j])` 都应当满足：

- `answer[i] % answer[j] == 0` ，或
- `answer[j] % answer[i] == 0`

如果存在多个有效解子集，返回其中任何一个均可。

**示例 1：**

```
输入：nums = [1,2,3]
输出：[1,2]
解释：[1,3] 也会被视为正确答案。
```

**示例 2：**

```
输入：nums = [1,2,4,8]
输出：[1,2,4,8] 
```

**提示：**

- `1 <= nums.length <= 1000`
- `1 <= nums[i] <= 2 * 109`
- `nums` 中的所有整数 **互不相同**

#### 代码实现:

```java
public List<Integer> largestDivisibleSubset(int[] nums) {
    int n = nums.length;
    Arrays.sort(nums);
    //dp[i]表示以nums[i]结束的最大子集元素的个数
    int[] dp = new int[n];
    //pre[i]记录当前nums[i]的上一个可以整除的元素的索引下标值
    int[] pre = new int[n];
    //我们初始化dp[0] = 0 : 自身不包括
    dp[0] = 0;
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[i] % nums[j] == 0 && dp[i] < dp[j] + 1) {
                dp[i] = dp[j] + 1;
                pre[i] = j;
            }
        }
    }
    //找到dp值最大的数组元素值以及其对应的下标
    int index = -1;
    int maxCount = Integer.MIN_VALUE;
    for (int i = 0; i < n; i++) {
        if (maxCount < dp[i]) {
            maxCount = dp[i];
            index = i;
        }
    }

    //定义一个计数器
    int cnt = 0;
    //定义结果集
    List<Integer> res = new ArrayList<>();
    //首先将本身元素添加到结果集中
    res.add(nums[index]);
    //因为我们计算dp值的时候,本身不包括在内,故这里的while条件依旧是 cnt < max
    while (cnt < maxCount) {
        index = pre[index];
        res.add(nums[index]);
        cnt++;
    }
    //返回结果集
    return res;
}
```

## 53. 最大子序和

给定一个整数数组 `nums` ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

**示例 1：**

```
输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
输出：6
解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。
```

**示例 2：**

```
输入：nums = [1]
输出：1
```

**示例 3：**

```
输入：nums = [0]
输出：0
```

**示例 4：**

```
输入：nums = [-1]
输出：-1
```

**示例 5：**

```
输入：nums = [-100000]
输出：-100000
```

**提示：**

- `1 <= nums.length <= 3 * 104`
- `-105 <= nums[i] <= 105`

```java
class Solution {
    public int maxSubArray(int[] nums) {
        int n = nums.length;
        //dp[i]表示以i位置结束的最大和的连续子数组的值
        int[] dp = new int[n];
        int res = nums[0];
        dp[0] = nums[0];
        for (int i = 1; i < n; i++) {
            dp[i] = Math.max(nums[i],dp[i - 1] + nums[i]);
            res = Math.max(res,dp[i]);
        }
        return res;
    }
}
```

## 62.63.64 不同路径问题综合

一个机器人位于一个 `m x n` 网格的左上角 （起始点在下图中标记为 “Start” ）。

机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。

问总共有多少条不同的路径？

**示例 1：**

![img](/img/algorithm/common/dp/robot_maze.png)

```
输入：m = 3, n = 7
输出：28
```

**示例 2：**

```
输入：m = 3, n = 2
输出：3
解释：
从左上角开始，总共有 3 条路径可以到达右下角。
1. 向右 -> 向下 -> 向下
2. 向下 -> 向下 -> 向右
3. 向下 -> 向右 -> 向下
```

**示例 3：**

```
输入：m = 7, n = 3
输出：28
```

**示例 4：**

```
输入：m = 3, n = 3
输出：6
```

**提示：**

- `1 <= m, n <= 100`
- 题目数据保证答案小于等于 `2 * 109`

```java
class Solution {
    public int uniquePaths(int m, int n) {
        //dp[i][j]表示到达该位置的路径个数
        int[][] dp = new int[m][n];
        
        //初始化
        for (int i = 0; i < n; i++) {
            dp[0][i] = 1;
        }
        for (int i = 0; i < m; i++) {
            dp[i][0] = 1;
        }

        //更新状态
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
            }
        }
       //返回结果集 
        return dp[m - 1][n - 1];
    }
}
```

> 其中LeetCode63,63题和上面这题类似，我们统一放置63,64的代码

```java
//63题 
一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为“Start” ）。
机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为“Finish”）。
现在考虑网格中有障碍物：obstacleGrid[i][j] = 1。那么从左上角到右下角将会有多少条不同的路径？
class Solution {
    public int uniquePathsWithObstacles(int[][] obstacleGrid) {
        int row = obstacleGrid.length;
        int col = obstacleGrid[0].length;
        int[][] dp = new int[row][col];
        for (int i = 0; i < row; i++) {
            if (obstacleGrid[i][0] == 1) {
                break;
            }
            dp[i][0] = 1;
        }
        for (int i = 0; i < col; i++) {
            if (obstacleGrid[0][i] == 1) {
                break;
            }
            dp[0][i] = 1;
        }

        for (int i = 1; i < row; i++) {
            for (int j = 1; j < col; j++) {
                if (obstacleGrid[i][j] == 1) {
                    continue;
                }
                dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
            }
        }
        
        return dp[row - 1][col - 1];
    }
}
```

```java
//64题
给定一个包含非负整数的 m x n 网格 grid ，请找出一条从左上角到右下角的路径，使得路径上的数字总和为最小。
说明：每次只能向下或者向右移动一步。
class Solution {
   public int minPathSum(int[][] grid) {
        int row = grid.length;
        int col = grid[0].length;
        //初始化
        int[][] dp = new int[row][col];
        dp[0][0] = grid[0][0];
        for (int i = 1; i < col; i++) {
            dp[0][i] = dp[0][i - 1] + grid[0][i];
        }
        for (int i = 1; i < row; i++) {
            dp[i][0] = dp[i - 1][0] + grid[i][0];
        }
		//更新状态
        for (int i = 1; i < row; i++) {
            for (int j = 1; j < col; j++) {
                dp[i][j] = Math.min(dp[i - 1][j],dp[i][j - 1]) + grid[i][j];
            }
        }
        
        //返回结果集
        return dp[row - 1][col - 1];
    }
}
```

## 70. 爬楼梯

假设你正在爬楼梯。需要 *n* 阶你才能到达楼顶。

每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？

**注意：**给定 *n* 是一个正整数。

**示例 1：**

```
输入： 2
输出： 2
解释： 有两种方法可以爬到楼顶。
1.  1 阶 + 1 阶
2.  2 阶
```

**示例 2：**

```
输入： 3
输出： 3
解释： 有三种方法可以爬到楼顶。
1.  1 阶 + 1 阶 + 1 阶
2.  1 阶 + 2 阶
3.  2 阶 + 1 阶
```

```java
class Solution {
    public int climbStairs(int n) {
        int[] dp = new int[n + 1];
        if (n == 1) return 1;
        dp[0] = 1;
        dp[1] = 1;
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }
}
```

## 96. 不同的二叉搜索树

给你一个整数 `n` ，求恰由 `n` 个节点组成且节点值从 `1` 到 `n` 互不相同的 **二叉搜索树** 有多少种？返回满足题意的二叉搜索树的种数。

**示例 1：**

![img](/img/algorithm/common/dp/uniquebstn3.jpg)

```
输入：n = 3
输出：5
```

**示例 2：**

```
输入：n = 1
输出：1
```

**提示：**

- `1 <= n <= 19`

```java
class Solution {
    public int numTrees(int n) {
        if (n == 1) return 1;
        //定义dp数组： 其中dp[i]表示1到i这i个节点能够构成二叉排序树的种类个数
        //设F(i,n)是n个节点，以i作为根节点构成的二叉排序树的种类个数
        //则有dp[n] = ∑F(i,n),i∈[1,n]    其中F(i,n) ==> (1,i - 1)放在i节点的左侧，(i + 1,n)放到i节点的右侧，故F(i,n) = dp[i - 1] * dp[n - i]
        int[] dp = new int[n + 1];
        dp[0] = 1;
        dp[1] = 1;
        for (int i = 2; i <= n; i++) {  //dp[i]
            for (int j = 1; j <= i; j++) {   
                //dp[i] = F(1,i) + F(2,i) + F(3,i) + ... + F(i,i)
                //其中F(j,i) = dp[j - 1] * dp[i - j]
                dp[i] += dp[j - 1] * dp[i - j];
            }
        }
        return dp[n];
    }
}
```

## 97. 交错字符串

给定三个字符串 `s1`、`s2`、`s3`，请你帮忙验证 `s3` 是否是由 `s1` 和 `s2` **交错** 组成的。

两个字符串 `s` 和 `t` **交错** 的定义与过程如下，其中每个字符串都会被分割成若干 **非空** 子字符串：

- `s = s1 + s2 + ... + sn`
- `t = t1 + t2 + ... + tm`
- `|n - m| <= 1`
- **交错** 是 `s1 + t1 + s2 + t2 + s3 + t3 + ...` 或者 `t1 + s1 + t2 + s2 + t3 + s3 + ...`

**提示：**`a + b` 意味着字符串 `a` 和 `b` 连接。

**示例 1：**

![img](/img/algorithm/common/dp/interleave.jpg)

```
输入：s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"
输出：true
```

**示例 2：**

```
输入：s1 = "aabcc", s2 = "dbbca", s3 = "aadbbbaccc"
输出：false
```

**示例 3：**

```
输入：s1 = "", s2 = "", s3 = ""
输出：true
```

**提示：**

- `0 <= s1.length, s2.length <= 100`
- `0 <= s3.length <= 200`
- `s1`、`s2`、和 `s3` 都由小写英文字母组成

```java
class Solution {
    public boolean isInterleave(String s1, String s2, String s3) {
        int m = s1.length();
        int n = s2.length();
        int l = s3.length();
        if (m + n != l) return false;
        //dp[i][j]表示s1的前i个字符和s2的前j个字符能够构成s3的前i + j个字符交错字符串
        //状态转移方程：
        //(1)如果第s3的第i + j个字符和s1的第i个字符相等，则取决于dp[i - 1][j]
        //(2)如果第s3的第i + j个字符和s2的第j个字符相等，则取决于dp[i][j - 1]
        boolean[][] dp = new boolean[m + 1][n + 1];
        dp[0][0] = true;
        for (int i = 0; i <= m; i++) {
            for (int j = 0; j <= n; j++) {
                int p = i + j - 1;
                if (i > 0) {
                    dp[i][j] = dp[i][j] || (dp[i - 1][j] && s1.charAt(i - 1) == s3.charAt(p));
                }
                if (j > 0) {
                    dp[i][j] = dp[i][j] || (dp[i][j - 1] && s2.charAt(j - 1) == s3.charAt(p));
                }
            }
        }
        return dp[m][n];
    }
}
```

