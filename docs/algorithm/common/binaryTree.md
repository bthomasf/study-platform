---
title: 二叉树算法
---
# 二叉树笔记汇总

> 这里汇总的是普通的二叉树常见题型，二叉搜索树等高级二叉树题型单独总结，在后面进行讲解

## 1. 重建二叉树问题

### 问题描述：

![image-20210707084811749](/img/algorithm/common/binaryTree/二叉树1.png)

### 问题分析1：

![image-20210707084859617](/img/algorithm/common/binaryTree/二叉树2.png)

### 代码实现1：

```java
//定义中序,后序遍历数组属性
int[] inorder;
int[] postorder;
//定义属性post_idx记录每一次的根结点位置
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
    //先递归构建右子树
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

### 问题分析2：

![image-20210707085249951](/img/algorithm/common/binaryTree/二叉树3.png)

### 代码实现2：

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

## 2. 二叉树中和为某一值的路径的问题

### 问题描述：

输入一棵二叉树和一个整数，打印出二叉树中节点值的和为输入整数的所有路径。从树的根节点开始往下一直到叶节点所经过的节点形成一条路径。

**示例:**
给定如下二叉树，以及目标和 `target = 22`，

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

### 问题分析：

```java
//实现
public List<List<Integer>> pathSum(TreeNode root, int sum) {
    //定义一个结果集res
    List<List<Integer>> res = new ArrayList<>();
    //定义一个部分子集
    List<Integer> sub = new ArrayList<>();
    //通过dfs深度优先遍历完成
    dfs(root,sum,res,sub);
    return res;
}

//dfs实现:
private void dfs(TreeNode node, int sum, List<List<Integer>> res, List<Integer> sub) {
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
        return;
    }

    //进行左子树的dfs递归搜索
    if(node.left != null) {
        dfs(node.left,sum - node.val,res,sub);
         //回溯回来记得将sub的最后一个元素去除掉
        sub.remove(sub.size() - 1);
    }

    //进行右子树的dfs递归搜索
    if(node.right != null) {
        dfs(node.right,sum - node.val,res,sub);
        //回溯回来记得将sub的最后一个元素去除掉
        sub.remove(sub.size() - 1);
    }
}
```

## 3. 树的子结构

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

## 4. 二叉树的镜像 

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

#### java代码实现:

![找错专用图4](/img/algorithm/common/binaryTree/找错专用图4.jpg)

也可以使用栈，对每一个节点都进行左右节点的交换

```java
public TreeNode mirrorTree(TreeNode root) {
    if (root == null) {
        return root;
    }
    TreeNode temp = root.left;
    root.left = root.right;
    root.right = temp;

    mirrorTree(root.left);
    mirrorTree(root.right);
    return root;
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

![t-28-1](/img/algorithm/common/binaryTree/二叉树4.png)

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

## 5. 判断对称的二叉树 

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
        //如果该二叉树为空或者只有一个根节点，直接返回true
        if (root == null || (root.left == null && root.right == null)) {
            return true;
        }
        //否则我们调用judge函数进行判断
        return judge(root.left,root.right);
    }

    private boolean judge(TreeNode left, TreeNode right) {
        if (left == null && right == null) {
            return true;
        }

        if (left == null || right == null || left.val != right.val) {
            return false;
        }

        return judge(left.left,right.right) && judge(left.right,right.left);
    }}
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

## 6. 从上到下打印二叉树

### 问题描述: 

### 6 - I. 从上到下打印二叉树

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

### 6 - II. 从上到下打印二叉树

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

## 7. 二叉搜索树的后序遍历序列

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

![](/img/algorithm/common/binaryTree/二叉树7.png)

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

## 8. 二叉树的深度和判断平衡二叉树

### 问题描述:

####  8 - I. 二叉树的深度

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

#### 8 - II. 平衡二叉树

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

#### 8-1题 : 使用递归法进行求解

#### 8-2题 : 递归法[前序遍历+判断左右子树的深度之差是否小于等于1]

#### java代码实现:

```java
//8-1题代码
public int maxDepth(TreeNode root) {
    if (root == null) {
        return 0;
    }
    return Math.max(maxDepth(root.left),maxDepth(root.right)) + 1;
}

//8-2题代码
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

## 9. 最近公共祖先问题

### 问题描述:

#### 9 - I. 二叉搜索树的最近公共祖先

给定一个二叉搜索树, 找到该树中两个指定节点的最近公共祖先。

[百度百科](https://baike.baidu.com/item/%E6%9C%80%E8%BF%91%E5%85%AC%E5%85%B1%E7%A5%96%E5%85%88/8918834?fr=aladdin)中最近公共祖先的定义为：“对于有根树 T 的两个结点 p、q，最近公共祖先表示为一个结点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（**一个节点也可以是它自己的祖先**）。”

例如，给定如下二叉搜索树:  root = [6,2,8,0,4,7,9,null,null,3,5]

![img](/img/algorithm/common/binaryTree/二叉树9.png)

 

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

#### 9 - II. 二叉树的最近公共祖先

给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。

[百度百科](https://baike.baidu.com/item/%E6%9C%80%E8%BF%91%E5%85%AC%E5%85%B1%E7%A5%96%E5%85%88/8918834?fr=aladdin)中最近公共祖先的定义为：“对于有根树 T 的两个结点 p、q，最近公共祖先表示为一个结点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（**一个节点也可以是它自己的祖先**）。”

例如，给定如下二叉树:  root = [3,5,1,6,2,0,8,null,null,7,4]

![img](/img/algorithm/common/binaryTree/二叉树9-2.png)

 

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
//9-1:迭代法
循环搜索： 当节点 root 为空时跳出；
当 p,q 都在 root 的 右子树 中，则遍历至 root.right；
否则，当 p,q 都在 root的 左子树 中，则遍历至 root.left
否则，说明找到了 最近公共祖先 ，跳出。
返回值： 最近公共祖先 root 
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

//9-2: 递归进行求解
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
9-1：
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

9-2：
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

## 10. 出现次数最多的子树元素和 ---LeetCode508

给你一个二叉树的**根结点**，请你找出出现次数最多的子树元素和。一个结点的「子树元素和」定义为以该结点为根的二叉树上所有结点的元素之和（包括结点本身）。

你需要返回出现次数最多的子树元素和。如果有多个元素出现的次数相同，返回所有出现次数最多的子树元素和（不限顺序）。

**示例 1：**
输入:

```
  5
 /  \
2   -3
```

返回 [2, -3, 4]，所有的值均只出现一次，以任意顺序返回所有值。

**示例 2：**
输入：

```
  5
 /  \
2   -5
```

返回 [2]，只有 2 出现两次，-5 只出现 1 次。

### 问题分析：

> 思路:
>
> 使用递归进行求解,这题类似翻转二叉树的递归思路,先递归,后进行运算,即一种分治的思想
>
> 即我们先通过递归,到达树的叶子节点位置,然后求其子树元素和,然后回溯上一层,求其子树的元素和......一直回溯到root节点,即求整个二叉树的元素和;
>
> 同时定义一个存储一个map集合,key值为元素和,value值为元素和出现的次数
>
> 以及一个记录元素和出现次数最大值maxCount
>
> 在求出当前子树元素和的同时,将其加入到map中,同时更新maxCount的值
>
> 最后遍历map,将value值为maxCount的元素和进行保存数组输出

![image-20210707110852077](/img/algorithm/common/binaryTree/二叉树10.png)

### 代码实现：

```java
HashMap<Integer,Integer> map = new HashMap<>();
int maxCount = 0;
public int[] findFrequentTreeSum(TreeNode root) {
    if (root == null) {
        return new int[0];
    }
    List<Integer> res = new ArrayList<>();
    findSum(root);
    for (Map.Entry<Integer, Integer> entry : map.entrySet()) {
        if (entry.getValue() == maxCount) {
            res.add(entry.getKey());
        }
    }
    //将List转成int类型数组返回
    //使用下面的api会降低代码的速度
    //return res.stream().mapToInt(Integer::intValue).toArray();
    int[] result = new int[res.size()];
    for (int i = 0; i < res.size(); i++) {
        result[i] = res.get(i);
    }
    return result;
}

private int findSum(TreeNode node) {
    //如果到达叶子结点,则其sum为0
    if (node == null) {
        return 0;
    }

    //求左子树的sum和
    int left = findSum(node.left);
    //求右子树的sum和
    int right = findSum(node.right);
    //求当前子树的sum和
    int sum = node.val + left + right;
    //如果map中不存在该key,则将(sum,1)添加到map中,如果map中存在该key,则将val值加1
    map.put(sum,map.getOrDefault(sum,0) + 1);
    maxCount = Math.max(maxCount,map.get(sum));
    //返回当前子树的sum和
    return sum;
}
```

## 11. 求根节点到叶子节点数字之和-----leetcode129

给你一个二叉树的根节点 `root` ，树中每个节点都存放有一个 `0` 到 `9` 之间的数字。

每条从根节点到叶节点的路径都代表一个数字：

- 例如，从根节点到叶节点的路径 `1 -> 2 -> 3` 表示数字 `123` 。

计算从根节点到叶节点生成的 **所有数字之和** 。

**叶节点** 是指没有子节点的节点。

**示例 1：**

![img](/img/algorithm/common/binaryTree/二叉树11.png)

```
输入：root = [1,2,3]
输出：25
解释：
从根到叶子节点路径 1->2 代表数字 12
从根到叶子节点路径 1->3 代表数字 13
因此，数字总和 = 12 + 13 = 25
```

**示例 2：**

![img](/img/algorithm/common/binaryTree/二叉树11-2.png)

```
输入：root = [4,9,0,5,1]
输出：1026
解释：
从根到叶子节点路径 4->9->5 代表数字 495
从根到叶子节点路径 4->9->1 代表数字 491
从根到叶子节点路径 4->0 代表数字 40
因此，数字总和 = 495 + 491 + 40 = 1026
```

**提示：**

- 树中节点的数目在范围 `[1, 1000]` 内
- `0 <= Node.val <= 9`
- 树的深度不超过 `10`

### 问题分析：

> 对于这种根节点到叶子节点的路径求一些问题,大体思路都是利用递归进行实现
>
> **第一种方法**
>
> 我们定义一个集合sub:用来保存二叉树路径上的数字
>
> 定义一个sum:用来记录根到叶子节点数字之和
>
> 首先我们将当前节点的val值加入到sub集合中
>
> 然后我们分别进行左子树的递归和右子树的递归
>
> 如果我么遍历到某一叶子节点时:
>
> 我们将其代表的数字加入到sum中,进行sum值的更新操作
>
> **注意:左子树和右子树的递归回溯时,需要将sub集合的之前加入的值剔除掉,即删除sub集合的最后一个元素**
>
> **第二种方法**:
>
> 我们无需定义sub集合存储二叉树路径上的元素的val值,直接定义一个preSum值,初始值为0
>
> 在递归过程中,通过sum = presume * 10 + node.val来完成sum的求和操作

### 代码实现：

```java
//第二种方法的代码实现
public int sumNumbers(TreeNode root) {
    return dfs(root,0);
}

private int dfs(TreeNode root, int preSum) {
    if (root == null) {
        return 0;
    }
    
    int sum = preSum * 10 + root.val;

    if (root.left == null && root.right == null) {
        return sum;
    }else {
        return dfs(root.left,sum) + dfs(root.right,sum);
    }
}
```

## 12. 填充每个节点的下一个右侧节点指针-----LeetCode116

给定一个 **完美二叉树** ，其所有叶子节点都在同一层，每个父节点都有两个子节点。二叉树定义如下：

```
struct Node {
  int val;
  Node *left;
  Node *right;
  Node *next;
}
```

填充它的每个 next 指针，让这个指针指向其下一个右侧节点。如果找不到下一个右侧节点，则将 next 指针设置为 `NULL`。

初始状态下，所有 next 指针都被设置为 `NULL`。

**进阶：**

- 你只能使用常量级额外空间。
- 使用递归解题也符合要求，本题中递归程序占用的栈空间不算做额外的空间复杂度。

 

**示例：**

![img](/img/algorithm/common/binaryTree/二叉树12.png)

```
输入：root = [1,2,3,4,5,6,7]
输出：[1,#,2,3,#,4,5,6,7,#]
解释：给定二叉树如图 A 所示，你的函数应该填充它的每个 next 指针，以指向其下一个右侧节点，如图 B 所示。序列化的输出按层序遍历排列，同一层节点由 next 指针连接，'#' 标志着每一层的结束。
```

**提示：**

- 树中节点的数量少于 `4096`
- `-1000 <= node.val <= 1000`

### 问题分析：

> 思路:BFS + 链表存储求解
>
> 由于要求输出每一个节点的next指针,观察可知,可以考虑将其输出进行分层处理(即BFS遍历)
>
> 将此二叉树的每一层的最左侧节点作为起始节点开始遍历,构建每一层的链表,从而将每一层的节点的next域进行对应的填充
>
> **注意**：为了方便遍历,此处遍历每一层时,定义一个空的head节点作为该层链表的头节点(仅仅作为头结点标志位)

![image-20210707112234387](/img/algorithm/common/binaryTree/二叉树12-2.png)

### 代码实现：

```java
public Node connect(Node root) {
    //判断root是否为null
    if (root == null) {
        //该二叉树为空
        return null;
    }
    //将root节点赋值给cur,开始进行BFS遍历
    Node cur = root;
    //cur:取整个二叉树的每一层的最左侧节点,由于第一层只有一个root节点,且next默认初始化为null,故第一层不用进行BFS遍历,创建链表设置其next指针
    while (cur != null) {
        //定义一个链表的头节点:只是作为BFS每层链表的头结点的标志位
        Node head = new Node(0);
        //定义pre作为每一层链表节点的前一个节点
        Node pre = head;
        //进行当前层的BFS遍历
        while (cur != null) {
            //先判断左子节点是否存在,若存在,则加入链表并将链表的pre指针指向下一个节点
            if (cur.left != null) {
                pre.next = cur.left;
                pre = pre.next;
            }
            //再判断右子节点是否存在,若存在,则加入链表并将链表的pre指针指向下一个节点
            if (cur.right != null) {
                pre.next = cur.right;
                pre.next = pre;
            }
            //将cur指向此层的next节点,继续进行链表的设置
            cur =cur.next;
        }
        //当前层BFS遍历结束,将cur指向head下一个节点,即下一层的最左侧子节点,进行下一轮的BFS
        //直到cur为null,即遍历到最左侧子节点为null(此二叉树遍历结束)停止
        cur = head.next;
    }
    //返回填充完next指针以后的根节点
    return root;
}
```

### 代码实现2：

```java
public static Node connect(Node root) {
    if (root == null) return root;
    //定义一个队列
    Queue<Node> queue = new LinkedList<>();
    queue.offer(root);
    //如果队列不为空
    while (!queue.isEmpty()) {
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            //获取当前节点
            Node cur = queue.poll();
            //将当前节点的next域指向下一个节点
            if (i < size - 1) {
                cur.next = queue.peek();
            }else {
                //说明是当前层的最后一个节点，我们将其next域指向null
                cur.next = null;
            }
            //如果当前节点的左右子树存在，则进行入队操作
            if (cur.left != null) queue.offer(cur.left);
            if (cur.right != null) queue.offer(cur.right);
        }

    }
    return root;
}
```

## 13.  二叉树展开为链表---LeetCode114

给你二叉树的根结点 `root` ，请你将它展开为一个单链表：

- 展开后的单链表应该同样使用 `TreeNode` ，其中 `right` 子指针指向链表中下一个结点，而左子指针始终为 `null` 。
- 展开后的单链表应该与二叉树 [**先序遍历**](https://baike.baidu.com/item/先序遍历/6442839?fr=aladdin) 顺序相同。

 

**示例 1：**

![img](/img/algorithm/common/binaryTree/二叉树13.png)

```
输入：root = [1,2,5,3,4,null,6]
输出：[1,null,2,null,3,null,4,null,5,null,6]
```

**示例 2：**

```
输入：root = []
输出：[]
```

**示例 3：**

```
输入：root = [0]
输出：[0]
```

**提示：**

- 树中结点数在范围 `[0, 2000]` 内
- `-100 <= Node.val <= 100`

### 问题分析：

> 定义一个辅助指针变量temp:初始化为null;
>
> 因为构建的单链表为1->2->3->4->5->6
>
> 先从左子树进行单链表的构建:并先构建左子节点,然后回溯构建右子节点
>
> 再从右子树进行单链表的构建:同样也是先构建左子节点,然后回溯构建右子节点
>
> 我们从root节点开始进行构建
>
> 我们即先将temp指针指向当前的子树的头结点root
>
> 然后分别获取该子树的左子节点left和右子节点right
>
> 先从左子树进行单链表的构建:
>
> 即先判断左子节点left是否为null:
>
> 若不为null:
>
> (1)则将当前头节点root的左子节点置为null
>
> (2)再将当前头节点root的右子节点指向left节点,并更新下一个right节点为temp
>
> (3)最后递归进行left左子树的单链表的构建操作
>
> 再从右子树进行单链表的构建:
>
> 即先判断右子节点right是否为null:
>
> 若不为null:
>
> (1)则将之前的temp指针的right指针指向right节点
>
> (2)更新下一个right节点为temp
>
> (3)最后递归进行right右子树的单链表的构建操作

### 代码实现：

```java
TreeNode temp = null;
public void flatten(TreeNode root) {
    //原地将二叉树变成一个单向链表,其中用right指针表示next指针
    if (root == null) {
        return;
    }
    temp = root;
    TreeNode left = root.left;
    TreeNode right = root.right;
    if (left != null) {
        root.left = null;
        root.right = left;
        temp = left;
        flatten(left);
    }
    if (right != null) {
        temp.right = right;
        temp = right;
        flatten(right);
    }
}
```

## 14. 完全二叉树的节点个数 ----LeetCode222

给你一棵 **完全二叉树** 的根节点 `root` ，求出该树的节点个数。

[完全二叉树](https://baike.baidu.com/item/完全二叉树/7773232?fr=aladdin) 的定义如下：在完全二叉树中，除了最底层节点可能没填满外，其余每层节点数都达到最大值，并且最下面一层的节点都集中在该层最左边的若干位置。若最底层为第 `h` 层，则该层包含 `1~ 2h` 个节点。

**示例 1：**

![img](/img/algorithm/common/binaryTree/二叉树14.png)

```
输入：root = [1,2,3,4,5,6]
输出：6
```

**示例 2：**

```
输入：root = []
输出：0
```

**示例 3：**

```
输入：root = [1]
输出：1
```

**提示：**

- 树中节点的数目范围是`[0, 5 * 104]`
- `0 <= Node.val <= 5 * 104`
- 题目数据保证输入的树是 **完全二叉树**

### 代码实现：

```java
class Solution {
    //定义一个计数器
    int count = 1;
    public int countNodes(TreeNode root) {
        if (root == null) {
            return 0;
        }
        if (root.left != null) {
            count++;
            countNodes(root.left);
        }
        if (root.right != null) {
            count++;
            countNodes(root.right);
        }
        return count;
    }
}
```

## 15. 监控二叉树 ----LeetCode968

给定一个二叉树，我们在树的节点上安装摄像头。

节点上的每个摄影头都可以监视**其父对象、自身及其直接子对象。**

计算监控树的所有节点所需的最小摄像头数量。

 

**示例 1：**

![img](/img/algorithm/common/binaryTree/二叉树15.png)

```
输入：[0,0,null,0,0]
输出：1
解释：如图所示，一台摄像头足以监控所有节点。
```

**示例 2：**

![img](/img/algorithm/common/binaryTree/二叉树15-2.png)

```
输入：[0,0,null,0,null,0,null,null,0]
输出：2
解释：需要至少两个摄像头来监视树的所有节点。 上图显示了摄像头放置的有效位置之一。
```


**提示：**

1. 给定树的节点数的范围是 `[1, 1000]`。
2. 每个节点的值都是 0。

### 问题分析：

> 我们定义此二叉树的节点状态为以下三种状态:
>
> 0:表示该节点未被监视
>
> 1:表示该节点已被监视
>
> 2:表示该节点作为作为摄像头
>
> 选择监控树的所有节点所需的最小摄像头数量的策略:
>
> 策略1:
>
> 如果将叶子节点作为摄像头,则只能监视本身和他的父节点两个节点
>
> 策略2:
>
> 如果将存在左子树(或者右子树)的父节点作为摄像头,则能监控本身和的某一个子节点,如果存在父节点,最多可以监控3个节点
>
> 策略3:
>
> 如果父节点(存在左子树和右子树)作为摄像头,则能够监视至少本身,左子节点,右子节点,如果其存在父节点的话,最多可以监控4个节点
>
> 故我们优先选择策略3进行摄像头的节点的设置:
>
> (1)当该节点是null:我们设置其状态为1[已被监视]
>
> (2)当该节点为叶子节点,即其子节点均被监视,故此节点无需设置摄像头或者为被监视,即设置状态为0[未被监视]
>
> (3)若该节点存在左子树或者右子树:则子节点至少有一个摄像头,将其状态设置为1[已被监视]
>
> (4)若该节点既存在左子树,又存在右子树,则该节点需要设置摄像头,即为最佳设置摄像头的位置,我们设置其状态为2[摄像头]
>
> 注意:如果传入的二叉树只有root节点或者左子节点和右子节点均为1状态,其返回状态0,则返回dfs(root) = 0,但是此时需要将摄像头的数量再加1

![image-20210707113049875](/img/algorithm/common/binaryTree/二叉树15-3.png)

![image-20210707113113397](/img/algorithm/common/binaryTree/二叉树15-4.png)

### 代码实现：

```java
class Solution {
   int res = 0;

    public int minCameraCover(TreeNode root) {
        // 节点值0：未监视，1：已监视，2：摄像头
        if (dfs(root) == 0) {
            res++;
        } 
        return res;
    }

    private int dfs(TreeNode root) {
        if (root == null) {
            return 1;
        }
        int left =dfs(root.left);
        int right = dfs(root.right);
        // 有子节点未被监视，需装摄像头
        if (left == 0 || right == 0) {
            res++;
            return 2;
        }
        // 子节点均被监视，当前节点无需设置摄像头或置为被监视
        if (left == 1 && right == 1) {
            return 0;
        }
        // 子节点至少有一个摄像头，设为被监视
        if (left + right >= 3) {
            return 1;
        }
        return -1;
    }
}
```

