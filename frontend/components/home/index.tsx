import { Courses } from "./Courses";
import { Header } from "./Header";
import { Layouts } from "./Layouts";

export default function Home() {
    return(
        <main>
            <Header />
            <Courses />
            <Layouts />
        </main>
    )
}