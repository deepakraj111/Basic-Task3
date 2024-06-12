// src/App.js
import React from 'react';
import './App.css';
import WeatherApp from '../src/Component/WeatherApp';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1 className='image-text'>Weather Forecast</h1>
                <WeatherApp />
                
            </header>
        </div>
    );
}

export default App;
