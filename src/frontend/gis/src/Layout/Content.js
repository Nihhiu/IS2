import Sections from "./Sections";

function Content({selected}) {

    return (
        <div className={"Content"}>
            {
                Sections.filter(m => m.id === selected)[0].content
            }
        </div>
    );
}

export default Content;