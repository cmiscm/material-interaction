var CMDetect = new function(){

    this.isTouch = !!('ontouchstart' in window);
    this.isMouse = !!('onmousedown' in window);
    this.colors = ['#00a896', '#ea1b75', '#904199', '#204489', '#bacbe9'];

    this.APP_ID = 'TYPE YOUR APP ID';
    this.TITLE = 'Material Interaction';
    this.SITE_URL = 'http://material.cmiscm.com/';

    if (!Modernizr.csstransforms3d || !Modernizr.canvas || !Modernizr.canvastext) {
        this.VENDOR = "";
    } else {
        var styles = window.getComputedStyle(document.documentElement, '');
        this.VENDOR = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1];
        if (this.VENDOR == "moz") this.VENDOR = "Moz";
        this.TRANSFORM = this.VENDOR + 'Transform';
        this.DURATION = this.VENDOR + 'TransitionDuration';
        this.ORIGIN = this.VENDOR + 'TransformOrigin';
    }
}
