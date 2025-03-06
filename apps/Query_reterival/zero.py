from transformers import pipeline

# Load the Zero-Shot classification model using the facebook/bart-large-mnli model.
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

def classify_text(text: str, candidate_labels=None):
    """
    Classifies the input text into one or more topics using zero-shot classification.
    
    Parameters:
        text (str): The text to classify.
        candidate_labels (list, optional): A list of candidate topics. If not provided, defaults to a predefined list.
    
    Returns:
        dict: The output of the classifier, containing labels and their associated scores.
    """

    
    return classifier(text, candidate_labels)
