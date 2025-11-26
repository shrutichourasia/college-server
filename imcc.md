# Code Sync - Comprehensive Project Documentation

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Why We Created This Project](#2-why-we-created-this-project)
3. [Database Architecture](#3-database-architecture)
4. [Routes and API Endpoints](#4-routes-and-api-endpoints)
5. [Folder Structure](#5-folder-structure)
6. [Key Features](#6-key-features)
7. [User Authentication and Authorization](#7-user-authentication-and-authorization)

---

## 1. Project Overview

### What is Code Sync?

Code Sync is a real-time collaborative code editor platform that enables multiple developers to work together on code simultaneously in a shared virtual workspace. It provides a seamless, browser-based coding environment where users can create rooms, invite collaborators, and code together in real-time without the need for complex setup or version control systems.

### Core Concept

The application operates on a room-based collaboration model. Each room is identified by a unique Room ID (UUID), and users can join these rooms by entering the Room ID along with their username. Once inside a room, all participants can:

- Edit code files simultaneously with real-time synchronization
- See each other's cursor positions and typing indicators
- Communicate through an integrated chat system
- Execute code directly within the editor
- Manage files and folders collaboratively
- Draw and sketch together on a shared canvas
- Get AI-powered code assistance through the Copilot feature

### Technology Stack

**Frontend:**
- **React 18.2.0** - Modern UI library for building interactive user interfaces
- **TypeScript** - Type-safe JavaScript for better code quality and maintainability
- **Vite 6.2.2** - Fast build tool and development server
- **Tailwind CSS 3.4.1** - Utility-first CSS framework for rapid UI development
- **React Router DOM 6.22.3** - Client-side routing for single-page applications
- **CodeMirror 6.0.1** - Versatile text editor component with syntax highlighting
- **Socket.io Client 4.7.3** - Real-time bidirectional event-based communication
- **Tldraw 2.1.4** - Collaborative drawing and whiteboard functionality

**Backend:**
- **Node.js** - JavaScript runtime environment
- **Express.js 4.21.2** - Web application framework for Node.js
- **Socket.io 4.7.3** - Real-time event-based communication server
- **TypeScript 4.9.5** - Type-safe server-side development
- **CORS 2.8.5** - Cross-Origin Resource Sharing middleware

**External APIs:**
- **Piston API** - Code execution engine supporting multiple programming languages
- **Pollinations AI** - AI-powered code generation and assistance

**Deployment:**
- **Docker** - Containerization for consistent deployment
- **Vercel** - Frontend hosting platform
- **Docker Compose** - Multi-container Docker application orchestration

### Architecture Overview

Code Sync follows a client-server architecture with WebSocket-based real-time communication:

1. **Client Application (Frontend)**: React-based single-page application that handles all user interactions, UI rendering, and state management
2. **Server Application (Backend)**: Node.js/Express server that manages WebSocket connections, room management, and real-time event broadcasting
3. **Real-time Communication**: Socket.io enables bidirectional communication between clients and server for instant synchronization
4. **Stateless Design**: The server maintains minimal in-memory state (user sessions), making it scalable and resilient

---

## 2. Why We Created This Project

### Problem Statement

Modern software development is increasingly collaborative, with teams distributed across different locations and time zones. Traditional development workflows face several challenges:

1. **Setup Complexity**: Setting up local development environments, installing dependencies, and configuring version control can be time-consuming and error-prone
2. **Real-time Collaboration Gaps**: While tools like Git enable collaboration, they don't provide real-time synchronous editing experiences
3. **Learning and Teaching Barriers**: Teaching programming or debugging code with others requires screen sharing or complex setup
4. **Quick Prototyping**: Sometimes developers need to quickly share code snippets or test ideas without the overhead of repository setup
5. **Interview and Assessment**: Technical interviews and coding assessments often require complex setup that can be simplified with a shared coding environment

### Our Solution

Code Sync addresses these challenges by providing:

**Instant Collaboration**: No setup required - users can start coding together in seconds by simply sharing a Room ID. This eliminates the friction of environment setup and allows for immediate collaboration.

**Real-time Synchronization**: All code changes, file operations, and user actions are synchronized instantly across all participants. This creates a true collaborative experience similar to Google Docs but for code.

**Accessibility**: Being browser-based, Code Sync works on any device with a modern web browser, eliminating platform-specific barriers. Users don't need to install any software or configure development environments.

**Educational Value**: Perfect for teaching programming, conducting code reviews, pair programming sessions, and collaborative learning. Instructors can share a room with students and code together in real-time.

**Interview Platform**: Provides a clean, distraction-free environment for technical interviews where candidates and interviewers can code together, making the assessment process more interactive and fair.

**Rapid Prototyping**: Teams can quickly spin up a room, code together, test ideas, and iterate without the overhead of version control setup for early-stage projects.

### Target Audience

1. **Development Teams**: Remote or co-located teams working on shared codebases
2. **Educators and Students**: Teachers conducting programming classes and students learning collaboratively
3. **Technical Interviewers**: Companies conducting remote coding interviews
4. **Open Source Contributors**: Developers collaborating on open-source projects
5. **Code Reviewers**: Teams conducting real-time code review sessions
6. **Hackathon Participants**: Teams working together during time-constrained events

### Unique Value Proposition

Unlike traditional IDEs or code editors, Code Sync:
- Requires zero installation or configuration
- Provides true real-time collaboration (not just version control)
- Integrates multiple collaboration tools (chat, drawing, code execution) in one platform
- Offers AI-powered code assistance directly in the editor
- Supports multiple programming languages with syntax highlighting
- Enables code execution without leaving the editor

---

## 3. Database Architecture

### Current Implementation: In-Memory Storage

Code Sync currently uses an **in-memory data storage** approach rather than a traditional database. This design choice aligns with the application's real-time, session-based nature.

#### Data Storage Strategy

**Server-Side In-Memory Storage:**

The server maintains user and room information in memory using JavaScript arrays and objects:

```typescript
// User storage in server/src/server.ts
let userSocketMap: User[] = []

// User interface structure
interface User {
    username: string
    roomId: string
    status: USER_CONNECTION_STATUS
    cursorPosition: number
    typing: boolean
    currentFile: string | null
    socketId: string
}
```

**Client-Side State Management:**

The client application uses React Context API for state management:

1. **FileContext**: Manages file structure, open files, and active file state
2. **AppContext**: Manages user information, room data, and application state
3. **ChatContext**: Manages chat messages and conversation history
4. **SocketContext**: Manages WebSocket connection state
5. **SettingContext**: Manages user preferences (theme, font, language settings)
6. **CopilotContext**: Manages AI assistant interactions
7. **RunCodeContext**: Manages code execution state

**Local Storage:**

User preferences and settings are persisted using browser's `localStorage`:

- Theme preferences (dark/light mode)
- Font family and size settings
- Language preferences
- GitHub corner visibility settings

### Why In-Memory Storage?

**Advantages:**

1. **Performance**: In-memory operations are extremely fast, enabling real-time synchronization without database query overhead
2. **Simplicity**: No database setup, configuration, or maintenance required
3. **Real-time Nature**: Perfect for ephemeral, session-based data that doesn't need persistence
4. **Scalability for Sessions**: Each room session is independent and doesn't require cross-session data persistence
5. **Cost-Effective**: No database hosting costs for the current use case

**Limitations:**

1. **No Persistence**: Data is lost when the server restarts
2. **No History**: Previous sessions and code changes are not saved
3. **Limited Scalability**: All data must fit in server memory
4. **No User Accounts**: Cannot maintain user profiles or authentication across sessions

### Future Database Considerations

For production scaling, the following database options could be considered:

**Option 1: Redis**
- **Use Case**: Session storage, real-time data caching
- **Advantages**: Fast, in-memory with optional persistence, supports pub/sub for real-time features
- **Best For**: Maintaining active room sessions and user presence

**Option 2: PostgreSQL**
- **Use Case**: Persistent data storage, user accounts, room history
- **Advantages**: Relational database, ACID compliance, robust querying
- **Best For**: User authentication, room history, saved projects

**Option 3: MongoDB**
- **Use Case**: Document-based storage for code files and room data
- **Advantages**: Flexible schema, good for nested data structures
- **Best For**: Storing file structures, code snapshots, room configurations

**Option 4: Hybrid Approach**
- **Redis**: Active sessions, real-time state
- **PostgreSQL/MongoDB**: Persistent data, user accounts, room history
- **File Storage (S3/Cloud Storage)**: Code snapshots, exported projects

### Data Flow Architecture

```
Client (Browser)
    ↓
React Context (State Management)
    ↓
Socket.io Client (WebSocket)
    ↓
Socket.io Server (Node.js/Express)
    ↓
In-Memory Storage (userSocketMap, room data)
    ↓
Broadcast to Connected Clients
    ↓
Real-time Updates
```

### Data Synchronization

The application uses **operational transformation** principles through Socket.io events:

1. **File Operations**: Create, update, delete, rename operations are broadcast to all room participants
2. **User Presence**: Join, leave, online/offline status updates are synchronized
3. **Cursor Positions**: Real-time cursor and typing indicators are shared
4. **Chat Messages**: Messages are broadcast to all room participants
5. **Drawing Canvas**: Drawing operations are synchronized in real-time

---

## 4. Routes and API Endpoints

### Frontend Routes (Client-Side Routing)

Code Sync uses **React Router** for client-side routing, providing a single-page application (SPA) experience.

#### Route Configuration

**Location**: `client/src/App.tsx`

```typescript
<Router>
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/editor/:roomId" element={<EditorPage />} />
    </Routes>
</Router>
```

#### Route Details

**1. Home Page Route**
- **Path**: `/`
- **Component**: `HomePage`
- **Purpose**: Landing page where users enter Room ID and username
- **Features**:
  - Room ID input field
  - Username input field
  - "Generate Unique Room ID" button
  - "Copy Room ID" button
  - "Join" button to enter the editor
  - Project description and features showcase

**2. Editor Page Route**
- **Path**: `/editor/:roomId`
- **Component**: `EditorPage`
- **Dynamic Parameter**: `roomId` - Unique identifier for the collaboration room
- **Purpose**: Main application interface for collaborative coding
- **Features**:
  - Code editor with syntax highlighting
  - File tree navigation
  - Sidebar with multiple views (Files, Chat, Copilot, Run, Users, Settings)
  - Real-time collaboration features
  - Header showing room ID and username

**Route Guards and Navigation**

The application implements route protection through:

1. **Username Validation**: If a user navigates to `/editor/:roomId` without a username, they are redirected back to the home page
2. **Room ID Validation**: The room ID must be a valid UUID format
3. **Socket Connection**: Users must successfully connect to the WebSocket server before accessing the editor

### Backend API Endpoints

The backend server uses **Express.js** for HTTP endpoints and **Socket.io** for WebSocket communication.

#### HTTP Endpoints

**1. Root Endpoint**
- **Method**: `GET`
- **Path**: `/`
- **Purpose**: Serves the static HTML file
- **Response**: Sends `public/index.html`
- **Location**: `server/src/server.ts`

```typescript
app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"))
})
```

**2. Static File Serving**
- **Path**: `/public/*`
- **Purpose**: Serves static assets (CSS, JS, images)
- **Configuration**: `app.use(express.static(path.join(__dirname, "public")))`

#### WebSocket Events (Socket.io)

The application primarily uses WebSocket events for real-time communication. All events are defined in `server/src/types/socket.ts` and `client/src/types/socket.ts`.

**Connection Management Events:**

1. **JOIN_REQUEST**
   - **Direction**: Client → Server
   - **Payload**: `{ roomId: string, username: string }`
   - **Purpose**: Request to join a collaboration room
   - **Server Action**: Validates username uniqueness, adds user to room, broadcasts join event

2. **JOIN_ACCEPTED**
   - **Direction**: Server → Client
   - **Payload**: `{ user: User, users: User[] }`
   - **Purpose**: Confirms successful room join and provides current room state

3. **USERNAME_EXISTS**
   - **Direction**: Server → Client
   - **Purpose**: Notifies client that the username is already taken in the room

4. **USER_JOINED**
   - **Direction**: Server → Client (broadcast)
   - **Payload**: `{ user: User }`
   - **Purpose**: Notifies other users when someone joins the room

5. **USER_DISCONNECTED**
   - **Direction**: Server → Client (broadcast)
   - **Payload**: `{ user: User }`
   - **Purpose**: Notifies users when someone leaves the room

**File Management Events:**

6. **SYNC_FILE_STRUCTURE**
   - **Direction**: Client ↔ Server
   - **Payload**: `{ fileStructure: FileSystemItem, openFiles: FileSystemItem[], activeFile: FileSystemItem, socketId: string }`
   - **Purpose**: Synchronizes file structure when a new user joins

7. **DIRECTORY_CREATED**
   - **Direction**: Client → Server → Client (broadcast)
   - **Payload**: `{ parentDirId: string, newDirectory: FileSystemItem }`
   - **Purpose**: Broadcasts directory creation to all room participants

8. **DIRECTORY_UPDATED**
   - **Direction**: Client → Server → Client (broadcast)
   - **Payload**: `{ dirId: string, children: FileSystemItem[] }`
   - **Purpose**: Updates directory contents across all clients

9. **DIRECTORY_RENAMED**
   - **Direction**: Client → Server → Client (broadcast)
   - **Payload**: `{ dirId: string, newName: string }`
   - **Purpose**: Synchronizes directory rename operations

10. **DIRECTORY_DELETED**
    - **Direction**: Client → Server → Client (broadcast)
    - **Payload**: `{ dirId: string }`
    - **Purpose**: Removes directory from all clients

11. **FILE_CREATED**
    - **Direction**: Client → Server → Client (broadcast)
    - **Payload**: `{ parentDirId: string, newFile: FileSystemItem }`
    - **Purpose**: Broadcasts new file creation

12. **FILE_UPDATED**
    - **Direction**: Client → Server → Client (broadcast)
    - **Payload**: `{ fileId: string, newContent: string }`
    - **Purpose**: Synchronizes file content changes in real-time

13. **FILE_RENAMED**
    - **Direction**: Client → Server → Client (broadcast)
    - **Payload**: `{ fileId: string, newName: string }`
    - **Purpose**: Synchronizes file rename operations

14. **FILE_DELETED**
    - **Direction**: Client → Server → Client (broadcast)
    - **Payload**: `{ fileId: string }`
    - **Purpose**: Removes file from all clients

**User Presence Events:**

15. **USER_OFFLINE**
    - **Direction**: Client → Server → Client (broadcast)
    - **Payload**: `{ socketId: string }`
    - **Purpose**: Updates user status to offline

16. **USER_ONLINE**
    - **Direction**: Client → Server → Client (broadcast)
    - **Payload**: `{ socketId: string }`
    - **Purpose**: Updates user status to online

**Chat Events:**

17. **SEND_MESSAGE**
    - **Direction**: Client → Server
    - **Payload**: `{ message: ChatMessage }`
    - **Purpose**: Sends chat message to server

18. **RECEIVE_MESSAGE**
    - **Direction**: Server → Client (broadcast)
    - **Payload**: `{ message: ChatMessage }`
    - **Purpose**: Broadcasts chat message to all room participants

**Cursor and Typing Events:**

19. **TYPING_START**
    - **Direction**: Client → Server → Client (broadcast)
    - **Payload**: `{ cursorPosition: number }` (client) / `{ user: User }` (server)
    - **Purpose**: Indicates user started typing and shows cursor position

20. **TYPING_PAUSE**
    - **Direction**: Client → Server → Client (broadcast)
    - **Payload**: `{ user: User }`
    - **Purpose**: Indicates user stopped typing

**Drawing Events:**

21. **REQUEST_DRAWING**
    - **Direction**: Client → Server → Client (broadcast)
    - **Payload**: `{ socketId: string }`
    - **Purpose**: Requests drawing canvas synchronization

22. **SYNC_DRAWING**
    - **Direction**: Client → Server → Client
    - **Payload**: `{ drawingData: DrawingData, socketId: string }`
    - **Purpose**: Synchronizes drawing canvas state

23. **DRAWING_UPDATE**
    - **Direction**: Client → Server → Client (broadcast)
    - **Payload**: `{ snapshot: StoreSnapshot }`
    - **Purpose**: Broadcasts drawing canvas updates

### External API Integrations

**1. Piston API**
- **Purpose**: Code execution engine
- **Endpoint**: `https://emkc.org/api/v2/piston/execute`
- **Method**: POST
- **Location**: `client/src/api/pistonApi.ts`
- **Usage**: Executes code in various programming languages

**2. Pollinations AI API**
- **Purpose**: AI-powered code generation
- **Endpoint**: `https://text.pollinations.ai/`
- **Method**: POST
- **Location**: `client/src/api/pollinationsApi.ts`
- **Usage**: Generates code based on user prompts

---

## 5. Folder Structure

### Project Root Structure

```
Code-Sync/
├── client/                 # Frontend React application
├── server/                 # Backend Node.js/Express server
├── docker-compose.yml      # Docker orchestration configuration
├── README.md              # Project documentation
├── CONTRIBUTING.md        # Contribution guidelines
├── LICENSE                # MIT License
└── preview.png            # Project preview image
```

### Client Folder Structure

```
client/
├── public/                # Static assets
│   └── favicon/          # Favicon files
├── src/                   # Source code
│   ├── api/              # External API integrations
│   │   ├── pistonApi.ts         # Code execution API
│   │   └── pollinationsApi.ts   # AI code generation API
│   ├── assets/           # Images and static assets
│   │   ├── illustration.svg
│   │   └── logo.svg
│   ├── components/       # React components
│   │   ├── chats/       # Chat functionality
│   │   │   ├── ChatInput.tsx
│   │   │   └── ChatList.tsx
│   │   ├── common/      # Shared components
│   │   │   ├── Footer.tsx
│   │   │   ├── Select.tsx
│   │   │   └── Users.tsx
│   │   ├── connection/  # Connection status
│   │   │   └── ConnectionStatusPage.tsx
│   │   ├── drawing/     # Collaborative drawing
│   │   │   └── DrawingEditor.tsx
│   │   ├── editor/      # Code editor components
│   │   │   ├── Editor.tsx
│   │   │   ├── EditorComponent.tsx
│   │   │   ├── FileTab.tsx
│   │   │   └── tooltip.ts
│   │   ├── files/       # File management
│   │   │   ├── FileStructureView.tsx
│   │   │   └── RenameView.tsx
│   │   ├── forms/       # Form components
│   │   │   └── FormComponent.tsx
│   │   ├── sidebar/     # Sidebar navigation
│   │   │   ├── sidebar-views/
│   │   │   │   ├── ChatsView.tsx
│   │   │   │   ├── CopilotView.tsx
│   │   │   │   ├── FilesView.tsx
│   │   │   │   ├── RunView.tsx
│   │   │   │   ├── SettingsView.tsx
│   │   │   │   ├── SidebarButton.tsx
│   │   │   │   └── UsersView.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── tooltipStyles.ts
│   │   ├── SplitterComponent.tsx  # Resizable panels
│   │   ├── toast/       # Toast notifications
│   │   │   └── Toast.tsx
│   │   └── workspace/    # Main workspace
│   │       └── index.tsx
│   ├── context/         # React Context providers
│   │   ├── AppContext.tsx        # Application state
│   │   ├── AppProvider.tsx      # Context provider wrapper
│   │   ├── ChatContext.tsx      # Chat state
│   │   ├── CopilotContext.tsx   # AI assistant state
│   │   ├── FileContext.tsx      # File system state
│   │   ├── RunCodeContext.tsx   # Code execution state
│   │   ├── SettingContext.tsx   # User settings
│   │   ├── SocketContext.tsx    # WebSocket connection
│   │   └── ViewContext.tsx      # View management
│   ├── hooks/           # Custom React hooks
│   │   ├── useContextMenu.tsx
│   │   ├── useFullScreen.tsx
│   │   ├── useLocalStorage.tsx
│   │   ├── usePageEvents.tsx
│   │   ├── useResponsive.tsx
│   │   ├── useUserActivity.tsx
│   │   └── useWindowDimensions.tsx
│   ├── pages/           # Page components
│   │   ├── EditorPage.tsx       # Main editor page
│   │   └── HomePage.tsx         # Landing page
│   ├── resources/       # Resources and configurations
│   │   ├── Fonts.ts             # Font configurations
│   │   └── Themes.ts            # Theme configurations
│   ├── styles/          # Global styles
│   │   └── global.css
│   ├── types/           # TypeScript type definitions
│   │   ├── app.ts
│   │   ├── chat.ts
│   │   ├── copilot.ts
│   │   ├── file.ts
│   │   ├── fileTab.ts
│   │   ├── index.d.ts
│   │   ├── lang-map.d.ts
│   │   ├── run.ts
│   │   ├── setting.ts
│   │   ├── socket.ts
│   │   ├── user.ts
│   │   └── view.ts
│   ├── utils/           # Utility functions
│   │   ├── customMapping.ts
│   │   ├── file.ts
│   │   ├── formateDate.ts
│   │   └── getIconClassName.ts
│   ├── App.tsx           # Root component
│   ├── main.tsx          # Application entry point
│   └── vite-env.d.ts     # Vite type definitions
├── Dockerfile            # Docker configuration
├── index.html            # HTML template
├── package.json         # Dependencies and scripts
├── postcss.config.cjs    # PostCSS configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── tsconfig.node.json    # TypeScript config for Node
├── vercel.json           # Vercel deployment config
└── vite.config.mts       # Vite configuration
```

### Server Folder Structure

```
server/
├── public/              # Static files
│   └── index.html
├── src/                 # Source code
│   ├── types/          # TypeScript type definitions
│   │   ├── socket.ts   # Socket event types
│   │   └── user.ts     # User type definitions
│   └── server.ts       # Main server file
├── Dockerfile           # Docker configuration
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

### Key Directory Explanations

**Components Directory (`client/src/components/`)**
- Organized by feature/functionality
- Each major feature has its own subdirectory
- Reusable components are in `common/`
- Sidebar views are modularized in `sidebar/sidebar-views/`

**Context Directory (`client/src/context/`)**
- Each context manages a specific domain of application state
- `AppProvider.tsx` wraps all context providers in the correct order
- Contexts are used throughout the application for state management

**Hooks Directory (`client/src/hooks/`)**
- Custom React hooks for reusable logic
- Hooks encapsulate complex behaviors (fullscreen, responsive design, user activity)
- Promotes code reusability and separation of concerns

**Types Directory (`client/src/types/` and `server/src/types/`)**
- Centralized TypeScript type definitions
- Ensures type safety across the application
- Shared types between client and server where applicable

**Utils Directory (`client/src/utils/`)**
- Pure utility functions
- No side effects, easily testable
- Helper functions for common operations

---

## 6. Key Features

### 6.1 Real-Time Code Collaboration

**Description**: The core feature of Code Sync is real-time collaborative code editing. Multiple users can edit the same file simultaneously, with changes synchronized instantly across all participants.

**Technical Implementation**:
- Uses Socket.io for WebSocket-based real-time communication
- Operational transformation principles for conflict resolution
- File content updates broadcast to all room participants
- Cursor positions and typing indicators shown in real-time

**User Experience**:
- See other users' cursors with color-coded indicators
- View who is typing in which file
- Instant synchronization of all code changes
- No merge conflicts - changes are applied in real-time

### 6.2 File and Folder Management

**Description**: Complete file system management within the browser, allowing users to create, edit, rename, delete, and organize files and folders collaboratively.

**Features**:
- **Create Files**: Create new files with any extension
- **Create Folders**: Organize code in directory structures
- **Rename**: Rename files and folders
- **Delete**: Remove files and folders
- **File Tree Navigation**: Hierarchical view of project structure
- **Multiple File Tabs**: Open and switch between multiple files
- **Download Project**: Export entire project as ZIP file

**Technical Details**:
- File structure stored in React state (FileContext)
- All operations synchronized via Socket.io events
- File content stored in memory on both client and server
- Supports nested directory structures

### 6.3 Syntax Highlighting and Language Support

**Description**: Advanced code editor with syntax highlighting for multiple programming languages and automatic language detection.

**Supported Languages**:
- JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust
- HTML, CSS, SCSS, JSON, XML, YAML
- Markdown, SQL, Shell scripts
- And many more through CodeMirror language modes

**Features**:
- Automatic language detection based on file extension
- Theme support (multiple color schemes)
- Line numbers
- Code folding
- Bracket matching
- Auto-indentation

### 6.4 Code Execution

**Description**: Execute code directly within the editor without leaving the application, supporting multiple programming languages.

**Implementation**:
- Integrates with Piston API for code execution
- Supports 50+ programming languages
- Real-time output display
- Error handling and display
- Input support for interactive programs

**Supported Execution**:
- Compile and run compiled languages (C++, Java, Go)
- Interpret and execute scripting languages (Python, JavaScript, Ruby)
- Display output, errors, and execution time
- Handle standard input for interactive programs

### 6.5 Real-Time Chat

**Description**: Integrated group chat functionality allowing all room participants to communicate while coding.

**Features**:
- Real-time message delivery
- Message timestamps
- User identification (username display)
- Message history within session
- Markdown support for AI assistant messages
- Syntax highlighting in code blocks

**Technical Implementation**:
- Messages broadcast via Socket.io
- Chat state managed in ChatContext
- Messages stored in React state (session-based)
- Markdown rendering for formatted messages

### 6.6 User Presence and Activity Indicators

**Description**: Visual indicators showing who is in the room, their online/offline status, and what they're currently doing.

**Features**:
- **User List**: See all participants in the room
- **Online/Offline Status**: Real-time status updates
- **Cursor Indicators**: See where other users are editing
- **Typing Indicators**: Know when someone is typing
- **Current File Display**: See which file each user is viewing
- **Avatar System**: Visual representation of users

**Implementation**:
- User presence tracked in server memory
- Status updates broadcast via Socket.io
- Cursor positions updated in real-time
- Activity state synchronized across clients

### 6.7 AI-Powered Copilot

**Description**: Integrated AI assistant that can generate code, analyze code for errors, and provide coding assistance.

**Features**:
- **Code Generation**: Generate code based on natural language prompts
- **Error Detection**: Analyze current files for errors, bugs, and typos
- **Code Suggestions**: Get suggestions for code improvements
- **Context Awareness**: AI has access to current file contents
- **Chat Integration**: Questions and answers appear in chat
- **Code Actions**: Copy, paste, or replace code in files

**Technical Details**:
- Integrates with Pollinations AI API
- Passes file context (active file and open files) to AI
- Responses formatted in Markdown with syntax highlighting
- Real-time code analysis and suggestions

### 6.8 Collaborative Drawing

**Description**: Shared whiteboard/canvas where users can draw and sketch together in real-time.

**Features**:
- Real-time collaborative drawing
- Multiple drawing tools (pen, shapes, text)
- Color selection
- Undo/redo functionality
- Canvas synchronization
- Switch between coding and drawing modes

**Implementation**:
- Uses Tldraw library for drawing functionality
- Drawing state synchronized via Socket.io
- Canvas snapshots broadcast to all participants
- Seamless switching between code and drawing views

### 6.9 Customizable Editor Settings

**Description**: Extensive customization options for personalizing the coding experience.

**Settings Include**:
- **Theme Selection**: Multiple color schemes (Dark, Light, GitHub themes, etc.)
- **Font Family**: Choose from various coding fonts
- **Font Size**: Adjustable text size
- **Language Preferences**: Set default language
- **UI Preferences**: Toggle various UI elements

**Persistence**:
- Settings saved to browser localStorage
- Preferences persist across sessions
- Per-user customization (not room-based)

### 6.10 Room-Based Collaboration

**Description**: Unique room system where each collaboration session has its own isolated environment.

**Features**:
- **Unique Room IDs**: UUID-based room identification
- **Easy Sharing**: Share Room ID to invite collaborators
- **Room Isolation**: Each room is completely independent
- **No Registration**: Join rooms without account creation
- **Instant Access**: Start coding immediately after joining

**Room Management**:
- Rooms created on-demand
- No room limit (theoretical)
- Rooms persist as long as at least one user is connected
- Room state cleared when last user leaves

### 6.11 Responsive Design

**Description**: Application works seamlessly across different screen sizes and devices.

**Features**:
- Mobile-responsive layout
- Adaptive sidebar (collapsible on mobile)
- Touch-friendly controls
- Responsive editor layout
- Optimized for tablets and desktops

### 6.12 Export and Download

**Description**: Download entire project as a ZIP file for local use or backup.

**Features**:
- One-click project download
- Preserves folder structure
- Includes all files and directories
- ZIP file generation client-side
- No server storage required

---

## 7. User Authentication and Authorization

### Current Authentication Model: Room-Based Access

Code Sync currently uses a **simplified, room-based authentication model** rather than traditional user accounts. This design prioritizes ease of use and instant collaboration over persistent user identity.

### Authentication Flow

#### 1. Room Access (Primary Authentication)

**Process**:
1. User visits the home page (`/`)
2. Enters or generates a Room ID
3. Enters a username (no password required)
4. Clicks "Join" to enter the room
5. Server validates username uniqueness within the room
6. If username is available, user is granted access
7. If username exists, user receives error and must choose different username

**Validation Rules**:
- **Room ID**: Must be a valid UUID format (36 characters with hyphens)
- **Username**: 
  - Minimum 3 characters
  - Must be unique within the room
  - No special character restrictions
  - Case-sensitive

**Code Implementation**:

```typescript
// Server-side validation (server/src/server.ts)
socket.on(SocketEvent.JOIN_REQUEST, ({ roomId, username }) => {
    // Check if username exists in the room
    const isUsernameExist = getUsersInRoom(roomId).filter(
        (u) => u.username === username
    )
    
    if (isUsernameExist.length > 0) {
        io.to(socket.id).emit(SocketEvent.USERNAME_EXISTS)
        return
    }
    
    // Create user and grant access
    const user = {
        username,
        roomId,
        status: USER_CONNECTION_STATUS.ONLINE,
        // ... other properties
    }
    userSocketMap.push(user)
    socket.join(roomId)
    io.to(socket.id).emit(SocketEvent.JOIN_ACCEPTED, { user, users })
})
```

#### 2. Session Management

**Session Characteristics**:
- **Ephemeral**: Sessions exist only while user is connected
- **Room-Scoped**: User identity is valid only within the room
- **Socket-Based**: Authentication tied to WebSocket connection
- **No Persistence**: User data cleared on disconnect

**Session Lifecycle**:
1. **Connection**: User connects via WebSocket
2. **Authentication**: Username validated and room joined
3. **Active Session**: User can perform all room operations
4. **Disconnection**: User removed from room, session ends
5. **Reconnection**: User can rejoin with same or different username

### Authorization Model

#### Permission Levels

Currently, Code Sync has a **flat authorization model** - all users in a room have equal permissions:

**All Users Can**:
- Create, edit, delete files and folders
- Rename files and directories
- Execute code
- Send chat messages
- Use drawing canvas
- Access Copilot AI
- View all other users
- Download the project

**No Restricted Actions**:
- No read-only users
- No admin roles
- No permission-based restrictions
- No action logging or audit trails

#### Future Authorization Enhancements

The project roadmap includes:

1. **Admin Permission System**
   - Room creator becomes admin
   - Admin can manage user permissions
   - Admin can remove users
   - Admin can set room settings

2. **Role-Based Access Control**
   - **Owner**: Full control, can delete room
   - **Admin**: Can manage users and settings
   - **Editor**: Can edit code and files
   - **Viewer**: Read-only access

3. **User Accounts** (Future Enhancement)
   - Email/password authentication
   - OAuth integration (Google, GitHub)
   - User profiles and preferences
   - Room history and saved projects
   - Persistent identity across sessions

### Security Considerations

#### Current Security Measures

1. **Username Uniqueness**: Prevents username conflicts within rooms
2. **Room Isolation**: Users can only access rooms they know the ID for
3. **Socket Validation**: Server validates all incoming requests
4. **CORS Configuration**: Cross-origin requests controlled
5. **Input Validation**: Client and server-side validation

#### Security Limitations

1. **No Password Protection**: Rooms are accessible to anyone with Room ID
2. **No Encryption**: Data transmitted in plain text (WebSocket)
3. **No Rate Limiting**: No protection against abuse
4. **No Audit Logging**: No record of who did what
5. **No Data Persistence**: No backup or recovery mechanism

#### Recommended Security Enhancements

For production deployment:

1. **Room Passwords**: Optional password protection for rooms
2. **HTTPS/WSS**: Encrypted WebSocket connections
3. **Rate Limiting**: Prevent abuse and DoS attacks
4. **Input Sanitization**: Enhanced validation and sanitization
5. **User Authentication**: Optional account system for trusted users
6. **Room Expiration**: Automatic cleanup of inactive rooms
7. **Content Moderation**: Filter inappropriate content

### User Identity Management

#### Current Implementation

**User Object Structure**:

```typescript
interface User {
    username: string          // User's chosen name
    roomId: string          // Room identifier
    status: USER_CONNECTION_STATUS  // online/offline
    cursorPosition: number  // Current cursor location
    typing: boolean          // Is user currently typing
    currentFile: string | null  // Currently open file
    socketId: string        // WebSocket connection ID
}
```

**Identity Scope**:
- Identity is **room-specific**
- Same username can exist in different rooms
- No global user identity
- No cross-room user recognition

#### Storage

**Server-Side**:
- Users stored in memory array: `userSocketMap: User[]`
- Cleared when server restarts
- No persistent storage

**Client-Side**:
- User info in React Context (AppContext)
- Session-based (cleared on page refresh)
- No localStorage for user data

### Authentication Best Practices for Users

1. **Choose Unique Usernames**: Avoid conflicts by using distinctive names
2. **Share Room IDs Securely**: Only share with trusted collaborators
3. **Use Temporary Usernames**: For public rooms, use disposable usernames
4. **Monitor Room Activity**: Be aware of who joins your room
5. **Download Important Code**: Export projects before leaving rooms

### Future Authentication Roadmap

**Phase 1: Enhanced Room Security**
- Optional room passwords
- Room expiration settings
- User kick/ban functionality

**Phase 2: User Accounts**
- Email/password registration
- OAuth integration
- User profiles

**Phase 3: Advanced Authorization**
- Role-based permissions
- Action logging
- Room templates and presets

**Phase 4: Enterprise Features**
- SSO integration
- Team management
- Advanced audit logs
- Compliance features

---

## Conclusion

Code Sync represents a modern approach to collaborative coding, prioritizing ease of use, real-time collaboration, and instant access over traditional authentication and persistence models. The application successfully bridges the gap between complex development environments and the need for quick, seamless collaboration.

The room-based authentication model, while simple, effectively serves the primary use cases of the application: quick collaboration sessions, educational environments, and rapid prototyping. As the project evolves, enhancements to security, persistence, and user management will further strengthen its position as a leading collaborative coding platform.

The architecture is designed for scalability, with clear separation of concerns, modular components, and extensible design patterns. The use of modern web technologies ensures the application remains performant, maintainable, and ready for future enhancements.

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Project**: Code Sync  
**License**: MIT


