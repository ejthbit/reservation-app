import { yupResolver } from '@hookform/resolvers/yup'
import { Mail, Password } from '@mui/icons-material'
import { Button, CircularProgress, Typography, Link, InputAdornment, Box } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useLazySignInQuery } from '../../../store/userInfo/services'
import { isSuccess } from '../../../utils'
import FormInput from '../../common/Form/FormInput'

const LoginPage = ({ logo, onGetUser, onRegisterClick, isRegistrationEnabled }) => {
    const [signIn, { isLoading, error }] = useLazySignInQuery()
    const { handleSubmit, control, formState } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        resolver: yupResolver(
            yup.object().shape({
                email: yup.string().email().required(),
                password: yup.string().required(),
            })
        ),
        defaultValues: { email: '', password: '' },
    })

    const onSubmit = async ({ email, password }) => {
        const res = await signIn({ email, password }).unwrap()
        if (isSuccess(res)) onGetUser()
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
            {logo && logo}
            <Box component="form">
                <Grid>
                    <Typography variant="h3" fontWeight={'bold'}>
                        Administrace
                    </Typography>
                </Grid>
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
                        color="primary"
                        onClick={handleSubmit(onSubmit)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSubmit(onSubmit)
                            }
                        }}
                        fullWidth
                        disabled={!formState.isValid || formState.submitCount >= 3 || isLoading}
                    >
                        {!isLoading ? 'Přihlásit se' : <CircularProgress size={22} />}
                    </Button>
                    {isRegistrationEnabled && (
                        <Grid sx={{ textAlign: 'center' }}>
                            <Link
                                underline="hover"
                                sx={{
                                    fontSize: 12,
                                    color: 'primary',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                }}
                                onClick={onRegisterClick}
                            >
                                Vytvořít nový účet
                            </Link>
                        </Grid>
                    )}
                </Grid>
            </Box>
            {error && (
                <Grid>
                    <Typography variant="body1" color="error">
                        {error?.message}
                    </Typography>
                </Grid>
            )}
        </Grid>
    )
}

LoginPage.propTypes = {
    onGetUser: PropTypes.func,
    onRegisterClick: PropTypes.func,
    isRegistrationEnabled: PropTypes.bool,
}

export default LoginPage
