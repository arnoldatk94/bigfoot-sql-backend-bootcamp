const BaseController = require("./baseController");

class CategoryController extends BaseController {
  constructor(model) {
    super(model);
  }

  getOneX = async (req, res) => {};
  /** Example of a controller that can use ALL inherited functions of base controller */
}

module.exports = CategoryController;
