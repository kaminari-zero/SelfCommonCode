var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var MyAnimation;
(function (MyAnimation) {
    var Animation = (function () {
        function Animation(el) {
            /** 动画队列 */
            this.queue = [];
            //=====================当前运行状态信息，以后需要整理成枚举===================
            /** 是否正则运行 */
            this.isRuning = false;
            /** 是否暂停 */
            this.isPause = false;
            /** 动画是否结束 */
            this.toEnd = false;
            /** 当前动画是否结束 */
            this.toCurEnd = false;
            //========================记录操作对象的元素属性==========================
            /** 改变的元素属性 */
            this.propchanges = {};
            /** 记录初始的元素属性 */
            this.initprops = {};
            /** 记录当前的属性的值 */
            this.curprops = {};
            //=====================等待相关信息，以后需要封装起来=========================
            /** 记录当前的等待时间 */
            this.waitTime = 0;
            /** 可做一个记录所有等待事件的数组，需要将其全部移除，或者做一个等待标记 */
            this.waitMethods = [];
            /** 记录当前等待计时器id */
            this.waitId = null;
            //========================暂停相关的信息=========================
            /** 暂停时的时间 */
            this.pasuseTime = null;
            this.init(el);
        }
        //==========================对象生命周期相关方法===============================
        /** 初始化 */
        Animation.prototype.init = function (el) {
            /** 目前没必要，必要的初始化，成员变量和构造器都做了,可以用来重置整个动画使用 */
            this.dom = el;
            return this;
        };
        /** 重置当前animation,如果当前等待就结束等待，后面动画不执行，如果当前运行就结束运行（这个做得不好） */
        Animation.prototype.reset = function () {
            //如果当前有动画执行，停止所以动画
            if (this.isRuning) {
                this.clearCurWait();
                if (this.reqId) {
                    this.complete();
                }
            }
            this.queue = [];
            this.toEnd = false;
            return this;
        };
        /** 清除当前对象所有绑定，注销对象 */
        Animation.prototype.destory = function () {
        };
        /** 初始化动画 */
        Animation.prototype.initAnimation = function (props, opts) {
            if (opts instanceof options)
                this.options = opts;
            else {
                this.options.duration = (opts && opts.duration) || 1000;
                this.options.easing = (opts && opts.easing) || MyAnimation.Tween.Linear;
            }
            //属性值必须是{}格式的对象字面量
            if (props instanceof Object == false)
                return;
            //重置属性记录
            this.propchanges = {};
            this.initprops = {};
            this.curprops = {};
            //指定开始值和结束值
            for (var prop in props) {
                //为每一个属性定制各自的开始结束值
                this.propchanges[prop] = {};
                if (Array.isArray(props[prop])) {
                    this.propchanges[prop]['from'] = this.initprops[prop] = this.curprops[prop]
                        = props[prop][0]; //获取当前元素的属性值
                    this.propchanges[prop]['to'] = props[prop][1];
                }
                else {
                    this.propchanges[prop]['from'] = this.initprops[prop] = this.curprops[prop]
                        = this.dom[prop]; //获取当前元素的属性值
                    this.propchanges[prop]['to'] = props[prop];
                }
            }
            // console.log("打印this.propchanges",this.propchanges);
            return this;
        };
        //==========================对象内基本操作方法============================
        /** 动画播放 */
        Animation.prototype.play = function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var startTime, pasueTime, passedTime, promise;
                return __generator(this, function (_a) {
                    // console.log("play");
                    this.isRuning = true;
                    startTime = 0;
                    pasueTime = this.pasuseTime ? this.pasuseTime : 0;
                    passedTime = 0;
                    promise = new Promise(function (resolve, reject) {
                        var step = function (timestamp) {
                            //实现暂停功能
                            if (!_this.isPause) {
                                var curTime = timestamp || MyAnimation.nowtime();
                                // console.log(curTime);
                                //开始时间非0的话
                                if (!startTime)
                                    startTime = curTime;
                                //计算已经通过的时间
                                passedTime = Math.min(curTime - startTime + pasueTime, _this.options.duration);
                                //实现finish功能
                                if (_this.toEnd || _this.toCurEnd)
                                    passedTime = _this.options.duration;
                                //更新目标的属性值
                                for (var prop in _this.propchanges) {
                                    //easing的四个基本参数：当前时间，初始值，变化量，持续时间
                                    _this.dom[prop] = _this.curprops[prop]
                                        = _this.options.easing(passedTime, _this.propchanges[prop]['from'], _this.propchanges[prop]['to'] - _this.propchanges[prop]['from'], _this.options.duration);
                                }
                                if (passedTime >= _this.options.duration) {
                                    _this.complete();
                                    // this.dequeue(); //感觉放入complete好点
                                    //完成的标记
                                    resolve();
                                }
                                else {
                                    //是否暂停了
                                    // if(this.isPause){
                                    //     //暂停时间=已经经历过的时间
                                    //     this.pasuseTime = passedTime;
                                    //     this.propchanges = this.curprops;
                                    //     //尝试使用await来拦截接下来的运行
                                    //     this.curPlayFun = {curFun:this.play,curFunArg:callback};
                                    // }
                                    // while(true){
                                    //     console.log("暂停ing");
                                    //     if(!this.isPause) break;
                                    // }
                                    _this.reqId = setTimeout(step, 10);
                                }
                            }
                            else {
                                startTime = MyAnimation.nowtime();
                                pasueTime = passedTime;
                                // this.options.duration = Math.min(this.options.duration-pasueTime, 0);
                                _this.reqId = setTimeout(step, 10); //什么都不执行，直到暂停解除
                            }
                        };
                        //自动执行step
                        // this.reqId = setTimeout(step, 10);
                        _this.reqId = setTimeout(step, 10);
                    });
                    if (callback) {
                        return [2 /*return*/, promise.then(function () {
                                callback.call(_this);
                            })];
                    }
                    return [2 /*return*/, promise];
                });
            });
        };
        /** 动画完成 */
        Animation.prototype.complete = function () {
            //清除计时器标记
            if (this.reqId)
                clearTimeout(this.reqId);
            this.isRuning = false;
            this.reqId = null;
            //重置当前的动画标记
            this.toCurEnd = false;
            this.dequeue();
            return this;
        };
        // 如果当前有动画正在执行，那么动画队列的首个元素一定是'run'
        // 动画函数出队之后，开始执行前，立即在队列头部添加一个'run'元素，代表动画函数正在执行
        // 只有当对应动画函数执行完之后，才会调用出队操作，原队首的'run'元素才可以出队
        // 如果动画函数执行完毕，调用出队操作之后，动画队列中还有下一个动画函数，下一个动画函数出队后，执行之前，依旧将队列头部置为'run'，重复上述操作
        // 如果动画函数执行完毕，调用出队操作之后，动画队列中没有其他动画函数，那么队首的‘run’元素出队之后，队列为空
        // 首次入队时，动画队列的首个元素不是'run'，动画立即出队执行
        /** 动画入队 （方式一） */
        Animation.prototype.enqueue = function (fn) {
            // console.log("enqueue",fn);
            this.queue.push(fn);
            if (this.queue[0] !== 'run') {
                this.dequeue();
            }
        };
        /** 动画出队 */
        Animation.prototype.dequeue = function () {
            while (this.queue.length) {
                // console.log("dequeue",this.queue.length);
                //当前动画
                var curItem = this.queue.shift();
                //如果当前队头是方法，不是run标记
                if (typeof curItem === 'function') {
                    curItem.call(this); //这是异步动画操作
                    //标记上run在队头
                    this.queue.unshift('run');
                    // break;
                    return curItem; //返回当前出队的方法（目前暂时没利用）
                }
            }
        };
        /** 去除一个数组中与另一个数组中的值相同的元素 */
        Animation.prototype.array_diff = function (a, b) {
            for (var i = 0; i < b.length; i++) {
                for (var j = 0; j < a.length; j++) {
                    if (a[j] === b[i]) {
                        a.splice(j, 1);
                        j = j - 1;
                    }
                }
            }
            return a;
        };
        /** 清除当前等待 */
        Animation.prototype.clearCurWait = function () {
            if (this.waitId) {
                if (this.waitComplateFun)
                    this.waitComplateFun.call(this);
                clearTimeout(this.waitId);
                this.waitId = null;
                console.log("立即结束当前等待，直接完成等待事件");
                this.dequeue();
            }
        };
        /** 把当前执行方法再次放入队列中？ */
        //========================= 对外接口(方法)===========================
        /** 开始动画 */
        Animation.prototype.animate = function (props, opts, callback) {
            var _this = this;
            if (callback === void 0) { callback = null; }
            this.enqueue(function () {
                // console.log("回调enqueue的fn");
                _this.initAnimation(props, opts);
                _this.play(callback);
            });
            return this;
        };
        /**
         * 直接完成动画,如果当前有等待就立即完成，后面的等待全部忽略
         */
        Animation.prototype.finish = function () {
            this.toEnd = true;
            this.waitTime = 0;
            this.clearCurWait();
            //删除等待事件
            this.array_diff(this.queue, this.waitMethods);
            console.log("直接完成动画！");
            return this;
        };
        /** 完成当前的动画,如果当前有等待就立即完成 */
        Animation.prototype.finishCurAni = function () {
            this.toCurEnd = true;
            this.clearCurWait();
            console.log("直接完成当前动画！");
            return this;
        };
        /** 恢复成原来状态 */
        Animation.prototype.reverse = function (callback) {
            if (callback === void 0) { callback = null; }
            if (this.initprops)
                this.animate(this.initprops, this.options, callback);
            else
                console.log("尚未调用任何动画，不能复位");
            return this;
        };
        /** 等待动画 */
        Animation.prototype.wait = function (time, callback) {
            var _this = this;
            if (time === void 0) { time = 1000; }
            this.waitTime = time;
            var waitmethod = function () {
                if (callback) {
                    _this.waitComplateFun = callback;
                }
                console.log("等待ing！");
                _this.waitId = setTimeout(function () {
                    // if(callback) callback.call(this);
                    if (callback) {
                        // this.waitComplateFun = callback;
                        _this.waitComplateFun.call(_this);
                        _this.waitId = null;
                        _this.array_diff(_this.waitMethods, [waitmethod]);
                    }
                    // console.log("",this)
                    //问题：关于call的问题：
                    //箭头函数不会绑定this，该this应该是指定类对象本身
                    //结果：箭头函数不会绑定this，也不会被call改变this指向
                    _this.dequeue();
                }, _this.waitTime);
                //改用定时器
                // let timer = new egret.Timer(this.waitTime,1);
                // //每完成一次间隔
                // timer.addEventListener(egret.TimerEvent.TIMER, ()=>{
                //     if(this.isPause||this.toEnd){
                //         timer.stop();
                //         this.dequeue();
                //     } 
                // }, this);
                // //完成定时器的所有计数
                // timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, ()=>{
                //     this.dequeue();
                //     if(callback) callback.call(this);
                // }, this);
                // timer.start();
            };
            this.waitMethods.push(waitmethod);
            this.enqueue(waitmethod);
            return this;
        };
        /** 等待动画,通过发送标记继续动画 */
        Animation.prototype.waitByFlag = function () {
            return this;
        };
        /** 暂停/继续播放当前动画 */
        Animation.prototype.pauseAni = function () {
            if (this.isRuning && (!this.isPause)) {
                this.isPause = true;
                this.clearCurWait();
                console.log("暂停动画！");
            }
            else if (this.isRuning && this.isPause) {
                this.isPause = false;
                this.pasuseTime = null;
                //曾经的旧暂停代码，非常失败
                //当前思路：记录当前执行的动画，暂停接除后立刻继续调用该方法
                // if (this.curPlayFun) {
                //     this.curPlayFun.curFun.call(this, this.curPlayFun.curFunArg);
                //     this.curPlayFun = null;
                //     this.pasuseTime = null;
                // }
                console.log("重新运行动画！");
            }
            else {
                console.log("没有动画正在运行！");
            }
        };
        return Animation;
    }());
    MyAnimation.Animation = Animation;
    __reflect(Animation.prototype, "MyAnimation.Animation");
    /** 动画配置类 */
    var options = (function () {
        function options(duration, easing) {
            /** 持续时间 */
            this._duration = 1000;
            /** 缓动方法 */
            this._easing = MyAnimation.Tween.Linear;
            this._duration = duration;
            if (easing)
                this._easing = easing;
        }
        Object.defineProperty(options.prototype, "duration", {
            get: function () {
                return this._duration;
            },
            set: function (value) {
                this._duration = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(options.prototype, "easing", {
            get: function () {
                return this._easing;
            },
            set: function (value) {
                this._easing = value;
            },
            enumerable: true,
            configurable: true
        });
        return options;
    }());
    MyAnimation.options = options;
    __reflect(options.prototype, "MyAnimation.options");
})(MyAnimation || (MyAnimation = {}));
//# sourceMappingURL=Animation.js.map