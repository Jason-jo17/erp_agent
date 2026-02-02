import React from 'react';
import { Construction, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlaceholderProps {
    title: string;
    description?: string;
}

export const PlaceholderPage: React.FC<PlaceholderProps> = ({ title, description }) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-6 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <Construction className="w-10 h-10 text-blue-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-500 max-w-md mb-8">
                {description || "This module is currently under development. Please check back later for updates."}
            </p>
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Go Back
            </button>
        </div>
    );
};
