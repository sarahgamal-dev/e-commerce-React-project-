import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Image, Badge, Spinner } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { BsArrowLeft } from 'react-icons/bs';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        const data = await response.json();
        const mappedData = {
          ...data,
          image: data.thumbnail,
          rating: { rate: data.rating, count: Math.floor(Math.random() * 100) + 10 }
        };
        setProduct(mappedData);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5 text-center">
        <h2>Product not found.</h2>
        <Button as={Link} to="/products" variant="primary" className="mt-3">Back to Products</Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Link to="/products" className="text-decoration-none text-secondary mb-4 d-inline-block">
        <BsArrowLeft className="me-2" /> Back to Products
      </Link>
      
      <Row className="gy-5 bg-white p-4 p-md-5 rounded shadow-sm border border-light">
        <Col md={6} className="d-flex align-items-center justify-content-center">
          <Image 
            src={product.image} 
            alt={product.title} 
            fluid 
            style={{ maxHeight: '400px', objectFit: 'contain' }} 
            className="p-3"
          />
        </Col>
        <Col md={6} className="d-flex flex-column justify-content-center">
          <Badge bg="info" className="align-self-start mb-2 px-3 py-2 text-capitalize">
            {product.category}
          </Badge>
          <h1 className="fw-bold mb-3">{product.title}</h1>
          <div className="d-flex align-items-center mb-4">
            <span className="fs-3 fw-bold text-primary me-3">${product.price?.toFixed(2)}</span>
            <span className="text-warning border border-warning px-2 rounded">
              ★ {product.rating?.rate} ({product.rating?.count} reviews)
            </span>
          </div>
          <p className="text-muted mb-4 lead" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            {product.description}
          </p>
          <Button 
            variant="primary" 
            size="lg" 
            className="w-100 fw-bold shadow-sm py-3"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
