var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var MyAnimation;
(function (MyAnimation) {
    /**
     * Utils工具相关的类
     */
    var Utils = (function () {
        function Utils() {
        }
        Utils.prototype.test = function () {
        };
        return Utils;
    }());
    MyAnimation.Utils = Utils;
    __reflect(Utils.prototype, "MyAnimation.Utils");
    MyAnimation.$util = {
        /**
        * 类型检测
        */
        $type: function (obj) {
            var rep = /\[object\s+(\w+)\]/i;
            var str = Object.prototype.toString.call(obj).toLowerCase();
            str.match(rep);
            return RegExp.$1;
        },
        /**
        * 深拷贝
        */
        $unlink: function (object) {
            var unlinked;
            switch (this.$type(object)) {
                case 'object':
                    unlinked = {};
                    for (var p in object) {
                        unlinked[p] = this.$unlink(object[p]);
                    }
                    break;
                case 'array':
                    unlinked = [];
                    for (var i = 0, l = object.length; i < l; i++) {
                        unlinked[i] = this.$unlink(object[i]);
                    }
                    break;
                default: return object;
            }
            return unlinked;
        },
        //这是原案
        // $unlink: function (object) {
        //     var unlinked;
        //     switch ($type(object)) {
        //         case 'object':
        //             unlinked = {};
        //             for (var p in object) {
        //                 unlinked[p] = $unlink(object[p]);
        //             }
        //             break;
        //         case 'array':
        //             unlinked = [];
        //             for (var i = 0, l = object.length; i < l; i++) {
        //                 unlinked[i] = $unlink(object[i]);
        //             }
        //             break;
        //         default: return object;
        //     }
        //     return unlinked;
        // },
        /**
        *Client 客户端检测
        */
        client: function () {
            // 浏览器渲染引擎 engines
            var engine = {
                ie: 0,
                gecko: 0,
                webkit: 0,
                khtml: 0,
                opera: 0,
                //complete version
                ver: null
            };
            // 浏览器
            var browser = {
                //browsers
                ie: 0,
                firefox: 0,
                safari: 0,
                konq: 0,
                opera: 0,
                chrome: 0,
                //specific version
                ver: null
            };
            // 客户端平台platform/device/OS
            var system = {
                // win: false,
                // mac: false,
                // x11: false,
                // //移动设备
                // iphone: false,
                // ipod: false,
                // ipad: false,
                // ios: false,
                // android: false,
                // nokiaN: false,
                // winMobile: false,
                // //game systems
                // wii: false,
                // ps: false
                win: undefined,
                mac: undefined,
                x11: undefined,
                //移动设备
                iphone: undefined,
                ipod: undefined,
                ipad: undefined,
                ios: undefined,
                android: undefined,
                nokiaN: undefined,
                winMobile: undefined,
                //game systems
                wii: undefined,
                ps: undefined
            };
            // 检测浏览器引擎
            var ua = navigator.userAgent;
            if (window['opera']) {
                engine.ver = browser.ver = window['opera'].version();
                engine.opera = browser.opera = parseFloat(engine.ver);
            }
            else if (/AppleWebKit\/(\S+)/.test(ua)) {
                engine.ver = RegExp["$1"];
                engine.webkit = parseFloat(engine.ver);
                //figure out if it's Chrome or Safari
                if (/Chrome\/(\S+)/.test(ua)) {
                    browser.ver = RegExp["$1"];
                    browser.chrome = parseFloat(browser.ver);
                }
                else if (/Version\/(\S+)/.test(ua)) {
                    browser.ver = RegExp["$1"];
                    browser.safari = parseFloat(browser.ver);
                }
                else {
                    //approximate version
                    var safariVersion = 1;
                    if (engine.webkit < 100) {
                        safariVersion = 1;
                    }
                    else if (engine.webkit < 312) {
                        safariVersion = 1.2;
                    }
                    else if (engine.webkit < 412) {
                        safariVersion = 1.3;
                    }
                    else {
                        safariVersion = 2;
                    }
                    browser.safari = browser.ver = safariVersion;
                }
            }
            else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
                engine.ver = browser.ver = RegExp["$1"];
                engine.khtml = browser.konq = parseFloat(engine.ver);
            }
            else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
                engine.ver = RegExp["$1"];
                engine.gecko = parseFloat(engine.ver);
                //determine if it's Firefox
                if (/Firefox\/(\S+)/.test(ua)) {
                    browser.ver = RegExp["$1"];
                    browser.firefox = parseFloat(browser.ver);
                }
            }
            else if (/MSIE ([^;]+)/.test(ua)) {
                engine.ver = browser.ver = RegExp["$1"];
                engine.ie = browser.ie = parseFloat(engine.ver);
            }
            //detect browsers
            browser.ie = engine.ie;
            browser.opera = engine.opera;
            //detect platform
            var p = navigator.platform;
            system.win = p.indexOf("Win") == 0;
            system.mac = p.indexOf("Mac") == 0;
            system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
            //detect windows operating systems
            if (system.win) {
                if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
                    if (RegExp["$1"] == "NT") {
                        switch (RegExp["$2"]) {
                            case "5.0":
                                system.win = "2000";
                                break;
                            case "5.1":
                                system.win = "XP";
                                break;
                            case "6.0":
                                system.win = "Vista";
                                break;
                            case "6.1":
                                system.win = "7";
                                break;
                            default:
                                system.win = "NT";
                                break;
                        }
                    }
                    else if (RegExp["$1"] == "9x") {
                        system.win = "ME";
                    }
                    else {
                        system.win = RegExp["$1"];
                    }
                }
            }
            //mobile devices
            system.iphone = ua.indexOf("iPhone") > -1;
            system.ipod = ua.indexOf("iPod") > -1;
            system.ipad = ua.indexOf("iPad") > -1;
            system.nokiaN = ua.indexOf("NokiaN") > -1;
            //windows mobile
            if (system.win == "CE") {
                system.winMobile = system.win;
            }
            else if (system.win == "Ph") {
                if (/Windows Phone OS (\d+.\d+)/.test(ua)) {
                    ;
                    system.win = "Phone";
                    system.winMobile = parseFloat(RegExp["$1"]);
                }
            }
            //determine iOS version
            if (system.mac && ua.indexOf("Mobile") > -1) {
                if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)) {
                    system.ios = parseFloat(RegExp.$1.replace("_", "."));
                }
                else {
                    system.ios = 2; //can't really detect - so guess
                }
            }
            //determine Android version
            if (/Android (\d+\.\d+)/.test(ua)) {
                system.android = parseFloat(RegExp.$1);
            }
            //gaming systems
            system.wii = ua.indexOf("Wii") > -1;
            system.ps = /playstation/i.test(ua);
            //return it
            return {
                engine: engine,
                browser: browser,
                system: system
            };
        }(),
    };
    //时间戳获取的兼容处理
    function nowtime() {
        if (typeof performance !== 'undefined' && performance.now) {
            return performance.now();
        }
        return Date.now ? Date.now() : (new Date()).getTime();
    }
    MyAnimation.nowtime = nowtime;
})(MyAnimation || (MyAnimation = {}));
//# sourceMappingURL=Utils.js.map