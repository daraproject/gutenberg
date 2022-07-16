var bitcore = require('bitcore-lib');
const fetch = require('sync-fetch')

var apiurl = 'https://tblockbook.peercoin.net/api/'; //tblockbook is testnet blockbook

// add peercoin network vars
bitcore.Networks.add({
  name: 'peercoin',
  alias: 'ppcoin',
  pubkeyhash: 0x37,
  privatekey: 0xb7,
  scripthash: 0x75,
  bech32prefix: 'pc',
  xpubkey: 0x0488b21e,
  xprivkey: 0x0488ade4,
  networkMagic: 0xe6e8e9e5,
  port: 9901,
  dnsSeeds: [
    'seed.peercoin.net'
  ]
});

bitcore.Networks.add({
  name: 'peercoin-testnet',
  alias: 'ppcoin-testnet',
  pubkeyhash: 0x6f,
  privatekey: 0xef,
  scripthash: 0xc4,
  bech32prefix: 'tpc',
  xpubkey: 0x043587cf,
  xprivkey: 0x04358394,
  networkMagic: 0xcbf2c0ef,
  port: 9903,
  dnsSeeds: [
    'tseed.peercoin.net'
  ]
});

// set peercoin-testnet as default network
bitcore.Networks.defaultNetwork = bitcore.Networks.get('peercoin-testnet');


//
// Handling UTXOs
//
function findUtxos(address) { // pass it address Object, not string
    // fetch list of utxos from explorer and convert them 

    const raw_utxos = fetch(apiurl + 'utxo/' + address.toString()).json();
    const script = new bitcore.Script(address).toHex();
    var formatted_utxos = [];

    for (const i of raw_utxos) {
      formatted_utxos.push({"txid": i["txid"], "outputIndex": i["vout"], "address": address, "script": script, "satoshis": i["satoshis"] / 10**2}
      )
    };

    return formatted_utxos;

};

function selectInputs(utxos, amount) {
    // select best UTXOs to be spent
  
    if (amount == 0) {
      return null
    }
  
    let amounts = [];
    for (const i of utxos) {
      amounts.push(i.satoshis)
    };
    const sum = amounts.reduce((partialSum, a) => partialSum + a, 0);
                                 
    if (sum < amount) {
      return null
    }
  
    let s = 0;
    let remaining_amount = amount;
    let selected = [];
  
    while (s <= amount) {
  
      // find closest number
      const t = utxos.sort((a, b) => Math.abs(a.satoshis - remaining_amount) - Math.abs(b.satoshis - remaining_amount))[0];
      s += t.satoshis
      remaining_amount = remaining_amount - t.satoshis
      selected.push(t)
      utxos = utxos.filter(item => item !== t)
      }
  
    return selected
  };


//
// List transactions
//
function listTransactions(address) {
    // fetch list of utxos from explorer and convert them into format understood by bitcore

    const txns = fetch(apiurl + 'address/' + address).json();

    return txns.transactions;

};

//
// get raw transaction
//
function getRawTransaction(txid) {
  // fetch list of utxos from explorer and convert them into format understood by bitcore

  const txns = fetch(apiurl + 'tx-specific/' + txid).json();

  return txns;

};


module.exports = {
  listTransactions, getRawTransaction, selectInputs, findUtxos, bitcore
};
