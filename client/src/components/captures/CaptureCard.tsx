import { Link } from 'wouter';
import { WebsiteWithDetails } from '@shared/schema';
import TagBadge from '../tags/TagBadge';
import CaptureStatusBadge from './CaptureStatusBadge';

interface CaptureCardProps {
  website: WebsiteWithDetails;
}

export default function CaptureCard({ website }: CaptureCardProps) {
  // Generate a random placeholder color for the screenshot
  const getPlaceholderColor = () => {
    const colors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-yellow-100', 'bg-red-100', 'bg-indigo-100'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className={`relative h-48 overflow-hidden ${getPlaceholderColor()}`}>
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <svg className="h-16 w-16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow">
          <button type="button" className="text-gray-500 hover:text-gray-700">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{website.name}</h3>
            <p className="text-sm text-gray-500">{website.domain}</p>
          </div>
          {website.latestCapture && (
            <CaptureStatusBadge status={website.latestCapture.status} />
          )}
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1.5">
          {website.tags && website.tags.map((tag) => (
            <TagBadge key={tag.id} name={tag.name} color={tag.color} />
          ))}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex space-x-3">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span className="ml-1 text-sm text-gray-500">{website.pageCount || 0} pages</span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              <span className="ml-1 text-sm text-gray-500">{website.captureCount || 0} captures</span>
            </div>
          </div>
          <Link href={`/websites/${website.id}`}>
            <button
              type="button"
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
