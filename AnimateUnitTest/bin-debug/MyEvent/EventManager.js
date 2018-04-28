var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var MyEventManager;
(function (MyEventManager) {
    var EventManager = (function () {
        function EventManager() {
        }
        return EventManager;
    }());
    MyEventManager.EventManager = EventManager;
    __reflect(EventManager.prototype, "MyEventManager.EventManager");
})(MyEventManager || (MyEventManager = {}));
//# sourceMappingURL=EventManager.js.map