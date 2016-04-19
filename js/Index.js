var Index = Index || ( function () {

        var $root, $container, $canvas, _ctx,
            _sw, _sh, _sw2, _sh2, _sw2H, _sh2H,
            _overG = 40, _overG2 = 80, _pos, _alpha,  _cur,
            _itemArr = [],
            _isClicked = 0, _isLoading = 1, _isPaused = 1;

        function init(root, con) {
            $root = root;
            $container = con;
            $root.appendChild($container);

            var i, item;
            for (i=0; i<5; i++) {
                item = new UI.item(i, CMDetect.colors[i]);
                $container.appendChild(item.dom);
                _itemArr.push(item);
            }

            $canvas = document.createElement('canvas');
            $canvas.id = 'index-canvas';

            if (CMDetect.isTouch) {
                _overG = 20;
                _overG2 = 40;
            }

            StageController.addResize('index', resize);

            Loading.init($root, $canvas, _sw, _sh);
        }

        function endLoad() {
            _isLoading = 0;
            CMUtiles.removeDom($canvas);
            About.loading();

            var i, item;
            for (i=0; i<5; i++) {
                item = _itemArr[i];
                item.load(i * 0.08);
            }

            TweenLite.delayedCall((0.08 * 4) + 0.3, function() {

                Address.able();
            });
        }

        function resize() {
            _sw = StageController.stageWidth;
            _sh = StageController.stageHeight;
            _sw2 = Math.ceil(_sw / 2);
            _sh2 = Math.ceil(_sh / 2);
            _sw2H = Math.ceil(_sw2 / 2);
            _sh2H = Math.ceil(_sh2 / 2);

            $canvas.width = _sw;
            $canvas.height = _sh;
            _ctx = $canvas.getContext('2d');
            _ctx.clearRect(0, 0, _sw, _sh);

            if (_sh > _sw) setPosH();
            else setPosW();

            if (_isLoading) Loading.resize(_ctx, _sw, _sh, _sw2, _sh2, _sw2H, _sh2H);
        }

        function setPosH() {
            _itemArr[0].setPos(_sw, _sh2, 0, 0);
            _itemArr[1].setPos(_sw2, _sh2, 0, _sh2);
            _itemArr[2].setPos(_sw2, _sh2H, _sw2, _sh2);
            _itemArr[3].setPos(_sw2H, _sh2H, _sw2, _sh2 + _sh2H);
            _itemArr[4].setPos(_sw2H, _sh2H, _sw2 + _sw2H, _sh2 + _sh2H);
        }

        function setPosW() {
            _itemArr[0].setPos(_sw2, _sh, 0, 0);
            _itemArr[1].setPos(_sw2, _sh2, _sw2, 0);
            _itemArr[2].setPos(_sw2H, _sh2, _sw2, _sh2);
            _itemArr[3].setPos(_sw2H, _sh2H, _sw2 + _sw2H, _sh2);
            _itemArr[4].setPos(_sw2H, _sh2H, _sw2 + _sw2H, _sh2 + _sh2H);
        }


        function goSub(no) {
            _cur = no | 0;
            _isClicked = 1;
            overFn(no);
            var item = _itemArr[no];
            _pos = {x:item.x + _overG, y:item.y + _overG, w:item.w - _overG2, h:item.h - _overG2, color:item.color};
            _alpha = {no:0};
            _itemArr[_cur].hide();

            TweenLite.delayedCall(0.3, delaySub);
        }
        function delaySub() {
            $root.appendChild($canvas);
            TweenLite.to(_pos, 1, {
                x:0,
                y:0,
                w:_sw,
                h:_sh,
                alpha:0.8,
                ease:Expo.easeInOut,
                onComplete:endSub
            });

            TweenLite.to(_alpha, 1, {
                no:0.8,
                ease:Cubic.easeOut
            });

            _isPaused = 0;
            draw();
        }
        function endSub() {
            _isClicked = 0;
            _isPaused = 1;
            Sub.show(_cur);
            CMUtiles.removeDom($canvas);
            CMUtiles.removeDom($container);
            _ctx.clearRect(0 , 0, _sw, _sh);

            StageController.removeResize('index');
        }

        function draw() {
            if (_isPaused) return;
            requestAnimationFrame(draw);

            _ctx.clearRect(0 , 0, _sw, _sh);

            _ctx.fillStyle = 'rgba(0,0,0,' + _alpha.no + ')';
            _ctx.fillRect(0 , 0, _sw, _sh);


            _ctx.fillStyle = _pos.color;
            _ctx.fillRect(_pos.x, _pos.y, _pos.w, _pos.h);
        }

        function goBack(no) {
            StageController.addResize('index', resize);

            var item = _itemArr[no];
            $root.appendChild($container);
            $root.appendChild($canvas);

            _pos = {x:0, y:0, w:_sw, h:_sh, color:item.color};

            TweenLite.to(_pos, 1, {
                x:item.x + _overG,
                y:item.y + _overG,
                w:item.w - _overG2,
                h:item.h - _overG2,
                alpha:0.8,
                ease:Expo.easeInOut,
                onComplete:endBack
            });

            _alpha.no = 0.8;
            TweenLite.to(_alpha, 1, {
                no:0,
                ease:Cubic.easeIn
            });

            _isPaused = 0;
            draw();
        }
        function endBack() {
            CMUtiles.removeDom($canvas);
            _itemArr[_cur].show();
            overFn(-1);
            Address.able();
        }

        function over(no) {
            if (_isClicked) return;
            overFn(no);
        }

        function out(no) {
            if (_isClicked) return;
            overFn(-1);
        }

        function overFn(no) {
            var i, item;
            for (i=0; i<5; i++) {
                item = _itemArr[i];
                if (i == no) item.over();
                else item.out();
            }
        }


        return {
            init: init,
            over: over,
            out: out,
            goSub: goSub,
            goBack: goBack,
            endLoad: endLoad
        }

} )();
