import React from 'react';
import {
  Atom,
  BatteryCharging,
  Cpu,
  Scan,
  Code2,
  Layers,
  Car,
  Zap,
  RefreshCw,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { VALUE_CHAIN_CATEGORIES, Company } from '../data/mobilityData';

interface ValueChainFlowProps {
  activeCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  companies: Company[];
}

export const ValueChainFlow: React.FC<ValueChainFlowProps> = ({
  activeCategory,
  onSelectCategory,
  companies,
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Atom':
        return <Atom className="w-4 h-4" />;
      case 'BatteryCharging':
        return <BatteryCharging className="w-4 h-4" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4" />;
      case 'Scan':
        return <Scan className="w-4 h-4" />;
      case 'Code2':
        return <Code2 className="w-4 h-4" />;
      case 'Layers':
        return <Layers className="w-4 h-4" />;
      case 'Car':
        return <Car className="w-4 h-4" />;
      case 'Zap':
        return <Zap className="w-4 h-4" />;
      case 'RefreshCw':
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  const getCompanyCount = (catId: string) => {
    return companies.filter((c) => c.categoryId === catId).length;
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Ecosystem Map
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-xs text-slate-500">원자재부터 최종 완성차, 충전 및 폐배터리까지</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            모빌리티 9대 산업 밸류체인 생태계 지도
          </h2>
        </div>

        {activeCategory && (
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium self-start sm:self-auto"
          >
            전체 밸류체인 보기 (필터 해제)
          </button>
        )}
      </div>

      {/* Interactive Value Chain Stream */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2 mt-4">
        {VALUE_CHAIN_CATEGORIES.map((cat, idx) => {
          const isSelected = activeCategory === cat.id;
          const count = getCompanyCount(cat.id);

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(isSelected ? null : cat.id)}
              className={`group text-left p-3 rounded-xl border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-50/90 dark:bg-blue-950/60 border-blue-500 shadow-xs ring-1 ring-blue-500'
                  : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    0{cat.stepNumber}
                  </span>
                  <div
                    className={`${
                      isSelected
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                    }`}
                  >
                    {getIcon(cat.iconName)}
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1 mb-1">
                  {cat.name}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">보유 기업</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono tabular-nums">
                  {count}개
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-800 dark:text-slate-200">💡 밸류체인 취업 인사이트:</span>
          <span>
            모빌리티는 OEM 단독 생산이 아닌, 1차 협력사(Tier-1)와 부품/소재/SW 생태계의 유기적 결합으로 완성됩니다.
          </span>
        </div>
        <span className="text-[11px] text-slate-500">
          단계를 클릭하면 해당 밸류체인 소속 기업만 필터링됩니다.
        </span>
      </div>
    </div>
  );
};
