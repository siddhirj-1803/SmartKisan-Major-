import os
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
from tensorflow.keras.saving import register_keras_serializable

# --- Custom Objects Definition ---
@register_keras_serializable()
class AdaptiveLesionModule(tf.keras.layers.Layer):
    """Custom layer for the ADGF-Net model."""
    def __init__(self, filters, **kwargs):
        super().__init__(**kwargs)
        self.filters = filters

    def build(self, input_shape):
        self.spatial_conv = tf.keras.layers.Conv2D(1, (1, 1), padding='same', activation='sigmoid')
        self.channel_pool = tf.keras.layers.GlobalAveragePooling2D()
        self.channel_attention = tf.keras.layers.Dense(self.filters, activation='sigmoid')
        super().build(input_shape)

    def call(self, inputs):
        compute_dtype = inputs.dtype
        spatial_att = tf.cast(self.spatial_conv(inputs), compute_dtype)
        channel_att = self.channel_pool(inputs)
        channel_att = self.channel_attention(channel_att)
        channel_att = tf.reshape(channel_att, [-1, 1, 1, self.filters])
        channel_att = tf.cast(channel_att, compute_dtype)
        return inputs * spatial_att * channel_att

    def get_config(self):
        config = super().get_config()
        config.update({"filters": self.filters})
        return config

@register_keras_serializable()
def adaptive_focal_loss(y_true, y_pred, gamma=2.0):
    """Custom focal loss function."""
    eps = tf.keras.backend.epsilon()
    y_pred = tf.clip_by_value(y_pred, eps, 1.0 - eps)
    cross_entropy = -y_true * tf.math.log(y_pred)
    pt = tf.where(tf.equal(y_true, 1), y_pred, 1 - y_pred)
    difficulty_weight = tf.pow(1.0 - pt, gamma)
    return tf.reduce_mean(difficulty_weight * cross_entropy)

# --- Predictor Class ---
class DiseasePredictor:
    """Handles model loading, preprocessing, and prediction."""
    def __init__(self, model_path=None, class_indices_path=None):
        # Define paths
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.model_path = model_path or os.path.join(base_dir, "models", "best_adgf_net.keras")
        self.class_indices_path = class_indices_path or os.path.join(base_dir, "models", "class_indices.json")
        
        # Load resources
        self.class_names = self._load_class_indices()
        self.model = self._load_model()
        self.target_size = (224, 224)

    def _load_class_indices(self):
        """Loads class names from the JSON file."""
        if not os.path.exists(self.class_indices_path):
            raise FileNotFoundError(f"Class indices file not found at {self.class_indices_path}")
        with open(self.class_indices_path, "r") as f:
            class_indices = json.load(f)
        
        inv_class_map = {v: k for k, v in class_indices.items()}
        return [inv_class_map[i] for i in range(len(inv_class_map))]

    def _load_model(self):
        """Loads the Keras model with custom objects."""
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model file not found at {self.model_path}")
        
        custom_objects = {
            "AdaptiveLesionModule": AdaptiveLesionModule,
            "adaptive_focal_loss": adaptive_focal_loss,
        }
        return load_model(self.model_path, custom_objects=custom_objects, compile=False)

    def _preprocess_image(self, img_path):
        """Loads and preprocesses an image."""
        img = image.load_img(img_path, target_size=self.target_size)
        img = img.convert('RGB')  # Explicitly convert to RGB
        img_array = image.img_to_array(img)
        return np.expand_dims(img_array, axis=0) / 255.0

    def _get_crop_and_condition(self, class_name):
        """Extracts crop and condition from a class name like 'Crop___Condition'."""
        if "___" in class_name:
            parts = class_name.split('___')
            crop = parts[0].replace("_", " ")
            condition = parts[1].replace("_", " ")
            return crop, condition
        return "Unknown", class_name.replace("_", " ")

    def analyze_image(self, image_path):
        """
        Performs a full analysis of an image, returning a structured dictionary.
        """
        try:
            if not os.path.exists(image_path):
                return {"status": "failed", "error": f"Image not found at {image_path}"}

            img_array = self._preprocess_image(image_path)
            preds = self.model.predict(img_array, verbose=0)[0]
            
            # Main prediction
            pred_index = np.argmax(preds)
            confidence = float(preds[pred_index])
            predicted_class = self.class_names[pred_index]
            crop_type, condition = self._get_crop_and_condition(predicted_class)

            # Aggregate probabilities by crop type
            crop_probabilities = {}
            for i, class_name in enumerate(self.class_names):
                crop, _ = self._get_crop_and_condition(class_name)
                crop_probabilities[crop] = crop_probabilities.get(crop, 0.0) + float(preds[i])

            return {
                "status": "success",
                "crop_type": crop_type,
                "condition": condition,
                "confidence": confidence,
                "crop_probabilities": crop_probabilities,
            }
        except Exception as e:
            return {"status": "failed", "error": str(e)}

# --- Singleton Instance and Global Function ---
# Create a single instance to avoid reloading the model on every call
try:
    print("Initializing DiseasePredictor...")
    _predictor_instance = DiseasePredictor()
    print("✅ DiseasePredictor initialized successfully.")
except Exception as e:
    _predictor_instance = None
    print(f"🚨 Failed to initialize DiseasePredictor: {e}")

def analyze_image(image_path):
    """
    Analyzes an image using the global predictor instance.
    """
    if _predictor_instance is None:
        return {'status': 'failed', 'error': 'Predictor not initialized.'}
    return _predictor_instance.analyze_image(image_path)
