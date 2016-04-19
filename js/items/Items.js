var SurfaceItem = SurfaceItem || ( function () {

        var $con, $box, $circle, _ballR, _boxR;

        function init(con) {
            $con = con;

            $box = document.createElement('div');
            $box.className = 'surface-box';

            $circle = document.createElement('div');
            $circle.className = 'surface-circle';

            $con.appendChild($box);
            $con.appendChild($circle);
        }

        function setPos(w, h, x, y) {
            if (h > w) _ballR = w / 6 | 0;
            else _ballR = h / 6 | 0;
            if(_ballR > 120) _ballR = 120;

            if (h > w) _boxR = w >> 1;
            else _boxR = h >> 1;
            if(_boxR > 470) _boxR = 470;

            var box_x = (w - _boxR) >> 1,
                box_y = (h / 3 | 0) - (_boxR / 2) | 0,
                ball_x = (w - _ballR) >> 1,
                ball_y = (h - ((h - (box_y + _boxR)) >> 1)) - (_ballR >> 1);

            $box.style.width = _boxR + 'px';
            $box.style.height = _boxR + 'px';
            $box.style[CMDetect.TRANSFORM] = 'translate3d(' + box_x + 'px,  ' + box_y + 'px, 0px)';

            $circle.style.width = _ballR + 'px';
            $circle.style.height = _ballR + 'px';
            $circle.style[CMDetect.TRANSFORM] = 'translate3d(' + ball_x + 'px,  ' + ball_y + 'px, 0px)';
        }

        return {
            init: init,
            setPos: setPos
        }

    } )();


var ActionItem = ActionItem || ( function () {

        var $con, $circle, _ballR, $cross1, $cross2;

        function init(con) {
            $con = con;

            $circle = document.createElement('div');
            $circle.className = 'action-circle';

            $cross1 = document.createElement('div');
            $cross1.className = 'action-box';

            $cross2 = document.createElement('div');
            $cross2.className = 'action-box';

            $con.appendChild($circle);
            $con.appendChild($cross1);
            $con.appendChild($cross2);
        }

        function setPos(w, h, x, y) {
            var min, gap;
            if (h > w) min = w;
            else min = h;

            gap = (min - 160) + 20;
            if (gap > 70) gap = 70;

            _ballR = min - gap;

            var ball_x = (w - _ballR) >> 1,
                ball_y = (h - _ballR) >> 1,
                cross_w = _ballR * 0.3 | 0,
                cross_h = _ballR * 0.04 | 0,
                c1x = ball_x + (_ballR - cross_w >> 1),
                c1y = ball_y + (_ballR - cross_h >> 1),
                c2x = ball_x + (_ballR - cross_h >> 1),
                c2y = ball_y + (_ballR - cross_w >> 1);

            $circle.style.width = _ballR + 'px';
            $circle.style.height = _ballR + 'px';
            $circle.style[CMDetect.TRANSFORM] = 'translate3d(' + ball_x + 'px,  ' + ball_y + 'px, 0px)';

            $cross1.style.width = cross_w + 'px';
            $cross1.style.height = cross_h + 'px';
            $cross1.style[CMDetect.TRANSFORM] = 'translate3d(' + c1x + 'px,  ' + c1y + 'px, 0px)';

            $cross2.style.width = cross_h + 'px';
            $cross2.style.height = cross_w + 'px';
            $cross2.style[CMDetect.TRANSFORM] = 'translate3d(' + c2x + 'px,  ' + c2y + 'px, 0px)';
        }

        return {
            init: init,
            setPos: setPos
        }

    } )();


var MotionItem = MotionItem || ( function () {

        var $con, $box, _boxR, $canvas, _ctx;


        function init(con) {
            $con = con;

            $box = document.createElement('div');
            $box.className = 'motion-box';

            $canvas = document.createElement('canvas');
            $canvas.className = 'motion-canvas';

            $con.appendChild($box);
            $con.appendChild($canvas);
        }

        function setPos(w, h, x, y) {
            if (h > w) _boxR = w / 3 | 0;
            else _boxR = h / 3 | 0;

            var box_x = _boxR / 4 | 0,
                box_x2 = box_x + _boxR,
                sw = w * 1.2,
                sh = h * 1.2,
                rbx = sw,
                rby = sh - _boxR,
                lbx = sw - _boxR,
                lby = sh,
                gra;

            $box.style.width = _boxR + 'px';
            $box.style.height = _boxR + 'px';
            $box.style[CMDetect.TRANSFORM] = 'translate3d(' + box_x + 'px,  ' + box_x + 'px, 0px)';

            $canvas.width = w;
            $canvas.height = h;
            _ctx = $canvas.getContext('2d');
            _ctx.fillStyle = CMDetect.colors[2];
            _ctx.fillRect(0 , 0, w, h);

            _ctx.save();
            if (h > w) gra = _ctx.createLinearGradient(box_x2, box_x, rbx, rby);
            else gra = _ctx.createLinearGradient(box_x, box_x2, lbx, lby);
            gra.addColorStop(0, '#e5585f');
            gra.addColorStop(1, '#904199');
            _ctx.fillStyle = gra;
            _ctx.beginPath();
            _ctx.moveTo(box_x, box_x2);
            _ctx.lineTo(box_x2, box_x);
            _ctx.lineTo(rbx, rby);
            _ctx.lineTo(lbx, lby);
            _ctx.fill();
            _ctx.restore();
        }

        return {
            init: init,
            setPos: setPos
        }

    } )();


var ChangeItem = ChangeItem || ( function () {

        var $con, $canvas, _ctx, _ball,
            LINE_H = 6, LINE_GAP = 8,
            LINE_GAP2 = LINE_GAP * 2;


        function init(con) {
            $con = con;

            $canvas = document.createElement('canvas');
            $canvas.className = 'motion-canvas';

            $con.appendChild($canvas);

            _ball = new UI.changeBall();
        }

        function setPos(w, h, x, y) {
            var tr, tx, ty, jtotal, itotal;
            $canvas.width = w;
            $canvas.height = h;
            _ctx = $canvas.getContext('2d');
            _ctx.fillStyle = CMDetect.colors[3];
            _ctx.strokeStyle = '#d24b80'; //eb4c80
            _ctx.lineWidth = 1.5;
            _ctx.lineCap = 'round';
            _ctx.fillRect(0 , 0, w, h);

            if (h > w) {
                tr = w / 5 | 0;
                tx = w >> 1;
                ty = h - (h / 4 | 0);
            } else {
                tr = h / 5 | 0;
                tx = w - (w / 4 | 0);
                ty = h >> 1;
            }
            if(tr < 20) tr = 20;
            else if(tr > 60) tr = 60;

            _ball.resize(_ctx, tr, w, h);
            _ball.x = tx;
            _ball.y = ty;


            itotal = w / LINE_GAP2 | 0;
            jtotal = h / LINE_GAP2 | 0;

            var jv, iv, i, j, hv;

            for (i=0; i<=itotal; i++) {
                for (j=0; j<=jtotal; j++) {
                    iv = LINE_GAP + i * LINE_GAP2;
                    jv = LINE_GAP + j * LINE_GAP2;

                    hv = calcVec(iv - tx, jv - ty);

                    _ctx.save();
                    _ctx.translate(iv, jv);
                    _ctx.rotate(hv.heading());
                    _ctx.beginPath();
                    _ctx.moveTo(-LINE_H, 0);
                    _ctx.lineTo(LINE_H, 0);
                    _ctx.stroke();
                    _ctx.restore();
                }
            }


            _ball.draw();
        }

        function calcVec(x, y) {
            return new p5.Vector(y - x, - x - y);
        }

        return {
            init: init,
            setPos: setPos
        }


    } )();


var InteractionItem = InteractionItem || ( function () {

        var $con, $canvas, _ctx, _planeTop, _planeBottom, _planeMiddle;

        function init(con) {
            $con = con;

            $canvas = document.createElement('canvas');
            $canvas.className = 'motion-canvas';
            $con.appendChild($canvas);

            _planeTop = new UI.plane('#ffffff');
            _planeBottom = new UI.plane('#1f4388');
            _planeMiddle = new UI.plane('#ef4d80');
        }

        function setPos(w, h, x, y) {
            var tw = 524, th = 514, tx, ty,
                bottom_y, middle_y, scale = 1,
                plane_w, plane_h;

            $canvas.width = w;
            $canvas.height = h;
            _ctx = $canvas.getContext('2d');
            _ctx.fillStyle = CMDetect.colors[4];
            _ctx.fillRect(0 , 0, w, h);

            if (w - 40 < tw) {
                tw = w - 40;
                scale = tw / 524;
                if (514 * scale > h) scale = th / 514;
            } if (h - 40 < th) {
                th = h - 40;
                scale = th / 514;
                if (524 * scale > w) scale = tw / 524;
            }

            tw = 524 * scale;
            th = 514 * scale;
            tx = (w - tw) >> 1;
            ty = (h - th) >> 1;
            plane_w = 240 * scale;
            plane_h = 142 * scale;
            bottom_y = ty + th - (plane_h * 2);
            middle_y = ty + ((bottom_y - ty) >> 1);

            _planeTop.resize(_ctx, tw, tx, ty, plane_w, plane_h);
            _planeBottom.resize(_ctx, tw, tx, bottom_y, plane_w, plane_h);
            _planeMiddle.resize(_ctx, tw, tx, middle_y, plane_w, plane_h);

            _planeBottom.draw();
            _planeMiddle.draw();
            _planeTop.draw();
        }

        return {
            init: init,
            setPos: setPos
        }

    } )();
