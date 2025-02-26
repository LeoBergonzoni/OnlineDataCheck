import React, { useState } from 'react';
import { UserData, DossierResult } from './types';
import UserForm from './components/UserForm';
import DossierResults from './components/DossierResults';
import { generateDossier } from './api/dossierService';
import { Search, Shield, Database } from 'lucide-react';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [dossierResult, setDossierResult] = useState<DossierResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: UserData) => {
    setIsLoading(true);
    setError(null);
    setUserData(data);
    
    try {
      const result = await generateDossier(data);
      setDossierResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Si è verificato un errore durante la generazione del dossier.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUserData(null);
    setDossierResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dossier Personale</h1>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Feature section */}
          {!userData && !dossierResult && (
            <div className="py-12 bg-white">
              <div className="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <h2 className="sr-only">Un potente strumento per la tua presenza online</h2>
                <dl className="space-y-10 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
                  <div>
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <Search className="h-6 w-6" />
                    </div>
                    <div className="mt-5">
                      <dt className="text-lg leading-6 font-medium text-gray-900">Ricerca Completa</dt>
                      <dd className="mt-2 text-base text-gray-500">
                        Trova i tuoi account social, notizie e informazioni personali presenti sul web.
                      </dd>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <Database className="h-6 w-6" />
                    </div>
                    <div className="mt-5">
                      <dt className="text-lg leading-6 font-medium text-gray-900">Dossier Completo</dt>
                      <dd className="mt-2 text-base text-gray-500">
                        Genera un report dettagliato con tutti i dati trovati, facilmente scaricabile.
                      </dd>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div className="mt-5">
                      <dt className="text-lg leading-6 font-medium text-gray-900">Privacy Garantita</dt>
                      <dd className="mt-2 text-base text-gray-500">
                        I tuoi dati non vengono memorizzati e sono utilizzati solo per generare il dossier.
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {/* Form or Results */}
          <div className="bg-white shadow rounded-lg p-6 mt-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Errore</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {!userData || !dossierResult ? (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">Inserisci i tuoi dati</h2>
                <UserForm onSubmit={handleSubmit} isLoading={isLoading} />
              </div>
            ) : (
              <div>
                <DossierResults dossier={dossierResult} userData={userData} />
                <div className="mt-6">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Nuova Ricerca
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; 2025 Dossier Personale. Tutti i diritti riservati.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;