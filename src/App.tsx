import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { BrandProvider } from './context/BrandContext'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { MockProvider, useMock } from './context/MockContext'
import { MenuHome } from './pages/MenuHome'
import { ProductDetail } from './pages/ProductDetail'
import { Cart } from './pages/Cart'
import { Login } from './pages/Login'
import { TableAccount } from './pages/TableAccount'
import { Payment } from './pages/Payment'
import { Success } from './pages/Success'
import { VendorMenu } from './pages/VendorMenu'
import { Identify } from './pages/Identify'

function AppRoutes() {
  const location = useLocation()
  const { journeyMode } = useMock()
  const state = location.state as { backgroundLocation?: Location } | null
  const backgroundLocation = state?.backgroundLocation

  if (journeyMode === 'paymentOnly') {
    return (
      <Routes>
        <Route path="/" element={<Identify />} />
        <Route path="/conta-mesa" element={<TableAccount />} />
        <Route path="/pagamento" element={<Payment />} />
        <Route path="/sucesso" element={<Success />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  if (journeyMode === 'menuOnly') {
    return (
      <>
        <Routes location={backgroundLocation || location}>
          <Route path="/" element={<MenuHome />} />
          <Route path="/vendor/:vendorId" element={<VendorMenu />} />
          <Route path="/produto/:id" element={<ProductDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {backgroundLocation && (
          <Routes>
            <Route path="/produto/:id" element={<ProductDetail />} />
          </Routes>
        )}
      </>
    )
  }

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
