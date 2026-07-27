import {
  FaArrowUpRightFromSquare,
  FaBrain,
  FaCartShopping,
  FaCode,
  FaCube,
  FaDownload,
  FaEnvelope,
  FaGithub,
  FaGlobe,
  FaGraduationCap,
  FaHeart,
  FaLinkedinIn,
  FaMicrochip,
  FaPaperPlane,
  FaPeopleGroup,
  FaPhone,
  FaRobot,
  FaScrewdriverWrench,
  FaServer,
  FaWifi,
  FaWindowMaximize,
} from 'react-icons/fa6';

// The portfolio JSON stores Font Awesome class names; this registry resolves
// them to tree-shakeable react-icons components.
const ICONS = {
  'fa-solid fa-arrow-up-right-from-square': FaArrowUpRightFromSquare,
  'fa-solid fa-globe': FaGlobe,
  'fa-solid fa-brain': FaBrain,
  'fa-solid fa-cart-shopping': FaCartShopping,
  'fa-solid fa-code': FaCode,
  'fa-solid fa-cube': FaCube,
  'fa-solid fa-download': FaDownload,
  'fa-solid fa-envelope': FaEnvelope,
  'fa-brands fa-github': FaGithub,
  'fa-solid fa-graduation-cap': FaGraduationCap,
  'fa-solid fa-heart': FaHeart,
  'fa-brands fa-linkedin-in': FaLinkedinIn,
  'fa-solid fa-microchip': FaMicrochip,
  'fa-solid fa-paper-plane': FaPaperPlane,
  'fa-solid fa-people-group': FaPeopleGroup,
  'fa-solid fa-phone': FaPhone,
  'fa-solid fa-robot': FaRobot,
  'fa-solid fa-screwdriver-wrench': FaScrewdriverWrench,
  'fa-solid fa-server': FaServer,
  'fa-solid fa-wifi': FaWifi,
  'fa-solid fa-window-maximize': FaWindowMaximize,
};

export const getIcon = (name) => ICONS[name] ?? null;

// Renders the icon registered under `name`, or nothing when unknown.
export const Icon = ({ name, ...props }) => {
  const Component = getIcon(name);

  if (null === Component) {
    return null;
  }

  // getIcon returns a module-level constant, never a component built per render.
  // eslint-disable-next-line react-hooks/static-components
  return <Component aria-hidden="true" {...props} />;
};
