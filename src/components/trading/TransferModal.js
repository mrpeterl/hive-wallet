
import React, { useState } from 'react';
import { Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { AwesomeButton } from 'react-awesome-button';
import { fetchHiveData, processHiveTransaction } from '../../utils/hiveTx';
export default function TransferModal(props) {
    
  const [balanceError, setBalanceError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);

  const [disableButton, setDisableButton] = useState(false);
    async function checkValidUser() {
        const username = document.getElementById('username').value;
        const operations = [[username]]
        const accounts = await fetchHiveData('condenser_api.get_accounts', operations);
        if (
            !accounts ||
            !accounts.result ||
            !Array.isArray(accounts.result) ||
            accounts.result.length < 1
          ) {
            setUsernameError(true);
            setDisableButton(true);
            return;
          }
            setUsernameError(false);  
            setDisableButton(false);
    }

    async function checkBalance() {
        const amount = parseFloat(document.getElementById('amount').value);
        const balance = parseFloat(props.selectedToken.balance);

        if(amount > balance) {
            setBalanceError(true);
            setDisableButton(true);
            return;
        }
        setBalanceError(false);
        setDisableButton(false);
    }


    async function Transfer() {
        const username = document.getElementById('username').value;
        const amount = document.getElementById('amount').value;

        const jsonMetadata = {
            contractName: 'tokens',
            contractAction: 'transfer',
            contractPayload: {
                symbol: props.selectedToken.symbol,
                to: username,
                quantity: amount,
                memo: ''
            }
        }
        const operations = [
            [
              'custom_json',
              {
                id: 'ssc-mainnet-hive',
                json: JSON.stringify(jsonMetadata),
                required_auths: [JSON.parse(localStorage.getItem('userData')).username],
                required_posting_auths: []
              }
            ]
          ]
        const response = await processHiveTransaction(operations);
        console.log(response);
        return;
    }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Transfer Cryptocurrency
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
            <h2>Token</h2>
            <h6>{props.selectedToken.symbol}</h6>
            <br></br>
            
            <h2>Balance</h2>
            <h6>{props.selectedToken.balance}</h6>
            <br></br>
          <Form.Group className="mb-3">
            <Form.Label>Recipient</Form.Label>
            <Form.Control onChange={() => {checkValidUser();}} isInvalid={usernameError}  required id="username" type="username" placeholder="Username" />
            <Form.Control.Feedback type="invalid" >The entered Recipent was not found on the HIVE network. Please double check and try again.</Form.Control.Feedback>
         
          </Form.Group>

          <Form.Group className="mb-3" >
            <Form.Label>Amount</Form.Label>
            <Form.Control onChange={() => {checkBalance();}} isInvalid={balanceError} id="amount" type="number" placeholder="0.00" />
            <Form.Control.Feedback type="invalid" >The amount entered exceeds your balance.</Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <AwesomeButton disabled={disableButton} id="login-form-btn" className="center mr-auto" size="large" type="primary" action={Transfer}>Transfer</AwesomeButton>
        <AwesomeButton className="center mr-auto" size="large" type="secondary" action={props.onHide}>Close</AwesomeButton>
      </Modal.Footer>
    </Modal>
  );
}
