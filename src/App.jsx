import React, { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  getCurrentUser,
  isAuthorizedAdmin,
  getServices, 
  getPackages, 
  getOffers, 
  getGallery, 
  getBeforeAfter, 
  getReviews, 
  getSettings, 
  getScheduleSettings, 
  getExperience,
  getBookings,
  logoutUser
} from './firebase/db';
import { auth, isLiveFirebaseConfigured } from './firebase/config';

// Intro
import ParlourDoorIntro from './components/intro/ParlourDoorIntro';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingWhatsApp from './components/layout/FloatingWhatsApp';
import CustomCursor from './components/layout/CustomCursor';

// Customer Sections
import HeroSection from './components/home/HeroSection';
import AboutSection from './components/home/AboutSection';
import ServicesSection from './components/home/ServicesSection';
import PackagesSection from './components/home/PackagesSection';
import OffersSection from './components/home/OffersSection';
import GallerySection from './components/home/GallerySection';
import ReviewsSection from './components/home/ReviewsSection';
import WhyChooseUsSection from './components/home/WhyChooseUsSection';
import ContactSection from './components/home/ContactSection';

// Booking & Tracking Modals
import BookingModal from './components/booking/BookingModal';
import TrackBookingModal from './components/booking/TrackBookingModal';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminBookings from './components/admin/AdminBookings';
import AdminServices from './components/admin/AdminServices';
import AdminPackages from './components/admin/AdminPackages';
import AdminOffers from './components/admin/AdminOffers';
import AdminGallery from './components/admin/AdminGallery';
import AdminCustomers from './components/admin/AdminCustomers';
import AdminSettings from './components/admin/AdminSettings';
import AdminSchedule from './components/admin/AdminSchedule';
import AdminExperience from './components/admin/AdminExperience';
import UserAuth from './components/auth/UserAuth';

export default function App() {
  // App routing and view state
  const [isAdminView, setIsAdminView] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [adminTab, setAdminTab] = useState('dashboard');

  // 3D Door Intro state
  const [forceDoorIntro, setForceDoorIntro] = useState(false);
  const [hasSeenDoorIntro, setHasSeenDoorIntro] = useState(
    () => sessionStorage.getItem('lelixir_door_intro_seen') === 'true'
  );

  // Booking Modal state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [preselectedBookingItem, setPreselectedBookingItem] = useState(null);
  const [preselectedCoupon, setPreselectedCoupon] = useState(null);

  // Track Reservation Modal
  const [trackBookingModalOpen, setTrackBookingModalOpen] = useState(false);

  // Dynamic Data Store
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [offers, setOffers] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [beforeAfter, setBeforeAfter] = useState([]);
  const [experience, setExperience] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [settings, setSettings] = useState(null);
  const [scheduleSettings, setScheduleSettings] = useState(null);
  const [bookings, setBookings] = useState([]);

  // Fetch all initial or updated data
  const loadAllData = useCallback(async () => {
    try {
      const [
        srvs,
        pkgs,
        offs,
        gals,
        ba,
        exp,
        revs,
        sett,
        sched,
        bks
      ] = await Promise.all([
        getServices(),
        getPackages(),
        getOffers(),
        getGallery(),
        getBeforeAfter(),
        getExperience(),
        getReviews(),
        getSettings(),
        getScheduleSettings(),
        getBookings()
      ]);

      setServices(srvs);
      setPackages(pkgs);
      setOffers(offs);
      setGallery(gals);
      setBeforeAfter(ba);
      setExperience(exp);
      setReviews(revs);
      setSettings(sett);
      setScheduleSettings(sched);
      setBookings(bks);
    } catch (err) {
      console.error('Error loading parlour data:', err);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  useEffect(() => {
    if (!isLiveFirebaseConfigured) return undefined;

    return onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      try {
        if (await isAuthorizedAdmin(user)) {
          setCurrentUser({
            id: user.uid,
            name: user.displayName || user.email,
            email: user.email,
            isAdmin: true
          });
          setIsAdminLoggedIn(true);
          setIsAdminView(true);
        }
      } catch (error) {
        console.error('Failed to verify administrator access:', error);
      }
    });
  }, []);

  // Open booking modal helpers
  const handleOpenBooking = (item = null, type = 'service') => {
    if (item) {
      setPreselectedBookingItem({ type, item });
    } else {
      setPreselectedBookingItem(null);
    }
    setBookingModalOpen(true);
  };

  const handleSelectServiceForBooking = (service) => {
    handleOpenBooking(service, 'service');
  };

  const handleSelectPackageForBooking = (pkg) => {
    handleOpenBooking(pkg, 'package');
  };

  const handleSelectOfferForBooking = (offer) => {
    setPreselectedCoupon(offer);
    handleOpenBooking(null, 'service');
  };

  const handleReplayDoors = () => {
    sessionStorage.removeItem('lelixir_door_intro_seen');
    setHasSeenDoorIntro(false);
    setForceDoorIntro(true);
  };

  const handleUserAuthenticated = (user) => {
    setCurrentUser(user);
    if (user.isAdmin) {
      setIsAdminLoggedIn(true);
      setIsAdminView(true);
      return;
    }
    setForceDoorIntro(true);
  };

  const handleUserLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Failed to sign out:', error);
    } finally {
      setCurrentUser(null);
      setIsAdminLoggedIn(false);
      setIsAdminView(false);
    }
  };

  const handleAdminLogout = async () => {
    await handleUserLogout();
  };

  // Pending bookings count for badge
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const showDoorIntro = !isAdminView && currentUser && !currentUser.isAdmin &&
    (forceDoorIntro || !hasSeenDoorIntro);

  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-espresso-900 font-sans selection:bg-gold/30 selection:text-espresso-900">
      
      {/* Luxury Custom Trailing Cursor on Desktop */}
      <CustomCursor />

      {/* SPECIAL FEATURE: CINEMATIC 3D PARLOUR DOOR INTRO ANIMATION */}
      {showDoorIntro && (
        <ParlourDoorIntro
          forceShow={forceDoorIntro}
          onComplete={() => {
            setForceDoorIntro(false);
            setHasSeenDoorIntro(true);
          }}
        />
      )}

      {/* =========================================================================
          ADMIN DASHBOARD EXPERIENCE
          ========================================================================= */}
      {isAdminView && isAdminLoggedIn ? (
          <AdminLayout
            currentTab={adminTab}
            onSelectTab={setAdminTab}
            onLogout={handleAdminLogout}
            onBackToSite={() => setIsAdminView(false)}
            pendingCount={pendingCount}
            parlourName={settings?.parlourName || 'GLAMMORA'}
          >
            {adminTab === 'dashboard' && (
              <AdminDashboard
                bookings={bookings}
                services={services}
                packages={packages}
                offers={offers}
                experience={experience}
                parlourName={settings?.parlourName || 'GLAMMORA'}
                onSelectTab={setAdminTab}
                onRefreshData={loadAllData}
              />
            )}

            {adminTab === 'bookings' && (
              <AdminBookings
                bookings={bookings}
                onRefresh={loadAllData}
              />
            )}

            {adminTab === 'services' && (
              <AdminServices
                services={services}
                onRefresh={loadAllData}
              />
            )}

            {adminTab === 'packages' && (
              <AdminPackages
                packages={packages}
                onRefresh={loadAllData}
              />
            )}

            {adminTab === 'offers' && (
              <AdminOffers
                offers={offers}
                onRefresh={loadAllData}
              />
            )}

            {adminTab === 'gallery' && (
              <AdminGallery
                gallery={gallery}
                onRefresh={loadAllData}
              />
            )}

            {adminTab === 'experience' && (
              <AdminExperience
                experience={experience}
                onRefresh={loadAllData}
              />
            )}

            {adminTab === 'customers' && (
              <AdminCustomers
                bookings={bookings}
              />
            )}

            {adminTab === 'settings' && (
              <AdminSettings
                settings={settings}
                onRefresh={loadAllData}
              />
            )}

            {adminTab === 'schedule' && (
              <AdminSchedule
                scheduleSettings={scheduleSettings}
                onRefresh={loadAllData}
              />
            )}
          </AdminLayout>
      ) : (
        !currentUser ? (
          <UserAuth
            settings={settings}
            onAuthenticated={handleUserAuthenticated}
          />
        ) : (
        /* =========================================================================
            CUSTOMER SANCTUARY EXPERIENCE
            ========================================================================= */
        <>
          {/* Header & Sticky Navigation */}
          <Navbar 
            settings={settings}
            currentUser={currentUser}
            onLogoutUser={handleUserLogout}
            onOpenBooking={() => handleOpenBooking()}
            onOpenTrackBooking={() => setTrackBookingModalOpen(true)}
            onReplayDoors={handleReplayDoors}
          />

          {/* Section A: Animated Hero Section */}
          <HeroSection 
            settings={settings}
            onOpenBooking={() => handleOpenBooking()}
          />

          {/* Section B: About the Parlour & Philosophy */}
          <AboutSection 
            settings={settings}
            onOpenBooking={() => handleOpenBooking()}
          />

          {/* Section C: Dynamic Services Catalogue */}
          <ServicesSection 
            services={services}
            onSelectServiceForBooking={handleSelectServiceForBooking}
          />

          {/* Section D: Exclusive Packages */}
          <PackagesSection 
            packages={packages}
            onSelectPackageForBooking={handleSelectPackageForBooking}
          />

          {/* Section E: Special Offers & Countdown Timers */}
          <OffersSection 
            offers={offers}
            onSelectOfferForBooking={handleSelectOfferForBooking}
          />

          {/* Section F: Gallery & Before-and-After Slider */}
          <GallerySection 
            gallery={gallery}
            beforeAfter={beforeAfter}
          />

          {/* Section G: Customer Reviews Carousel */}
          <ReviewsSection 
            reviews={reviews}
          />

          {/* Section H: Why Choose Us */}
          <WhyChooseUsSection experience={experience} />

          {/* Section I: Contact Section & Google Maps */}
          <ContactSection 
            settings={settings}
            onOpenBooking={() => handleOpenBooking()}
          />

          {/* Section J: Luxury Footer */}
          <Footer 
            settings={settings}
            onOpenBooking={() => handleOpenBooking()}
          />

          {/* Floating WhatsApp Concierge Button */}
          <FloatingWhatsApp 
            phone={settings?.whatsapp || settings?.phone}
            parlourName={settings?.parlourName}
          />

          {/* Appointment Booking Wizard Modal */}
          <BookingModal 
            isOpen={bookingModalOpen}
            onClose={() => {
              setBookingModalOpen(false);
              setPreselectedBookingItem(null);
              setPreselectedCoupon(null);
              loadAllData(); // Refresh bookings in case a new booking was created
            }}
            preselectedItem={preselectedBookingItem}
            preselectedCoupon={preselectedCoupon}
            settings={settings}
          />

          {/* Track Reservation Modal */}
          <TrackBookingModal 
            isOpen={trackBookingModalOpen}
            onClose={() => setTrackBookingModalOpen(false)}
            settings={settings}
          />
        </>
        )
      )}

    </div>
  );
}
