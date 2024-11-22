import MainHero from "../components/MainHero.js";
import Header from "../components/Header.js";
import About from "../components/About.js";
import MainHeroImage from "../components/MainHeroImage.js";
export default function IndexPage() {
  return (
    <div
      className={`bg-background flex flex-col gap-y-2 lg:gap-y-6 overflow-hidden`}
    >
      <Header />
      <div className={`relative bg-background `}>
        <div className="mt-8  relative flex flex-col w-full justify-around items-center lg:flex lg:flex-row">
          <div className={`w-5/6 lg:w-1/2 p-6 mt-1`}>
            <MainHero />
          </div>

          <MainHeroImage />
        </div>
      </div>
      <About />
    </div>
  );
}