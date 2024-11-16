import { Box, Breadcrumbs, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'

const breadcrumbNameMap = {
    '/orders': 'Objednávky',
    '/services': 'Měsíční plány',
    '/calendar': 'Kalendář',
    '/admin': 'Přehled',
    '/announcements': 'Oznámení',
    '/settings': 'Nastavení',
} as const

type PathNames = (keyof typeof breadcrumbNameMap)[]

const AdministrationPathBreadcrumbs = () => {
    const location = useLocation()
    const pathnames = location.pathname.split('/admin/').filter((x) => x) as PathNames
    return (
        <Box
            sx={{
                flexGrow: 1,
                '& .MuiTypography-root': {
                    fontSize: '1.5rem',
                },
            }}
        >
            <Breadcrumbs aria-label="breadcrumb" sx={{ color: 'white' }} separator={''}>
                {pathnames.map((value) => {
                    return (
                        <Typography color="white" key={value} fontWeight="600">
                            {
                                breadcrumbNameMap[
                                    value === '/admin'
                                        ? value
                                        : (`/${value}` as keyof typeof breadcrumbNameMap)
                                ]
                            }
                        </Typography>
                    )
                })}
            </Breadcrumbs>
        </Box>
    )
}

export default AdministrationPathBreadcrumbs
