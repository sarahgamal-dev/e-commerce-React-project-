import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Form, Spinner, InputGroup, Button } from 'react-bootstrap';
import { BsSearch, BsFilterLeft } from 'react-icons/bs';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{ slug: 'all', name: 'All Items' }]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');

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
          typeof c === 'object' ? { slug: c.slug, name: c.name } : { slug: c, name: c.replace(/-/g, ' ') }
        );
        setCategories([{ slug: 'all', name: 'All Items' }, ...parsedCategories]);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Use useMemo for filtering and sorting results
  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = searchTerm.trim() === '' || 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });

    // Apply sorting
    if (sortBy === 'priceLow') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceHigh') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating.rate - a.rating.rate);
    }

    return result;
  }, [products, selectedCategory, searchTerm, sortBy]);

  return (
    <Container className="py-5">
      <header className="text-center mb-5 animate__animated animate__fadeIn">
        <h1 className="fw-bold mb-2">Our Premium Collection</h1>
        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
          Explore our wide range of products across different categories. Use the filters to find what you need.
        </p>
      </header>
      
      <section className="mb-5 animate__animated animate__fadeIn">
        <div className="search-container-premium">
          <InputGroup className="overflow-hidden border-0 rounded-pill shadow-sm bg-white p-1">
            <InputGroup.Text className="bg-transparent border-0 ps-3 text-muted">
              <BsSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-0 shadow-none py-2"
            />
          </InputGroup>
        </div>

        <div className="category-tabs-container mb-4">
           {categories.map((cat) => (
             <button
               key={cat.slug}
               className={`category-tab ${selectedCategory === cat.slug ? 'active' : ''}`}
               onClick={() => setSelectedCategory(cat.slug)}
               type="button"
             >
               {cat.name}
             </button>
           ))}
        </div>


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
            <div className="d-flex gap-3 align-items-center">
              {searchTerm && <small className="text-muted d-none d-md-block">Results for: "<strong>{searchTerm}</strong>"</small>}
              {(searchTerm || selectedCategory !== 'all' || sortBy !== 'default') && (
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-decoration-none text-danger p-0 fw-bold"
                  onClick={() => {setSearchTerm(''); setSelectedCategory('all'); setSortBy('default');}}
                >
                  Clear Filters
                </Button>
              )}
            </div>
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
                <div className="py-5 bg-white rounded-4 border-0 shadow-sm">
                   <div className="display-1 text-muted mb-4 opacity-25">🛍️</div>
                   <h3 className="fw-bold text-dark">No products found</h3>
                   <p className="text-muted mb-4">We couldn't find any products matching your current filters.</p>
                   <Button 
                    variant="primary" 
                    className="rounded-pill px-5 py-2 fw-bold shadow" 
                    onClick={() => {setSearchTerm(''); setSelectedCategory('all'); setSortBy('default');}}
                   >
                     Reset All Filters
                   </Button>
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

