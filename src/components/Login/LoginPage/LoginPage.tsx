import { yupResolver } from '@hookform/resolvers/yup'
import { Mail, Password } from '@mui/icons-material'
import { Box, Button, CircularProgress, InputAdornment, Typography, styled } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { useForm } from 'react-hook-form'
import { useUser } from 'src/context/User/UserProvider'
import * as yup from 'yup'
import { isMobile } from '../../../utils'
//@ts-ignore
import FormInput from '../../common/Form/FormInput'

const StyledRoot = styled(Box)(({ theme }) => ({
    display: 'flex',
    ...(isMobile
        ? {
              height: '100vh',
              width: '100vw',
          }
        : {
              color: 'white',
              backgroundColor: theme.palette.primary.main,
              borderRadius: 12,
              height: '60vh',
              width: '60vw',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.35)',
          }),
    transition: 'all 0.6s ease-in-out',
}))

const LoginPage = ({
    logo = <></>,
    onGetUser = () => {},
    onRegisterClick = () => {},
    isRegistrationEnabled = false,
}) => {
    const { logIn, userError, isLoadingUser, isLoggedIn } = useUser()
    const { handleSubmit, control, formState } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        resolver: yupResolver(
            yup.object().shape({
                email: yup.string().email().required(),
                password: yup.string().required(),
            }),
        ),
        defaultValues: { email: '', password: '' },
    })

    const onSubmit = async ({ email, password }: { email: string; password: string }) => {
        logIn({ email, password })
        if (isLoggedIn) onGetUser()
    }
    return (
        <Grid
            container
            justifyContent="center"
            alignContent="center"
            direction="column"
            sx={{
                height: '100vh',
                margin: 'auto',
            }}
            spacing={2}
        >
            <StyledRoot component="form">
                <Grid container flexDirection="column" padding={isMobile ? 4 : 8}>
                    <Grid>
                        <Typography variant="h3" textAlign="center" fontWeight={'bold'}>
                            Administrace
                        </Typography>
                    </Grid>
                    <Grid sx={{ width: isMobile ? '80vw' : '25vw' }}>
                        <Grid>
                            <FormInput
                                type="email"
                                name={'email'}
                                control={control}
                                placeholder="E-mail"
                                label="E-mail"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Mail />
                                        </InputAdornment>
                                    ),
                                }}
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid>
                            <FormInput
                                type="password"
                                name={'password'}
                                control={control}
                                placeholder="Heslo"
                                label="Heslo"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Password />
                                        </InputAdornment>
                                    ),
                                }}
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={(theme) => ({
                                    marginTop: 2,
                                    borderRadius: 2,
                                    backgroundColor: 'white !important',
                                    color: theme.palette.primary.main,
                                })}
                                onClick={handleSubmit(onSubmit)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSubmit(onSubmit)
                                    }
                                }}
                                fullWidth
                                disabled={!formState.isValid || formState.submitCount >= 3 || isLoadingUser}
                            >
                                {!isLoadingUser ? 'Přihlásit se' : <CircularProgress size={22} />}
                            </Button>
                            {logo && logo}
                        </Grid>
                    </Grid>
                </Grid>
                {!isMobile && (
                    <Grid
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="column"
                        gap={1}
                        sx={{
                            backgroundColor: 'white',
                            width: '30vw',
                            transition: 'all 0.6s ease-in-out',
                            borderRadius: '150px 0 0 100px',
                        }}
                    >
                        <Typography variant="h3" fontWeight={'bold'} sx={{ color: 'black' }}>
                            Vítejte zpět
                        </Typography>
                        {isRegistrationEnabled && (
                            <>
                                <Typography variant="body1" textAlign="center" sx={{ color: 'black' }}>
                                    V případě, že nemáte existujicí účet, využijte registraci níže.
                                </Typography>
                                <Grid sx={{ textAlign: 'center' }}>
                                    <Button
                                        size="large"
                                        variant="contained"
                                        sx={{
                                            fontSize: 12,
                                            color: 'primary',
                                            cursor: 'pointer',
                                            textTransform: 'uppercase',
                                            borderRadius: 2,
                                        }}
                                        onClick={onRegisterClick}
                                    >
                                        Vytvořít nový účet
                                    </Button>
                                </Grid>
                            </>
                        )}
                    </Grid>
                )}
            </StyledRoot>
            {userError && (
                <Grid>
                    <Typography variant="body1" color="error">
                        {userError?.message}
                    </Typography>
                </Grid>
            )}
        </Grid>
    )
}

export default LoginPage
