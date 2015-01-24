#!/bin/bash
pushd .
cd /home/farnsworth/farnsworth
#need the pushd and popd because codedeploy with cd
#will break the wholeagent
npm install
popd

