import React, { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { AwesomeButton } from 'react-awesome-button';
import  DataTable from 'react-data-table-component';
import { fetchHiveData }from '../../utils/hiveTx';

export default function TransactionHistoryModal(props) {
    
    const [transactionHistory, setTransactionHistory] = useState([{id: 'transfer', op: {}}]);

    async function getTransactionHistory() {
        const history = await fetchHiveData('account_history_api.get_account_history', { limit: 1000, account: JSON.parse(localStorage.getItem('userData')).username });        
        const transactions = history.result.history.reverse().filter(x => x[1].op.value.json);
        const selectedTokenTransactions = transactions.filter(x => JSON.parse(x[1].op.value.json).token == props.selectedToken.symbol);
        await setTransactionHistory(selectedTokenTransactions);        
    }

    const columns = [
        {
            sortable: true,
            name: 'Operation',
            width: '25%',
            selector: row => row[1].op.value.id,
        },
        {
            sortable: true,
            name: 'Type',
            width: '20%',
            selector: row =>JSON.stringify(JSON.parse(row[1].op.value.json).type),
        },
        {
            sortable: true,
            name: 'To',
            width: '20%',
            selector: row => JSON.stringify(JSON.parse(row[1].op.value.json).to),
        },
        {
            sortable: true,
            name: 'From',
            width: '20%',
            selector: row => JSON.stringify(JSON.parse(row[1].op.value.json).from),
        },
        {
            sortable: true,
            name: 'Quantity',
            width: '15%',
            selector: row => JSON.stringify(JSON.parse(row[1].op.value.json).qty),
        },
    ];


    useEffect(() => {
        getTransactionHistory();
    }, [props])

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Transaction History
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {
                    transactionHistory && <div style={{borderRadius:'0px'}}>
                                <DataTable  theme='dark' noHeader={true} columns={columns} data={transactionHistory} pagination paginationPerPage={20} />
                            </div>
                }
            </Modal.Body>
            <Modal.Footer>
            <AwesomeButton className="center mr-auto" size="large" type="secondary" action={props.onHide}>Close</AwesomeButton>
            </Modal.Footer>
        </Modal>
    );
}