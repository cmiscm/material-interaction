var Motion = Motion || ( function () {

        var $container, $canvas, _ctx, $guide, _ctxGuide,
            _mode = 1,//0-hide, 1-show
            _color = CMDetect.colors[2],
            _sw, _sh, _boxR, _boxR2, _boxX,
            _boxStart, _boxEnd,
            _isGuide, _isLight = 0, _isEndShow = 0, _isPaused = 1;

        function init(container, canvas, ctx, guide, ctxGuide) {
            $container = container;
            $canvas = canvas;
            _ctx = ctx;
            $guide = guide;
            _ctxGuide = ctxGuide;

            _boxStart = new UI.windowbox(0);
            _boxEnd = new UI.windowbox(1);
        }

        /*
         * draw guide screen
         */
        function guide() {
            var gx =  (_boxR >> 1) + _boxX,
                gy =  (_boxR >> 1) + _boxX,
                cr = _boxR / 4 | 0,
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
            _ctxGuide.fillText("MOVE", gx, ty);
            _ctxGuide.restore();
        }

        /*
         * add resize event for ready to show
         */
        function ready(guide) {
            _isGuide = guide;
            StageController.addResize('Motion', resize);
        }

        function resize() {
            _sw = StageController.stageWidth;
            _sh = StageController.stageHeight;

            $canvas.width = _sw;
            $canvas.height = _sh;
            _ctx = $canvas.getContext('2d');
            _ctx.fillStyle = _color;
            _ctx.fillRect(0 , 0, _sw, _sh);

            $guide.width = _sw;
            $guide.height = _sh;
            _ctxGuide = $guide.getContext('2d');

            if (_sh > _sw) _boxR = _sw / 3 | 0;
            else _boxR = _sh / 3 | 0;
            if (_boxR > 240) _boxR = 240;
            _boxR2 = _boxR / 4 | 0;
            _boxX = _boxR / 4 | 0;

            _boxStart.resize(_ctx, _boxR, _sw, _sh);
            _boxEnd.resize(null, _boxR, _sw, _sh);

            if (_isGuide) guide();
        }

        /*
         * show!
         */
        function show() {
            var delay = 0.8, endx;

            _mode = 1;
            _isEndShow = 0;
            _isLight = 0;

            $container.appendChild($canvas);

            _boxStart.r = 0;
            _boxStart.x = _boxX + (_boxR >> 1);
            _boxStart.y = _boxX + (_boxR >> 1);
            _boxStart.update();

            TweenLite.to(_boxStart, delay - 0.2, {
                r:_boxR,
                x:_boxX,
                y:_boxX,
                ease:Back.easeOut,
                easeParames:[2.2],
                onUpdate:function() {
                    _boxStart.update();
                }
            });

            _boxEnd.x = _boxX;
            _boxEnd.y = _boxX;
            _boxEnd.update();

            if (_sh > _sw) endx = _sw;
            else endx = (_sw - _boxR) >> 1;

            TweenLite.to(_boxEnd, delay - 0.2, {
                delay:0.2,
                x:endx,
                y:_sh,
                ease:Cubic.easeInOut,
                onUpdate:function() {
                    _boxEnd.update();
                },
                onStart:function() {
                    _isLight = 1;
                }
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
            _isEndShow = 1;
        }

        /*
         * hide!
         */
        function hide() {
            var tx = _boxStart.x + (_boxStart.r >> 1),
                ty = _boxStart.y + (_boxStart.r >> 1);

            _isEndShow = 0;
            _mode = 0;

            TweenLite.to(_boxEnd, 0.4, {
                x:_boxStart.x,
                y:_boxStart.y,
                ease:Cubic.easeInOut,
                onUpdate:function() {
                    _boxEnd.update();
                },
                onComplete:function() {
                    _isLight = 0;
                }
            });

            TweenLite.to(_boxStart, 0.4, {
                delay:0.2,
                r:0,
                x:tx,
                y:ty,
                ease:Back.easeIn,
                easeParames:[1.2],
                onUpdate:function() {
                    _boxStart.update();
                },
                onComplete:endHide
            });
        }
        function endHide() {
            Sub.endHide();
        }

        /*
         * stop draw and remove events to dispose
         */
        function dispose() {
            _isPaused = 1;
            StageController.removeResize('Motion');
        }

        /*
         * draw!
         */
        function draw() {
            if (_isPaused) return;
            requestAnimationFrame(draw);

            _ctx.fillStyle = _color;
            _ctx.fillRect(0 , 0, _sw, _sh);

            if (_isEndShow) getSize();
            if (_isLight) drawLight();

            _boxStart.draw();
        }

        function getSize() {
            var dis = CMUtiles.distance(_boxX, _boxX, _boxStart.x, _boxStart.y),
                dis2 = CMUtiles.distance(0, 0, _sw, _sh),
                bsize = CMUtiles.getCurrent(dis, 0, dis2, _boxR, _boxR2);
            _boxStart.updateSize(bsize);
            _boxEnd.updateSize(bsize);
        }

        function drawLight() {
            var sw2 = _sw >> 1, bw2 = _boxR >> 1,
                a1, a2, a3, a4, a5, a6, a7, a8, gra;

            _ctx.save();

            if (_sh > _sw) {
                a1 = _boxStart.x;
                a2 = _boxStart.maxY;
                a3 = _boxStart.maxX;
                a4 = _boxStart.y;

                a5 = _boxEnd.maxX;
                a6 = _boxEnd.y;
                a7 = _boxEnd.x;
                a8 = _boxEnd.maxY;
                gra = _ctx.createLinearGradient(a3, a4, a5, a6);
            } else {
                if (_boxStart.x + bw2 < sw2) {
                    a1 = _boxStart.x;
                    a2 = _boxStart.maxY;
                    a3 = _boxStart.maxX;
                    a4 = _boxStart.y;

                    a5 = _boxEnd.maxX;
                    a6 = _boxEnd.y;
                    a7 = _boxEnd.x;
                    a8 = _boxEnd.maxY;
                    gra = _ctx.createLinearGradient(a3, a4, a5, a6);
                } else {
                    a1 = _boxStart.x;
                    a2 = _boxStart.y;
                    a3 = _boxStart.maxX;
                    a4 = _boxStart.maxY;

                    a5 = _boxEnd.maxX;
                    a6 = _boxEnd.maxY;
                    a7 = _boxEnd.x;
                    a8 = _boxEnd.y;
                    gra = _ctx.createLinearGradient(a1, a2, a7, a8);
                }
            }

            gra.addColorStop(0, 'rgba(229, 88, 95, 1)');
            gra.addColorStop(1, 'rgba(229, 88, 95, 0)');

            _ctx.fillStyle = gra;
            _ctx.beginPath();
            _ctx.moveTo(a1, a2);
            _ctx.lineTo(a3, a4);
            _ctx.lineTo(a5, a6);
            _ctx.lineTo(a7, a8);
            _ctx.fill();
            _ctx.restore();

        }

        /*
         * mouse events
         */
        function downFn(mx, my) {
            _boxStart.down(mx, my);
        }
        function moveFn(mx, my) {
            _boxStart.move(mx, my);
        }
        function upFn() {
            _boxStart.up();
        }

        /*
         * check mouse pointer position to change cursor
         */
        function checkMouse(mx, my) {
            _boxStart.checkMouse(mx, my);
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
