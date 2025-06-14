from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

with open("requirements.txt", "r", encoding="utf-8") as fh:
    requirements = fh.read().splitlines()

setup(
    name="evai",
    version="0.1.0",
    author="EvAI Team",
    author_email="info@evai.ai",
    description="Een reflectieve, uitlegbare AI met Seeds, LIM, Rubrics en Feedback",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/evai/evai",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
    ],
    python_requires=">=3.8",
    install_requires=requirements,
    entry_points={
        "console_scripts": [
            "evai=api.main:main",
        ],
    },
) 