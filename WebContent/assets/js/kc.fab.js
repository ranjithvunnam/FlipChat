/*===================================================================
=            KC.FAB : Materialize Floating Action Button            =
===================================================================*/
/*
 * Copyright 2015 Mark Luk
 * Released under the MIT license
 * https://github.com/katrincwl/kc_fab/blob/master/LICENSE
 *
 * @author: Mark Luk
 * @version: 1.0
 * @date: 18/3/2015
 */

(function($){
    if(!$.kc){
        $.kc = new Object();
    };
    
    $.kc.fab = function(el, links, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        
        // Add a reverse reference to the DOM object
        base.$el.data("kc.fab", base);
        
        var main_fab_btn;
        var sub_fab_btns;

        base.init = function(){
            if( typeof( links ) === "undefined" || links === null ) {
                links = [
                    {
                        "url":null,
                        "bgcolor":"red",
                        "icon":"+"
                    },
                    {
                        "url":"http://www.example.com",
                        "bgcolor":"orange",
                        "icon":"+"
                    },
                    {
                        "url":"http://www.example.com",
                        "bgcolor":"yellow",
                        "icon":"+"
                    }
                ];
            }


            base.links = links;
            if (base.links.length > 0){
                main_btn = base.links[0];
                color_style = (main_btn.color)? "color:"+main_btn.color+";" : "";
                bg_color_style = (main_btn.bgcolor)? "background-color:"+main_btn.bgcolor+";" : "";
                main_btn_dom = "<button data-link-href='"+((main_btn.url)?main_btn.url:"")+"' data-link-target='"+((main_btn.target)?main_btn.target:"")+"' class='kc_fab_main_btn' style='"+bg_color_style+"'><span style='"+color_style+"'>"+main_btn.icon+"</span></button>";
               

                sub_fab_btns_dom = "";
                base.links.shift();
                /* Loop through the remaining links array */
                for (var i = 0; i < base.links.length; i++) {
                    color_style = (base.links[i].color)? "color:"+base.links[i].color+";" : "";
                    bg_color_style = (base.links[i].bgcolor)? "background-color:"+base.links[i].bgcolor+";" : "";
                    
                    sub_fab_btns_dom += "<div><button data-link-title='"+base.links[i].title+"' data-link-href='"+(base.links[i].url?base.links[i].url:"")+"' data-link-target='"+i+"' class='sub_fab_btn' style='"+bg_color_style+"'><span style='"+color_style+"'>"+base.links[i].icon+"</span></button><input type='file' id='my_file"+i+"' style='display: none;' /></div>";
                    
                };
                sub_fab_btns_dom = "<div class='sub_fab_btns_wrapper'>"+sub_fab_btns_dom+"</div>";
                base.$el.append(sub_fab_btns_dom).append(main_btn_dom);

            }else{
                if (typeof console == "undefined") {
                    window.console = {
                        log: function (msg) {
                            alert(msg);
                        }
                    };
                }
                console.log("Invalid links array param");
            }
            
            base.options = $.extend({},$.kc.fab.defaultOptions, options);


            main_fab_btn = base.$el.find(".kc_fab_main_btn");
            sub_fab_btns = base.$el.find(".sub_fab_btns_wrapper");

            main_fab_btn.click(function(e){
                if ($(this).attr('data-link-href').length > 0){
                    if ($(this).attr('data-link-target')){
                        window.open($(this).attr('data-link-href'), $(this).attr('data-link-target'));
                    }else{
                        window.location.href = $(this).attr('data-link-href');
                    }
                }
            	sub_fab_btns.toggleClass('show');

            });

            sub_fab_btns.find('.sub_fab_btn').on('mousedown', function(e){
                if ($(this).attr('data-link-href').length > 0){
                    if ($(this).attr('data-link-target')){
                    	$("input[id='my_file"+$(this).attr('data-link-target')+"']").click();
                    	$("#my_file"+$(this).attr('data-link-target')+"").change(function(e) {
                    		//base.functionName(e.originalEvent.srcElement.files[0]);
                    		alert(e.originalEvent.srcElement.files[0].name);
                        });
                    }
                }

            });
            main_fab_btn.focusout(function(){
                sub_fab_btns.removeClass('show');
                overlay = $(".kc_fab_overlay");
                overlay.remove();
                
            });
            
            // Put your initialization code here
        };
        
        // Sample Function, Uncomment to use
         base.functionName = function(file){
        	 alert(file);
        	 var img = document.createElement("img");
             var reader = new FileReader();
             reader.onloadend = function() {
                  img.src = reader.result;
                  img.style.height = "50px";
             	 img.style.width = "50px";
             };
             reader.readAsDataURL(file);
             $("button").after(img);
         };


        
        // Run initializer
        base.init();
    };
    
    $.kc.fab.defaultOptions = {};
    
    $.fn.kc_fab = function(links, options){
        return this.each(function(){
            (new $.kc.fab(this, links, options));
        });
    };
    
})(jQuery);


