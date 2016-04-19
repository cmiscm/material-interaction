var Address = Address || ( function () {

        var _public = {},
            $root, $block,  $indexCon,
            _mode = 0,//0-index,1-sub,2-about
            _cursor = 0,//0-normal, 1-move, 2-nwse-resize, 3-slide
            _isCancel = 0, _curClass, _isAble = true;

        function init() {
            $block = document.getElementById('block');
            $root = document.getElementById('root');

            $indexCon = document.createElement('div');
            $indexCon.id = 'index-container';

            if (CMDetect.VENDOR != 'webkit' && CMDetect.VENDOR != 'Moz' && CMDetect.VENDOR != 'ms') {
                CMUtiles.removeDom($block);
                $root.className = 'admin';
                $root.innerHTML = '<h1>Oops!</h1><div class="message">Material Interaction was created with HTML5 and CSS3.<br>It\'s a Chrome experiment and you can see perfectly on Chrome browser.<br>Please use <a href="http://www.google.com/chrome" target="_blank">Google Chrome browser</a>.</div>';
                return;
            }

            StageController.init({minw:320});

            Index.init($root, $indexCon);
            About.init($root);
            Sub.init($root);
            Close.init($root);

            if (CMDetect.isTouch) {
                addListener(window.document, 'touchstart', touchStart);
                addListener(window.document, 'touchmove', touchMove);
                addListener(window.document, 'touchend', touchEnd);
            }
            if (CMDetect.isMouse) {
                addListener(window.document, 'mousedown', onDown);
                addListener(window.document, 'mousemove', onMove);
                addListener(window.document, 'mouseup', onUp);
            }
        }

        function showAbout() {
            unable();
            _mode = 2;
            About.show($indexCon);
            TweenLite.delayedCall(1.9, endShowAbout);
        }
        function endShowAbout() {
            About.endShow();
            able();
        }

        function hideAbout() {
            unable();
            About.hide();
            TweenLite.delayedCall(1.9, endHideAbout);
        }
        function endHideAbout() {
            $root.appendChild($indexCon);
            About.endHide();
            able();
        }

        function goSub(no) {
            _mode = 1;
            _isCancel = 0;
            unable();
            About.hidePage();
            Index.goSub(no);
        }

        function goClose() {
            unable();
            _isCancel = 0;
            if (_mode == 2) {
                hideAbout();
            } else {
                About.showPage(1.2);
                Sub.hide();
                _curClass = null;
                _mode = 0;
                setCursor(0);
            }
        }

        function setCursor(cursor) {
            if (_cursor == cursor) return;
            _cursor = cursor;
            switch (_cursor) {
                case 0:
                    $root.className = 'c-normal';
                    break;
                case 1:
                    $root.className = 'c-move';
                    break;
                case 2:
                    $root.className = 'c-resize';
                    break;
                case 3:
                    $root.className = 'c-slide';
                    break;
            }
        }

        function addCancel() {
            _isCancel = 1;
        }
        function removeCancel() {
            _isCancel = 0;
        }

        function addEvent(obj) {
            _curClass = obj;
        }
        function removeEvent() {
            _curClass = null;
        }

        function onDown(e) {
            if (_isCancel) Sub.cancelGuide();
            if (_curClass) _curClass.downFn(e.pageX, e.pageY);
        }

        function onMove(e) {
            if (_curClass) {
                _curClass.moveFn(e.pageX, e.pageY);
                _curClass.checkMouse(e.pageX, e.pageY);
            }
        }
        function onUp(e) {
            if (_curClass) _curClass.upFn();
        }

        function touchStart(e) {
            if (_isCancel) Sub.cancelGuide();
            var touch = e.touches[0];
            if (_curClass) _curClass.downFn(touch.pageX, touch.pageY);
        }
        function touchMove(e) {
            e.preventDefault();
            var touch = e.touches[0];
            if (_curClass) _curClass.moveFn(touch.pageX, touch.pageY);
        }
        function touchEnd(e) {
            if (_curClass) _curClass.upFn();
        }

        function able() {
            _isAble = true;
            $block.style.display = 'none';
        }

        function unable() {
            _isAble = false;
            $block.style.display = 'block';
        }

        _public.init = init;
        _public.able = able;
        _public.unable = unable;
        _public.goSub = goSub;
        _public.goClose = goClose;
        _public.addEvent = addEvent;
        _public.removeEvent = removeEvent;
        _public.showAbout = showAbout;
        _public.setCursor = setCursor;
        _public.addCancel = addCancel;
        _public.removeCancel = removeCancel;
        return _public;
} )();
