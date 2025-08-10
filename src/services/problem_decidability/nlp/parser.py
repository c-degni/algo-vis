import re
import numpy as np
import spacy
from dataclasses import dataclass
from enum import Enum
from typing import List, Dict
from transformers import AutoTokenizer, AutoModel, pipeline
import torch
from sklearn.metrics.pairwise import cosine_similarity

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
            embedding = outputs.last_hidden_state[:, 0, :].numpy()
        return embedding.flatten()
    
    def setup_fallback_patterns(self, problem_text: str) -> ParseResult:
        cleaned_text = self.preprocess_text(problem_text)
        doc = self.nlp(cleaned_text)

        entities = self._extract_entities(doc, cleaned_text)
        keywords = self._extract_keywords(doc)
        constraints = self._extract_constraints(cleaned_text)
        complexity_hints = self._extract_complexity_hints(cleaned_text)
        sentence_structure = self._analyze_sentence_structure(doc)
        problem_intent = self._identify_problem_intent(doc, entities)

        confidence_score = self._calculate_confidence(entities, keywords, constraints)

        return ParseResult(
            entities=entities,
            keywords=keywords,
            constraints=constraints,
            complexity_hints=complexity_hints,
            sentence_structure=sentence_structure,
            problem_intent=problem_intent,
            confidence_score=confidence_score,
        )
    
    def preprocess_text(self, text: str) -> str:
        text = re.sub(r'\s+', ' ', text.lower()).strip()
        text = re.sub(r'o\(([^)]+)\)', r'O(\1)', text, flags=re.IGNORECASE)
        return
    
    def extract_entities(self, doc, text: str) -> List[ParsedEntity]:
        entities = []
        problem_embedding = self.get_text_embedding()

        # Using cosine similarity: comparing the similarity of two vectors via the cosine angle between those 
        # vectors
        similarities = {}
        for concept, concept_embedding in self.concept_embeddings.items():
            similarity = cosine_similarity(
                problem_embedding.reshape(1, -1),
                concept_embedding.reshape(1, -1)
            )[0][0]
            similarities[concept] = similarity
            
