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