import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { Campaign } from '../types';
import { CampaignCard } from './CampaignCard';
import { DonationModal } from './DonationModal';
import { CreateCampaignModal } from './CreateCampaignModal';

const CampaignList: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDonate = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
  };

  const handleCompleteDonation = async (amount: number, donorName: string, message: string) => {
    console.log('Processing donation:', { amount, donorName, message });

    try {
      const response = await fetch('http://192.168.3.7:5000/api/fundraiser/campaign/contribution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fundraiserId: selectedCampaignId,
          amount,
          donorName,
          message
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Donation successful:', result);
    } catch (error) {
      console.error('Error processing donation:', error);
      setError(error.message);
    }

    setSelectedCampaignId(null);
  };

  const handleCreateCampaign = async (campaignData: Omit<Campaign, '_id' | 'amount_raised' | 'createdAt'>) => {
    const newCampaign: Campaign = {
      ...campaignData,
      amount_raised: 0,
      createdAt: new Date()
    };

    console.log('Creating campaign:', newCampaign);

    try {
      const response = await fetch('http://192.168.3.7:5000/api/fundraiser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCampaign)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setCampaigns([...campaigns, result]);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.3.7:5000/api/fundraiser');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setCampaigns(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-emerald-600" />
              <h1 className="text-2xl font-bold text-gray-900">CrowdFund</h1>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Start a Campaign
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign._id}
              campaign={campaign}
              onDonate={handleDonate}
            />
          ))}
        </div>
      </main>

      {selectedCampaignId && (
        <DonationModal
          campaignId={selectedCampaignId}
          onClose={() => setSelectedCampaignId(null)}
          onDonate={handleCompleteDonation}
        />
      )}

      {showCreateModal && (
        <CreateCampaignModal
          onClose={() => setShowCreateModal(false)}
          onCreateCampaign={handleCreateCampaign}
        />
      )}
    </div>
  );
};

export default CampaignList;