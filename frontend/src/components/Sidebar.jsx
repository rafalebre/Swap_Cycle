import React from 'react';

function Sidebar({ setActiveView }) {
    return (
        <div className="sidebar">
            <button onClick={() => setActiveView('registerProduct')}>Register Product</button>
            <button onClick={() => setActiveView('registerService')}>Register Service</button>
            <button onClick={() => setActiveView('search')}>Search</button>
            <button onClick={() => setActiveView('onlineServices')}>Online Services</button>
            <button onClick={() => setActiveView('myProducts')}>My Products / Services</button>
            <button onClick={() => setActiveView('trades')}>Trades</button>
            <button onClick={() => setActiveView('favorites')}>Favorites</button>
            <button onClick={() => setActiveView('wishlist')}>Wishlist</button>
        </div>
    );
}

export default Sidebar;
