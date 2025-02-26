export interface UserData {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  location: string;
}

export interface DossierResult {
  socialLinks: SocialLink[];
  newsResults: NewsItem[];
  personalInfo: PersonalInfo | null;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface NewsItem {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

export interface PersonalInfo {
  emails: string[];
  phones: string[];
  addresses: string[];
  websites: string[];
}