
import React, { useState } from 'react';
import { Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { AwesomeButton } from 'react-awesome-button';
import { fetchHiveData, processHiveTransaction } from '../../utils/hiveTx';

export default function TransferNftModal(props) {
    
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

    async function Transfer() {
        const username = document.getElementById('username').value;

        const operations = [
            [
              'custom_json',
              {
                id: 'ssc-mainnet-hive',
                json: JSON.stringify({
                    contractName: 'nft',
                    contractAction: 'transfer',
                    contractPayload: {
                        nfts: [{symbol: props.selectednft.symbol, ids: [JSON.stringify(props.selectednft.id)]}],
                        to: username,
                        memo: ''
                    }
                }),
                required_auths: [JSON.parse(localStorage.getItem('userData')).username],
                required_posting_auths: []
              }
            ]
          ]
        await processHiveTransaction(operations);
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
          Transfer NFT
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
            <h2>Token</h2>
            <h6>{props.selectednft.name}</h6>
            <br></br>

            <h2>ID</h2>
            <h6>{props.selectednft.id}</h6>
            <br></br>
          <Form.Group className="mb-3">
            <Form.Label>Recipient</Form.Label>
            <Form.Control onChange={() => {checkValidUser();}} isInvalid={usernameError}  required id="username" type="username" placeholder="Username" />
            <Form.Control.Feedback type="invalid" >The entered Recipent was not found on the HIVE network. Please double check and try again.</Form.Control.Feedback>
         
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
