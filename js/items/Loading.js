var Loading = Loading || ( function () {

        var $root, _sw, _sh, $canvas, _ctx, $loading,
            _mode = 0, _sw, _sh, _sw2, _sh2, _sw2H, _sh2H, _sw3H, _sh3H,
            _obj = {},
            _isPaused = 1;


        function init(root, canvas, sw, sh) {
            $root = root;
            $canvas = canvas;
            $loading = document.getElementById('loading');

            $root.appendChild($canvas);

            _isPaused = 0;
            draw();

            $root.style.visibility = 'visible';

            var start = 1, delay = 1.5, gap = 0.22,
                time = 0.6, ease = Expo.easeOut,
                dx1, dy1, dx2, dy2, dx3, dy3, dx4, dy4;

            /*
            TweenLite.to($loading, 0.4, {
                delay:delay - 0.5,
                css:{scale:0, rotation:-180},
                ease:Back.easeIn,
                easeParames:[3.2]
            });
            */

            TweenLite.delayedCall(start, function() {
                $loading.style.opacity = 0;
            });

            _sw = sw;
            _sh = sh;

            if (_sh > _sw) {
                _obj.x1 = _sw;
                _obj.y1 = _sh;
                _obj.x2 = _sw;
                _obj.y2 = _sh;
                _obj.x3 = _sw2;
                _obj.y3 = _sh2;
                _obj.x4 = _sw2;
                _obj.y4 = _sh2H;

                _obj.tx2 = 0;
                _obj.ty2 = _sh2;
                _obj.tx3 = _sw2;
                _obj.ty3 = _sh2;
                _obj.tx4 = _sw2;
                _obj.ty4 = _sh2 + _sh2H;

                dx1 = _sw;
                dy1 = _sh2;
                dx2 = _sw2;
                dy2 = _sh2;
                dx3 = _sw2;
                dy3 = _sh2H;
                dx4 = _sw2H;
                dy4 = _sh2H;
            } else {
                _obj.x1 = _sw;
                _obj.y1 = _sh;
                _obj.x2 = _sw;
                _obj.y2 = _sh;
                _obj.x3 = _sw2;
                _obj.y3 = _sh2;
                _obj.x4 = _sw2H;
                _obj.y4 = _sh2;

                _obj.tx2 = _sw2;
                _obj.ty2 = 0;
                _obj.tx3 = _sw2;
                _obj.ty3 = _sh2;
                _obj.tx4 = _sw3H;
                _obj.ty4 = _sh2;

                dx1 = _sw2;
                dy1 = _sh;
                dx2 = _sw;
                dy2 = _sh2;
                dx3 = _sw2H;
                dy3 = _sh2;
                dx4 = _sw2H;
                dy4 = _sh2H;
            }

            TweenLite.to(_obj, time, {
                delay:delay,
                x1:dx1,
                y1:dy1,
                ease:ease
            });

            TweenLite.to(_obj, time, {
                delay:delay + gap,
                x2:dx2,
                y2:dy2,
                ease:ease
            });

            TweenLite.to(_obj, time, {
                delay:delay + gap + gap,
                x3:dx3,
                y3:dy3,
                ease:ease
            });

            TweenLite.to(_obj, time, {
                delay:delay + gap + gap + gap,
                x4:dx4,
                y4:dy4,
                ease:ease,
                onComplete:endShow
            });
        }

        function endShow() {
            _isPaused = 1;
            CMUtiles.removeDom($loading);
            Index.endLoad();
        }

        function resize(ctx, sw, sh, sw2, sh2, sw2H, sh2H) {
            _ctx = ctx;
            _sw = sw;
            _sh = sh;
            _sw2 = sw2;
            _sh2 = sh2;
            _sw2H = sw2H;
            _sh2H = sh2H;
            _sw3H = _sw2 + _sw2H;
            _sh3H = _sh2 + _sh2H;
        }

        function draw() {
            if (_isPaused || !_ctx) return;
            requestAnimationFrame(draw);

            _ctx.fillStyle = CMDetect.colors[4];
            _ctx.fillRect(0 , 0, _sw, _sh);

            _ctx.fillStyle = CMDetect.colors[3];
            _ctx.fillRect(_obj.tx4 , _obj.ty4, _obj.x4, _obj.y4);

            _ctx.fillStyle = CMDetect.colors[2];
            _ctx.fillRect(_obj.tx3 , _obj.ty3, _obj.x3, _obj.y3);

            _ctx.fillStyle = CMDetect.colors[1];
            _ctx.fillRect(_obj.tx2 , _obj.ty2, _obj.x2, _obj.y2);

            _ctx.fillStyle = CMDetect.colors[0];
            _ctx.fillRect(0 , 0, _obj.x1, _obj.y1);
        }


        return {
            init: init,
            resize: resize
        }

} )();
