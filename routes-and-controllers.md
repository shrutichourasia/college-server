# Code Sync - Routes and Controllers Documentation

## Page 1: Frontend Routes and Navigation

### Overview

Code Sync uses **React Router** for client-side routing, creating a Single Page Application (SPA) that provides seamless navigation without full page reloads. The routing system is minimal but effective, with only two main routes that handle the entire application flow.

### Route Configuration

The routing is configured in `client/src/App.tsx` using React Router v6:

```typescript
<Router>
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/editor/:roomId" element={<EditorPage />} />
    </Routes>
</Router>
```

### Route Details

#### 1. Home Route (`/`)

**Component**: `HomePage`  
**Location**: `client/src/pages/HomePage.tsx`  
**Purpose**: Landing page where users enter room credentials

**Functionality**:
- Displays project information and features
- Provides form to enter Room ID and username
- Allows generation of new Room IDs
- Handles room joining logic through `FormComponent`

**Navigation Flow**:
1. User enters Room ID (or generates new one)
2. User enters username
3. User clicks "Join" button
4. Form validates input (username min 3 chars, Room ID min 5 chars)
5. Socket connection established
6. `JOIN_REQUEST` event emitted to server
7. On successful join, navigates to `/editor/:roomId` with username in state

**Route Guards**:
- No authentication required
- Username validation (minimum 3 characters)
- Room ID validation (minimum 5 characters, UUID format)

**State Management**:
- Uses `AppContext` for current user state
- Uses `SocketContext` for WebSocket connection
- Uses React Router's `useNavigate` and `useLocation` hooks

#### 2. Editor Route (`/editor/:roomId`)

**Component**: `EditorPage`  
**Location**: `client/src/pages/EditorPage.tsx`  
**Dynamic Parameter**: `:roomId` - UUID identifier for the collaboration room  
**Purpose**: Main application interface for collaborative coding

**Functionality**:
- Displays code editor with syntax highlighting
- Shows file tree navigation
- Provides sidebar with multiple views (Files, Chat, Copilot, Run, Users, Settings)
- Handles real-time collaboration features
- Manages WebSocket connection lifecycle

**Route Protection**:
- Checks if username exists in route state
- If no username, redirects back to home page
- Validates room ID from URL parameters
- Ensures socket connection before rendering editor

**Navigation Flow**:
1. User arrives at `/editor/:roomId` from home page
2. Component extracts `roomId` from URL using `useParams()`
3. Retrieves `username` from `location.state`
4. If username missing, redirects to home with roomId in state
5. Sets current user in AppContext
6. Establishes/verifies WebSocket connection
7. Emits `JOIN_REQUEST` to server
8. Waits for `JOIN_ACCEPTED` event
9. Renders editor interface

**Component Structure**:
```
EditorPage
├── Header (Room ID, username display)
├── SplitterComponent (Resizable layout)
    ├── Sidebar (Navigation and views)
    │   ├── FilesView
    │   ├── ChatsView
    │   ├── CopilotView
    │   ├── RunView
    │   ├── UsersView
    │   └── SettingsView
    └── WorkSpace
        ├── FileTab (File tabs)
        └── Editor (Code editor)
```

### Internal View Routing

While not traditional routes, the application uses a view system for sidebar navigation:

**View Types** (defined in `client/src/types/view.ts`):
- `FILES` - File structure and management
- `CHATS` - Group chat interface
- `CLIENTS` - User presence list
- `RUN` - Code execution panel
- `COPILOT` - AI assistant interface
- `SETTINGS` - Editor customization

**View Management**:
- Managed by `ViewContext` (`client/src/context/ViewContext.tsx`)
- Views are components, not routes
- Switching views updates state, not URL
- Active view stored in React state

### Navigation Hooks and Utilities

**React Router Hooks Used**:
- `useNavigate()` - Programmatic navigation
- `useParams()` - Extract route parameters
- `useLocation()` - Access route state and location info
- `useNavigate()` with state - Pass data between routes

**Navigation Examples**:

```typescript
// Navigate to editor with username
navigate(`/editor/${roomId}`, {
    state: { username: currentUser.username }
})

// Redirect to home
navigate("/", { state: { roomId } })

// Get current route parameter
const { roomId } = useParams()

// Access route state
const location = useLocation()
const username = location.state?.username
```

### Route State Management

**Session Storage**:
- Uses `sessionStorage` to prevent redirect loops
- Stores `redirect` flag to track navigation state
- Cleared after successful room join

**Location State**:
- Username passed via `location.state` to prevent URL exposure
- Room ID can be passed back to home page for re-entry
- State persists during browser navigation (back/forward)

### Error Handling and Fallbacks

**Connection Failures**:
- If socket connection fails, shows `ConnectionStatusPage`
- User can retry connection
- Status tracked in `AppContext` (`USER_STATUS.CONNECTION_FAILED`)

**Invalid Routes**:
- React Router handles 404s (no catch-all route defined)
- Invalid room IDs handled by server validation
- Missing username triggers redirect to home

### Route Lifecycle

1. **Initial Load**: User visits `/` (home page)
2. **Room Entry**: User enters credentials and joins
3. **Editor Access**: Navigate to `/editor/:roomId`
4. **Reconnection**: If disconnected, can return to editor route
5. **Session End**: User closes browser or navigates away

---

## Page 2: Backend Routes and Controllers

### Overview

Code Sync uses a **hybrid routing architecture** combining traditional HTTP routes (Express.js) with WebSocket event handlers (Socket.io). The application is primarily event-driven, with most functionality handled through WebSocket events rather than REST endpoints.

### HTTP Routes (Express.js)

The backend server (`server/src/server.ts`) defines minimal HTTP routes:

#### 1. Root Route (`GET /`)

**Handler**: Serves static HTML file  
**Purpose**: Fallback for direct server access  
**Implementation**:

```typescript
app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"))
})
```

**Functionality**:
- Serves `public/index.html` for any unmatched routes
- Enables server-side rendering fallback
- Supports direct server URL access

#### 2. Static File Serving

**Middleware**: `express.static()`  
**Path**: `/public/*`  
**Purpose**: Serve static assets (CSS, JS, images)

```typescript
app.use(express.static(path.join(__dirname, "public")))
```

### WebSocket Event Handlers (Controllers)

The primary "controllers" in Code Sync are **Socket.io event handlers**. These act as controllers for real-time operations, handling all collaborative features.

#### Architecture Pattern

Instead of traditional REST controllers, the application uses:
- **Event Listeners**: `socket.on(eventName, handler)`
- **Event Emitters**: `socket.emit()` and `io.emit()`
- **Room-Based Broadcasting**: `socket.broadcast.to(roomId).emit()`

### Controller Categories

#### 1. User Management Controllers

**JOIN_REQUEST Handler**
- **Event**: `SocketEvent.JOIN_REQUEST`
- **Input**: `{ roomId: string, username: string }`
- **Logic**:
  1. Validates username uniqueness in room
  2. Creates user object with socket ID
  3. Adds user to `userSocketMap` array
  4. Joins socket to room
  5. Broadcasts `USER_JOINED` to other users
  6. Emits `JOIN_ACCEPTED` to new user with room state
- **Error Handling**: Emits `USERNAME_EXISTS` if username taken

**Disconnection Handler**
- **Event**: `disconnecting` (Socket.io built-in)
- **Logic**:
  1. Retrieves user by socket ID
  2. Broadcasts `USER_DISCONNECTED` to room
  3. Removes user from `userSocketMap`
  4. Removes socket from room

**User Status Controllers**
- `USER_OFFLINE`: Updates user status to offline, broadcasts to room
- `USER_ONLINE`: Updates user status to online, broadcasts to room

#### 2. File Management Controllers

All file operations follow the same pattern:
1. Receive event from client
2. Validate room ID from socket
3. Broadcast event to all other users in room
4. No persistence (in-memory only)

**File Operation Events**:
- `FILE_CREATED`: Broadcasts new file creation
- `FILE_UPDATED`: Broadcasts file content changes (real-time sync)
- `FILE_RENAMED`: Broadcasts file rename
- `FILE_DELETED`: Broadcasts file deletion

**Directory Operation Events**:
- `DIRECTORY_CREATED`: Broadcasts new directory
- `DIRECTORY_UPDATED`: Broadcasts directory children changes
- `DIRECTORY_RENAMED`: Broadcasts directory rename
- `DIRECTORY_DELETED`: Broadcasts directory deletion

**File Structure Sync**:
- `SYNC_FILE_STRUCTURE`: Syncs file structure to specific user (for new joiners)

#### 3. Chat Controllers

**SEND_MESSAGE Handler**
- **Event**: `SocketEvent.SEND_MESSAGE`
- **Input**: `{ message: ChatMessage }`
- **Logic**:
  1. Retrieves room ID from socket
  2. Broadcasts `RECEIVE_MESSAGE` to all room participants
  3. No message storage (ephemeral)

**Message Flow**:
```
Client A → socket.emit(SEND_MESSAGE) 
    → Server receives
    → socket.broadcast.to(roomId).emit(RECEIVE_MESSAGE)
    → All other clients receive message
```

#### 4. Cursor and Typing Controllers

**TYPING_START Handler**
- **Event**: `SocketEvent.TYPING_START`
- **Input**: `{ cursorPosition: number }`
- **Logic**:
  1. Updates user's typing status and cursor position
  2. Broadcasts user object with typing indicator
  3. Enables real-time cursor visualization

**TYPING_PAUSE Handler**
- **Event**: `SocketEvent.TYPING_PAUSE`
- **Logic**: Updates user's typing status to false, broadcasts update

#### 5. Drawing Controllers

**REQUEST_DRAWING Handler**
- **Event**: `SocketEvent.REQUEST_DRAWING`
- **Logic**: Broadcasts drawing request to room

**SYNC_DRAWING Handler**
- **Event**: `SocketEvent.SYNC_DRAWING`
- **Input**: `{ drawingData: DrawingData, socketId: string }`
- **Logic**: Sends drawing data to specific socket (targeted sync)

**DRAWING_UPDATE Handler**
- **Event**: `SocketEvent.DRAWING_UPDATE`
- **Input**: `{ snapshot: StoreSnapshot }`
- **Logic**: Broadcasts canvas updates to all room participants

### Controller Helper Functions

**getUsersInRoom(roomId: string)**
- Filters `userSocketMap` by room ID
- Returns array of users in specified room
- Used for room state queries

**getRoomId(socketId: SocketId)**
- Finds room ID associated with socket ID
- Returns `null` if user not found
- Used for validating socket belongs to room

**getUserBySocketId(socketId: SocketId)**
- Retrieves user object by socket ID
- Returns `null` if not found
- Used for user operations

### Data Storage (In-Memory)

**userSocketMap: User[]**
- Array storing all connected users
- Indexed by socket ID
- Cleared on server restart
- No persistence layer

**Room Data**
- Stored implicitly through socket rooms
- Socket.io manages room membership
- No explicit room data structure

### Controller Flow Example

**File Update Flow**:

```
1. Client A edits file
   ↓
2. Client A emits: socket.emit(FILE_UPDATED, { fileId, newContent })
   ↓
3. Server receives event
   ↓
4. Server validates: getRoomId(socket.id) → roomId
   ↓
5. Server broadcasts: socket.broadcast.to(roomId).emit(FILE_UPDATED, { fileId, newContent })
   ↓
6. All other clients in room receive update
   ↓
7. Clients update their local file state
   ↓
8. UI re-renders with new content
```

### Error Handling in Controllers

**Validation Patterns**:
- Room ID validation: `if (!roomId) return`
- User validation: `if (!user) return`
- Username uniqueness: Check before allowing join

**Error Responses**:
- `USERNAME_EXISTS`: Username already taken in room
- Silent failures: Invalid operations simply return (no error emitted)

### Security Considerations

**Current Implementation**:
- No authentication middleware
- No rate limiting
- No input sanitization (trusts client input)
- CORS enabled for all origins (`origin: "*"`)

**Room Isolation**:
- Users can only affect their own room
- Room ID extracted from socket connection
- Broadcasts scoped to room only

### Server Configuration

**Express Middleware**:
- `express.json()`: Parse JSON request bodies
- `cors()`: Enable Cross-Origin Resource Sharing
- `express.static()`: Serve static files

**Socket.io Configuration**:
- `cors.origin: "*"`: Allow all origins
- `maxHttpBufferSize: 1e8`: 100MB buffer for large messages
- `pingTimeout: 60000`: 60-second timeout for connection

### Controller Architecture Benefits

**Advantages**:
- Real-time updates without polling
- Efficient room-based broadcasting
- Simple event-driven architecture
- No REST endpoint maintenance

**Limitations**:
- No request/response pattern
- Difficult to implement traditional CRUD operations
- No built-in error handling patterns
- State lost on server restart

### Future Enhancements

**Potential Improvements**:
- Add REST API endpoints for non-real-time operations
- Implement controller classes for better organization
- Add middleware for authentication and validation
- Implement rate limiting per socket
- Add request logging and monitoring

---

## Summary

Code Sync uses a **minimalist routing approach** with:
- **2 Frontend Routes**: Home page and Editor page
- **1 HTTP Route**: Static file serving
- **23 WebSocket Event Handlers**: Acting as controllers for real-time operations

The architecture prioritizes **real-time collaboration** over traditional REST patterns, making WebSocket events the primary mechanism for all operations. This design is well-suited for collaborative applications where instant synchronization is more important than persistent data storage.


