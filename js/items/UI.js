var UI = {item:null};

UI.PI2 = Math.PI * 2;

UI.item = function (index, color) {
    this.index = index | 0;
    this.color = color;

    this.dom = document.createElement('div');
    this.dom.id = 'index-' + index;
    this.dom.className = 'index-box';
    this.dom.className = 'index-box';
    this.dom.style.backgroundColor = color;
    this.dom.setAttribute('data-id', index);

    this.over0 = document.createElement('div');
    this.over0.id = 'index-line-0';
    this.over0.className = 'index-line';

    this.over1 = document.createElement('div');
    this.over1.id = 'index-line-1';
    this.over1.className = 'index-line';

    this.over2 = document.createElement('div');
    this.over2.id = 'index-line-2';
    this.over2.className = 'index-line';

    this.over3 = document.createElement('div');
    this.over3.id = 'index-line-3';
    this.over3.className = 'index-line';

    this.con = document.createElement('div');
    this.con.className = 'index-box-con';
    this.con.style.backgroundColor = color;

    this.dom.appendChild(this.con);

    this.dom.appendChild(this.over0);
    this.dom.appendChild(this.over1);
    this.dom.appendChild(this.over2);
    this.dom.appendChild(this.over3);

    switch (this.index) {
        case 0:
            this.curClass = SurfaceItem;
            break;
        case 1:
            this.curClass = ActionItem;
            break;
        case 2:
            this.curClass = MotionItem;
            break;
        case 3:
            this.curClass = ChangeItem;
            break;
        case 4:
            this.curClass = InteractionItem;
            break;
    }

    this.curClass.init(this.con);

    if (!CMDetect.isTouch) {
        addListener(this.dom, 'mouseenter', this.onOver);
        addListener(this.dom, 'mouseleave', this.onOut);
    }
    addListener(this.dom, 'click', this.onClick);


    this.con.style[CMDetect.DURATION] = '0s';
    this.con.style.opacity = 0;
    this.con.style[CMDetect.TRANSFORM] = 'translate3d(0px, 0px, 0px) scale3d(0.9, 0.9, 1)';

    return this;
};

UI.item.prototype = {
    setPos: function (w, h, x, y) {
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
        this.dom.style.width = w + 'px';
        this.dom.style.height = h + 'px';
        this.dom.style[CMDetect.TRANSFORM] = 'translate3d(' + x + 'px, ' + y + 'px, 0px)';

        this.curClass.setPos(w, h, x, y);
    },
    load: function(delay) {
        var _this = this;
        if (delay > 0) {
            TweenLite.delayedCall(delay, function() {
                _this.show();
            });
        } else {
            _this.show();
        }
    },
    hide: function() {
        this.con.style[CMDetect.DURATION] = '.3s';
        this.con.style.opacity = 0;
        this.con.style[CMDetect.TRANSFORM]= 'translate3d(0px, 0px, 0px) scale3d(0.9, 0.9, 1)';

        this.over0.style[CMDetect.DURATION] = '.3s';
        this.over1.style[CMDetect.DURATION] = '.3s';
        this.over2.style[CMDetect.DURATION] = '.3s';
        this.over3.style[CMDetect.DURATION] = '.3s';

        if (CMDetect.isTouch) {
            this.over0.style[CMDetect.TRANSFORM]= 'translate3d(0px, -20px, 0px)';
            this.over1.style[CMDetect.TRANSFORM]= 'translate3d(20px, 0px, 0px)';
            this.over2.style[CMDetect.TRANSFORM]= 'translate3d(0px, 20px, 0px)';
            this.over3.style[CMDetect.TRANSFORM]= 'translate3d(-20px, 0px, 0px)';
        } else {
            this.over0.style[CMDetect.TRANSFORM]= 'translate3d(0px, 0px, 0px)';
            this.over1.style[CMDetect.TRANSFORM]= 'translate3d(0px, 0px, 0px)';
            this.over2.style[CMDetect.TRANSFORM]= 'translate3d(0px, 0px, 0px)';
            this.over3.style[CMDetect.TRANSFORM]= 'translate3d(0px, 0px, 0px)';
        }
    },
    show: function() {
        this.con.style[CMDetect.DURATION] = '.3s';
        this.con.style.opacity = 1;
        this.con.style[CMDetect.TRANSFORM]= 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1)';
    },
    over: function () {
        this.over0.style[CMDetect.DURATION] = '.3s';
        this.over1.style[CMDetect.DURATION] = '.3s';
        this.over2.style[CMDetect.DURATION] = '.3s';
        this.over3.style[CMDetect.DURATION] = '.3s';

        this.over0.style[CMDetect.TRANSFORM]= 'translate3d(0px, -20px, 0px)';
        this.over1.style[CMDetect.TRANSFORM]= 'translate3d(20px, 0px, 0px)';
        this.over2.style[CMDetect.TRANSFORM]= 'translate3d(0px, 20px, 0px)';
        this.over3.style[CMDetect.TRANSFORM]= 'translate3d(-20px, 0px, 0px)';
    },
    out: function () {
        this.over0.style[CMDetect.DURATION] = '.3s';
        this.over1.style[CMDetect.DURATION] = '.3s';
        this.over2.style[CMDetect.DURATION] = '.3s';
        this.over3.style[CMDetect.DURATION] = '.3s';

        this.over0.style[CMDetect.TRANSFORM]= 'translate3d(0px, -40px, 0px)';
        this.over1.style[CMDetect.TRANSFORM]= 'translate3d(40px, 0px, 0px)';
        this.over2.style[CMDetect.TRANSFORM]= 'translate3d(0px, 40px, 0px)';
        this.over3.style[CMDetect.TRANSFORM]= 'translate3d(-40px, 0px, 0px)';
    },
    onOver: function (e) {
        var id = e.currentTarget.getAttribute("data-id");
        Index.over(id);
    },
    onOut: function (e) {
        var id = e.currentTarget.getAttribute("data-id");
        Index.out(id);
    },
    onClick: function (e) {
        var id = e.currentTarget.getAttribute("data-id");
        Address.goSub(id);
    }
};



UI.ball = function (x, y, speed) {
    this.x = x;
    this.y = y;
    this.vx = speed;
    this.vy = speed;
    return this;
};
UI.ball.prototype = {
    resize: function (ctx, r) {
        this.ctx = ctx;
        this.r = r;
    },
    draw: function () {
        if (!this.ctx) return;
        this.ctx.save();
        this.ctx.fillStyle = '#fcb447';
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, UI.PI2, false);
        this.ctx.fill();
        this.ctx.restore();
    }
};


UI.wall = function () {
    this.color = '#fff';
    this.stroke = '#00a896';

    this.isDown = 0;
    this.offsetX;
    this.offsetY;

    this.shadow = 0;

    this.ctx = null;

    return this;
};
UI.wall.prototype = {
    update: function () {
        this.maxX = this.x + this.w;
        this.maxY = this.y + this.h;

        this.lineX1 = this.maxX - 22;
        this.lineX2 = this.lineX1 + 5;
        this.lineX3 = this.lineX2 + 5;
        this.lineX4 = this.lineX1 + 12;
        this.lineX5 = this.lineX4 - 5;

        this.lineY1 = this.maxY - 22;
        this.lineY2 = this.lineY1 + 5;
        this.lineY3 = this.lineY2 + 5;
        this.lineY4 = this.lineY1 + 12;
        this.lineY5 = this.lineY4 - 5;
    },
    resize: function (ctx) {
        this.ctx = ctx;
    },
    draw: function () {
        if (!this.ctx) return;

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;

        this.ctx.fillRect(this.x, this.y, this.w, this.h);
        this.ctx.restore();

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.stroke;
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';

        this.ctx.moveTo(this.lineX1, this.lineY1);
        this.ctx.lineTo(this.lineX4, this.lineY4);

        this.ctx.moveTo(this.lineX1, this.lineY1);
        this.ctx.lineTo(this.lineX1, this.lineY2);

        this.ctx.moveTo(this.lineX1, this.lineY1);
        this.ctx.lineTo(this.lineX2, this.lineY1);

        this.ctx.moveTo(this.lineX5, this.lineY4);
        this.ctx.lineTo(this.lineX4, this.lineY4);

        this.ctx.moveTo(this.lineX4, this.lineY5);
        this.ctx.lineTo(this.lineX4, this.lineY4);

        this.ctx.stroke();
        this.ctx.restore();

        //if (CMDetect.VENDOR == "Moz") return;
        if (this.isDown > 0) {
            this.shadow += 0.02;
            if (this.shadow > 0.25) this.shadow = 0.25;
        } else {
            this.shadow -= 0.02;
            if (this.shadow < 0) this.shadow = 0;
        }
        if (this.shadow > 0) {
            this.ctx.shadowOffsetX = 3;
            this.ctx.shadowOffsetY = 3;
            this.ctx.shadowBlur = 6;
            this.ctx.shadowColor = 'rgba(0, 0, 0, ' + this.shadow + ')';
        }

    },
    down: function (mx, my) {
        if (mx > this.x && mx < this.maxX && my > this.y && my < this.maxY) {
            if (mx > this.maxX - 50 && my > this.maxY - 50) {
                this.isDown = 2;
                this.offsetX = mx;
                this.offsetY = my;
            } else {
                this.isDown = 1;
                this.shadow = 0;
                this.offsetX = mx - this.x;
                this.offsetY = my - this.y;
            }
        }
    },
    move: function (mx, my) {
        if (this.isDown == 0) return;

        if (this.isDown == 1) {
            this.x = mx - this.offsetX;
            this.y = my - this.offsetY;
        } else {
            this.w += mx - this.offsetX;
            this.h += my - this.offsetY;
            if (this.w < 80) this.w = 80;
            if (this.h < 80) this.h = 80;
            this.offsetX = mx;
            this.offsetY = my;
        }
        this.update();
    },
    up: function () {
        this.isDown = 0;
    },
    checkMouse: function (mx, my) {
        if (mx > this.x && mx < this.maxX && my > this.y && my < this.maxY) {
            if (mx > this.maxX - 50 && my > this.maxY - 50) {
                Address.setCursor(2);
            } else {
                Address.setCursor(1);
            }
        } else {
            Address.setCursor(0);
        }
    }
};


UI.actionBall = function (color, x, y, ctx, radius, speed, count) {
    this.x = x;
    this.y = y;
    this.ctx = ctx;
    this.ballR = radius;
    this.count = count;
    this.color = color;
    this.rotation = 0;
    this.update(speed);

    this.friction = 0.99;
    this.hide = 0;


    return this;
};
UI.actionBall.prototype = {
    resize: function (ctx, speed, radius, sw, sh) {
        this.ctx = ctx;
        this.ballR = radius;
        this.update(speed);
        if (sw != null) {
            this.x = sw >> 1;
            this.y = sh >> 1;
        }
    },
    update: function (speed) {
        var i, r = this.ballR;
        for (i=0; i<this.count; i++) {
            r = r >> 1;
        }
        this.r = r;
        this.vx = this.vy = speed;
    },
    move: function (sw, sh, mode) {
        if (mode) {
            this.vx *= this.friction;
            this.vy *= this.friction;
        }
        this.x += this.vx;
        this.y += this.vy;

        var wall_y = sh - this.r,
            wall_x = sw - this.r,
            gap = 1;

        if (mode) {
            if(this.y > wall_y) {
                this.y = wall_y - gap;
                this.vy *= -1;
            }
            if(this.y < this.r) {
                this.y = this.r + gap;
                this.vy *= -1;
            }
            if(this.x > wall_x) {
                this.x = wall_x - gap;
                this.vx *= -1;
            }
            if(this.x < this.r) {
                this.x = this.r + gap;
                this.vx *= -1;
            }
        } else {
            if (this.x < -this.r || this.x > wall_x + this.r || this.y < -this.r || this.y > wall_y + this.r) {
                this.hide = 1;
                Action.checkHide();
            }
        }

        var max = Math.max(this.vx, this.vy) * 0.02;
        this.rotation += max;
    },
    draw: function () {
        this.ctx.save();
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, UI.PI2, false);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();

        var r2 = this.r * 2,
            cross_w = r2 * 0.3 | 0,
            cross_h = r2 * 0.04 | 0,
            c1x = -(cross_w >> 1),
            c1y = -(cross_h >> 1),
            c2x = -(cross_h >> 1),
            c2y = -(cross_w >> 1);

        this.ctx.save();
        this.ctx.fillStyle = '#fff';
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate( this.rotation * Math.PI);
        this.ctx.fillRect(c1x, c1y, cross_w, cross_h);
        this.ctx.fillRect(c2x, c2y, cross_h, cross_w);
        this.ctx.restore();
    }
};


UI.windowbox = function (end) {
    this.color = '#fff';

    this.isDown = 0;
    this.offsetX;
    this.offsetY;

    this.ctx = null;

    this.end = end;

    return this;
};
UI.windowbox.prototype = {
    update: function () {
        this.maxX = this.x + this.r;
        this.maxY = this.y + this.r;
    },
    updateSize: function (r) {
        this.r = r;
        this.update();
    },
    resize: function (ctx, r, sw, sh) {
        this.r = r;

        if (this.end) {
            if (sh > sw) {
                this.x = (sw);
                this.y = (sh);
            } else {
                this.x = (sw - r) >> 1;
                this.y = (sh);
            }
        } else {
            this.ctx = ctx;
            if (this.x + this.r > sw - 20) this.x = sw - this.r - 20;
            if (this.y + this.r > sh - 20) this.y = sh - this.r - 20;
        }

        this.update();
    },
    draw: function () {
        if (!this.ctx) return;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.r, this.r);
        this.ctx.restore();
    },
    down: function (mx, my) {
        if (mx > this.x && mx < this.maxX && my > this.y && my < this.maxY) {
            this.isDown = 1;
            this.offsetX = mx - this.x;
            this.offsetY = my - this.y;
        }
    },
    move: function (mx, my) {
        if (this.isDown == 0) return;

        if (this.isDown == 1) {
            this.x = mx - this.offsetX;
            this.y = my - this.offsetY;
        }
        this.update();


    },
    up: function () {
        this.isDown = 0;
    },
    checkMouse: function (mx, my) {
        if (mx > this.x && mx < this.maxX && my > this.y && my < this.maxY) {
            Address.setCursor(1);
        } else {
            Address.setCursor(0);
        }
    }
};


UI.changeBall = function () {
    this.color = 'rgba(255,255,255,0.12)';

    this.isDown = 0;
    this.offsetX;
    this.offsetY;

    this.ctx = null;

    return this;
};
UI.changeBall.prototype = {
    update: function () {
        this.maxX = this.x + this.r;
        this.maxY = this.y + this.r;
        this.minX = this.x - this.r;
        this.minY = this.y - this.r;
    },
    resize: function (ctx, r, sw, sh) {
        this.ctx = ctx;
        this.r = r;
        this.r2 = r * 2;

        if (this.maxX > sw - 20) this.x = sw - this.r2 - 20;
        if (this.maxY > sh - 20) this.y = sh - this.r2 - 20;

        this.update();
    },
    draw: function () {
        if (!this.ctx) return;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.x, this.y, this.r, 0, UI.PI2, false);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
    },
    down: function (mx, my) {
        if (mx > this.minX && mx < this.maxX && my > this.minY && my < this.maxY) {
            this.isDown = 1;
            this.offsetX = mx - this.x;
            this.offsetY = my - this.y;
        }
    },
    move: function (mx, my) {
        if (this.isDown == 0) return;

        if (this.isDown == 1) {
            this.x = mx - this.offsetX;
            this.y = my - this.offsetY;
        }
        this.update();
    },
    up: function () {
        this.isDown = 0;
    },
    checkMouse: function (mx, my) {
        if (mx > this.minX && mx < this.maxX && my > this.minY && my < this.maxY) {
            Address.setCursor(1);
        } else {
            Address.setCursor(0);
        }
    }
};


UI.plane = function (color) {
    this.color = color;
    this.ctx = null;
    this.isUsed = 0;
    this.moving = 1;
    return this;
};
UI.plane.prototype = {
    update: function () {
        //this.a1 = this.tx;
        //this.a2 = this.ty;
        this.a3 = this.tx + this.bw;
        this.a4 = this.ty;
        //this.a5 = this.tx + this.bw;
        //this.a6 = this.ty + this.bh;
        this.a7 = this.tx;
        this.a8 = this.ty + this.bh;

        //this.b1 = this.tx + this.tw  - this.bw;
        //this.b2 = this.ty + this.bh;
        this.b3 = this.tx + this.tw ;
        this.b4 = this.ty + this.bh;
        //this.b5 = this.tx + this.tw ;
        //this.b6 = this.ty + this.bh + this.bh;
        this.b7 = this.tx + this.tw  - this.bw;
        this.b8 = this.ty + this.bh + this.bh;
    },
    setting: function (target, ctx, color) {
        this.bw = target.bw;
        this.bh = target.bh;
        this.tw = target.tw;
        this.tx = target.tx;
        this.ty = target.ty;
        this.ctx = ctx;
        this.color = color;
        this.update();
    },
    resize: function (ctx, tw, tx, ty, pw, ph) {
        this.ctx = ctx;

        this.bw = pw;
        this.bh = ph;
        this.tw = tw;
        this.tx = tx;
        this.ty = ty;

        this.update();
    },
    draw: function () {
        if (!this.ctx) return;

        this.ctx.save();
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();

        this.ctx.moveTo(this.a7, this.a8);
        this.ctx.lineTo(this.a3, this.a4);
        this.ctx.lineTo(this.b3, this.b4);
        this.ctx.lineTo(this.b7, this.b8);
        this.ctx.fill();

        this.ctx.closePath();
        this.ctx.restore();
    },
    move: function () {
        this.update();
        this.draw();
    }
};


UI.share = function (dom, fn) {
    this.dom = dom;

    var bg = this.dom.getElementsByTagName('span')[0];

    if (!CMDetect.isTouch) {
        addListener(this.dom, 'mouseenter', function(e) {
            TweenLite.to(bg, 0.8, {
                css:{scale:1.3},
                ease:Elastic.easeOut
            });
        });
        addListener(this.dom, 'mouseleave', function(e) {
            TweenLite.to(bg, 0.3, {
                css:{scale:1},
                ease:Cubic.easeOut
            });
        });
    }
    addListener(this.dom, 'click', fn);

    return this;
};
UI.share.prototype = {

};