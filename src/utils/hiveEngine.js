import SSC from 'sscjs';

const ssc = new SSC('https://api.hive-engine.com/rpc');


export async function fetchTokenList() {
   return ssc.find('tokens', 'tokens', { }, 1000, 0, [], null);
}

