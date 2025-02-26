import axios from 'axios';
import { UserData, DossierResult, SocialLink, NewsItem, PersonalInfo } from '../types';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';

// This would be stored securely in environment variables in a real application
const GOOGLE_API_KEY = 'AIzaSyBKtzT-1zkRt0Jed3EnKeP1P0R2BxSqhhM';

// Mock function to simulate finding social media profiles
const findSocialMediaProfiles = async (userData: UserData): Promise<SocialLink[]> => {
  // In a real implementation, this would use Google Custom Search API or similar
  // to find social media profiles based on the user's name and other details
  
  // For demo purposes, we'll return mock data
  const fullName = `${userData.firstName} ${userData.lastName}`;
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      platform: 'LinkedIn',
      url: `https://linkedin.com/search/results/people/?keywords=${encodeURIComponent(fullName)}`,
      icon: 'Linkedin'
    },
    {
      platform: 'Twitter',
      url: `https://twitter.com/search?q=${encodeURIComponent(fullName)}`,
      icon: 'Twitter'
    },
    {
      platform: 'Facebook',
      url: `https://facebook.com/public/${encodeURIComponent(userData.firstName)}-${encodeURIComponent(userData.lastName)}`,
      icon: 'Facebook'
    },
    {
      platform: 'Instagram',
      url: `https://instagram.com/${encodeURIComponent(userData.firstName.toLowerCase() + userData.lastName.toLowerCase())}`,
      icon: 'Instagram'
    }
  ];
};

// Mock function to simulate finding news articles
const findNewsArticles = async (userData: UserData): Promise<NewsItem[]> => {
  // In a real implementation, this would use Google News API or similar
  // to find news articles mentioning the user
  
  // For demo purposes, we'll return mock data
  const fullName = `${userData.firstName} ${userData.lastName}`;
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return [
    {
      title: `Latest news about ${fullName}`,
      url: `https://news.google.com/search?q=${encodeURIComponent(fullName)}`,
      source: 'Google News',
      publishedAt: new Date().toISOString()
    },
    {
      title: `${fullName} in the media`,
      url: `https://www.bing.com/news/search?q=${encodeURIComponent(fullName)}`,
      source: 'Bing News',
      publishedAt: new Date().toISOString()
    }
  ];
};

// Mock function to simulate finding personal information
const findPersonalInfo = async (userData: UserData): Promise<PersonalInfo | null> => {
  // In a real implementation, this would use various APIs to find personal information
  // This is highly sensitive and would require proper legal basis and consent
  
  // For demo purposes, we'll return mock data
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Only return mock data if email is provided
  if (userData.email) {
    return {
      emails: [userData.email],
      phones: [],
      addresses: userData.location ? [`Somewhere in ${userData.location}`] : [],
      websites: []
    };
  }
  
  return null;
};

// Main function to generate the dossier
export const generateDossier = async (userData: UserData): Promise<DossierResult> => {
  try {
    // Run all searches in parallel
    const [socialLinks, newsResults, personalInfo] = await Promise.all([
      findSocialMediaProfiles(userData),
      findNewsArticles(userData),
      findPersonalInfo(userData)
    ]);
    
    return {
      socialLinks,
      newsResults,
      personalInfo
    };
  } catch (error) {
    console.error('Error generating dossier:', error);
    throw new Error('Failed to generate dossier. Please try again later.');
  }
};

// Function to download the dossier as a JSON file
export const downloadDossierAsJSON = (dossier: DossierResult, userData: UserData) => {
  const fileName = `${userData.firstName}_${userData.lastName}_dossier.json`;
  const dataStr = JSON.stringify(dossier, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', fileName);
  linkElement.click();
};

// Function to download the dossier as a PDF file
export const downloadDossierAsPDF = (dossier: DossierResult, userData: UserData) => {
  const doc = new jsPDF();
  const fullName = `${userData.firstName} ${userData.lastName}`;
  
  // Add title
  doc.setFontSize(20);
  doc.text(`Dossier Personale: ${fullName}`, 14, 20);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generato il: ${new Date().toLocaleDateString()}`, 14, 30);
  
  let yPos = 40;
  
  // Add social links section
  doc.setFontSize(16);
  doc.text('Account Social', 14, yPos);
  yPos += 10;
  
  // @ts-ignore - jspdf-autotable types are not properly recognized
  doc.autoTable({
    startY: yPos,
    head: [['Piattaforma', 'Link']],
    body: dossier.socialLinks.map(link => [
      link.platform,
      { content: link.url, styles: { textColor: [0, 0, 255] } }
    ]),
    didDrawCell: (data: any) => {
      // Add clickable links
      if (data.section === 'body' && data.column.index === 1) {
        const url = dossier.socialLinks[data.row.index].url;
        doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url });
      }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // Add news section
  doc.setFontSize(16);
  doc.text('Notizie', 14, yPos);
  yPos += 10;
  
  // @ts-ignore
  doc.autoTable({
    startY: yPos,
    head: [['Titolo', 'Fonte', 'Data', 'Link']],
    body: dossier.newsResults.map(news => [
      news.title,
      news.source,
      new Date(news.publishedAt).toLocaleDateString(),
      { content: 'Visita', styles: { textColor: [0, 0, 255] } }
    ]),
    didDrawCell: (data: any) => {
      // Add clickable links
      if (data.section === 'body' && data.column.index === 3) {
        const url = dossier.newsResults[data.row.index].url;
        doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url });
      }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // Add personal info section
  doc.setFontSize(16);
  doc.text('Informazioni Personali', 14, yPos);
  yPos += 10;
  
  if (dossier.personalInfo) {
    const personalInfoData: any[] = [];
    
    if (dossier.personalInfo.emails.length > 0) {
      personalInfoData.push(['Email', dossier.personalInfo.emails.join(', ')]);
    }
    
    if (dossier.personalInfo.phones.length > 0) {
      personalInfoData.push(['Telefono', dossier.personalInfo.phones.join(', ')]);
    }
    
    if (dossier.personalInfo.addresses.length > 0) {
      personalInfoData.push(['Indirizzo', dossier.personalInfo.addresses.join(', ')]);
    }
    
    if (dossier.personalInfo.websites.length > 0) {
      personalInfoData.push(['Siti Web', dossier.personalInfo.websites.join(', ')]);
    }
    
    if (personalInfoData.length > 0) {
      // @ts-ignore
      doc.autoTable({
        startY: yPos,
        head: [['Tipo', 'Dettagli']],
        body: personalInfoData
      });
    } else {
      doc.setFontSize(12);
      doc.text('Nessuna informazione personale trovata', 14, yPos);
    }
  } else {
    doc.setFontSize(12);
    doc.text('Nessuna informazione personale trovata', 14, yPos);
  }
  
  // Add disclaimer
  doc.setFontSize(10);
  doc.text('Nota: Questo è un dossier dimostrativo. In un\'applicazione reale, sarebbero utilizzate', 14, 280);
  doc.text('API come Google Custom Search per trovare informazioni più accurate.', 14, 285);
  
  // Save the PDF
  doc.save(`${userData.firstName}_${userData.lastName}_dossier.pdf`);
};

// Function to download the dossier as a Word document (HTML alternative)
export const downloadDossierAsWord = async (dossier: DossierResult, userData: UserData) => {
  const fullName = `${userData.firstName} ${userData.lastName}`;
  
  // Create HTML content for the Word document
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>Dossier Personale: ${fullName}</title>
      <style>
        body { font-family: 'Calibri', sans-serif; }
        h1 { color: #333; }
        h2 { color: #444; margin-top: 20px; }
        table { border-collapse: collapse; width: 100%; margin: 10px 0 20px 0; }
        th { background-color: #f2f2f2; text-align: left; padding: 8px; border: 1px solid #ddd; }
        td { padding: 8px; border: 1px solid #ddd; }
        .disclaimer { font-size: 10px; color: #666; margin-top: 30px; }
        a { color: #0066cc; }
      </style>
    </head>
    <body>
      <h1>Dossier Personale: ${fullName}</h1>
      <p>Generato il: ${new Date().toLocaleDateString()}</p>
      
      <h2>Account Social</h2>
      <table>
        <tr>
          <th>Piattaforma</th>
          <th>Link</th>
        </tr>
        ${dossier.socialLinks.map(link => `
          <tr>
            <td>${link.platform}</td>
            <td><a href="${link.url}" target="_blank">${link.url}</a></td>
          </tr>
        `).join('')}
      </table>
      
      <h2>Notizie</h2>
      <table>
        <tr>
          <th>Titolo</th>
          <th>Fonte</th>
          <th>Data</th>
          <th>Link</th>
        </tr>
        ${dossier.newsResults.map(news => `
          <tr>
            <td>${news.title}</td>
            <td>${news.source}</td>
            <td>${new Date(news.publishedAt).toLocaleDateString()}</td>
            <td><a href="${news.url}" target="_blank">Visita</a></td>
          </tr>
        `).join('')}
      </table>
      
      <h2>Informazioni Personali</h2>
      ${dossier.personalInfo ? `
        ${dossier.personalInfo.emails.length > 0 ? `
          <p><strong>Email:</strong></p>
          <ul>
            ${dossier.personalInfo.emails.map(email => `<li>${email}</li>`).join('')}
          </ul>
        ` : ''}
        
        ${dossier.personalInfo.phones.length > 0 ? `
          <p><strong>Telefono:</strong></p>
          <ul>
            ${dossier.personalInfo.phones.map(phone => `<li>${phone}</li>`).join('')}
          </ul>
        ` : ''}
        
        ${dossier.personalInfo.addresses.length > 0 ? `
          <p><strong>Indirizzi:</strong></p>
          <ul>
            ${dossier.personalInfo.addresses.map(address => `<li>${address}</li>`).join('')}
          </ul>
        ` : ''}
        
        ${dossier.personalInfo.websites.length > 0 ? `
          <p><strong>Siti Web:</strong></p>
          <ul>
            ${dossier.personalInfo.websites.map(website => `<li><a href="${website}" target="_blank">${website}</a></li>`).join('')}
          </ul>
        ` : ''}
      ` : `
        <p>Nessuna informazione personale trovata</p>
      `}
      
      <p class="disclaimer">Nota: Questo è un dossier dimostrativo. In un'applicazione reale, sarebbero utilizzate API come Google Custom Search per trovare informazioni più accurate.</p>
    </body>
    </html>
  `;
  
  // Add MS Word specific metadata
  const wordDocumentContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>Dossier Personale: ${fullName}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        body { font-family: 'Calibri', sans-serif; }
        h1 { color: #333; }
        h2 { color: #444; margin-top: 20px; }
        table { border-collapse: collapse; width: 100%; margin: 10px 0 20px 0; }
        th { background-color: #f2f2f2; text-align: left; padding: 8px; border: 1px solid #ddd; }
        td { padding: 8px; border: 1px solid #ddd; }
        .disclaimer { font-size: 10px; color: #666; margin-top: 30px; }
        a { color: #0066cc; }
      </style>
    </head>
    <body>
      <h1>Dossier Personale: ${fullName}</h1>
      <p>Generato il: ${new Date().toLocaleDateString()}</p>
      
      <h2>Account Social</h2>
      <table>
        <tr>
          <th>Piattaforma</th>
          <th>Link</th>
        </tr>
        ${dossier.socialLinks.map(link => `
          <tr>
            <td>${link.platform}</td>
            <td><a href="${link.url}" target="_blank">${link.url}</a></td>
          </tr>
        `).join('')}
      </table>
      
      <h2>Notizie</h2>
      <table>
        <tr>
          <th>Titolo</th>
          <th>Fonte</th>
          <th>Data</th>
          <th>Link</th>
        </tr>
        ${dossier.newsResults.map(news => `
          <tr>
            <td>${news.title}</td>
            <td>${news.source}</td>
            <td>${new Date(news.publishedAt).toLocaleDateString()}</td>
            <td><a href="${news.url}" target="_blank">Visita</a></td>
          </tr>
        `).join('')}
      </table>
      
      <h2>Informazioni Personali</h2>
      ${dossier.personalInfo ? `
        ${dossier.personalInfo.emails.length > 0 ? `
          <p><strong>Email:</strong></p>
          <ul>
            ${dossier.personalInfo.emails.map(email => `<li>${email}</li>`).join('')}
          </ul>
        ` : ''}
        
        ${dossier.personalInfo.phones.length > 0 ? `
          <p><strong>Telefono:</strong></p>
          <ul>
            ${dossier.personalInfo.phones.map(phone => `<li>${phone}</li>`).join('')}
          </ul>
        ` : ''}
        
        ${dossier.personalInfo.addresses.length > 0 ? `
          <p><strong>Indirizzi:</strong></p>
          <ul>
            ${dossier.personalInfo.addresses.map(address => `<li>${address}</li>`).join('')}
          </ul>
        ` : ''}
        
        ${dossier.personalInfo.websites.length > 0 ? `
          <p><strong>Siti Web:</strong></p>
          <ul>
            ${dossier.personalInfo.websites.map(website => `<li><a href="${website}" target="_blank">${website}</a></li>`).join('')}
          </ul>
        ` : ''}
      ` : `
        <p>Nessuna informazione personale trovata</p>
      `}
      
      <p class="disclaimer">Nota: Questo è un dossier dimostrativo. In un'applicazione reale, sarebbero utilizzate API come Google Custom Search per trovare informazioni più accurate.</p>
    </body>
    </html>
  `;
  
  // Convert to Blob
  const blob = new Blob([wordDocumentContent], { type: 'application/msword' });
  
  // Save file using FileSaver
  saveAs(blob, `${userData.firstName}_${userData.lastName}_dossier.doc`);
};