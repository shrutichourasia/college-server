import { FileSystemItem } from "./file"

export interface ICopilotContext {
    setInput: (input: string) => void
    input: string
    output: string
    isRunning: boolean
    generateCode: (
        questionText?: string, 
        fileContext?: { activeFile: FileSystemItem | null, openFiles: FileSystemItem[] },
        onComplete?: (response: string) => void
    ) => Promise<void>
}
