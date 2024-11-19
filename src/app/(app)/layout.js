import Navbar from "@/components/layout/navbar";


export default function Layout ({children, modal}) {
    
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
                    <Navbar />
                </footer>
            </div>
            {modal}
        </div>
    )
}