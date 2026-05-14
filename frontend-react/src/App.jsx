import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Lock, User, Terminal, ChevronRight, Activity, Search, X, Check, Power, BarChart3, Clock, PieChart, ShieldAlert, LayoutGrid } from 'lucide-react';
import { MagneticButton } from './components/ui/MagneticButton';
import { GlowingCard } from './components/ui/GlowingCard';

const API_BASE_URL = 'http://localhost:8080/api';
const MARKET_API_URL = 'http://localhost:8000/api';

const STOCKS = [
  // USA (Fortune 200)
  { value: "AAPL", label: "Apple Inc." }, { value: "MSFT", label: "Microsoft Corp." },
  { value: "GOOGL", label: "Alphabet Inc." }, { value: "AMZN", label: "Amazon.com" },
  { value: "NVDA", label: "NVIDIA Corp." }, { value: "META", label: "Meta Platforms" },
  { value: "TSLA", label: "Tesla Inc." }, { value: "BRK-B", label: "Berkshire Hathaway" },
  { value: "UNH", label: "UnitedHealth Group" }, { value: "LLY", label: "Eli Lilly and Co" },
  { value: "JPM", label: "JPMorgan Chase" }, { value: "V", label: "Visa Inc." },
  { value: "XOM", label: "Exxon Mobil" }, { value: "MA", label: "Mastercard Inc." },
  { value: "AVGO", label: "Broadcom Inc." }, { value: "HD", label: "Home Depot" },
  { value: "PG", label: "Procter & Gamble" }, { value: "COST", label: "Costco Wholesale" },
  { value: "JNJ", label: "Johnson & Johnson" }, { value: "ABBV", label: "AbbVie Inc." },
  { value: "MRK", label: "Merck & Co." }, { value: "CRM", label: "Salesforce Inc." },
  { value: "ADBE", label: "Adobe Inc." }, { value: "AMD", label: "AMD Inc." },
  { value: "CVX", label: "Chevron Corp." }, { value: "NFLX", label: "Netflix Inc." },
  { value: "PEP", label: "PepsiCo Inc." }, { value: "KO", label: "Coca-Cola Co." },
  { value: "TMO", label: "Thermo Fisher" }, { value: "WMT", label: "Walmart Inc." },
  { value: "MCD", label: "McDonald's Corp." }, { value: "DIS", label: "Walt Disney" },
  { value: "CSCO", label: "Cisco Systems" }, { value: "TMUS", label: "T-Mobile US" },
  { value: "ABT", label: "Abbott Labs" }, { value: "BAC", label: "Bank of America" },
  { value: "INTC", label: "Intel Corp." }, { value: "PFE", label: "Pfizer Inc." },
  { value: "QCOM", label: "Qualcomm Inc." }, { value: "ORCL", label: "Oracle Corp." },
  { value: "LIN", label: "Linde plc" }, { value: "VZ", label: "Verizon" },
  { value: "CMCSA", label: "Comcast" }, { value: "INTU", label: "Intuit Inc." },
  { value: "AMAT", label: "Applied Materials" }, { value: "TXN", label: "Texas Instruments" },
  { value: "BKNG", label: "Booking Holdings" }, { value: "UNP", label: "Union Pacific" },
  { value: "LOW", label: "Lowe's Companies" }, { value: "SBUX", label: "Starbucks" },
  // INDIA (Nifty 50)
  { value: "RELIANCE.NS", label: "Reliance Industries" }, { value: "TCS.NS", label: "Tata Consultancy Services" },
  { value: "HDFCBANK.NS", label: "HDFC Bank Ltd." }, { value: "BHARTIARTL.NS", label: "Bharti Airtel Ltd." },
  { value: "ICICIBANK.NS", label: "ICICI Bank Ltd." }, { value: "INFY.NS", label: "Infosys Limited" },
  { value: "SBIN.NS", label: "State Bank of India" }, { value: "LIC.NS", label: "LIC of India" },
  { value: "HUL.NS", label: "Hindustan Unilever" }, { value: "ITC.NS", label: "ITC Limited" },
  { value: "KOTAKBANK.NS", label: "Kotak Mahindra Bank" }, { value: "AXISBANK.NS", label: "Axis Bank Ltd." },
  { value: "LT.NS", label: "Larsen & Toubro Ltd." }, { value: "SUNPHARMA.NS", label: "Sun Pharma" },
  { value: "BAJFINANCE.NS", label: "Bajaj Finance" }, { value: "MARUTI.NS", label: "Maruti Suzuki" },
  { value: "TITAN.NS", label: "Titan Company" }, { value: "ADANIENT.NS", label: "Adani Enterprises" },
  { value: "ADANIPORTS.NS", label: "Adani Ports" }, { value: "TATAMOTORS.NS", label: "Tata Motors" },
  { value: "COALINDIA.NS", label: "Coal India" }, { value: "NTPC.NS", label: "NTPC Limited" },
  { value: "ULTRACEMCO.NS", label: "UltraTech Cement" }, { value: "ONGC.NS", label: "ONGC" },
  { value: "ASIANPAINT.NS", label: "Asian Paints" }, { value: "GRASIM.NS", label: "Grasim Industries" },
  { value: "JSWSTEEL.NS", label: "JSW Steel" }, { value: "NESTLEIND.NS", label: "Nestle India" },
  { value: "M&M.NS", label: "M&M Limited" }, { value: "INDUSINDBK.NS", label: "IndusInd Bank" },
  { value: "POWERGRID.NS", label: "Power Grid Corp." }, { value: "BPCL.NS", label: "BPCL" },
  { value: "HCLTECH.NS", label: "HCL Technologies" }, { value: "DRREDDY.NS", label: "Dr Reddy's Labs" },
  { value: "WIPRO.NS", label: "Wipro Limited" }, { value: "APOLLOHOSP.NS", label: "Apollo Hospitals" },
  { value: "SBILIFE.NS", label: "SBI Life Insurance" }, { value: "BAJAJ-AUTO.NS", label: "Bajaj Auto" },
  { value: "HEROMOTOCO.NS", label: "Hero MotoCorp" }, { value: "EICHERMOT.NS", label: "Eicher Motors" },
  { value: "BRITANNIA.NS", label: "Britannia Industries" }, { value: "TATACONSUM.NS", label: "Tata Consumer Products" },
  { value: "CIPLA.NS", label: "Cipla Limited" }, { value: "DIVISLAB.NS", label: "Divi's Laboratories" },
  { value: "HDFCLIFE.NS", label: "HDFC Life" }, { value: "SHRIRAMFIN.NS", label: "Shriram Finance" },
  { value: "TECHM.NS", label: "Tech Mahindra" }, { value: "BEL.NS", label: "Bharat Electronics" },
  { value: "HAL.NS", label: "Hindustan Aeronautics" }, { value: "TRENT.NS", label: "Trent Limited" }
];

function Auth() {
  const [activeTab, setActiveTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validatePassword = (pass) => {
    if (pass.length < 6) return "Password must be at least 6 characters";
    if (!/^[a-zA-Z0-9]+$/.test(pass)) return "Password must be alphanumeric only (no special characters)";
    return null;
  };

  const handleAction = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (activeTab === 'register') {
      const passError = validatePassword(password);
      if (passError) {
        setError(passError);
        return;
      }
      try {
        await axios.post(`${API_BASE_URL}/auth/register`, { username, password });
        setSuccess('Registration successful. Please initiate login sequence.');
        setActiveTab('login');
        setPassword('');
      } catch (err) {
        setError(err.response?.data?.message || 'Registration sequence failed.');
      }
    } else {
      try {
        const res = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
        localStorage.setItem('username', res.data.username);
        localStorage.setItem('lastLogin', new Date().toLocaleString());
        window.location.href = '/dashboard';
      } catch (err) {
        setError(err.response?.data?.message || 'Invalid operator credentials.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-fintech-base bg-mesh bg-cover text-white flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Volumetric Lighting & Floating Particles */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-fintech-cyan/5 rounded-full mix-blend-screen filter blur-[120px] animate-float pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] bg-fintech-purple/5 rounded-full mix-blend-screen filter blur-[120px] animate-float-slow pointer-events-none"></div>

      <GlowingCard className="p-10 md:p-14 w-full max-w-[500px] z-10 animate-zoom-in">
        {/* Subtle Top Inner Glow */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-fintech-cyan/30 to-transparent"></div>
        
        <div className="flex flex-col items-center mb-12 animate-fade-in-up">
          {/* Pure Typography Logo Area */}
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            Trading<span className="text-transparent bg-clip-text bg-gradient-to-br from-fintech-cyan to-fintech-blue">Pro</span>
          </h2>
          <div className="flex items-center space-x-2 mt-4 opacity-70">
            <Terminal className="w-4 h-4 text-fintech-cyan" />
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-fintech-cyan">Institutional Access</p>
          </div>
        </div>

        {/* Segmented Liquid Tabs */}
        <div className="relative flex bg-black/40 p-1.5 rounded-2xl mb-10 border border-white/5 shadow-inner animate-fade-in-up animate-delay-100">
            <div 
              className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-white/10 border border-white/10 rounded-xl transition-transform duration-500 ease-out shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              style={{ transform: activeTab === 'register' ? 'translateX(100%)' : 'translateX(0)' }}
            ></div>
            <button 
                onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }}
                className={`relative z-10 flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${activeTab === 'login' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
                Authorize
            </button>
            <button 
                onClick={() => { setActiveTab('register'); setError(''); setSuccess(''); }}
                className={`relative z-10 flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${activeTab === 'register' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
                Initialize
            </button>
        </div>

        {error && <div className="bg-fintech-red/10 border border-fintech-red/20 text-fintech-red px-4 py-3 rounded-xl mb-8 text-xs font-mono uppercase tracking-widest flex items-center shadow-inner animate-fade-in"><ShieldAlert className="w-4 h-4 mr-2 flex-shrink-0" />{error}</div>}
        {success && <div className="bg-fintech-green/10 border border-fintech-green/20 text-fintech-green px-4 py-3 rounded-xl mb-8 text-xs font-mono uppercase tracking-widest flex items-center shadow-inner animate-fade-in"><Check className="w-4 h-4 mr-2 flex-shrink-0" />{success}</div>}

        <form onSubmit={handleAction} className="space-y-6">
          <div className="space-y-2 animate-fade-in-up animate-delay-200 group relative">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] ml-2 group-focus-within:text-fintech-cyan transition-colors">Operator Identity</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-gray-500 group-focus-within:text-fintech-cyan transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Enter designation..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/50 text-white pl-12 pr-6 py-4 rounded-2xl focus:outline-none focus:bg-black/80 border border-white/5 focus:border-fintech-cyan/50 transition-all placeholder:text-gray-700 font-mono text-sm hover:border-white/10 shadow-inner"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2 animate-fade-in-up animate-delay-300 group relative">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] ml-2 group-focus-within:text-fintech-cyan transition-colors">Security Key</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-500 group-focus-within:text-fintech-cyan transition-colors" />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 text-white pl-12 pr-6 py-4 rounded-2xl focus:outline-none focus:bg-black/80 border border-white/5 focus:border-fintech-cyan/50 transition-all placeholder:text-gray-700 font-mono text-sm hover:border-white/10 shadow-inner"
                required
              />
            </div>
            {activeTab === 'register' && (
                <p className="text-[9px] text-gray-600 font-mono mt-2 px-2 uppercase tracking-widest">Protocol: Min 6 chars. Alphanumeric strict.</p>
            )}
          </div>

          <div className="pt-4 animate-fade-in-up animate-delay-400">
            <MagneticButton
              type="submit"
              className="w-full bg-gradient-to-r from-fintech-cyan to-fintech-blue hover:from-[#06b6d4] hover:to-[#2563eb] text-white py-5 rounded-2xl font-black text-sm shadow-[0_10px_30px_-10px_rgba(34,211,238,0.5)] tracking-[0.2em] uppercase overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center w-full">
                {activeTab === 'login' ? 'Establish Link' : 'Register Operator'}
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </MagneticButton>
          </div>
        </form>
      </GlowingCard>
    </div>
  );
}

function AssetSearchModal({ isOpen, onClose, currentTicker, onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  if (!isOpen) return null;

  const filteredStocks = STOCKS.filter(stock => 
    stock.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
    stock.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-fintech-base/80 backdrop-blur-2xl flex items-center justify-center z-[200] p-4 animate-fade-in">
      <GlowingCard className="w-full max-w-5xl max-h-[85vh] flex flex-col shadow-[0_0_100px_rgba(34,211,238,0.05)] animate-zoom-in border border-white/10 rounded-[2.5rem]">
        <div className="p-8 md:p-10 border-b border-white/5 bg-white/[0.02]">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter">Asset Discovery</h2>
                    <p className="text-xs text-fintech-cyan mt-2 uppercase tracking-[0.4em] font-mono opacity-80">Global Markets Intelligence</p>
                </div>
                <button onClick={onClose} className="p-4 hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/10 active:scale-90 bg-white/5 text-gray-400 hover:text-white">
                    <X className="w-6 h-6" />
                </button>
            </div>
            <div className="relative group">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                    <Search className="w-6 h-6 text-fintech-cyan opacity-50 group-focus-within:opacity-100 transition-opacity drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                </div>
                <input 
                    type="text" 
                    placeholder="Enter Stock Ticker or Company Name..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                    className="w-full bg-black/50 text-white pl-16 pr-10 py-5 rounded-[1.5rem] outline-none border border-white/10 focus:border-fintech-cyan/50 transition-all font-mono text-xl placeholder:text-gray-700 shadow-inner"
                />
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStocks.map((stock, idx) => (
              <div 
                key={stock.value}
                onClick={() => { onSelect(stock.value); onClose(); setSearchTerm(''); }}
                className={`p-6 rounded-[1.5rem] transition-all duration-300 cursor-pointer flex items-center space-x-4 border group/item hover:-translate-y-1 ${currentTicker === stock.value ? 'bg-gradient-to-br from-fintech-blue/20 to-fintech-cyan/20 border-fintech-cyan/50 shadow-[0_0_20px_rgba(34,211,238,0.2)]' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06] hover:border-white/10 hover:shadow-lg'}`}
                style={{ animationDelay: `${idx * 20}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-inner transition-colors ${currentTicker === stock.value ? 'bg-gradient-to-br from-fintech-blue to-fintech-cyan text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-black/50 text-fintech-cyan border border-white/5 group-hover/item:text-white'}`}>
                    {stock.value.substring(0, 2)}
                </div>
                <div className="flex-1 truncate">
                    <p className="text-lg font-bold text-white group-hover/item:text-fintech-cyan transition-colors truncate tracking-tight">{stock.label}</p>
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-1 group-hover/item:text-gray-400">{stock.value}</p>
                </div>
                {/* Mini Sparkline placeholder */}
                <div className="w-12 h-6 opacity-30 group-hover/item:opacity-100 transition-opacity">
                    <svg viewBox="0 0 50 20" className="w-full h-full stroke-fintech-cyan" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="0,15 10,10 20,18 30,5 40,12 50,2" />
                    </svg>
                </div>
              </div>
            ))}
          </div>
          {filteredStocks.length === 0 && (
              <div className="py-32 text-center animate-fade-in flex flex-col items-center">
                  <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
                      <Search className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-gray-500 font-bold text-2xl tracking-tighter opacity-50 uppercase">No Assets Found</p>
                  <p className="text-gray-600 font-mono text-[10px] mt-4 uppercase tracking-[0.3em]">Refine search parameters</p>
              </div>
          )}
        </div>
      </GlowingCard>
    </div>
  );
}

function TradeHistoryModal({ isOpen, onClose, orders }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-fintech-base/80 backdrop-blur-2xl flex items-center justify-center z-[200] p-4 animate-fade-in">
      <GlowingCard className="w-full max-w-6xl max-h-[85vh] flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 rounded-[2.5rem]">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-fintech-blue to-transparent"></div>
        <div className="p-8 md:p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter">Trade Execution Logs</h2>
            <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-[0.4em] font-mono opacity-80">Immutable Audit History</p>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-white/10 bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10 text-gray-400 hover:text-white active:scale-90">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr>
                  <th className="px-6 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Timestamp</th>
                  <th className="px-6 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Ticker</th>
                  <th className="px-6 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Action</th>
                  <th className="px-6 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Quantity</th>
                  <th className="px-6 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Settle Price</th>
                  <th className="px-6 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] text-right">Total Value</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-32 text-gray-700 font-bold text-xl tracking-tight opacity-50 uppercase">No Records Found.</td>
                  </tr>
                ) : (
                  orders.map((order, idx) => (
                    <tr key={idx} className="bg-white/[0.02] hover:bg-white/[0.06] transition-all group rounded-2xl" style={{ animationDelay: `${idx * 20}ms` }}>
                      <td className="px-6 py-5 rounded-l-2xl font-mono text-gray-400 text-sm">{order.timestamp ? new Date(order.timestamp).toLocaleString() : 'N/A'}</td>
                      <td className="px-6 py-5 font-bold text-white text-lg tracking-tighter">{order.ticker}</td>
                      <td className={`px-6 py-5 font-bold uppercase tracking-[0.2em] text-xs ${order.type === 'BUY' ? 'text-fintech-cyan' : 'text-fintech-red'}`}>
                        <span className={`px-3 py-1 rounded-md text-[10px] ${order.type === 'BUY' ? 'bg-fintech-cyan/10' : 'bg-fintech-red/10'}`}>{order.type}</span>
                      </td>
                      <td className="px-6 py-5 font-mono text-gray-400 text-sm">{order.quantity}</td>
                      <td className="px-6 py-5 font-mono text-white font-bold text-sm tracking-tighter">${order.price?.toFixed(2)}</td>
                      <td className="px-6 py-5 rounded-r-2xl font-bold text-gray-300 text-right font-mono text-base tracking-tight border-l border-transparent group-hover:border-white/5">${(order.price * order.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </GlowingCard>
    </div>
  );
}

function HoldingsModal({ isOpen, onClose, orders }) {
  if (!isOpen) return null;

  const holdingsMap = orders.reduce((acc, order) => {
    if (!acc[order.ticker]) acc[order.ticker] = { qty: 0, totalCost: 0 };
    if (order.type === 'BUY') {
        acc[order.ticker].qty += order.quantity;
        acc[order.ticker].totalCost += (order.quantity * order.price);
    } else {
        acc[order.ticker].qty -= order.quantity;
        // Simple average cost reduction for sells
        if (acc[order.ticker].qty > 0) {
           const avgCost = acc[order.ticker].totalCost / (acc[order.ticker].qty + order.quantity);
           acc[order.ticker].totalCost -= (order.quantity * avgCost);
        } else {
           acc[order.ticker].totalCost = 0;
        }
    }
    return acc;
  }, {});

  const holdingsList = Object.entries(holdingsMap)
    .filter(([_, data]) => data.qty > 0)
    .map(([ticker, data]) => ({ 
        ticker, 
        quantity: data.qty,
        avgPrice: data.qty > 0 ? data.totalCost / data.qty : 0,
        totalValue: data.totalCost
    }));

  return (
    <div className="fixed inset-0 bg-fintech-base/80 backdrop-blur-2xl flex items-center justify-center z-[200] p-4 animate-fade-in">
      <GlowingCard className="w-full max-w-5xl max-h-[80vh] flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/10 rounded-[2.5rem]">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-fintech-green to-transparent"></div>
        <div className="p-8 md:p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter">Current Holdings</h2>
            <p className="text-[10px] text-fintech-green mt-2 uppercase tracking-[0.4em] font-mono opacity-80">Real-time Inventory & Performance</p>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-white/10 bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10 text-gray-400 hover:text-white active:scale-90">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 md:p-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {holdingsList.length === 0 ? (
            <div className="py-32 text-center text-gray-700 font-bold text-2xl tracking-tight opacity-50 uppercase animate-fade-in-up">No Active Positions.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {holdingsList.map((holding, idx) => (
                <div key={holding.ticker} className="bg-white/[0.02] p-6 rounded-[1.5rem] border border-white/5 flex justify-between items-center hover:bg-white/[0.06] transition-all hover:border-white/10 group animate-slide-in-right hover:-translate-y-1 hover:shadow-lg" style={{ animationDelay: `${idx * 50}ms` }}>
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center font-black text-gray-400 border border-white/5 group-hover:text-white transition-colors drop-shadow-sm text-lg">{holding.ticker.substring(0, 2)}</div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-1">Asset Ticker</p>
                        <p className="text-2xl font-black text-white tracking-tighter group-hover:text-fintech-cyan transition-colors">{holding.ticker}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-8 text-right">
                    <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-1">Net Units</p>
                        <p className="text-xl font-black text-fintech-cyan tracking-tighter font-mono">{holding.quantity}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-1">Avg Price</p>
                        <p className="text-xl font-black text-white tracking-tighter font-mono">${holding.avgPrice.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </GlowingCard>
    </div>
  );
}

function ConfirmationModal({ isOpen, onConfirm, onCancel, data }) {
  if (!isOpen) return null;
  const { type, quantity, ticker, price } = data;
  const totalValue = (quantity * price).toLocaleString(undefined, { minimumFractionDigits: 2 });
  const isBuy = type === 'BUY';

  return (
    <div className="fixed inset-0 bg-fintech-base/90 backdrop-blur-2xl flex items-center justify-center z-[300] p-4 animate-fade-in">
      <GlowingCard className="w-full max-w-md p-10 shadow-2xl overflow-hidden animate-zoom-in border border-white/10 rounded-[2.5rem]">
        <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent ${isBuy ? 'via-fintech-cyan' : 'via-fintech-red'} to-transparent`}></div>
        
        {/* Animated Background Glow inside Modal */}
        <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full mix-blend-screen filter blur-[60px] opacity-20 ${isBuy ? 'bg-fintech-cyan' : 'bg-fintech-red'}`}></div>

        <div className="text-center space-y-8 relative z-10">
          <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg ${isBuy ? 'bg-fintech-cyan/10 border border-fintech-cyan/20 text-fintech-cyan' : 'bg-fintech-red/10 border border-fintech-red/20 text-fintech-red'}`}>
            <Activity className="w-8 h-8 drop-shadow-[0_0_10px_currentColor]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase mb-2">Execute Order?</h2>
            <p className="text-[10px] text-gray-400 font-mono uppercase tracking-[0.3em]">Awaiting Operator Confirmation</p>
          </div>
          <div className="bg-black/50 p-6 rounded-2xl border border-white/5 space-y-4 shadow-inner">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Operation Type</span>
              <span className={`text-[10px] px-3 py-1 rounded-md font-black uppercase tracking-widest ${isBuy ? 'bg-fintech-cyan/10 text-fintech-cyan' : 'bg-fintech-red/10 text-fintech-red'}`}>{type}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Asset Ticker</span>
              <span className="text-base font-bold text-white">{ticker}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Intensity</span>
              <span className="text-base font-bold text-white font-mono">{quantity} Units</span>
            </div>
            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Est. Impact</span>
              <span className="text-xl font-black text-white font-mono tracking-tighter">${totalValue}</span>
            </div>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={onCancel}
              className="flex-1 py-4 rounded-xl border border-white/10 text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 hover:text-white transition-all active:scale-95"
            >
              Abort
            </button>
            <MagneticButton 
              onClick={onConfirm}
              className={`flex-1 py-4 rounded-xl text-white font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 ${isBuy ? 'bg-gradient-to-r from-fintech-blue to-fintech-cyan hover:from-blue-500 hover:to-cyan-400 shadow-[0_10px_20px_rgba(34,211,238,0.3)]' : 'bg-gradient-to-r from-fintech-red to-red-500 hover:from-red-500 hover:to-red-400 shadow-[0_10px_20px_rgba(239,68,68,0.3)]'}`}
            >
              Commit
            </MagneticButton>
          </div>
        </div>
      </GlowingCard>
    </div>
  );
}

function Dashboard() {
  const [ticker, setTicker] = useState('AAPL');
  const [data, setData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [holdings, setHoldings] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [period, setPeriod] = useState('1d');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHoldingsOpen, setIsHoldingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState({ isOpen: false, type: '', quantity: 0, ticker: '', price: 0 });
  const [loading, setLoading] = useState(true);
  
  const [username] = useState(localStorage.getItem('username') || 'Operator');
  const [lastLogin] = useState(localStorage.getItem('lastLogin') || new Date().toLocaleString());

  const dataPointsRef = useRef([]);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/portfolio`, { params: { username } });
      setPortfolioValue(response.data.balance || 0);
      setOrderCount(response.data.orderCount || 0);
      
      const ordersRes = await axios.get(`${API_BASE_URL}/orders`, { params: { username } });
      const allOrders = ordersRes.data;
      const tickerHoldings = allOrders.reduce((acc, order) => {
        if (order.ticker === ticker) {
          return order.type === 'BUY' ? acc + order.quantity : acc - order.quantity;
        }
        return acc;
      }, 0);
      setHoldings(tickerHoldings);
    } catch (err) { console.error('Error fetching portfolio:', err); }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`, { params: { username } });
      setOrders(response.data.reverse());
    } catch (err) { console.error('Error fetching orders:', err); }
  };

  const updateMarketData = async () => {
    try {
      const response = await axios.get(`${MARKET_API_URL}/predict/price/${ticker}`);
      if (response.data && response.data.price) {
        const price = response.data.price;
        setCurrentPrice(price);
        
        if (period === '1d') {
            const newPoint = {
                name: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                price: price
            };
            dataPointsRef.current = [...dataPointsRef.current, newPoint].slice(-100);
            setData([...dataPointsRef.current]);
        }
      }
    } catch (err) { console.error('Error updating market data:', err); }
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const p = period === '1m' ? '1mo' : period;
      const response = await axios.get(`${MARKET_API_URL}/predict/history/${ticker}?period=${p}`);
      if (response.data && response.data.history) {
        const historyData = response.data.history.map(point => ({
          name: (period === '1d' || period === '5d') 
              ? new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : new Date(point.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
          price: point.price
        }));
        dataPointsRef.current = historyData;
        setData(historyData);
        if (historyData.length > 0) {
          setCurrentPrice(historyData[historyData.length - 1].price);
        }
      }
    } catch (err) { console.error('Error fetching history:', err); }
    setLoading(false);
  };

  const handleTrade = (type) => {
    if (quantity <= 0) {
        alert("Execution failed: Quantity must be greater than zero.");
        return;
    }
    setConfirmationData({ isOpen: true, type, quantity: parseInt(quantity), ticker, price: currentPrice });
  };

  const executeTrade = async () => {
    const { type, quantity, ticker, price } = confirmationData;
    setConfirmationData({ ...confirmationData, isOpen: false });
    
    try {
      await axios.post(`${API_BASE_URL}/orders`, {
        ticker: ticker,
        quantity: parseInt(quantity),
        price: price,
        type: type,
        username: username
      });
      fetchPortfolio();
      fetchOrders();
    } catch (err) { 
        const serverMessage = err.response?.data?.message || 'Execution failed';
        alert(`Critical Error: ${type} order failed at execution layer. ${serverMessage}`); 
    }
  };

  useEffect(() => {
    fetchPortfolio();
    fetchOrders();
    fetchHistory();
    const interval = setInterval(() => {
      if (period === '1d') updateMarketData();
      fetchPortfolio();
    }, 3000);
    return () => clearInterval(interval);
  }, [ticker, period, username]);

  return (
    <div className="min-h-screen bg-fintech-base bg-mesh text-slate-100 font-sans relative overflow-x-hidden">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-grid opacity-20"></div>
          <div className="absolute top-0 left-1/4 w-[50rem] h-[50rem] bg-fintech-blue/5 rounded-full mix-blend-screen filter blur-[150px] animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-[50rem] h-[50rem] bg-fintech-cyan/5 rounded-full mix-blend-screen filter blur-[150px] animate-float-slow"></div>
      </div>

      {/* Floating Glass Header */}
      <header className="fixed top-6 left-6 right-6 z-[60] animate-fade-in-up">
        <div className="glass-floating rounded-[2rem] px-8 py-5 flex justify-between items-center w-full max-w-[2000px] mx-auto border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] bg-fintech-navydark/50 backdrop-blur-3xl">
          <div className="flex flex-col">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-black tracking-tighter text-white drop-shadow-md flex items-center">
                Trading<span className="text-transparent bg-clip-text bg-gradient-to-br from-fintech-cyan to-fintech-blue">Pro</span>
              </h1>
              <div className="h-6 w-[1px] bg-white/20"></div>
              <span className="flex items-center space-x-2 text-fintech-cyan bg-fintech-cyan/10 text-[10px] font-black px-3 py-1 rounded-full border border-fintech-cyan/20 tracking-[0.2em] uppercase">
                <Activity className="w-3 h-3 animate-pulse-slow" />
                <span>Live Intel</span>
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-8">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mb-1 opacity-80">Connected Operator</p>
              <p className="text-white font-black text-xl tracking-tighter uppercase flex items-center justify-end">
                <User className="w-5 h-5 mr-2 text-gray-500" />
                {username}
              </p>
            </div>
            <button
              onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
              className="group p-4 bg-white/[0.02] hover:bg-fintech-red/10 overflow-hidden rounded-2xl border border-white/10 hover:border-fintech-red/50 transition-all active:scale-95 text-gray-400 hover:text-fintech-red flex items-center shadow-inner"
            >
              <Power className="w-5 h-5 group-hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] transition-all" />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-40 pb-12 px-6 md:px-12 grid grid-cols-1 xl:grid-cols-3 gap-8 md:gap-12 max-w-[2000px] mx-auto relative z-10">
        <section className="xl:col-span-2">
          <GlowingCard className="p-8 md:p-12 h-full flex flex-col group relative overflow-hidden animate-fade-in-up animate-delay-100 border border-white/10">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-fintech-blue to-transparent opacity-50"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-6">
                  <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter flex items-center">
                    <BarChart3 className="w-8 h-8 mr-4 text-fintech-cyan" />
                    Market Pulse
                  </h2>
                </div>
                <div className="flex items-center space-x-6">
                  <span className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-fintech-cyan to-fintech-blue tracking-tighter drop-shadow-md font-mono transition-all duration-300">
                      {currentPrice > 0 ? `$${currentPrice.toFixed(2)}` : 'FETCHING...'}
                  </span>
                  <div className="px-6 py-2 bg-black/50 border border-white/5 rounded-xl shadow-inner flex items-center">
                      <span className="text-gray-400 text-xl font-bold uppercase tracking-[0.3em] font-mono">{ticker}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end gap-6 w-full md:w-auto">
                <div className="flex bg-black/50 p-1.5 rounded-2xl border border-white/5 shadow-inner">
                  {['1D', '5D', '1M', '1Y'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p.toLowerCase())}
                      className={`px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-300 ${period === p.toLowerCase() ? 'bg-gradient-to-r from-fintech-cyan to-fintech-blue text-white shadow-[0_5px_15px_rgba(34,211,238,0.3)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                
                <div className="relative group/select w-full md:w-[350px]">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mb-2 md:text-right">Global Asset Discovery</p>
                  <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="bg-black/50 text-white px-8 py-5 rounded-2xl border border-white/10 transition-all cursor-pointer w-full text-2xl hover:border-fintech-cyan/50 shadow-inner flex justify-between items-center group/btn active:scale-[0.98]"
                  >
                    <span className="truncate font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover/btn:from-fintech-cyan group-hover/btn:to-fintech-blue transition-all">
                      {STOCKS.find(s => s.value === ticker)?.label || "Discover Assets"}
                    </span>
                    <Search className="w-6 h-6 text-fintech-cyan opacity-50 group-hover/btn:opacity-100 group-hover/btn:scale-110 transition-all drop-shadow-md" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="h-[400px] md:h-[500px] w-full mt-auto relative bg-black/20 rounded-[2rem] p-4 border border-white/5 shadow-inner">
              {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-fintech-navydark/50 backdrop-blur-md z-10 rounded-[2rem]">
                      <p className="text-fintech-cyan font-mono text-sm uppercase tracking-[0.4em] animate-pulse flex items-center">
                        <Activity className="w-4 h-4 mr-2" />
                        Fetching Stream
                      </p>
                  </div>
              )}
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.4} />
                      <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.1} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                  <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickMargin={15} axisLine={false} tickLine={false} fontWeight="700" />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip
                    cursor={{ stroke: '#22d3ee', strokeWidth: 1, strokeDasharray: '4 4' }}
                    contentStyle={{ backgroundColor: '#000000e6', border: '1px solid #ffffff1a', borderRadius: '16px', boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8)', padding: '20px', backdropFilter: 'blur(20px)' }}
                    itemStyle={{ color: '#22d3ee', fontWeight: '900', fontSize: '24px', letterSpacing: '-0.05em', fontFamily: 'monospace' }}
                    labelStyle={{ color: '#6b7280', marginBottom: '8px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.2em' }}
                    formatter={(value) => [value ? `$${value.toFixed(2)}` : '$0.00', 'PRICE']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#22d3ee" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                    animationDuration={1500}
                    animationEasing="ease-out"
                    activeDot={{ r: 6, fill: '#000', stroke: '#22d3ee', strokeWidth: 3, className: 'drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlowingCard>
        </section>

        <section>
          <GlowingCard className="p-8 md:p-10 h-full flex flex-col justify-between relative overflow-hidden animate-fade-in-up animate-delay-200 border border-white/10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-fintech-blue/10 to-fintech-cyan/10 rounded-full -mr-32 -mt-32 blur-[80px]"></div>
            
            <div className="relative z-10 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
                <h2 className="text-xl font-bold text-white tracking-widest uppercase opacity-90 flex items-center">
                  <Terminal className="w-5 h-5 mr-3 text-fintech-cyan" />
                  Terminal
                </h2>
              </div>

              <div className="space-y-4 mb-10">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">Cash Balance</p>
                <div className="text-4xl md:text-5xl font-black text-white tracking-tighter font-mono flex items-center group">
                  <span className="text-2xl mr-2 text-fintech-green opacity-80 group-hover:opacity-100 transition-opacity">$</span>
                  {portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="space-y-6 flex-1">
                  {/* Inventory Card */}
                  <div className="bg-black/40 rounded-[2rem] p-6 md:p-8 border border-white/5 shadow-inner hover:bg-black/60 transition-all group">
                      <div className="flex justify-between items-end mb-6">
                          <div>
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-2 flex items-center">
                                <PieChart className="w-3 h-3 mr-2" /> Position
                              </p>
                              <p className="text-3xl font-black text-white tracking-tighter font-mono">{holdings} <span className="text-fintech-cyan text-xs font-bold uppercase tracking-[0.2em] opacity-90">{ticker}</span></p>
                          </div>
                          <div className="flex flex-col space-y-2">
                              <button
                                  onClick={() => setIsHoldingsOpen(true)}
                                  className="bg-fintech-blue/10 hover:bg-fintech-blue/20 text-fintech-blue hover:text-white px-4 py-2.5 rounded-xl transition-all font-bold text-[10px] uppercase tracking-[0.2em] border border-fintech-blue/20 active:scale-95 flex items-center justify-center"
                              >
                                  <PieChart className="w-3 h-3 mr-2" /> Holdings
                              </button>
                              <button
                                  onClick={() => setIsHistoryOpen(true)}
                                  className="bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white px-4 py-2.5 rounded-xl transition-all font-bold text-[10px] uppercase tracking-[0.2em] border border-white/5 active:scale-95 flex items-center justify-center"
                              >
                                  <Clock className="w-3 h-3 mr-2" /> Audit
                              </button>
                          </div>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-fintech-blue to-fintech-cyan shadow-[0_0_15px_#22d3ee] transition-all duration-1000 ease-out" style={{ width: `${Math.min((holdings / 100) * 100, 100)}%` }}></div>
                      </div>
                  </div>

                  {/* Order Entry Card */}
                  <div className="bg-black/40 rounded-[2rem] p-6 md:p-8 border border-white/5 shadow-inner space-y-6">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] flex items-center">
                        <LayoutGrid className="w-3 h-3 mr-2" /> Execution Payload
                      </p>
                      <div className="flex items-center justify-between bg-black/40 p-2 rounded-2xl border border-white/5">
                          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center font-black text-xl hover:bg-white/10 transition-all active:scale-90 text-gray-400 hover:text-white">-</button>
                          <div className="flex flex-col items-center">
                              <input 
                                  type="number" 
                                  value={quantity} 
                                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                                  className="w-20 bg-transparent text-center text-4xl font-black focus:outline-none tracking-tighter text-white font-mono"
                              />
                              <span className="text-[9px] font-bold text-fintech-cyan uppercase tracking-[0.3em] mt-1">Units</span>
                          </div>
                          <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center font-black text-xl hover:bg-white/10 transition-all active:scale-90 text-gray-400 hover:text-white">+</button>
                      </div>
                  </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-4 relative z-10">
                <MagneticButton
                  onClick={() => handleTrade('BUY')}
                  className="w-full bg-gradient-to-r from-fintech-cyan to-fintech-blue hover:from-[#06b6d4] hover:to-[#2563eb] text-white py-5 rounded-2xl font-black text-sm tracking-[0.2em] shadow-[0_10px_30px_-10px_rgba(34,211,238,0.4)] uppercase overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center w-full">
                    Buy / Long
                    <ChevronRight className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </span>
                </MagneticButton>
                <MagneticButton
                  onClick={() => handleTrade('SELL')}
                  className="w-full bg-fintech-red/10 hover:bg-fintech-red/20 text-fintech-red border border-fintech-red/20 py-5 rounded-2xl font-black text-sm tracking-[0.2em] uppercase group overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center w-full">
                    Sell / Short
                    <ChevronRight className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </span>
                </MagneticButton>
              </div>
            </div>
          </GlowingCard>
        </section>
      </main>

      <AssetSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        currentTicker={ticker} 
        onSelect={setTicker} 
      />
      <TradeHistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} orders={orders} />
      <HoldingsModal isOpen={isHoldingsOpen} onClose={() => setIsHoldingsOpen(false)} orders={orders} />
      <ConfirmationModal 
        isOpen={confirmationData.isOpen} 
        onConfirm={executeTrade} 
        onCancel={() => setConfirmationData({ ...confirmationData, isOpen: false })} 
        data={confirmationData} 
      />
    </div>
  );
}

function App() {
  const path = window.location.pathname;
  if (path === '/login' || path === '/') {
    return <Auth />;
  }
  return <Dashboard />;
}

export default App;
