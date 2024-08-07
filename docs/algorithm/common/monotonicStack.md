---
title: 单调栈算法
---

# 单调栈使用模板

```java
stack<int> st;
//此处一般需要给数组最后添加结束标志符，具体下面例题会有详细讲解
for (遍历这个数组){
    if (栈空 || 栈顶元素大于等于当前比较元素){
        入栈;
    }else{
        while (栈不为空 && 栈顶元素小于当前元素){
            栈顶元素出栈;
            更新结果;
        }
        入栈;
    }
}

或者简化为:
//此处一般需要给数组最后添加结束标志符，具体下面例题会有详细讲解
for (遍历这个数组){
    while (栈不为空 && 栈顶元素小于当前元素){  //这里栈为单调不减
        栈顶元素出栈;
        更新结果;
    }
    入栈;
}
```

# 单调栈问题汇总

## 剑指 Offer 30. 包含min函数的栈

https://leetcode-cn.com/problems/bao-han-minhan-shu-de-zhan-lcof/

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

使用**单调栈**实现：`其中B栈单调不增`

```java
public class MinStack {

    Stack<Integer> A,B;
    public MinStack() {
        A = new Stack<>();  //用于进行栈元素的push和pop
        B = new Stack<>();  //栈顶到栈底从小到大排列存储已经push的元素
    }

    public void push(int x) {
        A.push(x);   //首先将x入栈A
        if (B.isEmpty() || B.peek() >= x) {
            //如果栈B为空或者栈顶的元素小于等于x的值
            B.push(x);
        }
    }

    public void pop() {
        if (A.pop().equals(B.peek())) {
            //如果A的栈顶元素和B的栈顶元素相等，则在栈A出栈的同时，B也需要出栈操作
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

## 42. 接雨水

https://leetcode-cn.com/problems/trapping-rain-water/

给定 *n* 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。

 

**示例 1：**

![img](/img/algorithm/common/rainwatertrap.png)

```
输入：height = [0,1,0,2,1,0,1,3,2,1,2,1]
输出：6
解释：上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。 
```

**示例 2：**

```
输入：height = [4,2,0,3,2,5]
输出：9
```

**提示：**

- `n == height.length`
- `0 <= n <= 3 * 104`
- `0 <= height[i] <= 105`

### 题解：使用单调栈进行求解

```java
public class Trap {
    public static void main(String[] args) {
        int[] height = {0,1,0,2,1,0,1,3,2,1,2,1};
        Trap trap = new Trap();
        int res = trap.trap(height);
        System.out.println(res);
    }

    public int trap(int[] height) {
        int n = height.length;
        //定义一个单调栈：存储的数组的下标，使得下标对应的值单调递增
        Stack<Integer> stack = new Stack<>();
        int res = 0;
        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && height[stack.peek()] < height[i]) {  //如果此时当前下标高度大于栈顶下标的高度
                int top = stack.pop();
                if (stack.isEmpty()) break;
                int left = stack.peek();
                int width = i - left - 1;
                int high = Math.min(height[left],height[i]) - height[top];
                res += high * width;
            }
            stack.push(i);
        }
        return res;
    }

    public int trap02(int[] height) {
        int n = height.length;
        //定义一个单调栈：存储的数组的下标，使得下标对应的值单调递增
        Stack<Integer> stack = new Stack<>();
        int res = 0;
        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && height[stack.peek()] < height[i]) {  //如果此时当前下标高度大于栈顶下标的高度
                stack.pop();
                if(!stack.isEmpty()){
                    int left = stack.peek();
                    int min = Math.min(height[left],height[i]);
                    for (int j = left + 1; j < i; j++) {
                        res += min - height[j];
                        //将当前高度填充为min值
                        height[j] = min;
                    }
                }
            }
            stack.push(i);
        }
        return res;
    }
}
```

## 496. 下一个更大元素 I

https://leetcode-cn.com/problems/next-greater-element-i/

给你两个 **没有重复元素** 的数组 `nums1` 和 `nums2` ，其中`nums1` 是 `nums2` 的子集。

请你找出 `nums1` 中每个元素在 `nums2` 中的下一个比其大的值。

`nums1` 中数字 `x` 的下一个更大元素是指 `x` 在 `nums2` 中对应位置的右边的第一个比 `x` 大的元素。如果不存在，对应位置输出 `-1` 。

**示例 1:**

```
输入: nums1 = [4,1,2], nums2 = [1,3,4,2].
输出: [-1,3,-1]
解释:
    对于 num1 中的数字 4 ，你无法在第二个数组中找到下一个更大的数字，因此输出 -1 。
    对于 num1 中的数字 1 ，第二个数组中数字1右边的下一个较大数字是 3 。
    对于 num1 中的数字 2 ，第二个数组中没有下一个更大的数字，因此输出 -1 。
```

**示例 2:**

```
输入: nums1 = [2,4], nums2 = [1,2,3,4].
输出: [3,-1]
解释:
    对于 num1 中的数字 2 ，第二个数组中的下一个较大数字是 3 。
    对于 num1 中的数字 4 ，第二个数组中没有下一个更大的数字，因此输出 -1 。
```

**提示：**

- `1 <= nums1.length <= nums2.length <= 1000`
- `0 <= nums1[i], nums2[i] <= 104`
- `nums1`和`nums2`中所有整数 **互不相同**
- `nums1` 中的所有整数同样出现在 `nums2` 中

**进阶：**你可以设计一个时间复杂度为 `O(nums1.length + nums2.length)` 的解决方案吗？

### 题解：

我们使用单调栈进行求解，因为题目要求我们求出`nums1`数组中每一个元素在`nums2` 中的下一个比其大的值，并且每一个元素不会重复出现：

我们选择遍历nums2数组：

* 如果栈不为空，并且栈顶的元素小于当前遍历准备入栈的元素，则我们选择将栈顶元素出栈，并以其为key，而当前元素即为value值，即是该栈顶元素的第一个大的值
* 如果栈为空，且栈顶元素不大于等于当前遍历准备入栈的元素，则我们直接将该元素入栈即可...

```java
public class NextGreaterElement {
    public int[] nextGreaterElement(int[] nums1, int[] nums2) {
        int m = nums1.length;
        int n = nums2.length;
        int[] res = new int[m];
        //定义一个单调栈
        Stack<Integer> stack = new Stack<>();
        Map<Integer,Integer> map = new HashMap<>();
        for (int i = 0; i < n; i++) {
            //获取当前遍历的值
            int val = nums2[i];
            //单调栈不为空 && 栈顶元素 < 当前元素的值
            while (!stack.isEmpty() && stack.peek() < val) {
                //栈顶元素出栈，并且<栈顶元素，当前元素>为键值对放入到map中
                map.put(stack.pop(),val);
            }
            //将当前元素入栈操作
            stack.push(val);
        }
        for (int i = 0; i < m; i++) {
            if (map.containsKey(nums1[i])) {
                res[i] = map.get(nums1[i]);
            }else {
                res[i] = -1;
            }
        }
        return res;

    }
}
```

## 503. 下一个更大元素 II

https://leetcode-cn.com/problems/next-greater-element-ii/

给定一个循环数组（最后一个元素的下一个元素是数组的第一个元素），输出每个元素的下一个更大元素。数字 x 的下一个更大的元素是按数组遍历顺序，这个数字之后的第一个比它更大的数，这意味着你应该循环地搜索它的下一个更大的数。如果不存在，则输出 -1。

**示例 1:**

```
输入: [1,2,1]
输出: [2,-1,2]
解释: 第一个 1 的下一个更大的数是 2；
数字 2 找不到下一个更大的数； 
第二个 1 的下一个最大的数需要循环搜索，结果也是 2。
```

**注意:** 输入数组的长度不会超过 10000。

### 题解：

```java
 public int[] nextGreaterElements(int[] nums) {
     Stack<Integer> stack = new Stack<>();   //定义一个单调栈，栈顶到栈底单调递增
     int n = nums.length;
     int[] res = new int[n];
     Arrays.fill(res,-1);
     //最后一个元素n - 1 + (n - 1) = 2n - 2
     for (int i = 0; i < 2 * n - 1; i++) {
         //每一个元素为i % n
         while (!stack.isEmpty() && nums[stack.peek()] < nums[i % n]) {
             res[stack.pop()] = nums[i % n];
         }
         stack.push(i % n);
     }
     return res;
 }
```

