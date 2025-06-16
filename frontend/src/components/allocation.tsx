import "./allocation.css";

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

interface OrgResourceDate {
    org_id: number
    org_name: string
    resource_id: number
    resource_name: string
    dates: Date[]
}

interface OrgResourceDateProps {
    data: OrgResourceDate
}


function OrgResourceDate(props: OrgResourceDateProps) {
    if (!props.data) return <></>;

    const paddedDates = [
        ...props.data.dates,
        ...Array(Math.max(0, 3 - props.data.dates.length)).fill(null)
    ];

    return (
    <li key={props.data.org_id} className="OrgResourceDate">
        <ul>
            <li className="name">{props.data.org_name}</li>
                {
                    paddedDates.map((date, index) => (
                        <li key={index} className="date">
                            {date ? date.date : ""}
                        </li>
                    ))
                }
        </ul>
    </li>
    )
}

interface OrgResourceDateListProps {
    data: OrgResourceDate[]
}

function OrgResourceDateList(props: OrgResourceDateListProps) {
    return (
        <div className="OrgResourceDateList">
            <h3>Requested dates</h3>
            <ul className="org-resource-dates">
                {
                    props.data.map((item) => (
                        <OrgResourceDate data={item} />
                    ))
                }
            </ul>
        </div>
    )
}

export { OrgResourceDate, OrgResourceDateList }
