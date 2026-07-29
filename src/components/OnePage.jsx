import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { Experience } from '@/components/sections/Experience';
import { Hero } from '@/components/sections/Hero';
import { Projects } from '@/components/sections/Projects';
import { Stack } from '@/components/sections/Stack';
import {
  getClientWork,
  getExperience,
  getHobbies,
  getProfile,
  getProjects,
  getSkills,
} from '@/lib/portfolio';

// The whole one-page; every route renders this and scrolls to its section.
export const OnePage = () => {
  const profile = getProfile();

  return (
    <div className="relative flex-1 overflow-x-clip">
      <a
        href="#top"
        className="focus:bg-brand-end sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <Navbar />
      <main>
        <Hero profile={profile} />
        <About profile={profile} hobbies={getHobbies()} />
        <Stack skills={getSkills()} />
        <Experience experience={getExperience()} />
        <Projects projects={getProjects()} clientWork={getClientWork()} />
        <Contact profile={profile} />
      </main>
      <Footer />
    </div>
  );
};
