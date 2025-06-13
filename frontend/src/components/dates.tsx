import "./dates.css";

interface Org {
    id: number
    name: string
}

interface Resource {
    id: number
    name: string
    address: string
}

interface Request {
    id: number
    contact_person: string
    contact_email: string
    contact_phone: string
    event: string
    description: string
    participants: string
    checked: boolean
    org_id: number
    org: Org
    resource_id: number
    resource: Resource
    dates: Date[]
}

interface Date {
    id: number
    date: string
    allocated: boolean
    request_id: number
    request: Request
}

interface DateProps {
    date: Date
}


function Date(props: DateProps) {
    return (
        <li key={props.date.id} className="Date">
            <ul>
                <li className="name">{props.date.date}</li>
                <li classname="org">{props.date.request.org.name}</li>
                <li classname="res">{props.date.request.resource.name}</li>
                <li classname="allocated">{props.date.allocated ? "Kyllä" : "Ei"}</li>
            </ul>
        </li>
    )
}

interface DateListProps {
    dates: Date[]
}

function DateList(props: DateListProps) {
    return (
        <div className="DateList">
            <h3>Dates</h3>
            <ul className="dates">
                {
                    props.dates.map((date) => (
                        <Date date={date} />
                    ))
                }
            </ul>
        </div>
    )
}

export { Date, DateList }
