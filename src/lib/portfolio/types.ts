export type Profile = {
  id: string
  name: string
  nameAr: string | null
  title: string
  titleAr: string | null
  subtitle: string | null
  subtitleAr: string | null
  bio: string
  bioAr: string | null
  email: string
  phone: string | null
  whatsapp: string | null
  linkedin: string | null
  github: string | null
  twitter: string | null
  instagram: string | null
  facebook: string | null
  website: string | null
  avatarUrl: string | null
  resumeUrl: string | null
  location: string | null
  locationAr: string | null
  yearsOfExp: number
  projectsCount: number
  available: boolean
}

export type Education = {
  id: string
  degree: string
  degreeAr: string | null
  institution: string
  institutionAr: string | null
  description: string | null
  descriptionAr: string | null
  startDate: string
  endDate: string | null
  isCurrent: boolean
  location: string | null
  sortOrder: number
}

export type Skill = {
  id: string
  name: string
  nameAr: string
  level: string
  category: string
  categoryAr: string
  icon: string | null
  sortOrder: number
}

export type Experience = {
  id: string
  company: string
  companyAr: string | null
  position: string
  positionAr: string | null
  description: string
  descriptionAr: string | null
  startDate: string
  endDate: string | null
  isCurrent: boolean
  location: string | null
  type: string
  logoUrl: string | null
  websiteUrl: string | null
  sortOrder: number
}

export type ProjectTechnology = {
  id: string
  name: string
  projectId: string
}

export type ProjectHighlight = {
  id: string
  text: string
  projectId: string
}

export type Project = {
  id: string
  title: string
  titleAr: string | null
  slug: string
  description: string
  descriptionAr: string | null
  longDescription: string | null
  imageUrl: string | null
  liveUrl: string | null
  githubUrl: string | null
  company: string | null
  companyAr: string | null
  category: string
  featured: boolean
  sortOrder: number
  technologies: ProjectTechnology[]
  highlights: ProjectHighlight[]
}

export type Service = {
  id: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  icon: string
  features: string
  featuresAr: string
  sortOrder: number
}

export type Stat = {
  id: string
  label: string
  labelAr: string
  value: string
  color: string
  sortOrder: number
}

export type Integration = {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  icon: string
  category: string
  sortOrder: number
}

export type Testimonial = {
  id: string
  name: string
  position: string | null
  company: string | null
  content: string
  avatarUrl: string | null
  rating: number
  sortOrder: number
}

export type PortfolioData = {
  profile: Profile | null
  skills: Skill[]
  experiences: Experience[]
  educations: Education[]
  services: Service[]
  testimonials: Testimonial[]
  stats: Stat[]
  integrations: Integration[]
}
