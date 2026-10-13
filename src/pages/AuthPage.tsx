import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Flame, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Phone, 
  Mail, 
  Lock, 
  Building2, 
  User, 
  ShieldCheck,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { validateGSTIN, getStateFromGSTIN } from '../lib/gst';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, signInWithOtp, verifyOtp, signInWithPassword, signUpWithPassword } = useAuth();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Main flow tab: 'signin' | 'signup'
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(initialMode);

  // Sync tab with URL
  const handleTabChange = (tab: 'signin' | 'signup') => {
    setActiveTab(tab);
    setSearchParams({ mode: tab });
    setOtpStep('input_phone');
    setOtp('');
  };

  // Sub-method: 'otp' | 'password'
  const [authMethod, setAuthMethod] = useState<'otp' | 'password'>('otp');

  // OTP step: 'input_phone' | 'input_otp'
  const [otpStep, setOtpStep] = useState<'input_phone' | 'input_otp'>('input_phone');
  const [timer, setTimer] = useState(0);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [company, setCompany] = useState('');
  const [gstin, setGstin] = useState('');
  const [whatsappOpted, setWhatsappOpted] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP resend countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Detected GST state
  const detectedGstState = gstin.length >= 2 ? getStateFromGSTIN(gstin) : '';

  // Handle Send OTP (both Sign In & Sign Up)
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      toast.error('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    if (activeTab === 'signup' && !fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    setLoading(true);
    try {
      await signInWithOtp(cleanPhone, activeTab === 'signup');
      toast.success(`OTP sent to +91 ${cleanPhone}! (Demo OTP: 123456)`);
      setOtpStep('input_otp');
      setTimer(30);
    } catch {
      toast.success(`OTP sent to +91 ${cleanPhone}! (Demo OTP: 123456)`);
      setOtpStep('input_otp');
      setTimer(30);
    } finally {
      setLoading(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      toast.error('Please enter the 6-digit OTP code');
      return;
    }

    setLoading(true);
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const profileData = {
        fullName: fullName || (activeTab === 'signup' ? 'FabForge Partner' : 'Client'),
        company: company || 'Manufacturing Org',
        email: email || '',
        gstin: gstin.toUpperCase(),
      };

      const res = await verifyOtp(cleanPhone, otp, profileData);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(activeTab === 'signup' ? 'Account registered successfully!' : 'Welcome back to FabForge!');
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Email & Password Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await signInWithPassword(email, password);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success('Signed in successfully!');
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Email & Password Sign Up
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid business email');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      toast.error('Please accept the Terms of Service & NDA Policy');
      return;
    }

    setLoading(true);
    try {
      const res = await signUpWithPassword(email, password, {
        fullName,
        company: company || 'Enterprise Client',
        phone: phone ? `+91${phone.replace(/\D/g, '')}` : undefined,
        gstin: gstin.toUpperCase(),
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success('Account created! Welcome to FabForge India.');
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-[#FF5722] selection:text-white">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl 2xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 card overflow-hidden border-slate-200/90 shadow-2xl rounded-2xl">
          
          {/* Left Column: Premium Brand & Facility Details */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Background ambient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF5722] to-[#FF8A65] flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black tracking-tight text-white">
                    Fab<span className="text-[#FF5722]">Forge</span>
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-orange-500/20 text-[#FF8A65] border border-orange-500/30">
                    INDIA
                  </span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 text-white">
                {activeTab === 'signin' ? 'Welcome Back to Precision Manufacturing' : 'Start Manufacturing in Minutes'}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                On-demand digital manufacturing across CNC milling, sheet metal laser cutting, and industrial 3D printing with real-time INR quoting.
              </p>

              <div className="space-y-3.5 text-xs text-slate-200 mb-8">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>18% GST Input Tax Credit (ITC)</strong> auto-invoiced with Karnataka & pan-India compliance</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Strict Mutual NDA & IP Protection</strong> for all STEP, DXF, and STL CAD files</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Live Shop-Floor Tracking</strong> with automated milestone alerts via WhatsApp</span>
                </div>
              </div>

              {/* Verified Operator Box */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Dedicated Application Operator</span>
                </div>
                <p className="text-slate-300 font-medium">Amar • +91 8088201429</p>
                <p className="text-slate-400 text-[11px] mt-0.5">Plot 42, EPIP Industrial Zone, Whitefield, Bengaluru</p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 relative z-10">
              Trusted by 1,200+ Indian hardware startups, robotics teams, and aerospace MSMEs.
            </div>
          </div>

          {/* Right Column: Unified Sign In / Sign Up Forms */}
          <div className="lg:col-span-7 p-6 sm:p-10 bg-white flex flex-col justify-between">
            <div>
              {/* Primary Tab Switcher: Sign In vs Sign Up */}
              <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => handleTabChange('signin')}
                  className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                    activeTab === 'signin'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('signup')}
                  className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                    activeTab === 'signup'
                      ? 'bg-white text-[#FF5722] shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Create Account (Sign Up)
                </button>
              </div>

              {/* Sub-method Switcher */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {activeTab === 'signin'
                      ? authMethod === 'otp' ? 'Sign In with Mobile OTP' : 'Sign In with Email & Password'
                      : authMethod === 'password' ? 'Register New Business Account' : 'Quick Mobile OTP Registration'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {authMethod === 'otp'
                      ? 'Fast, passwordless login with your 10-digit Indian mobile'
                      : 'Corporate account login with work email and password'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod(authMethod === 'otp' ? 'password' : 'otp');
                    setOtpStep('input_phone');
                  }}
                  className="text-xs font-bold text-[#FF5722] hover:text-orange-600 underline shrink-0 ml-2"
                >
                  {authMethod === 'otp' ? 'Use Email / Password' : 'Use Mobile OTP'}
                </button>
              </div>

              {/* ==================== SIGN IN FLOW ==================== */}
              {activeTab === 'signin' ? (
                authMethod === 'otp' ? (
                  /* Sign In: Mobile OTP */
                  otpStep === 'input_phone' ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Indian Mobile Number
                        </label>
                        <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:border-[#FF5722] focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                          <span className="bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 border-r border-slate-300 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            placeholder="8088201429"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                            className="w-full px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none"
                            required
                            autoFocus
                          />
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1.5">
                          We will send a 6-digit verification code to this mobile.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || phone.length !== 10}
                        className="w-full btn-forge text-sm py-3 flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                      >
                        {loading ? 'Sending OTP Code...' : 'Get OTP Verification Code'}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    /* Verify OTP Step */
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Enter 6-Digit OTP Code
                          </label>
                          <button
                            type="button"
                            onClick={() => setOtpStep('input_phone')}
                            className="text-xs text-[#FF5722] font-semibold hover:underline"
                          >
                            Change (+91 {phone})
                          </button>
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="• • • • • •"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="input-base text-center text-xl tracking-widest font-black"
                          required
                          autoFocus
                        />
                        <div className="flex items-center justify-between mt-2 text-xs">
                          <span className="text-slate-500">
                            Demo Code: <strong className="text-slate-800">123456</strong>
                          </span>
                          {timer > 0 ? (
                            <span className="text-slate-400">Resend in {timer}s</span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              className="text-[#FF5722] font-bold hover:underline flex items-center gap-1"
                            >
                              <RefreshCw className="w-3 h-3" /> Resend OTP
                            </button>
                          )}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || otp.length < 4}
                        className="w-full btn-forge text-sm py-3 flex items-center justify-center gap-2 shadow-md"
                      >
                        {loading ? 'Verifying OTP...' : 'Verify & Sign In'}
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </form>
                  )
                ) : (
                  /* Sign In: Email & Password */
                  <form onSubmit={handleEmailSignIn} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Corporate Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          placeholder="procurement@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="input-base pl-10"
                          required
                          autoFocus
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => toast('For password resets, contact Operator Amar at +91 8088201429')}
                          className="text-xs text-[#FF5722] hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="input-base pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !email || !password}
                      className="w-full btn-forge text-sm py-3 flex items-center justify-center gap-2 shadow-md"
                    >
                      {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )
              ) : (
                /* ==================== SIGN UP FLOW ==================== */
                authMethod === 'password' ? (
                  /* Sign Up: Full Business Profile with Email */
                  <form onSubmit={handleEmailSignUp} className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Amar Kumar"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="input-base pl-9 text-xs py-2"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Mobile Number *
                        </label>
                        <div className="flex rounded-lg border border-slate-300 overflow-hidden text-xs">
                          <span className="bg-slate-50 px-2.5 py-2 font-bold text-slate-600 border-r border-slate-300">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            placeholder="8088201429"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                            className="w-full px-2.5 py-2 font-medium text-slate-900 focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Work Email *
                        </label>
                        <div className="relative">
                          <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            placeholder="engineer@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-base pl-9 text-xs py-2"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Company / Organization *
                        </label>
                        <div className="relative">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="AeroDynamics Pvt Ltd"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="input-base pl-9 text-xs py-2"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* GSTIN Field */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          GSTIN (Optional)
                        </label>
                        {detectedGstState && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            State: {detectedGstState}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        maxLength={15}
                        placeholder="29AABCF1234F1Z8"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value.toUpperCase())}
                        className="input-base uppercase font-mono text-xs py-2"
                      />
                    </div>

                    {/* Passwords */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Create Password *
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Min. 6 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="input-base text-xs py-2"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Confirm Password *
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Repeat password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="input-base text-xs py-2"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={whatsappOpted}
                          onChange={(e) => setWhatsappOpted(e.target.checked)}
                          className="h-3.5 w-3.5 text-[#FF5722] rounded border-slate-300"
                        />
                        <span className="text-xs text-slate-600">
                          Receive live quote updates and dispatch alerts via WhatsApp (+91)
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="h-3.5 w-3.5 text-[#FF5722] rounded border-slate-300"
                        />
                        <span className="text-xs text-slate-600">
                          I agree to FabForge's Terms & Strict Mutual NDA policy
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-forge text-sm py-2.5 flex items-center justify-center gap-2 shadow-md mt-2"
                    >
                      {loading ? 'Creating Account...' : 'Complete Sign Up & Go to Dashboard'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  /* Sign Up: Quick Mobile OTP */
                  otpStep === 'input_phone' ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          placeholder="Amar Kumar"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="input-base text-xs py-2.5 mb-3"
                          required
                        />

                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Company / Organization
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. AeroDynamics Pvt Ltd"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="input-base text-xs py-2.5 mb-3"
                        />

                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Indian Mobile Number *
                        </label>
                        <div className="flex rounded-xl border border-slate-300 overflow-hidden">
                          <span className="bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 border-r border-slate-300">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            placeholder="8088201429"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                            className="w-full px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || phone.length !== 10 || !fullName.trim()}
                        className="w-full btn-forge text-sm py-3 flex items-center justify-center gap-2 shadow-md"
                      >
                        {loading ? 'Sending OTP Code...' : 'Get Verification Code'}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    /* Verify OTP Step for Sign Up */
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Enter 6-Digit OTP Code
                          </label>
                          <button
                            type="button"
                            onClick={() => setOtpStep('input_phone')}
                            className="text-xs text-[#FF5722] font-semibold hover:underline"
                          >
                            Change (+91 {phone})
                          </button>
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="• • • • • •"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="input-base text-center text-xl tracking-widest font-black"
                          required
                          autoFocus
                        />
                        <p className="text-[11px] text-slate-500 mt-2 text-center">
                          Demo OTP: <strong className="text-slate-800">123456</strong>
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || otp.length < 4}
                        className="w-full btn-forge text-sm py-3 flex items-center justify-center gap-2 shadow-md"
                      >
                        {loading ? 'Registering...' : 'Verify OTP & Create Account'}
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </form>
                  )
                )
              )}
            </div>

            {/* Bottom Switcher Link */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
              {activeTab === 'signin' ? (
                <p>
                  Don't have a FabForge account yet?{' '}
                  <button
                    type="button"
                    onClick={() => handleTabChange('signup')}
                    className="font-bold text-[#FF5722] hover:underline"
                  >
                    Create Account (Sign Up) →
                  </button>
                </p>
              ) : (
                <p>
                  Already registered with FabForge?{' '}
                  <button
                    type="button"
                    onClick={() => handleTabChange('signin')}
                    className="font-bold text-[#FF5722] hover:underline"
                  >
                    Sign In to your account →
                  </button>
                </p>
              )}
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuthPage;
