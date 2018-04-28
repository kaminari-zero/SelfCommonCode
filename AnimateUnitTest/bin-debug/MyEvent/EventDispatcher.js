var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var MyEventManager;
(function (MyEventManager) {
    /**
     * 事件管理器
     */
    var EventHandle = (function () {
        function EventHandle(type, listener, thisObj) {
            this.type = type;
            this.listener = listener;
            this.thisObj = thisObj;
        }
        Object.defineProperty(EventHandle.prototype, "listener", {
            get: function () {
                return this._listener;
            },
            set: function (listener) {
                this._listener = listener;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EventHandle.prototype, "thisObj", {
            get: function () {
                return this._thisObject;
            },
            set: function (target) {
                this._thisObject = target;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EventHandle.prototype, "type", {
            get: function () {
                return this._type;
            },
            set: function (type) {
                this._type = type;
            },
            enumerable: true,
            configurable: true
        });
        return EventHandle;
    }());
    __reflect(EventHandle.prototype, "EventHandle");
    /**
     * 简单式事件调度
     */
    var EventScheduler = (function () {
        function EventScheduler() {
            /**
             * 事件管理器
             */
            this.EventHandler = {};
        }
        /**
         * 注册事件
         * type:事件的类型,可以直接是事件名,也可以是一个Event;
         * listener:注册监听的方法;
         * thisObj:注册的监听的方法的this的引用;
         * priority:事件优先级,暂不使用
         */
        EventScheduler.prototype.registerEvent = function (type, listener, thisObj, priority) {
            var eventType = this.getType(type);
            //判断事件处理数组是否有该类型事件
            if (!this.EventHandler[eventType]) {
                //每个事件处理器可以注册监听多个方法
                this.EventHandler[eventType] = [];
            }
            var eventHandle = new EventHandle(type, listener, thisObj);
            this.EventHandler[eventType].push(eventHandle);
        };
        /**
         * 广播事件
         * type:事件的类型,可以直接是事件名,也可以是一个Event;
         * data:事件的携带数据;
         * targetObj:事件广播者(发起的目标)
         */
        EventScheduler.prototype.sendEvent = function (type, data, targetObj) {
            if (data === void 0) { data = null; }
            var eventType = this.getType(type);
            var handler = this.EventHandler[eventType];
            //如果不存在，则创建一个Event的控制器
            var event = this.getEvent(type);
            event.data = data;
            event.target = targetObj;
            if (!handler) {
                // Event.release(Event.create(eventType));
                this.EventHandler[eventType] = [];
            }
            if (handler instanceof Array) {
                //在同一个事件类型下的可能存在多种处理事件，找出本次需要处理的事件
                for (var i = 0; i < handler.length; i++) {
                    //执行触发
                    var eventHandle = handler[i];
                    // if (typeof type === "string") {
                    //     eventHandle.listener.call(eventHandle.thisObj, data);
                    // } else {
                    //     eventHandle.listener.call(eventHandle.thisObj, type);
                    // }
                    eventHandle.listener.call(eventHandle.thisObj, event);
                }
            }
        };
        /**
         * 注销事件
         * type:事件的类型,可以直接是事件名,也可以是一个Event;
         * listener:要销毁的监听的方法;
         * thisObj:要销毁的监听的方法的this的引用;
         */
        EventScheduler.prototype.removeEvent = function (type, listener, thisObj) {
            var eventType = this.getType(type);
            var event = this.getEvent(type);
            var handler = this.EventHandler[eventType];
            if (handler instanceof Array) {
                for (var i = 0; i < handler.length; i++) {
                    var _handle = handler[i];
                    if (_handle.listener === listener && _handle.thisObj === thisObj) {
                        //先提前与引用对象断开连接
                        _handle.thisObj = _handle.listener = null;
                        //删除处理事件
                        handler.splice(i, 1);
                        if (typeof type !== "string") {
                            //缓存event
                            MyEventManager.Event.release(event);
                        }
                        //以后再考虑缓存handler
                        //考虑判断一下:如果当前length是0的话,考虑将注册事件类型也删除
                        if (!handler.length)
                            delete this.EventHandler[eventType];
                        break;
                    }
                }
            }
        };
        /** 注销自身所有事件 */
        EventScheduler.prototype.removeEventAll = function () {
            //主要是和引用对象链接断开
            for (var eventType in (this.EventHandler)) {
                var eventHandler = this.EventHandler[eventType];
            }
        };
        /**
         * 只执行一次的的事件
         * type:事件的类型,可以直接是事件名,也可以是一个Event;
         * listener:注册监听的方法;
         * thisObj:注册的监听的方法的this的引用;
         */
        EventScheduler.prototype.once = function (type, listener, thisObj) {
            var _this = this;
            //将once的监视事件方法，封装成一个临时事件
            var tempListener = function () {
                var event = _this.getEvent(type);
                listener.call(thisObj, event);
                var eventHandle = new EventHandle(type, tempListener, thisObj);
                _this.sendEvent(EventScheduler.EVENT_TYPE.END, eventHandle, _this);
            };
            this.registerEvent(type, tempListener, thisObj);
            //注册一个结束
            this.registerEvent(EventScheduler.EVENT_TYPE.END, this.onEndRemove, this);
        };
        /** 移除End事件的方法 */
        EventScheduler.prototype.onEndRemove = function (event) {
            this.removeEvent(event.data.type, event.data.listener, event.data.thisObj);
            this.removeEvent(EventScheduler.EVENT_TYPE.END, this.onEndRemove, this);
        };
        /** 可以为一个对象注册多个事件，然后该对象每次收到对应消息时，按顺序循环执行注册的事件 */
        /** 实现思路:循环队列,每次执行一次时间从中取出一个执行,然后放到结尾 */
        /**
         * 检查某事件名是否存在于事件管理器中
         * type:事件的类型,可以直接是事件名,也可以是一个Event;
         * listener:注册监听的方法;
         * thisObj:注册的监听的方法的this的引用;
         */
        EventScheduler.prototype.checkIsEvent = function (type, listener, targetObj) {
            var handler = this.checkIsEventType(type);
            if (listener === undefined || listener === null) {
                return handler ? true : false;
            }
            return this.checkIsRegisterListener(handler, listener, targetObj);
        };
        /** 检查某事件是否有注册,若有注册则返回一个handler集合,若无则返回null */
        EventScheduler.prototype.checkIsEventType = function (type) {
            var eventType = this.getType(type);
            var handler = this.EventHandler[eventType];
            if (handler instanceof Array) {
                return handler;
            }
            return null;
        };
        /** 检查某方法是否注册于该事件管理器名下 */
        EventScheduler.prototype.checkIsRegisterListener = function (handler, listener, targetObj) {
            if (targetObj === void 0) { targetObj = null; }
            if (handler instanceof Array) {
                if (targetObj !== undefined || targetObj !== null) {
                    for (var i = 0; i < handler.length; i++) {
                        var _handle = handler[i];
                        if (_handle.listener === listener && _handle.thisObj === targetObj) {
                            return true;
                        }
                    }
                }
                else {
                    for (var i = 0; i < handler.length; i++) {
                        var _handle = handler[i];
                        if (_handle.listener === listener) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        /** 获得事件类型 */
        EventScheduler.prototype.getType = function (type) {
            var eventType = "";
            if (typeof type === "string") {
                eventType = type;
            }
            else if (type instanceof MyEventManager.Event) {
                eventType = type.type;
            }
            return eventType;
        };
        /** 根据名字获得一个event对象,或者新建一个event对象 */
        EventScheduler.prototype.getEvent = function (type) {
            // let eventType: string = "";
            if (typeof type === "string") {
                // eventType = type;
                return MyEventManager.Event.create(type);
            }
            else if (type instanceof MyEventManager.Event) {
                return type;
            }
            // return eventType;
        };
        return EventScheduler;
    }());
    /**
     * 内部常用事件名
     */
    EventScheduler.EVENT_TYPE = {
        COMPLETE: "complete",
        FALI: "fali",
        SUCCESS: "success",
        END: "end",
        START: "start",
        RUNNING: "running",
    };
    MyEventManager.EventScheduler = EventScheduler;
    __reflect(EventScheduler.prototype, "MyEventManager.EventScheduler");
})(MyEventManager || (MyEventManager = {}));
//# sourceMappingURL=EventDispatcher.js.map