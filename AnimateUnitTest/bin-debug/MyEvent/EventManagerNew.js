var MyEventManager;
(function (MyEventManager) {
    /** 事件的运行模式 */
    var EventRunMode;
    (function (EventRunMode) {
        /** 默认的 */
        EventRunMode[EventRunMode["default"] = 0] = "default";
        /** 仅一次的 */
        EventRunMode[EventRunMode["once"] = 1] = "once";
        /** 循环的 */
        EventRunMode[EventRunMode["loop"] = 2] = "loop";
    })(EventRunMode = MyEventManager.EventRunMode || (MyEventManager.EventRunMode = {}));
    /** 事件的运行状态 */
    var EventRunState;
    (function (EventRunState) {
        /** 停止 */
        EventRunState[EventRunState["stop"] = 3] = "stop";
        /** 运行中 */
        EventRunState[EventRunState["runing"] = 4] = "runing";
        /** 运行结束 */
        EventRunState[EventRunState["end"] = 5] = "end";
        /** 同步运行 */
        EventRunState[EventRunState["synchronization"] = 6] = "synchronization";
        /** 异步 */
        EventRunState[EventRunState["asynchronous"] = 7] = "asynchronous";
        /** 执行下一个 */
        EventRunState[EventRunState["next"] = 8] = "next";
    })(EventRunState = MyEventManager.EventRunState || (MyEventManager.EventRunState = {}));
})(MyEventManager || (MyEventManager = {}));
//# sourceMappingURL=EventManagerNew.js.map