//C:\Users\Willard\barangay-management-system\components\homepage\BarangaySelector.tsx

'use client';

import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

// Define the type for the barangay data we expect
type Barangay = {
  id: string;
  name: string;
};

export function BarangaySelector({ barangays }: { barangays: Barangay[] }) {
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState('');

  // This function runs when a user selects a barangay from the dropdown
  const handleSelectionChange = (barangayId: string) => {
    setSelectedValue(barangayId);
  };
  
  // This function runs when the user clicks the "Proceed" button
  const handleProceed = () => {
    if (selectedValue) {
      // Navigate to the login page, passing the selected barangay's ID in the URL
      router.push(`/auth/login?barangay_id=${selectedValue}`);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-sm items-center justify-center gap-2">
      <Select onValueChange={handleSelectionChange} value={selectedValue}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Select your barangay..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Available Barangays</SelectLabel>
            {barangays.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button onClick={handleProceed} disabled={!selectedValue} className="shrink-0">
        Proceed
      </Button>
    </div>
  );
}