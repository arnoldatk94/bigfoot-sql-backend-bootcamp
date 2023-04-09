const BaseController = require("./baseController");

class SightingsController extends BaseController {
  constructor(model, comment, category, sightingCategory) {
    super(model);
    this.comment = comment;
    this.category = category;
    this.sightingCategory = sightingCategory;
  }

  // Retrieve specific sighting
  getOne = async (req, res) => {
    const { sightingId } = req.params;
    try {
      const sighting = await this.model.findByPk(sightingId, {
        include: this.category,
      });
      return res.json(sighting);
    } catch (err) {
      return res.json(err);
    }
  };

  deleteOne = async (req, res) => {
    const { sightingId } = req.params;
    try {
      console.log(sightingId);
      await this.sightingCategory.destroy({
        where: {
          sightingId: sightingId,
        },
      });
      await this.comment.destroy({
        where: {
          sighting_id: sightingId,
        },
      });
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
    try {
      console.log(sightingId);
      await this.model.destroy({
        where: {
          id: sightingId,
        },
      });
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
    try {
      const output = await this.model.findAll({
        include: this.category,
      });
      return res.json(output);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  editOne = async (req, res) => {
    const sightingId = req.params.sightingId;
    const { date, location, notes, categories } = req.body;
    try {
      await this.sightingCategory.destroy({
        where: {
          sightingId: sightingId,
        },
      });
      await this.model.update(
        {
          date: new Date(date),
          location: location,
          notes: notes,
        },
        {
          where: {
            id: Number(sightingId),
          },
        }
      );
      const updatedSighting = await this.model.findByPk(sightingId);
      const selectedCategories = await this.category.findAll({
        where: {
          id: categories,
        },
      });
      await updatedSighting.setCategories(selectedCategories);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
    try {
      const editedOne = await this.model.findByPk(sightingId, {
        include: this.category,
      });
      return res.json(editedOne);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  // Check with Sam first -- this.model.update doesn't return the row info as an object sequelizes needs to create instance methods to do associations?

  // editOne = async (req, res) => {
  //   const sightingId = req.params.sightingId;
  //   const { date, location, notes, categories } = req.body;
  //   try {
  //     await this.sightingCategory.destroy({
  //       where: {
  //         sightingId: sightingId,
  //       },
  //     });
  //     const updatedSighting = await this.model.update(
  //       {
  //         date: new Date(date),
  //         location: location,
  //         notes: notes,
  //       },
  //       {
  //         where: {
  //           id: Number(sightingId),
  //         },
  //       }
  //     );
  //     const selectedCategories = await this.category.findAll({
  //       where: {
  //         id: categories,
  //       },
  //     });
  //     await updatedSighting.setCategories(selectedCategories);
  //   } catch (err) {
  //     return res.status(400).json({ error: true, msg: err });
  //   }
  //   try {
  //     const editedOne = await this.model.findByPk(sightingId, {
  //       include: this.category,
  //     });
  //     return res.json(editedOne);
  //   } catch (err) {
  //     return res.status(400).json({ error: true, msg: err });
  //   }
  // };

  insertOne = async (req, res) => {
    const { date, location, notes, categories } = req.body;
    try {
      // Create new sighting
      const newSighting = await this.model.create({
        date: new Date(date),
        location: location,
        notes: notes,
      });
      // Retrieve selected categories
      const selectedCategories = await this.category.findAll({
        where: {
          id: categories,
        },
      });
      // Associated new sighting with selected categories
      await newSighting.setCategories(selectedCategories);
      // Respond with new sighting
      // return res.json(newSighting);
    } catch (err) {
      console.log(err);
      return res.json({ error: err });
    }
    try {
      const output = await this.model.findAll({
        include: this.category,
      });
      return res.json(output);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  getComments = async (req, res) => {
    const sightingId = req.params.sightingId;
    try {
      console.log(sightingId);
      const output = await this.comment.findAll({
        where: {
          sighting_id: Number(sightingId),
        },
      });
      return res.json(output);
    } catch (error) {
      console.log(error);
    }
  };

  addComment = async (req, res) => {
    const { sightingId } = req.params;
    const { content } = req.body;
    try {
      await this.comment.create({
        content: content,
        sightingId: Number(sightingId),
      });
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
    try {
      const output = await this.comment.findAll({
        where: {
          sighting_id: sightingId,
        },
      });
      return res.json(output);
    } catch (error) {
      console.log(error);
    }
  };

  editComment = async (req, res) => {
    const { sightingId } = req.params;
    const { commentId } = req.params;
    const { content } = req.body;
    // res.json({ sightingId, commentId });
    try {
      await this.comment.update(
        {
          content: content,
          sightingId: Number(sightingId),
        },
        {
          where: {
            id: Number(commentId),
          },
        }
      );
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
    try {
      const output = await this.comment.findAll({
        where: {
          sighting_id: sightingId,
        },
      });
      return res.json(output);
    } catch (error) {
      console.log(error);
    }
  };

  deleteComment = async (req, res) => {
    const commentId = Number(req.params.commentId);
    const sightingId = Number(req.params.sightingId);

    try {
      await this.comment.destroy({
        where: {
          id: commentId,
        },
      });
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
    try {
      const output = await this.comment.findAll({
        where: {
          sighting_id: sightingId,
        },
      });
      return res.json(output);
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = SightingsController;
