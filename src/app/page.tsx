import Image from "next/image";
import logo from "../assets/vaseLogo.svg";

export default function Home() {
  return (
    <main className="flex h-full items-center justify-center p-12">
      <div className="relative w-full h-3/5">
        <Image src={logo} alt="Vase Studio Logo" fill />
      </div>
    </main>
  );
}
