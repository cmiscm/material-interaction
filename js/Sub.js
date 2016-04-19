var Sub = Sub || ( function () {

        var $root, $container, $canvas, _ctx, $guide, _ctxGuide,
            _color, _curID, _curClass,
            _isGuide = [1,1,1,1,1], _isCloseGuide = 1;


        function init(root) {
            $root = root;

            $container = document.createElement('div');
            $container.id = 'sub-container';

            $canvas = document.createElement('canvas');
            $canvas.id = 'sub-canvas';
            _ctx = $canvas.getContext('2d');

            $guide = document.createElement('canvas');
            $guide.id = 'sub-guide';
            _ctxGuide = $guide.getContext('2d');

            Surface.init($container, $canvas, _ctx, $guide, _ctxGuide);
            Action.init($container, $canvas, _ctx, $guide, _ctxGuide);
            Motion.init($container, $canvas, _ctx, $guide, _ctxGuide);
            Change.init($container, $canvas, _ctx, $guide, _ctxGuide);
            Interaction.init($container, $canvas, _ctx, $guide, _ctxGuide);
        }

        function show(no) {
            _curID = no | 0;
            _color = CMDetect.colors[_curID];
            $container.style.backgroundColor = _color;
            $root.appendChild($container);

            switch (_curID) {
                case 0:
                    _curClass = Surface;
                    break;
                case 1:
                    _curClass = Action;
                    break;
                case 2:
                    _curClass = Motion;
                    break;
                case 3:
                    _curClass = Change;
                    break;
                case 4:
                    _curClass = Interaction;
                    break;
            }

            _curClass.ready(_isGuide[_curID]);

            _isGuide[_curID] = 0;

            TweenLite.delayedCall(0.1, delayShow);
        }
        function delayShow() {
            var delay = _curClass.show();
            TweenLite.delayedCall(delay, endShow);
        }
        function endShow() {
            Close.show(0.6, _curID);
            _curClass.endShow();
            Address.addEvent(_curClass);
            Address.able();
        }

        function hide() {
            Close.hide();
            _curClass.hide();
        }
        function endHide() {
            Index.goBack(_curID);
            CMUtiles.removeDom($container);
            _curClass.dispose();
        }

        function showGuide() {
            $container.appendChild($guide);
            TweenLite.to($guide,.6, {
                delay:1,
                css:{opacity:1},
                ease:Cubic.easeOut,
                onStart:function() {
                    Address.addCancel();
                }
            });
            TweenLite.delayedCall(3, hideGuide);

        }
        function hideGuide() {
            Address.removeCancel();
            TweenLite.to($guide,.3, {
                css:{opacity:0},
                ease:Cubic.easeOut,
                onComplete:function() {
                    CMUtiles.removeDom($guide);
                }
            });
        }

        function cancelGuide() {
            TweenLite.killDelayedCallsTo(endShow);
            TweenLite.killDelayedCallsTo(hideGuide);
            TweenLite.killTweensOf($guide);
            hideGuide();
            TweenLite.delayedCall(.3, endShow);
        }

        return {
            init: init,
            show: show,
            hide: hide,
            endHide: endHide,
            showGuide: showGuide,
            cancelGuide: cancelGuide
        }

} )();
