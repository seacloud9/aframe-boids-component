/* global AFRAME */

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

        var Boid = require('./vendor/boids.js');
        var Bird = require('./vendor/bird.js');

        this.data.boids = [];
        this.data.birdsEl = [];
        this.data.birds = [];

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
            cameraEl.setAttribute('id', 'boidCam'+i)
            cameraEl.setAttribute('camera', 'active: false');
            this.data.birds[ i ].add(cameraEl.object3D)
            this.data.cameras.push(cameraEl)
            this.data.bird.phase = Math.floor( Math.random() * 62.83 );
            //this.data.scene.add( this.data.bird );
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
