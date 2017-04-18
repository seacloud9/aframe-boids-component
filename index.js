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
        this.scene  = this.el.sceneEl.object3D;
        var Boid = require('./vendor/boids.js');
        var Bird = require('./vendor/bird.js');

        this.data.boids = [];
        this.data.birds = [];

        for ( var i = 0; i < 200; i ++ ) {

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
            this.data.birds[ i ].add(new THREE.PerspectiveCamera( 45, this.data.SCREEN_WIDTH  / this.data.SCREEN_HEIGHT , 1, 1000 ))
            this.data.bird.phase = Math.floor( Math.random() * 62.83 );
            this.scene.add( this.data.bird );
        }


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
