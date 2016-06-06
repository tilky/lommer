import enquire from 'enquire';
import 'magnific-popup';
import 'ScrollToFixed';
import FastClick from 'fastclick';

import '../vendor/jquery.prepareTransition.js';

import '../vendor/replaceUrlParam.js';

import '../utils/debounce.js';

/*============================================================================
  Money Format
  - Shopify.format money is defined in option_selection.js.
    If that file is not included, it is redefined here.
==============================================================================*/
if ((typeof Shopify) === 'undefined') { Shopify = {}; }
if (!Shopify.formatMoney) {
  Shopify.formatMoney = function(cents, format) {
    var value = '',
        placeholderRegex = /\{\{\s*(\w+)\s*\}\}/,
        formatString = (format || this.money_format);

    if (typeof cents == 'string') {
      cents = cents.replace('.','');
    }

    function defaultOption(opt, def) {
      return (typeof opt == 'undefined' ? def : opt);
    }

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = defaultOption(precision, 2);
      thousands = defaultOption(thousands, ',');
      decimal   = defaultOption(decimal, '.');

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number/100.0).toFixed(precision);

      var parts   = number.split('.'),
          dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
          cents   = parts[1] ? (decimal + parts[1]) : '';

      return dollars + cents;
    }

    switch(formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  };
}



/*============================================================================
  Timber functions
  * initCache
  * init
  * accessibleNav
  * drawersInit
  * mobileNavToggle
  * getHash
  * productPage
  * setSelectorLabels
  * updateSelectorLabel
  * responsiveVideos
  * loginForms
  * resetPasswordSuccess
==============================================================================*/
window.timber = window.timber || {};

timber.initCache = function () {
  timber.cache = {
    // General
    $html                    : $('html'),
    $body                    : $('body'),

    // Navigation
    $navigation              : $('#AccessibleNav'),
    $mobileSubNavToggle      : $('.mobile-nav__toggle-btn'),

    // Product Page
    $productImage            : $('#ProductPhotoImg'),
    $optionSelector          : $('.single-option-selector'),

    // Customer Pages
    $recoverPasswordLink     : $('#RecoverPassword'),
    $hideRecoverPasswordLink : $('#HideRecoverPasswordLink'),
    $recoverPasswordForm     : $('#RecoverPasswordForm'),
    $customerLoginForm       : $('#CustomerLoginForm'),
    $passwordResetSuccess    : $('#ResetSuccess')
  };
};

timber.init = function () {
  FastClick.attach(document.body);
  timber.initCache();
  // timber.accessibleNav();
  timber.drawersInit();
  timber.mobileNavToggle();
  timber.responsiveVideos();
  timber.loginForms();
  timber.setSelectorLabels();
};

// timber.accessibleNav = function () {
//   var $nav = timber.cache.$navigation,
//       $allLinks = $nav.find('a'),
//       $topLevel = $nav.children('li').find('a'),
//       $parents = $nav.find('.site-nav--has-dropdown'),
//       $subMenuLinks = $nav.find('.site-nav__dropdown').find('a'),
//       activeClass = 'nav-hover',
//       focusClass = 'nav-focus';

//   // Mouseenter
//   $parents.on('mouseenter touchstart', function(evt) {
//     var $el = $(this);

//     if (!$el.hasClass(activeClass)) {
//       // force stop the click from happening
//       evt.preventDefault();
//       evt.stopImmediatePropagation();
//     }

//     showDropdown($el);
//   });

//   // Mouseout
//   $parents.on('mouseleave', function() {
//     hideDropdown($(this));
//   });

//   $subMenuLinks.on('touchstart', function(evt) {
//     // Prevent touchstart on body from firing instead of link
//     evt.stopImmediatePropagation();
//   });

//   $allLinks.focus(function() {
//     handleFocus($(this));
//   });

//   $allLinks.blur(function() {
//     removeFocus($topLevel);
//   });

//   // accessibleNav private methods
//   function handleFocus ($el) {
//     var $subMenu = $el.next('ul'),
//         hasSubMenu = $subMenu.hasClass('sub-nav') ? true : false,
//         isSubItem = $('.site-nav__dropdown').has($el).length,
//         $newFocus = null;

//     // Add focus class for top level items, or keep menu shown
//     if (!isSubItem) {
//       removeFocus($topLevel);
//       addFocus($el);
//     } else {
//       $newFocus = $el.closest('.site-nav--has-dropdown').find('a');
//       addFocus($newFocus);
//     }
//   }

//   function showDropdown ($el) {
//     $el.addClass(activeClass);

//     setTimeout(function() {
//       timber.cache.$body.on('touchstart', function() {
//         hideDropdown($el);
//       });
//     }, 250);
//   }

//   function hideDropdown ($el) {
//     $el.removeClass(activeClass);
//     timber.cache.$body.off('touchstart');
//   }

//   function addFocus ($el) {
//     $el.addClass(focusClass);
//   }

//   function removeFocus ($el) {
//     $el.removeClass(focusClass);
//   }
// };


/*
 *
 */
timber.drawersInit = function () {
  timber.LeftDrawer = new timber.Drawers('NavDrawer', 'left');
  timber.RightDrawer = new timber.Drawers('CartDrawer', 'right', {
    'onDrawerOpen': ajaxCart.load
  });
};


/*
 * Mobile n
 *
 */
timber.mobileNavToggle = function () {
  var $toggleBtns = timber.cache.$mobileSubNavToggle;

  // Setup aria attributes
  $toggleBtns.attr('aria-expanded', 'false');
  $toggleBtns.each(function (i, el) {
    var $el = $(el);
    $el.attr('aria-controls', $el.attr('data-aria-controls'));
  });

  $toggleBtns.on('click', function() {
    var $el = $(this);
    var currentlyExpanded = $el.attr('aria-expanded');
    var toggleState = false;

    // Updated aria-expanded value based on state pre-click
    if (currentlyExpanded === 'true') {
      $el.attr('aria-expanded', 'false');
    } else {
      $el.attr('aria-expanded', 'true');
      toggleState = true;
    }

    // Toggle class that expands/collapses sublist
    $el.closest('.mobile-nav__has-sublist').toggleClass('mobile-nav--expanded', toggleState);
  });
};

timber.getHash = function () {
  return window.location.hash;
};

timber.productPage = function (options) {
  var moneyFormat = options.money_format,
      variant = options.variant,
      selector = options.selector,
      translations = options.translations;

  // Selectors
  var $productImage = $('#ProductPhotoImg'),
      $addToCart = $('#AddToCart'),
      $productPrice = $('#ProductPrice'),
      $comparePrice = $('#ComparePrice'),
      $priceWrapper = $('.product-single__price--wrapper'),
      $quantityElements = $('.js-quantity-selector, label + .js-qty'),
      $addToCartText = $('#AddToCartText');

  if (variant) {

    // Update variant image, if one is set
    if (variant.featured_image) {
      var newImg = variant.featured_image,
          el = $productImage[0];
      // Shopify.Image.switchImage(newImg, el, theme.showVariantImage);
    }

    // Select a valid variant if available
    if (variant.available) {
      // Available, enable the submit button, change text, show quantity elements
      $addToCart.removeClass('disabled').prop('disabled', false);
      $addToCartText.html(translations.addToCart);
      $quantityElements.show();
    } else {
      // Sold out, disable the submit button, change text, hide quantity elements
      $addToCart.addClass('disabled').prop('disabled', true);
      $addToCartText.html(translations.soldOut);
      $quantityElements.hide();
    }

    $productPrice.html(Shopify.formatMoney(variant.price, moneyFormat).replace(/((\,00)|(\.00))$/g, '')).show();

    // Also update and show the product's compare price if necessary
    if (variant.compare_at_price > variant.price) {
      $comparePrice.html(Shopify.formatMoney(variant.compare_at_price, moneyFormat).replace(/((\,00)|(\.00))$/g, ''));
      $priceWrapper.show();
      $productPrice.addClass('on-sale');
    } else {
      $priceWrapper.hide();
      $productPrice.removeClass('on-sale');
    }

  } else {
    // The variant doesn't exist, disable submit button.
    // This may be an error or notice that a specific variant is not available.
    // To only show available variants, implement linked product options:
    //   - http://docs.shopify.com/manual/configuration/store-customization/advanced-navigation/linked-product-options
    $addToCart.addClass('disabled').prop('disabled', true);
    $addToCartText.html(translations.unavailable);
    $quantityElements.hide();
  }
};

timber.setSelectorLabels = function () {
  if (timber.cache.$optionSelector.length && timber.cache.$html.hasClass('supports-pointerevents')) {
    timber.cache.$optionSelector.each(function () {
      timber.updateSelectorLabel(null, this);
    });

    timber.cache.$optionSelector.on('change', timber.updateSelectorLabel);
  }
}

timber.updateSelectorLabel = function (evt, element) {
  var $label,
      renderedLabel,
      selectedVariant;

  // set $select based on whether function was called by
  // bound event or not
  var $select = evt ? $(evt.target) : $(element);
  $label = $select.prev('label').find('.dropdown-label--active');
  selectedVariant = $select.find('option:selected').text();
  $label.html(' ' + selectedVariant);
};

timber.responsiveVideos = function () {
  var $iframeVideo = $('iframe[src*="youtube.com/embed"], iframe[src*="player.vimeo"]');
  var $iframeReset = $iframeVideo.add('iframe#admin_bar_iframe');

  $iframeVideo.each(function () {
    // Add wrapper to make video responsive
    $(this).wrap('<div class="video-wrapper"></div>');
  });

  $iframeReset.each(function () {
    // Re-set the src attribute on each iframe after page load
    // for Chrome's "incorrect iFrame content on 'back'" bug.
    // https://code.google.com/p/chromium/issues/detail?id=395791
    // Need to specifically target video and admin bar
    this.src = this.src;
  });
};

timber.loginForms = function () {
  function showRecoverPasswordForm() {
    timber.cache.$recoverPasswordForm.show();
    timber.cache.$customerLoginForm.hide();
  }

  function hideRecoverPasswordForm() {
    timber.cache.$recoverPasswordForm.hide();
    timber.cache.$customerLoginForm.show();
  }

  timber.cache.$recoverPasswordLink.on('click', function(evt) {
    evt.preventDefault();
    showRecoverPasswordForm();
  });

  timber.cache.$hideRecoverPasswordLink.on('click', function(evt) {
    evt.preventDefault();
    hideRecoverPasswordForm();
  });

  // Allow deep linking to recover password form
  if (timber.getHash() == '#recover') {
    showRecoverPasswordForm();
  }
};

timber.resetPasswordSuccess = function () {
  timber.cache.$passwordResetSuccess.show();
};





/*============================================================================
  Drawer modules
  * init
  * open
  * close
  * trapFocus
  * removeTrapFocus
  * bindEvents
  * unbindEvents

  Docs http://shopify.github.io/Timber/#drawers
==============================================================================*/
timber.Drawers = (function () {
  var Drawer = function (id, position, options) {
    var defaults = {
      close: '.js-drawer-close',
      open: '.js-drawer-open-' + position,
      openClass: 'js-drawer-open',
      dirOpenClass: 'js-drawer-open-' + position
    };

    this.$nodes = {
      parent: $('body, html'),
      page: $('#PageContainer'),
      moved: $('.is-moved-by-drawer')
    };

    this.config = $.extend(defaults, options);
    this.position = position;

    this.$drawer = $('#' + id);

    if (!this.$drawer.length) {
      return false;
    }

    this.drawerIsOpen = false;
    this.init();
  };

  Drawer.prototype.init = function () {
    var $openBtn = $(this.config.open);

    // Add aria controls
    $openBtn.attr('aria-expanded', 'false');

    $openBtn.on('click', $.proxy(this.open, this));
    this.$drawer.find(this.config.close).on('click', $.proxy(this.close, this));
  };

  Drawer.prototype.open = function (evt) {
    // Keep track if drawer was opened from a click, or called by another function
    var externalCall = false;

    // don't open an opened drawer
    if (this.drawerIsOpen) {
      return;
    }

    // Prevent following href if link is clicked
    if (evt) {
      evt.preventDefault();
    } else {
      externalCall = true;
    }

    // Without this, the drawer opens, the click event bubbles up to $nodes.page
    // which closes the drawer.
    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
      // save the source of the click, we'll focus to this on close
      this.$activeSource = $(evt.currentTarget);
    }

    if (this.drawerIsOpen && !externalCall) {
      return this.close();
    }

    // Add is-transitioning class to moved elements on open so drawer can have
    // transition for close animation
    this.$nodes.moved.addClass('is-transitioning');
    this.$drawer.prepareTransition();

    this.$nodes.parent.addClass(this.config.openClass + ' ' + this.config.dirOpenClass);
    this.drawerIsOpen = true;

    // Set focus on drawer
    Drawer.prototype.trapFocus(this.$drawer, 'drawer_focus');

    // Run function when draw opens if set
    if (this.config.onDrawerOpen && typeof(this.config.onDrawerOpen) == 'function') {
      if (!externalCall) {
        this.config.onDrawerOpen();
      }
    }

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'true');
    }

    this.bindEvents();
  };

  Drawer.prototype.close = function () {
    // don't close a closed drawer
    if (!this.drawerIsOpen) {
      return;
    }

    // deselect any focused form elements
    $(document.activeElement).trigger('blur');

    // Ensure closing transition is applied to moved elements, like the nav
    this.$nodes.moved.prepareTransition({ disableExisting: true });
    this.$drawer.prepareTransition({ disableExisting: true });

    this.$nodes.parent.removeClass(this.config.dirOpenClass + ' ' + this.config.openClass);

    this.drawerIsOpen = false;

    // Remove focus on drawer
    Drawer.prototype.removeTrapFocus(this.$drawer, 'drawer_focus');

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'false');
    }

    this.unbindEvents();
  };

  Drawer.prototype.trapFocus = function ($container, eventNamespace) {
    var eventName = eventNamespace ? 'focusin.' + eventNamespace : 'focusin';

    $container.attr('tabindex', '-1');

    $container.focus();

    $(document).on(eventName, function (evt) {
      if ($container[0] !== evt.target && !$container.has(evt.target).length) {
        $container.focus();
      }
    });
  };

  Drawer.prototype.removeTrapFocus = function ($container, eventNamespace) {
    var eventName = eventNamespace ? 'focusin.' + eventNamespace : 'focusin';

    $container.removeAttr('tabindex');
    $(document).off(eventName);
  };

  Drawer.prototype.bindEvents = function() {
    // Lock scrolling on mobile
    this.$nodes.page.on('touchmove.drawer', function () {
      return false;
    });

    // Clicking out of drawer closes it
    this.$nodes.page.on('click.drawer', $.proxy(function () {
      this.close();
      return false;
    }, this));

    // Pressing escape closes drawer
    this.$nodes.parent.on('keyup.drawer', $.proxy(function(evt) {
      if (evt.keyCode === 27) {
        this.close();
      }
    }, this));
  };

  Drawer.prototype.unbindEvents = function() {
    this.$nodes.page.off('.drawer');
    this.$nodes.parent.off('.drawer');
  };

  return Drawer;
})();

// Initialize Timber's JS on docready
$(timber.init);

/*
 * Shopify JS for customizing Slick.js
 *   http://kenwheeler.github.io/slick/
 *   Untouched JS in assets/slick.min.js
 */

/*
 * Run function after window resize
 * http://stackoverflow.com/questions/2854407/javascript-jquery-window-resize-how-to-fire-after-the-resize-is-completed
 */
var afterResize=(function(){var t={};return function(callback,ms,uniqueId){if(!uniqueId){uniqueId="Don't call this twice without a uniqueId";}if(t[uniqueId]){clearTimeout(t[uniqueId]);}t[uniqueId]=setTimeout(callback,ms);};})();

var slickTheme = (function(module, $) {
  'use strict';

  // Public functions
  var init, onInit, beforeChange, afterChange;

  // Private variables
  var settings, $slider, $allSlides, $activeSlide, $slickDots, windowHeight, scrolled, $heroText, $heroImage, prefixedTransform;
  var currentActiveSlide = 0;

  // Private functions
  var cacheObjects, checkFirstOnIndex, setFullScreen, sizeFullScreen, setParallax, calculateParallax, slickColors, fixIE8;

  /*============================================================================
   Initialise the plugin and define global options
  ==============================================================================*/
  cacheObjects = function () {
    slickTheme.cache = {
      $html      : $('html'),
      $window    : $(window),

      $heroImage : $('.hero__image'),
      $headerWrapper: $('.header-wrapper')
    };

    slickTheme.vars = {
      slideClass      : 'slick-slide',
      activeClass     : 'slick-active',
      hiddenClass     : 'hero__slide--hidden',
      heroHeaderClass : 'hero__header'
    };
  };

  init = function (options) {
    cacheObjects();

    // Default settings
    settings = {
      // User options
      $element       : null,
      fullscreen     : false,
      parallax       : false,

      // Private settings
      isTouch        : slickTheme.cache.$html.hasClass('supports-touch') ? true : false,

      // Slack options
      arrows         : false,
      dots           : true,
      adaptiveHeight : true
    };

    // Override defaults with arguments
    $.extend(settings, options);

    // Check if this hero is the first one on the home page
    settings.isFirstOnIndex = checkFirstOnIndex();

    // Absolutely position header over hero as soon as possible
    if (settings.isFirstOnIndex) {
      slickTheme.cache.$headerWrapper.addClass(slickTheme.vars.heroHeaderClass);
    }

    /*
     * Init slick slider
     *   - Add any additional option changes here
     *   - https://github.com/kenwheeler/slick/#options
     */
    settings.$element.slick({
      arrows         : settings.arrows,
      dots           : settings.dots,
      adaptiveHeight : settings.fullscreen ? false : settings.adaptiveHeight,
      draggable      : false,
      fade           : true,
      autoplay       : true,
      autoplaySpeed  : 300,
      onInit         : this.onInit,
      onBeforeChange : this.beforeChange,
      onAfterChange  : this.afterChange
    });
  };

  checkFirstOnIndex = function () {
    if (settings.$element.hasClass('hero--first')) {
      return true;
    };

    return false;
  };

  onInit = function (obj) {
    $slider = obj.$slider;
    $allSlides = $slider.find('.' + slickTheme.vars.slideClass);
    $activeSlide = $slider.find('.' + slickTheme.vars.activeClass);
    $slickDots = $slider.find('.slick-dots');

    if (!settings.isTouch) {
      $allSlides.addClass(slickTheme.vars.hiddenClass);
      $activeSlide.removeClass(slickTheme.vars.hiddenClass);
    }

    if (settings.fullscreen) {
      setFullScreen();
      slickColors();

      if (slickTheme.cache.$html.hasClass('lt-ie9')) {
        fixIE8();
      }
    }

    if (settings.parallax && slickTheme.cache.$html.hasClass('supports-csstransforms3d')) {
      setParallax();
    }
  };

  beforeChange = function (evt, currentSlide, nextSlide) {
    if (settings.fullscreen) {
      var $nextSlide = $allSlides.eq(nextSlide),
          newTextColor = $nextSlide.data('color');

      slickColors(newTextColor);
    }

    if (!settings.isTouch) {
      $allSlides.removeClass(slickTheme.vars.hiddenClass);
    }

    // Set upcoming slide as index
    currentActiveSlide = nextSlide;

    // Set new active slide to proper parallax position
    if (settings.parallax && slickTheme.cache.$html.hasClass('supports-csstransforms3d')) {
      calculateParallax(settings.fullscreen, currentActiveSlide);
    }
  };

  afterChange = function (evt, currentSlide) {
    if (!settings.isTouch) {
      $activeSlide = $slider.find('.' + slickTheme.vars.activeClass);
      $allSlides.addClass(slickTheme.vars.hiddenClass);
      $activeSlide.removeClass(slickTheme.vars.hiddenClass);
    }
  };

  setFullScreen = function () {
    sizeFullScreen();

    // Resize hero after screen resize
    slickTheme.cache.$window.resize(function () {
      afterResize(function() {
        sizeFullScreen();
      }, 200, 'sizeFullScreen');
    });
  };

  sizeFullScreen = function () {
    windowHeight = slickTheme.cache.$window.height();
    settings.$element.css('height', windowHeight);
  };

  setParallax = function () {
    prefixedTransform = theme.vendorPrefix ? theme.vendorPrefix('transform') : 'transform';

    $heroText = $('.hero__text-content');
    $heroImage = $('.hero__image');

    slickTheme.cache.$window.on('scroll', function(evt) {
      calculateParallax(settings.fullscreen, currentActiveSlide);
    });
  };

  calculateParallax = function (parallaxImage, currentSlide) {
    scrolled = slickTheme.cache.$window.scrollTop();

    $heroText[currentSlide].style[prefixedTransform] = 'translate3d(0, ' + scrolled / 8 + 'px, 0)';
    if (parallaxImage) {
      $heroImage[currentSlide].style[prefixedTransform] = 'translate3d(0, ' + scrolled / 4.5 + 'px, 0)';
    }
  };

  slickColors = function (color) {
    // Find the new color if one isn't sent
    if (!color) {
      var color = $('.slick-active').attr('data-color');
    }

    // Set an is-light or is-dark class on the header and nav dots to update colors
    if (settings.isFirstOnIndex) {
      slickTheme.cache.$headerWrapper.removeClass('is-light is-dark').addClass(color);
    }

    // Set an is-light or is-dark class on nav dots to update colors
    if ($slickDots.length) {
      $slickDots.removeClass('is-light is-dark').addClass(color);
    }
  };

  fixIE8 = function () {
    // Add an -ms- filter to make background-size: cover (mostly) work
    slickTheme.cache.$heroImage.each(function() {
      var $el = $(this),
          img = $el.attr('data-image');

      $el.css({
        'background-image': 'none',
        'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + img + '", sizingMethod="scale")'
        });
    });
  };

  module = {
    init: init,
    onInit: onInit,
    beforeChange: beforeChange,
    afterChange: afterChange
  };

  return module;

}(slickTheme || {}, jQuery));

/*============================================================================
  Social Icon Buttons v1.0
  Author:
    Carson Shold | @cshold
    http://www.carsonshold.com
  MIT License
==============================================================================*/
window.timberSocial = window.timberSocial || {};

timberSocial.cacheSelectors = function () {
  timberSocial.cache = {
    $shareButtons: $('.social-sharing'),
  }
};

timberSocial.init = function () {
  timberSocial.cacheSelectors();
  timberSocial.sliders();
};

timberSocial.socialSharing = function () {

  timberSocial.cacheSelectors();

  // General selectors
  var $buttons = timberSocial.cache.$shareButtons,
      $shareLinks = $buttons.find('a'),
      permalink = $buttons.attr('data-permalink');

  // Share button selectors
  var $fbLink = $('.share-facebook').find('.share-count'),
      $pinLink = $('.share-pinterest').find('.share-count'),
      $googleLink = $('.share-google').find('.share-count');

  if ( $fbLink.length ) {
    $.getJSON('https://graph.facebook.com/?id=' + permalink + '&callback=?', function(data) {
      if (data.shares) {
        $fbLink.text(data.shares).addClass('is-loaded');
      } else {
        $fbLink.remove();
      }
    });
  };

  if ( $pinLink.length ) {
    $.getJSON('https://api.pinterest.com/v1/urls/count.json?url=' + permalink + '&callback=?', function(data) {
      if (data.count > 0) {
        $pinLink.text(data.count).addClass('is-loaded');
      } else {
        $pinLink.remove();
      }
    });
  };

  if ( $googleLink.length ) {
    // Can't currently get Google+ count with JS, so just pretend it loaded
    $googleLink.addClass('is-loaded');
  }

  // Share popups
  $shareLinks.on('click', function(e) {
    e.preventDefault();
    var el = $(this),
        popup = el.attr('class').replace('-','_'),
        link = el.attr('href'),
        w = 700,
        h = 400;

    // Set popup sizes
    switch (popup) {
      case 'share-fancy':
        w = 480;
        h = 720;
        break;
      case 'share-google':
        w = 500;
        break;
    }

    window.open(link, popup, 'width=' + w + ', height=' + h);
  });
}

$(timberSocial.socialSharing);




/*============================================================================
  Theme functions
  * initCache
  * init
  * collectionBackButton
  * backButton
  * setBreakpoints
  * fitNav
  * initHero
  * resizeLogo
  * sizeCartDrawerFooter
  * afterCartLoad
  * checkoutIndicator
  * searchModal
  * productImageZoom
  * collectionParallax
  * createImageCarousel
  * destroyImageCarousel
  * initCollageGrid
  * collageGridHeights
  * clearCollageGridHeights
  * equalHeights
  * initStickyProductMeta
  * hideSingleSelectors
  * showVariantImage
  * articleImages
  * styleTextLinks
==============================================================================*/
// Returns a function which adds a vendor prefix to any CSS property name
// Source https://github.com/markdalgleish/stellar.js/blob/master/src/jquery.stellar.js
theme.vendorPrefix = (function () {
  var prefixes = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/,
      style = $('script')[0].style,
      prefix = '',
      prop;

  for (prop in style) {
    if (prefixes.test(prop)) {
      prefix = prop.match(prefixes)[0];
      break;
    }
  }

  if ('WebkitOpacity' in style) { prefix = 'Webkit'; }
  if ('KhtmlOpacity' in style) { prefix = 'Khtml'; }

  return function (property) {
    return prefix + (prefix.length > 0 ? property.charAt(0).toUpperCase() + property.slice(1) : property);
  };
}());

theme.variables = {
  productPageLoad     : false,
  productPageSticky   : true,

  // Breakpoints from src/stylesheets/global/variables.scss.liquid
  mediaQuerySmall     : 'screen and (max-width: 590px)',
  mediaQueryMedium    : 'screen and (min-width: 591px) and (max-width: 768px)',
  mediaQueryLarge     : 'screen and (min-width: 769px)',
  bpSmall             : false
};

theme.initCache = function () {
  theme.cache = {
    $window                 : $(window),
    $html                   : $('html'),
    $body                   : $('body'),
    $drawerRight            : $('.drawer--right'),

    $hero                   : $('#Hero'),
    $customSelect           : $('.js-selector'),

    $collectionImage        : $('.collection-hero__image'),

    $siteNav                : $('.site-nav'),
    $cartBuggle             : $('.cart-link__bubble'),
    $logo                   : $('.site-header__logo img'),
    $toggleSearchModal      : $('.js-toggle-search-modal'),

    $productImages          : $('.product-single__photos'),
    $productImagePhoto      : $('.js-product-featured-image'),

    $indentedRteImages      : $('.rte--indented-images'),

    $productGridRows        : $('.collage-grid__row'),
    $productGridItem        : $('.grid__product'),
    $productGridPhotosLarge : $('.grid__item--large .grid-product__image-link'),

    // Equal height elements
    $productGridImages      : $('.grid-uniform .grid-product__image-wrapper'),

    $productSingleWrapper   : $('.product-single'),
    $productSingleMeta      : $('.product-single__meta'),
    $productReturnLink      : $('.return-link'),
    $productSelectors       : $('.radio-wrapper')
  };
};

theme.init = function () {
  theme.initCache();
  theme.setBreakpoints();
  theme.fitNav();
  theme.initHero();
  theme.afterCartLoad();
  theme.checkoutIndicator();
  theme.collectionParallax();
  theme.collectionBackButton();
  theme.hideSingleSelectors();
  theme.styleTextLinks();
  theme.searchModal();
  theme.productImageZoom();

  // Functions to run on load so image sizes can be calculated
  theme.cache.$window.on('load', theme.resizeLogo);
  theme.cache.$window.on('load', theme.initStickyProductMeta);
  theme.cache.$window.on('load', theme.articleImages);

  // Functions to re-run on resize
  theme.cache.$window.on('resize', theme.debounce(theme.resizeLogo, 150));
  theme.cache.$window.on('resize', theme.debounce(theme.initStickyProductMeta, 150));

};

theme.collectionBackButton = function () {
  if (!document.referrer || !theme.cache.$productReturnLink.length || !window.history.length) {
    return;
  }

  theme.cache.$productReturnLink.on('click', theme.backButton);
};

theme.backButton = function () {
  var referrerDomain = urlDomain(document.referrer);
  var shopDomain = urlDomain(document.url);

  if (shopDomain === referrerDomain) {
    history.back();
    return false;
  }

  function urlDomain(url) {
    var    a      = document.createElement('a');
           a.href = url;
    return a.hostname;
  }
};

theme.setBreakpoints = function () {
  if(!theme.cache.$html.hasClass('lt-ie9')) {
    enquire.register(theme.variables.mediaQuerySmall, {
      match: function () {
        // theme.createImageCarousel();

        theme.variables.bpSmall = true;

        if (theme.cache.$productImagePhoto.length) {
          // remove event handlers for product zoom on mobile
          theme.cache.$productImagePhoto.off();
        };
      },
      unmatch: function () {
        // theme.destroyImageCarousel();
        theme.variables.bpSmall = false;
        // theme.initStickyProductMeta();

        // reinit product zoom
        theme.productImageZoom();
      }
    });
  }
};

theme.fitNav = function () {
  // Measure children of site nav on load and resize.
  // If wider than parent, switch to mobile nav.
  controlNav();
  theme.cache.$window.on('load', controlNav);
  theme.cache.$window.on('resize', theme.debounce(controlNav, 150));

  function controlNav() {
    // Subtract 20 from width to account for inline-block spacing
    var navWidth = theme.cache.$siteNav.parent().outerWidth() - 20;
    var navItemWidth = 0;
    theme.cache.$siteNav.find('> li').each(function() {
      var $el = $(this);
      if (!$el.hasClass('site-nav--compress__menu')) {
        // Round up to be safe
        navItemWidth += Math.ceil($(this).width());
      }
    });

    if (navItemWidth > navWidth) {
      theme.cache.$siteNav.addClass('site-nav--compress');
    } else {
      theme.cache.$siteNav.removeClass('site-nav--compress');
    }

    theme.cache.$siteNav.addClass('site-nav--init');
  }
};

theme.initHero = function () {
  if (!theme.cache.$hero.length) {
    return;
  };

  slickTheme.init({
    $element     : theme.cache.$hero,
    fullscreen   : theme.cache.$hero.data('fullscreen'),
    parallax     : theme.cache.$hero.data('parallax')
  });
};

theme.resizeLogo = function () {
  // Using .each() as there can be a reversed logo too
  theme.cache.$logo.each(function() {
    var $el = $(this),
        logoWidthOnScreen = $el.width(),
        containerWidth = $el.closest('.grid__item').width();
    // If image exceeds container, let's make it smaller
    if (logoWidthOnScreen > containerWidth) {
      $el.css('maxWidth', containerWidth);
    }
    else {
      $el.removeAttr('style');
    }
  });
};

theme.sizeCartDrawerFooter = function () {
  // Stop if our drawer doesn't have a fixed footer
  if (!theme.cache.$drawerRight.hasClass('drawer--has-fixed-footer')) {
    return;
  }

  // Elements are reprinted regularly so selectors are not cached
  var $cartFooter = $('.ajaxcart__footer').removeAttr('style'),
      $cartInner = $('.ajaxcart__inner').removeAttr('style'),
      cartFooterHeight = $cartFooter.outerHeight();

  $cartInner.css('bottom', cartFooterHeight);
  $cartFooter.css('height', cartFooterHeight);
};

theme.afterCartLoad = function () {
  theme.cache.$body.on('ajaxCart.afterCartLoad', function(evt, cart) {
    // Open cart drawer
    timber.RightDrawer.open();

    // Size the cart's fixed footer
    theme.sizeCartDrawerFooter();

    // Show cart bubble in nav if items exist
    if (cart.items.length > 0) {
      theme.cache.$cartBuggle.addClass('cart-link__bubble--visible');
    } else {
      theme.cache.$cartBuggle.removeClass('cart-link__bubble--visible');
    }
  });
};

theme.checkoutIndicator = function () {
  // Add a loading indicator on the cart checkout button (/cart and drawer)
  theme.cache.$body.on('click', '.cart__checkout', function() {
    $(this).addClass('btn--loading');
  });
};

theme.searchModal = function() {
  if (!theme.cache.$toggleSearchModal.length) {
    return;
  }

  theme.cache.$toggleSearchModal.magnificPopup({
    type: 'inline',
    mainClass: 'mfp-fade',
    closeOnBgClick: true,
    closeBtnInside: false,
    closeOnContentClick: false,
    tClose: 'Close (Esc)',
    alignTop: true,
    removalDelay: 500
  });
}

theme.productImageZoom = function() {
  if (!theme.cache.$productImagePhoto.length || theme.variables.bpSmall) {
    return;
  };

  theme.cache.$productImagePhoto.magnificPopup({
    type: 'image',
    mainClass: 'mfp-fade',
    closeOnBgClick: true,
    closeBtnInside: false,
    closeOnContentClick: true,
    tClose: 'Close (Esc)',
    removalDelay: 500,
    gallery: {
      enabled: false,
      navigateByImgClick: false,
      arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"><span class="mfp-chevron mfp-chevron-%dir%"></span></button>',
      tPrev: 'Previous (Left arrow key)',
      tNext: 'Next (Right arrow key)'
    }
  });
};

theme.collectionParallax = function () {
  if (!theme.cache.$collectionImage.length || !theme.cache.$html.hasClass('supports-csstransforms3d')) {
    return;
  }

  theme.cache.$collectionImage.addClass('is-init');

  var prefixedTransform = theme.vendorPrefix ? theme.vendorPrefix('transform') : 'transform';

  theme.cache.$window.on('scroll', function(evt) {
    var scrolled = theme.cache.$window.scrollTop();
    theme.cache.$collectionImage[0].style[prefixedTransform] = 'translate3d(0, ' + scrolled / 4.5 + 'px, 0)';
  });
};

theme.createImageCarousel = function () {
  if (!theme.cache.$productImages.length || theme.cache.$productImagePhoto.length < 2) {
    return;
  }

  theme.cache.$productImages.slick({
    arrows         : false,
    dots           : true,
    adaptiveHeight : true
  });
};

theme.destroyImageCarousel = function () {
  if (!theme.cache.$productImages.length) {
    return;
  }

  theme.cache.$productImages.unslick();
};

theme.initCollageGrid = function () {
  if (!theme.cache.$productGridRows.length) {
    return;
  };

  theme.collageGridHeights();

  theme.cache.$window.on('resize', theme.debounce(theme.collageGridHeights, 500));
}

theme.collageGridHeights = function () {
  if (theme.variables.bpSmall || !theme.cache.$productGridRows.length) {
    return;
  }

  ///calculate image heights for each row of grid images
  for (var i = theme.cache.$productGridRows.length - 1; i >= 0; i--) {
    var $currentRow = $(theme.cache.$productGridRows[i]);
    var $smallImages = $currentRow.find('.grid__item--small .grid-product__image-wrapper');
    var $largeImageWrapper = $currentRow.find('.grid__item--large .grid-product__image-wrapper');
    var $largeImage = $largeImageWrapper.find('.grid-product__image-link');

    // calculate the bottom edge of the small image
    var smallImageOffset = $smallImages[1].offsetTop + $smallImages[1].offsetHeight;

    // calculate the bottom edge of the large image for the row
    var largeImageOffset = $largeImageWrapper[0].offsetTop + $largeImageWrapper[0].offsetHeight;

    // Depending on which image is lower, increase or decrease the large
    // image size
    if (smallImageOffset > largeImageOffset) {
      var largeImageHeight = $largeImage.height() + (smallImageOffset - largeImageOffset);
    } else {
      var largeImageHeight = $largeImage.height() - (largeImageOffset - smallImageOffset);
    };

    $largeImage.css('height', largeImageHeight);
  };
}

theme.clearCollageGridHeights = function () {
  if (!theme.cache.$productGridRows.length) {
    return;
  };

  theme.cache.$productGridPhotosLarge.removeAttr('style');
}

theme.equalHeights = function () {
  theme.cache.$window.on('load', resizeElements());

  theme.cache.$window.on('resize',
    afterResize(function() {
      resizeElements();
    }, 250, 'equal-heights')
  );

  function resizeElements() {
    theme.cache.$productGridImages.css('height', 'auto').equalHeights();
  }
};

theme.initStickyProductMeta = function () {
  if (theme.cache.$productSingleMeta.find('#shopify-product-reviews').length) {
    theme.variables.productPageSticky = false;
    return;
  }

  if (!theme.cache.$productSingleMeta.length || theme.cache.$productImagePhoto.length < 2) {
    return;
  }

  // Don't bother on IE8
  if (theme.cache.$html.hasClass('lt-ie9')) {
    return;
  }

  // Force detatch if already detached. Prevent layout issues.
  theme.cache.$productSingleMeta.trigger('detach.ScrollToFixed');

  // Detach and stop if on mobile breakpoint
  if (theme.variables.bpSmall) {
    return;
  };

  var productCopyHeight = theme.cache.$productSingleMeta.outerHeight();
  var productImagesHeight = theme.cache.$productImages.height();

  /*============================================================================
    Calculate when to detach fixed element to avoid content overlap.
    Subtract product copy height from the limit because plugin uses offset().top
  ==============================================================================*/
  var calcLimit = theme.cache.$productSingleWrapper.offset().top + theme.cache.$productSingleWrapper.height();
  calcLimit -= productCopyHeight;

  // Init sticky if desc shorter than images and fits in viewport
  if (productCopyHeight < productImagesHeight && productCopyHeight < theme.cache.$window.height()) {
    theme.variables.productPageSticky = true;
    theme.cache.$productSingleMeta.scrollToFixed({
      limit: calcLimit
    });
  } else {
    theme.variables.productPageSticky = false;
  }
}

theme.hideSingleSelectors = function () {
  if (!theme.cache.$productSelectors.length) {
    return;
  }

  // loop through radio buttons and hide any fieldsets which only contain
  // one option
  for (var i = 0; i < theme.cache.$productSelectors.length; i++) {
    var $selector = $(theme.cache.$productSelectors[i]);
    var $radioButtons = $selector.find('.single-option-selector__radio');

    if ($radioButtons.length === 1 && $radioButtons[0].value === 'Default Title') {
      $selector.hide();
    }
  };
}

theme.showVariantImage = function (src, imgObject, el) {
  // Called when a new product variant is selected

  var $newImage = $('.product-single__photo[data-image-id="'+ imgObject.id +'"]');

  if (theme.variables.productPageLoad) {
    scrollToImage();
  } else {
    // Run on load to prevent Chrome scroll jerk
    $(window).on('load', function() {
      scrollToImage('load');
    });
    theme.variables.productPageLoad = true;
  }

  function scrollToImage(onLoad) {
    if (theme.variables.bpSmall) {
      // Switch carousel slide, unless it's the first photo on load
      var imageIndex = $newImage.parent().attr('index');
      // Navigate to slide unless it's the first photo on load

      // If there is no index, slider is not initalized.
      if (imageIndex === undefined) {
        return;
      }

      if (imageIndex != 0 || !onLoad) {
        theme.cache.$productImages.slickGoTo(imageIndex);
      }
    } else {
      var imageIndex = $newImage.parent().index();
      // Scroll to/reorder image unless it's the first photo on load
      if (imageIndex != 0 || !onLoad) {
        if (!theme.variables.productPageSticky) {
          // Move selected variant image to top
          $newImage.parent().prependTo(theme.cache.$productImages);
        } else {
          // Scroll to variant image
          $('html, body').animate({
            scrollTop: $newImage.offset().top
          }, 250);
        }
      }
    }
  }
};

theme.articleImages = function () {
  if (!theme.cache.$indentedRteImages.length) {
    return;
  }

  theme.cache.$indentedRteImages.find('img').each(function() {
    var $el = $(this);
    var attr = $el.attr('style');

    // Check if undefined or float: none
    if (!attr || attr == 'float: none;') {
      // Remove grid-breaking styles if image isn't wider than parent
      if ($el.width() < theme.cache.$indentedRteImages.width()) {
        $el.addClass('rte__no-indent');
      }
    }
  });
};

theme.styleTextLinks = function () {
  $('.rte').find('a:not(:has(img))').addClass('text-link');
}
