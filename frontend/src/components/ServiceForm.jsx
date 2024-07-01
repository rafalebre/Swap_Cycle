import React, { useState, useEffect } from 'react';
import { getUserInfo } from '../services/authService'; // Importar a função getUserInfo
import GoogleMapsAutocomplete from './GoogleMapsAutocomplete'; // Importar o novo componente de Autocomplete

function ServiceForm() {
    const [service, setService] = useState({
        name: '',
        description: '',
        category_id: '',
        subcategory_id: '',
        online: false,
        location: '',
        estimated_value: '',
        images: null
    });
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [useRegisteredAddress, setUseRegisteredAddress] = useState(false); // State para controlar o uso do endereço registrado

    useEffect(() => {
        async function loadCategories() {
            const response = await fetch('http://localhost:5001/service-categories');
            const data = await response.json();
            setCategories(data);
        }

        loadCategories();
    }, []);

    useEffect(() => {
        async function loadSubcategories() {
            if (selectedCategoryId) {
                const response = await fetch(`http://localhost:5001/service-subcategories/${selectedCategoryId}`);
                const data = await response.json();
                setSubcategories(data);
            } else {
                setSubcategories([]);
            }
        }

        loadSubcategories();
    }, [selectedCategoryId]);

    useEffect(() => {
        if (useRegisteredAddress && !service.online) {
            getUserInfo().then(data => {
                setService(prev => ({ ...prev, location: data.address }));
            }).catch(error => {
                console.error('Failed to fetch user address:', error);
            });
        }
    }, [useRegisteredAddress, service.online]); // A dependência inclui service.online para reagir à mudança do modo online

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setService(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCategoryChange = (e) => {
        setSelectedCategoryId(e.target.value);
        setService(prev => ({
            ...prev,
            category_id: e.target.value,
            subcategory_id: ''
        }));
    };

    const handleFileChange = (e) => {
        setService(prev => ({
            ...prev,
            images: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(service).forEach(key => {
                formData.append(key, service[key]);
            });

            const response = await fetch('http://localhost:5001/services', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create service');
            }
            alert('Service registered successfully!');
        } catch (error) {
            alert('Failed to register service: ' + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Service Name:
                <input type="text" name="name" value={service.name} onChange={handleChange} />
            </label>
            <label>
                Description:
                <textarea name="description" value={service.description} onChange={handleChange} />
            </label>
            <label>
                Category:
                <select name="category_id" value={service.category_id} onChange={handleCategoryChange}>
                    <option value="">Select a category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </label>
            <label>
                Subcategory:
                <select name="subcategory_id" value={service.subcategory_id} onChange={handleChange} disabled={!selectedCategoryId}>
                    <option value="">Select a subcategory</option>
                    {subcategories.map(subcategory => (
                        <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                    ))}
                </select>
            </label>
            <label>
                Online:
                <input type="checkbox" name="online" checked={service.online} onChange={handleChange} />
            </label>
            {!service.online &&
                <label>
                    Location:
                    <GoogleMapsAutocomplete onPlaceSelected={location => setService(prev => ({ ...prev, location }))} />
                </label>
            }
            <label>
                Use my registered address:
                <input type="checkbox" checked={useRegisteredAddress} onChange={e => setUseRegisteredAddress(e.target.checked)} disabled={service.online} />
            </label>
            <label>
                Estimated Value:
                <input type="number" name="estimated_value" value={service.estimated_value} onChange={handleChange} />
            </label>
            <label>
                Upload Image:
                <input type="file" name="images" onChange={handleFileChange} />
            </label>
            <button type="submit">Register Service</button>
        </form>
    );
}

export default ServiceForm;
