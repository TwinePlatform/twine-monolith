const router = require('express').Router();
const cbDetailsNew = require('../database/queries/cb/cb_details_new');

router.post('/', (req, res, next) => {
  cbDetailsNew(
    req.auth.cb_id,
    req.body.org_name,
    req.body.genre,
    req.body.email,
    req.body.uploadedFileCloudinaryUrl
  )
    .then(details => res.send({ details }))
    .catch(next);
});

module.exports = router;
