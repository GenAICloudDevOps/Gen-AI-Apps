import React from 'react';

const EC2_PUBLIC_IP = '54.158.93.206';

// Common styles for reusability and consistency
const cardStyles = {
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '0.75rem',  // Reduced from 1rem
  padding: '1.25rem 1.25rem 0.75rem',  // Reduced bottom padding
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease-in-out',
  cursor: 'pointer',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)'
  }
};

// Update title styles
const titleStyles = {
  fontSize: '2rem',          // Increased size
  marginBottom: '0.3rem',    // Reduced spacing
  textAlign: 'center',
  color: 'white',
  fontWeight: '600',
  height: '40px',           // Fixed height
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: '1.2'
};

const subtitleStyles = {
  fontSize: '1.4rem',       // Increased size
  color: '#a7f3d0',
  marginBottom: '0.4rem',   // Reduced spacing
  textAlign: 'center',
  height: '35px',          // Fixed height
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: '1.2'
};

const descriptionStyles = {
  color: '#d1fae5',
  marginBottom: '0.75rem',  // Reduced spacing
  lineHeight: '1.4',
  flexGrow: 1,
  fontSize: '1.25rem',     // Increased size
  textAlign: 'center',
  padding: '0 0.5rem'
};

const buttonStyles = {
  background: '#4ade80',
  color: '#064e3b',
  padding: '0.5rem 1.75rem',
  borderRadius: '9999px',
  fontWeight: '600',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s',
  fontSize: '1.1rem',
  marginTop: 'auto'        // Push button to bottom
};

const App = () => {
  return (
    <div style={{ backgroundColor: '#111827', minHeight: '100vh', color: 'white' }}>
      {/* Reduced header padding */}
      <div style={{ textAlign: 'center', padding: '1.5rem 2rem 1rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem',         // Reduced from 3rem
          marginBottom: '0.5rem',     // Reduced from 1rem
          color: 'white',
          fontWeight: '600' 
        }}>
          GenAI Apps - Portfolio
        </h1>
        <p style={{ 
          fontSize: '1.5rem',         // Reduced from 1.75rem
          color: '#a7f3d0', 
          marginBottom: '0.5rem',     // Reduced from 1rem
          fontWeight: '500'
        }}>
          Welcome to my GenAI Apps
        </p>
        <p style={{ 
          fontSize: '1.25rem',        // Reduced from 1.35rem
          color: '#a7f3d0', 
          maxWidth: '800px', 
          margin: '0 auto 1rem',      // Reduced from 2rem
          lineHeight: '1.4',          // Reduced from 1.5
          fontWeight: '400'
        }}>
          Elevate with AI that thinks*, learns, and evolves through Co-Intelligence
        </p>
      </div>

      {/* Main content with adjusted spacing */}
      <div style={{ 
        maxWidth: '1400px',
        margin: '0 auto', 
        padding: '0 2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',                // Adjusted gap between rows
        marginBottom: '1.5rem'         // Reduced bottom margin
      }}>
        {/* First Row - Reduced gap */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem'                 // Reduced from 1.5rem
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

        {/* Second Row - Reduced gap */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem'                 // Reduced from 1.5rem
        }}>
          {/* Fourth App */}
          <div style={cardStyles}>
            <a href={`http://${EC2_PUBLIC_IP}:8504`} style={{ textDecoration: 'none', color: 'white', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <h2 style={titleStyles}>Multi-Agent Collaboration using CrewAI</h2>
              <h3 style={subtitleStyles}>Power of Collaborative AI</h3>
              <p style={descriptionStyles}>
                Define agents Roles and Expertise to work in tandem
              </p>
              <div style={{ textAlign: 'center' }}>
                <button style={buttonStyles}>Launch App →</button>
              </div>
            </a>
          </div>

          {/* Fifth App */}
          <div style={cardStyles}>  {/* Fixed: Removed extra closing tag */}
            <a href={`http://${EC2_PUBLIC_IP}:8505`} style={{ textDecoration: 'none', color: 'white', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <h2 style={titleStyles}>Conversational AI Assistant</h2>
              <h3 style={subtitleStyles}>Powered by Chainlit</h3>
              <p style={descriptionStyles}>
                User-friendly interface for building and deploying powerful conversational AI
              </p>
              <div style={{ textAlign: 'center' }}>
                <button style={buttonStyles}>Launch App →</button>
              </div>
            </a>
          </div>

          {/* Sixth App */}
          <div style={cardStyles}>
            <a href={`http://${EC2_PUBLIC_IP}:8506`} style={{ textDecoration: 'none', color: 'white', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <h2 style={titleStyles}>Interpretable & Explainable AI</h2>
              <h3 style={subtitleStyles}>Understanding AI Decision Making</h3>
              <p style={descriptionStyles}>
                A Visual Journey Through Interpretable & Explainable AI
              </p>
              <div style={{ textAlign: 'center' }}>
                <button style={buttonStyles}>Launch App →</button>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Footer with adjusted spacing */}
      <footer style={{ 
        textAlign: 'center', 
        padding: '0.75rem',
        color: '#6B7280',
        borderTop: '1px solid rgba(107, 114, 128, 0.1)',
        backgroundColor: 'rgba(17, 24, 39, 0.8)'
      }}>
        <p style={{ fontSize: '0.875rem', margin: 0 }}>
          Built with React & Streamlit
        </p>
      </footer>
    </div>
  );
};

export default App;