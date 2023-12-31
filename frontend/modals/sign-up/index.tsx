import { useModal } from "@/contexts/modal"
import { ModalHeader } from "../ModalHeader"
import { LogoIcon } from "@/assets/icons/LogoIcon";
import { Input } from "@/components/input";
import { FormEvent, useState } from "react";
import { Button } from "@/components/button";
import { LoginModal } from "../login";

export const SignUpModal = () => {
    const { pushModal, goBack, canGoBack } = useModal();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState('');

    const signUp = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!username) return setFeedback('Username is a required field.');
        if(!password) return setFeedback('Password is a required field.');
        if(password !== repeatPassword) return setFeedback('Passwords don\'t match.');

        setLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/users`, {
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
            setFeedback(error.message);
            setLoading(false);
        })
    }

    return(
        <>
        <ModalHeader headerClassName="flex justify-center items-center gap-1.5">
            Create an account on 
            <LogoIcon className="w-[115px]" />
        </ModalHeader>
        <form 
            className="flex flex-col gap-2 px-6"
            onSubmit={signUp}
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
            <Input 
                value={repeatPassword}
                onChange={setRepeatPassword}
                label={'Repeat password'}
                name={'repeat-password'}
                type={'password'}
            />
            {feedback && (
                <span className="text-sm pt-1">
                    {feedback}
                </span>
            )}
            <div className="flex justify-between pt-3 pb-6">
                <button 
                    className="text-xs text-secondary hover:text-primary transition-colors"
                    onClick={canGoBack ? goBack : () => pushModal(<LoginModal />)}
                    type={'button'}
                >
                    Use an existing account
                </button>
                <Button 
                    className="min-w-28"
                    disabled={loading}
                >
                    {loading ? 'Signing up...' : 'Sign up'}
                </Button>
            </div>
        </form>
        </>
    )
}