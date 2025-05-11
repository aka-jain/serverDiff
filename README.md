# Server-side DOM Renderer with Diff and Reconciliation

A real-time collaborative virtual DOM editor that uses WebSocket for live updates. This project demonstrates how to implement a simple virtual DOM system with real-time synchronization between server and client, featuring server-side rendering with diff and reconciliation capabilities.

## Features

- Server-side DOM rendering with WebSocket
- Virtual DOM diff and reconciliation
- Real-time DOM updates
- Live text content updates
- Dynamic element addition
- Type-safe implementation with TypeScript

## Project Structure

```
.
├── client/                 # React client application
│   ├── src/
│   │   ├── utils/         # Utility functions and constants
│   │   │   ├── constants.ts  # Application constants
│   │   │   └── endpoints.ts  # API endpoints
│   │   ├── App.tsx        # Main application component
│   │   └── App.css        # Application styles
│   └── package.json       # Client dependencies
└── server/                # WebSocket server
    ├── server.js          # Server implementation with virtual DOM
    └── package.json       # Server dependencies
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

## Running the Application

1. Start the WebSocket server:
```bash
cd server
node server.js
```

2. In a new terminal, start the React client:
```bash
cd client
npm start
```

The application will be available at `http://localhost:3000`

## Usage

- **Update Title**: Changes the main title with current timestamp
- **Update Subtitle**: Changes the subtitle with current timestamp
- **Add Entry**: Adds a new paragraph to the content section

## Technical Details

- **Frontend**: React with TypeScript
- **Backend**: Node.js with WebSocket
- **Virtual DOM**: Server-side implementation with diff and reconciliation
- **Communication**: WebSocket for real-time updates
- **State Management**: React's useState for local state
- **Type Safety**: TypeScript interfaces and type checking

## Development

The project uses TypeScript for type safety. Key interfaces include:

- `VirtualDOMNode`: Structure for virtual DOM nodes
- `WebSocketMessage`: Types for WebSocket communication
- `Action`: Types for DOM modification actions

## How It Works

1. **Server-side Virtual DOM**:
   - Maintains the source of truth for DOM structure
   - Handles diff and reconciliation
   - Sends updates to clients

2. **Client-side Rendering**:
   - Receives virtual DOM updates
   - Renders changes efficiently
   - Sends user actions back to server

3. **Real-time Updates**:
   - WebSocket connection for bi-directional communication
   - Immediate propagation of changes
   - Efficient state synchronization
