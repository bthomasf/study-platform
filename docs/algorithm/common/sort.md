---
title: 排序算法
---


### 1.各种排序算法比较

比较各个当下主流的排序算法:
其中:
**1.稳定性:表示如果排序前a原本在b的前面,并且a=b,则排序以后,a仍然处于b的前面;**

**2.不稳定:与上面相反;**

**3.内排序:所有排序都在内存中完成;**

**4.外排序:由于排序的数据量很大,将数据放到磁盘中,而排序通过磁盘内存的数据传输才能进行(注意:以下几种排序都是内排序);**

**5.时间复杂度:一个算法执行所耗费的时间:用O(f(n))表示,其中f(n)是关于数据规模n的函数;**

**6.空间复杂度:运行完一个程序所需内存的大小;**

**7.n:数据规模;**

**8.k:桶的个数;**

**9.In-place:不占用额外内存;**

**10;Out-place:占用额外内存**
![在这里插入图片描述](/img/algorithm/common/sort/introduction.jpg)

### 2.交换类型排序算法

#### 2.1冒泡排序算法 Bubble Sort

```java
/**
 * Created by FengBin on 2020/10/28 15:20
 * 冒泡排序算法:稳定排序
 * 时间复杂度T(n):最优时间复杂度O(n),平均时间复杂度O(n^2),最坏时间复杂度O(n^2)
 */
public class BubbleSorting {
    public static void main(String[] args) {
        int[] arr = {-9,78,0,23,-567,70};
        int n = arr.length;

        for (int i = 0; i < n -  1; i++) {  //需要进行n- 1趟排序
            for (int j = 0; j < n - 1 - i; j++) {//[0,n - 1 - j]进行比较，如果前者大于后者，则将前者和后者的位置交换顺序
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        System.out.println("冒泡排序以后的数组为 :" + Arrays.toString(arr));
    }
}
```

#### 2.2快速排序算法 Quick Sort

##### 快速排序思想:

快速排序也是一种**交换排序**,是对冒泡排序的一种改进,它是通过定义一个数组某一元素为基准值,经过一趟排序将要排序的数据分割成独立的两个部分,其中一部分的所有数据小于基准值,另外一部分的数据都要大于基准值,然后再按照这种方法对这两个部分分别再进行快速排序,整个排序过程是递归进行的,最后达到所有数据均变成有序序列

下面我们给出分别以定义基准值为第一个值,中轴值,以及末尾值为例,进行快速排序算法的图解,以及代码实现;

其中快速排序算法属于不稳定的排序:

时间复杂度T(n):最优时间复杂度O(nlogn),最坏时间复杂度O(n^2),平均时间复杂度O(nlogn)

![](/img/algorithm/common/sort/1.png)

![](/img/algorithm/common/sort/2.png)

![](/img/algorithm/common/sort/3.png)

##### 总结:

快速排序思路:

首先我们定义start=0,end=arr.length-1;

进行while快速排序操作:条件[start != end]

如果start > end : 则表示排序结束,直接返回

我们首先定义基准值[base]

再定义left = start,right = end,temp辅助变量;

**(1)我们定义基准值为最左侧的值**

**此时我们先从右侧找到第一个小于基准值的数,再从左侧找到第一个大于基准值的数**

然后进行数的交换操作

当退出while循环时,此时left索引位于最后一个小于基准值的位置,我们交换其与基准值的位置,将基准值位于中间位置

然后递归进行基准值左侧和右侧的快速排序操作

**(2)我们定义基准值为最右侧的值**

**此时我们先从左侧找到第一个大于基准值的数,再从右侧找到第一个小于基准值的数**

然后进行数的交换操作

当退出while循环时,此时right索引位于第一个大于基准值的位置,我们交换其与基准值的位置,将基准值位于中间位置

然后递归进行基准值左侧和右侧的快速排序操作

**注意:**

**(1)如果我们先从左侧查找,再从右侧查找,那么最后基准值与right索引进行交换**

**(2)如果我们先从右侧查找,再从左侧查找,那么最后基准值与left索引进行交换**

##### java代码实现上面三种形式的快速排序

> 以左值作为基准值

```java
public class QuickSorting {
    public static void main(String[] args) {
        int[] nums = {-9,78,0,23,-567,70};
        quickSort(nums,0,nums.length - 1);
        System.out.println("快速排序以后的数组为：" + Arrays.toString(nums));
    }

    //以左值作为基准值
    public static void quickSort(int[] nums, int start, int end) {
        //若此时start > end :则不满足,直接返回
        if (start >= end) return;
        //以左值作为基准值
        int base = nums[start];

        //定义两个指针变量，分别指向start和end
        int left = start;
        int right = end;
        while (left != right) {
            //顺序很重要，先从右边找到一个小于基准值的数[must]
            while (left < right && nums[right] >= base) {
                --right;
            }
            //再从左边找到一个大于基准值的数
            while (left < right && nums[left] <= base) {
                ++left;
            }
            //此时判断left是否小于right
            if (left < right) {
                //交换两个数在数组中位置
                swap(nums,left,right);
            }
        }
        //将基准值放置在left的索引位置[即最后有一个小于base的位置，使得基准值的左侧小于它，右侧小于它]
        swap(nums,start,left);
        //然后递归进行快速排序
        quickSort(nums,start,left - 1);
        quickSort(nums,left + 1,end);
    }


    public static void swap(int[] nums,int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}
```

> 以右值作为基准值

```java
public class QuickSorting {
    public static void main(String[] args) {
        int[] nums = {-9,78,0,23,-567,70};
        quickSort(nums,0,nums.length - 1);
        System.out.println("快速排序以后的数组为：" + Arrays.toString(nums));
    }

    //以右值作为基准值
    public static void quickSort(int[] nums, int start, int end) {
        //若此时start > end :则不满足,直接返回
        if (start >= end) return;
        //以左值作为基准值
        int base = nums[end];

        //定义两个指针变量，分别指向start和end
        int left = start;
        int right = end;
        while (left != right) {
            //顺序很重要，必须先从左边找到一个大于基准值的数
            while (left < right && nums[left] <= base) {
                ++left;
            }
            //再从右边找到一个小于基准值的数
            while (left < right && nums[right] >= base) {
                --right;
            }
            //此时判断left是否小于right
            if (left < right) {
                //交换两个数在数组中位置
                swap(nums,left,right);
            }
        }
        //将基准值放置在left的索引位置[即最后有一个小于base的位置，使得基准值的左侧小于它，右侧小于它]
        swap(nums,end,right);
        //然后递归进行快速排序
        quickSort(nums,start,right - 1);
        quickSort(nums,right + 1,end);
    }


    public static void swap(int[] nums,int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}
```

```java
//利用中轴值作为基准值----换一种方法实现
```

### 3.插入类排序算法 Insert Sort

#### 3.1 直接插入排序算法 Direct Insert Sort

![](/img/algorithm/common/sort/4.png)

##### 图解arr={8,5,7,2,9,3,1}的直接插入排序过程

![](/img/algorithm/common/sort/5.png)

##### java代码实现直接插入排序算法

```java
public class InsertSorting {
    /*
    * 插入排序算法:时间复杂度 T(n): 最优时间复杂度:O(n),最坏时间复杂度:O(n^2),平均时间复杂度:O(n^2)
    * */
    public static void main(String[] args) {
        int[] nums = {65,789,-23,2,2,15,-56,60};
        insertSort(nums);
        System.out.println("直接插入排序以后的数组为：" + Arrays.toString(nums));
    }

    private static void insertSort(int[] nums) {
        int n = nums.length;
        for (int j = 1; j < n; j++) { //无序集合索引下标:[1,n - 1]
            int insert = nums[j];
            int i = j - 1;
            while (i >= 0 && nums[i] > insert) {
                nums[i + 1] = nums[i];
                --i;
            }
            //退出while循环，此时i + 1的位置是insert插入的位置
            nums[i + 1] = insert;
        }
    }
}
```

#### 3.2 希尔排序算法 Shell Sort

##### 希尔排序算法:

直接插入排序算法,如果进行从小到大排序,同时较小的数处于数组的末端,将会大量增加比较的次数,同时造成花费时间的增加;

这里引入一个更加高效的插入排序算法------希尔排序算法

T(n):最优时间复杂度O(nlogn),平均时间复杂度O(nlogn),最坏时间复杂度O(nlogn)

##### 基本实现思想:

希尔排序是把待排序的数组元素,按照下标的一定增量进行分组,然后对分组使用直接插入排序算法进行排序;

这样,随着增量的逐渐减少,每组包含的关键词越来越多;当增量减至1时,整个数组此时被分为1组,此时排序完成;

我们通过图解进行希尔思想的讲解:

定义待排序的数组arr = {8,9,1,7,2,3,5,4,6,0},按照从小到大进行排序,以下为图解分析过程:

![](/img/algorithm/common/sort/6.png)

##### java代码实现:

```java
/**
 * Created by FengBin on 2020/10/26 14:49
 * 希尔排序:升级优化的插入排序算法:时间复杂度 T(n): 最优时间复杂度:O(nlogn),最坏时间复杂度:O(nlogn),平均时间复杂度:O(nlogn)
 * 属于不稳定排序算法
 */
public class ShellSorting {

    public static void main(String[] args) {
        int[] nums = {8,9,1,7,2,3,5,4,6,0};

        //交换法实现希尔排序
        int temp = 0;
        for (int gap = nums.length / 2; gap > 0; gap /= 2) {
            //gap初始值为nums.length / 2,然后递减为原来的1/2
            for (int i = gap; i < nums.length; i++) {
                //遍历gap到数组最后一个元素:完成数组分为gap组的内部插入排序
                for (int j = i - gap; j >= 0; j -= gap) {
                    if (nums[j] > nums[j + gap]) {
                        temp = nums[j];
                        nums[j] = nums[j + gap];
                        nums[j + gap] = temp;
                    }
                }
            }
        }
        //for循环结束,即完成数组nums的从小到大排序
        System.out.println("nums数组排序完毕 : " + Arrays.toString(nums));

        //移动法实现希尔排序（建议使用这种实现方式）
        public static void shellSort(int[] nums) {
        int n = nums.length;
        //增量gap：从数组的一半开始，折半处理，直到1停止
        for (int gap = n / 2; gap > 0; gap /= 2) {
            //这里穿插着一个直接插入排序，只是这里的起始位置由1变成了gap，并且下面向前移动一位变成移动gap位
            for (int j = gap; j < n; j++) {
                int insert = nums[j];
                int i = j - gap;
                while (i >= 0 && nums[i] > insert) {
                    nums[i + gap] = nums[i];
                    i -= gap;
                }
                //退出while循环，此时i + gap为insert插入的位置
                nums[i + gap] = insert;
            }
        }
    }
}
```

### 4.选择类排序算法 Select Sort

#### 4.1 简单选择排序算法 Simple Select Sort

简单选择排序:不稳定排序

时间复杂度T(n):最优时间复杂度O(n^2),最坏时间复杂度O(n^2),平均时间复杂度O(n^2)

##### 简单选择排序基本思想:

从预排序的数组中,按照指定的规则选择出某一个元素,再依次按照规定交换位置以达到排序的目的

对于arr数组来说:假设总共有n个元素

第一次:从arr[0] ~ arr[n-1]中选取出一个最小(大)值,与arr[0]进行交换

第二次:从arr[1] ~ arr[n-1]中选取出一个最小(大)值,与arr[1]进行交换

 …

第n-1次:从arr[n-2] ~ arr[n-1]中选取出最小(大)值,与arr[n-2]进行交换

总共需要通过n-1次选择,得到一个排序要求从小到大(从大到小)进行排序的有序序列

**注意:**

1.选择排序一共有(数组大小– 1)轮排序

2.每一轮排序,又是一个循环,循环的规则如下:

* 我们先假设当前值为最小(大)数
* 然后和后面的每个数进行比较,如果发现有比当前数更小(大)的数,则更新最小(大)值,并获取其下标
* 当遍历到数组的最后时,就得到了本轮的最小(大)数以及其下标
* 进而进行交换操作

**我们以arr={8,9,1,7,2,3},进行简单选择排序的图解过程分析:**

![](/img/algorithm/common/sort/7.png)

![](/img/algorithm/common/sort/8.png)



##### java代码实现简单选择排序:

```java
/**
 * Created by FengBin on 2020/10/26 15:25
 * 选择排序算法:属于不稳定排序算法
 * 时间复杂度 T(n): 最优时间复杂度:O(n^2),最坏时间复杂度:O(n^2),平均时间复杂度:O(n^2)
 */
public class SelectSorting {

    public static void main(String[] args) {
        int[] arr = {8,9,1,7,2,3};
        //选择排序:通过不断比较:更新数组0,1,2,..,arr.length-2索引的值,当前n - 1个值选择排序完毕,则最后一个值就必然是有序的
        for (int i = 0; i < arr.length - 1; i++) {
            //先假设当前值为最小值,并记录其下标
            int minIndex = i;
            int min = arr[i];
            for (int j = i + 1; j < arr.length; j++) {
                if (min > arr[j]) {
                    min = arr[j];//更新此轮的最小值
                    minIndex = j;//同时更新最小值的下标
                }
            }
            //如果当前最小值的索引[minIndex]发生变化,则我们选择将次轮的最小值与i位置进行交换
            if (minIndex != i) {
                arr[minIndex] = arr[i];
                arr[i] = min;
            }
        }
    }
}
```

####  4.2 堆排序算法 

##### 堆排序基本介绍:

1)堆排序是利用堆这种数据结构而设计的一种排序算法,堆排序属于选择排序,它的**最坏,最好,平均时间复杂度均为O(nlogn),**它是一种**不稳定**的排序算法.

2)堆是一种具有以下性质的**完全二叉树**:

每一个节点都大于或者等于其左右子节点的val值,称之为**大顶堆**

每一个节点都小于或者等于其左右子节点的val值,称之为**小顶堆**

大顶堆和小顶堆的举例如下图所示:

![](/img/algorithm/common/sort/14.png)

以大顶堆举例,我们将堆中的顶点按照层进行编号处理,然后映射到数组中,对应的大顶堆的特点为:


$$
arr[i] >= arr[2 * i + 1] 并且 arr[i] >= arr[2 * i + 2]      其中i对应第几个节点,从0开始进行编号
$$
![](/img/algorithm/common/sort/15.png)

同理小顶堆的特点为:
$$
arr[i] <= arr[2 * i + 1] 并且 arr[i] <= arr[2 * i + 2]      其中i对应第几个节点,从0开始进行编号
$$

##### 注意:

* **我们进行排序算法选择升序采用大顶堆,降序采用小顶堆**

##### 堆排序的基本思想:

1) 将待排序的序列(假设有n个元素)构造一个大顶堆[数组实现,即使用我们的顺序存储二叉树]

2) 此时,整个序列的最大值就是堆顶的根节点

3) 将其与末尾元素进行交换,此时末尾就是最大值

4) 然后再将n-1个元素重新构建一个大顶堆,这样可以得到序列的次小值,如此反复执行,便可以得到一个有序序列

5) 最终元素(大顶堆)个数越来越少,最终得到升序的有序序列

注意 : 同样的思路我们构建小顶堆,即可以得到降序的有序序列

##### 图解思路分析:

**步骤一 构造初始堆。将给定无序序列构造成一个大顶堆（一般升序采用大顶堆，降序采用小顶堆)。**

1) .假设给定无序序列结构如下

![IMG_256](/img/algorithm/common/sort/clip_image002.gif)

2) .此时我们从**最后一个非叶子结点**开始（叶结点自然不用调整，第一个非叶子结点 arr.length/2-1=5/2-1=1，也就是下面的6结点），**从左至右，从下至上进行调整**。

![IMG_257](/img/algorithm/common/sort/clip_image004.gif)

3) .找到第二个非叶节点4，由于[4,9,8]中9元素最大，4和9交换。

![IMG_258](/img/algorithm/common/sort/clip_image006.gif)

4) 这时，交换导致了子根[4,5,6]结构混乱，继续调整，[4,5,6]中6最大，交换4和6。

![IMG_259](/img/algorithm/common/sort/clip_image008.gif)

此时，我们就将一个无序序列构造成了一个大顶堆。

**步骤二 将堆顶元素与末尾元素进行交换，使末尾元素最大。然后继续调整堆，再将堆顶元素与末尾元素交换，得到第二大元素。如此反复进行交换、重建、交换。**

1) .将堆顶元素9和末尾元素4进行交换

![IMG_260](/img/algorithm/common/sort/clip_image010.gif)

2) .重新调整结构，使其继续满足堆定义

![IMG_261](/img/algorithm/common/sort/clip_image012.gif)

3) .再将堆顶元素8与末尾元素5进行交换，得到第二大元素8.

![IMG_262](/img/algorithm/common/sort/clip_image014.gif)

4) 后续过程，继续进行调整，交换，如此反复进行，最终使得整个序列有序

![IMG_263](/img/algorithm/common/sort/clip_image016.gif)

##### 代码实现:

```java
public class HeapSorting {
    public static void main(String[] args) {
        int[] arr = {4,6,8,5,9};
        heapSort(arr);
        System.out.println("排序以后的数组arr: " + Arrays.toString(arr));
    }

    //定义堆排序的主方法
    public static void heapSort(int[] arr) {
        //定义一个辅助变量:用于调整完大顶堆以后数组元素的交换
        int temp = 0;
        //第一步:将整个二叉树调整为一个大顶堆
        for (int i = arr.length / 2 - 1; i >= 0 ; i--) {
            adjustHeap(arr,i,arr.length);
        }
        //第一步操作以后,此时数组二叉树变成一个大顶堆,我们将此时二叉树的顶部[即数组的第一个元素]和数组待排序的最后一个元素进行交换操作,完成当前最大值的摆放
        //第二步:循环执行调整大顶堆操作,每次调整完以后,交换最大值,随着调整的元素个数越来越少,最终完成该数组的排序工作
        for (int i = arr.length - 1; i > 0; i--) {
            //交换最大值到数组的末尾
            temp = arr[i];
            arr[i] = arr[0];
            arr[0] = temp;
            //进行剩余数组的调整大顶堆操作
            adjustHeap(arr,0,i);
        }
    }

    //将一个数组(对应一个二叉树)调整成一个大顶堆:将以i对应的非叶子节点的子树结构调整成大顶堆
    //arr:即为传入的待调整的数组;i表示非叶子节点在数组中的索引;length表示对多少个元素进行调整[逐渐减少]
    public static void adjustHeap(int[] arr,int i,int length) {
        //第一步:取出当前i索引位置的值,保存到临时变量中
        int temp = arr[i];
        //第二步:开始进行以i索引位置的为根节点的子树的调整:将其调整为一个大顶堆
        //其中k = 2 * i + 1,k表示为i节点的左子节点,在小于length的情况下,下一次循环即为k节点的左子节点
        for (int k = 2 * i + 1; k < length; k = 2 * k + 1) {
             //k + 1即为i节点的右子节点
             if (k + 1 < length && arr[k] < arr[k + 1]) {
                 //如果左子节点的值 < 右子节点的值
                 k++;
             }
             if (arr[k] > temp) {
                 //如果该子节点的值大于父节点的值,将较大值赋值给父节点
                 arr[i] = arr[k];
                 //并将k赋值给i,继续进行循环比较[此步骤很重要!!!]
                 i = k;
             }else {
                 //如果该子节点小于等于父节点的值,无需进行交换
                 break;
             }
        }
        //for循环遍历结束,此时已经将以i为父节点的子树的最大值放在了子树的根节点[顶部]位置
        //第三步:将temp的值放在此时的i的位置[即调整以后的位置]
        arr[i] = temp;
    }
}
```

### 5.归并排序算法 Merge Sort

**基本思想**:该算法采用经典的分治(divide-and-conquer)策略:分治法是将问题分(divide)成一些小的问题然后递归求解,而治(conquer)是将分的阶段得到的各个答案"修补"在一起,即分而治之;

其中Java的Arrays.sort()排序默认采用的是归并算法MergeSort归并排序 (mergesort)是一类与插入排序、交换排序、选择排序不同的另一种排序方法。归并的含义是将两个或两个以上的有序表合并成一个新的有序表。

归并排序有多路归并排序、两路归并排序,可用于内排序，也可以用于外排序。这里仅对内排序的两路归并方法进行讨论。

**1.两路归并排序算法思路:**

把 n个记录看成 n个长度为1的有序子表；进行两两归并使记录关键字有序，得到 n/2个长度为2的有序子表；重复第上步直到所有记录归并成一个长度为 n 的有序表为止。

**2.算法的实现**

(两路归并)此算法的实现不像图示那样简单，现分三步来讨论。首先从宏观上分析，首先让子表表长 L=1 进行处理；不断地使L=2L，进行子表处理，直到 L>=n为止，把这一过程写成一个主体框架函数 mergesort。然后对于某确定的子表表长 L，将 n个记录分成若干组子表，两两归并，这里显然要循环若干次，把这一步写成函数 mergepass，可由mergesort调用。最后再看每一组（一对）子表的归并，其原理是相同的，只是子表表长不同，换句话说，是子表的首记录号与尾记录号不同，把这个归并操作作为核心算法写成函数merge ，由 mergepass来调用。假设我们有一个没有排好序的序列，那么首先我们使用分割的办法将这个序列分割成一个一个已经排好序的子序列，然后再利用归并的方法将一个个的子序列合并成排序好的序列。分割和归并的过程可以看下面的图例。

**3.时间复杂度和空间复杂度计算**
归并算法的时间复杂度分析：主要是考虑两个函数的时间花销，
一、数组划分函数sortArrays()；二、有序数组归并函数mergeArrays()；
mergeArrays()的时间复杂度为O(n)，因为代码中有2个长度为n的循环（非嵌套），所以时间复杂度则为O(n)；
简单的分析下元素长度为n的归并排序所消耗的时间 T[n]
调用sortArrays()函数函数划分两部分，那每一小部分排序好所花时间则为 T[n/2]，
而最后把这两部分有序的数组合并成一个有序的数组_mergeSort()函数所花的时间为 O(n)；
公式：T[n] = 2T[n/2] + O(n)；
公式就不仔细推导了，可以参考下： 排序算法之快速排序及其时间复杂度和空间复杂度里面时间复杂度的推导
所以得出的结果为：T[n] = O(nlogn)
归并的空间复杂度就是那个临时的数组和递归时压入栈的数据占用的空间：n + logn；所以空间复杂度为: O(n);
**4.总结:**
归并排序虽然比较稳定，在时间上也是非常有效的（最差时间复杂度和最优时间复杂度都为 O(nlogn)，
但是这种算法很消耗空间，一般来说在内部排序不会用这种方法，而是用快速排序；外部排序才会考虑到使用这种方法；

![](/img/algorithm/common/sort/9.png)

我们图解最后一次合并的过程:

第一步:先将左右两边(有序数组)的数据按照从小到大的规则填充到temp数组中,直到左右两边有一边处理完毕为止;

第二步:把剩余数据的一边数据依次保存到temp数组中;

第三步:将temp数组元素全部拷贝到arr原数组中

![](/img/algorithm/common/sort/11.png)

![](/img/algorithm/common/sort/12.png)

**java代码实现归并排序算法:**

```java
/**
 * Created by FengBin on 2020/10/28 13:53
 * 归并排序算法:稳定的排序算法
 * 时间复杂度T(n) : 最优时间复杂度O(nlogn),最差的时间复杂度O(nlogn),平均时间复杂度O(nlogn)
 */
public class MergeSorting {
    public static void main(String[] args) {
        int[] nums = {65,789,-23,2,2,15,-56,60};
        mergeSort(nums,0,nums.length - 1);
        System.out.println("归并排序以后的nums数组：" + Arrays.toString(nums));
    }

    private static void mergeSort(int[] nums, int left, int right) {
        if (left < right) {
            int mid = (left + right) / 2;
            mergeSort(nums,left,mid);
            mergeSort(nums,mid + 1,right);
            merge(nums,left,mid,right);
        }
    }

    //合并的方法
    private static void merge(int[] nums, int left, int mid, int right) {
        //定义一个辅助数组
        int[] temp = new int[nums.length];
        //定义index指针指向left索引位置[temp数组的起始索引]
        int index = left;
        //再定义两个指针变量pre->left; next->mid + 1;
        int pre = left;
        int next = mid + 1;

        while (pre <= mid && next <= right) {
            if (nums[pre] <= nums[next]) {
                temp[index++] = nums[pre++];
            }else {
                temp[index++] = nums[next++];
            }
        }
        while (pre <= mid) {
            temp[index++] = nums[pre++];
        }
        while (next <= right) {
            temp[index++] = nums[next++];
        }

        //将temp数组的元素拷贝赋值到nums数组中
        index = left;
        while (index <= right) {
            nums[index] = temp[index];
            index++;
        }
    }
}
```

### 6.基数排序算法 Radix Sort

**基数排序算法思想:稳定的排序算法**

时间复杂度T(n):最优时间复杂度O(n x k),平均时间复杂度O(n x k),最坏时间复杂度O(n x k),其中k为桶的个数

它是属”分配式排序”(distribution sort),又称为桶排序(BucketSort),通过键值的各个位的值.将要排序的元素分配到某些桶中,已达到排序的目的.其中桶用一维数组来实现

##### 基本思想:

将所有待比较数组统一为同样的数位长度,数位较短的前面进行补零操作,然后从最低位开始,依次进行下一位的比较,这样从最低位排序到最高位排序完了以后,整个数列就会变成一个有序序列了.

![](/img/algorithm/common/sort/13.png)

##### java代码实现基数排序算法:

```java
/**
 * Created by FengBin on 2020/10/28 14:26
 * 基数排序算法:稳定的排序算法
 * 时间复杂度T(n):最优时间复杂度O(n x k),平均时间复杂度O(n x k),最坏时间复杂度O(n x k),其中k为桶的个数
 */
public class RadixSorting {
    public static void main(String[] args) {
        int[] arr = {53,3,542,748,14,214};
        radixSort(arr);
        System.out.println("基数排序以后的数组为:" + Arrays.toString(arr));

    }

    private static void radixSort(int[] arr) {
        //根据传入的数组,我们首先需要获取最高位数的位数
        int max = arr[0];
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] > max)
                max = arr[i];
        }
        //获取最高位数
        int maxDigit = (max + "").length();

        //定义十个桶:每一个桶是一个一维数组:
        //1.因为定义十个桶,所以二维数组的行数为10,即包含十个一维数组
        //2.为了防止数据溢出,每一个一维数组的大小(即桶的大小)我们定义为待比较数组的长度arr.length
        //3.基数排序:经典的空间换时间的排序算法
        int[][] bucket = new int[10][arr.length];

        //为了记录十个桶中,每一个桶每一次比较实时存放多少个数据
        //我们定义一个一维数组来记录各个桶的每次放入数据的个数bucketElementCount
        int[] bEC = new int[10];

        for (int i = 0,n = 1; i < maxDigit; i++,n *= 10) {
            //针对元素对应位数进行排序处理:个位-->十位-->百位...
            //取出每一个元素对应位的值
            for (int j = 0; j < arr.length; j++) {
                int digitOfEle = arr[j] / n % 10;
                //将其放入对应的桶中
                bucket[digitOfEle][bEC[digitOfEle]] = arr[j];
                //该桶存放的元素个数加1
                bEC[digitOfEle]++;
            }

            //上面的for循环结束,将arr所有元素已经按照对应位数值的大小放置到不同的桶中
            //我们再将桶中数据按照顺序放入到原来数组中
            int index = 0;
            for (int k = 0; k < 10; k++) {//十个桶
                //如果桶中存在元素
                if (bEC[k] != 0) {
                    //循环该桶,将其存放到arr数组中
                    for (int l = 0; l < bEC[k]; l++) {
                        arr[index++] = bucket[k][l];
                    }
                }
                //每一轮以后,记得将bEC[k]置零,为记录下一轮更高位不同值在对应桶中的个数做准备
                bEC[k] = 0;
            }
        }

    }
}
```

