---
author: admin
comments: true
date: 2013-06-05 15:47:31+00:00
layout: post
slug: android-parcelable-%e6%8e%a5%e5%8f%a3
title: Android Parcelable 接口
wordpress_id: 34
categories:
- Android
- Java
---

在Android中有两种方法可以在Activity中传递数据一个是Serializable，另一个是Parcelable. 对于Serializable是Java SE本身就支持的，而Parcelable是Android特有功能，效率比实现Serializable接口高效，同时也可以用于进程间通信（IPC）。而实现Serializable接口非常简单，声明一下就可以了，而Parcelable接口的实现比较复杂，但是效率要比Serializable高


### Android Developer上关于Parcelable的定义


关于Android Developer上关于Parcelable的定义：“能够将类的实例写入以及存储在Parcel中的接口。它不仅要实现Parcelable的接口，还要包含称为CREATOR的一个静态域，这个CREATOR是一个实现了Parcelable.Creator接口的对象”。

在这里文档中提到了一个名为Parcel类，这个Parcel顾名思义就是一个邮包的意思，它的本意就是用来进行进程之间的通讯的。Parcel就像一个大容器，基本上数据都能向里面扔，其实就像邮局中分邮包一样。通常情况下，先塞进去的数据放在前面，先被取出，后面塞进去的只能放在后面，后取出，有点像FIFO。当然在Parcel中有一个类似于游标的东西，来表示当前读取或者存放文件的位置，其可以通过setDataPosition方法来设置这个游标的位置。

一般来说,Parcel可以通过类似writeInt, writeFloat等接口,把基本数据类型写到Parcel里面,同时也可以传递一些集合数据，例如List，Map等，甚至也支持TypeArrary这样的数据结构。当然也可以把一些指定的对象写到Parcel里面去.具体支持的类型可以参考writeValue这个参数,里面通过instanceof得到object类型后会做相应的判断是否支持。通过Parcel把List、Map、Object副本拷贝进邮包后,重新读出来后,可以通过ClassLoader重新生成这个对象. 我们可以看到很多read的函数里面都带了一个ClassLoader的参数,比如 readList(ClassLoader loader).

其实Parcelable就是一个将类写入Parcel的接口，通过这个接口我们可以轻易的将类的实例打包，然后解包。


### 关于在用Parcelable序列化之前你要知道什么


什么是序列化：


> 序列化是将对象状态转换为可保持或传输的格式的过程。与序列化相对的是反序列化，它将流转换为对象。这两个过程结合起来，可以轻松地存储和传输数据。


序列化的目的是什么？


> 

> 
> 
	
>   1. 以某种存储形式使自定义对象持久化；

> 
	
>   2. 将对象从一个地方传递到另一个地方。

> 
	
>   3. 使程序更具维护性。
> 




在Android文档中提到，Parcel类不是一个通用的序列化机制。Parcelable不支持数据的将数据存储在本地存储上，所以它不能保证在外界有变化的时候的数据持续性。但是在使用内存序列化时Parcelable的效率要高于Serializable，所以在进程间通讯时推荐用Parcelable。


### 关于Parcelable的接口定义


[java]
Interface Parcelable
{
   //描述在接口Parcelable的整理好的形中包含的特定的对象。
   public int describeContents();

   //打包类实例
   public int writeToParcel(Parcel dest, int flags)

   /**
    *读取接口，目的是要从Parcel中构造一个实现了Parcelable的类的实例处理。
    *因为实现类在这里还是不可知的,所以需要用到模板的方式，
    *继承类名通过模板参数传入。
    *为了能够实现模板参数的传入，这里定义Creator嵌入接口,
    *内含两个接口函数分别返回单个和多个继承类实例。
    */
    interface Creator<T>
    {
       abstract T createFromParcel();
       abstract T[] newArray(int size);
    }
}
[/java]


### 关于Parcelable的具体实现





	
  1. 实现Parcelable接口

	
  2. 重写writeToParcel()方法。将你的对象序列化为一个Parcel对象，即：将类的数据写入外部提供的Parcel中，打包需要传递的数据到Parcel容器保存，以便从 Parcel容器获取数据

	
  3. 重写describeContent()方法。内容接口描述，默认返回0就可以。

	
  4. 实例化静态内部对象CREATOR实现接口Parcelable.Creator


注意：


> 

> 
> 


> 
> 

> public static final Parcelable.Creator<T> CREATOR
> 



其中public static final一个都不能少，内部对象CREATOR的名称也不能改变，必须全部大写。需重写本接口中的两个方法：createFromParcel(Parcel in) 实现从Parcel容器中读取传递数据值，封装成Parcelable对象返回逻辑层，newArray(int size) 创建一个类型为T，长度为size的数组，仅一句话即可（return new T[size]），供外部类反序列化本类数组使用。

**简而言之：**通过writeToParcel将你的对象映射成Parcel对象，再通过createFromParcel将Parcel对象映射成你的对象。也可以将Parcel看成是一个流，通过writeToParcel把对象写到流里面，在通过createFromParcel从流里读取对象，只不过这个过程需要你来实现，因此写的顺序和读的顺序必须一致。


Android Developer上具体的示例代码实现：



[java]
public class MyParcelable implements Parcelable
{
     private int mData;

     public int describeContents()
     {
         return 0;
     }

     public void writeToParcel(Parcel out, int flags)
     {
         out.writeInt(mData);
     }

     public static final Parcelable.Creator<MyParcelable> CREATOR
             = new Parcelable.Creator<MyParcelable>()
     {
         public MyParcelable createFromParcel(Parcel in)
         {
             return new MyParcelable(in);
         }

         public MyParcelable[] newArray(int size)
         {
             return new MyParcelable[size];
         }
     };

     private MyParcelable(Parcel in)
     {
         mData = in.readInt();
     }
 }
[/java]
