import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

interface Ad {
  _id: string;
  company: string;
  content: string;
  imageUrl?: string;
}

const Advertisements: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transactions/advertisements', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch advertisements');
      const data = await response.json();
      setAds(data);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
    }
  };

  const handleAdClick = async (adId: string) => {
    try {
      await fetch(`http://localhost:5000/api/transactions/ad-click/${adId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
    } catch (error) {
      console.error('Error recording ad click:', error);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Sponsored Content</h3>
      <div className="space-y-4">
        {ads.map((ad) => (
          <div key={ad._id} className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-semibold">{ad.company}</h4>
            <p className="text-sm mt-1">{ad.content}</p>
            {ad.imageUrl && (
              <img src={ad.imageUrl} alt={ad.company} className="mt-2 rounded-md max-w-full h-auto" />
            )}
            <button
              onClick={() => handleAdClick(ad._id)}
              className="mt-2 text-blue-500 hover:text-blue-700 flex items-center"
            >
              Learn More <ExternalLink size={16} className="ml-1" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Advertisements;