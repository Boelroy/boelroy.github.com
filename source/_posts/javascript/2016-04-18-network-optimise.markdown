---
author: Boelroy
comments: true
date: 2016-04-18
layout: post
slug: network-optimize-1
title: 那些前端优化技术背后的原理1
thumb: /pics/speed-up-website.png
categories:
- javascript
---

### [![speed-up](/assets/pics/Speed-up.png)](/assets/pics/Speed-up.png)

现在我们在开发一个网页的时候有很多的优化的最佳实践，诸如将Javascript放在文档的底部。很多时候我们已经将这个最佳实践当成了习惯，其实探究这些方法背后的原理还是挺好玩的一件事。当然在这里Google给出了很详细的文章[说明](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/?hl=en)

前端页面的优化其实需要从很多地方来考虑，但是优化的基础就是先弄清楚浏览器是如何展现一个页面的。明白了整个过程，当然知道了性能的瓶颈在哪里，当然也自然知道该如何针对性的去优化。

## Critical Rendering Path

当然``当你在浏览器中按下回车键到页面展现的整个过程``是一个很远古的面试问题，这个 [github repo](https://github.com/alex/what-happens-when) 很清楚而且详细的探究了整个过程。这里重点强调一下整个页面渲染的过程。

#### 得到DOM树
当浏览器获得了请求的HTML之后，会先干一件事情，就是将整个HTML解析成DOM树。

~~~
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="./test.css">
</head>
<body>
    <p>Hello <span>web performance</span> students!</p>
    <div><img src="awesome-photo.jpg"></div>
</body>
</html>

~~~

所以上面的HTML会被解析成如下的结构

### [![dom-tree](/assets/pics/dom-tree.png)](/assets/pics/dom-tree.png)

这里说明一下DOM，当然学JavaScript的人都知道DOM是文档对象模型，他本是是对XML的一个通用的变成接口，但是经过扩展之后就能用于HTML，提供了对HTML删除，添加替换和修改的api。其本身只是一个通用的规范。在这个规范中其实``并没有``指定文档的结构必须是一个树形的。当然树形结构有他本身的优势，所以基本上所有的说法都会用到 DOM tree 这个词。这里是[DOM](https://www.w3.org/TR/DOM-Level-2-Core/introduction.html)的定义。

整个解析成DOM树的过程需要消耗一定的时间，尤其是在处理大量的HTML的时候。

#### 得到CCSOM树

当浏览器解析了HTML之后，发现了一个stylesheet的标签，所以浏览器立刻发出一个请求，获取test.css的内容

~~~
body { font-size: 16px }
p { font-weight: bold }
span { color: red }
p span { display: none }
img { float: right }
~~~

在获取到css之后，和HTML一样，浏览器会做将css解析成一种结构，这里称为CCSOM，CSS对象模型。具体解析如下：

###[![cssom-tree](/assets/pics/cssom-tree.png)](/assets/pics/cssom-tree.png)

当然这里我们假设一个HTML中没有样式存在，那么是不是可以跳过这个过程呢？答案是否定的，我们都知道浏览器会有默认样式，所以默认样式也会被构建成CCSOM。当然考虑到这些，我们也就知道上图中的树其实是不完整的。

#### 得到渲染树

当我们得到了DOM树和CCSOM树之后，我们就能将这两棵树合并成一棵渲染树。这里的渲染树包含了页面上所有的可视元素和这些元素的样式信息。

这里创建的过程大概如下所示:

>1.从DOM树的根节点开始遍历所有的可视节点。
>
>----有些不可见的元素(如脚本标签，元数据标签之类的)会被忽略，因为他们不影响页面的渲染结果
>
>----有些css隐藏掉的元素也会被忽略。
>
>2.对于每个可视节点，从CSSOM中寻找对应的样式规则，并付诸节点
>
>3.输出可视节点，以及每个节点的样式信息
>

下面就是上述HTML的渲染树：

###[![render-tree-construction](/assets/pics/render-tree-construction.png)](/assets/pics/render-tree-construction.png)

#### 计算布局和渲染

在生成了渲染树之后我们就能对页面进行布局了，我们都知道CSS的布局是盒模型，这也是布局阶段最终的输出结果，计算每个元素所占盒子的大小，以及相对于父元素的位置。

最后我们有了这个盒模型之后就能将每一节点渲染成屏幕上的点。这个过程称为“绘制”。

#### 页面渲染关键路径
所以页面渲染的关键路径也就是上述的步骤：

>1.生成DOM树
>
>2.生成CSSOM树
>
>3.将DOM树和CCSOM树合并成渲染树。
>
>4.对渲染树进行布局，计算每个节点的几何外观
>
>5.将渲染树种的每个节点绘制到屏幕上。

###[![crp](/assets/pics/crp.png)](/assets/pics/crp.png)

#### Javascript 去哪里了？

这里我们没有讨论到JavaScript对也页面的影响，假设我们有如下的页面

~~~
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="./test.css">
</head>
<body>
    <div>I love <script> document.write('awesome')</script> Javascript </div>
</body>
</html>

~~~

我们会在屏幕上看见什么？可能有的人认为是``I love Javascript``, 但实际上最后我们在屏幕上看见的是``I love awesome Javascript``。

为什么会这样？事实上从这个例子我可以看出JavaScript对页面初次渲染产生的影响。

当DOM树构建到``scirpt``标签的时候，整个解析会停下来，所以这个时候HTML只解析到``script``标签之前也就是，然后浏览器会执行脚本，然后将awesome写到了整个文档中，最后才将JavaScript加入到DOM树中去。所以JavaScript脚本会阻塞整个页面的渲染，直到脚本执行完毕。

这里我们可以得出结论：内联的JavaScript会阻塞DOM树的构建。

如果我们将Javascript换成外部引用结果会不会不一样呢(如我们用``<script src="./app.js"></script>``)。答案是No。整个页面的解析依旧会被阻塞，直到我们从外部加载完app.js，然后执行它之后，才会进行后续的解析。

当然这里还没有提到css资源和JavaScript的关系。我们知道JavaScript可以修改一个元素的CSS属性，那么这里就有一个trick的地方，当内联的JavaScript执行的时候需要修改样式表但是还没完成CSSOM的加载和创建会怎么样？答案很简单：JavaScript会被延迟加载，直到它完成了CSSOM的下载和构建，当我们在等待的时候DOM构建也被阻塞了。所以其实当我们在构建DOM的时候如果碰到JavaScript，那么``DOM构建要同时等待JS的执行和CSS文件的获取``。

下图展示了一个完整的关键渲染路径：

## 是时候优化了
经过上面的分析，critical rendering path(CRP) 决定页面的初次显示。所以优化的重点就是在于尽量减小 CRP 的时间。这里还有各一个概念 critical resouce (关键资源)，其实也就是在影响页面初次渲染的资源，如外链的CSS，他会阻塞整个也页面，因为只有加载CSS才能构建CCSOM。这里关键资源包括：HTML，inline CSS, inline JavaSript, extern CSS 和 阻塞的 extern JavaScript(这里说阻塞了表示并非所有JavaScript资源都会阻塞页面的初次渲染)。

所以这里我们可以从三个方面出发：

>1.最小化关键资源的数量
>
>2.最小化关键资源的字节
>
>3.最小化关键路径的长度
>

#### Minify, Compress, Cache
对HTML，CSS，JavaScript 文件进行压缩、缓存，可以减小获取文件的传输时间这也是最小化关键资源的字节。

#### Inline CSS
这里我们可以将CSS嵌入在HTML中，这样我们可以减少对外部CSS获取时间，这样也能更早的得到页面。但是考虑到实际的生产过程中我们对于一些页面共享的样式的管理，外部CSS还是不可避免的。当然，我们可以将一些关键的样式嵌入在HTML。

#### Media query on \<link\> 
media query 用于对于不同媒体样式的区分，诸如打印，投影之类的(一般不太常见)。但是如果用于响应式网站上，media query 就可以排上大用场。如下面的CSS标签在一般的桌面网站的加载过程中是不会阻塞页面的初次渲染的。

~~~
<link rel="stylesheet" media="(max-width: 768px)" href="example.css" />
~~~

在你访问桌面网站的时候，如果浏览器的宽度大于768px的时候，example.css不会成为关键资源，这样就可以减少关键资源的数量。

注意这里不会影响关键路径，不表示这个不会被下载和解析。它会以一个较低的优先级进行加载和解析。

#### Async JavaScript

上面说过，不管是 inline JavaScript ，还是类似于这种``<script src="./app.js"></script>``都会阻塞页面的加载。所以对于JavaScript我们可以用``async``这个属性将脚本标识为异步的。被标示为``async``的 script 标签不会阻塞页面的渲染，所以不会加入到关键渲染路径中。他会在脚本文件被下载完成之后被执行，同时会在window的load之前被执行。

但是async会打乱文件执行的顺序，他并不能保证文件按照他在HTML上出现的顺序被执行。

#### 动态 Script tag

~~~
<script>
var loadScript = function() {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "script1.js";
	document.getElementsByTagName("head")[0].appendChild(script);
}

document.addEventListener('DOMContentLoad', loadScript);

</script>
~~~

这里代码很好理解，就是等到DOM构建完成之后我们再去加载这个脚本。这样我们也可以将JavaScript脚本从关键渲染路径当中去除掉

#### Ajax 动态获取脚本

其实和上面代码原理一样，只是获取JS的方式从 Script tag 变成了 通过 XMLHttpRequest 来获取

~~~
function loadScript() {
	var xhr = new XMLHttpRequest();
	xhr.open("get", "script1.js", true);
	xhr.onreadystatechange = function(){
	    if (xhr.readyState == 4){
	        if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){
	            var script = document.createElement ("script");
	            script.type = "text/javascript";
	            script.text = xhr.responseText;
	            document.body.appendChild(script);
	        }
	    }
	};
	xhr.send(null);
}
~~~

### 总结
从分析了从获取到HTML之后到整个页面的渲染过程之后，我们可以轻而易举的看出那些优化手段的背后的原理基础。也就跟深刻的理解了页面优化手段。当然这个只是整个网站前端优化的一小部分，我们还要从网络层面，服务器层面去优化。这里先埋个坑，下片文章再补。
