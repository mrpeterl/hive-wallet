import { React, useState } from 'react';
import logo from './beehive.svg';
import { AwesomeButton } from "react-awesome-button";
import { Modal } from "react-bootstrap";
import "react-awesome-button/dist/styles.css";
import {keychain, isKeychainInstalled, hasKeychainBeenUsed, keychainRequestSign} from '@hiveio/keychain';
import LoginModal from '../login/Login';
import './Home.css'
import LoadingOverlay from 'react-loading-overlay';
import { BlogDashboard } from '../blog/BlogDashboard';
import { Navigation } from '../navigation/Navigation';

function SignUpModal(props) {
  return(
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
          Sign Up
      </Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <h5>Hive powers many apps and is run completely decentralized by community members all around the world.</h5>
          <br></br>
          <h5>With an account, you have direct access to the ecosystem.</h5>
          <br></br>
          <h5>Several account creation services are provided by the community, offering you different levels of privacy and ease-of-use.</h5>
          <br></br>
          <h5>Signup at: <a target="_blank" href='https://signup.hive.io/'>https://signup.hive.io/</a></h5>
      </Modal.Body>
      <Modal.Footer>
      <AwesomeButton className="center mr-auto" size="large" type="secondary" action={props.onHide}>Close</AwesomeButton>
      </Modal.Footer>
  </Modal>
);

}

export function HomeNoAuth() {
  const [modalShow, setModalShow] = useState(false);  
  const [signUpModalShow, setSignUpModalShow] = useState(false);

  return (
    <div className="App">
        <header className="App-header">
        <img src={logo} alt="logo" />
        <span>

            <AwesomeButton action={() => setModalShow(true)} variant="primary" type="primary">Sign In</AwesomeButton>
            <LoginModal show={modalShow} onHide={() => setModalShow(false)} />
            <div className='divider'></div>
            <AwesomeButton action={() => setSignUpModalShow(true)} show={signUpModalShow} type="secondary">Sign Up</AwesomeButton>
            <SignUpModal show={signUpModalShow} onHide={() => setSignUpModalShow(false)}></SignUpModal>
        </span>
        </header>
        
    </div>
  );
}

export function Home() {

  const [loading, setLoading] = useState(false);

  function handleLoading(bool) {
    setLoading(bool);
  } 

  return (
    <div className="App">
      <LoadingOverlay
        active={loading}
        spinner
        text='Loading your content...'
        > 
        <Navigation />
        <BlogDashboard handleLoading={handleLoading} />
      </LoadingOverlay>
       
    </div>
  );
}

export default HomeNoAuth;