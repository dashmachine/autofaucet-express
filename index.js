const express = require('express')

const port = 5050

const Dash = require('dash');

const cors = require('cors');

const app = express();

let client, account;

const smallDripAmount = 1000000;
const bigDripAmount = 100000000;

app.use(cors());

const clientOpts = {
    network: 'evonet',
    dapiAddresses: ['54.184.71.154:3000'],
    wallet: {
        mnemonic: "runway squeeze away eternal hope slice fatal tooth color alert bird upper"
    }
};

async function init() {
    client = new Dash.Client(clientOpts);
    account = await client.wallet.getAccount();
}

async function getDrip(amount, toAddress) {
    try {
        const address = account.getUnusedAddress().address
        console.log('new address:', address);
        const accBalTotal = account.getTotalBalance();
        const accBalUnconf = account.getUnconfirmedBalance()
        const accBalConf = account.getConfirmedBalance()
        console.log(`Total balance: ${accBalTotal}`)
        console.log(`Unconfirmed balance: ${accBalUnconf}`)
        console.log(`Confirmed balance: ${accBalConf}`)
        const transaction = account.createTransaction({
            recipients: [
                {
                    recipient: toAddress,
                    satoshis: amount
                },
                {
                    recipient: toAddress,
                    satoshis: amount
                },
                {
                    recipient: toAddress,
                    satoshis: amount
                },
            ]
        });

        /*
        console.log('transaction:');
        console.dir(transaction);

        console.log('input script:');
        console.dir(transaction.inputs[0]._script);
         */
        const result = await account.broadcastTransaction(transaction);

        console.log('Transaction broadcast!\nTransaction ID:', result);

        return;
    } catch (e) {
        throw e;
    }
    /*
    finally {
      client.disconnect();
    }
    */

}

app.get('/drip/:address', async (req, res) => {
    try {
        console.log("Regular Drip requested by:", req.params.address)
        await getDrip(smallDripAmount, req.params.address);
        res.status(200).send("Regular drop: " + req.params.address)
    }
    catch (e) {
        console.error('Something went wrong:', e);
        return res.status(200).send(e.message);
    }
})

app.get('/bigdrip/:address', async (req, res) => {
    try {
        console.log("Big Drip requested by:", req.params.address)
        await getDrip(bigDripAmount, req.params.address);
        res.status(200).send("Big drop: " + req.params.address)
    }
    catch (e) {
        console.error('Something went wrong:', e);
        return res.status(200).send(e.message);
    }
})

app.listen(port, async () => {
    try {
        console.log('initialising');
        await init();
        console.log(`Example app listening at http://localhost:${port}`);
    }
    catch (e) {
        console.log(e);
    }
})