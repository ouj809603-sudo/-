export interface Education {
  id: string;
  institution: string;
  major: string;
  duration?: string;
  info?: string;
}

export interface Certification {
  id: string;
  name: string;
  info: string;
}

export interface Experience {
  id: string;
  period: string;
  title: string;
  boldDetails?: string;
  badges?: string[];
  description?: string;
}

export interface GlobalExperience {
  id: string;
  country: string;
  city: string;
  text: string;
}

export interface Project {
  id: string;
  title: string;
  category: "Gemini" | "Mixboard" | "Grok";
  image?: string; // Base64 image data url for visual preview
  fileData?: string; // Base64 document/file data url for download
  fileName?: string; // Attached file name
  url?: string; // YouTube or other links
}

export interface PortfolioData {
  name: string;
  englishName: string;
  slogan: string;
  qrMakerUrl: string;
  profileImage?: string; // Storing user's face image (Base64 data url)
  educationList: Education[];
  certifications: Certification[];
  experiences: Experience[];
  globalExperiences: GlobalExperience[];
  projects: Project[];
}
