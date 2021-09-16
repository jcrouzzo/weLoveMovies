const router = require("express").Router();
const controller = require("./theaters.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");


router.route('/')
        .get(controller.read)
        .all(methodNotAllowed)


module.exports = router