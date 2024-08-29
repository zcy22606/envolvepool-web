import { Lang, TransNs } from '@/i18n/config';
import { FC } from 'react';
import ProjectCard from './ProjectCard';
import { useTranslation } from '@/i18n/server';
import { LaunchPoolProjectType } from '@/service/webApi/launchPool/type';

interface AllProjectsProps {
  lang: Lang;
  projects: LaunchPoolProjectType[];
}

const AllProjects: FC<AllProjectsProps> = async ({ lang, projects }) => {
  const { t } = await useTranslation(lang, TransNs.LAUNCH_POOL);
  return (
    <div className="container mx-auto pb-20" id="all-projects">
      <h2 className="text-h25 mb-[1.25rem] text-center text-[#0B0D41]">{t('allProjects')}</h2>
      <div className="flex w-full flex-col gap-10">
        {projects.map((project) => {
          return <ProjectCard key={project.id} lang={lang} project={project} />;
        })}
      </div>
    </div>
  );
};

export default AllProjects;
