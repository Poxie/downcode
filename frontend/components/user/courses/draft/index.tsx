import { Draft } from "./Draft";

export const DraftPage = () => {
    return(
        // 100dvh for full screen - 200px (100px navbar height, 100px footer height)
        <main className="flex gap-4 items-start w-main max-w-main mx-auto min-h-[calc(100dvh-200px)]">
            <Draft />
        </main>
    )
}