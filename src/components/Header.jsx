import React from 'react';
import logo from '../assets/logo.png';

function Header() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '10px 20px', // Add horizontal padding
      backgroundColor: 'transparent', // Make the background transparent
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
      borderRadius: '5px' // Rounded corners
    }}>
      <img  
        src={logo}
        alt="OAVS Logo" 
        style={{
          width: '60px', 
          height: '60px', 
          marginRight: '15px',
          borderRadius: '50%', // Make logo circular
          transition: 'transform 0.3s', // Smooth hover effect
        }} 
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} // Hover effect
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} // Reset hover effect
      />
      <div>
        <h1 style={{
          margin: 0,
          fontSize: '1.5rem', // Increased font size
          color: '#333', // Darker text for contrast
        }}>
          Odisha Adarsha Vidyalaya Sangathan
        </h1>
        <h3 style={{
          margin: 0,
          fontSize: '1.2rem', // Increased font size
          color: '#555', // Slightly lighter color for subheading
        }}>
          Department of School & Mass Education, Govt. of Odisha
        </h3>
      </div>
    </div>
  );
}

export default Header;
