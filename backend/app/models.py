from sqlalchemy import Column, String, Enum, DateTime, ForeignKey, Integer, Float, Boolean, create_engine
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from app.core.config import settings
import enum
import datetime
import uuid

Base = declarative_base()
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class ModeEnum(enum.Enum):
    CASUAL = "casual"
    INTERVIEW = "interview"
    DEBATE = "debate"

class ErrorCategoryEnum(enum.Enum):
    GRAMMAR = "grammar"
    VOCABULARY = "vocabulary"
    FLUENCY = "fluency"
    PRONUNCIATION = "pronunciation"
    COHERENCE = "coherence"

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True)
    name = Column(String)
    level = Column(String, default="intermediate")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    sessions = relationship("Session", back_populates="user")

class Session(Base):
    __tablename__ = "sessions"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    mode = Column(Enum(ModeEnum), default=ModeEnum.CASUAL)
    started_at = Column(DateTime, default=datetime.datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)
    topic = Column(String)

    user = relationship("User", back_populates="sessions")
    messages = relationship("Message", back_populates="session")
    feedback = relationship("FeedbackReport", back_populates="session", uselist=False)

class Message(Base):
    __tablename__ = "messages"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String, ForeignKey("sessions.id"))
    sender = Column(String) # 'user' or 'ai'
    text_content = Column(String)
    audio_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    session = relationship("Session", back_populates="messages")
    error_logs = relationship("ErrorLog", back_populates="message")

class ErrorLog(Base):
    __tablename__ = "error_logs"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    message_id = Column(String, ForeignKey("messages.id"))
    error_category = Column(Enum(ErrorCategoryEnum))
    original_text = Column(String)
    corrected_text = Column(String)
    explanation = Column(String)

    message = relationship("Message", back_populates="error_logs")

class FeedbackReport(Base):
    __tablename__ = "feedback_reports"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String, ForeignKey("sessions.id"))
    overall_score = Column(Float)
    grammar_score = Column(Float)
    vocab_score = Column(Float)
    fluency_score = Column(Float)
    summary = Column(String)

    session = relationship("Session", back_populates="feedback")
