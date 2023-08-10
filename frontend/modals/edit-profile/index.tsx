import { useAuth } from "@/contexts/auth"
import { ModalHeader } from "../ModalHeader"
import { Input } from "@/components/input";
import { ChangeEvent, useMemo, useRef, useState } from "react";
import { Button } from "@/components/button";
import { User } from "@/types";
import { AccountIcon } from "@/assets/icons/AccountIcon";

export const EditProfile = () => {
    const { user, patch } = useAuth();

    const [tempUser, setTempUser] = useState<Partial<User>>(user || {});
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState('');

    const avatarInput = useRef<HTMLInputElement>(null);

    const updateProfile = () => {
        if(!user) return;
        
        // Checking if changes have been made
        const notSameProperties: {[key in keyof Partial<User>]: any} = {};
        Object.entries(tempUser).forEach(([key, val]) => {
            if(user[key as keyof User] !== val) {
                notSameProperties[key as keyof User] = val;
            }
        })

        if(!Object.keys(notSameProperties).length) {
            setFeedback('No changes have been made.');
            return;
        }

        setLoading(true);
        patch<User>(`/users/me`, notSameProperties)
            .then(user => {
                setFeedback('Changes have been updated.')
            })
            .catch(error => {
                setFeedback(error.message);
            })
            .finally(() => {
                setLoading(false);
            })
    }
    
    const updateTempUser = (property: keyof User, value: any) => {
        setFeedback('');
        setTempUser(prev => ({
            ...prev,
            [property]: value
        }))
    }

    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files) return;

        const file = e.target.files[0];
        updateTempUser('avatar', file);
        
        e.target.value = '';
    }

    const avatarURL = useMemo(() => {
        let avatarURL = tempUser.avatar;
        if(typeof tempUser.avatar === 'object') {
            avatarURL = URL.createObjectURL(tempUser.avatar);
        }
        return avatarURL;
    }, [tempUser?.avatar]);

    return(
        <>
            <ModalHeader>
                Edit profile
            </ModalHeader>
            <div className="px-4">
                <div className="flex gap-3 items-start pb-4">
                    <div 
                        className="group relative flex justify-center items-center w-[100px] h-[100px] rounded-md bg-tertiary border-[1px] border-quaternary bg-cover bg-center"
                        style={avatarURL ? { 
                            backgroundImage: `url(${avatarURL})` 
                        } : undefined}
                    >
                        {!avatarURL && (
                            <AccountIcon className="w-7 text-secondary transition-opacity opacity-100 group-hover:opacity-0" />
                        )}
                        <span className="pointer-events-none flex justify-center items-center bg-tertiary bg-opacity-75 absolute top-0 left-0 w-full h-full z-10 whitespace-nowrap text-xs text-primary transition-opacity opacity-0 group-hover:opacity-100">
                            Choose avatar
                        </span>
                        <input 
                            type="file"
                            className="cursor-pointer absolute w-full h-full top-0 left-0 opacity-0"
                            onChange={onFileChange}
                            ref={avatarInput}
                        />
                    </div>
                    <Button 
                        type={'secondary'}
                        className="border-[1px] border-quaternary text-xs px-4 py-3"
                        onClick={() => avatarInput.current?.click()}
                    >
                        Change avatar
                    </Button>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                    <Input 
                        label={'Display name'}
                        name={'display-name'}
                        onChange={value => updateTempUser('displayName', value)}
                        value={tempUser.displayName || ''}
                    />
                    <Input 
                        label={'Username'}
                        name={'username'}
                        onChange={value => updateTempUser('username', value)}
                        value={tempUser.username || ''}
                    />
                </div>
                <div className={`flex-1 flex items-center ${feedback ? 'justify-between' : 'justify-end'} py-4`}>
                    {feedback && (
                        <span className="text-sm text-secondary">
                            {feedback}
                        </span>
                    )}
                    <Button 
                        onClick={updateProfile}
                        disabled={loading}
                    >
                        {loading ? 'Saving changes...' : 'Save changes'}
                    </Button>
                </div>
            </div>
        </>
    )
}