import React from 'react';
import { Navbar, Container, Nav, Badge } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { BsCart3 } from 'react-icons/bs';

const AppNavbar = () => {
  const { getTotalItemsCount } = useCart();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
          <span className="text-warning">Fresh</span>Cart
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
            <Nav.Link as={NavLink} to="/products">Products</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/cart" className="position-relative">
              <BsCart3 size={24} />
              {getTotalItemsCount() > 0 && (
                <Badge
                  pill
                  bg="warning"
                  text="dark"
                  className="position-absolute"
                  style={{ top: '0', right: '-5px', fontSize: '0.7em' }}
                >
                  {getTotalItemsCount()}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
