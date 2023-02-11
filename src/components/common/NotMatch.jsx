import { Box, Button, Fade, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const NotMatch = () => (
    <Fade in timeout={{ enter: 600 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h1">404</Typography>
            <Typography>Stránka, kterou jste hledali, zřejmě neexistuje.</Typography>
            <Button component={Link} to="/">
                Vrátit se na hlavní stránku
            </Button>
        </Box>
    </Fade>
)

export default NotMatch
