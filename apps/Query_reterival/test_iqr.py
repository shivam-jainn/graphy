# test_iqr.py

from key import extract_keywords
from zero import classify_text
from topic_model import analyze_topics

# Sample text covering diverse topics
sample_text = """
Molecular biology studies the structure and function of the molecules essential for life. 
This includes research on DNA replication, transcription, and translation, and has led to groundbreaking discoveries in genetics.
In contrast, modern DevOps practices streamline software development and IT operations by emphasizing automation, continuous integration, and rapid deployment.
Additionally, businesses are increasingly relying on advanced data analytics and machine learning to drive decision-making and optimize performance.
Furthermore, databases provide the backbone for storing and retrieving the vast amounts of information generated every day.
"""

def main():
    # 1. Extract keyphrases using KeyBERT
    keyphrases = extract_keywords(sample_text)
    print("=== Keyphrases ===")
    for phrase, score in keyphrases:
        print(f"{phrase}: {score:.4f}")
    
    print("\n=== Zero-Shot Topic Classification ===")
    # 2. Classify topic using Zero-Shot Classification
    candidate_labels = [
       
    ]
    classification_result = classify_text(sample_text, candidate_labels)
    # Print the top label and its score
    top_label = classification_result["labels"][0]
    top_score = classification_result["scores"][0]
    print(f"Top Topic: {top_label} (Confidence: {top_score:.4f})")
    print("Full Result:", classification_result)

    print("\n=== BERTopic Dynamic Topic Modeling ===")
    # 3. Run BERTopic to generate clusters and topics
    topics = analyze_topics(sample_text)
    for topic in topics:
        print(f"Topic ID: {topic['topic_id']}")
        print("Keywords:", topic['keywords'])
        print("Representative Docs:", topic['representative_docs'])
        print("------")

if __name__ == "__main__":
    main()
