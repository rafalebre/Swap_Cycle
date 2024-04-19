import React, { useEffect, useState } from 'react';
import { getUserInfo, updateUserInfo } from '../services/authService'; // Certifique-se de que os caminhos estão corretos

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getUserInfo();
                setUserInfo(userData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updateData = await updateUserInfo(userInfo);
            console.log('Update Success:', updateData.message);
        } catch (error) {
            console.error(error);
        }
    };

    return (
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
            <button type="submit">Update Info</button>
        </form>
    );
}

export default UserInfo;
