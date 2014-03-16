/*
 * pureUI
 * */
$.ui = {
    cache:{
        hashContentDivSelected:false,
        activeContentDiv:''
    },
    show:function(el,transformation){
        /*
        * hide active content div and load new content div
        * */
        $($('#'+$.ui.cache.activeContentDiv).get(0)).removeClass('pure-show-slide').addClass('pure-hide-slide');
        el.addClass('pure-show-slide');
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
        var contentDiv = $('#content>div');
        for(var i=0;i<contentDiv.length;i++){
            var item = $(contentDiv[i]);
            if(item.data('selected')===true){
                $.ui.cache.hashContentDivSelected=true;
                $.ui.loadContentDiv(item);
            }
        }
        if(!$.ui.cache.hashContentDivSelected){
            $.ui.loadContentDiv($(contentDiv[0]));
        }
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

    $.ui.showDeafultContentDiv();

}(this, this.document));
