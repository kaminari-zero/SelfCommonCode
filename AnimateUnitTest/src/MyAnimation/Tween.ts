namespace MyAnimation {
    /** 
     * 缓动动画接口
     * t: current time（当前时间）；
     * b: beginning value（初始值）；
     * c: change in value（变化量）；
     * d: duration（持续时间）。
     */
    export interface TweenInterface{
        /** 从0开始加速的缓动，也就是先慢后快； */
        easeIn(...arg):any;
        /** 减速到0的缓动，也就是先快后慢； */
        easeOut(...arg):any;
        /** 前半段从0开始加速，后半段减速到0的缓动。 */
        easeInOut(...arg):any;
    }

    class Quad {
        public easeIn(t, b, c, d) {
            return c * (t /= d) * t + b;
        }
        public easeOut(t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        }
        public easeInOut(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        }
    }

    class Cubic {
        public easeIn(t, b, c, d) {
            return c * (t /= d) * t * t + b;
        }
        public easeOut(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        }
        public easeInOut(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        }
    }

    class Quart {
        public easeIn(t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        }
        public easeOut(t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        }
        public easeInOut(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        }
    }

    class Quint {
        public easeIn(t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        }
        public easeOut(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        }
        public easeInOut(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        }
    }

    class Sine {
        public easeIn(t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        }
        public easeOut(t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        }
        public easeInOut(t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        }
    }

    class Expo {
        public easeIn(t, b, c, d) {
            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        }
        public easeOut(t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        }
        public easeInOut(t, b, c, d) {
            if (t == 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    }

    class Circ {
        public easeIn(t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        }
        public easeOut(t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        }
        public easeInOut(t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        }
    }

    class Elastic {
        public easeIn(t, b, c, d, a, p) {
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }
        public easeOut(t, b, c, d, a, p) {
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
        }
        public easeInOut(t, b, c, d, a, p) {
            if (t == 0) return b;
            if ((t /= d / 2) == 2) return b + c;
            if (!p) p = d * (.3 * 1.5);
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        }
    }

    class Back {
        public easeIn(t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        }
        public easeOut(t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        }
        public easeInOut(t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        }
    }

    class Bounce {
        public easeIn(t, b, c, d) {
            return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
        }
        public easeOut(t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        }
        public easeInOut(t, b, c, d) {
            if (t < d / 2) return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
            else return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
    }


    /**
     *Tween 缓动相关
     */
    export class Tween {
        /** 线性匀速运动效果 */
        public static Linear(t, b, c, d) {
            return c * t / d + b;
        }
        /** 二次方的缓动（t^2） */
        public static Quad:Quad = new Quad();
        /** 三次方的缓动（t^3） */
        public static Cubic:Cubic = new Cubic();
        /** 四次方的缓动（t^4） */
        public static Quart:Quart = new Quart();
        /** 五次方的缓动（t^5） */
        public static Quint: Quint = new Quint();
        /** 正弦曲线的缓动（sin(t)） */
        public static Sine:Sine = new Sine();
        /** 指数曲线的缓动（2^t） */
        public static Expo:Expo = new Expo();
        /** 圆形曲线的缓动（sqrt(1-t^2)） */
        public static Circ:Circ = new Circ();
        /** 指数衰减的正弦曲线缓动； */
        public static Elastic:Elastic = new Elastic();
        /** 超过范围的三次方缓动（(s+1)*t^3 – s*t^2） */
        public static Back:Back = new Back();
        /** 指数衰减的反弹缓动 */
        public static Bounce:Bounce = new Bounce();

    };

}