import { About } from "../About/About";

export const Footer = () => {
  return (
    <footer className="flex p-2.5 justify-center">
      <span className="text-slate-500 text-sm">
        Made with ♡ in Wroclaw ⸱ <About />
      </span>
    </footer>
  );
};
