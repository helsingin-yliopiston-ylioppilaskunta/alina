import "./orgs.css";

interface Org {
    id: number
    name: string
}

interface OrgProps {
    org: Org
}


function Org(props: OrgProps) {
    return (
        <li className="Org">
            <ul>
                <li className="name">{props.org.name}</li>
            </ul>
        </li>
    )
}

interface OrgListProps {
    orgs: Org[]
}

function OrgList(props: OrgListProps) {
    return (
        <div className="OrgList">
            <h3>Organisations</h3>
            <ul className="orgs">
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
