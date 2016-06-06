// Downloaded from: https://gist.github.com/jlong/5413611
// A new version of $(el).prepareTransition() that uses a timer instead of the poorly implemented
// TransitionEnd event to ensure that the 'is-transitioning' class is removed.


/**
 *  prepareTransition
 *
 *  jQuery Plugin for ensuring transitions with display:none or visibility:hidden 
 *  are in the right state until the end of the transition
 *
 *  By John W. Long (http://wiseheartdesign.com)
 *  April 18, 2013
 *
 *  Based on the prepareTransition plugin by Jonathan Snook (http://snook.ca). This version
 *  of the plugin uses a timer to ensure that the class is removed instead of relying on the
 *  poorly implemented TransitionEnd event.
 *
 *  Requires the following CSS:
 *
 *      .is-transitioning {
 *          display: block !important;
 *          visibility: visible !important;
 *      }
 *
 *  MIT license 
 *  http://www.opensource.org/licenses/mit-license.php
 */

(function($, window, undefined) {

$.fn.prepareTransition = function(){
    return this.each(function(){
        var el = $(this)
        ,   props = ["transition-duration", "-moz-transition-duration", "-webkit-transition-duration", "-o-transition-duration"]
        ,   duration = 0
        ;

        // Check the various CSS properties to see if a duration has been set
        for (var i = 0, l = props.length; i < l; i++) {
            var prop = props[i]
            ,   value = el.css(prop)
            ;
            if (value) {
                duration = 1000 * parseFloat(value);
                break;
            }
        }

        // If there is a duration, add the class and setup a timer to remove it
        if (duration != 0) {
            var timer = el.data('transition-timer')
            ,   timeoutAt = el.data('transition-timeout-at')
            ,   finishAt = +new Date() + duration
            ;

            // Add the class
            el.addClass('is-transitioning');
            el[0].offsetWidth; // check offsetWidth to force style rendering

            // Create a new timer to remove the class if necessary
            if (timer === undefined || (finishAt > timeoutAt)) {
                clearTimeout(timer);
                el.data('transition-timer', setTimeout(function() { el.removeClass('is-transitioning'); }, duration));
                el.data('transition-timeout-at', finishAt);
            }
        };
    });
}

}(jQuery, this));