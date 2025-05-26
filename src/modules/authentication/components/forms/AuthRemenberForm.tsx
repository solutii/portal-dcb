import React, { FormEventHandler, useState } from 'react';
import { toast } from 'react-toastify';
import { useStore } from '../../../../shared/infra/store';
import { changePassword } from '../../../../modules/authentication/services'
import { useNavigate } from 'react-router-dom'
const ChangePasswordForm: React.FC = () => {
    //const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const store = useStore()
    const {
        authReducer: { state: { authUserEmail } },
    } = store
    const navigate = useNavigate()
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => 
    {
        e.preventDefault();

        if(loading) {
            return
        }

        if (newPassword !== confirmNewPassword) {
            toast('As senhas não conferem.')
            return
        }

        if (newPassword === '123') {
            toast('Senha não permitida.')
            return
        }

        setLoading(true)

        changePassword({ LOGIN: authUserEmail, newPassword })
            .then(() => {
                //navigate('/orders')
                setLoading(false)
            })
            .catch(err => {
                toast("Erro ao alterar senha!")
                setLoading(false)
            })


        return
    }

    

    return (
        <form className="change-password-form" onSubmit={handleSubmit}>
            {/* <div>
                <label htmlFor="currentPassword">Senha Atual:</label>
                <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
            </div> */}
            <div>
                <label htmlFor="newPassword">Nova Senha:</label>
                <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="confirmNewPassword">Confirmar Nova Senha:</label>
                <input
                    type="password"
                    id="confirmNewPassword"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                />
            </div>
            { loading ? 
            <button type="submit" disabled={true}>Aguarde ...</button>
            :
            <button type="submit">Trocar Senha</button>
            }
        </form>
    );
};

export default ChangePasswordForm;