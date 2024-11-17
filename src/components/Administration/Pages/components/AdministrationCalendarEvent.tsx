import { Box, Grid, Hidden, Typography } from '@mui/material'
import { Event } from 'react-big-calendar'

const AdministrationCalendarEvent = ({ event }: { event: Event }) => {
    const { title, resource } = event
    return (
        <Box height="100%">
            <Grid container direction="column">
                <Grid item>
                    <Typography variant="body2">{title}</Typography>
                    {resource.phone && <Typography variant="body2">{resource.phone}</Typography>}
                </Grid>
                {resource.completed && (
                    <Hidden mdDown>
                        <Grid item>
                            <Typography variant="body2">Dokončeno</Typography>
                        </Grid>
                    </Hidden>
                )}
            </Grid>
        </Box>
    )
}

export default AdministrationCalendarEvent
