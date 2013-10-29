---
author: admin
comments: true
date: 2013-10-29 07:31:17+00:00
layout: post
slug: cracking-the-coding-interview03
title: Cracking the Coding Interview03
wordpress_id: 122
categories:
- 算法
---

###### Q1.8 Assume you have a method isSubString which check if one words is a substring of another. Given two strings, s1 and s2, write code to check if s2 is a rotation of s1 using only one call to isSubString (i.e. "waterbottle" is a rotation of  "erbottlewat")


在这里我们一般做的想法就是对其中一个进行旋转，然后再用isSubString来比较，直到旋转n次，或者比配。

但是这里限制了只能用以此isSubString所以一般的方法不行，这样我们可以考虑将其中一个字符串相互加两次然后这样如果是旋转而来的，那么另一个字符串一定在这个新的字符串中比如s1是"waterbottle",s2是“erbottlewat”，那么新的字符串s=s1+s1为"waterbottlewaterbottle"，这样s2肯定在s中。

解析：

{% highlight c %}
int is_rotation(char *s1, char *s2){
	int s1_length = strlen(s1);
	int s2_length = strlen(s2);
	if(s1_length != s2_length)
		return 0;

	char s[s1_length+s2_length+1];
	memset(s,0,sizeof(s));
	strcat(s,s1);
	strcat(s,s1);
	printf("%s\n", s);

	return 1;
}
{% endhighlight %}


###### Q2.2 Implements an algorithm to find the nth to last element of a singly linked list.


我们可以先遍历一遍链表得到长度，然后算出倒数k的位置。当然更优化的算法，用两个指针，一个移动k下，然后两个一起移动，知道第一个移动到链表尾，那么剩下的就在倒数第k个位置。

{% highlight c %}
Node * get_k_element(Node *head, k){
	Node *p = head;
	Node *q = head;
	int i = k;
	while(p->next){
		if(i < 0)
			q = q->next;
		p = p->next;
		i--;
	}

	if(i >= 0)
		error("the k should smaller or equal than List length");
	return q;
}
{% endhighlight %}
