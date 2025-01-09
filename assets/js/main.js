(function($) {

    var $window = $(window),
        $body = $('body'),
        $header = $('#header'),
        $banner = $('#banner'),
        $menu = $('#menu');

    // Breakpoints.
    breakpoints({
        xlarge: '(max-width: 1680px)',
        large:  '(max-width: 1280px)',
        medium: '(max-width: 980px)',
        small:  '(max-width: 736px)',
        xsmall: '(max-width: 480px)'
    });

    // Play initial animations on page load.
    $window.on('load', function() {
        window.setTimeout(function() {
            $body.removeClass('is-preload');
        }, 100);
    });

    // Header.
    if ($banner.length > 0 && $header.hasClass('alt')) {
        $window.on('resize', function() { 
            $window.trigger('scroll'); 
        });

        $banner.scrollex({
            bottom:     $header.outerHeight(),
            terminate:  function() { $header.removeClass('alt'); },
            enter:      function() { $header.addClass('alt'); },
            leave:      function() { $header.removeClass('alt'); }
        });
    }

    // Menu.
    $menu._locked = false;

    $menu._lock = function() {
        if ($menu._locked)
            return false;

        $menu._locked = true;

        window.setTimeout(function() {
            $menu._locked = false;
        }, 350);

        return true;
    };

    $menu._show = function() {
        if ($menu._lock())
            $body.addClass('is-menu-visible');
    };

    $menu._hide = function() {
        if ($menu._lock())
            $body.removeClass('is-menu-visible');
    };

    $menu._toggle = function() {
        if ($menu._lock())
            $body.toggleClass('is-menu-visible');
    };

    // Add dropdown functionality
    var $dropdown = $('.has-dropdown');

    // Handle dropdown menu interactions
    $dropdown.each(function() {
        var $this = $(this);
        
        // Toggle dropdown on click for mobile
        $this.children('a').on('click', function(event) {
            if (breakpoints.active('<=medium')) {
                event.preventDefault();
                event.stopPropagation();
                
                var $dropdownMenu = $(this).siblings('.dropdown');
                $('.dropdown').not($dropdownMenu).slideUp(200);
                $dropdownMenu.slideToggle(200);
            }
        });

        // Handle hover states for desktop
        if (!breakpoints.active('<=medium')) {
            $this.hover(
                function() {
                    $(this).find('.dropdown').stop(true, true).fadeIn(200);
                },
                function() {
                    $(this).find('.dropdown').stop(true, true).fadeOut(200);
                }
            );
        }
    });

    $menu
        .appendTo($body)
        .on('click', function(event) {
            event.stopPropagation();
            $menu._hide();
        })
        .find('.inner')
            .on('click', '.close', function(event) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                $menu._hide();
            })
            .on('click', function(event) {
                event.stopPropagation();
            })
            .on('click', 'a', function(event) {
                var $this = $(this);
                var href = $this.attr('href');

                // Don't process dropdown toggles on mobile
                if ($this.parent().hasClass('has-dropdown') && breakpoints.active('<=medium')) {
                    return;
                }

                event.preventDefault();
                event.stopPropagation();

                // Hide.
                $menu._hide();

                // Redirect.
                window.setTimeout(function() {
                    window.location.href = href;
                }, 350);
            });

    $body
        .on('click', 'a[href="#menu"]', function(event) {
            event.stopPropagation();
            event.preventDefault();
            $menu._toggle();
        })
        .on('click', function() {
            // Hide dropdowns when clicking outside
            $('.dropdown').slideUp(200);
        })
        .on('keydown', function(event) {
            // Hide on escape.
            if (event.keyCode == 27) {
                $menu._hide();
                $('.dropdown').slideUp(200);
            }
        });

})(jQuery);