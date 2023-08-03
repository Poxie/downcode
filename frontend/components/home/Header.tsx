import { Button } from "../button"

export const Header = () => {
    return(
        <section className="bg-gradient-to-b from-[#1E293B] to-[#0F172A]">
            <div className="w-[820px] max-w-main m-auto grid place-items-center gap-6 pt-36 pb-[220px] sm:py-[260px]">
                <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold w-full md:w-[90%] max-w-full">
                    The fastest way to learn to code. For <span className="text-c-primary">pros</span> and <span className="text-c-primary">newbies</span>.
                </h1>
                <p className="sm:text-md md:text-xl text-center text-secondary">
                    Are you just learning to code, or have you been coding for years? Either way you will learn something new; coding is impossible to master.
                </p>
                <div className="flex gap-5">
                    <Button 
                        type={'secondary'}
                        className="min-w-[138px]"
                    >
                        Start exploring
                    </Button>
                    <Button className="min-w-[138px]">
                        Get started
                    </Button>
                </div>
            </div>
        </section>
    )
}