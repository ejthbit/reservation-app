import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const AdministrationServiceCardButton = ({ color = '#FFF', icon, title, description, onClick }) => {
    const Icon = icon
    return (
        <Card
            sx={(theme) => ({
                borderRadius: 6,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.getContrastText(color),
                width: 300,
                textAlign: 'center',
                height: description ? 350 : 150,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 1,
                border: `1px solid transparent `,
                transition: 'border .5s linear, opacity .25s ease-in',
                ':hover': {
                    opacity: 0.5,
                    borderColor: theme.palette.primary.main,
                },
            })}
            onClick={onClick}
        >
            <CardHeader avatar={<Icon sx={{ width: 50, height: 50 }} />} />
            <CardContent sx={{ paddingTop: 0 }}>
                <Typography gutterBottom variant="body1" component="div">
                    {title.toUpperCase()}
                </Typography>
                {description && (
                    <Typography variant="body2" sx={{ opacity: 0.8, height: '160px', marginBottom: 2 }}>
                        {description}
                    </Typography>
                )}
            </CardContent>
        </Card>
    )
}

AdministrationServiceCardButton.propTypes = {
    icon: PropTypes.object,
    title: PropTypes.string,
    description: PropTypes.string,
    onClick: PropTypes.func,
}

export default AdministrationServiceCardButton
