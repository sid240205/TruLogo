# TruLogo

**TruLogo** is an advanced AI-powered logo analysis platform designed to help businesses and designers optimize their brand identity. By leveraging state-of-the-art computer vision and machine learning techniques, TruLogo provides deep insights into logo effectiveness, safety compliance, and aesthetic quality.

##  Application Features

### 1. **Logo Analysis & Heatmaps**
   - **Visual Attention Heatmaps**: predictive AI models generate heatmaps to show where a user's eyes are most likely to focus on your logo.
   - **Aesthetics Scoring**: Automated scoring of logo complexity, balance, and color harmony.

### 2. **Safety & Compliance**
   - **Safety Checks**: Automatically scans logos for inappropriate content, symbols, or hidden meanings using safety classification models.
   - **Similarity Search**: Checks against a vector database of existing logos to prevent copyright infringement and ensure uniqueness.

### 3. **Remedy Engine**
   - **Actionable Feedback**: The Remedy Engine analyzes identified issues (e.g., low contrast, clutter) and provides specific, actionable suggestions for improvement.
   - **Design Guidelines**: Offers recommendations based on design best practices.

### 4. **Metadata Extraction**
   - Extracts key visual properties such as dominant colors, aspect ratios, and text content (OCR) from uploaded logo images.

## 🛠 Tech Stack

### Backend (API)
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **ML/AI**: 
  - [PyTorch](https://pytorch.org/) & [Transformers](https://huggingface.co/docs/transformers/index) for model inference.
  - [Sentence-Transformers](https://www.sbert.net/) for embedding generation.
  - [FAISS](https://github.com/facebookresearch/faiss) for high-performance vector similarity search.
- **Database**: 
  - [SQLAlchemy](https://www.sqlalchemy.org/) ORM.
  - [AsyncPG](https://github.com/MagicStack/asyncpg) for asynchronous PostgreSQL interaction.
- **Image Processing**: [Pillow](https://python-pillow.org/), [OpenCV](https://opencv.org/) (via numpy/scikit-image).

### Frontend (User Interface)
- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites
- **Python 3.9+**
- **Node.js 18+**
- **PostgreSQL** (Optional, if using a local DB instance)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # macOS/Linux
    source venv/bin/activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the application:**
    ```bash
    # Using the provided batch script (Windows)
    run_dev.bat
    
    # OR manually with Uvicorn
    uvicorn app.main:app --reload
    ```
    The API will be available at `http://localhost:8000`. API Docs are at `http://localhost:8000/docs`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## 📂 Project Structure

```
MSME/
├── backend/            # FastAPI Backend
│   ├── app/            # Application source code
│   │   ├── api/        # API Endpoints
│   │   ├── core/       # Core configuration & utils
│   │   ├── models/     # Database models
│   │   ├── services/   # Business logic (AI, Safety, Heatmaps)
│   │   └── main.py     # Entry point
│   ├── scripts/        # Utility scripts
│   └── tests/          # Unit & Integration tests
│
├── frontend/           # Next.js Frontend
│   ├── src/
│   │   ├── app/        # Next.js App Router pages
│   │   ├── components/ # Reusable React components
│   │   └── lib/        # Utility functions
│
└── README.md           # Project Documentation
```

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.
