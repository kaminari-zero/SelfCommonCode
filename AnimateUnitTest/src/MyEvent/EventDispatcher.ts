namespace MyEventManager {
    /**
     * 事件管理器
     */
    class EventHandle {
        /** 注册方法 */
        private _listener: Function;
        /** 绑定对象 */
        private _thisObject;
        /** 事件类型 */
        private _type: string | Event;
        /** 该注册事件的优先级 */
        private _priority:number = 0;

        public set listener(listener: Function) {
            this._listener = listener;
        }
        public get listener() {
            return this._listener;
        }

        public set thisObj(target) {
            this._thisObject = target;
        }
        public get thisObj() {
            return this._thisObject;
        }

        public set type(type) {
            this._type = type;
        }
        public get type() {
            return this._type;
        }

        public set priority(priority) {
            this._priority = priority;
        }
        public get priority() {
            return this._priority;
        }

        public constructor(type, listener, thisObj) {
            this.type = type;
            this.listener = listener;
            this.thisObj = thisObj;
        }
    }

    /**
     * 简单式事件调度
     */
    export class EventScheduler {
        /**
         * 内部常用事件名
         */
        private static EVENT_TYPE = {
            COMPLETE: "complete",
            FALI: "fali",
            SUCCESS: "success",
            END: "end",
            START: "start",
            RUNNING: "running",
        }
        /**
         * 事件管理器
         */
        private EventHandler = {};
        /** 
         * 注册事件 
         * type:事件的类型,可以直接是事件名,也可以是一个Event;
         * listener:注册监听的方法;
         * thisObj:注册的监听的方法的this的引用;
         * priority:事件优先级,暂不使用(该优先级是,广播一个事件,)
         */
        public registerEvent(type: string | Event, listener: Function, thisObj, priority?: number) {
            //增加事件优先级设置
            priority = +priority | 0;
            //插入的目标
            let insertIndex = -1;

            let eventType: string = this.getType(type);
            let event = this.getEvent(type);
            //判断事件处理数组是否有该类型事件
            let handler:EventHandle[] = this.EventHandler[eventType];
            if (!handler) {
                //每个事件处理器可以注册监听多个方法
                handler = [];
            }
            let eventHandle = new EventHandle(event, listener, thisObj);

            //增加事件优先级设置
            let length = handler.length;

            if(length >0){
                for(var i=0;i<length;i++){
                    //如果是同一个方法,同一个对象,同一个事件类型,该事件不注册
                    let _handle:EventHandle = handler[i];
                    if(_handle.type === type && _handle.listener === listener && _handle.thisObj === thisObj){
                        return;  //暂时未做任何失败时处理
                    }
                    if(insertIndex === -1 && priority > _handle.priority){
                        insertIndex = i;
                        break;
                    }
                }
                if(insertIndex !== -1){
                    //将注册事件插入指定位置
                    eventHandle.priority = priority;
                    handler.splice(i,0,eventHandle);
                } else {
                    handler.push(eventHandle);
                }
            } else { //若该事件管理器内无注册事件时,直接添加就行了,其priority默认为0
                handler.push(eventHandle);
            }

        }

        /** 
         * 广播事件
         * type:事件的类型,可以直接是事件名,也可以是一个Event;
         * data:事件的携带数据;
         * targetObj:事件广播者(发起的目标)
         */
        public sendEvent(type: string | Event, data = null, targetObj?) {
            let eventType: string = this.getType(type);
            let handler = this.EventHandler[eventType];
            //如果不存在，则创建一个Event的控制器
            let event = this.getEvent(type,targetObj,data);
            event.data = data;
            event.target = targetObj;
            if (!handler) {
                // Event.release(Event.create(eventType));
                this.EventHandler[eventType] = [];
            }
            if (handler instanceof Array) {

                //在同一个事件类型下的可能存在多种处理事件，找出本次需要处理的事件
                for (let i = 0; i < handler.length; i++) {
                    //执行触发
                    let eventHandle: EventHandle = handler[i];
                    // if (typeof type === "string") {
                    //     eventHandle.listener.call(eventHandle.thisObj, data);
                    // } else {
                    //     eventHandle.listener.call(eventHandle.thisObj, type);
                    // }
                    eventHandle.listener.call(eventHandle.thisObj, event);
                }

            }
        }

        /** 
         * 注销事件 
         * type:事件的类型,可以直接是事件名,也可以是一个Event,如果只有type,则删除该事件注册的所有注册事件;
         * listener:要销毁的监听的方法,如果有方法,则删除注册该事件的方法;
         * thisObj:要销毁的监听的方法的this的引用,如果有指定对象,则删除在该对象注册的该事件的方法;
         * 若都有,则是删除指定对象上的指定事件的注册方法.(方法在预约制作ing)
         */
        public removeEvent(type: string | Event, listener: Function, thisObj) {
            let eventType: string = this.getType(type);
            let event = this.getEvent(type);
            let handler = this.EventHandler[eventType];
            if (handler instanceof Array) {
                for (let i = 0; i < handler.length; i++) {
                    let _handle: EventHandle = handler[i];
                    if (_handle.listener === listener && _handle.thisObj === thisObj) {
                        //先提前与引用对象断开连接
                        _handle.thisObj = _handle.listener = null;
                        //删除处理事件
                        handler.splice(i, 1);
                        if (typeof type !== "string") {
                            //缓存event
                            Event.release(event);
                        }
                        //以后再考虑缓存handler
                        //考虑判断一下:如果当前length是0的话,考虑将注册事件类型也删除
                        if (!handler.length)
                            delete this.EventHandler[eventType];
                        break;
                    }
                }
            }
        }

        /** 目前先把上面的方法,分解成以下注销事件方法(之后想到好的方式,解决代码冗余才做了) */
        public removeEventByEvent(type: string | Event){

        }

        public removeEventByListener(type: string | Event, listener: Function){

        }

        public removeEventByTarget(type: string | Event, thisObj){

        }

        /** 注销自身所有事件 */
        public removeEventAll() {
            //主要是和引用对象链接断开
            for (let eventType in (this.EventHandler)) {
                let handler: any[] = this.EventHandler[eventType];
                if (handler instanceof Array) {
                    for (let i = 0; i < handler.length; i++) {
                        let _handle: EventHandle = handler[i];
                        //先提前与引用对象断开连接
                        _handle.thisObj = _handle.listener = null;
                        //删除处理事件
                        handler.splice(i, 1);
                        if (_handle.type instanceof Event) {
                            //缓存event
                            Event.release(_handle.type);
                        }
                        //以后再考虑缓存handler
                        //考虑判断一下:如果当前length是0的话,考虑将注册事件类型也删除
                        if (!handler.length)
                            delete this.EventHandler[eventType];
                    }
                }
            }
        }

        /** 分离的移除事件的方法,想到办法一:中间给做个回调,将固定的几个回调方法写成一个常量列表,通过放入哪个使用哪个方法 */
        // private remove(handler:EventHandle[],parmes:{event?:Event,listener?:Function,thisObj?:any}){
        //     if (handler instanceof Array) {
        //         for (let i = 0; i < handler.length; i++) {
        //             let _handle: EventHandle = handler[i];
        //             // if (_handle.listener === parmes.listener && _handle.thisObj === parmes.thisObj) {
        //                 //先提前与引用对象断开连接
        //                 _handle.thisObj = _handle.listener = null;
        //                 //删除处理事件
        //                 handler.splice(i, 1);
        //                 //缓存event
        //                 Event.release(parmes.event);
        //                 //以后再考虑缓存handler
        //                 //考虑判断一下:如果当前length是0的话,考虑将注册事件类型也删除
        //                 // if (!handler.length)
        //                 //     delete this.EventHandler[eventType];
        //                 break;
        //             // }
        //         }
        //     }
        // }

        /** 
         * 只执行一次的的事件 
         * type:事件的类型,可以直接是事件名,也可以是一个Event;
         * listener:注册监听的方法;
         * thisObj:注册的监听的方法的this的引用;
         */
        public once(type: string | Event, listener: Function, thisObj) {
            //将once的监视事件方法，封装成一个临时事件
            let tempListener = () => {
                let event = this.getEvent(type);
                listener.call(thisObj, event);
                let eventHandle = new EventHandle(type, tempListener, thisObj);
                this.sendEvent(EventScheduler.EVENT_TYPE.END, eventHandle, this);
            }
            this.registerEvent(type, tempListener, thisObj);
            //注册一个结束
            this.registerEvent(EventScheduler.EVENT_TYPE.END, this.onEndRemove, this);
        }

        /** 移除End事件的方法 */
        private onEndRemove(event: Event) {
            this.removeEvent(event.data.type, event.data.listener, event.data.thisObj);
            this.removeEvent(EventScheduler.EVENT_TYPE.END, this.onEndRemove, this);
        }

        /** 可以为一个对象注册多个事件，然后该对象每次收到对应消息时，按顺序循环执行注册的事件 */
        /** 实现思路:循环队列,每次执行一次时间从中取出一个执行,然后放到结尾 */


        /** 
         * 检查某事件名是否存在于事件管理器中 
         * type:事件的类型,可以直接是事件名,也可以是一个Event;
         * listener:注册监听的方法;
         * thisObj:注册的监听的方法的this的引用;
         */
        public checkIsEvent(type: string | Event, listener?: Function, targetObj?): boolean {
            let handler = this.checkIsEventType(type);
            if (listener === undefined || listener === null) {
                return handler ? true : false;
            }
            return this.checkIsRegisterListener(handler, listener, targetObj);
        }

        /** 检查某事件是否有注册,若有注册则返回一个handler集合,若无则返回null */
        private checkIsEventType(type: string | Event): EventHandle[] {
            let eventType = this.getType(type);
            let handler = this.EventHandler[eventType];
            if (handler instanceof Array) {
                return handler;
            }
            return null;
        }

        /** 检查某方法是否注册于该事件管理器名下 */
        private checkIsRegisterListener(handler: EventHandle[], listener: Function, targetObj = null): boolean {
            if (handler instanceof Array) {
                if (targetObj !== undefined || targetObj !== null) {
                    for (let i = 0; i < handler.length; i++) {
                        let _handle: EventHandle = handler[i];
                        if (_handle.listener === listener && _handle.thisObj === targetObj) {
                            return true;
                        }
                    }
                } else {
                    for (let i = 0; i < handler.length; i++) {
                        let _handle: EventHandle = handler[i];
                        if (_handle.listener === listener) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        /** 获得事件类型 */
        private getType(type: string | Event) {
            let eventType: string = "";
            if (typeof type === "string") {
                eventType = type;
            } else if (type instanceof Event) {
                eventType = type.type;
            }
            return eventType;
        }

        /** 根据名字获得一个event对象,或者新建一个event对象 */
        private getEvent(type: string | Event,target=null,data=null): Event {
            // let eventType: string = "";
            if (typeof type === "string") {
                // eventType = type;
                return Event.create(type,target,data);
            } else if (type instanceof Event) {
                if(target == null && data == null){
                } else if(target == null){
                    type.data = data;
                } else if(data == null){
                    type.target = target;
                }
                return type;
            }
            // return eventType;
        }




        /** =====================一个备用滴全局管理器====================== */
        //立即加载
        private static instance:EventScheduler = new EventScheduler();

        public static getInstance():EventScheduler{
            if(!EventScheduler.instance){
                EventScheduler.instance = new EventScheduler();
            }

            return EventScheduler.instance;
        }
    }
}