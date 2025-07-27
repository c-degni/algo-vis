import spacy
from dataclasses import dataclass
from enum import Enum
from typing import List, Dict
from transformers import AutoTokenizer, AutoModel, pipeline

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
        self.embedding_model = 'microsoft/codebert-base'
        self.tokenizer = AutoTokenizer.from_pretrained(self.embedding_model)
        self.model = AutoModel.from_pretrained(self.embedding_model)
        self.classifier = pipeline(
            'zero-shot-classification',
            model = 'facebook/bart-large-mnli' 
        )
