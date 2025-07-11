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
    inputSection: { type: String },
    outputSection: { type: String },
    tags: [{ type: String }],
    hints: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    editedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true
});

module.exports = mongoose.model('Problem', problemSchema);