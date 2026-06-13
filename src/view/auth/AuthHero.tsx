"use client";

import OnyxLogo from "../../components/shared/OnyxLogo";

const AuthHero = () => {
  return (
    <div className="border-border relative hidden w-1/2 flex-col justify-center overflow-hidden border-r bg-slate-950 p-16 text-slate-100 lg:flex">
      {/* Background Image with Dark Vignette */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-10000 ease-out hover:scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0')`,
        }}
      />
      {/* Modern dark gradients overlay */}
      <div className="absolute inset-0 z-10 bg-linear-to-t via-slate-950/40 to-slate-950/90" />
      <div className="bg-radial-gradient absolute inset-0 z-10 from-transparent to-slate-950/70" />

      {/* Top Left Logo Area */}
      <div className="absolute top-16 left-16 z-20 flex items-center gap-2">
        <OnyxLogo forceLight />
      </div>

      {/* Center Text Section */}
      <div className="relative z-20 max-w-md space-y-4">
        <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white">
          Smarter Project Management
        </h1>
        <p className="text-sm leading-relaxed font-light text-slate-300">
          Collaborate with your team, plan sprints, and deliver high-quality
          software with absolute ease and clarity.
        </p>
      </div>
    </div>
  );
};

export default AuthHero;
