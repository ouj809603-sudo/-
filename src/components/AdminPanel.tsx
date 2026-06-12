import React, { useState } from "react";
import { PortfolioData, Education, Certification, Experience, GlobalExperience, Project } from "../types";
import { 
  Lock, Unlock, Save, RotateCcw, Plus, Trash2, Edit2, X, Settings2, 
  BookOpen, Award, CheckCircle, Compass, FileCode, Check 
} from "lucide-react";

interface AdminPanelProps {
  data: PortfolioData;
  onSave: (updatedData: PortfolioData) => void;
  onReset: () => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  data,
  onSave,
  onReset,
  isAdmin,
  setIsAdmin
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "edu" | "certs" | "exp" | "global" | "projects">("general");

  // State clones for editing
  const [tempData, setTempData] = useState<PortfolioData>(data);

  // Modal forms states
  const [newBadge, setNewBadge] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "0000") {
      setIsAdmin(true);
      setTempData({ ...data });
      setError("");
      setPassword("");
    } else {
      setError("비밀번호가 올바르지 않습니다.");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  const handleSaveGeneral = () => {
    onSave(tempData);
    alert("기본 정보가 정상적으로 저장되었습니다.");
  };

  const syncData = (updated: PortfolioData) => {
    setTempData(updated);
    onSave(updated);
  };

  // Education Helpers
  const [eduForm, setEduForm] = useState<Partial<Education>>({ institution: "", major: "", info: "" });
  const [editingEduId, setEditingEduId] = useState<string | null>(null);

  const handleAddOrEditEdu = () => {
    if (!eduForm.institution || !eduForm.major) return;
    
    let updatedEduList = [...tempData.educationList];
    if (editingEduId) {
      updatedEduList = updatedEduList.map(item => 
        item.id === editingEduId 
          ? { id: editingEduId, institution: eduForm.institution!, major: eduForm.major!, info: eduForm.info || "" }
          : item
      );
      setEditingEduId(null);
    } else {
      updatedEduList.push({
        id: "edu_" + Date.now(),
        institution: eduForm.institution,
        major: eduForm.major,
        info: eduForm.info || ""
      });
    }
    
    const updated = { ...tempData, educationList: updatedEduList };
    syncData(updated);
    setEduForm({ institution: "", major: "", info: "" });
  };

  const handleDeleteEdu = (id: string) => {
    const updatedEduList = tempData.educationList.filter(item => item.id !== id);
    const updated = { ...tempData, educationList: updatedEduList };
    syncData(updated);
  };

  // Certifications Helpers
  const [certForm, setCertForm] = useState<Partial<Certification>>({ name: "", info: "" });
  const [editingCertId, setEditingCertId] = useState<string | null>(null);

  const handleAddOrEditCert = () => {
    if (!certForm.name || !certForm.info) return;

    let updatedCerts = [...tempData.certifications];
    if (editingCertId) {
      updatedCerts = updatedCerts.map(item =>
        item.id === editingCertId
          ? { id: editingCertId, name: certForm.name!, info: certForm.info! }
          : item
      );
      setEditingCertId(null);
    } else {
      updatedCerts.push({
        id: "cert_" + Date.now(),
        name: certForm.name,
        info: certForm.info
      });
    }

    const updated = { ...tempData, certifications: updatedCerts };
    syncData(updated);
    setCertForm({ name: "", info: "" });
  };

  const handleDeleteCert = (id: string) => {
    const updatedCerts = tempData.certifications.filter(item => item.id !== id);
    const updated = { ...tempData, certifications: updatedCerts };
    syncData(updated);
  };

  // Experiences Helpers
  const [expForm, setExpForm] = useState<Partial<Experience>>({
    period: "", title: "", boldDetails: "", badges: [], description: ""
  });
  const [editingExpId, setEditingExpId] = useState<string | null>(null);

  const handleAddOrEditExp = () => {
    if (!expForm.title || !expForm.period) return;

    let updatedExps = [...tempData.experiences];
    if (editingExpId) {
      updatedExps = updatedExps.map(item =>
        item.id === editingExpId
          ? { 
              id: editingExpId, 
              period: expForm.period!, 
              title: expForm.title!, 
              boldDetails: expForm.boldDetails || "", 
              badges: expForm.badges || [], 
              description: expForm.description || "" 
            }
          : item
      );
      setEditingExpId(null);
    } else {
      updatedExps.push({
        id: "exp_" + Date.now(),
        period: expForm.period,
        title: expForm.title,
        boldDetails: expForm.boldDetails || "",
        badges: expForm.badges || [],
        description: expForm.description || ""
      });
    }

    const updated = { ...tempData, experiences: updatedExps };
    syncData(updated);
    setExpForm({ period: "", title: "", boldDetails: "", badges: [], description: "" });
  };

  const handleDeleteExp = (id: string) => {
    const updatedExps = tempData.experiences.filter(item => item.id !== id);
    const updated = { ...tempData, experiences: updatedExps };
    syncData(updated);
  };

  const handleAddBadge = () => {
    if (!newBadge.trim()) return;
    setExpForm(prev => ({
      ...prev,
      badges: [...(prev.badges || []), newBadge.trim()]
    }));
    setNewBadge("");
  };

  const handleRemoveBadge = (idx: number) => {
    setExpForm(prev => ({
      ...prev,
      badges: (prev.badges || []).filter((_, i) => i !== idx)
    }));
  };

  // Global Experiences Helpers
  const [globalForm, setGlobalForm] = useState<Partial<GlobalExperience>>({ country: "", city: "", text: "" });
  const [editingGlobalId, setEditingGlobalId] = useState<string | null>(null);

  const handleAddOrEditGlobal = () => {
    if (!globalForm.country || !globalForm.text) return;

    let updatedGlobals = [...tempData.globalExperiences];
    if (editingGlobalId) {
      updatedGlobals = updatedGlobals.map(item =>
        item.id === editingGlobalId
          ? { id: editingGlobalId, country: globalForm.country!, city: globalForm.city || "", text: globalForm.text! }
          : item
      );
      setEditingGlobalId(null);
    } else {
      updatedGlobals.push({
        id: "global_" + Date.now(),
        country: globalForm.country,
        city: globalForm.city || "",
        text: globalForm.text
      });
    }

    const updated = { ...tempData, globalExperiences: updatedGlobals };
    syncData(updated);
    setGlobalForm({ country: "", city: "", text: "" });
  };

  const handleDeleteGlobal = (id: string) => {
    const updatedGlobals = tempData.globalExperiences.filter(item => item.id !== id);
    const updated = { ...tempData, globalExperiences: updatedGlobals };
    syncData(updated);
  };

  // Projects Helpers
  const [projectForm, setProjectForm] = useState<Partial<Project>>({ title: "", category: "Gemini", url: "" });
  const [editingProjId, setEditingProjId] = useState<string | null>(null);

  const handleAddOrEditProj = () => {
    if (!projectForm.title || !projectForm.category) return;

    let updatedProjs = [...tempData.projects];
    if (editingProjId) {
      updatedProjs = updatedProjs.map(item =>
        item.id === editingProjId
          ? { id: editingProjId, title: projectForm.title!, category: projectForm.category!, url: projectForm.url || "" }
          : item
      );
      setEditingProjId(null);
    } else {
      updatedProjs.push({
        id: "proj_" + Date.now(),
        title: projectForm.title,
        category: projectForm.category,
        url: projectForm.url || ""
      });
    }

    const updated = { ...tempData, projects: updatedProjs };
    syncData(updated);
    setProjectForm({ title: "", category: "Gemini", url: "" });
  };

  const handleDeleteProj = (id: string) => {
    const updatedProjs = tempData.projects.filter(item => item.id !== id);
    const updated = { ...tempData, projects: updatedProjs };
    syncData(updated);
  };

  return (
    <div className="relative">
      {/* Mini Toggle Floating Button or bar in the Footer */}
      <div className="flex justify-center items-center gap-4 py-8 border-t border-zinc-900 bg-zinc-950/40">
        {!isAdmin ? (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-850 transition-all cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-zinc-500" />
            <span>관리자 메뉴 활성화</span>
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white hover:bg-zinc-850 transition-all cursor-pointer"
            >
              <Settings2 className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" />
              <span>편집 패널 열기</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-950/40 border border-red-900/30 text-xs text-red-400 hover:bg-red-950/80 transition-all cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>로그아웃 (Admin 비활성화)</span>
            </button>
          </div>
        )}
        <button
          onClick={() => {
            if (confirm("정말 포트폴리오 정보를 초기 기본값으로 되돌리시겠습니까?")) {
              onReset();
              alert("기본값으로 초기화되었습니다.");
            }
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-500 hover:text-rose-400 hover:border-rose-950 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>정보 초기화 (Reset)</span>
        </button>
      </div>

      {/* Admin Central Dialog Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-200 flex flex-col shadow-2xl">
            
            {/* Header */}
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings2 className="w-5 h-5 text-blue-500" />
                <div>
                  <h3 className="font-sans font-semibold text-lg text-white">포트폴리오 실시간 관리자 시스템</h3>
                  <p className="text-xs text-zinc-400">데이터는 로컬 스토리지에 즉각 안전하게 보관됩니다.</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            {!isAdmin ? (
              /* LOGIN FORM */
              <div className="p-8 max-w-sm mx-auto my-12 text-center space-y-6">
                <div className="w-12 h-12 bg-zinc-900 rounded-full border border-zinc-800 flex items-center justify-center mx-auto">
                  <Lock className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">관리자 인증이 필요합니다</h4>
                  <p className="text-xs text-zinc-400 mt-1">사전에 지정된 비밀번호를 입력해주세요.</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <input
                      type="password"
                      placeholder="비밀번호 입력"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-center text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      autoFocus
                    />
                    {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors cursor-pointer"
                  >
                    인증 및 활성화
                  </button>
                </form>
              </div>
            ) : (
              /* MAIN ADMIN PANEL */
              <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                
                {/* Left Sidebar Menu */}
                <div className="w-full md:w-56 border-r border-zinc-800/80 bg-zinc-950/60 p-4 shrink-0 overflow-y-auto space-y-1">
                  <button
                    onClick={() => setActiveTab("general")}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer ${
                      activeTab === "general" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                    }`}
                  >
                    <Compass className="w-4 h-4 text-emerald-400" />
                    <span>기본 신상 정보</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("edu")}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer ${
                      activeTab === "edu" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <span>학력 관리</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("certs")}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer ${
                      activeTab === "certs" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                    }`}
                  >
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>자격증 관리</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("exp")}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer ${
                      activeTab === "exp" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 text-indigo-400" />
                    <span>경력 및 대외활동</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("global")}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer ${
                      activeTab === "global" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                    }`}
                  >
                    <Compass className="w-4 h-4 text-pink-400" />
                    <span>글로벌 경험</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("projects")}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer ${
                      activeTab === "projects" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                    }`}
                  >
                    <FileCode className="w-4 h-4 text-violet-400" />
                    <span>과제물 (Project)</span>
                  </button>
                </div>

                {/* Right Workspace */}
                <div className="flex-1 p-6 overflow-y-auto max-h-[550px] bg-zinc-900/10">
                  
                  {/* TAB 1: General */}
                  {activeTab === "general" && (
                    <div className="space-y-5">
                      <div className="border-b border-zinc-800 pb-3">
                        <h4 className="font-sans font-medium text-white text-sm">기본 소개 정보 관리</h4>
                        <p className="text-xs text-zinc-400">웹사이트 최상단에 노출되는 이름과 슬로건입니다.</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1.5 font-medium">이름 (한글)</label>
                          <input
                            type="text"
                            value={tempData.name}
                            onChange={(e) => setTempData({ ...tempData, name: e.target.value })}
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1.5 font-medium">이름 (영문)</label>
                          <input
                            type="text"
                            value={tempData.englishName}
                            onChange={(e) => setTempData({ ...tempData, englishName: e.target.value })}
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-zinc-400 mb-1.5 font-medium">메인 슬로건</label>
                        <textarea
                          rows={2}
                          value={tempData.slogan}
                          onChange={(e) => setTempData({ ...tempData, slogan: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-zinc-400 mb-1.5 font-medium">QR Maker 링크 URL</label>
                        <input
                          type="text"
                          value={tempData.qrMakerUrl}
                          onChange={(e) => setTempData({ ...tempData, qrMakerUrl: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      {/* Admin Profile Image Uploader */}
                      <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                        <label className="block text-xs font-semibold text-white">프로필 얼굴 사진 업로드</label>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center shrink-0">
                            {tempData.profileImage ? (
                              <img src={tempData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-[10px] text-zinc-600 font-mono">No Image</div>
                            )}
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const files = e.target.files;
                                if (files && files.length > 0) {
                                  const file = files[0];
                                  if (file.size > 1.5 * 1024 * 1024) {
                                    alert("파일 크기가 너무 큽니다. 브라우저 저장 한도로 인해 1.5MB 이하의 사진만 업로드 가능합니다.");
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    const base64 = event.target?.result as string;
                                    const img = new Image();
                                    img.src = base64;
                                    img.onload = () => {
                                      let width = img.width;
                                      let height = img.height;
                                      const maxW = 500;
                                      const maxH = 500;
                                      if (width > maxW || height > maxH) {
                                        if (width > height) {
                                          height = Math.round((height * maxW) / width);
                                          width = maxW;
                                        } else {
                                          width = Math.round((width * maxH) / height);
                                          height = maxH;
                                        }
                                      }
                                      const canvas = document.createElement("canvas");
                                      canvas.width = width;
                                      canvas.height = height;
                                      const ctx = canvas.getContext("2d");
                                      if (ctx) {
                                        ctx.drawImage(img, 0, 0, width, height);
                                        setTempData(prev => ({ ...prev, profileImage: canvas.toDataURL("image/jpeg", 0.75) }));
                                      } else {
                                        setTempData(prev => ({ ...prev, profileImage: base64 }));
                                      }
                                    };
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="block w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-zinc-850 file:text-zinc-300 hover:file:bg-zinc-800 cursor-pointer"
                            />
                            {tempData.profileImage && (
                              <button
                                type="button"
                                onClick={() => setTempData(prev => ({ ...prev, profileImage: undefined }))}
                                className="text-[10px] text-red-400 hover:text-red-300 font-mono underline block mt-1 cursor-pointer"
                              >
                                프로필 사진 초기화 (기본 상태로)
                              </button>
                            )}
                            <p className="text-[10px] text-zinc-500 font-mono">PNG / JPG 이미지 지원 · 최적 비율 1:1</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={handleSaveGeneral}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-500 transition-colors cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>기본 정보 저장하기</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Education */}
                  {activeTab === "edu" && (
                    <div className="space-y-6">
                      <div className="border-b border-zinc-800 pb-3">
                        <h4 className="font-sans font-medium text-white text-sm">학력 관리</h4>
                        <p className="text-xs text-zinc-400">출신 대학, 전공, 복수전공을 기재하세요.</p>
                      </div>

                      {/* Add Form */}
                      <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 space-y-4">
                        <div className="font-medium text-xs text-white">
                          {editingEduId ? "학력 정보 수정" : "새로운 학력 등록"}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-zinc-400 mb-1">기관명 (대학교 등)</label>
                            <input
                              type="text"
                              value={eduForm.institution}
                              onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                              placeholder="경상국립대학교"
                              className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs focus:ring-1"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-zinc-400 mb-1">전공 정보</label>
                            <input
                              type="text"
                              value={eduForm.major}
                              onChange={(e) => setEduForm({ ...eduForm, major: e.target.value })}
                              placeholder="경영학부 재학 & 복수전공"
                              className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs focus:ring-1"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] text-zinc-400 mb-1">비고 / 부가설명</label>
                          <input
                            type="text"
                            value={eduForm.info}
                            onChange={(e) => setEduForm({ ...eduForm, info: e.target.value })}
                            placeholder="복수전공 등 상세 사항"
                            className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs focus:ring-1"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleAddOrEditEdu}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-xs font-semibold text-white flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>{editingEduId ? "수정 완료" : "추가하기"}</span>
                          </button>
                          {editingEduId && (
                            <button
                              onClick={() => {
                                setEditingEduId(null);
                                setEduForm({ institution: "", major: "", info: "" });
                              }}
                              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs font-semibold text-zinc-300 cursor-pointer"
                            >
                              취소
                            </button>
                          )}
                        </div>
                      </div>

                      {/* List */}
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-zinc-400">등록된 학력 목록</div>
                        {tempData.educationList.map((edu) => (
                          <div key={edu.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                            <div>
                              <div className="text-xs font-bold text-white">{edu.institution}</div>
                              <div className="text-xs text-zinc-400">{edu.major} <span className="text-[10px] text-zinc-600">| {edu.info}</span></div>
                            </div>
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingEduId(edu.id);
                                  setEduForm({ institution: edu.institution, major: edu.major, info: edu.info });
                                }}
                                className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteEdu(edu.id)}
                                className="p-1 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: Certifications */}
                  {activeTab === "certs" && (
                    <div className="space-y-6">
                      <div className="border-b border-zinc-800 pb-3">
                        <h4 className="font-sans font-medium text-white text-sm">자격증 관리</h4>
                        <p className="text-xs text-zinc-400">취득한 자격증 정보를 수정하거나 추가할 수 있습니다.</p>
                      </div>

                      {/* Add/Edit Form */}
                      <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 space-y-4">
                        <div className="font-medium text-xs text-white">
                          {editingCertId ? "자격증 수정" : "새로운 자격증 등록"}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-zinc-400 mb-1">자격증명</label>
                            <input
                              type="text"
                              value={certForm.name}
                              onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                              placeholder="컴퓨터활용능력 1급"
                              className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs focus:ring-1"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-zinc-400 mb-1">인증 기관 등 정보</label>
                            <input
                              type="text"
                              value={certForm.info}
                              onChange={(e) => setCertForm({ ...certForm, info: e.target.value })}
                              placeholder="대한상공회의소 주관"
                              className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs focus:ring-1"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleAddOrEditCert}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-xs font-semibold text-white flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>{editingCertId ? "수정 완료" : "추가하기"}</span>
                          </button>
                          {editingCertId && (
                            <button
                              onClick={() => {
                                setEditingCertId(null);
                                setCertForm({ name: "", info: "" });
                              }}
                              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs font-semibold text-zinc-300 cursor-pointer"
                            >
                              취소
                            </button>
                          )}
                        </div>
                      </div>

                      {/* List */}
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-zinc-400">등록된 자격증 목록</div>
                        {tempData.certifications.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                            <div>
                              <div className="text-xs font-bold text-white">{item.name}</div>
                              <div className="text-xs text-zinc-400">{item.info}</div>
                            </div>
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingCertId(item.id);
                                  setCertForm({ name: item.name, info: item.info });
                                }}
                                className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCert(item.id)}
                                className="p-1 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: Experiences */}
                  {activeTab === "exp" && (
                    <div className="space-y-6">
                      <div className="border-b border-zinc-800 pb-3">
                        <h4 className="font-sans font-medium text-white text-sm">경력 및 활동 사항 관리</h4>
                        <p className="text-xs text-zinc-400">KOTRA 등 대외활동, 아르바이트, 수상 내역을 한눈에 관리합니다.</p>
                      </div>

                      <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 space-y-4">
                        <div className="font-medium text-xs text-white">
                          {editingExpId ? "활동 정보 수정" : "새로운 활동 등록"}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-zinc-400 mb-1">기간 (예: 2024.01 - 2024.06)</label>
                            <input
                              type="text"
                              value={expForm.period}
                              onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                              placeholder="2024.01 - 2024.06"
                              className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs focus:ring-1"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-zinc-400 mb-1">제목 (예: YLC 수료, 공군 전역 등)</label>
                            <input
                              type="text"
                              value={expForm.title}
                              onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
                              placeholder="대외활동 / 경력명"
                              className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs focus:ring-1"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] text-zinc-400 mb-1">강조 내용 (볼드 처리 영역)</label>
                          <input
                            type="text"
                            value={expForm.boldDetails}
                            onChange={(e) => setExpForm({ ...expForm, boldDetails: e.target.value })}
                            placeholder="예: Meta/LinkedIn 광고 집행 및 BuyKorea 바이어 미팅"
                            className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs focus:ring-1"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-zinc-400 mb-1">상세 상세설명 (줄글)</label>
                          <textarea
                            rows={3}
                            value={expForm.description}
                            onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                            placeholder="상세적인 성과 및 활동 설명을 간단히 입력해 주세요."
                            className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs focus:ring-1 focus:outline-none"
                          />
                        </div>

                        {/* Badges System */}
                        <div className="space-y-2">
                          <label className="block text-[11px] text-zinc-400">강조 태그/배지 관리</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newBadge}
                              onChange={(e) => setNewBadge(e.target.value)}
                              placeholder="배지 입력 (예: 마케팅)"
                              className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs flex-1"
                            />
                            <button
                              type="button"
                              onClick={handleAddBadge}
                              className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-xs text-white cursor-pointer"
                            >
                              태그 추가
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {(expForm.badges || []).map((b, idx) => (
                              <span key={idx} className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950/40 border border-blue-900/40 text-[10px] text-blue-300">
                                <span>{b}</span>
                                <button type="button" onClick={() => handleRemoveBadge(idx)} className="text-blue-400 hover:text-red-400">×</button>
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={handleAddOrEditExp}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-xs font-semibold text-white flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>{editingExpId ? "수정 완료" : "추가하기"}</span>
                          </button>
                          {editingExpId && (
                            <button
                              onClick={() => {
                                setEditingExpId(null);
                                setExpForm({ period: "", title: "", boldDetails: "", badges: [], description: "" });
                              }}
                              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs font-semibold text-zinc-300 cursor-pointer"
                            >
                              취소
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Experiences List */}
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-zinc-400">등록된 이력 목록</div>
                        {tempData.experiences.map((exp) => (
                          <div key={exp.id} className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="text-[10px] text-zinc-500 font-mono">{exp.period}</span>
                                <h5 className="text-xs font-bold text-white mt-0.5">{exp.title}</h5>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => {
                                    setEditingExpId(exp.id);
                                    setExpForm(exp);
                                  }}
                                  className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded cursor-pointer"
                                >
                                  <Edit2 className="w-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteExp(exp.id)}
                                  className="p-1 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded cursor-pointer"
                                >
                                  <Trash2 className="w-3" />
                                </button>
                              </div>
                            </div>
                            
                            {exp.boldDetails && (
                              <p className="text-[11px] text-zinc-300 font-medium font-sans border-l border-zinc-800 pl-2">
                                {exp.boldDetails}
                              </p>
                            )}

                            {exp.badges && exp.badges.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {exp.badges.map((b, i) => (
                                  <span key={i} className="text-[9px] px-1.5 py-0.5 bg-zinc-800 text-zinc-400 rounded">
                                    {b}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 5: Global Experience */}
                  {activeTab === "global" && (
                    <div className="space-y-6">
                      <div className="border-b border-zinc-800 pb-3">
                        <h4 className="font-sans font-medium text-white text-sm">글로벌 경험 관리</h4>
                        <p className="text-xs text-zinc-400">세계 지도를 대신하여 노출되는 해외 탐방/경험 목록입니다.</p>
                      </div>

                      <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 space-y-4">
                        <div className="font-medium text-xs text-white">
                          {editingGlobalId ? "국가 경험 수정" : "새로운 국가 경험 추가"}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-zinc-400 mb-1">국가 (예: 베트남)</label>
                            <input
                              type="text"
                              value={globalForm.country}
                              onChange={(e) => setGlobalForm({ ...globalForm, country: e.target.value })}
                              placeholder="베트남"
                              className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs focus:ring-1"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-zinc-400 mb-1">도시명 (예: 다낭 등)</label>
                            <input
                              type="text"
                              value={globalForm.city}
                              onChange={(e) => setGlobalForm({ ...globalForm, city: e.target.value })}
                              placeholder="다낭"
                              className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs focus:ring-1"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] text-zinc-400 mb-1">배운 점 / 인사이트</label>
                          <textarea
                            rows={2}
                            value={globalForm.text}
                            onChange={(e) => setGlobalForm({ ...globalForm, text: e.target.value })}
                            placeholder="글로벌 경험에 대해 서술해 주세요."
                            className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-xs rounded focus:ring-1 focus:outline-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleAddOrEditGlobal}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-xs font-semibold text-white flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>{editingGlobalId ? "수정 완료" : "추가하기"}</span>
                          </button>
                          {editingGlobalId && (
                            <button
                              onClick={() => {
                                setEditingGlobalId(null);
                                setGlobalForm({ country: "", city: "", text: "" });
                              }}
                              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs font-semibold text-zinc-300 cursor-pointer"
                            >
                              취소
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        {tempData.globalExperiences.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                            <div>
                              <div className="text-xs font-bold text-white">{item.country} {item.city && `(${item.city})`}</div>
                              <div className="text-[11px] text-zinc-400 mt-0.5">{item.text}</div>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  setEditingGlobalId(item.id);
                                  setGlobalForm(item);
                                }}
                                className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteGlobal(item.id)}
                                className="p-1 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 6: Projects */}
                  {activeTab === "projects" && (
                    <div className="space-y-6">
                      <div className="border-b border-zinc-800 pb-3">
                        <h4 className="font-sans font-medium text-white text-sm">과제물 (Project Archive) 관리</h4>
                        <p className="text-xs text-zinc-400">보고서 및 동영상 작품을 필터에 맞춰 기재하세요.</p>
                      </div>

                      <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 space-y-4">
                        <div className="font-medium text-xs text-white">
                          {editingProjId ? "프로젝트 수정" : "새로운 과제물 추가"}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-zinc-400 mb-1">과제 타이틀 (프로젝트 이름)</label>
                            <input
                              type="text"
                              value={projectForm.title}
                              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                              placeholder="만년필 사업 소비자 조사 보고서"
                              className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs focus:ring-1"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-zinc-400 mb-1">카테고리 구분</label>
                            <select
                              value={projectForm.category}
                              onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as any })}
                              className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs focus:ring-1 text-white"
                            >
                              <option value="Gemini">Gemini</option>
                              <option value="Mixboard">Mixboard</option>
                              <option value="Grok">Grok</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] text-zinc-400 mb-1">외부 링크 (유튜브/노션 등 - Grok인 경우 중요)</label>
                          <input
                            type="text"
                            value={projectForm.url}
                            onChange={(e) => setProjectForm({ ...projectForm, url: e.target.value })}
                            placeholder="Grok 유튭 주소: https://youtu.be/tyh-BH_MNQc?si=8TXIBJZz17HXh5eU"
                            className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs focus:ring-1"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={handleAddOrEditProj}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-xs font-semibold text-white flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>{editingProjId ? "수정 완료" : "추가등록"}</span>
                          </button>
                          {editingProjId && (
                            <button
                              onClick={() => {
                                setEditingProjId(null);
                                setProjectForm({ title: "", category: "Gemini", url: "" });
                              }}
                              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs font-semibold text-zinc-300 cursor-pointer"
                            >
                              취소
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Projects List */}
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-zinc-400">등록된 과제물 전체 목록 ({tempData.projects.length}개)</div>
                        {tempData.projects.map((proj) => (
                          <div key={proj.id} className="flex items-center justify-between p-2.5 rounded bg-zinc-900 border border-zinc-800">
                            <div>
                              <div className="text-xs font-bold text-white">{proj.title}</div>
                              <div className="flex gap-2 mt-0.5">
                                <span className="text-[9px] uppercase px-1.5 py-0.2 bg-zinc-800 text-zinc-400 rounded-sm font-mono border border-zinc-800">
                                  {proj.category}
                                </span>
                                {proj.url && (
                                  <span className="text-[9px] text-rose-400 truncate max-w-xs">{proj.url}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-1.5 ml-3 shrink-0">
                              <button
                                onClick={() => {
                                  setEditingProjId(proj.id);
                                  setProjectForm({ title: proj.title, category: proj.category, url: proj.url });
                                }}
                                className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProj(proj.id)}
                                className="p-1 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            )}

            {/* Footer containing save/close */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 hover:bg-zinc-900 rounded-lg text-xs font-semibold text-zinc-300 cursor-pointer"
              >
                닫기 (Close)
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
