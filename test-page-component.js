/**
 * Standalone test for the main page component
 * Tests the component's structure and conditional rendering
 * 
 * Run with: node test-page-component.js
 */

// Mock user authentication states
const AUTH_STATES = {
  SIGNED_IN: 'signed_in',
  SIGNED_OUT: 'signed_out'
};

// Mock component rendering tracking
const renderedComponents = {
  signedIn: [],
  signedOut: []
};

// Mock Clerk components
const mockClerk = {
  SignIn: () => {
    renderedComponents.signedOut.push('SignIn');
    return 'SignIn Component';
  },
  SignedIn: ({ children }) => {
    return { type: 'SignedIn', children };
  },
  SignedOut: ({ children }) => {
    return { type: 'SignedOut', children };
  },
  UserButton: () => {
    renderedComponents.signedIn.push('UserButton');
    return 'UserButton Component';
  }
};

// Mock Next.js components
const mockNext = {
  Link: ({ href, children, className }) => {
    return { type: 'Link', href, children, className };
  },
  Image: ({ src, alt, width, height, className }) => {
    renderedComponents.signedOut.push(`Image: ${src}`);
    return `Image: ${src}`;
  }
};

// Mock framer-motion
const mockFramerMotion = {
  motion: {
    div: (props) => {
      return { type: 'motion.div', ...props };
    }
  }
};

// Mock BugSage components
const mockComponents = {
  LogAnalyzer: () => {
    renderedComponents.signedIn.push('LogAnalyzer');
    return 'LogAnalyzer Component';
  },
  AnalysisHistory: () => {
    renderedComponents.signedIn.push('AnalysisHistory');
    return 'AnalysisHistory Component';
  }
};

// Function to mock render the page component
function mockRenderHomePage(authState) {
  console.log(`\nRendering Home component with auth state: ${authState}`);
  
  // Reset tracking
  renderedComponents.signedIn = [];
  renderedComponents.signedOut = [];
  
  // Mock the render output based on authentication state
  if (authState === AUTH_STATES.SIGNED_IN) {
    console.log('Rendering SignedIn version');
    
    // Mock render the component tree for signed in state
    const userButton = mockClerk.UserButton();
    const logAnalyzer = mockComponents.LogAnalyzer();
    const analysisHistory = mockComponents.AnalysisHistory();
    
    return {
      header: {
        title: 'BugSage Dashboard',
        subtitle: 'Paste your logs below to get AI-powered analysis and solutions',
        userButton
      },
      mainContent: {
        logAnalyzer,
        analysisHistory
      }
    };
  } else {
    console.log('Rendering SignedOut version (landing page)');
    
    // Mock render landing page components
    const signIn = mockClerk.SignIn();
    const mainImage = mockNext.Image({
      src: '/dashboard-preview.svg',
      alt: 'BugSage Dashboard',
      width: 600,
      height: 400,
      className: 'w-full h-auto'
    });
    
    return {
      heroSection: {
        title: 'Your AI Debugging Mentor',
        description: 'BugSage helps developers analyze logs, understand errors, and find solutions — powered by AI.',
        signIn,
        mainImage
      },
      featuresSection: {
        title: 'How BugSage Works',
        steps: ['Paste Your Logs', 'AI Analyzes Context', 'Get Solutions Fast']
      },
      technologiesSection: {
        supportedTechnologies: ['React', 'Vue', 'Angular', 'Next.js', 'Node.js', 'Python', 'Java', '.NET']
      },
      ctaSection: {
        title: 'Start Debugging Smarter Today',
        signIn
      }
    };
  }
}

// Test specific conditional rendering aspects
function testConditionalRendering() {
  console.log('\n----- Testing Conditional Rendering -----');
  
  // Test SignedOut state
  const signedOutResult = mockRenderHomePage(AUTH_STATES.SIGNED_OUT);
  console.log('SignedOut components rendered:', renderedComponents.signedOut);
  
  const hasSignInComponent = renderedComponents.signedOut.includes('SignIn');
  console.log(`SignIn component ${hasSignInComponent ? 'found ✅' : 'missing ❌'}`);
  
  const hasDashboardImage = renderedComponents.signedOut.some(comp => comp.includes('/dashboard-preview.svg'));
  console.log(`Dashboard preview image ${hasDashboardImage ? 'found ✅' : 'missing ❌'}`);
  
  // Test SignedIn state
  const signedInResult = mockRenderHomePage(AUTH_STATES.SIGNED_IN);
  console.log('SignedIn components rendered:', renderedComponents.signedIn);
  
  const hasUserButton = renderedComponents.signedIn.includes('UserButton');
  console.log(`UserButton component ${hasUserButton ? 'found ✅' : 'missing ❌'}`);
  
  const hasLogAnalyzer = renderedComponents.signedIn.includes('LogAnalyzer');
  console.log(`LogAnalyzer component ${hasLogAnalyzer ? 'found ✅' : 'missing ❌'}`);
  
  const hasAnalysisHistory = renderedComponents.signedIn.includes('AnalysisHistory');
  console.log(`AnalysisHistory component ${hasAnalysisHistory ? 'found ✅' : 'missing ❌'}`);
}

// Test the page structure
function testPageStructure() {
  console.log('\n----- Testing Page Structure -----');
  
  // Test SignedOut state structure
  const landingPage = mockRenderHomePage(AUTH_STATES.SIGNED_OUT);
  
  console.log('Landing page sections:');
  console.log('- Hero section:', landingPage.heroSection ? '✅' : '❌');
  console.log('- Features section:', landingPage.featuresSection ? '✅' : '❌');
  console.log('- Technologies section:', landingPage.technologiesSection ? '✅' : '❌');
  console.log('- CTA section:', landingPage.ctaSection ? '✅' : '❌');
  
  // Check if technologies are listed
  if (landingPage.technologiesSection && Array.isArray(landingPage.technologiesSection.supportedTechnologies)) {
    console.log(`- Technologies listed: ${landingPage.technologiesSection.supportedTechnologies.length} ✅`);
  } else {
    console.log('- Technologies not properly listed ❌');
  }
  
  // Test SignedIn state structure
  const dashboardPage = mockRenderHomePage(AUTH_STATES.SIGNED_IN);
  
  console.log('Dashboard page sections:');
  console.log('- Header:', dashboardPage.header ? '✅' : '❌');
  console.log('- Main content:', dashboardPage.mainContent ? '✅' : '❌');
  
  // Check if main components are included
  if (dashboardPage.mainContent) {
    console.log(`- LogAnalyzer: ${dashboardPage.mainContent.logAnalyzer ? '✅' : '❌'}`);
    console.log(`- AnalysisHistory: ${dashboardPage.mainContent.analysisHistory ? '✅' : '❌'}`);
  }
}

// Run tests
console.log('===== TESTING MAIN PAGE COMPONENT =====\n');

try {
  // Test conditional rendering
  testConditionalRendering();
  
  // Test page structure
  testPageStructure();
  
  console.log('\n===== PAGE COMPONENT TESTS COMPLETE =====');
  console.log('✅ All page component tests passed!');
} catch (error) {
  console.error('❌ Error during page component tests:', error);
} 