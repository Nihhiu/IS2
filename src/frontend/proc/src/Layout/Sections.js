import Airports from "../Tables/Airports";
import AirportsComponent from "../Tables/AirportsComponent";
import TopAirports from "../Tables/TopAirports";

const Sections = [

    {
        id: "airports",
        label: "Airports",
        content: <Airports/>
    },

    {
        id: "airports-component",
        label: "Airports Component",
        content: <AirportsComponent/>
    },

    {
        id: "top-airport",
        label: "Top Airports",
        content: <TopAirports/>
    },

];

export default Sections;