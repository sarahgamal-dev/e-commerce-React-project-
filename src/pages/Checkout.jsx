import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { BsCheckCircleFill, BsCreditCard2Front, BsShieldLock, BsArrowLeft } from 'react-icons/bs';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const validate = () => {
    const newErrors = {};
    // Shipping validation
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zip.trim()) newErrors.zip = 'ZIP code is required';
    
    // Payment validation
    if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Card number must be 16 digits';
    
    if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
    else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) newErrors.expiryDate = 'Use MM/YY format';
    
    if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
    else if (!/^\d{3,4}$/.test(formData.cvv)) newErrors.cvv = 'CVV must be 3 or 4 digits';
    
    return newErrors;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    }
    // Format expiry date
    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length > 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      value = value.slice(0, 5);
    }
    // Format CVV
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData({ ...formData, [name]: value });
    
    // Clear error for field
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validate();
    
    if (Object.keys(formErrors).length === 0) {
      setIsProcessing(true);
      
      // Simulate API call for checkout (2 seconds delay)
      setTimeout(() => {
        const randomOrderNum = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        setOrderNumber(randomOrderNum);
        setIsSuccess(true);
        setIsProcessing(false);
        clearCart();
      }, 2000);
    } else {
      setErrors(formErrors);
      // Scroll to first error
      const firstError = Object.keys(formErrors)[0];
      const element = document.getElementsByName(firstError)[0];
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (isSuccess) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6} className="text-center">
            <div className="bg-white p-5 rounded-4 shadow-lg border-0 mb-4 animate__animated animate__zoomIn">
              <BsCheckCircleFill size={90} className="text-success mb-4 d-inline-block shadow-sm rounded-circle p-1" />
              <h2 className="fw-bold mb-3 text-dark">Order Confirmed!</h2>
              <p className="text-muted mb-2 fs-5">Thank you for your purchase, <span className="text-primary fw-semibold">{formData.name}</span></p>
              <div className="bg-light p-3 rounded-3 mb-4 border">
                <p className="mb-1 text-uppercase small fw-bold text-muted ls-1">Order Number</p>
                <h4 className="fw-bold text-dark mb-0">{orderNumber}</h4>
              </div>
              <p className="text-muted mb-4">
                We've sent a confirmation email to <strong>{formData.email}</strong>. Your order will be shipped to <strong>{formData.address}, {formData.city}</strong> soon!
              </p>
              <div className="d-grid gap-2">
                <Button as={Link} to="/" variant="primary" size="lg" className="rounded-pill fw-bold py-3 shadow-sm border-0">
                  Continue Shopping
                </Button>
                <Button as={Link} to="/products" variant="outline-primary" className="rounded-pill border-0 fw-semibold">
                  View More Products
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return (
        <Container className="py-5 text-center">
          <div className="animate__animated animate__fadeIn">
            <Alert variant="info" className="d-inline-block py-5 px-5 shadow rounded-4 border-0">
              <div className="mb-4 text-primary opacity-50">
                <BsCreditCard2Front size={64} />
              </div>
              <h4 className="fw-bold text-dark mb-3">Your checkout is lonely!</h4>
              <p className="text-muted mb-4 px-md-5">You need to add items to your cart before proceeding to checkout.</p>
              <Button as={Link} to="/products" variant="primary" className="rounded-pill px-5 fw-bold shadow">Browse Products</Button>
            </Alert>
          </div>
        </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="mb-4 d-flex align-items-center gap-2">
        <Link to="/cart" className="text-muted text-decoration-none d-flex align-items-center gap-1 hover-primary">
          <BsArrowLeft /> Back to Cart
        </Link>
      </div>
      
      <h2 className="fw-bold mb-4 display-6">Secure Checkout</h2>
      
      <Row className="gy-4">
        <Col lg={7}>
          <Form onSubmit={handleSubmit} noValidate>
            {/* Shipping Card */}
            <Card className="shadow-sm border-0 bg-white rounded-4 overflow-hidden mb-4">
              <div className="bg-primary bg-opacity-10 p-4 border-bottom border-primary border-opacity-10 d-flex align-items-center gap-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>1</div>
                <h4 className="fw-bold mb-0 text-primary">Shipping Information</h4>
              </div>
              <Card.Body className="p-4 p-md-5">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small text-muted text-uppercase ls-1">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                    placeholder="Enter your full name"
                    className="py-2 border-light-subtle bg-light bg-opacity-10"
                  />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small text-muted text-uppercase ls-1">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    placeholder="name@example.com"
                    className="py-2 border-light-subtle bg-light bg-opacity-10"
                  />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small text-muted text-uppercase ls-1">Street Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    isInvalid={!!errors.address}
                    placeholder="123 Shopping St, Apt 4B"
                    className="py-2 border-light-subtle bg-light bg-opacity-10"
                  />
                  <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                </Form.Group>

                <Row className="mb-0">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold small text-muted text-uppercase ls-1">City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        isInvalid={!!errors.city}
                        placeholder="City"
                        className="py-2 border-light-subtle bg-light bg-opacity-10"
                      />
                      <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold small text-muted text-uppercase ls-1">ZIP / Postal Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        isInvalid={!!errors.zip}
                        placeholder="ZIP Code"
                        className="py-2 border-light-subtle bg-light bg-opacity-10"
                      />
                      <Form.Control.Feedback type="invalid">{errors.zip}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Payment Card */}
            <Card className="shadow-sm border-0 bg-white rounded-4 overflow-hidden mb-4">
              <div className="bg-success bg-opacity-10 p-4 border-bottom border-success border-opacity-10 d-flex align-items-center gap-3">
                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>2</div>
                <h4 className="fw-bold mb-0 text-success">Payment Method</h4>
              </div>
              <Card.Body className="p-4 p-md-5">
                <div className="mb-4 bg-light p-3 rounded-3 border d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <BsCreditCard2Front className="text-muted" size={24} />
                    <span className="fw-semibold">Credit / Debit Card</span>
                  </div>
                  <BsShieldLock className="text-muted" />
                </div>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small text-muted text-uppercase ls-1">Card Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    isInvalid={!!errors.cardNumber}
                    placeholder="0000 0000 0000 0000"
                    className="py-2 border-light-subtle bg-light bg-opacity-10"
                  />
                  <Form.Control.Feedback type="invalid">{errors.cardNumber}</Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold small text-muted text-uppercase ls-1">Expiry Date</Form.Label>
                      <Form.Control
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        isInvalid={!!errors.expiryDate}
                        placeholder="MM / YY"
                        className="py-2 border-light-subtle bg-light bg-opacity-10"
                      />
                      <Form.Control.Feedback type="invalid">{errors.expiryDate}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold small text-muted text-uppercase ls-1">Security Code (CVV)</Form.Label>
                      <Form.Control
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        isInvalid={!!errors.cvv}
                        placeholder="123"
                        className="py-2 border-light-subtle bg-light bg-opacity-10"
                      />
                      <Form.Control.Feedback type="invalid">{errors.cvv}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <p className="small text-muted mb-0 mt-2">
                  <BsShieldLock className="me-1" /> Your information is encrypted and securely processed.
                </p>
              </Card.Body>
            </Card>

            <Button 
              variant="success" 
              type="submit" 
              size="lg" 
              className="w-100 fw-bold py-3 shadow rounded-pill d-flex align-items-center justify-content-center gap-2 border-0"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Spinner animation="border" size="sm" />
                  Processing Order...
                </>
              ) : (
                `Confirm & Pay $${getCartTotal().toFixed(2)}`
              )}
            </Button>
          </Form>
        </Col>

        <Col lg={5}>
          <Card className="shadow-sm border-0 bg-white rounded-4 sticky-top overflow-hidden" style={{ top: '100px', zIndex: 10 }}>
            <div className="bg-light p-4 border-bottom">
              <h4 className="fw-bold mb-0">Order Summary</h4>
            </div>
            <Card.Body className="p-4">
              <div className="cart-summary-items mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {cartItems.map(item => (
                  <div key={item.id} className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="position-relative">
                        <img src={item.image} alt={item.title} className="rounded" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="text-truncate" style={{ maxWidth: '180px' }}>
                        <h6 className="mb-0 fw-semibold">{item.title}</h6>
                        <small className="text-muted">${item.price.toFixed(2)} each</small>
                      </div>
                    </div>
                    <span className="fw-bold text-dark">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-light p-3 rounded-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Subtotal</span>
                  <span className="fw-semibold">${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                  <span className="text-muted small">Shipping</span>
                  <span className="text-success fw-bold small">FREE</span>
                </div>
                <div className="d-flex justify-content-between fs-4 fw-bold text-dark">
                  <span>Total</span>
                  <span className="text-primary">${getCartTotal().toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 border rounded-3 border-warning border-opacity-25 bg-warning bg-opacity-10 d-flex gap-2 align-items-start">
                  <div className="text-warning " style={{ marginTop: '2px' }}>💡</div>
                  <small className="text-muted">Orders are processed immediately. You can track your order status in your account dashboard once confirmed.</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;

