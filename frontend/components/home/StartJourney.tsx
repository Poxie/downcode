import tailwindConfig from '@/tailwind.config';
import resolveConfig from 'tailwindcss/resolveConfig'
import { WaveIcon } from "@/assets/icons/WaveIcon"
import { Button } from "../button"
import { StarIcon } from '@/assets/icons/StarIcon';

const fullConfig = resolveConfig(tailwindConfig);
const backgrounds = fullConfig.theme?.backgroundColor;

export const StartJourney = () => {
    return(
        <section className="bg-tertiary py-section relative">
            <WaveIcon 
                fill={backgrounds?.secondary as string}
                className="absolute top-0 rotate-180"
            />

            <div className="py-9 flex flex-col items-center">
                <h2 className="max-w-main text-4xl font-extrabold text-center relative">
                    <StarIcon className="w-6 absolute left-[10px] -top-[45px] lg:-left-[70px] lg:-top-[10px]" />
                    <StarIcon className="w-5 absolute left-[60px] top-[90px]" />

                    Ready to start your coding journey?
                    
                    <StarIcon className="w-4 absolute left-[85%] top-[80px] lg:left-[670px] lg:top-[30px]" />
                    <StarIcon className="w-3 absolute left-[93%] -top-[20px] lg:left-[700px] lg:-top-[5px]" />
                </h2>
                <Button className="mx-auto mt-8">
                    Get started now
                </Button>
            </div>

            <WaveIcon 
                fill={backgrounds?.primary as string}
                className="absolute bottom-0"
            />
        </section>
    )
}