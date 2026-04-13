import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products from DummyJSON API
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://dummyjson.com/products?limit=8');
        const data = await response.json();
        const mappedData = data.products.map(p => ({
          ...p,
          image: p.thumbnail,
          rating: { rate: p.rating, count: Math.floor(Math.random() * 100) + 10 }
        }));
        setFeaturedProducts(mappedData);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-primary text-white py-5 mb-5 hero-section position-relative overflow-hidden">
        <Container className="py-5 position-relative z-1">
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="display-4 fw-bold mb-3">Welcome to FreshCart</h1>
              <p className="lead mb-4">
                Discover the best products at the most affordable prices. Upgrade your lifestyle with our premium collections.
              </p>
              <Button as={Link} to="/products" variant="warning" size="lg" className="fw-bold px-4 rounded-pill shadow">
                Shop Now
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Featured Products */}
      <Container className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-0">Featured Collections</h2>
            <p className="text-muted mb-0">Handpicked products just for you</p>
          </div>
          <Link to="/products" className="btn btn-outline-primary rounded-pill px-4 fw-bold">View All</Link>
        </div>
        
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {featuredProducts.map((product) => (
              <Col key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Home;
