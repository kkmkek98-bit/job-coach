import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Building2,
  MapPin,
  Calendar,
  Users,
  Coins,
  TrendingUp,
  Bookmark,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Briefcase,
  Layers,
  GraduationCap,
  Share2,
} from 'lucide-react';
import { Company, COMPANIES_DATA } from '../data/mobilityData';

interface CompanyModalProps {
  company: Company | null;
  onClose: () => void;
  onSelectCompany: (company: Company) => void;
  isBookmarked: boolean;
  onToggleBookmark: (companyId: string) => void;
}

export const CompanyModal: React.FC<CompanyModalProps> = ({
  company,
  onClose,
  onSelectCompany,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [activeTab, setActiveTab] = useState<'valuechain' | 'intel' | 'jobs' | 'financials'>('valuechain');
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  if (!company) return null;

  const handleApply = (jobId: string) => {
    if (appliedJobs.includes(jobId)) {
      setAppliedJobs(appliedJobs.filter((id) => id !== jobId));
    } else {
      setAppliedJobs([...appliedJobs, jobId]);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Find related upstream/downstream companies in our dataset
  const relatedDownstream = COMPANIES_DATA.filter((c) =>
    company.valueChainPosition.downstream.some((d) => d.includes(c.name) || c.name.includes(d))
  );
  const relatedUpstream = COMPANIES_DATA.filter((c) =>
    company.valueChainPosition.upstream.some((u) => u.includes(c.name) || c.name.includes(u))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="relative px-6 pt-6 pb-5 border-b border-slate-200 dark:border-slate-800 bg-linear-to-b from-slate-50/80 to-white dark:from-slate-800/40 dark:to-slate-900">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 pr-8">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-blue-600 dark:text-blue-400">{company.category}</span>
                <span aria-hidden="true">·</span>
                <span>{company.tier}</span>
                <span aria-hidden="true">·</span>
                <span>{company.scale}</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-baseline gap-2">
                {company.name}
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400">{company.englishName}</span>
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{company.shortDescription}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onToggleBookmark(company.id)}
                className={`p-2 rounded-lg border transition-colors ${
                  isBookmarked
                    ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800'
                    : 'bg-white text-slate-500 border-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                }`}
                title={isBookmarked ? '스크랩 해제' : '관심 기업 스크랩'}
              >
                <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 transition-colors"
                title="공유 링크 복사"
              >
                <Share2 className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-200/70 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block mb-0.5">대졸 신입 초봉</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white font-mono tabular-nums">
                {company.startingSalary}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block mb-0.5">연간 매출액</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white font-mono tabular-nums">
                {company.revenue}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block mb-0.5">임직원 수</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white font-mono tabular-nums">
                {company.employees.toLocaleString()}명
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block mb-0.5">본사 및 연구소</span>
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate block">
                {company.location}
              </span>
            </div>
          </div>

          {copied && (
            <div className="absolute top-2 right-16 px-3 py-1 bg-slate-900 text-white text-xs rounded-md shadow-md animate-fade-in">
              링크가 클립보드에 복사되었습니다
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('valuechain')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'valuechain'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              밸류체인 & 공급망 관계
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('intel')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'intel'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              취준생 필독 면접/자소서 전략
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'jobs'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" />
              {company.jobs.length > 0 ? `엔지니어 채용공고 (${company.jobs.length})` : '상시 인재풀 & 채용'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('financials')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'financials'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              기업 개요 및 재무
            </span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'valuechain' && (
            <div className="space-y-6">
              {/* Supply Chain Diagram */}
              <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  엔드투엔드 공급망 흐름 (End-to-End Supply Chain)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Upstream */}
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-1">
                      1. 공급받는 자원 (Upstream)
                    </span>
                    <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                      {company.valueChainPosition.upstream.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Company Current Node */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-800 shadow-xs">
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wide block mb-1">
                      2. 당사의 핵심 역할 (Value Node)
                    </span>
                    <p className="text-xs font-semibold text-blue-950 dark:text-blue-100 mb-2">
                      {company.valueChainPosition.layer}
                    </p>
                    <p className="text-xs text-blue-900/80 dark:text-blue-200 leading-relaxed">
                      {company.valueChainPosition.roleDescription}
                    </p>
                  </div>

                  {/* Downstream */}
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-1">
                      3. 최종 납품처 / 고객사 (Downstream)
                    </span>
                    <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                      {company.valueChainPosition.downstream.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Core Technologies */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  핵심 보유 기술 및 독자 솔루션
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {company.valueChainPosition.keyTech.map((tech, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/80 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                        0{idx + 1}
                      </span>
                      <span className="font-medium pt-0.5">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connected Ecosystem Companies */}
              {(relatedDownstream.length > 0 || relatedUpstream.length > 0) && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                    백과사전 내 연계 밸류체인 기업 바로 탐색
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {relatedUpstream.map((rel) => (
                      <button
                        key={rel.id}
                        type="button"
                        onClick={() => onSelectCompany(rel)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 transition-colors"
                      >
                        <span className="text-[10px] text-slate-500">원자재/부품</span>
                        <span>{rel.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    ))}
                    {relatedDownstream.map((rel) => (
                      <button
                        key={rel.id}
                        type="button"
                        onClick={() => onSelectCompany(rel)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 rounded-lg text-xs font-medium text-blue-900 dark:text-blue-200 transition-colors"
                      >
                        <span className="text-[10px] text-blue-600 dark:text-blue-400">납품 고객사</span>
                        <span>{rel.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'intel' && (
            <div className="space-y-6">
              {/* Why Target */}
              <div className="p-4 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-slate-800/60 dark:to-slate-800/40 rounded-xl border border-blue-200/80 dark:border-slate-700">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                      취준생이 이 회사를 눈여겨봐야 하는 이유 (Hidden Value)
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {company.jobSeekerIntel.whyTarget}
                    </p>
                  </div>
                </div>
              </div>

              {/* Interview & Resume Strategy */}
              <div className="p-4 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  서류/면접 필승 공략 (밸류체인 관점의 기술 스토리텔링)
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                  {company.jobSeekerIntel.interviewTips}
                </p>
              </div>

              {/* Recommended Majors */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  추천 및 우대 전공 학과
                </h4>
                <div className="flex flex-wrap gap-2">
                  {company.jobSeekerIntel.recommendedMajors.map((major, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-700"
                    >
                      {major}
                    </span>
                  ))}
                </div>
              </div>

              {/* Engineering Culture Keywords */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  기업 연구 및 업무 문화 키워드
                </h4>
                <div className="flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-400">
                  {company.jobSeekerIntel.cultureKeywords.map((k, idx) => (
                    <span key={idx} className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded text-xs">
                      #{k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>현재 실시간 채용 중인 엔지니어 포지션입니다.</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{company.jobs.length}개 공고 등록</span>
              </div>

              {company.jobs.length === 0 ? (
                <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center mx-auto">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      현재 공식 채용공고 준비 중입니다
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                      기술력 보유 기업으로 인재풀(Talent Pool) 사전 등록 시 신규 R&D 및 엔지니어 공고 오픈 알림을 가장 먼저 받아보실 수 있습니다.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => alert(`${company.name} 상시 인재풀에 등록 신청되었습니다. 신규 공고 발생 시 우선 안내됩니다.`)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                    >
                      상시 인재풀 등록 & 공고 알림 신청
                    </button>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      공식 채용사이트
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                company.jobs.map((job) => {
                  const isApplied = appliedJobs.includes(job.id);
                  return (
                    <div
                      key={job.id}
                      className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-semibold rounded">
                              {job.experienceLevel}
                            </span>
                            <span className="text-slate-500">{job.division}</span>
                            <span className="text-slate-400">·</span>
                            <span className="text-rose-600 dark:text-rose-400 font-medium">{job.dDay}</span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{job.title}</h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleApply(job.id)}
                          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
                            isApplied
                              ? 'bg-emerald-600 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {isApplied ? '모의 지원 완료 ✓' : '즉시 입사지원'}
                        </button>
                      </div>

                      {/* Tech Stack */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] text-slate-500 font-medium mr-1">요구 기술:</span>
                        {job.techStack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] rounded font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Requirements and Preferences */}
                      <div className="text-xs space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                        <div>
                          <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                            지원 자격
                          </span>
                          <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-0.5">
                            {job.requirements.map((req, idx) => (
                              <li key={idx}>{req}</li>
                            ))}
                          </ul>
                        </div>
                        {job.preferred.length > 0 && (
                          <div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                              우대 사항
                            </span>
                            <ul className="list-disc list-inside text-slate-500 dark:text-slate-400 space-y-0.5">
                              {job.preferred.map((pref, idx) => (
                                <li key={idx}>{pref}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>근무지: {job.location}</span>
                        <span>서류 마감: {job.deadline}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'financials' && (
            <div className="space-y-6">
              {/* Financial cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 block mb-1">매출액 & 재무 건전성</span>
                  <div className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                    {company.revenue}
                  </div>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 block">
                    성장세: {company.revenueGrowth}
                  </span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 block mb-1">대졸 초임 및 평균 연봉</span>
                  <div className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                    초봉 {company.startingSalary}
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 block">
                    전체 평균 연봉: {company.avgSalary}
                  </span>
                </div>
              </div>

              {/* Profile Details Table */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
                <div className="grid grid-cols-3 p-3 bg-slate-50 dark:bg-slate-800/80 font-medium text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <span>항목</span>
                  <span className="col-span-2">세부 내용</span>
                </div>
                <div className="grid grid-cols-3 p-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">설립 연도</span>
                  <span className="col-span-2 font-mono tabular-nums">{company.founded}년 ({2026 - company.founded}년차)</span>
                </div>
                <div className="grid grid-cols-3 p-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">임직원 수</span>
                  <span className="col-span-2 font-mono tabular-nums">{company.employees.toLocaleString()}명</span>
                </div>
                <div className="grid grid-cols-3 p-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">기업 분류</span>
                  <span className="col-span-2">{company.scale} ({company.tier})</span>
                </div>
                <div className="grid grid-cols-3 p-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">사업장 위치</span>
                  <span className="col-span-2">{company.location}</span>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <span className="text-slate-500">공식 홈페이지</span>
                  <span className="col-span-2">
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      {company.website}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <span>태그:</span>
            <div className="flex flex-wrap gap-1">
              {company.tags.map((tag, idx) => (
                <span key={idx} className="text-slate-600 dark:text-slate-400 font-mono">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
