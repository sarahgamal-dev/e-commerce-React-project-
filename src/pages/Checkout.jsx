import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { BsCheckCircleFill } from 'react-icons/bs';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zip.trim()) newErrors.zip = 'ZIP code is required';
    
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validate();
    
    if (Object.keys(formErrors).length === 0) {
      // Simulate API call for checkout
      setIsSuccess(true);
      clearCart();
    } else {
      setErrors(formErrors);
    }
  };

  if (isSuccess) {
    return (
      <Container className="py-5 text-center">
        <Col md={8} lg={6} className="mx-auto bg-white p-5 rounded shadow-sm border">
          <BsCheckCircleFill size={80} className="text-success mb-4" />
          <h2 className="fw-bold mb-3">Order Placed Successfully!</h2>
          <p className="text-muted mb-4 lead">
            Thank you for your purchase, {formData.name}. Your order will be shipped to {formData.address}, {formData.city} shortly.
          </p>
          <Button as={Link} to="/" variant="primary" className="px-4 py-2 rounded-pill fw-bold">
            Continue Shopping
          </Button>
        </Col>
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return (
        <Container className="py-5 text-center">
          <Alert variant="warning" className="d-inline-block py-4 px-5 shadow-sm">
            <h4 className="fw-bold">Your cart is empty!</h4>
            <p>You need to add items to your cart before proceeding to checkout.</p>
            <Button as={Link} to="/products" variant="primary" className="mt-2">Go to Products</Button>
          </Alert>
        </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4">Checkout</h2>
      <Row className="gy-4">
        <Col lg={7}>
          <Card className="shadow-sm border-0 bg-white">
            <Card.Body className="p-4 p-md-5">
              <h4 className="fw-bold mb-4">Shipping Details</h4>
              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                    placeholder="John Doe"
                  />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    placeholder="john@example.com"
                  />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    isInvalid={!!errors.address}
                    placeholder="123 Main St, Apt 4B"
                  />
                  <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                </Form.Group>

                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        isInvalid={!!errors.city}
                        placeholder="New York"
                      />
                      <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mt-3 mt-md-0">
                    <Form.Group>
                      <Form.Label>ZIP Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        isInvalid={!!errors.zip}
                        placeholder="10001"
                      />
                      <Form.Control.Feedback type="invalid">{errors.zip}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <h4 className="fw-bold mb-3 mt-5">Payment Information</h4>
                <Alert variant="info" className="mb-4">
                  This is a demo store. No real payment is required.
                </Alert>

                <Button variant="success" type="submit" size="lg" className="w-100 fw-bold py-3 shadow">
                  Place Order (${getCartTotal().toFixed(2)})
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="shadow-sm border-0 bg-light sticking-card mt-3 mt-lg-0" style={{ position: 'sticky', top: '100px' }}>
            <Card.Body className="p-4">
              <h4 className="fw-bold mb-4">Your Items</h4>
              <div className="d-flex flex-column gap-3 mb-4">
                {cartItems.map(item => (
                  <div key={item.id} className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                       <span className="badge bg-secondary me-2">{item.quantity}x</span>
                       <span className="text-truncate d-inline-block" style={{ maxWidth: '200px' }}>{item.title}</span>
                    </div>
                    <span className="fw-bold text-nowrap ms-2">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <div className="d-flex justify-content-between fs-5 fw-bold">
                <span>Total</span>
                <span className="text-primary">${getCartTotal().toFixed(2)}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
