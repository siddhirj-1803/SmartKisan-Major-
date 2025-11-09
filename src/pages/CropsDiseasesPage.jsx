import { useMemo, useState } from 'react';
import { cropsDiseases } from '../data/cropsDiseases';
import { Search, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import PropTypes from 'prop-types';

const CropsDiseasesPage = ({ isCollapsed }) => {
  const [query, setQuery] = useState('');
  const [cropFilter, setCropFilter] = useState('All');
  const [open, setOpen] = useState({});

  const crops = useMemo(() => ['All', ...cropsDiseases.map(c => c.crop)], []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cropsDiseases
      .filter(c => cropFilter === 'All' || c.crop === cropFilter)
      .map(c => ({
        crop: c.crop,
        diseases: c.diseases.filter(d =>
          !q ||
          d.name.toLowerCase().includes(q) ||
          (d.description?.toLowerCase() || '').includes(q) ||
          (d.symptoms?.toLowerCase() || '').includes(q)
        )
      }))
      .filter(c => c.diseases.length > 0);
  }, [query, cropFilter]);

  return (
    <div className={`transition-all ${isCollapsed ? 'ml-20' : 'ml-72'} p-4 md:p-6`}>
      <h1 className="text-2xl font-bold text-emerald-800 mb-6">Crops & Diseases Library</h1>

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search disease, symptom, description"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
            >
              {crops.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No matches found.</div>
      ) : (
        <div className="space-y-6">
          {filtered.map(({ crop, diseases }) => (
            <div key={crop} className="bg-white rounded-lg shadow-md border border-gray-100">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-emerald-800">{crop}</h2>
                <span className="text-xs text-gray-500">{diseases.length} item(s)</span>
              </div>
              <div className="divide-y divide-gray-100">
                {diseases.map((d) => (
                  <div key={d.classKey} className="p-4">
                    <button
                      className="w-full text-left flex justify-between items-center"
                      onClick={() => setOpen(prev => ({ ...prev, [d.classKey]: !prev[d.classKey] }))}
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">{d.name}</h3>
                        {d.description && (
                          <p className="text-sm text-gray-500 line-clamp-1">{d.description}</p>
                        )}
                      </div>
                      {open[d.classKey] ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                    {open[d.classKey] && (
                      <div className="mt-3 grid md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-2">
                          {d.description && (
                            <div>
                              <h4 className="text-sm font-semibold text-emerald-700">Description</h4>
                              <p className="text-sm text-gray-700">{d.description}</p>
                            </div>
                          )}
                          {d.symptoms && (
                            <div>
                              <h4 className="text-sm font-semibold text-emerald-700">Symptoms</h4>
                              <p className="text-sm text-gray-700">{d.symptoms}</p>
                            </div>
                          )}
                          {d.conditions && (
                            <div>
                              <h4 className="text-sm font-semibold text-emerald-700">Favorable Conditions</h4>
                              <p className="text-sm text-gray-700">{d.conditions}</p>
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-emerald-700">Treatment / Management</h4>
                          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                            {(d.management || []).map((m, i) => (
                              <li key={i}>{m}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

CropsDiseasesPage.propTypes = {
  isCollapsed: PropTypes.bool,
};

CropsDiseasesPage.defaultProps = {
  isCollapsed: false,
};

export default CropsDiseasesPage;
