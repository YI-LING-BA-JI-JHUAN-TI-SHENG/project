# Project

## File Architecture
```
catkin_ws/
└── src/
    └── project/                    ← this git repository
        ├── robot_control_pkg/      ← package
        │   ├── CMakeLists.txt
        │   ├── launch/
        │   ├── package.xml
        │   └── src/
        ├── robot_description_pkg/  ← package
        ├── robot_navigation_pkg/   ← package
        ├── robot_simulation_pkg/   ← package
        ├── central_control_pkg/    ← package
        ├── robot_converter_pkg/    ← package
        ├── zbar_ros_pkg/           ← package
        ├── web_pages/
        ├── run.sh
        ├── launch_all.sh
        ├── LICENSE
        └── README.md
```

## Run Demo

### Setup

1. Plug in the RPi3 connected to uvc camera with usb cable.
2. Open EV3 and make sure that it connected to AP.

### Run

1. Run `sh run.sh`.
2. Input sudo password in docker tab.
3. Run `ev3_manager` in ev3 tab, and wait connection.
4. Run `sh launch_all.sh` in Terminal tab.
5. Input password in RPi3 uvc tab, and run `rosrun uvc_camera uvc_camera_node`.

## Usage command

### Simulation in gazebo

```sh
$ roslaunch robot_simulation_pkg simulation.launch
```

### Use keyboard control robot

```sh
$ roslaunch robot_simulation_pkg simulation_one_robot.launch
$ roslaunch robot_control_pkg keyboard_teleop.launch
```

### Use web control robot

```sh
$ roslaunch rosbridge_server rosbridge_websocket.launch
$ roslaunch robot_simulation_pkg simulation.launch
```

+ Open web page and input IP address.

### Open zbar

+ Need to install zbar `sudo apt-get install ros-indigo-zbar-ros`

```sh
$ roslaunch zbar_ros_pkg open_zbar.launch
```

### Multiple open zbar

+ Need to install zbar `sudo apt-get install ros-indigo-zbar-ros`

```sh
$ roslaunch zbar_ros_pkg multi_open_zbar.launch
```

### Navigation

```sh
$ roslaunch robot_simulation_pkg simulation_one_robot.launch
$ roslaunch robot_navigation_pkg amcl.launch
$ rviz
$ rostopic pub /move_base_simple/goal geometry_msgs/PoseStamped '{header: {stamp: now, frame_id: "map"}, pose: {position: {x: 1.0, y: 0.0, z: 0.0}, orientation: {w: 1.0}}}'
```
### Multiple Navigation

```sh
$ roslaunch robot_simulation_pkg simulation.launch
$ roslaunch robot_navigation_pkg multi_navigation.launch
$ rviz
$ rostopic pub /robot1/move_base_simple/goal geometry_msgs/PoseStamped '{header: {stamp: now, frame_id: "map"}, pose: {position: {x: 1.0, y: 0.0, z: 0.0}, orientation: {w: 1.0}}}'
$ rostopic pub /robot2/move_base_simple/goal geometry_msgs/PoseStamped '{header: {stamp: now, frame_id: "map"}, pose: {position: {x: 1.0, y: 0.0, z: 0.0}, orientation: {w: 1.0}}}'
```

### Watch map on web

```sh
$ roslaunch rosbridge_server rosbridge_websocket.launch
$ roslaunch robot_simulation_pkg simulation_one_robot.launch
$ roslaunch robot_navigation_pkg amcl.launch
```

### Central control

```sh
$ roslaunch central_control_pkg control.launch
# test
$ rostopic echo /move_base_simple/goal
$ rostopic pub /speaker std_msgs/String 1:a
$ rostopic pub /barcode std_msgs/String 1:_
```

### Multiple central control

```sh
$ roslaunch central_control_pkg multi_control.launch
# test
$ rostopic echo robot1/move_base_simple/goal
$ rostopic echo robot2/move_base_simpel/goal
# three types of service
$ rostopic pub /speaker std_msgs/String 1:a
$ rostopic pub /speaker std_msgs/String 2:A
$ rostopic pub /robot2/barcode std_msgs/String 3:$
# simulate that robot arrive in destinition
$ rostopic pub robot1/barcode std_msgs/String 1:_
$ rostopic pub robot2/barcode std_msgs/String 1:_
# reset
$ rostopic pub /speaker std_msgs/String _:_
```

### Watch image of the camera on the robot (single robot)
```sh
$ rosrun image_view image_view image:=/rrbot/camera1/image_raw
```

### Watch image of the camera on the robot(multiple robots)
```sh
# virtual robot
$ rosrun image_view image_view image:=/robot1/image
# real robot
$ rosrun image_view image_view image:=/robot2/image
```

### Note
+ `vim /etc/hosts`
  + add
  + `xxx.xxx.xxx.xxx pc-name`
  + `xxx.xxx.xxx.xxx master`
  + `192.168.1.111 robot`
  + `192.168.1.101 ev3dev`
+ `vim ~/.bashrc` (need to close all terminals after setting)
  + add
  + `source ~/catkin_ws/devel/setup.bash`
  + `export ROS_MASTER_URI=http://master:11311/`
  + `export ROS_HOSTNAME=xxx.xxx.xxx.xxx`
+ EV3 `ssh root@192.168.1.101`
  + `vim /etc/hosts`
  + `192.168.1.111 robot`
  + `xxx.xxx.xxx.xxx master`
+ RPi3 `ssh ubuntu@192.168.1.108`
  + `vim /etc/hosts`
  + `192.168.1.108 ubiquityrobot ubiquityrobot.local`
  + `xxx.xxx.xxx.xxx master`
+ docker
  + `vim ~/rosev3/gripp3r/.env`
  + `MASTER_URI=http://xxx.xxx.xxx.xxx:11311`
Web Server for Chrome
