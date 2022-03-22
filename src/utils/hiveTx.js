import hiveTx from "hive-tx";

export async function processHiveTransaction(operations) {
    //hiveTx.config.node = "https://testnet.openhive.network"
    //hiveTx.config.chain_id = "18dcf0a285365fc58b71f18b3d3fec954aa0c141c44e4e5cb4cf777b9eab274e"
    //hiveTx.config.address_prefix = "TST"
    const userData = JSON.parse(localStorage.getItem('userData'));
    const tx = new hiveTx.Transaction()
    await tx.create(operations).then(() => console.log(tx.transaction))
    
    const privateKey = hiveTx.PrivateKey.from(userData.key)
    console.log(privateKey)
    await tx.sign(privateKey)
    console.log(tx.signedTransaction)
    return await tx.broadcast();
    
}

export async function fetchHiveData(api, operations) {
    //hiveTx.config.node = "https://testnet.openhive.network"
    //hiveTx.config.chain_id = "18dcf0a285365fc58b71f18b3d3fec954aa0c141c44e4e5cb4cf777b9eab274e"
    //hiveTx.config.address_prefix = "TST"
    return hiveTx.call(api, operations);
}

export async function getPublicKey(privateKey) {
    return await hiveTx.PrivateKey.from(privateKey)
        .createPublic(/*'TST'*/)
        .toString();
}