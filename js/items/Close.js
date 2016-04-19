var Close = Close || ( function () {

        var $root, $close, $bg, $icon,
            _color = ['#ef4d80', '#1f4388', '#00a896', '#fcb447', '#904199', '#ff4081'];


        function init(root) {
            $root = root;

            $close = document.createElement('div');
            $close.id = 'close';

            $bg = document.createElement('span');
            $icon = document.createElement('i');

            $close.appendChild($bg);
            $close.appendChild($icon);

            if (!CMDetect.isTouch) {
                addListener($close, 'mouseenter', onOver);
                addListener($close, 'mouseleave', onOut);
            }

            addListener($close, 'click', onClick);

            TweenLite.set($close, {
                css:{scale:0}
            });
        }

        function show(delay, color) {
            $bg.style.backgroundColor = _color[color];
            $root.appendChild($close);
            TweenLite.to($close, 1, {
                delay:delay,
                css:{scale:1},
                ease:Elastic.easeOut
            });
        }

        function hide() {
            TweenLite.to($close, 0.3, {
                css:{scale:0},
                ease:Back.easeIn,
                easeParams:[2.2],
                onComplete:endHide
            });
            TweenLite.to($bg, 0.3, {
                css:{scale:1},
                ease:Cubic.easeOut
            });
            TweenLite.to($icon, 0.3, {
                css:{rotation:0},
                ease:Cubic.easeOut
            });
        }

        function endHide() {
            CMUtiles.removeDom($close);
        }

        function onOver(e) {
            TweenLite.to($bg, 0.8, {
                css:{scale:1.3},
                ease:Elastic.easeOut
            });
            TweenLite.to($icon, 0.5, {
                css:{rotation:90},
                ease:Back.easeOut,
                easeParams:[4.0]
            });
        }

        function onOut(e) {
            TweenLite.to($bg, 0.3, {
                css:{scale:1},
                ease:Cubic.easeOut
            });
            TweenLite.to($icon, 0.3, {
                css:{rotation:0},
                ease:Cubic.easeOut
            });
        }

        function onClick(e) {
            Address.goClose();
        }

        return {
            init: init,
            show: show,
            hide: hide
        }

} )();
