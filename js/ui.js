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
        activeContentDiv:'',
        defaultHash:'',
        historyLength:0,
        history:new Array()
    },
    show:function(el,transformation){
        /*
        * hide active content div and load new content div
        * */
        var activeContentDiv = $($('#'+$.ui.cache.activeContentDiv).get(0));
        if(activeContentDiv.data('rememberScroll')===true){
            activeContentDiv.data('scrolly',String($.ui.cache.scrolly));
        }
        activeContentDiv.css({'left':'-150%','opacity':0,'z-index':1,'height': '100%','overflow-y': 'hidden'});
        el.css({'left':'0','opacity':1,'z-index':10,'height': 'auto','overflow-y': 'auto'});
        if(el.data('scrolly')!==null && el.data('rememberScroll')===true){
            window.setTimeout(function(){
                window.scrollTo(0,el.data('scrolly'));
            },200);
        }else{
            window.scrollTo(0,0);
        }
        $('#layout,#menu,#menuLink').removeClass('active');
        //run data-defer
        if(el.data('defer')!==null){
            if(el.data('defered')===null){
                var deferUrl = String(el.data('defer'));
                var success = function(data){
                    el.html(data);
                    if(el.data('load')!==null && el.data('loaded')===null){
                        setTimeout(function(){
                            //run data-load func
                            eval(el.data('load'));
                            el.data('loaded','true');
                        },200);
                    }
                }
                $.get(
                    deferUrl,
                    success,
                    function(){},
                    "2000"
                );
                el.data('defered',true);
            }
        }else{
            if(el.data('load')!==null && el.data('loaded')===null){
                setTimeout(function(){
                    //run data-load func
                    eval(el.data('load'));
                    el.data('loaded','true');
                },200);
            }
        }
        //history
        $.ui.cache.history.push(el.attr('id'));
        //run header
        if(el.find('header').length===1 && el.data('header')!=='none'){
            $('#header').html($(el.find('header')).html());
        }else{
            $('#header').html($.ui.cache.headerHtml);
            if($.ui.cache.history[$.ui.cache.history.length-1]===$.ui.cache.history[$.ui.cache.history.length-3] && $.ui.cache.history[0]===el.attr('id')){
                $('#back').hide();
                $('#back').appendTo('#header-buttons');
            }else if($.ui.cache.history.length===1){
                $('#back').hide();
                $('#back').appendTo('#header-buttons');
            }else{
                $('#back').show();
                $('#back').prependTo('#header-buttons');
            }
            if(el.data('title')!==undefined){
                $('#header>h1').text(el.data('title'));
            }
        }
        //run footer
        console.log('run footer');
        console.log(el.data('footer'));
        if(el.find('footer').length===1 && el.data('footer')!=='none'){
            $('#footer').html($(el.find('footer')).html());
            $('#footer').show();
        }else if(el.find('footer').length===0 && el.data('footer')!=='none' && el.data('footer')!==null){
            if($('#content').find('footer#'+String(el.data('footer'))).length===1){
                $('#footer').html($($('#content').find('footer#'+String(el.data('footer')))).html());
                $('#footer').show();
            }else{
                $('#footer').html('');
                $('#footer').hide();
            }
        }else{
            $('#footer').html('');
            $('#footer').hide();
        }
        //run menu
        if(el.find('menu').length===1 && el.data('menu')!=='none'){
            $('#menu').html($(el.find('menu')).html());
        }else if(el.find('menu').length===0 && el.data('menu')!=='none' && el.data('menu')!==null){
            if($('#content').find('menu#'+String(el.data('menu'))).length===1){
                $('#menu').html($($('#content').find('menu#'+String(el.data('menu')))).html());
            }else{
                $('#menu').html($.ui.cache.menuHtml);
            }
        }else if(el.data('menu')==='default'){
            $('#menu').html($.ui.cache.menuHtml);
        }else{
            //do nothing
        }
        this.cache.activeContentDiv=el.attr('id');
     },
    loadContentDiv:function(item){
        if(typeof item === 'object'){
            item.show();
            $.ui.show(item);
//            $('#'+this.cache.activeContentDiv).hide();

        }else if(typeof item === 'string' && $('#'+item).length>0){
            $($('#'+item).get(0)).show();
            $.ui.show($($('#'+item).get(0)));
//            $('#'+this.cache.activeContentDiv).hide();
//            this.cache.activeContentDiv=item;
        }else{
            console.log('Error in $.ui.loadContentDiv: no element found to load:(');
        }
    },
    loadDiv:function(hash){//afui func
        window.location.hash = hash;
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
            $.ui.cache.defaultHash=hash;
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
                    $.ui.cache.defaultHash=item.attr('id');
                    break;
                }
            }
            if(!$.ui.cache.hashContentDivSelected){
                $.ui.loadContentDiv($(contentDiv[0]));
                $.ui.cache.defaultHash=$(contentDiv[0]).attr('id');
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
            }else if(hash===''){
                $.ui.loadContentDiv($.ui.cache.defaultHash);
            }
        }
    },
    showMask:function(text,autohide){
        if(text && typeof text === 'string'){
            $('#layout').append('<div id="pure-mask">'+text+'</div>');
            $('#pure-shadow').addClass('mask-shadow');
        }
        if(autohide===true){
            setInterval(function(){
                $.ui.hideMask();
            },2000);
        }
    },
    hideMask:function(){
        $('#pure-mask').remove();
        $('#pure-shadow').removeClass('mask-shadow');
    },
    sayHello:function(){
        alert('hello');
    },
    goBack:function(){
        window.history.back();
        $.ui.cache.historyLength-=2;
    },
    doScroll:function(){
        setTimeout(function(){
            window.scrollTo(0,$.ui.cache.scrolly)
        },200);
    }
};


$(document).ready(function () {

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

    $(document).on('click','#menuLink', function (e) {
        var active = 'active';
        var menuLink = document.getElementById('menuLink');
//        e.preventDefault();
        toggleClass(layout, active);
        toggleClass(menu, active);
        toggleClass(menuLink, active);
    });
    pureShadow.onclick = function (e) {
        var active = 'active';
        $('#layout,#menu,#menuLink').removeClass('active');
    };

    $('#menu>div>ul>li>a').click(function(){
        $('#layout,#menu,#menuLink').removeClass('active');
    });
    $(document).on('click','#back',function(){
        if($('#back').data('back')!==false){
            $.ui.goBack();
        }
    });
    $.ui.cache.headerHtml = $('#header').html();
    $.ui.cache.menuHtml = $('#menu').html();
    $.ui.showDeafultContentDiv();
    window.onhashchange = function(){$.ui.hashChange();}//add hash listener
});

