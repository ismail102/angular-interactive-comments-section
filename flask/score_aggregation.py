
import torch
import os
# from transformers import AutoTokenizer, AutoModel
import torch.nn as nn
import pandas as pd
import warnings
import numpy as np
import math
import json
import os
warnings.filterwarnings('ignore')
from common_function import get_emotions, get_sentiment_dict
file_name = 'fox-new-york-could-face'
parent_path = 'C:\\Users\\ismai\\Documents\\Comment-Section-UI\\angular-interactive-comments-section\\flask\\data'

emotions = list(get_emotions().values())
trends = ["approval","toxic","obscene", 'insult', "threat", "hate", "offensive", "neither"]
sentiment_dict = get_sentiment_dict()
# print(sentiment_dict)
sentiments = list(sentiment_dict.keys())
# print(sentiment_dict.keys())


def find_indices(sublist, main_list):
    # Create a dictionary mapping elements to their indices in the main list
    index_dict = {val: idx for idx, val in enumerate(main_list)}
    
    # Retrieve indices of elements from the sublist in the main list
    indices = [index_dict[val] for val in sublist]
    return indices

def sum_elements_by_indices(input_list, indices):
    total = sum(input_list[i] for i in indices)
    return total

df_emotion = pd.read_csv(os.path.join(parent_path, f'{file_name}-emotions.csv'))
df_trend = pd.read_csv(os.path.join(parent_path, f'{file_name}-trends.csv'))

positive_indices = find_indices(sentiment_dict['positive'], emotions)
negative_indices = find_indices(sentiment_dict['negative'], emotions)
ambiguous_indices = find_indices(sentiment_dict['ambiguous'], emotions)
neutral_indices = find_indices(sentiment_dict['neutral'], emotions)

def get_emotion_score(comment_id):
    # print("Comment ID:", comment_id)
    row_index = df_emotion.loc[df_emotion['id'] == comment_id].index[0]
    scores = df_emotion.iloc[row_index][2:]
    return list(scores)

def get_trend_score(comment_id):
    row_index = df_trend.loc[df_trend['id'] == comment_id].index[0]
    scores = df_trend.iloc[row_index][2:]
    return list(scores)

def get_polarity_score(e_scores):
    scores = [sum_elements_by_indices(e_scores, positive_indices), sum_elements_by_indices(e_scores, negative_indices), 
                sum_elements_by_indices(e_scores, ambiguous_indices), sum_elements_by_indices(e_scores, neutral_indices)]
    return scores
    

class Tree(object):
    def __init__(self, id, text, children, e_scores, t_scores, polarity):
        self.e_scores = e_scores
        self.t_scores = t_scores
        self.polarity = polarity
        self.id = id

        self.text = text
        self.children = []
        if children is not None:
            for child in children:
                self.add_child(child)
    def __repr__(self):
        return self.text
    def add_child(self, node):
        assert isinstance(node, Tree)
        self.children.append(node)


def replyTree(node):
    # global comments

    if len(node['replies']) == 0:
    
        text = node['content'] #get_clean_data(node)
        e_scores = get_emotion_score(node['id'])
        t_scores = get_trend_score(node['id'])
        # polarity = get_polarity_score(e_scores)
        
        return Tree(node['id'], text, [], e_scores, t_scores, polarity=0)

    children = []
    for ch in node['replies']:
        children.append(replyTree(ch))
    
    text = node['content'] #get_clean_data(node)

    e_scores = get_emotion_score(node['id'])
    t_scores = get_trend_score(node['id'])
    # polarity = get_polarity_score(e_scores)

    return Tree(node['id'], text, children, e_scores, t_scores, polarity=0)

import numpy as np
# correct solution:
def softmax(x):
    """Compute softmax values for each sets of scores in x."""
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum(axis=0) # only difference

# ## Aggregation algorithms
# 1. Base Method
# 2. Dempster Shafer theory of evidence
# 4. Uninorm Aggregation

def get_singe_emotion_score(scores):
    data = np.array(scores)
    dataset  = data
    # print(dataset)

    sm=0
    for i in range(len(dataset)):
        sm+=dataset[i]
    mean = sm/len(dataset)

    deviation_sum = 0
    for i in range(len(dataset)):
        deviation_sum+=(dataset[i]- mean)**2

    psd = math.sqrt((deviation_sum)/len(dataset))
    # print("SD:", psd)

    if psd > 0.0:
        new_data = ((data - data.mean())/psd)
    else:
        return dataset.mean()

    normalized_dataset = (new_data - np.min(new_data)) / (np.max(new_data) - np.min(new_data))
    # print(normalized_dataset)
    return normalized_dataset.mean()


def inverse(d):
    # Create a NumPy array with the number
    array = np.array(d)

    # Calculate the reciprocal of the number
    reciprocal = np.reciprocal(array)
    return list(reciprocal)

def get_new_emotion_score(scores):
    data = np.array(scores)
    median = np.median(data)
    dis = []
    for i in scores:
        if abs(median-  i) > 0.0:
            dis.append(abs(median - i))
        else:
            dis.append(0.0001)

    # print(dis)
    lst = inverse(dis)
    sum_val = sum(lst)

    S = []
    for (i,j) in zip(lst, scores):
        # inv = inverse([i])
        s = (i*j)/sum_val
        S.append(s)

    return sum(S)

def base_method(Sa, num_labels):
    A = [0]*num_labels
    for i in range(num_labels):
        for j in range(len(Sa)):
            A[i] += Sa[j][i]

    result = softmax(A)
    return result

def base_method_with_std(Sa, num_labels):
    A = [0]*num_labels
    for i in range(num_labels):
        s = []
        for j in range(len(Sa)):
            s.append(Sa[j][i])
        # print("S: ", s)
        A[i] = get_singe_emotion_score(s)
    # print("A: ", A)

    result = softmax(A)
    return result

def method3(Sa, num_labels):
    A = [0]*num_labels
    for i in range(num_labels):
        s = []
        for j in range(len(Sa)):
            s.append(Sa[j][i])
        # print("S: ", s)
        A[i] = get_new_emotion_score(s)
    return A


def dempster_shafer(line1, line2, num_labels):
    # print("line1: ", line1)
    # print("line2: ", line2)
    A = [0]*num_labels
    denominator = 0
    K = 0
    for i in range(28):
        A[i] = (line1[i] * line2[i])
        denominator = 0
        for j in range(num_labels):
            if i != j:
                denominator += (line1[i] * line2[j])
        K += denominator
    
    denominator = K
    for i in range(num_labels):
        A[i] = (A[i]/denominator)
    return A

def uninorm_aggregation(Sa, num_labels):
    e = 0.5
    A = [0]*num_labels
    n = len(Sa)
    coeff1 = pow((1-e), n-1)    # (1-e)^n-1
    coeff2 = pow(e, n-1)        # e^n-1 
    for i in range(num_labels):
        mul1 = 1
        mul2 = 1
        for j in range(len(Sa)):
            mul1 = (mul1 * Sa[j][i])
            mul2 = (mul2 * (1 - Sa[j][i]))

        denominator = (coeff1 * mul1) + (coeff2 * mul2)
        if denominator == 0:
            A[i] = 0
        else:
            A[i] = ((coeff1 * mul1)/(denominator))
    return A


def varify(x):
    print("1 == ", sum(x))
    return

def Aggregation(Sa, type, num_labels):
    if type == "base1": # Addition and Normalization
        return base_method(Sa, num_labels)
    if type == "base2": # Calculating Standard Deviation and Normalization
        return base_method_with_std(Sa, num_labels)
    if type == "method3": # Calculating Standard Deviation and Normalization
        return method3(Sa, num_labels)
    if type == "ds": # Dempster Shafer
        A = Sa[0]
        Sa = Sa[1:-1]
        for i in Sa:
            A = dempster_shafer(A, i, num_labels)
        return A
    if type == 'uninorm': # Uninorm Aggregation
        A = uninorm_aggregation(Sa, num_labels)
        # varify(row_totals)
        return A

def is_comment_exist(id, so_far_comments):
    if id in so_far_comments:
        return True
    return False

# max_depth = 0
# max_children = 0
# total_node = 0

def RECUR(node, type, depth, so_far_comments):
    # global max_depth
    # global max_children
    # global total_node
    # max_children = max(max_children, len(node.children))
    # max_depth = max(max_depth, depth)
    # total_node += len(node.children)

    if len(node.children) == 0:
        return

    Se = []
    St = []
    for reply in node.children:
        if is_comment_exist(reply.id, so_far_comments) ==  True:
            RECUR(reply, type, depth+1, so_far_comments)
            Se.append(reply.e_scores)
            St.append(reply.t_scores)
    
    if is_comment_exist(node.id, so_far_comments) ==  True:
        Ae = Aggregation(Se, type, 28)
        At = Aggregation(St, type, 8)
        # Emotion score aggregation
        Se = []
        Se.append(node.e_scores)
        Se.append(Ae)
        Ae = Aggregation(Se, type, 28)

        # Trend score aggregation
        St = []
        St.append(node.t_scores)
        St.append(At)
        At = Aggregation(St, type, 8)
        node.e_scores = Ae
        node.t_scores = At
        node.polarity = get_polarity_score(node.e_scores)


def travers_reply_tree(comment_json):
    reply_tree = {}
    for i, json in enumerate(comment_json):
        reply_tree[i] = replyTree(json)
    return reply_tree

def get_aggregated_tree_data(file, so_far_comments):
    method = 'method3'
    with open(os.path.join(parent_path, file)) as f:
        comment_json = json.load(f)

    reply_tree = travers_reply_tree(comment_json['comments'])
    # print("reply tree:", replyTree)

    for i, id, in enumerate(comment_json['comments']):
        RECUR(reply_tree[i], method, 0, so_far_comments)

    # print("Max Depth: ", max_depth)
    # print("Max replies: ", max_children)
    # max_depth = 0
    # max_children = 0
    # total_node = 0

    # First level comment aggregation
    escores = []
    tscores = []

    for i, id, in enumerate(comment_json['comments']):
        # print(f"Comment# {i}: {reply_tree[i].text}")
        Ae = list(reply_tree[i].e_scores)
        escores.append(Ae)
        At = list(reply_tree[i].t_scores)
        tscores.append(At)

    final_escore = Aggregation(escores, method, 28)
    final_polarity = get_polarity_score(final_escore)
    final_tscore = Aggregation(tscores, method, 8)

    return final_escore, final_tscore, final_polarity
    


# Final Aggregated Results
def get_emotion_trends_polarity(so_far_comments):
    file = f'{file_name}.json'
    # print("so far comments: ", so_far_comments)
    final_escore, final_tscore, final_polarity = get_aggregated_tree_data(file, so_far_comments)

    df_emotion = pd.DataFrame([final_escore], columns=emotions)

    df_trend = pd.DataFrame([final_tscore], columns=trends)

    df_polar = pd.DataFrame([final_polarity], columns=sentiments)

    return list(df_emotion.iloc[0]), list(df_trend.iloc[0]), list(df_polar.iloc[0])

if __name__ == '__main__':
    print("#Score Aggregation")
    # get_emotion_trends_polarity([32,110,90])