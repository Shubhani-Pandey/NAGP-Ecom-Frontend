
import React, { useState, useEffect, useRef } from 'react';
import {useDispatch, useSelector} from 'react-redux'
import { debounce } from 'lodash';
import './Search.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

// Components
import Product from '../components/Product'
import Pagination from './Pagination';
import {getProducts as listProducts} from '../redux/actions/productActions'
import { setUserDetails } from "../redux/actions/userAction";
import { setLoggedUserDetails, getUserDetails, setToken } from '../utils/localstorage'
import {Api} from '../utils/Api'


const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Parse the URL hash for tokens
        console.log('SignIn component mounted');
        console.log('Current URL:', window.location.href);
    
        const hash = window.location.hash;
        console.log('hash', hash);
        if (hash) {
          // Extract tokens from URL hash
          const tokens = hash.substring(1).split('&').reduce((result, item) => {
            const parts = item.split('=');
            result[parts[0]] = parts[1];
            return result;
          }, {});
          
          console.log('tokens',tokens)
    
          if (tokens.access_token) {
            // Store the token
            setToken(tokens.access_token);
            
            // Clear the URL hash
            window.location.hash = '';
            
            // Handle successful login
            // You might want to redirect or update application state here
            dispatch(setUserDetails());
            // replace('/');
          }
      
          if (tokens.id_token) {
            localStorage.setItem('idToken', tokens.id_token);
          }
        }
      }, []);

    const PRICE_RANGES = [
        { id: '1', label: '₹0 - ₹100', min: 0, max: 100 },
        { id: '2', label: '₹100 - ₹500', min: 100, max: 500 },
        { id: '3', label: '₹500 - ₹1000', min: 500, max: 1000 },
        { id: '4', label: '₹1000 - ₹4000', min: 1000, max: 4000 },
        { id: '5', label: '₹4000 - ₹10000', min: 4000, max: 10000 },
        { id: '6', label: '₹10000+', min: 10000, max: 999999999 }
    ];

    const defaultFilters = {
        category_id: '',
        selectedPriceRanges: [],
        sort_by: '_score',
        sort_order: 'desc',
        page: 1
    };

    const [filters, setFilters] = useState({
        category_id: '',
        selectedPriceRanges: [],
        sort_by: '_score',
        sort_order: 'desc',
        page: 1
    });


    // Add state to track if any filter is applied
    const [isFilterApplied, setIsFilterApplied] = useState(false);

    const [metadata, setMetadata] = useState({
        total: 0,
        total_pages: 0
    });
    const [aggregations, setAggregations] = useState({
        price_ranges: [],
        categories: [],
        brands: []
    });
    const [categories, setCategories] = useState([]);

    const dispatch = useDispatch()

    const getProducts = useSelector(state => state.getProducts)
    const {products} = getProducts

    const searchRef = useRef(null);

    // Add state for all products
    const [allProducts, setAllProducts] = useState([]);
    const [isSearchApplied, setIsSearchApplied] = useState(false);

    // Function to check if any filter is applied
    const checkIfFiltersApplied = (newFilters) => {
        return newFilters.category_id !== '' ||
            newFilters.selectedPriceRanges.length > 0 ||
            (newFilters.sort_by !== '_score' && newFilters.sort_by !== '') ||
            searchTerm.trim() !== '';
    };

    const ActiveFilters = ({ selectedPriceRanges, onRemove }) => {
        if (selectedPriceRanges.length === 0) return null;
    
        return (
            <div className="active-filters">
                <h4>Active Price Filters:</h4>
                <div className="active-filters-list">
                    {selectedPriceRanges.map(rangeId => {
                        const range = PRICE_RANGES.find(r => r.id === rangeId);
                        return (
                            <div key={rangeId} className="active-filter-tag">
                                <span>{range.label}</span>
                                <button 
                                    onClick={() => onRemove(rangeId)}
                                    className="remove-filter"
                                >
                                    ×
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };
    

    // Debounced function for suggestions
    const debouncedGetSuggestions = useRef(
        debounce(async (query) => {
            if (!query) {
                setSuggestions([]);
                return;
            }

            try {
                const {statusCode, data} = await Api.postRequest(`/products/products/suggest?q=${query}&size=5`)

                // const response = await fetch(
                //     `http://localhost:5002/products/suggest?q=${query}&size=5`
                // );
                // data = data.json();
                console.log('suggestions_data',data)
                setSuggestions(data.suggestions || []);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setSuggestions([]);
            }
        }, 300)
    ).current;

    // Function to perform search
    const performSearch = async (page = 1) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                q: searchTerm,
                page: page,
                size: 20,
                ...filters,
            });

            console.log(`/products/products/search?${queryParams}`)

            const {statusCode, data} = await Api.postRequest(`/products/products/search?${queryParams}`)
            // const response = await fetch(
            //     `http://localhost:5002/products/search?${queryParams}`
            // );
            // data = data.json();
            console.log(data)

            setSearchResults(data.products);
            setMetadata(data.metadata);
            setAggregations(data.aggregations);
        } catch (error) {
            console.error('Error performing search:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim()) {
            // Filter products to create suggestions
            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(value.toLowerCase())
            );

            // Format suggestions
            const formattedSuggestions = filteredProducts.map(product => ({
                text: product.name,
                metadata: {
                    brand: product.brand,
                    price: product.price,
                    id: product._id
                }
            }));

            setSuggestions(formattedSuggestions);
            setShowSuggestions(true);
            debouncedGetSuggestions(value);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
            setFilters(defaultFilters);
            debouncedGetSuggestions([]);
        }
    };

    // Handle search button click
    const handleSearch = () => {
        const newFilters = { ...filters, page: 1 };
        if (searchTerm.trim()) {
            setFilters(defaultFilters);
            setIsSearchApplied(true);
            performSearch(searchTerm.trim());
        } else {
            setIsSearchApplied(false);
            setSearchResults([]);
            setFilters(newFilters);
            setIsFilterApplied(checkIfFiltersApplied(newFilters));
            fetchFilteredProducts(newFilters);
        }
        setShowSuggestions(false);
    };

    const handleClearAll = () => {
        setFilters({
            ...defaultFilters
        });
        setSearchTerm('');
        setIsFilterApplied(false);
        fetchFilteredProducts(defaultFilters);
    };


    // Handle suggestion click
    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion.text);
        setFilters(defaultFilters);
        fetchFilteredProducts({
            ...defaultFilters,
            q: suggestion.text
        });
        setShowSuggestions(false);
    };

    // Handle enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
        handleSearch();
        }
    };
  

    // Handle filter change
    const handleFilterChange = (name, value) => {
        console.log('setting_filters', name, value)

        if (name=='sort'){
            const [sort_by, sort_order] = value.split('-');
            const newFilters = {
            ...filters,
            sort_by: sort_by,
            sort_order: sort_order,
            page: 1
            };

            setFilters(newFilters);
            setIsFilterApplied(checkIfFiltersApplied(newFilters));
            fetchFilteredProducts({
                ...newFilters,
                q: searchTerm.trim()
            });
            return;
        }

        if (name === 'selectedPriceRanges') {
            const newPriceRanges = filters.selectedPriceRanges?.includes(value)
                ? filters.selectedPriceRanges.filter(range => range !== value)
                : [...(filters.selectedPriceRanges || []), value];
    
            const newFilters = {
                ...filters,
                selectedPriceRanges: newPriceRanges,
                page: 1
            };

            console.log(newFilters)

            setFilters(newFilters);
            setIsFilterApplied(checkIfFiltersApplied(newFilters));
            fetchFilteredProducts({
                ...newFilters,
                q: searchTerm.trim()
            });
        return;

        };

        if (name === 'category_id') {
            const newFilters = {
                ...filters,
                [name]: value,
                page: 1
            };
            setFilters(newFilters);
            setIsFilterApplied(checkIfFiltersApplied(newFilters));
            fetchFilteredProducts({
                ...newFilters,
                q: searchTerm.trim()
            });
            return;
        }

        const newFilters = {
            ...filters,
            [name]: value,
            page: 1
        };

        setFilters(newFilters);
        setIsFilterApplied(checkIfFiltersApplied(newFilters));
        console.log(newFilters)
        fetchFilteredProducts({
            ...newFilters,
            q: searchTerm.trim() 
        });
    };


    // Function to fetch filtered products
    const fetchFilteredProducts = async (currentFilters = filters) => {
        setLoading(true);

        try {
            // Get selected price ranges
            const selectedRanges = PRICE_RANGES.filter(range => 
                currentFilters.selectedPriceRanges.includes(range.id)
            );

            // If no price ranges selected, use full range
            const priceRanges = selectedRanges.length > 0 ? selectedRanges : [{ min: 0, max: 999999999 }];

            const queryParams = new URLSearchParams({
                q: searchTerm,
                page: currentFilters.page,
                size: 20,
                category_id: currentFilters.category_id,
                sort_by: currentFilters.sort_by,
                sort_order: currentFilters.sort_order,
                price_ranges: JSON.stringify(priceRanges)
            });

            console.log(currentFilters.category_id,currentFilters.sort_by,currentFilters.sort_order,JSON.stringify(priceRanges))
            

            const {statusCode, data} = await Api.postRequest(`/products/products/search?${queryParams}`)
            // data = data.json()

            // const response = await fetch(`http://localhost:5002/products/search?${queryParams}`);
            // const data = await response.json();
            setAllProducts(data.products)
            console.log(data.products)
            // setSearchResults(data.products);
            setMetadata(data.metadata);
        } catch (error) {
            console.error('Error fetching filtered products:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle price range selection
    const handlePriceRangeChange = (rangeId) => {
        const newSelectedRanges = filters.selectedPriceRanges.includes(rangeId)
            ? filters.selectedPriceRanges.filter(id => id !== rangeId)
            : [...filters.selectedPriceRanges, rangeId];

        const newFilters = {
            ...filters,
            selectedPriceRanges: newSelectedRanges,
            page: 1
        };

        setFilters(newFilters);
        fetchFilteredProducts(newFilters);
    };

    // Handle page change
    const handlePageChange = (newPage) => {

        const newFilters = {
            ...filters,
            page: newPage
        };

        setFilters(newFilters);

        if (isSearchApplied) {
            performSearch();
        }
    };

    // Get current products based on pagination
    const getCurrentProducts = () => {
        if (isSearchApplied) {
            return searchResults;
        }
        
        const startIndex = (filters.page - 1) * 10;
        const endIndex = startIndex + 10;
        return allProducts.slice(startIndex, endIndex);
    };

    // Fetch all products initially
    useEffect(() => {
            const fetchAllProducts = async () => {
                setLoading(true);
                try {
                    const {statusCode, data} = await Api.getRequest('/products/products/get')
                    // const response = await fetch('http://localhost:5002/products');
                    // const data = await response.json();
                    setAllProducts(data.json());
                    setMetadata({
                        total: data.length,
                        total_pages: Math.ceil(data.length / 10) // Assuming 10 items per page
                    });
                } catch (error) {
                    console.error('Error fetching products:', error);
                } finally {
                    setLoading(false);
                }
            };
    
            fetchAllProducts();
        }, []);

    useEffect(() => {
        dispatch(listProducts())
      }, [dispatch])



    // Effect to close suggestions on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Effect to perform search when filters change
    useEffect(() => {
        if (searchTerm) {
            performSearch(filters.page);
        }
    }, [filters]);

    // Effect to fetch categories when component mounts
    useEffect(() => {
        const fetchCategories = async () => {
        try {
            // Replace with your actual API endpoint
            const {statusCode, data} = await Api.getRequest('/products/products/get')
            // const response = await fetch('http://127.0.0.1:5002/products');
            // const data = await response.json();
            setCategories(data.json());
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
        };
    
        fetchCategories();
    }, []);

    return (
        <div className="search-layout">
            {/* Search bar at the top */}
            <div className="search-header">
                <div className="search-container" ref={searchRef}>
                    <div className="search-bar">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleInputChange}
                            placeholder="Search products..."
                            className="search-input"
                        />
                        <button 
                            onClick={handleSearch}
                            className="search-button"
                        >
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>
                    {showSuggestions && suggestions && suggestions.length > 0 && (
                        <div className="suggestions-dropdown">
                            {suggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="suggestion-item"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    <span>{suggestion.text}</span>
                                    {suggestion.metadata && (
                                        <span className="suggestion-metadata">
                                            {suggestion.metadata.brand} - ${suggestion.metadata.price}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="search-content">
                {/* Filters sidebar */}
                <div className="filters-sidebar">
                    <div className="filter-section">
                        <h3>Categories</h3>
                        <select
                            value={filters.category_id}
                            onChange={(e) => handleFilterChange('category_id', e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Categories</option>
                            {[...new Set(categories.map(category => category.category_id))].map((uniqueCategory) => (
                                <option key={uniqueCategory} value={uniqueCategory}>
                                    {uniqueCategory}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-section">
                        <h3>Price Ranges</h3>
                        <div className="price-ranges">
                            {PRICE_RANGES.map(range => (
                                <div key={range.id} className="price-range-item">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={filters.selectedPriceRanges.includes(range.id)}
                                            onChange={() => handlePriceRangeChange(range.id)}
                                            className="checkbox-input"
                                        />
                                        <span className="checkbox-custom"></span>
                                        <span className="price-range-label">{range.label}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                        {/* Integrate ActiveFilters component here */}
                        <ActiveFilters 
                            selectedPriceRanges={filters.selectedPriceRanges}
                            onRemove={handlePriceRangeChange}
                        />
                    </div>

                    <div className="filter-section">
                        <h3>Sort By</h3>
                        <select
                            value={`${filters.sort_by}-${filters.sort_order}`}
                            onChange={(e) => {
                                handleFilterChange('sort', e.target.value);
                            }}
                            onSelect={(e) => {
                                console.log('Select event triggered');
                            }}
                            className="filter-select"
                        >
                            <option value="_score-desc">Relevance</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            {/* <option value="name.keyword-asc">Name A-Z</option>
                            <option value="name.keyword-desc">Name Z-A</option> */}
                        </select>
                    </div>

                    {/* Clear Filters Button */}
                    {(isFilterApplied || searchTerm) && (
                        <button
                            onClick={handleClearAll}
                            className="clear-filters-button"
                        >
                            Clear All Filters
                        </button>
                    )}

                </div>

                {/* Products grid */}
                <div className="products-grid">
                    {loading ? (
                        <div className="loading">Loading...</div>
                    ) : (
                        <>
                            <div className="search-results">
                                {getCurrentProducts().map((product) => (
                                    
                                    <Product
                                        key={product.product_id}
                                        name={product.name}
                                        description={product.description}
                                        price={product.price}
                                        imageUrl={product.product_image_url}
                                        productId={product.product_id}
                                        brand_name={product.brand_name}
                                    />
                                ))} 
                            </div>
                            {metadata.total > 0 && (
                                <Pagination
                                    currentPage={filters.page}
                                    totalPages={metadata.total_pages}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>

    );
};

export default Search;
