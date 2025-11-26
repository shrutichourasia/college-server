import { useAppContext } from "@/context/AppContext"
import { useChatRoom } from "@/context/ChatContext"
import { SyntheticEvent, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"

function ChatList() {
    const {
        messages,
        isNewMessage,
        setIsNewMessage,
        lastScrollHeight,
        setLastScrollHeight,
    } = useChatRoom()
    const { currentUser } = useAppContext()
    const messagesContainerRef = useRef<HTMLDivElement | null>(null)

    const handleScroll = (e: SyntheticEvent) => {
        const container = e.target as HTMLDivElement
        setLastScrollHeight(container.scrollTop)
    }

    // Scroll to bottom when messages change
    useEffect(() => {
        if (!messagesContainerRef.current) return
        messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight
    }, [messages])

    useEffect(() => {
        if (isNewMessage) {
            setIsNewMessage(false)
        }
        if (messagesContainerRef.current)
            messagesContainerRef.current.scrollTop = lastScrollHeight
    }, [isNewMessage, setIsNewMessage, lastScrollHeight])

    return (
        <div
            className="flex-grow overflow-auto rounded-md bg-darkHover p-2"
            ref={messagesContainerRef}
            onScroll={handleScroll}
        >
            {/* Chat messages */}
            {messages.map((message, index) => {
                return (
                    <div
                        key={index}
                        className={
                            "mb-2 w-[80%] self-end break-words rounded-md bg-dark px-3 py-2" +
                            (message.username === currentUser.username
                                ? " ml-auto "
                                : "")
                        }
                    >
                        <div className="flex justify-between">
                            <span className="text-xs text-primary">
                                {message.username}
                            </span>
                            <span className="text-xs text-white">
                                {message.timestamp}
                            </span>
                        </div>
                        {message.username === "AI Assistant" ? (
                            <div className="py-1">
                                <ReactMarkdown
                                    components={{
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        code({ inline, className, children, ...props }: any) {
                                            const match = /language-(\w+)/.exec(className || "")
                                            const language = match ? match[1] : "javascript"

                                            return !inline ? (
                                                <SyntaxHighlighter
                                                    style={dracula}
                                                    language={language}
                                                    PreTag="div"
                                                    className="!m-0 !rounded-lg !bg-gray-900 !p-2 !text-xs"
                                                >
                                                    {String(children).replace(/\n$/, "")}
                                                </SyntaxHighlighter>
                                            ) : (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            )
                                        },
                                    }}
                                >
                                    {message.message}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <p className="py-1">{message.message}</p>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default ChatList
