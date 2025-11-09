"""
This module provides a wrapper for the Gemini Pro large language model (LLM)
via the `langchain_google_genai` library. It is designed to be used in a Flask
application.
"""

import os
from typing import Optional
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

# --- Environment and Configuration ---
# Load environment variables from a .env file if present
load_dotenv()

# --- Gemini Chat Wrapper ---
class GeminiChatWrapper:
    """Thin wrapper around Gemini chat model with safe initialization."""
    def __init__(
        self,
        api_key: Optional[str] = None,
        model: Optional[str] = None,
        temperature: Optional[float] = None,
    ):
        """
        Initializes the GeminiChatWrapper.
        - Reads GOOGLE_API_KEY from env (via .env if present)
        - Allows for programmatic override of model and temperature.
        """
        self.api_key = api_key or os.getenv("GOOGLE_API_KEY")
        
        # Prefer env override for model; choose a widely available Gemini model by default
        self.model = model or os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        self.temperature = float(os.getenv("GEMINI_TEMPERATURE", "0.7"))
        
        self.llm: Optional[ChatGoogleGenerativeAI] = None
        self._initialize_client()

    def _initialize_client(self):
        """Initialize the Gemini client if API key is present; tolerate absence."""
        if not self.api_key:
            print("[gemini_demo] GOOGLE_API_KEY not found in environment.")
            # Defer initialization; allow the app to run without Gemini
            return
        
        try:
            self.llm = ChatGoogleGenerativeAI(
                google_api_key=self.api_key,
                model=self.model,
                temperature=self.temperature,
                convert_system_message_to_human=True
            )
            print("[gemini_demo] ChatGoogleGenerativeAI initialized successfully.")
        except Exception as e:
            print(f"[gemini_demo] Failed to initialize ChatGoogleGenerativeAI: {e}")

    def generate_response(self, system_prompt: str, user_prompt: str) -> str:
        """
        Generates a response from the LLM.
        Returns a string. If Gemini is not configured/reachable, returns a
        fallback message.
        """
        # One-time check if initialization failed or was deferred
        if self.llm is None:
            # If key was added after app start, try to re-initialize
            if os.getenv("GOOGLE_API_KEY"):
                self.api_key = os.getenv("GOOGLE_API_KEY")
                self._initialize_client()
            
            if self.llm is None:
                return (
                    "Gemini is not configured. Please set GOOGLE_API_KEY in the environment "
                    "and restart the application."
                )

        try:
            prompt = ChatPromptTemplate.from_messages([
                ("system", system_prompt),
                ("human", user_prompt),
            ])
            chain = prompt | self.llm
            response = chain.invoke({})
            return response.content
        except Exception as e:
            print(f"[gemini_demo] Error generating response: {e}")
            return "An error occurred while generating the response."

# --- Singleton Instance ---
# Create a single instance to avoid re-initializing on every call
_chat_wrapper_instance = GeminiChatWrapper()

def generate_response(system_prompt: str, user_prompt: str) -> str:
    """
    Global function to generate a response using the singleton instance.
    """
    return _chat_wrapper_instance.generate_response(system_prompt, user_prompt)
