import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import FoodMenu from "./pages/FoodMenu";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import OrderDetails from './pages/OrderDetails';
import AdminDashboard from "./admin_pages/AdminDashboard";
import AdminMenu from "./admin_pages/AdminMenu";
import AdminOrders from "./admin_pages/AdminOrders";
import AdminProfile from "./admin_pages/AdminProfile";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                    <Dashboard />
                    </ProtectedRoute>}/>
                <Route path="/menu" element={
                   <ProtectedRoute>
                   <FoodMenu />
                   </ProtectedRoute>}/>
                <Route path="/orders" element={
                    <ProtectedRoute>
                    <Orders />
                    </ProtectedRoute>}/>
                <Route path="/profile" element={
                    <ProtectedRoute>
                    <Profile />
                    </ProtectedRoute>}/>
                <Route path="/cart" element={
                    <ProtectedRoute>
                    <Cart />
                    </ProtectedRoute>}/>
                <Route path="/order-details/:id" element={
                    <ProtectedRoute>
                        <OrderDetails />
                    </ProtectedRoute>
                }/>
                <Route path="/admin/dashboard" element={
                    <ProtectedRoute>
                    <AdminDashboard />
                    </ProtectedRoute>}/>
                <Route path="/admin/menu" element={
                     <ProtectedRoute>
                        <AdminMenu />
                     </ProtectedRoute>}/>
                <Route path="/admin/orders" element={
                    <ProtectedRoute>
                        <AdminOrders />
                    </ProtectedRoute>}/>
                <Route path="/admin/profile" element={
                    <ProtectedRoute>
                        <AdminProfile />
                    </ProtectedRoute>}/>
            </Routes>
        </BrowserRouter>
    );
}
export default App;