import { Courses } from "./Courses";
import { Header } from "./Header";
import { Layouts } from "./Layouts";
import { Questions } from "./Questions";
import { StartJourney } from "./StartJourney";

export default function Home() {
    return(
        <main>
            <Header />
            <Courses />
            <Layouts />
            <Questions />
            <StartJourney />
        </main>
    )
}