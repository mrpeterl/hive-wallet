import { React, useEffect, useState } from 'react';
import { Container } from "react-bootstrap";
import LoadingOverlay from 'react-loading-overlay';
import { Navigation } from '../navigation/Navigation';
import { fetchHiveEngineData } from '../../utils/hiveEngine';
import { AwesomeButton } from 'react-awesome-button';
import tokenIconDefault from './tokenIconDefault.png';
import  DataTable from 'react-data-table-component';
import { HiInformationCircle } from 'react-icons/hi';
import { BiTransfer } from 'react-icons/bi';
import { CgDetailsMore } from 'react-icons/cg';
import TransferModal from './TransferModal';
import AdditonalInformationModal from './AdditionalInformationModal';
import TransactionHistoryModal from './TransactionHistoryModal';

export function MyWallet() {
    const [selectedToken, setSelectedToken] = useState({symbol: 'SWAP.HIVE', balance: 0.00})
    const [transferModalShow, setTransferModalShow] = useState(false);
    const [additonalInformationModalShow, setAdditionalInformationModalShow] = useState(false);
    const [transactionHistoryModalShow, setTransactionHistoryModalShow] = useState(false);
    const [tokensWithBalances, setTokensWithBalances] = useState([{_id: '1', issuer: 'hive', name: 'Hive Engine Token', symbol: 'HIVE', metadata: '{"url":"https://hive-engine.com","icon":"https://s3.amazonaws.com/steem-engine/images/icon_steem-engine_gradient.svg","desc":"BEE is the native token for the Hive Engine platform"}', account: 'hive', balance: 0.00, stake: 0.00}])
    const [loading, setLoading] = useState(false);
    
    async function mergeArrayObjects(){
        
        const tokens = await fetchHiveEngineData('tokens', 'tokens', {});
        const balances = await fetchHiveEngineData('tokens', 'balances', {'account': JSON.parse(localStorage.getItem('userData')).username});
        let merged = [];

        for(let i=0; i<tokens.length; i++) {
          merged.push({
           ...tokens[i], 
           ...(balances.find((itmInner) => (itmInner.symbol === tokens[i].symbol)))}
          );
        }
    
        setTokensWithBalances(merged.filter(x => x.balance));
        setLoading(false);
      }

    async function initiateTransfer(symbol, balance) {
        setSelectedToken({symbol: symbol, balance: balance});
        setTransferModalShow(true);
    }

    async function showAddtionalInformation(symbol) {
        setSelectedToken(state => ({...state, symbol: symbol}));
        setAdditionalInformationModalShow(true);
    }

    async function showTransactionHistory(symbol) {
        setSelectedToken(state => ({...state, symbol: symbol}));
        setTransactionHistoryModalShow(true);
    }

    useEffect(() => {
        setLoading(true);
        mergeArrayObjects();
    }, [])

    const columns = [
        {
            sortable: true,
            name: 'Token',
            maxWidth: '25%',
            selector: row => row.symbol,
        },
        {
            sortable: true,
            name: 'Name',
            maxWidth: '35%',
            selector: row => row.name,
        },
        {
            sortable: true,
            name: 'Balance',
            maxWidth: '25%',
            selector: row => parseFloat(row.balance),
        },
        {
            name: 'Additional Information',
            button: true,
            width: '15%',
            cell: (row) => <AwesomeButton action={() => showAddtionalInformation(row.symbol)}  size='icon'><HiInformationCircle /></AwesomeButton>,
        },
        {
            name: 'Transfer',
            button: true,
            width: '15%',
            cell: (row) => <div><AwesomeButton  action={() => initiateTransfer(row.symbol, row.balance)} size='icon'><BiTransfer /></AwesomeButton></div>,
        },
        {
            name: 'Transaction History',
            button: true,
            width: '15%',
            cell: (row) => <div><AwesomeButton  action={() => showTransactionHistory(row.symbol)} size='icon'><CgDetailsMore /></AwesomeButton></div>,
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
                <h1 style={{marginLeft: '2%',textAlign: 'left', color: 'white'}}>My Wallet</h1>
                <br></br>
                {
                    tokensWithBalances && <div style={{borderRadius:'0px'}}>
                                <DataTable  theme='dark' noHeader={true} columns={columns} data={tokensWithBalances} pagination paginationPerPage={20} />
                               
                            </div>
                }
                <br></br>
                <TransactionHistoryModal selectedToken={selectedToken} show={transactionHistoryModalShow} onHide={() => setTransactionHistoryModalShow(false)} />
                <AdditonalInformationModal selectedToken={selectedToken} show={additonalInformationModalShow} onHide={() => setAdditionalInformationModalShow(false)} />
                <TransferModal selectedToken={selectedToken} show={transferModalShow} onHide={() => setTransferModalShow(false)} />
            </Container>
            <br></br>
            </LoadingOverlay>
            </span>
        </div>
    );
}