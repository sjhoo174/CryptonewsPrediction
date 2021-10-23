#!bin/bash


apt-get update && apt-get -y install sudo

# pip installation
sudo pip3 install -r /usr/src/app/requirements.txt

sudo apt install -y gcc 
sudo pip3 install uwsgi

# sqlite installation
sudo apt-get install -y sqlite3

sudo python3 /usr/src/app/db/setup.py


# NGINX configuration

sudo apt install -y nginx
sudo touch /etc/nginx/sites-available/ngiconfig

sudo chmod a+w /etc/nginx/sites-available/ngiconfig
sudo chmod a+r /etc/nginx/sites-available/ngiconfig

sudo sed -i 's/listen 80 default_server/#listen 80 default_server/' /etc/nginx/sites-enabled/default

sudo echo \
"
server {
    listen 80 default_server;
    listen 443;
    server_name main.com;

  
    location / {
        add_header Access-Control-Allow-Origin *;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        include /etc/nginx/uwsgi_params;
        uwsgi_pass unix:///usr/src/app/myproject.sock;
    }
    

}

server {

    listen 4000;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host \$http_host;
        proxy_redirect off;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade'; 
        add_header Access-Control-Allow-Origin *;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
    }
}" >> /etc/nginx/sites-available/ngiconfig


sudo ln -s /etc/nginx/sites-available/ngiconfig /etc/nginx/sites-enabled
 
sudo nginx -t  &>> /usr/src/app/logging.txt

#React App
sudo apt install -y npm &>> /usr/src/app/logging.txt

sudo npm install --prefix /usr/src/app/api/chartserve chartjs &>> /usr/src/app/logging.txt
sudo npm install --prefix /usr/src/app/api/chartserve axios &>> /usr/src/app/logging.txt


#Airflow

sudo AIRFLOW_HOME=/usr/src/app/airflow python3 /usr/src/app/airflow/dags/air.py &>> /usr/src/app/logging.txt

sudo AIRFLOW_HOME=/usr/src/app/airflow airflow db init &>> /usr/src/app/logging.txt

sudo AIRFLOW_HOME=/usr/src/app/airflow airflow users create -f admin -l host -e dfd@example.com -u admin -r Admin -p example  &>> /usr/src/app/logging.txt









