import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/ui/Navbar';
import { Footer } from './components/ui/Footer';

const Home         = lazy(() => import('./pages/Home'));
const Explore      = lazy(() => import('./pages/Explore'));
const HeritageDetail = lazy(() => import('./pages/HeritageDetail'));
const SeeThePast   = lazy(() => import('./pages/SeeThePast'));
const ARExperience = lazy(() => import('./pages/ARExperience'));
const Scan         = lazy(() => import('./pages/Scan'));
const Chat         = lazy(() => import('./pages/Chat'));
const MapPage      = lazy(() => import('./pages/MapPage'));
const Learn        = lazy(() => import('./pages/Learn'));
const Community    = lazy(() => import('./pages/Community'));
const Profile      = lazy(() => import('./pages/Profile'));
const Admin        = lazy(() => import('./pages/Admin'));
const Auth         = lazy(() => import('./pages/Auth'));
const About        = lazy(() => import('./pages/About'));

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-yellow-500/30 border-t-yellow-500 animate-spin" />
        <p className="text-stone-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-stone-950">
        <Navbar />
        <main>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/"                         element={<Home />} />
              <Route path="/explore"                  element={<Explore />} />
              <Route path="/heritage/:slug"           element={<HeritageDetail />} />
              <Route path="/see-the-past/:slug"       element={<SeeThePast />} />
              <Route path="/ar"                       element={<ARExperience />} />
              <Route path="/scan"                     element={<Scan />} />
              <Route path="/chat"                     element={<Chat />} />
              <Route path="/map"                      element={<MapPage />} />
              <Route path="/learn"                    element={<Learn />} />
              <Route path="/community"                element={<Community />} />
              <Route path="/profile"                  element={<Profile />} />
              <Route path="/admin"                    element={<Admin />} />
              <Route path="/auth"                     element={<Auth />} />
              <Route path="/about"                    element={<About />} />
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center text-center px-4">
                  <div>
                    <div className="text-6xl mb-4">🏛️</div>
                    <h1 className="font-serif text-3xl text-stone-200 mb-2">Page Not Found</h1>
                    <p className="text-stone-500 mb-6">This page doesn't exist in our heritage records.</p>
                    <a href="/" className="btn-gold">Return Home</a>
                  </div>
                </div>
              } />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#f5f5f4',
              border: '1px solid #2a2a2a',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#f59e0b', secondary: '#0d0d0d' } },
          }}
        />
      </div>
    </BrowserRouter>
  );
}
