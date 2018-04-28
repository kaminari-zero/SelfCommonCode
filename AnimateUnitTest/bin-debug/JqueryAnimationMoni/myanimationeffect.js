var JQueryAnimation;
(function (JQueryAnimation) {
    // 实现一些自定义动画
    ;
    (function (window) {
        var Animate = window['Animate'];
        if (!Animate) {
            console.log('请首先引入myanimate.js');
            return;
        }
        var effects = {
            "transition.slideUpIn": {
                defaultDuration: 900,
                calls: [
                    [{ opacity: [1, 0], translateY: [0, 20] }]
                ]
            },
            "transition.slideUpOut": {
                defaultDuration: 900,
                calls: [
                    [{ opacity: [0, 1], translateY: -20 }]
                ],
                reset: { translateY: 0 }
            },
            "transition.slideDownIn": {
                defaultDuration: 900,
                calls: [
                    [{ opacity: [1, 0], translateY: [0, -20] }]
                ]
            },
            "transition.slideDownOut": {
                defaultDuration: 900,
                calls: [
                    [{ opacity: [0, 1], translateY: 20 }]
                ],
                reset: { translateY: 0 }
            },
            "transition.slideLeftIn": {
                defaultDuration: 1000,
                calls: [
                    [{ opacity: [1, 0], translateX: [0, -20] }]
                ]
            },
            "transition.slideLeftOut": {
                defaultDuration: 1050,
                calls: [
                    [{ opacity: [0, 1], translateX: -20 }]
                ],
                reset: { translateX: 0 }
            },
            "transition.slideRightIn": {
                defaultDuration: 1000,
                calls: [
                    [{ opacity: [1, 0], translateX: [0, 20] }]
                ]
            },
            "transition.slideRightOut": {
                defaultDuration: 1050,
                calls: [
                    [{ opacity: [0, 1], translateX: 20, translateZ: 0 }]
                ],
                reset: { translateX: 0 }
            },
            "callout.pulse": {
                defaultDuration: 900,
                calls: [
                    [{ scaleX: 1.1 }, 0.50],
                    [{ scaleX: 1 }, 0.50]
                ]
            },
            'test': {
                defaultDuration: 2000,
                calls: [
                    [{ left: 200, opacity: 0.1 }, 0.5],
                    [{ opacity: 1 }, 0.5]
                ]
            }
        };
        Animate.runEffect = function (effectName) {
            var _this = this;
            var curEffect = effects[effectName];
            if (!curEffect) {
                return;
            }
            var sequence = [];
            var defaultDuration = curEffect.defaultDuration;
            curEffect.calls.forEach(function (item, index) {
                var propMap = item[0];
                var duration = item[1] ? item[1] * defaultDuration : defaultDuration;
                var options = item[2] || {};
                options.duration = duration;
                sequence.push({
                    e: _this.dom,
                    p: propMap,
                    o: options
                });
            });
            Animate.runsequence(sequence);
        };
    })(window);
})(JQueryAnimation || (JQueryAnimation = {}));
//# sourceMappingURL=myanimationeffect.js.map