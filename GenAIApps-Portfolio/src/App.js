import React from 'react';

const EC2_PUBLIC_IP = '54.158.93.206';

// Common styles for reusability and consistency
const cardStyles = {
  background: '#000C36',  // Dark blue background
  borderRadius: '0.75rem',  // Reduced from 1rem
  padding: '1.25rem 1.25rem 0.75rem',  // Reduced bottom padding
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
  border: '1px solid #3A3A3A',  // Added border
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
  fontSize: '1.5rem',          // Reduced from 2rem
  marginBottom: '0.3rem',
  textAlign: 'center',
  color: '#F0F0F0',        // Slightly reduced white
  fontWeight: '600',
  height: '35px',            // Reduced height
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: '1.2'
};

const subtitleStyles = {
  fontSize: '0.95rem',     // Reduced from 1.1rem
  color: '#E8E8E8',        // More reduced white
  backgroundColor: 'transparent',  // Removed background color
  padding: '0.2rem 0.5rem',
  borderRadius: '4px',
  marginBottom: '0.4rem',
  textAlign: 'center',
  height: '28px',          // Reduced from 30px to match smaller font
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: '1.2'
};

const descriptionStyles = {
  color: '#E0E0E0',        // Even more reduced white
  marginBottom: '0.75rem',
  lineHeight: '1.35',      // Slightly reduced line height
  flexGrow: 1,
  fontSize: '0.9rem',      // Reduced from 1rem
  textAlign: 'center',
  padding: '0 0.5rem'
};

// Update header text styles to be slightly less bright
const headerStyles = {
  title: {
    fontSize: '2.5rem',         // Reduced from 3rem
    marginBottom: '0.5rem',     // Reduced from 1rem
    color: '#333333',  // Dark gray
    fontWeight: '600',
    background: 'linear-gradient(180deg, #B794F4 0%, #9F7AEA 100%)',  // Light to medium purple gradient
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent'
  },
  subtitle: {
    fontSize: '1.5rem',         // Reduced from 1.75rem
    color: '#F0F0F0',  // Slightly reduced white
    marginBottom: '0.5rem',     // Reduced from 1rem
    fontWeight: '500',
    background: 'none',  // Remove gradient
    WebkitBackgroundClip: 'unset',
    WebkitTextFillColor: '#F0F0F0',  // Slightly reduced white
    backgroundClip: 'unset',
    textFillColor: 'unset'
  },
  description: {
    fontSize: '1.25rem',        // Reduced from 1.35rem
    color: '#E0E0E0',  // Even more reduced white
    maxWidth: '800px',
    margin: '0 auto 1rem',      // Reduced from 2rem
    lineHeight: '1.4',          // Reduced from 1.5
    fontWeight: '400'
  }
};

const buttonStyles = {
  background: `linear-gradient(
    135deg,
    #2D1B4E 0%,
    #1E4D45 50%,
    #006064 70%,
    #2D1B4E 100%
  )`,  // Matching main background gradient
  color: '#F0F0F0',       // Slightly reduced white text
  padding: '0.5rem 1.75rem',
  borderRadius: '9999px',
  fontWeight: '600',
  border: '2px solid #8B5CF6',  // Light purple border
  cursor: 'pointer',
  transition: 'all 0.2s',
  fontSize: '1rem',
  marginTop: 'auto',
  '&:hover': {
    opacity: '0.9',  // Simple hover effect
    color: '#FFFFFF'
  }
};

const App = () => {
  return (
    <div style={{ 
      background: `
        linear-gradient(
          135deg,
          #2D1B4E 0%,    /* Dark Purple base */
          #1E4D45 50%,   /* Dark Green transition */
          #006064 70%,   /* Cyan accent */
          #2D1B4E 100%   /* Back to Dark Purple */
        )`,
      minHeight: '100vh', 
      color: '#E8E8E8'  // Default text color
    }}>
      {/* Reduced header padding */}
      <div style={{ textAlign: 'center', padding: '1.5rem 2rem 1rem' }}>
        <h1 style={headerStyles.title}>
          GenAI Apps - Portfolio
        </h1>
        <p style={headerStyles.subtitle}>
          Welcome to my GenAI Apps
        </p>
        <p style={headerStyles.description}>
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
              <h2 style={titleStyles}>Multi-Agent Collaboration</h2>
              <h3 style={subtitleStyles}>Collaborative AI using CrewAI</h3>
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
            <a href={`http://${EC2_PUBLIC_IP}:8000`} style={{ textDecoration: 'none', color: 'white', height: '100%', display: 'flex', flexDirection: 'column' }}>
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
        color: '#D0D0D0',  // Reduced whiteness for footer
        borderTop: '1px solid rgba(107, 114, 128, 0.1)',
        backgroundColor: 'rgba(0, 12, 54, 0.8)'  // Matching main color with transparency
      }}>
        <p style={{ fontSize: '0.875rem', margin: 0 }}>
          Built with React & Streamlit
        </p>
      </footer>
    </div>
  );
};

export default App;