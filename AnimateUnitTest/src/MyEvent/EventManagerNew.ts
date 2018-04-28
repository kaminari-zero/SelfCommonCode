namespace MyEventManager {
    /**
     * 重新设计:实现特定接口的事件结构(暂时不使用)
     */
    export interface EventListenerFW {
        /** 事件类型 */
        event_type: string;
        /** 注册事件方法队列 */
        event_queue: Function[];
        /** 事件的执行状态 */
        event_runType: EventRunState;
        /** 事件的执行模式 */
        event_runMode: EventRunMode;
        /** 方法执行优先级 */
        priority: number;

        /** 初始化 */
        init(...any);
        /** 添加一个注册方法到注册方法队列中 */
        addListener(listener: Function, thisObj);
        /** 从事件对列中移除一个指定注册方法 */
        removeListener(listener: Function, thisObj);
        /** 检查是否有某个注册事件在对列中 */
        checkIsEventListener(listener: Function, thisObj?);
        /** 替换指定注册事件 */
        updateEventListener(listener: Function, thisObj);
        /** 获得当前运行状态 */
        getCurState(): EventRunState;
        /** 释放资源 */
        destory();
    }
    /** 事件的运行模式 */
    export enum EventRunMode {
        /** 默认的 */
        default = 0,
        /** 仅一次的 */
        once = 1,
        /** 循环的 */
        loop = 2,

    }
    /** 事件的运行状态 */
    export enum EventRunState {
        /** 停止 */
        stop = 3,
        /** 运行中 */
        runing = 4,
        /** 运行结束 */
        end = 5,
        /** 同步运行 */
        synchronization = 6,
        /** 异步 */
        asynchronous = 7,
        /** 执行下一个 */
        next = 8
    }
}