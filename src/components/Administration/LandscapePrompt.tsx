import { ScreenRotation } from '@mui/icons-material'
import { Box, Fade, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { isMobile } from '../../utils'

const LandscapePrompt = () => {
    const [isPortrait, setIsPortrait] = useState(
        () => isMobile && window.matchMedia('(orientation: portrait)').matches,
    )

    useEffect(() => {
        if (!isMobile) return
        const mq = window.matchMedia('(orientation: portrait)')
        const handler = (e: MediaQueryListEvent) => setIsPortrait(e.matches)
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [])

    if (!isMobile || !isPortrait) return null

    return (
        <Fade in>
            <Box
                sx={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    backgroundColor: 'background.paper',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3,
                }}
            >
                <ScreenRotation
                    sx={{
                        fontSize: 64,
                        color: 'primary.main',
                        animation: 'rotate90 1.4s ease-in-out infinite',
                        '@keyframes rotate90': {
                            '0%': { transform: 'rotate(0deg)' },
                            '40%': { transform: 'rotate(90deg)' },
                            '60%': { transform: 'rotate(90deg)' },
                            '100%': { transform: 'rotate(0deg)' },
                        },
                    }}
                />
                <Box sx={{ textAlign: 'center', px: 4 }}>
                    <Typography sx={{ fontWeight: 500, fontSize: 18, mb: 0.5 }}>
                        Otočte zařízení
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                        Pro použití administrace otočte zařízení do režimu na šířku.
                    </Typography>
                </Box>
            </Box>
        </Fade>
    )
}

export default LandscapePrompt
