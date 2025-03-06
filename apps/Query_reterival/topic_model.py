from bertopic import BERTopic
from sklearn.feature_extraction.text import CountVectorizer
import nltk
from nltk.tokenize import sent_tokenize
from umap import UMAP

def analyze_topics(text):
    """
    Analyzes the input text to extract topics using BERTopic.
    
    Parameters:
        text (str): The text to analyze.
    
    Returns:
        list: A list of dictionaries, each representing a topic with its ID, keyphrases, and representative documents.
    """
    try:
        # Ensure NLTK's sentence tokenizer is ready.
        nltk.download('punkt', quiet=True)
        
        # Split text into sentences.
        sentences = sent_tokenize(text)
        
        # If there isn't enough text, return a fallback response.
        if len(sentences) < 5:
            return [{
                'topic_id': 0,
                'keywords': ['insufficient', 'text', 'for', 'topic', 'modeling'],
                'representative_docs': [text]
            }]

        # Create a custom UMAP instance with adjusted parameters
        custom_umap = UMAP(n_neighbors=10, min_dist=0.1)

        # Use the custom UMAP model in BERTopic
        topic_model = BERTopic(
            umap_model=custom_umap,  # Pass the custom UMAP here
            min_topic_size=2,        # Reduced from 5 to handle smaller texts
            n_gram_range=(1, 2),
            vectorizer_model=CountVectorizer(
                stop_words="english",
                min_df=1  # Allow terms that appear at least once
            )
        )

        # Fit BERTopic on the tokenized sentences.
        topics, _ = topic_model.fit_transform(sentences)

        # Aggregate the topics and their keyphrases.
        topic_results = []
        unique_topics = set(topics)

        for topic in unique_topics:
            if topic != -1:  # Skip outlier topics marked as -1.
                topic_words = topic_model.get_topic(topic)
                if topic_words:
                    topic_results.append({
                        'topic_id': int(topic),
                        'keywords': [word for word, score in topic_words[:5]],  # Top 5 keywords.
                        'representative_docs': sentences[:2]  # Using first two sentences as a simple representative sample.
                    })

        # Fallback if no topics are found.
        return topic_results if topic_results else [{
            'topic_id': 0,
            'keywords': ['general', 'topic'],
            'representative_docs': [sentences[0]]
        }]

    except Exception as e:
        # In case of errors, return an error message with details.
        return [{
            'topic_id': -99,
            'keywords': ['error', 'processing', 'text'],
            'representative_docs': ['Error processing text: ' + str(e)]
        }]
