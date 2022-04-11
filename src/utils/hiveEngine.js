import SSC from 'sscjs';

const ssc = new SSC('https://api.hive-engine.com/rpc');


export async function fetchHiveEngineData(contract, table, query) {
   return ssc.find(contract, table, query, 1000, 0, [], null);
}

export async function fetchHiveEngineDataForSpecficToken(query) {
   return ssc.findOne('tokens', 'tokens', query);
}
