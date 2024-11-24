import React from 'react';
import { Twitter, Github, MessageSquare} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1C2631] border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Main Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">CryptoBets</h3>
            <p className="text-gray-400 text-sm">
              The premier platform for crypto prediction markets and meme coin battles.
            </p>
            <div className="flex space-x-4">
              <button className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <MessageSquare className="h-5 w-5" />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Markets */}
          <div>
            <h4 className="text-white font-semibold mb-4">Markets</h4>
            <ul className="space-y-2">
              <li>
                <button className="text-gray-400 hover:text-white transition-colors">
                  Trending
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-white transition-colors">
                  Popular
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-white transition-colors">
                  Recently Added
                </button>
              </li>
              <li>
                <button className="text-gray-400 hover:text-white transition-colors">
                  Watchlist
                </button>
              </li>
            </ul>
          </div>

          {/* Stats */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform Stats</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <span className="flex justify-between">
                  Total Volume
                  <span className="text-white">$1.2M</span>
                </span>
              </li>
              <li>
                <span className="flex justify-between">
                  Active Markets
                  <span className="text-white">142</span>
                </span>
              </li>
              <li>
                <span className="flex justify-between">
                  Active Users
                  <span className="text-white">2.4K</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2024 CryptoBets. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </button>
            <button className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </button>
            <button className="text-gray-400 hover:text-white text-sm transition-colors">
              Cookie Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}