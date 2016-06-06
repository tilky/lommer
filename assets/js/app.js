import 'babel-polyfill';

import FastClick from 'fastclick';

import drawers from './scripts/drawers.js';

// import './scripts/ajax-cart.js';

// import './scripts/variant_selection.js';

import './scripts/custom.js';

$(document).ready(() => {
  FastClick.attach(document.body);
  drawers.init()
})