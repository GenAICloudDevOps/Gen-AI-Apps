import React from 'react';

const EC2_PUBLIC_IP = '54.158.93.206';

// Common styles for reusability and consistency
const cardStyles = {
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '0.75rem',  // Reduced from 1rem
  padding: '1.25rem',       // Reduced from 2rem
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  cursor: 'pointer',
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
};

const titleStyles = {
  fontSize: '1.5rem',      // Reduced from 2rem
  marginBottom: '0.5rem',  // Reduced from 1rem
  textAlign: 'center',
  color: 'white',
  fontWeight: 'bold',
  height: '40px',         // Reduced from 60px
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const subtitleStyles = {
  fontSize: '1.1rem',      // Reduced from 1.25rem
  color: '#a7f3d0',
  marginBottom: '1rem',    // Reduced from 1.5rem
  textAlign: 'center',
  height: '35px',         // Reduced from 50px
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const descriptionStyles = {
  color: '#d1fae5',
  marginBottom: '1rem',    // Reduced from 2rem
  lineHeight: '1.4',       // Reduced from 1.6
  flexGrow: 1,
  fontSize: '1rem',        // Reduced from 1.1rem
  textAlign: 'center',
  padding: '0 0.5rem'      // Reduced from 1rem
};

const buttonStyles = {
  background: '#4ade80',
  color: '#064e3b',
  padding: '0.5rem 1.5rem', // Reduced padding
  borderRadius: '9999px',
  fontWeight: 'bold',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s',
  fontSize: '1rem'          // Reduced from 1.1rem
};

const App = () => {
  return (
    <div style={{ backgroundColor: '#111827', minHeight: '100vh', color: 'white' }}>
      {/* Header with minimal padding */}
      <div style={{ textAlign: 'center', padding: '1.5rem 2rem 1rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'white' }}>
          GenAI Apps - Portfolio
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#a7f3d0', marginBottom: '0.5rem' }}>
          Welcome to my GenAI Apps
        </p>
        <p style={{ 
          fontSize: '1rem', 
          color: '#a7f3d0', 
          maxWidth: '800px', 
          margin: '0 auto 1rem',
          lineHeight: '1.4'
        }}>
          Supports various document types, offers lightweight TF-IDF or Mistral's embedding for analysis, 
          uses advanced chunking strategies, runs on AWS for reliability, provides context-aware responses, 
          and includes customizable temperature and token limits along with real-time diagnostics
        </p>
      </div>

      {/* Three-Two Row Layout with optimized spacing */}
      <div style={{ 
        maxWidth: '1400px',
        margin: '0 auto', 
        padding: '0 2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        {/* First Row - Three Apps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem'
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

        {/* Second Row - Two Apps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.5rem',
          maxWidth: '1000px',  // Slightly narrower to maintain visual balance
          margin: '0 auto',    // Center the second row
          width: '100%'
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
        </div>
      </div>

      {/* Footer with minimal padding */}
      <footer style={{ textAlign: 'center', padding: '1rem', color: '#9CA3AF', marginTop: '1rem' }}>
        <p>© 2024 GenAI Apps Portfolio. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;