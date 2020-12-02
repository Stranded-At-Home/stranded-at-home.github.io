// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;

//add material name here first
let newMaterial, Standard, newStandard;

const mixers = [];
const clock = new THREE.Clock();

function init() {


  			import * as THREE from '../build/three.module.js';

  			import Stats from './jsm/libs/stats.module.js';
  			import { GUI } from './jsm/libs/dat.gui.module.js';

  			import { OrbitControls } from './jsm/controls/OrbitControls.js';
  			import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
  			import { DecalGeometry } from './jsm/geometries/DecalGeometry.js';

  			var container = document.getElementById( 'container' );

  			var renderer, scene, camera, stats;
  			var mesh;
  			var raycaster;
  			var line;

  			var intersection = {
  				intersects: false,
  				point: new THREE.Vector3(),
  				normal: new THREE.Vector3()
  			};
  			var mouse = new THREE.Vector2();
  			var intersects = [];

  			var textureLoader = new THREE.TextureLoader();
  			var decalDiffuse = textureLoader.load( 'textures/decal/decal-diffuse.png' );
  			var decalNormal = textureLoader.load( 'textures/decal/decal-normal.jpg' );

  			var decalMaterial = new THREE.MeshPhongMaterial( {
  				specular: 0x444444,
  				map: decalDiffuse,
  				normalMap: decalNormal,
  				normalScale: new THREE.Vector2( 1, 1 ),
  				shininess: 30,
  				transparent: true,
  				depthTest: true,
  				depthWrite: false,
  				polygonOffset: true,
  				polygonOffsetFactor: - 4,
  				wireframe: false
  			} );

  			var decals = [];
  			var mouseHelper;
  			var position = new THREE.Vector3();
  			var orientation = new THREE.Euler();
  			var size = new THREE.Vector3( 10, 10, 10 );

  			var params = {
  				minScale: 10,
  				maxScale: 20,
  				rotate: true,
  				clear: function () {

  					removeDecals();

  				}
  			};

  			window.addEventListener( 'load', init );

  			function init() {

  				renderer = new THREE.WebGLRenderer( { antialias: true } );
  				renderer.setPixelRatio( window.devicePixelRatio );
  				renderer.setSize( window.innerWidth, window.innerHeight );
  				container.appendChild( renderer.domElement );

  				stats = new Stats();
  				container.appendChild( stats.dom );

  				scene = new THREE.Scene();

  				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
  				camera.position.z = 120;
  				camera.target = new THREE.Vector3();

  				var controls = new OrbitControls( camera, renderer.domElement );
  				controls.minDistance = 50;
  				controls.maxDistance = 200;

  				scene.add( new THREE.AmbientLight( 0x443333 ) );

  				var light = new THREE.DirectionalLight( 0xffddcc, 1 );
  				light.position.set( 1, 0.75, 0.5 );
  				scene.add( light );

  				var light = new THREE.DirectionalLight( 0xccccff, 1 );
  				light.position.set( - 1, 0.75, - 0.5 );
  				scene.add( light );

  				var geometry = new THREE.BufferGeometry();
  				geometry.setFromPoints( [ new THREE.Vector3(), new THREE.Vector3() ] );

  				line = new THREE.Line( geometry, new THREE.LineBasicMaterial() );
  				scene.add( line );

  				loadLeePerrySmith();

  				raycaster = new THREE.Raycaster();

  				mouseHelper = new THREE.Mesh( new THREE.BoxBufferGeometry( 1, 1, 10 ), new THREE.MeshNormalMaterial() );
  				mouseHelper.visible = false;
  				scene.add( mouseHelper );

  				window.addEventListener( 'resize', onWindowResize, false );

  				var moved = false;

  				controls.addEventListener( 'change', function () {

  					moved = true;

  				} );

  				window.addEventListener( 'pointerdown', function () {

  					moved = false;

  				}, false );

  				window.addEventListener( 'pointerup', function ( event ) {

  					if ( moved === false ) {

  						checkIntersection( event.clientX, event.clientY );

  						if ( intersection.intersects ) shoot();

  					}

  				} );

  				window.addEventListener( 'pointermove', onPointerMove );

  				function onPointerMove( event ) {

  					if ( event.isPrimary ) {

  						checkIntersection( event.clientX, event.clientY );

  					}

  				}

  				function checkIntersection( x, y ) {

  					if ( mesh === undefined ) return;

  					mouse.x = ( x / window.innerWidth ) * 2 - 1;
  					mouse.y = - ( y / window.innerHeight ) * 2 + 1;

  					raycaster.setFromCamera( mouse, camera );
  					raycaster.intersectObject( mesh, false, intersects );

  					if ( intersects.length > 0 ) {

  						var p = intersects[ 0 ].point;
  						mouseHelper.position.copy( p );
  						intersection.point.copy( p );

  						var n = intersects[ 0 ].face.normal.clone();
  						n.transformDirection( mesh.matrixWorld );
  						n.multiplyScalar( 10 );
  						n.add( intersects[ 0 ].point );

  						intersection.normal.copy( intersects[ 0 ].face.normal );
  						mouseHelper.lookAt( n );

  						var positions = line.geometry.attributes.position;
  						positions.setXYZ( 0, p.x, p.y, p.z );
  						positions.setXYZ( 1, n.x, n.y, n.z );
  						positions.needsUpdate = true;

  						intersection.intersects = true;

  						intersects.length = 0;

  					} else {

  						intersection.intersects = false;

  					}

  				}

  				var gui = new GUI();

  				gui.add( params, 'minScale', 1, 30 );
  				gui.add( params, 'maxScale', 1, 30 );
  				gui.add( params, 'rotate' );
  				gui.add( params, 'clear' );
  				gui.open();

  				onWindowResize();
  				animate();

  			}

  			function loadLeePerrySmith() {

  				var loader = new GLTFLoader();

  				loader.load( 'models/gltf/LeePerrySmith/LeePerrySmith.glb', function ( gltf ) {

  					mesh = gltf.scene.children[ 0 ];
  					mesh.material = new THREE.MeshPhongMaterial( {
  						specular: 0x111111,
  						map: textureLoader.load( 'models/gltf/LeePerrySmith/Map-COL.jpg' ),
  						specularMap: textureLoader.load( 'models/gltf/LeePerrySmith/Map-SPEC.jpg' ),
  						normalMap: textureLoader.load( 'models/gltf/LeePerrySmith/Infinite-Level_02_Tangent_SmoothUV.jpg' ),
  						shininess: 25
  					} );

  					scene.add( mesh );
  					mesh.scale.set( 10, 10, 10 );

  				} );

  			}

  			function shoot() {

  				position.copy( intersection.point );
  				orientation.copy( mouseHelper.rotation );

  				if ( params.rotate ) orientation.z = Math.random() * 2 * Math.PI;

  				var scale = params.minScale + Math.random() * ( params.maxScale - params.minScale );
  				size.set( scale, scale, scale );

  				var material = decalMaterial.clone();
  				material.color.setHex( Math.random() * 0xffffff );

  				var m = new THREE.Mesh( new DecalGeometry( mesh, position, orientation, size ), material );

  				decals.push( m );
  				scene.add( m );

  			}

  			function removeDecals() {

  				decals.forEach( function ( d ) {

  					scene.remove( d );

  				} );

  				decals = [];

  			}

  			function onWindowResize() {

  				camera.aspect = window.innerWidth / window.innerHeight;
  				camera.updateProjectionMatrix();

  				renderer.setSize( window.innerWidth, window.innerHeight );

  			}

  			function animate() {

  				requestAnimationFrame( animate );

  				renderer.render( scene, camera );

  				stats.update();

  			}

init();
