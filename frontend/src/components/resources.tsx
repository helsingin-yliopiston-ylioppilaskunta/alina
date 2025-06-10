import "./resources.css";

interface Resource {
    id: number
    name: string
    address: string
}

interface ResourceProps {
    resource: Resource
}


function Resource(props: ResourceProps) {
    return (
        <li className="Resource">
            <ul>
                <li className="name">{props.resource.name}</li>
                <li className="address">{props.resource.address}</li>
            </ul>
        </li>
    )
}

interface ResourceListProps {
    resources: Resource[]
}

function ResourceList(props: ResourceListProps) {
    return (
        <ul className="ResourceList">
            {
                props.resources.map((resource) => (
                    <Resource resource={resource} />
                ))
            }
        </ul>
    )
}

export { Resource, ResourceList }
