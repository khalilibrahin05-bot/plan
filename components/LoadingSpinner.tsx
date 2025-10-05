
import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-20" role="status" aria-label="Loading content">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary">
        <span className="sr-only">Loading...</span>
    </div>
  </div>
);

export default LoadingSpinner;