import React from 'react';
import { DossierResult, UserData } from '../types';
import { downloadDossierAsJSON, downloadDossierAsPDF, downloadDossierAsWord } from '../api/dossierService';
import { Download, ExternalLink, Linkedin, Twitter, Facebook, Instagram, AlertCircle, FileText, FileIcon } from 'lucide-react';

interface DossierResultsProps {
  dossier: DossierResult;
  userData: UserData;
}

const DossierResults: React.FC<DossierResultsProps> = ({ dossier, userData }) => {
  const handleDownloadJSON = () => {
    downloadDossierAsJSON(dossier, userData);
  };

  const handleDownloadPDF = () => {
    downloadDossierAsPDF(dossier, userData);
  };

  const handleDownloadWord = () => {
    downloadDossierAsWord(dossier, userData);
  };

  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'Linkedin':
        return <Linkedin className="h-5 w-5" />;
      case 'Twitter':
        return <Twitter className="h-5 w-5" />;
      case 'Facebook':
        return <Facebook className="h-5 w-5" />;
      case 'Instagram':
        return <Instagram className="h-5 w-5" />;
      default:
        return <ExternalLink className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-xl font-semibold text-gray-800">
          Dossier per {userData.firstName} {userData.lastName}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handleDownloadJSON}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Download className="mr-1 h-4 w-4" />
            JSON
          </button>
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <FileText className="mr-1 h-4 w-4" />
            PDF
          </button>
          <button
            onClick={handleDownloadWord}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FileIcon className="mr-1 h-4 w-4" />
            Word
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Account Social</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Possibili account social associati al tuo nome
          </p>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {dossier.socialLinks.map((link, index) => (
              <li key={index} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 text-gray-500">
                      {getSocialIcon(link.icon)}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{link.platform}</p>
                    </div>
                  </div>
                  <div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Visita <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Notizie</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Articoli e notizie che potrebbero menzionarti
          </p>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {dossier.newsResults.map((news, index) => (
              <li key={index} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{news.title}</p>
                    <p className="text-sm text-gray-500">
                      {news.source} • {new Date(news.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <a
                      href={news.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Leggi <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Informazioni Personali</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Informazioni personali trovate sul web
          </p>
        </div>
        <div className="border-t border-gray-200">
          {dossier.personalInfo ? (
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                {dossier.personalInfo.emails.length > 0 && (
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {dossier.personalInfo.emails.map((email, index) => (
                        <div key={index}>{email}</div>
                      ))}
                    </dd>
                  </div>
                )}
                
                {dossier.personalInfo.phones.length > 0 && (
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Telefono</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {dossier.personalInfo.phones.map((phone, index) => (
                        <div key={index}>{phone}</div>
                      ))}
                    </dd>
                  </div>
                )}
                
                {dossier.personalInfo.addresses.length > 0 && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Indirizzi</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {dossier.personalInfo.addresses.map((address, index) => (
                        <div key={index}>{address}</div>
                      ))}
                    </dd>
                  </div>
                )}
                
                {dossier.personalInfo.websites.length > 0 && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Siti Web</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {dossier.personalInfo.websites.map((website, index) => (
                        <div key={index}>
                          <a 
                            href={website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-500"
                          >
                            {website}
                          </a>
                        </div>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          ) : (
            <div className="px-4 py-5 sm:p-6 flex items-center justify-center text-gray-500">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>Nessuna informazione personale trovata</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Nota:</strong> Questo è un dossier dimostrativo. In un'applicazione reale, sarebbero utilizzate API come Google Custom Search per trovare informazioni più accurate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DossierResults;