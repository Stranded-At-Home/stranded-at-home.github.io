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

  container = document.querySelector( '#scene-container' );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x000000 );

  createCamera();
  createControls();
  createLights();
  createMaterials();
  loadModels();
  createRenderer();

  renderer.setAnimationLoop( () => {

    update();
    render();

  } );

}

function createCamera() {

  camera = new THREE.PerspectiveCamera( 35, container.clientWidth / container.clientHeight, 0.1, 10000 );
  camera.position.set( 15, 44, 65);

}

function createControls() {

  controls = new THREE.OrbitControls( camera, container );

}


function createLights() {

  const ambientLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 5 );

  const mainLight = new THREE.DirectionalLight( 0xffffff, 5 );
  mainLight.position.set( 10, 10, 10 );

  scene.add( ambientLight, mainLight );

}



function loadModels() {

  const loader = new THREE.GLTFLoader();

  // A reusable function to set up the models. We're passing in a position parameter
  // so that they can be individually placed around the scene
  const onLoad = ( gltf, position, material ) => {

    const model = gltf.scene.children[ 0 ];
    model.position.copy( position );

  /* const animation = gltf.animations[ 0 ];

    const mixer = new THREE.AnimationMixer( model );
    mixers.push( mixer );

    const action = mixer.clipAction( animation );
    action.play();
    */
    //var newMesh = new THREE.MESH()

    let object = gltf.scene;
    object.position.copy(position);
    object.traverse((child) => {
                       if (child.isMesh) {
                       child.material = material; // a material created above
                  }
                 });
                   scene.add(object);

    //scene.add( model );

  };

  // the loader will report the loading progress to this function
  const onProgress = () => {};

  // the loader will send any error messages to this function, and we'll log
  // them to to console
  const onError = ( errorMessage ) => { console.log( errorMessage ); };

  // load the first model. Each model is loaded asynchronously,
  // so don't make any assumption about which one will finish loading first
  const pos3 = new THREE.Vector3(10, 30, -220);
  loader.load( 'Models/CHAIR.glb', gltf => onLoad( gltf, pos3, sofa), onProgress, onError );

  const parrotPosition = new THREE.Vector3( 0, 0, 0 );
  loader.load( 'Models/TABLE.glb', gltf => onLoad( gltf, parrotPosition, newStandard), onProgress, onError );

  const pos1 = new THREE.Vector3( 50, 93, 60);
  loader.load( 'Models/CUPFALL.glb', gltf => onLoad( gltf, pos1, cup), onProgress, onError );

//  const pos2 = new THREE.Vector3(100, 40, 200);
//  loader.load( 'Models/CHAIR.glb', gltf => onLoad( gltf, pos2, cup), onProgress, onError );

  //const cupPosition = new THREE.Vector3( 0, 0, 7 );
  //loader.load( 'models/CUP.glb', gltf => onLoad( gltf, cupPosition ), //onProgress, onError );

  //const storkPosition = new THREE.Vector3( 0, -2.5, -10 );
  //loader.load( 'models/Stork.glb', gltf => onLoad( gltf, storkPosition ), onProgress, onError );

}

function createRenderer() {

  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( container.clientWidth, container.clientHeight );

  renderer.setPixelRatio( window.devicePixelRatio );

  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;

  renderer.physicallyCorrectLights = true;



  container.appendChild( renderer.domElement );

}

function update() {

  const delta = clock.getDelta();

  // /*for ( const mixer of mixers ) {
  //
  //   mixer.update( delta );
  // }
  // */

}

//function render() {

  //console.log(camera.position);

  //renderer.render( scene, camera );

//}

function render() {
  requestAnimationFrame(render);
//  mesh.rotation.z += 0.090;
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(scene.children);
  console.log(intersects);
  for (var i = 0; i < intersects.length; i++) {
    intersects[i].object.material.color.set(0xff0000);
  }
  renderer.render(scene, camera);
  function createMaterials(){

       let diffuseColor = "#9E4300";
       newMaterial = new THREE.MeshBasicMaterial( { color: "#9E4300", skinning: true} );
       Standard = new THREE.MeshStandardMaterial( { color: "#9E4300", skinning: true} );

       var imgTexture = new THREE.TextureLoader().load( "textures/autumn.JPG" );
       				imgTexture.wrapS = imgTexture.wrapT = THREE.RepeatWrapping;
       				imgTexture.anisotropy = 16;

              var cuptext = new THREE.TextureLoader().load( "textures/STARBS.JPEG" );
              				cuptext.wrapS = cuptext.wrapT = THREE.RepeatWrapping;
              				cuptext.anisotropy = 16;

                      var sofatext = new THREE.TextureLoader().load( "textures/sofatext.JPEG" );
                      				sofatext.wrapS = sofatext.wrapT = THREE.RepeatWrapping;
                      				sofatext.anisotropy = 16;


       newStandard = new THREE.MeshStandardMaterial( {
  										map: imgTexture,
  										bumpMap: imgTexture,
  										bumpScale: 1,
  										//color: diffuseColor,
  										metalness: 0.5,
  										roughness: 0.1,
  										//envMap: imgTexture,
                      displacementmap: imgTexture,
                      displacementscale: 0.1,
                      skinning: true
  									} );

      cup = new THREE.MeshStandardMaterial( {
               				map: cuptext,
               				bumpMap: cuptext,
               				bumpScale: 1,
               										//color: diffuseColor,
               				metalness: 0.5,
               				roughness: 0.1,
               									//envMap: imgTexture,
                      displacementmap: cuptext,
                      displacementscale: 0.1,
                      skinning: true
               			} );

                    sofa = new THREE.MeshStandardMaterial( {
                             				map: sofatext,
                             				bumpMap: sofatext,
                             				bumpScale: 1,
                             										//color: diffuseColor,
                             				metalness: 0.5,
                             				roughness: 0.1,
                             									//envMap: imgTexture,
                                    displacementmap: sofatext,
                                    displacementscale: 0.1,
                                    skinning: true
                             			} );

  }

}

function onWindowResize() {

  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  renderer.setSize( container.clientWidth, container.clientHeight );

}

window.addEventListener( 'resize', onWindowResize );

init();
