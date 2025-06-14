import pytest
from core_runtime.EvAIRuntime import EvAIRuntime
from core_runtime.SeedEngine import SeedMemory
from core_runtime.SeedPatternMatcher import SeedPatternMatcher

@pytest.fixture
def evai_runtime():
    return EvAIRuntime()

def test_evai_initialization(evai_runtime):
    """Test if EvAI runtime initializes correctly"""
    assert isinstance(evai_runtime.seed_memory, SeedMemory)
    assert isinstance(evai_runtime.pattern_matcher, SeedPatternMatcher)
    assert isinstance(evai_runtime.system_prompt, dict)
    assert "role" in evai_runtime.system_prompt
    assert "content" in evai_runtime.system_prompt

def test_generate_cot(evai_runtime):
    """Test chain of thought generation"""
    test_params = {
        "query": "Test query",
        "context": {"user_profile": "test_profile"},
        "rubrics": ["test_rubric"]
    }
    result = evai_runtime.generate_cot(test_params)
    assert isinstance(result, dict)
    assert "reasoning_steps" in result
    assert "active_seeds" in result
    assert "trace_log" in result

def test_seed_activation(evai_runtime):
    """Test seed activation and matching"""
    test_context = {"user_profile": "test_profile"}
    active_seeds = evai_runtime.seed_memory.get_active_seeds(test_context)
    assert isinstance(active_seeds, list)
    if active_seeds:
        assert all("id" in seed for seed in active_seeds)
        assert all("type" in seed for seed in active_seeds)

def test_pattern_matching(evai_runtime):
    """Test pattern matching functionality"""
    test_seeds = [
        {"id": "test1", "type": "core", "intention": "test"},
        {"id": "test2", "type": "direction", "intention": "test"}
    ]
    patterns = evai_runtime.pattern_matcher.find_patterns(test_seeds)
    assert isinstance(patterns, list)

def test_trace_logging(evai_runtime):
    """Test trace logging functionality"""
    test_params = {
        "query": "Test query",
        "context": {"user_profile": "test_profile"},
        "rubrics": ["test_rubric"]
    }
    evai_runtime.generate_cot(test_params)
    assert len(evai_runtime.trace_log) > 0
    assert all(isinstance(entry, dict) for entry in evai_runtime.trace_log) 