# Gutenberg 

An effort to create a full (or partial) backup of the current Gutenberg book library using only p2p storage. The stack uses IPFS for file storage while dropping "anchors" on a p2p immutable database (blockchain).
Anchors placed on a blockchain will serve as a breadcrumbs which point toward IPFS CIDs (content IDs), after fetching the CID from the blockchain the client can fetch it of nearest IPFS gateway.
As data stored on the blockchain is immutable, there is guarantee that the content hashed on the blockchain has not been altered. In order words, if client can not find the IPFS CID they got of the blockchain it means that data they are looking for was either modified or lost.
The core principle of the proposed design is to be as resilient as possible, with hopefully not a single central point of faulire.

## Protocol

The protocol is in the **proof of concept** stage.

### Save

* vout[0] is a [P2TH](https://peercoin.github.io/P2TH/) tag address, we can select some vanity address like "PGutnbrg.....xGh".
* vout[1] is a metadata message which carries a protobuf-encoded message. Example of such message:

```
{
  cid: 'QmbCXJJZxNtLNtm9rn9i7PXbwtawpFvZU7Nx6CPxi77miR',
  title: 'Hathercourt',
  ebookNo: 43168
}
```

This message carries only enough information to allow a thin client parsing the P2TH tree to understand **what is it**, and **where is it**. All information relevant to finding the file (book) itself via IPFS is contained in the "cid" key. "title" key is not mandatory but it will help with the user experience. Key "eBookNo" is mandatory as ebook number is the most vital piece of information to understand more details about the book.

* vout[2-n] is change

Example of such a transaction:

```json
{
   "txid": "4a421b7734a62719813d08a0da808a52940af2903dca6c3fa71c6431d888ffa6",
   "hash": "4a421b7734a62719813d08a0da808a52940af2903dca6c3fa71c6431d888ffa6",
   "version": 3,
   "time": 0,
   "size": 368,
   "vsize": 368,
   "weight": 1472,
   "locktime": 0,
   "vin": [
      {
         "txid": "1c591a0c3bfe6a17de05e5f91b85a4a327ac1e52c2e2d54d16606ac1d4166319",
         "vout": 2,
         "scriptSig": {
            "asm": "3045022100f388f425988c5b410d4961f274174d6d0ad3c48d66ef716fb252a96368f83dce022007ce62d0f910f9151ad1171cbabe6749f27c150966390cf7c2c36007bff78127[ALL] 02a3b344610f32aaf614ceea7728356334d1c747a0b45845a5117e85aed33a9754",
            "hex": "483045022100f388f425988c5b410d4961f274174d6d0ad3c48d66ef716fb252a96368f83dce022007ce62d0f910f9151ad1171cbabe6749f27c150966390cf7c2c36007bff78127012102a3b344610f32aaf614ceea7728356334d1c747a0b45845a5117e85aed33a9754"
         },
         "sequence": 4294967295
      }
   ],
   "vout": [
      {
         "value": 0,
         "n": 0,
         "scriptPubKey": {
            "asm": "OP_DUP OP_HASH160 37f03704ee49c937cc64118a2d0bab7074c1aca7 OP_EQUALVERIFY OP_CHECKSIG",
            "hex": "76a91437f03704ee49c937cc64118a2d0bab7074c1aca788ac",
            "reqSigs": 1,
            "type": "pubkeyhash",
            "addresses": [
               "mkcjE2gjJs8bq6aVSrsk7Rm9FueK8nRTn9"
            ]
         }
      },
      {
         "value": 0,
         "n": 1,
         "scriptPubKey": {
            "asm": "OP_RETURN 30613265353136643632343335383461346135613738346537343463346537343664333937323665333936393337353035383632373737343631373737303436373635613535333734653738333634333530373836393337333736643639353231613062343836313734363836353732363336663735373237343230613064313032",
            "hex": "6a4c8230613265353136643632343335383461346135613738346537343463346537343664333937323665333936393337353035383632373737343631373737303436373635613535333734653738333634333530373836393337333736643639353231613062343836313734363836353732363336663735373237343230613064313032",
            "type": "nulldata"
         }
      },
      {
         "value": 0.95538,
         "n": 2,
         "scriptPubKey": {
            "asm": "OP_DUP OP_HASH160 767b840360b6d654fd367b6c8d6d59cd8c9e421b OP_EQUALVERIFY OP_CHECKSIG",
            "hex": "76a914767b840360b6d654fd367b6c8d6d59cd8c9e421b88ac",
            "reqSigs": 1,
            "type": "pubkeyhash",
            "addresses": [
               "mrKRzi7ahbz6L1r4ZE9XfkDJuJMdy5aaSV"
            ]
         }
      }
   ],
   "blockhash": "a2f36a43c248bcc2a785b693b889c9781488cda45c04ee862c46237ad386b8f6",
   "confirmations": 2,
   "blocktime": 1658050298
}
```



### Read

As the client (probably a web client) iterates over the P2TH tree, it reads the transaction metadata and understands which book is it, based of title and book number, which is in a sense book ID per Gutenberg.
This book ID can be used to fetch extra metadata from the https://gutendex.com/ API or some other hosted API.

## Compile .protobuf

For python:
```
protoc -I=. --python_out=. gutenberg.proto
```

For common-js:
```
protoc -I=. --js_out=import_style=commonjs,binary:. gutenberg.proto
```
