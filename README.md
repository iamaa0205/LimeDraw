# **LimeDraw**

LimeDraw is an Anonymous Lottery System built on top of ICP with the help of Calimero SDK.

## **Getting Started**

### **Clone the Repository**
```bash title="Terminal"
git clone 
cd LimeDraw
```
Run the given script which will set up local ICP network and deploy the canisters. It also makes a host and deploys the application with the host
```bash title="Terminal"
cd demo-blockchain-integrations/logic
./script.sh
```
Run the script which adds participants to the context. It takes number of participants you want to create as the argument.
```bash title="Terminal"
./participants.sh 3
```

### **Install dependencies**
```bash title="Terminal"
pnpm install
cd ../app
pnpm run dev
```

All the data corresponding to the canisters, pub-pvt key pairs of the nodes and application id get stored to `./demo-blockchain-integrations/logic/node_vars.env` .

## **Features**

## **Architecture of LimeDraw**

## **User Flow diagram**

## **Video Demo**
The video demo of the project can be found [here]().

## **Team members**
This project is made with `:heart:` by \
- Aaditya Aren
- Dhruv Goyal
- Mradul Singhal