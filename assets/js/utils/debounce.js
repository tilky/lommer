// Setup theme global object
window.theme = window.theme || {};

/*
 * Debounce function
 * based on unminified version from http://davidwalsh.name/javascript-debounce-function
 */
window.theme.debounce = function(n,t,u){var e;return function(){var a=this,r=arguments,i=function(){e=null,u||n.apply(a,r)},o=u&&!e;clearTimeout(e),e=setTimeout(i,t),o&&n.apply(a,r)}}