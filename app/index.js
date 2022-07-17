const fetch = require('sync-fetch')

const { bitcore, selectInputs, findUtxos } = require("./coin");
const { ifps_cid_to_sha256 } = require("./hash");
const { toProtobuf } = require("./protobuffstuff");


//
// P2TH address
//
const p2th_value = Buffer.from("just a simple gutenberg test_5"); // we are making the private from this random string
const p2th_hash = bitcore.crypto.Hash.sha256(p2th_value);
const p2th_bn = bitcore.crypto.BN.fromBuffer(p2th_hash);
const p2th_privateKey = new bitcore.PrivateKey(p2th_bn);
const p2th_addr = p2th_privateKey.toAddress();

console.log("P2th address:", p2th_addr.toString())

//const p2th_addr = "PGutnbrgfTmPJRVLf75VNBKNjtWUeX84AC"; // the one we will use on mainnet

//
// Generate my address
//
const value = Buffer.from("battery staple horse rangoon"); // we are making the private from this random string
const hash = bitcore.crypto.Hash.sha256(value);
const bn = bitcore.crypto.BN.fromBuffer(hash);
const privateKey = new bitcore.PrivateKey(bn);
const myAddress = privateKey.toAddress();

//console.log("This is my address: ", myAddress.toString());

//
// Pay To Tag Hash transaction
// you must set a standard upfront, for example
//    vout[0] 0 value, pays to P2TH
//    vout[1] is OP_RETURN with protobuf payload
//    vout[2] change
function makeRecTxn(payload, amount) {

    /// #1 
    // fetch utxos for an address, select best utoxs for the task
    let utxos = selectInputs(findUtxos(myAddress), amount);

    console.log("Found:", utxos)
  
    // #2 
    // try to create a new transaction object out of this
    let transaction = new bitcore.Transaction()
    .from(utxos)
    .to(p2th_addr.toString(), 0) // vout[0] = P2TH
    .addData(payload) // Add transaction metadata, up to 256 bytes
    .change(myAddress.toString())
    .sign(privateKey)

    // spit out txn in hex form
    return transaction.toString();
};

//
// Pay To Tag Hash transaction
// you must set a standard upfront, for example
//    vout[0] 0 value, pays to P2TH
//    vout[1] is OP_RETURN with protobuf payload
//    vout[2] change
function makeMagnetTxn(payload, amount) {

    /// #1 
    // fetch utxos for an address, select best utoxs for the task
    let utxos = selectInputs(findUtxos(myAddress), amount);

    console.log("Found:", utxos)
  
    // #2 
    // try to create a new transaction object out of this
    let transaction = new bitcore.Transaction()
    .from(utxos)
    .to(p2th_addr.toString(), 0) // vout[0] = P2TH
    .addData(payload) // Add transaction metadata, up to 256 bytes
    .change(myAddress.toString())
    .sign(privateKey)
  
    // spit out txn in hex form
    return transaction.toString();
};

var payload = toProtobuf("QmbCXJJZxNtLNtm9rn9i7PXbwtawpFvZU7Nx6CPxi77miR", "Hathercourt", 43168);
console.log(payload)
var txn = makeRecTxn(payload, 0.01);

console.log(txn);