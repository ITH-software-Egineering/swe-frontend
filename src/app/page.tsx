import AppNavBar from "@/components/ui/navbar";
import ProjectsAccordion from "./projectsAccordion";

export default function Home() {
  return (
    <>
      <AppNavBar />
      <div className="mx-6">
        <p>Welcome Clement,</p>
        <ProjectsAccordion />
      </div>
    </>
  );
}
