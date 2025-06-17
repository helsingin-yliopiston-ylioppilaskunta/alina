import "./resources.css";

interface Resource {
    id: number
    name: string
    address: string
}

interface ResourceProps {
    resource: Resource
    selected: boolean
    handleClick: (id: number) => void
}


function Resource(props: ResourceProps) {
    function handleClick() {
        props.handleClick(props.resource.id);
    }

    return (
        <li className={`Resource ${props.selected ? "selected" : ""}`} onClick={handleClick}>
            <ul>
                <li className="name">{props.resource.name}</li>
                <li className="address">{props.resource.address}</li>
            </ul>
        </li>
    )
}

interface ResourceListProps {
    resources: Resource[]
    selected: number
    handleSelect: (id: number) => void
}

function ResourceList(props: ResourceListProps) {
    function handleSelect(id: number) {
        props.handleSelect(id);
    }
    return (
        <ul className="ResourceList">
            {
                props.resources.map((resource) => (
                    <Resource resource={resource} selected={props.selected === resource.id} handleClick={handleSelect} />
                ))
            }
        </ul>
    )
}

export { Resource, ResourceList }
