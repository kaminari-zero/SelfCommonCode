namespace JQueryAnimation {
    // 实现一些自定义动画
    ;
    (function (window) {
        const Animate = window['Animate'];
        if (!Animate) {
            console.log('请首先引入myanimate.js');
            return;
        }
        const effects = {
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
            let curEffect = effects[effectName];
            if (!curEffect) {
                return;
            }
            let sequence = [];
            let defaultDuration = curEffect.defaultDuration;
            curEffect.calls.forEach((item, index) => {
                let propMap = item[0];
                let duration = item[1] ? item[1] * defaultDuration : defaultDuration;
                let options = item[2] || {};
                options.duration = duration;
                sequence.push({
                    e: this.dom,
                    p: propMap,
                    o: options
                });
            });
            Animate.runsequence(sequence);
        };

    })(window);

}