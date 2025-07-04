import streamlit as st
import requests
import json
import os
from typing import Dict, Any

# Configuration
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")

# Page config
st.set_page_config(
    page_title="MCP Tools Dashboard",
    page_icon="🛠️",
    layout="wide",
    initial_sidebar_state="expanded"
)

class MCPClient:
    def __init__(self, backend_url: str):
        self.backend_url = backend_url
    
    def get_tools(self):
        try:
            response = requests.get(f"{self.backend_url}/tools", timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.ConnectionError:
            st.error("❌ Cannot connect to backend server. Please ensure the backend is running.")
            return None
        except requests.exceptions.Timeout:
            st.error("⏱️ Request timed out. Backend server may be overloaded.")
            return None
        except requests.exceptions.HTTPError as e:
            st.error(f"❌ HTTP error occurred: {e}")
            return None
        except Exception as e:
            st.error(f"❌ Unexpected error fetching tools: {str(e)}")
            return None
    
    def execute_tool(self, tool_name: str, arguments: Dict[str, Any]):
        try:
            response = requests.post(
                f"{self.backend_url}/execute",
                json={"tool_name": tool_name, "arguments": arguments},
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.ConnectionError:
            st.error("❌ Cannot connect to backend server. Please ensure the backend is running.")
            return None
        except requests.exceptions.Timeout:
            st.error("⏱️ Request timed out. The operation may be taking longer than expected.")
            return None
        except requests.exceptions.HTTPError as e:
            st.error(f"❌ HTTP error occurred: {e}")
            return None
        except Exception as e:
            st.error(f"❌ Unexpected error executing tool: {str(e)}")
            return None

def main():
    st.title("🛠️ MCP Tools Dashboard")
    st.markdown("---")
    
    # Initialize client
    client = MCPClient(BACKEND_URL)
    
    # Sidebar
    with st.sidebar:
        st.header("🔧 Available Tools")
        
        # Health check
        try:
            health_response = requests.get(f"{BACKEND_URL}/health", timeout=5)
            if health_response.status_code == 200:
                st.success("✅ Backend Connected")
                # Show additional info if available
                health_data = health_response.json()
                if health_data.get("mcp_compliant"):
                    st.info("🔧 MCP Compliant Server")
            else:
                st.error("❌ Backend Disconnected")
        except requests.exceptions.ConnectionError:
            st.error("❌ Backend Unreachable")
            st.info("💡 Make sure to start the backend server:\n`python backend/hybrid_main.py`")
        except requests.exceptions.Timeout:
            st.warning("⏱️ Backend Slow Response")
        except Exception as e:
            st.error(f"❌ Health Check Failed: {str(e)}")
        
        st.markdown("---")
        
        # Tool selection
        tools_data = client.get_tools()
        if tools_data and "tools" in tools_data:
            tool_names = [tool["name"] for tool in tools_data["tools"]]
            selected_tool = st.selectbox("Select Tool", tool_names)
        else:
            st.error("No tools available")
            return
    
    # Main content area
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.header("📝 Input")
        
        if selected_tool == "calculator":
            st.subheader("🧮 Calculator")
            expression = st.text_input(
                "Mathematical Expression",
                placeholder="e.g., 2+2, 10*5, sqrt(16)",
                help="Enter a mathematical expression to calculate"
            )
            
            if st.button("Calculate", type="primary"):
                if expression:
                    with st.spinner("Calculating..."):
                        result = client.execute_tool("calculator", {"expression": expression})
                        if result and result.get("success"):
                            st.session_state.last_result = result["result"]
                        else:
                            st.error(f"Error: {result.get('error', 'Unknown error')}")
        
        elif selected_tool == "text_analyzer":
            st.subheader("📊 Text Analyzer")
            text_input = st.text_area(
                "Text to Analyze",
                height=150,
                placeholder="Enter text to analyze..."
            )
            
            analysis_type = st.selectbox(
                "Analysis Type",
                ["basic", "sentiment", "summary"],
                help="Choose the type of analysis to perform"
            )
            
            if st.button("Analyze", type="primary"):
                if text_input:
                    with st.spinner("Analyzing..."):
                        result = client.execute_tool(
                            "text_analyzer", 
                            {"text": text_input, "analysis_type": analysis_type}
                        )
                        if result and result.get("success"):
                            st.session_state.last_result = result["result"]
                        else:
                            st.error(f"Error: {result.get('error', 'Unknown error')}")
    
    with col2:
        st.header("📋 Results")
        
        if hasattr(st.session_state, 'last_result'):
            result_text = st.session_state.last_result
            
            # Try to parse as JSON for better formatting
            try:
                parsed_result = json.loads(result_text)
                st.json(parsed_result)
            except:
                st.text_area("Result", result_text, height=200, disabled=True)
            
            # Download button
            st.download_button(
                label="📥 Download Result",
                data=result_text,
                file_name=f"{selected_tool}_result.txt",
                mime="text/plain"
            )
        else:
            st.info("👆 Select a tool and provide input to see results here")
    
    # Footer
    st.markdown("---")
    with st.expander("ℹ️ About MCP Tools"):
        st.markdown("""
        **Model Context Protocol (MCP) Tools Dashboard**
        
        This application demonstrates MCP-compliant tools:
        
        - **Calculator**: Performs mathematical calculations
        - **Text Analyzer**: Analyzes text with basic metrics, sentiment analysis, and summarization
        
        **Architecture:**
        - FastAPI backend with MCP server implementation
        - Streamlit frontend for user interaction
        - AWS Bedrock integration for AI-powered text analysis
        - Docker containerization for easy deployment
        """)

if __name__ == "__main__":
    main()
