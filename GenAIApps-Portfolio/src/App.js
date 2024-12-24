import React from 'react';

const EC2_PUBLIC_IP = '18.212.36.74';

// Common styles for reusability and consistency
const cardStyles = {
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '1rem',
  padding: '2rem',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  cursor: 'pointer',
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
};

const titleStyles = {
  fontSize: '2rem',
  marginBottom: '1rem',
  textAlign: 'center',
  color: 'white',
  fontWeight: 'bold',
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const subtitleStyles = {
  fontSize: '1.25rem',
  color: '#a7f3d0',
  marginBottom: '1.5rem',
  textAlign: 'center',
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const descriptionStyles = {
  color: '#d1fae5',
  marginBottom: '2rem',
  lineHeight: '1.6',
  flexGrow: 1,
  fontSize: '1.1rem',
  textAlign: 'center', // Added center alignment
  padding: '0 1rem' // Added padding for better readability
};

const buttonStyles = {
  background: '#4ade80', // Light green color
  color: '#064e3b', // Dark green text for contrast
  padding: '0.75rem 2rem',
  borderRadius: '9999px',
  fontWeight: 'bold',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s',
  fontSize: '1.1rem'
};

const App = () => {
  return (
    <div style={{ backgroundColor: '#111827', minHeight: '100vh', color: 'white' }}>
      {/* Header with reduced bottom padding */}
      <div style={{ textAlign: 'center', padding: '3rem 2rem 1.5rem' }}> {/* Reduced padding */}
        <h1 style={{ fontSize: '3.5rem', marginBottom: '0.75rem', color: 'white' }}> {/* Reduced margin */}
          GenAI Apps - Portfolio
        </h1>
        <p style={{ fontSize: '1.5rem', color: '#a7f3d0', marginBottom: '1rem' }}> {/* Reduced margin */}
          Welcome to my GenAI Apps
        </p>
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#a7f3d0', 
          maxWidth: '800px', 
          margin: '0 auto 2rem', // Reduced bottom margin from 3rem to 2rem
          lineHeight: '1.6'
        }}>
          Supports various document types, offers lightweight TF-IDF or Mistral's embedding for analysis, 
          uses advanced chunking strategies, runs on AWS for reliability, provides context-aware responses, 
          and includes customizable temperature and token limits along with real-time diagnostics
        </p>
      </div>

      {/* Three Column Layout - Moved closer to header */}
      <div style={{ 
        maxWidth: '1400px',
        margin: '0 auto', 
        padding: '0 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2rem'
      }}>
        {/* First App */}
        <div style={cardStyles}>
          <a href={`http://${EC2_PUBLIC_IP}:8501`} style={{ textDecoration: 'none', color: 'white', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h2 style={titleStyles}>RAG-DocuMind</h2>
            <h3 style={subtitleStyles}>Intelligent Document Analysis & Response Platform</h3>
            <p style={descriptionStyles}>
              A Retrieval-Augmented Generation (RAG) application leveraging AWS services for document processing and analysis.
            </p>
            <div style={{ textAlign: 'center' }}>
              <button style={buttonStyles}>Launch App →</button>
            </div>
          </a>
        </div>

        {/* Second App */}
        <div style={cardStyles}>
          <a href={`http://${EC2_PUBLIC_IP}:8502`} style={{ textDecoration: 'none', color: 'white', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h2 style={titleStyles}>Prompt Engineering</h2>
            <h3 style={subtitleStyles}>Summarize, Classify, Predict</h3>
            <p style={descriptionStyles}>
              A Retrieval-Augmented Generation (RAG) application using Streamlit and AWS allows users to summarize key information.
            </p>
            <div style={{ textAlign: 'center' }}>
              <button style={buttonStyles}>Launch App →</button>
            </div>
          </a>
        </div>

        {/* Third App */}
        <div style={cardStyles}>
          <a href={`http://${EC2_PUBLIC_IP}:8503`} style={{ textDecoration: 'none', color: 'white', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h2 style={titleStyles}>NIST AI RMF</h2>
            <h3 style={subtitleStyles}>Generative Artificial Intelligence Profile</h3>
            <p style={descriptionStyles}>
              A Companion Resource for Implementing the AI RMF in Generative AI Systems.
            </p>
            <div style={{ textAlign: 'center' }}>
              <button style={buttonStyles}>Launch App →</button>
            </div>
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF', marginTop: '4rem' }}>
        <p>© 2024 GenAI Apps Portfolio. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;