(function($) {
    $.fn.AutoHideMessage = function(options) {

        var $this = $(this);

        var settings = $.extend({
            'close': true,
            'autoHide': false,
            'time': 5000
        }, options);

        var methods = {
            show: function(ele) {
                var ele = $(ele);
                var content = '<div class="message-box"><div>' + ele.html() + '</div>';
                if (settings.close == true) {
                    content += '<div class="close"></div>';
                }

                if (settings.autoHide == true) {
                    content += '<div class="time">' + (settings.time) / 1000 + ' sec</div>';
                }

                content += '</div>';

                ele.html(content);

                ele.find('.close').click(function() {
                    ele.fadeOut('normel');
                });

                if (settings.autoHide == true) {
                    var mytime = settings.time;
                    var timer = setInterval(function() {
                        mytime = mytime - 1000;
                        ele.find('.time').text((mytime) / 1000 + ' sec');
                        if (mytime < 1000) {
                            ele.fadeOut('normel');
                            clearInterval(timer);
                        }
                    }, 1000);
                }

            },
            hide: function(ele) {
                ele.fadeOut('normel');
            }
        };

        this.each(function(index, ele) {
            methods.show(ele);
        });
    }
})(jQuery);