# <img src="app/src/pages/admin/logo.jpg" alt="LimeDraw Logo" width="50" height="50" style="vertical-align: middle;"> **LimeDraw**

LimeDraw is an Anonymous Lottery System built on top of ICP with the help of Calimero SDK. 

## **Overview**
This repository contains:
- **ICP Smart Contracts** – Manages lotteries and their state on the Internet Computer blockchain.  
- **Calimero Private Context** – Provides private and secure contexts for individual lotteries.  
- **Front-End Application** – Offers a user-friendly interface for interacting with the lottery system.  
<!-- - ** -->

## **Getting Started**

### **Clone the Repository**
```bash title="Terminal"
git clone https://github.com/iamaa0205/LimeDraw.git
cd LimeDraw
```

### **Install dependencies**
```bash title="Terminal"
chmod +x install_dependencies.sh
./install_dependencies.sh
pnpm install
```
### **Setting up Calimero Node and ICP contracts**
Run the given script which will set up local ICP network and deploy the canisters. It also makes a host and deploys the application with the host
```bash title="Terminal"
cd logic
chmod +x ./script.sh
./script.sh
```

### **Add participants to the context**
Run the script which adds participants to the context. It takes number of participants you want to create as the argument.
```bash title="Terminal"
chmod +x ./participants.sh
./participants.sh 3
```

All the data corresponding to the canisters, pub-pvt key pairs of the nodes and application id get stored to `./logic/node_vars.env` .

## **Features**
- Encrypted Prize Pools
- Ensuring Winner Anonymity And Secure Ticket Mapping
- Private Chat Rooms for Hosts
- Auditable Random Number Generation For Winner Selection

## **Architecture of LimeDraw**
<img src="architecture.png" alt="architecture" width="500" height="300" />

## **User Flow diagram**
<img src="flow-diagram.png" alt="flow-diagram" width="500" height="300" />

## **Video Demo**
The video demo of the project can be found [here]().

## **Team members**
This project is made with ❤️ by 
- Aaditya Aren
- Dhruv Goyal
- Mradul Singhal
