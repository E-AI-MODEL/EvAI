import React from 'react';

const InsightPanel = ({ activeSeeds, traceLog }) => {
  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-gray-900 bg-opacity-50 backdrop-blur-lg backdrop-filter border-l border-white border-opacity-20 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
          EvAI Insights
        </h2>

        {/* Active Seeds Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-blue-300 mb-2">Actieve Seeds</h3>
          <div className="space-y-2">
            {activeSeeds.map((seed, index) => (
              <div
                key={index}
                className="p-3 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-blue-300">{seed.id}</span>
                  <span className="text-xs text-gray-400">{seed.type}</span>
                </div>
                <p className="text-sm text-gray-300 mb-2">{seed.intention_nl || seed.intention}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-500 bg-opacity-20">
                    {seed.emotion_nl || seed.emotion}
                  </span>
                  <span className="text-xs text-gray-400">
                    TTL: {seed.ttl}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trace Log Section */}
        <div>
          <h3 className="text-sm font-semibold text-purple-300 mb-2">Trace Log</h3>
          <div className="space-y-2">
            {traceLog?.map((log, index) => (
              <div
                key={index}
                className="p-3 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-purple-300">
                    {log.timestamp}
                  </span>
                  <span className="text-xs text-gray-400">{log.type}</span>
                </div>
                <p className="text-sm text-gray-300">{log.message}</p>
                {log.details && (
                  <div className="mt-2 text-xs text-gray-400">
                    {JSON.stringify(log.details, null, 2)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightPanel; 