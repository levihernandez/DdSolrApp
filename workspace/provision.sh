#!/bin/bash

ddapikey=${DATADOG_API_KEY}
wksp=workspace
ddenv=testing
ddservice=solr
appname=ddsolrapp
solrvrsn="8.8.0"
solrport=8983
anglport=4200
nodeport=8000
archtype=$(uname -p)
ostype=$(uname)
oslower=$( echo ${ostype} | tr '[:upper:]' '[:lower:]')
workdir=/home/vagrant/${wksp}
#solrconf="/opt/solr/bin/solr.in.sh"
solrconf="/etc/default/solr.in.sh"
solrhome="/opt/solr"
ddyaml="/etc/datadog-agent/datadog.yaml"
ddjar="/opt/solr/server/lib/dd-java-agent.jar"
# osinfo=$(cat /etc/*release)

# Save the Datadog API Key in bashrc as an export
echo "export DATADOG_API_KEY=${ddapikey}" >> /home/vagrant/.bashrc

sudo apt-get update -y
sudo apt-get install default-jdk -y
sudo apt-get install git -y

## Install NodeJS, NPM, NPK, Yarn, AngularCli # { package: '@angular-devkit/architect@0.1101.4', 
## required: { node: '>= 10.13.0', npm: '^6.11.0', yarn: '>= 1.13.0' },
## current: { node: 'v10.23.2', npm: '7.5.2' } }
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g yarn
sudo npm install -g @angular/cli
sudo npm install -g @angular-devkit/build-angular

cd /home/vagrant/${wksp}

# Install Solr
wget -O ${workdir}/downloads/solr-${solrvrsn}.tgz https://apache.claz.org/lucene/solr/${solrvrsn}/solr-${solrvrsn}.tgz
tar -xzf ${workdir}/downloads/solr-${solrvrsn}.tgz -C ${workdir}/downloads/
sudo bash ${workdir}/downloads/solr-${solrvrsn}/bin/install_solr_service.sh ${workdir}/downloads/solr-${solrvrsn}.tgz
sudo chown -R solr:solr /opt/${solrvrsn}

# See the Solr params loaded after start up
ps -eaf | grep solr | tr " " "\n"


if test -f "${solrconf}"; then
    echo "${solrconf} has been configured, exiting setup now."
else
    echo "${solrconf} is being configured now, please wait..."
    mv ${solrconf}.orig ${solrconf}
fi

# Download & Install Datadog Agent
DD_AGENT_MAJOR_VERSION=7 DD_API_KEY=${ddapikey} DD_SITE="datadoghq.com" bash -c "$(curl -L https://s3.amazonaws.com/dd-agent/scripts/install_script.sh)"

# Download & Install Datadog JAR APM/Profiler Jar Agent
sudo wget -O ${ddjar} https://dtdg.co/latest-java-tracer

# Configure Solr
sudo echo "# Enable JMX RMI_PORT, Enable Datadog APM on Solr start up" >> ${solrconf}
sudo echo "ENABLE_REMOTE_JMX_OPTS=\"true\"" >> ${solrconf}
sudo echo "RMI_PORT=18983" >> ${solrconf}
sudo echo "SOLR_OPTS=\"\$SOLR_OPTS -javaagent:${ddjar}\"" >> ${solrconf}
sudo echo "SOLR_OPTS=\"\$SOLR_OPTS -Ddd.env=${ddenv}\"" >> ${solrconf}
sudo echo "SOLR_OPTS=\"\$SOLR_OPTS -Ddd.service=${ddservice}\"" >> ${solrconf}

# Configure datadog.yaml
sudo sed -i 's/^# env: <environment name>$/env: '${ddenv}'/g' ${ddyaml}
sudo sed -i 's/^# apm_config:$/apm_config:/g' ${ddyaml}
sudo sed -i 's/^  # enabled: true$/    enabled: true/g' ${ddyaml}
sudo sed -i 's/^  # env: none$/    env: '${ddenv}'/g' ${ddyaml}

# Start Solr
sudo systemctl status solr

# Restart Datadog Agent after configurations performed
sudo systemctl datadog-agent restart

# Test Solr from command line
curl http://localhost:${solrport}/solr/

# Test Get filtered records
curl "http://localhost:8983/solr/technology/select?facet.field=technology.name&facet.field=technology.os_support.distrib_id&facet=on&fl=technology.name%2Ctechnology.alias%2Ctechnology.tech_type&q=*%3A*"

# Ingest sample data by creating a sample collection core for Solr
sudo -u solr ${solrhome}/bin/solr create -c technology

# Load a sample JSON tech file
sudo -u solr ${solrhome}/bin/post -c technology ${workdir}/data/technology1.json
sudo -u solr ${solrhome}/bin/post -c technology ${workdir}/data/technology2.json


# In this project I use yarn package manager to install dependencies
# NPM eperienced failures installing packages in a Vagrant machine running on Mac OS
cd /home/vagrant/${wksp}/${appname}

yarn global add @angular/cli
ng set --global packageManager=yarn
yarn add express cors popper.js jquery bootstrap @datadog/browser-rum
yarn install

echo "---------------------------------------------------------------------------"
echo "Run in a separate terminal: node nodeServer/server.js"
echo "Run in a separate terminal: ng serve --host 0.0.0.0"
echo "---------------------------------------------------------------------------"
