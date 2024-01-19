import Airports from "../Tables/Airports";
import Countries from "../Tables/Countries";
import Regions from "../Tables/Regions";


const Sections = [

    {
        id: "Airports",
        label: "Airports",
        content: <Airports/>
    },

    {
        id: "Countries",
        label: "Countries",
        content: <Countries/>
    },

    {
        id: "Regions",
        label: "Regions",
        content: <Regions/>
    }


];

export default Sections;    