import React, { useState, useEffect } from "react";
import { PortfolioData, Project } from "./types";
import { DEFAULT_PORTFOLIO_DATA } from "./defaultData";
import { AuroraBackground } from "./components/ui/aurora-background";
import { ProjectCard } from "./components/ProjectCard";
import { ProjectFilter } from "./components/ProjectFilter";
import { AdminPanel } from "./components/AdminPanel";
import { 
  GraduationCap, Award, Calendar, Globe, Mail, Copy, 
  ExternalLink, User, Check, Sparkles, Sliders, Play, Lock, Terminal, ShieldAlert,
  Upload
} from "lucide-react";
import { processFile } from "./lib/imageHelper";

export default function App() {
  const [data, setData] = useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [copied, setCopied] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("oh_woojin_portfolio_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Fallback for fields in case schema evolved
        if (parsed.projects && parsed.name) {
          const hasOldProjects = parsed.projects.some((p: any) => 
            p.title.includes("한화이글스") || 
            p.title.includes("만년필") || 
            p.title.includes("카페 메뉴판") || 
            (p.category === "Gemini" && !p.url)
          );
          if (hasOldProjects || !parsed.profileImage) {
            setData(DEFAULT_PORTFOLIO_DATA);
            localStorage.setItem("oh_woojin_portfolio_data", JSON.stringify(DEFAULT_PORTFOLIO_DATA));
          } else {
            // If saved profileImage contains raw source path, update it to bundled path
            if (parsed.profileImage && parsed.profileImage.startsWith("/src/assets/")) {
              parsed.profileImage = DEFAULT_PORTFOLIO_DATA.profileImage;
              localStorage.setItem("oh_woojin_portfolio_data", JSON.stringify(parsed));
            }
            setData(parsed);
          }
        }
      } catch (e) {
        console.error("Failed to load saved data, using default.", e);
      }
    }
  }, []);

  // Sync data handler
  const handleSaveData = (updated: PortfolioData) => {
    try {
      setData(updated);
      localStorage.setItem("oh_woojin_portfolio_data", JSON.stringify(updated));
    } catch (error) {
      console.error("LocalStorage write failed:", error);
      alert(
        "⚠️ 저장 용량 제한 오류!\n\n현재 업로드하신 파일이나 이미지 크기가 브라우저 저장공간 한도(5MB)를 초과했습니다.\n\n해결 방법:\n1. 더 작게 압축된 이미지 또는 1.5MB 이하의 파일을 업로드해 주세요.\n2. 기존에 등록된 다른 과제의 사진이나 첨부파일을 제거해 저장 공간을 확보해 주세요."
      );
    }
  };

  // Reset to default handler
  const handleReset = () => {
    setData(DEFAULT_PORTFOLIO_DATA);
    localStorage.setItem("oh_woojin_portfolio_data", JSON.stringify(DEFAULT_PORTFOLIO_DATA));
  };

  // Filter project cards logic
  const filteredProjects = activeFilter === "all"
    ? data.projects
    : data.projects.filter(p => p.category === activeFilter);

  // Filter count badge calculator
  const counts = {
    all: data.projects.length,
    gemini: data.projects.filter(p => p.category === "Gemini").length,
    mixboard: data.projects.filter(p => p.category === "Mixboard").length,
    grok: data.projects.filter(p => p.category === "Grok").length
  };

  // Copy Email to Clipboard helper
  const handleCopyEmail = () => {
    navigator.clipboard.writeText("ouj809603@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Delete project from main page
  const handleDeleteProject = (id: string) => {
    const updatedProjects = data.projects.filter(p => p.id !== id);
    const updated = { ...data, projects: updatedProjects };
    handleSaveData(updated);
  };

  // Edit / update single project from card
  const handleEditProject = (proj: Project) => {
    const newTitle = prompt("프로젝트의 새로운 이름을 지정해주세요:", proj.title);
    if (newTitle === null) return;
    const newUrl = proj.category === "Grok" 
      ? prompt("새로운 유튜브 링크 동영상 URL을 지정해주세요:", proj.url || "") 
      : proj.url;

    const updatedProjects = data.projects.map(p => 
      p.id === proj.id ? { ...p, title: newTitle || p.title, url: newUrl !== null ? newUrl : p.url } : p
    );
    const updated = { ...data, projects: updatedProjects };
    handleSaveData(updated);
  };

  // Update single project directly (e.g. upload images or documents)
  const handleUpdateProject = (updatedProj: Project) => {
    const updatedProjects = data.projects.map(p => 
      p.id === updatedProj.id ? updatedProj : p
    );
    const updated = { ...data, projects: updatedProjects };
    handleSaveData(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-850 antialiased selection:bg-blue-500/10 selection:text-slate-900">
      
      {/* Sticky Header Nav */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg font-bold tracking-tight text-slate-900">
              {data.name}
            </span>
            <span className="font-mono text-[10px] uppercase text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded font-bold">
              Woo-jin Portfolio
            </span>
          </div>
 
          <nav className="hidden md:flex items-center gap-6">
            <a href="#hero" className="text-xs font-bold text-slate-950 hover:text-blue-600 transition-colors">소개</a>
            <a href="#resume" className="text-xs font-bold text-slate-950 hover:text-blue-600 transition-colors">프로필 & 이력</a>
            <a href="#projects" className="text-xs font-bold text-slate-950 hover:text-blue-600 transition-colors">과제물 아카이브</a>
            <a href="#contact" className="text-xs font-bold text-slate-950 hover:text-blue-600 transition-colors">연락처</a>
          </nav>
 
          {/* Admin Status Tag */}
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium rounded-full animate-pulse">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                <span>Admin Mode</span>
              </span>
            ) : (
              <a 
                href="#contact" 
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-sm shadow-blue-200/60"
              >
                <Mail className="w-3.5 h-3.5 text-white/90" />
                <span>Contact Me</span>
              </a>
            )}
          </div>
        </div>
      </header>
 
      {/* SECTION 1: HERO */}
      <section id="hero" className="relative w-full min-h-[90vh] flex items-center justify-center bg-white">
        <AuroraBackground>
          <div className="relative z-10 text-center max-w-3xl px-6 space-y-8 py-20">
            
            {/* Elegant Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <p className="font-mono text-[10px] tracking-widest text-blue-600 font-bold uppercase">
                Active & Innovating
              </p>
            </div>
 
            {/* Slogan with high impact typography */}
            <div className="space-y-4">
              <span className="text-sm font-sans font-semibold tracking-widest text-blue-500 uppercase block">
                PORTFOLIO OF {data.englishName.toUpperCase()}
              </span>
              <h1 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl tracking-tight text-slate-900 leading-tight">
                {data.slogan}
              </h1>
            </div>
 
            {/* Button Actions - QR Maker link removed as requested */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="#resume"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white transition-all cursor-pointer shadow-lg shadow-blue-200 hover:scale-[1.01]"
              >
                <span>학력 및 전체 이력 보러가기</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
 
          </div>
        </AuroraBackground>
        
        {/* Abstract Scroll Guide inside Hero */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-400 font-mono text-[9px] tracking-widest z-10 uppercase">
          <span>Scroll Down</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-blue-300 to-transparent"></div>
        </div>
      </section>
 
      {/* MAIN CONTAINER */}
      <main className="mx-auto max-w-7xl px-6 py-20 space-y-36">
 
        {/* SECTION 2: RESUME & GLOBAL */}
        <section id="resume" className="scroll-mt-24 space-y-16">
          
          <div className="border-l-4 border-blue-500 pl-4">
            <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-slate-900">
              Resume & Profiling
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              경상국립대학교 경영학을 전공하며 지식재산과 AI 기획을 조화롭게 이끌어왔습니다.
            </p>
          </div>
 
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Brief Bio Card */}
            <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-7 relative overflow-hidden flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
              <div className="space-y-6">
                
                {/* Visual Avatar / Profile Photo Frame - Enlarged as requested */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-slate-100 bg-slate-50/50 p-5 rounded-2xl border border-slate-150">
                  <div className="relative group/avatar w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0 shadow-lg flex items-center justify-center transition-all duration-300 hover:border-blue-500/50">
                    {data.profileImage ? (
                      <img 
                        src={data.profileImage} 
                        alt={data.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <User className="w-10 h-10 text-slate-400 group-hover/avatar:text-blue-500 transition-colors" />
                        <span className="text-[9px] mt-1 text-slate-500 font-mono">No Image</span>
                      </div>
                    )}
                    
                    {/* Hover Upload trigger overlay */}
                    {isAdmin && (
                      <label className="absolute inset-0 bg-blue-900/90 flex flex-col items-center justify-center gap-1 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 cursor-pointer text-center p-2">
                        <Upload className="w-5 h-5 text-white" />
                        <span className="text-[10px] font-bold text-white">사진 업로드</span>
                        <span className="text-[8px] text-blue-200 font-mono">Browse image</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={async (e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              const file = files[0];
                              if (file.size > 1.5 * 1024 * 1024) {
                                alert("파일 크기가 너무 큽니다. 브라우저 저장 한도로 인해 1.5MB 이하의 사진만 업로드 가능합니다.");
                                return;
                              }
                              try {
                                const result = await processFile(file);
                                if (result.isImage) {
                                  handleSaveData({ ...data, profileImage: result.base64 });
                                } else {
                                  alert("이미지 파일만 등록가능합니다.");
                                }
                              } catch (err) {
                                console.error(err);
                                alert("이미지 로딩 중 오류가 발생했습니다.");
                              }
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                  
                  <div className="space-y-1.5 flex-1">
                    <span className="text-[10px] text-blue-600 font-mono font-bold uppercase tracking-widest block">PERSONAL PROFILE</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-2xl font-bold text-slate-900 leading-none">{data.name}</h3>
                      {data.profileImage && isAdmin && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("프로필 사진을 제거하고 기본 아이콘으로 돌아가시겠습니까?")) {
                              handleSaveData({ ...data, profileImage: undefined });
                            }
                          }}
                          className="text-[9px] bg-red-50 border border-red-200 text-red-600 font-mono px-1.5 py-0.5 rounded hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{data.englishName}</p>
                    <p className="text-[11px] text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded-md font-semibold font-mono w-fit">경영 · 지식재산 · AI 융합</p>
                  </div>
                </div>
 
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg shrink-0 mt-0.5 border border-blue-100/50">
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">학력 (Education)</h4>
                      {data.educationList.map((edu) => (
                        <div key={edu.id} className="mt-1">
                          <p className="text-sm font-bold text-slate-950">{edu.institution}</p>
                          <p className="text-xs text-slate-500">{edu.major}</p>
                        </div>
                      ))}
                    </div>
                  </div>
 
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg shrink-0 mt-0.5 border border-blue-100/50">
                      <Award className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">핵심 자격증 (Certifications)</h4>
                      <div className="space-y-2 mt-1.5">
                        {data.certifications.map((item) => (
                          <div key={item.id} className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900">{item.name}</span>
                            <span className="text-[11px] text-slate-500">{item.info}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
 
              <div className="border-t border-slate-100 pt-4 mt-8 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">2026 OWOOJIN RESUME</span>
                <span className="text-[11px] text-slate-500 font-medium">경상국립대학교 경영학전공</span>
              </div>
            </div>
 
            {/* Experience timeline grid */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[10px] text-blue-600 font-mono uppercase tracking-widest font-bold block">EXPERIENCES & DELEGATES</span>
              
              <div className="space-y-4">
                {data.experiences.map((exp) => {
                  const isKotra = exp.title.includes("KOTRA") || exp.title.includes("Dexters");
                  const isChallenge = exp.title.includes("Challenge") || exp.title.includes("우수상");
                  const isCore = isKotra || isChallenge;
 
                  return (
                    <div 
                      key={exp.id} 
                      className={`p-6 rounded-2xl transition-all duration-300 ${
                        isCore 
                          ? "bg-white border-2 border-blue-100 hover:border-blue-300 shadow-[0_4px_20px_rgba(59,130,246,0.03)]" 
                          : "bg-white border border-slate-200/80 hover:border-slate-300 shadow-sm"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50/50 px-2.5 py-0.5 rounded-full border border-blue-100/50">
                            {exp.period}
                          </span>
                          {isKotra && (
                            <span className="text-[9px] uppercase px-1.5 py-0.5 bg-blue-600 text-white rounded-md font-bold font-mono">
                              KOTRA Core
                            </span>
                          )}
                          {isChallenge && (
                            <span className="text-[9px] uppercase px-1.5 py-0.5 bg-indigo-600 text-white rounded-md font-bold font-mono">
                              Awarded
                            </span>
                          )}
                        </div>
                      </div>
 
                      <h4 className={`text-base font-bold text-slate-900 mt-2.5`}>
                        {exp.title}
                      </h4>
 
                      {exp.boldDetails && (
                        <p className="mt-2 text-sm text-slate-800 font-semibold leading-relaxed bg-blue-50/30 p-3 rounded-xl border-l-4 border-blue-500 font-sans">
                          {exp.boldDetails}
                        </p>
                      )}
 
                      {exp.description && (
                        <p className="mt-1.5 text-xs text-slate-500 leading-relaxed pl-2">
                          {exp.description}
                        </p>
                      )}
 
                      {exp.badges && exp.badges.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3.5">
                          {exp.badges.map((badge, idx) => (
                            <span 
                              key={idx} 
                              className={`text-[9px] px-2.5 py-0.5 rounded font-mono font-semibold ${
                                isKotra 
                                  ? "bg-blue-50 text-blue-600 border border-blue-100" 
                                  : "bg-slate-100 text-slate-600 border border-slate-200/60"
                              }`}
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
 
          </div>
 
          {/* Global Experience Grid (Replacing old map) */}
          <div className="pt-10 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <Globe className="w-5 h-5 text-blue-600" />
              <h3 className="font-display font-bold text-lg text-slate-900">Global Experience (해외 인사이트)</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.globalExperiences.map((item) => (
                <div 
                  key={item.id}
                  className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase">DESTINATION</span>
                      <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {item.country} <span className="text-sm font-medium text-slate-500">({item.city})</span>
                      </h4>
                    </div>
                    <span className="text-2xl opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300">✈️</span>
                  </div>
                  <p className="mt-4 text-xs text-slate-500 leading-relaxed font-medium">
                    "{item.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>
 
        </section>
 
        {/* SECTION 3: PROJECT GALLERY */}
        <section id="projects" className="scroll-mt-24 space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-slate-900">
              AI Project Archive
            </h2>
            <p className="text-xs text-slate-500 max-w-lg mx-auto font-medium">
              과제가 지향하는 핵심 가치에 집중할 수 있도록 단순하고 깔끔한 타이틀과 편리하게 수정이 가능한 이미지 플레이스홀더를 제공합니다.
            </p>
          </div>
 
          {/* Filtering Tab buttons */}
          <ProjectFilter 
            activeTab={activeFilter} 
            setActiveTab={setActiveFilter} 
            counts={counts} 
          />
 
          {/* Project Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProjects.map((proj) => (
              <ProjectCard 
                key={proj.id} 
                project={proj} 
                isAdmin={isAdmin}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
                onUpdateProject={handleUpdateProject}
              />
            ))}
          </div>
 
          {filteredProjects.length === 0 && (
            <div className="text-center py-16 border border-dashed border-slate-300 rounded-2xl bg-white">
              <p className="text-sm text-slate-500">선택한 카테고리에 속해 있는 과제물이 아직 없습니다.</p>
              {isAdmin && (
                <p className="text-xs text-blue-600 mt-2 font-semibold">관리자 메뉴를 열어 간편하게 과제물을 임의 등록할 수 있습니다!</p>
              )}
            </div>
          )}
        </section>
 
        {/* SECTION 4: CONTACT & FOOTER */}
        <section id="contact" className="scroll-mt-24 pt-10 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-4">
              <span className="text-[10px] text-blue-600 font-mono uppercase tracking-widest font-bold block">GET IN TOUCH</span>
              <h3 className="font-sans font-bold text-2xl text-slate-900">가치를 함께 창조할 수 있는 인연을 기다립니다.</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                경영, 지식재산융합, 그리고 AI 기반의 비즈니스 트렌드 기획에 관심이 있으시거나 업무 협업 제안 의사가 있으시다면 언제든지 아래 연락처로 연락 주시기 바랍니다.
              </p>
            </div>
 
            {/* Copyable email card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 flex flex-col justify-between space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">PRIMARY EMAIL</span>
                  <p className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">ouj809603@gmail.com</p>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="p-3 bg-blue-50 hover:bg-blue-100 rounded-xl text-blue-600 hover:text-blue-700 transition-all cursor-pointer relative border border-blue-100/50"
                  title="이메일 주소 복사하기"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-500 animate-scale-up" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded font-bold whitespace-nowrap shadow-md">
                      복사 완료!
                    </span>
                  )}
                </button>
              </div>
 
              {/* Links and placeholders */}
              <div className="flex items-center gap-4 text-xs text-slate-400 font-semibold">
                <span className="font-mono">SNS PLACEHOLDERS :</span>
                <span className="hover:text-blue-600 cursor-pointer">Instagram</span>
                <span>•</span>
                <span className="hover:text-blue-600 cursor-pointer">LinkedIn</span>
                <span>•</span>
                <span className="hover:text-blue-600 cursor-pointer">Meta</span>
              </div>
            </div>
 
          </div>
        </section>
 
      </main>
 
      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-12 mt-20">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-xs text-slate-500 font-medium">
              © 2026 {data.name} ({data.englishName}). All rights reserved.
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              본 사이트는 React & TypeScript & Tailwind CSS로 구현된 100% 모던 미니멀리스트 싱글 페이지 포트폴리오(SPA)입니다.
            </p>
          </div>
 
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-blue-600 uppercase font-mono font-bold bg-blue-50 px-2.5 py-1 rounded border border-blue-100/60">Designed for Premium Light & Blue Canvas</span>
          </div>
        </div>
 
        {/* Administration console hook */}
        <div className="mt-8">
          <AdminPanel 
            data={data}
            onSave={handleSaveData}
            onReset={handleReset}
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
          />
        </div>
      </footer>
 
    </div>
  );
}
