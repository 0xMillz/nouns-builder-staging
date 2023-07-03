import { keyframes, style } from '@vanilla-extract/css'
import { atoms } from '@zoralabs/zord'

export const feed = style([
  atoms({
    m: 'auto',
  }),
  {
    maxWidth: 912,
  },
])

export const castCardStyle = style({})

const pulse = keyframes({
  '0%': { opacity: '1' },
  '100%': { opacity: '1' },
  '50%': { opacity: '.5' },
})

export const cardSkeleton = style({
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
  maxWidth: '45rem',
  height: '8.5rem',
  marginBottom: '1.6rem',
})

export const cardWrapper = style({
  width: '100%',
  transition: 'all 0.15s ease-in-out',
  selectors: {
    '&:hover': {
      backgroundColor: '#fafafa',
      cursor: 'pointer',
    },
  },
})
export const loadMoreButton = style({
  maxWidth: '45rem',
  width: '100%',
})

export const pfpStyles = style({
  position: 'absolute',
  top: '50%',
  left: '50%',
  height: '100%',
  width: '100%',
  transform: 'translate(-50%, -50%)',
  objectFit: 'cover',
  borderRadius: '50%',
})
export const pfpWrapper = style({
  width: '32px',
  height: '32px',
  position: 'relative',
  overflow: 'hidden',
})
