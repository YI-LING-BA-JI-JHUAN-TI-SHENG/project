#!/bin/sh
gnome-terminal --window --maximize \
    --tab -t "gazebo" \
        -e 'bash -c "sleep 1; \
            roslaunch robot_simulation_pkg simulation.launch"' \
    --tab -t "navigation" \
        -e 'bash -c "sleep 8; \
            roslaunch robot_navigation_pkg multi_navigation.launch"' \
    --tab -t "bridge" \
        -e 'bash -c "sleep 9; \
            roslaunch rosbridge_server rosbridge_websocket.launch"' \
    --tab -t "central" \
        -e 'bash -c "sleep 7; \
            roslaunch central_control_pkg multi_control.launch"' \
    --tab -t "convertor" \
        -e 'bash -c "sleep 6; \
            roslaunch robot_converter_pkg vel_converter.launch"' \
    --tab -t "zbar" \
        -e 'bash -c "sleep 4; \
            roslaunch zbar_ros_pkg multi_open_zbar.launch"' \
    --tab -t "RPi3 uvc" \
        -e 'bash -c "sleep 3; \
            echo \"rosrun uvc_camera uvc_camera_node\"; \
            ssh ubuntu@192.168.1.108"' \
    --tab -t "top" \
        -e 'top'
