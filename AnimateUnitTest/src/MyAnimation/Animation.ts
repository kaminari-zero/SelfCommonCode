namespace MyAnimation {
    export class Animation {
        /** 操作的对象元素 */
        public dom;
        /** 动画队列 */
        private queue = [];
        /** 动画计时器的id */
        private reqId;

        //=====================当前运行状态信息，以后需要整理成枚举===================
        /** 是否正则运行 */
        private isRuning = false;
        /** 是否暂停 */
        private isPause = false;
        /** 动画是否结束 */
        private toEnd = false;
        /** 当前动画是否结束 */
        private toCurEnd = false;

        //========================记录操作对象的元素属性==========================
        /** 改变的元素属性 */
        private propchanges = {};
        /** 记录初始的元素属性 */
        private initprops = {};
        /** 记录当前的属性的值 */
        private curprops = {};

        //=====================等待相关信息，以后需要封装起来=========================
        /** 记录当前的等待时间 */
        private waitTime: number = 0;
        /** 可做一个记录所有等待事件的数组，需要将其全部移除，或者做一个等待标记 */
        private waitMethods = [];
        /** 记录当前等待计时器id */
        private waitId = null;
        /** 记录当前等待事件，当前有等待事件被停止时，立刻执行完等待事件 */
        private waitComplateFun: Function;

        //========================暂停相关的信息=========================
        /** 暂停时的时间 */
        private pasuseTime: number = null;
        /** 记录当前播放的动画，原本是为了暂停使用，先暂时废弃 */
        private curPlayFun: { curFun: Function, curFunArg: any };

        /** 动画配置项 */
        public options: options | { duration?: number, easing?: Function };

        public constructor(el) {
            this.init(el);
        }

        //==========================对象生命周期相关方法===============================

        /** 初始化 */
        private init(el) {
            /** 目前没必要，必要的初始化，成员变量和构造器都做了,可以用来重置整个动画使用 */
            this.dom = el;
            return this;
        }

        /** 重置当前animation,如果当前等待就结束等待，后面动画不执行，如果当前运行就结束运行（这个做得不好） */
        public reset() {
            //如果当前有动画执行，停止所以动画
            if(this.isRuning){
                this.clearCurWait();
                if (this.reqId) {
                    this.complete();
                }
            }

            this.queue = [];
            this.toEnd = false;
            return this;
        }

        /** 清除当前对象所有绑定，注销对象 */
        public destory(){

        }

        /** 初始化动画 */
        private initAnimation(props, opts) {
            if (opts instanceof options)
                this.options = opts;
            else {
                this.options.duration = (opts && opts.duration) || 1000;
                this.options.easing = (opts && opts.easing) || Tween.Linear;
            }

            //属性值必须是{}格式的对象字面量
            if (props instanceof Object == false) return;

            //重置属性记录
            this.propchanges = {};
            this.initprops = {};
            this.curprops = {};

            //指定开始值和结束值
            for (let prop in props) {
                //为每一个属性定制各自的开始结束值
                this.propchanges[prop] = {};
                if (Array.isArray(props[prop])) { //定义了初始值，结束值的属性
                    this.propchanges[prop]['from'] = this.initprops[prop] = this.curprops[prop]
                        = props[prop][0];//获取当前元素的属性值
                    this.propchanges[prop]['to'] = props[prop][1];
                } else { //普通的json格式
                    this.propchanges[prop]['from'] = this.initprops[prop] = this.curprops[prop]
                        = this.dom[prop];//获取当前元素的属性值
                    this.propchanges[prop]['to'] = props[prop];
                }
            }
            // console.log("打印this.propchanges",this.propchanges);
            return this;
        }

        //==========================对象内基本操作方法============================

        /** 动画播放 */
        private async play(callback?) {
            // console.log("play");
            this.isRuning = true;
            
            //开始时间
            let startTime = 0;
            //记录暂停时间
            let pasueTime = this.pasuseTime ? this.pasuseTime : 0;
            //通过时间
            let passedTime = 0;

            //曾经的旧暂停代码，非常失败
            // //开始时间
            // let startTime = pasueTime;

            //若执行时还存在计时器id则删除
            // if (this.reqId) {
            //     this.stop();
            // }
            //......貌似这动画同步是通过then方式完成的
            let promise = new Promise((resolve, reject) => {
                let step = (timestamp) => {
                    //实现暂停功能
                    if (!this.isPause) { //如果不是暂停的话
                        var curTime = timestamp || nowtime();
                        // console.log(curTime);
                        //开始时间非0的话
                        if (!startTime) startTime = curTime;
                        //计算已经通过的时间
                        passedTime = Math.min(curTime - startTime + pasueTime, this.options.duration);
                        //实现finish功能
                        if (this.toEnd || this.toCurEnd) passedTime = this.options.duration;

                        //更新目标的属性值
                        for (let prop in this.propchanges) {
                            //easing的四个基本参数：当前时间，初始值，变化量，持续时间
                            this.dom[prop] = this.curprops[prop]
                                = this.options.easing(passedTime, this.propchanges[prop]['from'], this.propchanges[prop]['to'] - this.propchanges[prop]['from'], this.options.duration);
                                //曾经的旧暂停代码，非常失败
                                // = this.options.easing(passedTime, this.propchanges[prop]['from'], this.propchanges[prop]['to'] - this.propchanges[prop]['from'], this.options.duration - pasueTime);
                            // console.log("this.dom[prop]",this.dom[prop],"passedTime",passedTime);
                        }
                        if (passedTime >= this.options.duration) {
                            this.complete();
                            // this.dequeue(); //感觉放入complete好点
                            //完成的标记
                            resolve();
                        } else { //未完成继续自动执行
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
                            this.reqId = setTimeout(step, 10);
                        }
                    } else { //如果是暂停的话
                        startTime = nowtime();
                        pasueTime = passedTime;
                        // this.options.duration = Math.min(this.options.duration-pasueTime, 0);
                        this.reqId = setTimeout(step, 10); //什么都不执行，直到暂停解除
                    }
                };
                //自动执行step
                // this.reqId = setTimeout(step, 10);
                this.reqId = setTimeout(step, 10);
            });

            if (callback) {
                return promise.then(() => {
                    callback.call(this);
                });
            }

            return promise;
        }

        /** 动画完成 */
        private complete() {
            //清除计时器标记
            if (this.reqId)
                clearTimeout(this.reqId);

            this.isRuning = false;
            this.reqId = null;
            //重置当前的动画标记
            this.toCurEnd = false;
            this.dequeue();
            return this;
        }

        // 如果当前有动画正在执行，那么动画队列的首个元素一定是'run'
        // 动画函数出队之后，开始执行前，立即在队列头部添加一个'run'元素，代表动画函数正在执行
        // 只有当对应动画函数执行完之后，才会调用出队操作，原队首的'run'元素才可以出队
        // 如果动画函数执行完毕，调用出队操作之后，动画队列中还有下一个动画函数，下一个动画函数出队后，执行之前，依旧将队列头部置为'run'，重复上述操作
        // 如果动画函数执行完毕，调用出队操作之后，动画队列中没有其他动画函数，那么队首的‘run’元素出队之后，队列为空
        // 首次入队时，动画队列的首个元素不是'run'，动画立即出队执行
        /** 动画入队 （方式一） */
        private enqueue(fn) {
            // console.log("enqueue",fn);
            this.queue.push(fn);
            if (this.queue[0] !== 'run') {
                this.dequeue();
            }
        }

        /** 动画出队 */
        private dequeue() {
            while (this.queue.length) {
                // console.log("dequeue",this.queue.length);
                //当前动画
                let curItem = this.queue.shift();
                //如果当前队头是方法，不是run标记
                if (typeof curItem === 'function') {
                    curItem.call(this); //这是异步动画操作
                    //标记上run在队头
                    this.queue.unshift('run');
                    // break;
                    return curItem; //返回当前出队的方法（目前暂时没利用）
                }
            }
        }

        /** 去除一个数组中与另一个数组中的值相同的元素 */
        private array_diff(a, b) {
            for (var i = 0; i < b.length; i++) {
                for (var j = 0; j < a.length; j++) {
                    if (a[j] === b[i]) {
                        a.splice(j, 1);
                        j = j - 1;
                    }
                }
            }
            return a;
        }

        /** 清除当前等待 */
        private clearCurWait() {
            if (this.waitId) {
                if (this.waitComplateFun) this.waitComplateFun.call(this);
                clearTimeout(this.waitId);
                this.waitId = null;
                console.log("立即结束当前等待，直接完成等待事件");
                this.dequeue();
            }
        }

        /** 把当前执行方法再次放入队列中？ */

        //========================= 对外接口(方法)===========================
        /** 开始动画 */
        public animate(props, opts, callback = null) {
            this.enqueue(() => {
                // console.log("回调enqueue的fn");
                this.initAnimation(props, opts);
                this.play(callback);
            });
            return this;
        }

        /** 
         * 直接完成动画,如果当前有等待就立即完成，后面的等待全部忽略
         */
        public finish() {
            this.toEnd = true;
            this.waitTime = 0;
            this.clearCurWait();
            //删除等待事件
            this.array_diff(this.queue, this.waitMethods);
            console.log("直接完成动画！");
            return this;
        }

        /** 完成当前的动画,如果当前有等待就立即完成 */
        public finishCurAni() {
            this.toCurEnd = true;
            this.clearCurWait();
            console.log("直接完成当前动画！");
            return this;
        }

        /** 恢复成原来状态 */
        public reverse(callback: Function = null) {
            if (this.initprops) this.animate(this.initprops, this.options, callback);
            else console.log("尚未调用任何动画，不能复位");
            return this;
        }

        /** 等待动画 */
        public wait(time: number = 1000, callback?: Function) {
            this.waitTime = time;
            let waitmethod = () => {
                if (callback) {
                    this.waitComplateFun = callback;
                }
                console.log("等待ing！");
                this.waitId = setTimeout(() => {
                    // if(callback) callback.call(this);
                    if (callback) {
                        // this.waitComplateFun = callback;
                        this.waitComplateFun.call(this);
                        this.waitId = null;
                        this.array_diff(this.waitMethods, [waitmethod]);
                    }
                    // console.log("",this)
                    //问题：关于call的问题：
                    //箭头函数不会绑定this，该this应该是指定类对象本身
                    //结果：箭头函数不会绑定this，也不会被call改变this指向
                    this.dequeue();
                }, this.waitTime);
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
        }

        /** 等待动画,通过发送标记继续动画 */
        public waitByFlag(){

            return this;
        }

        /** 暂停/继续播放当前动画 */
        public pauseAni() {
            if (this.isRuning && (!this.isPause)) {
                this.isPause = true;
                this.clearCurWait();
                console.log("暂停动画！");
            } else if (this.isRuning && this.isPause) {
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
            } else {
                console.log("没有动画正在运行！");
            }
        }

    }

    /** 动画配置类 */
    export class options {
        /** 持续时间 */
        private _duration: number = 1000;
        public set duration(value) {
            this._duration = value;
        }
        public get duration() {
            return this._duration;
        }

        /** 缓动方法 */
        private _easing: Function = Tween.Linear;
        public set easing(value) {
            this._easing = value;
        }
        public get easing() {
            return this._easing;
        }

        public constructor(duration: number, easing?: Function) {
            this._duration = duration;
            if (easing) this._easing = easing;
        }
    }

}