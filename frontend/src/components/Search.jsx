import React, { useState, useEffect } from 'react';
import SearchMapComponent from './SearchMapComponent'; // Importando o componente do mapa

const Search = () => {
    const [searchType, setSearchType] = useState('all');
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('');
    const [items, setItems] = useState([]);

    useEffect(() => {
        async function fetchCategories() {
            const response = await fetch(`http://localhost:5001/${searchType === 'services' ? 'service-categories' : 'product-categories'}`);
            const data = await response.json();
            setCategories(data);
            setSubcategories([]); // Reset subcategories when type or category changes
        }
        if (searchType !== 'all') {
            fetchCategories();
        } else {
            setCategories([]);
            setSubcategories([]);
        }
    }, [searchType]);

    useEffect(() => {
        async function fetchSubcategories() {
            if (selectedCategoryId) {
                const response = await fetch(`http://localhost:5001/${searchType === 'services' ? 'service-subcategories' : 'product-subcategories'}/${selectedCategoryId}`);
                const data = await response.json();
                setSubcategories(data);
            } else {
                setSubcategories([]);
            }
        }
        fetchSubcategories();
    }, [selectedCategoryId, searchType]);

    useEffect(() => {
        async function fetchItems() {
            const queryParams = `type=${searchType}&category_id=${selectedCategoryId || ''}&subcategory_id=${selectedSubcategoryId || ''}`;
            const response = await fetch(`http://localhost:5001/search?${queryParams}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await response.json();
            setItems(data);
        }
        fetchItems();
    }, [searchType, selectedCategoryId, selectedSubcategoryId]);

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ width: '60%', padding: '20px' }}>
                <select onChange={(e) => setSearchType(e.target.value)} value={searchType}>
                    <option value="all">All</option>
                    <option value="products">Products</option>
                    <option value="services">Services</option>
                </select>
                <select onChange={(e) => setSelectedCategoryId(e.target.value)} value={selectedCategoryId}>
                    <option value="">Select a category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
                <select onChange={(e) => setSelectedSubcategoryId(e.target.value)} value={selectedSubcategoryId} disabled={!selectedCategoryId}>
                    <option value="">Select a subcategory</option>
                    {subcategories.map(subcategory => (
                        <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                    ))}
                </select>
                <ul>
                    {items.map(item => (
                        <li key={item.id}>
                            <h4>{item.name}</h4>
                            <p>Category: {item.category} ({item.subcategory})</p>
                            <p>Estimated Value: {item.estimated_value}</p>
                            <p>Location: {item.location}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div style={{ width: '40%' }}>
                <SearchMapComponent />
            </div>
        </div>
    );
};

export default Search;
