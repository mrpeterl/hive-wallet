import { Form, FormControl, Button, Nav, Navbar, NavDropdown, Container } from "react-bootstrap";
import logo from '../home/logo.svg';

async function handleSearch() {
  const query = document.getElementById('searchQuery').value;
  window.location.href = '/home/search?query=' + query; 
}

export function Navigation() {

    function logout () {
        window.localStorage.removeItem('userData');
    }


    return(
    <Navbar bg="warning" variant="light">
    <Container>
      <Navbar.Brand href="/home/trending">
        <img
          alt=""
          src={logo}
          width="30"
          height="30"
          className="d-inline-block align-top"
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
          </NavDropdown>
        <NavDropdown disabled='true' title="Blogs" id="basic-nav-dropdown">
            <NavDropdown.Item href="/home/trending">Trending</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/home/hot">Hot</NavDropdown.Item>
          </NavDropdown>
        <NavDropdown disabled='true' title="Trading" id="basic-nav-dropdown">
            <NavDropdown.Item href="/home/trending">Trending</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/home/hot">Hot</NavDropdown.Item>
          </NavDropdown>
      <Form className="d-flex">
        <FormControl
          type="search"
          id="searchQuery"
          placeholder="Search"
          className="me-2"
          aria-label="Search"
        />
        <Button onClick={handleSearch} variant="outline-success">Search</Button>
      </Form>
        </Nav>
      <Navbar.Collapse className="justify-content-end">
      <NavDropdown title={JSON.parse(localStorage.getItem('userData')).username} id="basic-nav-dropdown">
            <NavDropdown.Item onClick={logout} href="/">Logout</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
          </NavDropdown>
      </Navbar.Collapse>
      </Container>
  </Navbar>  
  )
}