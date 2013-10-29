---
author: admin
comments: true
date: 2013-10-28 05:36:26+00:00
layout: post
slug: cracking-the-coding-interview02
title: Cracking the Coding Interview02
wordpress_id: 112
categories:
- 算法
---

###### Q1.4 Write a method to decide if two string are anagrams or not?


所谓的anagrams就是比如 "sed"和"des"字符在字符串中字母相同，但是字符的顺序不同，这里我们可以先将两个字符串排序然后依次的比较，这里大概是O(nlogn)+O(n)的时间复杂度。但是还有一种时间复杂度为O(n)的方法，就是额外开辟一个长为256的数组，然后对各个字符进行hash,这里的hash算法就是字符的ASCII码值对应数组下标，这样第一个字符串对数组++，而第二个对hash值--，这样我们最后判断数组的中的元素是不是有非零的值来判断是不是anagrams

代码：

{% highlight c %}
int is_anagrams(char *src, char *dest){
	int a[256];
	memset(a, 0, sizeof(a));
	while(*src != 0){
		int index_src = (int)*src++;
		int index_dest = (int)*dest++;
		a[index_src]++;
		a[index_dest]--;
	}

	int i = 0;
	for(;i < 256; i++){
		if(a[i] != 0)
			return 0;
	}
	return 1;
}
{% endhighlight %}


###### Q1.6 Given an image represented by an NxN matrix, where each pixel in the image is 4 bytes, write a method to rotate the image by 90 degrees. Can you do this in place?


我们假设要将图像逆时针旋转90度，顺时针是一个道理。如果原图如下所示：
   
>     1 2 3 4 
>     5 6 7 8 
>     9 10 11 12 
>     13 14 15 16
> 

在顺时针旋转90度后的结果是：

>     
>     4 8 12 16 
>     3 7 11 15 
>     2 6 10 14 
>     1 5 9 13
>

这里我们可以考虑 先旋转1，4，16，13，然后2，9，15，8，依次类推。在外层被处理完之后，再处理内层。这样我们就可以解决这个问题。

这里我们研究处理元素的下标变化**\[(0,0),(0,3),(3,3),(3,0)]**--->**\[(0,1),(1,3),(3,2),(2,0)\]**--->**\[(0,2),(2,3),(3,1),(1,0)\]**这样我们在每一步对这四个点进行位置的变化就能将外面第一层处理完毕，然后我们可以发现一个规律是后一次的下标都是前一次加上**\[(0,1),(1,0),(0,-1),(-1,0)\]**得来的。

然后我们再去看看外面的一圈到里面的一圈的变化**\[(0,0),(0,3),(3,3),(3,0)\]**--->**\[(1,1),(1,2),(2,2),(2,1)\]**都是由前一个加上**\[(1,1),(1,-1),(-1,-1),(-1,1)\]**变化而来的。

所以这里我们就能写出这个转化的解法：

{% highlight c %}
int transfer(int a[][5],int n){
int index_i[] = {0, 0, n-1, n-1};
	int index_j[] = {0, n-1, n-1, 0};

	int index_tmp_i[4];
	int index_tmp_j[4];

	int d_i[] = {1, 1, -1, -1};
	int d_j[] = {1, -1, -1, 1};

	int dx[] = {0,1,0,-1};
	int dy[] = {1,0,-1,0};
	int circle = n;
	for(; n > 1; n-=2){
		int k = 0;

		for(; k < 4;k++){
			index_tmp_i[k] = index_i[k];
			index_tmp_j[k] = index_j[k];
		}

		int i = 0;
		for(; i < n-1; i++){
			int tmp = a[index_tmp_i[0]][index_tmp_j[0]];

			int p = 0;
			for(; p < 3; p++){
				a[index_tmp_i[p]][index_tmp_j[p]] = a[index_tmp_i[p+1]][index_tmp_j[p+1]];
			}
			a[index_tmp_i[p]][index_tmp_j[p]]=tmp;
			p = 0;
			for(;p < 4; p++){
				index_tmp_i[p] = index_tmp_i[p] + dx[p];
				index_tmp_j[p] = index_tmp_j[p] + dy[p];
			}
		}

		k=0;
		for(;k < 4; k++){
			index_i[k] = index_i[k] + d_i[k];
			index_j[k] = index_j[k] + d_j[k];
		}
	}
}
{% endhighlight %}
