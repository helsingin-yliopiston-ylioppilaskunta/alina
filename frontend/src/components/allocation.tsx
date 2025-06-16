import { useState } from 'react';
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
    data: OrgResourceDate,
    reserved: string,
}


function OrgResourceDate(props: OrgResourceDateProps) {
    if (!props.data) return <></>;

    const paddedDates = [
        ...props.data.dates,
        ...Array(Math.max(0, 3 - props.data.dates.length)).fill(null)
    ];

    console.log(props.reserved);

    return (
    <li key={props.data.org_id} className="OrgResourceDate">
        <ul>
            <li className="name">{props.data.org_name}</li>
                {
                    paddedDates.map((date, index) => (
                        <li key={index} className={`date ${date && props.reserved === date.date ? "reserved" : ""}`}>
                            {date ? date.date : ""}
                        </li>
                    ))
                }
        </ul>
    </li>
    )
}

interface OrgResourceDateListProps {
    data: OrgResourceDate[],
    reserved: any[],
}

function OrgResourceDateList(props: OrgResourceDateListProps) {
    return (
        <div className="OrgResourceDateList">
            <h4>Requested dates</h4>
            <ul className="org-resource-dates">
                {
                    props.data.map((item) => {
                        const matchingKey = Object.entries(props.reserved).find(
                            ([key, value]) => value.org_id === item.org_id
                        )?.[0];

                        return <OrgResourceDate data={item} reserved={matchingKey} />;
                    })
                }
            </ul>
        </div>
    )
}

interface AllocateProps {
    orgResourceDates: OrgResourceDate[]
}

function Allocate(props: AllocateProps) {
    const [reservedDates, setReservedDates] = useState([]);

    function allocate() {
        let reserved = {};
        for (let org of props.orgResourceDates) {
            for (let date of org.dates) {
                if (!(date.date in reserved)) {
                    reserved[date.date] = org
                }
            }
        }

        setReservedDates(reserved);
    }

    return (
        <div className="Allocate">
            <h3>Allocations</h3>
            <OrgResourceDateList data={props.orgResourceDates} reserved={reservedDates} />
            <input type="button" value="allocate" onClick={allocate} />
        </div>
    )
}

export { Allocate }
