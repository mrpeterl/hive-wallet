import { React, useState } from 'react';
import logo from './logo.svg';
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import {keychain, isKeychainInstalled, hasKeychainBeenUsed, keychainRequestSign} from '@hiveio/keychain';
import LoginModal from '../login/Login';
import './Home.css'
import LoadingOverlay from 'react-loading-overlay';
import { BlogDashboard } from '../blog/BlogDashboard';
import { Navigation } from '../navigation/Navigation';

const {success, msg, cancel, notInstalled, notActive} = await keychain(window, 'requestTransfer', 'mrpeterl', 'therealwolf', 5,  'test memo', 'HIVE');
//const message = await keychainRequestSign(window, 'test', 'test', '', 'mrpeterl', 'https://api.hive.blog');

//console.log(success + ' - ' + msg + ' - ' + cancel + ' - ' + notInstalled + ' - ' + notActive);
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
      //alert('Please allow Keychain to access this website')
   } else if(notInstalled) {
     // alert('Please install Keychain')
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