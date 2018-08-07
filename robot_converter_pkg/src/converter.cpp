#include "ros/ros.h"
#include "std_msgs/String.h"
#include <iostream>
#include <ctype.h>
#include <unistd.h>
#include "geometry_msgs/PoseStamped.h"
#include <geometry_msgs/Twist.h>
ros::Publisher vel_pub;
void velocity_callback(const geometry_msgs::Twist & cmd_input);
void publish_vel (float lx, float ly, float lz , float ax, float ay, float az);

int main(int argc, char **argv)
{
    // Initializing ROS node with a name of demo_topic_subscriber
    ros::init(argc, argv,"converter");
    // Created a nodehandle object
    ros::NodeHandle node_obj;
    // Create a subscriber object subscribe /r1/cmd_vel
    ros::Subscriber velocity_subscriber = node_obj.subscribe("/r1/cmd_vel",50,velocity_callback);
    // create publish node
    vel_pub = node_obj.advertise<geometry_msgs::Twist>("/cmd_vel",100);

    //Spinning the node
    ros::spin();
    return 0;
}

//Callback of the topic /r1/cmd_vel
void velocity_callback(const geometry_msgs::Twist & cmd_input)
{
    //ROS_INFO("Recieved  [%d]",msg->data);
    float lx,ly,lz,ax,ay,az;
    lx=cmd_input.linear.x/5;
    ly=cmd_input.linear.y/5;
    lz=cmd_input.linear.z/5;
    ax=cmd_input.angular.x;
    ay=cmd_input.angular.y;
    az=cmd_input.angular.z;    
    publish_vel(lx,ly,lz,ax,ay,az);
}

void publish_vel (float lx, float ly, float lz , float ax, float ay, float az)
{
    geometry_msgs::Twist p;
    p.linear.x=lx;
    p.linear.y=ly;
    p.linear.z=lz;
    p.angular.x=ax;
    p.angular.y=ay;
    p.angular.z=az;
    vel_pub.publish(p);
}
