# Import necessary libraries
import streamlit as st
import json
import boto3

# Create the Streamlit app
def main():
    st.markdown('''

    ## Gen AI Conversations using AWS Bedrock API

    *Gen AI Conversations using AWS Bedrock API* is an application built with Streamlit, designed to generate artificial intelligence-based dialogues. It leverages the power of AWS's Bedrock API to invoke AI models. The application allows users to input prompts and receive AI-generated responses, facilitating conversations.
    ''')

    # Create an input box for the user to enter their query
    user_input = st.text_input("Enter your query here:")


    # When the user presses the 'Submit' button, send a request to the AWS API
    if st.button('Submit'):
        response_text = send_request(user_input)

        # Display the response from the AWS API
        st.write(response_text)

# Function to send a request to the AWS API
def send_request(prompt):
    # Create a session
    session = boto3.Session()

    # Create a Bedrock client
    bedrock = session.client(service_name='bedrock-runtime', region_name='us-east-1')

    # Define the model ID for Claude 3 Sonnet
    bedrock_model_id = "anthropic.claude-3-sonnet-20240229-v1:0"
    
    # Build the request payload for the Converse API
    request_body = {
        "modelId": bedrock_model_id,
        "messages": [
            {
                "role": "user",
                "content": [{"text": prompt}]
            }
        ],
        "inferenceConfig": {
            "maxTokens": 1024,
            "temperature": 0,
            "topP": 0.5,
            "stopSequences": []
        }
    }

    try:
        # Invoke the model using the Converse API
        response = bedrock.converse(
            modelId=bedrock_model_id,
            messages=request_body["messages"],
            inferenceConfig=request_body["inferenceConfig"]
        )

        # Parse the response
        response_text = response['output']['message']['content'][0]['text']

        return response_text

    except Exception as e:
        st.error(f"Error invoking Bedrock API: {e}")
        return "Sorry, I couldn't process your request."

# Run the Streamlit app
if __name__ == "__main__":
    main()
