import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getUserRequest, updateUserRequest } from '../../api/users';

export default function EditUserView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const userTypes = ['ADMINISTRADOR', 'PROVEEDOR', 'EMPLEADO'];

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const [backendErrors, setBackendErrors] = useState({});

    useEffect(() => {
        if (location.state?.message) {
            setMessage({
                text: location.state.message,
                type: location.state.type || 'success'
            });
            window.history.replaceState({}, '');
        }

        const fetchUser = async () => {
            try {
                const response = await getUserRequest(id);
                reset({
                    name: response.data.name,
                    lastname1: response.data.lastname1,
                    lastname2: response.data.lastname2 || '',
                    email: response.data.email,
                    type: response.data.type
                });
            } catch (error) {
                setMessage({ 
                    text: 'Error al cargar el usuario', 
                    type: 'danger' 
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id, location.state, reset]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setBackendErrors({});
        
        try {
            await updateUserRequest(id, data);
            setMessage({ 
                text: 'Usuario actualizado correctamente', 
                type: 'success' 
            });
            setTimeout(() => navigate('/users'));
        } catch (error) {
            if (error.response?.data?.errors) {
                const newErrors = {};
                error.response.data.errors.forEach(err => {
                    newErrors[err.field] = err.message;
                });
                setBackendErrors(newErrors);
            }
            
            setMessage({ 
                text: error.response?.data?.msg || 'Error al actualizar usuario', 
                type: 'danger' 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/users');
    };

    const getErrorMessage = (fieldName) => {
        return backendErrors[fieldName] || errors[fieldName]?.message;
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-fullscreen">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">EDITAR USUARIO</h1>
                    </div>
                    <div className="modal-body">
                        <div className="container">
                            {message.text && (
                                <div className={`alert alert-${message.type} alert-dismissible fade show mt-3`} role="alert">
                                    {message.text}
                                    <button type="button" className="btn-close" onClick={() => setMessage({ text: '', type: '' })}aria-label="Close"></button>
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit(onSubmit)} className="mx-5 my-3">
                                <div className="row mb-4">
                                    <div className="col-md-4">
                                        <div className="form-floating">
                                            <input type="text" id="name" className={`form-control border border-2 ${getErrorMessage('name') ? 'is-invalid' : ''}`} {...register('name', { required: true })} />
                                            <label htmlFor="name">Nombre</label>
                                            {getErrorMessage('name') && (
                                                <div className="invalid-feedback">
                                                    {getErrorMessage('name')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-floating">
                                            <input type="text" id="lastname1" className={`form-control border border-2 ${getErrorMessage('lastname1') ? 'is-invalid' : ''}`} {...register('lastname1', { required: true,
                                                pattern: {
                                                    value: /^[A-Za-zÀ-ÿ\s]+$/,
                                                    message: 'El apellido no debe contener números'
                                                }
                                             })} />
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
                                            <input type="text" id="lastname2" className={`form-control border border-2 ${getErrorMessage('lastname2') ? 'is-invalid' : ''}`} {...register('lastname2', { required: true,
                                                pattern: {
                                                    value: /^[A-Za-zÀ-ÿ\s]+$/,
                                                    message: 'El apellido no debe contener números'
                                                }
                                             })} />
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
                                    <select id="type" className={`form-select border border-2 ${getErrorMessage('type') ? 'is-invalid' : ''}`} {...register('type', { required: true })}>
                                        <option value="">Seleccione un tipo</option>
                                        {userTypes.map(type => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
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
                                    <button type="button" onClick={handleCancel}className="btn btn-secondary"disabled={isSubmitting}>Cancelar</button>
                                    <button type="submit" className="btn btn-primary"disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                                Loading...
                                            </>
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