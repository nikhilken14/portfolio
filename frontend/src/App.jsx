import { useEffect, useState } from "react";
import AppNavbar from "./components/AppNavbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Certifications from "./components/Certifications";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import {
  getProfile,
  getSkills,
  getProjects,
  getEducation,
  getExperience,
  getCertifications,
} from "./api/client";
import "./App.css";

// Local fallback so the page still renders something sensible
// if the FastAPI backend is unreachable (e.g. during first load or offline dev).
const FALLBACK_PROFILE = {
  name: "Nikhil Kenjale",
  role: "Software Engineer",
  tagline: "I build fast, reliable products end-to-end — from database to pixel.",
  location: "Bengaluru, India",
  email: "alex.carter.dev@example.com",
  github: "https://github.com/alexcarter-dev",
  linkedin: "https://linkedin.com/in/alexcarter-dev",
  about:
    "I'm a full-stack engineer who enjoys turning ambiguous problems into clean, maintainable systems.",
};

export default function App() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [profileData, skillsData, projectsData, educationData, experienceData, certificationsData] =
          await Promise.all([
            getProfile(),
            getSkills(),
            getProjects(),
            getEducation(),
            getExperience(),
            getCertifications(),
          ]);

        if (!isMounted) return;
        setProfile(profileData);
        setSkills(skillsData);
        setProjects(projectsData);
        setEducation(educationData);
        setExperience(experienceData);
        setCertifications(certificationsData);
      } catch (err) {
        console.error("Failed to reach the API, using fallback content:", err);
        if (!isMounted) return;
        setApiError(true);
        setProfile(FALLBACK_PROFILE);
        setSkills([]);
        setProjects([]);
        setEducation([]);
        setExperience([]);
        setCertifications([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <AppNavbar />
      <main>
        <Hero profile={profile} />
        <About profile={profile} />
        {skills.length > 0 && <Skills skills={skills} />}
        {projects.length > 0 && <Projects projects={projects} />}
        {experience.length > 0 && <Experience experience={experience} />}
        {education.length > 0 && <Education education={education} />}
        {certifications.length > 0 && <Certifications certifications={certifications} />}
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
      {apiError && (
        <div className="api-banner">
          Couldn't reach the backend — showing limited content. Make sure the FastAPI server is
          running.
        </div>
      )}
    </>
  );
}
