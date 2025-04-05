import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createUserRequest } from '../../api/users';


export default function AddUserView() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [backendErrors, setBackendErrors] = useState({});

    const userTypes = ['ADMINISTRADOR', 'PROVEEDOR', 'EMPLEADO'];

    const onSubmit = handleSubmit(async (values) => {
        setLoading(true);
        setError(null);
        setBackendErrors({});

        try {
            const response = await createUserRequest(values);
            if (response.status === 201) {
                navigate('/users', {
                    state: { 
                        message: 'Usuario creado exitosamente',
                        type: 'success'
                    }
                });
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                const newErrors = {};
                error.response.data.errors.forEach(err => {
                    newErrors[err.field] = err.message;
                });
                setBackendErrors(newErrors);
            }
            setError(error.response?.data?.msg || 'Error al crear usuario');
        } finally {
            setLoading(false);
        }
    });

    const getErrorMessage = (fieldName) => {
        return backendErrors[fieldName] || errors[fieldName]?.message;
    };

    return (
        <div className="modal fade show" id="addUser" data-bs-backdrop="static" tabIndex="-1" style={{display: 'block'}}>
            <div className="modal-dialog modal-fullscreen">
                <div className="modal-content">
                    <div className="modal-header">
                        <div>
                            <h1 className="modal-title fs-5">AÑADIR USUARIO</h1>
                            <p className="text-danger mb-0"><small>Es necesario llenar todos los campos</small></p>
                        </div>
                    </div>
                    <div className="modal-body">
                        <div className="container">
                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                                    {error}
                                    <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                                </div>
                            )}
                            <form onSubmit={onSubmit} className="mx-5 my-3">
                                <div className="row mb-4">
                                    <div className="col-md-4">
                                        <div className="form-floating">
                                            <input type="text" id="name" className={`form-control border border-2 ${getErrorMessage('name') ? 'is-invalid' : ''}`} {...register('name', { required: true })} />
                                            <label htmlFor="name">Nombre(s)</label>
                                            {getErrorMessage('name') && (
                                                <div className="invalid-feedback">
                                                    {getErrorMessage('name')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-floating">
                                            <input type="text" id="lastname1" className={`form-control border border-2 ${getErrorMessage('lastname1') ? 'is-invalid' : ''}`} {...register('lastname1', { required: true })} />
                                            <label htmlFor="lastname1">Apellido Paterno</label>
                                            {getErrorMessage('lastname1') && (
                                                <div className="invalid-feedback">
                                                    {getErrorMessage('lastname1')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-floating">
                                            <input type="text" id="lastname2" className={`form-control border border-2 ${getErrorMessage('lastname2') ? 'is-invalid' : ''}`} {...register('lastname2', { required: true })} />
                                            <label htmlFor="lastname2">Apellido Materno</label>
                                            {getErrorMessage('lastname2') && (
                                                <div className="invalid-feedback">
                                                    {getErrorMessage('lastname2')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="form-floating mb-4">
                                    <input type="email" id="email" className={`form-control border border-2 ${getErrorMessage('email') ? 'is-invalid' : ''}`} {...register('email', { required: true })} />
                                    <label htmlFor="email">Correo Electrónico</label>
                                    {getErrorMessage('email') && (
                                        <div className="invalid-feedback">
                                            {getErrorMessage('email')}
                                        </div>
                                    )}
                                </div>
                                <div className="form-floating mb-4">
                                    <input type="password" id="password" className={`form-control border border-2 ${getErrorMessage('password') ? 'is-invalid' : ''}`} {...register('password', { required: true })} />
                                    <label htmlFor="password">Contraseña</label>
                                    {getErrorMessage('password') && (
                                        <div className="invalid-feedback">
                                            {getErrorMessage('password')}
                                        </div>
                                    )}
                                </div>
                                <div className="form-floating mb-4">
                                    <select id="type" className={`form-select border border-2 ${getErrorMessage('type') ? 'is-invalid' : ''}`} {...register('type', { required: 'Este campo es obligatorio' })}>
                                        <option value="">Seleccione un tipo</option>
                                        {userTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                    <label htmlFor="type">Tipo de Usuario</label>
                                    {getErrorMessage('type') && (
                                        <div className="invalid-feedback">
                                            {getErrorMessage('type')}
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary"onClick={() => navigate('/users')}>Cancelar</button>
                                    <button type="submit" className="btn btn-primary"disabled={loading}>
                                        {loading ? (
                                            <span className="spinner-border spinner-border-sm" role="status"></span>
                                        ) : 'Guardar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}