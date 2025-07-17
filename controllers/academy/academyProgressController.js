import mongoose from "mongoose";
import { AcademyProgress } from "../../models/AcademyModel.js";
import { User } from "../../models/UserModel.js"

export const getAcademyProgress = async (req, res) => {
    try {
        const userId = req.query.userId ?? req.user.userId;
        console.log(userId);

        if (!userId) {
            return res.status(401).json({ message: "Invalid User", error: error.message });
        }

        let progress;

        if (mongoose.Types.ObjectId.isValid(userId)) {
            progress = await AcademyProgress.findOne({ userId: new mongoose.Types.ObjectId(userId) });
        } else {
            progress = await AcademyProgress.findOne({ userName: userId });
        }

        console.log('---------------------------');
        console.log(progress);

        const now = new Date();
        const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        today.setUTCHours(0, 0, 0, 0);


        if (progress) {
            const index = progress.lastWeekXp.findIndex(entry => {
                const entryDate = new Date(entry.day);
                entryDate.setUTCHours(0, 0, 0, 0);
                return entryDate.getTime() === today.getTime();
            });

            if (index === -1) {
                // if (progress.lastWeekXp.length >= 7) {
                //     progress.lastWeekXp.shift();
                // }
                progress.lastWeekXp.push({ day: today, xp: 0 });
                progress.lastWeekXp.sort((a, b) =>
                    b.day.getTime() - a.day.getTime()
                );

                if (progress.lastWeekXp.length > 7) {
                    progress.lastWeekXp = progress.lastWeekXp.slice(0, 7)
                }
                await progress.save();
            }
        } else {
            const user = await User.findById(userId);

            progress = new AcademyProgress({
                userName: user?.name,
                userId,
                lastWeekXp: [{ day: today, xp: 0 }],
                streak: 0,
                lastStreakDay: today,
            });
            // await progress.save();
        }

        return res.status(200).json( progress );
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch progress", error: error.message });
    }
}




export const getAcademyLeaderboard = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const totalUsers = await AcademyProgress.countDocuments();

        if (!userId || totalUsers <= 50) {

            const leaderboard = await _loadLeaderboard(userId)

            return res.json({ data: leaderboard });
        }

        // console.log('user id gotcha ,', userId)
        const objectUserId = new mongoose.Types.ObjectId(userId);

        const userRankResult = await AcademyProgress.aggregate([
            {
                $setWindowFields: {
                    sortBy: { totalXp: -1 },
                    output: { rank: { $documentNumber: {} } }
                }
            },
            { $match: { userId: objectUserId } },
            { $limit: 1 }
        ]);

        if (userRankResult.length === 0) {
            const leaderboard = await _loadLeaderboard(userId)

            return res.json({ data: leaderboard });
        }

        const userRank = userRankResult[0].rank;

        const aroundUsers = await AcademyProgress.aggregate([
            {
                $setWindowFields: {
                    sortBy: { totalXp: -1 },
                    output: { rank: { $documentNumber: {} } }
                }
            },
            {
                $match: {
                    rank: { $gte: userRank - 10, $lte: userRank + 20 }
                }
            },
            {
                $sort: { rank: 1 }
            },
            {$limit: 40}
        ]);

        const leaderboard = aroundUsers.map(user => ({
            userId: user.userId,
            username: user.userName,
            totalXp: user.totalXp,
            rank: user.rank,
            avatar: user.userImageSrc,
            isCurrentUser: user.userId.toString() === userId.toString()
        }));


        return res.status(200).json({ data: leaderboard });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch leaderboard", error: error.message });
    }
}




const _loadLeaderboard = async (userId) =>{
    const all = await AcademyProgress.find().limit(50).sort({ totalXp: -1 });

    const leaderboard = all.map((p, i) => ({
        userId: p.userId,
        username: p.userName,
        totalXp: p.totalXp,
        rank: i + 1,
        avatar: p.userImageSrc,
        isCurrentUser: p.userId.toString() === userId
    }));

    return leaderboard
}



// leaderboard

