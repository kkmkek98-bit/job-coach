import React from 'react';
import { Cpu, Terminal, Wrench, FlaskConical } from 'lucide-react';

export interface MajorTrack {
  id: string;
  name: string;
  subtitle: string;
  icon: 'cpu' | 'terminal' | 'wrench' | 'flask';
  targetRoles: string[];
  recommendedValueChains: string[];
  keywords: string[];
}

export const MAJOR_TRACKS: MajorTrack[] = [
  {
    id: 'ee',
    name: '전기 · 전자공학',
    subtitle: 'BMS, 인버터 전력변환, 레이더/라이다 센서 하드웨어 및 임베디드 제어',
    icon: 'cpu',
    targetRoles: ['BMS 펌웨어 개발자', '전력전자 회로설계', '차량용 센서 계측', '모터 드라이브(FOC)'],
    recommendedValueChains: ['BMS & 전력제어', 'Tier-1 전장 & 샤시', '센서 & 라이다/레이더', '충전 인프라 & CPO'],
    keywords: ['C언어', 'CAN통신', 'AUTOSAR', 'PSIM', 'MCU', 'SiC전력반도체'],
  },
  {
    id: 'cs',
    name: '컴퓨터 · 소프트웨어',
    subtitle: 'SDV 차량용 OS, 딥러닝 자율주행 인지/판단, V2X 및 충전 IoT 클라우드',
    icon: 'terminal',
    targetRoles: ['자율주행 Perception AI', '차량 OS(Linux/QNX)', '경로계획(Motion Planning)', '충전소 IoT 백엔드'],
    recommendedValueChains: ['자율주행 SW & AI', '센서 & 라이다/레이더', 'Tier-1 전장 & 샤시', '충전 인프라 & CPO'],
    keywords: ['C++', 'Python', 'ROS2', 'PyTorch', 'TypeScript', 'SOME/IP', 'Linux Kernel'],
  },
  {
    id: 'me',
    name: '기계 · 미래자동차',
    subtitle: '전동화 샤시 메카트로닉스, 배터리팩 열관리(Thermal), 충돌 안전 및 CAE',
    icon: 'wrench',
    targetRoles: ['전자식 조향/제동(x-by-wire)', '배터리 열폭주 방지 해석', '구동모터 기구 설계', '로보셔틀 차체 설계'],
    recommendedValueChains: ['완성차 OEM', 'Tier-1 전장 & 샤시', '배터리 셀 & 모듈'],
    keywords: ['CATIA', 'ANSYS', 'Simulink', '열역학', '모터제어', '구조해석'],
  },
  {
    id: 'chem',
    name: '화학공학 · 신소재',
    subtitle: '하이니켈/망간리치 양극재 합성, 배터리 셀 전기화학, 폐배터리 습식 침출',
    icon: 'flask',
    targetRoles: ['양극재 단결정 소성 R&D', '배터리 셀 전기화학 평가', '폐배터리 습식 제련', '전해액/분리막 개발'],
    recommendedValueChains: ['소재 & 원자재', '배터리 셀 & 모듈', '배터리 리사이클링'],
    keywords: ['XRD', 'SEM', 'EIS', '단결정', '습식제련', '코인셀평가'],
  },
];

interface MajorFilterSectionProps {
  selectedMajor: string | null;
  onSelectMajor: (majorId: string | null) => void;
}

export const MajorFilterSection: React.FC<MajorFilterSectionProps> = ({
  selectedMajor,
  onSelectMajor,
}) => {
  const renderIcon = (icon: MajorTrack['icon']) => {
    switch (icon) {
      case 'cpu':
        return <Cpu className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
      case 'terminal':
        return <Terminal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'wrench':
        return <Wrench className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'flask':
        return <FlaskConical className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-200/70 dark:border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            🎓 내 전공별 모빌리티 진로 가이드 & 맞춤 기업 필터
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            (전공을 클릭하면 해당 공학도 수요가 높은 밸류체인 기업을 모아봅니다)
          </span>
        </div>
        {selectedMajor && (
          <button
            type="button"
            onClick={() => onSelectMajor(null)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium self-start sm:self-auto"
          >
            전체 전공 보기
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {MAJOR_TRACKS.map((track) => {
          const isSelected = selectedMajor === track.id;
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => onSelectMajor(isSelected ? null : track.id)}
              className={`p-3 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-white dark:bg-slate-800 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                  : 'bg-white/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-slate-100">
                  {renderIcon(track.icon)}
                  <span>{track.name}</span>
                </div>
                {isSelected && (
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded">
                    선택됨
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-2">
                {track.subtitle}
              </p>
              <div className="flex flex-wrap gap-1">
                {track.keywords.slice(0, 3).map((kw, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded font-mono"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
