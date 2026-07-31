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
  tagline: "Building scalable software, intelligent AI solutions, and modern web applications from backend to frontend.",
  location: "Pune, India",
  email: "nikhilkenjale1314@gmail.com",
  github: "https://github.com/nikhilken14",
  linkedin: "https://www.linkedin.com/in/nikhilkenjale1314a10/",
  about: "Software Engineer with expertise in Java, Spring Boot, Python, and React.Passionate about building scalable REST APIs, backend systems, and AI-powered applications using clean architecture, modern development practices, and cloud technologies."
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
