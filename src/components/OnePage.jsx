import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { Experience } from '@/components/sections/Experience';
import { Hero } from '@/components/sections/Hero';
import { Projects } from '@/components/sections/Projects';
import { Stack } from '@/components/sections/Stack';
import { getExperience, getHobbies, getProfile, getProjects, getSkills } from '@/lib/portfolio';

// The whole one-page; every route renders this and scrolls to its section.
export const OnePage = () => {
  const profile = getProfile();

  return (
    <div className="relative flex-1 overflow-x-clip">
      <Navbar />
      <main>
        <Hero profile={profile} />
        <About profile={profile} hobbies={getHobbies()} />
        <Stack skills={getSkills()} />
        <Experience experience={getExperience()} />
        <Projects projects={getProjects()} />
        <Contact profile={profile} />
      </main>
      <Footer />
    </div>
  );
};
