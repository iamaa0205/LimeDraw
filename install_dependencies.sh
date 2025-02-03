#!/bin/bash

set -e  # Exit on error

echo "Updating package lists..."
sudo apt update -y

echo "Installing curl and jq..."
sudo apt install -y curl jq

echo "Installing DFX (Internet Computer SDK)..."
DFX_VERSION=$(curl -s https://api.github.com/repos/dfinity/sdk/releases/latest | jq -r .tag_name)
curl -fsSL https://internetcomputer.org/install.sh | bash
echo 'export PATH=$HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

echo "Installing Rust and Cargo..."
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source $HOME/.cargo/env

echo "Installing candid-extractor..."
cargo install candid-extractor

echo "Installation complete!"
