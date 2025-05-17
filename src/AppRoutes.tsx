import { Route, Routes, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Deals = lazy(() => import("./pages/Deals"));
const Members = lazy(() => import("./pages/Members"));
const Settings = lazy(() => import("./pages/Settings"));
const SubAdmin = lazy(() => import("./pages/SubAdmin"));
import Layout from "./components/custom/Layout";

const AppRoutes = () => {
    return (
      <Suspense fallback={<div>Loading...</div>}>
      <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>}/>
          <Route path="/deals" element={<Layout><Deals/></Layout>}/>
           <Route path="/members" element={<Layout><Members/></Layout>}/>
           <Route path="/settings" element={<Layout><Settings/></Layout>}/>
           <Route path="/subadmin" element={<Layout><SubAdmin/></Layout>}/>
          {/*<Route path="/search/:city" element={<Layout showHero={false}><SearchPage/></Layout>}/>
          <Route path="/detail/:restaurantId" element={<Layout showHero={false}><DetailPage/></Layout>}/>
          <Route element={<ProtectedRoute/>}>
              <Route path="/user-profile" element={<Layout><UserProfilePage/></Layout>}/>
              <Route path="/manage-restaurant" element={<Layout><ManageRestaurantPage/></Layout>}/>
              <Route path="/order-status" element={<Layout><OrderStatusPage/></Layout>}/>
          </Route> */}
          <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
            </Suspense>
  )
}
export default AppRoutes;