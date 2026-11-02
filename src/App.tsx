import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  X,
  Bookmark,
  Layers,
  Sparkles,
  Briefcase,
  GraduationCap,
  Sun,
  Moon,
  ChevronDown,
  Building,
  RotateCcw,
} from 'lucide-react';
import {
  COMPANIES_DATA,
  VALUE_CHAIN_CATEGORIES,
  Company,
} from './data/mobilityData';
import { CompanyCard } from './components/CompanyCard';
import { CompanyModal } from './components/CompanyModal';
import { ValueChainFlow } from './components/ValueChainFlow';
import { MajorFilterSection } from './components/MajorFilterSection';
import { ComparisonDrawer } from './components/ComparisonDrawer';
import { JobListSection } from './components/JobListSection';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return (
      localStorage.getItem('mobimap_theme') === 'dark' ||
      (!('mobimap_theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mobimap_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mobimap_theme', 'light');
    }
  }, [darkMode]);

  // Active navigation view: 'explore' (ecosystem + directory), 'jobs' (job board), 'bookmarks' (saved)
  const [activeView, setActiveView] = useState<'explore' | 'jobs' | 'bookmarks'>('explore');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedScale, setSelectedScale] = useState<string>('all');
  const [selectedMajor, setSelectedMajor] = useState<string | null>(null);
  const [freshGradOnly, setFreshGradOnly] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Selected company for detail modal
  const [modalCompany, setModalCompany] = useState<Company | null>(null);

  // Bookmarked companies list (persisted)
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mobimap_bookmarks');
      return saved ? JSON.parse(saved) : ['42dot', 'hyundai-mobis', 'ecopro-bm'];
    } catch {
      return ['42dot', 'hyundai-mobis', 'ecopro-bm'];
    }
  });

  useEffect(() => {
    localStorage.setItem('mobimap_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (companyId: string) => {
    if (bookmarks.includes(companyId)) {
      setBookmarks(bookmarks.filter((id) => id !== companyId));
    } else {
      setBookmarks([...bookmarks, companyId]);
    }
  };

  // Compare companies list (up to 3)
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false);

  const toggleCompare = (companyId: string) => {
    if (compareIds.includes(companyId)) {
      setCompareIds(compareIds.filter((id) => id !== companyId));
    } else {
      if (compareIds.length >= 3) {
        alert('기업 비교는 최대 3개까지 가능합니다.');
        return;
      }
      setCompareIds([...compareIds, companyId]);
      setIsCompareDrawerOpen(true);
    }
  };

  // Pre-curated Popular Tag Suggestions
  const popularTags = [
    '#자율주행',
    '#배터리셀',
    '#BMS',
    '#양극재',
    '#라이다',
    '#테슬라납품',
    '#현대차그룹',
    '#SDV',
    '#전기차충전기',
    '#폐배터리재활용',
  ];

  // Filtering Logic
  const filteredCompanies = useMemo(() => {
    return COMPANIES_DATA.filter((comp) => {
      // Bookmark filter view
      if (activeView === 'bookmarks' && !bookmarks.includes(comp.id)) {
        return false;
      }

      // Search query matches company name, english name, category, role, keyTech, downstream/upstream, or tags
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = comp.name.toLowerCase().includes(q);
        const matchEng = comp.englishName.toLowerCase().includes(q);
        const matchCategory = comp.category.toLowerCase().includes(q);
        const matchDesc = comp.shortDescription.toLowerCase().includes(q);
        const matchTech = comp.valueChainPosition.keyTech.some((t) => t.toLowerCase().includes(q));
        const matchDown = comp.valueChainPosition.downstream.some((d) => d.toLowerCase().includes(q));
        const matchUp = comp.valueChainPosition.upstream.some((u) => u.toLowerCase().includes(q));
        const matchTags = comp.tags.some((t) => t.toLowerCase().includes(q));
        const matchJobs = comp.jobs.some(
          (j) => j.title.toLowerCase().includes(q) || j.techStack.some((s) => s.toLowerCase().includes(q))
        );

        if (
          !matchName &&
          !matchEng &&
          !matchCategory &&
          !matchDesc &&
          !matchTech &&
          !matchDown &&
          !matchUp &&
          !matchTags &&
          !matchJobs
        ) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory && comp.categoryId !== selectedCategory) {
        return false;
      }

      // Tier filter
      if (selectedTier !== 'all' && comp.tier !== selectedTier) {
        return false;
      }

      // Scale filter
      if (selectedScale !== 'all' && comp.scale !== selectedScale) {
        return false;
      }

      // Tag filter
      if (selectedTag && !comp.tags.includes(selectedTag)) {
        return false;
      }

      // Fresh graduate only filter
      if (freshGradOnly) {
        const hasFreshJob = comp.jobs.some(
          (j) => j.experienceLevel === '대졸신입' || j.experienceLevel === '채용연계형 인턴'
        );
        if (!hasFreshJob) return false;
      }

      // Major track filter
      if (selectedMajor) {
        const majorMap: Record<string, string[]> = {
          ee: ['전자전기공학', '전자공학', '전기공학', '제어계측공학', '전력전자공학'],
          cs: ['컴퓨터공학', '인공지능학', '소프트웨어학', '수학/통계학', '정보통신공학'],
          me: ['기계공학', '자동차공학', '메카트로닉스', '로봇공학', '산업공학'],
          chem: ['화학공학', '신소재공학', '무기재료공학', '금속공학', '응용화학과', '환경공학'],
        };
        const targetMajors = majorMap[selectedMajor] || [];
        const matchesMajor = comp.jobSeekerIntel.recommendedMajors.some((m) =>
          targetMajors.some((tm) => m.includes(tm) || tm.includes(m))
        );
        if (!matchesMajor) return false;
      }

      return true;
    });
  }, [
    activeView,
    bookmarks,
    searchQuery,
    selectedCategory,
    selectedTier,
    selectedScale,
    selectedTag,
    freshGradOnly,
    selectedMajor,
  ]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedTier('all');
    setSelectedScale('all');
    setSelectedTag(null);
    setSelectedMajor(null);
    setFreshGradOnly(false);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory ||
    selectedTier !== 'all' ||
    selectedScale !== 'all' ||
    selectedTag ||
    selectedMajor ||
    freshGradOnly;

  const compareCompanies = COMPANIES_DATA.filter((c) => compareIds.includes(c.id));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* 1. TOP BAR CONTRACT */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand wordmark (single text element, no subtitle pill) */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('explore');
              resetAllFilters();
            }}
            className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              M
            </div>
            <span>MobiMap</span>
          </a>

          {/* Zone 2: Navigation Links (4-5 single-line clean text links) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-400">
            <button
              type="button"
              onClick={() => {
                setActiveView('explore');
                setSelectedCategory(null);
              }}
              className={`whitespace-nowrap transition-colors hover:text-slate-900 dark:hover:text-white ${
                activeView === 'explore' && !selectedCategory
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : ''
              }`}
            >
              산업 생태계 지도
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView('explore');
              }}
              className="whitespace-nowrap transition-colors hover:text-slate-900 dark:hover:text-white"
            >
              기업 백과사전
            </button>
            <button
              type="button"
              onClick={() => setActiveView('jobs')}
              className={`whitespace-nowrap transition-colors hover:text-slate-900 dark:hover:text-white ${
                activeView === 'jobs' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
              }`}
            >
              엔지니어 채용공고
            </button>
            <button
              type="button"
              onClick={() => setActiveView('bookmarks')}
              className={`whitespace-nowrap transition-colors hover:text-slate-900 dark:hover:text-white ${
                activeView === 'bookmarks' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
              }`}
            >
              스크랩 관심기업 ({bookmarks.length})
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action (with theme switcher) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 transition-colors"
              title={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setIsCompareDrawerOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4" />
              <span>기업 비교함</span>
              {compareIds.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-blue-600 font-mono text-[10px] flex items-center justify-center font-bold">
                  {compareIds.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO / SEARCH & VALUE CHAIN DISCOVERY HEADER */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              공고 너머의 산업 지도를 읽다,
              <br />
              <span className="text-blue-600 dark:text-blue-400">모빌리티 밸류체인 백과사전</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
              기존 채용플랫폼의 단순 공고 나열을 벗어나 배터리 소재, 셀, BMS, 자율주행 SW, 센서, Tier-1 전장부터 완성차까지 모빌리티 전체 생태계의 유기적 공급망과 숨은 알짜 강소기업을 발견하세요.
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="relative max-w-3xl">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="기업명, 밸류체인(BMS, 양극재, 라이다), 납품 고객사(현대차, 테슬라), 기술스택(ROS2, AUTOSAR)..."
              className="w-full pl-12 pr-10 py-3.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Popular Tag Filters (Interactive Buttons) */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-medium shrink-0">추천 검색:</span>
            {popularTags.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(isSelected ? null : tag)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white font-medium shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. MAIN WORKSPACE VIEWPORT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 space-y-8 w-full">
        {/* If in Job Board view */}
        {activeView === 'jobs' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  모빌리티 엔지니어 채용공고 통합 허브
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  생태계 밸류체인 소속 강소기업들의 현재 오픈된 R&D 및 엔지니어링 포지션을 한곳에서 비교 지원합니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveView('explore')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                ← 생태계 지도로 돌아가기
              </button>
            </div>
            <JobListSection companies={COMPANIES_DATA} onOpenCompany={(c) => setModalCompany(c)} />
          </div>
        ) : (
          <>
            {/* Value Chain Flow Visualizer */}
            <ValueChainFlow
              activeCategory={selectedCategory}
              onSelectCategory={(catId) => setSelectedCategory(catId)}
              companies={COMPANIES_DATA}
            />

            {/* College Major Guided Route */}
            <MajorFilterSection
              selectedMajor={selectedMajor}
              onSelectMajor={(m) => setSelectedMajor(m)}
            />

            {/* Secondary Filter & Sorter Toolbar */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Tier Filter */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-500 font-medium">협력 단계:</span>
                  <select
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden"
                  >
                    <option value="all">전체 티어</option>
                    <option value="OEM 완성차">OEM 완성차</option>
                    <option value="Tier-1 (1차 협력사)">Tier-1 (1차 협력사)</option>
                    <option value="Tier-2 (2차 핵심모듈)">Tier-2 (2차 핵심모듈)</option>
                    <option value="소재/원천기술사">소재/원천기술사</option>
                    <option value="혁신 스타트업/유니콘">혁신 스타트업/유니콘</option>
                  </select>
                </div>

                {/* Scale Filter */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-500 font-medium">기업 규모:</span>
                  <select
                    value={selectedScale}
                    onChange={(e) => setSelectedScale(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden"
                  >
                    <option value="all">전체 규모</option>
                    <option value="대기업">대기업</option>
                    <option value="중견기업">중견기업</option>
                    <option value="코스닥상장">코스닥상장 강소기업</option>
                    <option value="혁신스타트업">혁신 스타트업</option>
                  </select>
                </div>

                {/* Fresh Grad Toggle */}
                <button
                  type="button"
                  onClick={() => setFreshGradOnly(!freshGradOnly)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                    freshGradOnly
                      ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-700 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      freshGradOnly ? 'bg-blue-600 dark:bg-blue-400' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  />
                  <span>대졸신입 채용중만 보기</span>
                </button>
              </div>

              {/* Status and Reset */}
              <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
                <span className="text-slate-500">
                  검색 결과:{' '}
                  <strong className="text-slate-900 dark:text-slate-100 font-mono font-bold tabular-nums">
                    {filteredCompanies.length}
                  </strong>
                  개 기업
                </span>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    필터 초기화
                  </button>
                )}
              </div>
            </div>

            {/* 4. COMPANY CARDS GRID */}
            <div>
              {activeView === 'bookmarks' && (
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-blue-600" fill="currentColor" />
                    내가 스크랩한 관심 모빌리티 기업 ({filteredCompanies.length}개)
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveView('explore')}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    전체 기업 목록으로 돌아가기
                  </button>
                </div>
              )}

              {filteredCompanies.length === 0 ? (
                <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
                  <Building className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                    선택하신 조건에 일치하는 기업이 없습니다.
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    검색 키워드를 단순화하거나 상단 필터(티어, 밸류체인 단계, 전공)를 초기화하여 더 많은 기업을 확인해보세요.
                  </p>
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="px-4 py-2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                  >
                    모든 필터 초기화
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCompanies.map((company) => (
                    <CompanyCard
                      key={company.id}
                      company={company}
                      onOpen={() => setModalCompany(company)}
                      isBookmarked={bookmarks.includes(company.id)}
                      onToggleBookmark={(e) => {
                        e.stopPropagation();
                        toggleBookmark(company.id);
                      }}
                      isComparing={compareIds.includes(company.id)}
                      onToggleCompare={(e) => {
                        e.stopPropagation();
                        toggleCompare(company.id);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* 5. FOOTER */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">MobiMap</span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span>대졸 엔지니어 취업준비생을 위한 모빌리티 밸류체인 백과사전 & 채용 연계</span>
          </div>
          <div className="flex items-center gap-6">
            <span>데이터 기준: 2026 대한민국 모빌리티 생태계</span>
            <span>상시 채용 업데이트</span>
          </div>
        </div>
      </footer>

      {/* 6. MODALS & DRAWERS */}
      {modalCompany && (
        <CompanyModal
          company={modalCompany}
          onClose={() => setModalCompany(null)}
          onSelectCompany={(comp) => setModalCompany(comp)}
          isBookmarked={bookmarks.includes(modalCompany.id)}
          onToggleBookmark={(id) => toggleBookmark(id)}
        />
      )}

      {/* Comparison Drawer */}
      <ComparisonDrawer
        companies={compareCompanies}
        onRemoveCompany={(id) => setCompareIds(compareIds.filter((cid) => cid !== id))}
        onClearAll={() => setCompareIds([])}
        onOpenCompany={(c) => setModalCompany(c)}
        isOpen={isCompareDrawerOpen}
        onClose={() => setIsCompareDrawerOpen(false)}
      />
    </div>
  );
}
