import { useState, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useBrand } from '../context/BrandContext'
import { getTextOnBackground } from '../lib/colorSystem'

function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const { tokens } = useBrand()
  const brandFill = tokens['--color-brand-fill']
  const buttonText = getTextOnBackground(brandFill)

  const [name, setName] = useState('')
  const [cpf, setCpf] = useState('')
  const [phone, setPhone] = useState('')
  const [isForeigner, setIsForeigner] = useState(false)

  const returnTo = searchParams.get('returnTo')

  const isValid = name.trim().length >= 2 && (
    isForeigner ? phone.replace(/\D/g, '').length >= 10 : cpf.replace(/\D/g, '').length === 11
  )

  const doNavigateBack = useCallback((rt: string | null) => {
    if (rt === 'cart') {
      navigate('/?openCart=1', { replace: true })
    } else {
      navigate(rt || '/', { replace: true })
    }
  }, [navigate])

  const handleSubmit = useCallback(() => {
    if (!isValid) return
    login({
      name: name.trim(),
      ...(isForeigner ? { phone: phone.replace(/\D/g, '') } : { cpf: cpf.replace(/\D/g, '') }),
    })
    doNavigateBack(returnTo)
  }, [isValid, login, name, isForeigner, phone, cpf, doNavigateBack, returnTo])

  function handleSocialLogin(provider: string) {
    login({ name: `Usuário ${provider}` })
    doNavigateBack(returnTo)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <motion.div
        className="flex-1 flex flex-col items-center px-6 pt-16 pb-8 overflow-y-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        {/* Logo */}
        <img
          src="/logo-mana.png"
          alt="Mana"
          className="h-12 mb-8 object-contain"
        />

        {/* Title */}
        <h1 className="font-display text-xl font-bold text-txt-primary text-center mb-1">
          Para continuar, entre na sua conta
        </h1>
        <p className="text-sm text-txt-secondary text-center mb-8">
          Precisamos saber quem está pedindo
        </p>

        {/* Social buttons */}
        <div className="w-full flex flex-col gap-3 mb-6">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSocialLogin('Google')}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-border text-sm font-semibold text-txt-primary"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
            </svg>
            Entrar com Google
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSocialLogin('Apple')}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-black text-white text-sm font-semibold"
          >
            <svg width="16" height="18" viewBox="0 0 16 18" fill="currentColor">
              <path d="M12.845 9.52c-.018-1.96 1.6-2.903 1.673-2.95-.912-1.332-2.33-1.515-2.834-1.536-1.206-.122-2.354.71-2.967.71-.613 0-1.56-.692-2.564-.673-1.32.02-2.537.767-3.216 1.95-1.372 2.38-.351 5.907.986 7.84.654.945 1.432 2.008 2.455 1.97.985-.04 1.357-.638 2.548-.638 1.19 0 1.525.638 2.564.617 1.06-.02 1.73-.965 2.38-1.913.75-1.097 1.06-2.16 1.078-2.215-.024-.01-2.068-.794-2.088-3.15l-.015-.012ZM10.87 3.34c.543-.658.91-1.572.81-2.484-.783.032-1.731.522-2.292 1.18-.503.582-.943 1.512-.825 2.403.874.068 1.764-.444 2.307-1.1Z"/>
            </svg>
            Entrar com Apple
          </motion.button>
        </div>

        {/* Divider */}
        <div className="w-full flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-txt-tertiary">ou</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Form */}
        <div className="w-full flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-txt-secondary mb-1.5 block">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              className="w-full px-4 py-3 rounded-xl border border-border text-sm text-txt-primary placeholder:text-txt-tertiary focus:outline-none focus:border-brand-fill transition-colors"
            />
          </div>

          {/* CPF or Phone */}
          {!isForeigner ? (
            <div>
              <label className="text-xs font-semibold text-txt-secondary mb-1.5 block">CPF</label>
              <input
                type="text"
                inputMode="numeric"
                value={cpf}
                onChange={(e) => setCpf(formatCpf(e.target.value))}
                placeholder="000.000.000-00"
                className="w-full px-4 py-3 rounded-xl border border-border text-sm text-txt-primary placeholder:text-txt-tertiary focus:outline-none focus:border-brand-fill transition-colors"
              />
            </div>
          ) : (
            <div>
              <label className="text-xs font-semibold text-txt-secondary mb-1.5 block">Telefone</label>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-3 py-3 rounded-xl border border-border text-sm text-txt-secondary shrink-0">
                  <span>🇧🇷</span>
                  <span>+55</span>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="(00) 00000-0000"
                  className="w-full px-4 py-3 rounded-xl border border-border text-sm text-txt-primary placeholder:text-txt-tertiary focus:outline-none focus:border-brand-fill transition-colors"
                />
              </div>
            </div>
          )}

          {/* Foreigner toggle */}
          <button
            onClick={() => {
              setIsForeigner(!isForeigner)
              setCpf('')
              setPhone('')
            }}
            className="flex items-center gap-2 text-sm text-brand-text font-medium self-start"
          >
            <Globe size={14} />
            {isForeigner ? 'Tenho CPF brasileiro' : 'Sou estrangeiro'}
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1 min-h-6" />

        {/* Submit */}
        <motion.button
          whileTap={isValid ? { scale: 0.97 } : undefined}
          disabled={!isValid}
          onClick={handleSubmit}
          className="w-full py-3.5 rounded-xl text-sm font-bold transition-opacity mt-4"
          style={{
            backgroundColor: brandFill,
            color: buttonText,
            opacity: isValid ? 1 : 0.4,
          }}
        >
          Continuar
        </motion.button>

        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-sm text-txt-secondary"
        >
          Voltar ao cardápio
        </button>
      </motion.div>
    </div>
  )
}
