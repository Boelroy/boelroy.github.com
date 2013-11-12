---
author: admin
comments: trrue
data: 2013-11-12 10:32:12+00:00
layout: post
slug: cracking-the-coding-interview06
title: Cracking the Coding Interview 06
categories: 
- 算法
---
#### Q3.4
>n the classic problem of the Towers of Hanoi, you have 3 rods and N disks of different sizes which can slide onto any tower. The puzzle starts with disks sorted in ascending order of size from top to bottom (e.g., each disk sits on top of an even larger one). You have the following constraints:
>Only one disk can be moved at a time.

>A disk is slid off the top of one rod onto the next rod.

>A disk can only be placed on top of a larger disk.

>Write a program to move the disks from the first rod to the last using Stacks

这道题就是对汉诺塔问题的非递归求解

#### 讨论
当然我们首先来说一说汉诺塔的递归解法：
汉诺塔的递归解法其实就是先把前n-1个石头移动到一个柱子上，然后把第n个移动到目标柱子上，然后把n-1个移动到目标柱子上
代码如下
{% highlight python %}

def hanno(n, src, dest, brig):
	if n == 1:
		print "Move disk " + str(n)+" "+ src +" to " +dest
	else :
		hanno(n-1, src, brig, dest)
		print "Move disk " + str(n)+" "+ src +" to " +dest
		hanno(n-1, brig, dest, src)
		
{% endhighlight %}

知道了汉诺塔的基本思想然后我们看看其非递归的解法：
我们通过把汉诺塔用树的形式表现出来如下图：
### [![qing](http://images.cnitblog.com/blog/391180/201212/24181835-a519afc480f64484b0e91622494611ca.jpg)](http://images.cnitblog.com/blog/391180/201212/24181835-a519afc480f64484b0e91622494611ca.jpg)

其中左子是前n-1个石头移动到过渡柱子，父节点是第n个移动到目标柱子上，右子表示把n-1个移动到目标柱子上。

这样我们最后的结果就是这棵树的中序遍历的结果：
所以我们用栈来表示这个非递归的过程：
{% highlight python %}
class Ops(object):
	"""docstring for Ops"""
	def __init__(self, n, src, brig, dest, flag):
		super(Ops, self).__init__()
		self.n = n
		self.src = src
		self.brig = brig
		self.dest = dest
		self.flag = flag

def hanno1(n):
	stack = []
	stack.append(Ops(n, "A", "C", "B", False))
	while stack != []:
		ele = stack.pop()
		if not ele.flag:
			if ele.n > 2:
				stack.append(Ops(ele.n-1, ele.brig, ele.src, ele.dest, False))
				stack.append(Ops(ele.n, ele.src, ele.brig, ele.dest, True))
				stack.append(Ops(ele.n-1, ele.src, ele.dest, ele.brig, False))
			else:
				stack.append(Ops(ele.n-1, ele.brig, ele.src, ele.dest, True))
				stack.append(Ops(ele.n, ele.src, ele.brig, ele.dest, True))
				stack.append(Ops(ele.n-1, ele.src, ele.dest, ele.brig, True))
		else:
			print "Move disk " + str(ele.n)+" "+ ele.src +" to " +ele.dest
{% endhighlight %}

#### Q3.5
>Implement a MyQueue class which implements a queue using two stacks.
使用两个栈实现一个队列MyQueue。
做法就是当in的时候push到其中一个栈，然后在out的时候如果另一个栈为空，则将前一个栈全部出栈到后一个栈中，然后后一个栈pop就行了，否则就直接pop后一个栈。

#### 代码
{% highlight python %}
class MyQueue(object):
	"""docstring for MyQueue"""
	def __init__(self):
		super(MyQueue, self).__init__()
		self.ins = []
		self.outs = []

	def s_in(self, data):
		self.ins.append(data)

	def s_out(self):
		if self.outs == []:
			if self.ins == []:
				raise Exception("MyQueue is empty")
			while self.ins != []:
				self.outs.append(self.ins.pop())

		return self.outs.pop()
{% endhighlight %}