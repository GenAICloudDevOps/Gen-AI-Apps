import gradio as gr
import requests
import os

# Backend API URL
BACKEND_URL = os.getenv('BACKEND_URL', 'http://backend:8000')

def chat_with_backend(message, history):
    """
    Send message to FastAPI backend and return response
    """
    if not message.strip():
        return history, ""
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/v1/chat",
            json={"message": message},
            timeout=30
        )
        
        if response.status_code == 200:
            response_text = response.json().get("response", "No response received")
        else:
            response_text = "Error: Unable to get response from server"
            
    except requests.exceptions.ConnectionError:
        response_text = "Error: Cannot connect to server"
    except requests.exceptions.Timeout:
        response_text = "Error: Request timeout"
    except Exception as e:
        response_text = "Error: Something went wrong"
    
    # Add to history
    history.append([message, response_text])
    return history, ""

def clear_chat():
    return [], ""

# Create Gradio interface
with gr.Blocks(title="Chat with AWS Bedrock") as demo:
    gr.Markdown("# Chat with AWS Bedrock")
    gr.Markdown("Ask me anything!")
    
    chatbot = gr.Chatbot(value=[], elem_id="chatbot")
    
    with gr.Row():
        msg = gr.Textbox(
            placeholder="Type your message here...",
            show_label=False,
            scale=4
        )
        send_btn = gr.Button("Send", scale=1)
        clear_btn = gr.Button("Clear", scale=1)
    
    # Event handlers
    send_btn.click(
        chat_with_backend,
        inputs=[msg, chatbot],
        outputs=[chatbot, msg]
    )
    
    msg.submit(
        chat_with_backend,
        inputs=[msg, chatbot],
        outputs=[chatbot, msg]
    )
    
    clear_btn.click(
        clear_chat,
        outputs=[chatbot, msg]
    )

# Launch the app
if __name__ == "__main__":
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=False
    )
