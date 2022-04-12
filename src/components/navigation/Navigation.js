import { Form, FormControl, Button, Nav, Navbar, NavDropdown, Container } from "react-bootstrap";
import logo from '../home/beehive.svg';
import React, { useState } from 'react';

export function Navigation() {

    const [searchError, setSearchError] = useState(false);
    function logout () {
        window.localStorage.removeItem('userData');
    }

    async function handleSearch() {
      const query = document.getElementById('searchQuery').value;
      if(query == '') {
        setSearchError(true);
        return;
      }
      window.location.href = '/home/search?query=' + query; 
    }
    
    return(
    <Navbar bg="warning" variant="light">
    <Container>
      <Navbar.Brand href="/home/trending">
        <img
          alt=""
          src={logo}
          width="60em"
          height="60em"
          className="d-inline-block align-middle"
        />{' '}
      HIVE Wallet
      </Navbar.Brand>

      </Container>
      <Container>
      <Nav className="me-auto">
        <NavDropdown title="Blogs" id="basic-nav-dropdown">
            <NavDropdown.Item href="/home/trending">Trending</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/home/hot">Hot</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/blog/create">Create Blog</NavDropdown.Item>
        </NavDropdown>
        <NavDropdown title="Trading" id="basic-nav-dropdown">
            <NavDropdown.Item href="/trading">All Coins</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/trading/myWallet">My Wallet</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link href="/nft/gallery">NFTs</Nav.Link>

      <Form className="d-flex">
        <FormControl
          onChange={() => {setSearchError(false); }}
          isInvalid={searchError}
          type="search"
          id="searchQuery"
          placeholder="Search"
          className="me-2"
          aria-label="Search"
        />            
        <Form.Control.Feedback type="invalid" >Please enter a search term.</Form.Control.Feedback>
        <Button style={{display: 'inline-block', marginRight: '20%'}} onClick={handleSearch} variant="outline-success">Search</Button>
      </Form>
        </Nav>
      <Navbar.Collapse className="justify-content-end">
      <NavDropdown style={{display: 'inline-block', paddingLeft: '10%', paddingRight: '20%'}} title={JSON.parse(localStorage.getItem('userData')).username} id="basic-nav-dropdown">
            <NavDropdown.Item onClick={logout} href="/">Logout</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href={'/profile/' + JSON.parse(localStorage.getItem('userData')).username}>Profile</NavDropdown.Item>
          </NavDropdown>
      </Navbar.Collapse>
      </Container>
  </Navbar>  
  )
}