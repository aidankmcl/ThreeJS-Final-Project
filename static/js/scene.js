var Furniture = new aidanFurniture();

function createScene(params, roomNum) {
  var newScene = new THREE.Object3D();
  
  var room = Furniture.Room(params.roomWidth,
                            params.roomHeight,
                            params.roomLength);
  newScene.add(room);

  var topLight = new THREE.PointLight( 0xffffff, 0.5);
  topLight.layers.set(roomNum);
  topLight.position.y = 9 * params.roomHeight/10;
  newScene.add(topLight);

  var bed = Furniture.Bed(params.bedWidth, params.bedHeight, params.bedLength);
  bed.layers.set(roomNum);
  bed.position.setX(params.roomWidth/2 - params.bedWidth/2);
  bed.position.setZ(-params.roomLength/2 + params.bedLength/2);
  newScene.add(bed);

  var table = Furniture.Table(params.tableWidth, params.tableHeight, params.tableLength);
  table.layers.set(roomNum);
  table.position.setX(-params.roomWidth/2 + params.tableWidth/2 + 0.05);
  table.position.setZ(params.roomLength/2 - params.tableLength/2 - 0.25);
  newScene.add(table);

  var radio = Furniture.Radio(params.radioWidth,
                              params.radioHeight,
                              params.radioLength,
                              params.radioAntRadius,
                              params.radioAntLength);
  radio.layers.set(roomNum);
  radio.position.set(-6*params.roomWidth/16,
                     params.tableHeight,
                     params.roomLength/4);
  radio.rotation.y = 5 * Math.PI/8;
  newScene.add(radio);

  var fridge = Furniture.Fridge(params.fridgeWidth, params.fridgeHeight, params.fridgeLength);
  fridge.layers.set(roomNum);
  fridge.position.setX(-params.roomWidth/2 + params.fridgeLength/2);
  fridge.position.setZ(-params.roomLength/2 + params.fridgeWidth/2 + 0.1);
  fridge.rotation.y = Math.PI / 2
  newScene.add(fridge);

  var chair = Furniture.Chair(params.chairWidth, params.chairHeight);
  chair.layers.set(roomNum);
  chair.rotation.y = -Math.PI/2;
  chair.position.set(-params.roomWidth/2 + 3*params.tableWidth/4 + params.chairWidth,
                   0,
                   params.roomLength/2 - params.tableLength/2);
  newScene.add(chair);

  newScene.add(makeRobot(params));

  return newScene;
}

function makeRobot(params) {
  var robot = new THREE.Object3D();

  // The 0.2 is so that connection is made with the side pieces
  var robotBodyTopGeom = new THREE.BoxGeometry( params.roomWidth + 0.2, params.roomHeight/3, params.roomLength );
  var robotBodyTop = new THREE.Mesh( robotBodyTopGeom, Furniture.radioBodyMaterial );
  var robotBodyBottom = robotBodyTop.clone();

  // 0.005 to avoid overlap
  robotBodyTop.position.setY( 7 * params.roomHeight/6  + 0.005 );
  robotBodyBottom.position.setY( -params.roomHeight/6 - 0.005 );
  robot.add(robotBodyTop);
  robot.add(robotBodyBottom);

  var robotSideGeom = new THREE.BoxGeometry(params.roomWidth/6, 5 * params.roomHeight/3, params.roomLength + 0.2);
  var robotSideLeft = new THREE.Mesh( robotSideGeom, Furniture.radioBodyMaterial );
  robotSideLeft.position.setY( params.roomHeight/2 );
  robotSideLeft.position.setZ( -0.1 );
  var robotSideRight = robotSideLeft.clone();
  
  // 0.01 is to avoid overlap
  robotSideLeft.position.setX( -7 * params.roomWidth/12  - 0.05 );
  robotSideRight.position.setX( 7 * params.roomWidth/12 + 0.05 );
  robot.add( robotSideLeft );
  robot.add( robotSideRight );

  var robotBackGeom = new THREE.BoxGeometry( 4 * params.roomWidth/3, 5 * params.roomHeight/3 , 0.15 );
  var robotBack = new THREE.Mesh( robotBackGeom, Furniture.radioBodyMaterial );
  robotBack.position.setY( params.roomHeight/2 );
  robotBack.position.setZ( -params.roomLength/2 - 0.15 );
  robot.add( robotBack );

  var bottom = new THREE.Object3D();
  bottom.position.setY( -params.roomHeight/2 );

  var thrusterGeometry = new THREE.ConeGeometry( params.roomWidth/4, params.roomHeight/3, 32 );
  var thruster = new THREE.Mesh( thrusterGeometry, Furniture.radioBodyMaterial );
  thruster.rotation.x = Math.PI;
  bottom.add( thruster );

  var tori = new THREE.Object3D();  // for animating later
  var toriMaterial = new THREE.MeshPhongMaterial({ color: 0x5CC0FF, shininess: 1 });
  tori.name = "tori";
  var ringGeom = new THREE.TorusGeometry( params.roomWidth/4, 0.1, 16, 100 );
  var topTorus = new THREE.Mesh( ringGeom, toriMaterial );
  topTorus.rotation.x = Math.PI/2;
  tori.add( topTorus );

  var middleTorus = topTorus.clone();
  topTorus.material = toriMaterial.clone();
  middleTorus.position.setY( -params.roomHeight/4 );
  middleTorus.scale.set(0.8);
  tori.add( middleTorus );

  var bottomTorus = topTorus.clone();
  bottomTorus.material = toriMaterial.clone();
  bottomTorus.position.setY( -params.roomHeight/2 );
  bottomTorus.scale.set(0.2);
  tori.add( bottomTorus );

  bottom.add( tori );
  robot.add( bottom );

  return robot;
}

var canvas = createCanvas();
var scenes = [],
    renderer,
    camera;

function createCanvas() {
  var canvas = document.getElementById("canvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "canvas",
    document.body.appendChild(canvas)
  }
  canvas.width = window.innerWidth,
  canvas.height = window.innerHeight
  return canvas;
}

function sceneSetup(params) {
  var scene = new THREE.Scene();

  for (var i=0.2, j=0; i<=625; i *= 5, j++) {
    var temp = createScene(params, j);

    temp.scale.set(i,i,i);
    temp.position.setZ( i * params.roomLength/3);
    temp.position.setY( i * -params.roomLength/2 );
    temp.rotation.y = params.playerRotation;

    scene.add(temp);
  }

  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  return scene;
}

var Creative = function(params) {
  // Create the renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvas
  });
  
  renderer.setSize(canvas.clientWidth,canvas.clientHeight);
  renderer.setClearColor(0xffffff, 1);
  renderer.autoClear = false;

  scene = sceneSetup(params, sceneNum);

  startScene = scene.children[4];
  startPoint = getFrontPoint(startScene, params);

  endScene = scene.children[5];
  endPoint = getFrontPoint(endScene, params);

  camera = new THREE.PerspectiveCamera(75, 
                                       canvas.clientWidth / canvas.clientHeight, 
                                       0.1, 
                                       3000);
  camera.position.copy(startPoint);
  cameraPath = calculateCameraPath(startPoint, endPoint);

  return {renderer: renderer, camera: camera}
}

/* params for the scene */
var params = {
  roomWidth: 5,
  roomHeight: 3,
  roomLength: 3,
  lightDistance: 1,
  
  bedWidth: 1.5,
  bedHeight: 0.2,
  bedLength: 2.5,
  
  tableWidth: 1.15,
  tableHeight: 0.9,
  tableLength: 1.5,
  tableThickness: 0.08,
  tableLegRadius: 0.03,

  radioWidth: 0.3,
  radioHeight: 0.2,
  radioLength: 0.05,
  radioAntLength: 0.25,
  radioAntRadius: 0.005,
  
  fridgeWidth: 1,
  fridgeHeight: 2.5,
  fridgeLength: 0.7,

  chairWidth: 0.5,
  chairHeight: 1.5,

  playerRotation: 0,
  cameraInterval: 10000,
}

function applySceneChange(miniScene) {
  if (params.playerRight) {
    miniScene.rotation.y += Math.PI/128;
  }
  if (params.playerLeft) {
    miniScene.rotation.y -= Math.PI/128;
  }

  if (params.playerForward) {
    miniScene.position.z += Math.cos(miniScene.rotation.y) * 10;
    miniScene.position.x += Math.sin(miniScene.rotation.y) * 10;
  } 
  if (params.playerBackward) {
    miniScene.position.z -= Math.cos(miniScene.rotation.y) * 10;
    miniScene.position.x -= Math.sin(miniScene.rotation.y) * 10;
  }

  if (params.playerUp) {
    miniScene.position.y += 10;
  }
  if (params.playerDown) {
    miniScene.position.y -= 10;
  }

  var tori = miniScene.getObjectByName( "tori", true );
  for (var i=0; i<tori.children.length; i++) {
    tori.children[i].position.setY(tori.children[i].position.y - 0.015);

    tori.children[i].scale.x -= 0.005;
    tori.children[i].scale.y -= 0.005;
    tori.children[i].scale.z -= 0.005;

    tori.children[i].material.transparent = true;
    tori.children[i].material.opacity -= 0.005;
    if  (tori.children[i].position.y < -4 * params.roomHeight/5) {
      console.log(tori.children[i]);
      tori.children[i].position.setY( 0 );
      tori.children[i].scale.set(1, 1, 1);
      tori.children[i].material.opacity = 1;
    }
  }
}

function calculateCameraPath(startPoint, endPoint) {
  var outDirection = startPoint.clone()
    .add(startPoint.clone());
  var inDirection = endPoint.clone()
    .sub(endPoint.clone().divideScalar(3));
  var final = endPoint.clone()
    .add(endPoint.clone().sub(inDirection).normalize());

  return new THREE.CubicBezierCurve3(startPoint,
                                     outDirection,
                                     inDirection,
                                     final);
}

// For updating scenes
var sceneNum = 0;
var cameraPath;

function render() {
  requestAnimationFrame(render);
  // camera.position.z += 0.4 + (new Date().getTime() - counter) * 0.0002;
  var point = (new Date().getTime() - counter) * 2 /params.cameraInterval;

  camera.position.copy(cameraPath.getPointAt(point));
  camera.lookAt(cameraPath.getPointAt(point - 0.01));

  for (var i=0; i<scene.children.length - 2; i++) {
    applySceneChange(scene.children[i]);
  }
  
  if ( camera.position.distanceTo(endPoint) <= 5 ) {
    counter = new Date().getTime();

    startScene = scene.children[4];
    endScene = scene.children[5];

    startPoint = getFrontPoint(startScene, params);
    endPoint = getFrontPoint(endScene, params);

    cameraPath = calculateCameraPath(startPoint, endPoint);
  } else {
    // console.log(camera.position.distanceTo(endPoint));
  }

  renderer.render( scene, camera );
}

function getFrontPoint(tempScene, params) {
  var sphere = new THREE.SphereGeometry(0.01, 32, 32);
  var material = new THREE.MeshBasicMaterial( {color: 0xb05ecc} );
  var frontPoint = new THREE.Mesh( sphere, material );

  frontPoint.position.setY( params.roomHeight/2 );
  frontPoint.position.setZ( params.roomLength/2 );

  tempScene.add(frontPoint);

  frontPoint.visible = false;

  tempScene.updateMatrixWorld();
  var pos = new THREE.Vector3();

  return pos.setFromMatrixPosition(frontPoint.matrixWorld);
}

var counter;
var startScene, startPoint;
var endScene, endPoint;
/* Set up the renderer */
window.onload = function() {
  var model = new Creative(params);
  counter = new Date().getTime();

  render();
}

function toggleKeys(event) {
  const keyName = event.key;
  var state = (event.type == "keydown") ? true : false;

  switch (keyName) {
    case 'w':
      params.playerForward = state;
      break;
    case 's':
      params.playerBackward = state;
      break;
    case 'a':
      params.playerLeft = state;
      break;
    case 'd':
      params.playerRight = state;
      break;
    case 'e':
      params.playerUp = state;
      break;
    case 'q':
      params.playerDown = state;
      break;
  }
}

document.addEventListener('keydown', toggleKeys);
document.addEventListener('keyup', toggleKeys);
