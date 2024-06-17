import React, { useState, useEffect } from 'react';

function ProductForm() {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        category_id: '',
        subcategory_id: '',
        condition: '',
        estimated_value: '',
        images: null
    });
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');

    useEffect(() => {
        async function loadCategories() {
            const response = await fetch('http://localhost:5001/product-categories');
            const data = await response.json();
            setCategories(data);
        }

        loadCategories();
    }, []);

    useEffect(() => {
        async function loadSubcategories() {
            if (selectedCategoryId) {
                const response = await fetch(`http://localhost:5001/product-subcategories?category_id=${selectedCategoryId}`);
                const data = await response.json();
                setSubcategories(data);
            } else {
                setSubcategories([]);
            }
        }

        loadSubcategories();
    }, [selectedCategoryId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (e) => {
        setSelectedCategoryId(e.target.value);
        setProduct(prev => ({ ...prev, category_id: e.target.value, subcategory_id: '' }));
    };

    const handleFileChange = (e) => {
        setProduct(prev => ({ ...prev, images: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(product).forEach(key => {
                formData.append(key, product[key]);
            });

            const response = await fetch('http://localhost:5001/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create product');
            }
            alert('Product registered successfully!');
        } catch (error) {
            alert('Failed to register product: ' + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Product Name:
                <input type="text" name="name" value={product.name} onChange={handleChange} />
            </label>
            <label>
                Description:
                <textarea name="description" value={product.description} onChange={handleChange} />
            </label>
            <label>
                Category:
                <select name="category_id" value={product.category_id} onChange={handleCategoryChange}>
                    <option value="">Select a category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </label>
            <label>
                Subcategory:
                <select name="subcategory_id" value={product.subcategory_id} onChange={handleChange} disabled={!selectedCategoryId}>
                    <option value="">Select a subcategory</option>
                    {subcategories.map(subcategory => (
                        <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                    ))}
                </select>
            </label>
            <label>
                Condition:
                <input type="text" name="condition" value={product.condition} onChange={handleChange} />
            </label>
            <label>
                Estimated Value:
                <input type="number" name="estimated_value" value={product.estimated_value} onChange={handleChange} />
            </label>
            <label>
                Upload Image:
                <input type="file" name="images" onChange={handleFileChange} />
            </label>
            <button type="submit">Register Product</button>
        </form>
    );
}

export default ProductForm;
