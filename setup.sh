#!/bin/bash

echo "Installing system dependencies..."
sudo apt-get update
sudo apt-get install -y openjdk-17-jdk python3-pip python3-venv nodejs npm docker.io docker-compose-v2

echo "System dependencies installed!"
