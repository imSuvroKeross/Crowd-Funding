import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';
import heroImage from '../assets/istockphoto-1168369576-1024x1024.jpg';
import { CreateCampaignModal } from './CreateCampaignModal';
import { CampaignCard } from './CampaignCard';
import { DonationModal } from './DonationModal'; // Import the DonationModal
import { Campaign } from '../types';

const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false); // State for donation modal
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null); // Track selected campaign for donation
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch campaigns on component mount
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('http://192.168.3.7:5000/api/fundraiser');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCampaigns(data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        setError(error.message);
      }
    };

    fetchCampaigns();
  }, [campaigns]);

  // Handle creating a new campaign
  const handleCreateCampaign = async (campaignData: Omit<Campaign, '_id' | 'amount_raised' | 'createdAt'>) => {
    const newCampaign: Campaign = {
      ...campaignData,
      amount_raised: 0,
      createdAt: new Date(),
    };

    console.log('Creating campaign:', newCampaign);

    try {
      const response = await fetch('http://192.168.3.7:5000/api/fundraiser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCampaign),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Network response was not ok: ${errorData}`);
      }

      const result = await response.json();
      console.log('Campaign created successfully:', result);
      setCampaigns([...campaigns, result]);
    } catch (error) {
      console.error('Error creating campaign:', error);
      setError(error.message);
    }
  };

  // Handle opening the donation modal
  const handleDonate = (campaignId: string) => {
    setSelectedCampaignId(campaignId); // Set the selected campaign ID
    setIsDonationModalOpen(true); // Open the donation modal
  };

  // Handle submitting a donation
  const handleCompleteDonation = async (amount: number, donorName: string, message: string) => {
    // In a real app, this would make an API call to process the donation
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

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div>
          <h1>Fund Your Dreams</h1>
          <p>Join thousands of creators and backers on FundFlow, the world's leading crowdfunding platform.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="cta"
          >
            Start a Campaign
          </button>
        </div>
        <img src={heroImage} alt="Hero" className="hero-image" />
      </section>

      {/* Featured Campaigns Section */}
      <section className="section featured-campaigns">
        <h2>Featured Campaigns</h2>
        <p>Check out some of the amazing projects currently on FundFlow.</p>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign._id}
                campaign={campaign}
                onDonate={handleDonate} // Pass the handleDonate function
              />
            ))}
          </div>
        </div>
      </section>

      {/* Render the CreateCampaignModal conditionally */}
      {isModalOpen && (
        <CreateCampaignModal
          onClose={() => setIsModalOpen(false)}
          onCreateCampaign={handleCreateCampaign}
        />
      )}

      {/* Render the DonationModal conditionally */}
      {isDonationModalOpen && (
        <DonationModal
          campaignId={selectedCampaignId!}
          onClose={() => setIsDonationModalOpen(false)}
          onDonate={handleCompleteDonation} // Pass the handleDonationSubmit function
        />
      )}

      {/* Testimonials Section */}
      <section className="section testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial">
          <p>"FundFlow helped me turn my dream into reality. The platform is easy to use, and the community is incredibly supportive."</p>
          <p className="author">- Jane Doe, Creator</p>
        </div>
        <div className="testimonial">
          <p>"I love supporting innovative projects on FundFlow. It's amazing to see so many creative ideas come to life."</p>
          <p className="author">- John Smith, Backer</p>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>&copy; 2023 FundFlow. All rights reserved. | <Link to="/privacy">Privacy Policy</Link> | <Link to="/terms">Terms of Service</Link></p>
      </footer>
    </div>
  );
};

export default Home;