# Project

## Introduction

This project is a project for COMPUTER PROJECT DESIGN, a required subject of
NCKU CSIE (Department of Computer Science and Information Engineering, National Cheng Kung University).
The topic is "Route Planning Based on Communication between Virtual and Physical Network Interface: Unmanned Hotel System Based on Robot Operating System".
In chinese it is named 「虛網實規：基於ROS建立之無人旅店系統」.
The advising professor is Chuan-Ching Sue (蘇銓清) professor, and the members of
this team is 黃柏瑄、洪瑞隆、鍾日超.
The main function is to let virtual and physical move synchronously and we design
three scenarios:
1. Press the button in the room, then robot takes some needs and go to the specific room.
2. Press the button in the room, then robot comes and navigates to the specific destination.
3. Let the robot scan QRcode and robot navigates to the specific destionation.

## Demo video

[![DEMO](https://img.youtube.com/vi/GZtqCUj0kKk/0.jpg)](https://www.youtube.com/watch?v=GZtqCUj0kKk)

## Requirements

+ Ubuntu 14.04
+ ROS Indigo

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

## Setup, Build and Run Demo

### 1. Download necessary repositories

```bash
$ cd ~/catkin_ws/src/
$ git clone https://github.com/YI-LING-BA-JI-JHUAN-TI-SHENG/project.git
$ cd ~/
$ git clone https://github.com/YI-LING-BA-JI-JHUAN-TI-SHENG/rosev3.git
```

### 2. Setup IP configuration

+ `xxx.xxx.xxx.xxx` represent the static IP address for master.

1. master IP in main computer.
```bash
$ vim /etc/hosts
```
```
xxx.xxx.xxx.xxx [your-pc-name]
xxx.xxx.xxx.xxx master
192.168.1.111   robot
192.168.1.101   ev3dev
```
```bash
$ vim ~/.bashrc # need to close all terminals after setting.
```
```
export ROS_MASTER_URI=http://master:11311/
export ROS_HOSTNAME=xxx.xxx.xxx.xxx
```

2. set docker.
```bash
$ vim ~/rosev3/gripp3r/.env
```
```
MASTER_URI=http://xxx.xxx.xxx.xxx:11311
```

3. set EV3 robot.
```bash
$ ssh root@192.168.1.101
$ vim /etc/hosts
```
```
192.168.1.111   robot
xxx.xxx.xxx.xxx master
```

4. set Raspberry Pi 3.
```bash
$ ssh ubuntu@192.168.1.108
$ vim /etc/hosts
```
```
192.168.1.108   ubiquityrobot ubiquityrobot.local
xxx.xxx.xxx.xxx master
```

### 3. Hardware setup

1. Plug in the RPi3 connected to uvc camera with usb cable.
2. Open EV3 and make sure that it connected to AP.

### 4. Build and compile project

```bash
$ cd ~/catkin_ws/
$ catkin_make
```

### 5. Run

1. Change to project directory.
```bash
$ cd ~/catkin_ws/src/project/
```

2. Run `run.sh`.
```bash
$ sh run.sh
```

3. Input sudo password in docker tab.
4. Run `ev3_manager` in ev3 tab, and wait connection.
5. Run `launch_all.sh` in Terminal tab.
```bash
$ sh launch_all.sh
```

6. Input password in RPi3 uvc tab, and run `rosrun uvc_camera uvc_camera_node`.
```bash
$ rosrun uvc_camera uvc_camera_node
```

7. Open web server by using chrome plugin.
  + choose the `~/catkin_ws/src/web_pages/demo1/` folder.

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
