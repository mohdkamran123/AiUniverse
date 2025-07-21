import Tool from '../model/Tool.js'

// Create tool
export const createTool = async (req, res) => {
  try {
    const tool = await Tool.create(req.body);
    res.status(201).json(tool);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const bulkAddTools = async (req, res) => {
  try {
    const tools = req.body;

    if (!Array.isArray(tools) || tools.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of tools' });
    }

    // Normalize and de-duplicate input tools (case-insensitive & trimmed)
    const normalize = (str) => str.trim().toLowerCase();
    const seen = new Set();
    const uniqueInputTools = tools.filter(tool => {
      const normName = normalize(tool.name);
      if (seen.has(normName)) return false;
      seen.add(normName);
      tool.name = tool.name.trim(); // Clean name, keep original case
      return true;
    });

    // Fetch existing tool names from DB
    const dbTools = await Tool.find().select('name');
    const existingNames = new Set(dbTools.map(tool => normalize(tool.name)));

    // Filter out tools that already exist in DB
    const newTools = uniqueInputTools.filter(tool => !existingNames.has(normalize(tool.name)));

    // Try inserting new tools (skip duplicates using ordered: false)
    let insertedTools = [];
    if (newTools.length > 0) {
      try {
        insertedTools = await Tool.insertMany(newTools, { ordered: false });
      } catch (insertErr) {
        // Silently skip duplicate errors
        if (insertErr.code !== 11000 && !insertErr.writeErrors) {
          throw insertErr;
        }
      }
    }

    res.status(201).json({
      message: 'Bulk tool addition processed',
      added: insertedTools.length,
      skippedDueToDuplicates: tools.length - insertedTools.length
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const deleteAllTools = async (req, res) => {
  try {
    await Tool.deleteMany({});
    res.json({ message: 'All tools deleted from database' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get all tools (basic)
export const getAllTools = async (req, res) => {
  try {
    const { search, category, priceType, isVerified, sort, tags, limit } = req.query;
    const query = {};

    // 🔍 Search logic
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // 🎯 Category filter
    if (category) query.category = category;

    // 💰 Price type filter
    if (priceType) query.priceType = priceType;

    // ✅ Verified filter
    if (isVerified !== undefined) query.isVerified = isVerified === 'true';

    // 🏷️ Tag filter (optional)
    if (tags) query.tags = tags;

    let toolsQuery = Tool.find(query);

    // ↕️ Sorting logic
    if (sort === 'name') toolsQuery = toolsQuery.sort({ name: 1 });
    else if (sort === 'latest') toolsQuery = toolsQuery.sort({ createdAt: -1 });
    else if (sort === 'popular') toolsQuery = toolsQuery.sort({ clicks: -1 });

    // Limit results (e.g. for homepage previews)
    if (limit) toolsQuery = toolsQuery.limit(Number(limit));

    const tools = await toolsQuery;
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get single tool
export const getToolById = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) return res.status(404).json({ message: 'Tool not found' });
    res.json(tool);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update tool
export const updateTool = async (req, res) => {
  try {
    const tool = await Tool.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tool) return res.status(404).json({ message: 'Tool not found' });
    res.json(tool);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete tool
export const deleteTool = async (req, res) => {
  try {
    const tool = await Tool.findByIdAndDelete(req.params.id);
    if (!tool) return res.status(404).json({ message: 'Tool not found' });
    res.json({ message: 'Tool deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getUniqueCategories = async (req, res) => {
  try {
    const categories = await Tool.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// controller/tool.controller.js

// 🟡 Get tools by type
// /controller/tool.controller.js

export const getToolsByTag = async (req, res) => {
  const { type } = req.params;

  let filter = {};

  if (type === 'latest') {
    const tools = await Tool.find().sort({ createdAt: -1 }).limit(20);
    return res.json(tools);
  } else if (type === 'mostclicked') {
    const tools = await Tool.find().sort({ clicks: -1 }).limit(20);
    return res.json(tools);
  } else {
    filter.tags = type; // example: EditorsPick, SuperTool, etc.
  }

  try {
    const tools = await Tool.find(filter).limit(20);
    res.json(tools);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tools by tag' });
  }
};
export const updateToolTags = async (req, res) => {
  try {
    const { tags } = req.body;
    if (!Array.isArray(tags)) {
      return res.status(400).json({ message: 'Tags must be an array' });
    }

    const tool = await Tool.findByIdAndUpdate(
      req.params.id,
      { tags },
      { new: true }
    );

    if (!tool) return res.status(404).json({ message: 'Tool not found' });

    res.json({ message: 'Tool tags updated', tool });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getMostClickedTools = async (req, res) => {
  try {
    const tools = await Tool.find().sort({ clicks: -1 }).limit(20); // Top 20
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const incrementClickCount = async (req, res) => {
  try {
    const tool = await Tool.findByIdAndUpdate(
      req.params.id,
      { $inc: { clicks: 1 } },
      { new: true }
    );
    if (!tool) return res.status(404).json({ message: 'Tool not found' });
    res.json({ message: 'Click counted', tool });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Latest tools
export const getLatestTools = async (req, res) => {
  try {
    const tools = await Tool.find().sort({ createdAt: -1 }).limit(20);
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Most popular (by click count)
export const getPopularTools = async (req, res) => {
  try {
    const tools = await Tool.find().sort({ clicks: -1 }).limit(20);
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Editor's Pick
export const getEditorsPick = async (req, res) => {
  try {
    const tools = await Tool.find({ tags: 'EditorsPick' }).limit(20);
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SuperTools
export const getSuperTools = async (req, res) => {
  try {
    const tools = await Tool.find({ tags: 'SuperTool' }).limit(20);
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
