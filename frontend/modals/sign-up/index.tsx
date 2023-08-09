import { useModal } from "@/contexts/modal"
import { ModalHeader } from "../ModalHeader"
import { LogoIcon } from "@/assets/icons/LogoIcon";
import { Input } from "@/components/input";
import { useState } from "react";
import { Button } from "@/components/button";
import { LoginModal } from "../login";

export const SignUpModal = () => {
    const { pushModal, goBack, canGoBack } = useModal();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return(
        <>
        <ModalHeader headerClassName="flex justify-center items-center gap-1.5">
            Create an account on 
            <LogoIcon className="w-[130px]" />
        </ModalHeader>
        <div className="flex flex-col gap-2 px-6">
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
                value={password}
                onChange={setPassword}
                label={'Repeat password'}
                name={'repeat-password'}
                type={'password'}
            />
            <div className="flex justify-between pt-3 pb-6">
                <button 
                    className="text-xs text-secondary hover:text-primary transition-colors"
                    onClick={canGoBack ? goBack : () => pushModal(<LoginModal />)}
                >
                    Use an existing account
                </button>
                <Button className="w-28">
                    Sign up
                </Button>
            </div>
        </div>
        </>
    )
}