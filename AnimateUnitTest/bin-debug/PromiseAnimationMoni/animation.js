var PromiseAnimation;
(function (PromiseAnimation) {
    //实现动画库
    //1.使用requestAnimationFrame
    //2.引入promise
    var Animate = {
        init: function (el) {
            this.el = typeof el === 'string' ? document.querySelector(el) : el;
            this.reqId = null;
            this.queue = [];
            this.running = false;
            return this;
        },
        initAnim: function (props, option) {
            this.propChange = {};
            this.duration = (option && option.duration) || 1000;
            this.easing = (option && option.easing) || tween.Linear;
            for (var prop in props) {
                this.propChange[prop] = {};
                this.propChange[prop]['to'] = props[prop];
                this.propChange[prop]['from'] = window['getStyle'](this.el, prop);
            }
            return this;
        },
        stop: function () {
            if (this.reqId) {
                cancelAnimationFrame(this.reqId);
            }
            this.running = false;
            this.reqId = null;
            return this;
        },
        play: function () {
            var _this = this;
            this.running = true;
            console.log('进入动画：' + this.running);
            var startTime = 0;
            var self = this;
            if (this.reqId) {
                this.stop();
            }
            return new Promise(function (resolve, reject) {
                function step(timestamp) {
                    if (!startTime) {
                        startTime = timestamp;
                    }
                    var passedTime = Math.min(timestamp - startTime, self.duration);
                    console.log('passedTime:' + passedTime + ',duration:' + self.duration);
                    for (var prop in self.propChange) {
                        var target = self.easing(passedTime, self.propChange[prop]['from'], self.propChange[prop]['to'] - self.propChange[prop]['from'], self.duration);
                        window['setStyle'](self.el, prop, target);
                    }
                    if (passedTime >= self.duration) {
                        self.stop();
                        self.dequeue();
                        resolve();
                    }
                    else {
                        this.reqId = requestAnimationFrame(step);
                    }
                }
                _this.reqId = requestAnimationFrame(step);
                _this.cancel = function () {
                    self.stop();
                    reject('cancel');
                };
            });
        },
        enqueue: function (props, option) {
            var _this = this;
            this.queue.push(function () {
                _this.initAnim(props, option);
                return _this.play();
            });
        },
        hasNext: function () {
            return this.queue.length > 0;
        },
        dequeue: function (callback) {
            var _this = this;
            var prom;
            if (!this.running && this.hasNext()) {
                prom = this.queue.shift().call(this);
            }
            if (callback) {
                return prom.then(function () {
                    callback.call(_this);
                });
            }
            else {
                return prom;
            }
        },
        runAnim: function (props, option, callback) {
            this.enqueue(props, option);
            this.dequeue(callback);
        }
    };
    /**
     *Tween 缓动相关
     */
    var tween = {
        Linear: function (t, b, c, d) {
            return c * t / d + b;
        },
        Quad: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t + b;
            },
            easeOut: function (t, b, c, d) {
                return -c * (t /= d) * (t - 2) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1)
                    return c / 2 * t * t + b;
                return -c / 2 * ((--t) * (t - 2) - 1) + b;
            }
        },
        Cubic: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t * t + b;
            },
            easeOut: function (t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1)
                    return c / 2 * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t + 2) + b;
            }
        },
        Quart: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t * t * t + b;
            },
            easeOut: function (t, b, c, d) {
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1)
                    return c / 2 * t * t * t * t + b;
                return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
            }
        },
        Quint: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t * t * t * t + b;
            },
            easeOut: function (t, b, c, d) {
                return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1)
                    return c / 2 * t * t * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
            }
        },
        Sine: {
            easeIn: function (t, b, c, d) {
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            },
            easeOut: function (t, b, c, d) {
                return c * Math.sin(t / d * (Math.PI / 2)) + b;
            },
            easeInOut: function (t, b, c, d) {
                return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
            }
        },
        Expo: {
            easeIn: function (t, b, c, d) {
                return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
            },
            easeOut: function (t, b, c, d) {
                return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if (t == 0)
                    return b;
                if (t == d)
                    return b + c;
                if ((t /= d / 2) < 1)
                    return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
            }
        },
        Circ: {
            easeIn: function (t, b, c, d) {
                return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
            },
            easeOut: function (t, b, c, d) {
                return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1)
                    return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
            }
        },
        Elastic: {
            easeIn: function (t, b, c, d, a, p) {
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
            },
            easeOut: function (t, b, c, d, a, p) {
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
            },
            easeInOut: function (t, b, c, d, a, p) {
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
            }
        },
        Back: {
            easeIn: function (t, b, c, d, s) {
                if (s == undefined)
                    s = 1.70158;
                return c * (t /= d) * t * ((s + 1) * t - s) + b;
            },
            easeOut: function (t, b, c, d, s) {
                if (s == undefined)
                    s = 1.70158;
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            },
            easeInOut: function (t, b, c, d, s) {
                if (s == undefined)
                    s = 1.70158;
                if ((t /= d / 2) < 1)
                    return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
            }
        },
    };
})(PromiseAnimation || (PromiseAnimation = {}));
//# sourceMappingURL=animation.js.map