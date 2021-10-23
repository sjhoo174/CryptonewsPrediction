#!bin/bash

echo $REACT_APP_SERVER_URL &>> /usr/src/app/logging.txt

sudo REACT_APP_SERVER_URL=$REACT_APP_SERVER_URL npm --prefix /usr/src/app/api/chartserve run build &>> /usr/src/app/logging.txt

for entry in "/usr/src/app/api/chartserve/build"/*
do 
    if [ "$entry" != "/usr/src/app/api/chartserve/build/index.html" ]; then
        sudo mv $entry "/usr/src/app/api/chartserve/build/static/"
    fi
done

sudo uwsgi --ini /usr/src/app/api/wsgiconfig.ini --enable-threads \
& sudo service nginx start \
& sudo AIRFLOW_HOME=/usr/src/app/airflow airflow scheduler \
& sudo AIRFLOW_HOME=/usr/src/app/airflow airflow webserver -p 8080