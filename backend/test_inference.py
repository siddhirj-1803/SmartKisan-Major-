# -*- coding: utf-8 -*-
"""
test_inference.py

Runs a complete offline inference test that mimics the backend logic.
It takes an image, analyzes it to predict the disease, and then
generates a detailed explanation for the detected condition.
"""

# ---------------------------
# IMPORTS
# ---------------------------
import os
import argparse
import tensorflow as tf

# Import the functions from our backend modules
from disease_predict import analyze_image
from groq_demo import generate_response

# Pretty console
try:
    from colorama import Fore, Style, init as colorama_init
    colorama_init(autoreset=True)
except ImportError:
    class _Dummy:
        def __getattr__(self, k): return ""
    Fore = Style = _Dummy()

# ---------------------------
# HELPER FUNCTIONS
# ---------------------------
def confidence_bar(confidence, length=30):
    """Creates a simple [▰▰▱▱] confidence bar."""
    filled = int(length * confidence)
    bar = "▰" * filled + "▱" * (length - filled)
    return f"[{bar}] {confidence*100:.2f}%"

# ---------------------------
# MAIN INFERENCE
# ---------------------------
def main():
    # --- 1. Setup argument parser ---
    parser = argparse.ArgumentParser(
        description="Run full inference pipeline (analysis + explanation).",
        formatter_class=argparse.RawTextHelpFormatter
    )
    parser.add_argument(
        '--image',
        type=str,
        default=r'temp_uploads\0a01cc10-3892-4311-9c48-0ac6ab3c7c43___RS_GLSp_9352.JPG',
        help="Path to the input image for analysis."
    )
    args = parser.parse_args()

    # --- 2. Check if image exists ---
    if not os.path.exists(args.image):
        print(Fore.RED + f"Error: Input image not found at {args.image}")
        return

    print(Fore.YELLOW + f"Processing image: {args.image}...")

    # --- 3. Analyze the image for disease ---
    analysis_result = analyze_image(args.image)

    if analysis_result['status'] != 'success':
        print(Fore.RED + f"Error during analysis: {analysis_result.get('error', 'Unknown error')}")
        return

    # --- 4. Display analysis results ---
    print("\n" + Fore.CYAN + "═" * 50)
    print(Fore.MAGENTA + "🌿 Plant Disease Analysis Report")
    print(Fore.CYAN + "═" * 50)
    print(f"{Fore.WHITE}📌 Crop Type     : {Fore.CYAN}{analysis_result['crop_type']}")
    print(f"{Fore.WHITE}📌 Condition     : {Fore.CYAN}{analysis_result['condition']}")
    print(f"{Fore.WHITE}📈 Confidence    : {Fore.BLUE}{confidence_bar(analysis_result['confidence'])}")
    
    print("\n" + Fore.WHITE + "📊 Crop Probabilities:")
    for crop, prob in sorted(analysis_result['crop_probabilities'].items(), key=lambda item: item[1], reverse=True):
        print(f"  - {crop:<15}: {prob*100:.2f}%")
    print(Fore.CYAN + "═" * 50)

    # --- 5. Generate detailed explanation ---
    print(Fore.YELLOW + "\nGenerating detailed explanation with Groq...")
    
    prompt = (
        f"What is {analysis_result['condition']} in {analysis_result['crop_type']} plants? Please provide a detailed response covering: "
        f"1. Disease description and symptoms "
        f"2. Spreadability "
        f"3. Common causes "
        f"4. Treatment methods "
        f"5. Prevention measures"
    )
    
    explanation = generate_response(prompt)

    # --- 6. Display the explanation ---
    print("\n" + Fore.CYAN + "═" * 50)
    print(Fore.MAGENTA + "💡 Detailed Explanation")
    print(Fore.CYAN + "═" * 50)
    print(Fore.WHITE + explanation)
    print(Fore.CYAN + "═" * 50 + "\n")


if __name__ == "__main__":
    # Limit TensorFlow logging to errors to keep the output clean
    os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
    tf.get_logger().setLevel('ERROR')
    
    main()
