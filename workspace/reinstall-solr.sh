#!/bin/bash

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
# solrconf="/opt/solr/bin/solr.in.sh"
solrconf="/etc/default/solr.in.sh"
solrhome="/opt/solr"
ddyaml="/etc/datadog-agent/datadog.yaml"
ddjar="/opt/solr/server/lib/dd-java-agent.jar"

# Remove solr.in.sh
#sudo update-rc.d -f solr remove
#sudo rm -rf ${solrconf}
sudo cp ${ddjar} ${workdir}/downloads/
sudo systemctl stop solr
sudo rm -r /var/solr
sudo rm -r /opt/solr-${solrvrsn}
sudo rm -r /opt/solr
sudo rm /etc/init.d/solr
sudo deluser --remove-home solr
sudo deluser --group solr
sudo update-rc.d -f solr remove
sudo rm -rf /etc/default/solr.in.sh

# Reinstall Solr
tar -xzf ${workdir}/downloads/solr-${solrvrsn}.tgz -C ${workdir}/downloads/
sudo bash ${workdir}/downloads/solr-${solrvrsn}/bin/install_solr_service.sh ${workdir}/downloads/solr-${solrvrsn}.tgz
sudo cp ${workdir}/downloads/dd-java-agent.jar ${ddjar}

## sudo wget -O /opt/solr/server/lib/dd-java-agent.jar https://dtdg.co/latest-java-tracer

## Add the following config to '/etc/default/solr.in.sh': enable JMX RMI port  & add Datadog APM Jar to Solr start up
echo "ENABLE_REMOTE_JMX_OPTS=\"true\" >> ${solrconf}
echo "RMI_PORT=18983" >> ${solrconf}
echo "SOLR_OPTS=\"\$SOLR_OPTS -javaagent:/opt/solr/server/lib/dd-java-agent.jar\"" >> ${solrconf}
echo "SOLR_OPTS=\"\$SOLR_OPTS -Ddd.env=testing\"" >> ${solrconf}
echo "SOLR_OPTS=\"\$SOLR_OPTS -Ddd.service=solr\""" >> ${solrconf}

sudo systemctl start solr
