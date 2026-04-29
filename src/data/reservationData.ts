// ─── Reservation mock data ──────────────────────────────────────────────────

export interface AvailableDate {
  date: Date
  slots: string[]
}

export interface Room {
  id: string
  name: string
}

/** Generate 5 upcoming dates with mock available time slots */
function generateDates(): AvailableDate[] {
  const today = new Date()
  const dates: AvailableDate[] = []

  for (let i = 1; i <= 5; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)

    // Vary slot count per day
    const allSlots = ['11:30', '12:00', '12:30', '13:00', '13:30', '19:00', '19:30', '20:00', '20:30', '21:00']
    const count = [1, 4, 2, 3, 2][i - 1]
    const slots = allSlots.slice(0, count)

    dates.push({ date: d, slots })
  }

  return dates
}

export const availableDates: AvailableDate[] = generateDates()

export const rooms: Room[] = [
  { id: 'salao', name: 'Salão Principal' },
  { id: 'terraco', name: 'Terraço' },
]

export const reservationRules = {
  title: 'Regras e condições',
  rules: [
    'Reservas podem ser feitas com até 30 dias de antecedência.',
    'Mantemos a mesa por 15 minutos após o horário marcado.',
    'Cancelamentos devem ser feitos até 2h antes.',
    'Informar alergias ou restrições no momento da reserva.',
    'Consulta disponibilidade sujeita à lotação.',
  ],
  toleranceTitle: 'Tolerância',
  toleranceDescription: 'Mantemos a mesa por 15 minutos após o horário marcado.',
}

export const restaurantInfo = {
  name: 'Mana Restaurante',
  address: 'Rua das Hortênsias, 412, Rio Vermelho',
  city: 'Salvador, BA',
  logo: '/logo-mana.png',
}

/** Format a Date to "DD Mmm" (e.g. "23 Jan") */
export function formatDateShort(d: Date): { day: string; month: string } {
  const day = String(d.getDate()).padStart(2, '0')
  const month = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
  return { day, month: month.charAt(0).toUpperCase() + month.slice(1) }
}

/** Format a Date to full Portuguese (e.g. "Quarta-Feira, 29 de Outubro de 2025") */
export function formatDateFull(d: Date): string {
  return d.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).replace(/^\w/, (c) => c.toUpperCase())
}
