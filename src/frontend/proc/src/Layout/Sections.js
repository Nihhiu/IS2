import Brands from "../Tables/Airports";
import ModelsByBrand from "../Tables/ModelsByBrand";
import TopTeams from "../Tables/TopTeams";

const Sections = [

    {
        id: "airports",
        label: "Airports",
        content: <Airports/>
    },

    {
        id: "models-by-brand",
        label: "Models by Brand",
        content: <ModelsByBrand/>
    },

    {
        id: "top-teams",
        label: "Top Teams",
        content: <TopTeams/>
    },

];

export default Sections;