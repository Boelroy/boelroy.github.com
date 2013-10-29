---
author: admin
comments: true
date: 2013-06-03 16:26:20+00:00
layout: post
slug: android-contentprovider
title: Android ContentProvider
wordpress_id: 21
categories:
- Android
- Java
---

### ContentProvider的架构




ContentProivder总体而言类似于一下业务的抽象机制：网站，REST，Web 服务， 存储过程。与网站一样，设备上的每一个ContentProvider都会使用字符串注册本身，这个字符串类似于域名。但称为授权(authority).这个可以唯一标识的字符串是此ContentProvider可提供的一组URI的基础。一般来说，这类似于拥有域的网站提供一些URL来公开其文档或者是内容。




授权的注册在AndroidManifest.xml文件中进行：




[xml]
<provider android:name="SomeProvider"
android:authorities="com.you.company.SomeProvider"/>
[/xml]

授权之后ContentProvider就拥有了以授权前缀开头的URL：






[java]

content://com.your.company.SomeProvider/[/java]

ContentProvider还提供了一种类似于REST的URL来获取或操作数据。对于前面的注册，标识SomeProvider的数据库中某一项的集合的URL为：






[java]

content://com.your.company.SomeProvider/collection[/java]

如果在SomeProvider的Collection下还有具体的Item，那么的他的URL为：






[java]

content://com.you.company.SomeProvider/collection/#[/java]






ContentProvider还具有web的服务特征。ContentProvider通过其URI将内部的数据公开为服务。但是ContentProvider的URL的数据不是具有特定类型的数据，这与基于SOAP的Web服务调用一样。此输出更像来自于JDBC的结果集。尽管ContentProvider的概念上和JDBC相似，但是此输出并不是和ResultSet相同。







### Android中Url的结构




Android中URL的结构类似于HTTP URI，但是是以content开头的，通常是一下的结构：


[java]

content://authority-name/path-segments1/path-segments2/...

[/java]


在content之后，该URL包含了一个授权的唯一标识符，该标示符用于在提供程序注册标中定位ContentProvider。在授权后面包含了是特定于每一个ContentProvider的路径部分。在路径部分中每一个 / 分隔开的就是一个路径片段。ContentProvider的Java实现是在Java类或者是Java接口中总声明常量来完成此任务。而且，路径的第一部分可以指向一个对象的集合。而以后的几段可以是指具体的项。







### Android MIME类型的结构




就像网站返回给定的URL的MIME类型一样，ContentProvider还负责返回给指定URL MIME类型。这使用户能够灵活的查看数据。MIME类型在Android中的工作方式与HTTP中类似。你向ContentProvider询问它支持的给定URL的MIME类型，ContentProvider返回一个包含两个部分的字符串。该字符串根据标准的Web MIME约定URI的MIME的类型。例如web的MIME标准类型在一下网站可以看到：




> 

> 
> [点击打开链接](http://tools.ietf.org/html/rfc2046)







根据MIME类型的规范，MIME类型包含两个部分：类型和子类型。如：




> 

> 
> text/html
> 
> 

> 
> text/css
> 
> 





在IANA网站上可以看到自己注册的类型和子类型的完整列表：




> 

> 
> 已经注册的类型包括：
> 
> 

> 
> application
> 
> 

> 
> audio
> 
> 

> 
> image
> 
> 

> 
> message
> 
> 

> 
> model
> 
> 

> 
> multipart
> 
> 

> 
> text
> 
> 

> 
> video
> 
> 





每个主要的类型都包含子类型。但是如果供应商具有专用的数据格式，那么子类型名称将以vnd开头。




Android遵循类似的约定来定义MIME类型。Android MIME 类型中的vnd表示供应这些类型都是具有非标准的供应商特定的形式。为了实现唯一性，android 使用了多个类似域规范的部分来进一步区分类型和子类型。而且每个内容的Android MIME的类型都具有两种形式，一个是用于某一条记录的，一个是用于多条记录的。




对于单条记录，MIME的类型对应成这样：




[java]vnd.android.cursor.item/vnd.yourcompanyname.contenttype[/java]

而对于多条记录或者是行的集合，MIME的类型是类似于这样：






[java]vnd.android.cursor.dir/vnd.youcompany.contenttype[/java]

MIME广泛存在于android中尤其是在Intent中，系统在Intent中根据数据的MIME类型来判断调用的活动。






MIME总是通过ContentProvider从他们的URI得到。记住一下三点：




> 

> 
> 类型和子类型对于他们保存的数字都是唯一的。前面已经指出，类型基本已经确定，他本质上是一个目录项或者是单个项
> 
> 

> 
> 

> 
> 如果类型和子类型不是标准的，则需要在他们前面添加vnd
> 
> 

> 
> 

> 
> 他们通常针对具体需求添加命名空间










## 




### 使用UrI来读取数据




ContentProvider定义的URI是对于该ContentProvider是唯一的。Android中包含了的ContentProvider通过定义表示这些URI的字符串常量来实现此目的。




考虑到AndroidSDK照片那个的帮助器类定义了三个URI：




[java]
MediaStore.Image.Media.INTERAL_CONTEN_URI
MediaStore.Image.Media.EXTARNAL_CONTENT_URL
ContactsContrat.Contacts.CONTENT_URI
[/java]

等效的文本URL字符串如下：






[java]
content://media/internal/images
content://media/external/images
content://com.android.contracts/contacts
[/java]

给定这些URI，从联系人中获取单行联系人的代码如下






[java]
Uri peopleUri = ContactsCOntract.Contacts.CONTENT_URI;
Uri myPersonalUri = Uri.withAppendedPath(peoleUri, "23")

//Query for this record
//managedQuery is a method on Activity class
Cursor cur = managedQuery(myPersonUri,null,null,null);
[/java]

在这里的例子中，代码使用根URI，添加制定的联系人ID，然后调用managedQuery的方法






作为对此URI的查询的一部分，可以指定排序顺序，要选择序列，要选择的列和where子句。







### 关于游标的使用




下面是关于Android游标中的一些知识：




> 

> 
> 

> 
> 
	
>   1. 游标是一个行集合
> 
	
>   2. 读取数据之前，需要使用moveToFirst()，因为游标放在第一行之前
> 
	
>   3. 需要知道列名
> 
	
>   4. 需要知道列的类型
> 
	
>   5. 所有字段访问方法都是基于列编号，所以必须首先将列名称转换为列编号
> 
	
>   6. 游标可以素以移动
> 
	
>   7. 由于可以随意移动，所以可以向他获取行计数
> 









[java]
if(cur.moveToFirst() == false)
{
	//no rows empty
	return;
}

//the cursor is already point to the first now
//let's access a few colums
int nameColumnIndex = cur.getColumnIndex(Contacts.DISPLAY_NAME_PRIMARY);
string name = cur.getString(nameColumnIndex);

//let's now see how we can loop through a cursor

while(cur.moveToFirst())
{
	//cursor moved successfully
	//accesfield
}
[/java]

上述代码 在第一行的时候已经将游标放在了第一行之前。为了将游标放在第一行之前，我们对游标进行了moveToFirst()方法。如果游标为空，此方法为false。然后使用moveToNext()方法反复导航该游标。






为了帮助理解游标的位置，Android提供了一下的方法。




> 

> 
> 

> 
> 
	
>   1. isBeforeFirst()
> 
	
>   2. isAfterLast()
> 
	
>   3. isClosed()
> 












### 使用where子句




ContentProvider提供了两种方法来使用where子句




> 

> 
> 

> 
> 
	
>   1. 通过URI
> 
	
>   2. 通过string子句与一组可替换的字符串数组参数集合
> 









**我们通过URI来传递Where子句**




[java]
Activity someActivtiy;
//..initialize the Activity
string noteUri = "content://com.google.provider.NotePad/note/23";
Cursor managedCursor = someActivtiy.managedQuery(noteUri,
						projection, // which colums to return
						null, //where clause
						null); // Order-By clause;
[/java]

我们将managedQuery方法的where子句参数保留为null。应为在本例中，我们假设笔记提供的程序非常的智能，能够判断我们想要的图书id，此id嵌入在URI本身。从某种意义上来说，我们将URI用做了传递where子句的工具。






**使用显式的where子句**




我们可以看到Activity中使用managedQuery方法。下面是该方法的prototype


[java]
public final Cursor managedQuery(Uri uri,
			String[], projection
			String selection,
			String[] selectionArgs,
			String sortOrder)
[/java]

请注意名为selection的参数，他的类型为String。这个选择字符串表示一个过滤器(在本质上是一个where子句)，他以SQL WHERE子句(不包含WHERE本身)的格式申明要返回的行。传递null将返回的给定URI的所有行。在选择字符串中可以包含？，它将被替换为selectionArg中的值，并按在选择列表中给出的列顺序显示。这些值将作为String绑定














