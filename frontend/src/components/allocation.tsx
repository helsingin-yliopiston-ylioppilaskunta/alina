import { useState, useEffect } from 'react';
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
    reserved: Record<string, OrgResourceDate>,
}

function OrgResourceDateList(props: OrgResourceDateListProps) {
    return (
        <div className="OrgResourceDateList">
            <h4>Requested dates</h4>
            <ul className="org-resource-dates">
                {
                    [...props.data].sort((a, b) => {
                        return a.org_name.localeCompare(b.org_name);
                    }).map((item) => {
                        const matchingKey = Object.entries(props.reserved).find(
                            ([_, value]) => value.org_id === item.org_id
                        )?.[0];

                        return <OrgResourceDate data={item} reserved={matchingKey ? matchingKey : ""} />;
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
    const [reservedDates, setReservedDates] = useState<Record<string, OrgResourceDate>>({});
    const [shuffledData, setShuffledData] = useState<OrgResourceDate[]>([]);
    const [missingOrgs, setMissingOrgs] = useState<string[]>([]);

    useEffect(() => {
        setShuffledData(props.orgResourceDates);
        setReservedDates({});
        setMissingOrgs([])
    }, [props.orgResourceDates])

    function allocate() {
        shuffle();

        const reserved: Record<string, OrgResourceDate> = {};
        const gotDate = new Set<number>();

        for (const org of shuffledData) {
            for (const date of org.dates) {
                if (!(date.date in reserved)) {
                    reserved[date.date] = org;
                    gotDate.add(org.org_id);
                    break;
                }
            }
        }

        const missing = shuffledData.filter(org => !gotDate.has(org.org_id));
        setMissingOrgs(missing.map(org => org.org_name));
        setReservedDates(reserved);
    }

    function shuffle() {
        const copy = [...shuffledData];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }

        setShuffledData(copy);
    }

    return (
        <div className="Allocate">
            <h3>Allocations</h3>
            <OrgResourceDateList data={shuffledData} reserved={reservedDates} />
            <p>Orgs without a date: {missingOrgs.length}</p>
            {missingOrgs.length > 0 && (
                <ul className="missing">
                    {missingOrgs.map((name, idx) => (
                        <li key={idx}>{name}</li>
                    ))}
                </ul>
            )}
            <input type="button" value="Allocate" className="allocate" onClick={allocate} />
        </div>
    )
}

export { Allocate }
