import os
from typing import Optional

from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage


class ResponseGenerator:
    """Thin wrapper around Groq chat model with safe initialization.

    - Reads GROQ_API_KEY from env (via .env if present)
    - Avoids raising at import time so the Flask app can start even if unset
    - Returns a helpful fallback string when not configured
    """

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        # Load environment variables from a .env file if available
        load_dotenv()

        self.api_key = api_key or os.getenv("GROQ_API_KEY")
        # Prefer env override for model; choose a widely available Groq model by default
        self.model = model or os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
        self.temperature = float(os.getenv("GROQ_TEMPERATURE", "0.7"))

        self.llm: Optional[ChatGroq] = None
        self._maybe_init_client()

    def _maybe_init_client(self):
        """Initialize the Groq client if API key is present; tolerate absence."""
        if self.llm is not None:
            return
        if not self.api_key:
            # Defer initialization; allow the app to run without Groq
            return
        try:
            # ChatGroq expects parameter name `model`, not `model_name`
            self.llm = ChatGroq(
                groq_api_key=self.api_key,
                model=self.model,
                temperature=self.temperature,
            )
        except Exception as e:
            # Do not crash the app; just log and keep fallback path
            print(f"[groq_demo] Failed to initialize ChatGroq: {e}")
            self.llm = None

    def generate_response(self, prompt: str) -> str:
        """Generate a response for the given prompt.

        Returns a string. If GROQ is not configured/reachable, returns a
        friendly message indicating configuration is required.
        """
        if not prompt or not isinstance(prompt, str):
            return "Invalid prompt. Please provide a non-empty string."

        # Attempt lazy init in case env was set after import
        if self.llm is None:
            # Re-read env in case it was set later
            if not self.api_key:
                self.api_key = os.getenv("GROQ_API_KEY")
            self._maybe_init_client()

        if self.llm is None:
            return (
                "Groq is not configured. Please set GROQ_API_KEY in the environment "
                "(e.g., in a .env file) to enable AI explanations."
            )

        messages = [HumanMessage(content=prompt)]
        try:
            response = self.llm.invoke(messages)
            return getattr(response, "content", str(response))
        except Exception as e:
            print(f"[groq_demo] Error generating response: {e}")
            return (
                "Unable to generate an AI response at the moment. Please try again later."
            )


# Create a module-level generator, but don't fail import if misconfigured
generator = ResponseGenerator()


def generate_response(prompt: str) -> str:
    """Convenience function to generate a response using the shared generator."""
    return generator.generate_response(prompt)

