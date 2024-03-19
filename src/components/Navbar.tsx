'use client'
import Link from 'next/link';
import { useSession } from 'next-auth/react';


function Navbar() {
    const { data: session } = useSession()

    return (
        <>
            <div className="navbar bg-slate-300 text-primary-content fixed w-full z-10 top-0 top-0 ">
                <div className="w-4/5 mx-auto flex items-center justify-between">
                    <div className="text-slate-500">
                        <a className="text-xl">Grupo 360!</a>
                    </div>
                    <div className="flex-none mb-4">
                        <div className="flex-none mt-4">
                            <ul className="menu menu-horizontal text-slate-500 px-1 ">
                                {!session?.user ? (
                                    <>
                                        <li> <Link href="/auth/login">Login</Link></li>
                                    </>
                                ) : (
                                    <>
                                        <li className="">  <Link href="/dashboard">Dashboard</Link></li>
                                        <li className="">  <Link href="/contact">Envío de Mail</Link></li>
                                        <li className="">  <Link href="/cliente">Clientes</Link></li>
                                        <li className="">  <Link href="/log">Registro de Mails</Link></li>
                                        <li>  <Link href="/api/auth/signout">Logout</Link></li>
                                    </>
                                )
                                }
                            </ul >
                        </div >
                    </div >
                </div>
            </div>
        </>
    )
}

export default Navbar;
