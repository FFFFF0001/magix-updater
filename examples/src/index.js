/*
    generate by magix-combine: https://github.com/thx/magix-combine
    author: kooboy_li@163.com
 */
(function(){
var updater = new Updater('app', {"html":"<div mx-guid=\"g0\u001f\">1\u001d</div><ul mx-guid=\"g1\u001f\">2\u001d</ul>","subs":[{"s":"1\u001d","keys":["a","b"],"tmpl":"<%=$$.a%>~~<%=$$.b%>","path":"div[mx-guid=\"g0\u001f\"]"},{"s":"2\u001d","keys":["list"],"tmpl":"<%for(var a=0;a<$$.list.length;a++){%><li><%=$$.list[a]%></li><%}%>","path":"ul[mx-guid=\"g1\u001f\"]"}]});
var list = [1, 2, 3, 4, 5];
setInterval(function() {
    updater.set({
        a: Math.random(),
        b: Math.random(),
        list: list
    }).digest();
    list = list.reverse();
}, 2000);
})();