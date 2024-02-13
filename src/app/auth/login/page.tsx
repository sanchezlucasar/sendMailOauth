'use client'
import { useForm } from "react-hook-form";
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import { useState } from "react";


function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const router = useRouter()
    const [error, setError] = useState(null)

    const onSubmit = handleSubmit(async (data) => {
        const res: undefined | any = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false
        })

        if (res.error) { setError(res.error) }
        else {
            router.push('/dashboard')
            router.refresh()
        }
    })


    return (
        <div className="h-screen">     <div className="hero min-h-screen ">
            <h2>Login</h2>
            <div className="hero-content flex-col lg:flex-row-reverse">

                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
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
                            <button className="btn text-slate-500 ">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </div >

    )
}

export default LoginPage
