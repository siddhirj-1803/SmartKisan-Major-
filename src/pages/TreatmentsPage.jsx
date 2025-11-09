import { useMemo, useState } from 'react';
import diseasesDefault, { cropsDiseases as namedCropsDiseases } from '../data/cropsDiseases';
import { Search, Stethoscope } from 'lucide-react';
import PropTypes from 'prop-types';

// Prefer named export; fall back to default export if needed
const getDataset = () => (Array.isArray(namedCropsDiseases) && namedCropsDiseases.length
  ? namedCropsDiseases
  : (Array.isArray(diseasesDefault) ? diseasesDefault : []));

const TreatmentsPage = ({ isCollapsed }) => {
  const [query, setQuery] = useState('');

  const data = useMemo(() => getDataset(), []);
  const flatDiseases = useMemo(
    () => data.flatMap(c => (c.diseases || []).map(d => ({ ...d, crop: c.crop }))),
    [data]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return flatDiseases;
    return flatDiseases.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.crop.toLowerCase().includes(q) ||
      (d.management || []).some(m => m.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div className={`transition-all ${isCollapsed ? 'ml-20' : 'ml-72'} p-4 md:p-6`}>
      <h1 className="text-2xl font-bold text-emerald-800 mb-6">Treatment Guide</h1>

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by disease, crop, or treatment keyword"
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 text-red-600">
          Dataset unavailable. Please check `src/data/cropsDiseases.js` exports.
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No treatments found.</div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {results.map((d) => (
            <div key={`${d.classKey}`} className="bg-white rounded-lg shadow border border-gray-100 p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 rounded-md">
                  <Stethoscope className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{d.name}</h3>
                  <p className="text-xs text-gray-500">{d.crop}</p>
                </div>
              </div>
              {d.description && (
                <p className="mt-2 text-sm text-gray-700">{d.description}</p>
              )}
              {d.symptoms && (
                <div className="mt-2">
                  <h4 className="text-sm font-semibold text-emerald-700">Common Symptoms</h4>
                  <p className="text-sm text-gray-700">{d.symptoms}</p>
                </div>
              )}
              {d.conditions && (
                <div className="mt-2">
                  <h4 className="text-sm font-semibold text-emerald-700">Favorable Conditions</h4>
                  <p className="text-sm text-gray-700">{d.conditions}</p>
                </div>
              )}
              <h4 className="mt-3 text-sm font-semibold text-emerald-700">Recommended Actions</h4>
              <ul className="mt-1 list-disc pl-5 text-sm text-gray-700 space-y-1">
                {(d.management || []).map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

TreatmentsPage.propTypes = {
  isCollapsed: PropTypes.bool,
};

TreatmentsPage.defaultProps = {
  isCollapsed: false,
};

export default TreatmentsPage;
