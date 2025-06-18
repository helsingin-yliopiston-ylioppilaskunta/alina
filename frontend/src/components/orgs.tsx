import "./orgs.css";

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

interface OrgAllocation {
    org: Org
    date: Date | undefined
}

interface OrgProps {
    org: OrgAllocation
}

function Org(props: OrgProps) {
    console.log(props.org);

    return (
        <li className="Org">
            <ul className="row">
                <li className="name">{props.org.org.name}</li>
                <li className="contact-person">{props.org.date.request.contact_person}</li>
                <li className="contact-email">{props.org.date.request.contact_email}</li>
                <li className="contact-phone">{props.org.date.request.contact_phone}</li>
                <li className="event">{props.org.date.request.event}</li>
                <li className="description">{props.org.date.request.description}</li>
                <li className="participants">{props.org.date.request.participants}</li>
                <li className="date">{props.org.date ? props.org.date.date : "No date allocated"}</li>
            </ul>
        </li>
    )
}

interface OrgListProps {
    orgs: OrgAllocation[]
}

function OrgList(props: OrgListProps) {
    function copyTSV() {
        const tsvLines = props.orgs.map((org) => {
            const name = org.org.name;
            const email = org.date?.request.contact_email ?? "";
            const date = org.date?.date ?? "Ei myönnetty";
            return `${name}\t${email}\t${date}`
        });

        const header = "Järjestö\tSähköposti\tPäivämäärä";
        const fullTSV = [header, ...tsvLines].join("\n");

        navigator.clipboard.writeText(fullTSV)
            .then(() => alert("Copied"))
            .catch(err => alert("Copy unsuccessfull: " + err));
    }

    return (
        <div className="OrgList">
            <h3>Organisations</h3>
            <button onClick={copyTSV}>Copy TSV</button>
            <ul className="orgs">
            <li className="Org">
                <ul className="row">
                    <li className="name">Järjestö</li>
                    <li className="contact-person">Yhteyshenkilö</li>
                    <li className="contact-email">Sähköposti</li>
                    <li className="contact-phone">Puhelin</li>
                    <li className="event">Tapahtuma</li>
                    <li className="description">Kuvaus</li>
                    <li className="participants">Osallistujamäärä</li>
                    <li className="date">Päivämäärä</li>
                </ul>
            </li>
                {
                    props.orgs.map((org) => (
                        <Org org={org} />
                    ))
                }
            </ul>
        </div>
    )
}

export { Org, OrgList }
