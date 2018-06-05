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
var room_number;

function onload() {
  ip = 'localhost';
}

function login() {
  room_number = document.getElementById('room_number').value;
  if (room_number < 1 || room_number > 3) {
    document.getElementById('login_status').innerHTML = "Status: wrong room number";
  } else {
    document.getElementById('login_status').innerHTML = "Status: succeed";
    document.getElementById('room_status').innerHTML = "Room " + room_number;
    var section = document.getElementById("login-group");
    section.style.display = "none";
    var section = document.getElementById("service-group");
    section.style.display = "block";
    var section = document.getElementById("connect-group");
    section.style.display = "block";
    connect();
  }
}

function connect() {
  let ip_s = 'ws://' + ip + ':9090';
  ros.connect(ip_s);
}

// Publishing a Topic
// ------------------

// Create a Topic object with details of the topic's name and message type.
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

// Do function when clicking.
function MouseDown(clicked_id) {
  PublishTwist(clicked_id);
}

function PublishTwist(clicked_id) {
}

function MouseUp(){
}
