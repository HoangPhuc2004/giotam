import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdminDashboardComponent from '../components/AdminDashboard';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'admin' && user.role !== 'hospital') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || (user.role !== 'admin' && user.role !== 'hospital')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FBF2E1] flex flex-col" style={{ fontFamily: 'Times New Roman, serif' }}>
      <Header />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AdminDashboardComponent userRole={user.role} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
