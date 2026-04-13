import { zodResolver } from '@hookform/resolvers/zod'
import { Button, CircularProgress, Typography, Link, SelectChangeEvent } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useForm, Controller } from 'react-hook-form'
import useSWRMutation from 'swr/mutation'
import { z } from 'zod'
import axiosGynInstance from '../../../api/config'
import FormInput from '../../common/Form/FormInput'
import AmbulanceSelect from '../../common/AmbulanceSelect'
import { validationMessages } from '../../../constants'

const signUpSchema = z.object({
    name: z.string().min(1, validationMessages.IS_REQUIRED_FIELD),
    email: z.email().min(1, validationMessages.IS_REQUIRED_FIELD),
    password: z.string().min(8, 'Heslo musí mít alespoň 8 znaků.'),
    default_workplace: z.string().optional(),
})

type SignUpFormValues = z.infer<typeof signUpSchema>

const signUpFetcher = async (key: string, { arg }: { arg: SignUpFormValues }) =>
    (await axiosGynInstance.post(key, arg)).data

const RegistrationPage = ({ logo, onLoginClick }: { logo: React.ReactNode; onLoginClick: () => void }) => {
    const [recaptcha, setRecaptcha] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const {
        trigger: signUp,
        isMutating: isLoading,
        error,
    } = useSWRMutation('administration/signUp', signUpFetcher)

    const {
        handleSubmit,
        control,
        formState: { isValid, submitCount },
        reset,
    } = useForm<SignUpFormValues>({
        mode: 'onChange',
        reValidateMode: 'onChange',
        resolver: zodResolver(signUpSchema),
        defaultValues: { name: '', email: '', password: '', default_workplace: '' },
    })

    const onSubmit = async (formValues: SignUpFormValues) => {
        const payload = { ...formValues }
        if (!payload.default_workplace) delete payload.default_workplace
        await signUp(payload)
        setIsSuccess(true)
        reset()
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
            {logo && logo}
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
                <Grid>
                    <Controller
                        name="default_workplace"
                        control={control}
                        render={({ field }) => (
                            <AmbulanceSelect
                                showLabel
                                selectedValueId={field.value ?? ''}
                                onAmbulanceSelect={(e: SelectChangeEvent<unknown>) =>
                                    field.onChange(e.target.value as string)
                                }
                            />
                        )}
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
