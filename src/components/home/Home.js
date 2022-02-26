import { React, useState, useEffect } from 'react';
import logo from './logo.svg';
import hive from '@hiveio/hive-js';
import RemoveMarkdown from 'remove-markdown';
import { Stack, Card, Navbar, NavDropdown, Container, Modal, Button } from "react-bootstrap";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import {keychain, isKeychainInstalled, hasKeychainBeenUsed, keychainRequestSign} from '@hiveio/keychain';
import LoginModal from '../login/Login';
import './Home.css'

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

function logout () {
  window.localStorage.removeItem('userData')
  //updateState()
}

export function Home() {

  const [blogs, setBlogs]=useState([]);

  
  const getBlogs = async () => {
    await hive.api.getDiscussionsByTrending({limit: 8}, function(err, result) {
      console.log(err, result);
      setBlogs(result);
    });
  }
  useEffect(() => {
  getBlogs();
  }, [])
  return (
    <div className="App">
        <Navbar bg="warning" variant="light">
          <Container>
            <Navbar.Brand href="#home">
              <img
                alt=""
                src={logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{' '}
            HIVE Wallet
            </Navbar.Brand>

            <Navbar.Collapse className="justify-content-end">
            <NavDropdown title={JSON.parse(localStorage.getItem('userData')).username} id="basic-nav-dropdown">
                  <NavDropdown.Item onClick={logout} href="/">Logout</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                </NavDropdown>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <span style={{backgroundColor: 'hsla(56, 64%, 67%, 0.863)', display: 'block'}}>
          <br />
          <Container className='selector bg-dark' style={{ height:'95%', width: '100%'}}>
            {
            blogs && blogs.map(blog => {
            return(
              <div key={blog.permlink} style={{paddingBottom: '0.5%', paddingTop: '0.5%'}}>
                <div className="card mb-3" style={{marginLeft: 'auto', marginRight: 'auto', width: '98%'}}>
                  <div className="row no-gutters">
                    <div className="col-md-4">
                      <div className="crop">
                        <img src={JSON.parse(blog.json_metadata).image[0]} alt="Donald Duck" />
                      </div>
                    
                    </div>
                    <div className="col-md-7">
                      <div className="card-body">
                        <h5 className="card-title" style={{color: 'black'}}>{blog.title}</h5>
                        <p className="card-text">
                          <small className="text-muted">by {blog.author}</small>
                        </p>
                        <p className="card-text">
                          {RemoveMarkdown(blog.body).substring(0, 310)}...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
            )})}
          </Container>
          <br />  <br />  <br />  <br />
        </span>
        
    </div>
  );
}

export default HomeNoAuth;