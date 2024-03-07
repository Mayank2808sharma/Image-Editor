'use client'
import React from 'react';
import ImageEditor from './../components/imageEditor';
import withAuth from './../withAuth'

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold mb-8">Image Editor</h1>
      <div className="flex justify-center items-center bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-hidden">
          <ImageEditor />
        </div>
      </div>
    </div>
  );
}

export default withAuth(Home);