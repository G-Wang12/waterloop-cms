import db from '../../db';
import * as R from 'ramda';

export default (req, res) => {
  db.products.getProductById(req.params.id)
  .then((productInfo) => {
    if (R.isEmpty(productInfo)) {
      res.sendStatus(404);
    } else {
      res.send(productInfo);
    }
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });
}
