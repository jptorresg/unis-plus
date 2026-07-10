export const colors = {
  primary: {
    900: '#3d0013',
    800: '#5c001e',
    700: '#840029', // color institucional base
    600: '#a3003a',
    500: '#c2004d',
    100: '#fce8ef',
    50: '#fff5f8',
  },
  neutral: {
    950: '#0f0a0c',
    700: '#3d3540',
    400: '#9b8fa0',
    200: '#e8e2eb',
    100: '#f4f0f5',
    0: '#ffffff',
  },
  semantic: {
    error: '#c0392b',
    errorBg: '#fdf3f2',
    success: '#1a7f4b',
    successBg: '#f0faf5',
  },
} as const

export const shadows = {
  card: {
    shadowColor: '#840029',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
} as const

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  pill: 999,
} as const

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const
