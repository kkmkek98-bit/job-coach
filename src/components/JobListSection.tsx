import React, { useState } from 'react';
import { Briefcase, MapPin, Building, ArrowRight, CheckCircle2, Search, Filter } from 'lucide-react';
import { Company, JobOpening } from '../data/mobilityData';

interface JobListSectionProps {
  companies: Company[];
  onOpenCompany: (company: Company) => void;
}

export const JobListSection: React.FC<JobListSectionProps> = ({ companies, onOpenCompany }) => {
  const [techQuery, setTechQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'fresh' | 'intern'>('all');
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  // Flatten all jobs with company info
  const allJobs: { job: JobOpening; company: Company }[] = [];
  companies.forEach((company) => {
    company.jobs.forEach((job) => {
      allJobs.push({ job, company });
    });
  });

  const filtered = allJobs.filter(({ job, company }) => {
    if (levelFilter === 'fresh' && job.experienceLevel !== '대졸신입') return false;
    if (levelFilter === 'intern' && job.experienceLevel !== '채용연계형 인턴') return false;

    if (techQuery.trim()) {
      const q = techQuery.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchComp = company.name.toLowerCase().includes(q);
      const matchStack = job.techStack.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchComp && !matchStack) return false;
    }
    return true;
  });

  const toggleApply = (jobId: string) => {
    if (appliedJobs.includes(jobId)) {
      setAppliedJobs(appliedJobs.filter((id) => id !== jobId));
    } else {
      setAppliedJobs([...appliedJobs, jobId]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={techQuery}
            onChange={(e) => setTechQuery(e.target.value)}
            placeholder="기술 스택(C++, AUTOSAR, ROS2, XRD, 배터리) 또는 직무 검색..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-blue-500 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg shrink-0">
          <button
            type="button"
            onClick={() => setLevelFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              levelFilter === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            전체 공고 ({allJobs.length})
          </button>
          <button
            type="button"
            onClick={() => setLevelFilter('fresh')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              levelFilter === 'fresh'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            대졸신입 전용
          </button>
          <button
            type="button"
            onClick={() => setLevelFilter('intern')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              levelFilter === 'intern'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            채용연계형 인턴
          </button>
        </div>
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-sm text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            조건에 부합하는 엔지니어 채용 공고가 없습니다. 검색어를 변경해보세요.
          </div>
        ) : (
          filtered.map(({ job, company }) => {
            const isApplied = appliedJobs.includes(job.id);
            return (
              <div
                key={job.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <button
                      type="button"
                      onClick={() => onOpenCompany(company)}
                      className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <Building className="w-3.5 h-3.5" />
                      {company.name}
                      <span className="text-slate-400 font-normal">({company.category})</span>
                    </button>
                    <span className="font-mono font-medium text-rose-600 dark:text-rose-400">
                      {job.dDay} ({job.deadline})
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1 leading-snug">
                    {job.title}
                  </h4>
                  <div className="text-xs text-slate-500 mb-2.5">
                    <span>{job.division}</span>
                    <span className="mx-1.5 text-slate-300">·</span>
                    <span>{job.location}</span>
                  </div>

                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[11px] text-slate-400 mr-1">스택:</span>
                    {job.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onOpenCompany(company)}
                    className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 font-medium flex items-center gap-1"
                  >
                    기업 백과사전
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleApply(job.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      isApplied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isApplied ? '모의 지원 완료 ✓' : '즉시 입사지원'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
