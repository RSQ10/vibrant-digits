import { ReactNode } from 'react';
import { AnnouncementBar } from './AnnouncementBar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <AnnouncementBar />
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);
