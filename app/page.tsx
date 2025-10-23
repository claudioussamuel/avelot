import Header from '@/components/Header';
import LotteryHero from '@/components/LotteryHero';
import LotteryInterface from '@/components/LotteryInterface';
import HowItWorks from '@/components/HowItWorks';
import UserDashboard from '@/components/UserDashboard';
import WinnerHistory from '@/components/WinnerHistory';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      
      <main className="pt-16">
        {/* Lottery Hero Section */}
        <section id="lottery" className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <LotteryHero />
          </div>
        </section>

        {/* Aave Lottery Interface */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <LotteryInterface />
          </div>
        </section>

        {/* User Dashboard */}
        <UserDashboard />

        {/* How It Works */}
        <HowItWorks />

        {/* Winner History */}
        <WinnerHistory />
      </main>

      <Footer />
    </div>
  );
}
