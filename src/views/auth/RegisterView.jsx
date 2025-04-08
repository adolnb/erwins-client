import { useForm } from 'react-hook-form';
import { registerRequest } from '../../api/auth';
import { useState, useRef } from 'react';
import PrivacyPolicy from '../modals/PrivacyPolicy';


export default function RegisterView() {
    const privacyPolicyRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const onErrorDismiss = () => setError(null);
    const {
        register, 
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [backendFieldErrors, setBackendFieldErrors] = useState({});
    const onSubmit = handleSubmit(async (values) => {
        setLoading(true);
        setError(null);
        setBackendFieldErrors({});

        try {
            await registerRequest(values);
        } catch (error) {
            if (error.response?.data?.errors) {
                const newErrors = {};
                error.response.data.errors.forEach(err => {
                    newErrors[err.field] = err.message;
                });
                setBackendFieldErrors(newErrors);
                setError(error.response.data.msg);
            } else {
                setError(error.response.data.msg);
            }
        } finally {
            setLoading(false);
        }
    });

    const getErrorMessage = (fieldName) => {
        return backendFieldErrors[fieldName] || (errors[fieldName] && 'Este campo es requerido');
    };

    return (
        <div className="container-fluid vh-100 p-0">
            <div className="row h-100 g-0">
                <div className="col-md-6 h-100 d-flex align-items-center justify-content-center">
                    <div className="card p-4 rounded rounded-3 shadow w-75">
                        <div className="text-center text-success mb-5">
                            <h3 className="fw-bold">Registro de Usuario</h3>
                        </div>
                        <form onSubmit={onSubmit} className='mb-3'>
                            <p className="text-center mb-4">Crea una cuenta para acceder al sistema.</p>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input type="text" id="name" className={`form-control border border-2 ${getErrorMessage('name') ? 'is-invalid' : ''}`} {...register('name', { required: true })} autoFocus />
                                        <label className="text-secondary">Nombre</label>
                                        {getErrorMessage('name') && (
                                            <div className="invalid-feedback">
                                                {getErrorMessage('name')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input type="text" id="lastname1" className={`form-control border border-2 ${getErrorMessage('lastname1') ? 'is-invalid' : ''}`} {...register('lastname1', { required: true,
                                            pattern: {
                                                value: /^[A-Za-zÀ-ÿ\s]+$/,
                                                message: 'El apellido no debe contener números'
                                            }
                                         })} />
                                        <label className="text-secondary">Apellido Paterno</label>
                                        {getErrorMessage('lastname1') && (
                                            <div className="invalid-feedback">
                                                {getErrorMessage('lastname1')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input type="text" id="lastname2" className={`form-control border border-2 ${getErrorMessage('lastname2') ? 'is-invalid' : ''}`} {...register('lastname2', { required: true,
                                            pattern: {
                                                value: /^[A-Za-zÀ-ÿ\s]+$/,
                                                message: 'El apellido no debe contener números'
                                            }
                                         })} />
                                        <label className="text-secondary">Apellido Materno</label>
                                        {getErrorMessage('lastname2') && (
                                            <div className="invalid-feedback">
                                                {getErrorMessage('lastname2')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input type="email" id="email" className={`form-control border border-2 ${getErrorMessage('email') ? 'is-invalid' : ''}`} {...register('email', { required: true })} />
                                        <label className="text-secondary">Correo Electrónico</label>
                                        {getErrorMessage('email') && (
                                            <div className="invalid-feedback">
                                                {getErrorMessage('email')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" id="password" className={`form-control border border-2 ${getErrorMessage('password') ? 'is-invalid' : ''}`} {...register('password', { required: true })} />
                                <label className="text-secondary">Contraseña</label>
                                {getErrorMessage('password') && (
                                    <div className="invalid-feedback">
                                        {getErrorMessage('password')}
                                    </div>
                                )}
                            </div>
                            <div className="form-check mb-2">
                                <input className="form-check-input" type="checkbox" id="privacyCheck" required />
                                <label className="form-check-label small" htmlFor="privacyCheck">
                                    Acepto las{' '}
                                    <button type="button" className="btn btn-link p-0 align-baseline" onClick={() => privacyPolicyRef.current?.show()}>políticas de privacidad</button>
                                </label>
                            </div>
                            <button type="submit" className="btn btn-success d-grid align-items-center justify-content-center w-100" disabled={loading}>
                                {loading ? (
                                    <div className="spinner-border text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    'Registrarse'
                                )}
                            </button>
                        </form>
                        <span className='text-center'>¿Ya tienes una cuenta?{' '}<a href='/' className="text-decoration-none">Inicia sesión</a></span>
                        {error && (
                            <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
                                {error}
                                <button type="button" className="btn-close" onClick={onErrorDismiss} data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-md-6 h-100 img-fluid bg-school-register border-2 shadow"></div>
            </div>
            <PrivacyPolicy ref={privacyPolicyRef} />
        </div>
    )
}