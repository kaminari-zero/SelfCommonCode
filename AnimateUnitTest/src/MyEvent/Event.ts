namespace MyEventManager{
    /**
     * 事件对象缓存池
     */
    export const EventPool:Event[] = [];
    /**
     * 事件
     */
    export class Event{
        /** 事件目标 */
        public target;

        /** 该事件的绑定数据 */
        public data;

        /** 事件的类型（事件名） */
        public type:string;

        public constructor(type,target=null,data=null){
            this.init(type,target,data);
        }

        /** 初始化 */
        private init(type,target,data){
            this.type = type;
            this.target = target;
            this.data = data;
        }

        /** 注销 */
        private destory(){
            this.target = this.data = null;
        }

        /** 从对象池中取出或创建一个新的事件实例 */
        public static create(type:string,target=null,data=null){
            let event:Event;
            if(EventPool.length){
                event = EventPool.pop();
                event.init(type,target,data);
            } else {
                event = new Event(type,target,data);
            }

            return event;
        }

        /** 释放一个事件对象，并缓存到对象池 */
        public static release(event:Event){
            //我觉得需要event事件完全执行完后，才释放它所有信息
            event.destory();
            EventPool.push(event);
        }
    }
}