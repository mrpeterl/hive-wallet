import React, { useState } from 'react';
import { Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { AwesomeButton } from 'react-awesome-button';
import "./Login.css"
import { fetchHiveData, getPublicKey } from '../../utils/hiveTx';

const userData = {
  authorized: false,
  username: '',
  key: ''
}


export default function LoginModal(props) {
  
  const [keyError, setKeyError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const validatePostingKey = async (username, privateKey) => {
    const operations = [[username]]
    const accounts = await fetchHiveData('condenser_api.get_accounts', operations);
    if (
      !accounts ||
      !accounts.result ||
      !Array.isArray(accounts.result) ||
      accounts.result.length < 1
    ) {
      return { result: 0, error: 'Network error or wrong username' }
    }
    try {
      const account = accounts.result[0]
      const publicWif = account.posting.key_auths[0][0] || ''
      const generatedPublicKey = await getPublicKey(privateKey);
      console.log(account)
      if (generatedPublicKey !== publicWif) {
        
        return { result: 0, error: 'Wrong key' }
      }
      return { result: 1 }
    } catch (e) {
      return { result: 0, error: 'Wrong key or network error' }
    }
  }
  async function Login() {
    setDisableButton(true);
    const username = document.getElementById('username').value;
    if(username == '') {
      setUsernameError(true);
      setDisableButton(false);
      return;
    }
    const keyField = document.getElementById('key');
    const validate = await validatePostingKey(username, keyField.value);
    if (validate.result === 0) {
      console.log(validate)
      setKeyError(true);
      return;
    }
    userData.authorized = true;
    userData.username = username;
    userData.key = keyField.value;
    window.localStorage.setItem('userData', JSON.stringify(userData));
    window.location.href = '/home/trending';
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
          Login to HIVE Wallet
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Centered Modal</h4>
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control onChange={() => {setUsernameError(false);}} isInvalid={usernameError}  required id="username" type="username" placeholder="Username" />
            <Form.Control.Feedback type="invalid" >The field Username is required and must have a value.</Form.Control.Feedback>
         
          </Form.Group>

          <Form.Group className="mb-3" >
            <Form.Label>Private Key</Form.Label>
            <Form.Control onChange={() => {setKeyError(false); setDisableButton(false);}} isInvalid={keyError} id="key" type="password" placeholder="Private Key" />
            <Form.Control.Feedback type="invalid" >The private key does not match the username provided. Please double check and try again.</Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <AwesomeButton disabled={disableButton} id="login-form-btn" className="center mr-auto" size="large" type="primary" action={Login}>Login</AwesomeButton>
        <AwesomeButton className="center mr-auto" size="large" type="secondary" action={props.onHide}>Close</AwesomeButton>
      </Modal.Footer>
    </Modal>
  );
}
