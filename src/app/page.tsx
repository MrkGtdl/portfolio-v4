import Hero from "../components/Hero";
import Header from "../components/Header";
import Work from "../components/Work";
import WorkTransition from "../components/WorkTransition";

export default function Home() {
  return (
    <main>
      <Header />

      <section id="home">
        <Hero />
      </section>

      <WorkTransition>
        <section id="work">
          <Work />
        </section>
      </WorkTransition>
    </main>
  );
}