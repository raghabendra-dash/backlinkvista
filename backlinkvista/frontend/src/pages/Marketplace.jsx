import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Info,
  Heart,
  Ban,
  Eye,
  ShoppingCart,
  AlertCircle,
  Globe,
  Star,
  TrendingUp,
  CheckCircle,
  DollarSign
} from 'lucide-react';

const mockWebsites = [
  {
    id: 1,
    domain: "Business Insider",
    price: 500,
    tat: "1-2 Weeks",
    sponsored: "Press Release",
    link_type: "No-follow",
    sample_url: "https://markets.businessinsider.com/news/stocks/pastel-network-announces-the-listing-of-psl-on-the-bitcoin-com-exchange-1030141761"
  },
  {
    id: 2,
    domain: "Yahoo News",
    price: 650,
    tat: "1-2 Weeks",
    sponsored: "Press Release",
    link_type: "No-follow",
    sample_url: "https://finance.yahoo.com/news/insta-insta-fame-instaswift-become-022500411.html?guccounter=1"
  },
  {
    id: 3,
    domain: "IB Times USA",
    price: 5500,
    tat: "1-2 Weeks",
    sponsored: "Yes",
    link_type: "No-follow",
    sample_url: "https://www.ibtimes.com/boost-testosterone-more-natural-foundation-supplements-science-backed-dietary-capsules-enhanced-3744423"
  },
  {
    id: 4,
    domain: "Digital Journal",
    price: 20,
    tat: "1-2 Weeks",
    sponsored: "No",
    link_type: "No-follow",
    sample_url: "https://www.digitaljournal.com/tech-science/your-data-your-rules-how-cyqur-is-revolutionising-password-management-and-data-security/article#ixzz8cVcjDLvk"
  },
  {
    id: 5,
    domain: "Forbes",
    price: 9500,
    tat: "3-5 weeks",
    sponsored: "No",
    link_type: "No-follow",
    sample_url: "https://www.forbes.com/sites/trevorclawson/2023/04/22/from-watches-to-avatars-building-a-web3-company-from-the-ground-up/"
  },
  {
    id: 6,
    domain: "Tech Crunch",
    price: 19000,
    tat: "3-5 weeks",
    sponsored: "No",
    link_type: "No-follow",
    sample_url: "https://techcrunch.com/2024/05/08/lucid-bots-secures-9m-for-drones-to-clean-more-than-your-windows/"
  }
];


const Marketplace = () => {
  const [showFilters, setShowFilters] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSort, setSelectedSort] = useState('relevance');
  const [priceRange, setPriceRange] = useState([0, 600]);
  const [domainRatingRange, setDomainRatingRange] = useState([0, 100]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [websites, setWebsites] = useState(mockWebsites);
  const [filteredWebsites, setFilteredWebsites] = useState(mockWebsites);
  const [wishlist, setWishlist] = useState([]);
  const [blocklist, setBlocklist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [cart, setCart] = useState([]);

  const categories = useMemo(() => [
    { name: 'Technology', count: websites.filter(w => w.category === 'Technology').length },
    { name: 'Business', count: websites.filter(w => w.category === 'Business').length },
  ], [websites]);

  const countries = useMemo(() => [
    { name: 'United States', code: 'US' },
    { name: 'United Kingdom', code: 'UK' },
    { name: 'India', code: 'IN' },
  ], []);

  const toggleWishlist = useCallback((websiteId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.includes(websiteId)
        ? prevWishlist.filter((id) => id !== websiteId)
        : [...prevWishlist, websiteId]
    );
  }, []);

  const toggleBlocklist = useCallback((websiteId) => {
    setBlocklist((prevBlocklist) =>
      prevBlocklist.includes(websiteId)
        ? prevBlocklist.filter((id) => id !== websiteId)
        : [...prevBlocklist, websiteId]
    );
  }, []);

  const toggleCompare = useCallback((websiteId) => {
    setCompareList((prevCompareList) =>
      prevCompareList.includes(websiteId)
        ? prevCompareList.filter((id) => id !== websiteId)
        : prevCompareList.length < 3
        ? [...prevCompareList, websiteId]
        : prevCompareList
    );
  }, []);

  const addToCart = useCallback((websiteId) => {
    setCart((prevCart) =>
      prevCart.includes(websiteId) ? prevCart : [...prevCart, websiteId]
    );
  }, []);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      let filtered = [...websites];

      if (searchTerm) {
        filtered = filtered.filter((website) =>
          website.domain.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredWebsites(filtered);
      setLoading(false);
    }, 300);
  }, [searchTerm, websites]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Filter className="h-5 w-5 text-gray-500" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search websites by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : filteredWebsites.length === 0 ? (
          <div className="text-center text-gray-600">No websites found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWebsites.map((website) => (
              <motion.div
                key={website.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-lg shadow"
              >
                <h3 className="text-lg font-semibold">{website.domain}</h3>
                <p className="text-gray-600">{website.description}</p>
                <p className="text-gray-500">Price: ${website.price}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;