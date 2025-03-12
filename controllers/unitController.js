import { _loadUserUnits } from "../services/unitService.js";
import { _getUserProgress } from "../services/userProgress.js";



export const loadUserUnits = async (req, res) => {

    try {
        const data = await _loadUserUnits(req.user.userId);


        res.status(200).json(data);
    } catch(error) {
        res.status(500).json({message: "Failed to fetch courses", error: error.message});
    }

};

