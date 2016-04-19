var Interaction = Interaction || ( function () {

        var $container, $canvas, _ctx, $guide, _ctxGuide,
            _mode = 1,//0-hide, 1-show
            _color = CMDetect.colors[4],
            COLOR1 = '#1f4388', COLOR2 = '#ef4d80', _curColor = 0,
            _sw, _sh, _boxW, _boxH, _boxX, _boxY, _boxX2, _boxY2,
            _offsetY, _moveY = 0, _middleY, _minY, _maxY, _targetY, _bottomY,
            GAP = 40, TIME = 0.3, EASE = Circ.easeOut, BOX_W = 524, BOX_H = 514, PLNAE_W = 240, PLNAE_H = 142,
            _planeTop, _planeBottom, _planeMiddle, _planeFactory = [], _planes = [],
            _isDown = 0, _isGuide, _isMoving = 0,  _isDraw = 0, _isEndShow = 0, _isPaused = 1;

        function init(container, canvas, ctx, guide, ctxGuide) {
            $container = container;
            $canvas = canvas;
            _ctx = ctx;
            $guide = guide;
            _ctxGuide = ctxGuide;

            _planeTop = new UI.plane('#ffffff');
            _planeBottom = new UI.plane(COLOR1);
            _planeMiddle = new UI.plane(COLOR2);
        }

        /*
         * draw guide screen
         */
        function guide(scale) {
            var gx = _sw >> 1,
                gy = _sh >> 1,
                cr = 80 * scale | 0,
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
            _ctxGuide.fillText("SLIDE", gx, ty);
            _ctxGuide.restore();
        }

        /*
         * add resize event for ready to show
         */
        function ready(guide) {
            _isGuide = guide;
            StageController.addResize('Interaction', resize);
        }

        function resize() {
            var tw = BOX_W, th = BOX_H,
                bottom_y, middle_y, scale = 1,
                plane_w, plane_h;

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

            if (_sw - 40 < tw) {
                tw = _sw - 40;
                scale = tw / BOX_W;
                if (BOX_H * scale > _sh) {
                    scale = th / BOX_H;
                }
            } if (_sh - 40 < th) {
                th = _sh - 40;
                scale = th / BOX_H;
                if (BOX_W * scale > _sw) {
                    scale = tw / BOX_W;
                }
            }

            _boxW = BOX_W * scale;
            _boxH = BOX_H * scale;
            _boxX = (_sw - _boxW) >> 1;
            _boxY = (_sh - _boxH) >> 1;
            _boxX2 = _boxX + _boxW;
            _boxY2 = _boxY + _boxH;

            plane_w = PLNAE_W * scale;
            plane_h = PLNAE_H * scale;
            bottom_y = _boxY + _boxH - (plane_h * 2);
            middle_y = _boxY + ((bottom_y - _boxY) >> 1);

            _planeTop.resize(_ctx, _boxW, _boxX, _boxY, plane_w, plane_h);
            _planeBottom.resize(_ctx, _boxW, _boxX, bottom_y, plane_w, plane_h);
            _planeMiddle.resize(_ctx, _boxW, _boxX, middle_y, plane_w, plane_h);

            _middleY = _planeMiddle.ty;
            _bottomY = _planeBottom.ty;
            _minY = _middleY - GAP;
            _maxY = _middleY + GAP;

            if (_isGuide) guide(scale);
        }

        /*
         * show!
         */
        function show() {
            var delay = 1,
                tmp = {a3: _planeTop.a3, a4: _planeTop.a4, a7: _planeTop.a7, a8: _planeTop.a8, b3: _planeTop.b3, b4: _planeTop.b4, b7: _planeTop.b7, b8: _planeTop.b8},
                cx = tmp.a7 + (tmp.b3 - tmp.a7 >> 1),
                cy = tmp.a8;

            _mode = 1;
            _isEndShow = 0;
            _isDraw = 0;

            $container.appendChild($canvas);

            _planeTop.a3 = _planeTop.a7 = _planeTop.b3 = _planeTop.b7 = cx;
            _planeTop.a4 = _planeTop.a8 = _planeTop.b4 = _planeTop.b8 = cy;
            TweenLite.to(_planeTop, 0.5, {
                a3: tmp.a3,
                a4: tmp.a4,
                a7: tmp.a7,
                a8: tmp.a8,
                b3: tmp.b3,
                b4: tmp.b4,
                b7: tmp.b7,
                b8: tmp.b8,
                ease:Back.easeOut,
                easeParames:[2.2],
                onComplete:delayShow
            });

            _isPaused = 0;
            draw();

            if (_isGuide) {
                delay = 3.3;
                Sub.showGuide();
            }

            return delay;
        }
        function delayShow() {
            _planeMiddle.ty = _planeBottom.ty = _planeTop.ty;
            _planeMiddle.update();
            _planeBottom.update();

            _isDraw = 1;

            TweenLite.to(_planeMiddle, 0.35, {
                delay:0.15,
                ty: _middleY,
                ease:EASE,
                onUpdate:function() {
                    _planeMiddle.update();
                }
            });
            TweenLite.to(_planeBottom, 0.5, {
                ty: _bottomY,
                ease:EASE,
                onUpdate:function() {
                    _planeBottom.update();
                },
                onComplete:endShow
            });
        }
        function endShow() {
            _isEndShow = 1;
            _isGuide = 0;
        }

        /*
         * hide!
         */
        function hide() {
            _mode = 0;

            TweenLite.killTweensOf(_planeMiddle);

            TweenLite.to(_planeMiddle, 0.35, {
                ty: _planeTop.ty,
                ease:EASE,
                onUpdate:function() {
                    _planeMiddle.update();
                }
            });
            TweenLite.to(_planeBottom, 0.4, {
                ty: _planeTop.ty,
                ease:EASE,
                onUpdate:function() {
                    _planeBottom.update();
                },
                onComplete:delayHide
            });
        }
        function delayHide() {
            _isDraw = 0;

            var cx = _planeTop.a7 + (_planeTop.b3 - _planeTop.a7 >> 1),
                cy = _planeTop.a8;

            TweenLite.to(_planeTop, 0.4, {
                a3: cx,
                a4: cy,
                a7: cx,
                a8: cy,
                b3: cx,
                b4: cy,
                b7: cx,
                b8: cy,
                ease:Back.easeIn,
                easeParames:[2.2],
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
            _moveY = 0;
            _isDown = 0;
            _isMoving = 0;
            _planes = [];
            var i, total = _planeFactory.length, item;
            for (i=0; i<total; i++) {
                item = _planeFactory[i];
                item.isUsed = 0;
            }
            StageController.removeResize('Interaction');
        }

        /*
         * draw!
         */
        function draw() {
            if (_isPaused) return;
            requestAnimationFrame(draw);

            _ctx.fillStyle = _color;
            _ctx.fillRect(0 , 0, _sw, _sh);

            if (_isDraw) {
                _planeBottom.draw();
                drawMoving(2);
                _planeMiddle.draw();
                drawMoving(1);
            }
            _planeTop.draw();
        }

        function drawMoving(mode) {
            var i, total = _planes.length, plane;
            for (i=0; i<total; i++) {
                plane = _planes[i];
                if (plane.moving == mode) plane.draw();
            }
        }

        /*
         * mouse events
         */
        function downFn(mx, my) {
            if (!_mode) return;
            _isDown = 1;
            _offsetY = my;
            _targetY = _planeMiddle.ty;
        }
        function moveFn(mx, my) {
            if (!_isDown || !_mode) return;

            _moveY = my - _offsetY;
            _offsetY = my;

            var my = _planeMiddle.ty + _moveY;
            if (my < _planeTop.ty) my = _planeTop.ty;
            else if (my > _planeBottom.ty) my = _planeBottom.ty;
            _targetY = my;

            TweenLite.killTweensOf(_planeMiddle);
            TweenLite.to(_planeMiddle, TIME, {
                ty: _targetY,
                ease:EASE,
                onUpdate:function() {
                    _planeMiddle.update();
                }
            });
        }
        function upFn() {
            if (!_mode) return;

            var ty, plane, color1, color2;

            _isDown = 0;

            TweenLite.killTweensOf(_planeMiddle);

            if (_targetY > _minY && _targetY < _maxY) {
                // go back
                TweenLite.to(_planeMiddle, TIME, {
                    ty: _middleY,
                    ease:EASE,
                    onUpdate:function() {
                        _planeMiddle.update();
                    }
                });
            } else {
                if (_moveY < 0) {
                    // top
                    _curColor += 1;
                    _isMoving = 1;
                    ty = _planeTop.ty;
                } else {
                    // bottom
                    _curColor -= 1;
                    _isMoving = 2;
                    ty = _planeBottom.ty;
                }

                if (_curColor % 2 == 0) {
                    color1 = COLOR1;
                    color2 = COLOR2;
                } else {
                    color1 = COLOR2;
                    color2 = COLOR1;
                }

                plane = getPlane();
                plane.setting(_planeMiddle, _ctx, color1);
                _planes.push(plane);

                if (_isMoving == 1) {
                    _planeMiddle.setting(_planeBottom, _ctx, color2);
                    _planeBottom.color = color1;
                } else {
                    _planeMiddle.setting(_planeTop, _ctx, color2);
                }
                plane.moving = _isMoving;

                TweenLite.to(plane, TIME, {
                    ty: ty,
                    ease:EASE,
                    onUpdate:function() {
                        plane.update();
                    },
                    onComplete: function() {
                        plane.isUsed = 0;
                        removePlane(plane);
                        if (_isMoving == 2 && _mode) {
                            _planeBottom.color = plane.color;
                        }
                    }
                });
                TweenLite.to(_planeMiddle, TIME, {
                    ty: _middleY,
                    ease:EASE,
                    onUpdate:function() {
                        _planeMiddle.update();
                    },
                    onComplete:endMove
                });
            }
        }
        function removePlane(plane) {
            var i, total = _planes.length;
            for(i=0; i < total; i++) {
                if(_planes[i] === plane) {
                    _planes.splice(i, 1);
                }
            }
        }
        function endMove() {
            _isMoving = 0;
            _moveY = 0;
            _offsetY = 0;
            _isDown = 0;

        }

        /*
         * check mouse pointer position to change cursor
         */
        function checkMouse(mx, my) {
            if (mx > _boxX && mx < _boxX2 && my > _boxY && my < _boxY2) {
                Address.setCursor(3);
            } else {
                Address.setCursor(0);
            }
        }

        /*
         * factory pattern to get plane for infinity moving
         */
        function getPlane() {
            var i, total = _planeFactory.length, item;
            for (i=0; i<total; i++) {
                item = _planeFactory[i];
                if (!item.isUsed) {
                    item.isUsed = 1;
                    return item;
                    break;
                }
            }
            item = new UI.plane();
            item.isUsed = 1;
            _planeFactory.push(item);
            return item;
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
