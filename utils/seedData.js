import {
    Challenge,
    ChallengeOption,
    ChallengeProgress,
    Course,
    Lesson,
    Module,
    Unit,
    UserProgress
} from "../models/CourseModel.js";

export const MODULES2 = [
    {
        title: 'ielts',
        courses: [
            {
                title: 'listening',
                units: [
                    {
                        title: 'cambridge 1',
                        order: 1,
                        lesson: [
                            {
                                title: 'test 1',
                                challenge: [
                                    {
                                        question: 'What is the missing word in the note completion exercise? "The conference will take place in the ____ hall."',
                                        options: [
                                            {
                                                text: 'Main',
                                                correct: true
                                            },
                                            {
                                                text: 'Large',
                                                correct: false
                                            },
                                            {
                                                text: 'Small',
                                                correct: false
                                            }
                                        ]
                                    },
                                    {
                                        question: 'What time does the train to London depart?',
                                        options: [
                                            {
                                                text: '10:30 AM',
                                                correct: true
                                            },
                                            {
                                                text: '11:00 AM',
                                                correct: false
                                            },
                                            {
                                                text: '9:45 AM',
                                                correct: false
                                            }
                                        ]
                                    },
                                    {
                                        question: 'What is the speaker’s main point in the lecture about renewable energy?',
                                        options: [
                                            {
                                                text: 'Solar energy is the most sustainable',
                                                correct: false
                                            },
                                            {
                                                text: 'A mix of energy sources is necessary',
                                                correct: true
                                            },
                                            {
                                                text: 'Fossil fuels should be completely abandoned',
                                                correct: false
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                title: 'reading',
                units: [
                    {
                        title: 'cambridge 1',
                        order: 1,
                        lesson: [
                            {
                                title: 'test 1',
                                challenge: [
                                    {
                                        question: 'According to the passage, what is a key reason for deforestation?',
                                        options: [
                                            {
                                                text: 'Urbanization',
                                                correct: true
                                            },
                                            {
                                                text: 'Climate change',
                                                correct: false
                                            },
                                            {
                                                text: 'Agriculture',
                                                correct: false
                                            }
                                        ]
                                    },
                                    {
                                        question: 'What does the author suggest as a solution to climate change?',
                                        options: [
                                            {
                                                text: 'Planting more trees',
                                                correct: true
                                            },
                                            {
                                                text: 'Building more roads',
                                                correct: false
                                            },
                                            {
                                                text: 'Expanding agriculture',
                                                correct: false
                                            }
                                        ]
                                    },
                                    {
                                        question: 'Which factor contributes most to language acquisition according to the text?',
                                        options: [
                                            {
                                                text: 'Immersion',
                                                correct: true
                                            },
                                            {
                                                text: 'Memorization',
                                                correct: false
                                            },
                                            {
                                                text: 'Reading books',
                                                correct: false
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                title: 'vocabulary',
                units: [
                    {
                        title: 'test 1',
                        order: 1,
                        lesson: [
                            {
                                title: 'word meaning',
                                challenge: [
                                    {
                                        question: 'What is the meaning of the word "Abundant"?',
                                        options: [
                                            {
                                                text: 'Limited',
                                                correct: false
                                            },
                                            {
                                                text: 'Plentiful',
                                                correct: true
                                            },
                                            {
                                                text: 'Rare',
                                                correct: false
                                            }
                                        ]
                                    },
                                    {
                                        question: 'What is the opposite of "Benevolent"?',
                                        options: [
                                            {
                                                text: 'Malevolent',
                                                correct: true
                                            },
                                            {
                                                text: 'Generous',
                                                correct: false
                                            },
                                            {
                                                text: 'Kind',
                                                correct: false
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        title: 'test 2',
                        order: 1,
                        lesson: [
                            {
                                title: 'synonyms and antonyms',
                                challenge: [
                                    {
                                        question: 'Choose the synonym for "Eloquent":',
                                        options: [
                                            {
                                                text: 'Inarticulate',
                                                correct: false
                                            },
                                            {
                                                text: 'Fluent',
                                                correct: true
                                            },
                                            {
                                                text: 'Shy',
                                                correct: false
                                            }
                                        ]
                                    },
                                    {
                                        question: 'What is the antonym of "Vast"?',
                                        options: [
                                            {
                                                text: 'Small',
                                                correct: true
                                            },
                                            {
                                                text: 'Expansive',
                                                correct: false
                                            },
                                            {
                                                text: 'Great',
                                                correct: false
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        title: 'test 3',
                        order: 1,
                        lesson: [
                            {
                                title: 'word usage',
                                challenge: [
                                    {
                                        question: 'Choose the sentence where the word "Comprehend" is used correctly.',
                                        options: [
                                            {
                                                text: 'I could comprehend the complexity of the problem.',
                                                correct: true
                                            },
                                            {
                                                text: 'She didn’t comprehend to arrive early.',
                                                correct: false
                                            },
                                            {
                                                text: 'He comprehended me walking away.',
                                                correct: false
                                            }
                                        ]
                                    },
                                    {
                                        question: 'Choose the sentence where the word "Apathy" is used correctly.',
                                        options: [
                                            {
                                                text: 'Her apathy towards the environment was obvious.',
                                                correct: true
                                            },
                                            {
                                                text: 'Apathy is the main goal of the study.',
                                                correct: false
                                            },
                                            {
                                                text: 'I have apathy for my project.',
                                                correct: false
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        title: 'gre verbal',
        courses: [
            {
                title: 'reading',
                units: [
                    {
                        title: 'reading comprehension',
                        order: 1,
                        lesson: [
                            {
                                title: 'test 1',
                                challenge: [
                                    {
                                        question: 'What is the primary theme of the passage?',
                                        options: [
                                            {text: 'Environmental change', correct: true},
                                            {text: 'Technological advancements', correct: false},
                                            {text: 'Political debates', correct: false}
                                        ]
                                    },
                                    {
                                        question: 'According to the passage, which of the following is true about renewable energy?',
                                        options: [
                                            {text: 'It is completely dependent on government funding', correct: false},
                                            {text: 'It can reduce dependency on fossil fuels', correct: true},
                                            {text: 'It is not effective in reducing emissions', correct: false}
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                title: 'sentence equivalence',
                units: [
                    {
                        title: 'test 1',
                        order: 1,
                        lesson: [
                            {
                                title: 'test',
                                challenge: [
                                    {
                                        question: 'Choose the two words that best complete the sentence: "The professor’s explanation was so _______ that everyone understood the complex concept immediately."',
                                        options: [
                                            {text: 'Clear, confusing', correct: false},
                                            {text: 'Lucid, clear', correct: true},
                                            {text: 'Complicated, difficult', correct: false}
                                        ]
                                    },
                                    {
                                        question: 'Choose the two words that best complete the sentence: "The politician’s _______ statements were not appreciated by his colleagues."',
                                        options: [
                                            {text: 'Evasive, equivocal', correct: true},
                                            {text: 'Direct, clear', correct: false},
                                            {text: 'Honest, transparent', correct: false}
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                title: 'text completion',
                units: [
                    {
                        title: 'test 1',
                        order: 1,
                        lesson: [
                            {
                                title: 'test',
                                challenge: [
                                    {
                                        question: 'Complete the sentence: "His behavior was so _______ that it shocked the audience."',
                                        options: [
                                            {text: 'Outrageous', correct: true},
                                            {text: 'Ordinary', correct: false},
                                            {text: 'Common', correct: false}
                                        ]
                                    },
                                    {
                                        question: 'Complete the sentence: "The CEO’s decision was _______ by the board members."',
                                        options: [
                                            {text: 'Condemned', correct: false},
                                            {text: 'Supported', correct: true},
                                            {text: 'Ignored', correct: false}
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                title: 'mock test',
                units: [
                    {
                        title: 'GRE Verbal',
                        lesson: [
                            {
                                title: 'full test',
                                challenge: [
                                    {
                                        question: 'What is the author’s perspective on climate change in the passage?',
                                        options: [
                                            {text: 'Climate change is exaggerated', correct: false},
                                            {text: 'Climate change is an urgent problem', correct: true},
                                            {text: 'Climate change does not affect us', correct: false}
                                        ]
                                    },
                                    {
                                        question: 'Which of the following is the most likely synonym for the word "prolific"?',
                                        options: [
                                            {text: 'Creative', correct: true},
                                            {text: 'Barren', correct: false},
                                            {text: 'Evasive', correct: false}
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                title: 'vocabulary',
                units: [
                    {
                        title: 'test 1',
                        lesson: [
                            {
                                title: 'word meaning',
                                challenge: [
                                    {
                                        question: 'What is the meaning of the word "Ephemeral"?',
                                        options: [
                                            {text: 'Long-lasting', correct: false},
                                            {text: 'Temporary', correct: true},
                                            {text: 'Predictable', correct: false}
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        title: 'GRE Quantitative',
        courses: [
            {
                title: 'Arithmetic',
                units: [
                    {
                        title: 'Basic Arithmetic',
                        lesson: [
                            {
                                title: 'Basic Questions',
                                challenge: [
                                    {
                                        question: 'What is the value of 5 × (2 + 3)?',
                                        options: [
                                            {text: '25', correct: false},
                                            {text: '15', correct: true},
                                            {text: '10', correct: false}
                                        ]
                                    },
                                    {
                                        question: 'If a product costs $10 and the price increases by 20%, what is the new price?',
                                        options: [
                                            {text: '$12', correct: true},
                                            {text: '$15', correct: false},
                                            {text: '$11', correct: false}
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        title: 'Percentage & Ratio',
                        lesson: [
                            {
                                title: 'Basic Questions',
                                challenge: [
                                    {
                                        question: 'What is the value of 5 × (2 + 3)?',
                                        options: [
                                            {text: '25', correct: false},
                                            {text: '15', correct: true},
                                            {text: '10', correct: false}
                                        ]
                                    },
                                    {
                                        question: 'If a product costs $10 and the price increases by 20%, what is the new price?',
                                        options: [
                                            {text: '$12', correct: true},
                                            {text: '$15', correct: false},
                                            {text: '$11', correct: false}
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                title: 'Algebra',
                units: [
                    {
                        title: 'Introductory Algebra',
                        lesson: [
                            {
                                title: 'Basic Algebra Questions',
                                challenge: [
                                    {
                                        question: 'Solve for x: 2x + 3 = 11',
                                        options: [
                                            { text: 'x = 5', correct: false },
                                            { text: 'x = 4', correct: true },
                                            { text: 'x = 3', correct: false }
                                        ]
                                    },
                                    {
                                        question: 'What is the value of x in the equation: 5x - 3 = 2x + 9?',
                                        options: [
                                            { text: 'x = 4', correct: false },
                                            { text: 'x = 6', correct: true },
                                            { text: 'x = 2', correct: false }
                                        ]
                                    }
                                ]
                            },
                            {
                                title: 'Advanced Algebra Problems',
                                challenge: [
                                    {
                                        question: 'Solve for x: 3x + 5 = 2x + 15',
                                        options: [
                                            { text: 'x = 5', correct: true },
                                            { text: 'x = 4', correct: false },
                                            { text: 'x = 3', correct: false }
                                        ]
                                    },
                                    {
                                        question: 'What is the value of x in the equation: 7x - 5 = 3x + 15?',
                                        options: [
                                            { text: 'x = 5', correct: false },
                                            { text: 'x = 10', correct: true },
                                            { text: 'x = 2', correct: false }
                                        ]
                                    }
                                ]
                            },
                            {
                                title: 'Linear Equations Review',
                                challenge: [
                                    {
                                        question: 'What is the value of x in the equation: 4x - 7 = 9?',
                                        options: [
                                            { text: 'x = 4', correct: true },
                                            { text: 'x = 3', correct: false },
                                            { text: 'x = 5', correct: false }
                                        ]
                                    },
                                    {
                                        question: 'Solve for x: 8x + 4 = 12x + 20',
                                        options: [
                                            { text: 'x = -4', correct: true },
                                            { text: 'x = 2', correct: false },
                                            { text: 'x = 1', correct: false }
                                        ]
                                    }
                                ]
                            },
                            {
                                title: 'Basic Algebra Questions',
                                challenge: [
                                    {
                                        question: 'Solve for x: 2x + 3 = 11',
                                        options: [
                                            { text: 'x = 5', correct: false },
                                            { text: 'x = 4', correct: true },
                                            { text: 'x = 3', correct: false }
                                        ]
                                    },
                                    {
                                        question: 'What is the value of x in the equation: 5x - 3 = 2x + 9?',
                                        options: [
                                            { text: 'x = 4', correct: false },
                                            { text: 'x = 6', correct: true },
                                            { text: 'x = 2', correct: false }
                                        ]
                                    }
                                ]
                            },
                            {
                                title: 'Advanced Algebra Problems',
                                challenge: [
                                    {
                                        question: 'Solve for x: 3x + 5 = 2x + 15',
                                        options: [
                                            { text: 'x = 5', correct: true },
                                            { text: 'x = 4', correct: false },
                                            { text: 'x = 3', correct: false }
                                        ]
                                    },
                                    {
                                        question: 'What is the value of x in the equation: 7x - 5 = 3x + 15?',
                                        options: [
                                            { text: 'x = 5', correct: false },
                                            { text: 'x = 10', correct: true },
                                            { text: 'x = 2', correct: false }
                                        ]
                                    }
                                ]
                            },
                            {
                                title: 'Linear Equations Review',
                                challenge: [
                                    {
                                        question: 'What is the value of x in the equation: 4x - 7 = 9?',
                                        options: [
                                            { text: 'x = 4', correct: true },
                                            { text: 'x = 3', correct: false },
                                            { text: 'x = 5', correct: false }
                                        ]
                                    },
                                    {
                                        question: 'Solve for x: 8x + 4 = 12x + 20',
                                        options: [
                                            { text: 'x = -4', correct: true },
                                            { text: 'x = 2', correct: false },
                                            { text: 'x = 1', correct: false }
                                        ]
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        title: 'Intermediate Algebra',
                        lesson: [
                            {
                                title: 'Algebraic Expressions & Equations',
                                challenge: [
                                    {
                                        question: 'Solve for x: 3x - 7 = 2x + 4',
                                        options: [
                                            {text: 'x = 11', correct: true},
                                            {text: 'x = 1', correct: false},
                                            {text: 'x = 7', correct: false}
                                        ]
                                    },
                                    {
                                        question: 'Simplify: 2(3x + 4) - 5x',
                                        options: [
                                            {text: 'x + 8', correct: true},
                                            {text: '3x + 4', correct: false},
                                            {text: '2x + 4', correct: false}
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                title: 'Geometry',
                units: [
                    {
                        title: 'Basic Geometry',
                        lesson: [
                            {
                                title: 'Area and Volume Questions',
                                challenge: [
                                    {
                                        question: 'What is the area of a circle with a radius of 5?',
                                        options: [
                                            {text: '25π', correct: true},
                                            {text: '10π', correct: false},
                                            {text: '20π', correct: false}
                                        ]
                                    },
                                    {
                                        question: 'What is the volume of a rectangular prism with length 2, width 3, and height 4?',
                                        options: [
                                            {text: '24', correct: true},
                                            {text: '12', correct: false},
                                            {text: '18', correct: false}
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        title: 'Coordinate Geometry',
                        lesson: [
                            {
                                title: 'Coordinate Plane & Equations',
                                challenge: [
                                    {
                                        question: 'What is the distance between points (1, 2) and (4, 6)?',
                                        options: [
                                            {text: '5', correct: true},
                                            {text: '4', correct: false},
                                            {text: '6', correct: false}
                                        ]
                                    },
                                    {
                                        question: 'Find the slope of the line passing through points (1, 2) and (3, 4).',
                                        options: [
                                            {text: '1', correct: true},
                                            {text: '2', correct: false},
                                            {text: '0', correct: false}
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                title: 'Full-Length Mock',
                units: [
                    {
                        title: 'Quantitative Reasoning Practice',
                        lesson: [
                            {
                                title: 'Practice Test 1',
                                challenge: [
                                    {
                                        question: 'What is the solution to the equation: 3x + 5 = 20?',
                                        options: [
                                            {text: 'x = 5', correct: false},
                                            {text: 'x = 3', correct: true},
                                            {text: 'x = 4', correct: false}
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }

];

export const MODULES = [{
    title: 'language',
    courses: [
        {
            title: 'Spanish',
            altCode: 'es',
            units:[
                {
                    title: 'Unit 1',
                    description: 'Basics of Spanish.',
                    order: 1,
                    lesson:[
                        {
                            order: 1,
                            title: 'Nouns',
                            challenges:[
                                {
                                    type: 'SELECT',
                                    order: 1,
                                    question: 'Which one of these is "the man"?',
                                    options:[
                                        {
                                            option: 'el hombre',
                                            correct: true,
                                            imageSrc: '/man.svg',
                                            audioSrc: '/es_man.mp3',
                                        },
                                        {
                                            option: 'la mujer',
                                            correct: false,
                                            imageSrc: '/woman.svg',
                                            audioSrc: '/es_woman.mp3',
                                        },
                                        {
                                            option: 'el robot',
                                            correct: false,
                                            imageSrc: '/robot.svg',
                                            audioSrc: '/es_robot.mp3',
                                        }
                                    ]
                                },
                                {
                                    type: 'ASSIST',
                                    order: 2,
                                    question: '"the man"',
                                    options:[
                                        {
                                            option: 'el hombre',
                                            correct: true,
                                            imageSrc: '/man.svg',
                                            audioSrc: '/es_man.mp3',
                                        },
                                        {
                                            option: 'la mujer',
                                            correct: false,
                                            imageSrc: '/woman.svg',
                                            audioSrc: '/es_woman.mp3',
                                        },
                                        {
                                            option: 'el robot',
                                            correct: false,
                                            imageSrc: '/robot.svg',
                                            audioSrc: '/es_robot.mp3',
                                        }
                                    ]
                                },
                                {
                                    type: 'SELECT',
                                    order: 3,
                                    question: 'Which one of these is "the robot"?',
                                    options:[
                                        {
                                            option: 'el hombre',
                                            correct: false,
                                            imageSrc: '/man.svg',
                                            audioSrc: '/es_man.mp3',
                                        },
                                        {
                                            option: 'la mujer',
                                            correct: false,
                                            imageSrc: '/woman.svg',
                                            audioSrc: '/es_woman.mp3',
                                        },
                                        {
                                            option: 'el robot',
                                            correct: true,
                                            imageSrc: '/robot.svg',
                                            audioSrc: '/es_robot.mp3',
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            order: 2,
                            title: 'Pronouns',
                            challenges: [
                                {
                                    type: 'SELECT',
                                    order: 1,
                                    question: 'l2 - Which one of these is "the man"?',
                                    options:[
                                        {
                                            option: 'el hombre',
                                            correct: true,
                                            imageSrc: '/man.svg',
                                            audioSrc: '/es_man.mp3',
                                        },
                                        {
                                            option: 'la mujer',
                                            correct: false,
                                            imageSrc: '/woman.svg',
                                            audioSrc: '/es_woman.mp3',
                                        },
                                        {
                                            option: 'el robot',
                                            correct: false,
                                            imageSrc: '/robot.svg',
                                            audioSrc: '/es_robot.mp3',
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            order: 3,
                            title: 'Verbs',
                        },
                        {
                            order: 4,
                            title: 'Adjectives',
                        },
                        {
                            order: 5,
                            title: 'Grammar',
                        },

                        {
                            order: 6,
                            title: 'Verbs',
                        },
                        {
                            order: 7,
                            title: 'Adjectives',
                        },
                        {
                            order: 8,
                            title: 'Grammar',
                        }
                    ]
                }
            ]
        },
        {
            title: 'Italian',
            altCode: 'it',
        },
        {
            title: 'French',
            altCode: 'fr',
        },
        {
            title: 'German',
            altCode: 'de',
        },
    ]

}];


export const seedData = async (req, res) => {
    console.log('start seeding database...');

    try {

        try {
            await Module.collection.drop();
            await Course.collection.drop();
            await UserProgress.collection.drop();
            await ChallengeProgress.collection.drop();
            await Unit.collection.drop();
            await Lesson.collection.drop();
            await Challenge.collection.drop();
            await ChallengeOption.collection.drop();

            console.log('collection dropped');
        } catch(err) {
            console.error('Failed to drop collection');
            return res.status(400).json({msg: 'Failed to drop collection'})
        }


        for(const module of MODULES) {

            const _module = await Module.create({
                title: module.title
            });

            for(const course of module.courses) {
                const _course = await Course.create({
                    title: course.title,
                    moduleId: _module._id
                });


                if(!course.units)continue;
                for(const unit of course.units) {
                    const _unit = await Unit.create({
                        title: unit.title,
                        courseId: _course._id,
                        order: 1
                    });

                    for(const lesson of unit.lesson) {
                        const _lesson = await Lesson.create({
                            title: lesson.title,
                            unitId: _unit._id,
                            order: lesson.order
                        });

                        if(!lesson.challenges) continue;
                        for(const challenge of lesson.challenges) {

                            const _challenge = await Challenge.create({
                                lessonId: _lesson._id,
                                type: challenge.type,
                                question: challenge.question,
                                order: challenge.order
                            });

                            // console.log(challenge);
                            // return res.status(200).json({msg: 'done seeding database!!!'});

                            for(const option of challenge.options) {
                                await ChallengeOption.create({
                                    challengeId: _challenge._id,
                                    text: option.option,
                                    correct: option.correct,
                                    imageSrc:option.imageSrc,
                                    audioSrc:option.audioSrc
                                });
                            }
                        }

                    }

                }

            }

        }

    } catch(err) {
        console.error(err);
        return res.status(400).json({msg: 'Failed to seed data'});
    }

    console.log('finish seeding database!!!');
    res.status(200).json({msg: 'finish seeding database!!!'});
}








