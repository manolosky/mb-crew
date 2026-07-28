import { LogoMark } from '@/components/layout/Navbar';

export const Footer = () => {
  return (
    <footer className="text-faint mx-auto flex w-full max-w-[1120px] flex-wrap items-center justify-between gap-4 px-[clamp(20px,5vw,48px)] pb-14 text-[13.5px]">
      <div className="flex items-center gap-2.5">
        <LogoMark className="h-[34px]" />© {new Date().getFullYear()} Manuel Bolaños
      </div>
    </footer>
  );
};
