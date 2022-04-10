import { React, useEffect, useState } from 'react';
import { Container } from "react-bootstrap";
import LoadingOverlay from 'react-loading-overlay';
import { marked } from 'marked';
import { Navigation } from '../navigation/Navigation';
import { fetchHiveEngineData } from '../../utils/hiveEngine';
import tokenIconDefault from './tokenIconDefault.png';
import  DataTable from 'react-data-table-component';
 
export function TokenList() {
    const [tokens, setTokens] = useState([{_id: '1', issuer: 'hive', name: 'Hive Engine Token', symbol: 'HIVE', metadata: '{"url":"https://hive-engine.com","icon":"https://s3.amazonaws.com/steem-engine/images/icon_steem-engine_gradient.svg","desc":"BEE is the native token for the Hive Engine platform"}'}]);
    const [metrics, setMetrics] = useState([{_id: '1', name:'Hive Engine Token', symbol: 'HIVE', volume: 0.00, lastPrice: 0.00, lowestAsk: 0.00, highestBid: 0.00, lastDayPrice: 0.00, priceChangeHive: 0.00, priceChangePercent: '0.00%'}])
    const [tokensWithMetrics, setTokensWithMetrics] = useState([{_id: '1', issuer: 'hive', name: 'Hive Engine Token', symbol: 'HIVE', metadata: '{"url":"https://hive-engine.com","icon":"https://s3.amazonaws.com/steem-engine/images/icon_steem-engine_gradient.svg","desc":"BEE is the native token for the Hive Engine platform"}', volume: 0.00, lastPrice: 0.00, lowestAsk: 0.00, highestBid: 0.00, lastDayPrice: 0.00, priceChangeHive: 0.00, priceChangePercent: '0.00%'}])
    const [loading, setLoading] = useState(false);

    async function getTokens() {
        const tokensResponse = await fetchHiveEngineData('tokens', 'tokens');
        console.log(tokensResponse);
        setTokens(tokensResponse);
        return tokensResponse;
    }

    async function getMetrics() {
        const metricsResponse = await fetchHiveEngineData('market', 'metrics');
        console.log(metricsResponse);
        setMetrics(metricsResponse);
        setLoading(false)
        return metricsResponse;
    }
    
    async function mergeArrayObjects(){
        
        const tokens = await fetchHiveEngineData('tokens', 'tokens');
        const metrics = await fetchHiveEngineData('market', 'metrics');
        let merged = [];

        for(let i=0; i<tokens.length; i++) {
          merged.push({
           ...tokens[i], 
           ...(metrics.find((itmInner) => itmInner.symbol === tokens[i].symbol))}
          );
        }
        console.log(merged);
        setTokensWithMetrics(merged);
      }

    useEffect(() => {
        mergeArrayObjects();
    }, [])

    const columns = [
        {
            sortable: true,
            name: 'Token',
            selector: row => row.symbol,
        },
        {
            sortable: true,
            name: 'Name',
            selector: row => row.name,
        },
        {
            sortable: true,
            name: 'Volume',
            selector: row => row.volume ? row.volume : 0.00,
        },
        {
            sortable: true,
            name: '24h % Change',
            selector: row => row.priceChangePercent ? (parseFloat(row.priceChangePercent)) +'%': '0.00%',
            style: row => ({
                color: row ? 'gray' : 'red'
            }),
        },
    ];

    return(
        <div className="App">
            <span style={{backgroundColor: 'hsla(56, 64%, 67%, 0.863)', display: 'block', minHeight: '100vh'}}>
            <LoadingOverlay
                active={loading}
                spinner
                text='Loading your content...'
            > 
            <Navigation />
            <br></br>
            <Container className='selector bg-dark' style={{ border: '3px solid rgba(255,193,7)', height:'95%', width: '100%'}}>
                <br></br>
                <h1 style={{marginLeft: '2%',textAlign: 'left', color: 'white'}}>All Tokens</h1>
                <br></br>
                {
                    tokens && <div style={{borderRadius:'0px'}}>
                                <DataTable  theme='dark' noHeader={true} columns={columns} data={tokensWithMetrics} pagination paginationPerPage={20} />
                            </div>
                }
                <br></br>
            </Container>
            <br></br>
            </LoadingOverlay>
            </span>
        </div>
    );
}