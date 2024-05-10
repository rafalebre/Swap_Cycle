import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ContentArea from '../components/ContentArea';
import './Dashboard.css';

function Dashboard() {
    const [activeView, setActiveView] = useState('home'); // Home can be replaced as needed

    return (
        <div className="dashboard">
            <Sidebar setActiveView={setActiveView} />
            <ContentArea activeView={activeView} />
        </div>
    );
}

export default Dashboard;
