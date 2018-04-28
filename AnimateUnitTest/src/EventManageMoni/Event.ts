namespace EventMoni {
    //直接量处理js自定义事件
    var eventTarget = {
        //保存事件类型，处理函数数组映射
        handlers: {},
        //注册给定类型的事件处理程序，
        //type -> 自定义事件类型， handler -> 自定义事件回调函数
        addEvent: function (type, handler) {
            //判断事件处理数组是否有该类型事件
            if (eventTarget.handlers[type] == undefined) {
                eventTarget.handlers[type] = [];
            }
            //将处理事件push到事件处理数组里面
            eventTarget.handlers[type].push(handler);
        },

        //触发一个事件
        //event -> 为一个js对象，属性中至少包含type属性，
        //因为类型是必须的，其次可以传一些处理函数需要的其他变量参数。（这也是为什么要传js对象的原因）
        fireEvent: function (event) {
            //判断是否存在该事件类型
            if (eventTarget.handlers[event.type] instanceof Array) {
                var _handler = eventTarget.handlers[event.type];
                //在同一个事件类型下的可能存在多种处理事件，找出本次需要处理的事件
                for (var i = 0; i < _handler.length; i++) {
                    //执行触发
                    _handler[i](event);
                }
            }
        },
        
        //注销事件
        //type -> 自定义事件类型， handler -> 自定义事件回调函数
        removeEvent: function (type, handler) {
            if (eventTarget.handlers[type] instanceof Array) {
                var _handler = eventTarget.handlers[type];
                //在同一个事件类型下的可能存在多种处理事件，找出本次需要处理的事件
                for (var i = 0; i < _handler.length; i++) {
                    //找出本次需要处理的事件下标
                    if (_handler[i] == handler) {
                        break;
                    }
                }
                //删除处理事件
                _handler.splice(i, 1);
            }
        }
    };
}