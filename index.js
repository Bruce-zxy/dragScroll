$(function(){
    //index dragbar
    if($('#drag-scroll .dscroll-cards').length>0){
        (function(dragScroll){
            var bar = $('.ds-line-bar');
            var line = $('.dscroll-cards-line');
            var box = $('.drag-scroll');
            var tar_li = $('.dscroll-cards');
            var imgs = $(".ds-list-lis img");
            var imgsLen = imgs.length;
            var w_bar = bar.width();
            var w_line = line.width();
            var lineleft = line[0].offsetLeft;
            var w_left;
            var left;
            var x;
            var Ddrag = false;

            var init = function(){
                bar.mousedown(mouseDown);
                box.mousemove(moveTo).mouseup(mouseUp);
                var barhover = new HoverSiblings(tar_li,'open',true,false).hoverRemoveSiblings();
                barhover.enterFunc = function(i,e){moveTo(event,i)};
                // 将图片的Alt属性内容添加到前一个<a>标签中（兼容IE8）
                for (var i = 0; i < imgsLen; i++) {$(imgs[i]).prev().html(imgs[i].getAttribute('alt'));}
            };

            function mouseDown(event){
                $(this).addClass('down');
                var e=event || window.event;
                Ddrag = true;
                w_left = bar[0].offsetLeft;
                x = e.pageX - lineleft - w_left;
                return false;
            }

            function mouseUp(){
                bar.removeClass('down');
                Ddrag = false;
                return false;
            }

            function moveTo(event,j){
                if(arguments[1]>=0){
                    left = arguments[1]*w_line/4;
                    bar.css('left',left);
                }
                if(!Ddrag){ return false}
                var e=event || window.event;
                if((e.pageX-x-lineleft) < 0){
                    left = 0;
                }else if((e.pageX-x-lineleft) > (w_line - w_bar)){
                    left = w_line - w_bar;
                }else{
                    left = e.pageX-lineleft-x;
                }
                bar.css('left',left);
                for(var i=0; i<4;i++){
                    if(left > (w_line-w_bar)/4*i && left < (w_line-w_bar)/4*(i+1)){
                        tar_li.eq(i).addClass('open').siblings('.dscroll-cards').removeClass('open');
                    }
                }
                return false;
            }
            dragScroll.init = init;
        })(window.dragScroll=window.dragScroll||{});
        dragScroll.init();
    }
});

//  给IE9以下的IE浏览器添加bind方法
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }
        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                        ? this
                        : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };
}

//  hover and hover siblings
function HoverSiblings(tar,classname,siblings,leaveh){
    this.t = tar;
    this.hname = classname;
    this.delay = 100;
    this.siblings = siblings==false?false:true;
    this.leave = leaveh==false?false:true;
    this.enterFunc = null;
    this.leaveFunc = null;
}

HoverSiblings.prototype.hoverRemoveSiblings = function(){
    var $t = this;
    $(this.t).each(function(i,e){
        var hoverTimer, outTimer;
        var hoverfun = function(){
            if($.isFunction($t.enterFunc)){
                $t.enterFunc(i,e)
            }
        };
        var hleavefun = function(){
            if($.isFunction($t.leaveFunc)){
                $t.leaveFunc(i,e)
            }
        };
        $(this).hover(function(){
            var index = i;
            var elm = e;
            clearTimeout(outTimer);
            hoverTimer = setTimeout(adClass.bind(this),$t.delay);
        },function(){
            clearTimeout(hoverTimer);
            outTimer = setTimeout(removClass.bind(this),$t.delay);
        });

        function adClass(){
            if($t.siblings){
                $(this).addClass($t.hname).siblings().removeClass($t.hname);
                hoverfun();
            }else{
                $(this).addClass($t.hname);
                hoverfun();
            }
        }

        function removClass(){
            if($t.leave){
                $(this).removeClass($t.hname);
                hleavefun();
            }
        }
    });
    return this
};


// test

