"""
Web Search Streamlit App
Environment-aware AI-powered web search using DuckDuckGo and AWS Bedrock
"""
import streamlit as st
import requests
import os
import time
import random
from duckduckgo_search import DDGS

# App configuration
st.set_page_config(
    page_title="Web Search",
    page_icon="🔍",
    layout="centered"
)

# Environment-aware configuration
DEPLOYMENT_ENV = os.getenv("DEPLOYMENT_ENV", "local")
HOST_IP = os.getenv("HOST_IP", "localhost")
PUBLIC_IP = os.getenv("PUBLIC_IP", "localhost")

# Backend API URL - Use environment variable for Docker networking
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000") + "/api/v1/bedrock"

def get_app_url():
    """Get the current app URL based on environment"""
    if DEPLOYMENT_ENV == "cloud":
        return f"http://{PUBLIC_IP}:8503"
    else:
        return "http://localhost:8503"

def search_web(query, max_results=5):
    """Search web using DuckDuckGo with rate limiting and retry logic"""
    max_retries = 3
    base_delay = 2
    
    for attempt in range(max_retries):
        try:
            # Add random delay to avoid rate limiting
            if attempt > 0:
                delay = base_delay * (2 ** attempt) + random.uniform(0, 1)
                st.info(f"Rate limited. Retrying in {delay:.1f} seconds... (Attempt {attempt + 1}/{max_retries})")
                time.sleep(delay)
            
            # Use different search parameters to avoid detection
            search_params = {
                'safesearch': 'moderate',
                'timelimit': None,
                'backend': 'api'  # Use API backend instead of HTML scraping
            }
            
            with DDGS() as ddgs:
                results = []
                search_results = ddgs.text(
                    query, 
                    max_results=max_results,
                    **search_params
                )
                
                for result in search_results:
                    results.append({
                        'title': result.get('title', ''),
                        'body': result.get('body', ''),
                        'href': result.get('href', '')
                    })
                
                if results:
                    return results
                else:
                    st.warning("No results found for this query.")
                    return []
                    
        except Exception as e:
            error_msg = str(e).lower()
            
            if 'ratelimit' in error_msg or '202' in error_msg:
                if attempt < max_retries - 1:
                    continue  # Retry on rate limit
                else:
                    st.error("🚫 DuckDuckGo rate limit reached. Please try again in a few minutes.")
                    st.info("💡 **Tip**: Try using more specific search terms or wait a moment before searching again.")
                    return []
            else:
                st.error(f"Search error: {str(e)}")
                return []
    
    return []

def analyze_with_ai(search_results, query):
    """Analyze search results with AWS Bedrock"""
    try:
        # Prepare context from search results
        context = f"Search query: {query}\n\nSearch results:\n"
        for i, result in enumerate(search_results[:3], 1):
            context += f"{i}. {result['title']}\n{result['body'][:200]}...\n\n"
        
        # Ask AI to analyze and summarize
        prompt = f"{context}\nBased on these search results, provide a comprehensive answer to the query: '{query}'"
        
        response = requests.post(
            f"{API_BASE_URL}/chat",
            json={"message": prompt},
            timeout=30
        )
        
        if response.status_code == 200:
            return response.json()["response"]
        else:
            return f"AI Analysis Error: {response.status_code}"
            
    except Exception as e:
        return f"AI Analysis Error: {str(e)}"

def main():
    st.title("🔍 AI Web Search")
    st.write("Search the web and get AI-powered insights using DuckDuckGo and AWS Bedrock")
    
    # Rate limiting notice
    st.info("💡 **Note**: To avoid rate limits, please wait a few seconds between searches.")
    
    # Search input
    query = st.text_input("Enter your search query:", placeholder="e.g., latest AI developments")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        search_clicked = st.button("🔍 Search Web", type="primary")
    
    with col2:
        max_results = st.selectbox("Results:", [3, 5, 8], index=1)
    
    # Session state to track last search time
    if 'last_search_time' not in st.session_state:
        st.session_state.last_search_time = 0
    
    if search_clicked and query:
        # Check if enough time has passed since last search
        current_time = time.time()
        time_since_last = current_time - st.session_state.last_search_time
        min_interval = 3  # Minimum 3 seconds between searches
        
        if time_since_last < min_interval:
            remaining = min_interval - time_since_last
            st.warning(f"⏳ Please wait {remaining:.1f} more seconds before searching again to avoid rate limits.")
            return
        
        st.session_state.last_search_time = current_time
        
        with st.spinner("Searching the web..."):
            # Perform web search
            search_results = search_web(query, max_results)
            
            if search_results:
                st.success(f"Found {len(search_results)} results")
                
                # Display search results
                st.subheader("📄 Search Results")
                for i, result in enumerate(search_results, 1):
                    with st.expander(f"{i}. {result['title']}", expanded=False):
                        st.write(result['body'])
                        st.markdown(f"🔗 [Read more]({result['href']})")
                
                # AI Analysis
                st.subheader("🤖 AI Analysis")
                with st.spinner("Analyzing results with AI..."):
                    ai_analysis = analyze_with_ai(search_results, query)
                    
                    if ai_analysis and not ai_analysis.startswith("AI Analysis Error"):
                        st.markdown("### Summary & Insights")
                        st.write(ai_analysis)
                    else:
                        st.warning("AI analysis unavailable. Check your AWS Bedrock configuration.")
                        if ai_analysis:
                            st.error(ai_analysis)
            else:
                st.warning("No search results found. Try a different query or wait a moment before trying again.")
    
    # Sidebar with environment info
    with st.sidebar:
        st.header("App Info")
        st.write("**Web Search with AI**")
        st.write("Search the web and get AI insights")
        
        st.header("Environment")
        st.write(f"**Environment:** {DEPLOYMENT_ENV}")
        st.write(f"**Host IP:** {HOST_IP}")
        if DEPLOYMENT_ENV == "cloud":
            st.write(f"**Public IP:** {PUBLIC_IP}")
        st.write(f"**App URL:** {get_app_url()}")
        
        # Backend connectivity test
        if st.button("Test Backend"):
            with st.spinner("Testing..."):
                try:
                    response = requests.get(API_BASE_URL.replace("/api/v1/bedrock", "/health"), timeout=5)
                    if response.status_code == 200:
                        st.success("✅ Backend connected")
                    else:
                        st.error("❌ Backend not responding")
                except:
                    st.error("❌ Backend connection failed")
        
        st.header("Search Tips")
        st.write("• Use specific keywords")
        st.write("• Wait 3+ seconds between searches")
        st.write("• Try 3-5 results for faster response")
        st.write("• Be patient with rate limits")
        
        st.header("Features")
        st.write("• **Web Search:** DuckDuckGo integration")
        st.write("• **AI Analysis:** AWS Bedrock insights")
        st.write("• **Rate Limiting:** Smart retry logic")
        st.write("• **Multi-source:** Comprehensive results")
    
    # Instructions
    with st.expander("ℹ️ How it works", expanded=False):
        st.markdown("""
        **This app combines web search with AI analysis:**
        
        1. **Web Search**: Uses DuckDuckGo to find relevant web content
        2. **AI Analysis**: AWS Bedrock analyzes results and provides insights
        3. **Smart Summary**: Get comprehensive answers beyond just search results
        
        **Tips for better results:**
        - Use specific, clear search terms
        - Wait a few seconds between searches to avoid rate limits
        - Try different phrasings if results aren't relevant
        - The AI will synthesize information from multiple sources
        
        **Rate Limiting:**
        - DuckDuckGo has rate limits to prevent abuse
        - The app automatically retries with delays if rate limited
        - Wait 3+ seconds between searches for best results
        """)
    
    # Troubleshooting section
    with st.expander("🔧 Troubleshooting", expanded=False):
        st.markdown("""
        **If you see rate limit errors:**
        
        1. **Wait**: Give it 2-3 minutes before trying again
        2. **Be specific**: Use more targeted search terms
        3. **Reduce results**: Try searching for fewer results (3 instead of 8)
        4. **Alternative**: Use the AI Chat app to ask questions directly
        
        **Common solutions:**
        - Clear browser cache and refresh the page
        - Try different search terms
        - Use the Document Analysis app for uploaded content instead
        """)

if __name__ == "__main__":
    main()
