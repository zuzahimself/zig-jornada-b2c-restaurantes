import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

export default function App() {
  return (
    <BrandProvider>
      <AuthProvider>
      <MockProvider>
      <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MenuHome />} />
          <Route path="/vendor/:vendorId" element={<VendorMenu />} />
          <Route path="/produto/:id" element={<ProductDetail />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/conta-mesa" element={<TableAccount />} />
          <Route path="/pagamento" element={<Payment />} />
          <Route path="/sucesso" element={<Success />} />
        </Routes>
      </BrowserRouter>
      </CartProvider>
      </MockProvider>
      </AuthProvider>
    </BrandProvider>
  )
}
