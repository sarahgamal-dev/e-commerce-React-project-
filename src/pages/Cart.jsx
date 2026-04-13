import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { BsCartX } from 'react-icons/bs';

const Cart = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <Container className="py-5 text-center">
        <div className="py-5 bg-white rounded shadow-sm">
          <BsCartX size={64} className="text-muted mb-4" />
          <h2 className="fw-bold text-muted mb-3">Your Cart is Empty</h2>
          <p className="mb-4">Looks like you haven't added anything to your cart yet.</p>
          <Button as={Link} to="/products" variant="primary" size="lg" className="rounded-pill px-5">
            Start Shopping
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4">Your Shopping Cart</h2>
      
      <Row className="gy-4">
        <Col lg={8}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Cart Items ({cartItems.length})</h5>
            <Button variant="outline-danger" size="sm" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
          
          <div className="d-flex flex-column gap-2">
            {cartItems.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </Col>
        
        <Col lg={4}>
          <Card className="shadow-sm border-0 bg-light">
            <Card.Body className="p-4">
              <h4 className="fw-bold mb-4">Order Summary</h4>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Subtotal</span>
                <span className="fw-bold">${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Shipping</span>
                <span className="text-success fw-bold">Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4 fs-5">
                <span className="fw-bold">Total</span>
                <span className="fw-bold text-primary">${getCartTotal().toFixed(2)}</span>
              </div>
              <Button as={Link} to="/checkout" variant="success" size="lg" className="w-100 fw-bold shadow-sm">
                Proceed to Checkout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
