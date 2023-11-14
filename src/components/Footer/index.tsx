import { About } from "../About";

export const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 flex justify-center justify-self-end w-full p-2.5 ">
      <span className="text-slate-500 text-sm">
        Made with ♡ in Wroclaw ⸱ <About />
      </span>
    </footer>
  );
};
