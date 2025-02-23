import { Challenge, ChallengeProgress, Course, UserProgress } from "../models/CourseModel.js";
import { _getUserProgress } from "../services/userProgress.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/customError.js";


export const upsertChallengeProgress = async (req, res) => {

    const challengeId = req.body.challengeId;
    if(!challengeId) {
        throw new NotFoundError('challenge id not found')
    }

    const userProgress = await _getUserProgress(req.user.userId);


    const challenge = await Challenge.findById(challengeId);


    if(!challenge) {
        throw new NotFoundError('challenge not found');
    }

    const lessonId = challenge.lessonId;

    let existingChallengeProgress = await ChallengeProgress.findOne({
        userId: req.user.userId,
        challengeId: challengeId
    });


    const isPractice = !!existingChallengeProgress;

    if(userProgress.hearts === 0 && !isPractice) {
        return res.status(400).json({msg: 'no hearts'});
    }


    // if(isPractice) {
    //     await ChallengeProgress.updateOne(
    //         {userId: req.user.userId, challengeId: challengeId},
    //         {$set: {completed: true}}
    //     );
    // }else{
    // create new
    //
    // }

    await ChallengeProgress.updateOne(
        {userId: req.user.userId, challengeId: challengeId},
        {$set: {completed: true}},
        {upsert: true}
    );



    await UserProgress.updateOne({userId: req.user.userId}, {
        $set: {
            points: userProgress.points + 10,
            hearts: Math.min(userProgress.hearts + 1, 5)
        }
    });


    res.status(200).json({msg: 'challenge progress updated'});
};

export const reduceHearts = async (req, res) =>{
    const challengeId = req.body.challengeId;
    
    if(!challengeId) {
        throw new NotFoundError('challenge id not found')
    }

    const userProgress = await _getUserProgress(req.user.userId);
    if(!userProgress) {
        throw new NotFoundError('user progress not found')
    }

    const challenge = await Challenge.findById(challengeId);

    if(!challenge) {
        throw new NotFoundError('challenge not found');
    }

    const lessonId = challenge.lessonId;

    let existingChallengeProgress = await ChallengeProgress.findOne({
        userId: req.user.userId,
        challengeId: challengeId
    });

    // if (userSubscription?.isActive) {
    //     return { error: "subscription" };
    // }

    const isPractice = !!existingChallengeProgress;

    if(userProgress.hearts === 0) {
        return res.status(400).json({msg: 'no hearts'});
    }

    await UserProgress.updateOne({userId: req.user.userId}, {
        $set: {
            hearts: Math.max(userProgress.hearts - 1, 0)
        }
    });

    res.status(200).json({msg: 'user progress updated'});
}