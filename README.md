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
  cid: 'Qmcuez47NPzE3FTofGqAxqbXNeB9u6Y1h7f2EuTBJwmxji',
  title: 'Hathercourt',
  ebookNo: 43168
}
```

This message carries only enough information to allow a thin client parsing the P2TH tree to understand **what is it**, and **where is it**. All information relevant to finding the file (book) itself via IPFS is contained in the "cid" key. "title" key is not mandatory but it will help with the user experience. Key "eBookNo" is mandatory as ebook number is the most vital piece of information to understand more details about the book.

* vout[2-n] is change

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
