"use client"
import { useEffect, useState } from "react";
import { Button, Form, Input, Alert, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@heroui/react";
import Cookies from "js-cookie";
import { fetchModules } from "./utils";

interface Module {
    key: string,
    title: string,
    projects: Project[],
}
interface Project {
    key: string,
    title: string,
}

interface CreateModuleModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export function CreateModuleModal({isOpen, onOpenChange}: CreateModuleModalProps) {
    const [info, setInfo] = useState({status: "", message: ""});
    const [isLoading, setIsLoading] = useState(false);

    async function submitForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const course_id = Cookies.get("course_context");
        if (!course_id || course_id == "") {
            setInfo({status: "fail", message: "Please select a course in the sidebar"});
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_V1}/module/create`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${Cookies.get("access_token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({...data, course_id})
            });

            if (res.ok) {
                setInfo({status: "success", message: "Module Created Successfully!"});
            } else {
                setInfo({status: "fail", message: "An Error Occured!"});
            }
        } catch (err) {
            setInfo({status: "fail", message: "An Error Occured!"});
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Create a new Module</ModalHeader>
                            <ModalBody>
                                {info.message != "" &&
                                    <Alert
                                        color={info.status === "success" ? "success" : "danger"}
                                        title={info.message}
                                    />
                                }
                                <Form
                                    onSubmit={submitForm}
                                    validationBehavior="native"
                                >
                                    <Input
                                        name="title"
                                        label="Module Title"
                                        placeholder="Max 60 characters"
                                        maxLength={60}
                                        isRequired
                                    />
                                    <Input
                                        name="description"
                                        label="Module Description"
                                        placeholder="Max 300 characters"
                                        maxLength={300}
                                    />
                                    <Button isLoading={isLoading} className="self-end bg-[#3776AB] text-white" type="submit">Submit</Button>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export function ModuleEditModal({ isOpen, onOpenChange, toEdit }: {
    isOpen: boolean,
    onOpenChange: (isOpen: boolean) => void,
    toEdit: { id: string, title: string, status: string, description: string }
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [info, setInfo] = useState({
        status: "",
        message: ""
    });
    const [modules, setModules] = useState<{key: string, title: string}[]>([]);

    useEffect(() => {
        async function fetchData() {
            const tmp = await fetchModules();
            const mds = [];
            for (let i = 0; i < tmp.length; i++) {
                if (tmp[i].id == toEdit.id)
                    continue
                let key = tmp[i].id;
                let title = tmp[i].title;
                mds.push({key, title});
            }
            setModules(mds);
        }

        fetchData();
    }, [toEdit])

    async function handleEditModuleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            // Update data on the backend
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_V1}/module/${toEdit.id}/update`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${Cookies.get("access_token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                setInfo({"status": "success", "message": "Module Update Successful!"});
            } else {
                setInfo({"status": "fail", "message": "An Error Occured!"});
            }
        } catch (err) {
            setInfo({"status": "fail", "message": "An Error Occured!"});
        } finally {
            setIsLoading(false);
        }
    }



    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>
                            Editing Module - {toEdit.title}
                        </ModalHeader>
                        <ModalBody>
                            {info.message != "" &&
                                <Alert
                                    color={info.status === "success" ? "success" : "danger"}
                                    title={info.message}
                                />
                            }
                            <Form
                                onSubmit={handleEditModuleSubmit}
                                validationBehavior="native"
                            >
                                <Input
                                    name="title"
                                    defaultValue={toEdit.title}
                                    label="Title"
                                    maxLength={60}
                                />
                                <Input
                                    name="description"
                                    defaultValue={toEdit.description}
                                    label="Description"
                                    maxLength={300}
                                />
                                <Button
                                    className="self-end bg-[#3776AB] text-white"
                                    type="submit"
                                    isLoading={isLoading}
                                >Update</Button>
                            </Form>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export function DeleteModal({ isOpen, onOpenChange, toDelete }: {
    isOpen: boolean,
    onOpenChange: (isOpen: boolean) => void,
    toDelete: { type: string, id: string, title: string }
}) {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <ModalContent>
                {(onClose) => (
                    <>                    
                        <ModalHeader>
                            Delete {toDelete.type} - {toDelete.title}?
                        </ModalHeader>
                        <ModalBody>
                            <p>
                                Are you sure you want to delete {toDelete.type} - {toDelete.title}?
                            </p>
                            <p>
                                To proceed, please enter [{toDelete.id}] below:
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <div className="w-full flex flex-row gap-3 items-center">
                                <Input
                                    type="text"
                                    label={`${toDelete.type} ID`}
                                    name="ID"
                                />
                                <Button>Submit</Button>
                            </div>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}