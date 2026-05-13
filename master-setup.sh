#!/bin/bash
cd /home/krish/Downloads/IIITB-SPE-MajorProj-FinTechDevOps-main
echo "Starting Master Setup..." > master-setup.log
./setup.sh >> master-setup.log 2>&1
echo "Setup 1 Complete. Starting DevOps setup..." >> master-setup.log
./setup-devops.sh >> master-setup.log 2>&1
echo "Master Setup Complete." >> master-setup.log
