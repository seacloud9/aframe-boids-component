/* global assert, setup, suite, test */
require('aframe');
require('../index.js');
var entityFactory = require('./helpers').entityFactory;

suite('aframe-boids component', function () {
  var component;
  var el;

  setup(function (done) {
    el = entityFactory();
    el.addEventListener('componentinitialized', function (evt) {
      if (evt.detail.name !== 'aframe-boids') { return; }
      component = el.components['aframe-boids'];
      done();
    });
    el.setAttribute('aframe-boids', {});
  });

  suite('foo property', function () {
    test('is good', function () {
      assert.equal(1, 1);
    });
  });
});
