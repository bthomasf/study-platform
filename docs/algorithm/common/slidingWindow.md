---
title: 滑动窗口算法
---

## 导言篇

#### 什么是滑动窗口？

其实就是一个队列,比如例题中的 abcabcbb，进入这个队列（窗口）为 abc 满足题目要求，当再进入 a，队列变成了 abca，这时候不满足要求。所以，我们要移动这个队列！

**如何移动？**

我们只要把队列的左边的元素移出就行了，直到满足题目要求！

一直维持这样的队列，找出队列出现最长的长度时候，求出解！

时间复杂度：O(n)

#### 什么场景下使用滑动窗口？

答：如果我们找到了一个满足要求的区间，并且当区间的右边界再向右扩张已没有意义，此时可以移动左边界到达不满足要求的位置。再移动右边界，持续如此，直到区间的右边界到达整体的结束点。

#### 滑动窗口通用模板:

```java
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
    }
    //最后返回结果集:由于上面的right指针最后多++了一次,这里返回right - left
    return right - left;   
}

//转换成javaScript代码:
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
    }
    //最后返回结果集:由于上面的right指针最后多++了一次,这里返回right - left
    return right - left;
};
```

## 第一篇: 题解分析篇

## 题目:

### 1 无重复字符的最长子串问题 : 对应LeetCode的第3题

给定一个字符串，请你找出其中不含有重复字符的 **最长子串** 的长度。

**示例 1:**

```java
输入: s = "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```

**示例 2:**

```java
输入: s = "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
```

**示例 3:**

```java
输入: s = "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
```

**示例 4:**

```java
输入: s = ""
输出: 0
```

**提示：**

- `0 <= s.length <= 5 * 104`
- `s` 由英文字母、数字、符号和空格组成

### 2 串联所有单词的子串 : 对应LeetCode的第30题

给定一个字符串 **s** 和一些长度相同的单词 **words。**找出 **s** 中恰好可以由 **words** 中所有单词串联形成的子串的起始位置。

注意子串要与 **words** 中的单词完全匹配，中间不能有其他字符，但不需要考虑 **words** 中单词串联的顺序。

**示例 1：**

```java
输入：
  s = "barfoothefoobarman",
  words = ["foo","bar"]
输出：[0,9]
解释：
从索引 0 和 9 开始的子串分别是 "barfoo" 和 "foobar" 。
输出的顺序不重要, [9,0] 也是有效答案。
```

**示例 2：**

```java
输入：
  s = "wordgoodgoodgoodbestword",
  words = ["word","good","best","word"]
输出：[]
```

### 3  最小覆盖子串 : 对应LeetCode的第76题

给你一个字符串 `s` 、一个字符串 `t` 。返回 `s` 中涵盖 `t` 所有字符的最小子串。如果 `s` 中不存在涵盖 `t` 所有字符的子串，则返回空字符串 `""` 。

**注意：**如果 `s` 中存在这样的子串，我们保证它是唯一的答案。

**示例 1：**

```java
输入：s = "ADOBECODEBANC", t = "ABC"
输出："BANC"
```

**示例 2：**

```java
输入：s = "a", t = "a"
输出："a"
```

**提示：**

- `1 <= s.length, t.length <= 105`
- `s` 和 `t` 由英文字母组成

进阶：你能设计一个在 `o(n)` 时间内解决此问题的算法吗？

### 4 给定一个字符串 s ，找出至多含两个不同字符的最长子串 t :对应LeetCode的第159题

**示例 1:**

```java
输入: "eceba"
输出: 3
解释: t 是 "ece"，长度为3。
```

**示例 2:**

```java
输入: "ccaabbb"
输出: 5
解释: t 是 "aabbb"，长度为5。
```

### 5 给定一个字符串 s ，找出 至多 包含 k 个不同字符的最长子串 t :对应LeetCode的第340题

**示例 1:**

```java
输入: s = "eceba", k = 2
输出: 3
解释: 则 t 为 "ece"，所以长度为 3。
```

**示例 2:**

```java
输入: s = "aa", k = 1
输出: 2
解释: 则 t 为 "aa"，所以长度为 2。
```

### 6 数组中的最长的山脉 : 对应LeetCode的第845题

我们把数组 A 中符合下列属性的任意连续子数组 B 称为 “*山脉”*：

- `B.length >= 3`
- 存在 `0 < i < B.length - 1` 使得 `B[0] < B[1] < ... B[i-1] < B[i] > B[i+1] > ... > B[B.length - 1]`

（注意：B 可以是 A 的任意子数组，包括整个数组 A。）

给出一个整数数组 `A`，返回最长 *“山脉”* 的长度。

如果不含有 “*山脉”* 则返回 `0`。

**示例 1：**

```java
输入：[2,1,4,7,3,2,5]
输出：5
解释：最长的 “山脉” 是 [1,4,7,3,2]，长度为 5。
```

**示例 2：**

```java
输入：[2,2,2]
输出：0
解释：不含 “山脉”。 
```

**提示：**

1. `0 <= A.length <= 10000`
2. `0 <= A[i] <= 10000`

##  解析:

### 第一题 : 无重复字符的最长子串问题,这是LeetCode的第三题,想必你一定已经做完了...

#### 问题分析:

![](/img/algorithm/common/slidingWindow/1.png)

#### 图解分析:

![](/img/algorithm/common/slidingWindow/2.png)

![](/img/algorithm/common/slidingWindow/3.png)

#### 代码实现:

```java
public int lengthOfLongestSubstring(String s) {
    //定义s字符串的长度为n
    int n = s.length();
    //如果n <= 1,则max即为字符串本身的长度,直接返回n
    if(n <= 1) {
        return n;
    }
    //我们定义maxLength为最大不重复子串的长度
    int maxLength = 0;
    //定义一个HashMap:其中key为s中的字符,value为不断更新的索引
    HashMap<Character,Integer> map = new HashMap<>();
    //定义滑动窗口的左指针变量left,初始值为0
    int left = 0;
    for(int i = 0; i < n;i++) {
        if(map.containsKey(s.charAt(i))) {
            //如果当前key值[字符存在与map中]
            //我们需要更新left指针:取之前的left指针和之前出现的该字符的指针向右平移一位的最大值
            left = Math.max(left,map.get(s.charAt(i) + 1));
        }
        //如果不存在,则将该键值添加至map集合中
        map.put(s.charAt(i),i);
        maxLength = Math.max(maxLength,i - left + 1);
    }
    //最后返回最大值maxLength即为题解
    return maxLength;
}
```

### 第二题: 使用HashMap方法 + 滑动窗口方法进行求解[PS:写出来我自己都不是很明白,你看完给我讲讲...]

这里我们着重介绍滑动窗口的方法:

1 因为单词的长度[我们定义为one_word]是固定的，所以可以将一个单词看成一个单元
2 对单词使用滑动窗口，单元间的步长就是 one_word
3 在 0 - one_word 的范围内，每一个都作为滑动窗口的起点，滑动 word_num次，即可覆盖所有字符串的各种组合

#### 图解:

 我们以 s = "barfoothefoobarman", words = ["foo","bar"]为例进行图解分析

![](/img/algorithm/common/slidingWindow/4.png)

![](/img/algorithm/common/slidingWindow/5.png)

#### 代码实现:

```java
//使用滑动窗口算法进行该题的求解
public List<Integer> findSubstring(String s, String[] words) {
    //我们定义返回的结果集res
    List<Integer> res = new ArrayList<>();
    if (s == null || s.length() == 0 || words == null || words.length == 0) return res;
    //定义一个Map集合:用来存储words中的每一个单词以及该单词出现的次数
    HashMap<String,Integer> map = new HashMap<>();
    //由于words中每一个单词的长度是固定的,故我们定义one_word为words数组中单词元素的长度
    int one_word = words[0].length();
    //获取words数组的长度
    int word_num = words.length;
    //定义all_len为words的总长度
    int all_len = one_word * word_num;
    for (String word : words) {
        map.put(word,map.getOrDefault(word,0) + 1);
    }
	//遍历[0,one_word]
    for (int i = 0; i < one_word; i++) {
        //定义两个指针left,right :表示左右窗口的索引值
        int left = i;
        int right = i;
        //定义count计数器,初始值为0
        int count = 0;
        //定义tmap : 用来统计满足条件的word单词
        HashMap<String,Integer> tmap = new HashMap<>();
        //当右窗口的索引没有超过s字符串的长度
        while (right + one_word <= s.length()) {
            //我们按照one_word的长度选择一个窗口
            String window = s.substring(right,right + one_word);
            //将其加入到tmap中
            tmap.put(window,tmap.getOrDefault(window,0) + 1);
            //同时将右窗口的索引值向后平移one_word个单位
            right = right + one_word;
            //将count计数器加1
            count++;
            //如果该窗口window的数量大于了map集合中window的数量,例如"bar","foo",但是此时为"barfoobar"等
            while (tmap.getOrDefault(window,0) > map.getOrDefault(window,0)) {
                //我们需要将左窗口进行右移:获取one_word长度的窗口
                String window2 = s.substring(left,left + one_word);
                //并将count计数器的数量减1
                count--;
                //同时将tmp中该窗口windows的数量减1
                tmap.put(window2,tmap.getOrDefault(window2,0) - 1);
                //再将left指针右移one_word个单位
                left = left + one_word;
            }
            //如果此时count的个数 == word_num,即words数组的长度,则说明此时left索引位置为一种结果集情况,直接将其加入res中
            if (count == word_num) res.add(left);
        }
    }
    return res;
}


//另一种方法实现
//使用map求解
public List<Integer> findSubstring02(String s, String[] words) {
    //定义结果集
    List<Integer> res = new ArrayList<>();
    int n = words.length;
    if (n == 0) return res;

    int len = words[0].length(); //获取每一个单词的长度(长度相等)
    //map:存储words数组的单词以及其出现的次数
    Map<String,Integer> map = new HashMap<>();
    for (int i = 0; i < n; i++) {
        map.put(words[i],map.getOrDefault(words[i],0) + 1);
    }

    //记录words中单词的总长度
    int words_len = len * n;
    for (int i = 0; i < s.length() - words_len + 1; i++) {
        //定义一个map : 记录当前扫描的字符串含有的单词以及其出现的次数
        Map<String,Integer> hasWords = new HashMap<>();
        int number = 0;  //记录单词出现的次数
        while (number < n) {
            //获取当前当前
            String word = s.substring(i + number * len,i + (number + 1) * len);
            //判断map中是否存在该word的key
            if (map.containsKey(word)) {
                hasWords.put(word,hasWords.getOrDefault(word,0) + 1);
                //比较此时两个map中当前单词出现次数的大小,如果hasWords中该key的value值大于了map中的value值,说明不匹配,直接退出
                if (hasWords.get(word) > map.get(word)) {
                    break;
                }
            }else {
                //不包含该word的key
                break;
            }
            number++;
        }
        //退出,判断number的个数是否等于n
        if (number == n) {
            res.add(i);
        }
    }

    return res;

}
```

### 第三题: 最小覆盖子串问题

#### 思路分析:

新建一个cArr[128]用来统计t中每个字符出现次数，

新建一个window[128]用来统计滑动窗口中每个字符出现次数。

首先统计出T中每个字母出现的次数.

新建两个变量left和right分别用来表示滑动窗口的左边和右边。

新建一个变量count来表示目前窗口中已经找到了多少个字符。

以S= "ADOBECODEBANC", T = "ABC"为例，然后按照如图所示的规律滑动窗口。

![](/img/algorithm/common/slidingWindow/6.png)

下面是一组动态演示s = "ABAACBAB",t = "ABC"

![](/img/algorithm/common/slidingWindow/76_fig1.gif)

#### 代码实现:

```java
//使用滑动窗口方法进行求解
public String minWindow(String s, String t) {
    //分别获取s的长度和t的长度
    int n = s.length();
    int m = t.length();
    //如果s,t为null或者为空字符串,或者s字符串的长度小于t字符串的长度,都直接返回""
    if (n < m || s == null || s == "" || t == "" || t == null) return "";
    //记录t字符串中每一个字符出现的次数,因为ASCII码中的字符总数为128个,索引该数组的长度最大为128
    int[] cArr = new int[128];
    //再定义window数组:记录滑动窗口每一个字符出现的次数
    int[] window = new int[128];
    for (int i = 0; i < m; i++) {
        //char类型 在java中会自动转换成int类型 字符的int值范围 0 ~ 127
        cArr[t.charAt(i)]++;
    }
    //定义两个指针变量left,right,初始化值均为0
    int left = 0;
    int right = 0;
    String res = "";
    //定义一个计数器,记录当前窗口,包含t字符串的字符的数量
    int count = 0;
    //定义minWindow : 记录满足要求的最短窗口需要的字符的长度
    int minWindow = s.length() + 1;
    while (right < s.length()) {
        //获取当前s字符串中right索引对应的值
        char ch = s.charAt(right);
        //将滑动窗口中该字符的数量加1
        window[ch]++;
        if (cArr[ch] > 0 && cArr[ch] >= window[ch]) {
            count++;
        }
        //移动指针到不满足条件位置
        while (count == m) {
            ch = s.charAt(left);
            //如果ch字符是t字符串中的一个,则将count--,在下一轮循环时退出
            if (cArr[ch] > 0 && cArr[ch] == window[ch]) {
                count--;
            }
            //如果right - left + 1的长度小于minWindow的长度
            if (right - left + 1 < minWindow) {
                //更新minWindow的长度和结果集res
                minWindow = right - left + 1;
                res = s.substring(left,right + 1);
            }
            //选择ch以后,我们将window中ch字符的个数减1
            window[ch]--;
            //同时将left指针向右移动一位
            left++;
        }
        //如果count != t.length(m),则将right指针右移,继续判断
        right++;
    }
    return res;
}
```

### 第四题: 给定一个字符串 s ，找出 至多 包含 2 个不同字符的最长子串 t

#### 思路分析:

**以"ccaabbb"为例,图解如下**

![](/img/algorithm/common/slidingWindow/8.png)

#### 代码实现:

```java
public class FindLengthOfLongestSubstringTwoDistinct {
    public static void main(String[] args) {
        String s = "ccaabbb";
        FindLengthOfLongestSubstringTwoDistinct solution = new FindLengthOfLongestSubstringTwoDistinct();
        int length = solution.lengthOfLongestSubstringTwoDistinct(s);
        System.out.println("至多含有两个不同字符的最长子串t的长度 : " + length);
    }

    //使用滑动窗口 + HashMap求解该问题
    public int lengthOfLongestSubstringTwoDistinct(String s) {
        //获取s字符串的长度n
        int n = s.length();
        if (n <= 2) {//如果n小于等于2,则直接返回n
            return n;
        }
        int length = 2;//最低的至多包含两个不同字符的最长子串t的长度为2
        //K是对应字符，V是最后一次出现的位置
        HashMap<Character,Integer> map = new HashMap<>();
        //定义左右指针left,right,初始指向s字符串0索引的位置
        int left = 0;
        int right = 0;
        //一般情况下,while指针的循环条件为right指针
        while (right < n) {
            //如果当前map集合的不同key,即不同字符的数量小于3,则可以继续向右扩张
            if (map.size() < 3) {
                map.put(s.charAt(right),right++);
            }
            //如果此时map中不同key,即不同字符的数量等于3
            if (map.size() == 3) {
                //我们获取此时当前map集合的存在字符的最低索引位置
                int index = Collections.min(map.values());
                //我们移除掉此时最低索引的那个值
                map.remove(s.charAt(index));
                //并将left指针更新值index + 1的位置
                left = index + 1;
            }
            //更新length(最长子串t的长度)
            length = Math.max(length,right - left);
        }
        //最后返回length的值
        return length;
    }
}
```

### 第五题: 给定一个字符串 s ，找出 至多 包含 k 个不同字符的最长子串 t 

#### 思路题解: 是不是信手拈来

### 第六题: 数组中的最长山脉问题

#### 思路分析:

```java
//滑动窗口方法进行解决
public int longestMountain(int[] A) {
    int len = A.length;
    //如果数组A的长度小3:则直接返回0
    if (A.length < 3) return 0;
    int longest = 0;
    for (int i = 0; i < len - 2; i++) {
        //找到初始的小山脉,即存在A[i] < A[i + 1] < A[i + 2]
        if (A[i] < A[i+1] && A[i+1] > A[i+2]) {
            //从i - 1的索引位置向左进行该山脉的延伸,并更新山脉的最长长度
            int j = i - 1;
            //定义初始化山脉长度为3
            int window = 3;
            //定义左指针left,指向A[i]
            int left = A[i];
            while (j >= 0 && A[j] < left) {//将窗口向左延伸
                left = A[j];
                j = j - 1;
                window = window + 1;
            }
            //从i + 3的索引位置向右进行该山脉的延伸,并更新山脉的最长长度
            j = i + 3;
            //定义右指针right指向A[i + 2]
            int right = A[i+2];
            while (j < len && A[j] < right) {//将窗口向右延伸
                right = A[j];
                j = j + 1;
                window = window + 1;
            }
            //进行此次窗口的左右滑动以后,更新此次最长山脉的长度
            longest = Math.max(longest,window);
        }
    }
    //返回最后的最长长度
    return longest;
}


//精简代码版本
public int longestMountain(int[] arr) {
    int res = 0;
    if (arr.length < 3) return res;
    int n = arr.length;
    for (int i = 1; i < n - 1; i++) {
        //剪枝操作
        if (arr[i - 1] >= arr[i] || arr[i] <= arr[i + 1]) continue;
        //以该点作为山脉的山顶，我们分别向左和向右进行山脉的查找
        int left = i;
        while (left > 0 && arr[left] > arr[left - 1]) {
            --left;
        }
        int right = i;
        while (right < n - 1 && arr[right] > arr[right + 1]) {
            ++right;
        }
        //更新此时的最长山脉的长度
        res = Math.max(res,right - left + 1);
    }
    return res;
}
```

## 第二篇: 实战篇

### Question1 : 424. 替换后的最长重复字符

给你一个仅由大写英文字母组成的字符串，你可以将任意位置上的字符替换成另外的字符，总共可最多替换 *k* 次。在执行上述操作后，找到包含重复字母的最长子串的长度。

**注意：**字符串长度 和 *k* 不会超过 104。

**示例 1：**

```java
输入：s = "ABAB", k = 2
输出：4
解释：用两个'A'替换为两个'B',反之亦然。
```

**示例 2：**

```java
输入：s = "AABABBA", k = 1
输出：4
解释：
将中间的一个'A'替换为'B',字符串变为 "AABBBBA"。
子串 "BBBB" 有最长重复字母, 答案为 4。
```

### 解析:

![](/img/algorithm/common/slidingWindow/424.png)

### 代码实现:

```java
public int characterReplacement(String s, int k) {
    //获取s字符串的长度
	int  n = s.length;
    //定义窗口的两个指针变量left,right,同时指向s字符串的索引为0的位置
    int left = 0,right = 0;
    //定义结果集window和当前窗口最长重复字符出现的次数
    int window = 0,int cnt = 0;
    //定义一个数组counts[26]:记录每一个字符出现的次数
    //进行while循环: 循环条件right < n
    while(right < n) {
        //将此时right索引的字符出现的次数加1
        counts[s.charAt(right) - 'a']++;
        //遍历counts数组,更新cnt的值
        for(int i = 0; i < 26; i++) {
            cnt = Math.max(cnt,counts[i]);
        }
        //判断此时窗口的大小 - 重复最长的字符的个数cnt 是否大于 可以替换的字符的长度K?
        //如果大于,则将窗口从left向后进行缩小
        if(right - left + 1 - cnt > k) {
            counts[s.charAt(i) - 'a']--;
            left++;
        }else {
            //否则我们我们更新此时满足要求的窗口的大小
            window = Math.max(window,right - left + 1);
        }
        //将right指针右移
        right++;
    }
    //返回结果集
    return window;
}

//另一种写法
public int characterReplacement(String s, int k) {
    int n = s.length();  //获取s字符串的长度
    int left = 0,right = 0;
    int[] counts = new int[26]; //记录当前窗口中每一个字符出现的次数
    int cnt = 0; //记录当前窗口中出现最多的字符的个数
    int res = 0; //记录结果，即最长子串的长度
    while (right < n) {
        counts[s.charAt(right) - 'A']++;
        //获取此时窗口中出现最多的字符的个数
        for (int i = 0; i < 26; i++) {
            cnt = Math.max(cnt,counts[i]);
        }
        while (right - left + 1 - cnt > k) {
            counts[s.charAt(left) - 'A']--;
            left++;
        }
        //此时更新res
        res = Math.max(res,right - left + 1);
    }
    return res;
}

//再优化
public int characterReplacement02(String s, int k) {
    int n = s.length();  //获取s字符串的长度
    int left = 0,right = 0;
    int[] counts = new int[26]; //记录当前窗口中每一个字符出现的次数
    int cnt = 0; //记录当前窗口中出现最多的字符的个数
    int res = 0; //记录结果，即最长子串的长度
    while (right < n) {
        counts[s.charAt(right) - 'A']++;
        //获取此时窗口中出现最多的字符的个数
        for (int i = 0; i < 26; i++) {
            cnt = Math.max(cnt,counts[i]);
        }
        if (right - left + 1 - cnt > k) {
            counts[s.charAt(left) - 'A']--;
            left++;
        }
        right++;
    }
    return right - left;
}
```

### Question2：480. 滑动窗口中位数

中位数是有序序列最中间的那个数。如果序列的长度是偶数，则没有最中间的数；此时中位数是最中间的两个数的平均数。

例如：

- `[2,3,4]`，中位数是 `3`
- `[2,3]`，中位数是 `(2 + 3) / 2 = 2.5`

给你一个数组 *nums*，有一个长度为 *k* 的窗口从最左端滑动到最右端。窗口中有 *k* 个数，每次窗口向右移动 *1* 位。你的任务是找出每次窗口移动后得到的新窗口中元素的中位数，并输出由它们组成的数组。 

**示例：**

给出 *nums* = `[1,3,-1,-3,5,3,6,7]`，以及 *k* = 3。

```
窗口位置                      中位数
---------------               -----
[1  3  -1] -3  5  3  6  7       1
 1 [3  -1  -3] 5  3  6  7      -1
 1  3 [-1  -3  5] 3  6  7      -1
 1  3  -1 [-3  5  3] 6  7       3
 1  3  -1  -3 [5  3  6] 7       5
 1  3  -1  -3  5 [3  6  7]      6
```

 因此，返回该滑动窗口的中位数数组 `[1,-1,-1,3,5,6]`

**提示：**

- 你可以假设 `k` 始终有效，即：`k` 始终小于等于输入的非空数组的元素个数。
- 与真实值误差在 `10 ^ -5` 以内的答案将被视作正确答案。

### 解析：

使用**滑动窗口**进行求解:

因为题目要求我们求解数组中依次顺序[从左到右]指定大小窗口的中位数的值,那么我们定义一个长度为k的window,通过依次移除左边界的元素,添加右边界的元素,来完成窗口的移动,每一次滑动,我们排序获取此时的中位数

### 代码:

```java
public double[] medianSlidingWindow(int[] nums, int k) {
    //获取nums数组的长度n
    int n = nums.length;
    //此时我们的结果集数组的长度为n - k + 1
    double[] ans = new double[n - k + 1];
    //如果此时k为奇数,则我们返回的是中间索引的值
    //如果此时k为偶数,则我们返回的是中间两个元素的平均值
    int flag = k % 2 == 0 ? 0 : 1;//flag为0表示为窗口为偶数个,flag为1表示奇数个
    int left = 0,right = k - 1;
    //定义一个窗口window : 使用集合List
    List<Integer> window = new ArrayList<>();
    for(int i = left; i < k; i++) {
        window.add(nums[i]);
    }
    //定义一个计数器index
    int index = 0;
    while(right < n) {
        if(right >= k) {
            window.add(nums[right]);
        }
        //对window进行排序
        Collections.sort(window);
        if (flag == 0) {
            //如果窗口的大小为偶数
            ans[index++] = window.get(k / 2 - 1) / 2.0 + window.get(k / 2) / 2.0;
        }else {
            //如果窗口的大小为奇数
            ans[index++] = window.get(k / 2);
        }
        window.remove(new Integer(nums[left++]));//去掉窗口的左边界的值,实现向右移动一位
        right++;
    }
    //退出while循环,返回结果集ans
    return ans;
}
```

### Question3 : 567.字符串的排列

给定两个字符串 **s1** 和 **s2**，写一个函数来判断 **s2** 是否包含 **s1** 的排列。

换句话说，第一个字符串的排列之一是第二个字符串的子串。

**示例 1：**

```
输入: s1 = "ab" s2 = "eidbaooo"
输出: True
解释: s2 包含 s1 的排列之一 ("ba").
```

**示例 2：**

```
输入: s1= "ab" s2 = "eidboaoo"
输出: False
```

 

**提示：**

- 输入的字符串只包含小写字母
- 两个字符串的长度都在 [1, 10,000] 之间

### 解析:

我们判断字符串s2是否包含s1的排列,等价于s1每一个字符出现的次数刚好在s2的一个连续的子序列每一个字符出现的次数:

那么我们可以定义一个freq数组: 记录字符串s1中每一个字符出现的次数

然后再定义一个nums数组: 更新记录s2字符串每一个字符出现的次数

同时定义cnt计数器: 记录当前窗口[s2的连续子串序列]包含字符的个数

起始索引left = right = 0,while循环条件: right < n

(1)  如果当前s2的right索引的字符在s1中没有出现过,则直接跳过该索引,并将之前的cnt计数器和nums数组进行清空处理

(2) 否则我们将此时right索引的字符出现的个数增加1,同时将cnt计数器的个数增加1

(3) 如果此时s2中right索引出现的个数 > s1中right索引出现的个数,我们选择递归移除left索引的值,直到窗口满足要求.同时,我们选择将right索引右移

(4) 如果此时cnt计数器的值 更好等于s1字符串的长度,则表示此时s2包含s1的一个排列

### 代码实现:

```java
public boolean checkInclusion(String s1, String s2) {
    //分别获取s1字符串的长度m 和s2字符串的长度n
    int m = s1.length();
    int n = s2.length();
    if (m > n) return false;
    int[] freq = new int[26];
    for (int i = 0; i < m; i++) {
        freq[s1.charAt(i) - 'a']++;
    }
    int[] nums = new int[26];
    int cnt = 0;
    int left = 0;
    int right = 0;
    while (right < n) {
        if (freq[s2.charAt(right) - 'a'] == 0) {
            //表示s1字符串中不存在该字符
            right++;
            left = right;
            cnt = 0;
            Arrays.fill(nums,0);
        }else {
            nums[s2.charAt(right) - 'a']++;
            cnt++;
            while (nums[s2.charAt(right) - 'a'] > freq[s2.charAt(right) - 'a']) {
                //选择递归移除left指针的值
                cnt--;
                nums[s2.charAt(left) - 'a']--;
                left++;
            }
            right++;
            if (cnt == m) {
                return true;
            }
        }
    }
    return false;
}
```

### Question4 : 995. K 连续位的最小翻转次数

在仅包含 `0` 和 `1` 的数组 `A` 中，一次 *K 位翻转*包括选择一个长度为 `K` 的（连续）子数组，同时将子数组中的每个 `0` 更改为 `1`，而每个 `1` 更改为 `0`。

返回所需的 `K` 位翻转的最小次数，以便数组没有值为 `0` 的元素。如果不可能，返回 `-1`。

**示例 1：**

```
输入：A = [0,1,0], K = 1
输出：2
解释：先翻转 A[0]，然后翻转 A[2]。
```

**示例 2：**

```
输入：A = [1,1,0], K = 2
输出：-1
解释：无论我们怎样翻转大小为 2 的子数组，我们都不能使数组变为 [1,1,1]。
```

**示例 3：**

```
输入：A = [0,0,0,1,0,1,1,0], K = 3
输出：3
解释：
翻转 A[0],A[1],A[2]: A变成 [1,1,1,1,0,1,1,0]
翻转 A[4],A[5],A[6]: A变成 [1,1,1,1,1,0,0,0]
翻转 A[5],A[6],A[7]: A变成 [1,1,1,1,1,1,1,1]
```

**提示：**

1. `1 <= A.length <= 30000`
2. `1 <= K <= A.length`

### 解析:

**贪心策略: 我们遇到当前索引的值为0,则将从当前位置往后k个数,进行翻转操作! ! !**

这种贪心策略 + 进行交换的方法会由于真实进行了交换操作而速度很低,只有js通过了...

```java
public int minKBitFlips01(int[] A, int K) {
    //获取A数组的长度
    int n = A.length;
    int right = 0;
    int cnt = 0;
    while (right < n) {
        //如果此时right索引位置的值为0,并且此时[right,n]剩余的元素个数不满K个,则怎么样都无法翻转得到全部的1,我们直接返回-1
        if (A[right] == 0 && n - right < K) {
            return -1;
        }
        //如果A[right] == 1 : 我们直接将right指针右移一位,continue
        //如果A[right] == 0 : 我们选择从right向后K位数进行翻转操作
        if (A[right] == 0) {
            //将翻转的次数加1
            cnt++;
            //将该位置往后k个位置的值进行翻转一次
            for (int i = right; i < right + K; i++) {
                //和1进行异或,获取其翻转的值...
                A[i] ^= 1;
            }
        }
        right++;
    }
    return cnt;
}
```

#### 优化思路: 

通过上面的示例我们可以发现:

结论1：后面区间的翻转，不会影响前面的元素。因此可以使用贪心策略，

从左到右遍历，遇到每个0 都把它和后面的 K 个数进行翻转。

结论2：A[i]翻转偶数次的结果是 A[i]；翻转奇数次的结果是A[i] ^ 1。

我们直接法超时的主要原因是我们真实地进行了翻转。

根据结论二，位置i 现在的状态，和它被前面 K - 1个元素翻转的次数（奇偶性）有关。

我们使用队列模拟滑动窗口，该滑动窗口的含义是前面K−1 个元素中，以哪些位置起始的 子区间进行了翻转。

该滑动窗口从左向右滑动，如果当前位置i 需要翻转，则把该位置存储到队列中。遍历到新位置 j (j < i + K) 时，

队列中元素的个数代表了i被前面 K - 1个元素翻转的次数。

**当i位置被翻转了偶数次，如果 A[i] 为 0，那么翻转后仍是 0，当前元素需要翻转；**

**当i位置被翻转了奇数次，如果 A[i] 为 1，那么翻转后是 0，当前元素需要翻转。**

综合上面两点，我们得到一个结论，如果**len(que) % 2 == A[i]** 时，当前元素需要翻转。

当i + K > N 时，说明需要翻转大小为 K 的子区间，但是后面剩余的元素不到 K 个了，所以返回-1。

### 代码实现:

```java
public int minKBitFlips(int[] A, int K) {
	//定义一个双端队列
    Deque<Integer> deque = new LinkedList<>();
    //获取数组A的长度
    int n = A.length;
    //定义一个计数器,记录翻转的个数
    int cnt = 0;
    int right = 0;
    while(right < n) {
        if(deque.size() > 0 && i > deque.peek() + K - 1) {
            //说明此时遍历到的right索引位置已经超越了队列的头部索引加上K - 1的长度,也就是说此时队列deque的头部元素的翻转影响不到此时right索引的元素
            deque.removeFirst();
        }
        //根据上面的结论
        if (deque.size() % 2 == A[i]) {
            //说明此时A[i]要进行翻转: 但是可能此时剩下的元素个数不足K个
            if (i + K > A.length) {
                return -1;
            }
            //否则我们进行一次翻转操作
            cnt++;
            deque.add(i);
        }
    }
    return cnt;
}
```

### Question5 : 992. K 个不同整数的子数组

给定一个正整数数组 `A`，如果 `A` 的某个子数组中不同整数的个数恰好为 `K`，则称 `A` 的这个连续、不一定不同的子数组为*好子数组*。

（例如，`[1,2,3,1,2]` 中有 `3` 个不同的整数：`1`，`2`，以及 `3`。）

返回 `A` 中*好子数组*的数目。

**示例 1：**

```
输入：A = [1,2,1,2,3], K = 2
输出：7
解释：恰好由 2 个不同整数组成的子数组：[1,2], [2,1], [1,2], [2,3], [1,2,1], [2,1,2], [1,2,1,2].
```

**示例 2：**

```
输入：A = [1,2,1,3,4], K = 3
输出：3
解释：恰好由 3 个不同整数组成的子数组：[1,2,1,3], [2,1,3], [1,3,4].
```

**提示：**

1. `1 <= A.length <= 20000`
2. `1 <= A[i] <= A.length`
3. `1 <= K <= A.length`

### 解析: 

**重要思路: 包含K个不同整数的子数组的个数 = 最多包含K个不同整数的子数组的个数 - 最多包含K - 1个不同整数的子数组的个数! ! !**

所以我们只需要编写最多包含X个不同整数的子数组的个数的方法

由于1 <= A[i] <= A.length,所以我们定义一个counts数组,长度为A.length + 1即可

我们定义两个指针变量left,right,起始设置为0,定义一个计数器cnt,记录不同整数出现的个数,以及一个结果集

while循环遍历条件 : right < n

首先如果此时right索引的字符出现的个数为0 : 则我们将计数器的个数加1

然后我们将此时right索引的字符的个数加1,如果此时[left,right]的不同整数的个数大于K个,则我们递归移除left索引的值,直到刚好此时cnt == K

然后我们将right索引的值加1

**此时[left,right]形成的满足最多包含K个不同整数的子数组的个数的组合个数为: right - left**

### 代码实现: 

```java
//该题的恰好包含K个不同整数的子数组的个数 = 最多包含K个不同整数的子数组的个数 - 最多包含K - 1个不同整数的子数组的个数
public int subarraysWithKDistinct(int[] A, int K) {
    return findMostSub(A,K) - findMostSub(A,K - 1);
}

//使用数组进行实现:优化下面的代码: 因为题意中说的1<= A[i] <= A.length
private int findMostSub(int[] A, int k) {
    //获取A数组的长度
    int n = A.length;
    //定义两个指针变量left,right
    int left = 0;
    int right = 0;
    //定义计数器记录不同整数个数
    int cnt = 0;
    //计算结果集
    int res = 0;
    //定义一个数组记录A数组中每一个值出现的次数
    int[] counts = new int[n + 1];
    //使用滑动窗口的模板进行计算A数组中最多包含K个不同整数的子数组的个数
    while (right < n) {
        if (counts[A[right]] == 0) {
            //如果counts中不包含A[right],则此时添加A[right]时,计数器的个数加1
            cnt++;
        }
        //将A[right]出现的次数加1
        counts[A[right]]++;
        //这里使用while循环
        while (cnt > k) {
            //如果此时计数器的个数大于k,我们选择递归移除left指针索引位置的值
            counts[A[left]]--;
            if (counts[A[left]] == 0) {
                //说明此时cnt的个数减1
                cnt--;
            }
            left++;
        }
        right++;
        //此时[left,right]形成的满足最多包含K个不同整数的子数组的个数的组合个数为: right - left
        res += right - left;
    }
    return res;
}
```

### Question6 : 1004.最大连续1的个数 III

给定一个由若干 `0` 和 `1` 组成的数组 `A`，我们最多可以将 `K` 个值从 0 变成 1 。

返回仅包含 1 的最长（连续）子数组的长度。

**示例 1：**

```java
输入：A = [1,1,1,0,0,0,1,1,1,1,0], K = 2
输出：6
解释： 
[1,1,1,0,0,1,1,1,1,1,1]
粗体数字从 0 翻转到 1，最长的子数组长度为 6。
```

**示例 2：**

```java
输入：A = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], K = 3
输出：10
解释：
[0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1]
粗体数字从 0 翻转到 1，最长的子数组长度为 10。
```

**提示：**

1. `1 <= A.length <= 20000`
2. `0 <= K <= A.length`
3. `A[i]` 为 `0` 或 `1` 

### 解析: 

这题使用上面典型的**滑动窗口模板**进行求解:

定义两个指针变量: left = 0,right = 0;

定义一个计数器cnt,记录0变换成1的个数

while循环遍历条件: right < n

如果此时A[right]的值为0,我们将cnt计数器的值增加1

如果此时cnt的值大于K: 此时表示变换的次数超过了K,我们选择将left指针向后移动,如果A[left] == 0,则将cnt计数器的值减1

然后将right指针加1

最后while循环结束,此时right - left的值即为此时的最长(连续)子数组的长度

### 代码实现: 

```java
public int longestOnes(int[] A, int K) {
	int n = A.length;
    //定义两个指针变量left,right
    int left = 0,right = 0;
    int cnt = 0;//定义计数器cnt,记录0变换1的数量
    while(right < n) {
        if(A[right] == 0) {
            cnt++;
        }
        if(cnt > K) {
            if(A[left] == 0) {
                cnt--;
            }
            left++;
        }
        right++;
    }
    return right - left;
}

public int longestOnes(int[] nums, int k) {
    int n = nums.length;
    int left = 0;
    int right = 0;
    int res = 0;
    int cnt = 0;
    while (right < n) {
        //先将right添加至结果集中
        //如果此时nums[right]为0，则cnt计数器++
        if (nums[right] == 0) ++cnt;
        while (cnt > k) {
            //移动我们left边界值,同时判断此时nums[left]是否为0
            if (nums[left] == 0) --cnt;
            left++;
        }
        //此时【left，right】窗口值满足我们的要求，我们选择更新结果集
        res = Math.max(res,right - left + 1);
        right++;
    }
    return res;
}
```

### Question7 : 1052. 爱生气的书店老板

今天，书店老板有一家店打算试营业 `customers.length` 分钟。每分钟都有一些顾客（`customers[i]`）会进入书店，所有这些顾客都会在那一分钟结束后离开。

在某些时候，书店老板会生气。 如果书店老板在第 `i` 分钟生气，那么 `grumpy[i] = 1`，否则 `grumpy[i] = 0`。 当书店老板生气时，那一分钟的顾客就会不满意，不生气则他们是满意的。

书店老板知道一个秘密技巧，能抑制自己的情绪，可以让自己连续 `X` 分钟不生气，但却只能使用一次。

请你返回这一天营业下来，最多有多少客户能够感到满意的数量。

**示例：**

```
输入：customers = [1,0,1,2,1,1,7,5], grumpy = [0,1,0,1,0,1,0,1], X = 3
输出：16
解释：
书店老板在最后 3 分钟保持冷静。
感到满意的最大客户数量 = 1 + 1 + 1 + 1 + 7 + 5 = 16.
```

**提示：**

- `1 <= X <= customers.length == grumpy.length <= 20000`
- `0 <= customers[i] <= 1000`
- `0 <= grumpy[i] <= 1`

### 解析: 

滑动窗口,**这题还是你的思路厉害!!**

![](/img/algorithm/common/slidingWindow/191b9b9314a6498c8550b7b62527b882.gif)

### 代码实现: 

```java
public int maxSatisfied(int[] customers, int[] grumpy, int X) {
    int n = customers.length;
    //定义一个变量: 记录此时窗口中满意的顾客的个数
    int satisfied = 0;
    //我们初始化[0,X - 1]区间,书店老板选择冷静,所以该区间的所有人都在满意之列
    for (int i = 0; i < X; i++) {
        satisfied += customers[i];
    }
    for (int i = X; i < n; i++) {
        if (grumpy[i] == 0) {
            satisfied += customers[i];
        }
    }
    //滑动窗口
    int right = X;
    int ans = satisfied;
    while (right < n) {
        //如果此时right - X原先是不满意的,此时脱离了长度为X的冷静窗口,将satisfied中移除对应的值 
        if (grumpy[right - X] == 1) {
            satisfied -= customers[right - X];
        }
        //如果此时right索引原先是不满意的,此时加入长度为X的冷静区间,将satisfied加上其对应的值
        if (grumpy[right] == 1) {
            satisfied += customers[right];
        }
        ans = Math.max(ans,satisfied);
        right++;
    }
    return ans;
}
```

### Question8 : 1208. 尽可能使字符串相等

给你两个长度相同的字符串，`s` 和 `t`。

将 `s` 中的第 `i` 个字符变到 `t` 中的第 `i` 个字符需要 `|s[i] - t[i]|` 的开销（开销可能为 0），也就是两个字符的 ASCII 码值的差的绝对值。

用于变更字符串的最大预算是 `maxCost`。在转化字符串时，总开销应当小于等于该预算，这也意味着字符串的转化可能是不完全的。

如果你可以将 `s` 的子字符串转化为它在 `t` 中对应的子字符串，则返回可以转化的最大长度。

如果 `s` 中没有子字符串可以转化成 `t` 中对应的子字符串，则返回 `0`。

**示例 1：**

```
输入：s = "abcd", t = "bcdf", cost = 3
输出：3
解释：s 中的 "abc" 可以变为 "bcd"。开销为 3，所以最大长度为 3。
```

**示例 2：**

```
输入：s = "abcd", t = "cdef", cost = 3
输出：1
解释：s 中的任一字符要想变成 t 中对应的字符，其开销都是 2。因此，最大长度为 1。
```

**示例 3：**

```
输入：s = "abcd", t = "acde", cost = 0
输出：1
解释：你无法作出任何改动，所以最大长度为 1。
```

**提示：**

- `1 <= s.length, t.length <= 10^5`
- `0 <= maxCost <= 10^6`
- `s` 和 `t` 都只含小写英文字母。

### 解析: 

使用滑动窗口的通用模板即可以完成该题的求解!!!

### 代码实现: 

```java
public int equalSubstring(String s, String t, int maxCost) {
    //获取s字符串的长度n
    int n = s.length();
    //定义一个数组vals: 其中vals[i]表示s[i]转换成t[i]花费的开销
    int[] vals = new int[n];
    for (int i = 0; i < n; i++) {
        vals[i] = Math.abs(s.charAt(i) - t.charAt(i));
    }
    //定义满足在开销内的最长子串的窗口的左右指针
    int left = 0;
    int right = 0;
    int cost = 0; //记录花费的开销
    while (right < n) {
        //将right索引花费的开销值加入到cost结果集中
        cost += vals[right];
        if (cost > maxCost) {
            //如果此时花费开销超过了maxCost,我们选择将窗口的left索引向右移动一位
            cost -= vals[left];
            left++;
        }
        //然后将right索引的值向右移到一位
        right++;
    }
    //最后的right - left的值即为转换的最长长度
    return right - left;
}
```

### Question9 : 1423. 可获得的最大点数

几张卡牌 **排成一行**，每张卡牌都有一个对应的点数。点数由整数数组 `cardPoints` 给出。

每次行动，你可以从行的开头或者末尾拿一张卡牌，最终你必须正好拿 `k` 张卡牌。

你的点数就是你拿到手中的所有卡牌的点数之和。

给你一个整数数组 `cardPoints` 和整数 `k`，请你返回可以获得的最大点数。

**示例 1：**

```
输入：cardPoints = [1,2,3,4,5,6,1], k = 3
输出：12
解释：第一次行动，不管拿哪张牌，你的点数总是 1 。但是，先拿最右边的卡牌将会最大化你的可获得点数。最优策略是拿右边的三张牌，最终点数为 1 + 6 + 5 = 12 。
```

**示例 2：**

```
输入：cardPoints = [2,2,2], k = 2
输出：4
解释：无论你拿起哪两张卡牌，可获得的点数总是 4 。
```

**示例 3：**

```
输入：cardPoints = [9,7,7,9,7,7,9], k = 7
输出：55
解释：你必须拿起所有卡牌，可以获得的点数为所有卡牌的点数之和。
```

**示例 4：**

```
输入：cardPoints = [1,1000,1], k = 1
输出：1
解释：你无法拿到中间那张卡牌，所以可以获得的最大点数为 1 。 
```

**示例 5：**

```
输入：cardPoints = [1,79,80,1,1,1,200,1], k = 3
输出：202
```

**提示：**

- `1 <= cardPoints.length <= 10^5`
- `1 <= cardPoints[i] <= 10^4`
- `1 <= k <= cardPoints.length`

### 解析: 

该题的滑动窗口和上面的爱生气的书店老板的题目有一些类似...

我们分别定义两个窗口: left_sum和right_sum

因为我们需要拿到k张牌: 所以我们起始状态left_sum为[0,k -1]的和,right_sum为空

然后我们依次定义left = k -1,right = n -1

我们分别将left_sum减去此时left索引的值,然后加上right索引的值,得到一种新的取牌方式

然后更新结果集

### 代码实现: 

```java
public int maxScore(int[] cardPoints, int k) {
    //获取cardPoints的长度
    int n = cardPoints.length;
    //定义left_sum,right_sum
    int left_sum = 0;
    int right_sum = 0;
    //left_sum和right_sum进行初始化,左边窗口有k的值,右边窗口没有值
    for (int i = 0; i < k; i++) {
        left_sum += cardPoints[i];
    }
    //定义maxSum结果集
    int maxSum = left_sum;
    int left = k - 1;
    int right = n - 1;
    while (left >= 0) {
        left_sum -= cardPoints[left--];
        right_sum += cardPoints[right--];
        maxSum = Math.max(maxSum,left_sum + right_sum);
    }
    return maxSum;
}
```

### Question10 : 1438. 绝对差不超过限制的最长连续子数组

给你一个整数数组 `nums` ，和一个表示限制的整数 `limit`，请你返回最长连续子数组的长度，该子数组中的任意两个元素之间的绝对差必须小于或者等于 `limit` *。*

如果不存在满足条件的子数组，则返回 `0` 。

**示例 1：**

```
输入：nums = [8,2,4,7], limit = 4
输出：2 
解释：所有子数组如下：
[8] 最大绝对差 |8-8| = 0 <= 4.
[8,2] 最大绝对差 |8-2| = 6 > 4. 
[8,2,4] 最大绝对差 |8-2| = 6 > 4.
[8,2,4,7] 最大绝对差 |8-2| = 6 > 4.
[2] 最大绝对差 |2-2| = 0 <= 4.
[2,4] 最大绝对差 |2-4| = 2 <= 4.
[2,4,7] 最大绝对差 |2-7| = 5 > 4.
[4] 最大绝对差 |4-4| = 0 <= 4.
[4,7] 最大绝对差 |4-7| = 3 <= 4.
[7] 最大绝对差 |7-7| = 0 <= 4. 
因此，满足题意的最长子数组的长度为 2 。
```

**示例 2：**

```
输入：nums = [10,1,2,4,7,2], limit = 5
输出：4 
解释：满足题意的最长子数组是 [2,4,7,2]，其最大绝对差 |2-7| = 5 <= 5 。
```

**示例 3：**

```
输入：nums = [4,2,2,2,4,4,2,2], limit = 0
输出：3
```

**提示：**

- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= 10^9`
- `0 <= limit <= 10^9`

### 解析: 

因为题设中要求的该子数组中的任意两个元素之间的绝对差必须小于或者等于 `limit`,故我们定义两个指针变量left,right,刚开始分别指向数组的起始位置[索引为0的位置]

同时定义一个最大值和一个最小值,记录此时满足窗口条件的最大值和最小值,刚开始都等于nums[0]的值

定义window: 即为结果集,绝对差不超过限制的最长连续子数组的窗口长度

**while循环条件 : right < n**

(1)添加right索引的值,更新此时窗口的最大值max和最小值min

(2)如果此时窗口的最大值 - 窗口的最小值 > limit

我们更新此时的window的大小,并且我们选择从right索引位置向前查找到第一个不满足Math.abs(nums[right] - nums[temp]) <= limit的索引位置,并将left指向temp的下一个位置,即使得窗口[left,right]长度最长的left索引位置,在这个过程中我们同时更新max和min的值

(3)如果Math.abs(max - min) <= limit,或者更新窗口左边界值完毕以后,将right指针向后平移一位

(4)最后退出循环,可能由于最后一直满足题设条件,所以我们这里再将window窗口进行更新一下,此时由于上面的right++,故这里窗口大小为right - left

### 代码实现: 

```java
public int longestSubarray(int[] nums, int limit) {
    //获取nums数组的长度
    int n = nums.length;
    int left = 0;
    int right = 0;
    int min = nums[0];
    int max = nums[0];

    int window = 0;
    while (right < n) {
        min = Math.min(min,nums[right]);
        max = Math.max(max,nums[right]);
        if (Math.abs(max - min) > limit) {
            //更新此时最长连续子数组的长度[不包括此时的right索引位置]
            window = Math.max(right - left,window);
            int temp = right; //定义一个temp指针指向right指针的位置
            //我们选择从right索引位置向前查找到第一个不满足Math.abs(nums[right] - nums[temp]) <= limit的索引位置
            min = nums[temp];
            max = nums[temp];
            while (Math.abs(nums[right] - nums[--temp]) <= limit) {
                //如果满足情况,我们选择更新max和min的值
                min = Math.min(min,nums[temp]);
                max = Math.max(max,nums[temp]);
            }
            //退出while循环,此时temp指向了第一个不满足的索引位置,则将left指针指向temp指针的后一个索引位置,即更新此时的新的窗口的左边界值
            left = temp + 1;
        }
        //如果Math.abs(max - min) <= limit,或者更新窗口左边界值完毕以后,将right指针向后平移一位
        right++;
    }
    window = Math.max(right - left,window);
    return window;
}
```

