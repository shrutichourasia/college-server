import { ICopilotContext } from "@/types/copilot"
import { createContext, ReactNode, useContext, useState } from "react"
import toast from "react-hot-toast"
import axiosInstance from "../api/pollinationsApi"
import { FileSystemItem } from "@/types/file"

const CopilotContext = createContext<ICopilotContext | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export const useCopilot = () => {
    const context = useContext(CopilotContext)
    if (context === null) {
        throw new Error(
            "useCopilot must be used within a CopilotContextProvider",
        )
    }
    return context
}

const CopilotContextProvider = ({ children }: { children: ReactNode }) => {
    const [input, setInput] = useState<string>("")
    const [output, setOutput] = useState<string>("")
    const [isRunning, setIsRunning] = useState<boolean>(false)

    const generateCode = async (
        questionText?: string, 
        fileContext?: { activeFile: FileSystemItem | null, openFiles: FileSystemItem[] },
        onComplete?: (response: string) => void
    ) => {
        try {
            const prompt = questionText || input
            if (prompt.length === 0) {
                toast.error("Please write a prompt")
                return
            }

            toast.loading("Generating code...")
            setIsRunning(true)
            
            // Build context message with current files
            let contextMessage = prompt
            if (fileContext) {
                const { activeFile, openFiles } = fileContext
                
                // Add active file context if available
                if (activeFile && activeFile.content) {
                    const fileExtension = activeFile.name.split('.').pop() || ''
                    contextMessage = `Current active file: ${activeFile.name}\n\n` +
                        `File content:\n\`\`\`${fileExtension}\n${activeFile.content}\n\`\`\`\n\n` +
                        `User question: ${prompt}`
                }
                
                // Add other open files context if there are multiple files
                if (openFiles.length > 1) {
                    const otherFiles = openFiles.filter(f => f.id !== activeFile?.id)
                    if (otherFiles.length > 0) {
                        contextMessage += `\n\nOther open files:\n`
                        otherFiles.forEach(file => {
                            if (file.content) {
                                const fileExtension = file.name.split('.').pop() || ''
                                contextMessage += `\nFile: ${file.name}\n\`\`\`${fileExtension}\n${file.content}\n\`\`\`\n`
                            }
                        })
                    }
                }
            }
            
            const response = await axiosInstance.post("/", {
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a helpful AI assistant for Code Sync, a real-time collaborative code editor. " +
                            "You have access to the current files in the editor. " +
                            "When analyzing code, look for errors, bugs, typos, syntax issues, logical problems, and potential improvements. " +
                            "Provide clear, actionable suggestions to fix any issues you find. " +
                            "If the user asks about errors, carefully examine the code and provide specific fixes. " +
                            "Format code blocks using Markdown with appropriate language syntax (e.g., ```js for JavaScript, ```py for Python). " +
                            "Be conversational, helpful, and precise in your analysis.",
                    },
                    {
                        role: "user",
                        content: contextMessage,
                    },
                ],
                model: "mistral",
                private: true,
            })
            
            if (response.data) {
                toast.success("Response generated successfully")
                const aiResponse = response.data
                if (aiResponse) {
                    setOutput(aiResponse)
                    if (onComplete) {
                        onComplete(aiResponse)
                    }
                }
            }
            setIsRunning(false)
            toast.dismiss()
        } catch (error) {
            console.error(error)
            setIsRunning(false)
            toast.dismiss()
            toast.error("Failed to generate the response")
            if (onComplete) {
                onComplete("Sorry, I encountered an error while processing your request. Please try again.")
            }
        }
    }

    return (
        <CopilotContext.Provider
            value={{
                setInput,
                input,
                output,
                isRunning,
                generateCode,
            }}
        >
            {children}
        </CopilotContext.Provider>
    )
}

export { CopilotContextProvider }
export default CopilotContext
