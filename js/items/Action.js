var Action = Action || ( function () {

        var $container, $canvas, _ctx, $guide, _ctxGuide,
            _mode = 1,//0-hide, 1-show
            _sw, _sh,
            COLOR1 = CMDetect.colors[1], COLOR2 = '#fbb447',
            _bgColor, _ballColor, _colorMode = 0,
            _guideText,
            _ballR, _speed = 8, SPRING = 0.4, _speedCount = 0, MAX_CLICK = 5,
            _boom = {}, _ball = [], _total,
            _isBoomDraw = 0, _isBooming = 0, _isGuide, _isEndShow = 0, _isPaused = 1;

        function init(container, canvas, ctx, guide, ctxGuide) {
            $container = container;
            $canvas = canvas;
            _ctx = ctx;
            $guide = guide;
            _ctxGuide = ctxGuide;

            if (CMDetect.isTouch) _guideText = "TOUCH";
            else _guideText = "CLICK";
        }

        /*
         * draw guide screen
         */
        function guide() {
            var gx = _sw >> 1,
                gy = _sh >> 1,
                cr = _ballR / 2 | 0,
                ty = gy + cr + 25;

            _ctxGuide.clearRect(0 , 0, _sw, _sh);

            _ctxGuide.save();
            _ctxGuide.beginPath();
            _ctxGuide.fillStyle = 'rgba(0,0,0,0.8)';
            _ctxGuide.fillRect(_sw , 0, -_sw, _sh);
            _ctxGuide.globalCompositeOperation = 'xor';
            _ctxGuide.arc(gx, gy, cr, 0, UI.PI2, false);
            _ctxGuide.fill();
            _ctxGuide.restore();

            _ctxGuide.save();
            _ctxGuide.textAlign = 'center';
            _ctxGuide.font = 'bold 12px Arial';
            _ctxGuide.fillStyle = '#fff';
            _ctxGuide.fillText(_guideText, gx, ty);
            _ctxGuide.restore();
        }

        /*
         * add resize event for ready to show
         */
        function ready(guide) {
            _isGuide = guide;

            _colorMode = 0;
            checkColor();

            _ball = [new UI.actionBall(_ballColor, 0, 0, _ctx, 0, _speed, 0)];
            _total = 1;

            StageController.addResize('Action', resize);
        }

        function resize() {
            _sw = StageController.stageWidth;
            _sh = StageController.stageHeight;

            $canvas.width = _sw;
            $canvas.height = _sh;
            _ctx = $canvas.getContext('2d');
            _ctx.fillStyle = _bgColor;
            _ctx.fillRect(0 , 0, _sw, _sh);

            $guide.width = _sw;
            $guide.height = _sh;
            _ctxGuide = $guide.getContext('2d');


            var i, ball;

            if (_sh > _sw) _ballR = _sw / 3 | 0;
            else _ballR = _sh / 3 | 0;
            //if(_ballR > 210) _ballR = 210;

            _speed = CMUtiles.distance(0, 0, _sw, _sh) * 0.01 | 0;
            if (_speed > 8) _speed = 8;

            for (i=0; i<_total; i++) {
                ball = _ball[i];
                if (_isEndShow) ball.resize(_ctx, _speed, _ballR, null, null);
                else ball.resize(_ctx, _speed, _ballR, _sw, _sh);
            }

            if (_isGuide) guide();
        }

        /*
         * show!
         */
        function show() {
            var ball = _ball[0],
                delay = 0.5;

            _mode = 1;
            _isEndShow = 0;
            _speedCount = 0;
            _isBoomDraw = 0;
            _isBooming = 0;

            $container.appendChild($canvas);

            ball.x = _sw >> 1;
            ball.y = _sh >> 1;
            ball.r = 0;

            TweenLite.to(ball, delay, {
                r:_ballR,
                ease:Back.easeOut,
                easeParames:[2.2]
            });

            _isPaused = 0;
            draw();

            if (_isGuide) {
                delay = 3.3;
                Sub.showGuide();
            }

            return delay;
        }
        function endShow() {
        }

        /*
         * hide!
         */
        function hide() {
            var i, ball, tx, ty, radius;

            _mode = 0;

            if (_colorMode) {
                if (_total == 1) {
                    ball = _ball[0];
                    TweenLite.to(ball, 0.6, {
                        r:0,
                        ease:Expo.easeInOut,
                        onComplete:endHide
                    });
                } else {
                    for (i=0; i<_total; i++) {
                        ball = _ball[i];
                        ball.vx = 60 * ((Math.random() > 0.5) ? -1 : 1);
                        ball.vy = 60 * ((Math.random() > 0.5) ? -1 : 1);
                    }
                }
            } else {
                _isBoomDraw = 1;
                _isBooming = 1;
                tx = _sw -58;
                ty = _sh - 58;
                radius = getMax(_sw, _sh, tx, ty);
                _boom.r = 28;
                _boom.x = tx;
                _boom.y = ty;
                TweenLite.to(_boom, 0.8, {
                    r:radius,
                    ease:Expo.easeOut,
                    onComplete:endHide
                });
            }
        }
        function endHide() {
            Sub.endHide();
        }
        function checkHide() {
            if(_isBooming) return;
            var i, ball;
            for (i=0; i<_total; i++) {
                ball = _ball[i];
                if (!ball.hide) return;
            }
            endHide();
        }

        /*
         * stop draw and remove events to dispose
         */
        function dispose() {
            _isPaused = 1;
            StageController.removeResize('Action');
        }

        /*
         * draw!
         */
        function draw() {
            if (_isPaused) return;
            requestAnimationFrame(draw);

            var i, ball;

            _ctx.fillStyle = _bgColor;
            _ctx.fillRect(0 , 0, _sw, _sh);

            if (_isEndShow) collisionBalls();

            for (i=0; i<_total; i++) {
                ball = _ball[i];
                ball.draw();
            }

            if (!_isBoomDraw) return;
            _ctx.save();
            _ctx.fillStyle = _ballColor;
            _ctx.beginPath();
            _ctx.arc(_boom.x, _boom.y, _boom.r, 0, UI.PI2, false);
            _ctx.fill();
            _ctx.restore();
        }

        function collisionBalls() {
            var ballA, ballB, ball, dx, dy, dist, minDist, angle, tx, ty, ax, ay, i, j;
            for (i = 0; i < _total - 1; i++){
                ballA = _ball[i];
                for (j = i + 1; j < _total; j++){
                    ballB = _ball[j];
                    dx = ballB.x - ballA.x;
                    dy = ballB.y - ballA.y;
                    dist = Math.sqrt(dx * dx + dy * dy);
                    minDist = ballA.r + ballB.r;
                    if(dist < minDist){
                        angle = Math.atan2(dy, dx);
                        tx = ballA.x + Math.cos(angle) * minDist;
                        ty = ballA.y + Math.sin(angle) * minDist;
                        ax = (tx - ballB.x) * SPRING;
                        ay = (ty - ballB.y) * SPRING;
                        ballA.vx -= ax;
                        ballA.vy -= ay;
                        ballB.vx += ax;
                        ballB.vy += ay;
                    }
                }
            }

            for (i=0; i<_total; i++) {
                ball = _ball[i];
                ball.move(_sw, _sh, _mode);
            }
        }

        /*
         * draw boom effect
         */
        function boom(x, y, r) {
            Address.unable();

            _isBoomDraw = 1;
            _isBooming = 1;

            var radius = getMax(_sw, _sh, x, y);
            _boom.r = r;
            _boom.x = x;
            _boom.y = y;
            TweenLite.to(_boom, 0.8, {
                r:radius,
                ease:Expo.easeOut,
                onComplete:delayBoom
            });
        }
        function delayBoom() {
            checkColor();

            _isBoomDraw = 0;
            _speedCount = 0;
            _isEndShow = 0;

            _ball = [new UI.actionBall(_ballColor, 0, 0, _ctx, 0, _speed, 0)];
            _total = 1;
            resize();

            var ball = _ball[0];
            ball.x = _sw >> 1;
            ball.y = _sh >> 1;
            ball.r = 0;

            TweenLite.to(ball, 0.5, {
                r:_ballR,
                ease:Back.easeOut,
                easeParames:[2.2],
                onComplete:endBoom
            });
        }
        function endBoom() {
            _isBooming = 0;
            Address.able();
        }
        function getMax(tw, th, mx, my) {
            var a1 = CMUtiles.distance(0, 0, mx, my),
                a2 = CMUtiles.distance(tw, 0, mx, my),
                a3 = CMUtiles.distance(0, th, mx, my),
                a4 = CMUtiles.distance(tw, th, mx, my),
                max1 = Math.max(a1, a2),
                max2 = Math.max(a3, a4);
            return Math.max(max1, max2) + 0.5 | 0;
        }
        function checkColor() {
            _colorMode = !_colorMode;
            if (_colorMode) {
                _bgColor = COLOR1;
                _ballColor = COLOR2;
            } else {
                _bgColor = COLOR2;
                _ballColor = COLOR1;
            }
        }

        /*
         * mouse events
         */
        function downFn(mx, my) {
            if (_isBooming) return;
            var i, ball, radius, x1, x2, y1, y2, speed;
            for (i=0; i<_total; i++) {
                ball = _ball[i];
                radius = ball.r;
                x1 = ball.x - radius;
                x2 = ball.x + radius;
                y1 = ball.y - radius;
                y2 = ball.y + radius;
                if (mx > x1 && mx < x2 && my > y1 && my < y2) {
                    if (!_isEndShow) _isEndShow = 1;
                    else _speedCount += 2;
                    if (_speedCount > 28) _speedCount = 28;
                    speed = _speed + _speedCount;

                    ball.count += 1;
                    ball.update(speed);
                    if (ball.count >= MAX_CLICK) {
                        // boom
                        boom(ball.x, ball.y, ball.r);
                        return;
                    } else {
                        _ball.push(new UI.actionBall(_ballColor, mx, my, _ctx, _ballR, speed, ball.count));
                        _total = _ball.length;
                    }
                    break;
                }
            }
        }
        function moveFn(mx, my) {
        }
        function upFn() {
        }
        function checkMouse(mx, my) {
        }

        return {
            init: init,
            ready: ready,
            show: show,
            endShow: endShow,
            hide: hide,
            checkHide: checkHide,
            dispose: dispose,

            downFn: downFn,
            moveFn: moveFn,
            upFn: upFn,
            checkMouse: checkMouse
        }

} )();


