var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var MyEventManager;
(function (MyEventManager) {
    /**
     * 事件对象缓存池
     */
    MyEventManager.EventPool = [];
    /**
     * 事件
     */
    var Event = (function () {
        function Event(type, target, data) {
            if (target === void 0) { target = null; }
            if (data === void 0) { data = null; }
            this.init(type, target, data);
        }
        /** 初始化 */
        Event.prototype.init = function (type, target, data) {
            this.type = type;
            this.target = target;
            this.data = data;
        };
        /** 注销 */
        Event.prototype.destory = function () {
            this.target = this.data = null;
        };
        /** 从对象池中取出或创建一个新的事件实例 */
        Event.create = function (type, target, data) {
            if (target === void 0) { target = null; }
            if (data === void 0) { data = null; }
            var event;
            if (MyEventManager.EventPool.length) {
                event = MyEventManager.EventPool.pop();
                event.init(type, target, data);
            }
            else {
                event = new Event(type, target, data);
            }
            return event;
        };
        /** 释放一个事件对象，并缓存到对象池 */
        Event.release = function (event) {
            //我觉得需要event事件完全执行完后，才释放它所有信息
            event.destory();
            MyEventManager.EventPool.push(event);
        };
        return Event;
    }());
    MyEventManager.Event = Event;
    __reflect(Event.prototype, "MyEventManager.Event");
})(MyEventManager || (MyEventManager = {}));
//# sourceMappingURL=Event.js.map