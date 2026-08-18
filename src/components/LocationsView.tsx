import React from 'react';
import { BranchLocation, BusinessProfile } from '../types';
import { INITIAL_BRANCHES, INITIAL_BUSINESS_PROFILE } from '../data/initialData';
import { 
  MapPin, Phone, MessageSquare, Clock, Navigation, Compass, 
  ArrowUpRight, Mail, Instagram, Share2, ShieldCheck, Truck 
} from 'lucide-react';

interface LocationsViewProps {
  branches?: BranchLocation[];
  businessProfile?: BusinessProfile;
}

export const LocationsView: React.FC<LocationsViewProps> = ({
  branches = INITIAL_BRANCHES,
  businessProfile = INITIAL_BUSINESS_PROFILE,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn text-white">
      {/* Title & Banner */}
      <div className="max-w-3xl mb-12">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 bg-orange-500 text-black font-black text-[10px] uppercase tracking-wider">
            {branches.length} Store Locations
          </span>
          <span className="text-orange-500 font-bold tracking-[0.2em] uppercase text-xs">
            Live GPS Pinned Hubs
          </span>
        </div>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white font-display leading-none">
          STORE BRANCHES &amp; GPS LOCATIONS
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-4 leading-relaxed font-medium">
          Visit our physical counters across Kenya for immediate spare parts collection, fitment verification, tire fitting, and genuine oil services. Free counter pickup available on all orders.
        </p>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {branches.map((branch, idx) => (
          <div
            key={branch.id}
            className="relative group bg-[#111111] border border-zinc-800 flex flex-col justify-between p-6 sm:p-8 hover:border-orange-500 transition-colors"
          >
            {/* Watermark identifier */}
            <div className="absolute top-0 right-0 p-4 pointer-events-none select-none">
              <span className="text-[60px] sm:text-[70px] font-black text-white/5 leading-none font-display tracking-tighter">
                {branch.city.toUpperCase().slice(0, 4)}
              </span>
            </div>

            <div>
              {/* Branch Image */}
              <div className="relative h-48 sm:h-52 w-full bg-zinc-900 border border-zinc-800 overflow-hidden mb-6">
                <img
                  src={branch.image}
                  alt={branch.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 bg-orange-500 text-black px-3 py-1 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{branch.shortName} ({branch.city})</span>
                </div>
              </div>

              {/* Branch Name & Info */}
              <div className="space-y-4">
                <h3 className="text-2xl sm:text-3xl font-black uppercase font-display text-white">
                  {branch.name}
                </h3>

                <div className="space-y-2.5 text-xs text-zinc-300">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white uppercase text-[11px] font-bold">Physical Address:</strong>
                      {branch.address}
                    </div>
                  </div>

                  {/* Live GPS Coordinates */}
                  <div className="flex items-start gap-2.5 bg-zinc-900/80 p-2.5 border border-zinc-800">
                    <Compass className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-orange-400 uppercase text-[10px] font-black tracking-wider">
                        Live GPS Coordinates:
                      </strong>
                      <span className="font-mono text-white text-xs font-bold">
                        {branch.coords || `${branch.latitude}, ${branch.longitude}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white uppercase text-[11px] font-bold">Working Hours:</strong>
                      {branch.hours}
                    </div>
                  </div>

                  {/* Direct Contact Numbers & Emails */}
                  <div className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white uppercase text-[11px] font-bold">Branch Hotlines:</strong>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {branch.phones.map((ph, pIdx) => (
                          <a
                            key={pIdx}
                            href={`tel:${ph}`}
                            className="font-mono text-zinc-300 hover:text-orange-400 font-bold underline"
                          >
                            {ph}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  {branch.emails && branch.emails.length > 0 && (
                    <div className="flex items-start gap-2.5">
                      <Mail className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-white uppercase text-[11px] font-bold">Branch Email:</strong>
                        <div className="flex flex-wrap gap-2 mt-1 font-mono text-zinc-400">
                          {branch.emails.join(' | ')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Key Services */}
                <div className="pt-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">
                    Available Spares &amp; Hub Services:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {branch.services.map((svc, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs bg-zinc-900/90 border border-zinc-800 p-2.5 text-zinc-200 font-bold uppercase tracking-wider text-[11px]"
                      >
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                        <span className="truncate">{svc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 mt-6 border-t border-zinc-800 space-y-2.5">
              <a
                href={branch.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-white hover:bg-orange-500 hover:text-black text-black font-black uppercase tracking-tighter text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>Navigate via Google Maps (Live GPS)</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${branch.phones[0]}`}
                  className="py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 font-black uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-orange-500" />
                  <span>Call Branch</span>
                </a>
                <a
                  href={`https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(
                    `Hello Rissau Auto Agency (${branch.shortName}), I am inquiring about spare parts & live counter pickup.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-emerald-400 hover:text-emerald-300 border border-zinc-800 font-black uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Social Media & Upcountry Delivery Banner */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Social Media Cards */}
        <div className="lg:col-span-5 bg-[#111111] p-6 sm:p-8 border border-zinc-800 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-orange-500 font-black uppercase text-xs tracking-widest block">
              Official Social Channels
            </span>
            <h3 className="text-2xl font-black uppercase font-display text-white mt-1">
              Connect on Instagram &amp; TikTok
            </h3>
            <p className="text-xs text-zinc-400 mt-2">
              Watch spare parts demonstrations, new stock arrivals, genuine Toyota parts unboxings, and mechanic tips.
            </p>
          </div>

          <div className="space-y-3">
            <a
              href={`https://instagram.com/${businessProfile.instagram.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="p-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-pink-500/50 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-white font-black text-xs block group-hover:text-pink-400">Instagram</span>
                  <span className="text-zinc-400 font-mono text-[11px]">{businessProfile.instagram}</span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white" />
            </a>

            <a
              href={`https://tiktok.com/@${businessProfile.tiktok.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="p-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-500/50 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-white font-black text-xs block group-hover:text-cyan-400">TikTok</span>
                  <span className="text-zinc-400 font-mono text-[11px]">{businessProfile.tiktok}</span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white" />
            </a>
          </div>
        </div>

        {/* Upcountry Logistics */}
        <div className="lg:col-span-7 bg-[#111111] p-6 sm:p-8 border border-zinc-800 flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <span className="text-orange-500 font-black uppercase text-xs tracking-widest block">
              Nationwide Sacco Logistics
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase font-display text-white">
              Upcountry Matatu Parcel Dispatch
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We deliver daily parcels across Kenya (Mombasa, Kisumu, Nakuru, Eldoret, Thika, Nyeri, Meru, Machakos, Kitale) via <strong className="text-white">2NK Sacco, Guardian Coach, EasyCoach, Transline Classic, and Speedex</strong>. Live dispatch updates &amp; SMS tracking.
            </p>
          </div>

          <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block">
              Central Hotlines &amp; Email Contact
            </span>
            <div className="flex flex-wrap gap-3 font-mono text-xs text-orange-400 font-bold">
              {businessProfile.phones.map((ph, idx) => (
                <a key={idx} href={`tel:${ph}`} className="hover:underline">
                  {ph}
                </a>
              ))}
            </div>
            <div className="font-mono text-zinc-400 text-xs">
              {businessProfile.emails.join(' • ')}
            </div>
          </div>

          <a
            href={`https://wa.me/${businessProfile.whatsapp}?text=Hello%20Rissau%20Auto,%20I%20need%20upcountry%20parcel%20delivery%20for%20auto%20spares.`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-4 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-tighter text-xs sm:text-sm text-center transition-colors cursor-pointer"
          >
            Inquire Upcountry Dispatch via WhatsApp &rarr;
          </a>
        </div>
      </div>
    </div>
  );
};
