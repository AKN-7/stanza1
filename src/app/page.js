import DailyPrompt from './DailyPrompt'; // Adjust the path if necessary
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white">
      <div className="flex flex-col items-center mt-8 p-4 md:p-8 lg:p-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 text-center">Welcome to StanZa</h1>
        <DailyPrompt />
        <div className="mt-4">
          <Link href="/poems" className="text-black underline">
            View Submitted Poems
          </Link>
        </div>
      </div>
      <h3 className = "items-baseline text-black mt-32 justify-normal">diesel dawg | all rights reserved</h3>
    </div>
    
  );
}
