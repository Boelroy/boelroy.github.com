---
author: admin
comments: trrue
data: 2013-11-2 10:32:12+00:00
layout: post
slug: cracking-the-coding-interview05
title: Cracking the Coding Interview 05
categories: 
- 算法
---
##### Q3.1 Describe how you could use a single array to implement three stacks.

这道题是其实很简单的就可以直接将数组分成三份，然后直接对每个进行push和pop操作。但是这样做的结果是浪费了空间，可能有的栈比较大，有的栈比较小。所以这里我们可以不分组，直接将元素加入到集合中，但是对每个元素都保存一份其栈下面一个元素的数组下标，这样我就只需要维护三个头指针就可以了。但是这样的做法有一个缺点是我们每次push是在数组的末尾，但是有可能有的栈进行了pop操作，然后在数组中间有一些空间浪费。这样我们可以在每次push的情况下查找可用空间然后进栈

代码：
{% highlight c%}
#include "string.h"
#include "stdio.h"

#define EMPTY_INDEX -1
#define NOT_USE -2
#define MAX_LENGTH 3000

class Element
{
	public:
	int data;
	int next;
	Element(){}
	Element(int data){
		this->data = data;
	}
};

class Stack3
{
public:
	Stack3(){
		data = new Element[200];
		for (int i = 0; i < MAX_LENGTH; ++i)
		{
			data[i].data = NOT_USE;
		}
		memset(heads, EMPTY_INDEX, sizeof(heads)); 
		cur = EMPTY_INDEX;
	}

	~Stack3(){
		delete data;
	}

	void push(int stackNm, Element e){
		if(cur > MAX_LENGTH)
			return;
		
		int pos;
		if(cur+1 == getPushPos()){
			pos = ++cur;
		}else
		{
			pos = getPushPos();
		}

		data[pos].next = heads[stackNm];
		data[pos].data = e.data;
		heads[stackNm] = pos;

	}

	Element pop(int stackNm){
		int head = heads[stackNm];
		Element e;
		if(head != EMPTY_INDEX){
			e = data[head];
			heads[stackNm] = data[head].next;
			data[head].data = NOT_USE;
		}else{
			return NULL;
		}

		return e;
	}

	int getPushPos(){
		for (int i = 0; i < MAX_LENGTH; ++i)
		{
			if(data[i].data == NOT_USE)
				return i;
		}
		return -3;
	}
	/* data */
private:
	Element *data;
	int heads[3];
	int cur;
};

{% endhighlight %}

##### Q3.2 How would you design a stack which, in addition to push and pop, also has a function min which returns the minimum element? push, pop and min should all operate in O(1) time.

其实这道题就是很简单的开辟一个栈保存每一次push之后的push前一次min的值，然后在pop的时候pop掉min栈顶的值。当然为了节省空间我们可以在push的元素大于当前最小值的时候保持原有min栈不变，然后用
{% highlight c%}
class MinStackElement
{
public:
	MinStackElement(){}
	MinStackElement(int value, int times){
		this->value = value;
		this->times = times;
	}
	int value;
	int times;
};
{% endhighlight%}

来作为min栈中的元素，如果当前的最小值和进栈的值相同我们的times就加一，pop的时候times大于一就times减一元素本身不出栈，只有times等于一的时候才出栈

代码：
{% highlight c %}
#define MAX_LENGTH 10
#define EMPTY_INDEX -1
template<class T>
class Stack
{
public:
	Stack(){
		data = new T[MAX_LENGTH];
		top = EMPTY_INDEX;
	}
	void push(T value){
		if(top < MAX_LENGTH){
			top ++;
			data[top] = value;
		}
	}

	T pop(){
		if(top == EMPTY_INDEX);
			
		return data[top--];	
	}

	T* getTop(){
		return &data[top];
	}

	bool empty(){
		return top == EMPTY_INDEX;
	}

	bool full(){
		return top == MAX_LENGTH;
	}
private:
	T *data;
	int top;
};

class MinStack
{
public:
	MinStack()
	{
		data = new Stack<int>();
		min = new Stack<MinStackElement>();
	}

	~MinStack(){
		delete data;
		delete min;
	}

	void push(int value){
		if(data->full())
			return;

		data->push(value);
		if(min->empty()){
			min->push(MinStackElement(value,1));
		}
		else{
			MinStackElement* m = min->getTop();
			if(value < m->value)
				min->push(MinStackElement(value,1));
			else if(value == m->value)
				m->times++;
		}
	}

	void pop(){
		if(data->empty())
			return;
		data->pop();
		MinStackElement* m = min->getTop();
		if(m->times == 1){
			min->pop();
		}
		else{
			m->times++;
		}
	}

	int getMin(){
		if(!min->empty())
			return min->getTop()->value;
		return -1;

	}
	int getTop(){
		if(!data->empty())
			return *data->getTop();
		return -1;

	}
	/* data */
private:
	Stack<int> *data;
	Stack<MinStackElement> *min;
};
{% endhighlight%}
