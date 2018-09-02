#!/bin/sh
gnome-terminal --window --maximize \
    --tab -t "gazebo"       --profile=OuO -e 'bash -c "roslaunch robot_simulation_pkg simulation.launch"' \
    --tab -t "navigation"   --profile=OuO -e 'bash -c "sleep 5; roslaunch robot_navigation_pkg multi_navigation.launch"' \
    --tab -t "bridge"       --profile=OuO -e 'bash -c "sleep 6; roslaunch rosbridge_server rosbridge_websocket.launch"' \
    --tab -t "central"      --profile=OuO -e 'bash -c "sleep 7; roslaunch central_control_pkg multi_control.launch"' \
    --tab -t "convertor"    --profile=OuO -e 'bash -c "sleep 8; roslaunch robot_converter_pkg vel_converter.launch"' \
    --tab -t "top"          --profile=OuO -e 'top' \
