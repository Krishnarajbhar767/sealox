import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './features/home/Home';
import { About } from './features/about/About';
import { Contact } from './features/contact/Contact';
import { ProductDetail } from './features/products/ProductDetail';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { ProductEditor } from './features/admin/ProductEditor';
import './App.css';

const PublicLayout = () => (
  <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
    <Navbar />
    <main className="grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Dedicated React Admin Panel Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products/new" element={<ProductEditor />} />
        <Route path="/admin/products/:lookup/edit" element={<ProductEditor />} />

        {/* Public Storefront Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<ProductDetail />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
