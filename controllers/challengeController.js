import { Challenge } from "../models/CourseModel.js";
import { _loadChallenges } from "../services/challengeService.js";


export const loadChallenges = async (req, res) => {
    const {isActive, lessonId} = req.query;

    const query = {};

    if(lessonId){
        query.lessonId = lessonId;
    }
    if(isActive === true){
        query.status = 1;
    }
    if(isActive === false){
        query.status = 0;
    }

    const page = Number(req.query.pg) || 1;
    const size = Number(req.query.sz) || 10;

    try {
        const {data, totalCount, totalPage, currentPage} = await _loadChallenges(query, page, size);

        res.status(200).json({data, totalCount, totalPage, currentPage});
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch challenges", error: error.message });
    }
}



export const getChallenge = async (req, res) => {
    try {
        const challengeId = req.params.id;
        if(!challengeId){
            return res.status(400).json({ message: "Invalid challenge id", error: error.message });
        }

        const challenge = await Challenge.findById(challengeId);

        if(!challenge){
            return res.status(404).json({ message: "Failed to fetch challenge", error: error.message });
        }

        res.status(200).json(challenge);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch challenge", error: error.message });
    }
}

export const createChallenge = async (req, res) => {
    try {
        // const data = await _loadModules();

        const challenge = req.body;

        if (challenge._id) {
            await Challenge.findByIdAndUpdate(challenge._id, challenge);
            res.status(200).json('update success');
        }
        else {
            await Challenge.create(challenge)
            res.status(200).json('create success');
        }


    } catch (error) {
        res.status(500).json({ message: "Failed to fetch challenge", error: error.message });
    }
}