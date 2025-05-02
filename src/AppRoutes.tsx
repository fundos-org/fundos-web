import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/custom/Layout";
import Dashboard from "./pages/Dashboard";
import Deals from "./pages/Deals";

const AppRoutes = () => {
  return (
      <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>}/>
          <Route path="/deals" element={<Layout><Deals/></Layout>}/>
          {/* <Route path="/auth-callback" element={<AuthCallbackPage/>}/>
          <Route path="/search/:city" element={<Layout showHero={false}><SearchPage/></Layout>}/>
          <Route path="/detail/:restaurantId" element={<Layout showHero={false}><DetailPage/></Layout>}/>
          <Route element={<ProtectedRoute/>}>
              <Route path="/user-profile" element={<Layout><UserProfilePage/></Layout>}/>
              <Route path="/manage-restaurant" element={<Layout><ManageRestaurantPage/></Layout>}/>
              <Route path="/order-status" element={<Layout><OrderStatusPage/></Layout>}/>
          </Route> */}
          <Route path="*" element={<Navigate to="/"/>}/>
      </Routes>
  )
}
export default AppRoutes;