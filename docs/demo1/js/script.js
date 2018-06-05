// Connecting to ROS
// -----------------
var ros = new ROSLIB.Ros();

// If there is an error on the backend, an 'error' emit will be emitted.
ros.on('error', function(error) {
  document.getElementById('connecting').style.display = 'none';
  document.getElementById('connected').style.display = 'none';
  document.getElementById('closed').style.display = 'none';
  document.getElementById('error').style.display = 'inline';
  console.log(error);
});

// Find out exactly when we made a connection.
ros.on('connection', function() {
  console.log('Connection made!');
  document.getElementById('connecting').style.display = 'none';
  document.getElementById('error').style.display = 'none';
  document.getElementById('closed').style.display = 'none';
  document.getElementById('connected').style.display = 'inline';
  autoconnect = clearInterval(autoconnect);
});

ros.on('close', function() {
  console.log('Connection closed.');
  document.getElementById('connecting').style.display = 'none';
  document.getElementById('connected').style.display = 'none';
  document.getElementById('closed').style.display = 'inline';
});

// Create a connection to the rosbridge WebSocket server.
var ip;

function onload() {
  // ip = document.getElementById('ip');
  ip = 'localhost';

  // Create the main viewer.
  var viewer = new ROS3D.Viewer({
    divID : 'map',
    width : 800,
    height : 600,
    antialias : true
  });

  // Setup the map client.
  var gridClient = new ROS3D.OccupancyGridClient({
    ros : ros,
    rootObject : viewer.scene
  });
}

var room_number;
function login() {
  room_number = document.getElementById('room_number').value;
  if (room_number < 1 || room_number > 3) {
    document.getElementById('login_status').innerHTML = "Status: wrong room number";
  } else {
    document.getElementById('login_status').innerHTML = "Status: succeed";
    var close = document.getElementById("login-group");
    if (close.style.display === "none") {
      close.style.display = "block";
    } else {
      close.style.display = "none";
    }
    connect();
  }
}

// var autoconnect = setInterval(function(){connect();}, 1000);
function connect() {
  // let ip_s = 'ws://' + ip.value + ':9090';
  let ip_s = 'ws://' + ip + ':9090';
  ros.connect(ip_s);
}

// Publishing a Topic
// ------------------

// Create a Topic object with details of the topic's name and message type.
var r1CmdVel = new ROSLIB.Topic({
  ros : ros,
  name : '/r1/cmd_vel',
  messageType : 'geometry_msgs/Twist'
});

var r2CmdVel = new ROSLIB.Topic({
  ros : ros,
  name : '/r2/cmd_vel',
  messageType : 'geometry_msgs/Twist'
});

var listener = new ROSLIB.Topic({
  ros : ros,
  name : '/listener',
  messageType : 'std_msgs/String'
});

listener.subscribe(function(message) {
  console.log('Received message on ' + listener.name + ': ' + message.data);
  document.getElementById('receiveLabel').innerHTML = message.data;
  // If desired, we can unsubscribe from the topic as well.
  // listener.unsubscribe();
});

// Key binding.
var moveBindings = new Map([['u', [1, 1]],
  ['i', [1, 0]],
  ['o', [1, -1]],
  ['j', [0, 1]],
  ['k', [0, 0]],
  ['l', [0, -1]],
  ['m', [-1, -1]],
  [',', [-1, 0]],
  ['.', [-1, 1]]
]);

var speedBindings = new Map([['q', [1.1, 1.1]],
  ['z', [0.9, 0.9]],
  ['w', [1.1, 1]],
  ['x', [0.9, 1]],
  ['e', [1, 1.1]],
  ['c', [1, 0.9]]
]);

var speed = 0.2;
var turn = 1;

var x = 0;
var th = 0;
var acc = 0.1;
var target_speed = 0;
var target_turn = 0;
var control_speed = 0;
var control_turn = 0;
var intervalID;
var controlRobot = "r1";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Do function when clicking.
function MouseDown(clicked_id) {

  intervalID = setInterval(function(){PublishTwist(clicked_id);}, 500);
}

function PublishTwist(clicked_id) {

  if (moveBindings.has(clicked_id)){
    x = moveBindings.get(clicked_id)[0];
    th = moveBindings.get(clicked_id)[1];
  } else if (speedBindings.has(clicked_id)){
    speed = speed * speedBindings.get(clicked_id)[0];
    turn = turn * speedBindings.get(clicked_id)[1];
  } else if (clicked_id == "k"){
    x = 0;
    th = 0;
    control_speed = 0;
    control_turn = 0;
    target_speed = 0;
    target_turn = 0;
    speed = 0.2;
    turn = 1;
  } else {
  }
  target_speed = speed * x;
  target_turn = turn * th;

  if (target_speed > control_speed){
    control_speed = Math.min(target_speed, control_speed + 0.02);
  } else if (target_speed < control_speed){
    control_speed = Math.max( target_speed, control_speed - 0.02 );
  } else {
    control_speed = target_speed;
  }

  if (target_turn > control_turn){
    control_turn = Math.min( target_turn, control_turn + 0.1 );
  } else if (target_turn < control_turn){
    control_turn = Math.max( target_turn, control_turn - 0.1 );
  } else {
    control_turn = target_turn;
  }

  // Create the payload to be published. The object we pass in to ros.Message matches the
  // fields defined in the geometry_msgs/Twist.msg definition.
  var twist = new ROSLIB.Message({
    linear : {
      x : control_speed,
      y : 0,
      z : 0
    },
    angular : {
      x : 0,
      y : 0,
      z : control_turn
    }
  });
  if (controlRobot == "r1" || controlRobot == "r1r2"){
    r1CmdVel.publish(twist);
  }
  if (controlRobot == "r2" || controlRobot == "r1r2"){
    r2CmdVel.publish(twist);
  }
}

function MouseUp(){

  clearInterval(intervalID);
  x = 0; th = 0;
  control_speed = 0;
  control_turn = 0;
  var stop = new ROSLIB.Message({
    linear : {
      x : 0,
      y : 0,
      z : 0
    },
    angular : {
      x : 0,
      y : 0,
      z : 0
    }
  });
  if (controlRobot == "r1" || controlRobot == "r1r2"){
    r1CmdVel.publish(stop);
  }
  if (controlRobot == "r2" || controlRobot == "r1r2"){
    r2CmdVel.publish(stop);
  }
}

function changeRobot(){
  var selRobot = document.getElementById("selRobot");
  controlRobot = selRobot.value;
  switch(controlRobot){
    case "r1":
      document.getElementById('labelRobot').innerHTML = "robot 1";
      break;
    case "r2":
      document.getElementById('labelRobot').innerHTML = "robot 2";
      break;
    case "r1r2":
      document.getElementById('labelRobot').innerHTML = "robot 1+2";
      break;
  }
}
