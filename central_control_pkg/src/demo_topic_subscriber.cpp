#include "ros/ros.h"
#include "std_msgs/String.h"
#include <iostream>
#include "geometry_msgs/PoseStamped.h"

char robot1[10];
ros::Publisher ctrl_pub;
void number_callback(const std_msgs::String::ConstPtr& msg);
void arrived_callback(const std_msgs::String::ConstPtr& msg);
void check_robot(char room, char goal, char name);
void publish_goal (float x, float y, float z);

int main(int argc, char **argv)
{
    // Initialize robot status
    robot1[0] = '0';

    // Initializing ROS node with a name of demo_topic_subscriber
    ros::init(argc, argv,"demo_topic_subscriber");
    // Created a nodehandle object
    ros::NodeHandle node_obj;
    // Create a subscriber object subscribe /speaker
    ros::Subscriber number_subscriber = node_obj.subscribe("/speaker",10,number_callback);
    // Create a subscriber object subscribe barcode
    ros::Subscriber arrived_subscriber = node_obj.subscribe("/barcode",10,arrived_callback);

    // create publish node
    ctrl_pub = node_obj.advertise<geometry_msgs::PoseStamped>("/move_base_simple/goal",500);

    //Spinning the node
    ros::spin();
    return 0;
}

//Callback of the topic /speaker
void number_callback(const std_msgs::String::ConstPtr& msg)
{
    //ROS_INFO("Recieved  [%d]",msg->data);
    ROS_INFO("Recieved  [%s]", msg->data.c_str());
    //std::cout << msg->data << std::endl;

    char c0 = msg->data.c_str()[0], c1 = msg->data.c_str()[1];
    check_robot(c0,c1,'1');
    switch (c1) {
        case 'A':break;
        case 'B':break;
        case 'C':break;
        case 'a':break;
        case 'b':break;
        case 'c':break;
    }
    switch (c0) {
        case '1':
            publish_goal(1.5, 1.0, 0.0);
            break;
        case '2':
            publish_goal(1.5, 5.0, 0.0);
            break;
        case '3':
            publish_goal(8.5, 5.0, 0.0);
            break;
    }
}

void check_robot(char room, char goal, char name){
    robot1[0] = room;
    robot1[1] = goal;
}

//Callback of the topic /speaker
void arrived_callback(const std_msgs::String::ConstPtr& msg)
{
    ROS_INFO("Recieved  [%s]", msg->data.c_str());
    char goal = msg->data.c_str()[0];

    if(goal == robot1[0]){
        std::cout << "Arrived the room" << std::endl;
        publish_goal(1.0,1.0,0.0);
        robot1[0] = '0';
    }
    if(robot1[0] == '0'){
        robot1[0] = goal;
        switch (msg->data.c_str()[0]) {
            case '1':
                publish_goal(1.5, 1.0, 0.0);
                break;
            case '2':
                publish_goal(1.5, 5.0, 0.0);
                break;
            case '3':
                publish_goal(8.5, 5.0, 0.0);
                break;
        }

    }

}

void publish_goal (float x, float y, float z)
{
    geometry_msgs::PoseStamped p;
    //ctrl_pub.publish("'{header: {stamp: now, frame_id: \"map\"}, pose: {position: {x: 1.0, y: 0.0, z: 0.0}, orientation: {w: 1.0}}}'"); 
    p.header.frame_id = "map";
    p.pose.position.x = x;
    p.pose.position.y = y;
    p.pose.position.z = z;
    p.pose.orientation.w = 1.0;
    ctrl_pub.publish(p);
}
