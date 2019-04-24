#!/usr/bin/env bash
FILE=$CIRCLE_ARTIFACTS/memory-usage-actual.txt;

while true; 
    do 
        ps -u ubuntu eo pid,%cpu,%mem,args,uname --sort=-%mem >> $FILE; 
        echo "----------" >> $FILE; 
        sleep 1; 
    done;