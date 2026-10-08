import React, { useState } from 'react';
import { MicroTechnicLogo } from '../components/MicroTechnicLogo';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import loginHeroImage from '../assets/images/login_hero_pcba_probe_1791473534429.jpg';

interface LoginProps {
  onSignIn: () => void;
}

export const Screen1_Login: React.FC<LoginProps> = ({ onSignIn }) => {
  const [username, setUsername] = useState('henrik.nielsen@micro-technic.com');
  const [password, setPassword] = useState('••••••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn();
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Full-Page Left Half: Edge-to-Edge Manufacturing Photography */}
      <div className="relative w-full md:w-1/2 min-h-[360px] md:min-h-screen bg-slate-900 overflow-hidden flex flex-col justify-between">
        <img
          src={loginHeroImage}
          alt="Micro Technic Electronics Manufacturing and PCBA Testing"
          className="w-full h-full object-cover object-center absolute inset-0"
          referrerPolicy="no-referrer"
        />

        {/* Subtle cinematic gradient overlay matching Micro Technic corporate navy */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A2240]/80 via-transparent to-black/10" />

        {/* Top spacer */}
        <div className="relative z-10 p-6 sm:p-8" />

        {/* Ambient bottom caption */}
        <div className="relative z-10 p-6 sm:p-8 text-white hidden sm:block">
          <div className="text-xs uppercase tracking-widest font-semibold text-sky-300">
            Micro Technic A/S
          </div>
          <div className="text-2xl font-bold tracking-tight mt-1 text-white">
            Electronic Manufacturing Services
          </div>
          <div className="text-xs text-slate-200 mt-1.5 max-w-md leading-relaxed">
            Specialized PCBA assembly, precision functional testing, and intelligent BOM component lifecycle governance.
          </div>
          <div className="flex items-center gap-4 text-[11px] text-sky-200/80 mt-3 font-medium">
            <span>Aarup, Denmark</span>
            <span>•</span>
            <span>ISO 9001 / ISO 14001</span>
            <span>•</span>
            <span>Est. 1977</span>
          </div>
        </div>
      </div>

      {/* Full-Page Right Half: Clean, Modern Sign-In Workspace */}
      <div className="w-full md:w-1/2 min-h-[500px] md:min-h-screen flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Prominent Micro Technic Logo */}
          <div>
            <MicroTechnicLogo className="h-12 sm:h-14" />
          </div>

          {/* Clean Section Header */}
          <div className="space-y-1.5 pt-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A2240]">
              BOM Intelligence
            </h1>
            <p className="text-sm text-slate-500">
              Sign in to your engineering account
            </p>
          </div>

          {/* Clean Sign-In Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Work email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="name@micro-technic.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/80 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2568A3] focus:border-[#2568A3] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-[#2568A3] hover:underline font-medium cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/80 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2568A3] focus:border-[#2568A3] transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quiet bottom copyright */}
          <div className="pt-6 border-t border-slate-100 text-xs text-slate-400 text-center sm:text-left">
            © 2026 Micro Technic A/S. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};
