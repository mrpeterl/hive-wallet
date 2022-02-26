import React from 'react';
import { Form, Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { AwesomeButton } from 'react-awesome-button';
import "./Login.css"
import hiveTx from "hive-tx";

const userData = {
  authorized: false,
  username: '',
  key: ''
}


const validatePostingKey = async (username, privateKey) => {
  const accounts = await hiveTx.call('condenser_api.get_accounts', [[username]])
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
    const generatedPublicKey = hiveTx.PrivateKey.from(privateKey)
      .createPublic()
      .toString()

    if (generatedPublicKey !== publicWif) {
      return { result: 0, error: 'Wrong key' }
    }
    return { result: 1 }
  } catch (e) {
    return { result: 0, error: 'Wrong key or network error' }
  }
}

async function login() {
  console.log('logging in')
  //const loginModal = bootstrap.Modal.getInstance(
  //  document.getElementById('login-modal')
  //)
  //const loginButtonForm = document.getElementById('login-form-btn')
  //loginButtonForm.setAttribute('disabled', 'true')
  //const loginError = document.getElementById('login-error')
  //loginError.style.display = 'none'
  const username = document.getElementById('username').value;
  const key = document.getElementById('key').value;
  const validate = await validatePostingKey(username, key)
  console.log(validate)
  if (validate.result === 0) {
    //loginError.innerHTML = validate.error
    //loginError.style.display = 'block'
    //loginButtonForm.removeAttribute('disabled')
    return
  }
  userData.authorized = true
  userData.username = username
  userData.key = key
  console.log(userData)
  window.localStorage.setItem('userData', JSON.stringify(userData))
  window.location.href = '/home';
  //loginButtonForm.removeAttribute('disabled')
  //updateState()
  //loginModal.hide()
}

export default function LoginModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
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
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control id="username" type="email" placeholder="Enter email" />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control id="key" type="password" placeholder="Password" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <AwesomeButton className="center mr-auto" size="large" type="primary" action={login}>Login</AwesomeButton>
        <AwesomeButton className="center mr-auto" size="large" type="secondary" action={props.onHide}>Close</AwesomeButton>
      </Modal.Footer>
    </Modal>
  );
}
