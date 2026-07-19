import { Mail, MessageSquare, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";

const LinkedinIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const FacebookIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export const Footer: React.FC = () => {
  const whatsappUrl = SITE_CONFIG.whatsappNumber
    ? `https://wa.me/${SITE_CONFIG.whatsappNumber}`
    : null;

  return (
    <footer id="contact" className="bg-[#111111] text-white border-t border-neutral-800 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Logo & About */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center text-white font-serif font-bold text-lg">
                S
              </div>
              <span className="font-display font-semibold text-lg tracking-wide text-white">
                Surya Industries
              </span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
              Supplying, customizing, delivering, installing, and supporting premium institutional furniture solutions across Karnataka.
            </p>
            <div className="text-xs text-neutral-500 mt-2">
              Built for institutional buyers
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold text-brand-accent uppercase tracking-widest">
              Contact
            </h4>
            <div className="flex flex-col gap-3 text-sm text-neutral-300">
              {whatsappUrl && SITE_CONFIG.contactPhone && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                  <MessageSquare size={16} className="text-brand-accent" />
                  <span>WhatsApp: {SITE_CONFIG.contactPhone}</span>
                </a>
              )}
              {SITE_CONFIG.contactEmail && (
                <a href={`mailto:${SITE_CONFIG.contactEmail}`} className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail size={16} className="text-brand-accent" />
                  <span>Email: {SITE_CONFIG.contactEmail}</span>
                </a>
              )}
              {!whatsappUrl && !SITE_CONFIG.contactEmail && (
                <p className="text-neutral-400">Use the Request a Quote form for enquiries.</p>
              )}
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-brand-accent mt-0.5 shrink-0" />
                <span>Factory: {SITE_CONFIG.factoryAddress}</span>
              </div>
            </div>
          </div>

          {/* Regional Procurement */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold text-brand-accent uppercase tracking-widest">
              Karnataka Coverage
            </h4>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Serving schools, colleges, hospitals, offices, banks, and government organizations across Karnataka (Bengaluru, Mysuru, Hubballi-Dharwad, Mangaluru, Belagavi).
            </p>
          </div>

          {/* Business Hours & Socials */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold text-brand-accent uppercase tracking-widest">
              Business Hours
            </h4>
            <div className="flex items-center gap-2 text-sm text-neutral-300">
              <Clock size={16} className="text-brand-accent" />
              <span>Monday–Saturday, 9:30 AM–6:30 PM</span>
            </div>
            {(whatsappUrl || SITE_CONFIG.linkedinUrl || SITE_CONFIG.facebookUrl || SITE_CONFIG.contactEmail) && (
              <div className="flex gap-4 mt-4">
                {whatsappUrl && (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:border-brand-accent transition-colors" aria-label="WhatsApp">
                    <MessageSquare size={16} />
                  </a>
                )}
                {SITE_CONFIG.linkedinUrl && (
                  <a href={SITE_CONFIG.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:border-brand-accent transition-colors" aria-label="LinkedIn">
                    <LinkedinIcon size={16} />
                  </a>
                )}
                {SITE_CONFIG.facebookUrl && (
                  <a href={SITE_CONFIG.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:border-brand-accent transition-colors" aria-label="Facebook">
                    <FacebookIcon size={16} />
                  </a>
                )}
                {SITE_CONFIG.contactEmail && (
                  <a href={`mailto:${SITE_CONFIG.contactEmail}`} className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:border-brand-accent transition-colors" aria-label="Email">
                    <Mail size={16} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Surya Industries. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-neutral-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-neutral-300">Terms of Service</Link>
            <a href="/sitemap.xml" className="hover:text-neutral-300">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
