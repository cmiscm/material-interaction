var About = About || ( function () {

        var $root, $aboutButton, $about, $logo, $aboutLogo, $aboutButtonBg,
            $pageFlip, $flip1, $flip2, $page1, $page2, $pageCon1, $pageCon2,
            _sw, _sh, _dis, _bh, _originX, _originY, _originXOver,
            TIME = 1.4, _btSize = 100, GAP = 70, //100-70, 90-64, 80-57, 70-50, 60-43, 50-36,
            _obj, _isPaused = 0;


        function init(root) {
            $root = root;
            $about = document.getElementById('about');

            $pageFlip = document.createElement('div');
            $pageFlip.id = 'page-flip';

            $flip1 = document.createElement('div');
            $flip1.className = 'flip';

            $flip2 = document.createElement('div');
            $flip2.className = 'flip';

            $page1 = document.createElement('div');
            $page1.className = 'page';

            $page2 = document.createElement('div');
            $page2.className = 'page';

            $pageCon1 = document.createElement('div');
            $pageCon1.className = 'page-con page-con-1';

            $pageCon2 = document.createElement('div');
            $pageCon2.className = 'page-con page-con-2';

            $page1.appendChild($pageCon1);
            $flip1.appendChild($page1);
            $page2.appendChild($pageCon2);
            $flip2.appendChild($page2);
            $pageFlip.appendChild($flip1);
            $pageFlip.appendChild($flip2);

            $aboutLogo = document.getElementById('about-logo');

            $aboutButton = document.getElementById('about-button');
            $logo = $aboutButton.getElementsByClassName('logo')[0];
            $aboutButtonBg = $aboutButton.getElementsByTagName('span')[0];

            addListener($aboutButton, 'click', onAbout);

            new UI.share($about.getElementsByClassName('twitter')[0], onTwitterClick);
            new UI.share($about.getElementsByClassName('facebook')[0], onFbClick);
            new UI.share($about.getElementsByClassName('gplus')[0], onGplusClick);
            new UI.share($about.getElementsByClassName('pinterest')[0], onPinClick);

            CMUtiles.removeDom($about);

            StageController.addResize('About', resize);
        }

        function resize() {
            _sw = StageController.stageWidth;
            _sh = StageController.stageHeight;
            var dis = CMUtiles.distance(0, 0, _sw, _sh),
                bt = dis * 0.1 | 0;
            if (bt < 40) bt = 40;
            else if (bt > 100) bt = 100;
            _btSize = bt;
            GAP = ((_btSize - 40) * 0.7) + 29 | 0;

            _dis = dis << 1;
            _bh = _sh + _dis;
            _originX = _sw + _dis + GAP;
            _originY = dis;
            _originXOver = _originX + (_sw - GAP);

            $aboutButton.style.width = _btSize + 'px';
            $aboutButton.style.height = _btSize + 'px';
            $aboutButton.style[CMDetect.ORIGIN] = _btSize + 'px 0px';

            $aboutLogo.style.width = _btSize + 'px';
            $aboutLogo.style.height = _btSize + 'px';
        }

        function loading() {
            $aboutButton.style[CMDetect.TRANSFORM] = 'translate3d(0px, 0px, 0px) scale3d(0, 0, 1)';
            $aboutButton.style.visibility = 'visible';
            showPage(0.5);
        }

        function showPage(delay) {
            //$aboutButton.style.pointerEvents = 'auto';
            TweenLite.delayedCall(delay, function() {
                $aboutButton.style[CMDetect.DURATION] = '.3s';
                $aboutButton.style[CMDetect.TRANSFORM] = 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1)';
            });
            TweenLite.delayedCall(delay + 0.3, function() {
                $logo.style.opacity = 1;
            });
        }

        function hidePage() {
            //$aboutButton.style.pointerEvents = 'none';
            $logo.style.opacity = 0;
            TweenLite.delayedCall(0.2, function() {
                $aboutButton.style[CMDetect.DURATION] = '.3s';
                $aboutButton.style[CMDetect.TRANSFORM] = 'translate3d(0px, 0px, 0px) scale3d(0, 0, 1)';
            });
        }

        function setting() {
            $pageFlip.style.width = _sw + 'px';
            $pageFlip.style.height = _sh + 'px';
            $page1.style.width = (_originXOver - _sw) + 'px';
            $page1.style.height = _bh + 'px';
            $page2.style.width = (_originXOver - _sw) + 'px';
            $page2.style.height = _bh + 'px';
            $pageCon1.style.width = _sw + 'px';
            $pageCon1.style.height = _sh + 'px';
            $pageCon2.style.width = _sw + 'px';
            $pageCon2.style.height = _sh + 'px';

            $pageCon1.style[CMDetect.ORIGIN] = _sw + 'px 0px';
            $pageCon2.style[CMDetect.ORIGIN] = '0px 0px';

            update();
        }

        function show(dom) {
            $root.appendChild($pageFlip);
            $pageFlip.appendChild($about);
            $pageCon1.appendChild(dom);

            CMUtiles.removeDom($aboutButton);

            _obj = {
                ox:_originX, oy:_originY,
                r1:-45, r2:45,
                fx1:_sw - _originX, fy1:-_originY,
                px1:_originX - _sw, py1:_originY,
                fx2:_sw - _originX, fy2:-_originY,
                px2:_originX - GAP - GAP, py2:_originY
            };
            setting();

            TweenLite.delayedCall(0.02, function() {
                $pageFlip.className = 'active';

                TweenLite.to(_obj, TIME, {
                    ox:_originXOver,
                    fx1:GAP - _originX,
                    r1:0,
                    r2:0,
                    px1:_originX - GAP,
                    fx2:_sw - _originXOver,
                    px2:_dis,

                    ease:Cubic.easeInOut
                });

                _isPaused = 0;
                draw();
            });
        }

        function endShow() {
            _isPaused = 1;
            $root.appendChild($about);
            $pageFlip.className = '';
            CMUtiles.removeDom($pageFlip);
            Close.show(0, 5);
        }

        function hide() {
            Close.hide();
            $root.appendChild($pageFlip);
            $pageFlip.appendChild($about);

            _obj = {
                ox:_originXOver, oy:_originY,
                r1:0, r2:0,
                fx1:GAP - _originX, fy1:-_originY,
                px1:_originX - GAP, py1:_originY,
                fx2:_sw - _originXOver, fy2:-_originY,
                px2:_dis, py2:_originY
            };
            setting();

            TweenLite.delayedCall(0.02, function() {
                $pageFlip.className = 'active';

                TweenLite.to(_obj, TIME, {
                    ox:_originX,
                    fx1:_sw - _originX,
                    r1:-45,
                    r2:45,
                    px1:_originX - _sw,
                    fx2:_sw - _originX,
                    px2:_originX - GAP - GAP,

                    ease:Cubic.easeInOut
                });

                _isPaused = 0;
                draw();
            });
        }

        function endHide() {
            _isPaused = 1;
            $root.appendChild($aboutButton);
            $pageFlip.className = '';
            CMUtiles.removeDom($pageFlip);
        }

        function draw() {
            if (_isPaused) return;
            requestAnimationFrame(draw);
            update();
        }

        function update() {
            $flip1.style[CMDetect.ORIGIN] = _obj.ox + 'px ' + _obj.oy + 'px';
            $flip1.style[CMDetect.TRANSFORM] = 'translate3d(' + _obj.fx1 + 'px, ' + _obj.fy1 + 'px, 0px) rotate(' + _obj.r1 + 'deg)';
            $pageCon1.style[CMDetect.TRANSFORM] = 'translate3d(' + _obj.px1 + 'px, ' + _obj.py1 + 'px, 0px) rotate(' + _obj.r2 + 'deg)';

            $flip2.style[CMDetect.ORIGIN] = _obj.ox + 'px ' + _obj.oy + 'px';
            $flip2.style[CMDetect.TRANSFORM] = 'translate3d(' + _obj.fx2 + 'px, ' + _obj.fy2 + 'px, 0px) rotate(' + _obj.r1 + 'deg)';
            $pageCon2.style[CMDetect.TRANSFORM] = 'translate3d(' + _obj.px2 + 'px, ' + _obj.py2 + 'px, 0px) rotate(' + _obj.r1 + 'deg)';
        }

        function onAbout(e) {
            Address.showAbout();
        }

        function onTwitterClick() {
            var share_url = "http://twitter.com/share?url=" + encodeURIComponent(CMDetect.SITE_URL) + "&text=" + encodeURIComponent('Interactive experiences for Google\'s Material Design Principles by @cmiscm');
            CMUtiles.openPopup(share_url, "", 600, 260);
        }
        function onFbClick() {
            var share_url = "https://www.facebook.com/dialog/feed?app_id=" + CMDetect.APP_ID +
                "&link=" + encodeURIComponent(CMDetect.SITE_URL) +
                "&picture=" + encodeURIComponent(CMDetect.SITE_URL + 'images/share.png') +
                "&name=" + encodeURIComponent(CMDetect.TITLE) +
                "&caption=" + encodeURIComponent(CMDetect.SITE_URL) +
                "&description=" + encodeURIComponent("Interactive experiences for Google\'s Material Design Principles.") +
                "&redirect_uri=" + encodeURIComponent(CMDetect.SITE_URL + "close.html") +
                "&display=popup";
            CMUtiles.openPopup(share_url, "", 600, 500);
        }
        function onGplusClick() {
            var share_url = "https://plus.google.com/share?url=" + encodeURIComponent(CMDetect.SITE_URL);
            CMUtiles.openPopup(share_url, "", 600, 400);
        }
        function onPinClick() {
            var share_url = 'http://pinterest.com/pin/create/button/?url=' + encodeURIComponent(CMDetect.SITE_URL)
                    + '&media=' + encodeURIComponent(CMDetect.SITE_URL + 'images/share.png')
                    + '&description=' + encodeURIComponent(CMDetect.TITLE);
            CMUtiles.openPopup(share_url, "", 700, 300);
        }

        return {
            init: init,
            loading: loading,
            show: show,
            endShow: endShow,
            hide: hide,
            endHide: endHide,
            showPage: showPage,
            hidePage: hidePage
        }

} )();
