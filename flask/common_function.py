def get_emotions():
    mapping = {
        0:"admiration",
        1:"amusement",
        2:"anger",
        3:"annoyance",
        4:"approval",
        5:"caring",
        6:"confusion",
        7:"curiosity",
        8:"desire",
        9:"disappointment",
        10:"disapproval",
        11:"disgust",
        12:"embarrassment",
        13:"excitement",
        14:"fear",
        15:"gratitude",
        16:"grief",
        17:"joy",
        18:"love",
        19:"nervousness",
        20:"optimism",
        21:"pride",
        22:"realization",
        23:"relief",
        24:"remorse",
        25:"sadness",
        26:"surprise",
        27:"neutral"
    }
    return mapping

def get_sentiment_dict():
    sentiment_dict = {
        "positive": ["amusement", "excitement", "joy", "love", "desire", "optimism", "caring", "pride", "admiration", "gratitude", "relief", "approval"],
        "negative": ["fear", "nervousness", "remorse", "embarrassment", "disappointment", "sadness", "grief", "disgust", "anger", "annoyance", "disapproval"],
        "ambiguous": ["realization", "surprise", "curiosity", "confusion"],
        "neutral": ["neutral"]
        }
    return sentiment_dict

if __name__ == '__main__':
    print("#Common Function")