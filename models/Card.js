const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    backlog: [
        {
            title: {
                type: String,
            },
            priority: {
                type: String,
            },
            checklist: [
                {
                    list: {
                        type: String,
                    },
                    check: {
                        type: String,
                    },
                },
            ],
            dueDate: {
                type: Date,
            },
            createdAt: {
                type: Date,
            },
        },
    ],

    todo: [
        {
            title: {
                type: String,
                required: true,
            },
            priority: {
                type: String,
                required: true,
            },
            checklist: [
                {
                    list: {
                        type: String,
                        required: true,
                    },
                    check: {
                        type: String,
                        required: true,
                    },
                },
            ],
            dueDate: {
                type: Date,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],

    progress: [
        {
            title: {
                type: String,
            },
            priority: {
                type: String,
            },
            checklist: [
                {
                    list: {
                        type: String,
                    },
                    check: {
                        type: String,
                    },
                },
            ],
            dueDate: {
                type: Date,
            },
            createdAt: {
                type: Date,
            },
        },
    ],

    done: [
        {
            title: {
                type: String,
            },
            priority: {
                type: String,
            },
            checklist: [
                {
                    list: {
                        type: String,
                    },
                    check: {
                        type: String,
                    },
                },
            ],
            dueDate: {
                type: Date,
            },
            createdAt: {
                type: Date,
            },
        },
    ],

    ref: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
});

module.exports = mongoose.model("Card", cardSchema);
