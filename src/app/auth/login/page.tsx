'use client'
// los imports con comillas dobles o simples, pero elegi uno y usalo en todos lados
import { useForm } from "react-hook-form";
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import { useState } from "react";

function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const router = useRouter()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false);

    const onSubmit = handleSubmit(async (data) => {
        setLoading(true); // Iniciar indicador de carga

        setTimeout(async () => {
            try {
                const res: undefined | any = await signIn('credentials', {
                    email: data.email,
                    password: data.password,
                    redirect: false
                });

                if (res.error) {
                    setError(res.error);
                } else {
                    router.push('/dashboard');
                    router.refresh();
                }
            } catch (error) {
                console.error('Error al iniciar sesión:', error);
                setError('Error al iniciar sesión');
            } finally {
                setLoading(false); // Finalizar indicador de carga
            }
        }, 1000);
    });

    return (
        <div className="h-screen main-content">
            <div className="hero min-h-screen ">
                <h2>Login</h2>
                <div className="hero-content flex-col lg:flex-row-reverse">

                    <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        {loading ? (

                            <div className="rounded p-1 max-w-6xl" >
                                <div className="skeleton w-80 h-80 rounded-box grid place-content-center">
                                    <div className="flex flex-col gap-4 w-82">
                                        <span className="loading loading-spinner loading-lg"></span>
                                    </div>
                                </div>
                            </div>

                        ) : (
                            <form
                                onSubmit={onSubmit}
                                className="card-body"
                            >
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Email</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="email"
                                        className="input input-bordered"
                                        {...register("email")}
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Password</span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="password"
                                        className="input input-bordered"
                                        {...register("password")}
                                        required
                                    />
                                </div>
                                <div className="form-control mt-6">
                                    <button className="btn text-slate-500 " disabled={loading}>
                                        {loading ? 'Cargando...' : 'Login'}
                                    </button>
                                    {error && <p className="text-red-500 mt-2">{error}</p>}
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
