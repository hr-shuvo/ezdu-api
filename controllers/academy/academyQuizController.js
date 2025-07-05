import mongoose from "mongoose";
import { AcademyQuiz, AcademyMcq, AcademyProgress } from "../../models/AcademyModel.js";
import { User } from "../../models/UserModel.js"




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

        const _latestQuizzes = await AcademyQuiz.find({ userId }).lean()
            .populate('subjectId')
            .sort({ createdAt: -1 })
            .limit(7);

        const latestQuizzes = _latestQuizzes.map(q => ({
            ...q,
            subject: q.subjectId,
            subjectId: q.subjectId._id
        }));

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
            return res.status(200).json({ data: null, message: "No active quiz in progress" });
        }

        return res.status(200).json({ data: ongoingQuiz });

    } catch (error) {
        console.error("Error getting ongoing quiz:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const upsertQuiz = async (req, res) => {
    try {
        const { _id, subjectId, duration, lessonIds, questions, end } = req.body;
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
                { $set: { questions, end } },
                { new: true }
            );

            return res.status(200).json({ message: "Quiz updated", data: updated });
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
            return res.status(200).json({ data: ongoingQuiz });
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

        return res.status(201).json({ data: newQuiz });

    } catch (error) {
        console.error("Error in loadOrCreateQuiz:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }

}

export const upsertAcademyQuizXp = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({ message: "Invalid User", error: error.message });
        }

        let progress = await AcademyProgress.findOne({ userId });

        const _allQuizzes = await AcademyQuiz.find({ userId }).sort({ createdAt: -1 });

        if (_allQuizzes.length > 10) {
            const quizzesToDelete = _allQuizzes.slice(10);

            const deleteIds = quizzesToDelete.map(q => q._id);
            await AcademyQuiz.deleteMany({ _id: { $in: deleteIds } });
        }

        const { quizId } = req.query;
        const now = new Date();
        const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

        const allQuizzes = await AcademyQuiz.find({
            userId,
            end: { $lt: now },
            $or: [
                { xp: 0 },
                { xp: { $exists: false } },
                { xp: null }
            ]
        }).sort({ createdAt: -1 }).limit(10);


        let totalNewXp = 0;
        for (const quiz of allQuizzes) {
            let xp = 0;

            for (const q of quiz.questions) {
                const selected = q.selectedOption;
                if (selected) {
                    if (selected.correct === true) {
                        xp += 1;
                    } else {
                        xp -= 0.2;
                    }
                }
            }

            xp = Math.max(0, Math.round(xp * 100) / 100);

            quiz.xp = xp;
            await quiz.save();

            totalNewXp += xp;
        }

        let currentQuizXp = 0;
        const quiz = _allQuizzes.find(q => q._id.toString() === quizId);
        if (quiz) {

            for (const q of quiz.questions) {
                const selected = q.selectedOption;
                if (selected) {
                    if (selected.correct === true) {
                        currentQuizXp += 1;
                    } else {
                        currentQuizXp -= 0.2;
                    }
                }
            }
        }
        // console.log('quiz: ', quiz);
        // console.log('quiz id: ', quizId);
        // console.log('quiz list: ', allQuizzes);

        const quizStartedAt = new Date(quiz?.createdAt ?? now);
        // quizStartedAt.setDate(now.getDate() - 2)

        const quizDayUTC = new Date(Date.UTC(
            quizStartedAt.getUTCFullYear(),
            quizStartedAt.getUTCMonth(),
            quizStartedAt.getUTCDate()
        ));


        if (progress) {
            progress.totalXp += totalNewXp;

            // const dayStr = quizStartedAt.toDateString();
            const index = progress.lastWeekXp.findIndex(entry =>
                // new Date(entry.day).toDateString() === dayStr
                sameUtcDay(new Date(entry.day), quizStartedAt)
            );

            if (index !== -1) {
                progress.lastWeekXp[index].xp += totalNewXp;
            } else {
                progress.lastWeekXp.push({ day: quizDayUTC, xp: totalNewXp });
            }

            progress.lastWeekXp.sort((a, b) => new Date(b.day) - new Date(a.day));

            if (progress.lastWeekXp.length > 7) {
                // progress.lastWeekXp.shift();
                progress.lastWeekXp = progress.lastWeekXp.slice(0, 7);
            }

            // // // streak // // //

            const yesterday = new Date(Date.UTC(
                today.getUTCFullYear(),
                today.getUTCMonth(),
                today.getUTCDate() - 1
            ));

            const lastStreakDate = new Date(Date.UTC(
                progress.lastStreakDay.getUTCFullYear(),
                progress.lastStreakDay.getUTCMonth(),
                progress.lastStreakDay.getUTCDate()
            ));

            if (lastStreakDate.getTime() === yesterday.getTime()) {
                progress.streakCount += 1;
            } else {
                progress.streakCount = 1;
            }

            // progress.lastStreakDay = new Date(Date.UTC(
            //     today.getUTCFullYear(),
            //     today.getUTCMonth(),
            //     today.getUTCDate()
            // ));

            progress.lastStreakDay = today;

            // // // end streak // // //

            await progress.save();
        } else {
            // const lsd = new Date(Date.UTC(
            //     today.getUTCFullYear(),
            //     today.getUTCMonth(),
            //     today.getUTCDate()
            // ));
            const user = await User.findById(userId);

            progress = await AcademyProgress.create({
                userName: user?.name || "unKnown",
                userId,
                totalXp: totalNewXp,
                lastWeekXp: [{ day: quizStartedAt, xp: totalNewXp }],
                lastStreakDay: today,
                streakCount: 1
            });
        }


        return res.status(200).json({
            data: {
                xp: currentQuizXp,
                progress: progress
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch challenge", error: error.message });
    }
}



function sameUtcDay(a, b) {
    return a.getUTCFullYear() === b.getUTCFullYear()
        && a.getUTCMonth() === b.getUTCMonth()
        && a.getUTCDate() === b.getUTCDate();
}