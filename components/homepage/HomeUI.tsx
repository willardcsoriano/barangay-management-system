// components/homepage/HomeUI.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BarangaySelector } from './BarangaySelector';

// Define the type for the barangay data
type Barangay = { id: string; name: string; };

interface HomeUIProps {
  barangays: Barangay[];
}

export default function HomeUI({ barangays }: HomeUIProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <motion.section
        className="flex flex-col items-center justify-center flex-1 bg-gradient-to-br from-blue-50 to-white text-center px-4 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 max-w-3xl">
          Welcome to <span className="text-blue-600">XYZ Barangay Management System</span>
        </h1>
        <p className="mt-4 text-lg text-gray-700 max-w-2xl">
          Your one-stop digital hub for community updates, services, and announcements.
        </p>

        <motion.div
          className="mt-8 p-8 bg-white rounded-2xl shadow-lg w-full max-w-lg"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-4 text-gray-800 font-medium">
            Select your barangay to get started:
          </p>
          <BarangaySelector barangays={barangays} />
        </motion.div>
      </motion.section>
    </div>
  );
}
