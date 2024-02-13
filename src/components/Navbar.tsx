'use client'
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function Navbar() {
    const { data: session } = useSession()

    const router = useRouter();

    useEffect(() => {
        // Verificar si no hay sesión activa y redirigir al login
        if (!session) {
            router.push('/auth/login');
        }
    }, [session, router]);

    return (

        <div>
            <div className="navbar bg-slate-300 text-primary-content">
                <div className="w-4/5 mx-auto flex items-center justify-between"> {/* Añade justify-between */}
                    <div className="text-slate-500"> {/* Remueve flex-1 y agrega justify-start */}
                        <a className="text-xl">SEND MAILS APP</a>
                    </div>
                    <div className="flex-none mb-4">
                        {/* Resto del contenido */}

                        <div className="flex-none mt-4">
                            <ul className="menu menu-horizontal text-slate-500 px-1 ">
                                {!session?.user ? (
                                    <>
                                        <li> <Link href="/auth/login">Login</Link></li>
                                    </>

                                ) : (
                                    <>
                                        <li className="">  <Link href="/dashboard">Dashboard</Link></li>
                                        <li className="">  <Link href="/contact">Mail</Link></li>
                                        <li className="">  <Link href="/cliente">Clientes</Link></li>
                                        <li>  <Link href="/api/auth/signout">Logout</Link></li>
                                    </>
                                )
                                }
                            </ul >
                        </div >
                    </div >
                </div>
            </div>
        </div >




    )
}

export default Navbar;
