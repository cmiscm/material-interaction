/**
 * Stage Controller
 * @author Jongmin Kim - cmiscm@google.com
 */

var StageController = StageController || ( function () {

    var _public = {
            stageWidth: 0,
            stageHeight: 0,
            maxWidth:0,
            maxHeight:0
        },
        _resizeNameArr = [], _resizeFnArr = [], $check;

    function init(config){
        $check = document.createElement('div');
        $check.id = 'check';

        document.body.appendChild($check);

        if (config) {
            _public.maxWidth = config.maxw || 0;
            _public.maxHeight = config.maxh || 0;
            _public.minWidth = config.minw || 0;
            _public.minHeight = config.minh || 0;
        }

        if (CMDetect.isTouch) {
            new FastClick(document.getElementById('root'));
        }

        window.addEventListener('resize', onResize, true);
        onResize();

        if (window.DeviceOrientationEvent) window.addEventListener("orientationchange", onResize, false);
    }

    function addResize(name, fn) {
        var check = _resizeNameArr.indexOf(name);
        if (check > -1) return;
        _resizeNameArr.unshift(name);
        _resizeFnArr.unshift(fn);
        fn();
    }

    function removeResize(name) {
        var check = _resizeNameArr.indexOf(name);
        if (check > -1) {
            _resizeNameArr.splice(check, 1);
            _resizeFnArr.splice(check, 1);
        }
    }

    function onResize() {
        var sw = $check.offsetWidth,
            sh = $check.offsetHeight;

        if (_public.maxWidth > 0) sw = (sw > _public.maxWidth) ? _public.maxWidth : sw;
        if (_public.maxHeight > 0) sh = (sh > _public.maxHeight) ? _public.maxHeight : sh;
        if (_public.minWidth > 0) sw = (sw < _public.minWidth) ? _public.minWidth : sw;
        if (_public.minHeight > 0) sh = (sh < _public.minHeight) ? _public.minHeight : sh;
        if (_public.stageWidth == sw && _public.stageHeight == sh) return;

        _public.stageWidth = sw;
        _public.stageHeight = sh;

        var i = _resizeFnArr.length;
        while(i--) _resizeFnArr[i]();
    }




    _public.init = init;
    _public.onResize = onResize;
    _public.addResize = addResize;
    _public.removeResize = removeResize;

    return _public;

} )();