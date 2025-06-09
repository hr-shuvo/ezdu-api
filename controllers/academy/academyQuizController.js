import mongoose from "mongoose";
import { AcademyQuiz, AcademyMcq } from "../../models/AcademyModel.js";



export const loadAcademyQuiz = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({ message: "Invalid User", error: error.message });
        }

        const allQuizzes = await AcademyQuiz.find({ userId }).sort({ createdAt: -1 });

        if (allQuizzes.length > 7) {
            const quizzesToDelete = allQuizzes.slice(7);

            const deleteIds = quizzesToDelete.map(q => q._id);
            await AcademyQuiz.deleteMany({ _id: { $in: deleteIds } });
        }

        const latestQuizzes = await AcademyQuiz.find({ userId })
            .sort({ createdAt: -1 })
            .limit(7);

        return res.status(200).json({ data: latestQuizzes, userId });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch challenge", error: error.message });
    }
}

export const getAcademyOngoingQuiz = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized user" });
        }

        const now = new Date();

        const ongoingQuiz = await AcademyQuiz.findOne({
            userId,
            start: { $lte: now },
            end: { $gte: now }
        });

        if (!ongoingQuiz) {
            return res.status(200).json({data:null, message: "No active quiz in progress" });
        }

        return res.status(200).json({ data: ongoingQuiz });

    } catch (error) {
        console.error("Error getting ongoing quiz:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const upsertQuiz = async (req, res) => {
    try {
        const { _id, subjectId, duration, lessonIds, questions } = req.body;
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const ongoingQuiz = await AcademyQuiz.findOne({
            userId,
            end: { $gt: new Date() }
        });

        if (ongoingQuiz && ongoingQuiz._id.toString() !== _id) {
            return res.status(400).json({ message: "You already have an active quiz in progress." });
        }

        if (_id) {
            const updated = await AcademyQuiz.findOneAndUpdate(
                { _id, userId },
                { $set: { questions } },
                { new: true }
            );

            return res.status(200).json({ message: "Quiz updated", quiz: updated });
        }

        const now = new Date();

        const model = {
            userId,
            duration,
            start: now,
            end: new Date(now.getTime() + duration * 60 * 1000),
            subjectId,
            lessonIds,
            questions
        };

        const newQuiz = await AcademyQuiz.create(model);

        return res.status(201).json({ message: "Quiz created", quiz: newQuiz });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch challenge", error: error.message });
    }
}

export const loadOrCreateQuiz = async (req, res) => {

    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { lessonIds, subjectId, duration } = req.body;

        if (!lessonIds || !Array.isArray(lessonIds) || !duration) {
            return res.status(400).json({ message: "Missing lessonIds or duration" });
        }

        const now = new Date();

        // 1. Check if there's an ongoing quiz
        const ongoingQuiz = await AcademyQuiz.findOne({
            userId,
            start: { $lte: now },
            end: { $gte: now }
        });

        if (ongoingQuiz) {
            return res.status(200).json({ quiz: ongoingQuiz });
        }

        // 2. No ongoing quiz: Fetch MCQs
        const mcqs = await AcademyMcq.aggregate([
            { $match: { lessonId: { $in: lessonIds.map(id => new mongoose.Types.ObjectId(id)) } } },
            { $sample: { size: duration } }
        ]);

        // 3. Simplify questions & add selectedOption
        const questions = mcqs.map(mcq => ({
            lessonId: mcq.lessonId,
            question: mcq.question,
            passage: mcq.passage || null,
            optionList: mcq.optionList.map(opt => ({
                text: opt.text,
                correct: opt.correct
            })),
            selectedOption: null, // To track user's answer
        }));

        // 4. Create a new quiz
        const end = new Date(now.getTime() + duration * 60 * 1000);

        const newQuiz = await AcademyQuiz.create({
            userId,
            duration,
            start: now,
            end,
            subjectId,
            lessonIds,
            questions
        });

        return res.status(201).json({ quiz: newQuiz });

    } catch (error) {
        console.error("Error in loadOrCreateQuiz:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }

}