#!bin/bash

cd /home

sudo touch log.txt
sudo chmod a+w log.txt

sudo apt-get -y update &>> log.txt

sudo apt-get -y install \
apt-transport-https \
ca-certificates \
curl \
gnupg \
lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get -y update &>> log.txt

sudo apt-get -y install docker-ce docker-ce-cli containerd.io &>> log.txt

sudo apt install -y docker-compose &>> log.txt

sudo touch /home/key.json

sudo chmod a+r /home/key.json
sudo chmod a+w /home/key.json


sudo echo '' >> /home/key.json

sudo gcloud auth activate-service-account --key-file /home/key.json &>> log.txt

sudo gsutil cp -r gs://cryptonewsimage.tar . &>> log.txt

sudo docker load < /home/cryptonewsimage.tar &>>log.txt   

sudo ufw allow 443  &>> log.txt

echo y | sudo rm /home/key.json

cd /home

sudo docker volume create cryptonews

sudo docker run -e REACT_APP_SERVER_URL=$(dig +short myip.opendns.com @resolver1.opendns.com) -p 4000:8080 -p 443:443 -p 80:80 -v cryptonews:/usr/src/app/ cryptonews_st-app &>> log.txt

