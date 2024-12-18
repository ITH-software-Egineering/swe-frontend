"use client"
import { useState } from "react";
import { Input, Card, CardHeader, CardBody, CardFooter, Button } from "@nextui-org/react";

export default function SignUpCard() {
    const [formDetails, setFormDetails] = useState({
        "email": "",
        "password": "",
        "first_name": "",
        "last_name": "",
        "admin_reg_code": "",
    })

    // @ts-expect-error This is a React ChangeEvent
    function handleInputChange(e) {
        setFormDetails((prevValue) => {
            return {
                ...prevValue,
                [e.target.name]: e.target.value
            }
        })
    }
    type Details = "email" | "password" | "first_name" | "last_name" | "admin_reg_code"
    async function submitForm() {
        console.log(formDetails);
        let detail: Details
        for (detail in formDetails) {
            if (formDetails[detail] == "") return
        }
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_V1}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({...formDetails, "role": "admin"}),
            });
    
            if (res.ok) {
                console.log("Registration Successful");
            } else console.log("Error occurred!!!");

            console.log(await res.json());
        } catch (e) {
            console.log("Error occurred!!!", e);
        }
    }
    return (
        <div className="flex justify-center items-center">
            <Card className="w-96">
                <CardHeader>
                    <p>Sign Up</p>
                </CardHeader>
                <CardBody className="flex flex-col gap-5">
                    <Input
                        type="email"
                        name="email"
                        label="Email:"
                        onChange={handleInputChange}
                    />
                    <Input
                        type="text"
                        name="first_name"
                        label="First Name"
                        onChange={handleInputChange}
                    />
                    <Input
                        type="text"
                        name="last_name"
                        label="Last Name"
                        onChange={handleInputChange}
                    />
                    <Input
                        type="password"
                        name="password"
                        label="Password"
                        onChange={handleInputChange}
                    />
                    <Input
                        type="password"
                        name="admin_reg_code"
                        label="Admin Registration Code"
                        onChange={handleInputChange}
                    />
                </CardBody>
                <CardFooter className="flex justify-end">
                    <Button onPress={submitForm} color="warning">Submit</Button>
                </CardFooter>
            </Card>
        </div>
    );
}