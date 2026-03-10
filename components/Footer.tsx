export default function Footer() {
    return (
        <footer className="mt-auto border-t border-slate-800 bg-slate-900">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <p>© {new Date().getFullYear()} ÖmerVision. Tüm Hakları Saklıdır.</p>
                    <div className="flex gap-6 mt-4 md:mt-0 font-medium tracking-wide">
                        <a href="#" className="hover:text-blue-400 transition-colors">Twitter</a>
                        <a href="#" className="hover:text-blue-400 transition-colors">GitHub</a>
                        <a href="#" className="hover:text-blue-400 transition-colors">LinkedIn</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
