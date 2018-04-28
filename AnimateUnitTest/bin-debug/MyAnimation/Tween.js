var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var MyAnimation;
(function (MyAnimation) {
    var Quad = (function () {
        function Quad() {
        }
        Quad.prototype.easeIn = function (t, b, c, d) {
            return c * (t /= d) * t + b;
        };
        Quad.prototype.easeOut = function (t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        };
        Quad.prototype.easeInOut = function (t, b, c, d) {
            if ((t /= d / 2) < 1)
                return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        };
        return Quad;
    }());
    __reflect(Quad.prototype, "Quad");
    var Cubic = (function () {
        function Cubic() {
        }
        Cubic.prototype.easeIn = function (t, b, c, d) {
            return c * (t /= d) * t * t + b;
        };
        Cubic.prototype.easeOut = function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        };
        Cubic.prototype.easeInOut = function (t, b, c, d) {
            if ((t /= d / 2) < 1)
                return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        };
        return Cubic;
    }());
    __reflect(Cubic.prototype, "Cubic");
    var Quart = (function () {
        function Quart() {
        }
        Quart.prototype.easeIn = function (t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        };
        Quart.prototype.easeOut = function (t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        };
        Quart.prototype.easeInOut = function (t, b, c, d) {
            if ((t /= d / 2) < 1)
                return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        };
        return Quart;
    }());
    __reflect(Quart.prototype, "Quart");
    var Quint = (function () {
        function Quint() {
        }
        Quint.prototype.easeIn = function (t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        };
        Quint.prototype.easeOut = function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        };
        Quint.prototype.easeInOut = function (t, b, c, d) {
            if ((t /= d / 2) < 1)
                return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        };
        return Quint;
    }());
    __reflect(Quint.prototype, "Quint");
    var Sine = (function () {
        function Sine() {
        }
        Sine.prototype.easeIn = function (t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        };
        Sine.prototype.easeOut = function (t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        };
        Sine.prototype.easeInOut = function (t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        };
        return Sine;
    }());
    __reflect(Sine.prototype, "Sine");
    var Expo = (function () {
        function Expo() {
        }
        Expo.prototype.easeIn = function (t, b, c, d) {
            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        };
        Expo.prototype.easeOut = function (t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        };
        Expo.prototype.easeInOut = function (t, b, c, d) {
            if (t == 0)
                return b;
            if (t == d)
                return b + c;
            if ((t /= d / 2) < 1)
                return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        };
        return Expo;
    }());
    __reflect(Expo.prototype, "Expo");
    var Circ = (function () {
        function Circ() {
        }
        Circ.prototype.easeIn = function (t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        };
        Circ.prototype.easeOut = function (t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        };
        Circ.prototype.easeInOut = function (t, b, c, d) {
            if ((t /= d / 2) < 1)
                return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        };
        return Circ;
    }());
    __reflect(Circ.prototype, "Circ");
    var Elastic = (function () {
        function Elastic() {
        }
        Elastic.prototype.easeIn = function (t, b, c, d, a, p) {
            if (t == 0)
                return b;
            if ((t /= d) == 1)
                return b + c;
            if (!p)
                p = d * .3;
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            }
            else
                var s = p / (2 * Math.PI) * Math.asin(c / a);
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        };
        Elastic.prototype.easeOut = function (t, b, c, d, a, p) {
            if (t == 0)
                return b;
            if ((t /= d) == 1)
                return b + c;
            if (!p)
                p = d * .3;
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            }
            else
                var s = p / (2 * Math.PI) * Math.asin(c / a);
            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
        };
        Elastic.prototype.easeInOut = function (t, b, c, d, a, p) {
            if (t == 0)
                return b;
            if ((t /= d / 2) == 2)
                return b + c;
            if (!p)
                p = d * (.3 * 1.5);
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            }
            else
                var s = p / (2 * Math.PI) * Math.asin(c / a);
            if (t < 1)
                return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        };
        return Elastic;
    }());
    __reflect(Elastic.prototype, "Elastic");
    var Back = (function () {
        function Back() {
        }
        Back.prototype.easeIn = function (t, b, c, d, s) {
            if (s == undefined)
                s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        };
        Back.prototype.easeOut = function (t, b, c, d, s) {
            if (s == undefined)
                s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        };
        Back.prototype.easeInOut = function (t, b, c, d, s) {
            if (s == undefined)
                s = 1.70158;
            if ((t /= d / 2) < 1)
                return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        };
        return Back;
    }());
    __reflect(Back.prototype, "Back");
    var Bounce = (function () {
        function Bounce() {
        }
        Bounce.prototype.easeIn = function (t, b, c, d) {
            return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
        };
        Bounce.prototype.easeOut = function (t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            }
            else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            }
            else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            }
            else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        };
        Bounce.prototype.easeInOut = function (t, b, c, d) {
            if (t < d / 2)
                return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
            else
                return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        };
        return Bounce;
    }());
    __reflect(Bounce.prototype, "Bounce");
    /**
     *Tween 缓动相关
     */
    var Tween = (function () {
        function Tween() {
        }
        /** 线性匀速运动效果 */
        Tween.Linear = function (t, b, c, d) {
            return c * t / d + b;
        };
        return Tween;
    }());
    /** 二次方的缓动（t^2） */
    Tween.Quad = new Quad();
    /** 三次方的缓动（t^3） */
    Tween.Cubic = new Cubic();
    /** 四次方的缓动（t^4） */
    Tween.Quart = new Quart();
    /** 五次方的缓动（t^5） */
    Tween.Quint = new Quint();
    /** 正弦曲线的缓动（sin(t)） */
    Tween.Sine = new Sine();
    /** 指数曲线的缓动（2^t） */
    Tween.Expo = new Expo();
    /** 圆形曲线的缓动（sqrt(1-t^2)） */
    Tween.Circ = new Circ();
    /** 指数衰减的正弦曲线缓动； */
    Tween.Elastic = new Elastic();
    /** 超过范围的三次方缓动（(s+1)*t^3 – s*t^2） */
    Tween.Back = new Back();
    /** 指数衰减的反弹缓动 */
    Tween.Bounce = new Bounce();
    MyAnimation.Tween = Tween;
    __reflect(Tween.prototype, "MyAnimation.Tween");
    ;
})(MyAnimation || (MyAnimation = {}));
//# sourceMappingURL=Tween.js.map