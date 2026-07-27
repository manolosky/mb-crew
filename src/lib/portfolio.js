import portfolio from '@/data/portfolio.json';

// Single access point for portfolio content. Swap the import for a fetch()
// against a REST endpoint later without touching any component.
export const getPortfolio = () => portfolio;

export const getProfile = () => portfolio.profile;

export const getHobbies = () => portfolio.hobbies;

export const getSkills = () => portfolio.skills;

export const getExperience = () => portfolio.experience;

export const getProjects = () => portfolio.projects;

export const getEducation = () => portfolio.education;
