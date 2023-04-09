const express = require("express");
const router = express.Router();

class SightingsRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    // we will insert routes into here later on
    router.get("/", this.controller.getAll);
    router.get("/comments/:sightingId", this.controller.getComments);
    router.post("/comments/:sightingId", this.controller.addComment);
    router.put("/comments/:commentId/:sightingId", this.controller.editComment);
    router.delete(
      "/comment/:commentId/:sightingId",
      this.controller.deleteComment
    );
    router.get("/:sightingId", this.controller.getOne);
    router.delete("/:sightingId", this.controller.deleteOne);
    router.put("/:sightingId", this.controller.editOne);
    router.post("/", this.controller.insertOne);

    return router;
  }
}

module.exports = SightingsRouter;
