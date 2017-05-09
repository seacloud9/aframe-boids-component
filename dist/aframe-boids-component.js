/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/* global AFRAME */
	var extrasTube = __webpack_require__(1);
	// Register a single component.
	AFRAME.registerComponent('tube', extras.primitives.tube);

	if (typeof AFRAME === 'undefined') {
	    throw new Error('Component attempted to register before AFRAME was available.');
	}

	/**
	 * boids component for A-Frame.
	 */
	AFRAME.registerComponent('aframe-boids', {
	    schema: {
	        color:{
	            default: 0x0be253
	        },
	        cameras:{
	            default:[]
	        }
	    },

	    /**
	     * Set if component needs multiple instancing.
	     */
	    multiple: false,

	    /**
	     * Called once when component is attached. Generally for initial setup.
	     */
	    init: function () {
	        var el = this.el;
	        this.data.SCREEN_WIDTH = window.innerWidth;
	        this.data.SCREEN_HEIGHT = window.innerHeight;
	        this.data.scene  = this.el.sceneEl.object3D;

	        this.data.randomCamera = this.randomCamera.bind(this)

	        var Boid = __webpack_require__(2);
	        var Bird = __webpack_require__(3);

	        this.data.boids = [];
	        this.data.birdsEl = [];
	        this.data.birds = [];
	        this.data.tubesEl = [];

	        for ( var i = 0; i < 200; i ++ ) {
	            var boidEL = document.createElement('a-entity');
	            this.data.boid = this.data.boids[ i ] = new Boid();
	            this.data.boid.position.x = Math.random() * 400 - 200;
	            this.data.boid.position.y = Math.random() * 400 - 200;
	            this.data.boid.position.z = Math.random() * 400 - 200;
	            this.data.boid.velocity.x = Math.random() * 2 - 1;
	            this.data.boid.velocity.y = Math.random() * 2 - 1;
	            this.data.boid.velocity.z = Math.random() * 2 - 1;
	            this.data.boid.setAvoidWalls( true );
	            this.data.boid.setWorldSize( 500, 500, 400 );
	            this.data.bird = this.data.birds[ i ] = new THREE.Mesh( new Bird(), new THREE.MeshBasicMaterial( { color:this.data.color, side: THREE.DoubleSide } ) );
	            //var _camera = new THREE.PerspectiveCamera( 45, this.data.SCREEN_WIDTH  / this.data.SCREEN_HEIGHT , 1, 1000 )
	            var cameraEl = document.createElement('a-entity');
	            cameraEl.setAttribute('id', 'boidCam'+i);
	            cameraEl.setAttribute('camera', 'active: false');
	            this.data.birds[ i ].add(cameraEl.object3D)
	            this.data.cameras.push(cameraEl)
	            this.data.bird.phase = Math.floor( Math.random() * 62.83 );
	            //this.data.scene.add( this.data.bird );
	            var tubeEl = document.createElement('a-tube');
	            tubeEl.setAttribute('material', 'color: red');
	            tubeEl.setAttribute('path',  this.data.boid.position.x + ' ' + this.data.boid.position.y + ' ' + this.data.boid.position.z );
	            this.data.tubesEl.push(tubeEl);
	            boidEL.appendChild(tubeEl);
	            boidEL.object3D.add(this.data.bird);
	            this.data.birdsEl.push(boidEL)
	            this.el.sceneEl.appendChild(boidEL);
	            boidEL.appendChild(cameraEl);
	        }

	        this.el.sceneEl.addEventListener('render-target-loaded', function () {
	            this.data.render = this.el.sceneEl.renderer;
	        }.bind(this));

	        document.querySelector('a-scene').addEventListener('camera-set-active', function (evt) {
	            evt.detail.cameraEl.classList.add('active-camera');
	        });

	    },

	    randomSelection: function(_selectedArray){
	        return _selectedArray[Math.floor(Math.random()*_selectedArray.length)];
	    },

	    randomCamera: function(){
	        this.cameraSwap.call(this, this.randomSelection.call(this, this.data.cameras));
	    },

	    cameraSwap: function(_camera){
	        _camera.setAttribute('camera', 'active', true);
	    },

	    /**
	     * Called when component is attached and when component data changes.
	     * Generally modifies the entity based on the data.
	     */
	    update: function (oldData) { },

	    /**
	     * Called when a component is removed (e.g., via removeAttribute).
	     * Generally undoes all modifications to the entity.
	     */
	    remove: function () { },

	    /**
	     * Called on each scene tick.
	     */
	    tick: function (t) {
	        for ( var i = 0, il = this.data.birds.length; i < il; i++ ) {

	            this.data.boid = this.data.boids[ i ];
	            this.data.boid.run( this.data.boids );

	            this.data.bird = this.data.birds[ i ];
	            this.data.bird.position.copy( this.data.boids[ i ].position );

	            this.data.color = this.data.bird.material.color;
	            //this.data.color.r = this.data.color.g = this.data.color.b = ( 500 - this.data.bird.position.z ) / 1000;

	            this.data.bird.rotation.y = Math.atan2( - this.data.boid.velocity.z, this.data.boid.velocity.x );
	            this.data.bird.rotation.z = Math.asin( this.data.boid.velocity.y / this.data.boid.velocity.length() );
	            this.data.birdsEl[ i ].setAttribute('position', this.data.bird.position.x +' '+ this.data.bird.position.y + ' '+ this.data.bird.position.z);
	            this.data.birdsEl[ i ].setAttribute('rotation', this.data.bird.rotation.x +' '+ this.data.bird.rotation.y + ' '+ this.data.bird.rotation.z);
	            this.data.tubesEl[ i ].setAttribute('path', this.data.tubesEl[ i ].getAttribute('path') + ',' + this.data.bird.position.x +' '+ this.data.bird.position.y + ' '+ this.data.bird.position.z);
	            this.data.bird.phase = ( this.data.bird.phase + ( Math.max( 0, this.data.bird.rotation.z ) + 0.1 )  ) % 62.83;
	            this.data.bird.geometry.vertices[ 5 ].y = this.data.bird.geometry.vertices[ 4 ].y = Math.sin( this.data.bird.phase ) * 5;

	        }

	    },

	    /**
	     * Called when entity pauses.
	     * Use to stop or remove any dynamic or background behavior such as events.
	     */
	    pause: function () { },

	    /**
	     * Called when entity resumes.
	     * Use to continue or add any dynamic or background behavior such as events.
	     */
	    play: function () { }
	});


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	/**
	 * Tube following a custom path.
	 *
	 * Usage:
	 *
	 * ```html
	 * <a-tube path="5 0 5, 5 0 -5, -5 0 -5" radius="0.5"></a-tube>
	 * ```
	 */
	var Primitive = module.exports.Primitive = {
	  defaultComponents: {
	    tube:           {},
	  },
	  mappings: {
	    path:           'tube.path',
	    segments:       'tube.segments',
	    radius:         'tube.radius',
	    radialSegments: 'tube.radialSegments',
	    closed:         'tube.closed'
	  }
	};

	var Component = module.exports.Component = {
	  schema: {
	    path:           {default: []},
	    segments:       {default: 64},
	    radius:         {default: 1},
	    radialSegments: {default: 8},
	    closed:         {default: false}
	  },

	  init: function () {
	    var el = this.el,
	        data = this.data,
	        material = el.components.material;

	    if (!data.path.length) {
	      console.error('[a-tube] `path` property expected but not found.');
	      return;
	    }

	    var curve = new THREE.CatmullRomCurve3(data.path.map(function (point) {
	      point = point.split(' ');
	      return new THREE.Vector3(Number(point[0]), Number(point[1]), Number(point[2]));
	    }));
	    var geometry = new THREE.TubeGeometry(
	      curve, data.segments, data.radius, data.radialSegments, data.closed
	    );

	    if (!material) {
	      material = {};
	      material.material = new THREE.MeshPhongMaterial();
	    }

	    this.mesh = new THREE.Mesh(geometry, material.material);
	    this.el.setObject3D('mesh', this.mesh);
	  },

	  remove: function () {
	    if (this.mesh) this.el.removeObject3D('mesh');
	  }
	};

	module.exports.registerAll = (function () {
	  var registered = false;
	  return function (AFRAME) {
	    if (registered) return;
	    AFRAME = AFRAME || window.AFRAME;
	    AFRAME.registerComponent('tube', Component);
	    AFRAME.registerPrimitive('a-tube', Primitive);
	    registered = true;
	  };
	}());


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	/**
	 * Created by brsmith on 4/15/17.
	 */
	var Boids = function() {

	    var vector = new THREE.Vector3(),
	        _acceleration, _width = 500, _height = 500, _depth = 200, _goal, _neighborhoodRadius = 100,
	        _maxSpeed = 4, _maxSteerForce = 0.1, _avoidWalls = false;

	    this.position = new THREE.Vector3();
	    this.velocity = new THREE.Vector3();
	    _acceleration = new THREE.Vector3();

	    this.setGoal = function ( target ) {

	        _goal = target;

	    };

	    this.setAvoidWalls = function ( value ) {

	        _avoidWalls = value;

	    };

	    this.setWorldSize = function ( width, height, depth ) {

	        _width = width;
	        _height = height;
	        _depth = depth;

	    };

	    this.run = function ( boids ) {

	        if ( _avoidWalls ) {

	            vector.set( - _width, this.position.y, this.position.z );
	            vector = this.avoid( vector );
	            vector.multiplyScalar( 5 );
	            _acceleration.add( vector );

	            vector.set( _width, this.position.y, this.position.z );
	            vector = this.avoid( vector );
	            vector.multiplyScalar( 5 );
	            _acceleration.add( vector );

	            vector.set( this.position.x, - _height, this.position.z );
	            vector = this.avoid( vector );
	            vector.multiplyScalar( 5 );
	            _acceleration.add( vector );

	            vector.set( this.position.x, _height, this.position.z );
	            vector = this.avoid( vector );
	            vector.multiplyScalar( 5 );
	            _acceleration.add( vector );

	            vector.set( this.position.x, this.position.y, - _depth );
	            vector = this.avoid( vector );
	            vector.multiplyScalar( 5 );
	            _acceleration.add( vector );

	            vector.set( this.position.x, this.position.y, _depth );
	            vector = this.avoid( vector );
	            vector.multiplyScalar( 5 );
	            _acceleration.add( vector );

	        }/* else {

	         this.checkBounds();

	         }
	         */

	        if ( Math.random() > 0.5 ) {

	            this.flock( boids );

	        }

	        this.move();

	    };

	    this.flock = function ( boids ) {

	        if ( _goal ) {

	            _acceleration.add( this.reach( _goal, 0.005 ) );

	        }

	        _acceleration.add( this.alignment( boids ) );
	        _acceleration.add( this.cohesion( boids ) );
	        _acceleration.add( this.separation( boids ) );

	    };

	    this.move = function () {

	        this.velocity.add( _acceleration );

	        var l = this.velocity.length();

	        if ( l > _maxSpeed ) {

	            this.velocity.divideScalar( l / _maxSpeed );

	        }

	        this.position.add( this.velocity );
	        _acceleration.set( 0, 0, 0 );

	    };

	    this.checkBounds = function () {

	        if ( this.position.x >   _width ) this.position.x = - _width;
	        if ( this.position.x < - _width ) this.position.x =   _width;
	        if ( this.position.y >   _height ) this.position.y = - _height;
	        if ( this.position.y < - _height ) this.position.y =  _height;
	        if ( this.position.z >  _depth ) this.position.z = - _depth;
	        if ( this.position.z < - _depth ) this.position.z =  _depth;

	    };

	    //

	    this.avoid = function ( target ) {

	        var steer = new THREE.Vector3();

	        steer.copy( this.position );
	        steer.sub( target );

	        steer.multiplyScalar( 1 / this.position.distanceToSquared( target ) );

	        return steer;

	    };

	    this.repulse = function ( target ) {

	        var distance = this.position.distanceTo( target );

	        if ( distance < 150 ) {

	            var steer = new THREE.Vector3();

	            steer.subVectors( this.position, target );
	            steer.multiplyScalar( 0.5 / distance );

	            _acceleration.add( steer );

	        }

	    };

	    this.reach = function ( target, amount ) {

	        var steer = new THREE.Vector3();

	        steer.subVectors( target, this.position );
	        steer.multiplyScalar( amount );

	        return steer;

	    };

	    this.alignment = function ( boids ) {

	        var boid, velSum = new THREE.Vector3(),
	            count = 0;

	        for ( var i = 0, il = boids.length; i < il; i++ ) {

	            if ( Math.random() > 0.6 ) continue;

	            boid = boids[ i ];

	            distance = boid.position.distanceTo( this.position );

	            if ( distance > 0 && distance <= _neighborhoodRadius ) {

	                velSum.add( boid.velocity );
	                count++;

	            }

	        }

	        if ( count > 0 ) {

	            velSum.divideScalar( count );

	            var l = velSum.length();

	            if ( l > _maxSteerForce ) {

	                velSum.divideScalar( l / _maxSteerForce );

	            }

	        }

	        return velSum;

	    };

	    this.cohesion = function ( boids ) {

	        var boid, distance,
	            posSum = new THREE.Vector3(),
	            steer = new THREE.Vector3(),
	            count = 0;

	        for ( var i = 0, il = boids.length; i < il; i ++ ) {

	            if ( Math.random() > 0.6 ) continue;

	            boid = boids[ i ];
	            distance = boid.position.distanceTo( this.position );

	            if ( distance > 0 && distance <= _neighborhoodRadius ) {

	                posSum.add( boid.position );
	                count++;

	            }

	        }

	        if ( count > 0 ) {

	            posSum.divideScalar( count );

	        }

	        steer.subVectors( posSum, this.position );

	        var l = steer.length();

	        if ( l > _maxSteerForce ) {

	            steer.divideScalar( l / _maxSteerForce );

	        }

	        return steer;

	    };

	    this.separation = function ( boids ) {

	        var boid, distance,
	            posSum = new THREE.Vector3(),
	            repulse = new THREE.Vector3();

	        for ( var i = 0, il = boids.length; i < il; i ++ ) {

	            if ( Math.random() > 0.6 ) continue;

	            boid = boids[ i ];
	            distance = boid.position.distanceTo( this.position );

	            if ( distance > 0 && distance <= _neighborhoodRadius ) {

	                repulse.subVectors( this.position, boid.position );
	                repulse.normalize();
	                repulse.divideScalar( distance );
	                posSum.add( repulse );

	            }

	        }

	        return posSum;

	    }

	}

	module.exports = Boids;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	/**
	 * Created by brsmith on 4/15/17.
	 */
	var Bird = function () {

	    var scope = this;

	    THREE.Geometry.call( this );

	    v(   5,   0,   0 );
	    v( - 5, - 2,   1 );
	    v( - 5,   0,   0 );
	    v( - 5, - 2, - 1 );

	    v(   0,   2, - 6 );
	    v(   0,   2,   6 );
	    v(   2,   0,   0 );
	    v( - 3,   0,   0 );

	    f3( 0, 2, 1 );
	    // f3( 0, 3, 2 );

	    f3( 4, 7, 6 );
	    f3( 5, 6, 7 );

	    this.computeFaceNormals();

	    function v( x, y, z ) {

	        scope.vertices.push( new THREE.Vector3( x, y, z ) );

	    }

	    function f3( a, b, c ) {

	        scope.faces.push( new THREE.Face3( a, b, c ) );

	    }

	}

	Bird.prototype = Object.create( THREE.Geometry.prototype );
	Bird.prototype.constructor = Bird;
	module.exports = Bird;

/***/ })
/******/ ]);