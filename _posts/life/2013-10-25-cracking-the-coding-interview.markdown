---
author: admin
comments: true
date: 2013-10-25 16:21:46+00:00
layout: post
slug: cracking-the-coding-interview
title: Cracking the Coding Interview01
wordpress_id: 104
categories:
- 算法
---

## 题目

Cracking the Coding Interview Q1.1:

Implement an algorithm to determine if a string has all unique character. what if you can not use additional data structures?

## 解法

其实这道题的解法很简单，其实就是将字符串中的字符通过hash的方式来存储，如果hash到某个字符发现已经存在这个键我们就可以判断这个字符存在相同的字符。

当然在做这题的时候有限制是不能用additional data structures, 所以不能用hash table来做，当然我们可以建立一个长256的int数组，把数组的下标对应到字符的整数值上，这样当我们遍历字符串对碰到的每个字符都在对应的下标位置标1，这样当我们在数组中再次发现一个为1的位置，就说明有相同的字符串。这样做就是牺牲了256个整形数组的空间。我们优化可以将整形数组编程位数组，直接用长为3的int数组来表示256个位。这样就压缩了空间。

代码如下:

{% highlight c %}
#define SIZE_OF_INT 32
int is_unique(char *s){
	int a[8];
	memset(a,0,sizeof(a));
	while(*s != 0){
		int v = (int) *s;
		int idv = v / SIZE_OF_INT;
		int shift = v % SIZE_OF_INT;
		if(a[idv] & (1 << shift)) return 0;
		a[idv] |= (1 << shift);
		s++;
	}
	return 1;
}
{% endhighlight %}

## 题目

Cracking the Coding Interview Q1.2:

Write code to reverse a C-Style String. (C-String means that “abcd” is represented as five characters, including the null character.)

## 解法

字符串反转，没什么可说的

代码：

{% highlight c %}
void swap(char *a, char *b){
	*a = *a ^ *b;
	*b = *a ^ *b;
	*a = *a ^ *b;
}

void reverse(char *s){
	char *end_to_start = s + strlen(s) - 1;
	while(s < end_to_start){
		swap(s++, end_to_start--);
	}
}
{% endhighlight %}

## 题目

Cracking the Coding Interview Q1.3:

Design an algorithm and write code to remove the duplicate characters in a string without using any additional buffer. NOTE: One or two additional variables are fine. An extra copy of the array is not.

## 解法

这题其实可以接着第一题的思路，去判断重复的字符串，我们可以用一个指针去遍历数组，然后用一个指针去记录在当前遍历的位置，没有重复字符串的位置，及如果当前位置的字符串重复，我们就跳过这个字符串，如果不重复我们就将当前的字符赋给记录的指针，然后记录指针向后移动。


{% highlight c %}
#define SIZE_OF_INT 32

int is_duplicate(int *a,int n, char s){
	int v = (int)s;
	int idv = v / SIZE_OF_INT;
	int shift = v % SIZE_OF_INT;
	if(*(a+idv) & (1 << shift)) return 0;
	*(a+idv) |= (1 << shift);
	return 1;
}

void remove_duplicate(char *s){
	int a[3];
	memset(a, 0, sizeof(a));
	char *cur = s;
	while(*s != 0){
		if(is_duplicate(a, 3, *s))
			*cur++ = *s++;
		else
			s++;
	}
	*cur = '\0';
}
{% endhighlight %}
