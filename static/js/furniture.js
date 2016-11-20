/*
Aidan McLaughlin
Contribution to CS307
Some furniture to use in scenes :)

Usage:
```
var Furniture = new aidanFurniture();
var bed = Furniture.Bed(); // Creates bed with defaults;
```
That's it! Each function returns an Object3D instance and has defaults for all values.
All of the arguments to individual functions affect dimenions, but what if you want to change colors?

Initialization of the aidanFurniture 'object' handles the creation of all materials to be
used, so if you'd like to edit anything about one of those materials, you can access them
using the following names:
roomMaterial, lightMaterial, mattressMaterial, frameMaterial, radioBodyMaterial, speakerCoverMaterial,
tunerMaterial, tableTopMaterial, legMaterial, fridgeMaterial, handleMaterial

In code it looks like this:
```
var Furniture = new aidanFurniture();

Furniture.roomMaterial.color = 0x555555;
var room = Furniture.Room();
```

You may also change the normal map of the bed using the `loadBedTexture` function:
```
var Furniture = new aidanFurniture();

Furniture.loadBedNormalMap('PATH_TO_NORMALMAP.PNG');
var bed = Furniture.Bed();
```
*/


var aidanFurniture = function() {
  // Material Setup
  // Used in Room
  this.roomMaterial = new THREE.MeshPhongMaterial({color: 0xf7e0a2, shininess: 0});
  this.lightMaterial = this.roomMaterial.clone();
  this.lightMaterial.side = THREE.FrontSide;

  // Used in Bed
  this.frameMaterial = this.lightMaterial.clone();
  var self = this;
  this.mattressMaterial = new THREE.MeshPhongMaterial({color: 0xf5e5c0});
  // Use to update bed texture
  this.loadBedNormalMap = function(texturePath) {
    TW.loadTextures(
      [texturePath],
      function(textures) {
        self.mattressMaterial.normalMap = textures[0];
        self.mattressMaterial.normalScale.set(3,5);
        self.mattressMaterial.needsUpdate = true;
      });
  };
  // Load texture
  this.loadBedNormalMap('static/images/cloth-normal-map.png');

  // Used in Radio
  this.radioBodyMaterial = new THREE.MeshPhongMaterial({color: 0xe06f4a});
  this.speakerCoverMaterial = new THREE.MeshPhongMaterial({color: 0x666666});
  this.tunerScreenMaterial = new THREE.MeshPhongMaterial({color: 0xf7e0a2, shininess: 1});

  // Used in Table
  this.tableTopMaterial = new THREE.MeshPhongMaterial({color: 0xe89e57});
  this.legMaterial = this.roomMaterial.clone();

  // Used in Chair
  this.chairMaterial = this.radioBodyMaterial.clone();

  // Used in Fridge
  this.fridgeMaterial = this.mattressMaterial.clone();
  this.handleMaterial = this.fridgeMaterial.clone();
}

aidanFurniture.prototype.Room = function(width, height, length) {
  /*
  Takes in a width, height and length. Returns an Object3D.
  The center of the object is the center of the floor of the room.
  */

  // Defaults
  var width = (width) ? width : 5;
  var height = (height) ? height : 3;
  var length = (length) ? length : 3;

  var room = new THREE.Object3D();

  var roomGeom = new THREE.BoxGeometry(width, height, length);
  var roomWalls = new THREE.Mesh(roomGeom, this.roomMaterial);
  roomWalls.material.side = THREE.BackSide;
  roomWalls.position.setY(height/2);
  room.add(roomWalls);

  var topLight = new THREE.PointLight( 0xffffff, 0.6);
  topLight.position.setY(height/2);
  room.add(topLight);

  var ceilingLight = new THREE.Object3D();
  var lightCoverGeom = new THREE.CylinderGeometry(width/20,
                                                  width/20,
                                                  height/30,
                                                  20);
  var lightCover = new THREE.Mesh(lightCoverGeom, this.lightMaterial);
  var lightFrameGeom = new THREE.SphereGeometry(width/19, 20, 20);
  var lightFrame = new THREE.Mesh(lightFrameGeom, this.lightMaterial);
  lightCover.position.setY(-height/(2*30));
  lightFrame.scale.setY(0.1);
  ceilingLight.add(lightCover);
  ceilingLight.add(lightFrame);
  ceilingLight.position.setY(height);
  room.add(ceilingLight);

  return room;
}

aidanFurniture.prototype.Bed = function(width, height, length) {
  /*
  Takes in a width, height and length. Returns an Object3D.
  The center of the object is the center of the bottom of the frame.
  */

  // Defaults
  var width = (width) ? width : 1.5;
  var height = (height) ? height : 0.2;
  var length = (length) ? length : 2.5;
  
  var bed = new THREE.Object3D();

  var topMattress = new THREE.Mesh(
    new THREE.BoxGeometry( width, height, length),
    this.mattressMaterial);
  topMattress.position.setY(height * 2.5);
  bed.add(topMattress);
  
  var middleMattress = topMattress.clone();
  middleMattress.position.setY(height * 1.5);
  bed.add(middleMattress);

  var frame = new THREE.Mesh(
    new THREE.BoxGeometry( width, height, length),
    this.frameMaterial);
  frame.position.setY(height * 0.5);
  bed.add(frame);

  return bed;
}

aidanFurniture.prototype.Radio = function(width, height, length, antennaRadius, antennaLength) {
  /*
  Takes in a width, height and length for the body of the radio. You can then also provide
  a radius and length for its antenna, if unchanged it may not look right with differently
  sized radios.
  Returns an Object3D.
  The center of the object is the center of the bottom of the radio body.
  */

  // Defaults
  var width = (width) ? width : 0.3;
  var height = (height) ? height : 0.2;
  var length = (length) ? length : 0.05;
  var antennaRadius = (antennaRadius) ? antennaRadius : 0.005;
  var antennaLength = (antennaLength) ? antennaLength : 0.25;

  var radio = new THREE.Object3D();

  // Create body of radio
  var bodyGeom = new THREE.BoxGeometry(width,
                                       height,
                                       length);
  var body = new THREE.Mesh(bodyGeom, this.radioBodyMaterial);
  body.position.setY(height/2);
  radio.add(body);

  // Radio antenna
  var antennaGeom = new THREE.CylinderGeometry(antennaRadius,
                                               antennaRadius,
                                               antennaLength);
  var antenna = new THREE.Mesh(antennaGeom, this.radioBodyMaterial);
  antenna.position.setX(-width/8);
  antenna.position.setY(height + antennaLength/3);
  antenna.rotation.x = Math.PI/8;
  antenna.rotation.y = Math.PI/8;
  antenna.rotation.z = -Math.PI/4;
  radio.add(antenna);

  // Start speaker cover
  // Places two sets of cylinders that are perpindicular to each other.
  // The intersections create what look like the holes in a speaker cover.
  var cover = new THREE.Object3D();
  var coverPieceVertGeom = new THREE.CylinderGeometry(width/60,
                                                  width/60,
                                                  height);
  var coverPieceVert = new THREE.Mesh(coverPieceVertGeom, this.speakerCoverMaterial);
  for (var i=0; i<width/2; i += width/25) {
    var temp = coverPieceVert.clone()
    temp.position.setX(i);
    cover.add(temp);
  }

  var coverPieceHorizGeom = new THREE.CylinderGeometry(width/60,
                                                  width/60,
                                                  width/2);
  var coverPieceHoriz = new THREE.Mesh(coverPieceHorizGeom, this.speakerCoverMaterial);
  coverPieceHoriz.rotation.z = -Math.PI/2;
  coverPieceHoriz.position.setX(width/4);
  for (var i=0; i<height; i += height/25) {
    var temp = coverPieceHoriz.clone()
    temp.position.setY(i - height/2);
    cover.add(temp);
  }
  cover.position.setX(-width/2);
  cover.position.setY(height/2);
  cover.position.setZ(length/2);
  radio.add(cover);
  // End speaker cover

  // Tuner screen on front
  var tunerGeom = new THREE.BoxGeometry(width/3, height/6, 0.01);
  var tuner = new THREE.Mesh(tunerGeom, this.tunerScreenMaterial);
  tuner.position.set(width/4,
                     3 * height/4,
                     length/2);
  radio.add(tuner);

  // Front button
  var onButtonGeom = new THREE.CylinderGeometry(width/16, width/16, 0.05);
  var onButton = new THREE.Mesh(onButtonGeom, this.radioBodyMaterial);
  onButton.position.set(width/6,
                        height/2,
                        length/2);
  onButton.rotation.x = Math.PI/2;
  radio.add(onButton);

  return radio;
}

aidanFurniture.prototype.Table = function(width, height, length, thickness, legRadius, bottomLegRadius) {
  /*
  Takes in a width, height and length for the table (this bounding box holds all components of the table).
  The thickness is referring to the thickness of the top of the table, and you can additionally specify
  the radius of the legs. If the `bottomLegRadius` is not specified it is automatically the same as `legRadius`.
  Returns an Object3D.
  The center of the object is the floor beneath the center of the tabletop.
  */

  // Defaults
  var width = (width) ? width : 1.15;
  var height = (height) ? height : 0.9;
  var length = (length) ? length : 1.5;
  var thickness = (thickness) ? thickness : 0.08;
  var legRadius = (legRadius) ? legRadius : 0.03;
  var bottomLegRadius = (bottomLegRadius) ? bottomLegRadius : legRadius;


  var table = new THREE.Object3D();

  // Table top //
  var tableTopGeom = new THREE.BoxGeometry(width,
                                           thickness,
                                           length);
  var tableTop = new THREE.Mesh(tableTopGeom, this.tableTopMaterial);
  tableTop.position.setY(height - thickness/2);
  table.add(tableTop);

  // Table legs
  var legGeom = new THREE.CylinderGeometry(legRadius,
                                           bottomLegRadius,
                                           height - thickness,
                                           20);
  var leg = new THREE.Mesh(legGeom, this.legMaterial);
  leg.position.setY((height - thickness)/2);

  var farLeftLeg = leg.clone();
  farLeftLeg.position.setX(-width/2 + legRadius)
  farLeftLeg.position.setZ(-length/2 + legRadius);

  var farRightLeg = leg.clone();
  farRightLeg.position.setX(width/2 - legRadius);
  farRightLeg.position.setZ(-length/2 + legRadius);

  var nearRightLeg = leg.clone();
  nearRightLeg.position.setX(width/2 - legRadius);
  nearRightLeg.position.setZ(length/2 - legRadius);

  var nearLeftLeg = leg.clone();
  nearLeftLeg.position.setX(-width/2 + legRadius)
  nearLeftLeg.position.setZ(length/2 - legRadius);

  table.add(farLeftLeg);
  table.add(farRightLeg);
  table.add(nearRightLeg);
  table.add(nearLeftLeg);

  return table;
}

aidanFurniture.prototype.Fridge = function(width, height, length) {
  /*
  Takes in a width, height and length for the fridge. This includes the doors to the fridge
  but not the handles, which jut out roughly another fifth of the defined length.
  Returns an Object3D.
  The center of the object is the center of the bottom of the fridge (including doors);
  */

  // Defaults
  var width = (width) ? width : 1;
  var height = (height) ? height : 2.5;
  var length = (length) ? length : 0.8;

  var fridge = new THREE.Object3D();

  var mainBoxGeom = new THREE.BoxGeometry(width,
                                          height,
                                          4*length/5);
  var mainBox = new THREE.Mesh(mainBoxGeom, this.fridgeMaterial);
  mainBox.position.setY(height/2);
  fridge.add(mainBox);

  var topDoor = new THREE.Object3D();
  var topDoorWallGeom = new THREE.BoxGeometry(width,
                                          height/3.5, // 3.5 is arbitrary
                                          length/5 - length/25);  // a fifth of the overall size - the offset
  var topDoorWall = new THREE.Mesh(topDoorWallGeom, this.fridgeMaterial);
  topDoorWall.position.setY(height - height/(3.5*2));

  var topDoorHandleCurve =new THREE.CubicBezierCurve3(
    new THREE.Vector3(0, height/3.5 - height/25, 0),
    new THREE.Vector3(length/8, height/8, 0),
    new THREE.Vector3(length/4, height/25, 0),
    new THREE.Vector3(0, height/25, 0));
  var topDoorHandleGeom = new THREE.TubeGeometry( topDoorHandleCurve, 20, 0.025, 8, false );
  var topDoorHandle = new THREE.Mesh( topDoorHandleGeom, this.handleMaterial );
  topDoorHandle.position.set(-width/2 + 0.08, // slight offset from left of wall
                              height - (height/3.5),
                              0.05); // Slight offset for end of curve
  topDoorHandle.rotation.y = -Math.PI/2;
  
  topDoor.add(topDoorWall);
  topDoor.add(topDoorHandle);
  topDoor.position.setZ(length/2 + length/25); // length/20 is for a slight offset from the main box of the fridge
  
  fridge.add(topDoor);

  var bottomDoor = new THREE.Object3D();
  var bottomDoorWallGeom = new THREE.BoxGeometry(width,
                                                 height/1.5, // 1.5 is also arbitrary
                                                 length/5 - length/25);  // a fifth of the overall size - the offset
  var bottomDoorWall = new THREE.Mesh(bottomDoorWallGeom, this.fridgeMaterial);
  bottomDoorWall.position.setY(height/(1.5*2));

  var bottomDoorHandleGeom = topDoorHandleGeom.clone();
  var bottomDoorHandle = new THREE.Mesh( bottomDoorHandleGeom, this.handleMaterial );
  bottomDoorHandle.position.set(-width/2 + 0.08,
                              height/1.5,
                              0.05);
  bottomDoorHandle.rotation.z = Math.PI;
  bottomDoorHandle.rotation.y = Math.PI/2;

  bottomDoor.add(bottomDoorWall);
  bottomDoor.add(bottomDoorHandle);
  bottomDoor.position.setZ(length/2 + length/25);

  fridge.add(bottomDoor);

  return fridge;
}

aidanFurniture.prototype.Chair = function(width, height) {
  /*
  Takes in a width and height for the chair however this does not quite bound
  every component. The bars that hold the chair together add 1/10th of the width
  to both sides and the back of the chair adds 1/40th of the width to the rear 
  of the object.
  Returns an Object3D
  The center of the object is on the floor directly beneath the center of the seat cube.
  */

  // Defaults
  var width = (width) ? width : 0.5;
  var height = (height) ? height : 1.5;

  var chair = new THREE.Object3D();

  var chairSurfaceGeom = new THREE.BoxGeometry(width, width, height/20);
  var chairSurface = new THREE.Mesh(chairSurfaceGeom, this.chairMaterial);

  var seat = chairSurface.clone();
  seat.position.setY(3 * height/8);
  seat.rotation.x = Math.PI/2;

  var back = chairSurface.clone()
  back.position.setY(5 * height/8);
  back.position.setZ(-width/2);

  var longLegGeom = new THREE.CylinderGeometry(width/20,
                                               width/20,
                                               2 * height/3);
  var longLeg = new THREE.Mesh(longLegGeom, this.chairMaterial);
  longLeg.rotation.x = -3 * Math.PI/16;
  longLeg.position.setY(height/4);

  var leftLongLeg = longLeg.clone();
  leftLongLeg.position.setX(-width/2 - width/20);
  var rightLongLeg = longLeg.clone();
  rightLongLeg.position.setX(width/2 + width/20);

  var smallLeg = longLeg.clone();
  smallLeg.scale.setY(3/4);
  smallLeg.position.setY(height/5);
  smallLeg.rotation.x = 3 * Math.PI/16;

  var leftShortLeg = smallLeg.clone();
  leftShortLeg.position.setX(-width/2 - width/20);

  var rightShortLeg = smallLeg.clone();
  rightShortLeg.position.setX(width/2 + width/20);

  chair.add(seat);
  chair.add(back);
  chair.add(leftLongLeg);
  chair.add(leftShortLeg);
  chair.add(rightLongLeg);
  chair.add(rightShortLeg);

  return chair;
};