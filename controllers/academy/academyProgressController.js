import { AcademyProgress } from "../../models/AcademyModel.js";

export const getAcademyProgress = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({ message: "Invalid User", error: error.message });
        }

        let progress = await AcademyProgress.findOne({ userId });

        const now = new Date();
        const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        today.setUTCHours(0, 0, 0, 0);


        if (progress) {
            const index = progress.lastWeekXp.findIndex(entry => {
                const entryDate = new Date(entry.day);
                entryDate.setUTCHours(0, 0, 0, 0);
                return entryDate.getTime() === today.getTime();
            } );

            if (index === -1) {
                // if (progress.lastWeekXp.length >= 7) {
                //     progress.lastWeekXp.shift();
                // }
                progress.lastWeekXp.push({ day: today, xp: 0 });
                progress.lastWeekXp.sort((a, b) =>
                    b.day.getTime() - a.day.getTime()
                );

                if (progress.lastWeekXp.length >= 7) {
                    progress.lastWeekXp = progress.lastWeekXp.slice(0, 7)
                }
                await progress.save();
            }
        } else {
            const user = await User.findById(userid);

            progress = new AcademyProgress({
                userName: user?.name,
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




export const getAcademyLeaderboard = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const totalUsers = await AcademyProgress.countDocuments();

        if (!userId || totalUsers < 50) {
            const all = await AcademyProgress.find().limit(50).sort({ totalXp: -1 });

            const leaderboard = all.map((p, i) => ({
                userId: p.userId,
                totalXp: p.totalXp,
                rank: i + 1,
                isCurrentUser: p.userId.toString() === userId
            }));

            return res.json({ data: all });
        }

        console.log('user id gotcha')

        const userProgress = await AcademyProgress.findOne({ userId });

        const currentXp = userProgress?.totalXp | 0;

        const currentRank = await AcademyProgress.countDocuments({
            totalXp: { $gt: currentXp }
        }) + 1;


        const topUsers = await AcademyProgress.find()
            .sort({ totalXp: -1 })
            .limit(5);

        const aroundLimit = 2;

        const usersAroundMe = await AcademyProgress.aggregate([
            {
                $setWindowFields: {
                    sortBy: { totalXp: -1 },
                    output: {
                        rank: { $rank: {} }
                    }
                }
            },
            {
                $match: {
                    rank: { $gte: currentRank - aroundLimit, $lte: currentRank + aroundLimit }
                }
            }
        ]);

        const topList = topUsers.map((user, index) => ({
            userId: user.userId,
            totalXp: user.totalXp,
            rank: index + 1,
            isCurrentUser: user.userId.toString() === userId
        }));

        const aroundList = usersAroundMe.map(user => ({
            userId: user.userId,
            totalXp: user.totalXp,
            rank: user.rank,
            isCurrentUser: user.userId.toString() === userId
        }));


        const leaderboard = [...topList, ...aroundList];


        return res.status(200).json({ data: leaderboard });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch leaderboard", error: error.message });
    }
}








// leaderboard

