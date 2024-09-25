# Job Friend Application

This project consists of a FastAPI backend and a Next.js frontend, designed to work together to provide a seamless user experience. This README will guide you through the setup process, including how to configure the OpenAI API key and run the application using Docker.

<img width="1274" alt="Screenshot 2024-09-25 at 12 39 31" src="https://github.com/user-attachments/assets/ec28e457-2e43-4cb0-837a-77c14e9ea82a">


## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Docker](https://www.docker.com/get-started) (including Docker Compose)
- A valid [OpenAI API key](https://platform.openai.com/signup) (you need to sign up for an account to obtain this)

## Getting Started

### Step 1: Clone the Repository

Clone this repository to your local machine:

```bash
git clone <repository-url>
cd job-friend
```

### Step 2: Set Up Your OpenAI API Key

1. Obtain your OpenAI API key from the [OpenAI platform](https://platform.openai.com/signup).
2. Open your terminal and set the `OPENAI_API_KEY` environment variable:

   ```bash
   export OPENAI_API_KEY=your_actual_api_key_here
   ```

   Replace `your_actual_api_key_here` with your actual OpenAI API key.

### Step 3: Build and Run the Application

With Docker installed and your API key set, you can now build and run the application using Docker Compose:

```bash
docker-compose up --build
```

This command will:

- Build the Docker images for both the FastAPI backend and the Next.js frontend.
- Start the services, making them accessible on your local machine.

### Step 4: Access the Application

- The frontend will be available at `http://localhost:3000`.
- The backend API will be available at `http://localhost:8000`.

## Stopping the Application

To stop the application, press `Ctrl + C` in the terminal where Docker Compose is running. You can also run:

```bash
docker-compose down
```

This command will stop and remove the containers.

## Troubleshooting

- If you encounter issues with the `.env` file, ensure that you have set the `OPENAI_API_KEY` environment variable correctly in your terminal.
- Make sure Docker is running on your machine before executing the `docker-compose` commands.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- [OpenAI](https://openai.com/) for providing the API.
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework.
- [Next.js](https://nextjs.org/) for the frontend framework.
