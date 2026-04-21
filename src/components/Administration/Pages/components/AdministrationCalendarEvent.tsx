import { Box, Grid, Hidden, Typography } from '@mui/material'
import { Event } from 'react-big-calendar'

const AdministrationCalendarEvent = ({ event }: { event: Event }) => {
    const { title, resource } = event

    return (
        <Box height="100%">
            <Grid container direction="column">
                <Grid item>
                    <Typography
                        variant="body2"
                        sx={(theme) => ({
                            textTransform: 'capitalize',
                            fontWeight: '600',
                            color: theme.palette.getContrastText(theme.palette.primary.main),
                        })}
                    >
                        {title}
                    </Typography>
                    {resource.phone && (
                        <Typography
                            variant="caption"
                            sx={(theme) => ({
                                textTransform: 'capitalize',
                                color: theme.palette.getContrastText(theme.palette.primary.main),
                            })}
                        >
                            {resource.phone}
                        </Typography>
                    )}
                </Grid>
                {resource.completed && (
                    <Hidden mdDown>
                        <Grid item>
                            <Typography variant="caption">Dokončeno</Typography>
                        </Grid>
                    </Hidden>
                )}
            </Grid>
        </Box>
    )
}

export default AdministrationCalendarEvent
