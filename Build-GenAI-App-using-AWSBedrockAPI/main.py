# Import necessary libraries
import streamlit as st
import json
import boto3
from botocore.exceptions import ClientError, NoCredentialsError, PartialCredentialsError

# --- Constants ---
CLAUDE_MODEL_ID = "anthropic.claude-3-sonnet-20240229-v1:0"
TITAN_MODEL_ID = "amazon.titan-text-express-v1" # Chosen for text generation

API_CHOICES = {
    f"Converse API (Claude 3 Sonnet)": "converse",
    f"Invoke Model API (Amazon Titan Express)": "invoke_model"
}
AWS_REGION = "us-east-1" # Define region as a constant

# Create the Streamlit app

# Create the Streamlit app
def main():
    st.markdown('''

    ## Gen AI Conversations using AWS Bedrock API

    *Gen AI Conversations using AWS Bedrock API* is an application built with Streamlit, designed to generate artificial intelligence-based dialogues. It leverages the power of AWS's Bedrock API to invoke AI models. The application allows users to input prompts and receive AI-generated responses, facilitating conversations.
    ''')

    # API Selection
    selected_api_display_name = st.selectbox(
        "Choose an API/Model:",
        options=list(API_CHOICES.keys())
    )
    selected_api_short_name = API_CHOICES[selected_api_display_name]

    # Create an input box for the user to enter their query
    user_input = st.text_input("Enter your query here:")


    # When the user presses the 'Submit' button, send a request to the AWS API
    if st.button('Submit'):
        if not user_input.strip():
            st.warning("Please enter a query.")
            response_text = ""
        else:
            try:
                # Initialize Boto3 client once per submission
                # For long-running apps or frequent calls, consider initializing
                # the client once when the app starts, but for simple Streamlit
                # scripts, this is often fine.
                session = boto3.Session()
                bedrock_client = session.client(service_name='bedrock-runtime', region_name=AWS_REGION)

                if selected_api_short_name == "converse":
                    response_text = send_converse_request(user_input, bedrock_client)
                elif selected_api_short_name == "invoke_model":
                    response_text = send_invoke_model_request(user_input, bedrock_client)
                else:
                    st.error("Invalid API selection.")
                    response_text = "Error: Invalid API selection."
            except Exception as e: # Catch potential Boto3 session/client init errors
                st.error(f"Failed to initialize AWS Bedrock client: {e}")
                print(f"Bedrock client initialization error: {e}")
                response_text = "Sorry, could not connect to the AI service."

        # Display the response from the AWS API
        if response_text: # Only display if there's something to show
            st.write("### Response:")
            st.markdown(response_text)


# --- Bedrock API Handler Functions ---

def send_converse_request(prompt: str, bedrock_client):
    """
    Sends a request to the Bedrock Converse API using the specified Claude model.
    """
    try:
        messages = [{"role": "user", "content": [{"text": prompt}]}]

        response = bedrock_client.converse(
            modelId=CLAUDE_MODEL_ID,
            messages=messages,
            # You can add inferenceConfig here if needed, e.g.
            # inferenceConfig={"maxTokens": 1024, "temperature": 0.7}
        )

        if response and 'output' in response and 'message' in response['output'] and \
           'content' in response['output']['message'] and \
           isinstance(response['output']['message']['content'], list) and \
           len(response['output']['message']['content']) > 0 and \
           'text' in response['output']['message']['content'][0]:
            return response['output']['message']['content'][0]['text']
        else:
            st.error("Received an unexpected response structure from Converse API.")
            print(f"Converse API unexpected response: {response}")
            return "Sorry, I received an unexpected response from the AI service (Converse)."

    except (NoCredentialsError, PartialCredentialsError):
        st.error("AWS credentials not found. Please configure your AWS credentials.")
        return "Sorry, there's an issue with AWS authentication."
    except ClientError as e:
        error_code = e.response.get("Error", {}).get("Code")
        error_message = e.response.get("Error", {}).get("Message", str(e))
        st.error(f"AWS API Error (Converse - {error_code}): {error_message}")
        print(f"Bedrock Converse ClientError: {e}")
        if "AccessDeniedException" in str(e):
             return "Sorry, I don't have permission to access the Claude model. Please check IAM roles."
        return f"Sorry, an AWS API error occurred with Converse API: {error_code}"
    except Exception as e:
        st.error(f"An unexpected error occurred with Converse API: {e}")
        print(f"Converse API Unexpected error: {e}")
        return "Sorry, I couldn't process your request with Converse API due to an unexpected error."


def send_invoke_model_request(prompt: str, bedrock_client):
    """
    Sends a request to the Bedrock Invoke Model API using the specified Titan model.
    """
    try:
        # Prepare the payload for Titan Text Express
        # For conversational style, the docs suggest: "User: <prompt>\nBot:"
        # However, for simpler direct prompting, just the prompt is often fine.
        # Let's use a slightly more structured input if it helps the model.
        formatted_prompt = f"User: {prompt}\nBot:"

        body = json.dumps({
            "inputText": formatted_prompt,
            "textGenerationConfig": {
                "maxTokenCount": 2048,  # Max for Titan Express is 8192, using a smaller default
                "temperature": 0.7,
                "topP": 0.9
            }
        })

        response = bedrock_client.invoke_model(
            modelId=TITAN_MODEL_ID,
            body=body,
            contentType='application/json',
            accept='application/json'
        )

        response_body_str = response.get('body').read().decode('utf-8')
        response_body = json.loads(response_body_str)

        if response_body and 'results' in response_body and \
           isinstance(response_body['results'], list) and \
           len(response_body['results']) > 0 and \
           'outputText' in response_body['results'][0]:
            return response_body['results'][0]['outputText'].strip()
        else:
            st.error("Received an unexpected response structure from Invoke Model API (Titan).")
            print(f"Invoke Model API (Titan) unexpected response: {response_body}")
            return "Sorry, I received an unexpected response from the AI service (Invoke Model)."

    except (NoCredentialsError, PartialCredentialsError):
        st.error("AWS credentials not found. Please configure your AWS credentials.")
        return "Sorry, there's an issue with AWS authentication."
    except ClientError as e:
        error_code = e.response.get("Error", {}).get("Code")
        error_message = e.response.get("Error", {}).get("Message", str(e))
        st.error(f"AWS API Error (Invoke Model - {error_code}): {error_message}")
        print(f"Bedrock Invoke Model ClientError: {e}")
        if "AccessDeniedException" in str(e):
             return "Sorry, I don't have permission to access the Titan model. Please check IAM roles."
        return f"Sorry, an AWS API error occurred with Invoke Model API: {error_code}"
    except Exception as e:
        st.error(f"An unexpected error occurred with Invoke Model API: {e}")
        print(f"Invoke Model API Unexpected error: {e}")
        return "Sorry, I couldn't process your request with Invoke Model API due to an unexpected error."


# Run the Streamlit app
if __name__ == "__main__":
    main()
