#!/bin/bash

set -e  # Exit on error

echo "Updating Homebrew..."
brew update

echo "Installing curl and jq..."
brew install curl jq

echo "Installing DFX (Internet Computer SDK)..."
DFX_VERSION=$(curl -s https://api.github.com/repos/dfinity/sdk/releases/latest | jq -r .tag_name)
curl -fsSL https://internetcomputer.org/install.sh | bash
echo 'export PATH=$HOME/bin:$PATH' >> ~/.zshrc
source ~/.zshrc

echo "Installing Rust and Cargo..."
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source $HOME/.cargo/env

echo "Installing candid-extractor..."
cargo install candid-extractor

echo "Installing Calimero dependencies..."
brew tap calimero-network/homebrew-tap
brew install merod meroctl

echo "Installing frontend modules..."
cd rsa-encryption-app
./generateKeys.sh
cd ..
brew install pnpm
pnpm install

echo "Installation complete!"
