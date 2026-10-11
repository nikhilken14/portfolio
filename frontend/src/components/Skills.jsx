import {
  LuBookOpen, LuBot, LuBrain, LuCloud, LuCode, LuSlidersHorizontal, LuChartColumn,
} from "react-icons/lu";
import { FaJava } from "react-icons/fa6";
import {
  SiPython, SiSpringboot, SiPostgresql, SiMysql, SiMongodb, SiRedis, SiDocker, SiLinux, SiPostman,
  SiGit, SiReact, SiHtml5, SiCss, SiBootstrap, SiNodedotjs, SiFastapi, SiPytorch, SiLangchain,
  SiHuggingface, SiTensorflow, SiOpencv, SiGnubash,
} from "react-icons/si";
import Section from "./Section";
import { SKILL_GROUPS } from "../data/portfolio";

// Monochrome icons so the list reads as one system, not a sticker sheet.
const ICONS = {
  Java: FaJava, Python: SiPython, SQL: SiPostgresql, Bash: SiGnubash,
  "React.js": SiReact, HTML5: SiHtml5, CSS3: SiCss, Bootstrap: SiBootstrap,
  FastAPI: SiFastapi, "Spring Boot": SiSpringboot, "Node.js": SiNodedotjs,
  "Machine Learning": SiTensorflow, "Deep Learning": LuBrain, PyTorch: SiPytorch,
  "Computer Vision (CNNs, Transfer Learning)": SiOpencv,
  "Retrieval-Augmented Generation (RAG)": LuBookOpen, "Large Language Models (LLMs)": LuBot,
  "LangChain / LangGraph": SiLangchain, "Hugging Face Transformers": SiHuggingface,
  "QLoRA / PEFT Fine-Tuning": LuSlidersHorizontal,
  PostgreSQL: SiPostgresql, MySQL: SiMysql, MongoDB: SiMongodb, Redis: SiRedis,
  "Git / GitHub": SiGit, Docker: SiDocker, Linux: SiLinux, Postman: SiPostman,
  "AWS / OCI": LuCloud, "Power BI": LuChartColumn,
};

export default function Skills() {
  return (
    <Section id="skills" title="Skills" intro="The languages, frameworks and tools I reach for." tone="white">
      <div>
        {SKILL_GROUPS.map((g) => (
          <div className="skills__row" key={g.category}>
            <h3 className="skills__cat">{g.category}</h3>
            <ul className="skills__list">
              {g.items.map((name) => {
                const Icon = ICONS[name] || LuCode;
                return (
                  <li className="skills__item" key={name}>
                    <Icon size={16} aria-hidden="true" /> {name}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
