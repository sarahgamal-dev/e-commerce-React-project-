import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <Card className={`h-100 shadow-sm border-0 product-card ${product.category === 'mobile-accessories' ? 'glow-effect' : ''}`}>
      <div className="product-image-container">
        <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
          <div className="p-3 bg-white" style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <Card.Img 
              variant="top" 
              src={product.image} 
              alt={product.title}
              className="card-img-top"
              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
            />
          </div>
        </Link>
        <div className="add-to-cart-overlay">
          <Button 
            variant="primary" 
            className="rounded-pill px-4 fw-bold shadow"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </Button>
        </div>
      </div>
      <Card.Body className="d-flex flex-column bg-white">
        <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
          <Card.Title className="text-truncate fw-bold mb-1" title={product.title}>{product.title}</Card.Title>
        </Link>
        <Card.Text className="text-muted small text-uppercase mb-3" style={{ letterSpacing: '1px' }}>
          {product.category.replace(/-/g, ' ')}
        </Card.Text>
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center">
            <span className="fs-5 fw-bold text-primary">${product.price?.toFixed(2)}</span>
            <div className="d-flex align-items-center">
              <span className="text-warning me-1">★</span>
              <span className="small fw-semibold">{product.rating?.rate || 'N/A'}</span>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
