export default class Start extends Phaser.Scene
{
    constructor ()
    {
        super('Start');
    }

    preload () {}

    create ()
    {
        this.cameras.main.setBackgroundColor('#7fcf7a');

        this.gameData = {
    gameId: null,
    condition: "sufficiency",
    gameVersion: "sufficiency_redist_english_v1",

    gameStartTime: new Date().toISOString(),
    gameEndTime: null,
    totalDurationMs: null,

    userAgent: navigator.userAgent,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    isMobile: this.isMobileDevice(),
    screenOrientation: window.innerHeight > window.innerWidth ? "portrait" : "landscape",

    survivalCheck: null,
    totalFoodEstimate: null,
    perCapitaEstimate: null,

partialRedistributionFinal: {
    personA: 0,
    personB: 0,
    personC: 0
},

partialRedistributionSurvivors: null,
redistributionRulesSelected: {
    noRedistribution: false,
    equalRedistribution: false,
    partialRedistribution: false
},
survivalRedistributionSelected: {
    noRedistribution: false,
    equalRedistribution: false,
    partialRedistribution: false
},
personalRedistributionSelected: {
    noRedistribution: false,
    equalRedistribution: false,
    partialRedistribution: false
},
    groupDistributionPreference: null,
    partialRedistributionPreference: null,
    distributivePrinciplePriority: null,
    socialContractGuarantee: null,
    screenTimings: {},

    treeClicks: {
        personA: 0,
        personB: 0,
        personC: 0
    },

    treeFruitCollected: {
        personA: 0,
        personB: 0,
        personC: 0
    },

    equalDivisionFinal: {
        personA: 0,
        personB: 0,
        personC: 0
    },

    saveStatus: null
};

        this.questionObjects = [];
        this.gameObjects = [];
        this.instructionIndex = 0;
        this.answerButtons = [];
        this.foodCounts = {};

        this.instructionScreens = [
            'Welcome to the survival game. In this game, a group of three people find themselves lost in an otherwise uninhabited location.',
            'The people have been hunting and gathering food in order to survive. \n \nIf a person does not eat at least 5 pieces of food a day, he will die. \n \nIf a person collects more than 5 pieces of food a day, he can save the remainder for himself the next day.',
            'The location is rich in natural resources, and the group can always collect enough food for everyone to survive.',
            'Person A always collects the most pieces of food per day. \n \nPerson B always collects the median pieces of food per day. \n \nPerson C always collects the least pieces of food per day.',
            'Today, Person A collected 6 pieces of food, Person B collected 5 pieces of food, and Person C collected 4 pieces of food.',
            'Your job is to make decisions on behalf of the group that maximize the survival of the most members of the group. \n \nThe more members of the group you keep alive until the end of the game, the better you will do in the game.'
        ];

        if (this.isMobileDevice()) {
    this.showRotatePhoneScreen(() => {
        this.showInstructionScreen();
    });
} else {
    this.showInstructionScreen();
}
    }

getFixedFoodCounts ()
{
    return {
        personA: 6,
        personB: 5,
        personC: 4,
        total: 15
    };
}

isMobileDevice ()
{
    return window.innerWidth < 900 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
}

isPortraitMode ()
{
    return window.innerHeight > window.innerWidth;
}

showRotatePhoneScreen (nextFunction)
{
    this.clearQuestionScreen();
    this.clearGameObjects();

    this.addQuestionObject(this.add.rectangle(640, 360, 1080, 430, 0xffffff))
        .setStrokeStyle(4, 0x000000);

    this.addQuestionObject(this.add.text(
        640,
        310,
        'If you are using a cell phone, please rotate your phone sideways to continue.',
        {
            fontSize: '34px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 900 }
        }
    ).setOrigin(0.5));

    this.createNextButton(640, 520, 'Continue', () => {
        nextFunction.call(this);
    });
}
    showInstructionScreen ()
    {
        this.cameras.main.setBackgroundColor('#ffffff');
        this.clearQuestionScreen();

        this.addQuestionObject(this.add.rectangle(640, 360, 1000, 500, 0xffffff))
            .setStrokeStyle(4, 0x000000);

        this.addQuestionObject(this.add.text(260, 145, 'Instructions', {
            fontSize: '36px',
            color: '#000000'
        }));

        const instructionStyle = {
    fontSize: '27px',
    color: '#000000',
    wordWrap: { width: 760 },
    lineSpacing: 8
};

if (this.instructionIndex === 2)
{
    instructionStyle.fontStyle = 'bold';
}

this.addQuestionObject(
    this.add.text(
        260,
        275,
        this.instructionScreens[this.instructionIndex],
        instructionStyle
    )
);

        this.createNextButton(640, 675, 'Next', () => {
            this.instructionIndex += 1;

            if (this.instructionIndex < this.instructionScreens.length)
            {
                this.showInstructionScreen();
            }
            else
            {
                this.showSurvivalCheckQuestion();
            }
        });
    }

    showSurvivalCheckQuestion ()
    {
        this.clearQuestionScreen();

        this.addQuestionObject(this.add.rectangle(640, 360, 900, 450, 0xffffff))
            .setStrokeStyle(4, 0x000000);

        this.addQuestionObject(this.add.text(250, 175,
            'How many pieces of food does each person need to survive the day?',
            {
                fontSize: '30px',
                color: '#000000',
                align: 'center',
                wordWrap: { width: 780 }
            }
        ));

        this.createSurvivalCheckButton(640, 340, '3 pieces', false);
        this.createSurvivalCheckButton(640, 420, '5 pieces', true);
        this.createSurvivalCheckButton(640, 500, '7 pieces', false);
    }

    createSurvivalCheckButton (centerX, centerY, label, isCorrect)
    {
        const paddingX = 24;
        const paddingY = 14;

        const text = this.add.text(centerX, centerY, label, {
            fontSize: '24px',
            color: '#000000'
        }).setOrigin(0.5);

        const button = this.add.rectangle(centerX, centerY, text.width + paddingX * 2, text.height + paddingY * 2, 0xdddddd);
        button.setStrokeStyle(2, 0x000000);
        button.setInteractive(
    new Phaser.Geom.Rectangle(
        -(button.width + 40) / 2,
        -(button.height + 30) / 2,
        button.width + 40,
        button.height + 30
    ),
    Phaser.Geom.Rectangle.Contains
);

        button.setDepth(1);
        text.setDepth(2);

        this.addQuestionObject(button);
        this.addQuestionObject(text);

        button.on('pointerdown', () => {
            this.gameData.survivalCheck = label;

            if (isCorrect)
            {
                this.showSurvivalCheckFeedback('Correct.');
            }
            else
            {
                this.showSurvivalCheckFeedback('No, each person needs 5 pieces of food a day to survive.');
            }
        });
    }

    showSurvivalCheckFeedback (message)
    {
        this.clearQuestionScreen();

        this.addQuestionObject(this.add.rectangle(640, 360, 900, 320, 0xffffff))
            .setStrokeStyle(4, 0x000000);

        this.addQuestionObject(this.add.text(250, 290, message, {
            fontSize: '30px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 780 }
        }));

        this.createNextButton(640, 520, 'Start Game', () => {
            this.startFoodCollectionTask();
        });
    }

    startFoodCollectionTask ()
{
    this.clearQuestionScreen();
    this.clearGameObjects();

    this.foodCounts = {
        'Person A': 0,
        'Person B': 0,
        'Person C': 0
    };

    // Sky
    this.addGameObject(this.add.rectangle(640, 120, 1280, 240, 0xbfefff));

    // Distant hills
    this.addGameObject(this.add.ellipse(250, 285, 650, 220, 0x6fbd6f));
    this.addGameObject(this.add.ellipse(760, 285, 750, 240, 0x5ead63));
    this.addGameObject(this.add.ellipse(1120, 285, 520, 200, 0x78c878));

    // Grass field
    this.addGameObject(this.add.rectangle(640, 470, 1280, 500, 0x4caf50));

    // Grass details
    for (let i = 0; i < 90; i++)
    {
        const grass = this.add.line(
            Phaser.Math.Between(0, 1280),
            Phaser.Math.Between(395, 690),
            0,
            0,
            Phaser.Math.Between(-6, 6),
            Phaser.Math.Between(-18, -8),
            0x2f7d32
        );

        grass.setLineWidth(2);
        this.addGameObject(grass);
    }

    this.addGameObject(this.add.text(
        40,
        60,
        'Click each person, then click the tree to collect food for that person. Repeat until all three people have collected food. Select Next to continue.',
        {
            fontSize: '26px',
            color: '#000000',
            wordWrap: { width: 900 },
            lineSpacing: 6,
            backgroundColor: '#ffffff',
            padding: { x: 12, y: 8 }
        }
    ));

    this.drawTree();

    this.avatars = [];
    this.selectedAvatar = null;
    this.foodCollectionNextShown = false;
    const baselineY = 360;

    const personA = this.createHumanAvatar(
        170,
        baselineY,
        'Person A',
        1.08,
        0xcc3333,
        0
    );

    const personB = this.createHumanAvatar(
        450,
        baselineY,
        'Person B',
        1.00,
        0x3366cc,
        0
    );

    const personC = this.createHumanAvatar(
        730,
        baselineY,
        'Person C',
        1.00,
        0x339966,
        0
    );

    this.avatars.push(personA, personB, personC);
}

   drawTree ()
{
    this.addGameObject(this.add.rectangle(1085, 390, 50, 145, 0x8b5a2b));

    this.addGameObject(this.add.circle(1085, 245, 95, 0x1f7a2e));
    this.addGameObject(this.add.circle(1015, 300, 76, 0x2f9b3a));
    this.addGameObject(this.add.circle(1155, 300, 76, 0x2f9b3a));
    this.addGameObject(this.add.circle(1085, 350, 82, 0x238a35));
    this.addGameObject(this.add.circle(1045, 235, 60, 0x3cad48));
    this.addGameObject(this.add.circle(1128, 235, 60, 0x3cad48));

    // Lots of fruit on the tree
    const fruitPositions = [
        [-45, -75], [-15, -90], [20, -82], [52, -63],
        [-75, -30], [-35, -35], [0, -45], [38, -35], [78, -20],
        [-88, 22], [-48, 18], [-10, 5], [28, 12], [68, 28],
        [-56, 62], [-18, 55], [22, 62], [58, 70]
    ];

    fruitPositions.forEach(pos => {
        const fruit = this.add.circle(1085 + pos[0], 285 + pos[1], 7, 0xb22222);
        fruit.setStrokeStyle(1, 0x000000);
        this.addGameObject(fruit);
    });

    const treeClickZone = this.add.zone(1085, 305, 340, 380);
    treeClickZone.setInteractive({ useHandCursor: true });

    treeClickZone.on('pointerdown', () => {
        this.collectFoodFromTree();
    });

    this.addGameObject(treeClickZone);
}

    createBasket (x, y, scale)
    {
        const basket = this.add.container(x, y);

        const basketColor = 0xb87932;
        const basketDark = 0x5c3517;
        const basketLight = 0xd89a4a;

        const handle = this.add.arc(0, -11 * scale, 18 * scale, 205, 335, true);
        handle.setStrokeStyle(4 * scale, basketDark);

        const body = this.add.rectangle(0, 8 * scale, 34 * scale, 26 * scale, basketColor);
        body.setStrokeStyle(2 * scale, basketDark);

        const rim = this.add.rectangle(0, -4 * scale, 40 * scale, 8 * scale, basketLight);
        rim.setStrokeStyle(2 * scale, basketDark);

        basket.add([handle, body, rim]);

        return basket;
    }

    createHumanAvatar (x, y, label, scale, shirtColor, startingFood = 0)
    {
        const avatar = this.add.container(x, y);

        const skinColor = 0xb57a4f;
        const hairColor = 0x6b3f1d;
        const pantsColor = 0x333333;

        avatar.add([
            this.add.rectangle(0, -18 * scale, 10 * scale, 14 * scale, skinColor),
            this.add.circle(0, -43 * scale, 24 * scale, skinColor),
            this.add.ellipse(0, -64 * scale, 46 * scale, 18 * scale, hairColor),
            this.add.ellipse(-17 * scale, -55 * scale, 12 * scale, 18 * scale, hairColor),
            this.add.ellipse(17 * scale, -55 * scale, 12 * scale, 18 * scale, hairColor),
            this.add.circle(-8 * scale, -43 * scale, 2.7 * scale, 0x000000),
            this.add.circle(8 * scale, -43 * scale, 2.7 * scale, 0x000000),
            this.add.rectangle(0, -35 * scale, 3 * scale, 9 * scale, 0x9b5c2e),
            this.add.rectangle(0, -27 * scale, 12 * scale, 2 * scale, 0x000000),
            this.add.rectangle(0, 8 * scale, 46 * scale, 64 * scale, shirtColor),
            this.add.rectangle(-32 * scale, 10 * scale, 10 * scale, 52 * scale, skinColor),
            this.add.rectangle(32 * scale, 10 * scale, 10 * scale, 52 * scale, skinColor),
            this.createBasket(39 * scale, 31 * scale, scale),
            this.add.rectangle(-12 * scale, 71 * scale, 14 * scale, 48 * scale, pantsColor),
            this.add.rectangle(12 * scale, 71 * scale, 14 * scale, 48 * scale, pantsColor),
            this.add.text(0, 135 * scale, label, {
                fontSize: '22px',
                color: '#000000'
            }).setOrigin(0.5)
        ]);

        const selectPerson = () => {
            this.selectAvatar(avatar);
        };

        const clickZones = [
            this.add.zone(0, -47 * scale, 70 * scale, 65 * scale),
            this.add.zone(0, 8 * scale, 65 * scale, 78 * scale),
            this.add.zone(-32 * scale, 10 * scale, 32 * scale, 70 * scale),
            this.add.zone(32 * scale, 10 * scale, 32 * scale, 70 * scale),
            this.add.zone(39 * scale, 31 * scale, 60 * scale, 65 * scale),
            this.add.zone(-12 * scale, 75 * scale, 32 * scale, 65 * scale),
            this.add.zone(12 * scale, 75 * scale, 32 * scale, 65 * scale)
        ];

        clickZones.forEach(zone => {
            zone.setInteractive({ useHandCursor: true });
            zone.on('pointerdown', selectPerson);
            avatar.add(zone);
        });

        avatar.personLabel = label;
        avatar.foodCount = 0;

        for (let i = 0; i < startingFood; i++)
        {
            avatar.foodCount += 1;

            const position = avatar.foodCount - 1;

            const appleX = 39 + ((position % 3) - 1) * 15;
            const appleY = 25 + Math.floor(position / 3) * 13;

            avatar.add(this.add.circle(appleX, appleY, 5.5, 0xb22222));
        }

        this.addGameObject(avatar);

        return avatar;
    }
showFoodCollectionNextButtonIfReady ()
{
    const allThreeCollected =
        this.foodCounts['Person A'] > 0 &&
        this.foodCounts['Person B'] > 0 &&
        this.foodCounts['Person C'] > 0;

    if (allThreeCollected && !this.foodCollectionNextShown)
    {
        this.foodCollectionNextShown = true;

        this.createGameNextButton(640, 675, 'Next', () => {
            this.showDistributionDisplay();
        });
    }
}

collectFoodFromTree ()
{
    if (!this.selectedAvatar) return;

    const person = this.selectedAvatar.personLabel;

    if (person === 'Person A')
    {
        this.gameData.treeClicks.personA += 1;

        if (this.foodCounts[person] > 0) return;

        this.foodCounts[person] = 6;
        this.gameData.treeFruitCollected.personA = 6;
        this.addFoodToBasket(this.selectedAvatar, 6);
        this.showFoodCollectionNextButtonIfReady();

        return;
    }

    if (person === 'Person B')
    {
        this.gameData.treeClicks.personB += 1;

        if (this.foodCounts[person] > 0) return;

        this.foodCounts[person] = 5;
        this.gameData.treeFruitCollected.personB = 5;
        this.addFoodToBasket(this.selectedAvatar, 5);
        this.showFoodCollectionNextButtonIfReady();

        return;
    }

    if (person === 'Person C')
    {
        this.gameData.treeClicks.personC += 1;

        if (this.foodCounts[person] > 0) return;

        this.foodCounts[person] = 4;
        this.gameData.treeFruitCollected.personC = 4;
        this.addFoodToBasket(this.selectedAvatar, 4);
        this.showFoodCollectionNextButtonIfReady();
    }
}

addFoodToBasket (avatar, amount)
{
    for (let i = 0; i < amount; i++)
    {
        avatar.foodCount += 1;

        const position = avatar.foodCount - 1;

        const appleX = 39 + ((position % 3) - 1) * 15;
        const appleY = 25 + Math.floor(position / 3) * 13;

        avatar.add(this.add.circle(appleX, appleY, 5.5, 0xb22222));
    }
}

    selectAvatar (avatar)
    {
        this.selectedAvatar = avatar;

        this.avatars.forEach(person => {
            if (person.selectionBox)
            {
                person.selectionBox.destroy();
                person.selectionBox = null;
            }

            person.setDepth(10);
        });

        avatar.setDepth(100);

        avatar.selectionBox = this.add.rectangle(
            avatar.x,
            avatar.y,
            180,
            260,
            0x000000,
            0
        );

        avatar.selectionBox.setStrokeStyle(4, 0x000000);
        avatar.selectionBox.setDepth(99);

        this.addGameObject(avatar.selectionBox);
    }

    update () {}

   showDistributionDisplay ()
{
    this.clearGameObjects();
    this.clearQuestionScreen();
    this.cameras.main.setBackgroundColor('#7fcf7a');

    const fixedFood = this.getFixedFoodCounts();

    const personADisplayFood = fixedFood.personA;
    const personBDisplayFood = fixedFood.personB;
    const personCDisplayFood = fixedFood.personC;

    this.blanketFoodCount = 0;
    this.totalFoodToCount = fixedFood.total;
    this.distributionNextShown = false;

    const baselineY = 170;

    this.addQuestionObject(this.createStaticHumanAvatar(230, baselineY, 'Person A', 1.12, 0xcc3333, 0));
    this.addQuestionObject(this.createStaticHumanAvatar(620, baselineY, 'Person B', 1.00, 0x3366cc, 0));
    this.addQuestionObject(this.createStaticHumanAvatar(1000, baselineY, 'Person C', 0.88, 0x339966, 0));

    this.blanket = this.add.rectangle(640, 425, 420, 115, 0xd8ecff);
    this.blanket.setStrokeStyle(4, 0x335577);
    this.blanket.setDepth(1);
    this.addQuestionObject(this.blanket);

    const blanketLabel = this.add.text(640, 425, 'Blanket', {
        fontSize: '24px',
        color: '#000000'
    }).setOrigin(0.5);

    blanketLabel.setDepth(2);
    this.addQuestionObject(blanketLabel);

    this.blanketCounterText = this.add.text(640, 515, 'Pieces counted: 0', {
        fontSize: '26px',
        color: '#000000'
    }).setOrigin(0.5);

    this.blanketCounterText.setDepth(2);
    this.addQuestionObject(this.blanketCounterText);

    this.createDraggableFoodPieces(230, baselineY, 1.12, personADisplayFood);
    this.createDraggableFoodPieces(620, baselineY, 1.00, personBDisplayFood);
    this.createDraggableFoodPieces(1000, baselineY, 0.88, personCDisplayFood);

    this.addQuestionObject(this.add.text(150, 550,
        'Drag and drop each piece of food into a pile on the blanket to count how many pieces of food that the group has gathered.',
        {
            fontSize: '24px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 980 }
        }
    ));
}

createDraggableFoodPieces (avatarX, avatarY, scale, foodAmount)
{
    const getBlanketFoodPosition = (index) => {

        const positions = [
            [-150, -25], [-115, -25], [-80, -25],
            [-150, 10],  [-115, 10],  [-80, 10],

            [80, -25], [115, -25], [150, -25],
            [80, 10],  [115, 10],  [150, 10],

            [-150, 45], [-115, 45], [-80, 45],
            [80, 45], [115, 45], [150, 45]
        ];

        return positions[index];
    };

    for (let i = 0; i < foodAmount; i++)
    {
        const position = i;

        const startX =
            avatarX +
            (39 + ((position % 3) - 1) * 15)
            * scale;

        const startY =
            avatarY +
            (25 + Math.floor(position / 3) * 13)
            * scale;

const food =
    this.add.circle(
        startX,
        startY,
        7,
        0xb22222
    );

food.setStrokeStyle(1, 0x000000);
food.setInteractive(
    new Phaser.Geom.Circle(0, 0, 28),
    Phaser.Geom.Circle.Contains,
    { useHandCursor: true }
);
        food.setDepth(10);

        food.startX = startX;
        food.startY = startY;
        food.counted = false;

        this.input.setDraggable(food);

        food.on('dragstart', () => {
            food.setDepth(20);
        });

        food.on('drag', (pointer, dragX, dragY) => {

            food.x = dragX;
            food.y = dragY;

        });

        food.on('dragend', () => {

            const blanketBounds =
                this.blanket.getBounds();

            if (
                Phaser.Geom.Rectangle.Contains(
                    blanketBounds,
                    food.x,
                    food.y
                )
            )
            {
                if (!food.counted)
                {
                    food.counted = true;

                    this.blanketFoodCount += 1;

                    const pilePosition =
                        this.blanketFoodCount - 1;

                    const blanketPosition =
                        getBlanketFoodPosition(
                            pilePosition
                        );

                    food.x =
                        this.blanket.x +
                        blanketPosition[0];

                    food.y =
                        this.blanket.y +
                        blanketPosition[1];

                    this.blanketCounterText
                        .setText(
                            `Pieces counted: ${this.blanketFoodCount}`
                        );

                    if (
                        this.blanketFoodCount === this.totalFoodToCount &&
                        !this.distributionNextShown
                    )
                    {
                        this.distributionNextShown = true;

                        this.time.delayedCall(100, () => {

                            this.createNextButton(
                                640,
                                675,
                                'Next',
                                () => {
                                    this.showTotalFoodEstimateQuestion();
                                }
                            );

                        });
                    }
                }

                food.setDepth(20);
            }
            else
            {
                if (!food.counted)
                {
                    food.x = food.startX;
                    food.y = food.startY;
                }

                food.setDepth(10);
            }

        });

        this.addQuestionObject(food);
    }
}

showTotalFoodEstimateQuestion ()
{
    this.clearQuestionScreen();

    this.addQuestionObject(
        this.add.rectangle(
            640,
            360,
            1120,
            520,
            0xffffff
        )
        .setStrokeStyle(
            4,
            0x000000
        )
    );

    this.addQuestionObject(
        this.add.text(
            640,
            220,
            'How many total pieces of food do you estimate the group collected today?',
            {
                fontSize: '30px',
                color: '#000000',
                align: 'center',
                wordWrap:
                {
                    width: 900
                },
                lineSpacing: 8
            }
        )
        .setOrigin(0.5)
    );

    let answers =
    [
        'More than 15 pieces of food',
        'Exactly 15 pieces of food',
        'Less than 15 pieces of food'
    ];

    if (Phaser.Math.Between(0, 1) === 1)
    {
        answers =
            answers.reverse();
    }

    this.createAnswerButton(
        640,
        360,
        answers[0],
        'totalFoodEstimate'
    );

    this.createAnswerButton(
        640,
        460,
        answers[1],
        'totalFoodEstimate'
    );

    this.createAnswerButton(
        640,
        560,
        answers[2],
        'totalFoodEstimate'
    );
}

 showEqualDivisionTask ()
{
    this.clearQuestionScreen();

    const fixedFood = this.getFixedFoodCounts();

    const totalFood = fixedFood.total;

    this.equalDivisionCounts = {
        'Person A': 0,
        'Person B': 0,
        'Person C': 0
    };

    this.equalDivisionAssignedCount = 0;
    this.equalDivisionNextShown = false;

    this.addQuestionObject(this.add.text(
        145,
        35,
        'Think about what will happen if the group divides the food equally. Drag and drop the pieces of food from the blanket to each person.',
        {
            fontSize: '25px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 990 }
        }
    ));

    this.equalDivisionBlanket = this.add.rectangle(
        640,
        195,
        500,
        130,
        0xd8ecff
    );

    this.equalDivisionBlanket.setStrokeStyle(4, 0x335577);
    this.equalDivisionBlanket.setDepth(1);

    this.addQuestionObject(this.equalDivisionBlanket);

    const blanketLabel = this.add.text(
        640,
        195,
        'Blanket',
        {
            fontSize: '24px',
            color: '#000000'
        }
    ).setOrigin(0.5);

    blanketLabel.setDepth(2);

    this.addQuestionObject(blanketLabel);

    const baselineY = 430;

    this.equalDivisionBaselineY = baselineY;

    this.addQuestionObject(
        this.createStaticHumanAvatar(
            260,
            baselineY,
            'Person A',
            1.05,
            0xcc3333,
            0
        )
    );

    this.addQuestionObject(
        this.createStaticHumanAvatar(
            640,
            baselineY,
            'Person B',
            1.00,
            0x3366cc,
            0
        )
    );

    this.addQuestionObject(
        this.createStaticHumanAvatar(
            1020,
            baselineY,
            'Person C',
            0.90,
            0x339966,
            0
        )
    );

    this.personDropZones = {
        'Person A':
            this.add.zone(260, baselineY + 25, 210, 270)
                .setRectangleDropZone(210, 270),

        'Person B':
            this.add.zone(640, baselineY + 25, 210, 270)
                .setRectangleDropZone(210, 270),

        'Person C':
            this.add.zone(1020, baselineY + 25, 210, 270)
                .setRectangleDropZone(210, 270)
    };

    Object.values(this.personDropZones).forEach(zone => {
        this.addQuestionObject(zone);
    });

    this.createEqualDivisionFoodPieces(totalFood);
}

createEqualDivisionFoodPieces (totalFood)
{
    const getBlanketFoodPosition = (index) => {

        const positions = [
            [-170, -25], [-130, -25], [-90, -25],
            [-170, 10], [-130, 10], [-90, 10],

            [90, -25], [130, -25], [170, -25],
            [90, 10], [130, 10], [170, 10],

            [-170, 45], [-130, 45], [-90, 45],
            [90, 45], [130, 45], [170, 45]
        ];

        return positions[index];
    };

    const showEqualDivisionNextButtonIfReady = () => {
        if (
            this.equalDivisionAssignedCount === totalFood &&
            !this.equalDivisionNextShown
        )
        {
            this.equalDivisionNextShown = true;

            this.createNextButton(640, 675, 'Next', () => {

                this.gameData.equalDivisionFinal.personA =
                    this.equalDivisionCounts['Person A'];

                this.gameData.equalDivisionFinal.personB =
                    this.equalDivisionCounts['Person B'];

                this.gameData.equalDivisionFinal.personC =
                    this.equalDivisionCounts['Person C'];

                this.showPerCapitaQuestion();
            });
        }
    };

    for (let i = 0; i < totalFood; i++)
    {
        const blanketPosition = getBlanketFoodPosition(i);

        const startX =
            this.equalDivisionBlanket.x + blanketPosition[0];

        const startY =
            this.equalDivisionBlanket.y + blanketPosition[1];

const food = this.add.circle(
    startX,
    startY,
    7,
    0xb22222
);

food.setStrokeStyle(1, 0x000000);

food.setInteractive(
    new Phaser.Geom.Circle(0, 0, 28),
    Phaser.Geom.Circle.Contains,
    { useHandCursor: true }
);

        food.setDepth(10);

        food.startX = startX;
        food.startY = startY;
        food.assignedPerson = null;

        this.input.setDraggable(food);

        food.on('dragstart', () => {
            food.setDepth(20);
        });

        food.on('drag', (pointer, dragX, dragY) => {
            food.x = dragX;
            food.y = dragY;
        });

        food.on('dragend', () => {

            let droppedOnPerson = null;

            Object.keys(this.personDropZones).forEach(personLabel => {

                const bounds =
                    this.personDropZones[personLabel].getBounds();

                if (
                    Phaser.Geom.Rectangle.Contains(
                        bounds,
                        food.x,
                        food.y
                    )
                )
                {
                    droppedOnPerson = personLabel;
                }
            });

            if (droppedOnPerson)
            {
                if (food.assignedPerson)
                {
                    this.equalDivisionCounts[food.assignedPerson] -= 1;
                }
                else
                {
                    this.equalDivisionAssignedCount += 1;
                }

                food.assignedPerson = droppedOnPerson;

                this.equalDivisionCounts[droppedOnPerson] += 1;

                const pilePosition =
                    this.equalDivisionCounts[droppedOnPerson] - 1;

                const basketPositions = {
                    'Person A': {
                        x: 260 + 39 * 1.05,
                        y: this.equalDivisionBaselineY + 31 * 1.05,
                        scale: 1.05
                    },

                    'Person B': {
                        x: 640 + 39,
                        y: this.equalDivisionBaselineY + 31,
                        scale: 1
                    },

                    'Person C': {
                        x: 1020 + 39 * .90,
                        y: this.equalDivisionBaselineY + 31 * .90,
                        scale: .90
                    }
                };

                const basket = basketPositions[droppedOnPerson];

                food.x =
                    basket.x +
                    ((pilePosition % 3) - 1) * 15 * basket.scale;

                food.y =
                    basket.y -
                    6 * basket.scale +
                    Math.floor(pilePosition / 3) * 13 * basket.scale;

                food.setDepth(20);

                showEqualDivisionNextButtonIfReady();
            }
            else
            {
                if (food.assignedPerson)
                {
                    this.equalDivisionCounts[food.assignedPerson] -= 1;

                    this.equalDivisionAssignedCount -= 1;

                    food.assignedPerson = null;
                }

                food.x = food.startX;
                food.y = food.startY;

                food.setDepth(10);
            }
        });

        this.addQuestionObject(food);
    }
}
    showPerCapitaQuestion ()
    {
        this.clearQuestionScreen();

        this.addQuestionObject(this.add.rectangle(640, 360, 900, 450, 0xffffff))
            .setStrokeStyle(4, 0x000000);

        this.addQuestionObject(this.add.text(230, 170,
            'If the three members of the group equally divide between them the total pieces of food they collected today, how many pieces will each person get?',
            {
                fontSize: '28px',
                color: '#000000',
                align: 'center',
                wordWrap: { width: 820 }
            }
        ));

        this.createAnswerButton(640, 365, 'More than 5 pieces of food each', 'perCapitaEstimate');
        this.createAnswerButton(640, 445, 'Exactly 5 pieces of food each', 'perCapitaEstimate');
        this.createAnswerButton(640, 525, 'Less than 5 pieces of food each', 'perCapitaEstimate');
    }
showGroupDistributionPreferenceQuestion ()
{
    this.clearQuestionScreen();

    const fixedFood = this.getFixedFoodCounts();

    const personADisplayFood = fixedFood.personA;
    const personBDisplayFood = fixedFood.personB;
    const personCDisplayFood = fixedFood.personC;

    this.addQuestionObject(
        this.createStaticHumanAvatar(
            260,
            115,
            'Person A',
            0.78,
            0xcc3333,
            personADisplayFood
        )
    );

    this.addQuestionObject(
        this.createStaticHumanAvatar(
            640,
            115,
            'Person B',
            0.72,
            0x3366cc,
            personBDisplayFood
        )
    );

    this.addQuestionObject(
        this.createStaticHumanAvatar(
            980,
            115,
            'Person C',
            0.66,
            0x339966,
            personCDisplayFood
        )
    );

    this.addQuestionObject(
        this.add.rectangle(640, 440, 1180, 390, 0xffffff)
            .setStrokeStyle(4, 0x000000)
    );

    this.addQuestionObject(
        this.add.text(
            640,
            320,
            'In this scenario, should the group divide the food equally among all members, or should the group allow each member to keep the food they collected?',
            {
                fontSize: '27px',
                color: '#000000',
                align: 'center',
                wordWrap: { width: 980 },
                lineSpacing: 6
            }
        ).setOrigin(0.5)
    );

    const answers = Phaser.Utils.Array.Shuffle([
        'The group should divide the food equally among all members.',
        'The group should allow each member to keep the food they collected.'
    ]);

    this.createAnswerButton(
        640,
        470,
        answers[0],
        'groupDistributionPreference'
    );

    this.createAnswerButton(
        640,
        575,
        answers[1],
        'groupDistributionPreference'
    );
}
    createStaticHumanAvatar (x, y, label, scale, shirtColor, foodAmount = 0, showBasket = true)
    {
        const person = this.add.container(x, y);

        const skinColor = 0xd9a06f;
        const hairColor = 0x6b3f1d;
        const pantsColor = 0x333333;

        person.foodCount = 0;

        person.add(this.add.rectangle(0, -18 * scale, 10 * scale, 14 * scale, skinColor));
        person.add(this.add.circle(0, -43 * scale, 24 * scale, skinColor));

        person.add(this.add.ellipse(0, -64 * scale, 46 * scale, 18 * scale, hairColor));
        person.add(this.add.ellipse(-17 * scale, -55 * scale, 12 * scale, 18 * scale, hairColor));
        person.add(this.add.ellipse(17 * scale, -55 * scale, 12 * scale, 18 * scale, hairColor));

        person.add(this.add.circle(-8 * scale, -43 * scale, 2.7 * scale, 0x000000));
        person.add(this.add.circle(8 * scale, -43 * scale, 2.7 * scale, 0x000000));

        person.add(this.add.rectangle(0, -35 * scale, 3 * scale, 9 * scale, 0x9b5c2e));
        person.add(this.add.rectangle(0, -27 * scale, 12 * scale, 2 * scale, 0x000000));

        person.add(this.add.rectangle(0, 8 * scale, 46 * scale, 64 * scale, shirtColor));

        person.add(this.add.rectangle(-32 * scale, 10 * scale, 10 * scale, 52 * scale, skinColor));
        person.add(this.add.rectangle(32 * scale, 10 * scale, 10 * scale, 52 * scale, skinColor));

        if (showBasket)
        {
            person.add(this.createBasket(39 * scale, 31 * scale, scale));

            for (let i = 0; i < foodAmount; i++)
            {
                person.foodCount += 1;

                const position = person.foodCount - 1;

                const appleX = (39 + ((position % 3) - 1) * 15) * scale;
                const appleY = (25 + Math.floor(position / 3) * 13) * scale;

                person.add(this.add.circle(appleX, appleY, 5.5 * scale, 0xb22222));
            }
        }

        person.add(this.add.rectangle(-12 * scale, 71 * scale, 14 * scale, 48 * scale, pantsColor));
        person.add(this.add.rectangle(12 * scale, 71 * scale, 14 * scale, 48 * scale, pantsColor));

        person.add(this.add.text(0, 135 * scale, label, {
            fontSize: '26px',
            color: '#000000'
        }).setOrigin(0.5));

        return person;
    }

    showPartialRedistributionTask ()
{
    this.clearQuestionScreen();

    const fixedFood = this.getFixedFoodCounts();

    this.partialRedistributionCounts = {
        'Person A': fixedFood.personA,
        'Person B': fixedFood.personB,
        'Person C': fixedFood.personC
    };

    this.partialRedistributionNextShown = false;

    this.addQuestionObject(this.add.text(
        140,
        30,
        'Now distribute the food in whatever way you think will maximize the number of people who survive.',
        {
            fontSize: '25px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 1000 }
        }
    ));

    const baselineY = 390;
    this.partialRedistributionBaselineY = baselineY;

    this.addQuestionObject(this.createStaticHumanAvatar(260, baselineY, 'Person A', 1.05, 0xcc3333, 0));
    this.addQuestionObject(this.createStaticHumanAvatar(640, baselineY, 'Person B', 1.00, 0x3366cc, 0));
    this.addQuestionObject(this.createStaticHumanAvatar(1020, baselineY, 'Person C', 0.90, 0x339966, 0));

    this.personDropZones = {
        'Person A': this.add.zone(260, baselineY + 25, 210, 270).setRectangleDropZone(210, 270),
        'Person B': this.add.zone(640, baselineY + 25, 210, 270).setRectangleDropZone(210, 270),
        'Person C': this.add.zone(1020, baselineY + 25, 210, 270).setRectangleDropZone(210, 270)
    };

    Object.values(this.personDropZones).forEach(zone => {
        this.addQuestionObject(zone);
    });

    this.createPartialRedistributionFoodPieces();
}

createPartialRedistributionFoodPieces ()
{
    const fixedFood = this.getFixedFoodCounts();

    const people = [
        { label: 'Person A', amount: fixedFood.personA },
        { label: 'Person B', amount: fixedFood.personB },
        { label: 'Person C', amount: fixedFood.personC }
    ];

    const basketPositions = {
        'Person A': {
            x: 260 + 39 * 1.05,
            y: this.partialRedistributionBaselineY + 31 * 1.05,
            scale: 1.05
        },

        'Person B': {
            x: 640 + 39,
            y: this.partialRedistributionBaselineY + 31,
            scale: 1
        },

        'Person C': {
            x: 1020 + 39 * 0.90,
            y: this.partialRedistributionBaselineY + 31 * 0.90,
            scale: 0.90
        }
    };

    const placeFood = (food, personLabel) => {
        const basket = basketPositions[personLabel];
        const pilePosition = food.positionInPile;

        food.x =
            basket.x +
            ((pilePosition % 3) - 1) * 15 * basket.scale;

        food.y =
            basket.y -
            6 * basket.scale +
            Math.floor(pilePosition / 3) * 13 * basket.scale;
    };

    const refreshFoodPositions = () => {
        const pileCounts = {
            'Person A': 0,
            'Person B': 0,
            'Person C': 0
        };

        this.partialRedistributionFoods.forEach(food => {
            food.positionInPile = pileCounts[food.assignedPerson];
            pileCounts[food.assignedPerson] += 1;
            placeFood(food, food.assignedPerson);
        });
    };

    const showNext = () => {
        if (!this.partialRedistributionNextShown)
        {
            this.partialRedistributionNextShown = true;

            this.createNextButton(640, 675, 'Next', () => {
                this.gameData.partialRedistributionFinal.personA =
                    this.partialRedistributionCounts['Person A'];

                this.gameData.partialRedistributionFinal.personB =
                    this.partialRedistributionCounts['Person B'];

                this.gameData.partialRedistributionFinal.personC =
                    this.partialRedistributionCounts['Person C'];

                this.gameData.partialRedistributionSurvivors =
                    Object.values(this.partialRedistributionCounts)
                        .filter(count => count >= 5).length;

                this.showPartialRedistributionPreferenceQuestion();
            });
        }
    };

    this.partialRedistributionFoods = [];

    people.forEach(person => {
        for (let i = 0; i < person.amount; i++)
        {
const food = this.add.circle(0, 0, 7, 0xb22222);

food.setStrokeStyle(1, 0x000000);
food.setInteractive(
    new Phaser.Geom.Circle(0, 0, 28),
    Phaser.Geom.Circle.Contains,
    { useHandCursor: true }
);
            food.setDepth(10);

            food.assignedPerson = person.label;
            food.positionInPile = i;

            this.partialRedistributionFoods.push(food);

            this.input.setDraggable(food);

            food.on('dragstart', () => {
                food.setDepth(20);
            });

            food.on('drag', (pointer, dragX, dragY) => {
                food.x = dragX;
                food.y = dragY;
            });

            food.on('dragend', () => {
                let droppedOnPerson = null;

                Object.keys(this.personDropZones).forEach(personLabel => {
                    const bounds = this.personDropZones[personLabel].getBounds();

                    if (Phaser.Geom.Rectangle.Contains(bounds, food.x, food.y))
                    {
                        droppedOnPerson = personLabel;
                    }
                });

                if (droppedOnPerson)
                {
                    this.partialRedistributionCounts[food.assignedPerson] -= 1;

                    food.assignedPerson = droppedOnPerson;

                    this.partialRedistributionCounts[droppedOnPerson] += 1;

                    refreshFoodPositions();

                    food.setDepth(20);

                    showNext();
                }
                else
                {
                    refreshFoodPositions();
                    food.setDepth(10);
                }
            });

            this.addQuestionObject(food);
        }
    });

    refreshFoodPositions();
    showNext();
}

showPartialRedistributionPreferenceQuestion ()
{
    this.clearQuestionScreen();

    const fixedFood = this.getFixedFoodCounts();

    this.addQuestionObject(
        this.createStaticHumanAvatar(
            260,
            125,
            'Person A',
            0.78,
            0xcc3333,
            fixedFood.personA
        )
    );

    this.addQuestionObject(
        this.createStaticHumanAvatar(
            640,
            125,
            'Person B',
            0.72,
            0x3366cc,
            fixedFood.personB
        )
    );

    this.addQuestionObject(
        this.createStaticHumanAvatar(
            980,
            125,
            'Person C',
            0.66,
            0x339966,
            fixedFood.personC
        )
    );

    this.addQuestionObject(
        this.add.rectangle(640, 460, 1080, 340, 0xffffff)
            .setStrokeStyle(4, 0x000000)
    );

    this.addQuestionObject(
        this.add.text(
            640,
            295,
            'In this scenario, should anyone with more than 5 pieces of food transfer their extra food only as needed to make sure other members of the group have enough food to survive, or should each member of the group keep the food they collected?',
            {
                fontSize: '25px',
                color: '#000000',
                align: 'center',
                wordWrap: { width: 980 },
                lineSpacing: 8
            }
        ).setOrigin(0.5, 0)
    );

    const answers = Phaser.Utils.Array.Shuffle([
        'People with more than 5 pieces of food should transfer their extra food only as needed to make sure other members of the group have enough food to survive.',
        'Each member of the group should keep the food they collected.'
    ]);

    this.createAnswerButton(
        640,
        480,
        answers[0],
        'partialRedistributionPreference'
    );

    this.createAnswerButton(
        640,
        570,
        answers[1],
        'partialRedistributionPreference'
    );
}
showPersonalRedistributionQuestion ()
{
    this.clearQuestionScreen();

    this.gameData.personalRedistributionSelected = {
        noRedistribution: false,
        equalRedistribution: false,
        partialRedistribution: false
    };

    this.personalRedistributionNextShown = false;

    this.addQuestionObject(this.add.rectangle(640, 360, 1120, 520, 0xffffff))
        .setStrokeStyle(4, 0x000000);

    this.addQuestionObject(this.add.text(
        640,
        150,
        'Which of the following approaches do you believe are appropriate in this scenario? Select all that apply.',
        {
            fontSize: '27px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 980 },
            lineSpacing: 6
        }
    ).setOrigin(0.5));

   const options = Phaser.Utils.Array.Shuffle([
    {
        label: 'Each member of the group should keep the food they collected.',
        key: 'noRedistribution'
    },
    {
        label: 'The group should divide the food equally among all members.',
        key: 'equalRedistribution'
    },
    {
        label: 'Anyone with more than 5 pieces of food should transfer their extra food only to another member of the group who would otherwise not have enough food to survive.',
        key: 'partialRedistribution'
    }
]);

options.forEach((option, index) => {
    this.createPersonalRedistributionCheckboxButton(
        640,
        290 + (index * 105),
        option.label,
        option.key
    );
});
}

createPersonalRedistributionCheckboxButton (centerX, centerY, label, key)
{
    const box = this.add.rectangle(centerX - 420, centerY, 34, 34, 0xffffff);
    box.setStrokeStyle(3, 0x000000);
    box.setInteractive({ useHandCursor: true });

    const check = this.add.text(centerX - 420, centerY, '✓', {
        fontSize: '30px',
        color: '#000000'
    }).setOrigin(0.5);

    check.setVisible(false);

    const text = this.add.text(centerX - 375, centerY, label, {
        fontSize: '23px',
        color: '#000000',
        wordWrap: { width: 780 }
    }).setOrigin(0, 0.5);

    text.setInteractive({ useHandCursor: true });

    const toggle = () => {

    this.gameData.personalRedistributionSelected[key] =
        !this.gameData.personalRedistributionSelected[key];

    check.setVisible(
        this.gameData.personalRedistributionSelected[key]
    );

    const anySelected =
        this.gameData.personalRedistributionSelected.noRedistribution ||
        this.gameData.personalRedistributionSelected.equalRedistribution ||
        this.gameData.personalRedistributionSelected.partialRedistribution;

    if (anySelected)
    {
        if (!this.personalRedistributionNextShown)
        {
            this.personalRedistributionNextShown = true;

            this.createNextButton(
                640,
                675,
                'Next',
                () => this.showFinalGameScreen()
            );
        }
    }
    else
    {
        if (this.currentNextButton)
        {
            this.currentNextButton.destroy();
            this.currentNextButton = null;
        }

        if (this.currentNextText)
        {
            this.currentNextText.destroy();
            this.currentNextText = null;
        }

        this.personalRedistributionNextShown = false;
    }
};

    box.on('pointerdown', toggle);
    text.on('pointerdown', toggle);

    this.addQuestionObject(box);
    this.addQuestionObject(check);
    this.addQuestionObject(text);
}

showSurvivalRedistributionQuestion ()
{
    this.clearQuestionScreen();

    this.gameData.survivalRedistributionSelected = {
        noRedistribution: false,
        equalRedistribution: false,
        partialRedistribution: false
    };

    // Keep the old object synchronized for compatibility with existing sheets/scripts.
    this.gameData.redistributionRulesSelected = this.gameData.survivalRedistributionSelected;

    this.survivalRedistributionNextShown = false;

    this.addQuestionObject(this.add.rectangle(640, 360, 1120, 520, 0xffffff))
        .setStrokeStyle(4, 0x000000);

    this.addQuestionObject(this.add.text(
        640,
        160,
        'Which of the following approaches would help make sure the greatest number of people survive? Select all that apply.',
        {
            fontSize: '27px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 980 },
            lineSpacing: 6
        }
    ).setOrigin(0.5));

   const options = Phaser.Utils.Array.Shuffle([
    {
        label: 'Each member of the group should keep the food they collected.',
        key: 'noRedistribution'
    },
    {
        label: 'The group should divide the food equally among all members.',
        key: 'equalRedistribution'
    },
    {
        label: 'Anyone with more than 5 pieces of food should transfer their extra food only to another member of the group who would otherwise not have enough food to survive.',
        key: 'partialRedistribution'
    }
]);

options.forEach((option, index) => {
    this.createCheckboxButton(
        640,
        300 + (index * 100),
        option.label,
        option.key
    );
});
}

createCheckboxButton (centerX, centerY, label, key)
{
    const box = this.add.rectangle(centerX - 420, centerY, 34, 34, 0xffffff);
    box.setStrokeStyle(3, 0x000000);
    box.setInteractive({ useHandCursor: true });

    const check = this.add.text(centerX - 420, centerY, '✓', {
        fontSize: '30px',
        color: '#000000'
    }).setOrigin(0.5);

    check.setVisible(false);

    const text = this.add.text(centerX - 375, centerY, label, {
        fontSize: '23px',
        color: '#000000',
        wordWrap: { width: 780 }
    }).setOrigin(0, 0.5);

    text.setInteractive({ useHandCursor: true });

    const toggle = () => {

    this.gameData.survivalRedistributionSelected[key] =
        !this.gameData.survivalRedistributionSelected[key];

    // Keep old variable synchronized for compatibility.
    this.gameData.redistributionRulesSelected = this.gameData.survivalRedistributionSelected;

    check.setVisible(
        this.gameData.survivalRedistributionSelected[key]
    );

    const anySelected =
        this.gameData.survivalRedistributionSelected.noRedistribution ||
        this.gameData.survivalRedistributionSelected.equalRedistribution ||
        this.gameData.survivalRedistributionSelected.partialRedistribution;

    if (anySelected)
    {
        if (!this.survivalRedistributionNextShown)
        {
            this.survivalRedistributionNextShown = true;

            this.createNextButton(
                640,
                675,
                'Next',
                () => this.showPersonalRedistributionQuestion()
            );
        }
    }
    else
    {
        if (this.currentNextButton)
        {
            this.currentNextButton.destroy();
            this.currentNextButton = null;
        }

        if (this.currentNextText)
        {
            this.currentNextText.destroy();
            this.currentNextText = null;
        }

        this.survivalRedistributionNextShown = false;
    }
};

    box.on('pointerdown', toggle);
    text.on('pointerdown', toggle);

    this.addQuestionObject(box);
    this.addQuestionObject(check);
    this.addQuestionObject(text);
}

showDistributivePrincipleQuestion ()
{
    this.clearQuestionScreen();

    this.addQuestionObject(this.add.rectangle(640, 360, 1120, 500, 0xffffff))
        .setStrokeStyle(4, 0x000000);

    this.addQuestionObject(this.add.text(
        640,
        230,
        'When deciding how to distribute food, which principle should be the highest priority?',
        {
            fontSize: '29px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 980 },
            lineSpacing: 6
        }
    ).setOrigin(0.5));

    const answers = Phaser.Utils.Array.Shuffle([
        'Making sure the people who collect the most food have enough food to survive.',
        'Making sure the people who would otherwise not have enough food to survive receive enough food.'
    ]);

    this.createAnswerButton(640, 410, answers[0], 'distributivePrinciplePriority');
    this.createAnswerButton(640, 535, answers[1], 'distributivePrinciplePriority');
}

showSocialContractQuestion ()
{
    this.clearQuestionScreen();

    this.addQuestionObject(this.add.rectangle(640, 360, 1120, 500, 0xffffff))
        .setStrokeStyle(4, 0x000000);

    this.addQuestionObject(this.add.text(
        640,
        235,
        'In this scenario, should the group form a social contract that guarantees every member has enough food to survive, or should the group not form such a social contract?',
        {
            fontSize: '27px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 980 },
            lineSpacing: 6
        }
    ).setOrigin(0.5));

    const answers = Phaser.Utils.Array.Shuffle([
        'The group should form a social contract that guarantees every member has enough food to survive.',
        'The group should not form a social contract that guarantees every member has enough food to survive.'
    ]);

    this.createAnswerButton(640, 410, answers[0], 'socialContractGuarantee');
    this.createAnswerButton(640, 535, answers[1], 'socialContractGuarantee');
}

saveGameDataToGoogleSheets()
{
    const googleScriptUrl =
        'https://script.google.com/macros/s/AKfycbxW2aWkJSl2fUuFRNyIO6agXUIiFN5Ab5ThjY51HESJAqxq1d71TLUwraK22Al8n7km/exec';
    this.gameData.saveStatus =
        'attempted';

    console.log(
        'GOOGLE SCRIPT URL:',
        googleScriptUrl
    );

    console.log(
        'DATA BEING SENT:',
        JSON.stringify(this.gameData)
    );

    return fetch(
        googleScriptUrl,
        {
            method: 'POST',
            mode: 'no-cors',
            body:
                JSON.stringify(this.gameData)
        }
    );
}

showFinalGameScreen ()
{
    this.clearQuestionScreen();

    const urlParams =
        new URLSearchParams(
            window.location.search
        );

    const gameId =
        urlParams.get('game_id');

    this.gameData.gameId =
        gameId;

    this.gameData.gameEndTime =
        new Date().toISOString();

    this.gameData.totalDurationMs =
        new Date(this.gameData.gameEndTime) -
        new Date(this.gameData.gameStartTime);

    this.saveGameDataToGoogleSheets()
    .then(() => {
        console.log('Google Sheets save request sent.');
    })
    .catch(error => {
        console.error('Google Sheets save failed:', error);
    });

    console.log(
        'FINAL GAME DATA:',
        this.gameData
    );

    this.addQuestionObject(
        this.add.rectangle(
            640,
            360,
            1000,
            500,
            0xffffff
        )
        .setStrokeStyle(
            4,
            0x000000
        )
    );

    const statusText =
        this.add.text(
            640,
            270,
            'Thank you for completing the survival game.\n\nSaving your responses...',
            {
                fontSize: '30px',
                color: '#000000',
                align: 'center',
                wordWrap:
                {
                    width: 850
                },
                lineSpacing: 10
            }
        )
        .setOrigin(0.5);

    this.addQuestionObject(statusText);

    this.time.delayedCall(
        2000,
        () =>
        {
            statusText.setText(
                'Thank you for completing the survival game.\n\nYour responses have been saved.\n\nPlease close this tab and return to the survey.'
            );

            const closeButton =
                this.add.rectangle(
                    640,
                    540,
                    360,
                    65,
                    0x000000
                );

            closeButton.setInteractive(
                {
                    useHandCursor: true
                }
            );

            closeButton.setDepth(50);

            const closeText =
                this.add.text(
                    640,
                    540,
                    'Close Game Tab',
                    {
                        fontSize: '28px',
                        color: '#ffffff'
                    }
                )
                .setOrigin(0.5);

            closeText.setInteractive(
                {
                    useHandCursor: true
                }
            );

            closeText.setDepth(51);

            this.addQuestionObject(closeButton);
            this.addQuestionObject(closeText);

            const closeGameTab =
                () =>
                {
                    window.close();

                    this.addQuestionObject(
                        this.add.text(
                            640,
                            630,
                            'If this tab does not close automatically, close it manually and return to the survey tab.',
                            {
                                fontSize: '22px',
                                color: '#000000',
                                align: 'center',
                                wordWrap:
                                {
                                    width: 850
                                }
                            }
                        )
                        .setOrigin(0.5)
                    );
                };

            closeButton.on(
                'pointerdown',
                closeGameTab
            );

            closeText.on(
                'pointerdown',
                closeGameTab
            );
        }
    );
}

    createAnswerButton (centerX, centerY, label, variableName)
{
    const paddingX = 24;
    const paddingY = 14;

    const text = this.add.text(
        centerX,
        centerY,
        label,
        {
            fontSize: '22px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 1000 }
        }
    ).setOrigin(0.5);

    const button = this.add.rectangle(
        centerX,
        centerY,
        text.width + paddingX * 2,
        text.height + paddingY * 2,
        0xdddddd
    );

    button.setStrokeStyle(2, 0x000000);
    button.setInteractive(
        new Phaser.Geom.Rectangle(
            -(button.width + 40) / 2,
            -(button.height + 30) / 2,
            button.width + 40,
            button.height + 30
        ),
        Phaser.Geom.Rectangle.Contains
    );

    button.setDepth(1);
    text.setDepth(2);

    this.addQuestionObject(button);
    this.addQuestionObject(text);

    if (!this.answerButtons[variableName])
    {
        this.answerButtons[variableName] = [];
    }

    this.answerButtons[variableName].push(button);

    button.on('pointerdown', () => {

        this.answerButtons[variableName].forEach(choice => {
            choice.setStrokeStyle(2, 0x000000);
        });

        button.setStrokeStyle(5, 0x000000);

        this.gameData[variableName] = label;

        console.log(
            'Saved answer:',
            variableName,
            label
        );

        if (this.currentNextButton)
        {
            this.currentNextButton.destroy();
            this.currentNextButton = null;
        }

        if (this.currentNextText)
        {
            this.currentNextText.destroy();
            this.currentNextText = null;
        }

            const addNext = (callback, y = 675) => {
    this.createNextButton(
        640,
        y,
        'Next',
        callback
    );

            this.currentNextButton.setInteractive({
                useHandCursor: true
            });

            this.currentNextButton.setDepth(1000);

            this.currentNextText = this.add.text(
                640,
                y,
                'Next',
                {
                    fontSize: '28px',
                    color: '#ffffff'
                }
            ).setOrigin(0.5);

            this.currentNextText.setInteractive({
                useHandCursor: true
            });

            this.currentNextText.setDepth(1001);

            this.addQuestionObject(this.currentNextButton);
            this.addQuestionObject(this.currentNextText);

            this.currentNextButton.on('pointerdown', callback);
            this.currentNextText.on('pointerdown', callback);
        };

if (variableName === 'totalFoodEstimate')
{
    addNext(() => {
        if (this.isMobileDevice() && this.isPortraitMode())
        {
            this.showRotatePhoneScreen(this.showEqualDivisionTask);
        }
        else
        {
            this.showEqualDivisionTask();
        }
    });
}

else if (variableName === 'perCapitaEstimate')
{
    addNext(() => this.showGroupDistributionPreferenceQuestion());
}
else if (variableName === 'groupDistributionPreference')
{
    addNext(() => {
        if (this.isMobileDevice() && this.isPortraitMode())
        {
            this.showRotatePhoneScreen(this.showPartialRedistributionTask);
        }
        else
        {
            this.showPartialRedistributionTask();
        }
    });
}
else if (variableName === 'socialContractGuarantee')
{
    addNext(() => this.showSurvivalRedistributionQuestion());
}
else if (variableName === 'partialRedistributionPreference')
{
    addNext(() => this.showDistributivePrincipleQuestion());
}
else if (variableName === 'distributivePrinciplePriority')
{
    addNext(() => this.showSocialContractQuestion());
}
else
{
    this.showEndMessage();
}
    });
}

getButtonStyle ()
{
    return {
        width: 220,
        height: 60,
        fontSize: '28px',
        fillColor: 0x000000,
        textColor: '#ffffff'
    };
}

createNextButton (x, y, label, callback)
{
    const style = this.getButtonStyle();

    const button =
        this.add.rectangle(
            x,
            y,
            style.width,
            style.height,
            style.fillColor
        );

    button.setInteractive({ useHandCursor: true });
    button.setDepth(1000);

    const text =
        this.add.text(
            x,
            y,
            label,
            {
                fontSize: style.fontSize,
                color: style.textColor
            }
        ).setOrigin(0.5);

    text.setInteractive({ useHandCursor: true });
    text.setDepth(1001);

    this.addQuestionObject(button);
    this.addQuestionObject(text);

    button.on('pointerdown', callback);
    text.on('pointerdown', callback);
}

createGameNextButton (x, y, label, callback)
{
    this.createNextButton(x, y, label, callback);
}

showNextTaskButtonAt (x, y, callback)
{
    const buttonY = 685;

    const button = this.add.rectangle(x, buttonY, 160, 55, 0x000000);
    button.setInteractive({ useHandCursor: true });
    button.setDepth(50);

    const text = this.add.text(x, buttonY, 'Next', {
        fontSize: '28px',
        color: '#ffffff'
    }).setOrigin(0.5);

    text.setInteractive({ useHandCursor: true });
    text.setDepth(51);

    this.addQuestionObject(button);
    this.addQuestionObject(text);

    const goNext = () => {
        callback();
    };

    button.on('pointerdown', goNext);
    text.on('pointerdown', goNext);
}

showNextTaskButton (callback)
{
    const buttonY = 685;

    const button = this.add.rectangle(640, buttonY, 160, 55, 0x000000);
    button.setInteractive({ useHandCursor: true });
    button.setDepth(50);

    const text = this.add.text(640, buttonY, 'Next', {
        fontSize: '28px',
        color: '#ffffff'
    }).setOrigin(0.5);

    text.setInteractive({ useHandCursor: true });
    text.setDepth(51);

    this.addQuestionObject(button);
    this.addQuestionObject(text);

    const goNext = () => {
        callback();
    };

    button.on('pointerdown', goNext);
    text.on('pointerdown', goNext);
}

createGameNextButton (x, y, label, callback)
{
    const buttonY = 685;

    const button = this.add.rectangle(x, buttonY, 160, 55, 0x000000);
    button.setInteractive({ useHandCursor: true });

    const text = this.add.text(x, buttonY, label, {
        fontSize: '28px',
        color: '#ffffff'
    }).setOrigin(0.5);

    button.setDepth(1);
    text.setDepth(2);

    this.addGameObject(button);
    this.addGameObject(text);

    button.on('pointerdown', callback);
    text.on('pointerdown', callback);
}

createNextButton (x, y, label, callback)
{
    const buttonY = 675;

    const button = this.add.rectangle(x, buttonY, 160, 55, 0x000000);
    button.setInteractive({ useHandCursor: true });
    button.setDepth(1000);

    const text = this.add.text(x, buttonY, label, {
        fontSize: '26px',
        color: '#ffffff'
    }).setOrigin(0.5);

    text.setInteractive({ useHandCursor: true });
    text.setDepth(1001);

    this.addQuestionObject(button);
    this.addQuestionObject(text);

    const goNext = () => {
        callback();
    };

    button.on('pointerdown', goNext);
    text.on('pointerdown', goNext);
}

    addQuestionObject (obj)
    {
        this.questionObjects.push(obj);
        return obj;
    }

    addGameObject (obj)
    {
        this.gameObjects.push(obj);
        return obj;
    }

    clearQuestionScreen ()
    {
        if (!this.questionObjects) return;

        this.questionObjects.forEach(obj => {
            if (obj && obj.destroy) obj.destroy();
        });

        this.questionObjects = [];
        this.answerButtons = [];
    }

    clearGameObjects ()
    {
        if (!this.gameObjects) return;

        this.gameObjects.forEach(obj => {
            if (obj && obj.destroy) obj.destroy();
        });

        this.gameObjects = [];
    }
}