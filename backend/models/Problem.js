const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String }
});


const problemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    statement: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    difficulty: { type: String, required: true, enum: ['Easy', 'Medium', 'Hard'] },
    examples: { type: [exampleSchema], required: true },
    constraints: { type: String, required: true },
    tags: [{ type: String }],
    hints: [{ type: String }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Problem', problemSchema);