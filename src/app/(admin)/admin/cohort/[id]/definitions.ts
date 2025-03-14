

export interface Student {
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    status: string,
}
export interface Cohort {
    id: string,
    name: string,
    status: string,
    students: Array<Student>,
    start_date: string,
    course: {
        id: string,
        title: "",
    },
}