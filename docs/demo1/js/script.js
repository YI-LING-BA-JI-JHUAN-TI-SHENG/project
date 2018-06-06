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
    var section = document.getElementById("logout-group");
    section.style.display = "block";
    var section = document.getElementById("service-group");
    section.style.display = "block";
    var section = document.getElementById("connect-group");
    section.style.display = "block";
    connect();
  }
}

function logout() {
  document.getElementById('login_status').innerHTML = "Status:";
  document.getElementById('room_status').innerHTML = "Room ";
  var section = document.getElementById("login-group");
  section.style.display = "block";
  var section = document.getElementById("logout-group");
  section.style.display = "none";
  var section = document.getElementById("service-group");
  section.style.display = "none";
  var section = document.getElementById("connect-group");
  section.style.display = "none";
}

function connect() {
  let ip_s = 'ws://' + ip + ':9090';
  ros.connect(ip_s);
}

// Publishing a Topic
// ------------------

// Create a Topic object with details of the topic's name and message type.
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
  // If desired, we can unsubscribe from the topic as well.
  // listener.unsubscribe();
});

// Do function when clicking.
function MouseDown(clicked_id) {
  var data = "" + room_number + ":" + clicked_id;
  console.log(data);
  PublishData(data);
}

function PublishData(data) {
  var msg = new ROSLIB.Message({
    data : data
  });
  speaker.publish(msg);
}

function change_destination(){
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
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tab_name).style.display = "block";
    evt.currentTarget.className += " active";
}
