export const fmtKz = (n: number) =>
  'Kz ' + Math.round(n).toLocaleString('pt-AO')

export const fmtKzShort = (n: number): string => {
  if (n >= 1e9) return 'Kz ' + (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return 'Kz ' + (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return 'Kz ' + (n / 1e3).toFixed(1) + 'K'
  return 'Kz ' + n
}

export const initials = (name: string): string =>
  name.split(' ').filter(Boolean).map((p) => p[0]).slice(0, 2).join('').toUpperCase()

export const avatarColor = (name: string): string => {
  const palette = ['#FF7607','#9C4500','#1D4ED8','#0E7C4A','#7C3AED','#B45309','#0891B2','#BE185D']
  const hash = (name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return palette[hash % palette.length]
}

export const today = (): string => new Date().toISOString().slice(0, 10)
