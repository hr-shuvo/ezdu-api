

export const loadAcademyQuiz = async (req, res) =>{
    try{
        const userId = req.user.userId;

        

        return res.status(200).json({message: "User Id: " + userId});
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch challenge", error: error.message });
    }
}

export const upsertQuiz = async (req, res) =>{
    try{
        const userId = req.user.userId;

        

        return res.status(200).json({message: "User Id: " + userId});
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch challenge", error: error.message });
    }
}