import { useModal } from "@/contexts/modal"
import { ModalHeader } from "../ModalHeader"
import { LogoIcon } from "@/assets/icons/LogoIcon";
import { Input } from "@/components/input";
import { useState, useEffect } from "react";
import { Button } from "@/components/button";
import { SignUpModal } from "../sign-up";

export const LoginModal = () => {
    const { pushModal, goBack, canGoBack } = useModal();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => setError(''), [username, password]);

    const login = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(loading) return;
        if(!username) return setError('Username is a required field.');
        if(!password) return setError('Password is a required field.');

        setLoading(true);

        fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/login`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async res => {
            if(!res.ok) throw new Error((await res.json()).message);
            return await res.json();
        })
        .then(({ token }) => {
            window.localStorage.setItem('accessToken', token);
            window.location.reload();
        })
        .catch(error => {
            setError(error.message);
            setLoading(false);
        })
    }

    return(
        <>
        <ModalHeader headerClassName="flex justify-center items-center gap-1.5">
            Sign into 
            <LogoIcon className="w-[115px]" />
        </ModalHeader>
        <form 
            className="flex flex-col gap-2 px-6"
            onSubmit={login}
        >
            <Input 
                autoFocus 
                value={username}
                onChange={setUsername}
                label={'Username'}
                name={'username'}
            />
            <Input 
                value={password}
                onChange={setPassword}
                label={'Password'}
                name={'password'}
                type={'password'}
            />
            {error && (
                <span className="text-sm pt-1">
                    {error}
                </span>
            )}
            <div className="flex justify-between pt-3 pb-6">
                <button 
                    className="text-xs text-secondary hover:text-primary transition-colors"
                    onClick={canGoBack ? goBack : () => pushModal(<SignUpModal />)}
                    type={'button'}
                >
                    Create an account instead
                </button>
                <Button 
                    className="min-w-28"
                    disabled={loading}
                >
                    {loading ? 'Signing in...' : 'Sign in'}
                </Button>
            </div>
        </form>
        </>
    )
}