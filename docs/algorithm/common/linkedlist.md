---
title: 链表算法
---

## 反转链表1

### 题目：

定义一个函数，输入一个链表的头节点，反转该链表并输出反转后链表的头节点。

**示例:**

```
输入: 1->2->3->4->5->NULL
输出: 5->4->3->2->1->NULL
```

**限制：**

```
0 <= 节点个数 <= 5000
```

### 代码：

```java
class Solution {
    public ListNode reverseList(ListNode head) {
        if(head == null || head.next == null) return head;
        //定义一个新的辅助头节点
        ListNode newHead = new ListNode(0);
        //temp指针：指向头节点
        ListNode temp = head;
        while(temp != null) {
            //获取当前节点的next域
            ListNode next = temp.next;
            temp.next = newHead.next;
            newHead.next = temp;
            temp = next;
        }
        return newHead.next;

    }
}
```

## 反转链表2

### 题目：

给你单链表的头指针 `head` 和两个整数 `left` 和 `right` ，其中 `left <= right` 。请你反转从位置 `left` 到位置 `right` 的链表节点，返回 **反转后的链表** 。

**示例 1：**

![img](/img/algorithm/common/linkedlist/反转链表2.jpg)

```
输入：head = [1,2,3,4,5], left = 2, right = 4
输出：[1,4,3,2,5]
```

**示例 2：**

```
输入：head = [5], left = 1, right = 1
输出：[5]
```

**提示：**

- 链表中节点数目为 `n`
- `1 <= n <= 500`
- `-500 <= Node.val <= 500`
- `1 <= left <= right <= n`

### 题解:

![](/img/algorithm/common/linkedlist/反转链表6.png)

![](/img/algorithm/common/linkedlist/反转链表7.png)

### 代码：

```java
class Solution {
    //优化代码
    public ListNode reverseBetween(ListNode head, int m, int n) {
        if (head == null || head.next == null) {
            return head;
        }
        if (m == n) {
            return head;
        }
        ListNode newHead = new ListNode(0);
        //定义一个辅助指针变量,指向newHead节点
        ListNode p = newHead;
        //定义temp指针指向原头节点
        ListNode temp = head;
        //定义开始进行反转的节点,即反转刚结束的链表最后一个节点
        ListNode last = null;
        //定义一个计数器
        int count = 1;
        while (temp != null) {
            //记录当前指针的next域
            ListNode next = temp.next;
            //将temp的next域指向p指针的next域
            temp.next = p.next;
            //p的next域指向temp
            p.next = temp;
            if (count < m || count > n) {
                //如果不在反转位置区间内,则直接将temp指向next域
                temp = next;
                //然后将p指向p的next域
                p = p.next;
            }else if (count == m) {
                //如果进入开始反转位置
                //需要记录last:当前的节点
                last = temp;
                //然后不移动p指针变量,只将temp指针指向它的next域
                temp = next;
            }else if (count == n) {
                //如果进入反转的最后位置
                //则反转以后,将p指针指向之前记录的开始反转节点
                p = last;
                //将temp指针指向它的next域
                temp = next;
            }else {
                //否则,只需要将temp指针指向它的next域
                temp = next;
            }
            //记得将计数器加1
            count++;
        }
        
        //最后返回newHead的next指针,即为反转m~n位置以后的头结点
        return newHead.next;
    }
}
```

## 倒数第k个节点问题

输入一个链表，输出该链表中倒数第k个节点。为了符合大多数人的习惯，本题从1开始计数，即链表的尾节点是倒数第1个节点。

例如，一个链表有 `6` 个节点，从头节点开始，它们的值依次是 `1、2、3、4、5、6`。这个链表的倒数第 `3` 个节点是值为 `4` 的节点。

**示例：**

```
给定一个链表: 1->2->3->4->5, 和 k = 2.

返回链表 4->5.
```

### 代码：

```java
class Solution {
    public ListNode getKthFromEnd(ListNode head, int k) {
        //我们定义两个指针变量p1和p2指向链表的头节点head
        ListNode p1 = head;
        ListNode p2 = head;
        //首先让p1指针走k步
        for(int i = 0; i < k; i++) {
            p1 = p1.next;
        }
        //然后将p1,p2同时向前移动,到p1指针指向null停止
        while(p1 != null) {
            p1 = p1.next;
            p2 = p2.next;
        }
		//此时p2指向的即为倒数第k个节点
        return p2;
    }
}
```

## 删除排序链表的重复项1

### 题目：

存在一个按升序排列的链表，给你这个链表的头节点 `head` ，请你删除所有重复的元素，使每个元素 **只出现一次** 。

返回同样按升序排列的结果链表。

**示例 1：**

![img](/img/algorithm/common/linkedlist/删除链表的重复项1.jpg)

```
输入：head = [1,1,2]
输出：[1,2]
```

**示例 2：**

![img](/img/algorithm/common/linkedlist/删除链表的重复项2.jpg)

```
输入：head = [1,1,2,3,3]
输出：[1,2,3]
```

**提示：**

- 链表中节点数目在范围 `[0, 300]` 内
- `-100 <= Node.val <= 100`
- 题目数据保证链表已经按升序排列

### 代码：

```java
class Solution {
   public ListNode deleteDuplicates(ListNode head) {
        //如果head为null或者head的next域为null[只有一个节点]
        if (head == null || head.next == null)
            //直接返回head节点:一定为不重复的
            return head;
        //定义一个辅助指针变量temp,指向head节点
        ListNode temp = head;
        //while循环条件:temp不为null
        while (temp != null) {
            //保存当前节点cur
            ListNode cur = temp;
            //如果temp的next域不为null,并且temp的val值和temp的next域的val值相同
            //指向跳过该next节点
            while (temp.next != null && temp.val == temp.next.val) {
                temp = temp.next;
            }
            //退出while循环时,此时temp指向最后一个相同的节点
            //将cur节点的next节点之前temp的next域,同时将temp指向下一个不同的val值的第一个节点,即cur节点的next节点
            cur.next = temp.next;
            temp = cur.next;
        }
        //最后返回头结点
        return head;
    }
}
```

## 删除排序链表的重复项2：

### 题目：

存在一个按升序排列的链表，给你这个链表的头节点 `head` ，请你删除链表中所有存在数字重复情况的节点，只保留原始链表中 **没有重复出现** 的数字。

返回同样按升序排列的结果链表。

**示例 1：**

![img](/img/algorithm/common/linkedlist/删除链表的重复项3.jpg)

```
输入：head = [1,2,3,3,4,4,5]
输出：[1,2,5]
```

**示例 2：**

![img](/img/algorithm/common/linkedlist/删除链表的重复项4.jpg)

```
输入：head = [1,1,1,2,3]
输出：[2,3]
```

**提示：**

- 链表中节点数目在范围 `[0, 300]` 内
- `-100 <= Node.val <= 100`
- 题目数据保证链表已经按升序排列

### 代码：

```java
class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        //没有节点或者只存在一个节点的时候,直接返回原head节点即可
        if (head == null || head.next == null) {
            return head;
        }
        //定义辅助指针变量head,以及新的头结点newHead
        ListNode temp = head;
        //定义一个新的辅助头节点
        ListNode newHead = new ListNode(0);
        //同时定义一个辅助变量pNode指向newHead
        ListNode pNode = newHead;
        while (temp != null) {
            //获取当前节点
            ListNode cur = temp;
            //跳过相同节点
            while (temp.next != null && temp.val == temp.next.val) {
                temp = temp.next;
            }
            //此时表示temp节点是唯一的，不重复的，我们将其添加到pNode后面
            if (cur == temp) {
                //首先获取next节点
                ListNode next = temp.next;
                //然后将temp节点的next域指向pNode的next域,即指向null
                temp.next = pNode.next;
                //接着将pNode的next域指向temp
                pNode.next = temp;
                //最后分别将temp，pNode指向向后移动一位
                temp = next;
                pNode = pNode.next;
            }else {
                //否则我们说此时的temp存在重复值，此时temp指向最后一个重复值，我们直接跳过该重复项
                temp = temp.next;
            }
        }
        //最后返回newHead的next域，即为删除重复项的新的链表的头节点
        return newHead.next;

    }
}
```

## 合并两个链表：

### 问题：

输入两个递增排序的链表，合并这两个链表并使新链表中的节点仍然是递增排序的。

**示例1：**

```
输入：1->2->4, 1->3->4
输出：1->1->2->3->4->4
```

**限制：**

```
0 <= 链表长度 <= 1000
```

### 代码：

```java
class Solution {
   //利用递归回溯法进行问题的求解
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        //传入两个链表的两个头结点l1和l2  
        if (l1 == null) {
            return l2;
        }else if (l2 == null) {
            return l1;
        }else if (l1.val < l2.val) {
            l1.next = mergeTwoLists(l1.next,l2);
            return l1;
        }else  {//if (l1.val >= l2.val)
            l2.next = mergeTwoLists(l1,l2.next);
            return l2;
        }
    }
```

## 合并多个链表：

### 问题：

给你一个链表数组，每个链表都已经按升序排列。

请你将所有链表合并到一个升序链表中，返回合并后的链表。

**示例 1：**

```
输入：lists = [[1,4,5],[1,3,4],[2,6]]
输出：[1,1,2,3,4,4,5,6]
解释：链表数组如下：
[
  1->4->5,
  1->3->4,
  2->6
]
将它们合并到一个有序链表中得到。
1->1->2->3->4->4->5->6
```

**示例 2：**

```
输入：lists = []
输出：[]
```

**示例 3：**

```
输入：lists = [[]]
输出：[]
```

**提示：**

- `k == lists.length`
- `0 <= k <= 10^4`
- `0 <= lists[i].length <= 500`
- `-10^4 <= lists[i][j] <= 10^4`
- `lists[i]` 按 **升序** 排列
- `lists[i].length` 的总和不超过 `10^4`

![](/img/algorithm/common/linkedlist/合并多个链表.jpg)

### 代码：

```java
//使用归并算法求解
public ListNode mergeKLists(ListNode[] lists) {
    //获取链表集合的头部和尾部
    int start = 0;
    int end = lists.length - 1;
    return merge(lists,start,end);
}

private ListNode merge(ListNode[] lists, int start, int end) {
    if (start == end) {
        return lists[start];
    }
    if (start > end) {
        return null;
    }
    //获取中值
    int mid = (start + end) >> 1;
    return mergeTwoList(merge(lists,start,mid),merge(lists,mid + 1,end));
}

private ListNode mergeTwoList(ListNode a, ListNode b) {
    if (a == null || b == null) {
        return a != null ? a : b;
    }
    //定义两个辅助变量aNode,bNode
    ListNode aNode = a;
    ListNode bNode = b;
    //定义一个头节点head以及辅助变量temp指向head
    ListNode head = new ListNode(0);
    ListNode temp = head;
    while (aNode != null && bNode != null) {
        if(aNode.val < bNode.val) {
            temp.next = aNode;
            aNode = aNode.next;
        }else {
            temp.next = bNode;
            bNode = bNode.next;
        }
        temp = temp.next;
    }
    temp.next = (aNode != null ? aNode : bNode);
    return head.next;
}
```

## 环形链表问题：

### 问题描述:

这道题有两个问题,一个是判断一个链表是否存在环?还有一个是要求找到链表中环的入口节点?

我们分别来看一下这两个问题:

给定一个链表，返回链表开始入环的第一个节点。 如果链表无环，则返回 `null`。

为了表示给定链表中的环，我们使用整数 `pos` 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 `pos` 是 `-1`，则在该链表中没有环。**注意，pos 仅仅是用于标识环的情况，并不会作为参数传递到函数中。**

**说明：**不允许修改给定的链表。

**进阶：**

- 你是否可以使用 `O(1)` 空间解决此题？



**示例 1：**

![img](/img/algorithm/common/linkedlist/环形链表1.png)

```
输入：head = [3,2,0,-4], pos = 1
输出：返回索引为 1 的链表节点
解释：链表中有一个环，其尾部连接到第二个节点。
```

**示例 2：**

![img](/img/algorithm/common/linkedlist/环形链表2.png)

```
输入：head = [1,2], pos = 0
输出：返回索引为 0 的链表节点
解释：链表中有一个环，其尾部连接到第一个节点。
```

**示例 3：**

![img](/img/algorithm/common/linkedlist/环形链表3.png)

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

![](/img/algorithm/common/linkedlist/环形链表4.png)

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

![t-22-1](/img/algorithm/common/linkedlist/环形链表5.png)

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

## 逆序打印链表问题：

### 问题：

逆序打印一个单向链表

### 代码：

```java
class Solution {
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
            temp = temp.next;
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
}
```

## 重排链表问题：

### 问题：

给定一个单链表 *L*：*L*0→*L*1→…→*Ln*-1→*L*n ，
将其重新排列后变为： *L*0→*Ln*→*L*1→*Ln*-1→*L*2→*Ln*-2→…

你不能只是单纯的改变节点内部的值，而是需要实际的进行节点交换。

**示例 1:**

```
给定链表 1->2->3->4, 重新排列为 1->4->2->3.
```

**示例 2:**

```
给定链表 1->2->3->4->5, 重新排列为 1->5->2->4->3.
```

### 代码：

```java
class Solution {
    public void reorderList(ListNode head) {
        //如果头结点为null或者只有一个结点,直接返回
        if (head == null || head.next == null) return;
        //定义一个LinkedList:保存链表的所有结点
        LinkedList<ListNode> list = new LinkedList<>();
        //定义一个辅助指针变量temp指向头结点
        ListNode temp = head;
        //将链表的所有结点加入到LinkedList中
        while (true) {
            list.add(temp);
            if (temp.next == null) {
                break;
            }
            temp = temp.next;
        }
        //定义左指针left:指向头结点
        //定义右指针right:获取list的最后一个元素(即获取尾结点)
        ListNode left = head;
        ListNode right = list.removeLast();
        while (true) {
            //1.当遍历到left == right(结点的个数为奇数个时:直接将右结点的next置为null即可)
            //2.当遍历到left.next == right(结点的个数为偶数个时:直接将右结点的next域置为null即可)
            if (left == right || left.next == right) {
                right.next = null;
                break;
            }
            //记录左结点的值
            ListNode next = left.next;
            right.next = next;
            left.next = right;
            //更新left和right指针的值
            left = next;
            right = list.removeLast();
        }
        return;
    }
}
```

## 旋转链表问题：

### 问题：

给你一个链表的头节点 `head` ，旋转链表，将链表每个节点向右移动 `k` 个位置。

 

**示例 1：**

![img](/img/algorithm/common/linkedlist/旋转链表1.jpg)

```
输入：head = [1,2,3,4,5], k = 2
输出：[4,5,1,2,3]
```

**示例 2：**

![img](/img/algorithm/common/linkedlist/旋转链表2.jpg)

```
输入：head = [0,1,2], k = 4
输出：[2,0,1]
```

**提示：**

- 链表中节点的数目在范围 `[0, 500]` 内
- `-100 <= Node.val <= 100`
- `0 <= k <= 2 * 109`

### 代码：

```java
class Solution {
    public ListNode rotateRight(ListNode head, int k) {
        //如果该链表为空
        if(head == null) return head;
        //获取链表的长度和原始的尾节点temp
        int size = 1;
        ListNode temp = head;
        while(temp.next != null) {
            size++;
            temp = temp.next;
        } 
        //获取实际向后移动的步数
        int steps = k % size;
        //如果 steps = 0,说明没有平移
        if(steps == 0) return head;
        //否则我们的策略是先找到平移以后的链表的尾部节点和头部节点
        ListNode last = head;
        int time = size - steps - 1;
        while(time > 0) {
            last = last.next;
            time--;
        }
        //此时last指针指向旋转后的尾部节点
        //则旋转后的头部节点即为last的next域
        ListNode newHead = last.next;   
        //我们已经知道找到原始链表的尾部节点temp，让temp.next = head;last.next = null；最后返回newHead即可
        temp.next = head;
        last.next = null;
        return newHead;
    }
}
```

## 复制带有随机指针的链表问题：

### 问题:

请实现 `copyRandomList` 函数，复制一个复杂链表。在复杂链表中，每个节点除了有一个 `next` 指针指向下一个节点，还有一个 `random` 指针指向链表中的任意节点或者 `null`。

 

**示例 1：**

![img](/img/algorithm/common/linkedlist/复制链表1.png)

```
输入：head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
输出：[[7,null],[13,0],[11,4],[10,2],[1,0]]
```

**示例 2：**

![img](/img/algorithm/common/linkedlist/复制链表2.png)

```
输入：head = [[1,1],[2,1]]
输出：[[1,1],[2,1]]
```

**示例 3：**

**![img](/img/algorithm/common/linkedlist/复制链表3.png)**

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

![](/img/algorithm/common/linkedlist/复制链表4.png)

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

## 回文链表问题：

### 问题：

请判断一个链表是否为回文链表。

**示例 1:**

```
输入: 1->2
输出: false
```

**示例 2:**

```
输入: 1->2->2->1
输出: true
```

### 代码：

```java
class Solution {
     //双指针法
    public boolean isPalindrome(ListNode head) {
        if(head == null || head.next == null)
            return true;
        List<Integer> list = new ArrayList<>();
        ListNode temp = head;
        while (temp != null) {
            list.add(temp.val);
            temp = temp.next;
        }
        int left = 0;
        int right = list.size() - 1;
        while (left < right) {
            if (list.get(left) == list.get(right)) {
                left++;
                right--;
            }else {
                return false;
            }
        }
        return true;
    }
}
```

## 分隔链表问题：

### 问题：

给你一个链表的头节点 `head` 和一个特定值 `x` ，请你对链表进行分隔，使得所有 **小于** `x` 的节点都出现在 **大于或等于** `x` 的节点之前。

你应当 **保留** 两个分区中每个节点的初始相对位置。

**示例 1：**

![img](/img/algorithm/common/linkedlist/分隔链表.jpg)

```
输入：head = [1,4,3,2,5,2], x = 3
输出：[1,2,2,4,3,5]
```

**示例 2：**

```
输入：head = [2,1], x = 2
输出：[1,2]
```

**提示：**

- 链表中节点的数目在范围 `[0, 200]` 内
- `-100 <= Node.val <= 100`
- `-200 <= x <= 200`

### 代码：

```java
class Solution {
    public ListNode partition(ListNode head, int x) {
        if(head == null || head.next == null) return head;
        ListNode beforeHead = new ListNode(0);
        ListNode before = beforeHead;
        ListNode afterHead = new ListNode(0);
        ListNode after = afterHead;
        ListNode temp = head;
        while(temp != null) {
            if(temp.val < x) {
                before.next = temp;
                before = before.next;
            }else {
                after.next = temp;
                after = after.next;
            }
            temp = temp.next;
        }
        //此时我们将before和after链表进行连接
        after.next = null;
        before.next = afterHead.next;
        return beforeHead.next;
    }
}
```

## 两两交换链表中的节点问题

### 问题：

https://leetcode-cn.com/problems/swap-nodes-in-pairs/

给定一个链表，两两交换其中相邻的节点，并返回交换后的链表。

**你不能只是单纯的改变节点内部的值**，而是需要实际的进行节点交换。

**示例 1：**

![img](/img/algorithm/common/linkedlist/两两交换链表的节点.jpg)

```
输入：head = [1,2,3,4]
输出：[2,1,4,3]
```

**示例 2：**

```
输入：head = []
输出：[]
```

**示例 3：**

```
输入：head = [1]
输出：[1] 
```

**提示：**

- 链表中节点的数目在范围 `[0, 100]` 内
- `0 <= Node.val <= 100`

**进阶：**你能在不修改链表节点值的情况下解决这个问题吗?（也就是说，仅修改节点本身。）

### 代码：

```java
class Solution {
    public ListNode swapPairs(ListNode head) {
        if (head == null || head.next == null) return head;
        //定义一个前置节点
        ListNode pre = new ListNode(0);
        //将该前置节点的next域指向head节点
        pre.next = head;
        //定义一个临时辅助节点temp，指向pre
        ListNode temp = pre;
        //进行while循环:temp的next域不为null并且temp的next的next域不为null，表示temp后面至少存在两个节点
        while (temp.next != null && temp.next.next != null) {
            //首先获取temp的next域为当前节点cur
            ListNode cur = temp.next;
            //然后获取cur的下一个节点next
            ListNode next = temp.next.next;
            //1.将temp的next域指向next节点
            temp.next = next;
            //2.cur的next域指向next的next域
            cur.next = next.next;
            //3.next的next域指向cur当前节点
            next.next = cur;
            //4.修改temp节点的值为当前节点cur
            temp = cur;
        }
        //返回pre的next
        return pre.next;
    }
}
```

## K 个一组翻转链表问题

### 问题：

https://leetcode-cn.com/problems/reverse-nodes-in-k-group/

给你一个链表，每 *k* 个节点一组进行翻转，请你返回翻转后的链表。

*k* 是一个正整数，它的值小于或等于链表的长度。

如果节点总数不是 *k* 的整数倍，那么请将最后剩余的节点保持原有顺序。

**进阶：**

- 你可以设计一个只使用常数额外空间的算法来解决此问题吗？
- **你不能只是单纯的改变节点内部的值**，而是需要实际进行节点交换。

 

**示例 1：**

![img](/img/algorithm/common/linkedlist/25-1.jpg)

```
输入：head = [1,2,3,4,5], k = 2
输出：[2,1,4,3,5]
```

**示例 2：**

![img](/img/algorithm/common/linkedlist/25-2.jpg)

```
输入：head = [1,2,3,4,5], k = 3
输出：[3,2,1,4,5]
```

**示例 3：**

```
输入：head = [1,2,3,4,5], k = 1
输出：[1,2,3,4,5]
```

**示例 4：**

```
输入：head = [1], k = 1
输出：[1]
```

**提示：**

- 列表中节点的数量在范围 `sz` 内
- `1 <= sz <= 5000`
- `0 <= Node.val <= 1000`
- `1 <= k <= sz`

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        //定义一个新的头结点
        ListNode newHead = new ListNode(0);
        newHead.next = head;
        ListNode pre = newHead;
        
        while (head != null) {
            //定义一个辅助指针指向pre节点
            ListNode tail = pre;
            //我们查看剩余部分的长度是否大于等于k
            for (int i = 0; i < k; i++) {
                tail = tail.next;
                if (tail == null) {
                    //说明剩余长度小于k,我们选择直接返回
                    return newHead.next;
                }
            }
            //如果存在k个节点,可以进行翻转
            ListNode next = tail.next; //指向翻转以后的下一个节点
            //我们翻转此时的k个节点[head,tail]
            //返回的结果为翻转以后的第一个头结点为尾节点
            ListNode[] reverse = reverse(head,tail);
            //获取此时翻转以后的头节点和尾节点
            head = reverse[0];
            tail = reverse[1];
            //把子链表重新接回原链表
            pre.next = head;
            tail.next = next;
            //更新此时的pre节点和head节点
            pre = tail;
            head = next;
        }
        return newHead.next;
    }

    //知道链表的头结点和尾结点的反转链表方法
    private ListNode[] reverse(ListNode head, ListNode tail) {
        ListNode prev = tail.next;
        ListNode temp = head;
        while (prev != tail) {
            //获取next节点
            ListNode next = temp.next;
            temp.next = prev;
            prev = temp;
            temp = next;
        }
        return new ListNode[]{tail,head};
    }
}
```

