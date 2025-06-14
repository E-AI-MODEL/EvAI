from loguru import logger
import sys
import json
from datetime import datetime
from pathlib import Path

class EvAILogger:
    def __init__(self, log_dir="logs"):
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(exist_ok=True)
        
        # Configure main logger
        logger.remove()  # Remove default handler
        logger.add(
            sys.stdout,
            format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
            level="INFO"
        )
        
        # Add file handler for all logs
        logger.add(
            self.log_dir / "evai_{time}.log",
            rotation="500 MB",
            retention="10 days",
            level="DEBUG"
        )
        
        # Add file handler for errors only
        logger.add(
            self.log_dir / "errors_{time}.log",
            rotation="100 MB",
            retention="30 days",
            level="ERROR"
        )

    def log_interaction(self, interaction_data):
        """Log a complete interaction with EvAI"""
        timestamp = datetime.now().isoformat()
        log_entry = {
            "timestamp": timestamp,
            "interaction": interaction_data
        }
        
        # Log to interaction file
        interaction_file = self.log_dir / f"interactions_{datetime.now().strftime('%Y%m')}.jsonl"
        with open(interaction_file, "a") as f:
            f.write(json.dumps(log_entry) + "\n")
        
        logger.info(f"Logged interaction: {interaction_data.get('query', 'No query')}")

    def log_seed_activation(self, seed_data):
        """Log seed activation events"""
        logger.debug(f"Seed activated: {seed_data.get('id', 'Unknown')}")

    def log_pattern_match(self, pattern_data):
        """Log pattern matching events"""
        logger.debug(f"Pattern matched: {pattern_data.get('pattern_id', 'Unknown')}")

    def log_error(self, error_data):
        """Log error events"""
        logger.error(f"Error occurred: {error_data.get('error', 'Unknown error')}")

    def log_validation(self, validation_data):
        """Log validation results"""
        logger.info(f"Validation result: {validation_data.get('result', 'Unknown')}")

# Create global logger instance
evai_logger = EvAILogger() 