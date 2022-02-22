import { React, useState } from 'react';
import logo from './logo.svg';
import hive from '@hiveio/hive-js';
import { Modal, Button } from "react-bootstrap";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import {keychain, isKeychainInstalled, hasKeychainBeenUsed, keychainRequestSign} from '@hiveio/keychain';
import LoginModal from '../login/Login';
import './Home.scss'

const {success, msg, cancel, notInstalled, notActive} = await keychain(window, 'requestTransfer', 'mrpeterl', 'therealwolf', 5,  'test memo', 'HIVE');
//const message = await keychainRequestSign(window, 'test', 'test', '', 'mrpeterl', 'https://api.hive.blog');

console.log(success + ' - ' + msg + ' - ' + cancel + ' - ' + notInstalled + ' - ' + notActive);
console.log(isKeychainInstalled(window));
console.log(hasKeychainBeenUsed());
//console.log(message);
// All good
if(success) {
  // do your thing
 }
 // User didn't cancel, so something must have happened
 else if(!cancel) {
   if(notActive) {
      alert('Please allow Keychain to access this website')
   } else if(notInstalled) {
      alert('Please install Keychain')
   } else {
     // error happened - check msg
   }
 }

export function HomeNoAuth() {
  const [modalShow, setModalShow] = useState(false);
  return (
    <div className="App">
        <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
            Edit <code>src/App.js</code> and save to reload.
        </p>
        <span>

            <AwesomeButton action={() => setModalShow(true)} variant="primary" type="primary">Sign In</AwesomeButton>
            <LoginModal show={modalShow} onHide={() => setModalShow(false)} />
            <div className='divider'></div>
            <AwesomeButton type="secondary">Sign Up</AwesomeButton>
        </span>
        </header>
        
    </div>
  );
}


export function Home() {
  console.log(JSON.parse(localStorage.getItem('userData')).username);
  hive.api.getAccounts([JSON.parse(localStorage.getItem('userData')).username], function(err, result) {
    console.log(err, result);
  });

  return (
    <div className="App">
        <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
            Edit <code>src/App.js</code> and save to reload.
        </p>
        <span>

        </span>
        </header>
        
    </div>
  );
}

export default HomeNoAuth;