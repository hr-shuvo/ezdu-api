import { AcademyProgress } from "../../models/AcademyModel.js";

export const getAcademyProgress = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({ message: "Invalid User", error: error.message });
        }

        const progress = await AcademyProgress.findOne({ userId });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const index = progress.lastWeekXp.findIndex(entry => {
            const entryDate = new Date(entry.day);
            entryDate.setHours(0, 0, 0, 0);
            return entryDate.getTime() === today.getTime();
        }
        );

        if (progress) {

            if (index === -1) {
                if (progress.lastWeekXp.length >= 7) {
                    progress.lastWeekXp.shift();
                }
                progress.lastWeekXp.push({ day: today, xp: 0 });
                progress.lastWeekXp.sort((a, b) =>
                    b.day.getTime() - a.day.getTime()
                );
                await progress.save();
            }
        } else {
            progress = new AcademyProgress({
                userId,
                lastWeekXp: [{ day: today, xp: 0 }],
                streak: 1,
                lastStreakDay: today,
            });
            await progress.save();
        }

        return res.status(200).json({ data: progress });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch progress", error: error.message });
    }
}