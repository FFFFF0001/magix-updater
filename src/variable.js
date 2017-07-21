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