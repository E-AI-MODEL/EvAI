import os
import sys
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

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
    result = evai_runtime.generate_cot(
        "Test query",
        {"user_profile": "test_profile"},
        {"descriptor": "test_rubric"},
    )
    assert isinstance(result, dict)
    assert "cot_trace" in result
    assert "active_seeds" in result

def test_seed_activation(evai_runtime):
    """Test seed activation and matching"""
    active_seeds = evai_runtime.seed_memory.get_active_seeds()
    assert isinstance(active_seeds, list)
    if active_seeds:
        assert all(hasattr(seed, "id") for seed in active_seeds)
        assert all(hasattr(seed, "type") for seed in active_seeds)

def test_pattern_matching(evai_runtime):
    """Test pattern matching functionality"""
    # Use seed ids that exist in the demo pattern file
    test_seeds = [
        {"id": "Seed_0005"},
        {"id": "Seed_0008"},
        {"id": "Seed_0010"},
    ]
    patterns = evai_runtime.pattern_matcher.find_patterns(test_seeds)
    assert isinstance(patterns, list)
    assert any(
        set(p.get("pattern", [])) == {"Seed_0005", "Seed_0008", "Seed_0010"}
        for p in patterns
    )

def test_trace_logging(evai_runtime):
    """Test trace logging functionality"""
    evai_runtime.generate_cot(
        "Test query",
        {"user_profile": "test_profile"},
        {"descriptor": "test_rubric"},
    )
    assert len(evai_runtime.trace_log) > 0
    assert all(isinstance(entry, dict) for entry in evai_runtime.trace_log)

