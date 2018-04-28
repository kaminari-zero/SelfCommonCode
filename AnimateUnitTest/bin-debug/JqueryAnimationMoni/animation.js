var JQueryAnimation;
(function (JQueryAnimation) {
    var Animate = {
        init: function (el) {
            this.dom = typeof el === 'string' ? document.querySelector(el) : el;
            // console.log(this.dom);
            this.queue = [];
            this.isRuning = false;
            this.reqId = null;
            this.toEnd = false;
        },
        initAnim: function (props, opts) {
            this.propchanges = {};
            this.duration = (opts && opts.duration) || 1000;
            this.easing = (opts && opts.easing) || tween.Linear;
            //为了实现reverse，需要initProps来记录变化之前的数值
            this.initprops = {};
            // 可以使用数组同时指定开始值和结束值，也可以仅仅指定结束值
            for (var prop in props) {
                this.propchanges[prop] = {};
                if (Array.isArray(props[prop])) {
                    this.propchanges[prop]['from'] = this.initprops[prop] = props[prop][0];
                    this.propchanges[prop]['to'] = props[prop][1];
                }
                else {
                    this.propchanges[prop]['from'] = this.initprops[prop] = window['getStyle'](this.dom, prop);
                    this.propchanges[prop]['to'] = props[prop];
                }
            }
            return this;
        },
        stop: function () {
            this.isRuning = false;
            if (this.reqId) {
                cancelAnimationFrame(this.reqId);
                this.reqId = null;
            }
            return this;
        },
        play: function (opts) {
            console.log('opts', opts);
            this.isRuning = true;
            var self = this;
            var startTime;
            function tick(timestamp) {
                var curTime = timestamp || window['nowtime']();
                if (!startTime) {
                    startTime = curTime;
                }
                // console.log('passedTime', curTime - startTime);
                var passedTime = Math.min(curTime - startTime, self.duration);
                // 实现finish功能，直接到达动画最终状态
                if (self.toEnd) {
                    passedTime = self.duration;
                }
                for (var prop in self.propchanges) {
                    var curValue = self.easing(passedTime, self.propchanges[prop]['from'], self.propchanges[prop]['to'] - self.propchanges[prop]['from'], self.duration);
                    console.log(prop + ':' + passedTime, curValue);
                    window['setStyle'](self.dom, prop, curValue);
                }
                if (passedTime >= self.duration) {
                    //动画停止
                    self.stop(); //在stop中将isRunning置为了false
                    // startTime = 0;
                    //下一个动画出队
                    self.dequeue();
                    if (opts.next) {
                        opts.next.call(null);
                    }
                }
                else if (self.isRuning) {
                    self.reqId = requestAnimationFrame(tick);
                }
                //必须将判断放在else里面
                //否则经过试验，链式调用时，除了第一个动画外，其他动画会出现问题
                //这是因为，虽然stop中将isRunning置为了false
                //但是接下来的dequeue执行play，又马上将isRunning置为了true
                // if (self.isRuning) {
                //     self.reqId = requestAnimationFrame(tick);
                // }
            }
            tick();
            return this;
        },
        // 如果当前有动画正在执行，那么动画队列的首个元素一定是'run'
        // 动画函数出队之后，开始执行前，立即在队列头部添加一个'run'元素，代表动画函数正在执行
        // 只有当对应动画函数执行完之后，才会调用出队操作，原队首的'run'元素才可以出队
        // 如果动画函数执行完毕，调用出队操作之后，动画队列中还有下一个动画函数，下一个动画函数出队后，执行之前，依旧将队列头部置为'run'，重复上述操作
        // 如果动画函数执行完毕，调用出队操作之后，动画队列中没有其他动画函数，那么队首的‘run’元素出队之后，队列为空
        // 首次入队时，动画队列的首个元素不是'run'，动画立即出队执行
        // 
        enqueue: function (fn) {
            this.queue.push(fn);
            if (this.queue[0] !== 'run') {
                this.dequeue();
            }
        },
        //上一个版本使用isRuning来控制出队执行的时机，这里运用队首的'run'来控制,isRunning的一一貌似不大
        dequeue: function () {
            while (this.queue.length) {
                var curItem = this.queue.shift();
                if (typeof curItem === 'function') {
                    curItem.call(this); //这是个异步操作
                    this.queue.unshift('run');
                    break;
                }
            }
        },
        // 对外接口：开始动画的入口函数
        animate: function (props, opts) {
            var _this = this;
            // console.log(typeof this.queue);
            this.enqueue(function () {
                _this.initAnim(props, opts);
                _this.play(opts);
            });
            return this;
        },
        // 对外接口，直接到达动画的最终状态
        finish: function () {
            this.toEnd = true;
            return this;
        },
        // 对外接口：恢复到最初状态
        reverse: function () {
            if (!this.initprops) {
                alert('尚未调用任何动画，不能反转！');
            }
            this.animate(this.initprops);
            return this;
        },
        //
        runsequence: function (sequence) {
            var reSequence = sequence.reverse();
            reSequence.forEach(function (curItem, index) {
                if (index >= 1) {
                    var prevItem_1 = reSequence[index - 1];
                    curItem.o.next = function () {
                        var anim = Object.create(Animate);
                        anim.init(prevItem_1.e);
                        anim.animate(prevItem_1.p, prevItem_1.o);
                    };
                }
            });
            var firstItem = reSequence[reSequence.length - 1];
            var firstAnim = Object.create(Animate);
            firstAnim.init(firstItem.e);
            firstAnim.animate(firstItem.p, firstItem.o);
        },
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
})(JQueryAnimation || (JQueryAnimation = {}));
//# sourceMappingURL=animation.js.map