import { useForm } from 'react-hook-form';
import { loginRequest } from '../../api/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginView() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
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
            const response = await loginRequest(values);
        
            login({
                name: response.data.name,
                lastname1: response.data.lastname1,
                lastname2: response.data.lastname2,
                email: response.data.email,
                type: response.data.type
            });
        
            navigate('/users');
        } catch (error) {
            if (error.response?.data?.errors) {
                const newErrors = {};
                error.response.data.errors.forEach(err => {
                    newErrors[err.field] = err.message;
                });
                setBackendFieldErrors(newErrors);
            }
            setError(error.response?.data?.msg);
        } finally {
            setLoading(false);
        }
    });

    const getErrorMessage = (fieldName) => {
        return backendFieldErrors[fieldName] || (errors[fieldName]?.message);
    };

    const onErrorDismiss = () => setError(null);

    return (
        <div className="container-fluid vh-100 p-0">
            <div className="row h-100 g-0">
                <div className="col-md-6 h-100 img-fluid bg-school-login border-2 shadow"></div>
                <div className="col-md-6 h-100 d-flex align-items-center justify-content-center">
                    <div className="card p-4 rounded rounded-3 shadow w-75">
                        <div className="text-center text-primary mb-5">
                            <h3 className="fw-bold">Iniciar Sesión</h3>
                        </div>
                        <form onSubmit={onSubmit}>
                            <p className="text-center mb-4">Por favor, inicia sesión con tu cuenta</p>
                            <div className="form-floating mb-3">
                                <input type="email" id="email" className={`form-control border border-2 ${getErrorMessage('email') ? 'is-invalid' : ''}`} {...register('email', { required: true })} />
                                <label htmlFor="email" className="text-secondary">Correo Electrónico</label>
                                {getErrorMessage('email') && (
                                    <div className="invalid-feedback">
                                        {getErrorMessage('email')}
                                    </div>
                                )}
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" id="password" className={`form-control border border-2 ${getErrorMessage('password') ? 'is-invalid' : ''}`} {...register('password', { required: true })} />
                                <label htmlFor="password" className="text-secondary">Contraseña</label>
                                {getErrorMessage('password') && (
                                    <div className="invalid-feedback">
                                        {getErrorMessage('password')}
                                    </div>
                                )}
                            </div>
                            <button type="submit" className="btn btn-primary d-grid align-items-center justify-content-center w-100" disabled={loading}>
                                {loading ? (
                                    <div className="spinner-border text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    'Iniciar Sesión'
                                )}
                            </button>
                        </form>
                        <div className="text-center mt-3"><span>¿Aún no tienes cuenta?{' '}</span><a href="/register" className="text-decoration-none">Regístrate aquí</a></div>
                        {error && (
                            <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
                                {error}
                                <button type="button" className="btn-close" onClick={onErrorDismiss} aria-label="Close"></button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}