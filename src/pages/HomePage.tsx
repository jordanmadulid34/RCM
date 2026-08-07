import React from 'react';
import { TabType, ThemeType } from '../types';
import { Hero } from '../components/Hero';
import { HeritageSection } from '../components/HeritageSection';
import { ImpactGrid } from '../components/ImpactGrid';
import { ProjectsPreview } from '../components/ProjectsPreview';
import { VideoSection } from '../components/VideoSection';
import { DigitalEngagement } from '../components/DigitalEngagement';

interface HomePageProps {
  setActiveTab: (tab: TabType) => void;
  onSelectFocusArea?: (focusAreaId: string) => void;
  theme: ThemeType;
}

export const HomePage: React.FC<HomePageProps> = ({
  setActiveTab,
  onSelectFocusArea,
  theme,
}) => {
  return (
    <div className="animate-fadeIn">
      <Hero setActiveTab={setActiveTab} theme={theme} />
      <HeritageSection setActiveTab={setActiveTab} theme={theme} />
      <ImpactGrid
        setActiveTab={setActiveTab}
        onSelectFocusArea={onSelectFocusArea}
        theme={theme}
      />
      <ProjectsPreview setActiveTab={setActiveTab} theme={theme} />
      <VideoSection theme={theme} />
      <DigitalEngagement setActiveTab={setActiveTab} />
    </div>
  );
};
