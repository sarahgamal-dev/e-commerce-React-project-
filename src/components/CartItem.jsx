import React from 'react';
import { Button, Row, Col, Image } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { BsTrash } from 'react-icons/bs';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <Row className="align-items-center mb-3 p-3 bg-white border rounded shadow-sm">
      <Col xs={3} md={2} className="text-center">
        <Image src={item.image} alt={item.title} fluid style={{ maxHeight: '80px', objectFit: 'contain' }} />
      </Col>
      <Col xs={9} md={4} className="mb-2 mb-md-0">
        <h6 className="text-truncate mb-1">{item.title}</h6>
        <span className="text-muted small">${item.price?.toFixed(2)}</span>
      </Col>
      <Col xs={6} md={3} className="d-flex align-items-center justify-content-center justify-content-md-start">
        <div className="d-flex align-items-center border rounded">
          <Button 
            variant="light" 
            size="sm" 
            className="border-0" 
            onClick={() => updateQuantity(item.id, -1)}
            disabled={item.quantity <= 1}
          >
            -
          </Button>
          <span className="px-3 fw-bold">{item.quantity}</span>
          <Button 
            variant="light" 
            size="sm" 
            className="border-0" 
            onClick={() => updateQuantity(item.id, 1)}
          >
            +
          </Button>
        </div>
      </Col>
      <Col xs={6} md={3} className="d-flex justify-content-between align-items-center mt-2 mt-md-0">
        <span className="fw-bold">${(item.price * item.quantity).toFixed(2)}</span>
        <Button variant="outline-danger" size="sm" onClick={() => removeFromCart(item.id)}>
          <BsTrash />
        </Button>
      </Col>
    </Row>
  );
};

export default CartItem;
