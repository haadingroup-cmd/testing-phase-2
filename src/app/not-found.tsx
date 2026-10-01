import Link from 'next/link'
export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#020205] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-black gradient-text mb-4">404</div>
        <h1 className="text-3xl font-black text-white mb-4">Page Not Found</h1>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary">🏠 Go Home</Link>
          <Link href="/contact" className="btn-ghost">Contact Us →</Link>
        </div>
      </div>
    </div>
  )
}
