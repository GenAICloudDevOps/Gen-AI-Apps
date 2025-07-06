import React, { useState } from 'react';
import './styles/animations.css';

// Get EC2 IP from environment variable or fallback to hardcoded value
const EC2_PUBLIC_IP = process.env.REACT_APP_EC2_IP || '54.162.147.9';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || `http://${EC2_PUBLIC_IP}`;

// Common styles for reusability and consistency
const cardStyles = {
  background: '#000C36',  // Dark blue background
  borderRadius: '0.75rem',  // Reduced from 1rem
  padding: '1.25rem 1.25rem 0.75rem',  // Reduced bottom padding
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
  border: '1px solid #3A3A3A',  // Added border
  cursor: 'pointer',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transform: 'scale(1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    border: '1px solid #8B5CF6'
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
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
  },
  '&:active': {
    transform: 'translateY(1px)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '0',
    height: '0',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    transition: 'width 0.3s, height 0.3s',
  },
  '&:hover::after': {
    width: '200px',
    height: '200px',
  }
};

const Card = ({ href, title, subtitle, description }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = (e) => {
    setLoading(true);
    
    // Reset loading state after 2 seconds
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Optional: Add error handling
    window.addEventListener('beforeunload', () => {
      setLoading(false);
    });

    // If the new window fails to open, reset loading state
    try {
      window.open(href, '_blank');
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div 
      className="card-enter"
      style={{
        ...cardStyles,
        transform: isHovered ? 'scale(1.02) translateY(-5px)' : 'scale(1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div className="float-animation" style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          padding: '5px 10px',
          background: 'rgba(139, 92, 246, 0.9)',
          borderRadius: '15px',
          fontSize: '0.8rem',
          color: 'white',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          Click to Launch
        </div>
      )}
      <div 
        onClick={handleClick}
        style={{ textDecoration: 'none', color: 'white', height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
        aria-label={`Open ${title} application`}
      >
        <h2 style={titleStyles}>{title}</h2>
        <h3 style={subtitleStyles}>{subtitle}</h3>
        <p style={descriptionStyles}>{description}</p>
        <div style={{ textAlign: 'center' }}>
          <button 
            style={{
              ...buttonStyles,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'wait' : 'pointer'
            }}
            aria-label={`Launch ${title}`}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Launch App →'}
          </button>
        </div>
      </div>
    </div>
  );
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
      {/* Environment indicator for development */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'rgba(139, 92, 246, 0.9)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '5px',
          fontSize: '0.8rem',
          zIndex: 1000
        }}>
          Dev Mode - API: {API_BASE_URL}
        </div>
      )}

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
        gap: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        {/* First Row - 3 apps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem'
        }}>
          <Card 
            href={`${API_BASE_URL}:8501`}
            title="RAG-DocuMind"
            subtitle="Intelligent Document Analysis & Response Platform"
            description="A Retrieval-Augmented Generation (RAG) application leveraging AWS services for document processing and analysis."
          />
          <Card 
            href={`${API_BASE_URL}:8502`}
            title="Prompt Engineering"
            subtitle="Summarize, Classify, Predict"
            description="A Retrieval-Augmented Generation (RAG) application using Streamlit and AWS allows users to summarize key information."
          />
          <Card 
            href={`${API_BASE_URL}:8503`}
            title="NIST AI RMF"
            subtitle="Generative Artificial Intelligence Profile"
            description="A Companion Resource for Implementing the AI RMF in Generative AI Systems."
          />
        </div>

        {/* Second Row - 3 apps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem'
        }}>
          <Card 
            href={`${API_BASE_URL}:8504`}
            title="Multi-Agent Collaboration"
            subtitle="Collaborative AI using CrewAI"
            description="Define agents Roles and Expertise to work in tandem"
          />
          <Card 
            href={`${API_BASE_URL}:8000`}
            title="Conversational AI Assistant"
            subtitle="Powered by Chainlit"
            description="User-friendly interface for building and deploying powerful conversational AI"
          />
          <Card 
            href={`${API_BASE_URL}:8506`}
            title="Interpretable & Explainable AI"
            subtitle="Understanding AI Decision Making"
            description="A Visual Journey Through Interpretable & Explainable AI"
          />
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
          Built with React Streamlit and Chainlit
        </p>
      </footer>
    </div>
  );
};

(() => {
  const style = document.createElement('style');
  style.textContent = `
    html { scroll-behavior: smooth; }
    *:focus { outline: 2px solid #8B5CF6; outline-offset: 2px; }
    @media (prefers-reduced-motion) {
      * { transition: none !important; animation: none !important; }
    }
  `;
  document.head.appendChild(style);
})();

export default App;

// Common styles for reusability and consistency
const cardStyles = {
  background: '#000C36',  // Dark blue background
  borderRadius: '0.75rem',  // Reduced from 1rem
  padding: '1.25rem 1.25rem 0.75rem',  // Reduced bottom padding
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
  border: '1px solid #3A3A3A',  // Added border
  cursor: 'pointer',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transform: 'scale(1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    border: '1px solid #8B5CF6'
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
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
  },
  '&:active': {
    transform: 'translateY(1px)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '0',
    height: '0',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    transition: 'width 0.3s, height 0.3s',
  },
  '&:hover::after': {
    width: '200px',
    height: '200px',
  }
};

const Card = ({ href, title, subtitle, description }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = (e) => {
    setLoading(true);
    
    // Reset loading state after 2 seconds
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Optional: Add error handling
    window.addEventListener('beforeunload', () => {
      setLoading(false);
    });

    // If the new window fails to open, reset loading state
    try {
      window.open(href, '_blank');
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div 
      className="card-enter"
      style={{
        ...cardStyles,
        transform: isHovered ? 'scale(1.02) translateY(-5px)' : 'scale(1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div className="float-animation" style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          padding: '5px 10px',
          background: 'rgba(139, 92, 246, 0.9)',
          borderRadius: '15px',
          fontSize: '0.8rem',
          color: 'white',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          Click to Launch
        </div>
      )}
      <div 
        onClick={handleClick}
        style={{ textDecoration: 'none', color: 'white', height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
        aria-label={`Open ${title} application`}
      >
        <h2 style={titleStyles}>{title}</h2>
        <h3 style={subtitleStyles}>{subtitle}</h3>
        <p style={descriptionStyles}>{description}</p>
        <div style={{ textAlign: 'center' }}>
          <button 
            style={{
              ...buttonStyles,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'wait' : 'pointer'
            }}
            aria-label={`Launch ${title}`}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Launch App →'}
          </button>
        </div>
      </div>
    </div>
  );
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
        gap: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        {/* First Row - 3 apps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem'
        }}>
          <Card 
            href={`http://${EC2_PUBLIC_IP}:8501`}
            title="RAG-DocuMind"
            subtitle="Intelligent Document Analysis & Response Platform"
            description="A Retrieval-Augmented Generation (RAG) application leveraging AWS services for document processing and analysis."
          />
          <Card 
            href={`http://${EC2_PUBLIC_IP}:8502`}
            title="Prompt Engineering"
            subtitle="Summarize, Classify, Predict"
            description="A Retrieval-Augmented Generation (RAG) application using Streamlit and AWS allows users to summarize key information."
          />
          <Card 
            href={`http://${EC2_PUBLIC_IP}:8503`}
            title="NIST AI RMF"
            subtitle="Generative Artificial Intelligence Profile"
            description="A Companion Resource for Implementing the AI RMF in Generative AI Systems."
          />
        </div>

        {/* Second Row - 3 apps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem'
        }}>
          <Card 
            href={`http://${EC2_PUBLIC_IP}:8504`}
            title="Multi-Agent Collaboration"
            subtitle="Collaborative AI using CrewAI"
            description="Define agents Roles and Expertise to work in tandem"
          />
          <Card 
            href={`http://${EC2_PUBLIC_IP}:8000`}
            title="Conversational AI Assistant"
            subtitle="Powered by Chainlit"
            description="User-friendly interface for building and deploying powerful conversational AI"
          />
          <Card 
            href={`http://${EC2_PUBLIC_IP}:8506`}
            title="Interpretable & Explainable AI"
            subtitle="Understanding AI Decision Making"
            description="A Visual Journey Through Interpretable & Explainable AI"
          />
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
          Built with React Streamlit and Chainlit
        </p>
      </footer>
    </div>
  );
};

(() => {
  const style = document.createElement('style');
  style.textContent = `
    html { scroll-behavior: smooth; }
    *:focus { outline: 2px solid #8B5CF6; outline-offset: 2px; }
    @media (prefers-reduced-motion) {
      * { transition: none !important; animation: none !important; }
    }
  `;
  document.head.appendChild(style);
})();

export default App;