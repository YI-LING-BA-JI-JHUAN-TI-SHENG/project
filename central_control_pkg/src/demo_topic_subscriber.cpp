#include "ros/ros.h"
#include "std_msgs/String.h"
#include <iostream>
#include <ctype.h>
#include <unistd.h>
#include "geometry_msgs/PoseStamped.h"

char robot1[10];
ros::Publisher ctrl_pub;
void number_callback(const std_msgs::String::ConstPtr& msg);
void qrread_callback(const std_msgs::String::ConstPtr& msg);
void robot_status(char d, char g, char b, char name);
void publish_goal (float x, float y, float z);
void do_service(char service);

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
    ros::Subscriber arrived_subscriber = node_obj.subscribe("/barcode",10,qrread_callback);

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
    if(robot1[0] == '1'){
        std::cout << "I'm busy ~ " << std::endl;
    }else{
        char dst  = msg->data.c_str()[0];
        char goal = msg->data.c_str()[2];
        char busy = '1';
        robot_status(dst,goal,busy,'1');

        if(!isupper(goal)){    
            do_service(goal);
        }
        switch (dst) {
            case '1':
                publish_goal(1.8, 1.0, 0.0);
                break;
            case '2':
                publish_goal(1.8, 5.0, 0.0);
                break;
            case '3':
                publish_goal(8.8, 5.0, 0.0);
                break;
        }
    }
}

void robot_status(char d, char g, char b, char name){
    robot1[0] = b;
    robot1[1] = d;
    robot1[2] = g;
}

void do_service(char service){
    switch(robot1[2]){
        case'a':
            std::cout << "Bring the quilt." << std::endl;
            break;
        case'b':
            std::cout << "Take some bread." << std::endl;
            break;
        case'c':
            std::cout << "Take coffee." << std::endl;
            break;
    }
    sleep(3);
}

//Callback of the topic /barcode
void qrread_callback(const std_msgs::String::ConstPtr& msg)
{
    ROS_INFO("Recieved  [%s]", msg->data.c_str());
    char goal = msg->data.c_str()[0];
    if(robot1[0] == '1' && msg->data.c_str()[2] != '$'){ 
        if(goal == robot1[1]){
            std::cout << "Arrived the room" << std::endl;
            if(isupper(robot1[2])){
                robot1[0] = '0';        // avoid that read qrcode again and in to this if statement
                switch (robot1[2]) {
                    case 'A':
                        publish_goal(1.5, 1.0, 0.0);
                        break;
                    case 'B':
                        publish_goal(1.5, 5.0, 0.0);
                        break;
                    case 'C':
                        publish_goal(8.5, 5.0, 0.0);
                        break;
                }
            }else{
                robot1[0] = '0';
                robot1[1] = '0';
                robot1[2] = '0';
            }
        }else{
            std::cout << "[Wrong] Arrived the incorrect room" << std::endl;

        }

    }else if (msg->data.c_str()[2] == '$'){
        if(robot1[0] != '1'){
            robot1[0] = '1';
            robot1[1] = goal;
            switch (robot1[1]) {
                case '1':
                    publish_goal(1.8, 1.0, 0.0);
                    break;
                case '2':
                    publish_goal(1.8, 5.0, 0.0);
                    break;
                case '3':
                    publish_goal(8.5, 5.0, 0.0);
                    break;
            }
        }else{
            std::cout << "I'm busy ~ " << std::endl;
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
