

export default function Layout ({children}) {
    
    return (
        <div className="flex justify-center">
            <div className="h-screen max-w-sm flex flex-col gap-3 w-full px-6">
                <header className="pt-3">
                    <h1 className="font-bold">
                        Next Tracker
                    </h1>
                </header>
                <main className="flex-grow">
                    {children}
                </main>
                <footer className="pb-3">
                    <p>
                        footer
                    </p>
                </footer>
            </div>
        </div>
    )
}