import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowUp, Calendar, Search, X, Trash2, MessageSquare } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import PropTypes from 'prop-types';

// Prefer env variable if defined, fallback to localhost
const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:5000';

const DetectionHistoryPage = ({ isCollapsed }) => {
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [expandedDates, setExpandedDates] = useState({});
  const [expandedItems, setExpandedItems] = useState({});
  const [showConversation, setShowConversation] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch history on mount
  useEffect(() => {
    const fetchHistory = async (attempt = 1) => {
      setLoading(true);
      setError(null);
      console.log(`[History] Fetch attempt ${attempt} to`, `${API_BASE_URL}/api/history`);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout
      try {
        let response;
        try {
          response = await fetch(`${API_BASE_URL}/api/history`, { signal: controller.signal });
        } catch (netErr) {
          console.warn('[History] Network error on absolute URL:', netErr);
          // Fallback to relative path if first attempt failed
          if (attempt === 1) {
            console.log('[History] Trying relative /api/history as fallback');
            return fetchHistory(2);
          }
          throw netErr;
        }
        if (!response.ok) throw new Error(`Fetch failed (${response.status})`);
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Unexpected response format (not an array)');
        }
        console.log(`[History] Received ${data.length} records`);
        setDetectionHistory(data);
        const initialExpandedDates = {};
        data.forEach((item) => {
          if (!item.timestamp) return;
          const dateKey = new Date(item.timestamp).toLocaleDateString();
          if (!initialExpandedDates[dateKey]) initialExpandedDates[dateKey] = true;
        });
        setExpandedDates(initialExpandedDates);
      } catch (error) {
        if (error.name === 'AbortError') {
          console.error('[History] Fetch aborted (timeout).');
          setError('Request timed out.');
        } else {
          console.error('Error fetching detection history:', error);
          setError(error.message || 'Failed to load history');
        }
        addNotification({
          title: 'History Error',
          message: 'Could not load detection history from the server.',
          type: 'error',
        });
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };

    fetchHistory();
  }, [addNotification]);

  // Group detections by date
  const getGroupedDetections = () => {
    const grouped = {};
    detectionHistory.forEach((item) => {
      const dateKey = new Date(item.timestamp).toLocaleDateString();
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(item);
    });
    Object.keys(grouped).forEach((k) => {
      grouped[k].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    });
    return grouped;
  };

  const toggleDateExpand = (date) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const toggleItemExpand = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleConversation = (id) => {
    setShowConversation((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const deleteDetection = (id) => {
    if (!id) return;
    fetch(`${API_BASE_URL}/api/history/${id}`, { method: 'DELETE' })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || 'Failed to delete history item');
        }
        return res.json();
      })
      .then(() => {
        setDetectionHistory((prev) => prev.filter((h) => h.id !== id));
        setExpandedItems((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        addNotification({
          title: 'Deleted',
          message: 'History item removed.',
          type: 'success',
        });
      })
      .catch((err) => {
        console.error('Delete error:', err);
        addNotification({
          title: 'Error',
          message: err.message || 'Could not delete item.',
          type: 'error',
        });
      });
  };

  const clearAllHistory = () => {
    fetch(`${API_BASE_URL}/api/history`, { method: 'DELETE' })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || 'Failed to clear history');
        }
        return res.json();
      })
      .then(() => {
        setDetectionHistory([]);
        setExpandedDates({});
        setExpandedItems({});
        setShowConversation({});
        addNotification({
          title: 'Cleared',
          message: 'All history cleared.',
          type: 'success',
        });
      })
      .catch((err) => {
        console.error('Clear error:', err);
        addNotification({
          title: 'Error',
          message: err.message || 'Could not clear history.',
          type: 'error',
        });
      });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredDetections = Object.entries(getGroupedDetections())
    .filter(([date]) => {
      if (filterDate) {
        const selected = new Date(filterDate).toLocaleDateString();
        return date === selected;
      }
      return true;
    })
    .reduce((acc, [date, detections]) => {
      const filtered = detections.filter((detection) =>
        detection.crop_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detection.condition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (detection.confidence && detection.confidence.toString().includes(searchTerm))
      );

      if (filtered.length > 0) {
        acc[date] = filtered;
      }

      return acc;
    }, {});

  return (
    <div className={`transition-all ${isCollapsed ? 'ml-20' : 'ml-72'} p-4 md:p-6`}>
      <h1 className="text-2xl font-bold text-emerald-800 mb-6">Detection History</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by crop, disease or confidence level"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
            {filterDate && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setFilterDate('')}
                aria-label="Clear date filter"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="mb-4 text-sm text-gray-500 flex items-center gap-2">
            <span className="animate-pulse">Loading history...</span>
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => fetchHistory()}
              className="px-3 py-1 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700"
            >Retry</button>
          </div>
        )}
        <div className="flex justify-end mb-4">
          <button
            onClick={clearAllHistory}
            disabled={detectionHistory.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Clear all history
          </button>
        </div>

        {Object.keys(filteredDetections).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No detection history found.</p>
          </div>
        ) : (
          <>
            {Object.entries(filteredDetections).map(([date, detections]) => (
              <div key={date} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleDateExpand(date)}
                  className="w-full flex items-center justify-between bg-gray-50 px-4 py-3"
                >
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">{date}</span>
                    <span className="text-xs text-gray-500">({detections.length})</span>
                  </div>
                  {expandedDates[date] ? (
                    <ArrowUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {expandedDates[date] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="divide-y divide-gray-100"
                    >
                      {detections.map((detection) => (
                        <div key={detection.id} className="p-4">
                          <div
                            className="flex justify-between items-start cursor-pointer"
                            onClick={() => toggleItemExpand(detection.id)}
                          >
                            <div className="flex items-center gap-3">
                              {detection.image_url && (
                                <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-200">
                                  <img
                                    src={`${API_BASE_URL}${detection.image_url}`}
                                    alt={detection.crop_type || 'Plant image'}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {detection.crop_type || 'Unknown plant'}
                                  {detection.condition && (
                                    <span className="text-red-500"> - {detection.condition}</span>
                                  )}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {formatTime(detection.timestamp)}
                                  {typeof detection.confidence === 'number' && (
                                    <span className="ml-2 text-gray-400">
                                      {(detection.confidence * 100).toFixed(1)}%
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {expandedItems[detection.id] ? (
                                <ArrowUp className="h-4 w-4 text-gray-400" />
                              ) : (
                                <ArrowDown className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                          </div>

                          <AnimatePresence>
                            {expandedItems[detection.id] && (
                              <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.15 }}
                                className="mt-4"
                              >
                                <div className="flex justify-between mb-2">
                                  {Array.isArray(detection.conversation) && detection.conversation.length > 0 && (
                                    <button
                                      onClick={() => toggleConversation(detection.id)}
                                      className="flex items-center gap-1 px-3 py-1 text-sm bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100"
                                    >
                                      <MessageSquare className="h-4 w-4" />
                                      {showConversation[detection.id] ? 'Hide conversation' : 'Show conversation'}
                                    </button>
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteDetection(detection.id);
                                    }}
                                    className="flex items-center gap-1 px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {showConversation[detection.id] && Array.isArray(detection.conversation) && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="mt-2 p-3 bg-gray-50 rounded-md text-sm max-h-60 overflow-y-auto"
                                    >
                                      {detection.conversation.map((msg, idx) => (
                                        <div
                                          key={idx}
                                          className={`mb-2 p-2 rounded ${
                                            msg.isUser
                                              ? 'bg-emerald-100 text-emerald-800 ml-auto'
                                              : 'bg-white border border-gray-200'
                                          } max-w-[85%] ${msg.isUser ? 'ml-auto' : 'mr-auto'}`}
                                        >
                                          {msg.text}
                                        </div>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

DetectionHistoryPage.propTypes = {
  isCollapsed: PropTypes.bool,
};

DetectionHistoryPage.defaultProps = {
  isCollapsed: false,
};

export default DetectionHistoryPage;

