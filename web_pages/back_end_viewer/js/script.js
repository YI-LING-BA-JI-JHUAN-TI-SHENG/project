// Connecting to ROS
// -----------------
var ros = new ROSLIB.Ros();

ros.on('error', function(error) {
  document.getElementById('connecting').style.display = 'none';
  document.getElementById('connected').style.display = 'none';
  document.getElementById('closed').style.display = 'none';
  document.getElementById('error').style.display = 'inline';
  console.log(error);
});

ros.on('connection', function() {
  console.log('Connection made!');
  document.getElementById('connecting').style.display = 'none';
  document.getElementById('error').style.display = 'none';
  document.getElementById('closed').style.display = 'none';
  document.getElementById('connected').style.display = 'inline';
});

ros.on('close', function() {
  console.log('Connection closed.');
  document.getElementById('connecting').style.display = 'none';
  document.getElementById('connected').style.display = 'none';
  document.getElementById('closed').style.display = 'inline';
});

// Create a connection to the rosbridge WebSocket server.
var ip;
var username;

function login() {
  username = document.getElementById('username').value;
  if (username < 1 || username > 3) {
    document.getElementById('login_status').innerHTML = "wrong username";
  } else {
    document.getElementById('login_status').innerHTML = "succeed";
    var section = document.getElementById("login-group");
    section.style.display = "none";
    var section = document.getElementById("logout-group");
    section.style.display = "block";
    var section = document.getElementById("mapview-group");
    section.style.display = "block";
    var section = document.getElementById("connect-group");
    section.style.display = "block";
    connect();
  }
}

function logout() {
  document.getElementById('login_status').innerHTML = "";
  var section = document.getElementById("login-group");
  section.style.display = "block";
  var section = document.getElementById("logout-group");
  section.style.display = "none";
  var section = document.getElementById("mapview-group");
  section.style.display = "none";
  var section = document.getElementById("connect-group");
  section.style.display = "none";
  ros.close();
}

function onload() {
  var viewer = new ROS3D.Viewer({
    divID : 'map_view',
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

function connect() {
  ip = document.getElementById('ip').value;
  let ip_s = 'ws://' + ip + ':9090';
  ros.connect(ip_s);
}

// Publishing a Topic
// ------------------

var speaker = new ROSLIB.Topic({
  ros : ros,
  name : '/speaker',
  messageType : 'std_msgs/String'
});

var listener = new ROSLIB.Topic({
  ros : ros,
  name : '/listener',
  messageType : 'std_msgs/String'
});

listener.subscribe(function(message) {
  console.log('Received message on ' + listener.name + ': ' + message.data);
  document.getElementById('receiveLabel').innerHTML = message.data;
});

function mouseDown(clicked_id) {
  var data = "" + username + ":" + clicked_id;
  console.log(data);
  publishData(data);
}

function publishData(data) {
  var msg = new ROSLIB.Message({
    data : data
  });
  speaker.publish(msg);
}

function changeDestination(){
  var target_des = document.getElementById("select_destination").value;
  var A = document.getElementById("qr_a");
  var B = document.getElementById("qr_b");
  var C = document.getElementById("qr_c");
  if (target_des === "A") {
    A.style.display = "block";
    B.style.display = "none";
    C.style.display = "none";
  } else if (target_des === "B") {
    A.style.display = "none";
    B.style.display = "block";
    C.style.display = "none";
  } else if (target_des === "C") {
    A.style.display = "none";
    B.style.display = "none";
    C.style.display = "block";
  } else {
    A.style.display = "none";
    B.style.display = "none";
    C.style.display = "none";
  }
}

function openTab(evt, tab_name) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tab_name).style.display = "block";
  evt.currentTarget.className += " active";
}
