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

    # Define the model ID
    bedrock_model_id = "mention the model ID" # update the Model ID 
    
    # Build the request payload
    body = json.dumps({
        "prompt": prompt,
        "maxTokens": 1024,
        "temperature": 0,
        "topP": 0.5,
        "stopSequences": [],
        "countPenalty": {"scale": 0 },
        "presencePenalty": {"scale": 0 },
        "frequencyPenalty": {"scale": 0 }
    })

    # Invoke the model
    response = bedrock.invoke_model(body=body, modelId=bedrock_model_id, accept='application/json', contentType='application/json')

    # Parse the response
    response_body = json.loads(response.get('body').read())
    response_text = response_body.get("completions")[0].get("data").get("text")

    # Return the response text
    return response_text

# Run the Streamlit app
if __name__ == "__main__":
    main()
