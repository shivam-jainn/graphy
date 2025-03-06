from keybert import KeyBERT

# Load KeyBERT model using the "all-MiniLM-L6-v2" embedding model.
kw_model = KeyBERT("all-MiniLM-L6-v2")

def extract_keywords(text):
    """
    Given an input text, this function uses KeyBERT to extract the top 10 keyphrases.
    
    Parameters:
        text (str): The text from which to extract keyphrases.
    
    Returns:
        keyphrases (list): A list of tuples, where each tuple contains a keyphrase and its score.
    """
    keyphrases = kw_model.extract_keywords(
        text,
        keyphrase_ngram_range=(1, 3),  # Allow phrases from 1 to 3 words.
        top_n=10                     # Return the top 10 keyphrases.
    )
    return keyphrases
