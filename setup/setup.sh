#!bin/bash
sudo gcloud auth login

sudo gcloud compute \
--project=badc instances create cryptonews \
--zone=us-central1-a \
--machine-type=e2-standard-8 \
--subnet=projects/regions/us-central1/subnetworks/vpc-network \
--network-tier=PREMIUM \
--maintenance-policy=MIGRATE \
--service-account=-eth@-gserviceaccount.com \
--scopes=compute-rw,bigquery,storage-rw \
--image=ubuntu-1804-bionic-v20200108 \
--image-project=ubuntu-os-cloud \
--tags=https-server,http-server\
--boot-disk-size=100GB \
--boot-disk-type=pd-balanced \
--boot-disk-device-name=cryptonews \
--metadata-from-file startup-script=create_instance.sh  
