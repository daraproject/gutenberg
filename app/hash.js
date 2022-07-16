// handles the conversion from IPFS CID to raw sha256 and the other way around

const b58 = require('bs58')

const fromHexString = hexString =>
  new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));


function base58_to_hex(base58_string) {

    let bytes = b58.decode(base58_string);
    return Buffer.from(bytes).toString('hex')
};


function ifps_cid_to_sha256(cid) {

    let multihash = base58_to_hex(cid);
    let hash = multihash.slice(-64); // first 4 describe what kind of hash is it

    return hash

}


function sha256_hash_to_ipfs_cid(hash) {

    let multihash = "1220" + hash
    console.log(multihash)
    return b58.encode(fromHexString(multihash));

}


module.exports = {
    base58_to_hex, ifps_cid_to_sha256, sha256_hash_to_ipfs_cid
  };