'use strict';

var b = require('./bar.js');

var pEl = document.createElement('p');
var textEl = document.createTextNode(b());
pEl.appendChild(textEl);
document.body.appendChild(pEl);