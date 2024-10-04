import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#ff914d] flex flex-col font-agrandir">
      <header className="p-4">
        <nav className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex justify-between w-full">
            <Link href="/" className="text-black font-bold px-4">
              HOME
            </Link>
            <Link href="/icalroster" className="text-black font-bold px-4">
              ICALROSTER
            </Link>
            <Link href="/somethingelse" className="text-black font-bold px-4">
              SOMETHINGELSE
            </Link>
            <Link href="/somethingelse" className="text-black font-bold px-4">
              SOMETHINGELSE
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-6xl w-full mx-auto bg-[#ff914d] overflow-hidden border border-black">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 p-8">
              <Image
                src="/DriversMateLogo.png"
                alt="DriversMateMate Logo"
                width={400}
                height={100}
                className="w-full mb-4"
              />
              <p className="text-2xl mb-4 text-black font-normal">
                Spiel about being a modern drivers mate blah blah blah, trains n that, lovely jubbly
              </p>
            </div>
            <div className="md:w-1/2">
              <Image
                src="/Homepageimage.png"
                alt="Train on tracks through forest"
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}