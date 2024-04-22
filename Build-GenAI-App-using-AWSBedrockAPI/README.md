# Overview
This script is a Streamlit application that uses the AWS Bedrock API to generate AI-based dialogues. The application allows users to input prompts and receive AI-generated responses, facilitating conversations.

## Prerequisites
- **Python**: This application is written in Python. You need to have Python installed on your system.
- **AWS Account**: This application uses AWS Bedrock API. You need to have access to an AWS account and use services like EC2, IAM, and Bedrock etc.


## Installation
To install and run this application, follow the steps below:

1. Clone the repository

2. Install the dependencies

'pip install streamlit boto3'

3. Set up AWS credentials

This application requires AWS credentials to access the Bedrock API. Make sure to configure your AWS credentials by running:
aws configure

You will be prompted to provide your AWS Access Key ID, Secret Access Key, default region name, and default output format.

4. Run the application

You can start the application by running:
'streamlit run <filename.py>'
Replace <filename.py> with the name of the Python file.

## Usage
To use this application, run the script, navigate to the displayed URL in a web browser, enter a query in the text input, and click 'Submit'. The AI-generated response will be displayed below the 'Submit' button.

