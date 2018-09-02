#!/bin/sh
gnome-terminal \
    --window --maximize \
        -e 'bash -c "echo \"sh launch_all.sh\"; \
            bash"' \
    --tab -t "roscore" \
        -e 'bash -c "roscore"' \
    --tab -t "ev3" \
        -e 'bash -c "sleep 5; \
            echo \"ev3_manager\"; \
            ssh root@192.168.1.101"' \
    --tab -t "docker" --working-directory=$HOME/rosev3/gripp3r/ \
        -e 'bash -c "sleep 5; sudo sh down.sh; sudo sh rosini.sh"'
