namespace JQueryAnimation {
    //获取元素属性
    //返回元素对应的属性值（不包含单位）
    //考虑的特殊情况包括：
    //１.透明度，值为小数，如０.２
    //２.颜色，值的表示法有rgb，16进制表示法(缩写，不缩写。两种形式)
    //3.transform属性，包括 [ "translateZ", "scale", "scaleX", "scaleY", "translateX", "translateY", "scaleZ", "skewX", "skewY", "rotateX", "rotateY", "rotateZ" ]
    //transfrom属性中，不考虑matrix,translate(30,40),translate3d等复合写法
    // 上面的功能尚未实现，等有时间补上
    (function (window) {
        var transformPropNames = ["translateZ", "scale", "scaleX", "scaleY", "translateX", "translateY", "scaleZ", "skewX", "skewY", "rotateX", "rotateY", "rotateZ"];

        window['getStyle'] = function (dom, prop) {
            var tmp = window.getComputedStyle ? window.getComputedStyle(dom, null)[prop] : dom.currentStyle[prop];
            // return prop === 'opacity' ? parseFloat(tmp, 10) : parseInt(tmp, 10);
            return prop === 'opacity' ? parseFloat(tmp) : parseInt(tmp, 10);
        };
        //设置元素属性
        window['setStyle'] = function (dom, prop, value) {
            if (prop === 'opacity') {
                // dom.style.filter = '(opacity(' + parseFloat(value * 100) + '))';
                dom.style.filter = '(opacity(' + parseFloat((value * 100).toString()) + '))';
                dom.style.opacity = value;
                return;
            }
            dom.style[prop] = parseInt(value, 10) + 'px';
        };
    })(window);


    //requestAnimationFrame的兼容处理
    (function () {
        var lastTime = 0;
        var vendors = ['webkit', 'moz'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
                window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window['requestAnimationFrame']) {
            // window['requestAnimationFrame'] = function (callback, element) {
            //     var currTime = new Date().getTime();
            //     var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            //     var id = window.setTimeout(function () {
            //         callback(currTime + timeToCall);
            //     }, timeToCall);
            //     lastTime = currTime + timeToCall;
            //     return id;
            // };
            window['requestAnimationFrame'] = function (callback) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
                var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
        }
    } ());

    //时间戳获取的兼容处理
    function nowtime() {
        if (typeof performance !== 'undefined' && performance.now) {
            return performance.now();
        }
        return Date.now ? Date.now() : (new Date()).getTime();
    }

}