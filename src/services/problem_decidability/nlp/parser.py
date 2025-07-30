import numpy as np
import spacy
from dataclasses import dataclass
from enum import Enum
from typing import List, Dict
from transformers import AutoTokenizer, AutoModel, pipeline
import torch

class ProblemEntity(Enum):
    DATA_STRUCTURE = 'data_structures'
    ALGORITHM_TYPE = 'algorithm_type'
    CONSTRAINT = 'constraint'
    INPUT_TYPE = 'input_type'
    OUTPUT_TYPE = 'output_type'
    COMPLEXITY_HINT = 'complexity_hint'

@dataclass
class ParsedEntity:
    text: str
    entity_type: ProblemEntity
    confidence: float
    context: str

@dataclass
class ParseResult:
    entities: List[ParsedEntity]
    keywords: List[str]
    constraints: List[str]
    complexity_hints: List[str]
    sentence_structure: Dict[str, any]
    problem_intent: str
    confidence: float

class Parser:
    def __init__(self, model_name: str = 'en_core_web_sm'):
        try:
            # For input larger models (will not use this for base functionality testing)
            self.nlp = spacy.load(model_name)
        except OSError:
            self.nlp = spacy.load('en_core_web_sm')
            print('Defaulted to en_core_web_sm')

        self.setup_ml_models()
        self.setup_algoritmic_embeddings()
        self.setup_fallback_patterns()

    def setup_ml_models(self):
        # W hugging face
        self.embedding_model = 'microsoft/codebert-base'
        self.tokenizer = AutoTokenizer.from_pretrained(self.embedding_model)
        self.model = AutoModel.from_pretrained(self.embedding_model)
        self.classifier = pipeline(
            'zero-shot-classification',
            model = 'facebook/bart-large-mnli' 
        )

    def setup_algoritmic_embeddings(self):
        self.algorithm_concepts = {
            'sorting':[],
            'searching':[],
            'two_pointers':[],
            'dynamic_programming':[],
            'graph_traversal':[],
            'greedy':[],
            'string_manipulation':[],
        }

        self.data_structure_concepts = {
            'array':[],
            'tree':[],
            'graph':[],
            'matrix':[],
            'linked_list':[],
            'stack':[],
            'queue':[],
            'heap':[],
            'hash_table':[],
        }

        self.compute_concept_embeddings()

    def compute_concept_embeddings(self):
        self.concept_embeddings = {}
        concepts = {**self.algorithm_concepts, **self.data_structure_concepts}

        for concept_type, descriptions in concepts.items():
            embeddings = []
            for description in descriptions:
                embedding = self.get_text_embedding(description)
                embeddings.append(embedding)
            
            # Axis = 0 for mean across columns and not flat array
            self.concept_embeddings[concept_type] = np.mean(embeddings, axis=0)

    def get_text_embedding(self, text: str) -> np.ndarray:
        inputs = self.tokenizer(text, return_tensors='pt', padding=True, truncation=True)
        with torch.no_grad():
            outputs = self.model(**inputs)
            emedding = outputs.last_hidden_state[:, 0, :].numpy()
        return embedding.flatten()