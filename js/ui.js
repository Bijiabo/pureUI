/*
 * pureUI
 * */
$.ui = {
    cache:{
        hashContentDivSelected:false
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
     /*
    * show default content div
    * */
    var contentDiv = $('#content>div');
    for(var i=0;i<contentDiv.length;i++){
        var item = $(contentDiv[i]);
        if(item.data('selected')===true){
            item.css('display','inline');
            $.ui.cache.hashContentDivSelected=true;
        }
    }
    if(!$.ui.cache.hashContentDivSelected){
        $(contentDiv[0]).css('display','inline');
    }

}(this, this.document));
