import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Form, Spinner, InputGroup } from 'react-bootstrap';
import { BsSearch, BsFilterLeft } from 'react-icons/bs';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Fetch products and categories
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('https://dummyjson.com/products?limit=100'),
          fetch('https://dummyjson.com/products/categories')
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        const mappedProducts = productsData.products.map(p => ({
          ...p,
          image: p.thumbnail,
          rating: { rate: p.rating, count: Math.floor(Math.random() * 100) + 10 }
        }));

        setProducts(mappedProducts);
        
        // Handle both formats of categories (from different DummyJSON versions)
        const parsedCategories = categoriesData.map(c => 
          typeof c === 'object' ? c.slug : c
        );
        setCategories(['all', ...parsedCategories]);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Use useMemo for filtering results - more efficient and reliable than useEffect
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = searchTerm.trim() === '' || 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  return (
    <Container className="py-5">
      <header className="text-center mb-5 animate__animated animate__fadeIn">
        <h1 className="fw-bold mb-2">Our Premium Collection</h1>
        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
          Explore our wide range of products across different categories. Use the filters to find what you need.
        </p>
      </header>
      
      <section className="mb-5 shadow-sm p-4 bg-white rounded-4 border">
        <Row className="gy-4 align-items-center">
          <Col lg={6}>
            <Form.Group controlId="search">
              <Form.Label className="small fw-bold text-muted text-uppercase mb-2 ls-1">Search Products</Form.Label>
              <InputGroup className="overflow-hidden border rounded-pill bg-light bg-opacity-50">
                <InputGroup.Text className="bg-transparent border-0 ps-3 text-muted">
                  <BsSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-0 shadow-none py-2"
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col lg={6}>
             <Form.Label className="small fw-bold text-muted text-uppercase mb-2 ls-1 d-flex align-items-center gap-2">
               <BsFilterLeft /> Select Category
             </Form.Label>
             <div className="category-tabs-container py-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                    type="button"
                  >
                    {cat === 'all' ? 'All Items' : cat.replace(/-/g, ' ')}
                  </button>
                ))}
             </div>
          </Col>
        </Row>
      </section>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="grow" variant="primary" />
          <p className="mt-3 text-muted fw-semibold">Loading amazing products...</p>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-2">
            <h5 className="fw-bold mb-0">
              {filteredProducts.length} Results Found
            </h5>
            {searchTerm && <small className="text-muted">Filtering by: "<strong>{searchTerm}</strong>"</small>}
          </div>

          <Row xs={1} sm={2} md={3} lg={4} className="g-4 animate__animated animate__fadeIn">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Col key={product.id}>
                  <ProductCard product={product} />
                </Col>
              ))
            ) : (
              <Col xs={12} className="text-center py-5">
                <div className="py-5 bg-light rounded-4 border">
                   <h1 className="display-4 text-muted mb-3 opacity-25">😕</h1>
                   <h4 className="fw-bold text-dark opacity-75">No matching products</h4>
                   <p className="text-muted">Try adjusting your search terms or category selection.</p>
                   <button className="btn btn-primary rounded-pill px-4 mt-2" onClick={() => {setSearchTerm(''); setSelectedCategory('all');}}>
                     Clear All Filters
                   </button>
                </div>
              </Col>
            )}
          </Row>
        </>
      )}
    </Container>
  );
};

export default Products;

