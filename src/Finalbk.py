import os
import re
import json
import hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Optional

from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends, Header, Query
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm

import requests
from urllib.parse import unquote
from time import time
import time  # for sleep delays

from googlesearch import search
from youtubesearchpython import VideosSearch
from pytube import request as pytube_request
from bs4 import BeautifulSoup

# For the AI model query (Groq)
from groq import Groq

# For Text-to-Speech (TTS) functionality
from RealtimeTTS import TextToAudioStream, EdgeEngine

# For JWT operations using python-jose
from jose import jwt, JWTError

# For CrewAI job scraping
from crewai import Agent, Task, Crew, LLM
from litellm import RateLimitError

# ---------------------------
# Environment & Global Configurations
# ---------------------------

# Set environment variable for CrewAI Groq API key
os.environ["GROQ_API_KEY"] = "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"

# Initialize Groq clients (replace with your own keys if needed)
groq_general = Groq(
    api_key="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"
)  # For /get_resources
tech_groq_client = Groq(
    api_key="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"
)  # For technical interview queries
hr_groq_client = Groq(
    api_key="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"
)  # For HR interview queries
quiz_groq_client = Groq(
    api_key="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"
)  # For quiz generation/feedback

# System prompt for get_resources endpoint
system_prompt = """
user will ask abaout any topic to prepare so your task is to give a very simple way of preparing for the goal which 
the user want to learn.
your reply should be very precise
"""
Direction = [{"role": "system", "content": system_prompt}]

# In-memory storage for users, conversation histories, and TTS streams
users: Dict[str, dict] = (
    {}
)  # username -> { "username": ..., "email": ..., "hashed_password": ... }
user_conversations: Dict[str, dict] = (
    {}
)  # username -> {"technical": [...], "hr": [...]}
user_streams: Dict[str, TextToAudioStream] = {}  # username -> TTS stream instance

# JWT / Authentication configuration
SECRET_KEY = "mysecretkey"  # Replace with a strong secret in production!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Create folder for static TTS audio files
os.makedirs("static", exist_ok=True)

# ---------------------------
# Helper Functions for FastAPI Endpoints
# ---------------------------


def search_youtube_playlists(query: str, num_playlists: int = 3):
    query_string = query.replace(" ", "+")
    url = f"https://www.youtube.com/results?search_query={query_string}&sp=EgIQAw%3D%3D"
    html = pytube_request.get(url)
    playlist_ids = re.findall(r'"playlistId":"(.*?)"', html)
    unique_ids = []
    for pid in playlist_ids:
        if pid not in unique_ids:
            unique_ids.append(pid)
        if len(unique_ids) == num_playlists:
            break
    playlists = []
    for pid in unique_ids:
        playlist_url = f"https://www.youtube.com/playlist?list={pid}"
        playlist_html = pytube_request.get(playlist_url)
        playlist_soup = BeautifulSoup(playlist_html, "html.parser")
        title_tag = playlist_soup.find("title")
        title = (
            title_tag.get_text().replace(" - YouTube", "").strip()
            if title_tag
            else "Playlist"
        )
        thumbnail_meta = playlist_soup.find("meta", property="og:image")
        thumbnail = thumbnail_meta.get("content") if thumbnail_meta else ""
        playlists.append({"link": playlist_url, "title": title, "thumbnail": thumbnail})
    return playlists


def search_youtube_videos(query: str, num_videos: int = 7):
    video_search = VideosSearch(query, limit=num_videos)
    videos_data = video_search.result()
    videos = []
    for item in videos_data.get("result", []):
        videos.append(
            {
                "link": item.get("link"),
                "title": item.get("title"),
                "thumbnail": (
                    item.get("thumbnails")[0].get("url")
                    if item.get("thumbnails") and len(item.get("thumbnails")) > 0
                    else ""
                ),
            }
        )
    return videos


def search_learning_websites(query: str, num_links: int = 5):
    return list(search(query, num_results=num_links))


def query_groq(user_input: str) -> str:
    completion = groq_general.chat.completions.create(
        model="llama-3.2-90b-vision-preview",
        messages=Direction + [{"role": "user", "content": user_input}],
        temperature=1,
        max_completion_tokens=1024,
        top_p=1,
        stream=False,
        stop=None,
    )
    return (
        completion.choices[0].message.content
        if completion.choices
        else "No response from Groq"
    )


def get_password_hash(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return get_password_hash(plain_password) == hashed_password


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def stop_audio_for_user(username: str):
    if username in user_streams:
        user_streams[username].stop()
        del user_streams[username]


def generate_speech_async(text: str, username: str):
    if username not in user_streams:
        tts_engine = EdgeEngine()
        tts_engine.set_voice("en-GB-RyanNeural")
        tts_engine.rate = 10
        tts_engine.pitch = -26
        user_streams[username] = TextToAudioStream(tts_engine)
    stream = user_streams[username]
    stream.feed(text)
    audio_data = stream.play()
    audio_file_path = os.path.join("static", f"{username}_response.mp3")
    with open(audio_file_path, "wb") as f:
        f.write(audio_data)


# Dependency to extract current user from header or query
def get_current_user(authorization: str = Header(None), token: str = Query(None)):
    auth_token = token
    if not auth_token and authorization and authorization.startswith("Bearer "):
        auth_token = authorization[7:]
    if not auth_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(auth_token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Token is invalid: {str(e)}")
    user = users.get(username)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# ---------------------------
# FastAPI App & Endpoints
# ---------------------------

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")


# 1. Resources Endpoint – aggregates Groq, YouTube, and learning website results.
@app.post("/get_resources")
def get_resources(data: Dict[str, str]):
    user_query = data.get("query")
    if not user_query:
        raise HTTPException(status_code=400, detail="Query is required")

    groq_response = query_groq(user_query)
    videos = search_youtube_videos(user_query)
    playlists = search_youtube_playlists(user_query, num_playlists=3)
    learning_links = search_learning_websites(user_query, num_links=5)

    return {
        "groq_response": groq_response,
        "videos": videos,
        "playlists": playlists,
        "learning_resources": learning_links,
    }


# 2. User Registration Endpoint
class UserRegister(BaseModel):
    username: str
    email: str
    password: str


@app.post("/register")
async def register(user: UserRegister):
    if user.username in users:
        raise HTTPException(status_code=400, detail="Username already registered")
    for u in users.values():
        if u.get("email") == user.email:
            raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    users[user.username] = {
        "username": user.username,
        "email": user.email,
        "hashed_password": hashed_password,
    }
    return {"msg": "User registered successfully"}


# 3. User Login Endpoint (expects form data)
@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users.get(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    print("Generated Token:", access_token)  # For debugging
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user["username"],
    }


# 4. Stop Audio Endpoint
@app.get("/stop_audio")
async def stop_audio(current_user: dict = Depends(get_current_user)):
    username = current_user["username"]
    stop_audio_for_user(username)
    return {"status": f"Audio stopped for user {username}"}


# 5. Interview Query Endpoint (Technical & HR rounds)
technical_prompt = """
You are an interviewer at a software company.
Ask the candidate 5 short, unique technical questions about topics like OOPs, DBMS, and DSA.
After each question, wait for the candidate's answer before asking the next question.
Keep each question and response very brief, crisp, and to the point.
At the end, evaluate the candidate's answers and give clear, constructive feedback.
Keep your language plain and natural, without bullet points, asterisks, or any special characters.
Speak as naturally as possible so that the converted speech sounds human.
Avoid repeating the same questions in different sessions. Always vary the questions.
"""

hr_prompt = """
You are an HR interviewer at a company.
Ask the candidate 5 short behavioral questions focusing on interpersonal skills, teamwork, and cultural fit.
After each question, wait for the candidate's response before asking the next question.
Keep your tone friendly, empathetic, and professional.
At the end, provide concise feedback on the candidate's soft skills and overall fit.
Avoid bullet points, asterisks, or special formatting.
"""


class QueryRequest(BaseModel):
    text: str
    round: str = "technical"  # can be "technical" or "hr"
    stop_audio: bool = False


@app.post("/query")
async def query_endpoint(
    request_data: QueryRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user),
):
    username = current_user["username"]
    # Initialize conversation history if not already present
    if username not in user_conversations:
        user_conversations[username] = {
            "technical": [{"role": "system", "content": technical_prompt}],
            "hr": [{"role": "system", "content": hr_prompt}],
        }
    round_type = (
        request_data.round if request_data.round in ["technical", "hr"] else "technical"
    )
    conversation_history = user_conversations[username][round_type]
    conversation_history.append({"role": "user", "content": request_data.text})
    try:
        if round_type == "technical":
            chat_completion = tech_groq_client.chat.completions.create(
                messages=conversation_history,
                model="llama-3.3-70b-versatile",
            )
        else:
            chat_completion = hr_groq_client.chat.completions.create(
                messages=conversation_history,
                model="llama-3.3-70b-versatile",
            )
        response_text = chat_completion.choices[0].message.content.strip()
        conversation_history.append({"role": "assistant", "content": response_text})
        background_tasks.add_task(generate_speech_async, response_text, username)
        return {"response": response_text}
    except Exception as e:
        return {"response": f"Error: {str(e)}"}


# 6. Endpoint to Serve Generated Audio
@app.get("/response.mp3")
async def get_audio(current_user: dict = Depends(get_current_user)):
    username = current_user["username"]
    audio_file_path = os.path.join("static", f"{username}_response.mp3")
    if os.path.exists(audio_file_path):
        return FileResponse(audio_file_path, media_type="audio/mpeg")
    else:
        raise HTTPException(status_code=404, detail="Audio file not found")


# 7. Quiz Generation Endpoint
class QuizRequest(BaseModel):
    subject: str = "DSA"
    difficulty: str = "Easy"
    proficiency: str = "Beginner"


@app.post("/generate-quiz")
def generate_quiz(data: QuizRequest):
    subject = data.subject.strip()
    difficulty = data.difficulty
    proficiency = data.proficiency

    if subject.upper() == "DSA":
        subject = "Data Structures and Algorithms"

    messages = [
        {
            "role": "system",
            "content": (
                "You are an intelligent MCQ generator and evaluator. Your task is to create multiple-choice questions (MCQs) "
                "based on the user's specified subject, difficulty level, and proficiency. Please generate the quiz as a strictly valid JSON array. "
                "Do not include any markdown formatting or extra text. Each object in the array should have the following keys:\n"
                " - id (a unique number)\n"
                " - question (a string)\n"
                " - options (an array of objects; each object has keys 'id' and 'text')\n"
                " - correctAnswer (the id of the correct option)\n"
                " - estimatedTime (a string, e.g., '30 seconds')\n"
                " - concept (a string representing the specific concept or topic that this question covers, e.g., 'Stacks', 'Queues', etc.)\n"
                "Note: If the subject is provided as 'DSA', it should be interpreted as 'Data Structures and Algorithms'."
            ),
        },
        {
            "role": "user",
            "content": (
                f"I'm a {proficiency} level student who wants to prepare for {subject} at a {difficulty} difficulty level. "
                "Please ensure that each question specifically indicates the topic or concept it covers."
            ),
        },
    ]

    completion = quiz_groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=1,
        max_completion_tokens=1024,
        top_p=1,
        stream=False,
        stop=None,
    )
    quiz_content_str = completion.choices[0].message.content
    print("Raw quiz content from AI:", quiz_content_str)
    try:
        quiz_array = json.loads(quiz_content_str)
    except Exception as e:
        print("Direct JSON parsing failed:", e)
        start = quiz_content_str.find("[")
        end = quiz_content_str.rfind("]")
        if start != -1 and end != -1:
            json_string = quiz_content_str[start : end + 1]
            try:
                quiz_array = json.loads(json_string)
            except Exception as e:
                print("Fallback JSON parsing failed:", e)
                quiz_array = []
        else:
            quiz_array = []
    return {"quiz": quiz_array}


# 8. Quiz Feedback Generation Endpoint
class IncorrectQuestion(BaseModel):
    id: int
    question: str
    concept: Optional[str] = None
    userAnswer: int
    correctAnswer: int


class FeedbackRequest(BaseModel):
    incorrectQuestions: List[IncorrectQuestion]


@app.post("/generate-feedback")
def generate_feedback(data: FeedbackRequest):
    incorrect_questions = data.incorrectQuestions
    questions_text = ""
    for q in incorrect_questions:
        questions_text += f"Question ID {q.id}: {q.question}\n"
        if q.concept:
            questions_text += f"Concept: {q.concept}\n"
        questions_text += (
            f"User Answer: {q.userAnswer}, Correct Answer: {q.correctAnswer}\n\n"
        )

    messages = [
        {
            "role": "system",
            "content": (
                "You are an expert tutor in Data Structures and Algorithms. Based on the list of questions a student answered incorrectly, "
                "analyze the underlying topics and provide detailed feedback on which specific areas the student needs to focus on, along with actionable suggestions for improvement. "
                "Your response should be in plain text."
            ),
        },
        {
            "role": "user",
            "content": f"Here are the questions answered incorrectly:\n{questions_text}",
        },
    ]

    completion = quiz_groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0.7,
        max_completion_tokens=512,
        top_p=1,
        stream=False,
        stop=None,
    )
    feedback = completion.choices[0].message.content
    return {"feedback": feedback}


# ---------------------------
# CrewAI Job Scraping Setup & Endpoints
# ---------------------------

# Initialize CrewAI LLM
llm = LLM(model="groq/llama-3.3-70b-versatile", temperature=0.7)


# Function to create a job scraper agent
def create_job_scraper_agent(city):
    return Agent(
        role=f"Software Engineer Job Scraper - {city} stop after 1 seconds",
        goal=f"Retrieve accurate job postings for {city}.",
        backstory=f"You extract fresh job listings from {city} with high accuracy.",
        llm=llm,
        allow_delegation=False,
        verbose=True,
    )


# Function to create a job scraping task
def create_job_scraper_task(city, agent):
    return Task(
        description=f"Scrape recent Software Engineer job postings from {city}.",
        expected_output=(
            "```json\n"
            "{\n"
            "  'job_title': 'Software Engineer',\n"
            "  'company_name': 'Example Corp',\n"
            f"  'location': '{city}',\n"
            "  'date_posted': '2025-02-20',\n"
            "  'job_description': 'Develop scalable backend systems.',\n"
            "  'application_link': 'https://example.com/apply'\n"
            "}\n"
            "```"
        ),
        agent=agent,
    )


# Target locations
locations = ["Hyderabad", "Pune", "Bengaluru", "Mumbai", "Remote"]

# Create agents and tasks
agents = {city: create_job_scraper_agent(city) for city in locations}
tasks = {city: create_job_scraper_task(city, agents[city]) for city in locations}


# API Endpoint to run job scraper for all cities
@app.get("/job-scraper/all")
def job_scraper_all():
    try:
        print("Starting CrewAI job scraping for all cities...")
        crew_all = Crew(
            agents=list(agents.values()),
            tasks=list(tasks.values()),
            verbose=True,
        )
        result_all = crew_all.kickoff()
        print("Scraping results:", result_all)  # Debugging log
        return {"combined_results": result_all}
    except RateLimitError:
        return {"error": "Rate limit exceeded. Try again later."}
    except Exception as e:
        return {"error": f"Unexpected error: {str(e)}"}


# API Endpoint to get job listings city-wise
@app.get("/job-scraper/city")
def job_scraper_city():
    job_results = {}

    for city in locations:
        retries = 3  # Maximum retries
        while retries > 0:
            try:
                # Simulate CrewAI scraping
                crew_city = Crew(
                    agents=[agents[city]],
                    tasks=[tasks[city]],
                    verbose=True,
                )
                result_city = crew_city.kickoff()

                # Validate and parse result
                if isinstance(result_city, str):
                    result_city = json.loads(result_city)

                job_results[city] = result_city
                break  # If successful, break the retry loop

            except RateLimitError as e:
                error_msg = str(e)
                print(
                    f"Rate limit hit for {city}, retrying after cooldown... {error_msg}"
                )
                cooldown_time = 3  # Set a wait time in seconds (increase if needed)
                time.sleep(cooldown_time)  # Pause before retrying
                retries -= 1  # Reduce the retry count

            except json.JSONDecodeError:
                job_results[city] = {"error": "Invalid JSON response"}
                break

            except Exception as e:
                job_results[city] = {"error": f"Unexpected error: {str(e)}"}
                break

    return {"city_results": job_results}


# Run FastAPI server
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
