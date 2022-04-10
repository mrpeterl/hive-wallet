import SSC from 'sscjs';

const ssc = new SSC('https://api.hive-engine.com/rpc');


export async function fetchHiveEngineData(contract, table) {
   return ssc.find(contract, table, { }, 1000, 0, [], null);
}
