import Image from "next/image";

interface props {
  heading: string;
  brief: string;
  heading2: string;
  brief2: string;
}

const Panel = ({ heading, brief, heading2, brief2 }: props) => {
  return (
    <div className="relative w-full h-full">
      <Image
        src="/login/background.png"
        alt="Background Login"
        fill
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover z-[-1] rounded-xl"
      />
      <div className="h-full flex flex-col justify-between py-28">
        <div>
          <h1 className="text-white text-center text-[40px] font-black leading-none">
            {heading}
          </h1>
          <p className="text-white text-center text-[22px] font-medium">
            {brief}
          </p>
        </div>
        <div>
          <h1 className="text-white text-center text-[40px] font-black leading-none pb-4">
            {heading2}
          </h1>
          <p className="text-white text-center text-[22px] font-medium">
            {brief2}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Panel;
