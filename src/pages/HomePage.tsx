import React, { useState, useEffect } from 'react';

export default function HomePage() {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHelloMessage = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/hello');
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error('Error fetching hello message:', error);
        setMessage('Error conectando al backend');
      }
      setLoading(false);
    };

    const fetchStatus = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/status');
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };

    fetchHelloMessage();
    fetchStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          ¡Hola Mundo!
        </h1>
        
        <div className="space-y-4">
          {loading ? (
            <div className="text-center">
              <div className="inline-block animate-spin">
                <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
              <p className="text-gray-600 mt-2">Cargando...</p>
            </div>
          ) : (
            <>
              {message && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-gray-800 font-semibold mb-2">Mensaje del Backend:</p>
                  <p className="text-gray-700">{message}</p>
                </div>
              )}
              
              {status && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <p className="text-gray-800 font-semibold mb-2">Estado del Sistema:</p>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p><span className="font-medium">Estado:</span> <span className="text-green-600">{status.status}</span></p>
                    <p><span className="font-medium">Aplicación:</span> {status.application}</p>
                    <p><span className="font-medium">Versión:</span> {status.version}</p>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="bg-gray-50 p-4 rounded text-sm text-gray-600">
            <p className="font-semibold mb-2">🐳 Contenedores activos:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Frontend React + Tailwind: 3000</li>
              <li>Backend Spring Boot: 8080</li>
              <li>PostgreSQL: 5432</li>
            </ul>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
}
