import illustration from "@/assets/illustration.svg"
import FormComponent from "@/components/forms/FormComponent"

function HomePage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
            <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 md:p-12 grid grid-cols-1 gap-8 lg:gap-12 lg:grid-cols-2 items-start">
                <div className="flex flex-col items-start gap-4 justify-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">Code Sync</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Real-time collaborative code editor. Create a room, invite others, and code together.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300 list-disc list-inside">
                        <li>Live collaboration with sockets</li>
                        <li>File tree, editor tabs, and execution</li>
                        <li>Built-in chat and presence</li>
                    </ul>
                    <img src={illustration} alt="illustration" className="mt-6 w-48 opacity-90" />
                </div>

                <div className="flex items-start justify-center w-full">
                    <div className="w-full max-w-md">
                        <div className="mb-6 text-center">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Join or Create a Room</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Enter a room id and your username, or generate a new room id to get started.</p>
                        </div>
                        <FormComponent />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage
