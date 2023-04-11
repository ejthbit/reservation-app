import PropTypes from 'prop-types'
import { Box, Grid, Hidden, Typography } from '@mui/material'

const AdministrationCalendarEvent = ({ event }) => {
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

AdministrationCalendarEvent.propTypes = {
    event: PropTypes.object,
}

export default AdministrationCalendarEvent
