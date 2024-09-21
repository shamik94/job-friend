# Cover Letter Generator

This project consists of a FastAPI backend application that generates personalized cover letters using OpenAI's GPT model, and a simple HTML frontend for user interaction.

## Features

- Generate cover letters based on job descriptions (text or PDF) and candidate resumes (PDF)
- Customize cover letter size (small or large)
- Adjust formality level of the cover letter
- Specify tone for the cover letter
- Use OpenAI's GPT model for natural language generation
- Simple web interface for easy interaction

## Prerequisites

- Python 3.7+
- OpenAI API key
- Modern web browser

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/cover-letter-generator.git
   cd cover-letter-generator
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install the required packages:
   ```
   pip install fastapi uvicorn openai python-multipart PyPDF2
   ```

4. Set your OpenAI API key as an environment variable:
   ```
   export OPENAI_API_KEY='your-api-key-here'
   ```

## Usage

### Backend

1. Start the FastAPI server:
   ```
   python cover_letter_generator.py
   ```

2. The API will be available at `http://localhost:8000`

### Frontend

Open the `index.html` file in a web browser to use the simple web interface.

### API Endpoint

#### POST /generate_cover_letter

Generate a cover letter based on the provided inputs.

**Parameters:**

- `job_description` (file or string): PDF file or text containing the job description
- `resume` (file): PDF file containing the candidate's resume
- `cover_letter_size` (string): Either "small" (at least 180 words) or "large" (at least 360 words)
- `formality` (float): A value between 0 (casual) and 1 (formal)
- `additional_params` (string, optional): JSON string with additional parameters (e.g., tone)

**Response:**

## Frontend

The `index.html` file provides a simple web interface for the cover letter generator. It allows users to:

1. Upload job description and accomplishments files
2. Select cover letter size
3. Set formality level
4. Submit the form to generate a cover letter
5. View the generated cover letter on the page

## Error Handling

The API includes error handling for:
- Invalid cover letter size
- Invalid formality level
- Missing OpenAI API key
- Errors during the OpenAI API call
- Insufficient word count in generated cover letter

## Development

The server runs with auto-reload enabled, so any changes to the Python file will automatically restart the server.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
