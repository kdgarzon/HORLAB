export const handleBuildingSelect = (setClassroom) => async (BuildingId) => {
    setClassroom((prevClassroom) => ({
      ...prevClassroom,
      edificio: BuildingId
    }));
};
