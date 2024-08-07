---
title: 贪心算法
---

# 1.贪心算法介绍

贪心算法和动态规划算法的情况相同,通常用来求解**最优解问题**,即量的最大化和或者最小化问题.然而,贪心算法不像动态规划算法,它通常包含了一个用以寻找局部最优解的迭代过程.在某些实例中,这些局部最优解转变成了全局最优解,而在另外一些情况下,则无法找到最优解.

贪心算法在少量计算的基础上做出了正确猜想而不急于考虑以后的情况,这样,它一步步地构筑解,每一步均是建立在局部最优解的基础之上,而每一步又都扩大了部分解的规模,做出的选择产生最大的直接收益而又保持可行性.因为每一步的工作很少且基于少量信息,所得算法特别有效.

**设计贪心算法的困难部分就是在证明该算法确实是求解了它所要解决的问题.**

注意:后面笔记内容Prim算法求解最下生成树问题也是贪心算法,这里没有进行介绍讲解.

**贪心算法的核心要点:由局部最优到整体最优**

与动态规划的联系:贪心算法和动态规划一样通常都是用来求解最优解问题,往往动态规划能够解决的问题,贪心都是进行实现!!!

# 2.贪心算法典型例题讲解

## 1 电台覆盖问题

### 题目描述:

![](/img/algorithm/common/greedy/6.png)

### 思路分析:

#### 第一步:

![](/img/algorithm/common/greedy/11.png)

#### 第二步:

![](/img/algorithm/common/greedy/12.png)

#### 第三步:

![](/img/algorithm/common/greedy/3.png)

#### 第四步:

![](/img/algorithm/common/greedy/14.png)

#### 第五步:

![](/img/algorithm/common/greedy/15.png)

##### 代码实现:

```java
public class GreedyAlgorithm {
    public static void main(String[] args) {
        //测试主程序
        //创建广播电台,放入到Map
        HashMap<String, HashSet<String>> broadcasts = new HashMap<String, HashSet<String>>();
        //将各个电台放入到broadcasts
        //总共存在五个电台频道
        //电台频道1
        HashSet<String> broadcast1 = new HashSet<String>();
        broadcast1.add("北京");
        broadcast1.add("上海");
        broadcast1.add("天津");
        //电台频道2
        HashSet<String> broadcast2 = new HashSet<String>();
        broadcast2.add("广州");
        broadcast2.add("北京");
        broadcast2.add("深圳");
        //电台频道3
        HashSet<String> broadcast3 = new HashSet<String>();
        broadcast3.add("成都");
        broadcast3.add("上海");
        broadcast3.add("杭州");
        //电台频道4
        HashSet<String> broadcast4 = new HashSet<String>();
        broadcast4.add("上海");
        broadcast4.add("天津");
        //电台频道五
        HashSet<String> broadcast5 = new HashSet<String>();
        broadcast5.add("杭州");
        broadcast5.add("大连");
        //将五个频道加入到map中
        broadcasts.put("K1", broadcast1);
        broadcasts.put("K2", broadcast2);
        broadcasts.put("K3", broadcast3);
        broadcasts.put("K4", broadcast4);
        broadcasts.put("K5", broadcast5);

        //定义一个HashSet:allAreas 存放所有的地区
        //利用HashSet的不可重复性村存储的特性
        HashSet<String> allAreas = new HashSet<String>();
        for (Map.Entry<String, HashSet<String>> entry : broadcasts.entrySet()) {
            for (String s : entry.getValue()) {
                allAreas.add(s);
            }
        }

        //创建一个集合ArrayList :用来存放最后选择的最佳的电台频道的集合
        List<String> selects = new ArrayList<>();

        //定义一个临时的集合,用来在遍历的时候存放电台覆盖的地区和当前还没有覆盖的地区的交集
        HashSet<String> tempSet = new HashSet<>();

        //定义maxKey保存在一次遍历过程中,能够覆盖最大未覆盖的地区对应的电台的key值
        //如果每次遍历结束,maxKey不为null,则将其加入到selects中
        String maxKey = null;
        while (allAreas.size() != 0) {//若allAreas不为0,则表示还没有覆盖到所有的的区域
            //每次在进行while时,需要先将之前的maxKey重新置空,以免影响后面贪心算法的判断
            maxKey = null;
            //遍历broadcasts,取出对应的key
            for (String key : broadcasts.keySet()) {
                //在每次for循环时,需要将上一轮的tempSet置空
                tempSet.clear();
                //获取当前这个key(电台)能够覆盖的地区
                HashSet<String> ares = broadcasts.get(key);
                //将其全部加入到tempSet中
                tempSet.addAll(ares);
                //求出tempSet和allAreas的交集,交集赋值给tempSet
                tempSet.retainAll(allAreas);
                //如果当前这个集合包含未覆盖地区的数量,比maxKey指向的集合地区还要多
                //则重新将当前key设置为新的maxKey
                //其中:tempSet.size() > broadcasts.get(maxKey).size()体现了贪心算法的思想
                if (tempSet.size() > 0 &&
                        (maxKey == null || tempSet.size() > broadcasts.get(maxKey).size())) {
                    maxKey = key;
                }
            }
            //一次for循环结束,若此时maxKey不为空,则将其加入到selects中
            if (maxKey != null) {
                selects.add(maxKey);
                //同时将此时maxKey指向的电台的覆盖的地区,从allAreas中去除掉
                allAreas.removeAll(broadcasts.get(maxKey));
            }

        }

        //while循环结束掉以后,则selects集合中保存着最后最优的电台选择策略
        System.out.println("最优的电台选择策略为:" + selects);     
    }
}
注意:上面思路代码可能实现有点繁琐,你可以根据自己语言+上面的思路进行代码的实现!!
```

## 55. 跳跃游戏I 

给定一个非负整数数组，你最初位于数组的第一个位置。

数组中的每个元素代表你在该位置可以跳跃的最大长度。

判断你是否能够到达最后一个位置。

**示例 1:**

```java
输入: [2,3,1,1,4]
输出: true
解释: 我们可以先跳 1 步，从位置 0 到达 位置 1, 然后再从位置 1 跳 3 步到达最后一个位置。
```

**示例 2:**

```java
输入: [3,2,1,0,4]
输出: false
解释: 无论怎样，你总会到达索引为 3 的位置。但该位置的最大跳跃长度是 0 ， 所以你永远不可能到达最后一个位置。
```

### 思路1:覆盖上色方法

### 图解:

![](/img/algorithm/common/greedy/31.png)

![](/img/algorithm/common/greedy/32.png)

### 代码实现:

```java
public boolean canJump(int[] nums) {
    //如果nums数组的长度为1:直接返回true:因为起点即为最后一个位置
    if (nums.length == 1) return true;

    int cmp = 0;//表示刚开始的比较的能跨越的上色长度
    int len = nums.length - 1;//能够到达最后一个位置

    for (int i = 0; i < len; i++) {//遍历0~len-1位置,覆盖到达最远距离
        int scope = nums[i] + i;//记录当前位置能够到达的最远位置(索引)
        cmp = Math.max(cmp,scope);//与上个位置能够到达位置进行比较:更新cmp值
        if (cmp == 0) {//如果当前cmp值为0:则返回false
            return false;
        }
        if (cmp == i && nums[i] == 0) {//如果最远能到达当前位置,但是当前位置能跳跃的最大长度为0,则返回flase
            return false;
        }
        if (cmp >= len) {//如果能够到达的最远位置>=len,则肯定可以到达数组的最后一个位置,返回true
            return true;
        }
    }
    //for循环遍历结束,仍未返回值,则说明无法到达最后一个位置,返回false
    return false;
}
```

### 思路2:贪心算法实现

我们可以用**贪心的方法**解决这个问题。
设想一下，对于数组中的任意一个位置 y，我们如何判断它是否可以到达？根据题目的描述，只要存在一个位置 x，它本身可以到达，并且它跳跃的最大长度为 x +nums[x]，这个值大于等于 y，即 x + nums[x]  ≥  y，那么位置 y 也可以到达。
换句话说，对于每一个可以到达的位置 x，它使得x+1,x+2,⋯,x+nums[x] 这些连续的位置都可以到达。
这样以来，我们依次遍历数组中的每一个位置，并实时维护 最远可以到达的位置。对于当前遍历到的位置 x，如果它在 最远可以到达的位置 的范围内，那么我们就可以从起点通过若干次跳跃到达该位置，因此我们可以用 x+ nums[x] 更新 最远可以到达的位置。
在遍历的过程中，如果 最远可以到达的位置 大于等于数组中的最后一个位置，那就说明最后一个位置可达，我们就可以直接返回 True 作为答案。反之，如果在遍历结束后，最后一个位置仍然不可达，我们就返回 False 作为答案。
以题目中的示例一

```java
[2, 3, 1, 1, 4]
```

为例：
我们一开始在位置 0，可以跳跃的最大长度为 2，因此最远可以到达的位置被更新为 2；
我们遍历到位置 1，由于 1≤2，因此位置1可达。我们用1加上它可以跳跃的最大长度3，将最远可以到达的位置更新为 4。由于 4 大于等于最后一个位置 4，因此我们直接返回 True。
我们再来看看题目中的示例二

```java
[3, 2, 1, 0, 4]
```

我们一开始在位置 0，可以跳跃的最大长度为 3，因此最远可以到达的位置被更新为 3；
我们遍历到位置 1，由于 1≤3，因此位置 1可达，加上它可以跳跃的最大长度 2 得到 3，没有超过最远可以到达的位置；
位置 2、位置 3同理，最远可以到达的位置不会被更新；
我们遍历到位置 4，由于 4>3，因此位置 4 不可达，我们也就不考虑它可以跳跃的最大长度了。
在遍历完成之后，位置 4 仍然不可达，因此我们返回 False。

### 代码实现:

```java
 public boolean canJump(int[] nums) {
     int n = nums.length;
     int rightmost = 0;
     for (int i = 0; i < n; ++i) {
         if (i <= rightmost) {
             rightmost = Math.max(rightmost, i + nums[i]);
             if (rightmost >= n - 1) {
                 return true;
             }
         }
     }
     return false;
 }
```

### 思路3：反向查找法

```java
public boolean canJump01(int[] nums) {
    //获取nums数组的长度
    int n = nums.length;
    //我们定义isVisited数组：记录该位置是否可以到达
    boolean[] isVisited = new boolean[n];
    isVisited[0] = true;

    for (int i = 0; i < n; i++) {
        if (isVisited[n - 1]) {
            return  true;
        }
        if (isVisited[i]) {
            int location = nums[i] + i;
            for (int j = i + 1; j <= location; j++) {
                if (j < n) {
                    isVisited[j] = true;
                }else {
                    break;
                }
            }
        }
    }
    return false;
}
```

## 45. 跳跃游戏II

给定一个非负整数数组，你最初位于数组的第一个位置。

数组中的每个元素代表你在该位置可以跳跃的最大长度。

你的目标是使用最少的跳跃次数到达数组的最后一个位置。

**示例:**

```java
输入: [2,3,1,1,4]
输出: 2
解释: 跳到最后一个位置的最小跳跃数是 2。
     从下标为 0 跳到下标为 1 的位置，跳 1 步，然后跳 3 步到达数组的最后一个位置。
```

**说明:**

假设你总是可以到达数组的最后一个位置。

### 贪心算法实现1:(反向查找)

因为题设已经假设我们能够到达最后的位置;
所以我们可以假设我们使用贪心算法:遍历数组:
定义变量:
location: 表示到达的位置(起始为数组的最后一个位置)
step : 花费的步数
nums[i] + i : 当前i下标位置能够到达最远的下标位置
(1)选择在到达最后一个位置的前一个位置:距离最后一个位置最远的位置,即数组索引越小的下标位置
(2)依次再选择距离倒数第二个位置最远的位置...最后直到找到数组的开始位置停止查找
注意:每次选择完最优位置以后,将步数加1
(3)最后得到从起始位置到达最后位置所花费的最短步数(step)

### 图解:

以数组{2,3,1,2,4,2,3}为例:第一次我们的location为最后一个位置,遍历起始位置到倒数第二个位置:找到能够到达3的最远位置为4;
更新location为4的位置,并step++:继续遍历起始位置到4位置前的2位置,找到能够到达4的最远位置为3;
继续更新location为3的位置并将step++:此时找到能够到达3位置的最远位置为索引0
更新location为0,并将step++,进行下一轮的while循环,但是此时location == 0,不满足条件,则退出循环,返回花费的步数step

![](/img/algorithm/common/greedy/21.png)

##### 代码实现:

```java
public int jump(int[] nums) {
    //定义到达的位置坐标:开始为数组的最后位置
    int location = nums.length - 1;
    //定义花费的步数
    int step = 0;
    while (location > 0) {
        for (int i = 0; i < location; i++) {
            if (nums[i] + i >= location) {
                //如果从0下标开始遍历数组:找到第一个能够到达当前location位置的最小下标
                //将到达的位置下标改为i
                location = i;
                //花费的步数加1
                step++;
                //同时,结束当前内部的for循环,进行下一轮到达新的location位置的最小下标的查找
                break;
            }
        }
    }
    //while循环结束,返回花费的最少步数
    return step;
}
```

### 贪心算法实现2(正向查找):

上一种反向查找的时间复杂度比较高(while + for):最坏情况O(n^2)

如果我们「贪心」地进行正向查找，每次找到可到达的最远位置，就可以在线性时间内得到最少的跳跃次数。

定义变量:

maxlocation : 能够到达的最远位置

end : 边界

step: 花费的步数

从0索引开始遍历数组:[遍历条件:遍历索引i < nums.length - 1]

(1)在到达上一轮的最远位置的边界前,选择能够到达的最远位置,进行maxlocation的更新;

(2)到达边界end时,更新新的边界为这一轮能够到达的最远位置maxlocation,

同时将花费的步数step加1;

注意:在遍历数组时,我们不访问最后一个元素，这是因为在访问最后一个元素之前，我们的边界一定大于等于最后一个位置，否则就无法跳到最后一个位置了。如果访问最后一个元素，在边界正好为最后一个位置的情况下，我们会增加一次「**不必要的跳跃次数**」，因此我们不必访问最后一个元素

##### 图解:

例如，对于数组[2,3,1,2,4,2,3]，初始位置是下标 0，从下标 0 出发，最远可到达下标 2。

下标0 可到达的位置中，下标 1 的值是 3，从下标 1 出发可以达到更远的位置，因此第一步到达下标 1。

从下标1 出发，最远可到达下标 4。下标 1 可到达的位置中，下标 4 的值是 4 ，从下标 4 

出发可以达到更远的位置，因此第二步到达下标4。

![](/img/algorithm/common/greedy/22.png)

##### 代码实现:

```java
public int jump(int[] nums) {
    //获取nums数组的长度
    int len = nums.length;
    //定义一个步数的计数器
    int step = 0;
    //定义一个边界
    int end = 0;
    //定义一个maxLocation : 表示能够到达的最远位置
    int maxLocation = 0;
    for (int i = 0; i < len - 1; i++) {//注意i < len - 1:因为开始的时候end为0,步数增加一次,如果最后i刚好等于len - 1:又增加一次step,导致结果花费的步数比实际值多1
        maxLocation = Math.max(maxLocation,nums[i] + i);
        if (end == i) {
            //将边界更新为这一轮能够到达的最远位置
            end = maxLocation;
            //花费的步数加1
            step++;
        }
    }
    return step;
}
```

## 763. 划分字母区间问题

字符串 `S` 由**小写字母组成**。我们要把这个字符串划分为尽可能多的片段，**同一字母最多出现在一个片段中**。返回一个表示每个字符串片段的长度的列表。

**示例：**

```java
输入：S = "ababcbacadefegdehijhklij"
输出：[9,7,8]
解释：
划分结果为 "ababcbaca", "defegde", "hijhklij"。
每个字母最多出现在一个片段中。
像 "ababcbacadefegde", "hijhklij" 的划分是错误的，因为划分的片段数较少。
```

**提示：**

- `S`的长度在`[1, 500]`之间。
- `S`只包含小写字母 `'a'` 到 `'z'` 。

### 思路分析:贪心+双指针

由于同一个字母只能出现在同一个片段，显然同一个字母的第一次出现的下标位置和最后一次出现的下标位置必须出现在同一个片段。因此需要遍历字符串，**得到每个字母最后一次出现的下标位置**。

在得到每个字母最后一次出现的下标位置之后，可以使用贪心算法和双指针的方法将字符串划分为尽可能多的片段，具体做法如下。

从左到右遍历字符串，遍历的同时维护当前片段的开始下标 start 和结束下标 end，初始时 start=end=0。

对于每个访问到的字母 c，得到当前字母的最后一次出现的下标位置 endc，则当前片段的结束下标一定不会小于 endc，因此令end=max(end,endc)。

当访问到下标 end 时，当前片段访问结束，当前片段的下标范围是 [start,end]，长度为end−start+1，将当前片段的长度添加到返回值，然后令 start=end+1，继续寻找下一个片段。

重复上述过程，直到遍历完字符串。

上述做法**使用贪心的思想寻找每个片段可能的最小结束下标，因此可以保证每个片段的长度一定是符合要求的最短长度，如果取更短的片段，则一定会出现同一个字母出现在多个片段中的情况。由于每次取的片段都是符合要求的最短的片段，因此得到的片段数也是最多的。**

由于每个片段访问结束的标志是访问到下标 end，因此对于每个片段，可以保证当前片段中的每个字母都一定在当前片段中，不可能出现在其他片段，可以保证同一个字母只会出现在同一个片段。

![](/img/algorithm/common/greedy/41.png)

![](/img/algorithm/common/greedy/42.png)

##### 代码实现:

```java
public List<Integer> partitionLabels(String S) {
    //定义一个结果集res:用来存储最后的结果res
    List<Integer> res = new ArrayList<>();
    int len = S.length();
    //如果S为null或者长度为0直接返回一个空的res
    if (S == null || len == 0)
        return res;
    //定义LastArr:保存字符串每一个出现的字符在其中出现的最大索引
    int[] lastArr = new int[26];
    for (int i = 0; i < len; i++) {
        lastArr[S.charAt(i) - 'a'] = i;
    }
    //定义两个指针:start,end,初始化指向字符串索引为0的位置
    int start = 0;
    int end = 0;
    for (int i = 0; i < len; i++) {
        int cmp = lastArr[S.charAt(i) - 'a'];
        end = Math.max(end,cmp);
        //当i == end:说明到达当前的最大片段
        if (i == end) {
            //表示此时[start,end]构成最大片段
            res.add(end - start + 1);
            //将start指向下一个
            start = end + 1;
        }
    }
    //返回结果集
    return res;
}
```

## 11. 盛最多水的容器

https://leetcode-cn.com/problems/container-with-most-water/

给你 `n` 个非负整数 `a1，a2，...，a``n`，每个数代表坐标中的一个点 `(i, ai)` 。在坐标内画 `n` 条垂直线，垂直线 `i` 的两个端点分别为 `(i, ai)` 和 `(i, 0)` 。找出其中的两条线，使得它们与 `x` 轴共同构成的容器可以容纳最多的水。

**说明：**你不能倾斜容器。

**示例 1：**

![img](/img/algorithm/common/greedy/盛最多水的容器.jpg)

```
输入：[1,8,6,2,5,4,8,3,7]
输出：49 
解释：图中垂直线代表输入数组 [1,8,6,2,5,4,8,3,7]。在此情况下，容器能够容纳水（表示为蓝色部分）的最大值为 49。
```

**示例 2：**

```
输入：height = [1,1]
输出：1
```

**示例 3：**

```
输入：height = [4,3,2,1,4]
输出：16
```

**示例 4：**

```
输入：height = [1,2,1]
输出：2
```

**提示：**

- `n = height.length`
- `2 <= n <= 3 * 104`
- `0 <= height[i] <= 3 * 104`

### 题解：

> 我们采取的是贪心的思想：
>
> 首先定义左边界left和右边界right分别位于height数组的索引为0和索引为最后一个位置
>
> 然后我们以left和right索引对应的最小高度作为容器的高度，两点之间的距离作为容器的宽度，计算对应的面积
>
> 接着此时我们选择的策略是：移动较小的高度的索引！！！！

```java
public int maxArea(int[] height) {
    int res = 0;
    int n = height.length;
    if (n == 0) return 0;
    //定义左边界，右边界
    int left = 0;
    int right = n - 1;
    while (left < right) {
        int min = Math.min(height[left],height[right]);
        //计算面积
        int area = min * (right - left);
        res = Math.max(res,max);
        //选择移动的策略
        if (min == height[left]) {
            left++;
        }else {
            right--;
        }
    }
    return res;
}
```

## 122. 买卖股票的最佳时机 II

https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-ii/

给定一个数组 `prices` ，其中 `prices[i]` 是一支给定股票第 `i` 天的价格。

设计一个算法来计算你所能获取的最大利润。你可以尽可能地完成更多的交易（**多次买卖一支股票**）。

**注意：**你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。

**示例 1:**

```
输入: prices = [7,1,5,3,6,4]
输出: 7
解释: 在第 2 天（股票价格 = 1）的时候买入，在第 3 天（股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5-1 = 4 。
     随后，在第 4 天（股票价格 = 3）的时候买入，在第 5 天（股票价格 = 6）的时候卖出, 这笔交易所能获得利润 = 6-3 = 3 。
```

**示例 2:**

```
输入: prices = [1,2,3,4,5]
输出: 4
解释: 在第 1 天（股票价格 = 1）的时候买入，在第 5 天 （股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5-1 = 4 。
     注意你不能在第 1 天和第 2 天接连购买股票，之后再将它们卖出。因为这样属于同时参与了多笔交易，你必须在再次购买前出售掉之前的股票。
```

**示例 3:**

```
输入: prices = [7,6,4,3,1]
输出: 0
解释: 在这种情况下, 没有交易完成, 所以最大利润为 0。
```

**提示：**

- `1 <= prices.length <= 3 * 104`
- `0 <= prices[i] <= 104`

### 思路1：动态规划

> 我们假设prices数组的长度为n，定义dp数组：dp[n] [2]
>
> 其中：
>
> dp[i] [0]表示到达第i天，自己手上没有持有股票获得的最大利润
>
> dp[i] [1]表示到达第i天，自己手上持有股票获得的最大利润
>
> 我们进行dp数组的初始化，即第一天
>
> dp[0] [0] = 0 ,什么都没干，0利润
>
> dp[0] [1] = -prices[0]  ，第一天买了股票，利润为负值
>
> 然后我们进行动态转移方程的推敲：
>
> 到达第i天，对于dp[i] [0]，我们存在两种策略
>
> （1）继续保持不变，即不持有第i天的股票
>
> （2）选择在dp[i - 1] [1]持有股票的基础上，以第i天的价格将股票卖出

$$
dp[i] [0] = max(dp[i - 1] [1] + prices[i]，dp[i - 1] [0]);
$$

> 同理，对于第i天，dp[i] [1]：
> （1）要么保持不变
>
> （2）以第i天的价格买出股票

$$
dp[i] [1] = max(dp[i - 1] [0] - prices[i]，dp[i - 1] [1]);
$$

> 最后获得的最大利润为dp[n - 1] [0]，即第n天不持有股票的状态
>
> 因为到达最后一天，我们如果不持有股票，购买这支股票，当前利润一定降低，即dp[n - 1] [0] > dp[n - 1] [1]
>
> 因为下面dp[n - 1] [0]获取的两种状态的值 均大于 dp[n - 1] [1]获得两种状态

$$
dp[n - 1] [0] = max(dp[n - 2] [1] + prices[n - 1]，dp[n - 2] [0]);

dp[n - 1] [1] = max(dp[n - 2] [0] - prices[n - 1]，dp[n - 2] [1]);
$$

```java
public int maxProfit(int[] prices) {
    int n = prices.length;
    int[][] dp = new int[n][2];
    //初始化
    dp[0][0] = 0;
    dp[0][1] = -prices[0];
    //更新状态
    for (int i = 1; i < n; i++) {
        dp[i][0] = Math.max(dp[i - 1][0],dp[i - 1][1] + prices[i]);
        dp[i][1] = Math.max(dp[i - 1][1],dp[i - 1][0] - prices[i]);
    }
    return dp[n - 1][0];
}
```

### 思路2：贪心算法求解

![](/img/algorithm/common/greedy/股票问题.png)



```java
//使用贪心算法进行求解:思路简便
public int maxProfit(int[] prices) {
    //记录最大利润值
    int maxProfit = 0;
    //只关注前面的股票价格比后面的股票价格少的情况
    for (int i = 1; i < prices.length; i++) {
        if (prices[i] > prices[i - 1]) {
            maxProfit = maxProfit + (prices[i] - prices[i - 1]);
        }
    }
    return maxProfit;
}
```

## 134. 加油站

https://leetcode-cn.com/problems/gas-station/

在一条环路上有 ***N* 个加油站，其中第 *i* 个加油站有汽油 `gas[i]` 升**。

你有一辆油箱容量无限的的汽车，从第 *i* 个加油站开往第 *i + 1* 个加油站需要消耗汽油 `cost[i]` 升。你从其中的一个加油站出发，开始时油箱为空。

如果你可以绕环路行驶一周，则返回出发时加油站的编号，否则返回 -1。

**说明:** 

- 如果题目有解，该答案即为唯一答案。
- 输入数组均为非空数组，且长度相同。
- 输入数组中的元素均为非负数。

**示例 1:**

```
输入: 
gas  = [1,2,3,4,5]
cost = [3,4,5,1,2]

输出: 3

解释:
从 3 号加油站(索引为 3 处)出发，可获得 4 升汽油。此时油箱有 = 0 + 4 = 4 升汽油
开往 4 号加油站，此时油箱有 4 - 1 + 5 = 8 升汽油
开往 0 号加油站，此时油箱有 8 - 2 + 1 = 7 升汽油
开往 1 号加油站，此时油箱有 7 - 3 + 2 = 6 升汽油
开往 2 号加油站，此时油箱有 6 - 4 + 3 = 5 升汽油
开往 3 号加油站，你需要消耗 5 升汽油，正好足够你返回到 3 号加油站。
因此，3 可为起始索引。
```

**示例 2:**

```
输入: 
gas  = [2,3,4]
cost = [3,4,3]

输出: -1

解释:
你不能从 0 号或 1 号加油站出发，因为没有足够的汽油可以让你行驶到下一个加油站。
我们从 2 号加油站出发，可以获得 4 升汽油。 此时油箱有 = 0 + 4 = 4 升汽油
开往 0 号加油站，此时油箱有 4 - 3 + 2 = 3 升汽油
开往 1 号加油站，此时油箱有 3 - 3 + 3 = 3 升汽油
你无法返回 2 号加油站，因为返程需要消耗 4 升汽油，但是你的油箱只有 3 升汽油。
因此，无论怎样，你都不可能绕环路行驶一周。
```

### 题解:

这里我的解法感觉不是贪心的，还不够贪！！！

```java
public int canCompleteCircuit(int[] gas, int[] cost) {
    int n = gas.length; //记录加油站的个数
    Set<Integer> set = new HashSet<>();
    for (int i = 0; i < n; i++) {
        //从第i个加油站开始
        if (gas[i] >= cost[i]) {
            set.add(i); //说明可以从该加油站出发
        }
    }

    for (Integer start : set) {
        int tank = 0;  //初始化油箱量为0
        for (int i = start; i < n; i++) {
            if (tank < 0) {
                break;
            }
            //更新此时的tank值
            tank = tank + (gas[i] - cost[i]);
        }
        if (tank < 0) continue;
        for (int i = 0; i < start; i++) {
            if (tank < 0) {
                break;
            }
            //更新此时的tank值
            tank = tank + (gas[i] - cost[i]);
        }
        if (tank < 0) continue;
        //否则此时我们坚持绕行了一周
        return start;
    }
    //说明最终未找到合适的加油站
    return -1;
}
```

## 406. 根据身高重建队列

https://leetcode-cn.com/problems/queue-reconstruction-by-height/

假设有打乱顺序的一群人站成一个队列，数组 `people` 表示队列中一些人的属性（不一定按顺序）。每个 `people[i] = [hi, ki]` 表示第 `i` 个人的身高为 `hi` ，前面 **正好** 有 `ki` 个身高大于或等于 `hi` 的人。

请你重新构造并返回输入数组 `people` 所表示的队列。返回的队列应该格式化为数组 `queue` ，其中 `queue[j] = [hj, kj]` 是队列中第 `j` 个人的属性（`queue[0]` 是排在队列前面的人）。

**示例 1：**

```
输入：people = [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]
输出：[[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]
解释：
编号为 0 的人身高为 5 ，没有身高更高或者相同的人排在他前面。
编号为 1 的人身高为 7 ，没有身高更高或者相同的人排在他前面。
编号为 2 的人身高为 5 ，有 2 个身高更高或者相同的人排在他前面，即编号为 0 和 1 的人。
编号为 3 的人身高为 6 ，有 1 个身高更高或者相同的人排在他前面，即编号为 1 的人。
编号为 4 的人身高为 4 ，有 4 个身高更高或者相同的人排在他前面，即编号为 0、1、2、3 的人。
编号为 5 的人身高为 7 ，有 1 个身高更高或者相同的人排在他前面，即编号为 1 的人。
因此 [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]] 是重新构造后的队列。
```

**示例 2：**

```
输入：people = [[6,0],[5,0],[4,0],[3,2],[2,2],[1,4]]
输出：[[4,0],[5,0],[2,2],[3,2],[1,4],[6,0]]
```

**提示：**

- `1 <= people.length <= 2000`
- `0 <= hi <= 106`
- `0 <= ki < people.length`
- 题目数据确保队列可以被重建

### 题解：

> 我拿到这道题,首先想到的是如果每一个人的身高如果都是不一样的,那么后面的k值均为0,只需要按照身高进行升序排序即为最后的结果,而此时,身高可能出现相同的值,即复杂了题目;
>
> 我们如果先排序身高小的,显然,身高小的位置确定以后,你并不知道前面存在哪些值,即对于前面大于等于你的身高元素无法确定
>
> 所以我们应当先选择将身高大先进行位置的摆放，而对于身高大，可能存在k值小的，也可能存在k值大的，显然，**先摆放k值小的，再摆放k值大的**，**因为相同的身高，k值大的一定在k值小的后面。**
>
> 故我们选择将people数组按照先身高降序,在k值升序进行排序处理[这里我们使用的是java的Arrays类的sort(数组名,排序规则)进行排序]
>
> 定义:

​	people 原二维数组

​    linkedlist<int[]> list :一维数组为元素的链表实现的集合list

​    int[][] res :结果集数组

![image-20210721150155217](/img/algorithm/common/greedy/根据身高排序问题.png)

```java
public int[][] reconstructQueue(int[][] people) {
    /*
        * 我们采取的的是贪心的思想，先加people二维数组按照先身高降序，如果身高相等，则按照K值的升序排序
        * 即先处理大数，在处理小数的策略！！！
        * */
    int n = people.length;
    Arrays.sort(people, new Comparator<int[]>() {
        @Override
        public int compare(int[] o1, int[] o2) {
            if (o1[0] == o2[0]) {
                //身高相等，按照k值升序
                return o1[1] - o2[1];
            }
            //按照身高降序
            return o2[0] - o1[0];
        }
    });
    //定义结果集数组
    int[][] res = new int[n][2];
    //定义LinkedList<int[]>集合：用于进行插入操作,我们使用它的add(index,element)进行指定索引的插入操作【如果出现相同位置存在值，则后面的元素进行右移【链表机制】】
    LinkedList<int[]> list = new LinkedList<>();
    for (int[] person : people) {
        list.add(person[1],person);
    }
    //将list按照顺序赋值给res中
    for (int i = 0; i < n; i++) {
        res[i] = list.get(i);
    }
    return res;
}
```

## 452. 用最少数量的箭引爆气球

https://leetcode-cn.com/problems/minimum-number-of-arrows-to-burst-balloons/

在二维空间中有许多球形的气球。对于每个气球，提供的输入是水平方向上，气球直径的开始和结束坐标。由于它是水平的，所以纵坐标并不重要，因此只要知道开始和结束的横坐标就足够了。开始坐标总是小于结束坐标。

一支弓箭可以沿着 x 轴从不同点完全垂直地射出。在坐标 x 处射出一支箭，若有一个气球的直径的开始和结束坐标为 `x``start`，`x``end`， 且满足  `xstart ≤ x ≤ x``end`，则该气球会被引爆。可以射出的弓箭的数量没有限制。 弓箭一旦被射出之后，可以无限地前进。我们想找到使得所有气球全部被引爆，所需的弓箭的最小数量。

给你一个数组 `points` ，其中 `points [i] = [xstart,xend]` ，返回引爆所有气球所必须射出的最小弓箭数。

**示例 1：**

```
输入：points = [[10,16],[2,8],[1,6],[7,12]]
输出：2
解释：对于该样例，x = 6 可以射爆 [2,8],[1,6] 两个气球，以及 x = 11 射爆另外两个气球
```

**示例 2：**

```
输入：points = [[1,2],[3,4],[5,6],[7,8]]
输出：4
```

**示例 3：**

```
输入：points = [[1,2],[2,3],[3,4],[4,5]]
输出：2
```

**示例 4：**

```
输入：points = [[1,2]]
输出：1
```

**示例 5：**

```
输入：points = [[2,3],[2,3]]
输出：1
```

**提示：**

- `1 <= points.length <= 104`
- `points[i].length == 2`
- `-231 <= xstart < xend <= 231 - 1`

### 题解：

![image-20210721151812469](/img/algorithm/common/greedy/452-1.png)

> 对于其中的任意一支箭，我们都通过上面描述的方法，将这支箭的位置移动到它对应的「**原本引爆的气球中最靠左的右边界位置**」，那么这些原本引爆的气球仍然被引爆。这样一来，所有的气球仍然都会被引爆，并且每一支箭的射出位置都恰好位于某一个气球的右边界了。
>
> 有了这样一个有用的断定，我们就可以快速得到一种最优的方法了。**考虑所有气球中右边界位置最靠左的那一个，那么一定有一支箭的射出位置就是它的右边界（否则就没有箭可以将其引爆了）**。当我们确定了一支箭之后，我们就可以将这支箭引爆的所有气球移除，并从剩下未被引爆的气球中，再选择右边界位置最靠左的那一个，确定下一支箭，直到所有的气球都被引爆。

![image-20210721154006601](/img/algorithm/common/greedy/452-2.png)

```java
public static int findMinArrowShots(int[][] points) {
        int n = points.length;  //获取points数组的长度
        //先将points数组按照右边界从小到大排序
        Arrays.sort(points, new Comparator<int[]>() {
            @Override
            public int compare(int[] o1, int[] o2) {
                //return o1[1] - o2[1];  存在越界返回不正确的值
                if (o1[1] > o2[1]) {
                    return 1;
                }else if (o1[1] < o2[1]) {
                    return -1;
                }else {
                    return 0;
                }
            }
        });
        int count  = 1;  //箭的个数
        int position = points[0][1]; //刚开始箭的位置
        for (int i = 1; i < n; i++) {
            if (points[i][0] > position) {
                position = points[i][1];
                ++count;
            }
        }
        return count;
    }
```

## Dijkstra算法求解最短路径问题

### DIjkstra算法介绍

迪杰斯特拉算法是由荷兰计算机科学家狄克斯特拉于1959 年提出的，因此又叫Dijkstra算法。**是从一个顶点到其余各顶点的最短路径算法，解决的是有权图中最短路径问题**。

迪杰斯特拉算法主要特点是以起始点为中心向外层层扩展，直到扩展到终点为止。迪杰斯特拉算法采用的是**贪心策略**，将Graph中的节点集分为最短路径计算完成的节点集S和未计算完成的节点集T，每次将从T中挑选V0->Vt最小的节点Vt加入S，并更新V0经由Vt到T中剩余节点的更短距离，直到T中的节点全部加入S中，它贪心就贪心在每次都选择一个距离源点最近的节点加入最短路径节点集合。

迪杰斯特拉算法只支持**非负权图**，它计算的是单源最短路径，即单个源点到剩余节点的最短路径，**时间复杂度为O(n²)**.

> 最短路径问题（这里我们只总结了有向图的算法，无向图过于复杂，如果想要了解，可以去看的高级数据结构笔记）

在以下**有向图**G=(V,E)中,假设每条边的长度为w[i],求出顶点V0到其他各个顶点的最短距离

![](/img/algorithm/common/greedy/有向图最短路径问题.png)

我们采取的策略是**贪心思想**:,思路图解如下图所示:

**第一步: 标记顶点0位原点,设置其已被访问**

![](/img/algorithm/common/greedy/有向图最短路径问题2.png)

**第二步: 找到顶点0到顶点的路径距离最短,将顶点3标记为已访问,并同步更新此时顶点0到其他顶点的距离;**

![](C:\Users\86180\Desktop\IT之家\☆算法笔记\贪心算法笔记\imgs\有向图最短路径问题3.png)

**第三步:此时找到顶点0到顶点1的路径最短,将顶点1标记为已访问,并同步更新此时顶点0到其他顶点的路径**

![](/img/algorithm/common/greedy/有向图最短路径问题4.png)

**重复上面的步骤:第四步**

![](/img/algorithm/common/greedy/有向图最短路径问题5.png)

**第五步:**

![](/img/algorithm/common/greedy/有向图最短路径问题6.png)

**第六步:**

![](/img/algorithm/common/greedy/有向图最短路径问题7.png)

**第七步:**

![](/img/algorithm/common/greedy/有向图最短路径问题8.png)

**第八步: 此时所有的顶点已经都被访问,原点到其他顶点的最短路径距离已经求出,算法结束**

![](/img/algorithm/common/greedy/有向图最短路径问题9.png)



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