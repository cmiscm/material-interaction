var Change = Change || ( function () {

        var $container, $canvas, _ctx, $guide, _ctxGuide,
            _mode = 1,//0-hide, 1-show
            _color = CMDetect.colors[3],
            _sw, _sh, _ballR,
            LINE_H = 12, LINE_GAP = 17,
            LINE_GAP2 = LINE_GAP * 2, _itotal, _jtotal,
            _ball, _obj = {no:0},
            _isGuide, _isEndShow = 0, _isPaused = 1;

        function init(container, canvas, ctx, guide, ctxGuide) {
            $container = container;
            $canvas = canvas;
            _ctx = ctx;
            $guide = guide;
            _ctxGuide = ctxGuide;

            _ball = new UI.changeBall();
        }

        /*
         * draw guide screen
         */
        function guide() {
            var gx = _sw - (_sw / 5 | 0),
                gy = _sh >> 1,
                cr = _ballR * 1.5 | 0,
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
            StageController.addResize('Change', resize);
        }

        function resize() {
            _sw = StageController.stageWidth;
            _sh = StageController.stageHeight;

            $canvas.width = _sw;
            $canvas.height = _sh;
            _ctx = $canvas.getContext('2d');
            _ctx.fillStyle = _color;
            _ctx.strokeStyle = '#d24b80'; //eb4c80
            _ctx.lineWidth = 3;
            _ctx.lineCap = 'round';
            _ctx.fillRect(0 , 0, _sw, _sh);

            $guide.width = _sw;
            $guide.height = _sh;
            _ctxGuide = $guide.getContext('2d');

            if (_sh > _sw) _ballR = _sw / 12 | 0;
            else _ballR = _sh / 12 | 0;
            if(_ballR < 40) _ballR = 40;
            else if(_ballR > 60) _ballR = 60;

            _ball.resize(_ctx, _ballR, _sw, _sh);

            _itotal = _sw / LINE_GAP2 | 0;
            _jtotal = _sh / LINE_GAP2 | 0;

            if (_isGuide) guide();
        }

        /*
         * show!
         */
        function show() {
            var delay = 0.8,
                tx = _sw - (_sw / 5 | 0),
                ty = _sh >> 1;

            _mode = 1;
            _isEndShow = 0;

            $container.appendChild($canvas);

            _ball.r = 0;
            _ball.x = tx;
            _ball.y = ty;

            TweenLite.to(_ball, 0.4, {
                r:_ballR,
                ease:Back.easeOut,
                easeParames:[2.2],
                onUpdate:updateShow
            });

            TweenLite.to(_obj, 0.5, {
                delay:0.3,
                no:1,
                ease:Cubic.easeOut
            });

            _isPaused = 0;
            draw();

            if (_isGuide) {
                delay = 3.3;
                Sub.showGuide();
            }

            return delay;
        }
        function updateShow() {
            _ball.update();
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

            TweenLite.to(_ball, 0.4, {
                r:0,
                ease:Back.easeIn,
                easeParames:[2.2],
                onUpdate:updateShow,
                onComplete:endHide
            });

            TweenLite.to(_obj, 0.3, {
                no:0,
                ease:Cubic.easeOut
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
            StageController.removeResize('Change');
        }

        /*
         * draw!
         */
        function draw() {
            if (_isPaused) return;
            requestAnimationFrame(draw);

            _ctx.fillStyle = _color;
            _ctx.fillRect(0 , 0, _sw, _sh);

            drawLines();

            _ball.draw();
        }

        function drawLines() {
            var jv, iv, hv, i, j, lh = LINE_H * _obj.no,
                ballx = _ball.x, bally = _ball.y;

            for (i=0; i<=_itotal; i++) {
                for (j=0; j<=_jtotal; j++) {
                    iv = LINE_GAP + i * LINE_GAP2;
                    jv = LINE_GAP + j * LINE_GAP2;
                    //angle = Math.atan2((jv - bally), (iv - ballx));
                    hv = calcVec(iv - ballx, jv - bally);

                    _ctx.save();
                    _ctx.translate(iv, jv);
                    _ctx.rotate(hv.heading());
                    _ctx.beginPath();
                    _ctx.moveTo(-lh, 0);
                    _ctx.lineTo(lh, 0);
                    _ctx.stroke();
                    _ctx.restore();
                }
            }
        }

        function calcVec(x, y) {
            return new p5.Vector(y - x, - x - y);
        }


        /*
         * mouse events
         */
        function downFn(mx, my) {
            _ball.down(mx, my);
        }
        function moveFn(mx, my) {
            _ball.move(mx, my);
        }
        function upFn() {
            _ball.up();
        }

        /*
         * check mouse pointer position to change cursor
         */
        function checkMouse(mx, my) {
            _ball.checkMouse(mx, my);
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






var p5 = {};
var TWO_PI = Math.PI * 2;
var polarGeometry = function (require) {
    return {
        degreesToRadians: function (x) {
            return 2 * Math.PI * x / 360;
        },
        radiansToDegrees: function (x) {
            return 360 * x / (2 * Math.PI);
        }
    };
};
p5.Vector = function (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
};
p5.Vector.prototype.set = function (x, y, z) {
    if (x instanceof p5.Vector) {
        this.x = x.x || 0;
        this.y = x.y || 0;
        this.z = x.z || 0;
        return this;
    }
    if (x instanceof Array) {
        this.x = x[0] || 0;
        this.y = x[1] || 0;
        this.z = x[2] || 0;
        return this;
    }
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    return this;
};
p5.Vector.prototype.get = function () {
    if (this.p5) {
        return new p5.Vector(this.p5, [
            this.x,
            this.y,
            this.z
        ]);
    } else {
        return new p5.Vector(this.x, this.y, this.z);
    }
};
p5.Vector.prototype.add = function (x, y, z) {
    if (x instanceof p5.Vector) {
        this.x += x.x || 0;
        this.y += x.y || 0;
        this.z += x.z || 0;
        return this;
    }
    if (x instanceof Array) {
        this.x += x[0] || 0;
        this.y += x[1] || 0;
        this.z += x[2] || 0;
        return this;
    }
    this.x += x || 0;
    this.y += y || 0;
    this.z += z || 0;
    return this;
};
p5.Vector.prototype.sub = function (x, y, z) {
    if (x instanceof p5.Vector) {
        this.x -= x.x || 0;
        this.y -= x.y || 0;
        this.z -= x.z || 0;
        return this;
    }
    if (x instanceof Array) {
        this.x -= x[0] || 0;
        this.y -= x[1] || 0;
        this.z -= x[2] || 0;
        return this;
    }
    this.x -= x || 0;
    this.y -= y || 0;
    this.z -= z || 0;
    return this;
};
p5.Vector.prototype.mult = function (n) {
    this.x *= n || 0;
    this.y *= n || 0;
    this.z *= n || 0;
    return this;
};
p5.Vector.prototype.div = function (n) {
    this.x /= n;
    this.y /= n;
    this.z /= n;
    return this;
};
p5.Vector.prototype.mag = function () {
    return Math.sqrt(this.magSq());
};
p5.Vector.prototype.magSq = function () {
    var x = this.x, y = this.y, z = this.z;
    return x * x + y * y + z * z;
};
p5.Vector.prototype.dot = function (x, y, z) {
    if (x instanceof p5.Vector) {
        return this.dot(x.x, x.y, x.z);
    }
    return this.x * (x || 0) + this.y * (y || 0) + this.z * (z || 0);
};
p5.Vector.prototype.cross = function (v) {
    var x = this.y * v.z - this.z * v.y;
    var y = this.z * v.x - this.x * v.z;
    var z = this.x * v.y - this.y * v.x;
    if (this.p5) {
        return new p5.Vector(this.p5, [
            x,
            y,
            z
        ]);
    } else {
        return new p5.Vector(x, y, z);
    }
};
p5.Vector.prototype.dist = function (v) {
    var d = v.get().sub(this);
    return d.mag();
};
p5.Vector.prototype.normalize = function () {
    return this.div(this.mag());
};
p5.Vector.prototype.limit = function (l) {
    var mSq = this.magSq();
    if (mSq > l * l) {
        this.div(Math.sqrt(mSq));
        this.mult(l);
    }
    return this;
};
p5.Vector.prototype.setMag = function (n) {
    return this.normalize().mult(n);
};
p5.Vector.prototype.heading = function () {
    var h = Math.atan2(this.y, this.x);
    if (this.p5) {
        if (this.p5._angleMode === 'radians') {
            return h;
        } else {
            return polarGeometry.radiansToDegrees(h);
        }
    } else {
        return h;
    }
};
p5.Vector.prototype.rotate = function (a) {
    if (this.p5) {
        if (this.p5._angleMode === 'degrees') {
            a = polarGeometry.degreesToRadians(a);
        }
    }
    var newHeading = this.heading() + a;
    var mag = this.mag();
    this.x = Math.cos(newHeading) * mag;
    this.y = Math.sin(newHeading) * mag;
    return this;
};
p5.Vector.prototype.lerp = function (x, y, z, amt) {
    if (x instanceof p5.Vector) {
        return this.lerp(x.x, x.y, x.z, y);
    }
    this.x += (x - this.x) * amt || 0;
    this.y += (y - this.y) * amt || 0;
    this.z += (z - this.z) * amt || 0;
    return this;
};
p5.Vector.prototype.array = function () {
    return [
        this.x || 0,
        this.y || 0,
        this.z || 0
    ];
};
p5.Vector.fromAngle = function (angle) {
    if (this.p5) {
        if (this.p5._angleMode === 'degrees') {
            angle = polarGeometry.degreesToRadians(angle);
        }
    }
    if (this.p5) {
        return new p5.Vector(this.p5, [
            Math.cos(angle),
            Math.sin(angle),
            0
        ]);
    } else {
        return new p5.Vector(Math.cos(angle), Math.sin(angle), 0);
    }
};
p5.Vector.random2D = function () {
    var angle;
    if (this.p5) {
        if (this.p5._angleMode === 'degrees') {
            angle = this.p5.random(360);
        } else {
            angle = this.p5.random(TWO_PI);
        }
    } else {
        angle = Math.random() * Math.PI * 2;
    }
    return this.fromAngle(angle);
};
p5.Vector.random3D = function () {
    var angle, vz;
    if (this.p5) {
        angle = this.p5.random(0, TWO_PI);
        vz = this.p5.random(-1, 1);
    } else {
        angle = Math.random() * Math.PI * 2;
        vz = Math.random() * 2 - 1;
    }
    var vx = Math.sqrt(1 - vz * vz) * Math.cos(angle);
    var vy = Math.sqrt(1 - vz * vz) * Math.sin(angle);
    if (this.p5) {
        return new p5.Vector(this.p5, [
            vx,
            vy,
            vz
        ]);
    } else {
        return new p5.Vector(vx, vy, vz);
    }
};
p5.Vector.add = function (v1, v2) {
    return v1.get().add(v2);
};
p5.Vector.sub = function (v1, v2) {
    return v1.get().sub(v2);
};
p5.Vector.mult = function (v, n) {
    return v.get().mult(n);
};
p5.Vector.div = function (v, n) {
    return v.get().div(n);
};
p5.Vector.dot = function (v1, v2) {
    return v1.dot(v2);
};
p5.Vector.cross = function (v1, v2) {
    return v1.cross(v2);
};
p5.Vector.dist = function (v1, v2) {
    return v1.dist(v2);
};
p5.Vector.lerp = function (v1, v2, amt) {
    return v1.get().lerp(v2, amt);
};
p5.Vector.angleBetween = function (v1, v2) {
    var angle = Math.acos(v1.dot(v2) / (v1.mag() * v2.mag()));
    if (this.p5) {
        if (this.p5._angleMode === 'degrees') {
            angle = polarGeometry.radiansToDegrees(angle);
        }
    }
    return angle;
};

