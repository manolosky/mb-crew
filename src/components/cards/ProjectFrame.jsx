// Shared shell for the project grid cards: hover-lift container, 172px header
// art area with the striped backdrop, and the ember badge pill.
export const ProjectFrame = ({ badge, header, children }) => {
  return (
    <div className="bg-surface border-line-soft hover:shadow-lift-lg hover:border-brand-line flex flex-col overflow-hidden rounded-[20px] border transition duration-200 hover:-translate-y-1">
      <div className="border-line-soft relative flex h-[172px] items-center justify-center border-b bg-[repeating-linear-gradient(45deg,#1b1916_0_11px,#211e1a_11px_22px)]">
        {header}
        <span className="bg-brand-gradient-soft text-ink-on-brand absolute top-3.5 left-3.5 rounded-full px-2.5 py-[5px] font-mono text-[11px] font-medium">
          {badge}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-[22px]">{children}</div>
    </div>
  );
};
