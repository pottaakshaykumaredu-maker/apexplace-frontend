import React from 'react';
import { Company } from '../../types';
import { Building2, Globe, MapPin, ExternalLink, Briefcase } from 'lucide-react';

interface Props {
  companies: Company[];
}

export const CompanyManagement: React.FC<Props> = ({ companies }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/60">
          <Building2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Industry Relations</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Registered Campus Recruiting Partners ({companies.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Approved enterprise employers, startups, and multinational corporations visiting for recruitment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {companies.map((comp) => (
          <div
            key={comp.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {comp.logo ? (
                    <img src={comp.logo} alt={comp.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">{comp.name}</h3>
                  <div className="text-xs text-slate-500 font-medium">{comp.industry}</div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {comp.description}
              </p>

              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{comp.location}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-bold">Partner Status: Approved</span>
              <a
                href={comp.website}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1"
              >
                <span>Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
