import { React, useEffect, useState } from 'react';
import { Container } from "react-bootstrap";
import LoadingOverlay from 'react-loading-overlay';
import { AwesomeButton } from 'react-awesome-button';
import { Navigation } from '../navigation/Navigation';
import { fetchHiveEngineData } from '../../utils/hiveEngine';
import tokenIconDefault from './tokenIconDefault.png';
import  DataTable from 'react-data-table-component';
import { HiInformationCircle } from 'react-icons/hi';
import AdditonalInformationModal from './AdditionalInformationModal';
 
export function TokenList() {
    const [tokensWithMetrics, setTokensWithMetrics] = useState([{_id: '1', issuer: 'hive', name: 'Hive Engine Token', symbol: 'HIVE', metadata: '{"url":"https://hive-engine.com","icon":"https://s3.amazonaws.com/steem-engine/images/icon_steem-engine_gradient.svg","desc":"BEE is the native token for the Hive Engine platform"}', volume: 0.00, lastPrice: 0.00, lowestAsk: 0.00, highestBid: 0.00, lastDayPrice: 0.00, priceChangeHive: 0.00, priceChangePercent: '0.00%'}])
    const [loading, setLoading] = useState(false);
    const [additonalInformationModalShow, setAdditionalInformationModalShow] = useState(false);
    const [selectedToken, setSelectedToken] = useState({symbol: 'SWAP.HIVE', balance: 0.00})

    
    async function mergeArrayObjects(){
        
        const tokens = await fetchHiveEngineData('tokens', 'tokens', {});
        const metrics = await fetchHiveEngineData('market', 'metrics', {});
        let merged = [];

        for(let i=0; i<tokens.length; i++) {
          merged.push({
           ...tokens[i], 
           ...(metrics.find((itmInner) => itmInner.symbol === tokens[i].symbol))}
          );
        }
        
        await setTokensWithMetrics(merged.filter(x => x.volume));
        console.log(tokensWithMetrics);
        setLoading(false);
    }
    
    async function showAddtionalInformation(symbol) {
        setSelectedToken(state => ({...state, symbol: symbol}));
        setAdditionalInformationModalShow(true);
    }

    useEffect(() => {
        setLoading(true);
        mergeArrayObjects();
    }, [])

    const columns = [
        {
            name:'Image',
            grow: 0,
            cell: row => <img style={{ height:'84px', width:'84px'}} src={JSON.parse(row.metadata).icon ? JSON.parse(row.metadata).icon : tokenIconDefault} />,
        },
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
            selector: row => row.volume ? parseFloat(row.volume) : 0.00,
        },
        {
            sortable: true,
            name: '24h % Change',
            sortable: false,
            selector: row => row.priceChangePercent ? row.priceChangePercent : 0.00,
            style: row => ({
                color: row ? 'gray' : 'red'
            }),
        },
        {
            name: 'Additional Information',
            button: true,
            width: '15%',
            cell: (row) => <AwesomeButton style={{paddding: '5%'}} action={() => showAddtionalInformation(row.symbol)}  size='icon'><HiInformationCircle /></AwesomeButton>,
        },
    ];

    const conditionalRowStyles = [{
        when: row => row.metadata,
        style: {
            marginTop: '1.5%',
            marginBottom: '1.5%'
        }
    }]

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
                    tokensWithMetrics && <div style={{borderRadius:'0px'}}>
                                <DataTable conditionalRowStyles={conditionalRowStyles} theme='dark' noHeader={true} columns={columns} data={tokensWithMetrics} pagination paginationPerPage={20} />
                            </div>
                }
                <AdditonalInformationModal selectedToken={selectedToken} show={additonalInformationModalShow} onHide={() => setAdditionalInformationModalShow(false)} />
                <br></br>
            </Container>
            <br></br>
            </LoadingOverlay>
            </span>
        </div>
    );
}