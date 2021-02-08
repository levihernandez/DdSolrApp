#!/bin/bash

ddapikey=${1}
nodeport=8000
solrport=8983
anglport=4200
FILE=Vagrantfile
wksp=workspace
ddenv=testing
ddservice=solr


if test -f "$FILE"; then
    echo "${FILE} has been configured, exiting setup now."
    # exit 0
else
    echo "${FILE} will be created for the first time."
    vagrant init bento/ubuntu-20.04
    # Create shared dir between local & vagrant hosts
    mkdir -p ${wksp}/{angular,downloads,solrpkg}
fi

# Add the following to line 27, where the forwarded port can be enabled
sed -i '' '27i\
\ \ config.vm.network "forwarded_port", guest: '${solrport}', host: '${solrport}'\
\ \ config.vm.network "forwarded_port", guest: '${anglport}', host: '${anglport}'\
\ \ config.vm.network "forwarded_port", guest: '${nodeport}', host: '${nodeport}'\
' ${FILE}

# Add the following to line 49, to share a 
sed -i '' '50i\
\ \ config.vm.synced_folder "'${wksp}'", "/home/vagrant/'${wksp}'"\
' ${FILE}

sed -i '' '74i\
\ \ config.vm.provision "shell", path: "'${wksp}'/provision.sh", env: {"DATADOG_API_KEY" => "'${ddapikey}'"} \
' ${FILE}

echo "---------------------------------------------------------------------------"
echo "Vagrantfile file created and configured."
echo "The Vagrantfile takes care of setting up the environment and most of the"
echo "resources during the initial run. You will need to configure the Datadog "
echo "agents for JMX, and other tools."
echo "---------------------------------------------------------------------------"
echo "Start the VM with: vagrant up"
echo "Log into the guest host: vagrant ssh"