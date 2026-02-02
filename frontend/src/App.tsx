import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ChatWindow } from './components/features/ChatWindow';
import type { Message } from './components/features/ChatWindow';
import { LoginPage } from './pages/Login';
import { OrgStructure } from './pages/OrgStructure';
import { CoursesPage } from './pages/Courses';
import { StudentsPage } from './pages/Students';
import { IntegrationsPage } from './pages/Integrations';
import { RecommendationsPage } from './pages/Recommendations';
import { ROLE_AGENTS } from './data/roles';
import { WorkflowStatus } from './components/features/WorkflowStatus';
import { AcademicCalendar } from './components/features/AcademicCalendar';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { ApprovalsPage } from './pages/ApprovalsPage';
import { ReportBuilder } from './pages/ReportBuilder';
import { AccreditationDashboard } from './pages/AccreditationDashboard';
import { BudgetManagement } from './pages/BudgetManagement';
import { HumanResources } from './pages/HumanResources';
import { ExaminationCell } from './pages/ExaminationCell';
import { TimetableManagement } from './pages/TimetableManagement';
import { AttendanceSystem } from './pages/AttendanceSystem';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { PurchaseOrders } from './pages/PurchaseOrders';
import { RecruitmentPortal } from './pages/RecruitmentPortal';

interface ChatSession {
  id: string;
  roleId: string;
  title: string;
  messages: Message[];
  createdAt: number;
  lastActiveAt: number;
}

interface UserProfile {
  username: string;
  role: string;
}

function DashboardLayout({ user, onLogout }: { user: UserProfile, onLogout: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Session State (Keyed by Username in LocalStorage)
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem(`sessions_${user.username}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Computed Active Session
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const activeRoleId = activeSession?.roleId || 'orchestrator';

  // Persist Sessions
  useEffect(() => {
    localStorage.setItem(`sessions_${user.username}`, JSON.stringify(sessions));
  }, [sessions, user.username]);

  // Ensure at least one session exists
  useEffect(() => {
    if (sessions.length === 0) {
      createNewSession('orchestrator');
    } else if (!activeSessionId) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions.length, activeSessionId]);

  // Create New Session helper
  const createNewSession = (roleId: string) => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      roleId: roleId,
      title: `New ${roleId.charAt(0).toUpperCase() + roleId.slice(1)} Chat`,
      messages: [],
      createdAt: Date.now(),
      lastActiveAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  // 🚀 Auto-Send Effect (Triggered by Dashboard Navigation)
  // This must be defined BEFORE handleSendMessage to avoid circular dependency if we used it inside
  // But strictly, we call handleSendMessage inside this effect.

  // We need handleSendMessage defined first or use a ref?
  // Actually functions are hoisted or can be defined before the effect.
  // Let's define handleSendMessage first, then the effect.
  // Wait, React state setters are available.

  // Let's move the handleSendMessage definition UP if possible, or put effect BELOW it.
  // I will assume handleSendMessage is below, so I will insert this effect AFTER handleSendMessage in the next tool call, 
  // OR I can use a forward declaration pattern if needed, but in FC it's just order.
  // Let's just add the location variable here and move to next step for the effect to ensure handleSendMessage exists.

  // Actually, I can just modify this block to Include imports if missing?
  // `useLocation` needs to be imported.


  const [chatLoading, setChatLoading] = useState(false);

  // Safety fallback
  const activeAgent = ROLE_AGENTS[activeRoleId] || ROLE_AGENTS['orchestrator'];

  if (!activeAgent) {
    return <div className="p-10 text-center">Loading Role Definitions...</div>;
  }

  /* 
   * handleSendMessage (Updated with Mock Fallback)
   */
  const handleSendMessage = async (message: string) => {
    if (!activeSessionId) return;

    // 1. Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setSessions(prev => prev.map(s =>
      s.id === activeSessionId
        ? {
          ...s,
          messages: [...s.messages, userMsg],
          lastActiveAt: Date.now(),
          title: s.messages.length === 0 ? message.slice(0, 30) + '...' : s.title
        }
        : s
    ));

    // 2. Set Loading TRUE
    setChatLoading(true);

    /* --- Helper to Process Response (Real or Mock) --- */
    const processResponse = (data: any) => {
      const aiMsg: Message = {
        id: data.id || (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
        suggested_prompts: data.suggested_prompts || [],
        action_items: data.action_items || [],
        visualizations: data.visualizations || [],
        documents: data.documents_generated || [],
        notifications: data.notifications || []
      };

      setSessions(prev => prev.map(s =>
        s.id === activeSessionId ? { ...s, messages: [...s.messages, aiMsg], lastActiveAt: Date.now() } : s
      ));
    };

    /* --- Core Logic --- */
    try {
      // FORCE MOCK if toggle is ON
      if (mockMode) {
        // Dynamic Import to avoid bundle issues if not needed? No, static is fine.
        const { generateMockChatResponse } = await import('./data/mockChat');
        const mockData = await generateMockChatResponse(message, activeRoleId);
        processResponse(mockData);
        return;
      }

      // OTHERWISE: Try Real Backend
      const visibleHistory = activeSession.messages
        .slice(-6)
        .concat(userMsg)
        .map(m => `${m.role.toUpperCase()}: ${m.content}`)
        .join('\n');

      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: message,
          role_id: activeRoleId,
          mock_mode: mockMode,
          context: { history: visibleHistory }
        })
      });

      if (!response.ok) {
        throw new Error(`Server Error (${response.status})`);
      }

      const data = await response.json();
      processResponse(data);

    } catch (error: any) {
      console.warn('Backend failed, falling back to client-side mock:', error);

      // FALLBACK TO MOCK ON ERROR
      try {
        const { generateMockChatResponse } = await import('./data/mockChat');
        const mockData = await generateMockChatResponse(message, activeRoleId);

        // Append a small notice to content so user knows it's offline mode
        mockData.content = `*[Offline Mode: Backend unavailable]*\n\n` + mockData.content;

        processResponse(mockData);
      } catch (mockErr) {
        console.error("Critical: Even mock generation failed", mockErr);
        // Only show error if even the fallback fails
        const errorMessage = error.message || "Unknown error";
        const fallbackMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `⚠️ **System Error**: Could not connect to backend AND mock fallback failed. (${errorMessage})`,
          timestamp: new Date()
        };
        setSessions(prev => prev.map(s =>
          s.id === activeSessionId ? { ...s, messages: [...s.messages, fallbackMsg] } : s
        ));
      }
    } finally {
      setChatLoading(false);
    }
  };

  // 🚀 Effect to Handle Auto-Send from Navigation State
  useEffect(() => {
    if (location.state && location.state.autoSend) {
      const msg = location.state.autoSend;
      // Clear state immediately to prevent loops (replace current entry with no state)
      navigate(location.pathname, { replace: true, state: {} });

      // Delay slightly to ensure UI is ready? Not strictly necessary but safer
      setTimeout(() => {
        handleSendMessage(msg);
      }, 100);
    }
  }, [location, navigate]);


  const deleteSession = (title: string) => {
    setSessions(prev => {
      const newSessions = prev.filter(s => s.title !== title);
      if (newSessions.length === 0) {
        return [];
      }
      return newSessions;
    });

    // Check if we deleted active one
    const s = sessions.find(sess => sess.title === title);
    if (s && s.id === activeSessionId) {
      setActiveSessionId(null); // useEffect will pick new one
    }
  };

  const [activeMode, setActiveMode] = useState(false);
  const [mockMode, setMockMode] = useState(false); // Default logic: Live (False)

  return (
    <div className="h-screen bg-gray-50 flex flex-col font-sans overflow-hidden">
      <Navbar
        activeMode={activeMode}
        onToggleActiveMode={() => setActiveMode(!activeMode)}
        mockMode={mockMode}
        onToggleMockMode={() => setMockMode(!mockMode)}
      />

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden lg:block h-full">
          <Sidebar
            role={(activeRoleId || 'orchestrator').toLowerCase()}
            activeSessions={sessions.map(s => s.title)}
            onSessionSelect={(title) => {
              const s = sessions.find(sess => sess.title === title);
              if (s) setActiveSessionId(s.id);
            }}
            onSessionDelete={deleteSession}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full relative">
          <Routes>
            <Route path="/" element={
              <div className="flex-1 flex flex-col h-full bg-white">
                {/* Agent Header */}
                <div className="px-6 py-3 border-b border-gray-100 flex justify-between items-center bg-white shadow-sm z-10">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      {activeAgent.name}
                      <span className="text-xs font-normal text-green-700 bg-green-100 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Live Session
                      </span>
                    </h2>
                    <div className="text-xs text-gray-400 font-mono">Session ID: {activeSessionId?.slice(-6)}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/reports/builder?role=${activeRoleId}`)}
                      className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-md hover:bg-indigo-100 font-medium transition-colors border border-indigo-200 flex items-center gap-1"
                    >
                      Report Builder
                    </button>
                    <button
                      onClick={() => createNewSession(activeRoleId)}
                      className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 font-medium transition-colors shadow-sm flex items-center gap-1"
                    >
                      + New Chat
                    </button>
                    <button
                      onClick={() => navigate('/org-structure')}
                      className="text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-100 font-medium transition-colors border border-gray-200"
                    >
                      Switch Role
                    </button>
                    <button
                      onClick={onLogout}
                      className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-100 font-medium transition-colors border border-red-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>

                {/* Chat Window */}
                <div className="flex-1 overflow-hidden relative">
                  {activeSession ? (
                    <ChatWindow
                      messages={activeSession.messages}
                      onSendMessage={handleSendMessage}
                      onSelectExample={(ex) => handleSendMessage(ex)}
                      loading={chatLoading}
                      activeAgent={activeAgent}
                      activeMode={activeMode}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">Initializing Workspace...</div>
                  )}
                </div>
              </div>
            } />
            <Route path="/org-structure" element={
              <div className="h-full overflow-y-auto p-6">
                <OrgStructure onRoleSelect={(role) => {
                  createNewSession(role); // Start fresh session on role switch
                  navigate('/');
                }} />
              </div>
            } />

            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:courseId/:subpage" element={<PlaceholderPage title="Course Editor" description="Advanced course content management interface." />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/department/overview" element={<PlaceholderPage title="Department Overview" description="KPIs, faculty performance, and student statistics." />} />
            <Route path="/admin/integrations" element={<IntegrationsPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />

            {/* Functional Modules with Placeholders */}
            <Route path="/finance" element={<PlaceholderPage title="Finance Dashboard" description="Financial overview, budget tracking, and expenditure analysis." />} />
            <Route path="/finance/budget" element={<BudgetManagement />} />
            <Route path="/finance/budget/edit" element={<PlaceholderPage title="Budget Proposal Editor" description="Create and modify financial proposals." />} />
            <Route path="/finance/approvals" element={<ApprovalsPage />} />
            <Route path="/approvals" element={<ApprovalsPage />} />
            <Route path="/accreditation" element={<AccreditationDashboard />} />

            <Route path="/admin/purchase" element={<PurchaseOrders />} />
            <Route path="/admin/hiring" element={<RecruitmentPortal />} />

            <Route path="/hr" element={<HumanResources />} />
            <Route path="/exam" element={<ExaminationCell />} />
            <Route path="/timetable" element={<TimetableManagement />} />
            <Route path="/calendar" element={<div className="p-6 h-full overflow-auto"><AcademicCalendar /></div>} />
            <Route path="/attendance" element={<AttendanceSystem />} />
            <Route path="/assignments" element={<AssignmentsPage />} />
            <Route path="/reports/builder" element={<ReportBuilder />} />
          </Routes>

          {/* Global Workflow Widget */}
          <WorkflowStatus />
        </main>
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) return <div className="p-10 text-red-600"><h1>Error</h1><pre>{this.state.error?.message}</pre></div>;
    return this.props.children;
  }
}

function App() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('erp_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (username: string, role: string) => {
    const newUser = { username, role };
    localStorage.setItem('erp_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('erp_user');
    setUser(null);
  };

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/login" element={
            !user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" replace />
          } />
          <Route path="/*" element={
            user ? <DashboardLayout user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />
          } />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
