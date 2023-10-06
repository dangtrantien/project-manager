import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';

import MainLayout from './pages/Layout/MainLayout';
import MiniLayout from './pages/Layout/MiniLayout';
import ErrorPage from './component/UI/Error';
import IsLoading from './component/UI/IsLoading';
import { store } from './store/index';

const DashboardPage = lazy(() => import('./pages/Directory/Dashboard'));
const NewCategoryPage = lazy(() =>
  import('./component/Directory/Dashboard/NewCategory')
);
const ProjectStatePage = lazy(() => import('./pages/Directory/ProjectState'));
const NewProjectStatePage = lazy(() =>
  import('./component/Directory/ProjectState/NewProjectState')
);
const TechStackPage = lazy(() => import('./pages/Directory/TechStack'));
const NewTechStackPage = lazy(() =>
  import('./component/Directory/TechStack/NewTechStack')
);
const ClientPage = lazy(() => import('./pages/Directory/Client'));
const NewClientPage = lazy(() =>
  import('./component/Directory/Client/NewClient')
);
const DepartmentPage = lazy(() => import('./pages/Manager/Department'));
const NewDepartmentPage = lazy(() =>
  import('./component/Manager/Department/NewDepartment')
);
const DepartmentDetailPage = lazy(() =>
  import('./component/Manager/Department/DepartmentDetail')
);
const EmployeePage = lazy(() => import('./pages/Manager/Employee'));
const NewEmployeePage = lazy(() =>
  import('./component/Manager/Employee/NewEmployee')
);
const EmployeeDetailPage = lazy(() =>
  import('./component/Manager/Employee/EmployeeDetail/EmployeeDetail')
);
const ProjectPage = lazy(() => import('./pages/Manager/Project'));
const NewProjectPage = lazy(() =>
  import('./component/Manager/Project/NewProject')
);
const ProjectDetailPage = lazy(() =>
  import('./component/Manager/Project/ProjectDetail')
);
const TotalProjectPage = lazy(() => import('./pages/Report/TotalProject'));
const TotalEmployeePage = lazy(() => import('./pages/Report/TotalEmployee'));
const LoginPage = lazy(() => import('./pages/Auth/Login'));
const RegisterPage = lazy(() => import('./pages/Auth/Register'));

// ==================================================

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/',
            element: (
              <Suspense fallback={<IsLoading />}>
                <DashboardPage />
              </Suspense>
            ),
          },
          {
            path: '/dashboard',
            element: (
              <Suspense fallback={<IsLoading />}>
                <DashboardPage />
              </Suspense>
            ),
          },
          {
            path: '/new-category',
            element: (
              <Suspense fallback={<IsLoading />}>
                <NewCategoryPage />
              </Suspense>
            ),
          },
          {
            path: '/project-state',
            element: (
              <Suspense fallback={<IsLoading />}>
                <ProjectStatePage />
              </Suspense>
            ),
          },
          {
            path: '/new-project-state',
            element: (
              <Suspense fallback={<IsLoading />}>
                <NewProjectStatePage />
              </Suspense>
            ),
          },
          {
            path: '/tech-stack',
            element: (
              <Suspense fallback={<IsLoading />}>
                <TechStackPage />
              </Suspense>
            ),
          },
          {
            path: '/new-tech-stack',
            element: (
              <Suspense fallback={<IsLoading />}>
                <NewTechStackPage />
              </Suspense>
            ),
          },
          {
            path: '/client',
            element: (
              <Suspense fallback={<IsLoading />}>
                <ClientPage />
              </Suspense>
            ),
          },
          {
            path: '/new-client',
            element: (
              <Suspense fallback={<IsLoading />}>
                <NewClientPage />
              </Suspense>
            ),
          },
          {
            path: '/department',
            element: (
              <Suspense fallback={<IsLoading />}>
                <DepartmentPage />
              </Suspense>
            ),
          },
          {
            path: '/new-department',
            element: (
              <Suspense fallback={<IsLoading />}>
                <NewDepartmentPage />
              </Suspense>
            ),
          },
          {
            path: '/d/:departmentId',
            element: (
              <Suspense fallback={<IsLoading />}>
                <DepartmentDetailPage />
              </Suspense>
            ),
          },
          {
            path: '/employee',
            element: (
              <Suspense fallback={<IsLoading />}>
                <EmployeePage />
              </Suspense>
            ),
          },
          {
            path: '/new-employee',
            element: (
              <Suspense fallback={<IsLoading />}>
                <NewEmployeePage />
              </Suspense>
            ),
          },
          {
            path: '/e/:employeeId',
            element: (
              <Suspense fallback={<IsLoading />}>
                <EmployeeDetailPage />
              </Suspense>
            ),
          },
          {
            path: '/project',
            element: (
              <Suspense fallback={<IsLoading />}>
                <ProjectPage />
              </Suspense>
            ),
          },
          {
            path: '/new-project',
            element: (
              <Suspense fallback={<IsLoading />}>
                <NewProjectPage />
              </Suspense>
            ),
          },
          {
            path: '/p/:projectId',
            element: (
              <Suspense fallback={<IsLoading />}>
                <ProjectDetailPage />
              </Suspense>
            ),
          },
          {
            path: '/total-project',
            element: (
              <Suspense fallback={<IsLoading />}>
                <TotalProjectPage />
              </Suspense>
            ),
          },
          {
            path: '/total-employee',
            element: (
              <Suspense fallback={<IsLoading />}>
                <TotalEmployeePage />
              </Suspense>
            ),
          },
        ],
      },
      {
        element: <MiniLayout />,
        children: [
          {
            path: '/login',
            element: (
              <Suspense fallback={<IsLoading />}>
                <LoginPage />
              </Suspense>
            ),
          },
          {
            path: '/register',
            element: (
              <Suspense fallback={<IsLoading />}>
                <RegisterPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider locale={viVN}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  );
}

export default App;
