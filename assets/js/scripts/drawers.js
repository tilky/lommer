export default {

  settings: {
    
  },

  init() {
    timber.LeftDrawer = new timber.Drawers('NavDrawer', 'left');
    timber.RightDrawer = new timber.Drawers('CartDrawer', 'right', {
      'onDrawerOpen': ajaxCart.load
    });
  },


  timber.LeftDrawer = new timber.Drawers('NavDrawer', 'left');
  timber.RightDrawer = new timber.Drawers('CartDrawer', 'right', {
    'onDrawerOpen': ajaxCart.load
  });
  
  
  openDrawer() {
    this.settings.$body.addClass('has-drawer-open');
    // this.settings.$drawer.addClass('is-open');
    this.settings.$drawer.prepareTransition().addClass('is-open');
    this.settings.$content.addClass('is-moved-by-drawer');
    this.settings.drawerIsOpen = true;
  },

  closeDrawer() {
    this.settings.$body.removeClass('has-drawer-open');
    this.settings.$drawer.prepareTransition().removeClass('is-open');
    this.settings.$drawer.prepareTransition();
    this.settings.$content.removeClass('is-moved-by-drawer');
    this.settings.drawerIsOpen = false;
  }
  
  
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
    // this.$nodes.moved.addClass('is-transitioning');
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
    this.$nodes.moved.prepareTransition();
    this.$drawer.prepareTransition();

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

};
/* eslint no-console: 0 */
