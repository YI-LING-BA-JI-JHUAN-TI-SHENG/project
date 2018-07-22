cmake_minimum_required(VERSION 2.8.3)
project(central_control_pkg)

find_package(catkin REQUIRED COMPONENTS
  roscpp
  rospy
  std_msgs
  actionlib 
  actionlib_msgs
  message_generation
)

## System dependencies are found with CMake's conventions
find_package(Boost REQUIRED COMPONENTS system)

## Generate added messages and services with any dependencies listed here
 generate_messages(
   DEPENDENCIES
   std_msgs
   actionlib_msgs
 )

catkin_package(
  CATKIN_DEPENDS roscpp rospy std_msgs actionlib actionlib_msgs message_runtime 
)

include_directories(
  include
  ${catkin_INCLUDE_DIRS}
  ${Boost_INCLUDE_DIRS}
)

add_executable(demo_topic_subscriber src/demo_topic_subscriber.cpp)
add_executable(demo_topic_subscriber_multi src/demo_topic_subscriber_multi.cpp)

add_dependencies(demo_topic_subscriber central_control_pkg_generate_messages_cpp)
add_dependencies(demo_topic_subscriber_multi central_control_pkg_generate_messages_cpp)

target_link_libraries(demo_topic_subscriber ${catkin_LIBRARIES})
target_link_libraries(demo_topic_subscriber_multi ${catkin_LIBRARIES})
