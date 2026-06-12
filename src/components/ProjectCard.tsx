import React, { useRef, useState } from "react";
import { Project } from "../types";
import { 
  Play, Sparkles, Sliders, ExternalLink, Trash2, Edit3, 
  Upload, FileText, X, Paperclip, Download, Image as ImageIcon 
} from "lucide-react";
import { processFile } from "../lib/imageHelper";

interface ProjectCardProps {
  project: Project;
  isAdmin: boolean;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
  onUpdateProject?: (updatedProject: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isAdmin,
  onEdit,
  onDelete,
  onUpdateProject
}) => {
  const isGrok = project.category === "Grok";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleClick = (e: React.MouseEvent) => {
    // If there is an external URL, redirect to it
    if (project.url) {
      window.open(project.url, "_blank", "noopener,noreferrer");
    }
  };

  const getRandomGradient = (title: string) => {
    const sum = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const degree = sum % 360;
    return `linear-gradient(${degree}deg, rgba(239,246,255,0.7) 0%, rgba(219,234,254,0.8) 100%)`;
  };

  // Trigger file manager
  const handlePlaceholderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Drag handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isGrok && isAdmin) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isGrok || !isAdmin) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFile(files[0]);
    }
  };

  // Handle uploaded file
  const handleFile = async (file: File) => {
    if (!isAdmin) return;
    setUploadError("");
    
    // Check size limit (LocalStorage limit is 5MB in total, so we restrict single files to 1.5MB)
    if (file.size > 1.5 * 1024 * 1024) {
      setUploadError("파일 크기가 너무 큽니다. 브라우저 저장 한도로 인해 1.5MB 이하의 파일만 업로드할 수 있습니다.");
      return;
    }

    try {
      const result = await processFile(file);
      
      const updatedProject: Project = { ...project };
      
      if (result.isImage) {
        // If it's an image, set it as the cover image
        updatedProject.image = result.base64;
      } else {
        // If it's a general report file, store it
        updatedProject.fileData = result.base64;
        updatedProject.fileName = result.name;
      }

      if (onUpdateProject) {
        onUpdateProject(updatedProject);
      }
    } catch {
      setUploadError("파일 처리 과정에서 에러가 발생했습니다.");
    }
  };

  // Clear specific uploaded fields
  const handleClearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateProject) {
      onUpdateProject({ ...project, image: undefined });
    }
  };

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateProject) {
      onUpdateProject({ ...project, fileData: undefined, fileName: undefined });
    }
  };

  // Download attached report file
  const handleDownloadFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!project.fileData || !project.fileName) return;

    const link = document.createElement("a");
    link.href = project.fileData;
    link.download = project.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      onClick={handleClick}
      className={`group relative flex flex-col rounded-2xl overflow-hidden bg-white border transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 ${
        isDragging 
          ? "border-blue-500 bg-blue-50/50" 
          : "border-slate-200 hover:border-blue-300/80"
      } ${project.url ? 'cursor-pointer' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden file selector input */}
      {!isGrok && (
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*, application/pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, text/plain"
          className="hidden"
        />
      )}

      {/* 
        [DEVELOPER INSTRUCTION / 가이드]:
        여기에 디자인 가이드에 따른 이미지 소스나 파일 업로드 구현
        To use custom images directly from code, load project.image or modify the block below.
        예: <img src={project.image || "/images/placeholder.jpg"} className="w-full h-full object-cover" />
      */}
      <div 
        className="aspect-[4/3] w-full bg-slate-50 border-b border-slate-100 flex flex-col items-center justify-center relative p-4 overflow-hidden transition-all duration-300"
      >
        {/* Img coverage background */}
        {project.image ? (
          <>
            <img 
              src={project.image} 
              alt={project.title} 
              className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 group-hover:scale-105"
            />
            {/* Dark glass cover to keep text readable */}
                     {/* Edit tool hovering buttons */}
            {!isGrok && isAdmin && (
              <div className="absolute top-2 right-2 z-20 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={handlePlaceholderClick}
                  className="p-1 px-2.5 bg-blue-600 hover:bg-blue-700 text-[10px] font-semibold text-white rounded-md cursor-pointer flex items-center gap-1 shadow-md"
                  title="다른 이미지 업로드"
                >
                  <Upload className="w-2.5 h-2.5" />
                  <span>변경</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="p-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-md cursor-pointer shadow-md"
                  title="이미지 제거"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div 
              className="absolute inset-0 opacity-100 transition-opacity duration-300"
              style={{ background: getRandomGradient(project.title) }}
            ></div>
            
            {/* Decorative Grid Lines to look tech-forward & polished */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:14px_24px]"></div>
 
            {/* Click-to-upload indicator shown explicitly for Gemini and Mixboard */}
            {!isGrok && isAdmin && (
              <button
                onClick={handlePlaceholderClick}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 bg-white/95 backdrop-blur-sm transition-all duration-300 cursor-pointer"
              >
                <div className="p-3 rounded-full bg-blue-50 border border-blue-100 text-blue-600 group-hover:scale-115 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs text-slate-700 font-sans font-bold mt-3">파일 및 이미지 업로드</span>
                <span className="text-[9px] text-slate-400 font-mono mt-1">드래그 앤 드롭 지원 · Max 1.5MB</span>
              </button>
            )}
          </>
        )}

        {/* Status / Category indicator */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-2 pointer-events-none">
          {!project.image && (
            <>
              {project.category === "Gemini" && (
                <Sparkles className="w-8 h-8 text-indigo-500 group-hover:scale-110 transition-transform duration-300" />
              )}
              {project.category === "Mixboard" && (
                <Sliders className="w-8 h-8 text-sky-500 group-hover:scale-110 transition-transform duration-300" />
              )}
              {project.category === "Grok" && (
                <Play className="w-8 h-8 text-rose-500 fill-rose-500/10 group-hover:scale-110 transition-transform duration-300" />
              )}
              
              <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded-full border border-blue-100">
                {project.category} Core
              </span>
            </>
          )}
          
          {project.url && (
            <div className={`flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded border-2 pointer-events-auto shadow-sm tracking-tight ${
              isGrok 
                ? "text-rose-600 bg-rose-50 border-rose-100" 
                : project.category === "Gemini"
                  ? "text-indigo-600 bg-indigo-50 border-indigo-100"
                  : "text-sky-600 bg-sky-50 border-sky-100"
            }`}>
              {isGrok ? (
                <Play className="w-3.5 h-3.5 fill-rose-600/20" />
              ) : (
                <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
              )}
              <span>{isGrok ? "동영상 재생 (YouTube)" : "바로가기 (외부 링크)"}</span>
            </div>
          )}
        </div>
      </div>

      {/* Info Header & Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-sans font-bold text-base tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5 flex-wrap">
              <span>{project.title}</span>
              {project.url && (
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 shrink-0 transition-colors" />
              )}
            </h4>
          </div>

          {/* Attached Document file pill */}
          {project.fileName && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs mt-2 group/file shadow-inner">
              <div className="flex items-center gap-2 truncate text-slate-700 max-w-[80%] font-semibold">
                <Paperclip className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate" title={project.fileName}>{project.fileName}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleDownloadFile}
                  className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-200/50 rounded transition-colors cursor-pointer"
                  title="파일 다운로드"
                >
                  <Download className="w-3 h-3" />
                </button>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={handleClearFile}
                    className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                    title="첨부 파일 삭제"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Error messages if any */}
          {uploadError && (
            <p className="text-[10px] text-red-500 mt-1 font-mono">{uploadError}</p>
          )}

          {/* Prompt/Guide to upload empty state for non-Grok report cards */}
          {!isGrok && !project.image && !project.fileName && isAdmin && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-blue-600 transition-colors cursor-pointer w-fit" onClick={handlePlaceholderClick}>
              <ImageIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
              <span>직접 컴퓨터의 이미지/보고서 파일 올리기...</span>
            </div>
          )}
        </div>

        {/* Admin Overlay actions */}
        {isAdmin && (
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onEdit && onEdit(project)}
              className="p-1.5 text-slate-500 hover:text-amber-605 transition-colors bg-slate-50 border border-slate-100 rounded-md hover:bg-amber-50 cursor-pointer"
              title="프로젝트 타이틀 수정"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete && onDelete(project.id)}
              className="p-1.5 text-slate-500 hover:text-red-600 transition-colors bg-slate-50 border border-slate-100 rounded-md hover:bg-red-50 cursor-pointer"
              title="프로젝트 카드 삭제"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
