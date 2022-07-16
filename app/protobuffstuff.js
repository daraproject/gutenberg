var Record = require('./gutenberg_pb.js');

function toProtobuf(cid, title, number) {

    let rec = new Record.Record();

    rec.setCid(cid);
    rec.setTitle(title);
    rec.setEbookNo(number);

    // Serializes to a UInt8Array.
    let bytes = rec.serializeBinary();

    if (bytes.byteLength > 256) {
        throw "Metainfo size exceeds maximum of 256 bytes supported by this network."
    }

    //return bytes
    let hex = Buffer.from(Array.from(bytes)).toString('hex');

    return hex
}


function readProtobuf(bytes) {

    let rec = new Record.Record.deserializeBinary(bytes);

    return rec.toObject();
}

/* test stuff, ignore
console.log(
    toProtobuf("Qmcuez47NPzE3FTofGqAxqbXNeB9u6Y1h7f2EuTBJwmxji", "My book", 1119)
    );
var hex = "0a2e516d6375657a34374e507a453346546f66477141787162584e6542397536593168376632457554424a776d786a691a0b486174686572636f75727420a0d102";
var msg = Uint8Array.from(Buffer.from(hex, 'hex'));
console.log(readProtobuf(msg));
*/

module.exports = {
    toProtobuf,
    readProtobuf
  };