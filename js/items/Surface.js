var Surface = Surface || ( function () {

        var $container, $canvas, _ctx, $guide, _ctxGuide,
            _mode = 1,//0-hide, 1-show
            _color = CMDetect.colors[0],
            _sw, _sh, _sw2, _sh2, _sh25,
            _boxR = 470, _ballR = 100, _speed = 8, _wallY, _wallX,
            _box, _ball,
            _isHideMotion, _isHideBall, _isGuide, _isEndShow = 0, _isPaused = 1;

        function init(container, canvas, ctx, guide, ctxGuide) {
            $container = container;
            $canvas = canvas;
            _ctx = ctx;
            $guide = guide;
            _ctxGuide = ctxGuide;

            _ball = new UI.ball(0, 0, _speed);
            _box = new UI.wall();
        }

        /*
         * draw guide screen
         */
        function guide() {
            var gx = _sw2 + (_boxR >> 1) - 10,
                gy = _sh25 + (_boxR >> 1) - 10,
                cr = _boxR / 6 | 0,
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
            _ctxGuide.fillText("MOVE & RESIZE", gx, ty);
            _ctxGuide.restore();
        }

        /*
         * add resize event for ready to show
         */
        function ready(guide) {
            _isGuide = guide;
            StageController.addResize('Surface', resize);
        }

        function resize() {
            _sw = StageController.stageWidth;
            _sh = StageController.stageHeight;
            _sw2 = _sw >> 1;
            _sh2 = _sh >> 1;
            _sh25 = _sh / 2.5 | 0;

            $canvas.width = _sw;
            $canvas.height = _sh;
            _ctx = $canvas.getContext('2d');
            _ctx.fillStyle = _color;
            _ctx.fillRect(0 , 0, _sw, _sh);

            $guide.width = _sw;
            $guide.height = _sh;
            _ctxGuide = $guide.getContext('2d');


            var distance = CMUtiles.distance(0, 0, _sw, _sh) * 0.01 | 0;

            if (_sh > _sw) _ballR = _sw / 12 | 0;
            else _ballR = _sh / 12 | 0;
            if(_ballR > 50) _ballR = 50;

            if (_sh > _sw) _boxR = _sw - (_ballR * 6);
            else _boxR = _sh2;
            if(_boxR > 470) _boxR = 470;

            _speed = distance;
            if (_speed > 12) _speed = 12;
            _ball.vx = _ball.vy = _speed;

            _wallY = _sh - _ballR;
            _wallX = _sw - _ballR;

            _box.resize(_ctx);
            _ball.resize(_ctx, _ballR);

            if (_isGuide) guide();
        }

        /*
         * show!
         */
        function show() {
            var box_x = (_sw - _boxR) >> 1,
                box_y = _sh25 - (_boxR / 2) | 0,
                ran = CMUtiles.randomInteger(0, 3), //get 0~3
                delay = 0.5;

            _mode = 1;
            _isEndShow = 0;

            $container.appendChild($canvas);

            _box.w = 0;
            _box.h = 0;
            _box.x = _sw2;
            _box.y = _sh25;
            _box.update();

            TweenLite.to(_box, delay, {
                w:_boxR,
                h:_boxR,
                x: box_x,
                y: box_y,
                ease:Back.easeOut,
                easeParames:[2.2],
                onUpdate:updateShow
            });

            if (ran == 1) {
                _ball.x = _sw2;
                _ball.y = 0;
            } else if (ran == 2) {
                _ball.x = _sw;
                _ball.y = _sh2;
            } else if (ran == 3) {
                _ball.x = _sw2;
                _ball.y = _sh;
            } else {
                _ball.x = 0;
                _ball.y = _sh2;
            }

            _isPaused = 0;
            draw();

            if (_isGuide) {
                delay = 3.3;
                Sub.showGuide();
            }

            return delay;
        }
        function updateShow() {
            _box.update();
        }
        function endShow() {
            _isEndShow = 1;
            _isGuide = 0;
        }

        /*
         * hide!
         */
        function hide() {
            var tx = _box.x + (_box.w >> 1),
                ty = _box.y + (_box.h >> 1);

            _mode = 0;
            _isHideMotion = 0;
            _isHideBall = 0;

            TweenLite.to(_box, 0.4, {
                w:0,
                h:0,
                x:tx,
                y:ty,
                ease:Back.easeIn,
                easeParames:[1.2],
                onUpdate:updateShow,
                onComplete:endHide
            });
        }
        function endHide() {
            _isHideMotion = 1;
            checkHide();
        }
        function checkHide() {
            if (!_isHideMotion || !_isHideBall) return;
            Sub.endHide();
        }

        /*
         * stop draw and remove events to dispose
         */
        function dispose() {
            _isPaused = 1;
            StageController.removeResize('Surface');
        }

        /*
         * draw!
         */
        function draw() {
            if (_isPaused) return;
            requestAnimationFrame(draw);

            _ctx.fillStyle = _color;
            _ctx.fillRect(0 , 0, _sw, _sh);

            _box.draw();

            updateBalls();
        }

        function updateBalls() {
            var gap = 1;

            _ball.y += _ball.vy;
            _ball.x += _ball.vx;

            if (_mode) {
                if(_ball.y > _wallY) {
                    _ball.y = _wallY - gap;
                    _ball.vy *= -1;
                }
                if(_ball.y < _ballR) {
                    _ball.y = _ballR + gap;
                    _ball.vy *= -1;
                }
                if(_ball.x > _wallX) {
                    _ball.x = _wallX - gap;
                    _ball.vx *= -1;
                }
                if(_ball.x < _ballR) {
                    _ball.x = _ballR + gap;
                    _ball.vx *= -1;
                }
            }

            getBouncing(_box, _ballR, gap);

            _ball.draw();

            if (_mode || _isHideBall) return;
            if (_ball.x < -_ballR || _ball.x > _wallX + _ballR || _ball.y < -_ballR || _ball.y > _wallY + _ballR) {
                _isHideBall = 1;
                checkHide();
            }
        }

        function getBouncing(pos, radius, gap) {
            var min_x = pos.x - radius,
                max_x = pos.maxX + radius,
                min_y = pos.y - radius,
                max_y = pos.maxY + radius;

            if (_ball.x > min_x && _ball.x < max_x && _ball.y > min_y && _ball.y < max_y) {
                var x_min = Math.abs(min_x - _ball.x),
                    x_max = Math.abs(_ball.x - max_x),
                    y_min = Math.abs(min_y - _ball.y),
                    y_max = Math.abs(_ball.y - max_y),
                    min1 = Math.min(x_min, x_max),
                    min2 = Math.min(y_min, y_max),
                    min = Math.min(min1, min2);

                if (min == x_min) {
                    _ball.x = min_x - gap;
                    _ball.vx *= -1;
                } else if (min == x_max) {
                    _ball.x = max_x + gap;
                    _ball.vx *= -1;
                } else if (min == y_min) {
                    _ball.y = min_y - gap;
                    _ball.vy *= -1;
                } else if (min == y_max) {
                    _ball.y = max_y + gap;
                    _ball.vy *= -1;
                }
            }
        }

        /*
         * mouse events
         */
        function downFn(mx, my) {
            _box.down(mx, my);
        }
        function moveFn(mx, my) {
            _box.move(mx, my);
        }
        function upFn() {
            _box.up();
        }

        /*
         * check mouse pointer position to change cursor
         */
        function checkMouse(mx, my) {
            _box.checkMouse(mx, my);
        }

        return {
            init: init,
            ready: ready,
            show: show,
            endShow: endShow,
            hide: hide,
            dispose: dispose,

            downFn: downFn,
            moveFn: moveFn,
            upFn: upFn,
            checkMouse: checkMouse
        }

} )();
