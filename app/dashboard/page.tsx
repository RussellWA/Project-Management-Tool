import { mockProjects } from "@/lib/mockData";
import Link from "next/link";


export default function Dashboard() {

    return (
        <div>
            <h1>Projects</h1>

            <div>
                {mockProjects.map((project) => (
                    <Link href={""}>
                        <div>
                            <p>{project.client}</p>
                            <h2>{project.name}</h2>

                            <div>
                                <span>{project.milestones.length} Active Milestones</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}