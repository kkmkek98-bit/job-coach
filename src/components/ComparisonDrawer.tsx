import React from 'react';
import { X, ArrowRight, Building, Check, Layers } from 'lucide-react';
import { Company } from '../data/mobilityData';

interface ComparisonDrawerProps {
  companies: Company[];
  onRemoveCompany: (companyId: string) => void;
  onClearAll: () => void;
  onOpenCompany: (company: Company) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ComparisonDrawer: React.FC<ComparisonDrawerProps> = ({
  companies,
  onRemoveCompany,
  onClearAll,
  onOpenCompany,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              모빌리티 기업 스펙 & 밸류체인 비교 ({companies.length}/3)
            </h3>
            <p className="text-xs text-slate-500">
              최대 3개 기업의 밸류체인 위치, 매출 규모, 대졸 초봉, 채용 현황을 비교합니다.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {companies.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 underline mr-2"
              >
                전체 비우기
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {companies.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              비교할 기업이 선택되지 않았습니다. 기업 카드에서 '비교' 버튼을 클릭해 추가하세요.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {companies.map((c) => (
                <div
                  key={c.id}
                  className="bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold block">
                          {c.category}
                        </span>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">{c.name}</h4>
                        <span className="text-xs text-slate-500">{c.englishName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveCompany(c.id)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                        title="비교에서 제거"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2.5 text-xs pt-3 border-t border-slate-200 dark:border-slate-700">
                      <div>
                        <span className="text-slate-400 block mb-0.5">밸류체인 단계 및 계층</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {c.tier} · {c.scale}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block mb-0.5">공급망 주요 고객사</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                          {c.valueChainPosition.downstream.join(', ')}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                        <div>
                          <span className="text-slate-400 block mb-0.5">대졸 초봉</span>
                          <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                            {c.startingSalary}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">매출액</span>
                          <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                            {c.revenue}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 block mb-0.5">임직원 수 / 본사 위치</span>
                        <span className="text-slate-700 dark:text-slate-300">
                          {c.employees.toLocaleString()}명 · {c.location}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block mb-1">핵심 기술</span>
                        <div className="flex flex-wrap gap-1">
                          {c.valueChainPosition.keyTech.slice(0, 3).map((tech, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-1.5 py-0.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-600"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 block mb-1">
                          진행 중 공고 ({c.jobs.length}건)
                        </span>
                        <div className="space-y-1">
                          {c.jobs.slice(0, 2).map((j) => (
                            <div
                              key={j.id}
                              className="text-[11px] p-1.5 bg-white dark:bg-slate-700/60 rounded border border-slate-200 dark:border-slate-600 flex items-center justify-between"
                            >
                              <span className="truncate pr-1">{j.title}</span>
                              <span className="text-rose-600 font-mono text-[10px] shrink-0">
                                {j.dDay}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onOpenCompany(c);
                      onClose();
                    }}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>상세 백과사전 보기</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
