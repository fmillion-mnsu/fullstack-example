#!/bin/bash

echo "Running devcontainer postcreate script in $(pwd)..."

# ensure git is configured correctly
git config --global core.autocrlf input

# create a global venv
sudo python3 -m venv /opt/venv
sudo chown -R vscode:vscode /opt/venv

# For our container ensure that the path always points to the venv
echo 'export PATH=/opt/venv/bin:${PATH}' >> ~/.bashrc

echo "Installing backend packages..."
pushd backend >/dev/null
/opt/venv/bin/pip install -e .
popd >/dev/null

echo "Installing frontend packages..."
pushd frontend >/dev/null
sudo mkdir -p /opt/node_modules
sudo chown vscode:vscode /opt/node_modules
rm -rf node_modules
ln -s /opt/node_modules ./node_modules
yarn install
popd >/dev/null

# Seed database
#sudo -E /devcontainer/dbsetup.sh

# Subscriptions can suck it. Hard.
# This enables thunder-client to store its data in the Git repository without paying the cost of a subscription.
# (SERIOUSLY why would anyone make this a subscription feature???)
ln -s /workspaces/imagedb/thunder-client/ /home/vscode/.vscode-server/data/User/globalStorage/rangav.vscode-thunder-client

# Make a /data directory and make it owned by the user.
# For this example, the SQLite database is stored in /data/shop.db.
# When you create a Docker container, you can mount a volume on /data to persist data.
sudo mkdir -p /data
sudo chown vscode:vscode /data

echo "Configuration complete."

