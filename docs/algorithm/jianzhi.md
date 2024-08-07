---
title: 剑指Offer
---

## 面试题1 : 赋值运算符函数
省略...
## 面试题2 : 实现单例模式(Singleton)
省略...

## 面试题3 : 数组中重复的数字  
题目链接：
### 题目描述:

找出数组中重复的数字。

在一个长度为 n 的数组 nums 里的所有数字都在 0～n-1 的范围内。数组中某些数字是重复的，但不知道有几个数字重复了，也不知道每个数字重复了几次。请找出数组中任意一个重复的数字。

**示例 1：**

```javascript
输入：
[2, 3, 1, 0, 2, 5, 3]
输出：2 或 3 
```

**限制：**

`2 <= n <= 100000`

### 题目算法分析:

```javascript
方法1: 先进行排序,然后从头到尾进行扫描   时间复杂度: O(nlogn),即排序算法的时间复杂度 空间复杂度: O(1)

方法2: 利用哈希表的键的不可重复性进行存储数组元素,如果扫描到该数字已经存在于哈希表中,则返回结果
时间复杂度: O(n)   空间复杂度: O(n)

方法3: 最优算法  边遍历边比较的方法  时间复杂度: O(n) 空间复杂度: O(1)
该算法的实现思路简单讲解以下:
(1)从头到尾依次扫描该数组:
(2)当扫描到下标为i的数字时,首先比较该数字nums[i] 是否等于i ?
    如果等于i: 则说明该数字的位置是正确的,我们继续进行扫描
	如果不等于i: 则再拿nums[i]和第nums[i]个数字进行比较,如果相等,说明找到了一个重复的数字,即该数字在下标为i的位置和下标为nums[i]的位置都出现了.如果它和第nums[i]个数字不相等,就把第i个数字和第nums[i]个数字进行交换,把nums[i]放到属于它的位置上.接下来再进行这样的过程,直到发现一个重复的数字
如果最后未找到重复的数字,则返回-1
```

### 算法代码实现:

我们选择将这三种思路均进行实现,以下分别为java代码和javaScript的代码实现:

#### java代码实现: ![](/img/algorithm/jianzhi/找错专用图1.gif)

方法1中 数组的值在0~n-1的范围内，没说0~n-1范围内的值都存在，可能给的数组是[1,2,3,3]

上面那段话不重要，主要我想说的是： 不用判断下标，只要判断nums[i] 是否=nums[i+1]就好了

方法3和你的思路稍微有点不一样：

你是把当前数直接放到 对应的位置上去;（突然发现你的代码错了啊怎么是while，应该是if，不然 如果第一位 是2, 2和索引0一直不相等，不是一直死循环了吗= = ）

我是一直找当前位置上那个正确的数；好像你的方法更快~（虚心学习）

```java
方法1实现:
//首先对数组进行排序处理,因为数组为0~n-1,则若不重复,故数组的值不会重复
public int findRepeatNumber01(int[] nums) {
    //首先对数组进行排序操作
    Arrays.sort(nums);//首先对nums进行排序处理
    //遍历排序以后的数组
    for (int i = 0; i < nums.length - 1; i++) {
        //根据上面TMX的指导,我们之间比较nums[i] == nums[i + 1] ??
        if(nums[i] == nums[i + 1]) {
            return nums[i];
        }
    }
    //若未找到,则返回-1
    return -1;
}

方法2实现:
//使用哈希表进行求解
public int findRepeatNumber02(int[] nums) {
    //定义一个哈希表
    HashSet<Integer> set = new HashSet<>();
    for (int i = 0; i < nums.length; i++) {
        if (set.contains(nums[i])) {
            //找到重复值,返回该值
            return nums[i];
        }else {
            //如果不包含该nums[i],则进行添加
            set.add(nums[i]);
        }
    }
    //如果未找到重复的数字,返回-1
    return  -1;
}

方法3实现:
public int findRepeatNumber(int[] nums) {
    int length = nums.length;
    if (nums.length == 0) {
        return -1;//若数组长度为0,则返回-1
    }
    for (int i = 0; i < length; i++) {
        if (nums[i] != i) {
            //若发现i位置的值和nums[i]位置的值相等,说明找到一个重复的数字
            //if (nums[i] == nums[nums[i]]);
            return nums[i];
        }
        int temp = nums[i];
        nums[i] = nums[temp];
        nums[temp] = temp;
    }
    //最终for循环结束,若仍然未找到重复的值,则返回-1
    return -1;
}
```

#### javaScript代码实现:

```javascript
方法1实现:
// 将数组从小到大排序
// 当前数 == 当前数的后一个数，说明这个值重复
var findRepeatNumber = function(nums) {
    nums = nums.sort((a,b) => a - b);
    for(let i = 0; i < nums.length; i++){
        if(nums[i] == nums[i + 1]){
            return nums[i];
        }
    }
    return -1;
}

方法2实现:（我肯定写这种）
//使用set存储（对应java中的哈希表）
var findRepeatNumber = function(nums) {
    let set = new Set();
    for(let i = 0; i < nums.length; i++){
        if(set.has(nums[i])){
            return nums[i];
        }else{
            set.add(nums[i]);
        }
    }
    return -1;
}

方法3实现:（需要动脑子= =。 ）
//如果这n个数字没有重复的，那么肯定 数字值 和 下标 可以对应放置
//不然，在把 每个数 放到它应该在的位置上时 一定会出现 这个数和它位置上的数 相等的情况
var findRepeatNumber = function(nums) {
    for(let i = 0; i < nums.length; i++){
        while(nums[i] != i){
            //如果当前值 ！= 下标
            //需要把 当前值 放到 当前值=下标的位置
            let temp = nums[nums[i]];
            if(nums[i] == temp){ //说明这两个值 相等，返回该值
                return nums[i];
            }else{
                //否则交换这两个数
                nums[nums[i]] = nums[i];
                nums[i] = temp;
            }
        }
    }
    //遍历完都没有结果，说明没有重复值
    //即n个数恰好是 0~n-1
    return -1;
}
```

## 面试题4 : 二维数组中的查找

### 题目描述:

在一个 n * m 的二维数组中，每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。请完成一个高效的函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。

**示例:**

现有矩阵 matrix 如下：

```
[
  [1, 4, 7, 11, 15],
  [2, 5, 8, 12, 19],
  [3, 6, 9, 16, 22],
  [10, 13, 14, 17, 24],
  [18, 21, 23, 26, 30]
]
```

给定 target = `5`，返回 `true`。

给定 target = `20`，返回 `false`。

**限制：**

`0 <= n <= 1000`

`0 <= m <= 1000`

### 题目分析:

这里我们选择使用**二分查找算法**进行求解

因为每一行元素都是递增排序的,我们可以选择遍历每一行,对每一行进行二分查找该target是否存在?

这里使用到了二分查找算法,我们回顾一下**二分查找算法的通用模板**:

#### 二分查找算法通用模板:

```java
查找数组nums 查找目标数:target 
(1)二分查找: 非递归方式  
int left = 0,right = nums.length - 1;  //定义两个索引left,right 分别指向查找数组的起始索引和末尾索引位置
while(left <= right):
	mid = (left + right) / 2;
	if(nums[mid] < target) left = mid + 1; //选择target目标数在[mid + 1,right]中进行查找
	else if(nums[mid] > target) right = mid - 1; //选择target目标数在[left,mid - 1]中进行查找
	else return mid;  //表示找到该目标数的索引位置,进行返回
return -1; //若未找到,则返回-1


(2)二分查找: 递归方式
def: find(nums,0,nums.length - 1):
def: find(nums,left,right) {
    while(left <= right) {
        mid = (left + right) / 2;
        if(nums[mid] < target) find(nums,mid + 1,right) //选择target目标数在[mid + 1,right]中进行查找
        else if(nums[mid] > target) find(nums,left,mid - 1); //选择target目标数在[left,mid - 1]中进行查找
        else return mid;  //表示找到该目标数的索引位置,进行返回
    }
    return -1; //若未找到,则返回-1
}	
```

### 算法代码实现:

#### java代码实现:

推荐你学习一下我的方法2~你的方法2十分精妙,赞一个!!!

```java
public boolean findNumberIn2DArray(int[][] matrix, int target) {
    //如果此二维数组为null或者为空(即行数为0):直接返回false
    if (matrix == null || matrix.length==0) {
        return false;
    }
    //定义二维数组的行和列变量
    int row = matrix.length;
    int col = matrix[0].length;
    //递归每一行,对每一行元素进行二分查找:找到target返回true;找不到target返回false
    for (int i = 0; i < row; i++) {
        int left = 0;//定义起始的左索引
        int right = col - 1;//定义起始的右索引
        while(left <= right) {
            //左边索引<=右边索引
            int mid = (left + right) / 2;
            if (matrix[i][mid] < target) {
                //向右进行查找
                left = mid + 1;
            }else if (matrix[i][mid] > target) {
                //向左进行查找
                right = mid - 1;
            }else {
                return true; //说明找到[matrix[i][mid] == target]
            }
        }
    }
    //如果未找到,则返回false
    return false;
}
```

#### javaScript代码实现:

方法2:

![t-4-1](/img/algorithm/jianzhi/t-4-1.jpg)

![t-4-2](/img/algorithm/jianzhi/t-4-2.jpg)

```javascript
方法1：
//二分查找
var findNumberIn2DArray = function(matrix, target) {
    if(matrix == null || matrix.length == 0){
        return false;
    }
    let row = matrix.length;
    let col = matrix[0].length;
    //遍历每一行，对每一行元素都进行二分查找
    for(let i = 0; i < row; i++){
        let left = 0, right = col - 1;
        while(left <= right){
            let mid = Math.floor((left + right) / 2);
            if(matrix[i][mid] < target){
                left = mid + 1;
            }else if(matrix[i][mid] > target){
                right = mid - 1;
            }else{
                return true;
            }
        }
    }
    //没找到，返回false
    return false;
}

方法2:
//因为矩阵行中的数据 递增，矩阵列中的数据 递增，
//初始选取 右上角那个数。如果这个数 < target，就往下面的数据找；如果这个数 > target,就往左边的数据找
var findNumberIn2DArray = function(matrix, target) {
    if(matrix == null || matrix.length == 0 ) return false;
    let y = matrix[0].length -1;
    let x = 0;
    while(x < matrix.length && y >= 0){
        if(matrix[x][y] == target){
            return true;
        }else if(matrix[x][y] > target){
            y --;
        }else if(matrix[x][y] < target){
            x ++;
        }        
    }
    return false;
};
```

## 面试题5 : 替换空格

### 问题描述:

请实现一个函数，把字符串 `s` 中的每个空格替换成"%20"。

**示例 1：**

```
输入：s = "We are happy."
输出："We%20are%20happy."
```

### 问题分析:

定义一个结果集字符串对象或者数组类型

这里直接一次遍历字符串,当不是空格,直接添加到结果集中,如果是空格,则添加"%20"到结果集中,最后返回结果集对象或者将数组转换成字符串进行返回

#### java代码实现:

```java
//使用StringBuilder对象进行存储
//直接利用StringBuilder解决
public String replaceSpace2(String s) {
    //定义结果集res
    StringBuilder res = new StringBuilder();
    for(Character c : s.toCharArray()) {
        if(c == ' ') {
            res.append("%20");
        } else {
            res.append(c);
        }
    }
    return res.toString();
}
```

#### javaScript代码实现:

```javascript
//直接用正则表达式
var replaceSpace = function(s) {
    return s.replace(/ /g,'%20')
};
```

## 面试题6 : 从尾到头打印链表

### 问题描述:

输入一个链表的头节点，从尾到头反过来返回每个节点的值（用数组返回）。

**示例 1：**

```
输入：head = [1,3,2]
输出：[2,3,1]
```

**限制：**

`0 <= 链表长度 <= 10000`

### 问题分析:

这是一道比较经典的关于链表的题目,我们选择用栈这种数据结构进行求解该问题.

![](/img/algorithm/jianzhi/6_1.png)

#### java代码实现:

```java
//反向打印链表:利用栈实现
//从头结点开始遍历该链表:将每个结点的val值压入堆栈中
//然后依次从栈中取出元素:将其放入int数组中,最后返回该数组
public int[] reversePrint(ListNode head) {
    if (head == null) {
        //返回一个空的int数组
        return new int[0];
    }
    ListNode temp = head;
    Stack<Integer> stack = new Stack<>();
    while (true) {
        //将当前链表结点的val值压栈
        stack.push(temp.val);
        //判断链表是否遍历结束
        if (temp.next == null) {
            break;
        }
        temp =temp.next;
    }
    //while循环结束,则链表的结点val值按照链表的顺序依次压入栈
    //创建一个和栈的size相同大小的int数组:用来存储最后的从尾部到头部打印的结果
    int[] res = new int[stack.size()];
    int index = 0;
    while (stack.size() > 0) {
        res[index++] = stack.pop();
    }
    //最后将int数组返回
    return res;
}
```

#### javaScript代码实现:

```javascript
var reversePrint = function(head) {
    if(!head) return [];
    var arr = [];
    while(head != null){    
        arr.unshift(head.val)
        head = head.next;
    }
    return arr;
};
```

## 面试题7 : 重建二叉树问题

### 问题描述:

输入某二叉树的前序遍历和中序遍历的结果，请重建该二叉树。假设输入的前序遍历和中序遍历的结果中都不含重复的数字。

例如，给出

```
前序遍历 preorder = [3,9,20,15,7]
中序遍历 inorder = [9,3,15,20,7]
```

返回如下的二叉树：

```
    3
   / \
  9  20
    /  \
   15   7
```

**限制：**

`0 <= 节点个数 <= 5000`

### 问题分析:

这题是二叉树的经典问题之一,它还有一个姊妹题: **根据后序遍历和中序遍历的结果重建二叉树问题**,我们先来看一下该姊妹题如何进行求解...

根据一棵树的中序遍历与后序遍历构造二叉树

注意:你可以假设树中没有重复的元素.

```
例如，给出中序遍历inorder = [9,3,15,20,7]后序遍历 postorder = [9,15,7,20,3]返回如下的二叉树：
          3  
         / \ 
        9  20   
           / \  
          15  7

```

首先根据后序遍历数组:**最后一个元素**为该树的头结点

根据该根结点在中序数组找到其位置:左边即为左子树,右边即为右子树(因为后序遍历先左后右,最后当前节点,所以构建树时,我们需要先根节点,再由右到左)

![](/img/algorithm/jianzhi/9_1.png)

#### java代码实现:

感觉我的代码更好理解一点= =，你是直接遍历根节点，根据这个根节点创建左右子树，代码好复杂。。。

```java
//定义中序,后序遍历数组属性
int[] inorder;
int[] postorder;
//定义属性post_idx记录每一 次的根结点位置
int post_idx;
//定义一个hashmap:存储中序遍历
HashMap<Integer,Integer> idx_map = new HashMap<>();

//由中序和后序遍历构建二叉树的实现
public TreeNode buildTree(int[] inorder, int[] postorder) {
    //将传入的int数组存储到定义的前序和后序数组中
    this.inorder = inorder;
    this.postorder = postorder;
    //根节点即为后序遍历数组的最后一个元素
    post_idx = postorder.length - 1;
    //将中序遍历数组的元素依次加入到idx_map中:key为节点的val值,value为对应中序遍历数组的下标
    //idx_map:需要保证传入节点的val值都不相同:题设中已经设置你可以假设树中没有重复的元素.
    int idx = 0;
    for (int val : inorder) {
        idx_map.put(val,idx++);
    }
    return helper(0,inorder.length - 1);
}

private TreeNode helper(int in_left, int in_right) {
    //当子树没有节点则返回
    if (in_left > in_right) {
        return null;//即子节点为null
    }
    Integer root_val = postorder[post_idx];//取根节点的val值:第一次取的即是整棵树的根节点
    //根据根节点的val值创建其节点
    TreeNode root = new TreeNode(root_val);
    //并在中序遍历数组中获取到根节点的位置
    Integer root_index = idx_map.get(root_val);

    //以此位置作为根节点,则中序遍历数组inorder的该位置的左边即为左子树,右边即为右子树
    //分别递归回溯构建右子树和左子树
    //注意:因为后序遍历先左后右,最后当前节点,所以构建树时,我们需要先根节点,再由右到左
    //重点:每一次回溯,post_idx--
    post_idx--;
    //递归构建右子树
    root.right = helper(root_index + 1,in_right);
    //再递归构建左子树
    root.left = helper(in_left,root_index - 1);
    //构建完毕,将此时的树的根节点返回
    return root;
}

//二叉树的节点类
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) {
        val = x;
    }
}
```

#### JavaScript代码实现:

```java
var buildTree = function(postorder, inorder) {
    if(!postorder.length||!inorder.length){
        return null
    };
    const rootNode = new TreeNode(postorder[postorder.length - 1]);
    let i = inorder.indexOf(preorder[0]);

    rootNode.left=buildTree(postorder.slice(0,i),inorder.slice(0,i));
    rootNode.right=buildTree(postorder.slice(i,postorder.length - 1),inorder.slice(i+1));

    return rootNode;
};
```

然后我们再来看这道题,思路是完全一致的了...

首先根据前序遍历数组:**第一个元素**为该树的头结点

根据该根结点在中序数组找到其位置:左边即为左子树,右边即为右子树(构建的策略:先构建根节点,再构建左子树,最后构建右子树)

![](/img/algorithm/jianzhi/9_2.png)

#### java代码实现:

```java
//定义前序数组,中序遍历数组属性
int[] inorder;
int[] preorder;
int pre_idx;
//定义一个hashmap:存储中序遍历
HashMap<Integer,Integer> idx_map = new HashMap<>();

//由前序遍历和中序遍历构建二叉树的代码实现
public TreeNode buildTree(int[] preorder, int[] inorder) {
    this.preorder = preorder;
    this.inorder = inorder;
    //第一次根节点的位置即为preorder的第一个位置
    pre_idx = 0;
    //将中序遍历数组的元素依次加入到idx_map中:key为节点的val值,value为对应中序遍历数组的下标
    //idx_map:需要保证传入节点的val值都不相同:题设中已经设置你可以假设树中没有重复的元素.
    int idx = 0;
    for (int val : inorder) {
        idx_map.put(val,idx++);
    }
    return helper(0,inorder.length - 1);
}

private TreeNode helper(int in_left, int in_right) {
    //当子树没有节点时返回
    if (in_left > in_right) {
        return null;
    }
    Integer root_val = preorder[pre_idx];//取根节点的val值:第一次取的即是整棵树的根节点
    //根据根节点的val创建该根节点
    TreeNode root = new TreeNode(root_val);
    //并在中序遍历数组map中找到对应节点的位置
    Integer root_index = idx_map.get(root_val);
    //以此位置作为根节点,则中序遍历数组inorder的该位置的左边即为左子树,右边即为右子树
    //分别递归回溯构建左子树和右子树
    //注意:因为前序遍历先是根节点,再是从左后右,所以构建树时,我们需要先根节点,再由左到右
    //重点:每一次回溯,pre_idx++
    pre_idx++;
    //递归构建左子树
    root.left = helper(in_left,root_index - 1);
    //再递归构建右子树
    root.right = helper(root_index + 1,in_right);
    //将最终树的根节点返回
    return root;
}
```

#### JavaScript代码实现:

![t-7-1](/img/algorithm/jianzhi/t-7-1.jpg)

```javascript
var buildTree = function(preorder, inorder) {
    if(!preorder.length||!inorder.length){
        return null
    };
    const rootNode = new TreeNode(preorder[0]);
    let i = inorder.indexOf(preorder[0]);

    rootNode.left=buildTree(preorder.slice(1,i+1),inorder.slice(0,i));
    rootNode.right=buildTree(preorder.slice(i+1),inorder.slice(i+1));

    return rootNode;
};
```

## 面试题9 : 用两个栈实现队列

### 问题描述:

用两个栈实现一个队列。队列的声明如下，请实现它的两个函数 `appendTail` 和 `deleteHead` ，分别完成在队列尾部插入整数和在队列头部删除整数的功能。(若队列中没有元素，`deleteHead` 操作返回 -1 )

**示例 1：**

```
输入：
["CQueue","appendTail","deleteHead","deleteHead"]
[[],[3],[],[]]
输出：[null,null,3,-1]
```

**示例 2：**

```
输入：
["CQueue","deleteHead","appendTail","appendTail","deleteHead","deleteHead"]
[[],[],[5],[2],[],[]]
输出：[null,-1,null,null,5,2]
```

**提示：**

- `1 <= values <= 10000`
- `最多会对 appendTail、deleteHead 进行 10000 次调用`

### 问题分析:

定义两个栈属性in,out:in栈负责进行队列元素的添加(入队列),out栈负责进行队列元素的删除(出队列)

1.在队列尾部中添加元素,即直接将其压入in栈即可

2.在队列的头部删除元素:

* 如果out栈不为空:
  * 先从out队列中获取元素,如果存在,直接出栈pop返回即可
* 如果out栈为空:
* 此时判断in栈是否为空:
  * 如果in栈不为空:则我们将in栈的元素依次pop出栈,并压入out栈中,完成栈的反转压入in栈操作,此时out栈的栈顶元素即为队列的头部元素,直接pop出即可
  * 如果in栈也为空,则表示队列不存在元素,直接返回-1

#### java代码实现:

```java
//队列类
class CQueue {
	//定义两个栈属性
    Stack<Integer> in = new Stack<>();
    Stack<Integer> out = new Stack<>();
    public CQueue() {
        this.in = in;
        this.out = out;
    }
	//添加元素的方法
    public void appendTail(int value) {
        //在队列尾部中添加元素,即直接将其压入in栈即可
        in.push(value);
    }
	//删除头部元素的方法
    public int deleteHead() {
        //如果out栈不为空
        if (out.size() > 0) {
            return out.pop();
        }else {
            //此时out栈为空,我们进行in栈的判断
            if (in.size() > 0) {
                //in栈不为空,将in栈元素压入out栈中
                while (in.size() > 0) {
                    out.push(in.pop());
                }
                //全部压入以后,返回out栈的栈顶元素
                return out.pop();
            }else {
                //如果in栈也为空,则表示队列为空,直接返回-1
                return -1;
            }
        }
    }
}
```

#### JavaScript代码实现:

```javascript
var CQueue = function() {
    this.stack1=[]; //正序
    this.stack2=[]; //倒序
};
CQueue.prototype.appendTail = function(value) {
    this.stack1.push(value)
};
CQueue.prototype.deleteHead = function() {
    if(this.stack2.length){
        return this.stack2.pop();
    }
  //如果this.stack1和this.stack2中都没有元素，则返回-1
    if(!this.stack1.length){
        return -1;
    }
    while(this.stack1.length){
        this.stack2.push(this.stack1.pop())
    }
    return this.stack2.pop();
};
```

## 面试题10 : 斐波那契数列

### 问题描述:

写一个函数，输入 `n` ，求斐波那契（Fibonacci）数列的第 `n` 项（即 `F(N)`）。斐波那契数列的定义如下：

```
F(0) = 0,   F(1) = 1
F(N) = F(N - 1) + F(N - 2), 其中 N > 1.
```

斐波那契数列由 0 和 1 开始，之后的斐波那契数就是由之前的两数相加而得出。

答案需要取模 1e9+7（1000000007），如计算初始结果为：1000000008，请返回 1。

**示例 1：**

```
输入：n = 2
输出：1
```

**示例 2：**

```
输入：n = 5
输出：5
```

**提示：**

- `0 <= n <= 100`

### 问题分析:

常见的方法是如下的使用递归方式进行求解,但是递归的过程中有很多重复的结果,使得这个斐波那契数列问题求解起来会效率大大降低...

我们采取**从下往上计算**的方法,下面分别写出这两种方法,读者可以自行进行比较对比一下

#### java代码实现:

```java
//常见的递归的方法
public int fib(int n) {
    if (n < 2)
        return n;
    return fib(n - 1) + fib(n - 2);
}

//从下往上计算的方法
//注意: 需要考虑大数问题,即取模问题
public int fib(int n) {
    if (n == 0) return 0;
    if (n == 1) return 1;
    //起始值a=0,b=1:对应f(0),f(1)
    int a = 0, b = 1, sum = 0;
    //我们更新f(n) n ∈ [2,n]
    for(int i = 2; i <= n; i++){
        sum = (a + b) % 1000000007;
        a = b;
        b = sum;
    }
    //注意最后返回的f[n]为
    return sum;
}
```

#### JavaScript代码实现:

```javascript
var fib = function(n) {
    if(n == 0) return 0;
    if(n == 1) return 1;

    let a=0n;
    let b=1n;
    for(let i = 2n;i < n;i++){
        let c=a+b;
        a=b;
        b=c;
    }
    return (a+b)%1000000007n;
};
```

## 面试题10_2 : 青蛙跳台阶问题

### 问题描述:

一只青蛙一次可以跳上1级台阶，也可以跳上2级台阶。求该青蛙跳上一个 `n` 级的台阶总共有多少种跳法。

答案需要取模 1e9+7（1000000007），如计算初始结果为：1000000008，请返回 1。

**示例 1：**

```
输入：n = 2
输出：2
```

**示例 2：**

```
输入：n = 7
输出：21
```

**示例 3：**

```
输入：n = 0
输出：1
```

**提示：**

- `0 <= n <= 100`

### 问题分析:

该题是典型的**动态规划**问题,我们可以使用动态规划思想进行求解,同时也是**斐波那契数列问题**,图解如下所示:

![](/img/algorithm/jianzhi/10_2.png)

#### java代码实现:

```java
(1)动态规划思想实现:
public int numWays(int n) {
    if (n == 0) return 1;
    int[] dp = new int[n + 1];//其中dp[i]表示跳上i级的台阶总共需要dp[i]种跳法
    //其中跳上i级台阶,可以从i - 1阶跳1阶或者从i - 2阶跳2阶到达i级台阶
    //dp[i] = dp[i - 1] + dp[i - 2],表示到达第i阶的跳法 i>=3
    dp[1] = 1;
    dp[2] = 2;
    for (int i = 3; i <= n; i++) {
        dp[i] = (dp[i - 2] + dp[i - 1]) % 1000000007;
    }
    return dp[n];
}

(2)使用上面的斐波那契数列解法:  避免了递归,从低到高进行求解,效率更高!
public int numWays(int n) {
    int a = 1, b = 1, sum;
    for(int i = 0; i < n; i++){
        sum = (a + b) % 1000000007;
        a = b;
        b = sum;
    }
    return a;
}
```

#### JavaScript代码实现:

```javascript
/**
设跳上 n 级台阶有 f(n)种跳法。在所有跳法中，青蛙的最后一步只有两种情况： 跳上 1 级或 2 级台阶。
当为 1 级台阶： 剩 n-1 个台阶，此情况共有 f(n-1) 种跳法；
当为 2 级台阶： 剩 n-2 个台阶，此情况共有 f(n-2) 种跳法。
f(n) 为以上两种情况之和，即 f(n)=f(n-1)+f(n-2) ，以上递推性质为斐波那契数列。本题可转化为 求斐波那契数列第 n 项的值
**/
// 与 面试题10- I. 斐波那契数列 等价，唯一的不同在于起始数字不同。
var numWays = function(n) {
    if(n == 0) return 1;
    if(n == 1) return 1;
    let a = 1, b = 1, sum;
    for(let i = 2; i <= n; i++){
        sum = (a + b) % 1000000007;
        a = b;
        b = sum;
    }
    return sum;
};
```

## 面试题11 : 旋转数组的最小数字

### 问题描述:

把一个数组最开始的若干个元素搬到数组的末尾，我们称之为数组的旋转。输入一个递增排序的数组的一个旋转，输出旋转数组的最小元素。例如，数组 `[3,4,5,1,2]` 为 `[1,2,3,4,5]` 的一个旋转，该数组的最小值为1。  

**示例 1：**

```
输入：[3,4,5,1,2]
输出：1
```

**示例 2：**

```
输入：[2,2,2,0,1]
输出：0
```

### 问题分析:

```java
第一种方法: 直接对该数组进行排序,然后返回数组的索引为0的位置的值即为最小的数字,但是此时借助了排序方法,时间复杂度为O(nlogn),这里我们可以选择更优时间复杂度的算法

第二种方法: 二分法算法
时间复杂度为O(logn),优于上面的算法思路
```

#### java代码实现:

```java
//方法1:直接排序法:不讲武德!
public int minArray01(int[] numbers) {
    Arrays.sort(numbers);
    return numbers[0];
}

//方法2:二分法
public int minArray(int[] numbers) {
    int left = 0;//定义左边的指针
    int right = numbers.length - 1;//定义右边的指针
    while (left < right) {
        int pivot = left + (right - left) / 2;//获取中间索引pivot的值
        //比较中间索引对应的值和numbers[right]的关系
        if (numbers[pivot] > numbers[right]) {
            left = pivot + 1;//则说明最小值在pivot+1 到 right之间
        }else if (numbers[pivot] < numbers[right]) {
            right = pivot;//则说明最小值在0 到 pivot之间
        }else {
            //否则:两者相等,将右指针向前移动一位
            right = right - 1;
        }
    }
    //最后while循环结束:left索引对应的值即为最小元素
    return numbers[left];
}
```

#### JavaScript代码实现:

```javascript
var minArray = function(numbers) {
    //2分法查找
    let low = 0;
    let high = numbers.length - 1;
    while(low < high){
        let mid = Math.floor((low + high) / 2);
        if(numbers[high] > numbers[mid]){
            high = mid;
        }else if(numbers[high] < numbers[mid]){
            low = mid + 1;
        }else{
            high -= 1
        }
    }
    return numbers[low];
};
```

## 面试题12 : 矩阵中的路径

### 问题描述:

请设计一个函数，用来判断在一个矩阵中是否存在一条包含某字符串所有字符的路径。路径可以从矩阵中的任意一格开始，每一步可以在矩阵中向左、右、上、下移动一格。如果一条路径经过了矩阵的某一格，那么该路径不能再次进入该格子。例如，在下面的3×4的矩阵中包含一条字符串“bfce”的路径（路径中的字母用加粗标出）。

[["a","**b**","c","e"],
["s","**f**","**c**","s"],
["a","d","**e**","e"]]

但矩阵中不包含字符串“abfb”的路径，因为字符串的第一个字符b占据了矩阵中的第一行第二个格子之后，路径不能再次进入这个格子。

**示例 1：**

```java
输入：board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
输出：true
```

**示例 2：**

```java
输入：board = [["a","b"],["c","d"]], word = "abcd"
输出：false
```

**提示：**

- `1 <= board.length <= 200`
- `1 <= board[i].length <= 200`

### 问题分析:

使用**递归法**进行求解:

类似迷宫问题,区别在于迷宫问题会给予你一个起始位置,但是此处的查看路线是否符合问题,没有定义所谓的起始坐标,我们需要进行所有位置的匹配,然后对所有位置中符合要求的进行递归回溯,最终观察是否满足其要求,若最终按照题设给定的word顺序能够通过上下左右走通的话,即表示该矩阵中确实存在一条包含word字符串所有字符的路径,否则,则不包含word字符串的路径

#### 具体步骤:

(1)首先我们需要定义一个word字符串的匹配计数器k:用来记录word单词在board网格中的匹配数,当连续匹配k等于word的长度,说明找到一条符合的路径,直接返回true

(2)因为我们是可以从**任意点开始遍历**即可

![](/img/algorithm/jianzhi/12.png)

#### java代码实现:

```java
public boolean exist(char[][] board, String word) {
    char[] steps = word.toCharArray();
    //因为相对于迷宫的起点固定问题,这里的任意位置都可以看做起点
    for (int i = 0; i < board.length; i++) {
        for (int j = 0; j < board[0].length; j++) {
            //只有存在一个匹配steps的线路规划,则说明存在一条这样的路径
            if (setWay(board,i,j,0,steps)) {
                return true;//说明该步骤是可行的
            }
        }
    }
    //for循环结束,还没找到,则说明不存在线路
    return false;
}

private boolean setWay(char[][] board, int i, int j, int k, char[] steps) {
    if(i >= board.length || i < 0 || j >= board[0].length || j < 0 || board[i][j] != steps[k]) {
        //如果递归调用过程中,出现i或者j越界问题,或者当前走的board[i][j] 不等于steps数组此时的值
        return false;
    }
    if (k == steps.length - 1) {
        //说明已经完全匹配steps路径,走完了路径的所有点
        return true;
    }
    //输入setWay终止的条件
    //记录当前走的点:board[i][j]
    char temp = board[i][j];
    //将此时board[i][j] = '#':表示已经走过
    board[i][j] = '#';
    //分别从左,右,上,下进行递归查找
    boolean isExist = setWay(board,i,j-1,k+1,steps) || setWay(board,i,j + 1,k+1,steps)
        || setWay(board,i - 1,j,k+1,steps) || setWay(board,i + 1,j,k+1,steps);
    //回溯时,还原[i,j]位置的值
    board[i][j] = temp;
    return isExist;
}
```

#### JavaScript代码实现:

```javascript
var exist = function(board, word) {
    var row = board.length;
    var col = board[0].length;

		//i,j确定初始位置
		//index确定匹配的字母下标
    var dfs = function(i,j,board,word,index){
        //边界条件，及不符合条件的分支
        if(i < 0 || i >= row || j < 0 || j >= col || board[i][j] !== word[index])
        	return false;
        //遍历完成
        if(index === word.length - 1) 
          return true;
      
        var tmp = board[i][j];
        board[i][j] = '-';  //锁住该值无法被访问
        var res = dfs(i+1,j,board,word,index+1)||dfs(i-1,j,board,word,index+1)||dfs(i,j+1,board,word,index+1)||dfs(i,j-1,board,word,index+1);
        board[i][j] = tmp; //恢复现场
        return res;
    }
	
    //board中的任意位置都可能是起点
    for(var i = 0; i< row; i++){
        for(var j = 0; j < col; j++){
            if(dfs(i,j,board,word,0)) return true;
        }
    }
    return false;
};
```

## 面试题13 : 机器人的运动范围

### 问题描述:

地上有一个m行n列的方格，从坐标 `[0,0]` 到坐标 `[m-1,n-1]` 。一个机器人从坐标 `[0, 0] `的格子开始移动，它每次可以向左、右、上、下移动一格（不能移动到方格外），也不能进入行坐标和列坐标的数位之和大于k的格子。例如，当k为18时，机器人能够进入方格 [35, 37] ，因为3+5+3+7=18。但它不能进入方格 [35, 38]，因为3+5+3+8=19。请问该机器人能够到达多少个格子？

**示例 1：**

```
输入：m = 2, n = 3, k = 1
输出：3
```

**示例 2：**

```
输入：m = 3, n = 1, k = 0
输出：1
```

**提示：**

- `1 <= n,m <= 100`
- `0 <= k <= 20`

### 问题分析:

#### 思路1:使用递归回溯法进行求解

##### 定义:

(1)一个计数器moveCount:用来记录机器人到达的格子数量

(2)一个二维数组:表示访问标记数组

##### 步骤:

从[0,0]位置开始遍历访问:

终止条件:若行列越界或者位数之和大于k或者该位置已经访问过:则返回false,表示不通

通路:则将计数器值加1,并将该点标记为已访问

并进行分别向左,向右,向上,向下的递归遍历工作,直到最后m行n列的所有点路径访问结束

#### java代码实现:

```java
//方法1:使用递归回溯的方法
int moveCount = 0;
public int movingCount(int m, int n, int k) {
    //首先我们需要在递归回溯法中定义一个计数器:用来记录机器人到达的不重复的格子数
    //构造m行n列的二维数组:初始化默认值全部为0
    int[][] board = new int[m][n];
    findMovingPath(0,0,m,n,board,k);
    return moveCount;
}

private Boolean findMovingPath(int row, int col, int m, int n, int[][] board, int k) {
    if (row < 0 || row >= m || col < 0 || col >= n || getSum(row,col) > k || board[row][col] == 1) {
        return false;
    }

    //进行计数器加1
    moveCount++;

    //进行递归探路
    board[row][col] = 1;	//1表示已经走过该路,回溯时无需将该点的值进行还原
    boolean isVisited = 
        findMovingPath(row,col - 1,m,n,board,k) 
        || findMovingPath(row,col + 1,m,n,board,k) 
        || findMovingPath(row - 1,col,m,n,board,k) 
        || findMovingPath(row + 1,col,m,n,board,k);
    //board[row][col] = temp;//注意: 这里无需将该点还原
    return isVisited;
}

//因为1 <= n,m <= 100,所以我们计算行列的各位数之和时,只需要计算个位,十位和百位即可
private int getSum(int row, int col) {
    int sum = 0;
    sum = sum + row % 10 + (row / 10) % 10 + (row / 100) % 10 + col % 10 + (col / 10) % 10 + (col / 100) % 10;
    return sum;
}
```

#### JavaScript代码实现:

```javascript
var movingCount = function(m, n, k) {
    //0 表示没走过， 1表示走过了
    let array = new Array(m).fill(0).map(x => new Array(n).fill(0));
    let moveCount = 0;

    //i,j是起始点
    let dfs =function(array, i, j, m, n, k){
        //边界条件
        if(i < 0 || i >= m || j < 0 || j >= n || getSum(i) + getSum(j) > k || array[i][j] == 1){
            return;
        }
       //标记走过了  
        array[i][j] = 1;
        moveCount++;
    	dfs(array, i - 1, j, m, n, k) 
        dfs(array, i, j + 1, m, n, k) 
        dfs(array, i + 1, j, m, n, k) 
        dfs(array, i, j - 1, m, n, k)
    }
    
    dfs(array, 0, 0, m, n, k);
    return moveCount;
};

//求num各个位上值的和
function getSum(num){
    let s = 0;
    while(num){
        s += num % 10;
        num = Math.floor(num / 10);
    }
    return s;
}
```

#### 思路2:使用DFS实现

深度优先搜索(DFS)： 可以理解为暴力法模拟机器人在矩阵中的所有路径。DFS 通过递归，先朝一个方向搜到底，再回溯至上个节点，沿另一个方向搜索，以此类推。

剪枝：在搜索中，遇到数位和超出目标值、此元素已访问，则应立即返回，称之为可行性剪枝 。

##### 步骤：

递归参数： 当前元素在矩阵中的行列索引 i和 j ，两者的数位和si, sj (即数位的和)

终止条件： 当满足(1)当行列索引越界;(2)数位和超出目标值k (3)当前元素已访问过时任何一个条件，则返回 0 ,代表不计入可达解。

递推工作：

  标记当前单元格：将索引 (i,j) 存入 visited二维数组中，代表此单元格已被访问过。

  搜索下一单元格：计算当前元素的 下、右 两个方向元素的数位和，并开启下层递归 。

回溯返回值：返回 1 + 右方搜索的可达解总数 + 下方搜索的可达解总数，代表从本单元格递归搜索的可达解总数。

#### Java代码实现:

```javascript
//定义m,n,k接收传入的参数
int m, n, k;
//定义一个访问标记二维数组
boolean[][] visited;
public int movingCount(int m, int n, int k) {
    this.m = m; this.n = n; this.k = k;
    this.visited = new boolean[m][n];
    //进行dfs,返回值即为机器人到达的格子数
    return dfs(0, 0, 0, 0);
}

public int dfs(int i, int j, int si, int sj) {
    //因为不存在向左或者向上遍历,则不会出现i < 0或者j < 0的情况
    if(i >= m || j >= n || k < si + sj || visited[i][j]) {
        return 0;
    }
    //将当前位置标记为已访问
    visited[i][j] = true;
    //因为从[0,0]开始,所以dfs只存在向下和向右
    //进行dfs递归调用,并将的到达的格个数加1
    //这里进行行和列所有位数相加一个很巧妙的方法: (i + 1) % 10 :判断其是否能整除10,如果可以,则将其减去8;如果不可以,则将其加上1
    //例如:i = 9 ; 9 + 1 = 10 % 10 != 0,则将其减8得到1.而我们的10的十位加上个位的和正是1.
    return 1 + dfs(i + 1, j, (i + 1) % 10 != 0 ? si + 1 : si - 8, sj) + dfs(i, j + 1, si, (j + 1) % 10 != 0 ? sj + 1 : sj - 8);
}
```

#### JavaScript代码实现:

```javascript
方法1：
//普通dfs
var movingCount = function(m, n, k) {
    //0 表示没走过， 1表示走过了
    let array = new Array(m).fill(0).map(x => new Array(n).fill(0));
    return dfs(array, 0, 0, m, n, k);
};

//求num各个位上值的和
function getSum(num){
    let s = 0;
    while(num){
        s += num % 10;
        num = Math.floor(num / 10);
    }
    return s;
}
//i,j是起始点
function dfs(array, i, j, m, n, k){
    //边界条件
    //只需要向右，向下进行遍历
    if(i >= m || j >= n || getSum(i) + getSum(j) > k || array[i][j] == 1){
        return 0;
    }
    array[i][j] = 1;

    return  1
    + dfs(array, i, j + 1, m, n, k)
    + dfs(array, i + 1, j, m, n, k)
}

方法2:
//需要动脑子的dfs
/**
	这里舍去了getSum方法，通过(j + 1) % 10 == 0 ? sj - 8 : sj + 1来计算
**/
var movingCount = function(m, n, k) {
    //m行，n列
    //0 表示没走过， 1表示走过了
    let array = new Array(m).fill(0).map(x => new Array(n).fill(0));
    return dfs(array, 0, 0, 0, 0, k);
};

//i,j是起始点
function dfs(array, i, j, si, sj, k){
    //边界条件
    //只需要向右，向下进行遍历
    if(i >= array.length || j >= array[0].length || si + sj > k || array[i][j] == 1){
        return 0;
    }
    array[i][j] = 1;

    return  1
    + dfs(array, i, j + 1, si, (j + 1) % 10 == 0 ? sj - 8 : sj + 1, k)
    + dfs(array, i + 1, j, (i + 1) % 10 == 0 ? si - 8 : si + 1, sj, k)
}
```

## 面试题14 : 剪绳子问题

### 问题描述:

给你一根长度为 `n` 的绳子，请把绳子剪成整数长度的 `m` 段（m、n都是整数，n>1并且m>1），每段绳子的长度记为 `k[0],k[1]...k[m-1]` 。请问 `k[0]*k[1]*...*k[m-1]` 可能的最大乘积是多少？例如，当绳子的长度是8时，我们把它剪成长度分别为2、3、3的三段，此时得到的最大乘积是18。

**示例 1：**

```
输入: 2
输出: 1
解释: 2 = 1 + 1, 1 × 1 = 1
```

**示例 2:**

```
输入: 10
输出: 36
解释: 10 = 3 + 3 + 4, 3 × 3 × 4 = 36
```

**提示：**

- `2 <= n <= 58`

### 问题分析:

#### 思路1: DFS进行实现

#### java代码实现:

```java
//直接更新pre[当前剪完绳子后的乘积],不用将剪完的绳子长度先保存到集合sub中,后面又要for循环遍历获取其最终乘积
//可以通过:但是只击败了11%的人,说明这种dfs方法对于解答此题来说,不是最优的算法,我们考虑使用其它算法进行求解!!
int res = 0;
int t = 0;
public int cuttingRope(int n) {
    dfs(1,1,n);
    return res;
}

//start:从1开始, pre:保存每一次剪完绳子的乘积 n:表示绳子的长度[会随着剪绳子而不断缩短]
private void dfs(int start, int pre, int n) {
    if (n == 0 || n == 1) {
        res = Math.max(res,pre);
        return;
    }
    //如果当前start为1,则我们可以去1~n-1的长度;如果start不为1,说明不是第一次剪,后面我们可以取到n的长度
    if(start == 1) {
        t = 1;
    }else {
        t = 0;
    }
    for (int i = start; i <= n - t; i++) {
        int temp = pre;
        pre = pre * i;
        dfs(i,pre,n - i);
        pre = temp;
    }
}
```

#### JavaScript代码实现:

```javascript
var cuttingRope = function(n) {
    let res = 0;
    let t = 0;
    // start从1开始，pre保存每一次剪完绳子的乘积，n表示绳子的长度，会不断缩短
    let dfs = function(start, pre, n){
        //绳子剪完了
        if(n == 0 || n == 1){
            res = Math.max(res, pre);
            return;
        }
        //如果start == 1，说明是第一次剪，则我们只能取到1~n-1的长度（必须剪一次）
        //如果start ！= 1，说明不是第一次剪，那我们可以不剪，取到n的长度
        if(start == 1){
            t = 1;
        }else{
            t = 0;
        }

        for(let  i = start; i <= n - t; i++){
            dfs(i, pre * i, n - i);
        }
    }
    dfs(1, 1, n);
    return res;
}
```

#### 思路2: 动态规划进行实现:

对于正整数n,n>=2,可以至少拆分成两个正整数的和,令k是拆分出的第一个正整数,则剩下的部分是n-k,n-k可以不继续拆分,或者继续拆分成至少两个正整数的和.由于每个正整数对应的最大乘积取决于比它小的正整数对应的乘积,因此我们可以使用动态规划进行问题的求解

我们定义以下变量:

dp数组:其中dp[i]表示将正整数i拆分成至少两个正整数的和之后,这些正整数的最大乘积

边界条件:因为0不是正整数,1是最小的正整数,不能再进行拆分了,因为我们设置dp[0]=dp[1]=0;

状态转移方程:

当i>= 2时,假设对正整数i拆分出的第一个正整数j(1 <= j < i),则存在以下方案:

​     (1)将i拆分成j和i-j的和,且i-j不能再拆分成多个正整数,此时的乘积是 **j * (i - j)**;

​     (2)将i拆分成j和i-j的和,且i-j可以继续拆分成多个正整数,此时的乘积是 **j * dp[i - j]**;

因此,当j固定时,**dp[i] = max(j * (i - j),j * dp[i - j])**;

由于j的取值范围为**[1,i - 1]**,故我们遍历所有的j得到dp[i]的最大值

最终得到dp[n]的值即将正整数n拆分成至少两个正整数的和之后,这些正整数的最大乘积

#### java代码实现:

```java
//使用动态规划算法进行求解
public int cuttingRope(int n) {
    if (n == 1)
        return 1;
    //定义动态规划数组dp
    int[] dp = new int[n + 1];
    dp[0] = dp[1] = 0;
    for (int i = 2; i <= n; i++) {
        //其中i可以从1开始分到i - 1
        for (int j = 1; j <= i - 1; j++) {
            dp[i] = Math.max(Math.max(dp[i],j * (i - j)),j * dp[i - j]);
        }
    }
    return dp[n];
}
```

#### JavaScript代码实现:

```javascript
/**
    绳子的长度为n，比较所有剪法（简化：只需要遍历最少剪2，最多剪去一半的情况），求出最大值
    product[n]存储的是长为n的绳所能得到的最大乘积
    难点： 初始化数组。。。
**/
var cuttingRope = function(n) {
    if(n <= 2) return 1;
    if(n == 3) return 2;
    //下面的剪1，返回1；
    //剪2，返回2；
    //剪3，返回3；
    let products = [0,1,2,3];
    let max = 0;
    //子下而上计算上面f（n）公式
    for(let i = 4; i <= n; i++){
        max = 0;
        //需要求出所有可能的f(j) * f(i - j),并比较得出他们的最大值
        for(let j = 2; j <= i / 2; j++){
            let product = products[j] * products[i - j];
            if(max < product){
                max = product;
            }
            products[i] = max;
        }
    }
    return products[n]
};
```

## 面试题15 : 二进制中1的个数

### 问题描述:

请实现一个函数，输入一个整数（以二进制串形式），输出该数二进制表示中 1 的个数。例如，把 9 表示成二进制是 1001，有 2 位是 1。因此，如果输入 9，则该函数输出 2。

**示例 1：**

```
输入：00000000000000000000000000001011
输出：3
解释：输入的二进制串 00000000000000000000000000001011 中，共有三位为 '1'。
```

**示例 2：**

```
输入：00000000000000000000000010000000
输出：1
解释：输入的二进制串 00000000000000000000000010000000 中，共有一位为 '1'。
```

**示例 3：**

```
输入：11111111111111111111111111111101
输出：31
解释：输入的二进制串 11111111111111111111111111111101 中，共有 31 位为 '1'。
```

**提示：**

- 输入必须是长度为 `32` 的 **二进制串** 。

### 问题分析:

#### 思路1：逐位判断

根据 与运算 定义，设二进制数字 n ，则有:
**若 n & 1 = 0，则 n 二进制 最右一位 为 0** 
**若 n & 1 = 1 ，则 n 二进制 最右一位 为 1** 
根据以上特点，考虑以下 循环判断 ：
判断 n 最右一位是否为 1 ，根据结果计数
将 n 右移一位（本题要求把数字 n 看作无符号数，因此使用 无符号右移 操作）
算法流程：
初始化数量统计变量 res = 0
循环逐位判断： 当 n = 0时跳出
res += n & 1 ： 若 n & 1 = 1，则统计数 res加一
n >>> 1 ： 将二进制数字 n无符号右移一位 
返回统计数量 res

#### 思路2: 常规计数法

#### java代码实现:

快看我的思路2~~

```java
//思路1:利用按位与运算
public int hammingWeight(int n) {
    int res = 0;
    while(n != 0) {
        res += n & 1;
        n >>>= 1;//无符号右移一位:等于除以2
    }
    return res;
}

//思路2:常规方法
public int hammingWeight(int n) {
    //将一个十进制数转换成二进制数的过程中,定义一个计数器,进行1的计数
    int count = 0;
    while(n != 0) {
        if (n % 2 == 1) count++;//如果n整除2余数为1,则将计数器加1
        n = n / 2;//将n/2得到下一个值
    }
    return count;
}
```

#### JavaScript代码实现:

```javascript
//思路1：利用按位与运算
var hammingWeight = function(n) {
    let count = 0;   
    while(n != 0){
        if(n & 1){
            count++;
        }
        n >>>= 1; //这里需要不带符号位右移
    }
    return count;
};
```

![t-15-1](/img/algorithm/jianzhi/t-15-1.jpg)

```java
//思路2：每进行一次&运算，消除末尾1个1
var hammingWeight = function(n) {
    let c = 0;
    while(n != 0){
        c++;
        n &= n - 1  //消除数字n最右边的1
    }
    return c;
}
```

## 面试题16 : 数值的整数次方

### 问题描述:

实现函数double Power(double base, int exponent)，求base的exponent次方。不得使用库函数，同时不需要考虑大数问题。

**示例 1:**

```
输入: 2.00000, 10
输出: 1024.00000
```

**示例 2:**

```
输入: 2.10000, 3
输出: 9.26100
```

**示例 3:**

```
输入: 2.00000, -2
输出: 0.25000
解释: 2-2 = 1/22 = 1/4 = 0.25
```

**说明:**

- -100.0 < *x* < 100.0
- *n* 是 32 位有符号整数，其数值范围是 [−231, 231 − 1] 。

### 问题分析:

我们先来看下面两个例子的转换:

![](/img/algorithm/jianzhi/16.png)

#### 思路1:二分法 + 递归法

![](/img/algorithm/jianzhi/16_2.png)

#### 思路2: 二分法 + 非递归法

![](/img/algorithm/jianzhi/16_3.png)

#### java代码实现:

![找错专用图2](/img/algorithm/jianzhi/找错专用图2.gif)

我觉得我的更好理解一点 = =，（好吧，我们方法是一样的，就是理解方向不一样）

明明是非递归的方式好理解

```java
 //思路1: 递归和二分法进行计算[更好理解一些!!!]
public double myPow(double x,int n) {
    if (n == 0) {
        return 1;
    }
    //如果n为负数:则将其改为负数,并将1/x提取出一个
    if (n < 0) {
        return 1 / x * myPow(1 / x,-n - 1);
    }
    //如果n大于0,则正常递归二分计算
    return (n % 2 == 0) ? myPow(x * x,n / 2) : x * myPow(x * x,n / 2);
}

//思路2: 非递归和二分法进行计算
//利用非递归和二分法进行计算
public double myPow02(double x, int n) {
    //先定义一个辅助变量:记录结果
    double result = 1.0;
    //for循环
    for (int i = n; i != 0; i /= 2, x *= x) {
        if (i % 2 != 0) {
            //i是奇数
            result *= x;
        }
    }
    //若最后for循环遍历结束:根据n为正数还是负数进行选择输出
    //包含了n == 0的情况
    return n < 0 ? 1.0 / result : result;
}
```

#### JavaScript代码实现:

```javascript
方法1：递归+二分法
var myPow = function(x, n) {
    if(n == 0) return 1;
    if(n < 0){
        //转化成正指数
        return myPow(1/x, - n);
    }
    return (n % 2 == 0) ? myPow(x * x, Math.floor(n / 2)) : x * myPow(x * x, Math.floor(n / 2));
};

方法2：非递归+二分法
var myPow = function(x, n) {
    let result = 1.0;
    for(let i = Math.abs(n); i != 0; i = Math.floor(i / 2), x *= x){
        if(i % 2 == 1){
            //取余是1
            result *= x;
        }
    }
    return n < 0 ? 1.0 /result : 1.0 * result;
};
```

![t-16-1](/img/algorithm/jianzhi/t-16-1.jpg)

```javascript
方法3：
//比如 3(5)=3(101)=3(4)+3(1)
var myPow = function(x, n) {
    //特殊情况
    if(n==0)return 1;
    if(n==1)return x;
    //判断指数是否为负数
    let isNagtive = n < 0;
    let nabs = Math.abs(n);
    let result = 1;
    while(nabs){
        // 如果最右位是1，则当前x累乘到result
        if(nabs & 1){
            result = result * x;
        }
        //（x相当于指数101每个位上对应的x的值）
        x = x * x;//比如  ... 3（8），3（4），3（2），3（1）
        //n右移一位
        nabs = Math.floor(nabs/2);
    }
    //处理负指数
    return isNagtive? 1/result : result;
};
```

## 面试题17 : 打印从1到最大的n位数

### 问题描述:

输入数字 `n`，按顺序打印出从 1 到最大的 n 位十进制数。比如输入 3，则打印出 1、2、3 一直到最大的 3 位数 999。

**示例 1:**

```
输入: n = 1
输出: [1,2,3,4,5,6,7,8,9]
```

说明：

- 用返回一个整数列表来代替打印
- n 为正整数

### 问题分析:

直接法求解即可...但是下面的求解是不考虑大数情况的

#### java代码实现:

```java
//直接法进行求解
public int[] printNumbers(int n) {
    //首先获得最大的n位数
    int end = (int)Math.pow(10, n) - 1;
    //定义和最大值相同大小的数组
    int[] res = new int[end];
    //for循环对该数组进行赋值操作...
    for(int i = 0; i < end; i++)
        res[i] = i + 1;
    return res;
}
```

#### JavaScript代码实现:

```javascript
//全排列
var printNumbers = function(n) {
    //实际是n个 0-9 的全排列，只不过排在前面的 0 不打印
    // 使用递归，递归结束的条件是设置了数字的最后一位
    let result = [];
    let temp = [];
    allP(result, n, 0, temp);
    return result;
};

function allP(result, n, start, temp){
    if(start == n){
        //存放进去时，要把以0开头的0全部去掉
        let begin = 0;
        while(temp[begin] == 0){
            begin++;
        }
        if(begin == temp.length) return;
        result.push(temp.slice(begin).join(''))
        return;
    }
    for(let i = 0; i <= 9; i++){
        temp[start] = i;
        allP(result, n, start + 1, temp);
    }
}
```

## 面试题18 : 删除链表的节点

### 问题描述:

给定单向链表的头指针和一个要删除的节点的值，定义一个函数删除该节点。

返回删除后的链表的头节点。

**注意：**此题对比原题有改动

**示例 1:**

```
输入: head = [4,5,1,9], val = 5
输出: [4,1,9]
解释: 给定你链表中值为 5 的第二个节点，那么在调用了你的函数之后，该链表应变为 4 -> 1 -> 9.
```

**示例 2:**

```
输入: head = [4,5,1,9], val = 1
输出: [4,5,9]
解释: 给定你链表中值为 1 的第三个节点，那么在调用了你的函数之后，该链表应变为 4 -> 5 -> 9.
```

**说明：**

- 题目保证链表中节点的值互不相同
- 若使用 C 或 C++ 语言，你不需要 `free` 或 `delete` 被删除的节点

### 问题分析:

如果该链表为空,即head指针为null,则无需进行删除操作,直接返回head节点即可

如果该链表不为空,并且链表中存在删除的节点,同时链表中的节点的值互不相同

则我们选择定义一个辅助指针变量temp,指向head节点,我们需要找到删除的节点的前一个节点[用temp指针变量指向删除的节点的前一个节点] : 

我们选择将temp.next = temp.next.next来完成指向val值的节点的删除操作,但是如果要删除的节点时head节点,我们无法找到head节点的前向节点,故我们需要单独在前面进行讨论...

#### java代码实现:

```java
public ListNode deleteNode(ListNode head, int val) {
    if (head == null) return head;
    //定义一个指针变量temp指向head节点
    ListNode temp = head;
    if (temp.val == val) {
        //说明头节点即为要删除的节点
        return head.next;
    }
    //我们找到对应删除的节点
    while (temp.next != null) {
        if (temp.next.val == val) {
            break;
        }
        temp = temp.next;
    }
    //此时的temp的next域的val值等于val值
    temp.next = temp.next.next;
    return head;
}
```

#### JavaScript代码实现:

```javascript
var deleteNode = function(head, val) {
    //删除当前节点不一定需要 当前节点 的前一个节点
    //只要把当前节点的后一个节点覆盖当前节点就可以了
    //但是如果是删除最后一个节点，还是需要它的前一个节点

    //情况1:删除的是头结点
    if(head.val == val){
        head = head.next
        return head
    }
    //情况2：删除中间节点和最后一个节点
    let pre = head;
    let p = head.next;
    while( p.val != val && p.next != null){
        p = p.next
        pre = pre.next;
    }
    pre.next = p.next;
    return head;
};
```

## 面试题19 : 正则表示式的匹配问题

### 问题描述:

请实现一个函数用来匹配包含`'. '`和`'*'`的正则表达式。模式中的字符`'.'`表示任意一个字符，而`'*'`表示它前面的字符可以出现任意次（含0次）。在本题中，匹配是指字符串的所有字符匹配整个模式。例如，字符串`"aaa"`与模式`"a.a"`和`"ab*ac*a"`匹配，但与`"aa.a"`和`"ab*a"`均不匹配。

**示例 1:**

```
输入:
s = "aa"
p = "a"
输出: false
解释: "a" 无法匹配 "aa" 整个字符串。
```

**示例 2:**

```
输入:
s = "aa"
p = "a*"
输出: true
解释: 因为 '*' 代表可以匹配零个或多个前面的那一个元素, 在这里前面的元素就是 'a'。因此，字符串 "aa" 可被视为 'a' 重复了一次。
```

**示例 3:**

```
输入:
s = "ab"
p = ".*"
输出: true
解释: ".*" 表示可匹配零个或多个（'*'）任意字符（'.'）。
```

**示例 4:**

```
输入:
s = "aab"
p = "c*a*b"
输出: true
解释: 因为 '*' 表示零个或多个，这里 'c' 为 0 个, 'a' 被重复一次。因此可以匹配字符串 "aab"。
```

**示例 5:**

```
输入:
s = "mississippi"
p = "mis*is*p*."
输出: false
```

- `s` 可能为空，且只包含从 `a-z` 的小写字母。
- `p` 可能为空，且只包含从 `a-z` 的小写字母以及字符 `.` 和 `*`，无连续的 `'*'`。

### 问题分析:

![找错专用图5](/img/algorithm/jianzhi/找错专用图5.jpg)

你的题解呢

#### 思路1：动态规划实现(脑子：太难，想不到)

![t-19-1](/img/algorithm/jianzhi/t-19-1.jpg)

#### 思路2：递归实现（脑子：勉强能尝试）

![t-19-2](C:\Users\Administrator\Desktop\剑指Offer算法笔记\剑指Offer算法笔记\img\algorithm\jianzhit-19-2.jpg)

#### java代码实现:

```java
//动态规划进行实现
public boolean isMatch(String s, String p) {
    int m = s.length();
    int n = p.length();

    boolean[][] f = new boolean[m + 1][n + 1];
    f[0][0] = true;
    for (int i = 0; i <= m; ++i) {
        for (int j = 1; j <= n; ++j) {
            if (p.charAt(j - 1) == '*') {
                f[i][j] = f[i][j - 2];
                if (matches(s, p, i, j - 1)) {
                    f[i][j] = f[i][j] || f[i - 1][j];
                }
            } else {
                if (matches(s, p, i, j)) {
                    f[i][j] = f[i - 1][j - 1];
                }
            }
        }
    }
    return f[m][n];
}

public boolean matches(String s, String p, int i, int j) {
    if (i == 0) {
        return false;
    }
    if (p.charAt(j - 1) == '.') {
        return true;
    }
    return s.charAt(i - 1) == p.charAt(j - 1);
}

//递归实现
public boolean isMatch(String A, String B) {
    // 如果字符串长度为0，需要检测下正则串
    if (A.length() == 0) {
        // 如果正则串长度为奇数，必定不匹配，比如 "."、"ab*",必须是 a*b*这种形式，*在奇数位上
        if (B.length() % 2 != 0) return false;
        int i = 1;
        while (i < B.length()) {
            if (B.charAt(i) != '*') return false;
            i += 2;
        }
        return true;
    }
    // 如果字符串长度不为0，但是正则串没了，return false
    if (B.length() == 0) return false;
    // c1 和 c2 分别是两个串的当前位，c3是正则串当前位的后一位，如果存在的话，就更新一下
    char c1 = A.charAt(0), c2 = B.charAt(0), c3 = 'a';
    if (B.length() > 1) {
        c3 = B.charAt(1);
    }
    // 和dp一样，后一位分为是 '*' 和不是 '*' 两种情况
    if (c3 != '*') {
        // 如果该位字符一样，或是正则串该位是 '.',也就是能匹配任意字符，就可以往后走
        if (c1 == c2 || c2 == '.') {
            return isMatch(A.substring(1), B.substring(1));
        } else {
            // 否则不匹配
            return false;
        }
    } else {
        // 如果该位字符一样，或是正则串该位是 '.'，和dp一样，有看和不看两种情况
        if (c1 == c2 || c2 == '.') {
            return isMatch(A.substring(1), B) || isMatch(A, B.substring(2));
        } else {
            // 不一样，那么正则串这两位就废了，直接往后走
            return isMatch(A, B.substring(2));
        }
    }
}
```

#### JavaScript代码实现:

```javascript
//动态规划实现
/**
A(主串，长度为n)
B(模式，长度为m)
B末尾的字母分为3种情况：正常字母，‘·’，‘*’
情况1：判断A[n - 1] 是否= B[m - 1];
情况2：判断A[n - 2] 是否= B[m - 2];（由于B[m - 1] == ‘·’可以匹配A[n - 1]上的任意一个字母）
情况3：
	3.1 如果A[n - 1] == B[m - 2],判断A[n - 2] 是否= B[m - 2] (继续用 *前的那个字母匹配)
	3.2 如果A[n - 1] != B[m - 2],判断A[n - 1] 是否= B[m - 3] (直接忽略 *前的那个字母)
**/
/**
	转移方程 f[i][j] 表示 A的前i个字母和 B的前j个字母是否匹配 (0表示空字符串)
	情况1和情况2可以合并为一种情况： f[i][j] = f[i - 1][j - 1]
	情况3分为为两种情况：
		继续用 *前的那个字母匹配 f[i][j] = f[i - 1][j];
		直接忽略 *前的那个字母 f[i][j] = f[i][j - 2]
**/
/**
初始条件：
空串 和 空正则匹配 f[0][0] = true
非空串 和 空正则不匹配 f[1][0] = false f[2][0] = false  f[n][0] = false  
空串 和 非空正则（需要计算）
非空串 和 非空正则 （需要计算）
**/
var isMatch = function(s, p) {
    let n = s.length;
    let m = p.length;
    //初始化默认全为 false
    let f = new Array(n + 1).fill(0).map(r => new Array(m + 1).fill(false))
    for(let i = 0; i <= n; i++){
        for(let j = 0; j <= m; j++){
            if(j == 0){
                //空正则
                // 除非i==0，否则均为false
                f[i][j] = i == 0;
            }else{
                //非空正则
                //情况1: 正常字母，‘·’
                //情况2： ‘*’
                if(p[j - 1] != '*'){ 
                    //p中字母索引0对应的是第1个数，所以 -1
                    if(i > 0 && (s[i - 1] == p[j - 1] || p[j - 1] == '.')){
                        f[i][j] = f[i - 1][j - 1];
                    }
                }else{
                    //忽略 *前的字母
                    if(j >= 2){
                        f[i][j] |= f[i][j - 2]
                    }
                    //不忽略 *前的字母
                    if(i >= 1 && j >= 2 && (s[i - 1] == p[j - 2] || p[j - 2] == '.')){
                        f[i][j] |= f[i - 1][j]
                    }
                    //这里先看，后不看。
                  	//所以 f[i][j] 会被计算两次，尽量取两次计算中true的情况。所以用到了|运算
                }
            }
        }
    }
    return f[n][m];
};


//递归实现
var isMatch = function(s, p) {
    //从字符串s,正则p 的第一个字母开始匹配
    return match(s, p, 0, 0)
};

function match(s, p, sIndex, pIndex){
    //匹配成功的情况(s与p都遍历到末尾)
    if(sIndex == s.length && pIndex == p.length){
        return true;
    }
    //匹配失败的情况（p遍历完了,s没遍历完）
    //(s遍历完了，p没遍历完,不能保证就是不匹配 如 s: a   p:ac*)
    if(pIndex == p.length && sIndex < s.length){
        return false;
    }
    //如果p的后一个字母是*
    //需要判断*前面那个字母是否匹配
    if(p[pIndex + 1] == '*'){
        //需要考虑·*的情况(p[pIndex] == '.' && sIndex < s.length)
        if(p[pIndex] == s[sIndex] || (p[pIndex] == '.' && sIndex < s.length)){
            //分3中情况
            return match(s, p, sIndex, pIndex + 2) //直接忽略*前面这个字母
            || match(s, p, sIndex + 1, pIndex + 2) //*前面这个字母只匹配一次
            || match(s, p, sIndex + 1, pIndex) //*前面这个字母匹配多次
        }else{
            //前面那个字母不匹配，直接忽略*前面这个字母
            return match(s, p, sIndex, pIndex + 2);
        }
    }
    //如果当前字母匹配，则继续匹配后面的字母
    if(s[sIndex] == p[pIndex] || (p[pIndex] == '.' && sIndex < s.length)){
        return match(s, p, sIndex + 1, pIndex + 1);
    }
    //当前字母都不匹配，直接返回false
   return false;
}
```

## 面试题20 : 表示数值的字符串

### 问题描述:

请实现一个函数用来判断字符串是否表示数值（包括整数和小数）。例如，字符串"+100"、"5e2"、"-123"、"3.1416"、"-1E-16"、"0123"都表示数值，但"12e"、"1a3.14"、"1.2.3"、"+-5"及"12e+5.4"都不是。

### 问题分析:

![找错专用图6](/img/algorithm/jianzhi/找错专用图6.png)

居然没做= =

用三个bool标志位isNum，isDot，ise_or_E标记  已经遍历过的字符串中 是否出现过数字、小数点、e/E

遍历过程需要满足下面的条件：（不满足条件的情况全部返回了false，那么剩下的就是正确的情况）

1. 小数点前不能出现e/E

2. e/E前必须存在数字，且不能已经出现过e/E（需要重置isNum=false，因为e/E后面必须跟上整数，而最后返回的是isNum）

3. 正负号只能出现在 第一个位置 或者 e/E后面的第一个位置

返回isNum(一个数必须存在数字)

#### java代码实现:

```java

```

#### JavaScript代码实现:

```javascript
var isNumber = function(s) {
    if(s == null || s.length == 0) return false;

    //标记是否遇到数位，小数点，e或者E
    let isNum = false, isDot = false, ise_or_E = false;
		//将字符串转化成数组
    let str = s.trim()

    for(let i = 0; i < str.length; i++){
        if(str[i] >= '0' && str[i] <= '9'){
            isNum = true;
        }
        else if(str[i] == '.'){
            //小数点前不能重复出现小数点，e/E
            if(isDot || ise_or_E) return false;
            isDot = true;
        }
        else if(str[i] == 'e' ||str[i] == 'E'){
            //e或E前面必须有整数，且不能出现e/E
            if(!isNum || ise_or_E) return false;
            ise_or_E = true;
            //重置isNum，因为e和E后面也必须接上整数
            isNum = false;
        }
        else if(str[i] == '-' || str[i] == '+'){
            // 正负号只可能出现在第一个位置，或者出现在‘e’或'E'的后面一个位置
            if(i!=0 && str[i-1] != 'e' && str[i-1] != 'E') return false; 
        }
        else{
            return false;
        } 
    }
    return isNum;
};
```

## 面试题21 : 调整数组顺序使奇数位于偶数前面

### 问题描述:

输入一个整数数组，实现一个函数来调整该数组中数字的顺序，使得所有奇数位于数组的前半部分，所有偶数位于数组的后半部分。

**示例：**

```
输入：nums = [1,2,3,4]
输出：[1,3,2,4] 
注：[3,1,2,4] 也是正确的答案之一。
```

**提示：**

1. `1 <= nums.length <= 50000`
2. `1 <= nums[i] <= 10000`

### 问题分析:

我们使用双指针进行该题的求解:

首先定义两个指针变量left和right,分别指向数组的索引为0的位置和数组最后索引的位置;

因为该题要求我们将奇数位于数组的前半部分,偶数位于数组的后半部分,我们获取数组的left索引位置的值:

判断其是否为奇数: 

​	如果是奇数,那么我们保持该值位置的不变[因为已经是奇数了],将left指针向后平移一位

​	如果是偶数,那么我们选择将该位置的值和right索引的位置的值进行交换处理,使得right索引位置的值为偶数,同时将right指针向前平移一位; 注意此时left指针的位置保持不变,因为可能当前left和right索引交换完对应位置的值以后,left指针位置的值仍为偶数

当最终left > right,结束while循环,此时的数组即完成了奇数部分在前半部分,偶数部分在后半部分.

#### java代码实现:

```java
//双指针实现
public int[] exchange(int[] nums) {
    //如果nums数组为null或者长度小于等于1,则返回nums数组本身即可
    if (nums == null || nums.length <= 1) {
        return nums;
    }
    //分别定义左指针left,右指针right,分别指向nums数组索引为0和nums.length - 1的位置
    int left = 0;
    int right = nums.length - 1;
    //在left指针 <= right指针的条件下
    while(left <= right) {
        int leftValue = nums[left];
        //判断其为奇数吗?
        if (leftValue % 2 == 1) {
            //位置不变,left指针右移
            left++;
        }else {
            //leftValue为偶数
            //与right指针所指的位置交换数据,然后将right指针左移
            nums[left] = nums[right];
            nums[right] = leftValue;
            right--;
        }
    }
    //while循环结束,返回奇偶数分割开的nums数组
    return nums;
}
```

#### JavaScript代码实现:

```javascript
方法1：首尾双指针
var exchange = function(nums) {
    //定义2个指针，一个从前往后遍历找偶数，一个从后往前遍历找奇数，交换奇数偶数的位置
    //中止条件是第一个指针的位置>第二个指针的位置
    let p = 0;
    let q = nums.length - 1;
    while(p < q){
        while(p < q && (nums[p] & 0x01) != 0){
            p++;
        }
        while(p < q && (nums[q] & 0x01) == 0){
            q--;
        }
        let temp = nums[p];
        nums[p] = nums[q];
        nums[q] = temp;
    }
    return nums;
};

方法2：快慢双指针
//慢指针 存放 奇数放置的位置
//快指针 找 奇数
var exchange = function(nums) {
    let slow = 0, fast = 0;
    let len = nums.length;
    while(fast < len){
        if(nums[fast] & 1){
            //fast指向的是偶数
            let temp = nums[slow];
            nums[slow] = nums[fast];
            nums[fast] = temp;
            slow++;
        }
        fast++;
    }
    return nums;
}
```

## 面试题22 : 链表中倒数第k个节点

### 问题描述:

输入一个链表，输出该链表中倒数第k个节点。为了符合大多数人的习惯，本题从1开始计数，即链表的尾节点是倒数第1个节点。

例如，一个链表有 `6` 个节点，从头节点开始，它们的值依次是 `1、2、3、4、5、6`。这个链表的倒数第 `2` 个节点是值为 `4` 的节点。

**示例：**

```
给定一个链表: 1->2->3->4->5, 和 k = 2.
返回链表 4->5.
```

### 问题分析:

![](/img/algorithm/jianzhi/22.png)

#### java代码实现:

![找错专用图4](/img/algorithm/jianzhi/找错专用图4.jpg)

推荐你用我的方法~~~

```java
public ListNode getKthFromEnd(ListNode head, int k) {
    //如果head节点为null
    if (head == null) return null;
    //获取该链表有效节点的个数
    int size = getSize(head);
    //如果k值输入不符合要求,也返回null
    if (k <= 0 || k > size) {
        return null;
    }
    //输出倒数第k个节点  == 输出正向的第size - k个节点
    ListNode temp = head;
    for (int i = 0; i < size - k; i++) {
        temp = temp.next;
    }
    return temp;
}

//获取链表的长度(即有效节点的个数)
private int getSize(ListNode head) {
    ListNode temp = head;
    int size = 0;
    while (true) {
        size++;
        if (temp.next == null) {
            break;
        }
        temp = temp.next;
    }
    return size;
}
```

#### JavaScript代码实现:

```javascript
var getKthFromEnd = function(head, k) {
    //只遍历一次链表
    //定义2个指针，第一个指针先走k-1步，第2个指针保持不动
    //因为两个指针之间相差k-1步，当第一个指针走到链表末尾时，第一个节点就指向倒数第k个节点
    let p1 = head;
    let p2 = head;
    for(i = 1; i <= k -1; i++){
        p1 = p1.next;
    }
    while(p1.next != null){
        p1 = p1.next;
        p2 = p2.next;
    }
    return p2;
};
```

## 面试题22 : 链表中环的入口节点

### 问题描述:

这道题有两个问题,一个是判断一个链表是否存在环?还有一个是要求找到链表中环的入口节点?

我们分别来看一下这两个问题:

给定一个链表，返回链表开始入环的第一个节点。 如果链表无环，则返回 `null`。

为了表示给定链表中的环，我们使用整数 `pos` 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 `pos` 是 `-1`，则在该链表中没有环。**注意，pos 仅仅是用于标识环的情况，并不会作为参数传递到函数中。**

**说明：**不允许修改给定的链表。

**进阶：**

- 你是否可以使用 `O(1)` 空间解决此题？



**示例 1：**

![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/07/circularlinkedlist.png)

```
输入：head = [3,2,0,-4], pos = 1
输出：返回索引为 1 的链表节点
解释：链表中有一个环，其尾部连接到第二个节点。
```

**示例 2：**

![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/07/circularlinkedlist_test2.png)

```
输入：head = [1,2], pos = 0
输出：返回索引为 0 的链表节点
解释：链表中有一个环，其尾部连接到第一个节点。
```

**示例 3：**

![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/07/circularlinkedlist_test3.png)

```
输入：head = [1], pos = -1
输出：返回 null
解释：链表中没有环。
```

**提示：**

- 链表中节点的数目范围在范围 `[0, 104]` 内
- `-105 <= Node.val <= 105`
- `pos` 的值为 `-1` 或者链表中的一个有效索引

### 问题分析:

上面的题目可以分支为两个问题:

#### 第一个问题:是否存在环?

思路1是利用哈希表进行存储求解,但是速度较慢;思路2使用快慢指针进行求解;

#### 第二个问题:找到该环形链表的入口节点?

思路1仍然是哈希表进行存储求解;思路2使用快慢指针所走步数之间的关系来求解该问题,我们重点来看一下第二种思路的思路分析:

![](/img/algorithm/jianzhi/23.png)

#### 问题1的java代码实现:

```java
/*
    * 思路1:使用HashSet的唯一性:将每一个节点的next域添加到HashSet中,若存在相同的next域,则说明存在环
    * */
public boolean hasCycleByHash(ListNode head) {
    if (head == null || head.next == null) {
        //即表示该链表不存在节点或者只存在一个节点
        return false;
    }
    HashSet<ListNode> set = new HashSet<>();
    ListNode temp = head;
    while (temp != null) {
        if (!set.contains(temp)) {
            set.add(temp);
            temp = temp.next;
        }else {
            return true;
        }
    }
    //说明遍历到链表尾部,仍未发现环,则返回false
    return false;
}

/*
    * 思路2:使用快慢指针来完成环形链表的是否有环判断问题
    * 即定义一个指针first和指针second同时指向链表的头节点
    * 将first指向下一个节点,second指向下下个节点,若second能赶上first,则表示存在环
    * */
public boolean hasCycle(ListNode head) {
    if (head == null || head.next == null) {
        //即表示该链表不存在节点或者只存在一个节点
        return false;
    }
    //定义两个指针slow和fast:进行追赶
    ListNode slow = head;
    ListNode fast = head.next;
    while (slow != fast) {//只要first不等于second,就一直进行追赶
        if (fast == null || fast.next == null) {//若first为null或者first的下一个节点为null,说明不存在环形链表,则直接返回false
            return false;
        }
        //将first指向它的下一个节点,second指向它的下下个节点
        slow = slow.next;
        fast = fast.next.next;

    }
    //退出while循环,说明second追赶上了first
    return true;
}
```

#### 问题2的java代码实现:

```java
//思路1:hashset法:击败24%的用户
public ListNode detectCycle01(ListNode head) {
    //如果头节点为空或者只有一个节点:则表示无环
    if(head == null || head.next == null) {
        return null;
    }

    //定义一个HashSet
    HashSet<ListNode> set = new HashSet<>();
    ListNode temp = head;
    while (temp != null) {
        if (set.contains(temp)) {
            return temp;
        }else {
            set.add(temp);
            temp = temp.next;
        }
    }
    //while循环遍历结束,仍未发现环,则返回null
    return null;
}

//思路2:快慢指针法:快指针追赶上慢指针一定是在环的内部,并且两者的步数存在一定的关系:击败100%的用户
public ListNode detectCycle(ListNode head) {
    if (head == null || head.next == null) {
        return null;
    }
    //定义两个指针:slow和fast,以及一个存储最后返回的ListNode变量
    ListNode slow = head;
    ListNode fast = head;
    ListNode temp = head;
    while (true) {
        if (fast == null || fast.next == null) {//当遍历到最后链表的最后一个节点:即无环,返回null
            return null;
        }
        //将快指针指向next.next域,慢指针指向next域
        fast = fast.next.next;
        slow = slow.next;
        //若快慢指针相遇了,则直接break返回,此时slow和fast指针指向的都是相遇时的位置
        if (fast == slow) {
            //当两者相遇了
            break;
        }
    }
    //将temp指针和fast指针一起同步移动,再次相遇则是环的起始位置
    while (temp != fast) {
        temp = temp.next;
        fast = fast.next;
    }
    return temp;
}
```

#### JavaScript代码实现:

问题一：是否存在环

```javascript
//方法一：使用map存储    节点：next节点   
//如果map中已经存在，说名存在环
var hasCycle = function(head) {
    let p = head;
    let map = new Map();
    while(p != null){
        if(!map.has(p)){
            map.set(p, p.next)
        }else{
            return true;
        }  
        p = p.next; 
    }
    return false;
}

//方法二：使用快慢指针
//如果存在环，快慢指针最终会相遇
var hasCycle = function(head) {
    if(!head || !head.next) return false;
//定义两个指针，分别指向头结点和头结点的下一个节点
//慢指针平移一步，快指针平移两步，如果存在环形链表，则一定会在某个时间点，慢指针和快指针在环内相遇
    let first = head;
    let second = head;
    while(first != second){
        //若一方的下一个节点为null，就不存在环形，直接返回false
        if( second == null || second.next == null){
            return false;
        }
        first = first.next;
        second = second.next.next;
    } 
    return true;
};
```

问题二：环的入口节点

![t-22-1](/img/algorithm/jianzhi/t-22-1.jpg)

```javascript
方法一：使用map
var detectCycle = function(head) {
    let p = head;
    let map = new Map();
    while(p != null){
        if(!map.has(p)){
            map.set(p, p.next)
        }else{
            return p;
        }  
        p = p.next; 
    }
    return null;
}
方法二： 使用快慢指针
var detectCycle = function(head) {
     if(!head || !head.next) return null;
     if(head.next ==  head) return head;
//定义两个指针，分别指向头结点和头结点的下一个节点
//慢指针平移一步，快指针平移两步，如果存在环形链表，则一定会在某个时间点，慢指针和快指针在环内相遇
    let first = head;
    let second = head;
    let temp = head;
    while(true){
        //若一方的下一个节点为null，就不存在环形，直接返回false
        if(second == null || second.next == null){
            return null;
        }
        first = first.next;
        second = second.next.next;
        if(first == second) break;
    }
    //此时first和second是相同的位置
    while(first != temp){
        first = first.next;
        temp = temp.next;
    }
    return temp;   
};
```

## 面试题24 : 反转链表

### 问题描述:

定义一个函数，输入一个链表的头节点，反转该链表并输出反转后链表的头节点。

**示例:**

```
输入: 1->2->3->4->5->NULL
输出: 5->4->3->2->1->NULL
```

**限制：**

`0 <= 节点个数 <= 5000`

### 问题分析:

![](/img/algorithm/jianzhi/24.png)

#### java代码实现:

```java
public ListNode reverseList(ListNode head) {
    //如果链表的头结点为null或者链表只有一个节点,则返回head本身即可
    if (head == null || head.next == null) return head;
    //定义一个新的链表头结点,只是作为一个头节点的标志位
    ListNode newHead = new ListNode(0);
    //同时定义一个辅助节点指向head
    ListNode cur = head;
    while (cur != null) {
        //定义一个节点next:保存当前遍历节点的next域
        ListNode next = cur.next;
        //先将cur的next域指向newHead的next域
        cur.next = newHead.next;
        //再将newHead的next域指向cur
        newHead.next = cur;
        //最后将temp指向temp的next域:即保存的next节点
        cur = next;
    }
    //此时newHead的next作为头节点表示的就是即为反转链表的头结点
    return newHead.next;
}
```

#### JavaScript代码实现:

```javascript
/**
创建一个新链表，每新增一个节点都插入到该新链表的头部
**/
var reverseList = function(head) {
    if(head == null)return head;//特殊情况

    let newHead = new ListNode(head.val);//创建一个新链表,存储原链表的第一个节点
    let temp ;

    while(head.next != null){ //如果下一个节点非空，创建下一个节点，并插入到新链表之前
        temp = new ListNode(head.next.val)
        temp.next = newHead;
        newHead = temp;
        head = head.next;       
    }
    
    return newHead;
};
```

## 面试题25 : 合并两个排序的链表

### 问题描述:

输入两个递增排序的链表，合并这两个链表并使新链表中的节点仍然是递增排序的。

**示例1：**

```
输入：1->2->4, 1->3->4
输出：1->1->2->3->4->4
```

**限制：**

`0 <= 链表长度 <= 1000`

### 问题分析:

#### 思路1: 利用栈进行求解

![](/img/algorithm/jianzhi/25.png)

#### 思路2: 使用递归法进行实现:

对于mergeTwoLists函数来说:

* 如果传入的链表1的当前节点l1为null,则表示链表1无元素,直接返回l2节点即可;同理,如果传入的链表2的当前节点l2为null,则表示链表2无元素,直接返回l1节点即可

* 否则我们进行l1和l2当前节点的val大小的判断:

  * 如果l1.val < l2.val:

    	则将l1节点选择出来,作为下一轮比较的前向节点

  * 如果l1.val >= l2.val:

    	则将l2节点选择出来,作为下一轮比较的前向节点

#### java代码实现:

![找错专用图3](/img/algorithm/jianzhi/找错专用图3.jpg)

为什么要用栈。。。可以用我的写的思路1。。。（好吧，和你思路二的递归想法是一样的![img](/img/algorithm/jianzhi/1.png)）

```java
思路1实现:
public ListNode mergeTwoLists01(ListNode l1, ListNode l2) {
    //首先判断两个头结点是否都为null,如果均为null则直接返回null即可
    if (l1 == null && l2 == null) {
        return null;
    }
    //定义一个新的链表头节点:仅仅表示一个头节点标志位
    ListNode head = new ListNode();
    //首先将两个链表的所有节点压入栈
    Stack<ListNode> stack = new Stack<>();
    ListNode head1 = l1;
    ListNode head2 = l2;
    while (head1 != null) {
        stack.push(head1);
        head1 = head1.next;
    }
    while (head2 != null) {
        stack.push(head2);
        head2 = head2.next;
    }
    //添加节点[根据val值从小到大的顺序]
    while (stack.size() > 0) {
        addNode(head,stack.pop());
    }
    //添加节点完毕,直接返回head的next域即为合并之后的新的头节点
    return head.next;
}

private void addNode(ListNode head, ListNode pop) {
    ListNode temp = head;
    while (true) {
        if (temp.next == null) {//表示当前链表为空或者遍历到链表的最后一个元素,直接返回
            break;
        }
        if (temp.next.val >= pop.val) {//找到pop节点的添加位置
            break;
        }
        temp = temp.next;
    }
    //while循环结束,即找到pop添加的位置:即temp的下一个节点即为pop的位置
    //所以将pop的下一个节点指向temp的next域,再将temp的下一个节点指向pop
    pop.next = temp.next;
    temp.next = pop;
}

思路2实现:
public ListNode mergeTwoLists(ListNode l1,ListNode l2) {
    if (l1 == null) {
        return l2;
    }else if (l2 == null) {
        return l1;
    }else if (l1.val < l2.val) {
        l1.next = mergeTwoLists(l1.next,l2);
        return l1;
    }else { //即l1.val >= l2.val
        l2.next = mergeTwoLists(l1,l2.next);
        return l2;
    }
}
```

#### JavaScript代码实现:

![t-25-1](/img/algorithm/jianzhi/t-25-1.jpg)

```javascript
方法1：
var mergeTwoLists = function(l1, l2) {
    if(l1 == null) return l2 == null ? l1 : l2;
    if(l2 == null) return l1 == null ? l2 : l1;

    let newHead = new ListNode(0);
    let t = newHead;
    
    while(l1!=null && l2!=null){
        if(l1.val <= l2.val){
            t.next = new ListNode(l1.val);
            l1 = l1.next;
            t = t.next;
        }else{
            t.next = new ListNode(l2.val);
            l2 = l2.next;
            t = t.next;
        }
    }
    if(l1 != null){
        t.next = l1;
    }else{
        t.next = l2;
    }

    return newHead.next;
};
```

## 面试题26 : 树的子结构

### 问题描述:

输入两棵二叉树A和B，判断B是不是A的子结构。(约定空树不是任意一个树的子结构)

B是A的子结构， 即 A中有出现和B相同的结构和节点值。

例如:

```
给定的树 A:
     3
    / \
   4   5
  / \
 1   2
给定的树 B:
   4 
  /
 1
返回 true，因为 B 与 A 的一个子树拥有相同的结构和节点值。
```

**示例 1：**

```
输入：A = [1,2,3], B = [3,1]
输出：false
```

**示例 2：**

```
输入：A = [3,4,5,1,2], B = [4,1]
输出：true
```

**限制：**

`0 <= 节点个数 <= 10000`

### 问题分析:

使用递归法进行求解:

* (1) **judgeSubStructure(TreeNode A, TreeNode B)** 函数：

  终止条件：
  当节点 B 为空：说明树 B已匹配完成（越过叶子节点），因此返回 true；
  当节点 A为空：说明已经越过树 A叶子节点，即匹配失败，返回 false ；
  当节点 A和 B 的值不同：说明匹配失败，返回 false ；
  返回值：
  判断 A和 B的左子节点是否相等，即 judgeSubStructure(A.left, B.left) ；
  判断 AA 和 BB 的右子节点是否相等，即 judgeSubStructure(A.right, B.right) ；

* (2) **isSubStructure(A, B)** 函数：

  特例处理： 当 树 A 为空 或 树 B 为空 时，直接返回 false ；
  返回值： 若树 B 是树 A 的子结构，则必满足以下三种情况之一，因此用或 || 连接；
  以 节点 A 为根节点的子树 包含树 B ，对应  judgeSubStructure(A, B)；
  树 B 是 树 A左子树 的子结构，对应 isSubStructure(A.left, B)；
  树 B 是 树 A右子树 的子结构，对应 isSubStructure(A.right, B)；

#### java代码实现:

```java
public boolean isSubStructure(TreeNode A, TreeNode B) {
    //递归条件A != null && B != null
    return (A != null && B != null) && (judgeSubStructure(A,B) || isSubStructure(A.left,B) || isSubStructure(A.right,B));
}

private boolean judgeSubStructure(TreeNode A, TreeNode B) {
    if (B == null) {//B树匹配到末尾,则表示A树种存在该B树子结构,返回true
        return true;
    }else if (A == null) {//遍历到A树的一端末尾仍未发现匹配,则返回false
        return false;
    }
    //若A树当前结点的val值 != B树当前结点的val值,则直接返回false,表示此时的A子树不是B树结构
    if (A.val != B.val) {
        return false;
    }
    //递归比较A树的左节点和B树的左节点以及A树的右节点和B树的右节点
    return judgeSubStructure(A.left,B.left) && judgeSubStructure(A.right,B.right);
}
```

#### JavaScript代码实现:

```javascript
var isSubStructure = function(A, B) {
    return (A != null && B != null) && (judgeSubStructor(A, B) || isSubStructure(A.left, B) || isSubStructure(A.right, B));
};

var judgeSubStructor = function(A, B){
  	//结束条件：如果B遍历结束说明匹配，如果A遍历结束说明不匹配
    if( B == null){
        return true;
    }else if(A == null){
        return false;
    }

    if(A.val != B.val){
        return false;
    }
  //如果当前的两个值相等，则判断A,B两树的左子树与右子树是否相等
    return judgeSubStructor(A.left, B.left) && judgeSubStructor(A.right, B.right);
}
```

## 面试题27 : 二叉树的镜像 

### 问题描述:

请完成一个函数，输入一个二叉树，该函数输出它的镜像。

例如输入：

```
     4
   /   \
  2     7
 / \   / \
1   3 6   9
```

镜像输出：

```
     4
   /   \
  7     2
 / \   / \
9   6 3   1
```

**示例 1：**

```
输入：root = [4,2,7,1,3,6,9]
输出：[4,7,2,9,6,3,1]
```

**限制：**

`0 <= 节点个数 <= 1000`

### 问题分析:

使用回溯法进行求解:

(1) 首先我们判断该二叉树是否为空或者只有一个根节点,此时镜像以后的二叉树即为其本身

(2) 然后我们使用回溯法进行该二叉树的镜像操作:
	第一步: 判断左子树是否为空: 如果不为空,则递归进行镜像操作

​	第二步: 判断右子树是否为空: 如果不为空,则递归进行镜像操作

​	第三步: 对当前根节点的左右子节点进行镜像交换操作,即将当前根节点的左子树指向右子树,右子树指向左子树

#### java代码实现:

![找错专用图4](/img/algorithm/jianzhi/找错专用图4.jpg)

也可以使用栈，对每一个节点都进行左右节点的交换

```java
public TreeNode mirrorTree(TreeNode root) {
    if (root == null || root.left == null && root.right == null) {
        //如果root为null或者只有一个root结点,则直接返回root结点
        return root;
    }else {
        //对该二叉树进行翻转(镜像操作),最后返回root结点
        reverse(root);
        return root;
    }
}
//利用递归回溯法完成二叉树的镜像变换
public void reverse(TreeNode node) {
    //如果node结点的左子树不为空,则递归翻转左子树
    if (node.left != null) {
        reverse(node.left);
    }
    //如果node结点的右子树不为空,则递归翻转右子树
    if (node.right != null) {
        reverse(node.right);
    }
    //最后,回溯:进行当前结点的左子树和右子树的镜像变换
    TreeNode temp = node.left;
    node.left = node.right;
    node.right = temp;
}
```

#### JavaScript代码实现:

```javascript
方法一：
var mirrorTree = function(root) {
    //特殊情况
    if(root == null){
        return root;
    }
    //否则交换左右子树
    let temp = root.left;
    root.left = root.right;
    root.right = temp;
    //左右子树分别进行交换
    mirrorTree(root.left)
    mirrorTree(root.right)
    return root;
};
```

![t-28-1](/img/algorithm/jianzhi/t-28-1.jpg)

```javascript
方法二：
var mirrorTree = function(root) {
    if(root == null) return null;
    let stack = [root];
    while(stack.length){
        let temp = stack.pop();
        if(temp.left != null){
            stack.push(temp.left);
        }
        if(temp.right != null){
            stack.push(temp.right)
        }
        let t = temp.left;
        temp.left = temp.right;
        temp.right = t;
    }
    return root;
}
```

## 面试题28 : 判断对称的二叉树 

### 问题描述:

请实现一个函数，用来判断一棵二叉树是不是对称的。如果一棵二叉树和它的镜像一样，那么它是对称的。

例如，二叉树 [1,2,2,3,4,4,3] 是对称的。

```
    1
   / \
  2   2
 / \ / \
3  4 4  3
```


但是下面这个 [1,2,2,null,3,null,3] 则不是镜像对称的:

```
    1
   / \
  2   2
   \   \
   3    3
```

**示例 1:**

```
输入：root = [1,2,2,3,4,4,3]
输出：true
```

**示例 2：**

```
输入：root = [1,2,2,null,3,null,3]
输出：false
```

**限制：**

`0 <= 节点个数 <= 1000`

### 问题分析:

使用**递归法**进行求解:

如果一个二叉树是对称的,即表示该二叉树的左子树和右子树是完全一致的

我们即可以使用递归反进行实现,如果当前根节点的左子树的val值等于右子树的val值,那么我们递归比较该左子树的左子树和右子树的右子树以及左子树的右子树和右子树的左子树;

如果比较过程中,left和right均为null: 则直接返回true; 如果只有一方为null,则一定不是对称的,直接返回false;

#### java代码实现:

```java
public boolean isSymmetric(TreeNode root) {
    //首先若根结点为null或者只有根结点一个结点,则说明其是对称的,返回true
    if (root == null || (root.left == null && root.right == null)) {
        return true;
    }
    //如果该树是对称的,即表示左子结点的值等于右子结点的值
    //我们利用递归回溯法进行判断这颗二叉树是否为对称的
    return judge(root.left,root.right);
}

private boolean judge(TreeNode left, TreeNode right) {
    //如果left和right均为null:即表示比较到叶子结点的下一个结点,则说明比较结束,返回true
    if (left == null && right == null) {
        return true;
        //如果只有其中一个结点为null,另一个不为null,说明该二叉树不是对称的,返回false
    }else if (left == null || right == null) {
        return false;
    }
    //比较当前left结点的val和right结点的val值是否相等
    if (left.val == right.val) {
        //若相等:则递归比较left子树的左子结点和right子树的右子节点,
        // 以及left子树的右子结点和right子树的左子结点的值是否相等
        return judge(left.left,right.right) && judge(left.right,right.left);
    }else {
        //前left结点的val和right结点的val值不相等,说明不对称,直接返回false即可
        return false;
    }
}
```

#### JavaScript代码实现:

```javascript
/**
	两棵子树进行比较
**/
var isSymmetric = function(root) {
    if(root == null) return true;
    return isMirror(root.left, root.right);
};

function isMirror(r1, r2){
    if(r1 == null && r2 == null){
        return true;
    }
    if(r1 == null || r2 == null){
        return false;
    }
    return r1.val == r2.val && isMirror(r1.left, r2.right) && isMirror(r1.right, r2.left);
}
```

## 面试题29 : 顺时针打印矩阵 

### 问题描述: 

输入一个矩阵，按照从外向里以顺时针的顺序依次打印出每一个数字。

**示例 1：**

```
输入：matrix = [[1,2,3],[4,5,6],[7,8,9]]
输出：[1,2,3,6,9,8,7,4,5]
```

**示例 2：**

```
输入：matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
输出：[1,2,3,4,8,12,11,10,9,5,6,7]
```

**限制：**

- `0 <= matrix.length <= 100`
- `0 <= matrix[i].length <= 100`

### 问题分析:

**图解分析:**

![](/img/algorithm/jianzhi/29_1.png)

![](/img/algorithm/jianzhi/29_2.png)

#### java代码实现:

![找错专用图4](/img/algorithm/jianzhi/找错专用图4.jpg)

快去看我的方法1（好吧，你的方法更好一点）

```java
public List<Integer> spiralOrder(int[][] matrix) {
    List<Integer> res = new ArrayList<>();
    //如果传入的矩阵为null或者行数为0,则直接返回一个空的list
    if (matrix == null || matrix.length == 0) return res;
    //获取矩阵的行数和列数
    int row = matrix.length;
    int col = matrix[0].length;
    //其中螺旋一周的次数为行数 / 2
    int times = Math.min(row >> 1,col >> 1);//右移一位 == 除以2(不包括只有一行或者单个元素)
    int time = 0;
    while (time < times) {
        //首先保存矩形的第一行
        for (int i = time; i < col - 1 - time; i++) {
            res.add(matrix[time][i]);
        }
        //接着保存矩形的最后一列
        for (int i = time; i < row - 1 - time; i++) {
            res.add(matrix[i][col - 1 - time]);
        }
        //然后保存矩形的最后一行
        for (int i = col - 1- time; i > time; i--) {
            res.add(matrix[row - 1 - time][i]);
        }
        //最后保存第一列
        for (int i = row - 1- time; i > time; i--) {
            res.add(matrix[i][time]);
        }
        time++;
    }

    //row为奇数:最后会剩下一行,此时行数一定小于等于列数
    if (row <= col && row % 2 == 1) {
        for (int i = time; i <= col - 1 - time; i++) {
            res.add(matrix[time][i]);
        }
        return res;
    }
    //col为奇数:最后会剩下一列,此时行数一定大于列数
    if (row > col && col % 2 == 1) {
        for (int i = time; i <= row - 1 - time; i++) {
            res.add(matrix[i][time]);
        }
        return res;
    }
    return res;
}
```

#### JavaScript代码实现:

![t-29-1](/img/algorithm/jianzhi/t-29-1.jpg)

```javascript
方法1：
var spiralOrder = function(matrix) {
    let rows = matrix.length;
    if(rows == 0) return [];
    if(rows == 1) return matrix[0];
    let cols = matrix[0].length;
    let l = 0, r = cols - 1;
    let t = 0, b = rows - 1;
    let res = [];
    while(l < r && t < b){
        for(let i = l; i <= r; i++){
            res.push(matrix[t][i]);
        }
        t++;
        for(let j = t; j <= b; j++){
            res.push(matrix[j][r]);
        }
        r--;
        for(let k = r; k >= l; k--){
            res.push(matrix[b][k])
        }
        b--;
        for(let p = b; p >= t; p--){
            res.push(matrix[p][l])
        }
        l++;
    }
    if(l == r && t == b){
        res.push(matrix[l][t])
    }
    else if(l == r){
        for(let i = t; i <= b; i++){
            res.push(matrix[i][l])
        }
    }
    else if(t == b){
        for(let i = l; i <= r; i++){
            res.push(matrix[t][i])
        }
    }
    return res;
};
```

```javascript
方法2：
/**
    该方法关键是：计算螺旋一周的次数为  Math.min(行数 / 2, 列数 / 2)
**/
var spiralOrder = function(matrix) {
    if(matrix == null || matrix.length == 0) return [];
    let res = [];
    printMatrixClockWisely(matrix, matrix[0].length, matrix.length, res);
    return res;
};
//colums, rows分别对应矩阵的列数，行数
function printMatrixClockWisely(matrix, colums, rows, res){
    // if(matrix == null || colums <= 0 ||rows <= 0){
    //     return;
    // } 
    //使用printMatrixClockWisely函数前已经对matrix处理过了，可以不用上面的代码
    let start = 0; //start控制圈数
    while(colums > start * 2 && rows > start * 2){
        printMatrixCircle(matrix, colums, rows, start, res);
        ++start;
    }
}

function printMatrixCircle(matrix, colums, rows, start, res){
    let endX = colums - 1 - start;
    let endY = rows - 1 - start;
    
    //从左至右打印
    for(let i = start; i <= endX; ++i){
        res.push(matrix[start][i])
    }    
    //从上至下打印
    // start < endY 条件说明存在 从上至下 的数据
    if(start < endY){
        for(let i = start + 1; i <= endY; ++i){
            res.push(matrix[i][endX])
        }
    }
    //从右至左打印
    //start < endX  条件说明存在 从右至左 的数据
    //start < endY  
    if(start < endX && start < endY){
        for(let i = endX - 1; i >= start; --i){
            res.push(matrix[endY][i])
        }
    }
    //从下至上打印
    //start < endY - 1 条件说明存在 从下至上 的数据
    //start < endX 
    if(start < endX && start < endY - 1){
        for(let i = endY - 1; i >= start + 1; --i){
            res.push(matrix[i][start])
        }
    }
}
```

## 面试题30 : 包含min函数的栈 

### 问题描述:

定义栈的数据结构，请在该类型中实现一个能够得到栈的最小元素的 min 函数在该栈中，调用 min、push 及 pop 的时间复杂度都是 O(1)。

**示例:**

```
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.min();   --> 返回 -3.
minStack.pop();
minStack.top();      --> 返回 0.
minStack.min();   --> 返回 -2.
```

**提示：**

1. 各函数的调用总次数不超过 20000 次

### 问题分析:

数据栈 A ： 栈 A 用于存储所有元素，保证入栈 push() 函数、出栈 pop() 函数、获取栈顶 top() 函数的正常逻辑。
辅助栈 B ： 栈 B 中存储栈 A中所有 非严格降序 的元素，则栈 A中的最小元素始终对应栈 B 的栈顶元素，即 min() 函数只需返回栈 B的栈顶元素即可。
因此，只需设法维护好 栈 B的元素，使其保持非严格降序，即可实现 min() 函数的 O(1) 复杂度。

#### java代码实现:

```java
class MinStack {
    /** initialize your data structure here. */
    Stack<Integer> A,B;
    public MinStack() {
        //空参构造
        A = new Stack<>();//A栈用来存储栈内元素,push和pop操作
        B = new Stack<>();
    }

    public void push(int x) {
        A.add(x);
        if (B.isEmpty() || B.peek() >= x) {
            B.add(x);
        }
    }

    public void pop() {
        if (A.pop().equals(B.peek())) {
            B.pop();
        }
    }

    public int top() {
        return A.peek();
    }

    public int min() {
        return B.peek();
    }
}
```

#### JavaScript代码实现:

```javascript
var MinStack = function() {    
    this.A = []; //普通栈
    this.B = []; //从大到小排列
};
MinStack.prototype.push = function(x) {
    this.A.push(x)
    if(this.B.length == 0 || this.B[this.B.length - 1] >= x){
        this.B.push(x);
    }
};
MinStack.prototype.pop = function() {
    let tmp = this.A.pop()
    if(tmp == this.B[this.B.length - 1]){
        this.B.pop();
    }
};
MinStack.prototype.top = function() {
    return this.A[this.A.length - 1]
};
MinStack.prototype.min = function() {
    return this.B[this.B.length - 1];
};
```

## 面试题31 : 栈的压入、弹出序列

### 问题描述: 

输入两个整数序列，第一个序列表示栈的压入顺序，请判断第二个序列是否为该栈的弹出顺序。假设压入栈的所有数字均不相等。例如，序列 {1,2,3,4,5} 是某栈的压栈序列，序列 {4,5,3,2,1} 是该压栈序列对应的一个弹出序列，但 {4,3,5,1,2} 就不可能是该压栈序列的弹出序列。

**示例 1：**

```
输入：pushed = [1,2,3,4,5], popped = [4,5,3,2,1]
输出：true
解释：我们可以按以下顺序执行：
push(1), push(2), push(3), push(4), pop() -> 4,
push(5), pop() -> 5, pop() -> 3, pop() -> 2, pop() -> 1
```

**示例 2：**

```
输入：pushed = [1,2,3,4,5], popped = [4,3,5,1,2]
输出：false
解释：1 不能在 2 之前弹出。
```

 

**提示：**

1. `0 <= pushed.length == popped.length <= 1000`
2. `0 <= pushed[i], popped[i] < 1000`
3. `pushed` 是 `popped` 的排列。

### 问题分析:

我们利用一个辅助栈进行该题的求解,因为给定一个栈的压入和栈的弹出序列,那它们的压入和弹出顺序是一定的,我们只需要**模拟** 压入 / 弹出操作的排列。根据是否模拟成功，即可得到结果.

我们可以先来观察下面两个例子:

如下图所示，给定一个压入序列 pushed 和弹出序列 popped ，则压入 / 弹出操作的顺序（即排列）是 **唯一确定** 的。

![](/img/algorithm/jianzhi/31-Picture1.png)

如下图所示，栈的数据操作具有 **先入后出** 的特性，因此某些弹出序列是无法实现的。

![](/img/algorithm/jianzhi/32-Picture2.png)



初始化： 辅助栈 stack，弹出序列的索引 i；
遍历压栈序列： 各元素记为 num ；
元素 num 入栈；
循环出栈：若 stack 的栈顶元素 == 弹出序列元素 popped[i] ，则执行出栈与 i++ ；
返回值： 若 stack 为空，则此弹出序列合法。

#### java代码实现:

```java
public boolean validateStackSequences(int[] pushed, int[] popped) {
    //定义一个辅助栈stack
    Stack<Integer> stack = new Stack<>();
    int index = 0; //定义一个索引[弹出序列的索引]
    //根据压入和弹出序列的顺序进行模拟pushed和poped的压入和弹出,最后根据stack是否为空判断是否符合要求
    for (int num : pushed) {
        stack.add(num); //num入栈
        while (!stack.isEmpty() && stack.peek() == popped[index]) {
            //循环判断
            stack.pop();
            index++;
        }
    }
    return stack.isEmpty();
}
```

#### JavaScript代码实现:

![t-31-1](/img/algorithm/jianzhi/t-31-1.jpg)

```javascript
var validateStackSequences = function(pushed, popped) {
    let index = 0;
    let arr = [];
    for(let i = 0; i < pushed.length; i++){
        arr.push(pushed[i]);
        while(arr.length && arr[arr.length-1] == popped[index]){
            arr.pop();
            index++;
        }
    }
    return arr.length == 0;
};
```

## 面试题32 : 从上到下打印二叉树

### 问题描述: 

### 32 - I. 从上到下打印二叉树

从上到下打印出二叉树的每个节点，同一层的节点按照从左到右的顺序打印。

例如:
给定二叉树: `[3,9,20,null,null,15,7]`,

```
    3
   / \
  9  20
    /  \
   15   7
```

返回：

```
[3,9,20,15,7]
```

**提示：**

1. `节点总数 <= 1000`

### 问题分析:

这是**典型的二叉树的BFS求解问题**:

特例处理： 当树的根节点为空，则直接返回空列表 [ ] ；
BFS 循环： 我们定义一个队列nodes,初始化将根节点root节点加入到nodes队列中,循环结束条件[nodes为空]
出队： 队首元素出队，记为 temp；
添加子节点： 若 node 的左（右）子节点不为空，则将左（右）子节点加入队列 nodes,并将左右子节点的val值加入到list集合中 ；
返回值： 定义一个结果集res(大小即为list集合的大小),将list集合的结果拷贝到res中,最后返回打印结果列表 res 即可

#### java代码实现:

```java
//使用BFS进行求解
public int[] levelOrder(TreeNode root) {
    if (root == null)
        //如果root节点为null,则直接返回空的数组结果集
        return new int[0];
    //定义一个list集合:存储每一层顺序遍历的节点的val值
    List<Integer> list = new LinkedList<>();
    //定义nodes:存储节点
    LinkedList<TreeNode> nodes = new LinkedList<>();
    list.add(root.val);//我们首先将第一层,即root节点的val值加入到集合中
    nodes.add(root);
    while (!nodes.isEmpty()) {
        TreeNode temp = nodes.removeFirst();
        if (temp.left != null) {
            list.add(temp.left.val);
            nodes.add(temp.left);
        }
        if (temp.right != null) {
            list.add(temp.right.val);
            nodes.add(temp.right);
        }
    }
    //此时list集合保存即为分层访问的节点的val值
    int[] res = new int[list.size()];
    int index = 0;
    for (Integer val : list) {
        res[index++] = val;
    }
    return res;
}
```

#### JavaScript代码实现:

```javascript
var levelOrder = function(root) {
    if(!root) return []
    const data = [];
    const queue = [root];

    while(queue.length){
        const first = queue.shift();
        data.push(first.val);
        first.left && queue.push(first.left);
        first.right && queue.push(first.right);
    }

    return data;
};
```

### 32 - II. 从上到下打印二叉树

从上到下按层打印二叉树，同一层的节点按从左到右的顺序打印，每一层打印到一行。

例如:
给定二叉树: `[3,9,20,null,null,15,7]`,

```
    3
   / \
  9  20
    /  \
   15   7
```

返回其层次遍历结果：

```
[
  [3],
  [9,20],
  [15,7]
]
```

**提示：**

1. `节点总数 <= 1000`

### 问题分析:

思路和上面的BFS类似,只是此时打印是每一行元素保存在单独的一个结果集中

#### java代码实现:

```java
//BFS思路实现
public List<List<Integer>> levelOrder(TreeNode root) {
    //定义结果集res:存储最后的结果
    List<List<Integer>> res = new ArrayList<>();
    //定义一个链表实现的队列:存储每一层的节点
    LinkedList<TreeNode> queue = new LinkedList<>();
    if (root != null)
        queue.add(root);
    //如果队列不为空
    while (!queue.isEmpty()) {
        List<Integer> sub = new ArrayList<>();
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.removeFirst();
            sub.add(node.val);
            if (node.left != null) queue.add(node.left);
            if (node.right != null) queue.add(node.right);
        }
        //for循环遍历结束,将sub加入res结果集中
        res.add(sub);
    }
    //while循环结束,将res结果集返回
    return res;
}
```

#### JavaScript代码实现:

```javascript
var levelOrder = function(root) {
    if(!root) return [];

    const result = [];
    let nowRoot = [root];

    while(nowRoot.length){
        const nextRoot = [];
        const nowResult = [];
        
        for(let i = 0; i < nowRoot.length; i++){
            nowResult.push(nowRoot[i].val)
            nowRoot[i].left&&nextRoot.push(nowRoot[i].left)
            nowRoot[i].right&&nextRoot.push(nowRoot[i].right)
        }

        nowRoot = nextRoot;
        result.push(nowResult);
    }

    return result;
};
```

## 面试题33 : 二叉搜索树的后序遍历序列

### 问题描述: 

输入一个整数数组，判断该数组是不是某二叉搜索树的后序遍历结果。如果是则返回 `true`，否则返回 `false`。假设输入的数组的任意两个数字都互不相同。 

参考以下这颗二叉搜索树：

```
     5
    / \
   2   6
  / \
 1   3
```

**示例 1：**

```
输入: [1,6,3,2,5]
输出: false
```

**示例 2：**

```
输入: [1,3,2,6,5]
输出: true
```

 

**提示：**

1. `数组长度 <= 1000`

### 问题分析:

![](/img/algorithm/jianzhi/33.png)

#### java代码实现:

```java
//分治思想进行求解
public boolean verifyPostorder(int[] postorder) {
    //需要辅助指针变量:left[开始指向数组为0的索引位置],right[开始指向数组最后索引位置postorder.length - 1]
    //函数名我取dac:即divide and conquer的缩写
    return dac(postorder,0,postorder.length - 1);
}

private boolean dac(int[] postorder, int left, int right) {
    //返回条件:
    // 1.如果此时left == right:表示只存在一个节点:一定为符合二叉搜索树的
    // 2.如果此时left > riht:则表示没有节点了,不用再进行递归了
    if (left >= right) {
        return true;
    }
    //我们需要从左到右进行遍历找到第一个大于最后一个节点[即根节点]的值,即为右子树的开始节点
    int mid = left;
    int root = postorder[right];
    while (postorder[mid] < root) {
        mid++;
    }
    //while循环结束,此时mid即指向第一个大于root的索引位置
    //由于我们再遍历的过程中已经判断了mid索引之前的所有元素是小于root的值的
    //所以我们只需要判断mid到right-1位置的所有元素的值是否都是大于root的值即可
    //由于后续递归分治我们仍需用到mid指针,故此处我们定义一个辅助指针变量指向mid位置
    int temp = mid;
    while (temp < right) {
        if (postorder[temp] < root) {
            return false;
        }
        temp++;
    }
    //如果满足上述情况,即没有返回fasle,则递归判断左子树和右子树
    //其中左子树递归范围[left,mid - 1],右子树递归范围[mid,right - 1]
    return dac(postorder,left,mid - 1) && dac(postorder,mid,right - 1);
}
```

#### JavaScript代码实现:

```javascript
var verifyPostorder = function(postorder) {
    if(!postorder) return postorder;
    let len = postorder.length;
    return verify(postorder, 0, len - 1)
};
let verify = function(postorder, left, right){
    //返回条件:!!!到达叶子节点,可以改成  if(left == right || left == right + 1)
  	// 1.如果此时left == right:表示只存在一个节点
  	// 2.如果此时left == right + 1:表示index == left/right
    if(left >= right){ 
        return true;
    }
    let root = postorder[right];//此时的根节点
    let index = left;//从左往右遍历
    while(postorder[index] < root){
        index++
    }//index指向第一个大于root的索引，右边的是右子树
    for(let i = index; i < right; i++){
        if(postorder[i] < root){ //存在一个不满足>=root的条件则返回false
            return false;
        }
    }

    return verify(postorder, left, index - 1) && verify(postorder, index, right - 1);
}
```

## 面试题34 : 二叉树中和为某一值的路径

### 问题描述: 

输入一棵二叉树和一个整数，打印出二叉树中节点值的和为输入整数的所有路径。从树的根节点开始往下一直到叶节点所经过的节点形成一条路径。

**示例:**
给定如下二叉树，以及目标和 `sum = 22`，

```
              5
             / \
            4   8
           /   / \
          11  13  4
         /  \    / \
        7    2  5   1
```

返回:

```
[
   [5,4,11,2],
   [5,8,4,5]
]
```

**提示：**

1. `节点总数 <= 10000`

### 问题分析:

![](/img/algorithm/jianzhi/34_1.png)

![](/img/algorithm/jianzhi/34_2.png)

#### java代码实现:

```java
//实现1
public List<List<Integer>> pathSum(TreeNode root, int sum) {
    //定义一个结果集res
    List<List<Integer>> res = new ArrayList<>();
    //定义一个部分子集
    List<Integer> sub = new ArrayList<>();
    //通过dfs深度优先遍历完成
    dfs(root,sum,res,sub);
    return res;
}

//其中dfs方法有两种写法
//dfs实现1:  第一种写法更加简洁一些!!!
private void dfs(TreeNode node, int sum, List<List<Integer>> res, List<Integer> sub) {
    //递归结束的条件
    if (node == null) {
        //说明此时遍历到该二叉树的叶子节点的下一个节点
        return;
    }
    //将当前节点的val值添加到sub部分子集中
    //sub.add(node.val);
    sub.add(new Integer(node.val));

    if (node.left == null && node.right == null) {//如果到达叶子节点
        if (sum == node.val) {
            //当此时sum减到0,则表示此时满足
            res.add(new ArrayList<>(sub));
        }
        //此时去除掉sub的最后一个元素
        sub.remove(sub.size() - 1);
        return;
    }

    //进行左子树的dfs递归搜索
    dfs(node.left,sum - node.val,res,sub);
    //进行右子树的dfs递归搜索
    dfs(node.right,sum - node.val,res,sub);
    //回溯回来记得将sub的最后一个元素去除掉
    sub.remove(sub.size() - 1);
}

//dfs实现2:
private void dfs02(TreeNode node, int sum, List<List<Integer>> res, List<Integer> sub) {
    //递归结束的条件
    if (node == null) {
        //说明此时遍历到该二叉树的叶子节点的下一个节点
        return;
    }
    //将当前节点的val值添加到sub部分子集中
    sub.add(new Integer(node.val));

    if (node.left == null && node.right == null) {//如果到达叶子节点
        if (sum == node.val) {
            //当此时sum减到0,则表示此时满足
            res.add(new ArrayList<>(sub));
        }
        //此时去除掉sub的最后一个元素
        //sub.remove(sub.size() - 1);
        return;
    }

    //进行左子树的dfs递归搜索
    if(node.left != null) {
        dfs02(node.left,sum - node.val,res,sub);
        sub.remove(sub.size() - 1);
    }

    //进行右子树的dfs递归搜索
    if(node.right != null) {
        dfs02(node.right,sum - node.val,res,sub);
        //回溯回来记得将sub的最后一个元素去除掉
        sub.remove(sub.size() - 1);
    }
}
```

#### JavaScript代码实现:

```javascript
var pathSum = function(root, sum) {
   if(!root) return [];
   if(root.left == null && root.right == null && root.val == sum) return [[sum]];
   let res = []; //存储最终结果
   let sub = []; //存储路径
   var dfs = function(root, sum, sub){
       sub.push(root.val);
       //到达叶子节点
       if(root.left == null && root.right == null){
           if(root.val == sum){
               //需要存储到达该叶子节点的路径
               res.push(new Array(...sub))
           }
           return;//！这个return,说明此次遍历结束
       }
       if(root.left != null){
           dfs(root.left, sum - root.val, sub);
           sub.pop();
       }
       if(root.right != null){
           dfs(root.right, sum - root.val, sub);
           sub.pop();
       }
   }
   dfs(root, sum, sub);
   return res;
};
```

## 面试题35 : 复杂链表的复制

### 问题描述: 

请实现 `copyRandomList` 函数，复制一个复杂链表。在复杂链表中，每个节点除了有一个 `next` 指针指向下一个节点，还有一个 `random` 指针指向链表中的任意节点或者 `null`。

 

**示例 1：**

![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/01/09/e1.png)

```
输入：head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
输出：[[7,null],[13,0],[11,4],[10,2],[1,0]]
```

**示例 2：**

![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/01/09/e2.png)

```
输入：head = [[1,1],[2,1]]
输出：[[1,1],[2,1]]
```

**示例 3：**

**![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/01/09/e3.png)**

```
输入：head = [[3,null],[3,0],[3,null]]
输出：[[3,null],[3,0],[3,null]]
```

**示例 4：**

```
输入：head = []
输出：[]
解释：给定的链表为空（空指针），因此返回 null。
```

**提示：**

- `-10000 <= Node.val <= 10000`
- `Node.random` 为空（null）或指向链表中的节点。
- 节点数目不超过 1000 。

### 问题分析:

使用**HashMap**法进行解决:

因为我们需要返回一个新的链表:其中的每一个节点都不是之前原链表的引用,而是一个新的节点地址;

所以我们定义一个HashMap :其中的**key(键)为原链表的旧节点,value(值)为以旧节点的val值创建的新节点**;

遍历原链表,完成新链表每个节点的创建

然后再遍历原链表,完成新链表的新节点的next域和random域的复制

其中:

**新节点的next域:即为map中对应key(旧节点的next域)对应的value值**

**新节点的random域:即为map中对应key(旧节点的random域)对应的value值**

最后,返回新的链表的头结点: return map.get(head);

![](/img/algorithm/jianzhi/35.png)

#### java代码实现:

```java
public Node copyRandomList(Node head) {
    //如果该链表为空,则直接返回本身即可
    if (head == null) return head;
    //定义一个Node作为key,Node作为value的map
    Map<Node,Node> map = new HashMap<>();
    //定义一个辅助变量head指向head节点
    Node temp = head;
    //(1)我们首先遍历原链表,将当前节点作为key,以当前节点的val创建的新节点作为value进行存储
    while (temp != null) {
        map.put(temp,new Node(temp.val));
        temp =temp.next;
    }
    //(2)然后再遍历原链表,更新新链表的节点(即上面的value)的next域和random域
    temp = head;
    while (temp != null) {
        map.get(temp).next = map.get(temp.next);
        map.get(temp).random = map.get(temp.random);
        temp = temp.next;
    }
    //(3)最后返回新的链表的头结点即可
    return map.get(head);
}
```

#### JavaScript代码实现:

```javascript
//map存储 原节点：拷贝节点
var copyRandomList = function(head) {
    if(head == null || head.length == 0){
        return null;
    }
    let map = new Map();//存储原节点 ： 当前节点
    let p = head;//指向原节点
    let newHead = new Node(0);
    let newP = newHead;//指向当前节点
    //设置next
    while(p){
        let tempNode = new Node(p.val);
        map.set(p, tempNode);
        newP.next = tempNode;
        p = p.next;
        newP = newP.next;
    }  
    //设置random
    p = head;
    newP = newHead.next;
    while(p){
        let random = map.get(p.random);
        newP.random = random;
        p = p.next;
        newP = newP.next;
    }
    return newHead.next;
};
```

## 面试题36 :  二叉搜索树与双向链表

### 问题描述: 

输入一棵二叉搜索树，将该二叉搜索树转换成一个排序的循环双向链表。要求不能创建任何新的节点，只能调整树中节点指针的指向。

为了让您更好地理解问题，以下面的二叉搜索树为例：

![img](https://assets.leetcode.com/uploads/2018/10/12/bstdlloriginalbst.png)

 

我们希望将这个二叉搜索树转化为双向循环链表。链表中的每个节点都有一个前驱和后继指针。对于双向循环链表，第一个节点的前驱是最后一个节点，最后一个节点的后继是第一个节点。

下图展示了上面的二叉搜索树转化成的链表。“head” 表示指向链表中有最小元素的节点。

 

![img](https://assets.leetcode.com/uploads/2018/10/12/bstdllreturndll.png)

 

特别地，我们希望可以就地完成转换操作。当转化完成以后，树中节点的左指针需要指向前驱，树中节点的右指针需要指向后继。还需要返回链表中的第一个节点的指针。

### 问题分析:

![](/img/algorithm/jianzhi/35_1 (1).png)

![](/img/algorithm/jianzhi/35_1 (2).png)

#### java代码实现:

```java
//定义一个集合:存储节点:按照val值从小到大的顺序
LinkedList<Node> list = new LinkedList<>();
public Node treeToDoublyList(Node root) {
    //如果root节点为null:表示该二叉树为空,直接返回root节点即可
    if (root == null) {
        return root;
    }
    //中序遍历:将节点按照val值从小到大排序存储到集合list中
    infixOrder(root);
    //定义一个头节点head
    Node head = list.removeFirst();
    Node temp = head;//定义一个辅助指针变量指向head
    while (list.size() > 0) {
        //依次获取list中的当前排序的节点
        Node cur = list.removeFirst();
        //将temp的后继节点指向cur节点
        temp.right = cur;
        //再将cur节点的前驱节点指向temp节点
        cur.left = temp;
        //最后将temp指向它的后继节点,即cur节点
        temp = cur;
    }
    //当while循环结束,此时temp指向list的最后一个节点
    //我们将head的前驱节点指向temp,temp的后继节点指向head
    head.left = temp;
    temp.right = head;
    return head;
}
//中序遍历存储节点到list集合的方法
private void infixOrder(Node root) {
    if (root.left != null) {
        infixOrder(root.left);
    }
    list.add(root);
    if (root.right != null) {
        infixOrder(root.right);
    }
}
```

#### JavaScript代码实现:

```javascript
var treeToDoublyList = function(root) {
    if (!root) {
        return;
    }
    let head = null;
    let pre = head;
    inorder(root);

    // 完成中序遍历后，pre指向了最后一个节点
    // 将其闭合成环状结构
    head.left = pre;
    pre.right = head;
    return head;

    function inorder(node) {
        if (!node) return;
        // 遍历左子树
        inorder(node.left);

        // 处理当前节点
        if (!pre) {
            // 遍历到最左边节点，此时节点就是双向链表的head
            head = node;
        } else {
            pre.right = node;
        }
        node.left = pre;
        pre = node;

        // 遍历右子树
        inorder(node.right);
    }
};
```

## 面试题37 : 序列化二叉树

### 问题描述: 

请实现两个函数，分别用来序列化和反序列化二叉树。

**示例:** 

```
你可以将以下二叉树：

    1
   / \
  2   3
     / \
    4   5

序列化为 "[1,2,3,null,null,4,5]"
```

### 问题分析:

**序列化** 使用层序遍历实现。**反序列化** 通过反推各节点在序列中的索引，进而实现

#### 序列化:

定义一个结果集ans: 记录序列化结果集,定义一个队列[list],对二叉树做层序遍历

#### 反序列化:

![](/img/algorithm/jianzhi/37.png)

#### java代码实现:

```java
public class Codec {
   // Encodes a tree to a single string.[序列化]
    public String serialize(TreeNode root) {
        if (root == null) return "[]";
        //定义一个序列化结果集
        StringBuilder ans = new StringBuilder();
        ans.append("[").append(root.val + ",");
        LinkedList<TreeNode> list = new LinkedList<>();
        list.add(root);
        while (!list.isEmpty()) {
            LinkedList<TreeNode> tmp = new LinkedList<>();
            for (TreeNode treeNode : list) {
                if (treeNode.left != null) {
                    tmp.add(treeNode.left);
                }
                if (treeNode.right != null) {
                    tmp.add(treeNode.right);
                }
            }
            for (TreeNode treeNode : list) {
                if (treeNode.left != null) {
                    ans.append(treeNode.left.val + ",");
                }else {
                    if (!tmp.isEmpty())
                        ans.append("null" + ",");
                }
                if (treeNode.right != null) {
                    ans.append(treeNode.right.val + ",");
                }else {
                    if (!tmp.isEmpty())
                        ans.append("null" + ",");
                }
            }
            if (tmp.isEmpty()) {
                ans.deleteCharAt(ans.length() - 1);
                ans.append("]");
            }
            list = tmp;
        }
        return ans.toString();
    }

    // Decodes your encoded data to tree.[反序列化]
    public TreeNode deserialize(String data) {
        if(data.equals("[]")) return null;
        String[] vals = data.substring(1, data.length() - 1).split(",");
        TreeNode root = new TreeNode(Integer.parseInt(vals[0]));
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        int i = 1;
        while(!queue.isEmpty() && i < vals.length) {
            TreeNode node = queue.poll();
            if(!vals[i].equals("null")) {
                node.left = new TreeNode(Integer.parseInt(vals[i]));
                queue.add(node.left);
            }
            i++;
            if(!vals[i].equals("null")) {
                node.right = new TreeNode(Integer.parseInt(vals[i]));
                queue.add(node.right);
            }
            i++;
        }
        return root;
    }
}
```

#### JavaScript代码实现:

```javascript
var serialize = function(root) {
    if(root == null) return [];
    //存储结果
    let res = [];
    res.push(root.val)

    let stack = [];
    stack.push(root);

    while(stack.length){
        let tempStack = []; //临时数通过for循环实现
      	//(备注：也可以通过while循环，也可以通过在末尾判断stack.length == 0 && tempStack.length != 0是时，赋值stack = tempStack)
        for(let i = 0; i < stack.length; i++){
            let temp = stack.shift();
            if(temp.left){
                res.push(temp.left.val);
                tempStack.push(temp.left);
            }
            if(temp.left == null){
                res.push(null);
            }
            if(temp.right){
                res.push(temp.right.val)
                tempStack.push(temp.right);
            }
            if(temp.right == null){
                res.push(null);
            }
        }
        stack.push(...tempStack)
    }

    let end = res.length - 1;
    while(res[end] == null){
        res.pop()
        end --;
    }
    return res;
};


var deserialize = function(data) {
   if(data == null || data.length == 0) return null;
   for(let i = 0; i < data.length; i++){
       if(data[i] != null){
           data[i] = new TreeNode(data[i])
       }  
   }
    let root = data.shift();

    let preNode = [];
    preNode.push(root);//初始化
    while(preNode.length){
        let temp = preNode.shift();
        let t = data.shift();
        if(t != null){
            temp.left = t;
            preNode.push(t);
        }
        t = data.shift();
        if(t != null){
            temp.right = t;
            preNode.push(t);
        }  
    }
   return root;
};
```

## 面试题38 : 字符串的全排列

### 问题描述: 

输入一个字符串，打印出该字符串中字符的所有排列

你可以以任意顺序返回这个字符串数组，但里面不能有重复元素。

**示例:**

```
输入：s = "abc"
输出：["abc","acb","bac","bca","cab","cba"]
```

 

**限制：**

`1 <= s 的长度 <= 8`

### 问题分析:

利用**递归+交换**的思想进行求解 :

![](/img/algorithm/jianzhi/38.png)



![](/img/algorithm/jianzhi/38-2.png)

#### java代码实现:

```java
//递归+交换
char[] chars;
public String[] permutation(String s) {
    if (s.length() == 0) {
        return new String[0];
    }
    //将字符串转换成字符数组
    chars = s.toCharArray();
    //定义一个集合:保存所有排列的情况
    List<String> list = new ArrayList<>();
    //进行dfs遍历查询所有的组合情况
    findAllAssociation(0,chars,list);
    return list.toArray(new String[list.size()]);
}

private void findAllAssociation(int start, char[] chars, List<String> list) {
    if (start == chars.length) {
        list.add(String.valueOf(chars));
        return;
    }
    HashSet<Character> set = new HashSet<>();
    for (int i = start; i < chars.length; i++) {
        if (set.contains(chars[i])) {
            continue;
        }
        set.add(chars[i]);
        //交换字符
        swap(i,start);
        //进行递归进行下一个轮递归遍历
        findAllAssociation(start + 1,chars,list);
        swap(i,start);
    }
}

private void swap(int i, int start) {
    char temp = chars[i];
    chars[i] = chars[start];
    chars[start] = temp;
}

//其中还有一种DFS+剪枝的方法,在递归算法笔记的全排列系列问题中有专门的讲解!
```

#### JavaScript代码实现:

```javascript
方法1：
字符串不可变  比如 a="zx"; a[0]="q";该修改不能成功
var permutation = function(s) {
    let newS = [];
    for(let i = 0; i < s.length; i++){
        newS[i] = s[i]
    }

    let res = []
    dfs(0, newS, res)
    return [...res]
};

function dfs(start, s, res){
    //结束条件
    if(start == s.length){
        console.log(s)
        res.push(s.join(''))
    }
    //分枝
    //利用set进行过剪枝
    let set = new Set();
    for(let i = start; i < s.length; i++){
        if(set.has(s[i])){
            continue;
        }
        set.add(s[i]);

        swap(i, start, s);
        dfs(start + 1, s, res);
        swap(i, start, s);
    }
}

function swap(i, start, s){
    let temp = s[i];
    s[i] = s[start];
    s[start] = temp;
}


方法2：
//dfs找到所有字母排列的情况，并且利用set存储去重
var permutation = function(s) {
    let flags = new Array(s.length).fill(true);
    let res = []
    let temp = '';
    dfs(0, s, flags, temp, res)
    return [...new Set(res)]
};

function dfs(index, s, flags, temp, res){
    //结束条件
    if(index == s.length){
        res.push(temp)
    }
    //分枝
    for(let i = 0; i < s.length; i++){
        if(flags[i]){
            let t = temp;
            temp += s[i];
            flags[i] = false;
            dfs(index + 1, s, flags, temp, res);
            temp = t;
            flags[i] = true;            
        }
    }
}
```

## 面试题39 : 数组中出现次数超过一半的数字

### 问题描述: 

数组中有一个数字出现的次数超过数组长度的一半，请找出这个数字。

你可以假设数组是非空的，并且给定的数组总是存在多数元素。

**示例 1:**

```
输入: [1, 2, 3, 2, 2, 2, 5, 4, 2]
输出: 2
```

**限制：**

`1 <= 数组长度 <= 50000`

### 问题分析:

#### 思路1 : 哈希表法

首先我们能想到的很直接的方法,就是哈希表的方法,记录数组中每一个元素出现的次数,最后遍历找到出现次数超过一半的数字即可,但是这种方法,需要O(n)的空间复杂度,还要遍历两次数组,效率较低...

#### 思路2 : 排序法

因为寻找的是数量超过一半的数字,并且这个数一定是存在的,则我们可以选择对数组进行排序操作,然后返回数组的中值即一定是过半的数

#### java代码实现:

![找错专用图4](/img/algorithm/jianzhi/找错专用图4.jpg)

快看我的方法= =

```java
//思路1实现
public int majorityElement(int[] nums) {
    //定义一个map:key值为nums数组的元素,value值为其值出现的个数
    HashMap<Integer,Integer> map = new HashMap<>();
    int midCount = nums.length / 2;
    for (int num : nums) {
        map.put(num,map.getOrDefault(num,0) + 1);
        if (map.get(num) > midCount) {
            return num;
        }
    }
    return -1;
}


//思路2实现
public int majorityElement(int[] nums) {
    Arrays.sort(nums);
    return nums[nums.length / 2];
}
```

#### JavaScript代码实现:

大概思路：两个数比较，如果两个数不相等，就把这两个数都消灭；我们要找的那个 超过一半的数 一定能把其他所有数都消灭； 所以最后留下来的那个数就是我们要找的数

![t-39-1](/img/algorithm/jianzhi/t-39-1.jpg)

```javascript
/** 士兵战争 **/
var majorityElement = function(nums) {
    let len = nums.length;
    let temp = nums[0];
    let tempNum = 1;
    for(let i = 1; i < len; i++){
        if(nums[i] == temp){ //相等
            tempNum++;
        }else{  //不相等
            if(tempNum >= 1){
                tempNum--;         
            }else{
                temp = nums[i];
                tempNum = 1;
            }
        }
    }
    return temp;
};
```

## 面试题40 : 最小的k个数

### 问题描述: 

输入整数数组 `arr` ，找出其中最小的 `k` 个数。例如，输入4、5、1、6、2、7、3、8这8个数字，则最小的4个数字是1、2、3、4。

**示例 1：**

```
输入：arr = [3,2,1], k = 2
输出：[1,2] 或者 [2,1]
```

**示例 2：**

```
输入：arr = [0,1,2,1], k = 1
输出：[0]
```

**限制：**

- `0 <= k <= arr.length <= 10000`
- `0 <= arr[i] <= 10000`

### 问题分析:

直接对数组进行排序,然后输出最小的k个数[不讲武德排序法 !!!]

#### java代码实现:

```java
//不讲武德排序法
public int[] getLeastNumbers(int[] arr, int k) {
    Arrays.sort(arr);
    int index = 0;
    int[] ans = new int[k];
    while (index < k) {
        ans[index] = arr[index];
        index++;
    }
    return ans;
}
```

#### JavaScript代码实现:

![t-40-1](/img/algorithm/jianzhi/t-40-1.jpg)

```javascript
//快速排序，区别：只需要排序左半部分（所需要的值的个数）
var getLeastNumbers = function(arr, k) {
    randomizedSelected(arr, 0, arr.length - 1, k);
    return arr.slice(0, k);
};
function randomizedSelected(arr, l, r, k){
    if(l >= r) return;
    let pos = quickSort(arr, l, r);
    let num = pos - l + 1;
    if(k == num){
        return;
    }else if( k < num){
        randomizedSelected(arr, l, pos - 1, k)
    }else{
        randomizedSelected(arr, pos + 1, r, k - num)
    }
}

function quickSort(arr, l, r){
    //以右边的数为基准
    let pivot = arr[r];
    let i = l - 1;
    for(let j = l; j <= r - 1; j++){
        if(arr[j] <= pivot){
            i = i + 1;
            swap(arr, i, j);
        }
    }
    swap(arr, i + 1, r);
    return i + 1; //返回的是小于这个基准值的个数
}

function swap(arr, i, j){
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
```

## 面试题41 :  数据流中的中位数

### 问题描述:

如何得到一个数据流中的中位数？如果从数据流中读出奇数个数值，那么中位数就是所有数值排序之后位于中间的数值。如果从数据流中读出偶数个数值，那么中位数就是所有数值排序之后中间两个数的平均值。

例如，

[2,3,4] 的中位数是 3

[2,3] 的中位数是 (2 + 3) / 2 = 2.5

设计一个支持以下两种操作的数据结构：

- void addNum(int num) - 从数据流中添加一个整数到数据结构中。
- double findMedian() - 返回目前所有元素的中位数。

**示例 1：**

```
输入：
["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"]
[[],[1],[2],[],[3],[]]
输出：[null,null,null,1.50000,null,2.00000]
```

**示例 2：**

```
输入：
["MedianFinder","addNum","findMedian","addNum","findMedian"]
[[],[2],[],[3],[]]
输出：[null,null,2.00000,null,2.50000]
```

 

**限制：**

- 最多会对 `addNum、findMedian` 进行 `50000` 次调用。



### 问题分析:

#### 思路1: 直接法[使用排序进行求解]

中位数：排序后中间位置的数，如果有偶数个数（取中间位置两数的平均值）

void addNum(int num)  添加数字到数据结构

double findMedian() 返回中位数

#### 思路2: 使用大顶堆+小顶堆进行求解[避过排序]

建立一个 **小顶堆** A 和 **大顶堆** B ，各保存列表的一半元素，且规定：

![](/img/algorithm/jianzhi/41_Picture1.png)

#### 步骤:

设元素总数为 N = m + n ，其中 m 和 n分别为 A 和 B 中的元素个数。

**addNum(num) 函数：**

当 m = n（即 N 为 偶数）：需向 A 添加一个元素。实现方法：将新元素 num 插入至 B ，再将 B 堆顶元素插入至 A；
当m != n（即 N 为 奇数）：需向 B 添加一个元素。实现方法：将新元素num 插入至 A ，再将 A 堆顶元素插入至 B ;

**findMedian() 函数：**

当 m = n（ N 为 偶数）：则中位数为 ( A 的堆顶元素 + B 的堆顶元素 ) / 2。
当 m !=n（ N 为 奇数）：则中位数为 A的堆顶元素。

#### java代码实现:

```java
//思路2实现
public class MedianFinder {
    //定义两个优先队列A,B实现小顶堆和大顶堆
    Queue<Integer> A, B;
    public MedianFinder() {
        A = new PriorityQueue<>(); // 小顶堆，保存较大的一半[从大到小排序]
        B = new PriorityQueue<>((x, y) -> (y - x)); // 大顶堆，保存较小的一半[从小到大排序]
    }
    public void addNum(int num) {
        if(A.size() != B.size()) {
            A.add(num);
            B.add(A.poll());
        } else {
            B.add(num);
            A.add(B.poll());
        }
    }
    public double findMedian() {
        return A.size() != B.size() ? A.peek() : (A.peek() + B.peek()) / 2.0;
    }
}
```

#### JavaScript代码实现:

```javascript
//由于 JavaScript 中没有堆，所以要自己实现。在实现的时候，堆的代码其实只需要一份，堆中进行判定的比较函数由外界传入即可。

var MedianFinder = function() {
    this.A = new Heap((x, y) => x < y); //小顶堆，保存较大的一半数据
    this.B = new Heap(); //大顶堆，保存较小的一半数据
};
MedianFinder.prototype.addNum = function(num) {
    //如果两堆长度相等，则往A中插入数据
        //具体实现，先向B中插入数据。B弹出栈顶元素，插入A中
    //如果两堆长度不相等，则往B中插入数据
        //具体实现，先向A中插入数据。A弹出栈顶元素，插入B中
    let temp;
    if(this.A.container.length == this.B.container.length){
        this.B.insert(num);
        temp =this.B.extract();
        this.A.insert(temp);
    }else{
        this.A.insert(num);
        temp = this.A.extract();
        this.B.insert(temp);           
    }
};
MedianFinder.prototype.findMedian = function() {
    if(this.A.container.length == this.B.container.length){
        return (this.A.top() + this.B.top()) / 2
    }else{
        return this.A.top();
    }
};
```

```javascript
const defaultCmp = (x, y) => x > y; // 默认是最大堆

//
const swap = (arr, i, j) => ([arr[i], arr[j]] = [arr[j], arr[i]]);

class Heap {
    constructor(cmp = defaultCmp) {
        this.container = [];
        this.cmp = cmp;
    }

    insert(data) {
        const { container, cmp } = this;

        container.push(data);
        let index = container.length - 1;
        while (index) {
            let parent = Math.floor((index - 1) / 2);
            if (!cmp(container[index], container[parent])) {
                return;
            }
            swap(container, index, parent);
            index = parent;
        }
    }

  	//弹出顶端元素，并对 堆 重新排序
    extract() {
        const { container, cmp } = this;
        if (!container.length) {
            return null;
        }

        swap(container, 0, container.length - 1);
        const res = container.pop();
        const length = container.length;
        let index = 0,
            exchange = index * 2 + 1;

        while (exchange < length) {
            // // 以最大堆的情况来说：如果有右节点，并且右节点的值大于左节点的值
            let right = index * 2 + 2;
            if (right < length && cmp(container[right], container[exchange])) {
                exchange = right;
            }
            if (!cmp(container[exchange], container[index])) {
                break;
            }
            swap(container, exchange, index);
            index = exchange;
            exchange = index * 2 + 1;
        }

        return res;
    }

    top() {
        if (this.container.length) return this.container[0];
        return null;
    }
}
```

## 面试题42 : 连续子数组的最大和

### 问题描述:

输入一个整型数组，数组中的一个或连续多个整数组成一个子数组。求所有子数组的和的最大值。

要求时间复杂度为O(n)。 

**示例1:**

```
输入: nums = [-2,1,-3,4,-1,2,1,-5,4]
输出: 6
解释: 连续子数组 [4,-1,2,1] 的和最大，为 6。
```

**提示：**

- `1 <= arr.length <= 10^5`
- `-100 <= arr[i] <= 100`

### 问题分析:

使用**动态规划思想**进行求解:

定义dp数组,其中dp[i]表示以i索引结尾的连续子数组的最大和

则**动态规划转移方程**为:
$$
dp[i] = Math.max(nums[i],dp[i - 1] + nums[i])
$$


#### java代码实现:

```java
public int maxSubArray(int[] nums) {
    //如果nums为null或者长度为0,直接返回0
    if (nums == null || nums.length == 0) return 0;
    //如果nums的长度为1:返回nums数组的第一个元素即是最大和
    if (nums.length == 1) return nums[0];
    int len = nums.length;
    //一维动态规划求解
    int[] dp = new int[len];
    int max = nums[0];
    dp[0] = nums[0];
    for (int i = 1; i < len; i++) {
        //其中dp[i]表示以i索引结尾的连续子数组的最大和
        dp[i] = Math.max(nums[i],dp[i - 1] + nums[i]);
        max = Math.max(max,dp[i]);
    }
    return max;
}
```

#### JavaScript代码实现:

```javascript
var maxSubArray = function(nums) {
   //dp[i]表示以 nums[i]结尾的 连续子数组 的最大和
   //如果不包含nums[i],则递推时 不满足 连续子数组 的要求，即重新开始
    let dp = new Array(nums.length).fill(0);
    dp[0] = nums[0];
    for(let i = 1; i < nums.length; i++){
        dp[i] = Math.max(nums[i], dp[i - 1] + nums[i])
    }
    return Math.max(...dp)
};
```

## 面试题43 : 1～n 整数中 1 出现的次数

### 问题描述:

输入一个整数 `n` ，求1～n这n个整数的十进制表示中1出现的次数。

例如，输入12，1～12这些整数中包含1 的数字有1、10、11和12，1一共出现了5次。

**示例 1：**

```
输入：n = 12
输出：5
```

**示例 2：**

```
输入：n = 13
输出：6
```

**限制：**

- `1 <= n < 2^31`

### 问题分析:

**数学找规律方法**进行求解:

```java
现在有一个函数f(n)，代表n位上有多少个1?       
    f(0) = 0
    0 ~ 9          f(1) = 1 
    0 ~ 99        f(2) = 10 + 10*f(1) = 20  (10+为  10~19中十位有10个1)
    0 ~ 999      f(3) = 100 + 10*f(2) = 300  (100+为  100~199中百位有100个1)
    0 ~ 9999    f(4) = 1000 + 10*f(3) = 4000
    0 ~ 99999  f(5) = 10000 + 10*f(4) = 50000
    ......
    这样就找到了其中的规律...
    
    // 例如: 5467 中有多少个1?
    // 1. 0~5000中有 5 * f(3) + 1000 = 2500个
    // 2. 0~400中有 4 * f(2) + 100 = 180个
    // 3. 0~60中有 6 * f(1) + 10 = 16个
    // 4. 0~7中有 7 * f(0) + 1 = 1个
```

#### java代码实现:

```java
private static int[] f = {0, 1, 20, 300, 4000, 50000, 600000, 7000000, 80000000, 900000000};
public int countDigitOne(int n) {
    //定义结果集res
    int res = 0;
    //f[0] = 0 f[1] = 1 f[2] = 1 * 10 + 10 = 20 f[3] = 20 * 10 + 10^2 = 300 f[4] = 300 * 10 + 10 ^3 = 4000 ......
    //定义计数器index
    int index = 0, pow = 1, pre = 0;
    while (n != 0) {
        //从低到高获取n的位数上的值,对于5431,则依次获取 1 3 4 5
        int num = n % 10;
        //System.out.println(5431 % 10);
        //如果当前位上的值为1: 则我们需要单独进行计算: 等于上一个位上的数字 + 1 + f[index]
        if (num == 1) {
            res += pre + 1 + f[index];
        } else if (num > 1) {
            //如果大于1: 则即为上面的公式
            res += pow + num * f[index];
        }
        //更新前置位一共贡献了多少个: 例如1428,则最高位计算1的个数: 前置位贡献了428 + 1 = 429个1
        pre = pre + num * pow;
        pow *= 10;
        index++;
        n /= 10;
    }
    return res;
}
```

#### JavaScript代码实现:

```javascript
let f = [0,1,20,300,4000,50000,600000,7000000,80000000,900000000,10000000000];
let t = [1,10,100,1000,10000,100000,1000000,10000000,100000000,10000000000]
let res = [];
while(n){
    res.unshift(Math.floor(n % 10));
    n = Math.floor(n / 10);
}
//res中存储n各个位上的数，个位在后
let sum = 0;
for(let i = 0; i < res.length; i++){
    let temp = res.length - 1 - i;
    sum += res[i] * f[temp];
    //如果位数上的数 是1，则不能加上所有以1开头的数
    //如213，加上3 + 1（10,11,12,13）
    //如231，记上1
    if(res[i] == 1 && i != res.length - 1){
        sum += Number(res.slice(i + 1).join('')) + 1
    }else if(res[i] == 1 && i == res.length - 1){
        sum += 1
    }

    if(res[i] > 1){
        sum += t[temp]; //如果res[i] > 1则加上所有以1开头的数，就是上面的是1,10,100,1000。。。
    }
}
return sum;
};
```

## 面试题44 : 数字序列中某一位的数字

### 问题描述:

数字以0123456789101112131415…的格式序列化到一个字符序列中。在这个序列中，第5位（从下标0开始计数）是5，第13位是1，第19位是4，等等。

请写一个函数，求任意第n位对应的数字。

**示例 1：**

```
输入：n = 3
输出：3
```

**示例 2：**

```
输入：n = 11
输出：0
```

 

**限制：**

- `0 <= n < 2^31`

### 问题分析:

![](/img/algorithm/jianzhi/44_1.png)

![4_](/img/algorithm/jianzhi/44_2.png)

#### java代码实现:

```java
class Solution {
    //递归迭代:
    //定义digit:表示位数值{1~9:一位数,10~99:两位数,100~999:三位数...}
    //定义start:表示位数的起始值,[end:为当前位数的结束值{10~99,start = 10,end = 99}]
    //当前位数数量count:9*start*digit,也可以通过下面的求解方法进行求解
    //count = 9 * 10^(digit - 1) * digit:表示当前位数数量
    public int findNthDigit(int n) {
        //自定义添加越界值的返回-1
        if (n < 0) return -1;
        //定义位数digit:初始值为1
        int digit = 1;
        while (true) {
            //通过digit计算出对应位数的值存在多少个:注意1~9为10个数(因为包括0),10~99为180个
            double count = countOfDigit(digit);
            if (n < count) {
                //如果当前要求返回的第n个位对应的数字小于数位的数量,则直接进行查找返回其值
                return findNumber(n,digit);
            }
            //如果n > count:我们去掉当前位数的位数数量,然后继续比较高一位的位数数量值,观察其是否在其范围内
            n = n - (int)count;
            digit++;
        }
    }

    private int findNumber(int n, int digit) {
        //通过要求返回的n和当前位数返回对应的值
        int start = getStart(digit);
        int number = start + n / digit;//计算出当前第n位数是对应哪个数
        int rightIndex = digit - n % digit;//记录第n位数是对应当前number从右到左的第几位数
        for (int i = 1; i < rightIndex; i++) {
            number = number / 10;
        }
        //最后获取当前第n位数:取模获取
        return number % 10;
    }

    //获取当前位数的start的值
    private int getStart(int digit) {
        //如果是一位数,则返回0,否则返回10^(digit - 1)
        if (digit == 1) return 0;
        return (int)Math.pow(10,digit - 1);
    }

    //获取当前位数数量的的值
    private double countOfDigit(int digit) {
        if (digit == 1) return 10;
        //如果是2位数,则为10^1 * 9 = 90个,3位数为10^2 * 9 = 900个
        double count = Math.pow(10,digit - 1);
        return 9 * digit * count;
    }
}
```

#### JavaScript代码实现:

```javascript
var findNthDigit = function(n) {
    //1位数
    if(n < 10){
        return n;
    }
    n -= 10;
    //位数
    let weiShu = 2; //记录第n位数字 属于几位数
    let start = 90; //2位数有90个，3位数有900个
    while(n > start * weiShu){
        n -= start * weiShu;
        start *= 10;
        weiShu++;
    }
    //temp记录第几个数
    let temp = Math.floor(n / weiShu);  
    //t就是这个数
    let t = start / 9 + temp
    //把t转化为字符
    let s = '';
    while(t){
        s = Math.floor(t % 10) + s;
        t = Math.floor(t / 10);
    }
  
    // console.log(s)
  	// temp * weishu 是（同位数 的 前面的数 的个数）
    return s[n - temp * weiShu] 
};
```

## 面试题45 : 把数组排成最小的数

### 问题描述:

输入一个非负整数数组，把数组里所有数字拼接起来排成一个数，打印能拼接出的所有数字中最小的一个。

**示例 1:**

```
输入: [10,2]
输出: "102"
```

**示例 2:**

```
输入: [3,30,34,5,9]
输出: "3033459"
```

 

**提示:**

- `0 < nums.length <= 100`

**说明:**

- 输出结果可能非常大，所以你需要返回一个字符串而不是整数
- 拼接起来的数字可能会有前导 0，最后结果不需要去掉前导 0

### 问题分析:

![](/img/algorithm/jianzhi/45.png)

![5_](/img/algorithm/jianzhi/45_2.png)

#### java代码实现:

```java
public String minNumber(int[] nums) {
    String[] strs = new String[nums.length];
    for(int i = 0; i < nums.length; i++)
        strs[i] = String.valueOf(nums[i]);
    //使用Arrays内置的排序函数,传入自定义排序的比较规则即可
    Arrays.sort(strs, (x, y) -> (x + y).compareTo(y + x));
    StringBuilder res = new StringBuilder();
    for(String s : strs)
        res.append(s);
    return res.toString();
}
```

#### JavaScript代码实现:

```javascript
/**
字符串 3 30 34 5 9
      x  y
若 x+y > y+x, 则x>y
若 x+y < y+x, 则x<y
**/
var minNumber = function(nums) {
    nums.sort((a, b) => Number(`${a}${b}`) - Number(`${b}${a}`));
    return nums.join('')
};
```

## 面试题46 : 把数字翻译成字符串

### 问题描述:

给定一个数字，我们按照如下规则把它翻译为字符串：0 翻译成 “a” ，1 翻译成 “b”，……，11 翻译成 “l”，……，25 翻译成 “z”。一个数字可能有多个翻译。请编程实现一个函数，用来计算一个数字有多少种不同的翻译方法。

**示例 1:**

```
输入: 12258
输出: 5
解释: 12258有5种不同的翻译，分别是"bccfi", "bwfi", "bczi", "mcfi"和"mzi"
```

**提示：**

- `0 <= num < 231`

### 问题分析:

**动态规划思路**进行求解:

第一步:将num转换成字符数组array

第二步:获取该数组的长度:len,并且将每一个数字字符转换成数字存储到nums数组中

第三步:定义dp数组:其中dp[i]表示第1个数字到第i个数字组成的数字能构成不同字符串的种类个数:从0索引开始

第四步:从索引2开始进行动态转移方程的填表更新操作

其中动态转移方程为:

首先将dp[i] = dp[i - 1]:如果没有特殊情况,构成字符窗翻译的个数即为dp[i - 1]

如果此时dp[i - 1] * 10 + nums[i] <= 25,即当前i索引位置和前一个位置构成的数字小于等于25,并且前一个位置的值不为0时:
$$
dp[i] = dp[i] + dp[i - 2]
$$
最后结果即为dp[len - 1]

#### java代码实现:

```java
public int translateNum(int num) {
    //利用动态规划进行求解
    //第一步:将num转换成字符数组array
    char[] array = String.valueOf(num).toCharArray();
    //第二步:获取该数组的长度:len,并且将每一个数字字符转换成数字存储到nums数组中
    int len = array.length;
    int[] nums = new int[len];
    for (int i = 0; i < len; i++) {
        nums[i] = array[i] - '0';
    }
    //如果nums数组的长度小于等于1:则直接返回len
    if (len <= 1) {
        return len;
    }
    //第三步:定义dp数组:其中dp[i]表示第1个数字到第i个数字组成的数字能构成不同字符串的种类个数:从0索引开始
    int[] dp = new int[len];
    //显然只有一个数字的时候,只有一种
    dp[0] = 1;
    //如果第一个数字不为0,且第一个数字和第二个数字构成的数字小于等于25,则表示该两个数字有两个不同字符串的表示方法
    if (nums[0] * 10 + nums[1] <= 25 && nums[0] != 0) {
        dp[1] = 2;
    }else {
        //否则只有一种
        dp[1] = 1;
    }
    //第四步:从索引2开始进行动态转移方程的填表更新操作
    for (int i = 2; i < len; i++) {
        //首先将dp[i] = dp[i - 1]:如果没有特殊情况,构成字符窗翻译的个数即为dp[i - 1]
        dp[i] = dp[i - 1];
        //如果此时dp[i - 1] * 10 + nums[i] <= 25,即当前i索引位置和前一个位置构成的数字小于等于25,并且前一个位置的值不为0,则此时dp[i] = dp[i] + dp[i - 2];
        if (nums[i - 1] * 10 + nums[i] <= 25 && nums[i - 1] != 0) {
            dp[i] += dp[i - 2];
        }
    }
    //最后返回dp[len - 1],即为最终的结果
    return dp[len - 1];
}
```

#### JavaScript代码实现:

```javascript
var translateNum = function(num) {
    let newNum = num.toString();
    let len = newNum.length;
    let dp = new Array(len).fill(1);
    let temp = newNum[0] + newNum[1];
    let n = Number(temp);
    if(n >=0 && n <= 25){
        dp[1] = 2;
    }
    let end = 2;
    while(end < len){
        temp = temp[1] + newNum[end];
        n = Number(temp);
        if(n >= 10 && n <= 25){
            dp[end] = dp[end - 2] + dp[end - 1];
        }else{
            dp[end] = dp[end - 1];
        }
        end++;
    }
    // console.log(dp)
    return dp[len - 1];
};

/**
f(i)=f(i−1)+f(i−2)[i−1≥0,10≤x≤25]
这里的f(i)只和它的前两项f(i−1) 和f(i−2) 相关，我们可以运用「滚动数组」思想把 f数组压缩成三个变量，这样空间复杂度就变成了 O(1)。
f(i)：r
f(i−1):q
f(i−2):p
r = p + q
**/
var translateNum = function(num) {
    let newNum = num.toString();
    let len = newNum.length; 
    if(len == 1) return 1;
    //初始化
    let pre = newNum[0] + newNum[1];
    //这里p是dp[0],q是dp[1]
    let p = 1, q = 1, r;
    if (pre <= "25" && pre >= "10") {
        q = 2;
    }
    if(len == 2) return q;
    for(let i = 2; i < len; i++){
        r = q; //默认与前面的值相同
        pre = pre[1] + newNum[i];
        if (pre <= "25" && pre >= "10") {
            r = p + q;
        }
        p = q;
        q = r;
    }
    return r;
}
```

## 面试题47 : 礼物的最大价值

### 问题描述:

在一个 m*n 的棋盘的每一格都放有一个礼物，每个礼物都有一定的价值（价值大于 0）。你可以从棋盘的左上角开始拿格子里的礼物，并每次向右或者向下移动一格、直到到达棋盘的右下角。给定一个棋盘及其上面的礼物的价值，请计算你最多能拿到多少价值的礼物？

**示例 1:**

```
输入: 
[
  [1,3,1],
  [1,5,1],
  [4,2,1]
]
输出: 12
解释: 路径 1→3→5→2→1 可以拿到最多价值的礼物
```

 

提示：

- `0 < grid.length <= 200`
- `0 < grid[0].length <= 200`

### 问题分析:

使用**动态规划**进行求解:

![](/img/algorithm/jianzhi/47-Picture1.png)

![](/img/algorithm/jianzhi/47.png)

#### java代码实现:

```java
public int maxValue(int[][] grid) {
    if (grid.length == 0) return 0;
    int row = grid.length;
    int col = grid[0].length;
    //定义dp数组
    int[][] dp = new int[row][col];
    //将初始状态进行初始化
    dp[0][0] = grid[0][0];
    for (int i = 1; i < row; i++) {
        dp[i][0] = dp[i - 1][0] + grid[i][0];
    }
    for (int j = 1; j < col; j++) {
        dp[0][j] = dp[0][j - 1] + grid[0][j];
    }
    //从[1][1]位置镜子进行状态的更新操作
    for (int i = 1; i < row; i++) {
        for (int j = 1; j < col; j++) {
            //动态转移方程
            dp[i][j] = Math.max(dp[i - 1][j],dp[i][j - 1]) + grid[i][j];
        }
    }
    return dp[row - 1][col - 1];
}
```

#### JavaScript代码实现:

```javascript
var maxValue = function(grid) {
    for(let i = 1; i < grid[0].length; i++){
        grid[0][i] = grid[0][i] + grid[0][i - 1];
    }
    for(let i = 1; i < grid.length; i++){
        grid[i][0] = grid[i][0] + grid[i - 1][0];
    }
    for(let i = 1; i < grid.length; i++){
        for(let j = 1; j < grid[0].length; j++){
            grid[i][j] = grid[i][j] + Math.max(grid[i - 1][j], grid[i][j - 1])
        }
    }
    return grid[grid.length - 1][grid[0].length - 1];
};
```

## 面试题48 : 最长不含重复字符的子字符串

### 问题描述:

请从字符串中找出一个最长的不包含重复字符的子字符串，计算该最长子字符串的长度。

**示例 1:**

```
输入: "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```

**示例 2:**

```
输入: "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
```

**示例 3:**

```
输入: "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
```

提示：

- `s.length <= 40000`

### 问题分析:

![](/img/algorithm/jianzhi/48_1.png)

![](/img/algorithm/jianzhi/48_2.png)

![](/img/algorithm/jianzhi/48_3.png)

#### java代码实现:

![找错专用图2](/img/algorithm/jianzhi/找错专用图2.gif)

还可以用动态规划

```java
public int lengthOfLongestSubstring(String s) {
    //定义该字符串的长度为n
    int n = s.length();
    //若长度小于等于1,则maxLength即为字符串本身的长度,直接返回
    if (n <= 1) {
        return n;
    }
    //定义maxLength作为最大不重复子串的长度
    int maxLength = 0;
    //定义滑动窗口的左指针的变量,初始化为0
    int left = 0;
    //定义一个HashMap进行存储
    HashMap<Character,Integer> hashMap = new HashMap<>();
    for (int i = 0; i < n; i++) {
        if (hashMap.containsKey(s.charAt(i))) {
            //如果当前key值在hashmap中已经存在
            //则更新left指针为之前的出现的指针向右平移一位
            left = Math.max(left, hashMap.get(s.charAt(i)) + 1);
        }
        //将该键值添加到hashmap集合中
        hashMap.put(s.charAt(i),i);
        maxLength = Math.max(maxLength,i - left + 1);
    }
    //返回最大值maxLength
    return maxLength;
}
```

#### JavaScript代码实现:

```javascript
//方法1： 我没用map存储窗口内 字母：索引
//直接用循环找是否存在相等的值
var lengthOfLongestSubstring = function(s) {
    if(s.length == 0) return 0;
    if(s.trim().length == 0) return 1;
    if(s.length == 1) return 1;
    let max = 0;
    let start = 0;
    for(let end = 1; end < s.length; end++){
        //如果[start,end]区间内存在与s[end]相等的值
        //则start变为这个相等的值的后一个值
        for(let j = start; j < end; j++){
            if(s[j] == s[end]){
                start = j + 1;
            }
        }
        max = Math.max(max, end - start + 1)
    }
    return max;
};
```

思路：判断j指针指向的字母 是否在当前子串中 出现过？

如果没有出现过，子串长度+1，同时将当前字母的索引值存入map；

如果出现过，子串长度更新为  （当前字母 与 之前出现过的当前字母）之间的长度，同时更新当前字母的索引

![t-48-1](/img/algorithm/jianzhi/t-48-1.jpg)

```javascript
方法2：动态规划
/**状态定义： 设动态规划列表 dp ，dp[j] 代表以字符 s[j] 为结尾的 “最长不重复子字符串” 的长度。
转移方程： 固定右边界 j ，设字符 s[j] 左边距离最近的相同字符为 s[i] ，即 s[i] = s[j] 。

当 i < 0，即 s[j] 左边无相同字符，则 dp[j] = dp[j-1] + 1 ；
当 dp[j - 1] < j - i，说明字符 s[i] 在子字符串 dp[j-1] 区间之外 ，则 dp[j] = dp[j - 1] + 1；
当 dp[j − 1] ≥ j − i ，说明字符 s[i] 在子字符串 dp[j-1] 区间之中 ，则 dp[j] = j - i ；

返回值：max(dp) ，即全局的 “最长不重复子字符串” 的长度。
**/

/** 遍历字符串 s 时，使用map统计 各字符最后一次出现的索引位置 。 **/

var lengthOfLongestSubstring = function(s) {
    let map = new Map();
    let len = s.length;
    let max = 0;
    let tmp = 0;
    for(let j = 0; j < len; j++){
        let i;
        if(map.has(s[j])){
            i = map.get(s[j]) 
        }else{
            i = -1;
        }
        tmp = tmp < j - i ? tmp + 1 : j - i;
        max = Math.max(max, tmp); //每次都更新这个最长的值
        map.set(s[j], j); //更新，记录该字符在 已经遍历过的字符中的索引位置
    }
    return max;
}
```

## 面试题49 : 丑数

### 问题描述:

我们把只包含质因子 2、3 和 5 的数称作丑数（Ugly Number）。求按从小到大的顺序的第 n 个丑数。

**示例:**

```
输入: n = 10
输出: 12
解释: 1, 2, 3, 4, 5, 6, 8, 9, 10, 12 是前 10 个丑数。
```

**说明:**  

1. `1` 是丑数。
2. `n` **不超过**1690。

### 问题分析:

使用**动态规划**进行求解:

定义dp数组:其中dp[i]表示第i个丑数的值:i从0开始计数

其中每一个dp[i]:即第i个丑数即从dp[p2] * 2,dp[p3] * 3,dp[p5] * 5的最小值中进行产生,我们只需要维护好p2,p3,p5索引下标即可,选择了对应索引的值作为丑数,我们将其索引下标进行增1处理

![](/img/algorithm/jianzhi/49-Picture1.png)

#### java代码实现:

```java
//动态规划进行求解
public int nthUglyNumber(int n) {
    if (n == 1)
        return 1;
    //定义dp数组:其中dp[i]表示第i个丑数的值:i从0开始计数
    int p2 = 0,p3 = 0,p5 = 0;
    int[] dp = new int[n];
    dp[0] = 1;
    //其中每一个dp[i]:即第i个丑数即从dp[p2] * 2,dp[p3] * 3,dp[p5] * 5的最小值中进行产生,
    // 我们只需要维护好p2,p3,p5索引下标即可,选择了对应索引的值 * 2作为丑数我们将其索引下标进行增1处理
    for (int i = 1; i < n; i++) {
        dp[i] = Math.min(Math.min(dp[p2] * 2,dp[p3] * 3),dp[p5] * 5);
        if (dp[i] == 2 * dp[p2]) p2++;
        if (dp[i] == 3 * dp[p3]) p3++;
        if (dp[i] == 5 * dp[p5]) p5++;
    }
    return dp[n - 1];
}
```

#### JavaScript代码实现:

```javascript
/**
temp数组中每次存2,3,5的倍数的最小值
a,b,c分别指向 这个最小值 是由前面那个数 的乘积得到的
**/
var nthUglyNumber = function(n) {
    if(n == 1) return 1;
    let a = 0, b = 0, c = 0;
    let temp = [1];
    for(let i = 1; i < n; i++){
        temp[i] = Math.min(temp[a] * 2, temp[b] * 3, temp[c] * 5);
        temp[i] >= temp[a] * 2 ? a++ : 0;
        temp[i] >= temp[b] * 3 ? b++ : 0;
        temp[i] >= temp[c] * 5 ? c++ : 0;
    }
    return temp[temp.length - 1]
};
```

## 面试题50 : 第一个只出现一次的字符

### 问题描述:

在字符串 s 中找出第一个只出现一次的字符。如果没有，返回一个单空格。 s 只包含小写字母。

**示例:**

```
s = "abaccdeff"
返回 "b"

s = "" 
返回 " "
```

**限制：**

`0 <= s 的长度 <= 50000`

### 问题分析:

#### 思路1: 直接法

1. 定义数组count:记录s中每一个字符出现的个数
2. 定义数组indexs: 记录s字符串每一个字符出现的最后一次的索引位置
3. 遍历s字符串: 记录该字符出现的次数以及该字符出现的索引位置
4. 遍历counts数组找出出现一次且索引位置的最小值

#### 思路2:哈希表法

1. 遍历字符串 `s` ，使用哈希表统计 “各字符数量是否 >1 ”。
2. 再遍历字符串 `s` ，在哈希表中找到首个 “数量为 1 的字符”，并返回。

![](/img/algorithm/jianzhi/50-Picture1.png)

#### java代码实现:

```java
思路1实现:
public char firstUniqChar(String s) {
    if (s == null || s.length() == 0) return ' ';
    //定义数组count:记录s中每一个字符出现的个数
    int[] counts = new int[26];
    //定义数组indexs: 记录s字符串每一个字符出现的最后一次的索引位置
    int[] indexs = new int[26];
    Arrays.fill(indexs,-1);//我们先将indexs数组全部赋值为-1
    //遍历s字符串: 记录该字符出现的次数以及该字符出现的索引位置
    for (int i = 0; i < s.length(); i++) {
        counts[s.charAt(i) - 'a']++;
        indexs[s.charAt(i) - 'a'] = i;
    }
    //我们定义minIndex: 记录count == 1的字符出现的最低的索引
    int minIndex = Integer.MAX_VALUE;
    //定义ans结果集
    char ans = ' ';
    //遍历indexs数组
    for (int i = 0; i < 26; i++) {
        if (counts[i] == 1 && indexs[i] < minIndex) {
            minIndex = indexs[i];
            ans = (char)(i + 'a');
        }
    }
    return ans;

}

思路2实现:
public char firstUniqChar(String s) {
    HashMap<Character, Boolean> dic = new HashMap<>();
    char[] sc = s.toCharArray();
    for(char c : sc)
        dic.put(c, !dic.containsKey(c));
    for(char c : sc)
        if(dic.get(c)) return c;
    return ' ';
}
```

#### JavaScript代码实现:

```javascript
var firstUniqChar = function(s) {
    let arr = new Array(26).fill(0);
    let len = s.length;
    for(let i = 0; i < len; i++){
        arr[s[i].charCodeAt() - 'a'.charCodeAt()] ++;
    }
    for(let i = 0; i < len; i++){
        if(arr[s[i].charCodeAt() - 'a'.charCodeAt()] == 1){
            return s[i];
        }
    }
    return " ";
};
```

## 面试题51 : 数组中的逆序对

### 问题描述:

在数组中的两个数字，如果前面一个数字大于后面的数字，则这两个数字组成一个逆序对。输入一个数组，求出这个数组中的逆序对的总数.

**示例 1:**

```
输入: [7,5,6,4]
输出: 5
```

 

**限制：**

`0 <= 数组长度 <= 50000`

### 问题分析:

使用**分治法**进行求解,其中**分治法一般的解题步骤:**

分治法在每一层递归上都有三个步骤：

- 1) 分解：将原问题分解为若干个规模较小，相互独立，与原问题形式相同的子问题
- 2) 解决：若子问题规模较小而容易被解决则直接解，否则递归地解各个子问题
- 3) 合并：将各个子问题的解合并为原问题的解。

```java
分治的统一代码公式{个人总结}
主函数
main() {
    dac(p,0,p.length - 1);//其中p经常为数组,字符串,链表等等的首地址,即指向该数组,字符串
}

//分 + 合的方法
dac(P p,int left,int right) {
	//分的过程
	//获取中间值
	int mid = (left + right) / 2;
	dac(p,left,mid);
	dac(p,mid + 1,right);
	//合的过程[注意:有的时候需要对[left,mid]和[mid+1,right]区间进行排序等调整,则我们需要下面的merge操作;但是有的时候只是需要dac(p,left,mid)和dac(p,mid + 1,right)的返回结果进行比较运算,此时我们就无需进行merge操作]
	merge(p,left,mid,right);
}

merge(P p,int left,int mid,int right) {
	//调整p的[left,right]的结构,合并[left,mid]区间和[mid+1,right]区间的代码
}

伪代码的分治思想公式:
Divide-and-Conquer(P)
1. if |P|≤n0
2. then return(ADHOC(P))
3. 将P分解为较小的子问题 P1 ,P2 ,…,Pk
4. for i←1 to k
5. do y(i) ← Divide-and-Conquer(Pi) △ 递归解决Pi
6. T ← MERGE(y1,y2,…,yk) △ 合并子问题
7. return(T)
```

#### java代码实现:

```java
//根据分治模板进行求解的求解
public int reversePairs(int[] nums) {
    int n = nums.length;
    if (n <= 1) return 0;
    return dac(nums,0,nums.length - 1);
}

private int dac(int[] nums, int left, int right) {
    if (left == right) {
        return 0;
    }else {
        //获取中间值mid
        int mid = (left + right) / 2;
        //分别获取[left,mid]和[mid + 1,right]两个部分的逆序对的数量
        int left_res = dac(nums,left,mid);
        int right_res = dac(nums,mid + 1,right);
        //定义一个结果集res
        int res = left_res + right_res;
        //我们统计左数在[left,mid]区间,右数在[mid + 1,rihgt]区间的逆序对的个数
        int l = left;
        int r = mid + 1;
        while (l <= mid) {
            while (r <= right && nums[l] > nums[r]) {
                r++;
            }
            res += r - mid - 1;
            l++;
        }
        //排序合并[left,mid]和[mid + 1,right]两个排序数组
        merge(nums,left,mid,right);
        //返回结果
        return res;
    }
}

private void merge(int[] nums, int left, int mid, int right) {
    int[] temp = new int[right - left + 1];
    int p = 0;
    int p1 = left;
    int p2 = mid + 1;
    while (p1 <= mid && p2 <= right) {
        if (nums[p1] < nums[p2]) {
            temp[p++] = nums[p1++];
        }else {
            temp[p++] = nums[p2++];
        }
    }
    //将剩余的元素添加至temp数组中
    while (p1 <= mid) {
        temp[p++] = nums[p1++];
    }
    while (p2 <= right) {
        temp[p++] = nums[p2++];
    }
    //最后将temp数组拷贝到nums数组中
    for(int k = 0; k < temp.length; k++) {
        nums[left + k] = temp[k];
    }
}
```

#### JavaScript代码实现:

```javascript
/**
归并排序
分
合：在合的过程中，left(已排序)，right（已排序）
如果left中的某个值>right中的某个值，那么left中（这个值以及后面的值）都会与right中的某个值构成逆序对
即（leftLen - i）
**/
var reversePairs = function(nums) {
    let sum = 0;
    mergeSort(nums);
    return sum;

    //归并排序
    function mergeSort(nums){
        if(nums.length < 2)return nums;
        let mid = parseInt(nums.length /2);
        let left = nums.slice(0, mid);
        let right = nums.slice(mid);
        return merge(mergeSort(left),mergeSort(right))
    }

    function merge(left, right){
        let res = [];
        let leftLen = left.length;
        let rightLen = right.length;
        let len = leftLen + rightLen;
        for(let index = 0, i = 0, j = 0; index < len; index++){
            if(i >= leftLen) res[index] = right[j++]; //left遍历结束
            else if(j >= rightLen) res[index] = left[i++]; //right遍历结束
            else if(left[i] <= right[j]) res[index] = left[i++]; //left<right，不会构成逆序对
            else{ //left>right会构成逆序对，left中（当前这个值和后面的所有值）都会与right的(这个值)构成逆序对，即 leftLen - i 的长度
                res[index] = right[j++];
                sum += leftLen - i;
            }
        }
        return res;
    }
};
```

## 面试题52 :  两个链表的第一个公共节点

### 问题描述:

输入两个链表，找出它们的第一个公共节点。

如下面的两个链表**：**

[![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/14/160_statement.png)](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/14/160_statement.png)

在节点 c1 开始相交。

 

**示例 1：**

[![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/14/160_example_1.png)](https://assets.leetcode.com/uploads/2018/12/13/160_example_1.png)

```
输入：intersectVal = 8, listA = [4,1,8,4,5], listB = [5,0,1,8,4,5], skipA = 2, skipB = 3
输出：Reference of the node with value = 8
输入解释：相交节点的值为 8 （注意，如果两个列表相交则不能为 0）。从各自的表头开始算起，链表 A 为 [4,1,8,4,5]，链表 B 为 [5,0,1,8,4,5]。在 A 中，相交节点前有 2 个节点；在 B 中，相交节点前有 3 个节点。
```

 

**示例 2：**

[![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/14/160_example_2.png)](https://assets.leetcode.com/uploads/2018/12/13/160_example_2.png)

```
输入：intersectVal = 2, listA = [0,9,1,2,4], listB = [3,2,4], skipA = 3, skipB = 1
输出：Reference of the node with value = 2
输入解释：相交节点的值为 2 （注意，如果两个列表相交则不能为 0）。从各自的表头开始算起，链表 A 为 [0,9,1,2,4]，链表 B 为 [3,2,4]。在 A 中，相交节点前有 3 个节点；在 B 中，相交节点前有 1 个节点。
```

 

**示例 3：**

[![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/14/160_example_3.png)](https://assets.leetcode.com/uploads/2018/12/13/160_example_3.png)

```
输入：intersectVal = 0, listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2
输出：null
输入解释：从各自的表头开始算起，链表 A 为 [2,6,4]，链表 B 为 [1,5]。由于这两个链表不相交，所以 intersectVal 必须为 0，而 skipA 和 skipB 可以是任意值。
解释：这两个链表不相交，因此返回 null。
```

 

**注意：**

- 如果两个链表没有交点，返回 `null`.
- 在返回结果后，两个链表仍须保持原有的结构。
- 可假定整个链表结构中没有循环。
- 程序尽量满足 O(*n*) 时间复杂度，且仅用 O(*1*) 内存。

### 问题分析:

**双指针浪漫相遇法**:

![](/img/algorithm/jianzhi/52.png)

#### java代码实现:

```java
public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
    //如果链表A为空或者链表B为空,则返回null
    if (headA == null || headB == null) {
        return null;
    }
    //定义两个指针变量,分别指向两个链表的头结点
    ListNode tempA = headA;
    ListNode tempB = headB;
    while (tempA != tempB) {
        tempA = tempA != null ? tempA.next : headB;
        tempB = tempB != null ? tempB.next : headA;
    }
    return tempA;
}
```

#### JavaScript代码实现:

```javascript
/**
比如
listA = [0,9,1,2,4], listB = [3,2,4]
通过比较
0,9,1,2,4，3,2,4
3,2,4，0,9,1,2,4
就可以得到相同的部分2,4
**/
var getIntersectionNode = function(headA, headB) {
    if(!headA || !headB) return null;
    let a = headA;
    let b = headB;
    while(a != b){
        a = a == null ? headB : a.next;
        b = b == null ? headA :b.next;
    }
    return a
};
```

## 面试题53 : 

### 问题描述:

### 53 - I. 在排序数组中查找数字 I

统计一个数字在排序数组中出现的次数。

**示例 1:**

```
输入: nums = [5,7,7,8,8,10], target = 8
输出: 2
```

**示例 2:**

```
输入: nums = [5,7,7,8,8,10], target = 6
输出: 0

```

**限制：**

`0 <= 数组长度 <= 50000`

### 问题分析:

使用二分法进行求解[**看到题目条件为:数组+排序,优先考虑二分法!**]

#### java代码实现:

```java
public int search(int[] nums, int target) {
    int length = nums.length;
    if (length == 0) return 0;
    //利用二分法查找数组的target元素
    int index = -1;//目标索引:初始化为-1
    int left = 0;//左指针
    int right = nums.length - 1;//右指针
    while (left <= right) {
        int mid = (left + right) / 2;
        if (nums[mid] < target) {
            left = mid + 1;
        }else if (nums[mid] > target) {
            right = mid - 1;
        }else {
            index = mid;
            break;//记住:找到target的目标索引,赋值以后,一定要退出while循环,否则会造成死循环现象
        }
    }
    //判断index的值是否发生改变:若index为-1,则表示在nums数组中未找到target的值,则返回[-1,-1]
    if (index == -1) {
        return 0;
    }else {
        int count = 1;
        int p1 =  index - 1,p2 = index + 1;
        while (p1 >=0) {
            if (nums[p1] == target){
                count++;
                p1--;
            }else {
                break;
            }
        }
        while (p2 <= length - 1) {
            if (nums[p2] == target) {
                count++;
                p2++;
            }else {
                break;
            }
        }
        //此时的p1 + 1和p2 - 1位置即为返回的第一个位置和最后一个位置:因为最后p1--和p2++会导致两者的指针各自少一位和多一位
        return count;
    }
}
```

#### JavaScript代码实现:

![t-53-1](/img/algorithm/jianzhi/t-53-1.jpg)

```javascript
//二分法 找target的左右边界（开边界）
var search = function(nums, target) {
    //搜索右边界
    let l = 0, r = nums.length - 1;
    while(l <= r){
        let mid = Math.floor((l + r) / 2);
        if(nums[mid] <= target){ //相等的数值归纳在左边
            l = mid + 1;
        }else{
            r = mid - 1;
        }
    }
    if(r >= 0 && nums[r] != target){
        return 0; //没有找到目标数值
    }
    let right = l; //右边界

    l = 0, r = nums.length - 1;
    while(l <= r){
        let mid = Math.floor((l + r) / 2);
        if(nums[mid] < target){ //相等的数值归纳在左边
            l = mid + 1;
        }else{
            r = mid - 1;
        }
    }
    let left = r; //左边界
    return right - left - 1;
}
```

### 53 - II. 0～n-1中缺失的数字

一个长度为n-1的递增排序数组中的所有数字都是唯一的，并且每个数字都在范围0～n-1之内。在范围0～n-1内的n个数字中有且只有一个数字不在该数组中，请找出这个数字。

**示例 1:**

```
输入: [0,1,3]
输出: 2
```

**示例 2:**

```
输入: [0,1,2,3,4,5,6,7,9]
输出: 8
```

**限制：**

`1 <= 数组长度 <= 10000`

### 问题分析:

#### java代码实现:

```java
//思路1:直接法
public int missingNumber(int[] nums) {
    for (int i = 0; i < nums.length; i++) {
        if (i != nums[i]) {
            return i;
        }
    }
    return -1;
}

//思路2:二分法
public int missingNumber(int[] nums) {
    int i = 0, j = nums.length - 1;
    while(i <= j) {
        int m = (i + j) / 2;
        if(nums[m] == m) i = m + 1;
        else j = m - 1;
    }
    return i;
}
```

#### JavaScript代码实现:

```javascript
//二分
var missingNumber = function(nums) {
    let left = 0, right = nums.length - 1;
    while(left <= right){
        let mid = Math.floor((left + right) / 2);
        if(nums[mid] == mid){
            left = mid + 1;
        }else   //如果不相等，后面的数字和位置一定也不相等
            right = mid - 1;
        }
    }
    return left;
};
```

## 面试题54 : 二叉搜索树的第k大节点

### 问题描述:

给定一棵二叉搜索树，请找出其中第k大的节点。

**示例 1:**

```
输入: root = [3,1,4,null,2], k = 1
   3
  / \
 1   4
  \
   2
输出: 4
```

**示例 2:**

```
输入: root = [5,3,6,2,4,null,null,1], k = 3
       5
      / \
     3   6
    / \
   2   4
  /
 1
输出: 4
```

**限制：**

1 ≤ k ≤ 二叉搜索树元素个数

### 问题分析:

根据二叉排序树的一个重要结论进行求解: **二叉排序树的中序遍历结果一定是有序[升序]的!!!**

#### java代码实现:

```java
//存储升序的节点的val值
List<Integer> list = new LinkedList<>();
public int kthLargest(TreeNode root, int k) {
    if (root == null) {
        return -1;
    }
    //利用中序遍历进行求解
    infixOrder(root);
    int size = list.size();
    if (k > size) {
        return -1;
    }else {
        return list.get(size - k);
    }

}

//中序遍历
private void infixOrder(TreeNode root) {
    if (root.left != null) {
        infixOrder(root.left);
    }
    list.add(root.val);
    if (root.right != null) {
        infixOrder(root.right);
    }
}
```

#### JavaScript代码实现:

```javascript
var kthLargest = function(root, k) {
    let arr = [];
    serach(root, arr);
    return arr[arr.length - k]
};
function serach(root,arr){
    if(root.left){
        serach(root.left, arr);
    }
    arr.push(root.val);
    if(root.right){
        serach(root.right, arr)
    }
}
```

## 面试题55 : 

### 问题描述:

####  55 - I. 二叉树的深度

输入一棵二叉树的根节点，求该树的深度。从根节点到叶节点依次经过的节点（含根、叶节点）形成树的一条路径，最长路径的长度为树的深度。

例如：

给定二叉树 `[3,9,20,null,null,15,7]`，

```
    3
   / \
  9  20
    /  \
   15   7
```

返回它的最大深度 3 。

**提示：**

1. `节点总数 <= 10000`

#### 55 - II. 平衡二叉树

输入一棵二叉树的根节点，判断该树是不是平衡二叉树。如果某二叉树中任意节点的左右子树的深度相差不超过1，那么它就是一棵平衡二叉树。

**示例 1:**

给定二叉树 `[3,9,20,null,null,15,7]`

```
    3
   / \
  9  20
    /  \
   15   7
```

返回 `true` 。
**示例 2:**

给定二叉树 `[1,2,2,3,3,null,null,4,4]`

```
       1
      / \
     2   2
    / \
   3   3
  / \
 4   4
```

返回 `false` 。

**限制：**

- `0 <= 树的结点个数 <= 10000`

### 问题分析:

#### 55-1题 : 使用递归法进行求解

#### 55-2题 : 递归法[前序遍历+判断左右子树的深度之差是否小于等于1]

#### java代码实现:

```java
//55-1题代码
public int maxDepth(TreeNode root) {
    if (root == null) {
        return 0;
    }
    return Math.max(maxDepth(root.left),maxDepth(root.right)) + 1;
}

//55-2题代码
public boolean isBalanced(TreeNode root) {
    //如果root节点为null,则直接返回true:表示该树为平衡树
    if (root == null) return true;
    //否则我们递归比较该树是否满足平衡树的要求,并且返回左子树和右子树是否满足平衡树的要求[三者是&&的关系,只有全部都满足平衡树的要求,这颗二叉树才是一颗平衡二叉树]
    return Math.abs(depth(root.left) - depth(root.right)) <= 1 && isBalanced(root.left) && isBalanced(root.right);
}

//求解当前节点作为根节点的树的高度
private int depth(TreeNode root) {
    //如果root节点为null,则直接返回0:即该树的高度为0
    if (root == null) return 0;
    //否则返回左子树/右子树的高度的最大值 + 1(本身root节点那一层的高度)
    return Math.max(depth(root.left), depth(root.right)) + 1;
}
```

#### JavaScript代码实现:

```javascript
55-1代码：
方法1：
var maxDepth = function(root) {
    if(root == null){
        return null;
    }
    return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
}

方法2：栈
var maxDepth = function(root) {
    if(!root) return 0;
    let pre = [root];
    let deep = 0;
    while(pre.length){
        let len = pre.length;
        for(let i = 0; i < len; i++){
            let temp = pre.shift();
            if(temp.left){
                pre.push(temp.left)
            }
            if(temp.right){
                pre.push(temp.right)
            }
        }
        deep++;      
    }
    return deep;
};

55-2代码：
var isBalanced = function(root) {
    let result = true;
    let isB = function(root){
        //终止条件
        if(!root) return 0;
        //计算左右子树的深度
        const left = isB(root.left) + 1;
        const right = isB(root.right) + 1;
        if(Math.abs(left - right) > 1){
            result = false;
        }
        return Math.max(left, right)        
    }
    isB(root)
    return result
};
```

## 面试题56 : 

### 问题描述:

#### 56 - I. 数组中数字出现的次数

一个整型数组 `nums` 里除两个数字之外，其他数字都出现了两次。请写程序找出这两个只出现一次的数字。要求时间复杂度是O(n)，空间复杂度是O(1)。

**示例 1：**

```
输入：nums = [4,1,4,6]
输出：[1,6] 或 [6,1]
```

**示例 2：**

```
输入：nums = [1,2,10,4,1,4,3,3]
输出：[2,10] 或 [10,2]
```

**限制：**

- `2 <= nums.length <= 10000`

#### 56 - II. 数组中数字出现的次数 II

在一个数组 `nums` 中除一个数字只出现一次之外，其他数字都出现了三次。请找出那个只出现一次的数字。

**示例 1：**

```
输入：nums = [3,4,3,3]
输出：4
```

**示例 2：**

```
输入：nums = [9,1,7,9,7,9,7]
输出：1
```

**限制：**

- `1 <= nums.length <= 10000`
- `1 <= nums[i] < 2^31`

### 问题分析:

#### java代码实现:

```java
//56-1代码 使用哈希表进行求解
public int[] singleNumbers(int[] nums) {
    //定义结果数组res
    int[] res = new int[2];
    //定义一个哈希表
    HashSet<Integer> set = new HashSet<>();
    for (int i = 0; i < nums.length; i++) {
        //如果哈希表存在该值[说明该值出现了两次],我们选择将该键值从set中移除
        if (set.contains(nums[i])) {
            set.remove(nums[i]);
        }else {
            set.add(nums[i]);
        }
    }
    //最后此时哈希表中存放即为出现一次的元素
    int index = 0;
    for (Integer val : set) {
        res[index++] = val;
    }
    return res;
}

//使用位运算进行求解
public int[] singleNumbers(int[] nums) {
    int ret = 0;
    for (int n : nums) {
        ret ^= n;
    }
    int div = 1;
    while ((div & ret) == 0) {
        div <<= 1;
    }
    int a = 0, b = 0;
    for (int n : nums) {
        if ((div & n) != 0) {
            a ^= n;
        } else {
            b ^= n;
        }
    }
    return new int[]{a, b};
}

//56-2代码 使用哈希表进行求解
public int singleNumber(int[] nums) {
	//获取数组nums的长度
    int n = nums.length;
    //定义一个map集合:key为nums中元素,value为key出现的次数
    HashMap<Integer,Integer> map = new HashMap<>();
    for (int i = 0; i < n; i++) {
        map.put(nums[i],map.getOrDefault(nums[i],0) + 1);
    }
    //遍历map:找到value值为1的key值,即为结果
    for (Map.Entry<Integer, Integer> entry : map.entrySet()) {
        if (entry.getValue() == 1) {
            return entry.getKey();
        }
    }
    return -1;
}
```

#### JavaScript代码实现:

56-1：

![t-56-1](/img/algorithm/jianzhi/t-56-1.jpg)

![t-56-2](/img/algorithm/jianzhi/t-56-2.jpg)

56-2:

有限状态机：这种方式我大概率是学不会了（甚至用到了数电的知识）

```javascript
56-1代码
/**
使用异或 进行分组
**/
var singleNumbers = function(nums) {
    let xor = 0;
    let len = nums.length;
    for(let i = 0; i < len; i++){
        xor ^= nums[i];
    }
    //此时xor存储的是 两个只出现了一次的值 的异或值
    // console.log(xor)
    let c = 1;
    while(!(c & xor)){
        c <<= 1;
    }
    //此时c存储的是xor中 位值为1 的数
    // console.log(c);
    //根据这个位的值将 数组中的数据分为 2组
  	//每组分别异或 就能找到 该组中数量只有1个的那个值
    let num1 = 0, num2 = 0;
    for(let i = 0; i < len; i++){
        if(nums[i] & c){
            num1 ^= nums[i];
        }else{
            num2 ^= nums[i];
        }
    }
    return [num1, num2]
};

56-2代码
/**
状态机：因为一个数最多出现3次
00表示出现0次，出现3次
01表示出现1次
10表示出现2次
用twos,ones表示这个状态,状态的转化方程为
        ones = ones ^ nums[i] & ~twos;
        twos = twos ^ nums[i] & ~ones;
最后ones位上的值就是只出现一次的那个数值，(这里的ones是一个数的各个位)
**/
var singleNumber = function(nums) {
    let ones = 0, twos = 0;
    for(let i = 0; i < nums.length; i++){
        ones = ones ^ nums[i] & ~twos;
        twos = twos ^ nums[i] & ~ones;
    }
    return ones;
}
```

## 面试题57 : 和为s的两个数字

### 问题描述:

输入一个递增排序的数组和一个数字s，在数组中查找两个数，使得它们的和正好是s。如果有多对数字的和等于s，则输出任意一对即可。

**示例 1：**

```
输入：nums = [2,7,11,15], target = 9
输出：[2,7] 或者 [7,2]
```

**示例 2：**

```
输入：nums = [10,26,30,31,47,60], target = 40
输出：[10,30] 或者 [30,10]
```

**限制：**

- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= 10^6`

### 问题分析:

#### java代码实现:

```java
//思路: 双指针直接法
//定义两个指针left,right指向数组索引为0和数组最后一个索引位置,计算此时nums[left]和nums[right]的和sum
//如果sum > target : 则将右指针左移
//如果sum < target : 则将左指针右移
//如果sum == target : 则说明找到目标的两个数
public int[] twoSum(int[] nums, int target) {
    int left = 0;
    int right = nums.length - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum > target) {
            right--;
        }else if (sum < target) {
            left++;
        }else {
            return new int[]{nums[left],nums[right]};
        }
    }
    return null;
}
```

#### JavaScript代码实现:

```javascript
var twoSum = function(nums, target) {
    let i = 0;
    let j = nums.length - 1;
    while(i != j){
        let temp = nums[i] + nums[j];
        if(temp > target) j--;
        else if(temp < target) i++;
        else return [nums[i], nums[j]]
    }
};
```

## 面试题58 : 

### 问题描述:

#### 58 - I. 翻转单词顺序

输入一个英文句子，翻转句子中单词的顺序，但单词内字符的顺序不变。为简单起见，标点符号和普通字母一样处理。例如输入字符串"I am a student. "，则输出"student. a am I"。

**示例 1：**

```
输入: "the sky is blue"
输出: "blue is sky the"
```

**示例 2：**

```
输入: "  hello world!  "
输出: "world! hello"
解释: 输入字符串可以在前面或者后面包含多余的空格，但是反转后的字符不能包括。
```

**示例 3：**

```
输入: "a good   example"
输出: "example good a"
解释: 如果两个单词间有多余的空格，将反转后单词间的空格减少到只含一个。
```

**说明：**

- 无空格字符构成一个单词。
- 输入字符串可以在前面或者后面包含多余的空格，但是反转后的字符不能包括。
- 如果两个单词间有多余的空格，将反转后单词间的空格减少到只含一个。

#### 58 - II. 左旋转字符串

字符串的左旋转操作是把字符串前面的若干个字符转移到字符串的尾部。请定义一个函数实现字符串左旋转操作的功能。比如，输入字符串"abcdefg"和数字2，该函数将返回左旋转两位得到的结果"cdefgab"。

**示例 1：**

```
输入: s = "abcdefg", k = 2
输出: "cdefgab"
```

**示例 2：**

```
输入: s = "lrloseumgh", k = 6
输出: "umghlrlose"
```

**限制：**

- `1 <= k < s.length <= 10000`

### 问题分析:

#### java代码实现:

![找错专用图2](/img/algorithm/jianzhi/找错专用图2.gif)

我58-2的方法2超级巧妙

```java
//58-I题代码实现 双指针法
public String reverseWords(String s) {
    //将首尾的空格进行删除
    s.trim();
    //定义结果集ans
    StringBuilder ans = new StringBuilder();
    int length = s.length();
    //定义指针i : 指向字符串s的最后一个单词位置
    int i = length - 1;
    while (i >= 0) {
        //记录j指针为此时i指针的位置
        int j = i;
        while (j >= 0 && s.charAt(j) != ' ') {
            j--;
        }
        //则此时单词在s字符串中的区间为[j+1,i+1] substring(start,end) 包括start索引位置,不包括end索引位置
        ans.append(s.substring(j + 1,i + 1) + " ");
        //将单词中的空格跳过
        while (j >= 0 && s.charAt(j) == ' ') {
            j--;
        }
        //此时更新i指针的位置,进行下一轮的while循环
        i = j;
    }
    //最后ans结果集的最后一个单词后面会有一个空格,我们再使用trim()方法将其去除
    return ans.toString().trim();
}

//58-II题代码实现
//方法1: 单指针法
public String reverseLeftWords01(String s, int n) {
    //定义StringBuilder类 sb : 进行结果集的添加操作
    StringBuilder sb = new StringBuilder();
    for (int j = n; j < s.length(); j++) {
        sb.append(s.charAt(j));
    }
    for (int j = 0; j < n; j++) {
        sb.append(s.charAt(j));
    }
    return sb.toString();

}
//方法2: API法 使用substring方法
public String reverseLeftWords(String s, int n) {
    //定义StringBuilder类 sb : 进行结果集的添加操作
    StringBuilder sb = new StringBuilder();
    sb.append(s.substring(n,s.length())).append(s.substring(0,n));
    return sb.toString();
}
```

#### JavaScript代码实现:

```javascript
58-1:
方法1：
var reverseWords = function(s) {
    let newS = s.split(/\s+/g).reverse()
    return newS.join(' ').trim()
}
方法2：
var reverseWords = function(s) {
    s = s.trim();
    let n = s.length;
    let j = n - 1, i = n - 1;
    let res = [];
    while(j >= 0){
        while(s[i] != ' ' && i >= 0){
            i--;
        }
        res.push(s.slice(i + 1, j + 1))
        while(s[i] == ' '){
            i--;
        }
        j = i;
    }
    return res.join(' ');
}

58-2：
方法1：
var reverseLeftWords = function(s, n) {
    // console.log(s.slice(0,n))
    // console.log(s.substr(n))
    return s.substr(n) + s.slice(0,n)
};

方法2：
//!!!!!取余
var reverseLeftWords = function(s, n) {
    let res = '';
    for(let i = n; i < n + s.length; i++){
      //这里i在[s.length, n+s.length)范围中的数据通过取余操作就可以变成[0, n)范围中的数据
        res += s[i % s.length];
    }
    return res;
};
```

## 面试题59-I : 滑动窗口的最大值

### 问题描述:

给定一个数组 `nums` 和滑动窗口的大小 `k`，请找出所有滑动窗口里的最大值。

**示例:**

```
输入: nums = [1,3,-1,-3,5,3,6,7], 和 k = 3
输出: [3,3,5,5,6,7] 
解释: 

  滑动窗口的位置                最大值
---------------               -----
[1  3  -1] -3  5  3  6  7       3
 1 [3  -1  -3] 5  3  6  7       3
 1  3 [-1  -3  5] 3  6  7       5
 1  3  -1 [-3  5  3] 6  7       5
 1  3  -1  -3 [5  3  6] 7       6
 1  3  -1  -3  5 [3  6  7]      7
```

**提示：**

你可以假设 *k* 总是有效的，在输入数组不为空的情况下，1 ≤ k ≤ 输入数组的大小。

### 问题分析:

**滑动窗口通用模板**:

```c++
伪代码模板: 这里定义一个res结果变量进行更新,下面的代码将这个res变量优化消除掉了
	def findSubArray(nums):
    N = len(nums) # 数组/字符串长度
    left, right = 0, 0 # 双指针，表示当前遍历的区间[left, right]，闭区间
    sums = 0 # 用于统计 子数组/子区间 是否有效，根据题目可能会改成求和/计数
    res = 0 # 保存最大的满足题目要求的 子数组/子串 长度
    while right < N: # 当右边的指针没有搜索到 数组/字符串 的结尾
        sums += nums[right] # 增加当前右边指针的数字/字符的求和/计数
        while 区间[left, right]不符合题意：# 此时需要一直移动左指针，直至找到一个符合题意的区间
            sums -= nums[left] # 移动左指针前需要从counter中减少left位置字符的求和/计数
            left += 1 # 真正的移动左指针，注意不能跟上面一行代码写反
        # 到 while 结束时，我们找到了一个符合题意要求的 子数组/子串
        res = max(res, right - left + 1) # 需要更新结果
        right += 1 # 移动右指针，去探索新的区间
    return res
```

```java
转换成java代码:
public int findwindow(arr) {
    //注意这里nums数组可能就是本身条件中arr数组,也可能需要进行转换得到
    # arr --> nums
    int n = nums.length(); //获取特定数组的长度
    int left,right = 0; //双指针，表示当前遍历的区间[left, right]，闭区间
    int sum/cnt = 0; // 用于统计 子数组/子区间 是否有效，根据题目可能会改成求和/计数
    while(right < n) {
        sum/cnt += nums[right];
        if(区间[left, right]不符合题意) {
            //此时需要移动左指针,需要从sum/cnt中减少left位置字符的求和/计数
            sum/cnt -= nums[left];
            left++;动左指针，注意不能跟上面一行代码写反
        }
        right++;移动右指针，去探索新的区间
        //注意:上面不满足区间条件时,left++,right++,这里巧妙地维护了当前最大窗口的值不变性    
    }
    //最后返回结果集:由于上面的right指针最后多++了一次,这里返回right - left
    return right - left;   
}
```

```javascript
转换成javaScript代码:
var equalSubstring = function(arr) {
    //注意这里nums数组可能就是本身条件中arr数组,也可能需要进行转换得到
    # arr --> nums
	let n = nums.length(); //获取特定数组的长度
    let left,right = 0; //双指针，表示当前遍历的区间[left, right]，闭区间
    let sum/cnt = 0; // 用于统计 子数组/子区间 是否有效，根据题目可能会改成求和/计数
    while(right < n) {
        sum/cnt += nums[right];
        if(区间[left, right]不符合题意) {
            //此时需要移动左指针,需要从sum/cnt中减少left位置字符的求和/计数
            sum/cnt -= nums[left];
            left++;动左指针，注意不能跟上面一行代码写反
        }
        right++;移动右指针，去探索新的区间
        //注意:上面不满足区间条件时,left++,right++,这里巧妙地维护了当前最大窗口的值不变性
    }
    //最后返回结果集:由于上面的right指针最后多++了一次,这里返回right - left
    return right - left;
};
```

#### java代码实现:

```java
//暴力方法: 依次计算每一个k大小窗口的最大值
public int[] maxSlidingWindow(int[] nums, int k) {
    //获取nums数组的长度: len
    int len = nums.length;
    if (len == 0) return new int[0];
    int[] ans = new int[len - k + 1];
    int index = 0;
    int p = 0;
    List<Integer> list = new ArrayList<>();
    while (p <= len - k) {
        int window = Integer.MIN_VALUE;
        for (int i = p; i < p + k; i++) {
            window = Math.max(window,nums[i]);
        }
        ans[index++] = window;
        p++;
    }
    return ans;
}

//更优秀的解法: 单调队列方法
初始化： 双端队列 deque，结果列表 res，数组长度 n；
滑动窗口： 左边界范围 i∈[1−k,n+1−k] ，右边界范围 j∈[0,n−1] ；
若 i > 0 且 队首元素 deque[0] == 被删除元素 nums[i - 1]：则队首元素出队；
删除 deque 内所有 <nums[j] 的元素，以保持 deque 递减；
将 nums[j] 添加至 deque 尾部；
若已形成窗口（即 i≥0 ）：将窗口最大值（即队首元素 deque[0]）添加至列表res
返回值： 返回结果列表 resres 。
public int[] maxSlidingWindow(int[] nums, int k) {
	if(nums.length == 0 || k == 0) return new int[0];
	Deque<Integer> deque = new LinkedList<>();
    int[] res = new int[nums.length - k + 1];
    for(int j = 0, i = 1 - k; j < nums.length; i++, j++) {
        if(i > 0 && deque.peekFirst() == nums[i - 1]) {
            deque.removeFirst(); // 删除 deque 中对应的 nums[i-1]
        }
        while(!deque.isEmpty() && deque.peekLast() < nums[j]) {
             deque.removeLast(); // 保持 deque 递减
        }		
        deque.addLast(nums[j]);       
        if(i >= 0) {
            res[i] = deque.peekFirst();  // 记录窗口最大值
        }
    }
    return res;
}
```

#### JavaScript代码实现:

```javascript
暴力方法：
var maxSlidingWindow = function(nums, k) {
    if(!nums.length) return []
    let result = [];
    for(let i = 0; i < nums.length - k + 1; i++){
        let max = nums[i]
        for(let j = i+1 ; j < i + k; j++){
            if(nums[j] > max){
                max = nums[j]
            }
        }
        result.push(max)
    }
    return result;
};

单调栈方法：
var maxSlidingWindow = function(nums, k) {
    if(!nums.length || k == 0) return [];
    let stack = []; //存放当前窗口中的最大值，从大到小排列
    let res = [];
    // [i, j]是一个窗口
    for(let j = 0, i = 0 - k + 1; j < nums.length; i++, j++){
        if(i > 0 && stack[0] == nums[i - 1]){
            stack.shift();
        }
        while(stack.length && stack[stack.length - 1] < nums[j]){
            stack.pop();
        }
        stack.push(nums[j])
        if(i >= 0){
            res[i] = stack[0];
        }
    }
    return res;
};
```

## 面试题59-II : 队列的最大值 : 

### 问题描述:

请定义一个队列并实现函数 `max_value` 得到队列里的最大值，要求函数`max_value`、`push_back` 和 `pop_front` 的**均摊**时间复杂度都是O(1)。

若队列为空，`pop_front` 和 `max_value` 需要返回 -1

**示例 1：**

```
输入: 
["MaxQueue","push_back","push_back","max_value","pop_front","max_value"]
[[],[1],[2],[],[],[]]
输出: [null,null,null,2,1,2]
```

**示例 2：**

```
输入: 
["MaxQueue","pop_front","max_value"]
[[],[],[]]
输出: [null,-1,-1]
```

**限制：**

- `1 <= push_back,pop_front,max_value的总操作数 <= 10000`
- `1 <= value <= 10^5`

### 问题分析:

![](/img/algorithm/jianzhi/59-2.png)

#### java代码实现:

```java
class MaxQueue {
    Queue<Integer> queue;
    Deque<Integer> deque;
    public MaxQueue() {
        queue = new LinkedList<>();
        deque = new LinkedList<>();
    }
    public int max_value() {
        return deque.isEmpty() ? -1 : deque.peekFirst();
    }
    public void push_back(int value) {
        queue.offer(value);
        while(!deque.isEmpty() && deque.peekLast() < value)
            deque.pollLast();
        deque.offerLast(value);
    }
    public int pop_front() {
        if(queue.isEmpty()) return -1;
        if(queue.peek().equals(deque.peekFirst()))
            deque.pollFirst();
        return queue.poll();
    }
}
```

#### JavaScript代码实现:

```javascript
var MaxQueue = function() {
    this.queue = []; //普通队列
    this.deque = []; //双端队列,递减的数组
};
MaxQueue.prototype.max_value = function() {
    let len = this.deque.length;
    if(!len) return -1;
    return this.deque[0];
};
MaxQueue.prototype.push_back = function(value) {
    this.queue.push(value)
    while(this.deque.length && this.deque[this.deque.length - 1] < value){
        console.log('x')
        this.deque.pop();
    }
    this.deque.push(value)
    
};
MaxQueue.prototype.pop_front = function() {
    let len = this.queue.length;
    if(!len) return -1;
    let pop = this.queue.shift();
    if(pop == this.deque[0]){
        this.deque.shift();
    }
    return pop;
};
```

## 面试题60 : n个骰子的点数

### 问题描述:

把n个骰子扔在地上，所有骰子朝上一面的点数之和为s。输入n，打印出s的所有可能的值出现的概率。

你需要用一个浮点数数组返回答案，其中第 i 个元素代表这 n 个骰子所能掷出的点数集合中第 i 小的那个的概率。

**示例 1:**

```
输入: 1
输出: [0.16667,0.16667,0.16667,0.16667,0.16667,0.16667]
```

**示例 2:**

```
输入: 2
输出: [0.02778,0.05556,0.08333,0.11111,0.13889,0.16667,0.13889,0.11111,0.08333,0.05556,0.02778]
```

**限制：**

`1 <= n <= 11`

### 问题分析:

使用**动态规划**进行求解

#### java代码实现:

```java
public double[] dicesProbability(int n) {
    //dp[i][j] : 表示投掷i枚骰子以后,点数j出现的次数
    //其中dp[n][j] 肯定是从dp[n - 1][j - i]转换而来,其中i从1到6,前提条件是j - i > 0
    //由于n最大为11,所以投掷的骰子数最大值为11 * 6 = 66,故dp数组的行数为n + 1,列数为6 * n + 1
    int[][] dp = new int[n + 1][6 * n + 1];
    //初始化:当只有一个骰子的时候,我们容易得到
    for (int i = 1; i <= 6; i++) {
        dp[1][i] = 1;
    }
    //从投掷两次开始更新,一直到投掷n次
    for (int i = 2; i <= n; i++) {
        //投掷的点数从i开始,一直到6 * i
        for (int j = i; j <= i * 6; j++) {
            //dp[i][j] 的状态是由前面dp[i - 1][j - k]的状态转换得到,是k∈[1,6],dp[i - 1][j - k]之和
            for (int k = 1; k <= 6; k++) {
                //如果次数的点数小于等于k:说明不能选择前一种的这种取法
                if (j - k <= 0) {
                    //直接退出当前循环,既然j - k小于1,则后面的k值必然只会比1小
                    break;
                }
                //此时dp[i][j] = ∑ dp[i - 1][j - k] 其中k ∈ 满足条件的[1,6]
                dp[i][j] += dp[i - 1][j - k];
            }
        }
    }

    //获取骰子投掷n次,能够投掷的选择次数
    double total = Math.pow(6,n);
    //此时dp[n][n] ~ dp[n][n * 6]即保存着投掷n次以后,骰子点数从n到6 * n的个数 
    //定义结果数组:存储投掷n次以后每一种点数出现的概率
    double[] ans = new double[5 * n + 1];   //6 * n + 1 - n = 5 * n + 1,因为投掷n次最低骰子点数为n
    //获取n ~ 6 * n中点数出现的频率
    for (int i = n; i <= 6 * n; i++) {
        ans[i - n] = (double)dp[n][i] / total;
    }
    return ans;
}
```

#### JavaScript代码实现:

```javascript
//dfs
方法1：
var dicesProbability = function(n) {
    if(n == 0) return [0];
    let map = {};

    var dfs = function(start, n, sum){
        if(start == n + 1){
            if(map[sum] == undefined){
                map[sum] = 1;
            }else{
                map[sum]++;
            }
            return;
        }
        for(let j = 1; j <= 6; j++){
            sum += j;
            dfs(start + 1, n, sum);
            sum -= j;
        }
    }
    dfs(1, n, 0);

    let size = Math.pow(6, n);
    let ans = new Array(6 * n - n + 1).fill(0);
    // console.log(ans);
    let index = 0;
    for(let obj in map){
        ans[index++] = map[obj] * 1.0 / size;
    }
    return ans;
};

//动态规划
方法2：
/**
dp[i][j] ，表示投掷完 i 枚骰子后，点数 j 的出现次数。

第n枚骰子的点数:
for (i = 1; i <= 6; i ++) {
    dp[n][j] += dp[n-1][j - i]
}

边界条件：
for (int i = 1; i <= 6; i ++) {
    dp[1][i] = 1;
}
**/
var dicesProbability = function(n) {
    let dp = new Array(15).fill(0).map(r => new Array(70).fill(0));
    //初始化：
    for(let i = 1; i <= 6; i++){
        dp[1][i] = 1;
    }
    for(let i = 2; i <= n; i++){ //控制第几颗骰子
        for(let j = i; j <= 6 * i; j++){ //控制所有可能的点数
            //实现状态转移
            for(let cur = 1; cur <= 6; cur++){
                if(j - cur <= 0){
                    break;
                }
                dp[i][j] += dp[i - 1][j - cur];
            }
        }
    }
    let all = Math.pow(6, n);
    let res = [];
    for(let i = n; i <= 6 * n; i++){
        res.push(dp[n][i] * 1.0 / all)
    }
    return res;
};

/**
空间优化：
每个阶段的状态都只和它前一阶段的状态有关，因此我们不需要用额外的一维来保存所有阶段。

用一维数组来保存一个阶段的状态，然后对下一个阶段可能出现的点数 j 从大到小遍历，实现一个阶段到下一阶段的转换。
**/
var dicesProbability = function(n) {
    let dp = new Array(70).fill(0);
    //初始化：
    for(let i = 1; i <= 6; i++){
        dp[i] = 1;
    }
    for(let i = 2; i <= n; i++){ //控制第几颗骰子
        for(let j = 6 * i; j >= i ; j--){ //控制所有可能的点数
            //实现状态转移
            dp[j] = 0;
            for(let cur = 1; cur <= 6; cur++){ //控制当前骰子的点数
                if(j - cur < i - 1){
                    break;
                }
                dp[j] += dp[j - cur];
            }
        }
    }
    let all = Math.pow(6, n);
    let res = [];
    for(let i = n; i <= 6 * n; i++){
        res.push(dp[i] * 1.0 / all)
    }
    return res;
};
```

## 面试题61 : 扑克牌中的顺子

### 问题描述:

从扑克牌中随机抽5张牌，判断是不是一个顺子，即这5张牌是不是连续的。2～10为数字本身，A为1，J为11，Q为12，K为13，而大、小王为 0 ，可以看成任意数字。A 不能视为 14。

**示例 1:**

```
输入: [1,2,3,4,5]
输出: True
```

**示例 2:**

```
输入: [0,0,1,2,5]
输出: True
```

**限制：**

数组长度为 5 

数组的数取值为 [0, 13] .

### 问题分析:

#### java代码实现:

```java
//直接法进行求解
public boolean isStraight(int[] nums) {
    //获取nums数组的长度
    int n = nums.length;
    int k = 0;//记录大小王的个数
    int index = -1;//定义一个初始索引:记录不是大小王开始的位置
    Arrays.sort(nums);//对牌按照数字大小进行排序处理
    //我们遍历一次nums数组:获取大小王的个数,以及index的位置
    for (int i = 0; i < n; i++) {
        if (nums[i] == 0) {
            k++;
            index = i;
        }else {
            break;
        }
    }
    //此时i + 1的索引位置即为不是大小王的开始扑克牌位置 : 
    //(1)如果不存在大小王,则原来index为-1,此时index+1即为0;  
    //(2)如果存在大小王,则index指向最后一个大小王的位置,故index+1指向的即为第一个不是大小王的位置
    for (int i = index + 1; i < n - 1; i++) {
        int section = Math.abs(nums[i] - nums[i + 1]);//比较当前牌的大小和后一张牌大小之间差的绝对值,即为section
        //如果section == 0:表示两个数相等,则必不可能会构成顺子,直接返回false
        if (section == 0) {
            return false;
        }else if (section == 1) {//如果section为1,则满足顺子的要求,继续判断下一个扑克牌
            continue;
        }else {
            //如果section大于1,则此时需要判断大小王是否存在
            //如果存在:则判断大小王是否能够充当其中的差的扑克牌数
            if (k > 0 && k >= section - 1) {
                k = k - section + 1;
            }else {
                //否则返回false
                return false;
            }
        }
    }
    //最后,当所有情况都满足,我们返回true
    return true;
}
```

#### JavaScript代码实现:

```javascript
var isStraight = function(nums) {
    nums.sort((a, b) => a - b)
    let start = 0;//start记录了0的个数
    while(nums[start] == 0) start++;

    //有相同的数字则一定不是顺子
    for(let i = start; i < 4; i++){
        if(nums[i] == nums[i + 1]) return false;
    }
    
    let temp = 0;
    for(let i = start; i < 4; i++){
        temp += (nums[i + 1] - nums[i] - 1)
    }

    if(start >= temp) return true;
    else return false;
    
};
```

## 面试题62 : 圆圈中最后剩下的数字

### 问题描述:

0,1,···,n-1这n个数字排成一个圆圈，从数字0开始，每次从这个圆圈里删除第m个数字（删除后从下一个数字开始计数）。求出这个圆圈里剩下的最后一个数字。

例如，0、1、2、3、4这5个数字组成一个圆圈，从数字0开始每次删除第3个数字，则删除的前4个数字依次是2、0、4、1，因此最后剩下的数字是3。

**示例 1：**

```
输入: n = 5, m = 3
输出: 3
```

**示例 2：**

```
输入: n = 10, m = 17
输出: 2
```

**限制：**

- `1 <= n <= 10^5`
- `1 <= m <= 10^6`

### 问题分析:

**数学 + 递归方法**

我们将上述问题建模为函数 f(n, m)，该函数的返回值为最终留下的元素的序号。

首先，长度为 n 的序列会先删除第 m % n 个元素，然后剩下一个长度为 n - 1 的序列。那么，我们可以递归地求解 f(n - 1, m)，就可以知道对于剩下的 n - 1 个元素，最终会留下第几个元素，我们设答案为 x = f(n - 1, m)。

由于我们删除了第 m % n 个元素，将序列的长度变为 n - 1。当我们知道了 f(n - 1, m) 对应的答案 x 之后，我们也就可以知道，长度为 n 的序列最后一个删除的元素，应当是从 m % n 开始数的第 x 个元素。因此有 f(n, m) = (m % n + x) % n = (m + x) % n。

我们递归计算 f(n, m), f(n - 1, m), f(n - 2, m), ... 直到递归的终点 f(1, m)。当序列长度为 1 时，一定会留下唯一的那个元素，它的编号为 0。

#### java代码实现:

```java
public int lastRemaining(int n, int m) {
    return f(n, m);
}

public int f(int n, int m) {
    if (n == 1) {
        return 0;
    }
    int x = f(n - 1, m);
    return (m + x) % n;
}
```

#### JavaScript代码实现:

![t-62-1](/img/algorithm/jianzhi/t-62-1.jpg)

```javascript
//(此轮过后的num下标 + m) % 上轮元素个数 = 上轮num的下标(!!!!是上一轮m个人报数时的坐标，不是上一轮人数坐标)
var lastRemaining = function(n, m) {
    if(n < 1 || m < 1) return -1;

    let last = 0;
    for(let i = 2; i <= n; i++){
        last = (last + m) % i;
    }
    return last;
};
```

## 面试题63 : 股票的最大利润

### 问题描述:

假设把某股票的价格按照时间先后顺序存储在数组中，请问买卖该股票一次可能获得的最大利润是多少？

**示例 1:**

```
输入: [7,1,5,3,6,4]
输出: 5
解释: 在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。
     注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格。
```

**示例 2:**

```
输入: [7,6,4,3,1]
输出: 0
解释: 在这种情况下, 没有交易完成, 所以最大利润为 0。
```

**限制：**

`0 <= 数组长度 <= 10^5`

### 问题分析:

设共有n天，第a天买，第b天卖，则需保证 a < b；可推出交易方案数共有：
(n - 1) + (n - 2) + ... + 2 + 1 = n(n - 1) / 2

因此，暴力法的时间复杂度为 O(n^2),考虑使用动态规划降低时间复杂度，以下按照流程解题。

#### 动态规划解析：

- 状态定义： 设动态规划列表 dp ，dp[i] 代表以 prices[i] 为结尾的子数组的最大利润（以下简称为 前 i日的最大利润）。
- 转移方程： 由于题目限定 买卖该股票一次 ，因此前 i 日最大利润 dp[i]等于前 i - 1日最大利润 dp[i-1] 和第 i 日卖出的最大利润中的最大值。
- 前 i 日最大利润 = max(前 (i-1) 日最大利润, 第 i 日价格 - 前 i 日最低价格);
- dp[i] = max(dp[i - 1], prices[i] - min(prices[0:i]))
- 初始状态： dp[0] = 0 ，即首日利润为 0；
- 返回值： dp[n - 1] ，其中n为 dp 列表长度。

![](/img/algorithm/jianzhi/7.png)

注意:

- 因为我们每次在计算dp[i]的时候需要计算min(prices[0],prices[i])的值,故我们可以定义一个minPrice进行记录上一个状态的最低价格,从来直接更新minPrice即可,就不用每一次都是重新遍历获取最低价格了

#### java代码实现:

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

#### JavaScript代码实现:

```javascript
var maxProfit = function(prices) {
    let len = prices.length;
    if(len == 0) return 0;
    let dp = new Array(len).fill(0);
    let min = prices[0];
    dp[0] = 0;
    for(let i = 1; i < len; i++){
        min = Math.min(min, prices[i]);
        dp[i] = Math.max(prices[i] - min, dp[i - 1])
    }
    return dp[len - 1];
}
```

#### 降维优化空间复杂度

由于dp[i]的状态只和dp[i - 1]的状态只以及minPrice有关,我们可以选择对dp数组进行降维为dp变量,保证新的状态转移方程:
$$
dp = max(dp ,prices[i] - minPrice)
$$
中前者dp为前i天的最大利润,后者dp为前i-1天的最大利润

#### java代码实现:

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

#### JavaScript代码实现:

```javascript
//min记录最小的那个股票价格

var maxProfit = function(prices) {
//关键是求两个数的差值最大，并且大的数在后面
    let profits = 0; //利益初始化为0
    let min = prices[0]; //最小值初始化是第一个
    for(let i = 0; i < prices.length; i++){
        min = Math.min(min, prices[i]);
        profits = Math.max(profits, prices[i] - min)
    }
    return profits;
};
```

## 面试题64 : 求1+2+…+n

### 问题描述:

求 `1+2+...+n` ，要求不能使用乘除法、for、while、if、else、switch、case等关键字及条件判断语句（A?B:C）。

**示例 1：**

```
输入: n = 3
输出: 6
```

**示例 2：**

```
输入: n = 9
输出: 45
```

 

**限制：**

- `1 <= n <= 10000`

### 问题分析:

#### java代码实现:

```java
//递归法
public int sumNums(int n) {
    boolean x = n > 1 && (n += sumNums(n - 1)) > 0;
    return n;
}
```

#### JavaScript代码实现:

```javascript
方法1：（递归）
var sumNums = function(n) {
    let x = n > 1 && (n += sumNums(n - 1)) > 0
    return n;
};

方法2：（数学方法）
var sumNums = function(n) {
    return Math.round(Math.exp(Math.log(n)+Math.log(n+1)-Math.log(2)))
};

备注：
/**快速乘**/
let quickMulti(a, b){
  let ans = 0;
  for(; b; b >>= 1){
    if(b & 1){
      ans += a;
    }
    a <<= 1;
  }
  return ans;
}
```

## 面试题65 : 不用加减乘除做加法

### 问题描述:

写一个函数，求两个整数之和，要求在函数体内不得使用 “+”、“-”、“*”、“/” 四则运算符号。

**示例:**

```
输入: a = 1, b = 1
输出: 2
```

**提示：**

- `a`, `b` 均可能是负数或 0
- 结果不会溢出 32 位整数

### 问题分析:

#### java代码实现:

```java
//我们采取位运算的计算方式进行计算
public int add(int a, int b) {
    //如果两数的对应的二进制位相加不存在进位的情况: 相当于两者进行异或运算
    //如果两数的对应的二进制位相加存在进位的情况: 则相当于进行与运算,进位位在更高一位
    while (b != 0) {//只要一直存在进位,则我们循环进行递归运算
        int c = (a & b) << 1; //获取进位位
        a = a ^ b; //进行异或运算
        b = c; //将进位位赋值给b
    }
    return a;
}
```

#### JavaScript代码实现:

```javascript
var add = function(a, b) {
    // 相加的当前位n=a^b
    // 相加的进位c=a&b<<1
    // 当前位更新到a上
    // 进位更新到b上
    // 当进位为0时，输出的a即为a+b的值
    if(b == 0) return a;
    return add(a ^ b, (a & b) << 1);
};
```

## 面试题66 : 构建乘积数组

### 问题描述:

给定一个数组 `A[0,1,…,n-1]`，请构建一个数组 `B[0,1,…,n-1]`，其中 `B[i]` 的值是数组 `A` 中除了下标 `i` 以外的元素的积, 即 `B[i]=A[0]×A[1]×…×A[i-1]×A[i+1]×…×A[n-1]`。不能使用除法。

**示例:**

```
输入: [1,2,3,4,5]
输出: [120,60,40,30,24]
```

**提示：**

- 所有元素乘积之和不会溢出 32 位整数
- `a.length <= 100000`

### 问题分析:

#### 思路1: 暴力法[加优化]

#### 思路2: 左右相间法

![](/img/algorithm/jianzhi/66.png)

![](/img/algorithm/jianzhi/66-2.png)

#### java代码实现:

```java
//思路1:暴力法
public int[] constructArr(int[] a) {
    if (a == null || a.length == 0) return new int[0];
    //定义一个新的结果集res
    int[] res = new int[a.length];
    //求解a[0] ~ a[a.length - 1]的所有值的乘积,结果为cmp
    int cmp = 1;
    for (int i = 0; i < a.length; i++) {
        cmp = cmp * a[i];
    }
    Arrays.fill(res,1);
    //进行res结果集的赋值操作...
    for (int i = 0; i < a.length; i++) {
        if (a[i] == 1) {
            res[i] = cmp;
        }else {
            int left = i - 1;
            int right = i + 1;
            while (left >= 0) {
                res[i] = res[i] * a[left];
                left--;
            }
            while (right <= a.length - 1) {
                res[i] = res[i] * a[right];
                right++;
            }
        }
    }
    return res;
}


//思路2:左右相间相乘法
public int[] constructArr(int[] a) {
    int n = a.length;
    if (a == null || n == 0) return new int[0];
    //定义一个新的结果集res
    int[] res = new int[n];
    int left = 1;
    for (int i = 0; i < n; i++) {
        res[i] = left;
        left = left * a[i];
    }
    int right = 1;
    for (int i = n - 1; i >= 0; i--) {
        res[i] = res[i] * right;
        right = right * a[i];
    }
    //返回结果集
    return res;
}
```

#### JavaScript代码实现:

```javascript
var constructArr = function(a) {
    if(!a.length) return a;
    let b = [];
    //计算上三角
    b[0] = 1;
    for(let i = 1; i < a.length; i++){
        b[i] = b[i - 1] * a[i - 1];
    }
    // console.log(b)
    //计算上三角
    let temp = new Array(a.length).fill(1)
    for(let i = a.length - 2; i >= 0; i--){
        temp[i] = temp[i + 1] * a[i + 1]
    }
    // console.log(temp)

    for(let i = 0; i < a.length; i++){
        b[i] *= temp[i]
    }
    return b;
};
```

## 面试题67 : 把字符串转换成整数

### 问题描述:

写一个函数 StrToInt，实现把字符串转换成整数这个功能。不能使用 atoi 或者其他类似的库函数。

首先，该函数会根据需要丢弃无用的开头空格字符，直到寻找到第一个非空格的字符为止。

当我们寻找到的第一个非空字符为正或者负号时，则将该符号与之后面尽可能多的连续数字组合起来，作为该整数的正负号；假如第一个非空字符是数字，则直接将其与之后连续的数字字符组合起来，形成整数。

该字符串除了有效的整数部分之后也可能会存在多余的字符，这些字符可以被忽略，它们对于函数不应该造成影响。

注意：假如该字符串中的第一个非空格字符不是一个有效整数字符、字符串为空或字符串仅包含空白字符时，则你的函数不需要进行转换。

在任何情况下，若函数不能进行有效的转换时，请返回 0。

**说明：**

假设我们的环境只能存储 32 位大小的有符号整数，那么其数值范围为 [−231,  231 − 1]。如果数值超过这个范围，请返回  INT_MAX (231 − 1) 或 INT_MIN (−231) 。

**示例 1:**

```
输入: "42"
输出: 42
```

**示例 2:**

```
输入: "   -42"
输出: -42
解释: 第一个非空白字符为 '-', 它是一个负号。
     我们尽可能将负号与后面所有连续出现的数字组合起来，最后得到 -42 。
```

**示例 3:**

```
输入: "4193 with words"
输出: 4193
解释: 转换截止于数字 '3' ，因为它的下一个字符不为数字。
```

**示例 4:**

```
输入: "words and 987"
输出: 0
解释: 第一个非空字符是 'w', 但它不是数字或正、负号。
     因此无法执行有效的转换。
```

**示例 5:**

```
输入: "-91283472332"
输出: -2147483648
解释: 数字 "-91283472332" 超过 32 位有符号整数范围。 
     因此返回 INT_MIN (−231) 。
```

### 问题分析:

```java
思路:
     1.首先将字符串去掉首尾的空格,转换成字符数组
     2.判断第一个字符是'+'还是'-',或者直接是字符,从而进行正负号的初始化,以及确定字符数组遍历的起始索引时0还是1
     3.遍历该字符数组:
     3.1如果当前遍历的字符不是数字,直接退出while循环
     3.2如果当前遍历的字符是数字,则需要之前的总和已经当前值进行联合判断:
     	如果当前添加arr[i]时,之前的数值已经超过了214748364,则无论arr[i]为0~9中的哪个数值,num = num * 10 + (arr[i] - '0')的结果都会大于2147483647
     	或者当前添加arr[i]时,之前的数值已等于214748364,但是arr[i]超过了7,则num = num * 10 + (arr[i] - '0')的结果亦是2147483648和2147483649,也大于2147483647
       	上面两者情况:需要根据符号位返回Integer.MAX_VALUE或者Integer.MIN_VALUE
       3.3如果都不满足,说明可以继续扫描下一个字符,并把当前值作为个位进行求和运算:num = num * 10 + (arr[i] - '0')
    4.最后退出while循环即可以找到存在的数值:符号位(symbol) * 数值(num)
```

#### java代码实现:

```java
class Solution {
    //在String字符串中找到满足要求的整数,并将其输出
    public int strToInt(String str) {
        //首先我们需要利用String字符串的trim()方法:去掉首尾的不必要的空格
        char[] arr = str.trim().toCharArray();
        int symbol = 1;//初始化为正数
        int index = 1;//字符串数组开始遍历的起始索引
        int num = 0;//初始化接收的String字符串中的int数值
        int maxValue = Integer.MAX_VALUE;
        int minValue = Integer.MIN_VALUE;
        int cmpValue = maxValue / 10;
        if (arr.length == 0) {
            //说明字符串没有值
            return 0;
        }
        if (arr[0] == '-') {
            //若第一位是负号的话,将symbol置为-1
            symbol = -1;
        }else if (arr[0] != '+') {
            //表示第一位即为数值或者是其他字符,将index从1-->0,即从0开始遍历
            index = 0;
        }
        for (int i = index; i < arr.length; i++) {
            if (arr[i] < '0' || arr[i] > '9') {
                //说明该字符不为数字,直接退出循环
                break;
            }
            if (num > cmpValue || num == cmpValue && arr[i] > '7') {
                //如果当前添加arr[i]时,之前的数值已经超过了214748364,则无论arr[i]为0~9中的哪个数值,num = num * 10 + (arr[i] - '0')的结果都会大于2147483647
                //或者当前添加arr[i]时,之前的数值已等于214748364,但是arr[i]超过了7,则num = num * 10 + (arr[i] - '0')的结果亦是2147483648和2147483649,也大于2147483647
                //2.若匹配到最后越界,则返回maxValue或者minValue
                return symbol == 1 ? maxValue : minValue;
            }
            //如果不满足上述条件
            num = num * 10 + (arr[i] - '0');//将num的值进行更新操作
        }

        //退出while循环,此时num的值即为输出的值
        //1.若匹配到一个非数字字符情况break退出while
        //1.1 第一个即为非数字字符:此时num为初始设置值0
        //1.2 后续退出:num即为不加正负号之前的结果
        return symbol * num;
    }
}
```

#### JavaScript代码实现:

```javascript
方法1：
var strToInt = function(str) {
    let res = str.match(/^\s*[+-]?\d+/);
    if(!res) return 0;

    res = res[0].trim();
    if(res >= Math.pow(2, 31)){
        return Math.pow(2, 31) - 1;
    }else if(res <= Math.pow(-2, 31)){
        return Math.pow(-2, 31)
    }else{
        return res;
    }
};

方法2：
/**
常规方法
**/
var strToInt = function(str) {
    let len = str.length;
    if(len == 0) return 0;
    let i = 0;
    while(str[i] == ' '){
        if(++i == len) return 0;
    }
    let sign = 1; //表示正数
    if(str[i] == '-' ) sign = -1;
    if(str[i] == '-' || str[i] == '+') i++;
    let res = 0;
    for(let j = i; j < len; j++){
        if(str[j] < '0' || str[j] > '9') break;
        res = res * 10 + Number(str[j])
    }
    res *= sign;
    if(res >= Math.pow(2, 31)){
        return Math.pow(2, 31) - 1;
    }else if(res <= Math.pow(-2, 31)){
        return Math.pow(-2, 31)
    }else{
        return res;
    }
};
```

## 面试题68 : 二叉树的最近公共祖先

### 问题描述:

#### 68 - I. 二叉搜索树的最近公共祖先

给定一个二叉搜索树, 找到该树中两个指定节点的最近公共祖先。

[百度百科](https://baike.baidu.com/item/%E6%9C%80%E8%BF%91%E5%85%AC%E5%85%B1%E7%A5%96%E5%85%88/8918834?fr=aladdin)中最近公共祖先的定义为：“对于有根树 T 的两个结点 p、q，最近公共祖先表示为一个结点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（**一个节点也可以是它自己的祖先**）。”

例如，给定如下二叉搜索树:  root = [6,2,8,0,4,7,9,null,null,3,5]

![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/14/binarysearchtree_improved.png)

 

**示例 1:**

```
输入: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
输出: 6 
解释: 节点 2 和节点 8 的最近公共祖先是 6。
```

**示例 2:**

```
输入: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4
输出: 2
解释: 节点 2 和节点 4 的最近公共祖先是 2, 因为根据定义最近公共祖先节点可以为节点本身。
```

**说明:**

- 所有节点的值都是唯一的。
- p、q 为不同节点且均存在于给定的二叉搜索树中。

#### 68 - II. 二叉树的最近公共祖先

给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。

[百度百科](https://baike.baidu.com/item/%E6%9C%80%E8%BF%91%E5%85%AC%E5%85%B1%E7%A5%96%E5%85%88/8918834?fr=aladdin)中最近公共祖先的定义为：“对于有根树 T 的两个结点 p、q，最近公共祖先表示为一个结点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（**一个节点也可以是它自己的祖先**）。”

例如，给定如下二叉树:  root = [3,5,1,6,2,0,8,null,null,7,4]

![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/15/binarytree.png)

 

**示例 1:**

```
输入: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
输出: 3
解释: 节点 5 和节点 1 的最近公共祖先是节点 3。
```

**示例 2:**

```
输入: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
输出: 5
解释: 节点 5 和节点 4 的最近公共祖先是节点 5。因为根据定义最近公共祖先节点可以为节点本身。
```

 

**说明:**

- 所有节点的值都是唯一的。
- p、q 为不同节点且均存在于给定的二叉树中。

### 问题分析:

#### java代码实现:

```java
//68_1:迭代法
循环搜索： 当节点 root 为空时跳出；
当 p,q 都在 root 的 右子树 中，则遍历至 root.right；
否则，当 p,q 都在 root的 左子树 中，则遍历至 root.left ；
否则，说明找到了 最近公共祖先 ，跳出。
返回值： 最近公共祖先 root 。
其中给定的二叉树为二叉搜索树,则有:
若 root.val < p.val ，则 p 在 root 右子树 中；
若 root.val > p.val ，则 p 在 root 左子树 中；
若 root.val = p.val ，则 p 和 root 指向 同一节点 

    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        while (root != null) {
            if (root.val < p.val && root.val < q.val) {
                //说明p,q都在root的右子树中
                root = root.right;
            }else if (root.val > p.val && root.val > q.val) {
                //说明p,q都在root的左子树中
                root = root.left;
            }else {
                break;//说明该root节点即为最近的公共祖先
            }
        }
        return root;
    }

//68-2: 递归进行求解
终止条件：当越过叶节点，则直接返回 null ；
当 rootr等于 p, q ，则直接返回 root ；
递推工作：
开启递归左子节点，返回值记为 left ；
开启递归右子节点，返回值记为 right ；
返回值： 根据 left 和 right ，可展开为四种情况；
当 left 和 right 同时为空 ：说明 root 的左 / 右子树中都不包含 p,q，返回 null ；
当 left 和 right 同时不为空 ：说明 p,q 分列在 root 的 异侧 （分别在 左 / 右子树），因此 root 为最近公共祖先，返回 root ；
当 left 为空 ，right 不为空 ：p,q 都不在 root 的左子树中，直接返回 right 。具体可分为两种情况：
p,q 其中一个在 root 的 右子树 中，此时 right 指向 p（假设为 p ）；
p,q 两节点都在 root 的 右子树 中，此时的 right 指向 最近公共祖先节点 ；
当 left 不为空 ，right 为空 ：与情况 3. 同理；

    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null) return null;//如果树为空,即根节点为null,则返回null
        if (root == p || root == q) return root;//如果根节点root等于p或者root节点等于q,则符合上面的情况2或者3,直接返回root节点
        //我们向左进行p节点/q节点的查找
        TreeNode left = lowestCommonAncestor(root.left,p,q);
        //我们向右进行p节点/q节点的查找
        TreeNode right = lowestCommonAncestor(root.right,p,q);
        //该情况可以归纳到下面两种情况中
        /*if (left == null && right == null) {
            //表示左子树和右子树都未找到p节点/q节点
            return null;//返回null
        }*/
        //如果左子树未找到,则说明在右子树找到,则返回right
        if (left == null) return right;
        //如果右子树未找到,则说明在左子树找到,则返回left
        if (right == null) return left;
        //否则表示左子树和右子树都存在,即p节点和q节点分别位于root的不同侧,即分别位于左,右子树中,则返回root节点
        return root;
    }
```

#### JavaScript代码实现:

```javascript
68-1：
var lowestCommonAncestor = function(root, p, q) {
    while(root != null){
        if(root.val < p.val && root.val < q.val){
            root = root.right;
        }else if(root.val > p.val && root.val > q.val){
            root = root.left;
        }else{
            break;
        }
    }
    return root;
};

68-2：
var lowestCommonAncestor = function(root, p, q) {
    if(root == null) return null;
    if(root == p || root == q) return root;

    let left = lowestCommonAncestor(root.left, p, q);
    let right = lowestCommonAncestor(root.right, p, q);
    if(left == null) return right;
    if(right == null) return left;
    return root;
};
```


