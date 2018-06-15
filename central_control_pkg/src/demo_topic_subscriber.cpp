#include "ros/ros.h"
#include "std_msgs/String.h"
#include <iostream>
#include "geometry_msgs/PoseStamped.h"
ros::Publisher ctrl_pub;
int a=0;
//Callback of the topic /numbers
void number_callback(const std_msgs::String::ConstPtr& msg)
{
    //ROS_INFO("Recieved  [%d]",msg->data);
    ROS_INFO("Recieved  [%s]",msg->data.c_str());
    //std::cout << msg->data << std::endl; 

    geometry_msgs::PoseStamped p;
    char c0 = msg->data.c_str()[0],c1 = msg->data.c_str()[1];
    switch (c0){
        case '1':{ 
                     //ctrl_pub.publish("'{header: {stamp: now, frame_id: \"map\"}, pose: {position: {x: 1.0, y: 0.0, z: 0.0}, orientation: {w: 1.0}}}'"); 
                     p.header.frame_id = "map";
                     p.pose.position.x = 1.0;
                     p.pose.orientation.w = 1.0;
                     ctrl_pub.publish(p);
                     std::cout<<"a = 1";
                     a = 1;             
                     break;}
        case '2': break;
        case '3': break;
    }
    switch (c1){
        case 'A':break;
        case 'B':break;
        case 'C':break;
        case 'a':break;
        case 'b':break;
        case 'c':break;
    }
}

int main(int argc, char **argv)
{

    //Initializing ROS node with a name of demo_topic_subscriber
    ros::init(argc, argv,"demo_topic_subscriber");
    //Created a nodehandle object
    ros::NodeHandle node_obj;
    //Create a publisher object
    ros::Subscriber number_subscriber = node_obj.subscribe("/speaker",10,number_callback);
    ctrl_pub = node_obj.advertise<geometry_msgs::PoseStamped>("/move_base_simple/goal",500);

    //Spinning the node
    ros::spin();
    return 0;
}


