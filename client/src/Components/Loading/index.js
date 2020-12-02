import React from 'react';
import './Loading.css';

export default function Loading({ }) {
    const getBackground = () => {
        return { backgroundColor: 'transparent' };
    };
    return (
        <div style={getBackground()} className="loaderContainer">
            <div className="loader" />
        </div>
    );
};

