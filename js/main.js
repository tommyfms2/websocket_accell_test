
//////////////////////////////////////////////////////////////////////////////////
//		moving cube
//////////////////////////////////////////////////////////////////////////////////


// var cubeMoving = function(){
//   var scene = new THREE.Scene();
//   var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//
//   var renderer = new THREE.WebGLRenderer();
//   renderer.setSize( window.innerWidth, window.innerHeight );
//   document.body.appendChild( renderer.domElement );
//
//   var geometry = new THREE.BoxGeometry( 1, 1, 1 );
//   var material = new THREE.MeshNormalMaterial( { color: 0x00ff00 } );
//   var cube = new THREE.Mesh( geometry, material );
//
//   var cube2 = new THREE.Mesh( geometry, material );
//
//   scene.add( cube );
//   scene.add( cube2 );
//
//
//   camera.position.z = 10;
//   camera.position.y = 1;
//
//   cube.position.x = -2;
//   cube2.position.x = 2;
//
//   var accell_x = 0;
//   function animate() {
//     requestAnimationFrame( animate );
//     // cube.rotation.x += 0.1;
//     // cube2.rotation.y += 0.1;
//     accell_x += 0.02;
//     camera.position.x = 5*Math.sin(accell_x);
//
//
//     renderer.render( scene, camera );
//   }
//   animate();
// };




var pc_client = function(){

  var scene = new THREE.Scene();
  // var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100);
  var cameraR = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100);
  var cameraL = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100);

  var renderer = new THREE.WebGLRenderer();
  renderer.autoClear = false;
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  var geometry = new THREE.BoxGeometry( 2, 1, 3 );
  var material = new THREE.MeshNormalMaterial( {color: 0x00ff00 } );
  var cube = new THREE.Mesh( geometry, material );
  // var cube2 = new THREE.Mesh( geometry, material );

  scene.add( cube );
  // scene.add( cube2 );

  // camera.position.z = 10;
  // camera.position.y = 1;

  var distPCtoSM = 30
  var distD = 30;
  var distH = 2;
  var accell_d = 0;

  var mac_window_width = 28.6
  var mac_window_height = 17.9

  cameraR.position.x = 1;
  cameraR.position.y = distH;
  cameraR.position.z = distD;
  cameraL.position.x = -1;
  cameraL.position.y = distH;
  cameraL.position.z = distD;

  // cube.position.x = -2;
  // cube2.position.x = 2;
  var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;

  var rx = 0;
  var ry = 0;
  var rz = 0;

  cameraL.rotation.order = "ZYX";
  cameraR.rotation.order = "ZYX";
  function animate(){
    requestAnimationFrame( animate );
    cube.rotation.x = rx;
    cube.rotation.y = ry;
    cube.rotation.z = rz;

    size_ratio = 1+distPCtoSM/distD
    cube.scale.set(size_ratio, size_ratio, size_ratio)

    // accell_d += 0.02;
    distD += Math.sin(accell_d)/10.0;
    // console.log(distD)
    cameraR.position.z = distD
    cameraL.position.z = distD

    radiansY = Math.atan2(1, distD)
    cameraR.rotation.y = radiansY
    cameraL.rotation.y = -radiansY

    radiansX = Math.atan2(distH, distD)
    cameraR.rotation.x = radiansX
    cameraL.rotation.x = radiansX
    // cube2.rotation.x = rx;
    // cube2.rotation.y = ry;
    // cube2.rotation.z = rz;
    // renderer.render( scene, camera );
    cameraL.aspect = 0.5 * SCREEN_WIDTH / SCREEN_HEIGHT;
    cameraR.aspect = 0.5 * SCREEN_WIDTH / SCREEN_HEIGHT;
    cameraR.updateProjectionMatrix();
    cameraL.updateProjectionMatrix();

    renderer.setViewport( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
    renderer.clear();

    //左画面
    renderer.setViewport( 1, 1,   0.5 * SCREEN_WIDTH - 2, SCREEN_HEIGHT - 2 );
    renderer.render( scene, cameraR );

    //右画面
    renderer.setViewport( 0.5 * SCREEN_WIDTH + 1, 1,   0.5 * SCREEN_WIDTH - 2, SCREEN_HEIGHT - 2 );
    renderer.render( scene, cameraL );

  }
  animate();

  var socket = io.connect();
  socket.emit("client_to_server", {value : 'pc client has connected server'});
  socket.on("server_to_client", function(data){
    console.log(data.value)
    var ss = data.value.split(':')

    rx = (parseFloat(ss[2])+180)/360*(Math.PI*2)
    // ry = (parseFloat(ss[1]))/360*(Math.PI*2)
    rz = (parseFloat(ss[3])+180)/360*(Math.PI*2)
  });
}

var smart_client = function(){
  var socket = io.connect();
  socket.emit("client_to_server", {value : 'smartphone client has connected server'});

  DeviceOrientation = Event;

  window.addEventListener("deviceorientation", handleOrientation, true);
  function handleOrientation(event){
    const beta = event.beta;
    const gamma = event.gamma;
    const alpha = event.alpha;
    orientStr = 'e:'+alpha+':'+beta+":"+gamma
    socket.emit("client_to_server", {value : orientStr});
  }

  // window.addEventListener("devicemotion", handleMotion, true);
  function handleMotion(event){
    var x = event.accelerationIncludingGravity.x; //傾きX
    var y = event.accelerationIncludingGravity.y; //傾きY
    var z = event.accelerationIncludingGravity.z; //傾きZ
    motionstr = 'e:'+x+':'+y+':'+z;
    socket.emit("client_to_server", {value: motionstr});
  }
}


$(function(){
  // 箱を揺らすだけ


  $('.env_button').on('click', function(){
    // console.log($(this).attr('value'));
    $('div#env_radio').hide();
    if ($(this).attr('value') == "PC"){
      console.log('PC');
      pc_client();
    }
    else if($(this).attr('value') == "Smartphone"){
      console.log('Smartphone');
      smart_client();
    }
  });

});
