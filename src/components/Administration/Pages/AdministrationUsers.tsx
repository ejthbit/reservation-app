import { Add, Delete, Edit } from '@mui/icons-material'
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fade,
    IconButton,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import axiosGynInstance from '../../../api/config'
import { User } from '../../../types'
import AmbulanceSelect from '../../common/AmbulanceSelect'
import ConfirmDialog from '../../common/ConfirmDialog'

type UserRow = Required<Pick<User, 'id' | 'name' | 'email' | 'role'>> & { default_workplace?: string }

type AddUserForm = { name: string; email: string; password: string; default_workplace: string }
type EditUserForm = { name: string; email: string; default_workplace: string; role: string }

const usersFetcher = async (url: string) => (await axiosGynInstance.get<{ data: UserRow[] }>(url)).data.data
const signUpFetcher = async (key: string, { arg }: { arg: AddUserForm }) =>
    (await axiosGynInstance.post(key, { ...arg, default_workplace: arg.default_workplace || undefined })).data
const updateUserFetcher = async (key: string, { arg }: { arg: { id: number } & EditUserForm }) => {
    const { id, ...body } = arg
    return (await axiosGynInstance.put(`${key}/${id}`, body)).data
}
const deleteUserFetcher = async (key: string, { arg }: { arg: number }) =>
    (await axiosGynInstance.delete(`${key}/${arg}`)).data

const roleColor = (role?: string): 'default' | 'primary' | 'error' => {
    if (role === 'admin') return 'error'
    if (role === 'user') return 'primary'
    return 'default'
}

const AdministrationUsers = () => {
    const { enqueueSnackbar } = useSnackbar()

    const [addOpen, setAddOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<UserRow | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null)

    const [addForm, setAddForm] = useState<AddUserForm>({
        name: '',
        email: '',
        password: '',
        default_workplace: '',
    })
    const [editForm, setEditForm] = useState<EditUserForm>({
        name: '',
        email: '',
        default_workplace: '',
        role: 'user',
    })

    const {
        data: users,
        isLoading,
        mutate: refetchUsers,
    } = useSWR<UserRow[]>('administration/users?limit=100', usersFetcher, { revalidateOnFocus: false })

    const { trigger: signUp, isMutating: isAdding } = useSWRMutation('administration/signUp', signUpFetcher)
    const { trigger: updateUser, isMutating: isUpdating } = useSWRMutation(
        'administration/user',
        updateUserFetcher,
    )
    const { trigger: deleteUser } = useSWRMutation('administration/user', deleteUserFetcher)

    const sortedUsers = [...(users ?? [])].sort((a, b) => a.id - b.id)

    const openEdit = (user: UserRow) => {
        setEditForm({
            name: user.name,
            email: user.email,
            default_workplace: user.default_workplace ?? '',
            role: user.role,
        })
        setEditTarget(user)
    }

    const handleAdd = async () => {
        try {
            await signUp(addForm)
            enqueueSnackbar('Uživatel byl přidán.', { variant: 'success' })
            setAddOpen(false)
            setAddForm({ name: '', email: '', password: '', default_workplace: '' })
            refetchUsers()
        } catch (err: unknown) {
            enqueueSnackbar((err as { message?: string })?.message ?? 'Chyba.', { variant: 'error' })
        }
    }

    const handleEdit = async () => {
        if (!editTarget) return
        try {
            await updateUser({ id: editTarget.id, ...editForm })
            enqueueSnackbar('Uživatel byl upraven.', { variant: 'success' })
            setEditTarget(null)
            refetchUsers()
        } catch (err: unknown) {
            enqueueSnackbar((err as { message?: string })?.message ?? 'Chyba.', { variant: 'error' })
        }
    }

    const handleDelete = async () => {
        if (!deleteTarget) return
        try {
            await deleteUser(deleteTarget.id)
            enqueueSnackbar(`Uživatel "${deleteTarget.name}" byl smazán.`, { variant: 'success' })
            refetchUsers()
        } catch (err: unknown) {
            enqueueSnackbar((err as { message?: string })?.message ?? 'Chyba.', { variant: 'error' })
        }
    }

    const isAddValid = addForm.name.trim() && addForm.email.trim() && addForm.password.length >= 8
    const isEditValid = editForm.name.trim() && editForm.email.trim()

    return (
        <Fade in timeout={{ enter: 500 }}>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Uživatelé</Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={() => setAddOpen(true)}>
                        Přidat uživatele
                    </Button>
                </Box>

                {isLoading ? (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Jméno</TableCell>
                                    <TableCell>E-mail</TableCell>
                                    <TableCell>Pracoviště</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell align="right">Akce</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedUsers.map((user) => (
                                    <TableRow key={user.id} hover>
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.default_workplace ?? '—'}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.role}
                                                size="small"
                                                color={roleColor(user.role)}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Upravit">
                                                <IconButton onClick={() => openEdit(user)}>
                                                    <Edit />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Smazat">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => setDeleteTarget(user)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {!sortedUsers.length && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            <Typography variant="body2" color="text.secondary">
                                                Žádní uživatelé nenalezeni
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Add dialog */}
                <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth="xs">
                    <DialogTitle>Přidat uživatele</DialogTitle>
                    <DialogContent
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}
                    >
                        <TextField
                            label="Jméno"
                            value={addForm.name}
                            onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                            required
                            fullWidth
                        />
                        <TextField
                            label="E-mail"
                            type="email"
                            value={addForm.email}
                            onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Heslo"
                            type="password"
                            value={addForm.password}
                            onChange={(e) => setAddForm((f) => ({ ...f, password: e.target.value }))}
                            helperText="Alespoň 8 znaků"
                            required
                            fullWidth
                        />
                        <AmbulanceSelect
                            showLabel
                            selectedValueId={addForm.default_workplace}
                            onAmbulanceSelect={(e: SelectChangeEvent<unknown>) =>
                                setAddForm((f) => ({ ...f, default_workplace: e.target.value as string }))
                            }
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setAddOpen(false)}>Zrušit</Button>
                        <Button variant="contained" onClick={handleAdd} disabled={!isAddValid || isAdding}>
                            {isAdding ? <CircularProgress size={20} /> : 'Přidat'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Edit dialog */}
                <Dialog open={!!editTarget} onClose={() => setEditTarget(null)} fullWidth maxWidth="xs">
                    <DialogTitle>Upravit uživatele</DialogTitle>
                    <DialogContent
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}
                    >
                        <TextField
                            label="Jméno"
                            value={editForm.name}
                            onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                            required
                            fullWidth
                        />
                        <TextField
                            label="E-mail"
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                            required
                            fullWidth
                        />
                        <AmbulanceSelect
                            showLabel
                            selectedValueId={editForm.default_workplace}
                            onAmbulanceSelect={(e: SelectChangeEvent<unknown>) =>
                                setEditForm((f) => ({ ...f, default_workplace: e.target.value as string }))
                            }
                        />
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Role
                            </Typography>
                            <Select
                                fullWidth
                                value={editForm.role}
                                onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
                                size="small"
                            >
                                <MenuItem value="user">user</MenuItem>
                                <MenuItem value="admin">admin</MenuItem>
                            </Select>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditTarget(null)}>Zrušit</Button>
                        <Button
                            variant="contained"
                            onClick={handleEdit}
                            disabled={!isEditValid || isUpdating}
                        >
                            {isUpdating ? <CircularProgress size={20} /> : 'Uložit'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete confirm */}
                <ConfirmDialog
                    open={!!deleteTarget}
                    title="Smazat uživatele"
                    description={`Opravdu chcete smazat uživatele "${deleteTarget?.name}"?`}
                    onConfirm={handleDelete}
                    onClose={() => setDeleteTarget(null)}
                />
            </Box>
        </Fade>
    )
}

export default AdministrationUsers
