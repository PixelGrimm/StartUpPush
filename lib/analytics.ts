// Analytics utility for tracking user behavior
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Predefined tracking functions for common actions
export const analytics = {
  // User engagement
  trackProjectView: (projectName: string) => {
    trackEvent('view_project', 'engagement', projectName);
  },
  
  trackProjectVote: (projectName: string, voteType: 'upvote' | 'downvote') => {
    trackEvent('vote_project', 'engagement', `${projectName}_${voteType}`);
  },
  
  trackProjectBoost: (projectName: string, planType: string) => {
    trackEvent('boost_project', 'engagement', `${projectName}_${planType}`);
  },
  
  trackProjectSubmit: () => {
    trackEvent('submit_project', 'engagement');
  },
  
  trackProjectShare: (projectName: string) => {
    trackEvent('share_project', 'engagement', projectName);
  },
  
  // User authentication
  trackLogin: (method: 'google' | 'email') => {
    trackEvent('login', 'authentication', method);
  },
  
  trackSignup: (method: 'google' | 'email') => {
    trackEvent('signup', 'authentication', method);
  },
  
  // Navigation
  trackPageView: (page: string) => {
    trackEvent('page_view', 'navigation', page);
  },
  
  // Search and filtering
  trackSearch: (query: string) => {
    trackEvent('search', 'engagement', query);
  },
  
  trackFilter: (filterType: string, value: string) => {
    trackEvent('filter', 'engagement', `${filterType}_${value}`);
  },
};
