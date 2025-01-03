"use client"
import React, { useEffect } from "react";
import { Star, Circle } from "@mui/icons-material";
import { Avatar, Drawer, DrawerBody, DrawerContent, DrawerHeader, useDisclosure } from "@nextui-org/react";
import MenuIcon from '@mui/icons-material/Menu';
import Link from "next/link";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { Logout } from "@mui/icons-material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Laptop } from "@mui/icons-material";

export default function AppNavBar() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <nav className="bg-[#3776AB] min-h-14 flex items-center px-6 mb-6">
            <header className="flex flex-row w-full justify-between">
                <div className="flex flex-row gap-3 items-center">
                    <MenuIcon
                     className="text-white cursor-pointer hover:bg-[#2b2d4233] rounded-full p-1"
                     fontSize="large"
                     onClick={onOpen}
                    />
                    <p className="text-white font-bold">pylearn</p>
                </div>
                <div className="flex flex-row gap-6">
                    <div className="bg-[#FAFAFA] border-1 border-[#FFC107] flex flex-row rounded-[10px] px-2 py-1 gap-3 text-sm">
                        <p className="flex flex-row items-center gap-1">
                            209
                            <Circle
                                htmlColor="#AE1414"
                                fontSize="small"
                            />
                        </p>
                        <p className="flex flex-row items-center gap-1">
                            19
                            <Star
                                htmlColor="#3776AB"
                                fontSize="small"
                            />
                        </p>
                    </div>
                    <Avatar
                        name="Clement Dada"
                        size="sm"
                    />
                </div>
            </header>

            <Drawer
                isOpen={isOpen}
                placement="left"
                onOpenChange={onOpenChange}
                size="xs"
                classNames={{
                    base: "bg-[#FAFAFA]"
                }}
            >
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader>Menu</DrawerHeader>
                            <DrawerBody>
                                <div className="flex flex-col gap-8 mt-6">
                                    <DrawerItem
                                        title="Home"
                                        link="/"
                                        icon={HomeOutlinedIcon}
                                        active
                                    />
                                    <DrawerItem
                                        title="Projects"
                                        link="/projects"
                                        icon={CalendarTodayIcon}
                                    />
                                    <DrawerItem
                                        title="Practice"
                                        link="/practice"
                                        icon={Laptop}
                                    />
                                    <DrawerItem
                                        title="Logout"
                                        link="/logout"
                                        icon={Logout}
                                    />
                                </div>
                            </DrawerBody>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </nav>
    );
}

function DrawerItem(props: {
    link: string,
    title: string,
    // @ts-expect-error
    icon: Any
    // To dertermine if to show a background color or not
    active?: boolean
}) {
    return (
        <Link
            href={props.link}
        >
            <div className={`min-h-20 px-3 flex flex-row items-center gap-10 text-base hover:bg-gray-400 hover:text-white ${props.active ? "bg-[#3776AB] text-white": "text-[#2b2d42]"}`}>
                {<props.icon
                    fontSize="medium"
                />}
                {props.title}
            </div>
        </Link>
    );
}