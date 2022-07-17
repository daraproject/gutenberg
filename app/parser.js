const { readProtobuf } = require("./protobuffstuff");
const { listTransactions, getRawTransaction, bitcore } = require("./coin");
const { base58_to_hex } = require("./hash");

const p2th_addr = "mkcjE2gjJs8bq6aVSrsk7Rm9FueK8nRTn9";

function getTxnVout(all_txns) {
    /*
    extract vouts from all the txns paying to the P2TH
    */

    let raw_txns = [];

    for (const i of all_txns) {
        raw_txns.push(getRawTransaction(i)['vout'])
      };

    return raw_txns;
}

function parseVout(vouts) {
    /*
    Parses each individual vout and extracts book metadata
    */

    book_metadata = [];

    for (const i of vouts) {

        // vout[0] = P2TH = can be skipped
        // vout[1] = metadata
        let asm = i[1]["scriptPubKey"]["asm"];
        if (asm.includes("OP_RETURN")) {
            asm = asm.replace("OP_RETURN", "").trim();
        }
        else {
            break
        }

        const msg = Uint8Array.from(Buffer.from(asm, 'hex'));

        book_metadata.push(
            readProtobuf(msg)
        )
    
    }

    return book_metadata

}


allTxns = listTransactions(p2th_addr);
console.log(allTxns);
txnVouts = getTxnVout(allTxns)

console.log(parseVout(txnVouts));