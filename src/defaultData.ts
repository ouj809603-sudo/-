import { PortfolioData } from "./types";
import profileImageFile from "./assets/images/profile_avatar_1781269066726.jpg";

export const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  name: "오우진",
  englishName: "Oh Woo-jin",
  slogan: "경영과 지식재산, 그리고 AI로 트렌드를 기획합니다.",
  qrMakerUrl: "https://ohuj-gif.github.io/qr-maker/",
  profileImage: profileImageFile,
  educationList: [
    {
      id: "edu_1",
      institution: "경상국립대학교",
      major: "경영학부 재학 & 지식재산융합학과 복수전공",
      info: "경상남도 진주시 소재 국립대학교"
    }
  ],
  certifications: [
    {
      id: "cert_1",
      name: "컴퓨터활용능력 1급",
      info: "대한상공회의소 주관"
    },
    {
      id: "cert_2",
      name: "한국사능력검정시험 1급",
      info: "국사편찬위원회 주관"
    }
  ],
  experiences: [
    {
      id: "exp_1",
      period: "2023.03 - 2024.12",
      title: "공군 병장 만기전역",
      description: "성실한 군 생활 및 복무 기간 내에 리더십 함양"
    },
    {
      id: "exp_2",
      period: "2024 (수료)",
      title: "KOTRA 주관 대외활동 'Dexters 3기' 수료",
      boldDetails: "동해씨푸드 협업, Meta/LinkedIn 광고 집행, BuyKorea 활용 베트남 바이어 컨택 및 미팅 조율",
      badges: ["KOTRA", "마케팅 광고 집행", "바이어 컨택", "글로벌 비즈니스"],
      description: "동해씨푸드와의 실무 협업을 통해 Meta 및 LinkedIn 광고를 직접 설계하고 집행하였으며, KOTRA의 BuyKorea 플랫폼을 활용하여 진정성 있는 베트남 바이어 컨택 프로세스를 주도했습니다."
    },
    {
      id: "exp_3",
      period: "2024 (수상)",
      title: "미래내일 일경험 프로젝트형 5기 Campus Challenge 우수상",
      boldDetails: "주제: 공공정보의 콘텐츠 윤리",
      badges: ["고용노동부", "우수상", "콘텐츠 윤리", "실무 프로젝트"],
      description: "공공정보의 신뢰성과 안전한 사용을 위한 콘텐츠 인공지능 윤리 가이드라인 및 기획 연구로 우수상 수상."
    },
    {
      id: "exp_4",
      period: "수료",
      title: "YLC 미디어홍보팀 수료",
      badges: ["YLC", "홍보/미디어"],
      description: "전국대학생경제연합(YLC) 미디어 기획 및 홍보 콘텐츠 제작"
    },
    {
      id: "exp_5",
      period: "수료",
      title: "상상마케팅스쿨 수료",
      badges: ["KT&G 상상마당", "마케팅 기획"],
      description: "실전 마케팅 케이스 스터디 및 브랜드 솔루션 기획 프로세스 이수"
    },
    {
      id: "exp_6",
      period: "2022.07 - 2022.10",
      title: "진주 휴게소 아르바이트",
      description: "고객 대면 서비스 제공 및 매장 재고 관리, 신속한 협력 능력 배양"
    },
    {
      id: "exp_7",
      period: "졸업",
      title: "초·중·고교 졸업 및 수상",
      boldDetails: "전체 개근상 수상, 수학경시대회 장려상, 논술대회 동상",
      description: "성실함의 척도인 12년 전개근 및 다양한 학업적 도전 성과 입증"
    }
  ],
  globalExperiences: [
    {
      id: "global_1",
      country: "베트남",
      city: "다낭",
      text: "첫 해외여행, 언어와 소통의 중요성을 깨닫고 글로벌 푸드 초이스의 안목을 넓히다."
    },
    {
      id: "global_2",
      country: "일본",
      city: "오사카, 후쿠오카",
      text: "친구들과의 여행, 전통을 중시하는 문화적 가치와 다름의 인사이트를 체득하다."
    }
  ],
  projects: [
    {
      id: "proj_g_1",
      title: "비례를 변화한 신제품 팥죽 기획서",
      category: "Gemini",
      url: "https://chartreuse-manchego-783.notion.site/37c3f98581f680bca465d94fc0a5f81e?source=copy_link"
    },
    {
      id: "proj_g_2",
      title: "색상을 변화한 허브 족발 신제품 기획서",
      category: "Gemini",
      url: "https://chartreuse-manchego-783.notion.site/37c3f98581f68005bd09c73639456b56?source=copy_link"
    },
    {
      id: "proj_g_3",
      title: "레드 망고 떡볶이 신상품 기획서",
      category: "Gemini",
      url: "https://chartreuse-manchego-783.notion.site/Red-Mango-Tteokbokki-90c8dffc0a1e4690ba74895cf5fc7796?source=copy_link"
    },
    {
      id: "proj_g_4",
      title: "실루엣의 변화 : 에어로 플로우 우유팩 신상품 기획서",
      category: "Gemini",
      url: "https://chartreuse-manchego-783.notion.site/Aero-Flow-Milk-e88d43237ae443769e4911500dc124c5?source=copy_link"
    },
    {
      id: "proj_g_5",
      title: "감자칩의 크기를 변화 : '더 그레이트 칩' 신상품 기획서",
      category: "Gemini",
      url: "https://chartreuse-manchego-783.notion.site/37c3f98581f680e2ace8df0e5125140b?source=copy_link"
    },
    {
      id: "proj_m_1",
      title: "숫자 컨텐츠를 변화하다 : 홍어5합 신제품 기획서",
      category: "Mixboard",
      url: "https://chartreuse-manchego-783.notion.site/37c3f98581f680f9b44be5a92168823f?source=copy_link"
    },
    {
      id: "proj_m_2",
      title: "칼로리를 기준으로 분할 : '100kcal 식빵 기획서'",
      category: "Mixboard",
      url: "https://chartreuse-manchego-783.notion.site/100Kcal-37c3f98581f680558c0aea1f8095abad?source=copy_link"
    },
    {
      id: "proj_m_3",
      title: "'고성 파도 맥주' 시공간 콘텐츠를 활용하여 신제품 기획",
      category: "Mixboard",
      url: "https://chartreuse-manchego-783.notion.site/37d3f98581f68000bc92f62427910d6d?source=copy_link"
    },
    {
      id: "proj_m_4",
      title: "알레아토릭 기법을 통한 신상품 기획안 모음",
      category: "Mixboard",
      url: "https://chartreuse-manchego-783.notion.site/37d3f98581f6803c9296f7bc07734fdd?source=copy_link"
    },
    {
      id: "proj_m_5",
      title: "수건의 소재를 대체 : \"박스타월\" 기획서",
      category: "Mixboard",
      url: "https://chartreuse-manchego-783.notion.site/37d3f98581f680bb9da9e0885464df92?source=copy_link"
    },
    {
      id: "proj_g_6",
      title: "테니스 의류 매장 기획안",
      category: "Gemini",
      url: "https://chartreuse-manchego-783.notion.site/37d3f98581f680f5b676fd9e2ffe19d4?source=copy_link"
    },
    {
      id: "proj_gr_1",
      title: "마카롱 신제품 홍보 동영상",
      category: "Grok",
      url: "https://youtu.be/tyh-BH_MNQc?si=8TXIBJZz17HXh5eU"
    }
  ]
};
