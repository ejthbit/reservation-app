import { yupResolver } from '@hookform/resolvers/yup'
import { Button, CircularProgress, Typography, Link } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useSignUpMutation } from '../../../store/userInfo/services'
import { isSuccess as isSuccessUtil } from '../../../utils'
import FormInput from '../../common/Form/FormInput'
import { validationMessages } from '../../../constants/'
const RegistrationPage = ({ onLoginClick }) => {
    const [signUp, { isLoading, error, isSuccess }] = useSignUpMutation()

    const [recaptcha, setRecaptcha] = useState(false)
    const {
        handleSubmit,
        control,
        formState: { isValid, submitCount },
        reset,
    } = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange',
        resolver: yupResolver(
            yup
                .object({
                    name: yup.string().required(validationMessages.IS_REQUIRED_FIELD),
                    email: yup
                        .string()
                        .email(validationMessages.IS_NOT_CORRECT_FORMAT)
                        .required(validationMessages.IS_REQUIRED_FIELD),
                    password: yup.string().required(validationMessages.IS_REQUIRED_FIELD),
                })
                .required()
        ),
        defaultValues: { name: '', email: '', password: '' },
    })

    const onSubmit = async (formValues) => {
        const res = await signUp(formValues).unwrap()
        if (isSuccessUtil(res)) reset()
    }
    return (
        <Grid
            container
            justifyContent="center"
            alignContent="center"
            direction="column"
            sx={{ height: '100vh', margin: 'auto' }}
            spacing={2}
        >
            <form>
                <Grid>
                    <Typography variant="h3" fontWeight={'bold'}>
                        Registrace
                    </Typography>
                </Grid>
                <Grid>
                    <FormInput
                        type="name"
                        name={'name'}
                        control={control}
                        placeholder="Jméno"
                        label="Jméno"
                        required
                        fullWidth
                    />
                </Grid>
                <Grid>
                    <FormInput
                        type="email"
                        name={'email'}
                        control={control}
                        placeholder="E-mail"
                        label="E-mail"
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
                        required
                        fullWidth
                    />
                </Grid>
                {import.meta.env.PROD && (
                    <Grid>
                        <ReCAPTCHA
                            sitekey={import.meta.env.VITE_RE_CAPTCHA_SITE_KEY}
                            onChange={() => setRecaptcha(true)}
                        />
                    </Grid>
                )}
                <Grid>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit(onSubmit)}
                        onKeyUp={(e) => e.key === 'Enter' && handleSubmit(onSubmit)}
                        fullWidth
                        disabled={
                            !isValid || submitCount >= 3 || isLoading || (import.meta.env.PROD && !recaptcha)
                        }
                    >
                        {!isLoading ? 'Registrovat se' : <CircularProgress size={22} />}
                    </Button>
                </Grid>
                {isSuccess && (
                    <Grid>
                        <Typography color="green">Účet byl úspěšně vytvořen.</Typography>
                    </Grid>
                )}
                <Grid sx={{ textAlign: 'center' }}>
                    <Link
                        underline="hover"
                        sx={{
                            fontSize: 10,
                            color: 'primary',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                        }}
                        onClick={onLoginClick}
                    >
                        Příhlasit se
                    </Link>
                </Grid>
            </form>
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

export default RegistrationPage
