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