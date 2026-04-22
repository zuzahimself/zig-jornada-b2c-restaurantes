import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { BrandProvider } from './context/BrandContext'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { MockProvider } from './context/MockContext'
import { MenuHome } from './pages/MenuHome'
import { ProductDetail } from './pages/ProductDetail'
import { Cart } from './pages/Cart'
import { Login } from './pages/Login'
import { TableAccount } from './pages/TableAccount'
import { Payment } from './pages/Payment'
import { Success } from './pages/Success'
import { VendorMenu } from './pages/VendorMenu'

function AppRoutes() {
  const location = useLocation()
  const state = location.state as { backgroundLocation?: Location } | null
  const backgroundLocation = state?.backgroundLocation

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<MenuHome />} />
        <Route path="/vendor/:vendorId" element={<VendorMenu />} />
        <Route path="/produto/:id" element={<ProductDetail />} />
        <Route path="/carrinho" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/conta-mesa" element={<TableAccount />} />
        <Route path="/pagamento" element={<Payment />} />
        <Route path="/sucesso" element={<Success />} />
      </Routes>

      {/* Desktop modal: render ProductDetail on top of background page */}
      {backgroundLocation && (
        <Routes>
          <Route path="/produto/:id" element={<ProductDetail />} />
        </Routes>
      )}
    </>
  )
}

export default function App() {
  return (
    <BrandProvider>
      <AuthProvider>
      <MockProvider>
      <CartProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      </CartProvider>
      </MockProvider>
      </AuthProvider>
    </BrandProvider>
  )
}
