# magix-updater [![Version Number](https://img.shields.io/npm/v/magix-updater.svg)](https://github.com/xinglie/magix-updater/ "Version Number") [![License](https://img.shields.io/badge/license-MIT-orange.svg)](https://opensource.org/licenses/MIT "License") [![download](https://img.shields.io/npm/dm/magix-updater.svg)](https://www.npmjs.com/package/magix-updater)
> npm install magix-updater

## 简介
局部刷新解决方案

# 使用

需要配合magix-combine工具

index.html

```html
<div>
    <%=a%>~~<%=b%>
</div>

<ul>
    <%for(var i=0;i<list.length;i++){%>
        <li> <%=list[i]%> </li>
    <%}%>
</ul>
```

index.js


```js
var updater = new Updater('app', 'magix@index.html');
var list = [1, 2, 3, 4, 5];
setInterval(function() {
    updater.set({
        a: Math.random(),
        b: Math.random(),
        list: list
    }).digest();
    list = list.reverse();
}, 2000);
```

以后a,b有变化时，只需要set a,b即可

如果更新到界面需要调用digest方法。