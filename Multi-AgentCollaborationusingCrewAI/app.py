import os
import streamlit as st
from crewai import Agent, Task, Crew  
from dotenv import load_dotenv
import requests
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# API Configuration
MISTRAL_API_KEY = os.getenv('MISTRAL_API_KEY')
MISTRAL_API_ENDPOINT = "https://api.mistral.ai/v1/chat/completions"

def process_with_mistral(prompt, model="mistral-small-latest"):
    """Direct Mistral API processing function"""
    if not MISTRAL_API_KEY:
        st.error("Mistral API key not found!")
        logger.error("Missing Mistral API key")
        return "Error: Mistral API key not configured"

    headers = {
        "Authorization": f"Bearer {MISTRAL_API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 1000,
        "temperature": 0.7
    }
    
    try:
        response = requests.post(
            MISTRAL_API_ENDPOINT,
            headers=headers,
            json=data,
            timeout=30
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        logger.error(f"Mistral API error: {str(e)}")
        return f"Error: {str(e)}"

# Streamlit page config and centered title
st.set_page_config(page_title="Multi-Agent Collaboration using CrewAI", page_icon=None, layout="wide")
st.markdown("<h1 style='text-align: center;'>Multi-Agent Collaboration using CrewAI</h1>", unsafe_allow_html=True)
st.markdown("<p style='text-align: center; font-size: 1.2em;'>Unlock the power of collaborative AI with the innovative Streamlit application. Define two AI agents—each with unique roles and expertise—to work in tandem: one agent dives deep into research, while the other crafts a polished, insightful report based on the findings. Powered by CrewAI and Mistral API</p>", unsafe_allow_html=True)

# Create three main columns for the layout
input_col, agent_tom_col, agent_alice_col = st.columns([1, 1.5, 1.5])

# Left column: Input controls and status
with input_col:
    st.markdown("### Query Details")
    topic = st.text_input(
        "Enter a Topic",
        placeholder="e.g., Artificial Intelligence trends 2024"
    )
    
    model = st.selectbox(
        "Select Model",
        ["mistral-small-latest", "open-mistral-7b", "codestral-latest"],
        help="Select the AI model to use"
    )
    
    submit_button = st.button("Generate", type="primary", use_container_width=True)
    
    # Status display section
    st.markdown("### Current Status")
    status_placeholder = st.empty()

# Middle column: Agent Tom
with agent_tom_col:
    st.markdown("<h3 style='text-align: center;'>Agent: Tom</h3>", unsafe_allow_html=True)
    with st.container():
        role1 = st.text_input(
            "Role",
            key="tom_role",
            placeholder="e.g., Senior Research Analyst, Data Scientist"
        )
        
        goal1 = st.text_area(
            "Goal",
            key="tom_goal",
            placeholder="e.g., Conduct comprehensive research and analysis",
            height=100
        )
        
        backstory1 = st.text_area(
            "Backstory",
            key="tom_backstory",
            placeholder="e.g., A leading expert with 15 years of experience",
            height=100
        )
        
        task1 = st.text_area(
            "Task Description",
            key="tom_task",
            placeholder="e.g., Research current trends and analyze data",
            height=100
        )

# Right column: Agent Alice
with agent_alice_col:
    st.markdown("<h3 style='text-align: center;'>Agent: Alice</h3>", unsafe_allow_html=True)
    with st.container():
        role2 = st.text_input(
            "Role",
            key="alice_role",
            placeholder="e.g., Content Strategist, Technical Writer"
        )
        
        goal2 = st.text_area(
            "Goal",
            key="alice_goal",
            placeholder="e.g., Transform findings into clear content",
            height=100
        )
        
        backstory2 = st.text_area(
            "Backstory",
            key="alice_backstory",
            placeholder="e.g., Award-winning writer making complex topics accessible",
            height=100
        )
        
        task2 = st.text_area(
            "Task Description",
            key="alice_task",
            placeholder="e.g., Create well-structured report with examples",
            height=100
        )

def update_status(message):
    """Update status with consistent styling"""
    status_placeholder.info(message)

# Modified generate_content function to use status_placeholder
def generate_content(topic, selected_model):
    try:
        if not all([topic, role1, goal1, backstory1, task1,
                   role2, goal2, backstory2, task2]):
            status_placeholder.error("Please fill in all fields")
            return None

        # Research Phase
        status_placeholder.info("Starting research phase...")
        research_prompt = f"""As a {role1} with the following background: {backstory1}
        Goal: {goal1}
        Task: {task1}
        Topic: {topic}
        Please provide comprehensive research on this topic."""

        headers = {
            "Authorization": f"Bearer {MISTRAL_API_KEY}",
            "Content-Type": "application/json"
        }
        
        # First API call for research
        research_data = {
            "model": selected_model,
            "messages": [{"role": "user", "content": research_prompt}],
            "temperature": 0.7,
            "max_tokens": 1000
        }
        
        research_response = requests.post(
            MISTRAL_API_ENDPOINT,
            headers=headers,
            json=research_data,
            timeout=30
        )
        research_response.raise_for_status()
        research_results = research_response.json()["choices"][0]["message"]["content"]

        # Writing Phase
        status_placeholder.info("Starting writing phase...")
        writing_prompt = f"""As a {role2} with the following background: {backstory2}
        Goal: {goal2}
        Task: {task2}
        Based on this research: {research_results}
        Please create a well-structured report about {topic}."""

        # Second API call for writing
        writing_data = {
            "model": selected_model,
            "messages": [{"role": "user", "content": writing_prompt}],
            "temperature": 0.7,
            "max_tokens": 1000
        }
        
        writing_response = requests.post(
            MISTRAL_API_ENDPOINT,
            headers=headers,
            json=writing_data,
            timeout=30
        )
        writing_response.raise_for_status()
        final_content = writing_response.json()["choices"][0]["message"]["content"]

        status_placeholder.success("Content generation complete!")
        return final_content

    except requests.exceptions.RequestException as e:
        status_placeholder.error(f"API Error: {str(e)}")
        return None
    except Exception as e:
        status_placeholder.error(f"Error: {str(e)}")
        return None

# Create a new section below all columns for results
st.markdown("---")
results_container = st.container()

# Main content area
if submit_button and topic:
    with st.spinner(''):
        result = generate_content(topic, model)
        
        if result and isinstance(result, str):
            with results_container:
                st.markdown("<h3 style='text-align: center;'>Generated Content</h3>", unsafe_allow_html=True)
                st.markdown(result)
elif submit_button:
    status_placeholder.warning("Please enter a topic")