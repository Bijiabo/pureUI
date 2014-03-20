/*
 * pureUI
 * */
//public
Array.prototype.inArray = function (value)
// Returns true if the passed value is found in the
// array.  Returns false if it is not.
{
    var i;
    for (i=0; i < this.length; i++) {
        // Matches identical (===), not just similar (==).
        if (this[i] === value) {
            return true;
        }
    }
    return false;
};
$.ui = {
    cache:{
        hashContentDivSelected:false,
        activeContentDiv:''
    },
    show:function(el,transformation){
        /*
        * hide active content div and load new content div
        * */
        if(el.data('title')!==undefined){
            $('#header>h1').text(el.data('title'));
        }
        $($('#'+$.ui.cache.activeContentDiv).get(0)).css({'left':'-150%','opacity':'0'});
        el.css({'left':'0','opacity':'1'});
        window.scrollTo(0,0);
        //run data-load func
        if(el.data('load')!==undefined){
            eval(el.data('load'));
        }
     },
    loadContentDiv:function(item){
        if(typeof item === 'object'){
            item.show();
            $.ui.show(item);
//            $('#'+this.cache.activeContentDiv).hide();
            this.cache.activeContentDiv=item.attr('id');
        }else if(typeof item === 'string' && $('#'+item).length>0){
            $($('#'+item).get(0)).show();
            $.ui.show($($('#'+item).get(0)));
//            $('#'+this.cache.activeContentDiv).hide();
            this.cache.activeContentDiv=item;
        }else{
            console.log('Error in $.ui.loadContentDiv: no element found to load:(');
        }
    },
    showDeafultContentDiv:function(){
        /*
         * show default content div
         * */
        var hash = window.location.hash;
        hash = hash.replace(/^\#/,'');
        var contentItemArray = new Array();
        var contentDiv = $('#content>div');
        for(var i=0;i<contentDiv.length;i++){
            var item = $(contentDiv[i]);
            contentItemArray.push(item.attr('id'));
        }
        if(contentItemArray.inArray(hash)){
            $.ui.loadContentDiv(hash);
            //change menu hightlight
            if($('#menu>div>ul>li>a[href="#'+hash+'"]').length>0){
                $('#menu>div>ul>li').removeClass('pure-menu-selected');
                $($($('#menu>div>ul>li>a[href="#'+hash+'"]').get(0)).parent('li')).addClass('pure-menu-selected');
            }
        }else{
            for(var i=0;i<contentDiv.length;i++){
                var item = $(contentDiv[i]);
                if(item.data('selected')===true){
                    $.ui.cache.hashContentDivSelected=true;
                    $.ui.loadContentDiv(item);
                    break;
                }
            }
            if(!$.ui.cache.hashContentDivSelected){
                $.ui.loadContentDiv($(contentDiv[0]));
            }

        }
    },
    hashChange:function(){
        var hash = window.location.hash;
        hash = hash.replace(/^\#/,'');
        if($.ui.cache.activeContentDiv !== hash){
            var contentItemArray = new Array();
            var contentDiv = $('#content>div');
            for(var i=0;i<contentDiv.length;i++){
                var item = $(contentDiv[i]);
                contentItemArray.push(item.attr('id'));
            }
            if(contentItemArray.inArray(hash)){
                $.ui.loadContentDiv(hash);
                //change menu hightlight
                if($('#menu>div>ul>li>a[href="#'+hash+'"]').length>0){
                    $('#menu>div>ul>li').removeClass('pure-menu-selected');
                    $($($('#menu>div>ul>li>a[href="#'+hash+'"]').get(0)).parent('li')).addClass('pure-menu-selected');
                }
            }
        }
    },
    showMask:function(text){
        if(text && typeof text === 'string'){
            $('#layout').append('<div id="pure-mask">'+text+'</div>');
            $('#pure-shadow').addClass('mask-shadow');
        }
    },
    hideMask:function(){
        $('#pure-mask').remove();
        $('#pure-shadow').removeClass('mask-shadow');
    },
    sayHello:function(){
        alert('hello');
    }
};


(function (window, document) {

    var layout   = document.getElementById('layout'),
        menu     = document.getElementById('menu'),
        menuLink = document.getElementById('menuLink'),
        pureShadow = document.getElementById('pure-shadow');

    function toggleClass(element, className) {
        var classes = element.className.split(/\s+/),
            length = classes.length,
            i = 0;

        for(; i < length; i++) {
          if (classes[i] === className) {
            classes.splice(i, 1);
            break;
          }
        }
        // The className is not found
        if (length === classes.length) {
            classes.push(className);
        }

        element.className = classes.join(' ');
    }

    menuLink.onclick = function (e) {
        var active = 'active';

        e.preventDefault();
        toggleClass(layout, active);
        toggleClass(menu, active);
        toggleClass(menuLink, active);
    };
    pureShadow.onclick = function (e) {
        var active = 'active';
        $('#layout,#menu,#menuLink').removeClass(active);
    }

    $('#menu>div>ul>li>a').click(function(){
        $('#layout,#menu,#menuLink').removeClass('active');
    });

    $.ui.showDeafultContentDiv();
    window.onhashchange = function(){$.ui.hashChange();}//add hash listener

}(this, this.document));

