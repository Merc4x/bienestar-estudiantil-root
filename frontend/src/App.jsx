import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, SEED_DATA } from './services/api';
import { useAppStore } from './store/useAppStore';
import { LoginScreen } from './components/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { FullScreenLoader, TabTransitionSkeleton } from './components/Common';
import {
  StudentDashboard,
  StudentServices,
  StudentProfessionals,
  AppointmentWizard,
  StudentAppointments,
  StudentActivities,
  StudentEnrollments,
  NotificationsView,
  ProfileView
} from './components/StudentViews';
import {
  ProDashboard,
  ProAvailability,
  ProAppointments,
  ProAttentions,
  ProHistory,
  ProFollowup
} from './components/ProfessionalViews';
import {
  AdminDashboard,
  AdminUsers,
  AdminProfessionals,
  AdminServices,
  AdminAppointments,
  AdminActivities,
  AdminReports,
  AdminAudit
} from './components/AdminViews';

export default function App() {
  const queryClient = useQueryClient();

  const {
    role,
    user,
    page,
    authenticated,
    sidebarOpen,
    backendMode,
    toastMsg,
    wizardDefaults,
    bootLoading,
    loaderText,
    tabSwitching,
    progressKey,
    setRole,
    setUser,
    setPage,
    setAuthenticated,
    setSidebarOpen,
    setBackendMode,
    setWizardDefaults,
    setBootLoading,
    setLoaderText,
    setTabSwitching,
    incrementProgressKey,
    showToast
  } = useAppStore();

  // TanStack Query: carga y caché del estado general desde la API Node.js / Fallback
  const { data: queryResult } = useQuery({
    queryKey: ['bienestarState'],
    queryFn: () => api.fetchState(),
    initialData: { ok: true, state: SEED_DATA, mode: 'github-pages-local' }
  });

  const state = queryResult?.state || SEED_DATA;

  const syncQueryState = (res) => {
    if (res?.state) {
      queryClient.setQueryData(['bienestarState'], (old) => ({
        ...old,
        state: res.state,
        mode: res.mode || old?.mode
      }));
    }
    if (res?.mode) {
      setBackendMode(res.mode);
    }
  };

  useEffect(() => {
    const start = Date.now();
    api
      .fetchState()
      .then((res) => {
        syncQueryState(res);
      })
      .catch(() => {
        setBackendMode('github-pages-local');
      })
      .finally(() => {
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, 1550 - elapsed);
        setTimeout(() => setBootLoading(false), remaining);
      });
  }, []);

  const triggerTabTransition = (nextPage) => {
    if (nextPage === page) {
      setSidebarOpen(false);
      return;
    }
    setSidebarOpen(false);
    incrementProgressKey();
    setTabSwitching(true);
    setTimeout(() => {
      setPage(nextPage);
      setTabSwitching(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 520);
  };

  const handleLogin = async (email, password) => {
    try {
      const res = await api.login(email, password);
      syncQueryState(res);
      const u = res.user;
      setLoaderText(`Bienvenido, ${u.name}. Preparando tu panel...`);
      setBootLoading(true);

      setTimeout(() => {
        setUser(u);
        const newRole =
          u.role === 'Estudiante'
            ? 'student'
            : u.role === 'Profesional'
            ? 'professional'
            : 'admin';
        setRole(newRole);
        setPage(
          newRole === 'student'
            ? 'dashboard'
            : newRole === 'professional'
            ? 'pro-dashboard'
            : 'admin-dashboard'
        );
        sessionStorage.setItem('rootSessionReact', 'active');
        setAuthenticated(true);
        setBootLoading(false);
        showToast('Sesión iniciada correctamente.');
      }, 1350);
    } catch (err) {
      showToast(err.message || 'Credenciales inválidas.');
    }
  };

  const handleLogout = () => {
    setLoaderText('Cerrando sesión de forma segura...');
    setBootLoading(true);
    setTimeout(() => {
      sessionStorage.removeItem('rootSessionReact');
      setAuthenticated(false);
      setBootLoading(false);
    }, 900);
  };

  const handleSwitchRole = (newRole) => {
    const roleNames = {
      student: 'Estudiante',
      professional: 'Profesional',
      admin: 'Administrador'
    };
    setLoaderText(`Cambiando al entorno de ${roleNames[newRole] || 'usuario'}...`);
    setBootLoading(true);
    setSidebarOpen(false);

    setTimeout(() => {
      setRole(newRole);
      const matchedUser =
        state.users.find((u) =>
          u.role
            .toLowerCase()
            .startsWith(
              newRole === 'student'
                ? 'est'
                : newRole === 'professional'
                ? 'prof'
                : 'admin'
            )
        ) || state.users[0];
      setUser(matchedUser);
      setPage(
        newRole === 'student'
          ? 'dashboard'
          : newRole === 'professional'
          ? 'pro-dashboard'
          : 'admin-dashboard'
      );
      setBootLoading(false);
    }, 1150);
  };

  const handleNavigate = (targetPage) => {
    triggerTabTransition(targetPage);
  };

  const handleResetDB = async () => {
    incrementProgressKey();
    const res = await api.resetDB();
    syncQueryState(res);
    showToast('Datos de demostración restaurados.');
  };

  const startAppointment = (service, professional = null) => {
    setWizardDefaults({ service, professional });
    triggerTabTransition('appointment');
  };

  // Actions sincronizadas con TanStack Query
  const handleCreateAppointment = async (payload) => {
    try {
      const res = await api.createAppointment(payload);
      syncQueryState(res);
      showToast('Cita programada exitosamente.');
    } catch (err) {
      showToast(err.message);
    }
  };

  const handleCancelAppointment = async (id, reason) => {
    try {
      const res = await api.updateAppointment(id, {
        status: 'Cancelada',
        reason,
        actor: user.name
      });
      syncQueryState(res);
      showToast('Cita cancelada.');
    } catch (err) {
      showToast(err.message);
    }
  };

  const handleUpdateAppointment = async (id, payload) => {
    try {
      const res = await api.updateAppointment(id, {
        ...payload,
        actor: user.name
      });
      syncQueryState(res);
      showToast('Cita actualizada.');
    } catch (err) {
      showToast(err.message);
    }
  };

  const handleEnroll = async (actId) => {
    try {
      const res = await api.enrollActivity(actId, {
        user: user.name,
        actor: user.name
      });
      syncQueryState(res);
      showToast('Inscripción realizada correctamente.');
    } catch (err) {
      showToast(err.message);
    }
  };

  const handleUnenroll = async (enrollmentId) => {
    try {
      const res = await api.unenrollActivity(enrollmentId);
      syncQueryState(res);
      showToast('Inscripción cancelada.');
    } catch (err) {
      showToast(err.message);
    }
  };

  const handleMarkNotificationsRead = async () => {
    const res = await api.markAllNotificationsRead();
    syncQueryState(res);
  };

  const handleSaveAvailability = async (payload) => {
    try {
      const res = await api.saveAvailability(payload);
      syncQueryState(res);
      showToast('Disponibilidad actualizada.');
      return true;
    } catch (err) {
      showToast(err.message);
      return false;
    }
  };

  const handleDeleteAvailability = async (payload) => {
    try {
      const res = await api.deleteAvailability(payload);
      syncQueryState(res);
      showToast('Disponibilidad bloqueada.');
    } catch (err) {
      showToast(err.message);
    }
  };

  const handleSaveAttention = async (payload) => {
    try {
      const res = await api.saveAttention(payload);
      syncQueryState(res);
      showToast('Atención guardada.');
      return true;
    } catch (err) {
      showToast(err.message);
      return false;
    }
  };

  const handleSaveFollowup = async (payload) => {
    try {
      const res = await api.saveFollowup(payload);
      syncQueryState(res);
      showToast('Seguimiento registrado.');
      return true;
    } catch (err) {
      showToast(err.message);
      return false;
    }
  };

  const handleSaveUser = async (payload) => {
    try {
      const res = await api.saveUser({ ...payload, actor: user.name });
      syncQueryState(res);
      showToast('Usuario guardado.');
      return true;
    } catch (err) {
      showToast(err.message);
      return false;
    }
  };

  const handleToggleUser = async (id) => {
    try {
      const res = await api.toggleUser(id, user.name);
      syncQueryState(res);
      showToast('Estado de usuario actualizado.');
    } catch (err) {
      showToast(err.message);
    }
  };

  const handleUpdateRole = async (id, newRole) => {
    try {
      const res = await api.updateUserRole(id, newRole, user.name);
      syncQueryState(res);
      showToast('Rol actualizado.');
    } catch (err) {
      showToast(err.message);
    }
  };

  const handleSaveProfessional = async (payload) => {
    try {
      const res = await api.saveProfessional({ ...payload, actor: user.name });
      syncQueryState(res);
      showToast('Profesional guardado.');
      return true;
    } catch (err) {
      showToast(err.message);
      return false;
    }
  };

  const handleSaveService = async (payload) => {
    try {
      const res = await api.saveService({ ...payload, actor: user.name });
      syncQueryState(res);
      showToast('Servicio guardado.');
      return true;
    } catch (err) {
      showToast(err.message);
      return false;
    }
  };

  const handleToggleService = async (id) => {
    try {
      const res = await api.toggleService(id, user.name);
      syncQueryState(res);
      showToast('Estado del servicio actualizado.');
    } catch (err) {
      showToast(err.message);
    }
  };

  const handleSaveActivity = async (payload) => {
    try {
      const res = await api.saveActivity({ ...payload, actor: user.name });
      syncQueryState(res);
      showToast('Actividad guardada.');
      return true;
    } catch (err) {
      showToast(err.message);
      return false;
    }
  };

  const handleCancelActivity = async (id) => {
    try {
      const res = await api.cancelActivity(id, user.name);
      syncQueryState(res);
      showToast('Actividad cancelada.');
    } catch (err) {
      showToast(err.message);
    }
  };

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  const renderPageContent = () => {
    switch (page) {
      case 'dashboard':
        return (
          <StudentDashboard
            state={state}
            user={user}
            onNavigate={handleNavigate}
          />
        );
      case 'services':
        return (
          <StudentServices
            state={state}
            onStartAppointment={startAppointment}
          />
        );
      case 'professionals':
        return (
          <StudentProfessionals
            state={state}
            onStartAppointment={startAppointment}
          />
        );
      case 'appointment':
        return (
          <AppointmentWizard
            state={state}
            user={user}
            wizardDefaults={wizardDefaults}
            onCreateAppointment={handleCreateAppointment}
            onNavigate={handleNavigate}
            showToast={showToast}
          />
        );
      case 'appointments':
        return (
          <StudentAppointments
            state={state}
            user={user}
            onCancelAppointment={handleCancelAppointment}
            onNewAppointment={() => startAppointment(state.services[0], null)}
            showToast={showToast}
          />
        );
      case 'activities':
        return (
          <StudentActivities
            state={state}
            user={user}
            onEnroll={handleEnroll}
          />
        );
      case 'enrollments':
        return (
          <StudentEnrollments
            state={state}
            user={user}
            onUnenroll={handleUnenroll}
          />
        );
      case 'notifications':
        return (
          <NotificationsView
            state={state}
            onMarkRead={handleMarkNotificationsRead}
          />
        );
      case 'profile':
        return <ProfileView user={user} showToast={showToast} />;

      // Professional
      case 'pro-dashboard':
        return (
          <ProDashboard
            state={state}
            user={user}
            onNavigate={handleNavigate}
            onUpdateAppointment={handleUpdateAppointment}
          />
        );
      case 'availability':
        return (
          <ProAvailability
            state={state}
            user={user}
            onSaveAvailability={handleSaveAvailability}
            onDeleteAvailability={handleDeleteAvailability}
            showToast={showToast}
          />
        );
      case 'pro-appointments':
        return (
          <ProAppointments
            state={state}
            user={user}
            onUpdateAppointment={handleUpdateAppointment}
          />
        );
      case 'attention':
        return (
          <ProAttentions
            state={state}
            user={user}
            onSaveAttention={handleSaveAttention}
            showToast={showToast}
          />
        );
      case 'history':
        return <ProHistory state={state} />;
      case 'followup':
        return (
          <ProFollowup
            state={state}
            user={user}
            onSaveFollowup={handleSaveFollowup}
            showToast={showToast}
          />
        );

      // Admin
      case 'admin-dashboard':
        return <AdminDashboard state={state} />;
      case 'users':
        return (
          <AdminUsers
            state={state}
            onSaveUser={handleSaveUser}
            onToggleUser={handleToggleUser}
            onUpdateRole={handleUpdateRole}
            showToast={showToast}
          />
        );
      case 'professionals-admin':
        return (
          <AdminProfessionals
            state={state}
            onSaveProfessional={handleSaveProfessional}
            showToast={showToast}
          />
        );
      case 'services-admin':
        return (
          <AdminServices
            state={state}
            onSaveService={handleSaveService}
            onToggleService={handleToggleService}
            showToast={showToast}
          />
        );
      case 'appointments-admin':
        return (
          <AdminAppointments
            state={state}
            onUpdateAppointment={handleUpdateAppointment}
          />
        );
      case 'activities-admin':
        return (
          <AdminActivities
            state={state}
            onSaveActivity={handleSaveActivity}
            onCancelActivity={handleCancelActivity}
            showToast={showToast}
          />
        );
      case 'reports':
        return <AdminReports state={state} />;
      case 'audit':
        return <AdminAudit state={state} />;

      default:
        return (
          <StudentDashboard
            state={state}
            user={user}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <>
      {bootLoading && <FullScreenLoader label={loaderText} />}

      {progressKey > 0 && <div key={progressKey} className="top-progress-bar" />}

      {!authenticated ? (
        <div className="page-enter">
          <LoginScreen
            onLogin={handleLogin}
            showToast={showToast}
            backendMode={backendMode}
          />
        </div>
      ) : (
        <div className="flex min-h-screen">
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-20 md:hidden modal-backdrop-anim"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <Sidebar
            role={role}
            page={page}
            sidebarOpen={sidebarOpen}
            onNavigate={handleNavigate}
            onSwitchRole={handleSwitchRole}
            onLogout={handleLogout}
          />

          <main className="flex-1 md:ml-[260px] min-w-0">
            <Topbar
              page={page}
              user={user}
              unreadCount={unreadCount}
              backendMode={backendMode}
              onToggleSidebar={() => setSidebarOpen((o) => !o)}
              onNavigate={handleNavigate}
              onResetDB={handleResetDB}
            />
            <section className="p-5 md:p-7 max-w-[1500px] mx-auto">
              {tabSwitching ? (
                <TabTransitionSkeleton />
              ) : (
                <div key={`${role}-${page}`} className="page-enter">
                  {renderPageContent()}
                </div>
              )}
            </section>
          </main>
        </div>
      )}

      {toastMsg && (
        <div className="toast-anim fixed right-5 bottom-5 bg-[#121826] border border-[#2d3852] px-4 py-3 rounded-xl shadow-rootCard z-50 text-sm text-white">
          {toastMsg}
        </div>
      )}
    </>
  );
}
