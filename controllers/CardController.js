const { init } = require("create-react-app/createReactApp");
const Card = require("../models/Card");
const User = require("../models/User");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

exports.createCard = async (req, res) => {
    try {
        const { title, priority, checklist, dueDate } = req.body;

        if (!title || !priority || !checklist) {
            return res.status(401).json({ errorMessage: "Bad request" });
        }

        const existingCardData = await Card.findOne({ ref: req.body.userId });

        if (existingCardData) {
            let newCard = existingCardData;
            newCard.todo.push({ title, priority, checklist, dueDate });

            await Card.updateOne(
                {
                    ref: req.body.userId,
                },
                {
                    $set: newCard,
                }
            );

            return res.json({
                success: true,
                message: "Cards updated successfully",
            });
        }

        await Card.create({
            todo: [{ title, priority, checklist, dueDate }],
            ref: req.body.userId,
        });

        res.json({
            message: "New Card Created successfully",
            title: title,
        });
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        });
    }
};

exports.modify = async (req, res) => {
    try {
        const { target, initial, key } = req.body;

        if (!target || !initial || !key) {
            return res.status(401).json({ errorMessage: "Bad request" });
        }

        const existingCardData = await Card.findOne({ ref: req.body.userId });
        let sampleCard = {};

        if (initial === "todo") {
            const newTodo = existingCardData.todo.filter(
                (item) => item._id.toHexString() !== key
            );
            sampleCard = existingCardData.todo.filter(
                (item) => item._id.toHexString() === key
            );
            existingCardData.todo = newTodo;
            await existingCardData.save();
        }

        if (initial === "backlog") {
            const newBacklog = existingCardData.backlog.filter(
                (item) => item._id.toHexString() !== key
            );
            sampleCard = existingCardData.backlog.filter(
                (item) => item._id.toHexString() === key
            );
            existingCardData.backlog = newBacklog;
            await existingCardData.save();
        }

        if (initial === "progress") {
            const newProgress = existingCardData.progress.filter(
                (item) => item._id.toHexString() !== key
            );
            sampleCard = existingCardData.progress.filter(
                (item) => item._id.toHexString() === key
            );
            existingCardData.progress = newProgress;
            await existingCardData.save();
        }

        if (initial === "done") {
            const newDone = existingCardData.done.filter(
                (item) => item._id.toHexString() !== key
            );
            sampleCard = existingCardData.done.filter(
                (item) => item._id.toHexString() === key
            );
            existingCardData.done = newDone;
            await existingCardData.save();
        }

        if (target === "backlog") {
            existingCardData.backlog.push(sampleCard[0]);
            // console.log(b[0]);
            await existingCardData.save();
        }
        if (target === "todo") {
            existingCardData.todo.push(sampleCard[0]);
            // console.log(b[0]);
            await existingCardData.save();
        }
        if (target === "progress") {
            existingCardData.progress.push(sampleCard[0]);
            // console.log(b[0]);
            await existingCardData.save();
        }
        if (target === "done") {
            existingCardData.done.push(sampleCard[0]);
            // console.log(b[0]);
            await existingCardData.save();
        }

        return res.json({
            success: true,
            message: "Card modified successfully",
        });
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        });
    }
};

exports.updateCard = async (req, res) => {
    try {
        const { title, priority, checklist, dueDate, key, initial } = req.body;

        if (!title || !priority || !checklist) {
            return res.status(401).json({ errorMessage: "Bad request" });
        }

        const existingCardData = await Card.findOne({ ref: req.body.userId });
        let sampleCard = {};

        if (initial === "todo") {
            sampleCard = existingCardData.todo.filter(
                (item) => item._id.toHexString() === key
            );
            if (sampleCard[0]) {
                let index = existingCardData.todo.indexOf(sampleCard[0]);
                sampleCard[0].title = title;
                sampleCard[0].priority = priority;
                sampleCard[0].checklist = checklist;
                sampleCard[0].dueDate = dueDate;
                existingCardData.todo.splice(index, 1, sampleCard[0]);
                await existingCardData.save();
            } else {
                return res.json({
                    message: "Bad request",
                });
            }

            return res.json({
                success: true,
                message: "Card details updated successfully",
            });
        }

        if (initial === "backlog") {
            sampleCard = existingCardData.backlog.filter(
                (item) => item._id.toHexString() === key
            );
            if (sampleCard[0]) {
                let index = existingCardData.backlog.indexOf(sampleCard[0]);
                sampleCard[0].title = title;
                sampleCard[0].priority = priority;
                sampleCard[0].checklist = checklist;
                sampleCard[0].dueDate = dueDate;
                existingCardData.backlog.splice(index, 1, sampleCard[0]);
                await existingCardData.save();
            } else {
                return res.json({
                    message: "Bad request",
                });
            }

            return res.json({
                success: true,
                message: "Card details updated successfully",
            });
        }

        if (initial === "progress") {
            sampleCard = existingCardData.progress.filter(
                (item) => item._id.toHexString() === key
            );
            if (sampleCard[0]) {
                let index = existingCardData.progress.indexOf(sampleCard[0]);
                sampleCard[0].title = title;
                sampleCard[0].priority = priority;
                sampleCard[0].checklist = checklist;
                sampleCard[0].dueDate = dueDate;
                existingCardData.progress.splice(index, 1, sampleCard[0]);
                await existingCardData.save();
            } else {
                return res.json({
                    message: "Bad request",
                });
            }

            return res.json({
                success: true,
                message: "Card details updated successfully",
            });
        }
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        });
    }
};

exports.deleteCard = async (req, res) => {
    try {
        const { initial, key } = req.body;

        if (!key || !initial) {
            return res.status(401).json({ errorMessage: "Bad request" });
        }

        const existingCardData = await Card.findOne({ ref: req.body.userId });
        if (initial === "todo") {
            const newTodo = existingCardData.todo.filter(
                (item) => item._id.toHexString() !== key
            );

            existingCardData.todo = newTodo;
            existingCardData.save();
        }

        if (initial === "backlog") {
            const newBacklog = existingCardData.backlog.filter(
                (item) => item._id.toHexString() !== key
            );

            existingCardData.backlog = newBacklog;
            existingCardData.save();
        }

        if (initial === "progress") {
            const newProgress = existingCardData.progress.filter(
                (item) => item._id.toHexString() !== key
            );

            existingCardData.progress = newProgress;
            existingCardData.save();
        }

        return res.status(200).json({
            success: true,
            message: "Card deleted successfully",
        });
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getAllData = async (req, res) => {
    try {
        const time = req.query.time;
        const existingCardData = await Card.findOne({ ref: req.body.userId });
        const user = await User.findById(req.body.userId);

        const currentDate = new Date();

        let backlogData = {}
        let todoData = {}
        let progressData = {}
        let doneData = {}


        if (time === "week") {

            const startOfPastWeek = new Date(currentDate);
            startOfPastWeek.setDate(currentDate.getDate() - 7);

            backlogData = existingCardData.backlog.filter(
                (item) => {
                    const createdAt = new Date(item.createdAt);
                    return createdAt >= startOfPastWeek && createdAt <= currentDate;
                }
            );
            todoData = existingCardData.todo.filter(
                (item) => {
                    const createdAt = new Date(item.createdAt);
                    return createdAt >= startOfPastWeek && createdAt <= currentDate;
                }
            );
            progressData = existingCardData.progress.filter(
                (item) => {
                    const createdAt = new Date(item.createdAt);
                    return createdAt >= startOfPastWeek && createdAt <= currentDate;
                }
            );
            doneData = existingCardData.done.filter(
                (item) => {
                    const createdAt = new Date(item.createdAt);
                    return createdAt >= startOfPastWeek && createdAt <= currentDate;
                }
            );
        }
        if (time === "month") {

            const startOfPastMonth = new Date(currentDate);
            startOfPastMonth.setMonth(currentDate.getMonth() - 1);

            backlogData = existingCardData.backlog.filter(
                (item) => {
                    const createdAt = new Date(item.createdAt);
                    return createdAt >= startOfPastMonth && createdAt <= currentDate;
                }
            );
            todoData = existingCardData.todo.filter(
                (item) => {
                    const createdAt = new Date(item.createdAt);
                    return createdAt >= startOfPastMonth && createdAt <= currentDate;
                }
            );
            progressData = existingCardData.progress.filter(
                (item) => {
                    const createdAt = new Date(item.createdAt);
                    return createdAt >= startOfPastMonth && createdAt <= currentDate;
                }
            );
            doneData = existingCardData.done.filter(
                (item) => {
                    const createdAt = new Date(item.createdAt);
                    return createdAt >= startOfPastMonth && createdAt <= currentDate;
                }
            );
        }
        if (time === "today") {
            backlogData = existingCardData.backlog.filter(
                (item) => {
                    const createdAt = new Date(item.createdAt);
                    const startOfToday = new Date();
                    startOfToday.setHours(0, 0, 0, 0);
                    const endOfToday = new Date();
                    endOfToday.setHours(23, 59, 59, 999)
                    return createdAt >= startOfToday && createdAt <= endOfToday;
                }
            );
            todoData = existingCardData.todo.filter(
                (item) => {
                    const createdAt = new Date(item.createdAt);
                    const startOfToday = new Date();
                    startOfToday.setHours(0, 0, 0, 0);
                    const endOfToday = new Date();
                    endOfToday.setHours(23, 59, 59, 999)
                    return createdAt >= startOfToday && createdAt <= endOfToday;
                }
            );
            progressData = existingCardData.progress.filter(
                (item) => {
                    const createdAt = new Date(item.createdAt);
                    const startOfToday = new Date();
                    startOfToday.setHours(0, 0, 0, 0);
                    const endOfToday = new Date();
                    endOfToday.setHours(23, 59, 59, 999)
                    return createdAt >= startOfToday && createdAt <= endOfToday;
                }
            );
            doneData = existingCardData.done.filter(
                (item) => {
                    const createdAt = new Date(item.createdAt);
                    const startOfToday = new Date();
                    startOfToday.setHours(0, 0, 0, 0);
                    const endOfToday = new Date();
                    endOfToday.setHours(23, 59, 59, 999)
                    return createdAt >= startOfToday && createdAt <= endOfToday;
                }
            );
        }

        res.status(200).json({
            status: true,
            name: user.name,
            data: existingCardData,
            backlog: backlogData,
            todo: todoData,
            progress: progressData,
            done: doneData
        });
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        });
    }
};

exports.checkUncheck = async (req, res) => {
    try {
        const { initial, key, parentKey } = req.body;
        if (!key || !initial || !parentKey) {
            return res.status(401).json({ errorMessage: "Bad request" });
        }

        const existingCardData = await Card.findOne({ ref: req.body.userId });
        let sampleCard = {};

        if (initial === "backlog") {
            sampleCard = existingCardData.backlog.filter(
                (item) => item._id.toHexString() === parentKey
            );
            // console.log(sampleCard)
            if (sampleCard[0]) {
                let parentIndex = existingCardData.backlog.indexOf(
                    sampleCard[0]
                );
                let newChecklist = sampleCard[0].checklist.filter(
                    (item) => item._id.toHexString() === key
                );

                if (newChecklist[0]) {
                    let index = sampleCard[0].checklist.indexOf(
                        newChecklist[0]
                    );
                    if (newChecklist[0].check === "unchecked") {
                        newChecklist[0].check = "checked";
                        sampleCard[0].checklist.splice(
                            index,
                            1,
                            newChecklist[0]
                        );
                        // console.log(sampleCard[0])
                        existingCardData.backlog.splice(
                            parentIndex,
                            1,
                            sampleCard[0]
                        );
                        await existingCardData.save();
                        return res.status(200).json({
                            success: true,
                            message: "Checklist updated successfully",
                        });
                    } else {
                        newChecklist[0].check = "unchecked";
                        sampleCard[0].checklist.splice(
                            index,
                            1,
                            newChecklist[0]
                        );
                        existingCardData.backlog.splice(
                            parentIndex,
                            1,
                            sampleCard[0]
                        );
                        await existingCardData.save();
                        return res.status(200).json({
                            success: true,
                            message: "Checklist updated successfully",
                        });
                    }
                }
            }
        }
        if (initial === "todo") {
            sampleCard = existingCardData.todo.filter(
                (item) => item._id.toHexString() === parentKey
            );
            // console.log(sampleCard)
            if (sampleCard[0]) {
                let parentIndex = existingCardData.todo.indexOf(sampleCard[0]);
                let newChecklist = sampleCard[0].checklist.filter(
                    (item) => item._id.toHexString() === key
                );

                if (newChecklist[0]) {
                    let index = sampleCard[0].checklist.indexOf(
                        newChecklist[0]
                    );
                    if (newChecklist[0].check === "unchecked") {
                        newChecklist[0].check = "checked";
                        sampleCard[0].checklist.splice(
                            index,
                            1,
                            newChecklist[0]
                        );
                        // console.log(sampleCard[0])
                        existingCardData.todo.splice(
                            parentIndex,
                            1,
                            sampleCard[0]
                        );
                        await existingCardData.save();
                        return res.status(200).json({
                            success: true,
                            message: "Checklist updated successfully",
                        });
                    } else {
                        newChecklist[0].check = "unchecked";
                        sampleCard[0].checklist.splice(
                            index,
                            1,
                            newChecklist[0]
                        );
                        existingCardData.todo.splice(
                            parentIndex,
                            1,
                            sampleCard[0]
                        );
                        await existingCardData.save();
                        return res.status(200).json({
                            success: true,
                            message: "Checklist updated successfully",
                        });
                    }
                }
            }
        }
        if (initial === "progress") {
            sampleCard = existingCardData.progress.filter(
                (item) => item._id.toHexString() === parentKey
            );
            // console.log(sampleCard)
            if (sampleCard[0]) {
                let parentIndex = existingCardData.progress.indexOf(
                    sampleCard[0]
                );
                let newChecklist = sampleCard[0].checklist.filter(
                    (item) => item._id.toHexString() === key
                );

                if (newChecklist[0]) {
                    let index = sampleCard[0].checklist.indexOf(
                        newChecklist[0]
                    );
                    if (newChecklist[0].check === "unchecked") {
                        newChecklist[0].check = "checked";
                        sampleCard[0].checklist.splice(
                            index,
                            1,
                            newChecklist[0]
                        );
                        // console.log(sampleCard[0])
                        existingCardData.progress.splice(
                            parentIndex,
                            1,
                            sampleCard[0]
                        );
                        await existingCardData.save();
                        return res.status(200).json({
                            success: true,
                            message: "Checklist updated successfully",
                        });
                    } else {
                        newChecklist[0].check = "unchecked";
                        sampleCard[0].checklist.splice(
                            index,
                            1,
                            newChecklist[0]
                        );
                        existingCardData.progress.splice(
                            parentIndex,
                            1,
                            sampleCard[0]
                        );
                        await existingCardData.save();
                        return res.status(200).json({
                            success: true,
                            message: "Checklist updated successfully",
                        });
                    }
                }
            }
        }
        if (initial === "done") {
            sampleCard = existingCardData.done.filter(
                (item) => item._id.toHexString() === parentKey
            );
            // console.log(sampleCard)
            if (sampleCard[0]) {
                let parentIndex = existingCardData.done.indexOf(sampleCard[0]);
                let newChecklist = sampleCard[0].checklist.filter(
                    (item) => item._id.toHexString() === key
                );

                if (newChecklist[0]) {
                    let index = sampleCard[0].checklist.indexOf(
                        newChecklist[0]
                    );
                    if (newChecklist[0].check === "unchecked") {
                        newChecklist[0].check = "checked";
                        sampleCard[0].checklist.splice(
                            index,
                            1,
                            newChecklist[0]
                        );
                        // console.log(sampleCard[0])
                        existingCardData.done.splice(
                            parentIndex,
                            1,
                            sampleCard[0]
                        );
                        await existingCardData.save();
                        return res.status(200).json({
                            success: true,
                            message: "Checklist updated successfully",
                        });
                    } else {
                        newChecklist[0].check = "unchecked";
                        sampleCard[0].checklist.splice(
                            index,
                            1,
                            newChecklist[0]
                        );
                        existingCardData.done.splice(
                            parentIndex,
                            1,
                            sampleCard[0]
                        );
                        await existingCardData.save();
                        return res.status(200).json({
                            success: true,
                            message: "Checklist updated successfully",
                        });
                    }
                }
            }
        }
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        });
    }
};

exports.readOnlyDetails = async (req, res) => {
    try {
        const parentKey = req.query.parentKey;
        const initial = req.query.initial;
        const key = req.query.key;

        if (!parentKey || !initial || !key) {
            return res.status(401).json({
                success: false,
                errorMessage: "Yoooo BRoooooo bad request",
            });
        }

        const existingCardData = await Card.findOne({ ref: parentKey });

        if (existingCardData) {
            if (initial === "backlog") {
                const cardData = existingCardData.backlog.filter(
                    (item) => item._id.toHexString() === key
                );

                if (cardData[0]) {
                    return res.status(200).json({
                        success: true,
                        data: cardData[0],
                    });
                }
            }
            if (initial === "todo") {
                const cardData = existingCardData.todo.filter(
                    (item) => item._id.toHexString() === key
                );

                if (cardData[0]) {
                    return res.status(200).json({
                        success: true,
                        data: cardData[0],
                    });
                }
            }
            if (initial === "progress") {
                const cardData = existingCardData.progress.filter(
                    (item) => item._id.toHexString() === key
                );

                if (cardData[0]) {
                    return res.status(200).json({
                        success: true,
                        data: cardData[0],
                    });
                }
            }
            if (initial === "done") {
                const cardData = existingCardData.done.filter(
                    (item) => item._id.toHexString() === key
                );

                if (cardData[0]) {
                    return res.status(200).json({
                        success: true,
                        data: cardData[0],
                    });
                }
            }
        }
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        });
    }
};
