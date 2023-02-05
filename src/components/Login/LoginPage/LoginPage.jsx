import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import FormInput from '../../common/Form/FormInput'
import { Button, CircularProgress, Typography } from '@mui/material'
import { useLazyLogInQuery } from '../../../store/userInfo/services'

const LoginPage = ({ onGetUser }) => {
    const [logIn, { isLoading, error }] = useLazyLogInQuery()
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

    const onSubmit = ({ email, password }) => logIn({ email, password, onGetUser })
    return (
        <Grid container alignContent="center" direction="column">
            <Grid>
                <FormInput
                    type="password"
                    name={'password'}
                    control={control}
                    placeholder="Heslo"
                    label="Heslo"
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
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit(onSubmit)}
                    fullWidth
                    disabled={!formState.isValid || formState.submitCount >= 3 || isLoading}
                >
                    {!isLoading ? 'Přihlásit se' : <CircularProgress />}
                </Button>
            </Grid>
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
}

export default LoginPage
