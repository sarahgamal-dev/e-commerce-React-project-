import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, ButtonGroup, Button, Spinner } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Fetch all products
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://dummyjson.com/products?limit=100');
        const data = await res.json();
        const mappedData = data.products.map(p => ({
          ...p,
          image: p.thumbnail,
          rating: { rate: p.rating, count: Math.floor(Math.random() * 100) + 10 }
        }));
        setProducts(mappedData);
        setFilteredProducts(mappedData);
        
        // Extract unique categories
        const catRes = await fetch('https://dummyjson.com/products/categories');
        const catData = await catRes.json();
        setCategories(['all', ...catData.map(c => c.slug)]);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter effect
  useEffect(() => {
    let result = products;

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by Search Term
    if (searchTerm.trim() !== '') {
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-2">Our Premium Collection</h1>
        <p className="text-muted">Find exactly what you're looking for by browsing our curated categories.</p>
      </div>
      
      <div className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="shadow-sm mb-4 py-2 px-4 rounded-pill border-0 bg-white"
          style={{ maxWidth: '600px', margin: '0 auto' }}
        />
        
        <div className="category-tabs-container py-2">
          {categories.map((cat) => (
            <div
              key={cat}
              className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat.replace(/-/g, ' ')}
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Col key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))
          ) : (
            <Col xs={12} className="text-center py-5">
              <h4 className="text-muted">No products found matching your criteria.</h4>
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
};

export default Products;
