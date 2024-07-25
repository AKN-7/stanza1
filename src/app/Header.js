"use client";

import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'StanZa',
        text: 'Check out this amazing poetry website!',
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing:', error));
    } else {
      alert('Sharing is not supported on this browser. Please copy the link manually.');
    }
  };

  return (
    <div className="flex justify-between items-center p-3 bg-white">
      <div>
        <Link href="/" legacyBehavior>
          <a>
            <Image
              src="/images/stanza.png"
              alt="StanZa"
              width={870}
              height={213}
              className="w-56 scale-50 cursor-pointer"
            />
          </a>
        </Link>
      </div>
      <div className="flex space-x-4">
        <a href="https://www.instagram.com/ameen_nmi/" target="_blank" rel="noopener noreferrer">
          <button className="border border-black rounded-lg px-4 py-2 text-gray-900">Contact Us</button>
        </a>
        <button onClick={handleShare} className="border border-black rounded-lg px-4 py-2 text-gray-900">
          Share
        </button>
      </div>
    </div>
  );
}
