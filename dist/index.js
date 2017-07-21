
    (function(){
        var G_Mix = Object.assign || function(aim, src, p) {
    for (p in src) {
        aim[p] = src[p];
    }
    return aim;
};
var JSONStringify = JSON.stringify;
var Magix_HasProp = Object.prototype.hasOwnProperty;
var Magix_StrObject = 'object';
var G_IsPrimitive = function(args) {
    return !args || typeof args != Magix_StrObject;
};
var G_GetById = function(id) {
    return typeof id == Magix_StrObject ? id : document.getElementById(id);
};
var G_Has = function(owner, prop) {
    return owner && Magix_HasProp.call(owner, prop); //false 0 G_NULL '' undefined
};
var G_Set = function(newData, oldData, keys) {
    var changed = 0,
        now, old, p;
    for (p in newData) {
        now = newData[p];
        old = oldData[p];
        if (!G_IsPrimitive(now) || old != now) {
            keys[p] = 1;
            changed = 1;
        }
        oldData[p] = now;
    }
    return changed;
};
        var Tmpl_EscapeSlashRegExp = /\\|'/g;
var Tmpl_EscapeBreakReturnRegExp = /\r|\n/g;
var Tmpl_Mathcer = /<%([=!])?([\s\S]+?)%>|$/g;
var Tmpl_Compiler = function(text) {
  // Compile the template source, escaping string literals appropriately.
  var index = 0;
  var source = "$p+='";
  text.replace(Tmpl_Mathcer, function(match, operate, content, offset) {
    source += text.slice(index, offset).replace(Tmpl_EscapeSlashRegExp, "\\$&").replace(Tmpl_EscapeBreakReturnRegExp, "\\n");
    index = offset + match.length;

    if (operate == "=") {
      source += "'+$e(" + content + ")+'";
    } else if (operate == "!") {
      source += "'+" + content + "+'";
    } else if (content) {
      source += "';" + content + "\n$p+='";
    }
    // Adobe VMs need the match returned to produce the correct offset.
    return match;
  });
  source += "';";

  // If a variable is not specified, place data values in local scope.
  //source = "with($mx){\n" + source + "}\n";
  source = "var $t,$p='',$em={'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&#34;','\\'':'&#39;','`':'&#96;'},$er=/[&<>\"'`]/g,$ef=function(m){return $em[m]},$e=function(v){return (''+v).replace($er,$ef)},$um={'!':'%21','\\'':'%27','(':'%28',')':'%29','*':'%2A'},$uf=function(m){return $um[m]},$uq=/[!')(*]/g,$eu=function(v){return encodeURIComponent(v).replace($uq,$uf)},$qr=/[\\\\'\"]/g,$eq=function(v){return (''+v).replace($qr,'\\\\$&')};" + source + "return $p";
  /*jshint evil: true*/
  return Function("$$", source);
};
/**
 * Tmpl模板编译方法，该方法主要配合Updater存在
 * @name Tmpl
 * @beta
 * @module updater
 * @constructor
 * @param {String} text 模板字符串
 * @param {Object} data 数据对象
 * @example
 * // 主要配合updater使用
 * // html
 * // &lt;div mx-keys="a"&gt;&lt;%=a%&gt;&lt;/div&gt;
 * render:fucntion(){
 *   this.updater.set({
 *     a:1
 *   }).digest();
 * }
 * // 语法
 * // <% 语句块 %> <%= 转义输出 %> <%! 原始输出 %> <%@ view参数%>
 * // 示例
 * // <%for(var i=0;i<10;i++){%>
 * //   index:<%=i%>&lt;br /&gt;
 * //   &lt;div mx-view="path/to/view?index=<%@i%>"&gt;&lt;/div&gt;
 * // <%}%>
 *
 */
var Tmpl = function(text, data) {
  var fn = Tmpl_Compiler(text);
  return fn(data);
};
        var Partial_ContentReg = /\d+\x1d/g;
var Partial_AttrReg = /([\w\-:]+)(?:=(["'])([\s\S]*?)\2)?/g;
var Partial_UnescapeMap = {
    'amp': '&',
    'lt': '<',
    'gt': '>',
    '#34': '"',
    '#39': '\'',
    '#96': '`'
};
var Partial_UnescapeReg = /&([^;]+);/g;
var Partial_Unescape = function(m, name) {
    return Partial_UnescapeMap[name] || m;
};

var $ = window.$ || function(s) {
    return document.querySelectorAll(s);
};
var ScopeReg = /\x1f/g;
var SetGuid = function(str, id) {
    return (str + '').replace(ScopeReg, id);
};
var Partial_UpdateNode = function(node, one, renderData, updateAttrs, updateTmpl, viewId) {

    if (!node.id) {
        node.id = 'n_' + Counter++;
    }
    if (updateAttrs) {
        var attr = SetGuid(Tmpl(one.attr, renderData), viewId);
        var nowAttrs = {};
        attr.replace(Partial_AttrReg, function(match, name, q, value) {
            nowAttrs[name] = value;
        });
        for (var i = one.attrs.length - 1, a, n, old, now, f; i >= 0; i--) {
            a = one.attrs[i];
            n = a.n;
            f = a.f;
            old = a.p ? node[f || n] : node.getAttribute(n);
            now = a.b ? G_Has(nowAttrs, n) : nowAttrs[n] || '';
            if (old != now) {
                if (a.p) {
                    //decode html
                    if (a.q) now.replace(Partial_UnescapeReg, Partial_Unescape);
                    node[f || n] = now;
                } else if (now) {
                    node.setAttribute(n, now);
                } else {
                    node.removeAttribute(n);
                }
            }
        }
    }
    if (updateTmpl) {
        node.innerHTML = SetGuid(Tmpl(one.tmpl, renderData));
    }
};
var Partial_UpdateDOM = function(updater, changedKeys, renderData) {
    var selfId = updater.$t;
    var tmplObject = updater.$info;
    if (!tmplObject) return;
    var tmpl = tmplObject.html;
    var list = tmplObject.subs;
    if (updater.$rd && changedKeys) {
        var keys, one, updateTmpl, updateAttrs;

        for (var i = list.length - 1, update, q, mask, m; i >= 0; i--) { //keys
            updateTmpl = 0;
            updateAttrs = 0;
            one = list[i];
            update = 1;
            mask = one.mask;
            keys = one.pKeys;
            if (keys) {
                q = keys.length;
                while (--q >= 0) {
                    if (G_Has(changedKeys, keys[q])) {
                        update = 0;
                        break;
                    }
                }
            }
            if (update) {
                keys = one.keys;
                q = keys.length;
                update = 0;
                while (--q >= 0) {
                    if (G_Has(changedKeys, keys[q])) {
                        update = 1;
                        if (!mask || (updateTmpl && updateAttrs)) {
                            updateTmpl = one.tmpl;
                            updateAttrs = one.attr;
                            break;
                        }
                        m = mask.charAt(q);
                        updateTmpl = updateTmpl || m & 1;
                        updateAttrs = updateAttrs || m & 2;
                    }
                }
                if (update) {
                    var s = SetGuid(one.path, selfId);
                    var nodes = $(s);
                    q = 0;
                    while (q < nodes.length) {
                        Partial_UpdateNode(nodes[q++], one, renderData, updateAttrs, updateTmpl, selfId);
                    }
                }
            }
        }
    } else {
        var map,
            tmplment = function(guid) {
                return map[guid].tmpl;
            },
            x;
        if (list) {
            if (!list.$) { //process once
                list.$ = map = {};
                x = list.length;
                while (x > 0) {
                    var s = list[--x];
                    if (s.s) {
                        map[s.s] = s;
                        s.tmpl = s.tmpl.replace(Partial_ContentReg, tmplment);
                        delete s.s;
                    }
                }
            }
            map = list.$;
        }
        updater.$rd = 1;
        var str = tmpl.replace(Partial_ContentReg, tmplment);
        var node = G_GetById(updater.$t);
        node.innerHTML = SetGuid(Tmpl(str, renderData), selfId);
    }
};
        var Counter = 0;
/**
 * 使用mx-keys进行局部刷新的类
 * @constructor
 * @name Updater
 * @class
 * @beta
 * @module updater
 * @param {String} viewId Magix.View对象Id
 * @property {Object} $data 存放数据的对象
 */
var Updater = function(node, info) {
    var me = this;
    me.id = 'up_' + Counter++;
    me.$info = info;
    me.$t = node;
    me.$data = {};
    me.$keys = {};
};
var UP = Updater.prototype;
G_Mix(UP, {
    /**
     * @lends Updater#
     */
    /**
     * 获取放入的数据
     * @param  {String} [key] key
     * @return {Object} 返回对应的数据，当key未传递时，返回整个数据对象
     * @example
     * render: function() {
     *     this.updater.set({
     *         a: 10,
     *         b: 20
     *     });
     * },
     * 'read&lt;click&gt;': function() {
     *     console.log(this.updater.get('a'));
     * }
     */
    get: function(key) {
        var result = this.$data;
        if (key) {
            result = result[key];
        }
        return result;
    },
    /**
     * 通过path获取值
     * @param  {String} path 点分割的路径
     * @return {Object}
     */
    gain: function(path) {
        var result = this.$data;
        var ps = path.split('.'),
            temp;
        while (result && ps.length) {
            temp = ps.shift();
            result = result[temp];
        }
        return result;
    },
    /**
     * 获取放入的数据
     * @param  {Object} obj 待放入的数据
     * @return {Updater} 返回updater
     * @example
     * render: function() {
     *     this.updater.set({
     *         a: 10,
     *         b: 20
     *     });
     * },
     * 'read&lt;click&gt;': function() {
     *     console.log(this.updater.get('a'));
     * }
     */
    set: function(obj) {
        var me = this,
            data = me.$data,
            keys = me.$keys;
        G_Set(obj, data, keys);
        return me;
    },
    /**
     * 检测数据变化，更新界面，放入数据后需要显式调用该方法才可以把数据更新到界面
     * @example
     * render: function() {
     *     this.updater.set({
     *         a: 10,
     *         b: 20
     *     }).digest();
     * }
     */
    digest: function(data) {
        var me = this;
        if (data) {
            me.set(data);
        }
        data = me.$data;
        var keys = me.$keys;
        me.$keys = {};
        Partial_UpdateDOM(me, keys, data); //render
        return me;
    },
    /**
     * 获取当前数据状态的快照，配合altered方法可获得数据是否有变化
     * @return {Updater} 返回updater
     * @example
     * render: function() {
     *     this.updater.set({
     *         a: 20,
     *         b: 30
     *     }).digest().snapshot(); //更新完界面后保存快照
     * },
     * 'save&lt;click&gt;': function() {
     *     //save to server
     *     console.log(this.updater.altered()); //false
     *     this.updater.set({
     *         a: 20,
     *         b: 40
     *     });
     *     console.log(this.updater.altered()); //true
     *     this.updater.snapshot(); //再保存一次快照
     *     console.log(this.updater.altered()); //false
     * }
     */
    snapshot: function() {
        var me = this;
        me.$ss = JSONStringify(me.$data);
        return me;
    },
    /**
     * 检测数据是否有变动
     * @return {Boolean} 是否变动
     * @example
     * render: function() {
     *     this.updater.set({
     *         a: 20,
     *         b: 30
     *     }).digest().snapshot(); //更新完界面后保存快照
     * },
     * 'save&lt;click&gt;': function() {
     *     //save to server
     *     console.log(this.updater.altered()); //false
     *     this.updater.set({
     *         a: 20,
     *         b: 40
     *     });
     *     console.log(this.updater.altered()); //true
     *     this.updater.snapshot(); //再保存一次快照
     *     console.log(this.updater.altered()); //false
     * }
     */
    altered: function() {
        var me = this;
        if (me.$ss) {
            return me.$ss != JSONStringify(me.$data);
        }
    }
});
        window.Updater=Updater;
    })();
