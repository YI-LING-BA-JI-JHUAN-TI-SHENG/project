# Project

## File Architecture
```
catkin_ws/
  src/
    project/                    ← this git repository
      robot_control_pkg/        ← package
        CMakeList.txt
        package.xml
      robot_description_pkg/    ← package
      robot_simulation_pkg/     ← package
      central_control_pkg/      ← package
```

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

### Open zbar example launch

+ Need to install zbar `sudo apt-get install ros-indigo-zbar-ros`

```sh
$ roslaunch zbar_ros_pkg example.launch
```

### Navigation

```sh
$ roslaunch robot_simulation_pkg simulation_one_robot.launch
$ roslaunch robot_navigation_pkg amcl.launch
$ rviz
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
$ rostopic pub /speaker std_msgs/String 1:a     
$ rostopic echo /move_base_simple/goal
```
