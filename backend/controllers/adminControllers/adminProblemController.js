const Problem = require('../../models/Problem');

// Converts a string to a URL-friendly slug
function slugify(name) {
    return name.trim().toLowerCase().replace(/\s+/g, '-');
}

// @desc    Create a new problem
exports.createProblem = async (req, res) => {
    try {
        console.log('=== CREATE PROBLEM DEBUG ===');
        console.log('Request Body:', req.body);
        console.log('User:', req.user);
        console.log('===========================');
        
        const { name, statement, difficulty, tags, hints, examples, inputSection, outputSection } = req.body;
        let baseSlug = slugify(name);
        let slug = baseSlug;

        // Find all problems with similar slugs
        const regex = new RegExp(`^${baseSlug}(-\\d+)?$`, 'i');
        const existingProblems = await Problem.find({ code: regex });

        if (existingProblems.length > 0) {
            // Find the highest suffix number
            let max = 1;
            existingProblems.forEach(p => {
                const match = p.code.match(/-(\\d+)$/);
                if (match) {
                    max = Math.max(max, parseInt(match[1], 10) + 1);
                } else {
                    max = Math.max(max, 2);
                }
            });
            slug = `${baseSlug}-${max}`;
        }

        const newProblem = new Problem({
            name,
            statement,
            code: slug,
            difficulty,
            tags,
            hints,
            examples,
            inputSection,
            outputSection,
            createdBy: req.user.userId,
            editedBy: req.user.userId
        });
        await newProblem.save();
        res.status(201).json(newProblem);
    } catch (err) {
        console.log('=== CREATE PROBLEM ERROR ===');
        console.log('Error:', err.message);
        console.log('Full Error:', err);
        console.log('===========================');
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// @desc    Update a problem by code (admin only)
exports.updateProblem = async (req, res) => {
    try {
        const { code } = req.params;
        const updateData = { ...req.body };
        // Prevent updating name and code
        delete updateData.name;
        delete updateData.code;
        // Removed constraints check (no longer needed)
        updateData.editedBy = req.user.userId;
        const updatedProblem = await Problem.findOneAndUpdate(
            { code },           
            updateData,
            { new: true, runValidators: true }
        );
        if (!updatedProblem) return res.status(404).json({ message: 'Problem not found' });
        res.json(updatedProblem);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }  
};

// @desc    Delete a problem by code (admin only)
exports.deleteProblem = async (req, res) => {
    try {
        const { code } = req.params;
        const deletedProblem = await Problem.findOneAndDelete({ code });
        if (!deletedProblem) return res.status(404).json({ message: 'Problem not found' });
        res.json({ message: 'Problem deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }   
};