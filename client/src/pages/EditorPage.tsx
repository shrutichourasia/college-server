import SplitterComponent from "@/components/SplitterComponent"
import ConnectionStatusPage from "@/components/connection/ConnectionStatusPage"
import Sidebar from "@/components/sidebar/Sidebar"
import WorkSpace from "@/components/workspace"
import { useAppContext } from "@/context/AppContext"
import { useSocket } from "@/context/SocketContext"
import useFullScreen from "@/hooks/useFullScreen"
import useUserActivity from "@/hooks/useUserActivity"
import { SocketEvent } from "@/types/socket"
import { USER_STATUS, User } from "@/types/user"
import { useEffect } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"

function EditorPage() {
    // Hooks for presence and fullscreen
    useUserActivity()
    useFullScreen()

    const navigate = useNavigate()
    const { roomId } = useParams()
    const { status, setCurrentUser, currentUser } = useAppContext()
    const { socket } = useSocket()
    const location = useLocation()

    useEffect(() => {
        if (currentUser.username.length > 0) return
        const username = location.state?.username
        if (username === undefined) {
            // If username wasn't passed, redirect to home so user can enter details
            navigate("/", {
                state: { roomId },
            })
        } else if (roomId) {
            const user: User = { username, roomId }
            setCurrentUser(user)
            // Ensure socket is connected before emitting
            if (!socket.connected) {
                socket.connect()
                socket.once("connect", () => socket.emit(SocketEvent.JOIN_REQUEST, user))
            } else {
                socket.emit(SocketEvent.JOIN_REQUEST, user)
            }
        }
    }, [
        currentUser.username,
        location.state?.username,
        navigate,
        roomId,
        setCurrentUser,
        socket,
    ])

    if (status === USER_STATUS.CONNECTION_FAILED) {
        return <ConnectionStatusPage />
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="w-full bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Code Sync — Room {roomId}</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Collaborate in real time</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{currentUser.username || 'You'}</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-6">
                <SplitterComponent>
                    <Sidebar />
                    <WorkSpace />
                </SplitterComponent>
            </main>
        </div>
    )
}

export default EditorPage
