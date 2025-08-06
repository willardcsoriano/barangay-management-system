import { Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {currentYear} Barangay XYZ. All rights reserved.
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>123 Rizal Ave, Marikina Heights</span>
            </div>
             <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>(02) 8123-4567</span>
            </div>
        </div>
      </div>
    </footer>
  );
}