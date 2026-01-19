# 144 Types Personality Test (Refactored)

## Project Structure
- `client`: React + Vite + TypeScript frontend.
- `server`: Express + TypeScript backend.

## How to Run

### Client
1. `cd client`
2. `npm install`
3. `npm run dev`
4. Visit `http://localhost:5173`

### Server
1. `cd server`
2. `npm install`
3. `npm run dev`
4. Server runs on `http://localhost:3000`

## Features Implemented
- MBTI Test (16 Questions)
- Enneagram Test (45 Questions, extensible to 144)
- Results calculation and display
- PDF Download (Client-side generation)
- Secure Storage (AES-256)
- Responsive UI with Styled Components
- Route Guards for test flow
- Header with progress bar and "Return to Home" confirmation
