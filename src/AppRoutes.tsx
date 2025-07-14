import { Route, Routes, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AppRoute } from './RoutesEnum';
import AdminDashboard from './pages/AdminDashboard';
const KycDashboard = lazy(() => import('./pages/KycDashboard'));
const SubadminDashboard = lazy(() => import('./pages/SubadminDashboard'));
const Deals = lazy(() => import('./pages/Deals'));
const Members = lazy(() => import('./pages/Members'));
const Settings = lazy(() => import('./pages/Settings'));
const SubAdmin = lazy(() => import('./pages/SubAdmin'));
const SignIn = lazy(() => import('./pages/SignIn'));
const Layout = lazy(() => import('./components/custom/Layout'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path={AppRoute.ROOT} element={<SignIn />} />
        {/* /admin and /admin/subadmin */}
        <Route path={AppRoute.ADMIN}>
          <Route
            index
            path={AppRoute.ADMIN_SUBADMIN}
            element={
              <Layout>
                <SubAdmin />
              </Layout>
            }
          />
          <Route
            path={AppRoute.ADMIN_DASHBOARD}
            element={
              <Layout>
                <AdminDashboard />
              </Layout>
            }
          />
        </Route>

        {/* /subadmin and its children */}
        <Route path={AppRoute.SUBADMIN}>
          <Route
            index
            path={AppRoute.SUBADMIN_DASHBOARD}
            element={
              <Layout>
                <SubadminDashboard />
              </Layout>
            }
          />
          <Route
            path={AppRoute.SUBADMIN_DEALS}
            element={
              <Layout>
                <Deals />
              </Layout>
            }
          />
          <Route
            path={AppRoute.SUBADMIN_MEMBERS}
            element={
              <Layout>
                <Members />
              </Layout>
            }
          />
          <Route
            path={AppRoute.SUBADMIN_SETTINGS}
            element={
              <Layout>
                <Settings />
              </Layout>
            }
          />
        </Route>

        {/* /kyc/dashboard */}
        <Route path={AppRoute.KYC}>
          <Route
            index
            path={AppRoute.KYC_DASHBOARD}
            element={
              <Layout>
                <KycDashboard />
              </Layout>
            }
          />
        </Route>
        {/*<Route path="/search/:city" element={<Layout showHero={false}><SearchPage/></Layout>}/>
          <Route path="/detail/:restaurantId" element={<Layout showHero={false}><DetailPage/></Layout>}/>
          <Route element={<ProtectedRoute/>}>
              <Route path="/user-profile" element={<Layout><UserProfilePage/></Layout>}/>
              <Route path="/manage-restaurant" element={<Layout><ManageRestaurantPage/></Layout>}/>
              <Route path="/order-status" element={<Layout><OrderStatusPage/></Layout>}/>
          </Route> */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};
export default AppRoutes;
