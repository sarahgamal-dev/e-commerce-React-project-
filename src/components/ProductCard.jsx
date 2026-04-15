import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <Card className={`h-100 shadow-sm border-0 product-card ${['smartphones', 'laptops', 'mobile-accessories'].includes(product.category) ? 'glow-effect' : ''}`}>
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
      <Card.Body className="d-flex flex-column bg-white pt-2">
        <div className="product-accent-line"></div>
        <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
          <Card.Title className="text-truncate fw-bold mb-0" title={product.title} style={{ fontSize: '1rem' }}>
            {product.title}
          </Card.Title>
        </Link>
        <Card.Text className="text-muted mb-3" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
          {product.category.toUpperCase().replace(/-/g, ' ')}
        </Card.Text>
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-bold text-primary" style={{ fontSize: '1.1rem' }}>${(product.price || 0).toFixed(2)}</span>
            <div className="d-flex align-items-center gap-1">
              <span className="text-warning small">★</span>
              <span className="small fw-bold text-muted">{product.rating?.rate || '0.0'}</span>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
