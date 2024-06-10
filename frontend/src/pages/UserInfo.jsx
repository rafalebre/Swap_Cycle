import React, { useEffect, useState } from 'react';
import { getUserInfo, updateUserInfo } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import GoogleMapComponent from '../components/GoogleMapComponent';

const UserInfo = () => {
    const [userInfo, setUserInfo] = useState({
        email: '',
        username: '',
        name: '',
        surname: '',
        birth_date: '',
        profile_picture: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        getUserInfo().then(data => {
            setUserInfo(data);
            setLoading(false);
        }).catch(error => {
            console.error('Failed to fetch user data:', error);
            setError('Failed to load user data');
            setLoading(false);
        });
    }, []);

    const handleChange = (e) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const updateData = await updateUserInfo(userInfo);
            console.log('Update Success:', updateData.message);
            navigate('/dashboard'); // Navigate to dashboard after update
        } catch (error) {
            console.error('Update failed:', error);
            setError('Update failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoToDashboard = () => {
        navigate('/dashboard'); // Function to navigate directly to dashboard
    };

    if (loading) return <div>Loading...</div>; // Display loading message

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={userInfo.email} onChange={handleChange} disabled />
                </div>
                <div>
                    <label>Username:</label>
                    <input type="text" name="username" value={userInfo.username} onChange={handleChange} />
                </div>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={userInfo.name} onChange={handleChange} />
                </div>
                <div>
                    <label>Surname:</label>
                    <input type="text" name="surname" value={userInfo.surname} onChange={handleChange} />
                </div>
                <div>
                    <label>Birth Date:</label>
                    <input type="date" name="birth_date" value={userInfo.birth_date} onChange={handleChange} />
                </div>
                <div>
                    <label>Profile Picture URL:</label>
                    <input type="text" name="profile_picture" value={userInfo.profile_picture} onChange={handleChange} />
                </div>
                <div>
                    <label>Address:</label>
                    <input type="text" name="address" value={userInfo.address} onChange={handleChange} />
                </div>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <div>
                    <button type="submit" disabled={loading}>Update Info</button>
                    <button type="button" onClick={handleGoToDashboard} disabled={loading}>Go to Dashboard</button>
                </div>
            </form>
            <GoogleMapComponent onPlaceSelected={(address) => setUserInfo({ ...userInfo, address })} />
        </div>
    );
}

export default UserInfo;