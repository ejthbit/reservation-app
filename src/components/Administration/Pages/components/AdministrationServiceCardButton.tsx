import { Card, CardContent, CardHeader, SvgIconProps, Typography } from '@mui/material'
import React from 'react'

type AdministrationServiceCardButtonProps = {
    color: string
    icon: React.ElementType
    title: string
    description: string
    onClick: () => void
}

type IconProps = {
    icon: React.ElementType
    sx?: SvgIconProps['sx']
}

const Icon = ({ icon: IconComponent, sx }: IconProps) => {
    return <IconComponent sx={sx} />
}

const AdministrationServiceCardButton = ({
    color = '#FFF',
    icon,
    title,
    description,
    onClick,
}: AdministrationServiceCardButtonProps) => {
    return (
        <Card
            sx={(theme) => ({
                background: theme.palette.primary.main,
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
            <CardHeader avatar={<Icon icon={icon} sx={{ width: 50, height: 50 }} />} />
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

export default AdministrationServiceCardButton
