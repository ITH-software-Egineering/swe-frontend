"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Alert, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import Cookies from "js-cookie";

import { fetchModules } from "../../../projects/utils";
import { Module, Projects, Project } from "./definitions";
import { handleModuleSelectionChange, updateCurrentProject } from "./utils";

export default function ProjectEditForm({ project_id }: { project_id: string }) {
    const router = useRouter();
    const [mode, setMode] = useState("draft");
    const [modules, setModules] = useState<Module[]>([]);
    const [projects, setProjects] = useState<Projects[]>([]);
    const [currentProject, setCurrentProject] = useState<Project>({
        id: "",
        title: "",
        module_id: "",
        description: "",
        markdown_content: "",
        status: "",
        prev_project_id: "",
    });
    const [showError, setShowError] = useState(false);
    const [loading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const tmp_current_project = await updateCurrentProject(project_id, setCurrentProject);


            const tmp = await fetchModules();
            const mds = [];
            for (let i = 0; i < tmp.length; i++) {
                let key = tmp[i].id;
                let title = tmp[i].title;
                let projects = tmp[i].projects;
                mds.push({key, title, projects});
            }
            setModules(mds);
            
            // set the previous projects Select Option Input
            for (let i = 0; i < mds.length; i++) {
                if (mds[i].key == tmp_current_project.module_id) {
                    let mds_temp = []
                    for (let j = 0; j < mds[i].projects.length; j++) {
                        if (mds[i].projects[j].id != project_id)
                            mds_temp.push(mds[i].projects[j])
                    }

                    setProjects(mds_temp);
                    break;
                }
            }
            setIsLoading(false);
        }

        fetchData();
    }, []);

    async function submitProjectEditForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
    
        data.mode = mode;
    
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_V1}/project/edit/${project_id}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${Cookies.get("access_token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
    
            if (res.ok) {
                router.push("/admin/projects");
            } else {
                setShowError(true);
            }
        } catch (err) {
            setShowError(true);
        }
    }

    return (
        <div className="my-6 flex justify-center gap-4">
            <div className="flex flex-col gap-4 w-96">
                {showError &&
                    <Alert
                        color="error"
                        title="An Error Occured!"
                    />
                }
                {!loading &&
                    <Form
                        onSubmit={submitProjectEditForm}
                        validationBehavior="native"
                    >
                        <p>Status: {currentProject.status}</p>
                        <Select
                            className="max-w-md"
                            items={modules}
                            label="Module"
                            placeholder="Select a Module"
                            name="module_id"
                            defaultSelectedKeys={[currentProject.module_id]}
                            onChange={(e) => handleModuleSelectionChange(e, modules, setProjects)}
                            isRequired
                        >
                            {(module) => <SelectItem>{module.title}</SelectItem>}
                        </Select>
                        <Select
                            className="max-w-md"
                            items={projects}
                            label="Previous Project"
                            placeholder="Select the previous project"
                            defaultSelectedKeys={[currentProject.prev_project_id]}
                            name="prev_project_id"
                        >
                            {(project) => <SelectItem>{project.title}</SelectItem>}
                        </Select>
                        <Input
                            type="text"
                            name="title"
                            label="Project Title"
                            maxLength={300}
                            defaultValue={currentProject.title}
                            isRequired
                        />
                        <Input
                            type="text"
                            name="description"
                            label="Short Description"
                            defaultValue={currentProject.description}
                            maxLength={300}
                        />
                        <Textarea
                            name="markdown_content"
                            label="Project Content (in markdown)"
                            defaultValue={currentProject.markdown_content}
                        />
                        <div className="w-full flex flex-row justify-between items-center">
                            <Button onClick={() => setMode("draft")} className="bg-[#F94144] text-white" type="submit">Draft</Button>
                            <Button onClick={() => setMode("publish")} className="bg-[#2EC4B6] text-white" type="submit">Publish</Button>
                        </div>
                    </Form>
                }
            </div>
        </div>
    );
}