import { AppProvider, useApp } from '@/services/AppContext';
import { PageShell } from '@/components/Shell';
import { LandingPage } from '@/pages/LandingPage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { AssessmentPage } from '@/pages/AssessmentPage';
import { ReportPage } from '@/pages/ReportPage';
import { MatchesPage } from '@/pages/MatchesPage';
import { CareerProfilePage } from '@/pages/CareerProfilePage';
import { ComparePage } from '@/pages/ComparePage';
import { ConsultantPage } from '@/pages/ConsultantPage';
import { RoadmapPage } from '@/pages/RoadmapPage';
import { DashboardPage } from '@/pages/DashboardPage';

function Router() {
  const { route } = useApp();

  switch (route) {
    case 'landing': return <PageShell><LandingPage /></PageShell>;
    case 'onboarding': return <PageShell><OnboardingPage /></PageShell>;
    case 'assessment': return <PageShell><AssessmentPage /></PageShell>;
    case 'report': return <PageShell><ReportPage /></PageShell>;
    case 'matches': return <PageShell><MatchesPage /></PageShell>;
    case 'career-profile': return <PageShell><CareerProfilePage /></PageShell>;
    case 'compare': return <PageShell><ComparePage /></PageShell>;
    case 'consultant': return <ConsultantPage />;
    case 'roadmap': return <PageShell><RoadmapPage /></PageShell>;
    case 'dashboard': return <PageShell><DashboardPage /></PageShell>;
    default: return <PageShell><LandingPage /></PageShell>;
  }
}

function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}

export default App;
