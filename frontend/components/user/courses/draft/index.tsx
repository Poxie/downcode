import { Draft } from "./Draft";
import { DraftOverview } from "./DraftOverview";
import { DraftSidebar } from "./DraftSidebar";

export const DraftPage = ({ 
    params: { draftId } 
}: { 
    params: { draftId: string }; 
}) => {
    return(
        // 100dvh for full screen - 200px (100px navbar height, 100px footer height)
        <main className="flex gap-4 items-start w-main max-w-main mx-auto min-h-[calc(100dvh-200px)]">
            <Draft draftId={draftId} />
        </main>
    )
}