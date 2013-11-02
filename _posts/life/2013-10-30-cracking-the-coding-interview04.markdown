---
author: boelroy
comments: true
date: 2013-10-30 10:33:05+00:00
layout: post
slug: cracking-the-coding-interview04
title: Cracking the Coding Interview04
categories:
- 算法
---

###### Q2.3 Implement ab algorithm to delete a node in the middle of a single linked list.(e.g. the list 1-2-3-4, we want to delete 3, the result is 1-2-4, not need return).

这道题其实很简单，做法就是将给定节点和它后面的节点交换，然后删除其后面的节点。但是要注意的是如果给定的节点在链表尾。在这里就要和面试官沟通，因为不能直接删除这个节点，删完还是会遍历到这个节点。所以关于这点，在CTCI中是这么讲的，你可以和面试官沟通，然后设置特殊字符，在输出的时候不打印或者直接不管。

解析：
{% highlight c %}
void delete_node(Node *c){
	if(c != NULL)
		return;
		
	if(c->next == NULL)
		return;
	
	Node *q = c->next;
	c->data = q->data;
	c->next = q->next;
	delete q;
}
{% endhighlight %}

##### Q2.4 You have two number represented by a linked list, where each node contains a single digit. The digit are stored in reverse order, such that the1’s digit is at the head of the list.

这个题其实很简单，只要注意到链表不是一样长和进位，其他的就很好做了
 
 解法：
 {% highlight c%}
 Node *add_list(Node *p, Node *q){
	int carry = 0;
	if(p == NULL) returu q;
	if(q == NULL) return p;

	Node *head = new Node();
	head->data = (p->data + q->data) / 10;
	head->next = NULL;
	carry = (p->data + q->data) % 10;
	Node *cur = head;

	while(*q || *p){
		Node *c = new Node();
		int sum = p->data + q->data + carry;

		c->next = NULL;
		c->data = sum / 10;
		carry = sum % 10;
		cur->next = c;
		cur = c;

		p++;
		q++;
	}

	while(p){
		Node *c = new Node();
		int sum = p->data + carry;

		c->next = NULL;
		c->data = sum / 10;
		carry = sum % 10;
		cur->next = c;
		cur = c;

		p++;
	}

	while(q){
		Node *c = new Node();
		int sum = q->data + carry;

		c->next = NULL;
		c->data = sum / 10;
		carry = sum % 10;
		cur->next = c;
		cur = c;

		q++;
	}

	if(carry){
		Node *c = new Node();
		c->next = NULL;
		c->data = carry;
		cur->next = c;
	}

	return head;

}
 {% endhighlight %}