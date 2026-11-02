import React from 'react';
import { Bookmark, Plus, Check, ArrowRight, Briefcase } from 'lucide-react';
import { Company } from '../data/mobilityData';

interface CompanyCardProps {
  company: Company;
  onOpen: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (e: React.MouseEvent) => void;
  isComparing: boolean;
  onToggleCompare: (e: React.MouseEvent) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  onOpen,
  isBookmarked,
  onToggleBookmark,
  isComparing,
  onToggleCompare,
}) => {
  const freshGradJobsCount = company.jobs.filter(
    (j) => j.experienceLevel === '대졸신입' || j.experienceLevel === '채용연계형 인턴'
  ).length;

  return (
    <div
      onClick={onOpen}
      className="group cursor-pointer bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between relative"
    >
      <div>
        {/* Top Unboxed Metadata & Action Buttons */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">{company.category}</span>
            <span aria-hidden="true">·</span>
            <span>{company.tier}</span>
            <span aria-hidden="true">·</span>
            <span>{company.scale}</span>
          </div>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={onToggleCompare}
              className={`p-1.5 rounded-md border text-[11px] font-medium transition-colors flex items-center gap-1 ${
                isComparing
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-slate-900'
              }`}
              title={isComparing ? '비교 목록에서 제외' : '비교함에 담기'}
            >
              {isComparing ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">비교</span>
            </button>

            <button
              type="button"
              onClick={onToggleBookmark}
              className={`p-1.5 rounded-md border transition-colors ${
                isBookmarked
                  ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800'
                  : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title={isBookmarked ? '스크랩 해제' : '관심 기업 스크랩'}
            >
              <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Company Title */}
        <div className="mb-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-baseline gap-2">
            {company.name}
            <span className="text-xs font-normal text-slate-400">{company.englishName}</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {company.shortDescription}
          </p>
        </div>

        {/* Value Chain Flow Highlight */}
        <div className="my-3.5 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
            공급망 연결 (Supply Chain)
          </span>
          <div className="flex items-center gap-1.5 flex-wrap font-medium">
            <span className="truncate max-w-[110px] text-slate-500">
              {company.valueChainPosition.upstream[0]}
            </span>
            <span className="text-slate-300 dark:text-slate-600">➔</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-1 rounded">
              {company.name}
            </span>
            <span className="text-slate-300 dark:text-slate-600">➔</span>
            <span className="truncate max-w-[120px] text-slate-800 dark:text-slate-200">
              {company.valueChainPosition.downstream[0]}
            </span>
          </div>
        </div>

        {/* Core Specs Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-slate-100 dark:border-slate-800/80">
          <div>
            <span className="text-[11px] text-slate-400 block">대졸 신입 초봉</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {company.startingSalary}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">연 매출액</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {company.revenue}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Area */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs">
          <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          {company.jobs.length > 0 ? (
            <>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                공고 {company.jobs.length}건
              </span>
              {freshGradJobsCount > 0 && (
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 ml-1">
                  (신입 {freshGradJobsCount})
                </span>
              )}
            </>
          ) : (
            <span className="text-slate-400 dark:text-slate-500 font-normal">
              상시 인재풀 등록
            </span>
          )}
        </div>

        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
          백과사전 열기
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
