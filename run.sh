#!/bin/sh
gnome-terminal --window --maximize \
    --tab -t "roscore"  --profile=OuO -e 'bash -c "roscore"' \
    --tab -t "ev3"      --profile=OuO -e 'bash -c "sleep 5; ssh root@192.168.1.101"' \
    --tab -t "docker"   --profile=OuO --working-directory=$HOME/rosev3/gripp3r/ \
        -e 'bash -c "sleep 5; sudo sh down.sh; sudo sh rosini.sh"'
