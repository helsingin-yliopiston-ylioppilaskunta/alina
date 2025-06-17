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
    reserved: string
    skipped: boolean
    toggleSkipped: (id: number) => void
    manualAllocate: (dateStr: string, org: OrgResourceDate) => void
    manualAllocationMap: Record<string, OrgResourceDate>;
}


function OrgResourceDate(props: OrgResourceDateProps) {
    if (!props.data) return <></>;

    const paddedDates = [
        ...props.data.dates,
        ...Array(Math.max(0, 3 - props.data.dates.length)).fill(null)
    ];

    function handleClick() {
        props.toggleSkipped(props.data.org_id);
    }

    return (
        <li
            key={props.data.org_id}
            className={`OrgResourceDate ${props.skipped ? "skipped" : ""}`}
        >
            <ul>
                <li className="name" onClick={handleClick}>{props.data.org_name}</li>
                {
                    paddedDates.map((date, index) => (
                        <li
                            key={index}
                            className={`date
                                ${date && props.reserved === date.date ? "reserved" : ""}
                                ${date && props.manualAllocationMap?.[date.date]?.org_id === props.data.org_id ? "manual" : ""}
                            `}
                            onClick={() => {
                                if (date) props.manualAllocate(date.date, props.data);
                            }}
                        >
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
    skipped: number[]
    toggleSkipped: (id: number) => void
    manualAllocate: (dateStr: string, org: OrgResourceDate) => void
    manualAllocationMap: Record<string, OrgResourceDate>
}

function OrgResourceDateList(props: OrgResourceDateListProps) {
    return (
        <div className="OrgResourceDateList">
            <h4>Requested dates</h4>
            <ul className="org-resource-dates">
                {[...props.data]
                    .sort((a, b) => a.org_name.localeCompare(b.org_name))
                    .map((item) => {
                        const matchingKey = Object.entries(props.reserved).find(
                            ([, value]) => value.org_id === item.org_id
                        )?.[0];

                        return (
                            <OrgResourceDate
                                key={item.org_id}
                                data={item}
                                reserved={matchingKey ?? ""}
                                skipped={props.skipped.includes(item.org_id)}
                                toggleSkipped={props.toggleSkipped}
                                manualAllocate={props.manualAllocate}
                                manualAllocationMap={props.manualAllocationMap}
                            />
                        );
                    })}
            </ul>
        </div>
    )
}

interface AllocateProps {
    orgResourceDates: OrgResourceDate[]
    onSubmit: (dates: Date[]) => Promise<void>
}

function Allocate(props: AllocateProps) {
    const [reservedDates, setReservedDates] = useState<Record<string, OrgResourceDate>>({});
    const [shuffledData, setShuffledData] = useState<OrgResourceDate[]>([]);
    const [missingOrgs, setMissingOrgs] = useState<string[]>([]);
    const [skippedOrgs, setSkippedOrgs] = useState<number[]>([]);
    const [manualAllocations, setManualAllocations] = useState<Record<string, OrgResourceDate>>({});

    useEffect(() => {
        setShuffledData(props.orgResourceDates);
        setReservedDates({});
        setMissingOrgs([]);
        setSkippedOrgs([]);
        setManualAllocations({});
    }, [props.orgResourceDates])

    function manualAllocate(dateStr: string, org: OrgResourceDate) {
        if (manualAllocations[dateStr]) return;
        if (Object.values(manualAllocations).some(o => o.org_id === org.org_id)) return;

        setManualAllocations(prev => ({
            ...prev,
            [dateStr]: org
        }));
    }

    function allocate() {
        shuffle();

        const reserved: Record<string, OrgResourceDate> = { ...manualAllocations };
        const gotDate = new Set<number>(Object.values(manualAllocations).map(o => o.org_id));

        for (const org of shuffledData) {
            if (gotDate.has(org.org_id)) continue;
            if (skippedOrgs.includes(org.org_id)) continue;

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

    function toggleSkipped(id: number) {
        let newSkipped = [];
        if (skippedOrgs.includes(id)) {
            newSkipped = skippedOrgs.filter((a) => a !== id);
        } else {
            newSkipped = [...skippedOrgs, id];
        }

        setSkippedOrgs(newSkipped);
    }

    function collectAllocatedDates(): Date[] {
        const allocations = Object.entries(reservedDates);
        return allocations.flatMap(([dateStr, org]) => {
            const match = org.dates.find(d => d.date === dateStr);
            return match
                ? [{ ...match, allocated: true }]
                : [];
        })
    }

    return (
        <div className="Allocate">
            <h3>Allocations</h3>
            <OrgResourceDateList
                data={shuffledData}
                reserved={reservedDates}
                skipped={skippedOrgs}
                toggleSkipped={toggleSkipped}
                manualAllocate={manualAllocate}
                manualAllocationMap={manualAllocations}
            />
            <p>Orgs without a date: {missingOrgs.length}</p>
            {missingOrgs.length > 0 && (
                <ul className="missing">
                    {missingOrgs.map((name, idx) => (
                        <li key={idx}>{name}</li>
                    ))}
                </ul>
            )}
            <input type="button" value="Allocate" className="allocate" onClick={allocate} />
            <input type="button" value="Submit" className="submit" onClick={props.onSubmit(collectAllocatedDates())} />
        </div>
    )
}

export { Allocate }
